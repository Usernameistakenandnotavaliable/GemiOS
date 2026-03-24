/*=====================================================================
   GemiOS CLOUD HYPERVISOR - v50.0 (THE MASTER BUILD)
=====================================================================*/
(() => {
  // NUKE THE BIOS SCREEN INSTANTLY
  document.body.innerHTML = '';

  class EventBus { constructor() { this.handlers = new Map(); } on(ev, fn) { if (!this.handlers.has(ev)) this.handlers.set(ev, []); this.handlers.get(ev).push(fn); } off(ev, fn) { const arr = this.handlers.get(ev); if (!arr) return; this.handlers.set(ev, arr.filter(f => f !== fn)); } emit(ev, data) { const arr = this.handlers.get(ev); if (!arr) return; arr.forEach(fn => fn(data)); } }

  class VFS {
    constructor(bus) { this.bus = bus; this.MAX_STORAGE = 10 * 1024 * 1024; this.DB_NAME = 'GemiOS_Fs'; this.STORE = 'nodes'; this.db = null; }
    async _open() { if (this.db) return this.db; return new Promise((res, rej) => { const req = indexedDB.open(this.DB_NAME, 1); req.onupgradeneeded = ev => { const db = ev.target.result; db.createObjectStore(this.STORE, { keyPath: 'path' }); }; req.onsuccess = ev => { this.db = ev.target.result; res(this.db); }; req.onerror = ev => rej(ev.target.error); }); }
    async _store(mode = 'readonly') { const db = await this._open(); return db.transaction(this.STORE, mode).objectStore(this.STORE); }
    async ensureRoot() { const store = await this._store('readwrite'); const rec = await store.get('root'); if (!rec) { await store.add({ path: 'root', data: { "C:": { System: { "boot.log": "GemiOS V50.0 Initialized.", "sys_mail.json": "[]" }, Users: { Admin: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} }, Guest: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} } } } } }); } }
    async getNode(path) { const store = await this._store(); const rec = await store.get(path); return rec?.data ?? null; }
    async saveNode(path, data) { const size = new TextEncoder().encode(JSON.stringify(data)).length; const usage = await this.getUsage(); if (usage.used + size > this.MAX_STORAGE) { this.bus.emit('notify', {title:'Disk Full!',msg:'NVRAM quota exceeded.',success:false}); return false; } const store = await this._store('readwrite'); await store.put({ path, data }); this.bus.emit('vfs:changed'); return true; }
    async getUsage() { const store = await this._store(); const all = await store.getAll(); const used = all.reduce((t, r) => t + new TextEncoder().encode(JSON.stringify(r.data)).length, 0); return { used, max: this.MAX_STORAGE }; }
    async getDir(dirPath, create = false) { const node = await this.getNode('root'); if(!node) return null; let parts = dirPath.split('/').filter(p => p); let curr = node; for(let p of parts) { if(curr[p] === undefined) { if(create) curr[p] = {}; else return null; } curr = curr[p]; } return curr; }
    async read(dirPath, file) { const dir = await this.getDir(dirPath); return dir?.[file] ?? null; }
    async write(dirPath, file, data) { const rootNode = await this.getNode('root'); let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) curr[p] = {}; curr = curr[p]; } curr[file] = data; return await this.saveNode('root', rootNode); }
    async delete(dirPath, file) { const rootNode = await this.getNode('root'); let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) return false; curr = curr[p]; } if(curr[file] !== undefined) { delete curr[file]; return await this.saveNode('root', rootNode); } return false; }
    async format() { const db = await this._open(); db.close(); indexedDB.deleteDatabase(this.DB_NAME); localStorage.clear(); location.reload(); }
  }

  class Sanitizer {
    static sanitizeHTML(raw) { return DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['div','span','button','input','textarea','canvas','img','video','audio','style','b','i','u','br','select','option','label','hr'], ALLOWED_ATTR: ['class','id','style','src','href','type','value','placeholder','data-*','title','min','max','step','disabled','checked','onmousedown','onclick','onkeydown','oninput','ondblclick','onmouseover'], FORBID_ATTR: ['onload','onfocus'] }); }
    static isSafeCartridge(appData) { let html = appData.htmlString || ""; return !(html.includes("VFS.format") || html.includes("localStorage.clear") || html.includes("GemiOS.wallet")); }
  }

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

  class ProcessManager {
    constructor(bus, audio){ this.bus=bus; this.audio=audio; this.nextPid=1000; this.processes=new Map(); this.bus.on('process:kill', pid=>this.kill(pid)); }
    async launch(appId,fileData=null){ 
        const app = window.GemiRegistry ? window.GemiRegistry[appId] : null; 
        if (!app){ this.bus.emit('notify',{title:'Execution Error',msg:`App ${appId} missing.`,success:false}); return; } 
        const pid = ++this.nextPid; this.processes.set(pid,{app,pid,raw:app, id:appId}); this.audio.play('click'); 
        let sm = document.getElementById('start-menu'); if(sm) sm.classList.remove('open');
        this.bus.emit('wm:create-window',{pid,app,fileData}); 
        if (app.onLaunch) app.onLaunch(pid, fileData); 
    }
    async kill(pid){ 
        if (!this.processes.has(pid)) return; 
        const app = this.processes.get(pid).app; 
        if(app.onKill) app.onKill(pid); 
        this.bus.emit('wm:close-window',pid); 
        setTimeout(()=>{ this.processes.delete(pid); GemiOS.WM._renderDock(); },250); 
    }
  }

  class WindowManager {
    constructor(bus, audio){ this.bus = bus; this.audio = audio; this.zIndex = 100; this.enableAnim = localStorage.getItem('GemiOS_Driver_Anim') !== 'false'; this.bus.on('wm:create-window', cfg => this._createWindow(cfg)); this.bus.on('wm:close-window', pid => this._closeWindow(pid)); }
    
    _createWindow({pid, app, fileData}) {
      const wid = `win_${pid}`;
      const isSystem = (app.tag === 'sys' || app.tag === 'pro' || app.tag === 'edu' || app.tag === 'fin');
      const rawHTML = typeof app.html === 'function' ? app.html(pid, fileData) : app.htmlString;
      let innerContent = isSystem ? rawHTML : `<iframe sandbox="allow-scripts allow-same-origin" srcdoc="${Sanitizer.sanitizeHTML(rawHTML).replace(/"/g,'&quot;')}" style="width:100%;height:100%;border:none;"></iframe>`;

      const html = `
        <div class="win ${this.enableAnim ? 'win-animated' : 'win-static'}" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${app.width}px; z-index:${++this.zIndex};" onmousedown="GemiOS.WM.focus('${wid}')">
          <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event,'${wid}')">
            <div style="display:flex; align-items:center; gap:8px;"><span>${app.icon}</span> <span>${app.title}</span></div>
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
      this.audio.play('open');
      this._renderDock(); 
    }

    focus(wid){ const el = document.getElementById(wid); if (el) el.style.zIndex = ++this.zIndex; }
    
    drag(e,wid){ const win = document.getElementById(wid); if (!win || win.dataset.maximized==='true') return; const offsetX = e.clientX - win.offsetLeft; const offsetY = e.clientY - win.offsetTop; this.focus(wid); let iframes = document.querySelectorAll('iframe'); iframes.forEach(ifr => ifr.style.pointerEvents = 'none'); if(this.enableAnim) win.style.transition = 'none'; const move = ev => { win.style.left = ev.clientX - offsetX + 'px'; win.style.top = Math.max(0, ev.clientY - offsetY) + 'px'; }; const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); if(this.enableAnim) win.style.transition = 'width 0.3s, height 0.3s, top 0.3s, left 0.3s'; iframes.forEach(ifr => ifr.style.pointerEvents = 'auto'); }; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); }
    
    maximize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.dataset.maximized==='true'){ win.style.top = win.dataset.pT; win.style.left = win.dataset.pL; win.style.width = win.dataset.pW; win.style.height= win.dataset.pH; win.dataset.maximized='false'; win.style.borderRadius='12px'; } else { win.dataset.pT = win.style.top; win.dataset.pL = win.style.left; win.dataset.pW = win.style.width; win.dataset.pH = win.style.height; win.style.top = '0'; win.style.left = '0'; win.style.width = '100vw'; win.style.height = 'calc(100vh - 80px)'; win.dataset.maximized='true'; win.style.borderRadius='0'; } }
    
    snap(wid, side){ const win = document.getElementById(wid); if (!win) return; if(win.dataset.maximized === "false") { win.dataset.pT = win.style.top; win.dataset.pL = win.style.left; win.dataset.pW = win.style.width; win.dataset.pH = win.style.height; } win.style.top = '0'; win.style.height = 'calc(100vh - 80px)'; win.style.width = '50vw'; win.style.left = side==='left' ? '0' : '50vw'; win.dataset.maximized='true'; win.style.borderRadius='0'; this.focus(wid); }
    
    minimize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.style.opacity === '0'){ win.style.opacity='1'; win.style.transform='scale(1) translateY(0)'; win.style.pointerEvents='auto'; } else { win.style.opacity='0'; win.style.transform='scale(0.9) translateY(40px)'; win.style.pointerEvents='none'; } }
    
    _renderDock() {
        const dock = document.getElementById('dock-apps');
        if(!dock) return;
        let pinnedApps = ['sys_drive', 'sys_store', 'sys_set'];
        let runningPids = Array.from(GemiOS.pm.processes.values());
        let allDockApps = [...pinnedApps];
        runningPids.forEach(p => { if(!allDockApps.includes(p.id)) allDockApps.push(p.id); });
        let html = '';
        allDockApps.forEach(appId => {
            let appData = window.GemiRegistry ? window.GemiRegistry[appId] : null;
            if(!appData) return;
            let runningInstance = runningPids.find(p => p.id === appId);
            let indicator = runningInstance ? `<div style="width:4px; height:4px; background:var(--accent); border-radius:50%; position:absolute; bottom:2px;"></div>` : '';
            let clickAction = runningInstance ? `GemiOS.WM.minimize('win_${runningInstance.pid}')` : `GemiOS.pm.launch('${appId}')`;
            html += `<div class="dock-icon" onclick="${clickAction}" title="${appData.title}">
                        <div style="font-size:24px;">${appData.icon}</div>
                        ${indicator}
                     </div>`;
        });
        dock.innerHTML = html;
    }

    _closeWindow(pid){ const win = document.getElementById(`win_${pid}`); if (win){ win.style.opacity = '0'; win.style.transform = 'scale(0.9)'; setTimeout(() => { win.remove(); this.audio.play('close'); }, 200); } }
    showScreensaver(){ let ss = document.getElementById('gemi-screensaver'); if (!ss){ ss = document.createElement('canvas'); ss.id = 'gemi-screensaver'; ss.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:black;z-index:9999998;opacity:0;pointer-events:none;transition:opacity 1s ease'; document.body.appendChild(ss); const ctx = ss.getContext('2d'); const stars = []; for(let i=0;i<200;i++) stars.push({x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, s:Math.random()*2}); setInterval(()=> { if (ss.style.opacity==='1'){ if (ss.width!==window.innerWidth){ ss.width=window.innerWidth; ss.height=window.innerHeight; } ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(0,0,ss.width,ss.height); ctx.fillStyle='white'; stars.forEach(st=>{ ctx.beginPath(); ctx.arc(st.x,st.y,st.s,0,Math.PI*2); ctx.fill(); st.x-=st.s; if(st.x<0){ st.x=ss.width; st.y=Math.random()*ss.height; } }); } },30); } ss.style.opacity='1'; ss.style.pointerEvents='auto'; }
    hideScreensaver(){ const ss = document.getElementById('gemi-screensaver'); if (ss){ ss.style.opacity='0'; ss.style.pointerEvents='none'; } }
  }

  class Core {
    constructor(){
      this.bus = new EventBus(); this.VFS = new VFS(this.bus); this.audio = new AudioEngine(this.bus); this.theme = new Theme(this.bus); this.pm = new ProcessManager(this.bus, this.audio); this.WM = new WindowManager(this.bus, this.audio); this.user = 'Admin'; this.edition = localStorage.getItem('GemiOS_Edition') || 'Pro'; this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet')) || 500;
      this.termStates = {}; this.driveStates = {}; this.idleTime = 0;
      window.GemiOS = this; 
    }

    async init(){
      this.injectStyles(); 
      this._buildUI(); 
      await this.VFS.ensureRoot(); 
      await this.theme.applyFromStorage(); 
      await this.loadDependencies();
      
      if(this.wallet <= 10 && !localStorage.getItem('GemiOS_Relief_Claimed')) { setTimeout(() => { this.wallet += 150; this._saveWallet(); this.notify("GemiGov Relief Fund 🏦", "150 🪙 deposited!"); localStorage.setItem('GemiOS_Relief_Claimed', 'true'); }, 4000); }
      
      // 🎉 V50 GOLDEN CELEBRATION BLOCK 🎉
      if(!localStorage.getItem('GemiOS_V50_Celebrated')) {
          setTimeout(() => {
              this.notify("🏆 V50.0 MILESTONE REACHED!", "Half a century of updates! Welcome to the Modular Core.", true);
              this.audio.play('success');
              let c = document.createElement('canvas'); c.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999999;pointer-events:none;'; document.body.appendChild(c);
              let ctx = c.getContext('2d'); c.width = window.innerWidth; c.height = window.innerHeight;
              let pieces = Array.from({length: 100}, () => ({ x: Math.random() * c.width, y: -20, vx: (Math.random()-0.5)*5, vy: Math.random()*5+2, color: ['#ffb400','#ff00cc','#38ef7d','#4db8ff'][Math.floor(Math.random()*4)] }));
              let anim = setInterval(() => { ctx.clearRect(0,0,c.width,c.height); pieces.forEach(p => { p.x += p.vx; p.y += p.vy; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 8, 8); }); if(pieces.every(p => p.y > c.height)) { clearInterval(anim); c.remove(); } }, 16);
              localStorage.setItem('GemiOS_V50_Celebrated', 'true');
          }, 3500);
      }

      this._setupIdleTimer(); this.patchDesktopData(); this._startOTADaemon(); this._startEconomyDaemon(); this.initRealityBridge();
    }

    injectStyles() {
        const s = document.createElement('style');
        // CSS Overrides to nuke the BIOS formatting!
        s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
            :root { --accent: #0078d7; }
            body { margin:0 !important; padding:0 !important; display:block !important; overflow:hidden !important; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Inter', sans-serif !important; color:white !important; user-select:none; transition: background 0.6s ease, color 0.6s ease;}
            body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #222 !important; }
            ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; } body.light-mode ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes popIn { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes blink { 0%, 100% { opacity:1; } 50% { opacity:0.2; } }
            .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; }
            
            .win { position:absolute; background:rgba(20, 30, 40, 0.75); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); color:white; border-radius:12px; box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; pointer-events:auto; resize:both; overflow:hidden;}
            .win-animated { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, transform 0.3s, opacity 0.3s; }
            .win-static { animation: none; transition: none; opacity:1; }
            body.light-mode .win { background: rgba(255,255,255,0.85); border: 1px solid var(--accent); color: #222; box-shadow: 0 20px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }
            
            .title-bar { padding:10px 15px; font-weight:600; font-size: 13px; display:flex; justify-content:space-between; align-items: center; border-bottom:1px solid rgba(255,255,255,0.05); cursor:grab; background:rgba(0,0,0,0.2);}
            body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.05); background:rgba(0,0,0,0.03);}
            .content { padding:15px; flex-grow: 1; overflow-y: auto; display:flex; flex-direction:column; }
            .ctrl-btn { border:none; color:white; cursor:pointer; width: 14px; height: 14px; border-radius:50%; font-size: 0px; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; margin-left: 6px; box-shadow: inset 0 1px 1px rgba(255,255,255,0.3);}
            .ctrl-btn:hover { font-size: 10px; font-weight:bold; }
            .close-btn { background:#ff5f56; } .close-btn:hover { background:#ff4d4d; }
            .min-btn { background:#ffbd2e; } .min-btn:hover { background:#ffb400; }
            .snap-btn { background:#27c93f; } .snap-btn:hover { background:#1e9c2e; }
            
            #taskbar-container { position:absolute; bottom:20px; width:100%; display:flex; justify-content:center; pointer-events:none; z-index:99999; }
            #taskbar { pointer-events:auto; height:65px; background:rgba(20, 25, 30, 0.6); backdrop-filter:blur(30px) saturate(180%); display:flex; align-items:center; padding: 0 20px; border-radius:24px; border:1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1); transition: all 0.3s ease; gap: 15px;}
            body.light-mode #taskbar { background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.1); color: #222; box-shadow: 0 15px 35px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.8);}
            
            .start { width:45px; height:45px; background:linear-gradient(135deg, var(--accent), #005a9e); border-radius:12px; border:1px solid rgba(255,255,255,0.2); text-align:center; line-height:45px; cursor:pointer; font-weight: 600; font-size: 22px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); transition: 0.2s;}
            .start:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6); border-color:white; }
            
            #dock-apps { display:flex; align-items:center; gap: 8px; border-left:1px solid rgba(255,255,255,0.1); padding-left:15px; border-right:1px solid rgba(255,255,255,0.1); padding-right:15px;}
            .dock-icon { width:45px; height:45px; border-radius:12px; display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer; transition:0.2s; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.05); position:relative;}
            .dock-icon:hover { background:rgba(255,255,255,0.15); transform:translateY(-5px); border-color:rgba(255,255,255,0.3); box-shadow:0 8px 15px rgba(0,0,0,0.3);}
            body.light-mode .dock-icon { background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.05); } body.light-mode .dock-icon:hover { background:rgba(0,0,0,0.1); border-color:rgba(0,0,0,0.2); }
            
            #start-menu { position:absolute; bottom:100px; left:50%; transform:translateX(-50%); width:400px; max-height:600px; background:rgba(25, 35, 45, 0.85); backdrop-filter:blur(40px) saturate(200%); border-radius:20px; box-shadow:0 25px 60px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:100000; overflow:hidden; pointer-events:auto;}
            #start-menu.open { display:flex; animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            body.light-mode #start-menu { background:rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.1); color: #222;}
            .start-header { background: linear-gradient(135deg, rgba(0,0,0,0.2), transparent); color:white; padding:25px; font-weight:600; display:flex; align-items:center; gap: 15px; border-bottom:1px solid rgba(255,255,255,0.05);}
            .start-item { padding:12px 20px; cursor:pointer; display:flex; align-items:center; gap:15px; font-size:14px; font-weight:500; transition: 0.2s; border-radius: 12px; margin: 4px 12px; background:rgba(255,255,255,0.02);}
            .start-item:hover { background:var(--accent); color:white; transform: translateX(5px); box-shadow:0 4px 10px rgba(0,0,0,0.2); }
            
            #desktop-icons { display:grid; grid-template-columns: repeat(auto-fill, 90px); grid-auto-rows: 100px; gap: 10px; padding: 20px; pointer-events:none; position:absolute; top:0; left:0; width:100%; height:100%; z-index:10; align-content:start;}
            .icon { width:100%; height:100%; cursor:pointer; transition: 0.2s; border-radius:12px; padding:10px 5px; pointer-events:auto; text-align:center; color:white; font-size:12px; font-weight:500; text-shadow:0 1px 3px rgba(0,0,0,0.8); display:flex; flex-direction:column; align-items:center; justify-content:center; box-sizing:border-box;} 
            .icon:hover { background:rgba(255,255,255,0.1); backdrop-filter:blur(10px); outline:1px solid rgba(255,255,255,0.2); transform:translateY(-2px); box-shadow:0 10px 20px rgba(0,0,0,0.2); }
            .icon div { font-size: 40px; margin-bottom: 8px; filter:drop-shadow(0 4px 5px rgba(0,0,0,0.5)); pointer-events:none;}
            body.light-mode .icon { color: #222; text-shadow:0 1px 2px rgba(255,255,255,0.8); }
            
            #desktop-bg { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; pointer-events: none; background-size: cover !important; background-position: center !important; z-index: 1; transition: filter 1s ease, transform 1s ease;}
            .sys-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 12px; font-size:13px;}
            .btn-primary { width:100%; padding:12px; background:var(--accent); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; transition:all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);}
            .btn-primary:hover { transform:translateY(-2px); box-shadow:0 4px 10px rgba(0,0,0,0.3); filter:brightness(1.1); }
            .btn-sec { width:100%; padding:12px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:8px; margin-bottom:10px; cursor:pointer; transition:0.2s;}
            .btn-sec:hover { background:rgba(255,255,255,0.2); }
            .btn-danger { width:100%; padding:12px; background:rgba(255,77,77,0.8); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; }
            
            #widget-notes { position:absolute; top:30px; right:30px; width:220px; height:220px; background:linear-gradient(135deg, #fff9c4, #fbc02d); color:#333; box-shadow:5px 10px 20px rgba(0,0,0,0.4); padding:15px; z-index:5; font-family:'Segoe Print', 'Comic Sans MS', cursive; transform: rotate(2deg); transition: transform 0.2s, box-shadow 0.2s; cursor:grab; pointer-events:auto; border-radius:2px 2px 15px 2px;}
            #widget-notes:active { cursor:grabbing; transform: rotate(0deg) scale(1.05); z-index:9999; box-shadow:10px 20px 30px rgba(0,0,0,0.5);}
            #widget-notes textarea { width:100%; height:100%; background:transparent; border:none; outline:none; font-family:inherit; font-size:14px; resize:none; color:#333;}
            
            .gemi-notif { background: rgba(20, 30, 40, 0.85); backdrop-filter: blur(25px) saturate(200%); border: 1px solid var(--accent); border-radius: 12px; padding: 15px 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 15px; transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease; opacity: 0; color: white; width: 320px; pointer-events:auto; }
            #notif-container { position:absolute; top:20px; right:20px; z-index:999999; display:flex; flex-direction:column; gap:10px; pointer-events:none;}
            .io-indicator { position:absolute; bottom:18px; right:75px; font-size:18px; opacity:0.2; transition:opacity 0.2s ease; z-index:999999; }
            .io-indicator.active { opacity:1; animation: blink 0.2s infinite; color: var(--accent); }
        `;
        document.head.appendChild(s);
    }

    async loadDependencies() {
        window.GemiRegistry = window.GemiRegistry || {};
        
        // V50 CORE FAILSAFE: Ensure basic apps exist BEFORE network fetch!
        window.GemiRegistry['sys_term'] = { tag: 'sys', icon: '⌨️', title: 'Bash Terminal', width: 500, htmlString: `<div id="t-out-999" style="flex-grow:1; background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; overflow-y:auto; border-radius:6px;">GemiOS Local Shell Active.</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/Admin></span><input type="text" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;"></div>` };
        window.GemiRegistry['sys_drive'] = { tag: 'sys', icon: '🗂️', title: 'Explorer', width: 520, htmlString: `<div style="padding:20px; text-align:center;">Explorer Offline. Check Network.</div>` };
        window.GemiRegistry['sys_set'] = { tag: 'sys', icon: '⚙️', title: 'Settings', width: 420, htmlString: `<div style="padding:20px; text-align:center;">Settings Offline.</div>` };
        window.GemiRegistry['sys_store'] = { tag: 'sys', icon: '🛍️', title: 'GemiStore', width: 700, htmlString: `<div style="padding:20px; text-align:center;">Store Offline. Check Network.</div>` };

        try {
            // V50 LOCAL FIX: Fetches using relative path! Works beautifully on VS Code Live Server.
            let r1 = await fetch("./registry.js?t=" + Date.now());
            if(r1.ok) { let code1 = await r1.text(); try { eval(code1); localStorage.setItem('GemiOS_Cache_Registry', code1); } catch(e) { console.error(e); } }
            
            let r2 = await fetch("./engine.js?t=" + Date.now());
            if(r2.ok) { let code2 = await r2.text(); try { eval(code2); } catch(e) {} }

            let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}');
            let globalNetwork = JSON.parse(localStorage.getItem('GemiOS_GlobalNetwork') || '[]');
            
            for(let cFile in customApps) {
                let cApp = customApps[cFile];
                window.GemiRegistry[cFile] = { price: cApp.price, id: cApp.id, icon: cApp.icon, desc: cApp.desc, title: cApp.title, width: 500, htmlString: cApp.htmlString, isCustom: true };
            }
            globalNetwork.forEach(gApp => {
                let fileName = gApp.title.replace(/\s/g, '') + '_net.app';
                window.GemiRegistry[fileName] = { price: gApp.price, id: gApp.id, icon: gApp.icon, desc: gApp.desc, title: gApp.title, width: 500, htmlString: gApp.htmlString, isNetwork: true };
            });
        } catch(e) { console.warn("Network Error. Running entirely on local cache."); }
    }

    _setupIdleTimer(){ const reset = () => { this.idleTime = 0; this.WM.hideScreensaver(); }; document.onmousemove = document.onkeydown = document.onclick = reset; setInterval(()=> { this.idleTime++; if (this.idleTime >= 60) this.WM.showScreensaver(); },1000); }
    _startOTADaemon(){ if (localStorage.getItem('GemiOS_Driver_Net')==='false') return; setInterval(async ()=>{ try { const resp = await fetch('https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/version.json?t=' + Date.now()); if (resp.ok) { const d = await resp.json(); const cur = localStorage.getItem('GemiOS_Cache_Ver') || '50.0.0-GOLD'; if (d.version !== cur) { this.notify('🚀 Update Detected!', `Version ${d.version} found.`, true); setTimeout(()=>this.pm.launch('sys_update'),2000); } } } catch (_) {} },15000); }
    _startEconomyDaemon(){ setInterval(()=>{ const customStr = localStorage.getItem('GemiOS_CustomApps') || '{}'; const custom = JSON.parse(customStr); const keys = Object.keys(custom); if (keys.length && Math.random()<0.4){ const app = custom[keys[Math.floor(Math.random()*keys.length)]]; const price = Number(app.price)||0; if (price>0){ const profit = Math.floor(price*0.9); this.wallet+=profit; this._saveWallet(); this.notify('App Sale! 💸',`Someone bought ${app.title}. +🪙${profit}`,true); this.audio.play('buy'); } } },20000); }
    _saveWallet(){ localStorage.setItem('GemiOS_Wallet',String(this.wallet)); let wd = document.getElementById('os-wallet-display'); if(wd) wd.innerText = `🪙 ${Math.floor(this.wallet)}`; }
    
    notify(title,msg,success=true){ this.bus.emit('notify',{title,msg,success}); }
    toggleTheme(){ this.theme.toggleTheme(); }
    lockSystem(){ this.audio.play('shutdown'); const overlay = document.createElement('div'); overlay.style.cssText='position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:sans-serif;'; overlay.innerHTML='<div class="spinner" style="margin-bottom:15px;"></div> Shutting down...'; document.body.appendChild(overlay); setTimeout(()=>location.reload(),2500); }

    patchDesktopData() { 
        let desk = { 'Explorer.app': 'sys_drive', 'GemiStore.app': 'sys_store', 'Settings.app': 'sys_set', 'Terminal.app': 'sys_term', 'GemiDefender.app':'app_defend' }; 
        if(this.edition === 'Pro') { desk['GemiDev.app'] = 'app_dev'; desk['GemiDocs.app'] = 'app_docs'; desk['GemiMaker.app'] = 'app_maker'; }
        if(this.edition === 'Education') { desk['GemiDocs.app'] = 'app_docs'; desk['GemiMaker.app'] = 'app_maker'; }
        
        this.VFS.getDir('C:/Users/' + this.user + '/Desktop', true).then(async (realDesk) => {
            for(let a in desk) { if(realDesk && !realDesk[a]) await this.VFS.write('C:/Users/' + this.user + '/Desktop', a, desk[a]); }
            this.renderDesktopIcons(); this.WM._renderDock(); 
        });
    }

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
                        if(appData.isNetwork) { log('[GPM] Downloading from Global Network...'); let payload = appData.htmlString || ""; if(payload.includes("VFS.format") || payload.includes("localStorage.clear")) { log('<span style="color:red">[GPM ERR] AV Blocked Payload!</span>'); return; } }
                        if(this.wallet >= price) { this.wallet -= price; this._saveWallet(); log(`[GPM] Transaction... -🪙${price}`); if(await this.VFS.write('C:/Users/' + this.user + '/Desktop', appName, appData.id)) { log(`[GPM] SUCCESS.`); this.renderDesktopIcons(); this.audio.play('buy'); } else log(`[GPM] ERROR: Full.`); } else { log(`[GPM] ERROR: Insufficient funds.`); this.audio.play('error'); }
                    } else log(`[GPM] ERROR: Package not found.`); 
                } else log('Usage: gpm install [app.app]'); 
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

    async renderDesktopIcons(){ 
        const deskEl = document.getElementById('desktop-icons'); deskEl.innerHTML = ''; 
        const deskData = await this.VFS.getDir('C:/Users/' + this.user + '/Desktop') || {}; 
        let html = ''; let i = 0; 
        for(let file in deskData) { 
            if(file.endsWith('.app') || file.endsWith('.gbs') || file.endsWith('.gzip') || file.endsWith('.txt')) { 
                let safeFile = file.replace(/'/g, "\\'"); 
                if(file.endsWith('.app')) { 
                    let appId = deskData[file]; let app = window.GemiRegistry ? window.GemiRegistry[appId] : null; 
                    if(app) { html += `<div class="icon" id="icon-${i}" ondblclick="GemiOS.pm.launch('${appId}')"><div>${app.icon}</div>${file.replace('.app','')}</div>`; } 
                } 
                else if (file.endsWith('.gbs')) { html += `<div class="icon" id="icon-${i}" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>📜</div>${file}</div>`; } 
                else if (file.endsWith('.gzip')) { html += `<div class="icon" id="icon-${i}" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>🗜️</div>${file}</div>`; } 
                else if (file.endsWith('.txt')) { html += `<div class="icon" id="icon-${i}" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>📝</div>${file}</div>`; } 
                i++; 
            } 
        } 
        deskEl.innerHTML = html; 
    }

    async importCartridge(b64String) {
        try {
            let decoded = decodeURIComponent(escape(window.atob(b64String)));
            let appData = JSON.parse(decoded);
            if(!appData.title || !appData.htmlString) throw new Error();
            if(!Sanitizer.isSafeCartridge(appData)) { this.notify("THREAT BLOCKED", "GemiDefender blocked a Malicious Payload!", false); this.audio.play('error'); return; }
            let safeId = 'app_cart_' + Date.now(); let fileName = appData.title.replace(/\s/g, '') + '.app'; appData.id = safeId;
            let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}'); customApps[fileName] = appData; localStorage.setItem('GemiOS_CustomApps', JSON.stringify(customApps));
            await this.loadDependencies();
            if(await this.VFS.write('C:/Users/' + this.user + '/Desktop', fileName, safeId)) { this.renderDesktopIcons(); this.notify("GemiShare", `${appData.title} redeemed!`, true); this.audio.play('buy'); } 
            else { this.notify("Install Failed", "NVRAM Storage is full.", false); }
        } catch(e) { this.notify("Redemption Error", "Invalid Cartridge Code.", false); this.audio.play('error'); }
    }

    async uploadToNetwork(pid) {
        if(localStorage.getItem('GemiOS_Driver_Net') === 'false') return this.notify("Network Offline", "TCP/IP adapter not installed.", false);
        let title = document.getElementById(`dev-title-${pid}`).value.trim(); let icon = document.getElementById(`dev-icon-${pid}`).value.trim() || '📦'; let price = parseInt(document.getElementById(`dev-price-${pid}`).value) || 0; let htmlStr = document.getElementById(`dev-html-${pid}`).value.trim();
        if(!title || !htmlStr) return this.notify("Publish Error", "Title and HTML required.", false);
        if(htmlStr.includes('GemiOS.pm.kill') || htmlStr.includes('GemiOS.VFS.delete')) { if(!localStorage.getItem('GemiOS_Bounty_Claimed')) { this.wallet += 500; this._saveWallet(); this.notify("White Hat Bounty! 🏆", "You earned 500 🪙!", true); this.audio.play('success'); localStorage.setItem('GemiOS_Bounty_Claimed', 'true'); } }
        let safeId = 'app_net_' + Date.now(); let appObj = { id: safeId, title: title, icon: icon, price: price, desc: 'Global Network App', htmlString: htmlStr };
        let net = JSON.parse(localStorage.getItem('GemiOS_GlobalNetwork') || '[]'); net.push(appObj); localStorage.setItem('GemiOS_GlobalNetwork', JSON.stringify(net));
        this.notify("Global Network", `${title} uploaded to Server!`, true); this.audio.play('buy'); await this.loadDependencies();
    }

    async publishApp(pid) {
        let title = document.getElementById(`dev-title-${pid}`).value.trim(); let icon = document.getElementById(`dev-icon-${pid}`).value.trim() || '📦'; let price = parseInt(document.getElementById(`dev-price-${pid}`).value) || 0; let htmlStr = document.getElementById(`dev-html-${pid}`).value.trim();
        if(!title || !htmlStr) return this.notify("Publish Error", "Required fields missing.", false);
        let safeId = 'app_custom_' + Date.now(); let fileName = title.replace(/\s/g, '') + '.app';
        let appObj = { id: safeId, title: title, icon: icon, price: price, desc: 'Local Custom App.', htmlString: htmlStr };
        let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}'); customApps[fileName] = appObj; localStorage.setItem('GemiOS_CustomApps', JSON.stringify(customApps));
        await this.loadDependencies(); this.notify("GemiDev Studio", `${title} published Locally!`, true); this.audio.play('buy'); this.renderDesktopIcons();
    }

    async buyApp(filename, appId, pid, btnId, price, isNetwork = false) { 
        if(this.wallet < price) { this.notify("Transaction Failed", `Insufficient funds. Needs 🪙 ${price}`, false); this.audio.play('error'); return; }
        let executeInstall = async () => {
            this.wallet -= price; this._saveWallet();
            if(window.GemiRegistry[filename] && window.GemiRegistry[filename].isCustom) { let devCut = Math.floor(price * 0.90); setTimeout(()=> { this.notify("App Sold!", `Someone bought your app! +🪙${devCut}`); this.wallet += devCut; this._saveWallet(); }, 5000); }
            if(await this.VFS.write('C:/Users/' + this.user + '/Desktop', filename, appId)) { this.notify("Purchase Successful", `Downloaded ${filename}!`); this.renderDesktopIcons(); let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-sec'; btn.innerText = 'Installed'; btn.disabled = true; } this.audio.play('buy'); } 
            else { this.notify("Install Failed", "NVRAM Full.", false); }
        };
        if(isNetwork && window.GemiRegistry[filename]) {
            let htmlCode = window.GemiRegistry[filename].htmlString || "";
            this.notify("GemiDefender Active", "Scanning Global Package...");
            setTimeout(() => { if(!Sanitizer.isSafeCartridge({htmlString: htmlCode})) { this.notify("THREAT BLOCKED", "GemiDefender blocked a malicious payload!", false); this.audio.play('error'); let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-danger'; btn.innerText = 'BLOCKED BY AV'; btn.disabled = true; } } else { this.notify("GemiDefender", "Scan clear. Installing..."); executeInstall(); } }, 1500);
        } else { executeInstall(); }
    }

    async renderStore(pid) { 
        if(localStorage.getItem('GemiOS_Driver_Net') === 'false') { document.getElementById(`store-list-${pid}`).innerHTML = "<div style='grid-column:span 2; text-align:center; padding:20px; color:#ff4d4d;'>Network Offline.</div>"; return; }
        let desk = await this.VFS.getDir('C:/Users/' + this.user + '/Desktop') || {}; let h = ''; 
        if(!window.GemiRegistry || Object.keys(window.GemiRegistry).length === 0) { document.getElementById(`store-list-${pid}`).innerHTML = "<div style='grid-column:span 2; text-align:center;'>Registry Offline. Ensure CSP allows unsafe-eval!</div>"; return; }
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

    async triggerOTA(btn) {
        btn.innerText = 'Pinging Cloud Server...'; btn.style.background = '#444'; let st = document.getElementById('upd-stat'); st.innerText = 'Fetching version.json...';
        try {
            let cb = "?t=" + new Date().getTime(); let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/version.json" + cb); if (!r.ok) throw new Error("GitHub server unreachable."); let d = await r.json();
            let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || "50.0.0-GOLD";
            if (d.version !== currentVer) {
                st.innerHTML = `<span style="color:#ffeb3b">New Version Found: ${d.version}</span><br><i>${d.notes}</i>`; btn.innerText = 'Download & Install'; btn.style.background = '#ff00cc'; 
                btn.onclick = async () => {
                    document.getElementById('ota-overlay').style.display = 'flex'; let fill = document.getElementById('ota-fill'); let text = document.getElementById('ota-text');
                    try { text.innerText = "Downloading Kernel..."; fill.style.width = "30%"; let kRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/kernel.js" + cb); if(!kRes.ok) throw new Error("Kernel download failed."); let kCode = await kRes.text(); text.innerText = "Downloading Registry..."; fill.style.width = "60%"; let regRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/registry.js" + cb); if(!regRes.ok) throw new Error("Registry download failed."); let regCode = await regRes.text(); text.innerText = "Writing to NVRAM..."; fill.style.width = "90%"; localStorage.setItem('GemiOS_Cache_Kernel', kCode); localStorage.setItem('GemiOS_Cache_Registry', regCode); localStorage.setItem('GemiOS_Cache_Ver', d.version); fill.style.width = "100%"; document.getElementById('ota-title').innerText = "System Patched"; document.getElementById('ota-restart-prompt').style.display = 'flex'; this.notify("Update Complete", "System requires restart.", true); } catch(e) { text.innerText = "UPDATE FAILED: " + e.message; fill.style.background = "red"; }
                };
            } else { st.innerHTML = `<span style="color:#38ef7d">System is up to date!</span>`; btn.innerText = 'Latest OS Installed'; btn.style.background = '#38ef7d'; btn.style.color = 'black'; btn.onclick = null; }
        } catch (err) { st.innerHTML = `<span style="color:#ff4d4d">Error: ${err.message}</span>`; btn.innerText = 'Retry'; btn.style.background = '#0078d7'; }
    }

    _buildUI() {
        const root = document.createElement('div'); root.id='os-root'; root.style.cssText='width:100vw;height:100vh;position:absolute;top:0;left:0';
        root.innerHTML = `
        <div id="desktop-bg"></div>
        <div id="widget-notes"><div style="font-weight:bold;margin-bottom:5px;">📌 Sticky Note</div><textarea id="sticky-text" placeholder="Jot a quick note..." style="width:100%;height:100%;border:none;background:transparent;color:#333;"></textarea></div>
        <div id="desktop-icons"></div><div id="window-layer"></div>
        
        <div id="start-menu">
            <div class="start-header"><div style="font-size:35px;background:rgba(255,255,255,0.1);border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;margin-right:10px;">${this.user==='Admin'?'👑':'👤'}</div><div><div style="font-size:20px;font-weight:600;">${this.user}</div><div style="font-size:12px;opacity:0.7;">GemiOS 50.0 / <span style="color:var(--accent)">${(this.edition||'HOME').toUpperCase()}</span></div></div></div>
            <input type="text" placeholder="🔍 Search…" oninput="GemiOS.runSearch(this.value)" style="width:100%;padding:8px;margin:10px 0;border:none;background:rgba(0,0,0,0.3);color:#fff; box-sizing:border-box;">
            <div id="start-menu-items">
                <div class="start-cat">System Apps</div>
                ${this.edition==='Pro'?`<div class="start-item" onclick="GemiOS.pm.launch('app_dev')"><span>🛠️</span> GemiDev Studio</div>`:''}
                <div class="start-item" onclick="GemiOS.pm.launch('app_maker')"><span>🧩</span> GemiMaker Studio</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_store')"><span>🛍️</span> GemiStore</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_drive')"><span>🗂️</span> Explorer</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_term')"><span>⌨️</span> Terminal</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_set')"><span>⚙️</span> Settings</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_update')"><span>☁️</span> Cloud Updater</div>
            </div>
        </div>

        <div id="taskbar-container">
            <div id="taskbar">
                <div class="start" onclick="document.getElementById('start-menu').classList.toggle('open')">G</div>
                <div id="dock-apps"></div>
                <div style="display:flex;align-items:center;gap:15px;margin-left:15px;padding-left:15px;border-left:1px solid rgba(255,255,255,0.1);">
                    <div id="os-wallet-display" style="font-weight:bold;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px;">🪙 ${this.wallet}</div>
                    <div onclick="GemiOS.toggleTheme()" style="cursor:pointer;font-size:20px;" title="Toggle Theme">🌓</div>
                    <div id="clock" style="font-weight:600;font-size:14px;letter-spacing:1px;">--:--</div>
                    <div onclick="GemiOS.lockSystem()" style="cursor:pointer;font-size:18px;color:#ff4d4d;" title="Power Off">⏻</div>
                </div>
            </div>
        </div>

        <div id="notif-container"></div>
        <div id="ota-overlay" style="display:none; position:absolute; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); backdrop-filter:blur(15px); z-index:9999999; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:'Segoe UI', sans-serif;"><div style="font-size:60px; margin-bottom:20px; filter:drop-shadow(0 0 20px #38ef7d);">☁️</div><h2 id="ota-title" style="margin:0 0 20px 0;">Installing OTA Firmware...</h2><div style="width:400px; height:25px; background:#222; border-radius:15px; overflow:hidden; border:2px solid #555;"><div id="ota-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #38ef7d, #0078d7); transition:width 0.3s ease;"></div></div><p id="ota-text" style="margin-top:15px; font-family:monospace; color:#38ef7d; font-size:16px; font-weight:bold;">0%</p><div id="ota-restart-prompt" style="display:none; flex-direction:column; align-items:center; margin-top:20px;"><p style="color:#ffeb3b; font-weight:bold; margin-bottom:15px;">FIRMWARE FLASHED. A restart is required.</p><button onclick="location.reload()" style="padding:12px 25px; background:#ff4d4d; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:16px;">Restart Now</button></div></div>
        <div id="io-indicator" class="io-indicator">💾</div>
        `;
        document.body.appendChild(root);
        const sticky = document.getElementById('sticky-text'); sticky.value = localStorage.getItem('GemiOS_Sticky') || ''; sticky.oninput = () => localStorage.setItem('GemiOS_Sticky', sticky.value);
        setInterval(()=>{ document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); },1000);
    }
  }

  (async () => { const os = new Core(); await os.init(); })();
})();
