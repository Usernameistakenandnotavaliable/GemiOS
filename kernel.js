/*=====================================================================
   GemiOS CLOUD HYPERVISOR - v50.1 (THE BACKUP & BIOS UPDATE)
=====================================================================*/

/* -------------------------------------------------------------
   ONE‑TIME‑ONLY GUARD
   -------------------------------------------------------------
   If the kernel has already been booted we stop here.  This must be
   *outside* the IIFE that contains all the class/const/let
   declarations, otherwise the parser would already have seen the
   duplicate identifiers.
   ------------------------------------------------------------- */
if (window.__GEMIOS_BOOTED__) {
    console.warn('⚠️ GemiOS kernel already booted – skipping duplicate load.');
} else {
    window.__GEMIOS_BOOTED__ = true;   // set the flag for any later load attempts

    /* ---------------------------------------------------------
       The original kernel – unchanged apart from being wrapped
       inside the guard’s else‑branch.
       --------------------------------------------------------- */
    (() => {
      document.body.innerHTML = ''; document.body.style.padding = '0';

      class EventBus { constructor() { this.handlers = new Map(); } on(ev, fn) { if (!this.handlers.has(ev)) this.handlers.set(ev, []); this.handlers.get(ev).push(fn); } off(ev, fn) { const arr = this.handlers.get(ev); if (!arr) return; this.handlers.set(ev, arr.filter(f => f !== fn)); } emit(ev, data) { const arr = this.handlers.get(ev); if (!arr) return; arr.forEach(fn => fn(data)); } }

      class VFS {
        constructor(bus) { this.bus = bus; this.MAX_STORAGE = 10485760; this.DB_NAME = 'GemiOS_Fs'; this.STORE = 'nodes'; this.db = null; }
        async _open() { if (this.db) return this.db; return new Promise((res, rej) => { const req = indexedDB.open(this.DB_NAME, 1); req.onupgradeneeded = ev => { const db = ev.target.result; db.createObjectStore(this.STORE, { keyPath: 'path' }); }; req.onsuccess = ev => { this.db = ev.target.result; res(this.db); }; req.onerror = ev => rej(ev.target.error); }); }
        async _store(mode = 'readonly') { const db = await this._open(); return db.transaction(this.STORE, mode).objectStore(this.STORE); }
        async ensureRoot() { const store = await this._store('readwrite'); const rec = await store.get('root'); if (!rec) { await store.add({ path: 'root', data: { "C:": { System: { Snapshots: {} }, Users: { Admin: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} } } } } }); } }
        async getNode(path) { const store = await this._store(); const rec = await store.get(path); return rec?.data ?? null; }
        async saveNode(path, data) { const store = await this._store('readwrite'); await store.put({ path, data }); return true; }
        async getDir(dirPath, create = false) { const node = await this.getNode('root'); if(!node) return null; let parts = dirPath.split('/').filter(p => p); let curr = node; for(let p of parts) { if(curr[p] === undefined) { if(create) curr[p] = {}; else return null; } curr = curr[p]; } return curr; }
        async write(dirPath, file, data) { const rootNode = await this.getNode('root'); let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) curr[p] = {}; curr = curr[p]; } curr[file] = data; return await this.saveNode('root', rootNode); }
        async read(dirPath, file) { const dir = await this.getDir(dirPath); return dir?.[file] ?? null; }
      }

      class Theme {
        constructor(bus){ this.bus=bus; }
        async applyFromStorage(){ 
            const accent = localStorage.getItem('GemiOS_Accent') || '#0078d7'; 
            document.documentElement.style.setProperty('--accent', accent); 
            let theme = localStorage.getItem('GemiOS_Theme');
            if(!theme) { theme = 'dark'; localStorage.setItem('GemiOS_Theme', 'dark'); }
            document.documentElement.dataset.theme = theme; 
            if(theme === 'light') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); 
        }
        toggleTheme(){ 
            const cur = document.documentElement.dataset.theme==='light' ? 'dark' : 'light'; 
            localStorage.setItem('GemiOS_Theme', cur); document.documentElement.dataset.theme=cur; 
            if(cur === 'light') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); 
        }
      }

      class AudioEngine {
        constructor() { this.actx = null; this.sounds = { open: (t)=> this._tone(440,880,t), close: (t)=> this._tone(880,440,t), click: (t)=> this._tone(1000,1000,t,0.05,0.05), success: (t)=> this._chord([523.25,659.25,783.99],t), error: (t)=> this._tone(150,150,t,0.1,0.3) }; }
        _init() { if (!this.actx) this.actx = new (window.AudioContext||window.webkitAudioContext)(); if (this.actx.state === 'suspended') this.actx.resume(); }
        _tone(start,end,t,gStart=0.1,gEnd=0, len=0.3){ this._init(); if(!t) t=this.actx.currentTime; const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='sine'; osc.frequency.setValueAtTime(start,t); osc.frequency.exponentialRampToValueAtTime(end,t+(len*0.6)); gain.gain.setValueAtTime(gStart,t); gain.gain.exponentialRampToValueAtTime(gEnd+0.0001,t+len); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t); osc.stop(t+len); }
        _chord(freqs,t, len=3){ this._init(); if(!t) t=this.actx.currentTime; freqs.forEach((f,i)=>{ const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='sine'; osc.frequency.setValueAtTime(f,t+(i*0.1)); gain.gain.setValueAtTime(0,t+(i*0.1)); gain.gain.linearRampToValueAtTime(0.15,t+(i*0.1)+0.5); gain.gain.exponentialRampToValueAtTime(0.0001,t+(i*0.1)+len); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t+(i*0.1)); osc.stop(t+(i*0.1)+len); }); }
        play(name){ if (localStorage.getItem('GemiOS_Driver_Audio')==='false') return; const fn=this.sounds[name]; if (fn) fn();}
      }

      class ProcessManager {
        constructor(bus, audio){ this.bus=bus; this.audio=audio; this.nextPid=1000; this.processes=new Map(); }
        async launch(appId){ 
            const app = window.GemiRegistry ? window.GemiRegistry[appId] : null; 
            if (!app){ this.bus.emit('notify', {title: 'Error', msg: `App ${appId} missing.`}); return; } 
            const pid = ++this.nextPid; this.processes.set(pid, {id: appId, app}); 
            this.bus.emit('wm:create-window', {pid, app}); 
            let sm = document.getElementById('start-menu'); if(sm) sm.classList.remove('open');
            if (app.onLaunch) app.onLaunch(pid);
        }
        kill(pid){ 
            if (!this.processes.has(pid)) return;
            const app = this.processes.get(pid).app; if(app.onKill) app.onKill(pid);
            let el = document.getElementById(`win_${pid}`); if(el) el.remove(); 
            this.processes.delete(pid); GemiOS.WM._renderDock(); 
            this.audio.play('close');
        }
      }

      class WindowManager {
        constructor(bus, audio){ this.bus = bus; this.audio = audio; this.zIndex = 100; this.bus.on('wm:create-window', cfg => this._createWindow(cfg)); }
        _createWindow({pid, app}) {
          const wid = `win_${pid}`;
          const content = typeof app.html === 'function' ? app.html(pid) : (app.htmlString || '');
          const isSystem = (app.tag === 'sys' || app.tag === 'pro' || app.tag === 'edu' || app.tag === 'fin');
          let safeContent = isSystem ? content : `<iframe sandbox="allow-scripts allow-same-origin" srcdoc="${content.replace(/"/g,'&quot;')}" style="width:100%;height:100%;border:none;"></iframe>`;

          const html = `<div class="win win-animated" id="${wid}" style="z-index:${++this.zIndex}" onmousedown="GemiOS.WM.focus('${wid}')">
              <div class="title-bar" onmousedown="GemiOS.WM.drag(event,'${wid}')">
                <div style="display:flex; align-items:center; gap:8px;"><span>${app.icon}</span> <span>${app.title}</span></div>
                <div onmousedown="event.stopPropagation()"><button class="ctrl-btn min-btn" onclick="GemiOS.WM.minimize('${wid}')">-</button><button class="ctrl-btn close-btn" onclick="GemiOS.pm.kill(${pid})">×</button></div>
              </div>
              <div class="content" id="content_${pid}">${safeContent}</div>
            </div>`;
          document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);
          this.audio.play('open'); this._renderDock(); 
        }
        focus(wid){ const el = document.getElementById(wid); if (el) el.style.zIndex = ++this.zIndex; }
        drag(e,wid){ const win = document.getElementById(wid); const offsetX = e.clientX - win.offsetLeft; const offsetY = e.clientY - win.offsetTop; this.focus(wid); let iframes = document.querySelectorAll('iframe'); iframes.forEach(ifr => ifr.style.pointerEvents = 'none'); const move = ev => { win.style.left = ev.clientX - offsetX + 'px'; win.style.top = Math.max(0, ev.clientY - offsetY) + 'px'; }; const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); iframes.forEach(ifr => ifr.style.pointerEvents = 'auto'); }; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); }
        minimize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.style.opacity === '0'){ win.style.opacity='1'; win.style.transform='scale(1) translateY(0)'; win.style.pointerEvents='auto'; } else { win.style.opacity='0'; win.style.transform='scale(0.9) translateY(40px)'; win.style.pointerEvents='none'; } }
        
        _renderDock() {
            const dock = document.getElementById('dock-apps'); if(!dock) return;
            let runningPids = Array.from(GemiOS.pm.processes.values());
            let allDockApps = ['sys_drive', 'sys_store', 'sys_term', 'sys_set'];
            runningPids.forEach(p => { if(!allDockApps.includes(p.id)) allDockApps.push(p.id); });
            
            let html = '';
            allDockApps.forEach(appId => {
                const app = window.GemiRegistry[appId]; if(!app) return;
                let runningInstance = runningPids.find(p => p.id === appId);
                let indicator = runningInstance ? `<div style="width:4px; height:4px; background:var(--accent); border-radius:50%; position:absolute; bottom:2px;"></div>` : '';
                let clickAction = runningInstance ? `GemiOS.WM.minimize('win_${runningInstance.pid}')` : `GemiOS.pm.launch('${appId}')`;
                html += `<div class="dock-icon" onclick="${clickAction}" title="${app.title}"><div style="font-size:24px;">${app.icon}</div>${indicator}</div>`;
            });
            dock.innerHTML = html;
        }
      }

      window.GemiCoreApps = {
          'sys_term': { tag: 'sys', icon: '💻', title: 'Terminal', width: 500, html: (pid) => `<div id="t-out-${pid}" style="flex-grow:1; background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; overflow-y:auto; border-radius:6px;">GemiOS Shell Active.</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/Admin></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`, onLaunch: (pid) => { setTimeout(()=>document.getElementById('t-in-'+pid).focus(),100); } },
          'sys_drive': { tag: 'sys', icon: '📁', title: 'Explorer', width: 520, html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div><div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px;"></div>`, onLaunch: (pid) => { GemiOS.driveStates[pid] = 'C:/Users/Admin'; GemiOS.renderDrive(pid); } },
          'sys_set': { tag: 'sys', icon: '⚙️', title: 'Settings', width: 420, html: () => `<div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary">Apply</button></div><div class="sys-card" style="border-left:4px solid var(--accent);"><b style="font-size:14px;">System Recovery &amp; Backups</b><br><label style="font-size:12px; display:flex; align-items:center; gap:5px; margin-top:5px;"><input type="checkbox" onchange="localStorage.setItem('GemiOS_AutoBackup', this.checked?'true':'false')" ${localStorage.getItem('GemiOS_AutoBackup')==='true'?'checked':''}> Enable Auto‑Backup before Updates</label><button onclick="GemiOS.createSnapshot()" class="btn-sec" style="margin-top:10px;">Create Manual OS Snapshot</button></div>` },
          'sys_update': { tag: 'sys', icon: '☁️', title: 'Updater', width: 380, html: () => `<div class="sys-card" style="text-align:center; flex-grow:1;"><div style="font-size:40px;">☁️</div><h3 style="margin:5px 0;">Dual‑OTA Updater</h3><p style="font-size:13px; opacity:0.8;">Kernel: <b id="kern-ver">v50.1.0‑BIOS</b></p><div id="upd-stat" style="font-size:12px; min-height:15px; margin-bottom:10px;">Ready to fetch Cloud Update.</div><button onclick="GemiOS.triggerOTA(this)" class="btn-primary">Check for Updates</button></div>` },
          'sys_store': { tag: 'sys', icon: '🛒', title: 'GemiStore', width: 700, html: (pid) => `<div class="sys-card" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg, var(--accent), #000); margin-bottom:10px;"><div style="font-size:24px; font-weight:bold;">GemiStore</div><div style="font-size:40px;">🛒</div></div><div style="display:flex; gap:10px; margin-bottom:15px;"><button onclick="let c=prompt('Paste App Cartridge Code:'); if(c) GemiOS.importCartridge(c);" class="btn-sec" style="flex:1; background:rgba(56,239,125,0.2); border-color:#38ef7d; color:#38ef7d; font-weight:bold; margin:0;">📥 Redeem App Cartridge</button><button onclick="GemiOS.renderStore(${pid})" class="btn-sec" style="flex:1; margin:0;">🔄 Refresh Network</button></div><div id="store-list-${pid}" style="flex-grow:1; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:5px;"></div>`, onLaunch: (pid) => { GemiOS.renderStore(pid); } }
      };

      class Core {
        constructor(){
          this.bus = new EventBus(); 
          this.VFS = new VFS(this.bus); 
          this.theme = new Theme(this.bus); 
          this.audio = new AudioEngine();
          this.pm = new ProcessManager(this.bus, this.audio); 
          this.WM = new WindowManager(this.bus, this.audio);
          this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet')) || 500; 
          this.termStates = {}; 
          this.driveStates = {}; 
          window.GemiOS = this; 
          
          this.bus.on('notify', ({title,msg,success})=>{ 
              const n = document.createElement('div'); n.className = 'gemi-notif'; 
              n.innerHTML = `<div style="font-size:20px;">${success?'✅':'⚠️'}</div><div><div style="font-weight:bold;">${title}</div><div style="font-size:12px;">${msg}</div></div>`; 
              document.body.appendChild(n); setTimeout(() => n.remove(), 4000); 
          });
        }

        async init(){
          this.injectStyles();
          this._buildUI();
          await this.VFS.ensureRoot();
          await this.theme.applyFromStorage();
          await this.loadDependencies();
          this.renderDesktopIcons();
          
          if(localStorage.getItem('GemiOS_AutoBackup') === null) {
              setTimeout(() => {
                  if(confirm("GemiOS v50.1 features NVRAM Snapshots. Would you like to enable Automatic Backups before System Updates? (You can change this later in Settings)")) {
                      localStorage.setItem('GemiOS_AutoBackup', 'true');
                  } else { localStorage.setItem('GemiOS_AutoBackup', 'false'); }
              }, 2000);
          }
        }

        login() {
            this.audio._init(); 
            this.audio.play('success'); 
            document.getElementById('login-screen').style.opacity = '0';
            setTimeout(() => document.getElementById('login-screen').remove(), 500);
            
            if(!localStorage.getItem('GemiOS_V50_1_Celebrated')) {
                setTimeout(() => {
                    this.bus.emit('notify', {title: "🏆 V50.1 BIOS UPDATE", msg: "Diagnostics & Snapshots are active!", success: true});
                    let c = document.createElement('canvas'); c.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999999;pointer-events:none;'; document.body.appendChild(c);
                    let ctx = c.getContext('2d'); c.width = window.innerWidth; c.height = window.innerHeight;
                    let pieces = Array.from({length: 150}, () => ({ x: Math.random() * c.width, y: -20, vx: (Math.random()-0.5)*5, vy: Math.random()*5+2, color: ['#ffb400','#ff00cc','#38ef7d','#4db8ff'][Math.floor(Math.random()*4)] }));
                    let anim = setInterval(() => { ctx.clearRect(0,0,c.width,c.height); pieces.forEach(p => { p.x += p.vx; p.y += p.vy; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 8, 8); }); if(pieces.every(p => p.y > c.height)) { clearInterval(anim); c.remove(); } }, 16);
                    localStorage.setItem('GemiOS_V50_1_Celebrated', 'true');
                }, 1000);
            }
        }

        injectStyles() {
            const s = document.createElement('style');
            s.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                :root { --accent: #0078d7; }
                body { margin:0 !important; padding:0 !important; background:linear-gradient(135deg, #0f2027, #2c5364); font-family:'Inter', "Segoe UI Emoji", "Apple Color Emoji", sans-serif !important; overflow:hidden; user-select:none; }
                body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #222 !important; }
                @keyframes popIn { 0% { opacity:0; transform:scale(0.9) translateY(20px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; } body.light-mode ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }

                .win { position:absolute; background:rgba(20, 30, 40, 0.75); backdrop-filter:blur(20px); border-radius:12px; border:1px solid rgba(255,255,255,0.1); display:flex; flex-direction:column; pointer-events:auto; overflow:hidden; color:white; box-shadow:0 20px 50px rgba(0,0,0,0.5); }
                .win-animated { animation: popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards; transition:width 0.3s, height 0.3s, top 0.3s, left 0.3s; }
                body.light-mode .win { background: rgba(255,255,255,0.85); border: 1px solid var(--accent); color: #222; box-shadow: 0 20px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }

                .title-bar { padding:10px 15px; font-weight:600; font-size:13px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05); cursor:grab; background:rgba(0,0,0,0.2);}
                body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.05); background:rgba(0,0,0,0.03);}
                .content { padding:15px; flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; }
                .ctrl-btn { border:none; color:white; cursor:pointer; width:14px; height:14px; border-radius:50%; font-size:0px; transition:0.2s; display:inline-flex; align-items:center; justify-content:center; margin-left:6px; box-shadow:inset 0 1px 1px rgba(255,255,255,0.3);}
                .ctrl-btn:hover { font-size: 10px; font-weight:bold; }
                .close-btn { background:#ff5f56; } .min-btn { background:#ffbd2e; } .snap-btn { background:#27c93f; }

                #taskbar-container { position:absolute; bottom:20px; width:100%; display:flex; justify-content:center; pointer-events:none; z-index:99999; }
                #taskbar { pointer-events:auto; height:65px; background:rgba(20, 25, 30, 0.6); backdrop-filter:blur(30px); display:flex; align-items:center; padding: 0 20px; border-radius:24px; border:1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 35px rgba(0,0,0,0.5); gap: 15px;}
                body.light-mode #taskbar { background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.1); color: #222; }

                .start { width:45px; height:45px; background:linear-gradient(135deg, var(--accent), #005a9e); border-radius:12px; border:1px solid rgba(255,255,255,0.2); text-align:center; line-height:45px; cursor:pointer; font-weight: 600; font-size: 22px; transition:0.2s;}
                .start:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); border-color:white; }

                #dock-apps { display:flex; align-items:center; gap:8px; border-left:1px solid rgba(255,255,255,0.1); padding-left:15px; border-right:1px solid rgba(255,255,255,0.1); padding-right:15px;}
                .dock-icon { width:45px; height:45px; border-radius:12px; display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer; transition:0.2s; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.05); position:relative;}
                .dock-icon:hover { background:rgba(255,255,255,0.15); transform:translateY(-5px); border-color:rgba(255,255,255,0.3); box-shadow:0 8px 15px rgba(0,0,0,0.3);}
                body.light-mode .dock-icon { background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.05); } body.light-mode .dock-icon:hover { background:rgba(0,0,0,0.1); border-color:rgba(0,0,0,0.2); }

                #start-menu { position:absolute; bottom:100px; left:50%; transform:translateX(-50%); width:400px; background:rgba(25, 35, 45, 0.85); backdrop-filter:blur(40px); border-radius:20px; border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:100000; pointer-events:auto;}
                #start-menu.open { display:flex; animation: slideUp 0.3s forwards; }
                body.light-mode #start-menu { background:rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.1); color: #222;}
                .start-header { background: linear-gradient(135deg, rgba(0,0,0,0.2), transparent); color:white; padding:25px; font-weight:600; display:flex; align-items:center; gap: 15px; border-bottom:1px solid rgba(255,255,255,0.05);}
                body.light-mode .start-header { color:#222; border-bottom:1px solid rgba(0,0,0,0.05);}
                .start-item { padding:12px 20px; cursor:pointer; display:flex; align-items:center; gap:15px; font-size:14px; transition:0.2s; border-radius: 12px; margin: 4px 12px; background:rgba(255,255,255,0.02);}
                .start-item:hover { background:var(--accent); color:white; transform: translateX(5px); }
                body.light-mode .start-item:hover { background:var(--accent); color:white; }

                /* DESKTOP GRID */
                #desktop-icons { display:grid; grid-template-columns: repeat(auto-fill, 90px); grid-auto-rows: min-content; gap: 10px; padding: 20px; pointer-events:none; position:absolute; top:0; left:0; width:100%; height:100%; z-index:10; align-content:start;}
                .icon { pointer-events:auto; text-align:center; color:white; font-size:12px; cursor:pointer; transition:0.2s; border-radius:12px; padding:10px 5px;} 
                .icon:hover { background:rgba(255,255,255,0.1); transform:translateY(-2px); backdrop-filter:blur(5px); }
                .icon div { font-size: 40px; margin-bottom: 8px;}
                body.light-mode .icon { color: #222; text-shadow:0 1px 2px rgba(255,255,255,0.8); }

                #desktop-bg { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; pointer-events: none; background-size: cover !important; background-position: center !important; z-index: 1;}
                .sys-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 12px; font-size:13px;}
                body.light-mode .sys-card { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); }
                .btn-primary { width:100%; padding:12px; background:var(--accent); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; transition:0.2s;}
                .btn-primary:hover { transform:translateY(-2px); filter:brightness(1.1); }
                .btn-sec { width:100%; padding:12px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:8px; margin-bottom:10px; cursor:pointer; transition:0.2s;}
                .btn-sec:hover { background:rgba(255,255,255,0.2); }
                .btn-danger { width:100%; padding:12px; background:rgba(255,77,77,0.8); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; }

                #widget-notes { position:absolute; top:30px; right:30px; width:220px; height:220px; background:linear-gradient(135deg, #fff9c4, #fbc02d); color:#333; box-shadow:5px 10px 20px rgba(0,0,0,0.4); padding:15px; z-index:5; font-family:'Segoe Print', 'Comic Sans MS', cursive; transform: rotate(2deg); transition:transform 0.2s, box-shadow 0.2s; cursor:grab; pointer-events:auto; border-radius:2px 2px 15px 2px;}
                #widget-notes:active { cursor:grabbing; transform: rotate(0deg) scale(1.05); z-index:9999; box-shadow:10px 20px 30px rgba(0,0,0,0.5);}
                #widget-notes textarea { width:100%; height:100%; background:transparent; border:none; outline:none; font-family:inherit; font-size:14px; resize:none; color:#333;}

                .gemi-notif { position:fixed; top:20px; right:20px; background: rgba(20, 30, 40, 0.9); backdrop-filter: blur(25px); border: 1px solid var(--accent); border-radius: 12px; padding: 15px 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 15px; color: white; width: 320px; z-index:999999; animation: popIn 0.4s forwards; }
                body.light-mode .gemi-notif { background: rgba(255,255,255,0.95); border: 1px solid var(--accent); color: black; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
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
                
                // Cloud Registry Overlay
                let r1 = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/registry.js?t=" + Date.now(), {cache:"no-store"});
                if(r1.ok) eval(await r1.text());
            } catch(e) {}
        }

        _buildUI() {
            const root = document.createElement('div'); root.id='os-root'; root.style.cssText='width:100vw;height:100vh;position:absolute;top:0;left:0';
            root.innerHTML = `
            <div id="desktop-bg"></div>
            <div id="widget-notes"><div style="font-weight:bold;margin-bottom:5px;">📌 Sticky Note</div><textarea id="sticky-text" placeholder="Jot a quick note..."></textarea></div>
            <div id="desktop-icons"></div><div id="window-layer"></div>
            
            <div id="start-menu">
                <div class="start-header"><div style="font-size:35px;background:rgba(255,255,255,0.1);border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;margin-right:10px;">👑</div><div><div style="font-size:20px;font-weight:600;">Admin</div><div style="font-size:12px;opacity:0.7;">GemiOS 50.1 / PRO</div></div></div>
                <div id="start-menu-items" style="padding:10px; max-height:400px; overflow-y:auto;">
                    <div style="font-size:11px; color:#888; margin:10px;">SYSTEM APPS</div>
                    <div class="start-item" onclick="GemiOS.pm.launch('sys_store')"><span>🛒</span> GemiStore</div>
                    <div class="start-item" onclick="GemiOS.pm.launch('sys_drive')"><span>📁</span> Explorer</div>
                    <div class="start-item" onclick="GemiOS.pm.launch('sys_term')"><span>💻</span> Terminal</div>
                    <div class="start-item" onclick="GemiOS.pm.launch('sys_set')"><span>⚙️</span> Settings</div>
                    <div class="start-item" onclick="GemiOS.pm.launch('sys_update')"><span>☁️</span> Updater</div>
                    
                    <div style="font-size:11px; color:#888; margin:10px; margin-top:20px;">CREATOR STUDIO</div>
                    <div class="start-item" onclick="GemiOS.pm.launch('app_dev')"><span>🛠️</span> GemiDev Studio</div>
                    <div class="start-item" onclick="GemiOS.pm.launch('app_maker')"><span>🎮</span> GemiMaker Studio</div>
                    <div class="start-item" onclick="GemiOS.pm.launch('app_defend')"><span>🛡️</span> GemiDefender</div>
                </div>
            </div>

            <div id="taskbar-container">
                <div id="taskbar">
                    <div class="start" onclick="document.getElementById('start-menu').classList.toggle('open')">G</div>
                    <div id="dock-apps"></div>
                    <div style="display:flex;align-items:center;gap:15px;margin-left:15px;padding-left:15px;border-left:1px solid rgba(255,255,255,0.1);">
                        <div style="font-weight:bold;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px;">🪙 ${this.wallet}</div>
                        <div onclick="GemiOS.theme.toggleTheme()" style="cursor:pointer;font-size:20px;">🌓</div>
                        <div onclick="location.reload()" style="cursor:pointer;font-size:18px;color:#ff4d4d;">⏻</div>
                    </div>
                </div>
            </div>

            <div id="login-screen" style="position:absolute;top:0;left:0;width:100vw;height:100vh;background:linear-gradient(135deg, #0f2027, #203a43, #2c5364);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.4s;">
               <div style="font-size:80px;margin-bottom:20px;filter:drop-shadow(0 0 20px rgba(255,255,255,0.2));">👑</div>
               <div style="font-size:24px;color:white;font-weight:bold;margin-bottom:20px;letter-spacing:2px;">GemiOS Administrator</div>
               <button class="btn-primary" style="width:200px;font-size:16px;background:var(--accent);color:white;padding:12px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.4);" onclick="GemiOS.login()">Login</button>
            </div>
            `;
            document.body.appendChild(root);
            const sticky = document.getElementById('sticky-text'); sticky.value = localStorage.getItem('GemiOS_Sticky') || ''; sticky.oninput = () => localStorage.setItem('GemiOS_Sticky', sticky.value);
            let wp = localStorage.getItem('GemiOS_Wall'); if(wp) document.getElementById('desktop-bg').style.background = `url(${wp}) center/cover`;
        }

        renderDesktopIcons() { 
            const desk = document.getElementById('desktop-icons'); desk.innerHTML = ''; 
            const apps = [{id:'sys_drive', icon:'📁', t:'Explorer'}, {id:'sys_store', icon:'🛒', t:'Store'}, {id:'sys_term', icon:'💻', t:'Terminal'}, {id:'app_maker', icon:'🎮', t:'Maker'}];
            apps.forEach(a => {
                const el = document.createElement('div'); el.className = 'icon';
                el.innerHTML = `<div>${a.icon}</div>${a.t}`; el.ondblclick = () => this.pm.launch(a.id);
                desk.appendChild(el);
            });
            this.WM._renderDock(); 
        }

        async createSnapshot(auto = false) {
            let k = localStorage.getItem('GemiOS_Cache_Kernel') || "";
            let r = localStorage.getItem('GemiOS_Cache_Registry') || "";
            let v = localStorage.getItem('GemiOS_Cache_Ver') || "50.1.0";
            let date = new Date().toLocaleString().replace(/[\/:]/g, '-');
            let snapName = `Snapshot_v${v}_${date}.sys`;
            let payload = JSON.stringify({kernel: k, registry: r, version: v});
            await this.VFS.write('C:/System/Snapshots', snapName, payload);
            if(!auto) this.bus.emit('notify', {title: "Backup Complete", msg: `Saved as ${snapName} in NVRAM.`, success: true});
        }

        async triggerOTA(btn) {
            btn.innerText = 'Pinging Cloud Server...';
            try {
                let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/version.json?t=" + Date.now(), {cache: "no-store"});
                if (!r.ok) throw new Error();
                let d = await r.json();
                let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || "50.1.0";
                if (d.version !== currentVer) {
                    document.getElementById('upd-stat').innerHTML = `<span style="color:#ffeb3b">New Version: ${d.version}</span>`;
                    btn.innerText = 'Download & Install'; btn.style.background = '#ff00cc'; 
                    btn.onclick = async () => {
                        if(localStorage.getItem('GemiOS_AutoBackup') === 'true') {
                            document.getElementById('upd-stat').innerText = "Creating Auto‑Backup Snapshot...";
                            await this.createSnapshot(true);
                        }
                        try {
                            let kRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/kernel.js?t=" + Date.now());
                            localStorage.setItem('GemiOS_Cache_Kernel', await kRes.text());
                            let regRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/registry.js?t=" + Date.now());
                            localStorage.setItem('GemiOS_Cache_Registry', await regRes.text());
                            localStorage.setItem('GemiOS_Cache_Ver', d.version);
                            this.bus.emit('notify', {title: "Update Complete", msg: "Rebooting system...", success: true});
                            setTimeout(() => location.reload(), 2000);
                        } catch(e) { document.getElementById('upd-stat').innerText = "Flash Failed."; }
                    };
                } else { btn.innerText = 'Latest OS Installed'; btn.style.background = '#38ef7d'; btn.onclick = null; }
            } catch (err) { btn.innerText = 'Retry Network'; }
        }

        async handleTerm(e, pid, inEl) {
            if(e.key !== 'Enter') return; 
            let cmd = inEl.value.trim(); 
            inEl.value = ''; 
            let out = document.getElementById(`t-out-${pid}`); 
            let curr = this.termStates[pid];
            out.innerHTML += `<br><span style="color:#0078d7">${curr}></span> ${cmd}`; 
            let args = cmd.split(' ');
            let base = args[0].toLowerCase();
            const log = (msg) => out.innerHTML += `<br>${msg}`;
            const setPath = (p) => { this.termStates[pid] = p; document.getElementById(`t-path-${pid}`).innerText = p+'>'; };

            try {
                if(base === 'help') log('Available cmds: ls, cd, mkdir, clear');
                else if(base === 'clear') out.innerHTML = '';
                else if(base === 'ls') {
                    let dir = await this.VFS.getDir(curr);
                    if(!dir) log('Directory not found.');
                    else {
                        let keys = Object.keys(dir);
                        if(!keys.length) log('(empty)');
                        else keys.forEach(k => log(`- ${k}`));
                    }
                }
                else if(base === 'cd') {
                    let tgt = args[1];
                    if(!tgt) log('Usage: cd [dir]');
                    else if(tgt === '..') {
                        let parts = curr.split('/');
                        if(parts.length>1) parts.pop();
                        setPath(parts.join('/')||'C:');
                    } else {
                        let np = curr+'/'+tgt;
                        let dir = await this.VFS.getDir(np);
                        if(dir) setPath(np); else log('Directory not found.');
                    }
                }
                else if(base === 'mkdir') {
                    let name = args[1];
                    if(!name) log('Usage: mkdir [name]');
                    else {
                        // VFS currently has no explicit mkdir, so we reuse write to create an empty folder
                        let dir = await this.VFS.getDir(curr);
                        if(dir && dir[name] === undefined) {
                            dir[name] = {};
                            await this.VFS.saveNode('root', await this.VFS.getNode('root'));
                            log('Created.');
                        } else log('Failed (exists?).');
                    }
                }
                else log(`Unknown command: ${base}`);
            } catch(err) { log(`Error: ${err.message}`); }
            out.scrollTop = out.scrollHeight;
        }

        async renderDrive(pid) { 
            let path = this.driveStates[pid]; 
            let elPath = document.getElementById(`d-path-${pid}`); if(elPath) elPath.value = path; 
            let list = document.getElementById(`d-list-${pid}`); 
            let dir = await this.VFS.getDir(path); 
            let html = ''; 
            if(!dir) { if(list) list.innerHTML = "Folder not found."; return; }
            for(let k in dir) { 
                if(typeof dir[k] === 'object') { 
                    html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(0,0,0,0.2); border-radius:6px;" onclick="GemiOS.navDrive(${pid}, '${k}')"><div style="font-size:30px;">📁</div><div style="font-size:12px;">${k}</div></div>`; 
                } else { 
                    html += `<div style="text-align:center; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px;"><div style="font-size:30px;">📄</div><div style="font-size:12px;">${k}</div></div>`; 
                } 
            } 
            if(html === '') html = '<div style="grid-column: span 4; text-align:center; opacity:0.5; padding:20px;">Folder is empty</div>'; 
            if(list) list.innerHTML = html; 
        }
        navDrive(pid, target) { 
            let curr = this.driveStates[pid]; 
            if(target === 'UP') { 
                let parts = curr.split('/'); 
                if(parts.length > 1) parts.pop(); 
                this.driveStates[pid] = parts.join('/') || 'C:'; 
            } else { 
                this.driveStates[pid] = curr + '/' + target; 
            } 
            this.renderDrive(pid); 
        }

        async renderStore(pid) { 
            let h = ''; 
            for(let f in window.GemiRegistry) { 
                let a = window.GemiRegistry[f]; 
                if(!a.desc || a.tag === 'sys') continue;
                let bId = `st-btn-${a.id}-${pid}`; 
                let price = a.price || 0;
                let btnHtml = `<button id="${bId}" class="btn-primary" style="width:100%; margin-top:10px;" onclick="GemiOS.buyApp('${f}', '${a.id}', ${pid}, '${bId}', ${price})">${price === 0 ? 'Download Free' : `Buy (🪙 ${price})`}</button>`; 
                h += `<div class="sys-card" style="display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0;">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <div style="font-size:35px;">${a.icon}</div>
                            <div><div style="font-weight:bold; font-size:16px;">${a.title}</div><div style="font-size:11px; opacity:0.7;">${a.desc}</div></div>
                        </div>
                        ${btnHtml}
                    </div>`; 
            } 
            document.getElementById(`store-list-${pid}`).innerHTML = h; 
        }

        async buyApp(filename, appId, pid, btnId, price) { 
            if(this.wallet < price) { this.bus.emit('notify', {title:"Failed", msg:`Insufficient funds. Needs 🪙 ${price}`, success:false}); return; }
            this.wallet -= price; localStorage.setItem('GemiOS_Wallet', this.wallet);
            if(await this.VFS.write('C:/Users/Admin/Desktop', filename, appId)) { 
                this.bus.emit('notify', {title:"Success", msg:`Downloaded ${filename}!`}); 
                this.renderDesktopIcons(); 
                let btn = document.getElementById(btnId); 
                if(btn) { btn.className = 'btn-sec'; btn.innerText = 'Installed'; btn.disabled = true; } 
            } 
        }
      }

      (async () => { const os = new Core(); await os.init(); })();
    })();
}
