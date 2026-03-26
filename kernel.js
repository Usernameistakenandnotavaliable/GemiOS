/*=====================================================================
   GemiOS CLOUD HYPERVISOR - v50.0 (THE MONOLITH BUILD)
=====================================================================*/
(() => {
  // 1. WIPE BIOS GHOSTS
  document.body.innerHTML = ''; document.body.style.padding = '0';

  // 2. GEMIMAKER ENGINE (Baked directly into Kernel to prevent 404s)
  window.GemiEngine = {
    workspaces: {}, loops: {},
    init: function(pid) {
        this.workspaces[pid] = [];
        let html = `<div style="display:flex; flex-grow:1; gap:10px; height:100%;"><div style="width:160px; background:rgba(0,0,0,0.3); border-radius:6px; padding:10px; display:flex; flex-direction:column; gap:8px; overflow-y:auto;"><div style="font-weight:bold; font-size:12px; color:#ffb400; margin-bottom:5px;">MOTION BLOCKS</div><button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'moveX', 'Move Right (10)')">Move Right</button><button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'moveY', 'Move Down (10)')">Move Down</button><button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'bounce', 'Bounce on Edge')">Bounce on Edge</button><div style="font-weight:bold; font-size:12px; color:#ffb400; margin-top:10px; margin-bottom:5px;">LOOKS BLOCKS</div><button class="engine-block" style="background:#ff00cc;" onclick="GemiEngine.addBlock(${pid}, 'color', 'Change Color Randomly')">Change Color</button><button class="engine-block" style="background:#ff00cc;" onclick="GemiEngine.addBlock(${pid}, 'grow', 'Grow Size (+1)')">Grow Size</button><div style="font-weight:bold; font-size:12px; color:#ffb400; margin-top:10px; margin-bottom:5px;">CONTROL BLOCKS</div><button class="engine-block" style="background:#ff4d4d;" onclick="GemiEngine.addBlock(${pid}, 'cursor', 'Follow Cursor')">Follow Mouse</button></div><div style="flex:1; background:#111; border-radius:6px; border:2px solid #333; display:flex; flex-direction:column;"><div style="background:#222; padding:10px; font-weight:bold; color:white; border-bottom:1px solid #333; display:flex; justify-content:space-between;"><span>Script Workspace</span><button onclick="GemiEngine.clearWorkspace(${pid})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">Clear</button></div><div id="engine-workspace-${pid}" style="flex-grow:1; padding:15px; overflow-y:auto; display:flex; flex-direction:column; gap:5px;"><div style="background:#38ef7d; color:black; padding:8px; border-radius:4px; font-weight:bold; text-align:center;">▶ ON START LOOP</div></div></div><div style="flex:1; display:flex; flex-direction:column; gap:10px;"><canvas id="engine-cvs-${pid}" style="flex-grow:1; background:black; border-radius:6px; width:100%; border:2px solid var(--accent);"></canvas><div style="display:flex; gap:10px;"><button onclick="GemiEngine.compileAndRun(${pid})" class="btn-primary" style="flex:2; background:#38ef7d; color:black;">▶️ Compile & Play</button><button onclick="GemiEngine.stopGame(${pid})" class="btn-danger" style="flex:1;">🛑 Stop</button></div></div></div><style>.engine-block{padding:8px;border:none;border-radius:4px;color:white;font-weight:bold;cursor:pointer;text-align:left;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.4);transition:0.2s;}.engine-block:hover{filter:brightness(1.2);transform:translateY(-1px);}.engine-block:active{transform:scale(0.95);}</style>`;
        let container = document.getElementById(`content_${pid}`); if(container) container.innerHTML = html;
        setTimeout(() => { let cvs = document.getElementById(`engine-cvs-${pid}`); if(cvs) { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; } }, 100);
    },
    addBlock: function(pid, type, label) { this.workspaces[pid].push(type); let ws = document.getElementById(`engine-workspace-${pid}`); let color = "#4db8ff"; if(type === 'color' || type === 'grow') color = "#ff00cc"; if(type === 'cursor') color = "#ff4d4d"; let blockHtml = `<div style="background:${color}; color:white; padding:8px; border-radius:4px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.5); animation: popIn 0.2s ease;">${label}</div>`; ws.insertAdjacentHTML('beforeend', blockHtml); ws.scrollTop = ws.scrollHeight; if(window.GemiOS) GemiOS.audio.play('click'); },
    clearWorkspace: function(pid) { this.workspaces[pid] = []; document.getElementById(`engine-workspace-${pid}`).innerHTML = `<div style="background:#38ef7d; color:black; padding:8px; border-radius:4px; font-weight:bold; text-align:center;">▶ ON START LOOP</div>`; if(window.GemiOS) GemiOS.audio.play('error'); },
    compileAndRun: function(pid) { this.stopGame(pid); let cvs = document.getElementById(`engine-cvs-${pid}`); if(!cvs) return; cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; let ctx = cvs.getContext('2d'); let sprite = { x: cvs.width/2, y: cvs.height/2, size: 20, color: '#38ef7d', vx: 5, vy: 5 }; let mouse = { x: cvs.width/2, y: cvs.height/2 }; cvs.onmousemove = (e) => { mouse.x = e.offsetX; mouse.y = e.offsetY; }; let blocks = this.workspaces[pid]; if(window.GemiOS) GemiOS.audio.play('success'); const gameLoop = () => { ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; ctx.fillRect(0, 0, cvs.width, cvs.height); blocks.forEach(type => { if(type === 'moveX') sprite.x += sprite.vx; if(type === 'moveY') sprite.y += sprite.vy; if(type === 'bounce') { if(sprite.x < 0 || sprite.x > cvs.width) sprite.vx *= -1; if(sprite.y < 0 || sprite.y > cvs.height) sprite.vy *= -1; } if(type === 'color') { if(Math.random() < 0.05) sprite.color = `hsl(${Math.random()*360}, 100%, 50%)`; } if(type === 'grow') { sprite.size += 0.1; if(sprite.size > 100) sprite.size = 10; } if(type === 'cursor') { sprite.x += (mouse.x - sprite.x) * 0.05; sprite.y += (mouse.y - sprite.y) * 0.05; } }); ctx.fillStyle = sprite.color; ctx.fillRect(sprite.x - sprite.size/2, sprite.y - sprite.size/2, sprite.size, sprite.size); this.loops[pid] = requestAnimationFrame(gameLoop); }; gameLoop(); },
    stopGame: function(pid) { if(this.loops[pid]) { cancelAnimationFrame(this.loops[pid]); delete this.loops[pid]; let cvs = document.getElementById(`engine-cvs-${pid}`); if(cvs) { let ctx = cvs.getContext('2d'); ctx.fillStyle = "black"; ctx.fillRect(0,0,cvs.width,cvs.height); } } }
  };

  class EventBus { constructor() { this.handlers = new Map(); } on(ev, fn) { if (!this.handlers.has(ev)) this.handlers.set(ev, []); this.handlers.get(ev).push(fn); } off(ev, fn) { const arr = this.handlers.get(ev); if (!arr) return; this.handlers.set(ev, arr.filter(f => f !== fn)); } emit(ev, data) { const arr = this.handlers.get(ev); if (!arr) return; arr.forEach(fn => fn(data)); } }

  class VFS {
    constructor(bus) { this.bus = bus; this.MAX_STORAGE = 10 * 1024 * 1024; this.DB_NAME = 'GemiOS_Fs'; this.STORE = 'nodes'; this.db = null; }
    async _open() { if (this.db) return this.db; return new Promise((res, rej) => { const req = indexedDB.open(this.DB_NAME, 1); req.onupgradeneeded = ev => { const db = ev.target.result; db.createObjectStore(this.STORE, { keyPath: 'path' }); }; req.onsuccess = ev => { this.db = ev.target.result; res(this.db); }; req.onerror = ev => rej(ev.target.error); }); }
    async _store(mode = 'readonly') { const db = await this._open(); return db.transaction(this.STORE, mode).objectStore(this.STORE); }
    async ensureRoot() { const store = await this._store('readwrite'); const rec = await store.get('root'); if (!rec) { await store.add({ path: 'root', data: { "C:": { System: { "boot.log": "GemiOS V50.0 Initialized." }, Users: { Admin: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} } } } } }); } }
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
    async launch(appId, fileData=null){ 
        const app = window.GemiRegistry ? window.GemiRegistry[appId] : null; 
        if (!app){ this.bus.emit('notify',{title:'Execution Error',msg:`App [${appId}] missing.`,success:false}); this.audio.play('error'); return; } 
        const pid = ++this.nextPid; this.processes.set(pid,{app,pid,raw:app, id:appId}); this.audio.play('click'); 
        let sm = document.getElementById('start-menu'); if(sm) sm.classList.remove('open');
        this.bus.emit('wm:create-window',{pid,app,fileData}); 
        if (app.onLaunch) app.onLaunch(pid, fileData); 
    }
    async kill(pid){ 
        if (!this.processes.has(pid)) return; 
        const app = this.processes.get(pid).app; if(app.onKill) app.onKill(pid); 
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

      const html = `<div class="win ${this.enableAnim ? 'win-animated' : 'win-static'}" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${app.width}px; z-index:${++this.zIndex};" onmousedown="GemiOS.WM.focus('${wid}')">
          <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event,'${wid}')">
            <div style="display:flex; align-items:center; gap:8px;"><span>${app.icon}</span> <span>${app.title}</span></div>
            <div onmousedown="event.stopPropagation()"><button class="ctrl-btn min-btn" onclick="GemiOS.WM.minimize('${wid}')">-</button><button class="ctrl-btn close-btn" onclick="GemiOS.pm.kill(${pid})">×</button></div>
          </div>
          <div class="content" id="content_${pid}">${innerContent}</div>
          <div class="resize-handle"></div>
        </div>`;
      document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);
      this.audio.play('open'); this._renderDock(); 
    }
    focus(wid){ const el = document.getElementById(wid); if (el) el.style.zIndex = ++this.zIndex; }
    drag(e,wid){ const win = document.getElementById(wid); if (!win || win.dataset.maximized==='true') return; const offsetX = e.clientX - win.offsetLeft; const offsetY = e.clientY - win.offsetTop; this.focus(wid); let iframes = document.querySelectorAll('iframe'); iframes.forEach(ifr => ifr.style.pointerEvents = 'none'); if(this.enableAnim) win.style.transition = 'none'; const move = ev => { win.style.left = ev.clientX - offsetX + 'px'; win.style.top = Math.max(0, ev.clientY - offsetY) + 'px'; }; const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); if(this.enableAnim) win.style.transition = 'width 0.3s, height 0.3s, top 0.3s, left 0.3s'; iframes.forEach(ifr => ifr.style.pointerEvents = 'auto'); }; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); }
    maximize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.dataset.maximized==='true'){ win.style.top = win.dataset.pT; win.style.left = win.dataset.pL; win.style.width = win.dataset.pW; win.style.height= win.dataset.pH; win.dataset.maximized='false'; win.style.borderRadius='12px'; } else { win.dataset.pT = win.style.top; win.dataset.pL = win.style.left; win.dataset.pW = win.style.width; win.dataset.pH = win.style.height; win.style.top = '0'; win.style.left = '0'; win.style.width = '100vw'; win.style.height = 'calc(100vh - 80px)'; win.dataset.maximized='true'; win.style.borderRadius='0'; } }
    minimize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.style.opacity === '0'){ win.style.opacity='1'; win.style.transform='scale(1) translateY(0)'; win.style.pointerEvents='auto'; } else { win.style.opacity='0'; win.style.transform='scale(0.9) translateY(40px)'; win.style.pointerEvents='none'; } }
    _renderDock() {
        const dock = document.getElementById('dock-apps'); if(!dock) return;
        let pinnedApps = ['sys_drive', 'sys_store', 'sys_set', 'sys_term'];
        let runningPids = Array.from(GemiOS.pm.processes.values());
        let allDockApps = [...pinnedApps];
        runningPids.forEach(p => { if(!allDockApps.includes(p.id)) allDockApps.push(p.id); });
        let html = '';
        allDockApps.forEach(appId => {
            let appData = window.GemiRegistry ? window.GemiRegistry[appId] : null; if(!appData) return;
            let runningInstance = runningPids.find(p => p.id === appId);
            let indicator = runningInstance ? `<div style="width:4px; height:4px; background:var(--accent); border-radius:50%; position:absolute; bottom:2px;"></div>` : '';
            let clickAction = runningInstance ? `GemiOS.WM.minimize('win_${runningInstance.pid}')` : `GemiOS.pm.launch('${appId}')`;
            html += `<div class="dock-icon" onclick="${clickAction}" title="${appData.title}"><div style="font-size:24px;">${appData.icon}</div>${indicator}</div>`;
        });
        dock.innerHTML = html;
    }
    _closeWindow(pid){ const win = document.getElementById(`win_${pid}`); if (win){ win.style.opacity = '0'; win.style.transform = 'scale(0.9)'; setTimeout(() => { win.remove(); this.audio.play('close'); }, 200); } }
  }

  // 3. THE MONOLITH REGISTRY (All V49 + V50 apps baked directly into the OS)
  window.GemiCoreApps = {
      'sys_term': { tag: 'sys', icon: '⌨️', title: 'Terminal', width: 500, html: (pid) => `<div id="t-out-${pid}" style="flex-grow:1; background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; overflow-y:auto; border-radius:6px;">GemiOS Shell Active.</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span id="t-path-${pid}" style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/Admin></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`, onLaunch: (pid) => { GemiOS.termStates[pid] = 'C:/Users/Admin'; setTimeout(()=>document.getElementById('t-in-'+pid).focus(),100); } },
      'sys_drive': { tag: 'sys', icon: '🗂️', title: 'Explorer', width: 520, html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div><div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px;"></div>`, onLaunch: (pid) => { GemiOS.driveStates[pid] = 'C:/Users/Admin'; GemiOS.renderDrive(pid); } },
      'sys_set': { tag: 'sys', icon: '⚙️', title: 'Settings', width: 420, html: () => `<div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary">Apply Wallpaper</button></div><div class="sys-card"><b style="font-size:14px;">Accent Color</b><br><div style="display:flex; gap:10px; margin-top:10px;"><div onclick="localStorage.setItem('GemiOS_Accent', '#0078d7'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#0078d7; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ff00cc'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff00cc; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#38ef7d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#38ef7d; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ff4d4d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff4d4d; cursor:pointer;"></div></div></div><div class="sys-card" style="border-left:4px solid var(--accent);"><b style="font-size:14px;">Format System</b><br><button onclick="alert('Press F2 on boot.')" class="btn-danger" style="margin-top:5px;">Wipe NVRAM</button></div>` },
      'sys_update': { tag: 'sys', icon: '☁️', title: 'Updater', width: 380, html: () => `<div class="sys-card" style="text-align:center; flex-grow:1;"><div style="font-size:40px;">☁️</div><h3 style="margin:5px 0;">Dual-OTA Updater</h3><p style="font-size:13px; opacity:0.8;">Kernel: <b id="kern-ver">v50.0.0-GOLD</b></p><div id="upd-stat" style="font-size:12px; min-height:15px; margin-bottom:10px;">Ready to fetch Cloud Update.</div><button onclick="GemiOS.triggerOTA(this)" class="btn-primary">Check for Updates</button></div>` },
      'sys_store': { tag: 'sys', icon: '🛍️', title: 'GemiStore', width: 700, html: (pid) => `<div class="sys-card" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg, var(--accent), #000); border:none; margin-bottom:10px;"><div style="font-size:24px; font-weight:bold;">GemiStore</div><div style="font-size:40px;">🛍️</div></div><div style="display:flex; gap:10px; margin-bottom:15px;"><button onclick="let c=prompt('Paste App Cartridge:'); if(c) GemiOS.importCartridge(c);" class="btn-sec" style="flex:1; background:rgba(56,239,125,0.2); border-color:#38ef7d; color:#38ef7d; font-weight:bold; margin:0;">📥 Redeem App Cartridge</button><button onclick="GemiOS.renderStore(${pid})" class="btn-sec" style="flex:1; margin:0;">🔄 Refresh Network</button></div><div id="store-list-${pid}" style="flex-grow:1; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:5px;"></div>`, onLaunch: (pid) => { GemiOS.renderStore(pid); } },
      
      // THE V49 GREATS RESTORED!
      'app_maker': { tag: 'pro', icon: '🧩', title: 'GemiMaker Studio', desc: 'Visual Block Game Engine.', width: 850, html: (pid) => `<div style="padding:20px; text-align:center;">Loading Engine...</div>`, onLaunch: (pid) => { setTimeout(() => { window.GemiEngine.init(pid); }, 300); }, onKill: (pid) => { window.GemiEngine.stopGame(pid); } },
      'app_dev': { tag: 'pro', icon: '🛠️', title: 'GemiDev Studio', desc: 'Build and share custom apps.', width: 600, html: (pid) => `<div style="display:flex; flex-direction:column; flex-grow:1; gap:10px;"><div class="sys-card" style="margin-bottom:0;"><h3 style="margin-top:0; color:#ff00cc;">GemiShare Publisher</h3><div style="display:flex; gap:10px; margin-bottom:10px;"><input type="text" id="dev-title-${pid}" placeholder="App Title (e.g. NoteApp)" style="flex:2; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(0,0,0,0.5); color:white;"><input type="text" id="dev-icon-${pid}" placeholder="Icon (e.g. 📝)" style="flex:1; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(0,0,0,0.5); color:white; text-align:center;"><input type="number" id="dev-price-${pid}" placeholder="Price 🪙" style="flex:1; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(0,0,0,0.5); color:white; text-align:center;"></div><div style="display:flex; gap:10px;"><button onclick="GemiOS.publishApp(${pid})" class="btn-sec" style="flex:1; margin:0;">💾 Local Save</button><button onclick="GemiOS.uploadToNetwork(${pid})" class="btn-primary" style="flex:1.5; background:#4db8ff; color:black; margin:0; font-weight:bold;">🌐 Upload to Global Network</button></div></div><textarea id="dev-html-${pid}" placeholder="\n<div style='padding:20px; color:white;'>Hello World</div>" style="flex-grow:1; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:10px; border:none; border-radius:6px; resize:none; outline:none;"></textarea></div>` },
      'app_defend': { price: 300, tag: 'pro', icon: '🛡️', title: 'GemiDefender Ultimate', desc: 'Active Memory Scanner.', width: 650, html: (pid) => `<div style="background:#111; color:white; padding:15px; border-radius:6px; flex-grow:1; display:flex; flex-direction:column;"><div style="display:flex; align-items:center; gap:15px; margin-bottom:20px; border-bottom:1px solid #333; padding-bottom:15px;"><div style="font-size:40px; color:#38ef7d;" id="av-icon-${pid}">🛡️</div><div><h2 style="margin:0; color:#38ef7d;" id="av-status-${pid}">Zero-Trust Active</h2><p style="margin:0; font-size:12px; color:#aaa;">GemiOS Security</p></div></div><div style="display:flex; gap:10px; margin-bottom:15px;"><button onclick="GemiOS.scanMem(${pid})" class="btn-primary" id="av-btn-mem-${pid}" style="flex:1;">🧠 Scan Memory</button></div><div id="av-log-${pid}" style="flex-grow:1; background:#000; border:1px solid #333; border-radius:4px; padding:10px; font-family:monospace; font-size:12px; overflow-y:auto; max-height:200px;">GemiDefender Engine Ready...<br></div></div>` },
      'app_crypt': { price: 0, tag: 'fin', icon: '📈', title: 'GemiCrypt Exchange', desc: 'Live market ticker & trader.', width: 500, html: (pid) => `<div style="background:#0a0a0a; padding:15px; border-radius:6px; flex-grow:1; display:flex; flex-direction:column;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><div style="font-family:monospace; font-size:24px; color:#38ef7d; font-weight:bold;">GEMI: $<span id="crypt-prc-${pid}">100.00</span></div><div style="font-size:12px; color:#888; text-align:right;">Shares: <b id="crypt-shares-${pid}" style="color:white;">0</b><br>Wallet: <b id="crypt-wallet-${pid}" style="color:#ffb400;">🪙 0</b></div></div><canvas id="crypt-cvs-${pid}" style="flex-grow:1; width:100%; border:1px solid #222; border-radius:4px; background:#050505; margin-bottom:10px; min-height:150px;"></canvas><div style="display:flex; gap:10px;"><button class="btn-primary" style="flex:1; background:#38ef7d; color:black;" onclick="GemiOS.tradeCrypt('buy', ${pid})">BUY 1</button><button class="btn-danger" style="flex:1;" onclick="GemiOS.tradeCrypt('sell', ${pid})">SELL 1</button></div></div>`, onLaunch: (pid) => { setTimeout(() => { let cvs = document.getElementById("crypt-cvs-" + pid); if(!cvs) return; let ctx = cvs.getContext("2d"); GemiOS.cryptPrice = 100.00; GemiOS.cryptHist = Array(50).fill(GemiOS.cryptPrice); GemiOS.cryptShares = parseInt(localStorage.getItem("GemiOS_CryptShares")) || 0; let updateUI = () => { let prcEl = document.getElementById("crypt-prc-" + pid); let shEl = document.getElementById("crypt-shares-" + pid); let wEl = document.getElementById("crypt-wallet-" + pid); if(prcEl) prcEl.innerText = GemiOS.cryptPrice.toFixed(2); if(shEl) shEl.innerText = GemiOS.cryptShares; if(wEl) wEl.innerText = "🪙 " + Math.floor(GemiOS.wallet); }; updateUI(); GemiOS.cryptInterval = setInterval(() => { if(!document.getElementById("crypt-cvs-" + pid)) return clearInterval(GemiOS.cryptInterval); cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; let change = (Math.random() - 0.48) * 4; GemiOS.cryptPrice = Math.max(5, GemiOS.cryptPrice + change); GemiOS.cryptHist.push(GemiOS.cryptPrice); if(GemiOS.cryptHist.length > 50) GemiOS.cryptHist.shift(); let prcEl = document.getElementById("crypt-prc-" + pid); prcEl.innerText = GemiOS.cryptPrice.toFixed(2); prcEl.style.color = change >= 0 ? "#38ef7d" : "#ff4d4d"; ctx.clearRect(0,0,cvs.width,cvs.height); ctx.strokeStyle = "#222"; ctx.lineWidth = 1; for(let i=0; i<5; i++) { ctx.beginPath(); ctx.moveTo(0, i*(cvs.height/4)); ctx.lineTo(cvs.width, i*(cvs.height/4)); ctx.stroke(); } ctx.strokeStyle = change >= 0 ? "#38ef7d" : "#ff4d4d"; ctx.lineWidth = 2; ctx.beginPath(); let minP = Math.min(...GemiOS.cryptHist) - 10; let maxP = Math.max(...GemiOS.cryptHist) + 10; let range = maxP - minP; GemiOS.cryptHist.forEach((p,i) => { let x = (i/49)*cvs.width; let y = cvs.height - ((p - minP)/range)*cvs.height; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); }, 1000); }, 100); }, onKill: (pid) => { clearInterval(GemiOS.cryptInterval); } },
      'app_beat': { price: 150, tag: 'pro', icon: '🥁', title: 'GemiBeat Maker', desc: '8-pad digital drum machine.', width: 400, html: (pid) => `<div style="display:flex; flex-direction:column; flex-grow:1; gap:10px; background:#111; padding:20px; border-radius:8px;"><div style="text-align:center; font-family:monospace; color:var(--accent); font-size:18px; margin-bottom:10px;">GEMI-808</div><div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; flex-grow:1;"><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.audio._square(60,null)">KICK</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.audio._square(120,null)">SNARE</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.audio._tone(800,1000,null,0.1,0,0.1)">HAT</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.audio._tone(1200,800,null,0.1,0,0.2)">CLAP</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.audio._tone(200,100,null)">TOM 1</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.audio._tone(150,80,null)">TOM 2</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.audio._tone(300,150,null)">BASS</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.audio._tone(2000,500,null,0.2,0,0.5)">CRASH</button></div></div>` }
  };

  class Core {
    constructor(){
      this.bus = new EventBus(); this.VFS = new VFS(this.bus); this.theme = new Theme(this.bus); this.audio = new AudioEngine(this.bus);
      this.pm = new ProcessManager(this.bus, this.audio); this.WM = new WindowManager(this.bus, this.audio);
      this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet')) || 500; this.termStates = {}; this.driveStates = {}; window.GemiOS = this; 
    }

    async init(){
      this.injectStyles();
      this._buildUI();
      await this.VFS.ensureRoot();
      await this.theme.applyFromStorage();
      await this.loadDependencies();
      this.renderDesktopIcons();
    }

    // 4. THE LOGIN SCREEN (Fixes Audio Autoplay Policy!)
    login() {
        this.audio._init(); // This click unlocks the AudioContext!
        this.audio.play('success'); 
        document.getElementById('login-screen').style.opacity = '0';
        setTimeout(() => document.getElementById('login-screen').remove(), 500);
        this.notify("🏆 V50.0 SYSTEM RESTORED", "Welcome to the Monolith Core. Audio is online.", true);
    }

    injectStyles() {
        const s = document.createElement('style');
        s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
            :root { --accent: #0078d7; }
            body { margin:0 !important; padding:0 !important; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Inter', sans-serif !important; color:white !important; overflow:hidden !important; user-select:none; }
            body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #222 !important; }
            @keyframes popIn { 0% { opacity:0; transform:scale(0.9) translateY(20px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            
            .win { position:absolute; background:rgba(20, 30, 40, 0.75); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-radius:12px; box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.1); display:flex; flex-direction:column; pointer-events:auto; overflow:hidden;}
            .win-animated { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, opacity 0.3s, transform 0.3s; }
            body.light-mode .win { background: rgba(255,255,255,0.85); border: 1px solid var(--accent); color: #222; box-shadow: 0 20px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }
            
            .title-bar { padding:10px 15px; font-weight:600; font-size: 13px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05); cursor:grab; background:rgba(0,0,0,0.2);}
            body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.05); background:rgba(0,0,0,0.03);}
            .content { padding:15px; flex-grow: 1; overflow-y: auto; display:flex; flex-direction:column; }
            .ctrl-btn { border:none; color:white; cursor:pointer; width:14px; height:14px; border-radius:50%; font-size:0px; transition:0.2s; display:inline-flex; align-items:center; justify-content:center; margin-left:6px; box-shadow:inset 0 1px 1px rgba(255,255,255,0.3);}
            .ctrl-btn:hover { font-size: 10px; font-weight:bold; }
            .close-btn { background:#ff5f56; } .close-btn:hover { background:#ff4d4d; }
            .min-btn { background:#ffbd2e; } .min-btn:hover { background:#ffb400; }
            .snap-btn { background:#27c93f; } .snap-btn:hover { background:#1e9c2e; }
            
            #taskbar-container { position:absolute; bottom:20px; width:100%; display:flex; justify-content:center; pointer-events:none; z-index:99999; }
            #taskbar { pointer-events:auto; height:65px; background:rgba(20, 25, 30, 0.6); backdrop-filter:blur(30px); display:flex; align-items:center; padding: 0 20px; border-radius:24px; border:1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 35px rgba(0,0,0,0.5); gap: 15px;}
            body.light-mode #taskbar { background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.1); color: #222; }
            
            .start { width:45px; height:45px; background:linear-gradient(135deg, var(--accent), #005a9e); border-radius:12px; border:1px solid rgba(255,255,255,0.2); text-align:center; line-height:45px; cursor:pointer; font-weight:600; font-size:22px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); transition: 0.2s;}
            .start:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.6); border-color:white; }
            
            #dock-apps { display:flex; align-items:center; gap: 8px; border-left:1px solid rgba(255,255,255,0.1); padding-left:15px; border-right:1px solid rgba(255,255,255,0.1); padding-right:15px;}
            .dock-icon { width:45px; height:45px; border-radius:12px; display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer; transition:0.2s; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.05); position:relative;}
            .dock-icon:hover { background:rgba(255,255,255,0.15); transform:translateY(-5px); border-color:rgba(255,255,255,0.3); box-shadow:0 8px 15px rgba(0,0,0,0.3);}
            body.light-mode .dock-icon { background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.05); } body.light-mode .dock-icon:hover { background:rgba(0,0,0,0.1); border-color:rgba(0,0,0,0.2); }
            
            #start-menu { position:absolute; bottom:100px; left:50%; transform:translateX(-50%); width:400px; background:rgba(25, 35, 45, 0.85); backdrop-filter:blur(40px); border-radius:20px; box-shadow:0 25px 60px rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:100000; pointer-events:auto;}
            #start-menu.open { display:flex; animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            body.light-mode #start-menu { background:rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.1); color: #222;}
            .start-header { background: linear-gradient(135deg, rgba(0,0,0,0.2), transparent); color:white; padding:25px; font-weight:600; display:flex; align-items:center; gap: 15px; border-bottom:1px solid rgba(255,255,255,0.05);}
            .start-item { padding:12px 20px; cursor:pointer; display:flex; align-items:center; gap:15px; font-size:14px; font-weight:500; transition: 0.2s; border-radius: 12px; margin: 4px 12px; background:rgba(255,255,255,0.02);}
            .start-item:hover { background:var(--accent); color:white; transform: translateX(5px); box-shadow:0 4px 10px rgba(0,0,0,0.2); }
            
            #desktop-icons { display:grid; grid-template-columns: repeat(auto-fill, 90px); grid-auto-rows: 100px; gap: 10px; padding: 20px; pointer-events:none; position:absolute; top:0; left:0; width:100%; height:100%; z-index:10; align-content:start;}
            .icon { width:100%; height:100%; cursor:pointer; transition: 0.2s; border-radius:12px; padding:10px 5px; pointer-events:auto; text-align:center; color:white; font-size:12px; font-weight:500; text-shadow:0 1px 3px rgba(0,0,0,0.8); display:flex; flex-direction:column; align-items:center; justify-content:center;} 
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
            
            .gemi-notif { position:fixed; top:20px; right:20px; background: rgba(20, 30, 40, 0.9); backdrop-filter: blur(25px); border: 1px solid var(--accent); border-radius: 12px; padding: 15px 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 15px; color: white; width: 320px; z-index:999999; animation: popIn 0.4s forwards; }
        `;
        document.head.appendChild(s);
    }

    async loadDependencies() {
        window.GemiRegistry = { ...window.GemiCoreApps };
        try {
            let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}');
            let globalNetwork = JSON.parse(localStorage.getItem('GemiOS_GlobalNetwork') || '[]');
            for(let cFile in customApps) { window.GemiRegistry[cFile] = { ...customApps[cFile], isCustom: true }; }
            globalNetwork.forEach(gApp => { window.GemiRegistry[gApp.title.replace(/\s/g, '') + '_net.app'] = { ...gApp, isNetwork: true }; });
        } catch(e) {}
    }

    notify(title, msg, success=true) { 
        const n = document.createElement('div'); n.className = 'gemi-notif'; 
        n.innerHTML = `<div style="font-size:20px;">${success?'✅':'⚠️'}</div><div><div style="font-weight:bold;">${title}</div><div style="font-size:12px;">${msg}</div></div>`; 
        document.body.appendChild(n); setTimeout(() => n.remove(), 4000); 
    }
    toggleTheme(){ this.theme.toggleTheme(); }

    _buildUI() {
        const root = document.createElement('div'); root.id='os-root'; root.style.cssText='width:100vw;height:100vh;position:absolute;top:0;left:0';
        root.innerHTML = `
        <div id="desktop-bg"></div>
        <div id="widget-notes"><div style="font-weight:bold;margin-bottom:5px;">📌 Sticky Note</div><textarea id="sticky-text" placeholder="Jot a quick note..." style="width:100%;height:100%;border:none;background:transparent;color:#333;"></textarea></div>
        <div id="desktop-icons"></div><div id="window-layer"></div>
        
        <div id="start-menu">
            <div class="start-header"><div style="font-size:35px;background:rgba(255,255,255,0.1);border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;margin-right:10px;">👑</div><div><div style="font-size:20px;font-weight:600;">Admin</div><div style="font-size:12px;opacity:0.7;">GemiOS 50.0 / <span style="color:var(--accent)">PRO</span></div></div></div>
            <div id="start-menu-items" style="padding:10px; max-height:400px; overflow-y:auto;">
                <div class="start-cat">System Apps</div>
                <div class="start-item" onclick="GemiOS.pm.launch('app_dev')"><span>🛠️</span> GemiDev Studio</div>
                <div class="start-item" onclick="GemiOS.pm.launch('app_maker')"><span>🧩</span> GemiMaker Studio</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_store')"><span>🛍️</span> GemiStore</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_drive')"><span>🗂️</span> Explorer</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_term')"><span>⌨️</span> Terminal</div>
                <div class="start-item" onclick="GemiOS.pm.launch('sys_set')"><span>⚙️</span> Settings</div>
                <div class="start-cat">Utilities & Media</div>
                <div class="start-item" onclick="GemiOS.pm.launch('app_defend')"><span>🛡️</span> GemiDefender</div>
                <div class="start-item" onclick="GemiOS.pm.launch('app_crypt')"><span>📈</span> GemiCrypt</div>
                <div class="start-item" onclick="GemiOS.pm.launch('app_beat')"><span>🥁</span> GemiBeat Maker</div>
            </div>
        </div>

        <div id="taskbar-container">
            <div id="taskbar">
                <div class="start" onclick="document.getElementById('start-menu').classList.toggle('open')">G</div>
                <div id="dock-apps"></div>
                <div style="display:flex;align-items:center;gap:15px;margin-left:15px;padding-left:15px;border-left:1px solid rgba(255,255,255,0.1);">
                    <div id="os-wallet-display" style="font-weight:bold;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px;">🪙 ${this.wallet}</div>
                    <div onclick="GemiOS.toggleTheme()" style="cursor:pointer;font-size:20px;" title="Toggle Theme">🌓</div>
                    <div onclick="location.reload()" style="cursor:pointer;font-size:18px;color:#ff4d4d;" title="Reboot">⏻</div>
                </div>
            </div>
        </div>

        <div id="login-screen" style="position:absolute;top:0;left:0;width:100vw;height:100vh;background:linear-gradient(135deg, #0f2027, #203a43, #2c5364);z-index:999999999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.5s;">
           <div style="font-size:80px;margin-bottom:20px;">👑</div>
           <div style="font-size:24px;color:white;font-weight:bold;margin-bottom:20px;">Admin</div>
           <button class="btn-primary" style="width:200px;font-size:18px;background:var(--accent);color:white;padding:12px;border:none;border-radius:8px;cursor:pointer;font-weight:bold;box-shadow:0 4px 10px rgba(0,0,0,0.3);" onclick="GemiOS.login()">Login</button>
        </div>
        `;
        document.body.appendChild(root);
        const sticky = document.getElementById('sticky-text'); sticky.value = localStorage.getItem('GemiOS_Sticky') || ''; sticky.oninput = () => localStorage.setItem('GemiOS_Sticky', sticky.value);
        let wp = localStorage.getItem('GemiOS_Wall'); if(wp) document.getElementById('desktop-bg').style.background = `url(${wp}) center/cover`;
    }

    renderDesktopIcons() { 
        const desk = document.getElementById('desktop-icons'); desk.innerHTML = ''; 
        const apps = [{id:'sys_drive', icon:'🗂️', t:'Explorer'}, {id:'sys_store', icon:'🛍️', t:'GemiStore'}, {id:'sys_term', icon:'⌨️', t:'Terminal'}, {id:'app_maker', icon:'🧩', t:'GemiMaker'}];
        apps.forEach(a => {
            const el = document.createElement('div'); el.className = 'icon';
            el.innerHTML = `<div>${a.icon}</div>${a.t}`; el.ondblclick = () => this.pm.launch(a.id);
            desk.appendChild(el);
        });
        this.WM._renderDock(); 
    }

    async handleTerm(e, pid, inEl) {
        if(e.key !== 'Enter') return; let cmd = inEl.value.trim(); inEl.value = ''; let out = document.getElementById(`t-out-${pid}`); let curr = this.termStates[pid];
        out.innerHTML += `<br><span style="color:#0078d7">${curr}></span> ${cmd}`; let args = cmd.split(' '); let base = args[0].toLowerCase();
        let log = (msg) => out.innerHTML += `<br>${msg}`; let setPath = (p) => { this.termStates[pid] = p; document.getElementById(`t-path-${pid}`).innerText = p+'>'; };
        try {
            if(base === 'help') log('Available cmds: ls, cd, mkdir, clear');
            else if(base === 'clear') out.innerHTML = '';
            else if(base === 'ls') { let dir = await this.VFS.getDir(curr); if(!dir) log('Directory not found.'); else { let keys = Object.keys(dir); if(!keys.length) log('(empty)'); else keys.forEach(k => log(`- ${k}`)); } }
            else if(base === 'cd') { let tgt = args[1]; if(!tgt) log('Usage: cd [dir]'); else if(tgt === '..') { let parts = curr.split('/'); if(parts.length>1) parts.pop(); setPath(parts.join('/')||'C:'); } else { let np = curr+'/'+tgt; let dir = await this.VFS.getDir(np); if(dir) setPath(np); else log('Directory not found.'); } }
            else if(base === 'mkdir') { let name = args[1]; if(!name) log('Usage: mkdir [name]'); else log((await this.VFS.mkdir(curr, name)) ? 'Created.' : 'Failed.'); }
            else log(`Unknown command: ${base}`);
        } catch(err) { log(`Error: ${err.message}`); }
        out.scrollTop = out.scrollHeight;
    }

    async renderDrive(pid) { 
        let path = this.driveStates[pid]; let elPath = document.getElementById(`d-path-${pid}`); if(elPath) elPath.value = path; 
        let list = document.getElementById(`d-list-${pid}`); let dir = await this.VFS.getDir(path); let html = ''; 
        if(!dir) { if(list) list.innerHTML = "Folder not found."; return; }
        for(let k in dir) { 
            if(typeof dir[k] === 'object') { html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(0,0,0,0.2); border-radius:6px;" onclick="GemiOS.navDrive(${pid}, '${k}')"><div style="font-size:30px;">📁</div><div style="font-size:12px;">${k}</div></div>`; } 
            else { html += `<div style="text-align:center; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px;"><div style="font-size:30px;">📄</div><div style="font-size:12px;">${k}</div></div>`; } 
        } 
        if(html === '') html = '<div style="grid-column: span 4; text-align:center; opacity:0.5; padding:20px;">Folder is empty</div>'; 
        if(list) list.innerHTML = html; 
    }
    navDrive(pid, target) { let curr = this.driveStates[pid]; if(target === 'UP') { let parts = curr.split('/'); if(parts.length > 1) parts.pop(); this.driveStates[pid] = parts.join('/') || 'C:'; } else { this.driveStates[pid] = curr + '/' + target; } this.renderDrive(pid); }

    async renderStore(pid) { 
        let desk = await this.VFS.getDir('C:/Users/Admin/Desktop') || {}; let h = ''; 
        for(let f in window.GemiRegistry) { 
            let a = window.GemiRegistry[f]; if(!a.desc || a.tag === 'sys') continue;
            let isInst = desk[f] !== undefined; let bId = `st-btn-${a.id}-${pid}`; let price = a.price || 0;
            let btnHtml = isInst ? `<button id="${bId}" class="btn-sec" style="width:100%; margin-top:10px;" disabled>Installed</button>` : `<button id="${bId}" class="btn-primary" style="width:100%; margin-top:10px;" onclick="GemiOS.buyApp('${f}', '${a.id}', ${pid}, '${bId}', ${price}, ${a.isNetwork ? 'true' : 'false'})">${price === 0 ? 'Free' : `Buy (🪙 ${price})`}</button>`; 
            h += `<div class="sys-card" style="display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0;"><div style="display:flex; align-items:center; gap:15px;"><div style="font-size:35px;">${a.icon}</div><div><div style="font-weight:bold; font-size:16px;">${a.title}</div><div style="font-size:11px; opacity:0.7;">${a.desc}</div></div></div>${btnHtml}</div>`; 
        } 
        document.getElementById(`store-list-${pid}`).innerHTML = h; 
    }

    async buyApp(filename, appId, pid, btnId, price, isNetwork = false) { 
        if(this.wallet < price) { this.notify("Failed", `Insufficient funds. Needs 🪙 ${price}`, false); return; }
        this.wallet -= price; this._saveWallet();
        if(await this.VFS.write('C:/Users/Admin/Desktop', filename, appId)) { this.notify("Success", `Downloaded ${filename}!`); this.renderDesktopIcons(); let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-sec'; btn.innerText = 'Installed'; btn.disabled = true; } } 
    }

    scanMem(pid) {
        let btn = document.getElementById("av-btn-mem-" + pid); let log = document.getElementById("av-log-" + pid); let icon = document.getElementById("av-icon-" + pid); let status = document.getElementById("av-status-" + pid);
        btn.disabled = true; log.innerHTML += "<br>> Initializing Sweep...<br>"; icon.innerText = "🧠"; status.innerText = "Analyzing PIDs..."; status.style.color = "#ffb400";
        setTimeout(() => {
            log.innerHTML += "<span style='color:#38ef7d; font-weight:bold;'>Memory is clean. No unauthorized hooks.</span><br>";
            icon.innerText = "🛡️"; status.innerText = "Zero-Trust Active"; status.style.color = "#38ef7d"; btn.disabled = false; this.audio.play("success"); log.scrollTop = log.scrollHeight;
        }, 1000);
    }

    tradeCrypt(action, pid) {
        if(typeof this.cryptPrice === 'undefined') this.cryptPrice = 100.00;
        if(typeof this.cryptShares === 'undefined') this.cryptShares = 0;
        let cost = Math.floor(this.cryptPrice);
        if(action === 'buy') {
            if(this.wallet >= cost) { this.wallet -= cost; this.cryptShares++; this._saveWallet(); let shEl = document.getElementById(`crypt-shares-${pid}`); if(shEl) shEl.innerText = this.cryptShares; this.audio.play('buy'); } 
            else { this.notify("Trade Failed", "Insufficient funds.", false); this.audio.play('error'); }
        } else {
            if(this.cryptShares > 0) { this.wallet += cost; this.cryptShares--; this._saveWallet(); let shEl = document.getElementById(`crypt-shares-${pid}`); if(shEl) shEl.innerText = this.cryptShares; this.audio.play('open'); } 
            else { this.notify("Trade Failed", "No shares to sell.", false); this.audio.play('error'); }
        }
    }
  }

  (async () => { const os = new Core(); await os.init(); })();
})();
