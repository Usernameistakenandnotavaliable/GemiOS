/*=====================================================================
   GemiOS CLOUD HYPERVISOR - v52.0.0-ALPHA (HOTFIX PATCH)
   IDB Version 4, Safe Mode Failsafes, UI Rendering Fixes.
=====================================================================*/

if (window.__GEMIOS_BOOTED__) {
    console.warn('⚠️ GemiOS kernel already booted – skipping duplicate load.');
} else {
    window.__GEMIOS_BOOTED__ = true;

    (() => {
        document.body.innerHTML = ''; 
        document.body.style.padding = '0';

        class EventBus { constructor() { this.handlers = new Map(); } on(ev, fn) { if (!this.handlers.has(ev)) this.handlers.set(ev, []); this.handlers.get(ev).push(fn); } off(ev, fn) { const arr = this.handlers.get(ev); if (!arr) return; this.handlers.set(ev, arr.filter(f => f !== fn)); } emit(ev, data) { const arr = this.handlers.get(ev); if (!arr) return; arr.forEach(fn => fn(data)); } }

        // BUG FIX: Bumped to version 4 to force IndexedDB to recreate missing stores!
        class VFS {
            constructor(bus) { this.bus = bus; this.MAX_STORAGE = 10485760; this.DB_NAME = 'GemiOS_Fs'; this.STORE = 'nodes'; this.db = null; }
            async _open() { if (this.db) return this.db; return new Promise((res, rej) => { const req = indexedDB.open(this.DB_NAME, 4); req.onupgradeneeded = ev => { const db = ev.target.result; if (!db.objectStoreNames.contains(this.STORE)) { db.createObjectStore(this.STORE, { keyPath: 'path' }); } }; req.onsuccess = ev => { this.db = ev.target.result; res(this.db); }; req.onerror = ev => rej(ev.target.error); }); }
            async _store(mode = 'readonly') { const db = await this._open(); return db.transaction(this.STORE, mode).objectStore(this.STORE); }
            async ensureRoot() { const store = await this._store('readwrite'); let rec = await new Promise(r => { let req = store.get('root'); req.onsuccess = () => r(req.result); req.onerror = () => r(null); }); if (!rec || !rec.data || !rec.data["C:"]) { let u = localStorage.getItem('GemiOS_User') || 'Admin'; let data = { "C:": { System: { Snapshots: {} }, Users: {} } }; data["C:"].Users[u] = { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} }; await new Promise(r => { let req = store.put({ path: 'root', data }); req.onsuccess = r; }); } }
            async getNode(path) { const store = await this._store(); let rec = await new Promise(r => { let req = store.get(path); req.onsuccess = () => r(req.result); req.onerror = () => r(null); }); return rec?.data ?? null; }
            async saveNode(path, data) { const store = await this._store('readwrite'); return new Promise(r => { let req = store.put({ path, data }); req.onsuccess = () => r(true); }); }
            async getDir(dirPath, create = false) { let node = await this.getNode('root'); if(!node || !node["C:"]) { await this.ensureRoot(); node = await this.getNode('root'); } if(!node) return null; let parts = dirPath.split('/').filter(p => p); let curr = node; let changed = false; for(let p of parts) { if(curr[p] === undefined) { if(create) { curr[p] = {}; changed = true; } else return null; } curr = curr[p]; } if (changed) await this.saveNode('root', node); return curr; }
            async write(dirPath, file, data) { let rootNode = await this.getNode('root'); if(!rootNode || !rootNode["C:"]) { await this.ensureRoot(); rootNode = await this.getNode('root'); } if(!rootNode) return false; let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) curr[p] = {}; curr = curr[p]; } curr[file] = data; return await this.saveNode('root', rootNode); }
            async read(dirPath, file) { const dir = await this.getDir(dirPath); return dir?.[file] ?? null; }
            async delete(dirPath, file) { let rootNode = await this.getNode('root'); if(!rootNode || !rootNode["C:"]) { await this.ensureRoot(); rootNode = await this.getNode('root'); } if(!rootNode) return false; let parts = dirPath.split('/').filter(p => p); let curr = rootNode; for(let p of parts) { if(curr[p] === undefined) return false; curr = curr[p]; } if(curr[file] !== undefined) { delete curr[file]; return await this.saveNode('root', rootNode); } return false; }
        }

        class Sanitizer { static sanitizeHTML(raw) { return DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['div','span','button','input','textarea','canvas','img','style','b','i','u','br','hr'], ALLOWED_ATTR: ['class','id','style','src','href','type','value','placeholder','onclick','onmousedown','onmousemove','onmouseup','onkeydown','oninput','ondblclick','onmouseover'], FORBID_ATTR: ['onload','onfocus'] }); } }

        class DriverManager {
            constructor() { this.drivers = { audio: localStorage.getItem('GemiOS_Driver_Audio') !== 'false', anim: localStorage.getItem('GemiOS_Driver_Anim') !== 'false', theme: localStorage.getItem('GemiOS_Theme') || 'dark', accent: localStorage.getItem('GemiOS_Accent') || '#0078d7' }; }
            init() { this.update('theme', this.drivers.theme); this.update('accent', this.drivers.accent); }
            update(type, val) {
                this.drivers[type] = val;
                if(type === 'audio') localStorage.setItem('GemiOS_Driver_Audio', val);
                if(type === 'anim') localStorage.setItem('GemiOS_Driver_Anim', val);
                if(type === 'theme') { localStorage.setItem('GemiOS_Theme', val); document.documentElement.dataset.theme = val; if(val === 'light') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); }
                if(type === 'accent') { localStorage.setItem('GemiOS_Accent', val); document.documentElement.style.setProperty('--accent', val); }
            }
        }

        class AudioEngine {
            constructor(drivers) { this.drivers = drivers; this.actx = null; this.sounds = { open: (t)=> this._tone(440,880,t,0.05,0,0.2), close: (t)=> this._tone(880,440,t,0.05,0,0.2), click: (t)=> this._tone(1200,1200,t,0.02,0,0.05), success: (t)=> this._chord([523.25,659.25,783.99],t, 1), error: (t)=> this._tone(150,150,t,0.1,0.2), startup: (t)=> this._startupChime(t), shutdown: (t)=> this._shutdownChime(t) }; }
            _init() { if (!this.actx) this.actx = new (window.AudioContext||window.webkitAudioContext)(); if (this.actx.state === 'suspended') this.actx.resume(); }
            _tone(start,end,t,gStart=0.1,gEnd=0, len=0.3){ this._init(); if(!t) t=this.actx.currentTime; const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='sine'; osc.frequency.setValueAtTime(start,t); osc.frequency.exponentialRampToValueAtTime(end,t+(len*0.6)); gain.gain.setValueAtTime(gStart,t); gain.gain.exponentialRampToValueAtTime(gEnd+0.0001,t+len); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t); osc.stop(t+len); }
            _chord(freqs,t, len=3){ this._init(); if(!t) t=this.actx.currentTime; freqs.forEach((f,i)=>{ const osc=this.actx.createOscillator(); const gain=this.actx.createGain(); osc.type='sine'; osc.frequency.setValueAtTime(f,t+(i*0.1)); gain.gain.setValueAtTime(0,t+(i*0.1)); gain.gain.linearRampToValueAtTime(0.15,t+(i*0.1)+0.5); gain.gain.exponentialRampToValueAtTime(0.0001,t+(i*0.1)+len); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t+(i*0.1)); osc.stop(t+(i*0.1)+len); }); }
            _startupChime(t) { this._init(); if(!t) t=this.actx.currentTime; const freqs = [261.63, 392.00, 523.25, 587.33]; freqs.forEach((f, i) => { const osc = this.actx.createOscillator(); const gain = this.actx.createGain(); osc.type = i % 2 === 0 ? 'sine' : 'triangle'; osc.frequency.setValueAtTime(f, t); osc.detune.setValueAtTime(i * 2, t); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.08, t + 0.1 + (i * 0.1)); gain.gain.linearRampToValueAtTime(0.04, t + 0.8); gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.5); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t); osc.stop(t + 4); }); const swp = this.actx.createOscillator(); const swpGain = this.actx.createGain(); swp.type = 'sine'; swp.frequency.setValueAtTime(1046.50, t + 0.5); swp.frequency.exponentialRampToValueAtTime(1567.98, t + 1.5); swpGain.gain.setValueAtTime(0, t + 0.5); swpGain.gain.linearRampToValueAtTime(0.05, t + 1.0); swpGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5); swp.connect(swpGain); swpGain.connect(this.actx.destination); swp.start(t + 0.5); swp.stop(t + 3); }
            _shutdownChime(t) { this._init(); if(!t) t=this.actx.currentTime; const freqs = [1046.50, 880.00, 783.99, 659.25]; freqs.forEach((f, i) => { const osc = this.actx.createOscillator(); const gain = this.actx.createGain(); osc.type = 'sine'; osc.frequency.setValueAtTime(f, t + (i * 0.15)); osc.frequency.exponentialRampToValueAtTime(f * 0.90, t + 2); gain.gain.setValueAtTime(0, t + (i * 0.15)); gain.gain.linearRampToValueAtTime(0.08, t + (i * 0.15) + 0.1); gain.gain.exponentialRampToValueAtTime(0.0001, t + 2); osc.connect(gain); gain.connect(this.actx.destination); osc.start(t + (i * 0.15)); osc.stop(t + 2.5); }); }
            play(name){ if (!this.drivers.drivers.audio) return; const fn=this.sounds[name]; if (fn) fn();}
        }

        class ProcessManager {
            constructor(bus, audio){ this.bus=bus; this.audio=audio; this.nextPid=1000; this.processes=new Map(); }
            async launch(appId, fileData=null){ 
                // BUG FIX: Graceful fallback logic in case Registry 404s
                const app = (window.GemiRegistry && window.GemiRegistry[appId]) || window.GemiCoreApps[appId]; 
                if (!app){ this.bus.emit('notify', {title: 'Execution Error', msg: `App [${appId}] missing. Check network connection.`, success: false}); this.audio.play('error'); return; } 
                const pid = ++this.nextPid; this.processes.set(pid, {id: appId, app}); 
                let sm = document.getElementById('start-menu'); if(sm) sm.classList.remove('open');
                this.bus.emit('wm:create-window', {pid, app, fileData}); 
                if (app.onLaunch) app.onLaunch(pid, fileData); 
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
            constructor(bus, audio, drivers){ this.bus = bus; this.audio = audio; this.drivers = drivers; this.zIndex = 100; this.bus.on('wm:create-window', cfg => this._createWindow(cfg)); }
            _createWindow({pid, app, fileData}) {
                const wid = `win_${pid}`; const content = typeof app.html === 'function' ? app.html(pid, fileData) : (app.htmlString || '');
                const isSystem = (app.tag === 'sys' || app.tag === 'pro' || app.tag === 'edu' || app.tag === 'fin' || app.tag === 'art');
                const isAnim = this.drivers.drivers.anim;
                let safeContent = isSystem ? content : `<iframe sandbox="allow-scripts allow-same-origin" srcdoc="${Sanitizer.sanitizeHTML(content).replace(/"/g,'&quot;')}" style="width:100%;height:100%;border:none;"></iframe>`;
                let shieldHTML = isSystem ? '' : `<div class="focus-shield" onclick="GemiOS.WM.focus('${wid}')" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:10;"></div>`;

                const html = `<div class="win ${isAnim ? 'win-animated' : 'win-static'}" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${app.width}px; z-index:${++this.zIndex};" onmousedown="GemiOS.WM.focus('${wid}')">
                    <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event,'${wid}')">
                        <div style="display:flex; align-items:center; gap:8px;"><span>${app.icon}</span> <span>${app.title}</span></div>
                        <div onmousedown="event.stopPropagation()"><button class="ctrl-btn min-btn" onclick="GemiOS.WM.minimize('${wid}')">-</button><button class="ctrl-btn snap-btn" onclick="GemiOS.WM.snap('${wid}','left')">&lt;</button><button class="ctrl-btn snap-btn" onclick="GemiOS.WM.snap('${wid}','right')">&gt;</button><button class="ctrl-btn close-btn" onclick="GemiOS.pm.kill(${pid})">×</button></div>
                    </div>
                    <div class="content" id="content_${pid}" style="position:relative;">${safeContent}${shieldHTML}</div>
                    <div class="resize-handle"></div>
                </div>`;
                document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);
                this.focus(wid); this.audio.play('open'); this._renderDock(); 
            }
            focus(wid){ 
                document.querySelectorAll('.win').forEach(w => { let shield = w.querySelector('.focus-shield'); if(shield) shield.style.display = 'block'; w.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)"; });
                const el = document.getElementById(wid); if (el) { el.style.zIndex = ++this.zIndex; el.style.boxShadow = "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px var(--accent)"; let shield = el.querySelector('.focus-shield'); if(shield) shield.style.display = 'none'; } 
            }
            drag(e,wid){ 
                const win = document.getElementById(wid); if (!win || win.dataset.maximized==='true') return; 
                const offsetX = e.clientX - win.offsetLeft; const offsetY = e.clientY - win.offsetTop; 
                this.focus(wid); 
                let iframes = document.querySelectorAll('iframe'); iframes.forEach(ifr => ifr.style.pointerEvents = 'none'); 
                const isAnim = this.drivers.drivers.anim; if(isAnim) win.style.transition = 'none'; 
                const move = ev => { let newX = ev.clientX - offsetX; let newY = Math.max(0, ev.clientY - offsetY); newX = Math.min(newX, window.innerWidth - 50); newX = Math.max(newX, -win.offsetWidth + 50); newY = Math.min(newY, window.innerHeight - 50); win.style.left = newX + 'px'; win.style.top = newY + 'px'; }; 
                const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); if(isAnim) win.style.transition = 'width 0.3s, height 0.3s, top 0.3s, left 0.3s'; iframes.forEach(ifr => ifr.style.pointerEvents = 'auto'); }; 
                document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); 
            }
            maximize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.dataset.maximized==='true'){ win.style.top = win.dataset.pT; win.style.left = win.dataset.pL; win.style.width = win.dataset.pW; win.style.height= win.dataset.pH; win.dataset.maximized='false'; win.style.borderRadius='16px'; } else { win.dataset.pT = win.style.top; win.dataset.pL = win.style.left; win.dataset.pW = win.style.width; win.dataset.pH = win.style.height; win.style.top = '0'; win.style.left = '0'; win.style.width = '100vw'; win.style.height = 'calc(100vh - 80px)'; win.dataset.maximized='true'; win.style.borderRadius='0'; } }
            snap(wid, side){ const win = document.getElementById(wid); if (!win) return; if(win.dataset.maximized === "false") { win.dataset.pT = win.style.top; win.dataset.pL = win.style.left; win.dataset.pW = win.style.width; win.dataset.pH = win.style.height; } win.style.top = '0'; win.style.height = 'calc(100vh - 80px)'; win.style.width = '50vw'; win.style.left = side==='left' ? '0' : '50vw'; win.dataset.maximized='true'; win.style.borderRadius='0'; this.focus(wid); }
            minimize(wid){ const win = document.getElementById(wid); if (!win) return; if (win.style.opacity === '0'){ win.style.opacity='1'; win.style.transform='scale(1) translateY(0)'; win.style.pointerEvents='auto'; } else { win.style.opacity='0'; win.style.transform='scale(0.9) translateY(40px)'; win.style.pointerEvents='none'; } }
            
            _renderDock() {
                const dock = document.getElementById('dock-apps'); if(!dock) return;
                let runningPids = Array.from(GemiOS.pm.processes.values());
                let allDockApps = ['sys_drive', 'sys_store', 'sys_term', 'sys_set'];
                runningPids.forEach(p => { if(!allDockApps.includes(p.id)) allDockApps.push(p.id); });
                
                let html = '';
                allDockApps.forEach(appId => {
                    // Safe Check in case Registry fails
                    const app = (window.GemiRegistry && window.GemiRegistry[appId]) || window.GemiCoreApps[appId]; if(!app) return;
                    let runningInstance = runningPids.find(p => p.id === appId);
                    let indicator = runningInstance ? `<div style="width:4px; height:4px; background:var(--accent); border-radius:50%; position:absolute; bottom:2px;"></div>` : '';
                    let clickAction = runningInstance ? `GemiOS.WM.minimize('win_${runningInstance.pid}')` : `GemiOS.pm.launch('${appId}')`;
                    html += `<div class="dock-icon" onclick="${clickAction}" title="${app.title}"><div style="font-size:24px;">${app.icon}</div>${indicator}</div>`;
                });
                dock.innerHTML = html;
            }
        }

        // BUG FIX: The Failsafe Registry. If the cloud is slow, these load locally!
        window.GemiCoreApps = {
            'sys_term': { id: 'sys_term', tag: 'sys', icon: '💻', title: 'Terminal', width: 500, html: (pid) => `<div id="t-out-${pid}" style="flex-grow:1; background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; overflow-y:auto; border-radius:6px; box-shadow:inset 0 0 10px rgba(0,0,0,0.8);">GemiOS v52.0 Safe Mode Shell.<br>Type 'help' for commands.</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px; border:1px solid #333;"><span id="t-path-${pid}" style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/${GemiOS.user}></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`, onLaunch: (pid) => { let p = `C:/Users/${GemiOS.user}`; GemiOS.termStates[pid] = p; document.getElementById(`t-path-${pid}`).innerText = p + '>'; setTimeout(()=>document.getElementById('t-in-'+pid).focus(),100); } },
            'sys_drive': { id: 'sys_drive', tag: 'sys', icon: '📁', title: 'Explorer', width: 520, html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div><div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px; padding:5px;"></div>`, onLaunch: (pid) => { GemiOS.driveStates[pid] = `C:/Users/${GemiOS.user}`; GemiOS.renderDrive(pid); } },
            'sys_set': { id: 'sys_set', tag: 'sys', icon: '⚙️', title: 'Settings', width: 450, html: (pid) => `<div class="sys-card"><h3 style="margin:0 0 10px 0; color:var(--accent);">🎨 Appearance</h3><b style="font-size:12px;">Wallpaper URL</b><br><div style="display:flex; gap:5px; margin:5px 0;"><input type="text" id="wp-in" style="flex:1; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(0,0,0,0.3); color:white;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary" style="width:auto; margin:0;">Apply</button></div><b style="font-size:12px;">Accent Color</b><br><div style="display:flex; gap:10px; margin-top:5px;"><div onclick="GemiOS.drivers.update('accent', '#0078d7');" style="width:25px; height:25px; border-radius:50%; background:#0078d7; cursor:pointer;"></div><div onclick="GemiOS.drivers.update('accent', '#ff00cc');" style="width:25px; height:25px; border-radius:50%; background:#ff00cc; cursor:pointer;"></div><div onclick="GemiOS.drivers.update('accent', '#38ef7d');" style="width:25px; height:25px; border-radius:50%; background:#38ef7d; cursor:pointer;"></div><div onclick="GemiOS.drivers.update('accent', '#ff4d4d');" style="width:25px; height:25px; border-radius:50%; background:#ff4d4d; cursor:pointer;"></div></div></div><div class="sys-card" style="border-left:4px solid #ff4d4d; margin-bottom:0;"><h3 style="margin:0 0 10px 0; color:#ff4d4d;">🛡️ Recovery</h3><div style="display:flex; gap:10px; margin-bottom:10px;"><button onclick="GemiOS.createSnapshot()" class="btn-sec" style="flex:1; margin:0;">Create Snapshot</button><button onclick="alert('Reboot and press F2 or DEL.')" class="btn-danger" style="flex:1; margin:0;">Format NVRAM</button></div><div style="background:#000; border:1px solid #333; border-radius:4px; padding:10px; max-height:100px; overflow-y:auto;" id="snap-list-${pid}">Loading snapshots...</div></div>`, onLaunch: (pid) => { GemiOS.renderSnapshots(pid); } },
            'sys_update': { id: 'sys_update', tag: 'sys', icon: '☁️', title: 'Updater', width: 380, html: () => `<div class="sys-card" style="text-align:center; flex-grow:1;"><div style="font-size:40px;">☁️</div><h3 style="margin:5px 0;">OTA Updater</h3><p style="font-size:13px; opacity:0.8;">Current OS: <b id="kern-ver">v${localStorage.getItem('GemiOS_Cache_Ver') || '52.0.0-ALPHA'}</b></p><div id="upd-stat" style="font-size:12px; min-height:15px; margin-bottom:10px;">Ready to fetch Cloud Update.</div><button onclick="GemiOS.triggerOTA(this)" class="btn-primary">Check for Updates</button></div>` },
            'sys_store': { id: 'sys_store', tag: 'sys', icon: '🛒', title: 'GemiStore', width: 700, html: (pid) => `<div class="sys-card" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg, var(--accent), #000); margin-bottom:10px;"><div style="font-size:24px; font-weight:bold;">GemiStore Hub</div><div style="font-size:40px;">🛒</div></div><div id="store-list-${pid}" style="flex-grow:1; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:5px;"></div>`, onLaunch: (pid) => { GemiOS.renderStore(pid); } },
            'app_calc': { id: 'app_calc', price: 0, tag: 'sys', icon: '🧮', title: 'Calculator', width: 260, html: (pid) => `<div style="background:rgba(255,255,255,0.9); color:black; padding:15px; font-size:28px; text-align:right; margin-bottom:10px; border-radius:6px; font-family:monospace; box-shadow:inset 0 2px 5px rgba(0,0,0,0.2);" id="cd-${pid}">0</div><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; flex-grow:1;">${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="padding:15px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.1); cursor:pointer; font-weight:bold; border-radius:6px; color:white; font-size:16px; transition:0.1s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" onclick="let d=document.getElementById('cd-${pid}'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') { try { d.innerText=new Function('return ' + d.innerText)(); } catch(e){ d.innerText='Err'; } } else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}</div>` }
        };

        class Core {
            constructor(){
                this.user = localStorage.getItem('GemiOS_User') || 'Admin';
                this.bus = new EventBus(); 
                this.VFS = new VFS(this.bus); 
                this.drivers = new DriverManager();
                this.audio = new AudioEngine(this.drivers);
                this.pm = new ProcessManager(this.bus, this.audio); 
                this.WM = new WindowManager(this.bus, this.audio, this.drivers);
                this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet')) || 500; this.termStates = {}; this.driveStates = {}; window.GemiOS = this; 
                
                this.bus.on('notify', ({title,msg,success})=>{ 
                    const n = document.createElement('div'); n.className = 'gemi-notif'; n.style.zIndex = '9999999';
                    n.innerHTML = `<div style="font-size:20px;">${success?'✅':'⚠️'}</div><div><div style="font-weight:bold;">${title}</div><div style="font-size:12px;">${msg}</div></div>`; 
                    document.body.appendChild(n); setTimeout(() => n.remove(), 4000); 
                });
            }

            async init(){
                this.drivers.init(); 
                this.injectStyles(); 
                this._buildUI(); 
                await this.VFS.ensureRoot(); 
                await this.loadDependencies(); 
                this.patchDesktopData(); 
                this._startOTADaemon();
                
                setTimeout(() => {
                    const bootScr = document.getElementById('boot-screen');
                    if(bootScr) { bootScr.style.opacity = '0'; setTimeout(() => bootScr.remove(), 800); }
                }, 2000);
            }

            login() {
                this.audio._init(); this.audio.play('startup'); 
                document.getElementById('login-screen').style.opacity = '0';
                setTimeout(() => document.getElementById('login-screen').remove(), 500);
            }

            shutdown(mode = 'shutdown') {
                document.getElementById('power-menu').classList.remove('open');
                this.audio.play('shutdown');
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);backdrop-filter:blur(20px);z-index:999999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:sans-serif;opacity:0;transition:opacity 0.5s, background 1s;';
                
                let text = "Shutting down...";
                if(mode === 'restart') text = "Restarting...";
                if(mode === 'legacy') { text = "Initializing Temporal Shift..."; localStorage.setItem('GemiOS_Boot_Target', 'LEGACY_V49'); }
                
                overlay.innerHTML = `<style>.shutdown-spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--accent, #38ef7d); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; } @keyframes spin { 100% { transform: rotate(360deg); } }</style><div class="shutdown-spinner" id="sd-spin"></div><div id="sd-text" style="font-size:24px; font-weight:600; letter-spacing:1px;">${text}</div>`;
                document.body.appendChild(overlay); setTimeout(() => overlay.style.opacity = '1', 50);
                
                setTimeout(() => { 
                    if(mode === 'shutdown') { overlay.style.background = 'black'; document.getElementById('sd-spin').style.display = 'none'; document.getElementById('sd-text').style.display = 'none'; }
                }, 2000);
                
                setTimeout(() => {
                    if(mode === 'shutdown') { /* simulate off state */ }
                    else { location.reload(); }
                }, 2800);
            }
            
            showPowerMenu() {
                const pm = document.getElementById('power-menu');
                if(pm.classList.contains('open')) pm.classList.remove('open');
                else pm.classList.add('open');
            }

            injectStyles() {
                const s = document.createElement('style'); const isAnim = this.drivers.drivers.anim;
                s.textContent = `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                    :root { --accent: #0078d7; } body { margin:0 !important; padding:0 !important; background:#0f2027 !important; font-family:'Inter', "Segoe UI Emoji", "Apple Color Emoji", sans-serif !important; color:white !important; overflow:hidden; user-select:none; }
                    body.light-mode { background: #e0eafc !important; color: #222 !important; }
                    @keyframes popIn { 0% { opacity:0; transform:scale(0.9) translateY(20px); } 100% { opacity:1; transform:scale(1) translateY(0); } } @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                    ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; } body.light-mode ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
                    #desktop-bg { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background: linear-gradient(135deg, #1e130c, #9a8478); z-index: -1; } body.light-mode #desktop-bg { background: linear-gradient(135deg, #e0eafc, #cfdef3); }
                    #desktop-icons { display:grid; grid-template-columns: repeat(auto-fill, 90px); grid-auto-rows: 100px; gap: 15px; padding: 20px; position:absolute; top:0; left:0; width:100%; height:calc(100vh - 100px); z-index:10; align-content:start; box-sizing: border-box; }
                    .icon { display:flex; flex-direction:column; align-items:center; justify-content:center; width:90px; height:100px; text-align:center; color:white; font-size:12px; cursor:pointer; transition:0.2s; border-radius:12px; padding:10px 5px; box-sizing: border-box; font-weight:600;} 
                    .icon:hover { background:rgba(255,255,255,0.1); transform:translateY(-2px); backdrop-filter:blur(5px); border:1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 15px rgba(0,0,0,0.2);} .icon div { font-size: 40px; margin-bottom: 8px; text-shadow: 0 4px 8px rgba(0,0,0,0.5); } body.light-mode .icon { color: #222; }
                    .win { position:absolute; background:rgba(20, 30, 40, 0.65); backdrop-filter: blur(25px); border-radius:16px; border:1px solid rgba(255,255,255,0.15); display:flex; flex-direction:column; pointer-events:auto; overflow:hidden; color:white; box-shadow:0 20px 50px rgba(0,0,0,0.5); }
                    .win-animated { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s; } .win-static { opacity: 1; } body.light-mode .win { background: rgba(255,255,255,0.75); border: 1px solid var(--accent); color: #222; box-shadow: 0 20px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }
                    .title-bar { padding:12px 18px; font-weight:600; font-size:13px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05); cursor:grab; background:linear-gradient(rgba(255,255,255,0.05), transparent);} body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.05); background:rgba(0,0,0,0.03);}
                    .content { padding:15px; flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; position:relative; }
                    .ctrl-btn { border:none; color:white; cursor:pointer; width:14px; height:14px; border-radius:50%; font-size:0px; transition:0.2s; display:inline-flex; align-items:center; justify-content:center; margin-left:6px; box-shadow:inset 0 1px 1px rgba(255,255,255,0.3);} .ctrl-btn:hover { font-size: 10px; font-weight:bold; } .close-btn { background:#ff5f56; } .min-btn { background:#ffbd2e; } .snap-btn { background:#27c93f; }
                    .resize-handle { position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; cursor: nwse-resize; z-index: 10000; background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%); }
                    
                    #taskbar-container { position:absolute; bottom:15px; width:100%; display:flex; justify-content:center; pointer-events:none; z-index:99999; }
                    #taskbar { pointer-events:auto; height:60px; background:rgba(20, 25, 30, 0.4); backdrop-filter:blur(40px); display:flex; align-items:center; padding: 0 15px; border-radius:30px; border:1px solid rgba(255,255,255,0.15); box-shadow: 0 15px 35px rgba(0,0,0,0.6); gap: 10px;} body.light-mode #taskbar { background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.1); color: #222; }
                    .start { width:42px; height:42px; background:linear-gradient(135deg, var(--accent), #005a9e); border-radius:50%; border:1px solid rgba(255,255,255,0.3); text-align:center; line-height:42px; cursor:pointer; font-weight: 600; font-size: 20px; transition: 0.2s;} .start:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); border-color:white; }
                    #dock-apps { display:flex; align-items:center; gap:5px; border-left:1px solid rgba(255,255,255,0.1); padding-left:10px; border-right:1px solid rgba(255,255,255,0.1); padding-right:10px;}
                    .dock-icon { width:42px; height:42px; border-radius:10px; display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer; transition:0.2s; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.05); position:relative;} .dock-icon:hover { background:rgba(255,255,255,0.15); transform:translateY(-5px); border-color:rgba(255,255,255,0.3); box-shadow:0 8px 15px rgba(0,0,0,0.3);} body.light-mode .dock-icon { background:rgba(0,0,0,0.05); border-color:rgba(0,0,0,0.05); } body.light-mode .dock-icon:hover { background:rgba(0,0,0,0.1); border-color:rgba(0,0,0,0.2); }

                    #start-menu { position:absolute; bottom:90px; left:50%; transform:translateX(-50%); width:420px; background:rgba(25, 35, 45, 0.65); backdrop-filter:blur(50px); border-radius:24px; border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:999999; pointer-events:auto; box-shadow:0 25px 60px rgba(0,0,0,0.7);} #start-menu.open { display:flex; ${isAnim ? 'animation: slideUp 0.3s forwards;' : ''} } body.light-mode #start-menu { background:rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.1); color: #222;}
                    .start-header { background: linear-gradient(135deg, rgba(0,0,0,0.2), transparent); color:white; padding:25px; font-weight:600; display:flex; align-items:center; gap: 15px; border-bottom:1px solid rgba(255,255,255,0.05);} body.light-mode .start-header { color:#222; border-bottom:1px solid rgba(0,0,0,0.05);}
                    .start-item { padding:12px 20px; cursor:pointer; display:flex; align-items:center; gap:15px; font-size:14px; transition: 0.2s; border-radius: 12px; margin: 4px 12px; background:rgba(255,255,255,0.02);} .start-item:hover { background:var(--accent); color:white; transform: translateX(5px); } body.light-mode .start-item:hover { background:var(--accent); color:white; }
                    
                    #power-menu { position:absolute; bottom:90px; right:15px; width:220px; background:rgba(25, 35, 45, 0.85); backdrop-filter:blur(50px); border-radius:12px; border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:999999; pointer-events:auto; box-shadow:0 20px 40px rgba(0,0,0,0.6); padding:10px;} #power-menu.open { display:flex; ${isAnim ? 'animation: popIn 0.2s forwards;' : ''} } body.light-mode #power-menu { background:rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.1); color: #222;}
                    .pm-btn { padding:10px 15px; cursor:pointer; display:flex; align-items:center; gap:10px; font-size:13px; transition: 0.2s; border-radius: 8px; margin-bottom:5px; font-weight:bold; background:rgba(255,255,255,0.05); color:white;}
                    .pm-btn:hover { background:rgba(255,255,255,0.15); }
                    .pm-btn.warning { color:#ffb400; border-left:3px solid #ffb400;} .pm-btn.warning:hover { background:rgba(255,180,0,0.2); }
                    .pm-btn.danger { color:#ff4d4d; border-left:3px solid #ff4d4d;} .pm-btn.danger:hover { background:rgba(255,77,77,0.2); }
                    body.light-mode .pm-btn { color:#222; background:rgba(0,0,0,0.05); } body.light-mode .pm-btn:hover { background:rgba(0,0,0,0.1); }

                    .sys-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 12px; font-size:13px;} body.light-mode .sys-card { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); }
                    .btn-primary { width:100%; padding:12px; background:var(--accent); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; transition:0.2s;} .btn-primary:hover { transform:translateY(-2px); filter:brightness(1.1); } .btn-sec { width:100%; padding:12px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:8px; margin-bottom:10px; cursor:pointer; transition:0.2s;} .btn-sec:hover { background:rgba(255,255,255,0.2); } .btn-danger { width:100%; padding:12px; background:rgba(255,77,77,0.8); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; transition:0.2s;} .btn-danger:hover { transform:translateY(-2px); filter:brightness(1.1); }
                    
                    #widget-notes { position:absolute; top:30px; right:30px; width:220px; height:220px; background:linear-gradient(135deg, #fff9c4, #fbc02d); color:#333; box-shadow:5px 10px 20px rgba(0,0,0,0.4); padding:15px; z-index:5; font-family:'Segoe Print', 'Comic Sans MS', cursive; transform: rotate(2deg); transition: transform 0.2s, box-shadow 0.2s; pointer-events:auto; border-radius:2px 2px 15px 2px; display:flex; flex-direction:column;} 
                    #widget-notes.dragging { transform: rotate(0deg) scale(1.05); z-index:9999; box-shadow:10px 20px 30px rgba(0,0,0,0.5);} 
                    #sticky-header { font-weight:bold; margin-bottom:5px; cursor:grab; padding-bottom:5px; border-bottom:1px solid rgba(0,0,0,0.1); } #sticky-header:active { cursor:grabbing; }
                    #widget-notes textarea { width:100%; flex-grow:1; background:transparent; border:none; outline:none; font-family:inherit; font-size:14px; resize:none; color:#333;}
                    
                    .gemi-notif { position:fixed; top:20px; right:20px; background: rgba(20, 30, 40, 0.9); backdrop-filter: blur(25px); border: 1px solid var(--accent); border-radius: 12px; padding: 15px 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 15px; color: white; width: 320px; z-index:9999999; animation: popIn 0.4s forwards; } body.light-mode .gemi-notif { background: rgba(255,255,255,0.95); border: 1px solid var(--accent); color: black; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
                `;
                document.head.appendChild(s);
            }

            async loadDependencies() {
                try {
                    window.GemiRegistry = { ...window.GemiCoreApps }; // Failsafe
                    
                    if(localStorage.getItem('GemiOS_SafeMode') === 'true') {
                        this.bus.emit('notify', {title: "Safe Mode Active", msg: "Third-party registry disabled.", success: false});
                        return; 
                    }

                    let regRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/registry.js?t=" + Date.now(), {cache:"no-store"});
                    if(regRes.ok) eval(await regRes.text());
                    
                    let engRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/engine.js?t=" + Date.now(), {cache:"no-store"});
                    if(engRes.ok) eval(await engRes.text());
                    
                    let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}');
                    let globalNetwork = JSON.parse(localStorage.getItem('GemiOS_GlobalNetwork') || '[]');
                    for(let cFile in customApps) { window.GemiRegistry[cFile] = { ...customApps[cFile], isCustom: true }; }
                    globalNetwork.forEach(gApp => { window.GemiRegistry[gApp.title.replace(/\s/g, '') + '_net.app'] = { ...gApp, isNetwork: true }; });
                    
                } catch(e) { console.error("Cloud Module Injection Failed. Loading local fallbacks.", e); }
            }

            _buildUI() {
                let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || '52.0.0-ALPHA';
                const root = document.createElement('div'); root.id='os-root'; root.style.cssText='width:100vw;height:100vh;position:absolute;top:0;left:0; overflow:hidden;';
                root.innerHTML = `
                <div id="boot-screen" style="position:absolute;top:0;left:0;width:100vw;height:100vh;background:#050505;z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.8s;">
                    <div style="font-size:60px; font-weight:900; color:white; letter-spacing:4px; text-shadow:0 0 20px var(--accent);">GemiOS <sup style="font-size:16px; color:#ffb400;">ALPHA</sup></div>
                    <div style="width:200px; height:4px; background:rgba(255,255,255,0.1); margin-top:30px; border-radius:2px; overflow:hidden;">
                        <div style="width:50%; height:100%; background:var(--accent); animation: loadBar 2s ease-in-out infinite;"></div>
                    </div>
                </div>

                <div id="desktop-bg"></div>
                <div id="desktop-icons"></div>
                <div id="widget-notes">
                    <div id="sticky-header">📌 Sticky Note</div>
                    <textarea id="sticky-text" placeholder="Jot a quick note..."></textarea>
                </div>
                <div id="window-layer"></div>
                
                <div id="start-menu">
                    <div class="start-header"><div style="font-size:35px;">👑</div><div><div style="font-size:20px;font-weight:600;">${this.user}</div><div style="font-size:12px;opacity:0.7;">GemiOS ${currentVer}</div></div></div>
                    <div id="start-menu-items" style="padding:10px; max-height:400px; overflow-y:auto;">
                        <div style="font-size:11px; color:#888; margin:10px; letter-spacing:1px; font-weight:bold;">SYSTEM APPS</div>
                        <div class="start-item" onclick="GemiOS.pm.launch('sys_store')"><span>🛒</span> GemiStore</div>
                        <div class="start-item" onclick="GemiOS.pm.launch('sys_drive')"><span>📁</span> Explorer</div>
                        <div class="start-item" onclick="GemiOS.pm.launch('sys_set')"><span>⚙️</span> Settings</div>
                        <div class="start-item" onclick="GemiOS.pm.launch('sys_update')"><span>☁️</span> Updater</div>
                        
                        <div style="font-size:11px; color:#888; margin:10px; margin-top:20px; letter-spacing:1px; font-weight:bold;">PRODUCTIVITY & ART</div>
                        <div class="start-item" onclick="GemiOS.pm.launch('sys_term')"><span>💻</span> Terminal</div>
                        <div class="start-item" onclick="GemiOS.pm.launch('app_calc')"><span>🧮</span> Calculator</div>
                    </div>
                </div>

                <div id="power-menu">
                    <div class="pm-btn" onclick="GemiOS.shutdown('restart')"><span>🔄</span> Restart System</div>
                    <div class="pm-btn warning" onclick="GemiOS.shutdown('legacy')"><span>🕰️</span> Boot Time Machine (v49)</div>
                    <div class="pm-btn danger" style="margin-bottom:0;" onclick="GemiOS.shutdown('shutdown')"><span>🔴</span> Shut Down</div>
                </div>

                <div id="taskbar-container">
                    <div id="taskbar">
                        <div class="start" onclick="document.getElementById('start-menu').classList.toggle('open'); document.getElementById('power-menu').classList.remove('open');">G</div>
                        <div id="dock-apps"></div>
                        <div style="display:flex;align-items:center;gap:15px;margin-left:10px;padding-left:15px;border-left:1px solid rgba(255,255,255,0.1);">
                            <div style="font-weight:bold;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px; font-size:12px;">🪙 <span id="wallet-text">${this.wallet}</span></div>
                            <div onclick="GemiOS.drivers.update('theme', document.documentElement.dataset.theme === 'light' ? 'dark' : 'light')" style="cursor:pointer;font-size:16px;">🌙</div>
                            <div id="clock" style="font-weight:600;font-size:13px;letter-spacing:1px;">--:--</div>
                            <div onclick="GemiOS.showPowerMenu()" style="cursor:pointer;font-size:16px;color:#ff4d4d; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">🔴</div>
                        </div>
                    </div>
                </div>

                <div id="login-screen" style="position:absolute;top:0;left:0;width:100vw;height:100vh;background:linear-gradient(135deg, #0f2027, #2c5364);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.4s;">
                   <div style="font-size:80px;margin-bottom:20px;filter:drop-shadow(0 0 20px rgba(255,255,255,0.2));">👑</div>
                   <div style="font-size:24px;color:white;font-weight:bold;margin-bottom:20px;letter-spacing:2px;">${this.user}</div>
                   <button class="btn-primary" style="width:200px;font-size:16px;background:var(--accent);color:white;padding:12px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.4);" onclick="GemiOS.login()">Login</button>
                </div>
                `;
            document.body.appendChild(root);
            
            let wp = localStorage.getItem('GemiOS_Wall'); if(wp) document.getElementById('desktop-bg').style.background = `url(${wp}) center/cover`;
            setInterval(()=>{ let clk = document.getElementById('clock'); if(clk) clk.innerText = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }, 1000);
            
            document.addEventListener('mousedown', (e) => {
                const sm = document.getElementById('start-menu'); const startBtn = document.querySelector('.start');
                const pm = document.getElementById('power-menu'); const pwrBtn = document.querySelector('#taskbar div[onclick="GemiOS.showPowerMenu()"]');
                
                if(sm && sm.classList.contains('open') && !sm.contains(e.target) && !startBtn.contains(e.target)) sm.classList.remove('open');
                if(pm && pm.classList.contains('open') && !pm.contains(e.target) && !pwrBtn.contains(e.target)) pm.classList.remove('open');
            });

            const stickyText = document.getElementById('sticky-text');
            stickyText.value = localStorage.getItem('GemiOS_Sticky') || ''; 
            stickyText.oninput = () => localStorage.setItem('GemiOS_Sticky', stickyText.value);

            const stickyNote = document.getElementById('widget-notes');
            const stickyHeader = document.getElementById('sticky-header');
            stickyHeader.onmousedown = (e) => {
                stickyNote.classList.add('dragging');
                let offsetX = e.clientX - stickyNote.offsetLeft; let offsetY = e.clientY - stickyNote.offsetTop;
                const move = ev => { stickyNote.style.left = ev.clientX - offsetX + 'px'; stickyNote.style.top = Math.max(0, ev.clientY - offsetY) + 'px'; stickyNote.style.right = 'auto'; };
                const up = () => { stickyNote.classList.remove('dragging'); document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
                document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
            };
        }

        async renderSnapshots(pid) {
            let el = document.getElementById(`snap-list-${pid}`); if(!el) return;
            let snaps = await this.VFS.getDir('C:/System/Snapshots');
            if(!snaps || Object.keys(snaps).length === 0) { el.innerHTML = '<div style="color:#888; font-size:11px; text-align:center;">No snapshots found.</div>'; return; }
            let h = '';
            for(let s in snaps) {
                h += `<div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:5px; margin-bottom:5px; border-radius:4px; font-size:10px;">
                    <span style="color:#38ef7d; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:150px;" title="${s}">${s}</span>
                    <div style="display:flex; gap:5px;">
                        <button onclick="GemiOS.restoreSnapshot('${s}')" style="background:#ffb400; color:black; border:none; border-radius:3px; cursor:pointer; padding:3px 6px; font-weight:bold;">Restore</button>
                        <button onclick="GemiOS.VFS.delete('C:/System/Snapshots', '${s}').then(()=>GemiOS.renderSnapshots(${pid}))" style="background:#ff4d4d; color:white; border:none; border-radius:3px; cursor:pointer; padding:3px 6px;">X</button>
                    </div>
                </div>`;
            }
            el.innerHTML = h;
        }

        async restoreSnapshot(snapName) {
            if(!confirm("Restore this snapshot? The system will reboot and current changes will be lost.")) return;
            let data = await this.VFS.read('C:/System/Snapshots', snapName);
            if(data) {
                try {
                    let payload = JSON.parse(data);
                    localStorage.setItem('GemiOS_Cache_Kernel', payload.kernel);
                    if(payload.registry) localStorage.setItem('GemiOS_Cache_Registry', payload.registry);
                    if(payload.engine) localStorage.setItem('GemiOS_Cache_Engine', payload.engine);
                    localStorage.setItem('GemiOS_Cache_Ver', payload.version);
                    this.bus.emit('notify', {title: "Restoring", msg: "Rebooting into snapshot...", success: true});
                    setTimeout(() => location.reload(), 1500);
                } catch(e) { this.bus.emit('notify', {title: "Error", msg: "Snapshot corrupted.", success: false}); }
            }
        }

        patchDesktopData() { 
            let desk = { 'Explorer.app': 'sys_drive', 'GemiStore.app': 'sys_store', 'Terminal.app': 'sys_term', 'Calculator.app': 'app_calc' }; 
            let deskPath = `C:/Users/${this.user}/Desktop`;
            this.VFS.getDir(deskPath, true).then(async (realDesk) => {
                for(let a in desk) { if(realDesk && !realDesk[a]) await this.VFS.write(deskPath, a, desk[a]); }
                this.renderDesktopIcons();
            });
        }

        async renderDesktopIcons() { 
            const desk = document.getElementById('desktop-icons'); desk.innerHTML = ''; 
            let deskData = await this.VFS.getDir(`C:/Users/${this.user}/Desktop`) || {};
            for(let file in deskData) {
                if(file.endsWith('.app') || file.endsWith('.txt') || file.endsWith('.png')) {
                    let appId = deskData[file];
                    if(!window.GemiRegistry) continue;
                    let a = window.GemiRegistry[appId] || window.GemiCoreApps[appId];
                    if(file.endsWith('.txt')) {
                        const el = document.createElement('div'); el.className = 'icon'; el.innerHTML = `<div>📝</div><div style="font-size:11px;">${file}</div>`; el.ondblclick = async () => { let content = await this.VFS.read(`C:/Users/${this.user}/Desktop`, file); this.pm.launch('app_note', content); }; desk.appendChild(el);
                    } else if(file.endsWith('.png')) {
                        const el = document.createElement('div'); el.className = 'icon'; el.innerHTML = `<div>🖼️</div><div style="font-size:11px;">${file}</div>`; el.ondblclick = async () => { let content = await this.VFS.read(`C:/Users/${this.user}/Desktop`, file); this.pm.launch('sys_view', content); }; desk.appendChild(el);
                    } else if (a) {
                        const el = document.createElement('div'); el.className = 'icon'; el.innerHTML = `<div>${a.icon}</div><div style="font-size:11px;">${file.replace('.app','')}</div>`; el.ondblclick = () => this.pm.launch(appId); desk.appendChild(el);
                    }
                }
            }
            this.WM._renderDock(); 
        }

        _startOTADaemon() { setTimeout(async () => { try { let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/version.json?t=" + Date.now(), {cache: "no-store"}); if (r.ok) { let d = await r.json(); let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || "52.0.0-ALPHA"; if (d.version !== currentVer && !localStorage.getItem('GemiOS_Notified_' + d.version)) { this.bus.emit('notify', {title: '🚀 Update Available!', msg: `Version ${d.version} is ready. Open Updater.`, success: true}); localStorage.setItem('GemiOS_Notified_' + d.version, 'true'); } } } catch(e){} }, 5000); }
    }

    (async () => { const os = new Core(); await os.init(); })();
  })();
}
