/*=====================================================================
   GemiOS CLOUD HYPERVISOR - v49.0 (THE CREATOR UPDATE) - UNABRIDGED
=====================================================================*/
(() => {
  /*-------------------------  Event Bus  ---------------------------*/
  class EventBus {
    constructor() { this.handlers = new Map(); }
    on(ev, fn) { if (!this.handlers.has(ev)) this.handlers.set(ev, []); this.handlers.get(ev).push(fn); }
    off(ev, fn) { const arr = this.handlers.get(ev); if (!arr) return; this.handlers.set(ev, arr.filter(f => f !== fn)); }
    emit(ev, data) { const arr = this.handlers.get(ev); if (!arr) return; arr.forEach(fn => fn(data)); }
  }

  /*--------------------------  VFS (IndexedDB)  ---------------------*/
  class VFS {
    constructor(bus) { this.bus = bus; this.MAX_STORAGE = 10 * 1024 * 1024; this.DB_NAME = 'GemiOS_Fs'; this.STORE = 'nodes'; this.db = null; }
    async _open() { if (this.db) return this.db; return new Promise((res, rej) => { const req = indexedDB.open(this.DB_NAME, 1); req.onupgradeneeded = ev => { const db = ev.target.result; db.createObjectStore(this.STORE, { keyPath: 'path' }); }; req.onsuccess = ev => { this.db = ev.target.result; res(this.db); }; req.onerror = ev => rej(ev.target.error); }); }
    async _store(mode = 'readonly') { const db = await this._open(); return db.transaction(this.STORE, mode).objectStore(this.STORE); }
    async ensureRoot() { const store = await this._store('readwrite'); const rec = await store.get('root'); if (!rec) { await store.add({ path: 'root', data: { "C:": { System: { "boot.log": "GemiOS V49.0 Initialized.", "sys_mail.json": "[]" }, Users: { Admin: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} }, Guest: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} } } } } }); } }
    async getNode(path) { const store = await this._store(); const rec = await store.get(path); return rec?.data ?? null; }
    async saveNode(path, data) { const size = new TextEncoder().encode(JSON.stringify(data)).length; const usage = await this.getUsage(); if (usage.used + size > this.MAX_STORAGE) { this.bus.emit('notify', {title:'Disk Full!',msg:'NVRAM quota exceeded.',success:false}); return false; } const store = await this._store('readwrite'); await store.put({ path, data }); this.bus.emit('vfs:changed'); return true; }
    async getUsage() { const store = await this._store(); const all = await store.getAll(); const used = all.reduce((t, r) => t + new TextEncoder().encode(JSON.stringify(r.data)).length, 0); return { used, max: this.MAX_STORAGE }; }
    async getDir(dirPath, create = false) { const node = await this.getNode('root'); if(!node) return null; let parts = dirPath.split('/').filter(p => p); let curr = node; for(let p of parts) { if(curr[p] === undefined) { if(create) curr[p] = {}; else return null; } curr = curr[p]; } return curr; }
    async read(dirPath, file) { const dir = await this.getDir(dirPath); return dir?.[file] ?? null; }
    async write(dirPath, file, data) { const rootNode = await this.getNode('root'); let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) curr[p] = {}; curr = curr[p]; } curr[file] = data; return await this.saveNode('root', rootNode); }
    async delete(dirPath, file) { const rootNode = await this.getNode('root'); let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) return false; curr = curr[p]; } if(curr[file] !== undefined) { delete curr[file]; return await this.saveNode('root', rootNode); } return false; }
    async format() { const db = await this._open(); db.close(); indexedDB.deleteDatabase(this.DB_NAME); localStorage.clear(); location.reload(); }
  }

  /*-------------------------- Sanitizer ---------------------------*/
  class Sanitizer {
    static sanitizeHTML(raw) { return DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['div','span','button','input','textarea','canvas','img','video','audio','style','b','i','u','br','select','option','label','hr'], ALLOWED_ATTR: ['class','id','style','src','href','type','value','placeholder','data-*','title','min','max','step','disabled','checked','onmousedown','onclick','onkeydown','oninput','ondblclick','onmouseover'], FORBID_ATTR: ['onload','onfocus'] }); }
  }

  /*-------------------------- Theme & Audio ---------------------------*/
  class Theme {
    constructor(bus){ this.bus=bus; }
    async applyFromStorage(){ const accent = localStorage.getItem('GemiOS_Accent')||'#0078d7'; document.documentElement.style.setProperty('--accent',accent); const theme = localStorage.getItem('GemiOS_Theme')||'dark'; document.documentElement.dataset.theme = theme; if(theme === 'light') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); }
    toggleTheme(){ const cur = document.documentElement.dataset.theme==='light'?'dark':'light'; localStorage.setItem('GemiOS_Theme',cur); document.documentElement.dataset.theme=cur; if(cur === 'light') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); this.bus.emit('theme:toggled',cur); }
  }

  class AudioEngine {
    constructor(bus) { this.bus = bus; this.actx = null; this.sounds = { open: (t)=> this._tone(440,880,t), close: (t)=> this._tone(880,440,t), click: (t)=> this._tone(1000,1000,t,0.05,0.05), success: (t)=> this._chord([523.25,659.25,783.99],t), error: (t)=> this._tone(150,150,t,0.1,0.3), buy: (t)=> this._square(600,t), alert: (t)=> this._tone(800,1000,t,0.1,0.4), shutdown: (t)=> this._chord([261.63, 329.63, 392.00, 493.88],t,3) }; }
    _init() { if (!this.actx) this.actx = new (window.AudioContext||window.webkitAudioContext)(); if (this.actx.state === 'suspended') this.actx.resume(); }
    _tone(start,end,t,gStart=0.1,gEnd=0, len=0.3){ this._init(); if(!t) t=this.actx.currentTime; const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='sine'; osc.frequency.setValueAtTime(start,t); osc.frequency.exponentialRampToValueAtTime(end,t+(len*0.6)); gain.gain.setValueAtTime(gStart,t); gain.gain.exponentialRampToValueAtTime(gEnd+0.0001,t+len); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t); osc.stop(t+len); }
    _square(freq,t){ this._init(); if(!t) t=this.actx.currentTime; const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='square'; osc.frequency.setValueAtTime(freq,t); osc.frequency.setValueAtTime(freq*2,t+0.1); gain.gain.setValueAtTime(0.05,t); gain.gain.exponentialRampToValueAtTime(0.0001,t+0.2); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t); osc.stop(t+0.2); }
    _chord(freqs,t, len=3){ this._init(); if(!t) t=this.actx.currentTime; freqs.forEach((f,i)=>{ const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='sine'; osc.frequency.setValueAtTime(f,t+(i*0.1)); gain.gain.setValueAtTime(0,t+(i*0.1)); gain.gain.linearRampToValueAtTime(0.15,t+(i*0.1)+0.5); gain.gain.exponentialRampToValueAtTime(0.0001,t+(i*0.1)+len); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t+(i*0.1)); osc.stop(t+(i*0.1)+len); }); }
    play(name){ if (localStorage.getItem('GemiOS_Driver_Audio')==='false') return; const fn=this.sounds[name]; if (fn) fn();}
  }

  /*-------------------------- Process & Window Managers ---------------------------*/
  class ProcessManager {
    constructor(bus, audio){ this.bus=bus; this.audio=audio; this.nextPid=1000; this.processes=new Map(); this.bus.on('process:kill', pid=>this.kill(pid)); }
    async launch(appId,fileData=null){ 
        const app = window.GemiRegistry ? window.GemiRegistry[appId] : null; 
        if (!app){ this.bus.emit('notify',{title:'Execution Error',msg:`App ${appId} missing.`,success:false}); return; } 
        const pid = ++this.nextPid; this.processes.set(pid,{app,pid,raw:app}); this.audio.play('click'); 
        let sm = document.getElementById('start-menu'); if(sm) sm.classList.remove('open');
        this.bus.emit('wm:create-window',{pid,app,fileData}); 
        if (app.onLaunch) app.onLaunch(pid, fileData); 
    }
    async kill(pid){ if (!this.processes.has(pid)) return; const app = this.processes.get(pid).app; if(app.onKill) app.onKill(pid); this.bus.emit('wm:close-window',pid); setTimeout(()=>{ this.processes.delete(pid); },250); }
  }

  class WindowManager {
    constructor(bus, audio){ this.bus = bus; this.audio = audio; this.zIndex = 100; this.enableAnim = localStorage.getItem('GemiOS_Driver_Anim') !== 'false'; this.bus.on('wm:create-window', cfg => this._createWindow(cfg)); this.bus.on('wm:close-window', pid => this._closeWindow(pid)); }
    _createWindow({pid, app, fileData}) {
      const wid = `win_${pid}`;
      const isSystem = (app.tag === 'sys' || app.tag === 'pro' || app.tag === 'edu' || app.tag === 'fin');
      const rawHTML = typeof app.html === 'function' ? app.html(pid, fileData) : app.htmlString;
      
      // Allow execution for system apps without iframe to maintain event bindings, sanitize the rest
      let innerContent = isSystem ? rawHTML : `<iframe sandbox="allow-scripts allow-same-origin" srcdoc="${Sanitizer.sanitizeHTML(rawHTML).replace(/"/g,'&quot;')}" style="width:100%;height:100%;border:none;"></iframe>`;

      const html = `
        <div class="win ${this.enableAnim ? 'win-animated' : 'win-static'}" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${app.width}px; z-index:${++this.zIndex};" onmousedown="GemiOS.WM.focus('${wid}')">
          <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event,'${wid}')">
            <span>${app.title}</span>
            <div onmousedown="event.stopPropagation()">
              <button class="ctrl-btn min-btn" onclick="GemiOS.WM.minimize('${wid}')">-</button>
              <button class="ctrl-btn snap-btn" onclick="GemiOS.WM.snap('${wid}','left')">&lt;</button>
              <button class="ctrl-btn snap-btn" onclick="GemiOS.WM.snap('${wid}','right')">&gt;</button>
              <button class="ctrl-btn close-btn" onclick="GemiOS.pm.kill(${pid})">×</button>
            </div>
          </div>
          <div class="content" id="content_${pid}">${innerContent}</div>
          <div class="resize-handle"></div>
        </div>`;
      document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);
      this._addTaskbarItem(pid, app.title); this.audio.play('open');
    }
    focus(wid){ const el = document.getElementById(wid); if (el) el.style.zIndex = ++this.zIndex; }
    drag(e,wid){ const win = document.getElementById(wid); if (!win || win.dataset.maximized==='true') return; const offsetX = e.clientX - win.offsetLeft; const offsetY = e.clientY - win.offsetTop; this.focus(wid); let iframes = document.querySelectorAll('iframe'); iframes.forEach(ifr => ifr.style.pointerEvents = 'none'); if(this.enableAnim) win.style.transition = 'none'; const move = ev => { win.style.left = ev.clientX - offsetX + 'px'; win.style.top = Math.max(0, ev.clientY - offsetY) + 'px'; }; const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); if(this.enableAnim) win.style.transition = 'width 0.3s, height 0.3s, top 0.3s, left 0.3s'; iframes.forEach(ifr => ifr.style.pointerEvents = 'auto'); }; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); }
    maximize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.dataset.maximized==='true'){ win.style.top = win.dataset.pT; win.style.left = win.dataset.pL; win.style.width = win.dataset.pW; win.style.height= win.dataset.pH; win.dataset.maximized='false'; win.style.borderRadius='12px'; } else { win.dataset.pT = win.style.top; win.dataset.pL = win.style.left; win.dataset.pW = win.style.width; win.dataset.pH = win.style.height; win.style.top = '0'; win.style.left = '0'; win.style.width = '100vw'; win.style.height = 'calc(100vh - 60px)'; win.dataset.maximized='true'; win.style.borderRadius='0'; } }
    snap(wid, side){ const win = document.getElementById(wid); if (!win) return; if(win.dataset.maximized === "false") { win.dataset.pT = win.style.top; win.dataset.pL = win.style.left; win.dataset.pW = win.style.width; win.dataset.pH = win.style.height; } win.style.top = '0'; win.style.height = 'calc(100vh - 60px)'; win.style.width = '50vw'; win.style.left = side==='left' ? '0' : '50vw'; win.dataset.maximized='true'; win.style.borderRadius='0'; this.focus(wid); }
    minimize(wid){ const win = document.getElementById(wid); if (!win) return; const tb = document.getElementById('tb-item-'+win.id.split('_')[1]); if (win.style.opacity === '0'){ win.style.opacity='1'; win.style.transform='scale(1) translateY(0)'; win.style.pointerEvents='auto'; tb.classList.add('active'); } else { win.style.opacity='0'; win.style.transform='scale(0.9) translateY(20px)'; win.style.pointerEvents='none'; tb.classList.remove('active'); } }
    _addTaskbarItem(pid,title){ const apps = document.getElementById('taskbar-apps'); const itm = document.createElement('div'); itm.id = `tb-item-${pid}`; itm.className = 'tb-item active'; itm.textContent = title.length>12? title.slice(0,12) : title; itm.onclick = () => this.minimize(`win_${pid}`); apps.appendChild(itm); }
    _closeWindow(pid){ const win = document.getElementById(`win_${pid}`); if (win){ win.style.opacity = '0'; win.style.transform = 'scale(0.9)'; setTimeout(() => { win.remove(); const tb = document.getElementById(`tb-item-${pid}`); if (tb) tb.remove(); this.audio.play('close'); }, 200); } }
    showScreensaver(){ let ss = document.getElementById('gemi-screensaver'); if (!ss){ ss = document.createElement('canvas'); ss.id = 'gemi-screensaver'; ss.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:black;z-index:9999998;opacity:0;pointer-events:none;transition:opacity 1s ease'; document.body.appendChild(ss); const ctx = ss.getContext('2d'); const stars = []; for(let i=0;i<200;i++) stars.push({x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, s:Math.random()*2}); setInterval(()=> { if (ss.style.opacity==='1'){ if (ss.width!==window.innerWidth){ ss.width=window.innerWidth; ss.height=window.innerHeight; } ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(0,0,ss.width,ss.height); ctx.fillStyle='white'; stars.forEach(st=>{ ctx.beginPath(); ctx.arc(st.x,st.y,st.s,0,Math.PI*2); ctx.fill(); st.x-=st.s; if(st.x<0){ st.x=ss.width; st.y=Math.random()*ss.height; } }); } },30); } ss.style.opacity='1'; ss.style.pointerEvents='auto'; }
    hideScreensaver(){ const ss = document.getElementById('gemi-screensaver'); if (ss){ ss.style.opacity='0'; ss.style.pointerEvents='none'; } }
  }

  /*-------------------------- Core (Main) ---------------------------*/
  class Core {
    constructor(){
      this.bus   = new EventBus();
      this.VFS   = new VFS(this.bus);
      this.audio = new AudioEngine(this.bus);
      this.theme = new Theme(this.bus);
      this.pm    = new ProcessManager(this.bus, this.audio);
      this.WM    = new WindowManager(this.bus, this.audio);
      this.user  = 'Admin';
      this.edition = localStorage.getItem('GemiOS_Edition') || 'Pro';
      this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet')) || 500;
      this.termStates = {};
      this.driveStates = {};
      this.idleTime = 0;
      
      window.GemiOS = this; // Bind to window so inline HTML works
    }

    async init(){
      await this.VFS.ensureRoot();
      await this.theme.applyFromStorage();
      await this.loadDependencies();
      
      if(this.wallet <= 10 && !localStorage.getItem('GemiOS_Relief_Claimed')) {
          setTimeout(() => { this.wallet += 150; this._saveWallet(); this.notify("GemiGov Relief Fund 🏦", "150 🪙 deposited!"); localStorage.setItem('GemiOS_Relief_Claimed', 'true'); }, 4000);
      }

      this._setupIdleTimer();
      this._buildUI();
      this.renderDesktopIcons();
      this._startOTADaemon();
      this._startEconomyDaemon();
      this.initRealityBridge();
    }

    async loadDependencies() {
        try {
            let r1 = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/registry.js?t=" + Date.now());
            if(r1.ok) { let code1 = await r1.text(); eval(code1); }
            
            let r2 = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/engine.js?t=" + Date.now());
            if(r2.ok) { let code2 = await r2.text(); eval(code2); }

            // Fuse external apps into registry
            let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}');
            let globalNetwork = JSON.parse(localStorage.getItem('GemiOS_GlobalNetwork') || '[]');
            
            if(!window.GemiRegistry) window.GemiRegistry = {};
            for(let cFile in customApps) {
                let cApp = customApps[cFile];
                window.GemiRegistry[cFile] = { price: cApp.price, id: cApp.id, icon: cApp.icon, desc: cApp.desc, title: cApp.title, width: 500, htmlString: cApp.htmlString, isCustom: true };
            }
            globalNetwork.forEach(gApp => {
                let fileName = gApp.title.replace(/\s/g, '') + '_net.app';
                window.GemiRegistry[fileName] = { price: gApp.price, id: gApp.id, icon: gApp.icon, desc: gApp.desc, title: gApp.title, width: 500, htmlString: gApp.htmlString, isNetwork: true };
            });
        } catch(e) { console.warn("Dependency load failed."); }
    }

    _setupIdleTimer(){ const reset = () => { this.idleTime = 0; this.WM.hideScreensaver(); }; document.onmousemove = document.onkeydown = document.onclick = reset; setInterval(()=> { this.idleTime++; if (this.idleTime >= 60) this.WM.showScreensaver(); },1000); }
    _startOTADaemon(){ if (localStorage.getItem('GemiOS_Driver_Net')==='false') return; setInterval(async ()=>{ try { const resp = await fetch('https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/version.json?t=' + Date.now()); if (resp.ok) { const d = await resp.json(); const cur = localStorage.getItem('GemiOS_Cache_Ver') || '49.0.0-CREATOR'; if (d.version !== cur) { this.notify('🚀 Update Detected!', `Version ${d.version} found.`, true); setTimeout(()=>this.pm.launch('sys_update'),2000); } } } catch (_) {} },15000); }
    _startEconomyDaemon(){ setInterval(()=>{ const customStr = localStorage.getItem('GemiOS_CustomApps') || '{}'; const custom = JSON.parse(customStr); const keys = Object.keys(custom); if (keys.length && Math.random()<0.4){ const app = custom[keys[Math.floor(Math.random()*keys.length)]]; const price = Number(app.price)||0; if (price>0){ const profit = Math.floor(price*0.9); this.wallet+=profit; this._saveWallet(); this.notify('App Sale! 💸',`Someone bought ${app.title}. +🪙${profit}`,true); this.audio.play('buy'); } } },20000); }
    _saveWallet(){ localStorage.setItem('GemiOS_Wallet',String(this.wallet)); document.getElementById('os-wallet-display').innerText = `🪙 ${Math.floor(this.wallet)}`; }
    
    notify(title,msg,success=true){ this.bus.emit('notify',{title,msg,success}); }
    toggleTheme(){ this.theme.toggleTheme(); }
    triggerIO() { let io = document.getElementById('io-indicator'); if(io) { io.style.opacity = '1'; setTimeout(() => { io.style.opacity = '0.2'; }, 800); } }
    
    lockSystem(){ this.audio.play('shutdown'); const overlay = document.createElement('div'); overlay.style.cssText='position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:9999999;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;'; overlay.innerHTML='<div class="spinner" style="margin-right:15px;"></div> Shutting down...'; document.body.appendChild(overlay); setTimeout(()=>location.reload(),2500); }

    // --- OS CORE LOGIC IMPLEMENTATIONS ---
    runSearch(q){ const items = document.querySelectorAll('.start-item'); const cats = document.querySelectorAll('.start-cat'); if (!q){ items.forEach(i=>i.style.display='flex'); cats.forEach(c=>c.style.display='block'); return; } const low = q.toLowerCase(); items.forEach(i=> i.style.display = i.textContent.toLowerCase().includes(low) ? 'flex' : 'none'); cats.forEach(c=>c.style.display='none'); }
    
    async handleTerm(e, pid, inEl) {
        if(e.key !== 'Enter') return; let cmd = inEl.value.trim(); inEl.value = ''; let out = document.getElementById(`t-out-${pid}`); let curr = this.termStates[pid];
        out.innerHTML += `<br><span style="color:#0078d7">${curr}></span> ${cmd}`; let args = cmd.split(' '); let base = args[0].toLowerCase();
        let log = (msg) => out.innerHTML += `<br>${msg}`;
        let setPath = (p) => { this.termStates[pid] = p; document.getElementById(`t-path-${pid}`).innerText = p+'>'; };
        
        try {
            if(base === 'help') log('Available cmds: ls, cd, mkdir, clear, gpm install [app.app]');
            else if(base === 'clear') out.innerHTML = '';
            else if(base === 'ls') { let dir = await this.VFS.getDir(curr); if(!dir) log('Directory not found.'); else { let keys = Object.keys(dir); if(!keys.length) log('(empty)'); else keys.forEach(k => log(`${typeof dir[k]==='object'?'[DIR] ':'[FILE] '}${k}`)); } }
            else if(base === 'cd') { let tgt = args[1]; if(!tgt) log('Usage: cd [dir]'); else if(tgt === '..') { let parts = curr.split('/'); if(parts.length>1) parts.pop(); setPath(parts.join('/')||'C:'); } else { let np = curr+'/'+tgt; let dir = await this.VFS.getDir(np); if(dir) setPath(np); else log('Directory not found.'); } }
            else if(base === 'mkdir') { let name = args[1]; if(!name) log('Usage: mkdir [name]'); else log((await this.VFS.mkdir(curr, name)) ? 'Created.' : 'Failed.'); }
            else if(base === 'gpm') { 
                if(args[1] === 'install' && args[2]) { 
                    let appName = args.slice(2).join(' '); if(!appName.endsWith('.app')) appName += '.app'; 
                    let appData = window.GemiRegistry[appName];
                    if(appData) { 
                        let price = appData.price || 0;
                        if(appData.isNetwork) { log('[GPM] Downloading from Global Network...'); let payload = appData.htmlString || ""; if(payload.includes("VFS.format") || payload.includes("localStorage.clear")) { log('<span style="color:red">[GPM ERR] GemiDefender blocked Payload!</span>'); return; } }
                        if(this.wallet >= price) { this.wallet -= price; this._saveWallet(); log(`[GPM] Transaction... -🪙${price}`); if(await this.VFS.write('C:/Users/' + this.user + '/Desktop', appName, appData.id)) { log(`[GPM] SUCCESS: Installed.`); this.renderDesktopIcons(); this.audio.play('buy'); } else log(`[GPM] ERROR: NVRAM Full.`); } else { log(`[GPM] ERROR: Insufficient funds.`); this.audio.play('error'); }
                    } else log(`[GPM] ERROR: Package ${appName} not found.`); 
                } else log('Usage: gpm install [app_name.app]'); 
            }
            else log(`Unknown command: ${base}`);
        } catch(err) { log(`Error: ${err.message}`); }
        out.scrollTop = out.scrollHeight;
    }

    async renderDrive(pid) { 
        let path = this.driveStates[pid]; let elPath = document.getElementById(`d-path-${pid}`); if(elPath) elPath.value = path; 
        let list = document.getElementById(`d-list-${pid}`); let dir = await this.VFS.getDir(path); let html = ''; 
        if(!dir) { if(list) list.innerHTML = "Folder not found."; return; }
        for(let k in dir) { 
            if(typeof dir[k] === 'object') { 
                html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(0,0,0,0.2); border-radius:6px;" onmouseover="this.style.background='rgba(0,120,215,0.4)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'" onclick="GemiOS.navDrive(${pid}, '${k}')"><div style="font-size:30px;">📁</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`; 
            } else { 
                let i = '📄'; if(k.endsWith('.app')) i = '🚀'; else if(k.endsWith('.gbs')) i = '📜'; else if(k.endsWith('.gzip')) i = '🗜️'; else if(k.endsWith('.gemos')) i = '💾'; 
                html += `<div style="text-align:center; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px; position:relative;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'"><div style="font-size:30px; cursor:pointer;" onclick="GemiOS.openFile('${path}', '${k}')">${i}</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis; cursor:pointer;" onclick="GemiOS.openFile('${path}', '${k}')">${k}</div><button onclick="GemiOS.exportFile('${path}', '${k}')" style="position:absolute; top:4px; right:4px; background:var(--accent); border:none; color:white; border-radius:3px; cursor:pointer; font-size:10px; padding:2px 5px;" title="Export File">↓</button></div>`; 
            } 
        } 
        if(html === '') html = '<div style="grid-column: span 4; text-align:center; opacity:0.5; padding:20px;">Folder is empty</div>'; 
        if(list) list.innerHTML = html; 
    }
    
    navDrive(pid, target) { let curr = this.driveStates[pid]; if(target === 'UP') { let parts = curr.split('/'); if(parts.length > 1) parts.pop(); this.driveStates[pid] = parts.join('/') || 'C:'; } else { this.driveStates[pid] = curr + '/' + target; } this.renderDrive(pid); }

    async openFile(path, filename) { 
        let data = await this.VFS.read(path, filename); let ext = filename.split('.').pop().toLowerCase(); 
        if(ext === 'app') { this.pm.launch(data); } 
        else if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) { this.pm.launch('app_view', data); } 
        else if (['mp3', 'wav', 'ogg'].includes(ext)) { this.pm.launch('app_amp', data); } 
        else if (['mp4', 'webm'].includes(ext)) { this.pm.launch('app_video', data); } 
        else if (ext === 'gbs') { try { eval(data); this.notify("GemiScript", "Macro executed."); } catch(e) { this.notify("Error", e.message, false); } } 
        else if (ext === 'gzip') { try { let archive = JSON.parse(data); for(let f in archive) { await this.VFS.write('C:/Users/' + this.user + '/Downloads', f, archive[f]); } this.notify("GemiZip", "Extracted to Downloads."); for(let pid in this.driveStates) { this.renderDrive(pid); } } catch(e) { this.notify("Error", "Corrupted archive.", false); } } 
        else { this.pm.launch('app_note', data); } 
    }

    async exportFile(path, filename) { 
        let data = await this.VFS.read(path, filename); if(!data) return; 
        let blob = data.startsWith('data:') ? await (await fetch(data)).blob() : new Blob([data], {type: 'text/plain'});
        let url = URL.createObjectURL(blob); let a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); this.notify("GemiShare", `${filename} exported.`); 
    }

    async exportNVRAM() { 
        let db = await this.VFS._open(); let trans = db.transaction(this.VFS.STORE, 'readonly'); let all = await trans.objectStore(this.VFS.STORE).getAll(); 
        let dump = {}; all.forEach(r => dump[r.path] = r.data); 
        let blob = new Blob([JSON.stringify(dump)], {type: 'text/plain'}); let url = URL.createObjectURL(blob); let a = document.createElement('a'); a.href = url; a.download = `GemiOS_Backup.gemos`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); this.notify("GemiSync", "Exported Successfully!"); 
    }

    initRealityBridge() { document.body.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); }); document.body.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); let file = e.dataTransfer.files[0]; if (!file) return; let reader = new FileReader(); reader.onload = async (event) => { if(file.name.endsWith('.gemos')) { try { let dump = JSON.parse(event.target.result); for(let p in dump) { await this.VFS.saveNode(p, dump[p]); } this.notify("GemiSync", "Snapshot Imported. Rebooting..."); setTimeout(()=>location.reload(), 1500); } catch(e) { this.notify("GemiSync Error", "Invalid backup.", false); } return; } if(await this.VFS.write('C:/Users/' + this.user + '/Downloads', file.name, event.target.result)) { this.notify("Reality Bridge", `Imported ${file.name}`); for(let pid in this.driveStates) { this.renderDrive(pid); } } }; if(file.name.endsWith('.txt') || file.name.endsWith('.rtf') || file.name.endsWith('.gbs') || file.name.endsWith('.gemos')) { reader.readAsText(file); } else { reader.readAsDataURL(file); } }); }

    async _renderDesktopIcons(){ 
        const deskEl = document.getElementById('desktop-icons'); deskEl.innerHTML = ''; 
        const deskData = await this.VFS.getDir('C:/Users/' + this.user + '/Desktop') || {}; 
        const layoutData = await this.VFS.read('C:/Users/' + this.user + '/Desktop', '.layout') || "{}"; 
        const layout = JSON.parse(layoutData); let html = ''; let i = 0; 
        for(let file in deskData) { 
            if(file.endsWith('.app') || file.endsWith('.gbs') || file.endsWith('.gzip') || file.endsWith('.txt')) { 
                let top = layout[file] ? layout[file].top : (20 + Math.floor(i / 10) * 100) + 'px'; 
                let left = layout[file] ? layout[file].left : (20 + (i % 10) * 90) + 'px'; 
                let safeFile = file.replace(/'/g, "\\'"); 
                if(file.endsWith('.app')) { 
                    let appId = deskData[file]; let app = window.GemiRegistry ? window.GemiRegistry[appId] : null; 
                    if(app) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.pm.launch('${appId}')"><div>${app.icon}</div>${file.replace('.app','')}</div>`; } 
                } 
                else if (file.endsWith('.gbs')) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>📜</div>${file}</div>`; } 
                else if (file.endsWith('.gzip')) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>🗜️</div>${file}</div>`; } 
                else if (file.endsWith('.txt')) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>📝</div>${file}</div>`; } 
                i++; 
            } 
        } 
        deskEl.innerHTML = html; 
    }

    dragIcon(e, id, filename) { let el = document.getElementById(id); let ox = e.clientX - el.offsetLeft; let oy = e.clientY - el.offsetTop; document.onmousemove = (ev) => { el.style.left = (ev.clientX - ox) + 'px'; el.style.top = (ev.clientY - oy) + 'px'; }; document.onmouseup = async () => { document.onmousemove = null; document.onmouseup = null; let layoutData = await this.VFS.read('C:/Users/' + this.user + '/Desktop', '.layout') || "{}"; let layout = JSON.parse(layoutData); layout[filename] = { top: el.style.top, left: el.style.left }; await this.VFS.write('C:/Users/' + this.user + '/Desktop', '.layout', JSON.stringify(layout)); }; }

    // --- CARTRIDGES AND STORE ---
    async importCartridge(b64String) {
        try {
            let decoded = decodeURIComponent(escape(window.atob(b64String)));
            let appData = JSON.parse(decoded);
            if(!appData.title || !appData.htmlString) throw new Error();
            
            // Heuristic Intercept for DOMPurify escapees
            if(!Sanitizer.isSafeCartridge(appData)) {
                this.notify("THREAT BLOCKED", "GemiDefender blocked a Malicious Payload!", false);
                this.audio.play('error'); return; 
            }

            let safeId = 'app_cart_' + Date.now(); let fileName = appData.title.replace(/\s/g, '') + '.app'; appData.id = safeId;
            let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}'); customApps[fileName] = appData; localStorage.setItem('GemiOS_CustomApps', JSON.stringify(customApps));
            
            await this.loadDependencies();
            if(await this.VFS.write('C:/Users/' + this.user + '/Desktop', fileName, safeId)) {
                this._renderDesktopIcons(); this.notify("GemiShare", `${appData.title} redeemed!`, true); this.audio.play('buy');
            } else { this.notify("Install Failed", "NVRAM Storage is full.", false); }
        } catch(e) { this.notify("Redemption Error", "Invalid Cartridge Code.", false); this.audio.play('error'); }
    }

    async uploadToNetwork(pid) {
        if(localStorage.getItem('GemiOS_Driver_Net') === 'false') return this.notify("Network Offline", "TCP/IP adapter not installed.", false);
        let title = document.getElementById(`dev-title-${pid}`).value.trim(); let icon = document.getElementById(`dev-icon-${pid}`).value.trim() || '📦'; let price = parseInt(document.getElementById(`dev-price-${pid}`).value) || 0; let htmlStr = document.getElementById(`dev-html-${pid}`).value.trim();
        if(!title || !htmlStr) return this.notify("Publish Error", "Title and HTML required.", false);
        
        if(htmlStr.includes('GemiOS.pm.kill') || htmlStr.includes('GemiOS.VFS.delete')) {
            if(!localStorage.getItem('GemiOS_Bounty_Claimed')) {
                this.wallet += 500; this._saveWallet(); this.notify("White Hat Bounty! 🏆", "You earned 500 🪙 for contributing security software!", true); this.audio.play('success'); localStorage.setItem('GemiOS_Bounty_Claimed', 'true');
            }
        }

        let safeId = 'app_net_' + Date.now(); let appObj = { id: safeId, title: title, icon: icon, price: price, desc: 'Global Network App', htmlString: htmlStr };
        let net = JSON.parse(localStorage.getItem('GemiOS_GlobalNetwork') || '[]'); net.push(appObj); localStorage.setItem('GemiOS_GlobalNetwork', JSON.stringify(net));
        this.notify("Global Network", `${title} uploaded to GemiStore Server!`, true); this.audio.play('buy'); await this.loadDependencies();
    }

    async publishApp(pid) {
        let title = document.getElementById(`dev-title-${pid}`).value.trim(); let icon = document.getElementById(`dev-icon-${pid}`).value.trim() || '📦'; let price = parseInt(document.getElementById(`dev-price-${pid}`).value) || 0; let htmlStr = document.getElementById(`dev-html-${pid}`).value.trim();
        if(!title || !htmlStr) return this.notify("Publish Error", "Required fields missing.", false);
        
        let safeId = 'app_custom_' + Date.now(); let fileName = title.replace(/\s/g, '') + '.app';
        let appObj = { id: safeId, title: title, icon: icon, price: price, desc: 'Local Custom App.', htmlString: htmlStr };
        let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}'); customApps[fileName] = appObj; localStorage.setItem('GemiOS_CustomApps', JSON.stringify(customApps));
        await this.loadDependencies(); this.notify("GemiDev Studio", `${title} published Locally!`, true); this.audio.play('buy');
    }

    async buyApp(filename, appId, pid, btnId, price, isNetwork = false) { 
        if(this.wallet < price) { this.notify("Transaction Failed", `Insufficient funds. Needs 🪙 ${price}`, false); this.audio.play('error'); return; }
        
        let executeInstall = async () => {
            this.wallet -= price; this._saveWallet();
            if(window.GemiRegistry[filename] && window.GemiRegistry[filename].isCustom) {
                let devCut = Math.floor(price * 0.90); setTimeout(()=> { this.notify("App Sold!", `Someone bought your app! +🪙${devCut}`); this.wallet += devCut; this._saveWallet(); }, 5000);
            }
            if(await this.VFS.write('C:/Users/' + this.user + '/Desktop', filename, appId)) { 
                this.notify("Purchase Successful", `Downloaded ${filename}!`); this._renderDesktopIcons(); 
                let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-sec'; btn.innerText = 'Installed'; btn.disabled = true; } 
                this.audio.play('buy');
            } else { this.notify("Install Failed", "NVRAM Full.", false); }
        };

        if(isNetwork && window.GemiRegistry[filename]) {
            let htmlCode = window.GemiRegistry[filename].htmlString || "";
            this.notify("GemiDefender Active", "Scanning Global Package...");
            setTimeout(() => {
                if(!Sanitizer.isSafeCartridge(htmlCode)) {
                    this.notify("THREAT BLOCKED", "GemiDefender blocked a malicious payload!", false); this.audio.play('error');
                    let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-danger'; btn.innerText = 'BLOCKED BY AV'; btn.disabled = true; }
                } else { this.notify("GemiDefender", "Scan clear. Installing..."); executeInstall(); }
            }, 1500);
        } else { executeInstall(); }
    }

    async renderStore(pid) { 
        if(localStorage.getItem('GemiOS_Driver_Net') === 'false') { document.getElementById(`store-list-${pid}`).innerHTML = "<div style='grid-column:span 2; text-align:center; padding:20px; color:#ff4d4d;'>Network Offline.</div>"; return; }
        let desk = await this.VFS.getDir('C:/Users/' + this.user + '/Desktop') || {}; let h = ''; 
        if(!window.GemiRegistry) { document.getElementById(`store-list-${pid}`).innerHTML = "<div style='grid-column:span 2; text-align:center;'>Registry Offline.</div>"; return; }
        for(let f in window.GemiRegistry) { 
            let a = window.GemiRegistry[f]; if(!a.desc) continue;
            let isInst = desk[f] !== undefined; let bId = `st-btn-${a.id}-${pid}`; 
            let price = a.price || 0; let tagHtml = '';
            if(this.edition === 'Education' && a.tag === 'edu') { price = Math.floor(price * 0.85); tagHtml += '<span style="background:#38ef7d; color:black; padding:2px 5px; border-radius:3px; font-size:9px; margin-left:5px;">15% EDU OFF</span>'; } 
            else if (this.edition === 'Pro' && price > 0) { price = Math.floor(price * 0.95); tagHtml += '<span style="background:var(--accent); color:white; padding:2px 5px; border-radius:3px; font-size:9px; margin-left:5px;">5% PRO OFF</span>'; }
            if(a.isNetwork) tagHtml += '<span style="background:#4db8ff; color:black; padding:2px 5px; border-radius:3px; font-size:9px; margin-left:5px; font-weight:bold;">🌐 GLOBAL</span>'; else if(a.isCustom) tagHtml += '<span style="background:#ff00cc; color:white; padding:2px 5px; border-radius:3px; font-size:9px; margin-left:5px;">LOCAL DEV</span>';
            let btnHtml = isInst ? `<button id="${bId}" class="btn-sec" style="width:100%; margin-top:10px;" disabled>Installed</button>` : `<button id="${bId}" class="btn-primary" style="width:100%; margin-top:10px; background:#ffb400; color:black;" onclick="GemiOS.buyApp('${f}', '${a.id}', ${pid}, '${bId}', ${price}, ${a.isNetwork ? 'true' : 'false'})">${price === 0 ? 'Free' : `Buy (🪙 ${price})`}</button>`; 
            h += `<div class="sys-card" style="display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0;"><div style="display:flex; align-items:center; gap:15px;"><div style="font-size:35px;">${a.icon}</div><div><div style="font-weight:bold; font-size:16px;">${a.title} ${tagHtml}</div><div style="font-size:11px; opacity:0.7;">${a.desc}</div></div></div>${btnHtml}</div>`; 
        } 
        document.getElementById(`store-list-${pid}`).innerHTML = h; 
    }

    tradeCrypt(action, pid) {
        if(typeof this.cryptPrice === 'undefined') this.cryptPrice = 100.00;
        if(typeof this.cryptShares === 'undefined') this.cryptShares = parseInt(localStorage.getItem('GemiOS_CryptShares')) || 0;
        let cost = Math.floor(this.cryptPrice);
        if(action === 'buy') {
            if(this.wallet >= cost) { this.wallet -= cost; this.cryptShares++; this._saveWallet(); localStorage.setItem('GemiOS_CryptShares', this.cryptShares); let shEl = document.getElementById(`crypt-shares-${pid}`); if(shEl) shEl.innerText = this.cryptShares; this.audio.play('buy'); } 
            else { this.notify("Trade Failed", "Insufficient funds.", false); this.audio.play('error'); }
        } else {
            if(this.cryptShares > 0) { this.wallet += cost; this.cryptShares--; this._saveWallet(); localStorage.setItem('GemiOS_CryptShares', this.cryptShares); let shEl = document.getElementById(`crypt-shares-${pid}`); if(shEl) shEl.innerText = this.cryptShares; this.audio.play('open'); } 
            else { this.notify("Trade Failed", "No shares to sell.", false); this.audio.play('error'); }
        }
    }

    _buildUI() {
        const root = document.createElement('div'); root.id='os-root'; root.style.cssText='width:100vw;height:100vh;position:absolute;top:0;left:0';
        root.innerHTML = `<div id="desktop-bg"></div><div id="widget-notes"><div style="font-weight:bold;margin-bottom:5px;">📌 Sticky Note</div><textarea id="sticky-text" placeholder="Jot a quick note..." style="width:100%;height:100%;border:none;background:transparent;color:#333;"></textarea></div><div id="desktop-icons"></div><div id="window-layer"></div><div id="start-menu"><div class="start-header"><div style="font-size:35px;background:rgba(255,255,255,0.1);border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;margin-right:10px;">${this.user==='Admin'?'👑':'👤'}</div><div><div style="font-size:20px;font-weight:600;">${this.user}</div><div style="font-size:12px;opacity:0.7;">GemiOS 49.0 / <span style="color:var(--accent)">${(this.edition||'HOME').toUpperCase()}</span></div></div></div><input type="text" placeholder="🔍 Search…" oninput="GemiOS.runSearch(this.value)" style="width:100%;padding:8px;margin:10px 0;border:none;background:rgba(0,0,0,0.3);color:#fff; box-sizing:border-box;"><div id="start-menu-items"><div class="start-cat">System</div>${this.edition==='Pro'?`<div class="start-item" onclick="GemiOS.pm.launch('app_dev')"><span>🛠️</span> GemiDev Studio</div>`:''}<div class="start-item" onclick="GemiOS.pm.launch('app_maker')"><span>🧩</span> GemiMaker Studio</div><div class="start-item" onclick="GemiOS.pm.launch('sys_store')"><span>🛍️</span> Store</div><div class="start-item" onclick="GemiOS.pm.launch('sys_drive')"><span>🗂️</span> Explorer</div><div class="start-item" onclick="GemiOS.pm.launch('sys_term')"><span>⌨️</span> Terminal</div><div class="start-item" onclick="GemiOS.pm.launch('sys_set')"><span>⚙️</span> Settings</div></div></div><div id="taskbar-container"><div id="taskbar"><div class="start" onclick="document.getElementById('start-menu').classList.toggle('open')">G</div><div style="display:flex;gap:8px;margin-left:15px;padding-right:15px;border-right:1px solid rgba(255,255,255,0.1);"><div class="ql-icon" onclick="GemiOS.pm.launch('sys_drive')" title="Explorer">🗂️</div><div class="ql-icon" onclick="GemiOS.pm.launch('sys_store')" title="Store">🛍️</div><div class="ql-icon" onclick="GemiOS.pm.launch('sys_term')" title="Terminal">⌨️</div></div><div id="taskbar-apps"></div><div style="display:flex;align-items:center;gap:15px;margin-left:auto;padding-left:15px;border-left:1px solid rgba(255,255,255,0.1);"><div id="os-wallet-display" style="font-weight:bold;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px;">🪙 ${this.wallet}</div><div onclick="GemiOS.toggleTheme()" style="cursor:pointer;font-size:20px;">🌓</div><div id="clock" style="font-weight:600;font-size:14px;letter-spacing:1px;">--:--</div><div onclick="GemiOS.lockSystem()" style="cursor:pointer;font-size:18px;color:#ff4d4d;">⏻</div></div></div></div><div id="notif-container"></div>`;
        document.body.innerHTML = ''; document.body.appendChild(root);
        const sticky = document.getElementById('sticky-text'); sticky.value = localStorage.getItem('GemiOS_Sticky') || ''; sticky.oninput = () => localStorage.setItem('GemiOS_Sticky', sticky.value);
        setInterval(()=>{ document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); },1000);
        this.bus.on('notify', ({title,msg,success})=>{ const container = document.getElementById('notif-container'); const note = document.createElement('div'); note.className='gemi-notif'; note.innerHTML = `<div style="font-size:20px;">${success?'✅':'🔔'}</div><div><div style="font-weight:bold;">${title}</div><div style="font-size:12px;">${msg}</div></div>`; container.appendChild(note); void note.offsetWidth; note.style.transform='translateX(0)'; note.style.opacity='1'; setTimeout(()=>{ note.style.transform='translateX(120%)'; note.style.opacity='0'; setTimeout(()=>note.remove(),300); },3500); this.audio.play(success?'success':'error'); });
    }
  }

  (async () => { const os = new Core(); await os.init(); })();
})();
