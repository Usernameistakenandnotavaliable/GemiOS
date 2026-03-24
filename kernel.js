// =========================================================================
// GemiOS CLOUD HYPERVISOR - v49.0 (THE CREATOR UPDATE)
// =========================================================================
(() => {
  class EventBus { constructor() { this.handlers = new Map(); } on(ev, fn) { if (!this.handlers.has(ev)) this.handlers.set(ev, []); this.handlers.get(ev).push(fn); } off(ev, fn) { const arr = this.handlers.get(ev); if (!arr) return; this.handlers.set(ev, arr.filter(f => f !== fn)); } emit(ev, data) { const arr = this.handlers.get(ev); if (!arr) return; arr.forEach(fn => fn(data)); } }

  class VFS {
    constructor(bus) { this.bus = bus; this.MAX_STORAGE = 10 * 1024 * 1024; this.DB_NAME = 'GemiOS_Fs'; this.STORE = 'nodes'; this.db = null; }
    async _open() { if (this.db) return this.db; return new Promise((res, rej) => { const req = indexedDB.open(this.DB_NAME, 1); req.onupgradeneeded = ev => { const db = ev.target.result; db.createObjectStore(this.STORE, { keyPath: 'path' }); }; req.onsuccess = ev => { this.db = ev.target.result; res(this.db); }; req.onerror = ev => rej(ev.target.error); }); }
    async _store(mode = 'readonly') { const db = await this._open(); return db.transaction(this.STORE, mode).objectStore(this.STORE); }
    async ensureRoot() { const store = await this._store('readwrite'); const rec = await store.get('root'); if (!rec) { await store.add({ path: 'root', data: { "C:": { System: { "boot.log": "GemiOS V49.0 Initialized.", "sys_mail.json": "[]" }, Users: { Admin: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} } } } } }); } }
    async getNode(path) { const store = await this._store(); const rec = await store.get(path); return rec?.data ?? null; }
    async saveNode(path, data) { const size = new TextEncoder().encode(JSON.stringify(data)).length; const usage = await this.getUsage(); if (usage.used + size > this.MAX_STORAGE) { this.bus.emit('notify', {title:'Disk Full!',msg:'NVRAM quota exceeded.',success:false}); return false; } const store = await this._store('readwrite'); await store.put({ path, data }); this.bus.emit('vfs:changed'); return true; }
    async getUsage() { const store = await this._store(); const all = await store.getAll(); const used = all.reduce((t, r) => t + new TextEncoder().encode(JSON.stringify(r.data)).length, 0); return { used, max: this.MAX_STORAGE }; }
    async getDir(dirPath, create = false) { const node = await this.getNode(dirPath); if (node && typeof node === 'object') return node; if (!node && create) { await this.saveNode(dirPath, {}); return {}; } return null; }
    async read(dirPath, file) { const dir = await this.getDir(dirPath); return dir?.[file] ?? null; }
    async write(dirPath, file, data) { const dir = await this.getDir(dirPath, true); const backup = dir[file]; dir[file] = data; const ok = await this.saveNode(dirPath, dir); if (!ok) { if (backup) dir[file] = backup; else delete dir[file]; } return ok; }
    async delete(dirPath, file) { const dir = await this.getDir(dirPath); if (!dir || !(file in dir)) return false; delete dir[file]; return await this.saveNode(dirPath, dir); }
    async format() { const db = await this._open(); db.close(); indexedDB.deleteDatabase(this.DB_NAME); location.reload(); }
  }

  class Sanitizer {
    static sanitizeHTML(raw) { return DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['div','span','button','input','textarea','canvas','img','video','audio','style','b','i','u','br'], ALLOWED_ATTR: ['class','id','style','src','href','type','value','placeholder','data-*','title'], FORBID_ATTR: ['onerror','onload','onclick','onfocus'] }); }
  }

  class Theme {
    constructor(bus){ this.bus=bus; }
    async applyFromStorage(){ const accent = localStorage.getItem('GemiOS_Accent')||'#0078d7'; document.documentElement.style.setProperty('--accent',accent); const theme = localStorage.getItem('GemiOS_Theme')||'dark'; document.documentElement.dataset.theme = theme; }
    toggleTheme(){ const cur = document.documentElement.dataset.theme==='light'?'dark':'light'; localStorage.setItem('GemiOS_Theme',cur); document.documentElement.dataset.theme=cur; this.bus.emit('theme:toggled',cur); }
  }

  class AudioEngine {
    constructor(bus) { this.bus = bus; this.actx = null; this.sounds = { open: (t)=> this._tone(440,880,t), close: (t)=> this._tone(880,440,t), click: (t)=> this._tone(1000,1000,t,0.05,0.05), success: (t)=> this._chord([523.25,659.25,783.99],t), error: (t)=> this._tone(150,150,t,0.1,0.3) }; }
    _init() { if (!this.actx) this.actx = new (window.AudioContext||window.webkitAudioContext)(); if (this.actx.state === 'suspended') this.actx.resume(); }
    _tone(start,end,base,gStart=0.1,gEnd=0){ this._init(); const t=this.actx.currentTime; const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='sine'; osc.frequency.setValueAtTime(start,t); osc.frequency.exponentialRampToValueAtTime(end,t+0.2); gain.gain.setValueAtTime(gStart,t); gain.gain.exponentialRampToValueAtTime(gEnd+0.0001,t+0.3); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t); osc.stop(t+0.3); }
    _chord(freqs,base){ this._init(); const t=this.actx.currentTime; freqs.forEach((f,i)=>{ const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='sine'; osc.frequency.setValueAtTime(f,t+i*0.1); gain.gain.setValueAtTime(0,t+i*0.1); gain.gain.linearRampToValueAtTime(0.2,t+i*0.1+0.5); gain.gain.exponentialRampToValueAtTime(0.0001,t+i*0.1+3); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t+i*0.1); osc.stop(t+i*0.1+3); }); }
    play(name){ if (localStorage.getItem('GemiOS_Driver_Audio')==='false') return; const fn=this.sounds[name]; if (fn) fn();}
  }

  class ProcessManager {
    constructor(bus, audio){ this.bus=bus; this.audio=audio; this.nextPid=1000; this.processes=new Map(); this.bus.on('process:kill', pid=>this.kill(pid)); }
    async launch(appId,fileData=null){ const app = window.GemiRegistry[appId]; if (!app){ this.bus.emit('notify',{title:'Error',msg:`App ${appId} missing.`,success:false}); return; } const pid = ++this.nextPid; this.processes.set(pid,{app,pid}); this.audio.play('click'); this.bus.emit('wm:create-window',{pid,app,fileData}); if (app.onLaunch) app.onLaunch(pid); }
    async kill(pid){ if (!this.processes.has(pid)) return; const app = this.processes.get(pid).app; if(app.onKill) app.onKill(pid); this.bus.emit('wm:close-window',pid); setTimeout(()=>{ this.processes.delete(pid); },250); }
  }

  class WindowManager {
    constructor(bus, audio){ this.bus = bus; this.audio = audio; this.zIndex = 100; this.enableAnim = true; this.bus.on('wm:create-window', cfg => this._createWindow(cfg)); this.bus.on('wm:close-window', pid => this._closeWindow(pid)); }
    _createWindow({pid, app, fileData}) {
      const wid = `win_${pid}`;
      // V49 Note: GemiMaker needs raw HTML execution to function correctly outside of sandboxed iframes.
      const isSystem = (app.tag === 'sys' || app.tag === 'pro' || app.tag === 'edu');
      const rawHTML = typeof app.html === 'function' ? app.html(pid, fileData) : app.htmlString;
      
      let innerContent = isSystem ? rawHTML : `<iframe sandbox="allow-scripts allow-same-origin" srcdoc="${Sanitizer.sanitizeHTML(rawHTML).replace(/"/g,'&quot;')}" style="width:100%;height:100%;border:none;"></iframe>`;

      const html = `
        <div class="win win-animated" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${app.width}px; z-index:${++this.zIndex};" onmousedown="GemiOS.WM.focus('${wid}')">
          <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event,'${wid}')">
            <span>${app.title}</span>
            <div onmousedown="event.stopPropagation()">
              <button class="ctrl-btn min-btn" onclick="GemiOS.WM.minimize('${wid}')">-</button>
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
    drag(e,wid){ const win = document.getElementById(wid); if (!win || win.dataset.maximized==='true') return; const offsetX = e.clientX - win.offsetLeft; const offsetY = e.clientY - win.offsetTop; this.focus(wid); let iframes = document.querySelectorAll('iframe'); iframes.forEach(ifr => ifr.style.pointerEvents = 'none'); const move = ev => { win.style.left = ev.clientX - offsetX + 'px'; win.style.top = Math.max(0, ev.clientY - offsetY) + 'px'; }; const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); iframes.forEach(ifr => ifr.style.pointerEvents = 'auto'); }; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); }
    maximize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.dataset.maximized==='true'){ win.style.top = win.dataset.pT; win.style.left = win.dataset.pL; win.style.width = win.dataset.pW; win.style.height= win.dataset.pH; win.dataset.maximized='false'; win.style.borderRadius='12px'; } else { win.dataset.pT = win.style.top; win.dataset.pL = win.style.left; win.dataset.pW = win.style.width; win.dataset.pH = win.style.height; win.style.top = '0'; win.style.left = '0'; win.style.width = '100vw'; win.style.height = 'calc(100vh - 60px)'; win.dataset.maximized='true'; win.style.borderRadius='0'; } }
    minimize(wid){ const win = document.getElementById(wid); if (!win) return; const tb = document.getElementById('tb-item-'+win.id.split('_')[1]); if (win.style.opacity === '0'){ win.style.opacity='1'; win.style.transform='scale(1) translateY(0)'; win.style.pointerEvents='auto'; tb.classList.add('active'); } else { win.style.opacity='0'; win.style.transform='scale(0.9) translateY(20px)'; win.style.pointerEvents='none'; tb.classList.remove('active'); } }
    _addTaskbarItem(pid,title){ const apps = document.getElementById('taskbar-apps'); const itm = document.createElement('div'); itm.id = `tb-item-${pid}`; itm.className = 'tb-item active'; itm.textContent = title.length>12? title.slice(0,12) : title; itm.onclick = () => this.minimize(`win_${pid}`); apps.appendChild(itm); }
    _closeWindow(pid){ const win = document.getElementById(`win_${pid}`); if (win){ win.style.opacity = '0'; win.style.transform = 'scale(0.9)'; setTimeout(() => { win.remove(); const tb = document.getElementById(`tb-item-${pid}`); if (tb) tb.remove(); this.audio.play('close'); }, 200); } }
  }

  class Core {
    constructor(){
      this.bus = new EventBus(); this.VFS = new VFS(this.bus); this.audio = new AudioEngine(this.bus); this.theme = new Theme(this.bus); this.pm = new ProcessManager(this.bus, this.audio); this.WM = new WindowManager(this.bus, this.audio); this.user = 'Admin'; this.edition = localStorage.getItem('GemiOS_Edition') || 'Pro'; this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet')) || 500;
      window.GemiOS = this; // Global Expose
    }

    async init(){
      await this.VFS.ensureRoot(); await this.theme.applyFromStorage(); await this.loadDependencies();
      this._buildUI(); this._renderDesktopIcons();
    }

    // V49 MULTI-FILE LOADER (Downloads registry AND the new engine file)
    async loadDependencies() {
        try {
            // Load Registry
            let r1 = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/registry.js?t=" + Date.now());
            if(r1.ok) { let code1 = await r1.text(); eval(code1); }
            
            // Load New Engine Module!
            let r2 = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/engine.js?t=" + Date.now());
            if(r2.ok) { let code2 = await r2.text(); eval(code2); }

        } catch(e) { console.error("Failed to load external dependencies."); }
    }

    notify(title,msg,success=true){ this.bus.emit('notify',{title,msg,success}); }
    toggleTheme(){ this.theme.toggleTheme(); }

    _buildUI(){
      const root = document.createElement('div'); root.id='os-root'; root.style.cssText='width:100vw;height:100vh;position:absolute;top:0;left:0';
      root.innerHTML = `<div id="desktop-bg"></div><div id="desktop-icons"></div><div id="window-layer"></div>
        <div id="start-menu"><div class="start-header"><div style="font-size:35px;margin-right:10px;">👑</div><div><div style="font-size:20px;font-weight:600;">${this.user}</div><div style="font-size:12px;opacity:0.7;">GemiOS 49.0</div></div></div>
          <div id="start-menu-items"><div class="start-item" onclick="GemiOS.pm.launch('app_maker')"><span>🧩</span> GemiMaker Studio</div><div class="start-item" onclick="GemiOS.pm.launch('sys_store')"><span>🛍️</span> Store</div></div>
        </div>
        <div id="taskbar-container"><div id="taskbar"><div class="start" onclick="document.getElementById('start-menu').classList.toggle('open')">G</div><div id="taskbar-apps"></div><div style="display:flex;align-items:center;gap:15px;margin-left:auto;padding-left:15px;">
        <div id="os-wallet-display" style="font-weight:bold;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px;">🪙 ${this.wallet}</div><div onclick="GemiOS.toggleTheme()" style="cursor:pointer;font-size:20px;">🌓</div><div id="clock" style="font-weight:600;font-size:14px;letter-spacing:1px;">--:--</div></div></div></div><div id="notif-container"></div>`;
      document.body.innerHTML = ''; document.body.appendChild(root);
      setInterval(()=>{ document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); },1000);
      this.bus.on('notify', ({title,msg,success})=>{ const container = document.getElementById('notif-container'); const note = document.createElement('div'); note.className='gemi-notif'; note.innerHTML = `<div style="font-size:20px;">${success?'✅':'🔔'}</div><div><div style="font-weight:bold;">${title}</div><div style="font-size:12px;">${msg}</div></div>`; container.appendChild(note); void note.offsetWidth; note.style.transform='translateX(0)'; note.style.opacity='1'; setTimeout(()=>{ note.style.transform='translateX(120%)'; note.style.opacity='0'; setTimeout(()=>note.remove(),300); },3500); this.audio.play(success?'success':'error'); });
    }

    async _renderDesktopIcons(){
      const desk = document.getElementById('desktop-icons'); desk.innerHTML = '';
      const apps = [{file:'GemiMaker.app', icon:'🧩', id:'app_maker'}, {file:'Store.app', icon:'🛍️', id:'sys_store'}];
      let i=0; apps.forEach(app=>{ const top = 20 + Math.floor(i/10)*100; const left = 20 + (i%10)*90; const el = document.createElement('div'); el.className='icon'; el.style.top=top+'px'; el.style.left=left+'px'; el.innerHTML = `<div>${app.icon}</div>${app.file.replace('.app','')}`; el.ondblclick = ()=> GemiOS.pm.launch(app.id); desk.appendChild(el); i++; });
    }
  }

  (async () => { const os = new Core(); await os.init(); })();
})();
