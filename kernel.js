/*=====================================================================
   GemiOS CLOUD HYPERVISOR - v50.0 (STABILITY MASTER)
=====================================================================*/
(() => {
  // 🧹 FIX: Physically clear the BIOS text and reset CSS padding
  document.body.innerHTML = '';
  document.body.style.padding = '0';

  class EventBus { constructor() { this.handlers = new Map(); } on(ev, fn) { if (!this.handlers.has(ev)) this.handlers.set(ev, []); this.handlers.get(ev).push(fn); } off(ev, fn) { const arr = this.handlers.get(ev); if (!arr) return; this.handlers.set(ev, arr.filter(f => f !== fn)); } emit(ev, data) { const arr = this.handlers.get(ev); if (!arr) return; arr.forEach(fn => fn(data)); } }

  class VFS {
    constructor(bus) { this.bus = bus; this.MAX_STORAGE = 10 * 1024 * 1024; this.DB_NAME = 'GemiOS_Fs'; this.STORE = 'nodes'; this.db = null; }
    async _open() { if (this.db) return this.db; return new Promise((res, rej) => { const req = indexedDB.open(this.DB_NAME, 1); req.onupgradeneeded = ev => { const db = ev.target.result; db.createObjectStore(this.STORE, { keyPath: 'path' }); }; req.onsuccess = ev => { this.db = ev.target.result; res(this.db); }; req.onerror = ev => rej(ev.target.error); }); }
    async _store(mode = 'readonly') { const db = await this._open(); return db.transaction(this.STORE, mode).objectStore(this.STORE); }
    async ensureRoot() { const store = await this._store('readwrite'); const rec = await store.get('root'); if (!rec) { await store.add({ path: 'root', data: { "C:": { System: { "boot.log": "GemiOS V50.0 Initialized." }, Users: { Admin: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} } } } } }); } }
    async getNode(path) { const store = await this._store(); const rec = await store.get(path); return rec?.data ?? null; }
    async saveNode(path, data) { const store = await this._store('readwrite'); await store.put({ path, data }); this.bus.emit('vfs:changed'); return true; }
    async getDir(dirPath, create = false) { const node = await this.getNode('root'); if(!node) return null; let parts = dirPath.split('/').filter(p => p); let curr = node; for(let p of parts) { if(curr[p] === undefined) { if(create) curr[p] = {}; else return null; } curr = curr[p]; } return curr; }
    async write(dirPath, file, data) { const rootNode = await this.getNode('root'); let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) curr[p] = {}; curr = curr[p]; } curr[file] = data; return await this.saveNode('root', rootNode); }
    async read(dirPath, file) { const dir = await this.getDir(dirPath); return dir?.[file] ?? null; }
    async delete(dirPath, file) { const rootNode = await this.getNode('root'); let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) return false; curr = curr[p]; } delete curr[file]; return await this.saveNode('root', rootNode); }
  }

  class WindowManager {
    constructor(bus, audio){ this.bus = bus; this.audio = audio; this.zIndex = 100; this.bus.on('wm:create-window', cfg => this._createWindow(cfg)); }
    _createWindow({pid, app, fileData}) {
      const wid = `win_${pid}`;
      const content = typeof app.html === 'function' ? app.html(pid, fileData) : app.htmlString;
      const html = `<div class="win win-animated" id="${wid}" onmousedown="GemiOS.WM.focus('${wid}')">
          <div class="title-bar" onmousedown="GemiOS.WM.drag(event,'${wid}')">
            <span>${app.icon} ${app.title}</span>
            <div onmousedown="event.stopPropagation()"><button class="ctrl-btn close-btn" onclick="GemiOS.pm.kill(${pid})">×</button></div>
          </div>
          <div class="content" id="content_${pid}">${content}</div>
        </div>`;
      document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);
      this._renderDock();
    }
    focus(wid){ const el = document.getElementById(wid); if (el) el.style.zIndex = ++this.zIndex; }
    drag(e,wid){ const win = document.getElementById(wid); const offsetX = e.clientX - win.offsetLeft; const offsetY = e.clientY - win.offsetTop; this.focus(wid); const move = ev => { win.style.left = ev.clientX - offsetX + 'px'; win.style.top = Math.max(0, ev.clientY - offsetY) + 'px'; }; const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); }; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); }
    _renderDock() {
        const dock = document.getElementById('dock-apps');
        if(!dock) return;
        let html = '';
        const pinned = ['sys_drive', 'sys_store', 'app_maker'];
        pinned.forEach(id => {
            const app = window.GemiRegistry[id];
            if(app) html += `<div class="dock-icon" onclick="GemiOS.pm.launch('${id}')">${app.icon}</div>`;
        });
        dock.innerHTML = html;
    }
  }

  class Core {
    constructor(){
      this.bus = new EventBus(); this.VFS = new VFS(this.bus); this.audio = { play: ()=>{} }; // Placeholder
      this.pm = { launch: (id)=>this.launch(id), kill: (pid)=>this.bus.emit('wm:close-window', pid), processes: new Map() };
      this.WM = new WindowManager(this.bus, this.audio);
      window.GemiOS = this; 
      this.bus.on('wm:close-window', pid => { document.getElementById(`win_${pid}`).remove(); });
    }

    async launch(id) { 
        const app = window.GemiRegistry[id];
        const pid = Math.floor(Math.random()*9000);
        this.pm.processes.set(pid, {id, app});
        this.bus.emit('wm:create-window', {pid, app});
    }

    async init(){
      this.injectStyles();
      this._buildUI();
      await this.VFS.ensureRoot();
      await this.loadDependencies();
      this.renderDesktopIcons();
    }

    injectStyles() {
        const s = document.createElement('style');
        s.textContent = `
            body { margin:0; overflow:hidden; background:linear-gradient(135deg, #0f2027, #2c5364); font-family:sans-serif; }
            .win { position:absolute; background:rgba(255,255,255,0.1); backdrop-filter:blur(20px); border-radius:12px; border:1px solid rgba(255,255,255,0.2); display:flex; flex-direction:column; width:400px; height:300px; color:white; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
            .title-bar { padding:10px; background:rgba(0,0,0,0.2); display:flex; justify-content:space-between; cursor:grab; }
            .content { padding:15px; flex-grow:1; overflow:auto; }
            .ctrl-btn { border:none; border-radius:50%; width:12px; height:12px; cursor:pointer; }
            .close-btn { background:#ff5f56; }
            #taskbar-container { position:fixed; bottom:20px; width:100%; display:flex; justify-content:center; }
            #taskbar { background:rgba(0,0,0,0.5); backdrop-filter:blur(20px); padding:10px 20px; border-radius:20px; display:flex; gap:15px; border:1px solid rgba(255,255,255,0.1); }
            .dock-icon { font-size:24px; cursor:pointer; transition:0.2s; } .dock-icon:hover { transform:translateY(-5px); }
            #desktop-icons { display:grid; grid-template-columns: repeat(auto-fill, 80px); gap:20px; padding:20px; }
            .icon { text-align:center; color:white; font-size:12px; cursor:pointer; } .icon div { font-size:40px; }
        `;
        document.head.appendChild(s);
    }

    async loadDependencies() {
        window.GemiRegistry = {};
        const base = "https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/";
        try {
            let r1 = await fetch(base + "registry.js?t=" + Date.now());
            if(r1.ok) eval(await r1.text());
            let r2 = await fetch(base + "engine.js?t=" + Date.now());
            if(r2.ok) eval(await r2.text());
        } catch(e) { console.error("Cloud dependency failure."); }
    }

    _buildUI() {
        const root = document.createElement('div');
        root.innerHTML = `<div id="desktop-bg"></div><div id="desktop-icons"></div><div id="window-layer"></div>
        <div id="taskbar-container"><div id="taskbar"><div id="dock-apps"></div></div></div>`;
        document.body.appendChild(root);
    }

    async renderDesktopIcons() {
        const desk = document.getElementById('desktop-icons');
        const apps = [{id:'sys_drive', icon:'🗂️', title:'Explorer'}, {id:'sys_store', icon:'🛍️', title:'Store'}];
        apps.forEach(a => {
            const el = document.createElement('div'); el.className = 'icon';
            el.innerHTML = `<div>${a.icon}</div>${a.title}`;
            el.onclick = () => this.launch(a.id);
            desk.appendChild(el);
        });
        this.WM._renderDock();
    }
  }

  const os = new Core(); os.init();
})();
