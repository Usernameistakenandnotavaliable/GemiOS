/*=====================================================================
   GemiOS KERNEL - v53.2.0 (THE MASTER LINK)
   Cloud Module Loader, CSS Variables, & Glassmorphism VM.
=====================================================================*/

if (window.__GEMIOS_BOOTED__) {
    console.warn('GemiOS: Aegis handoff complete.');
} else {
    window.__GEMIOS_BOOTED__ = true;

    // --- SUPPORT CLASSES ---
    class Gemi_Bus {
        constructor() { this.h = new Map(); }
        on(e, f) { if(!this.h.has(e)) this.h.set(e, []); this.h.get(e).push(f); }
        emit(e, d) { this.h.get(e)?.forEach(f => f(d)); }
    }

    class Gemi_PM {
        constructor(bus) { this.bus = bus; this.procs = new Map(); this.pid = 1000; }
        launch(id) {
            const app = window.GemiRegistry[id];
            if(!app) return this.bus.emit('notify', {msg: `App ${id} missing.`, err: true});
            this.pid++; this.procs.set(this.pid, app);
            this.bus.emit('wm:open', {pid: this.pid, app});
            if(app.onLaunch) app.onLaunch(this.pid);
            const sm = document.getElementById('start-menu');
            if(sm) sm.classList.remove('open');
        }
        kill(pid) {
            if(!this.procs.has(pid)) return;
            const app = this.procs.get(pid); if(app.onKill) app.onKill(pid);
            document.getElementById(`win-${pid}`)?.remove();
            this.procs.delete(pid);
        }
    }

    class Gemi_WM {
        constructor(bus) { this.bus = bus; this.zIndex = 100; this.bus.on('wm:open', d => this.create(d)); }
        create({pid, app}) {
            const html = typeof app.html === 'function' ? app.html(pid) : '';
            const win = document.createElement('div');
            win.id = `win-${pid}`; win.className = 'gemi-window';
            win.style.cssText = `width:${app.width || 500}px; top:${Math.random()*40+50}px; left:${Math.random()*100+100}px; z-index:${++this.zIndex};`;
            
            win.innerHTML = `
                <div class="title-bar" onmousedown="GemiOS.wm.drag(event, '${win.id}')">
                    <div style="display:flex; align-items:center; gap:8px;"><span>${app.icon}</span> <b>${app.title}</b></div>
                    <button class="close-btn" onclick="GemiOS.pm.kill(${pid})" onmousedown="event.stopPropagation()">×</button>
                </div>
                <div class="win-content">${html}</div>
            `;
            document.getElementById('window-layer').appendChild(win);
            this.focus(win.id);
            win.onmousedown = () => this.focus(win.id);
        }
        focus(id) {
            const win = document.getElementById(id);
            if(win) win.style.zIndex = ++this.zIndex;
        }
        drag(e, id) {
            const win = document.getElementById(id); if(!win) return;
            this.focus(id);
            let offX = e.clientX - win.offsetLeft, offY = e.clientY - win.offsetTop;
            const move = ev => { win.style.left = (ev.clientX - offX)+'px'; win.style.top = Math.max(0, ev.clientY - offY)+'px'; };
            const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
            document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
        }
    }

    // --- CORE KERNEL ---
    class GemiOS_v53 {
        constructor() {
            this.version = "53.2.0-PROTOTYPE";
            this.user = localStorage.getItem('GemiOS_User') || 'Admin';
            
            this.bus = new Gemi_Bus();
            this.pm = new Gemi_PM(this.bus);
            this.wm = new Gemi_WM(this.bus);
            
            window.GemiOS = this;
            
            this.bus.on('notify', ({msg, err}) => {
                const n = document.createElement('div'); n.className = 'gemi-notif';
                n.innerHTML = `<b style="color:${err?'#ff4d4d':'#38ef7d'}">${err?'Error':'System'}</b><br>${msg}`;
                document.body.appendChild(n); setTimeout(()=>n.remove(), 3000);
            });
        }

        async init() {
            this.injectStyles();
            this.renderDesktop();
            await this.loadCloudModules();
            this.refreshDesktop();
            this.buildStartMenu();
            this.bus.emit('notify', {msg: 'Aegis Core Loaded & Cloud Synced.'});
        }

        async loadCloudModules() {
            window.GemiRegistry = { ...window.GemiCoreApps };
            const GITHUB_BASE = "https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main";
            const ts = Date.now();
            
            try {
                // Fetching the Registry
                const reg = await fetch(`${GITHUB_BASE}/registry.js?t=${ts}`);
                if(reg.ok) eval(await reg.text());

                // Fetching the Engine
                const eng = await fetch(`${GITHUB_BASE}/engine.js?t=${ts}`);
                if(eng.ok) eval(await eng.text());
                
            } catch(e) { console.warn("Cloud Sync Failed. Check GitHub URLs."); }
        }

        renderDesktop() {
            const desktop = document.createElement('div');
            desktop.id = "os-surface";
            desktop.innerHTML = `
                <div id="desktop-bg"></div>
                <div id="desktop-icons"></div>
                <div id="window-layer"></div>
                
                <div id="start-menu">
                    <div class="sm-header">👑 ${this.user}</div>
                    <div class="sm-grid" id="sm-apps"></div>
                    <div class="sm-footer" onclick="GemiOS.pm.launch('sys_update')">🔄 Cloud Sync & Restart</div>
                </div>

                <div id="taskbar-container">
                    <div id="taskbar">
                        <div class="start-btn" onclick="document.getElementById('start-menu').classList.toggle('open')">G</div>
                        <div style="width:1px; height:30px; background:rgba(255,255,255,0.1); margin:0 10px;"></div>
                        <div id="dock-icons" style="display:flex; gap:10px; flex-grow:1;"></div>
                        <div style="font-size:12px; font-weight:bold; color:#38ef7d;" id="sys-clock">00:00</div>
                    </div>
                </div>
            `;
            document.body.appendChild(desktop);
            setInterval(() => { document.getElementById('sys-clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }, 1000);
        }

        buildStartMenu() {
            const grid = document.getElementById('sm-apps');
            grid.innerHTML = '';
            for(let id in window.GemiRegistry) {
                const app = window.GemiRegistry[id];
                grid.innerHTML += `<div class="sm-item" onclick="GemiOS.pm.launch('${id}')"><div style="font-size:24px; margin-bottom:5px;">${app.icon}</div>${app.title}</div>`;
            }
        }

        async refreshDesktop() {
            const layer = document.getElementById('desktop-icons');
            if(!layer || !window.Gemi_DB) return;
            layer.innerHTML = '';
            const tx = window.Gemi_DB.transaction('nodes', 'readonly');
            const req = tx.objectStore('nodes').get('root');
            req.onsuccess = () => {
                const data = req.result?.data?.['C:']?.Users?.[this.user]?.Desktop || {};
                for(let name in data) {
                    const item = data[name];
                    const app = window.GemiRegistry[item];
                    const icon = app ? app.icon : '📄';
                    const el = document.createElement('div');
                    el.className = 'desk-icon';
                    el.innerHTML = `<div style="font-size:35px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${icon}</div>${name.replace('.app','')}`;
                    el.ondblclick = () => { if(app) this.pm.launch(item); };
                    layer.appendChild(el);
                }
            };
        }

        injectStyles() {
            const s = document.createElement('style');
            s.textContent = `
                :root { --accent: #0078d7; --accent-hover: #005a9e; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: white; margin:0; overflow:hidden; }
                #desktop-bg { position:absolute; top:0; left:0; width:100vw; height:100vh; background: url('${localStorage.getItem('GemiOS_Wall') || ''}') center/cover, linear-gradient(135deg, #0f2027, #203a43, #2c5364); z-index:-1; }
                #desktop-icons { display:grid; grid-template-columns:repeat(auto-fill, 90px); gap:15px; padding:20px; position:absolute; height:calc(100vh - 80px); align-content:start; }
                .desk-icon { display:flex; flex-direction:column; align-items:center; text-align:center; font-size:11px; cursor:pointer; padding:10px 5px; border-radius:8px; transition:0.2s; text-shadow:0 2px 4px rgba(0,0,0,0.8); }
                .desk-icon:hover { background:rgba(255,255,255,0.1); backdrop-filter:blur(5px); transform:translateY(-2px); }
                
                #taskbar-container { position:absolute; bottom:15px; width:100%; display:flex; justify-content:center; pointer-events:none; z-index:100000; }
                #taskbar { height:60px; background:rgba(10,15,20,0.5); backdrop-filter:blur(25px); border-radius:30px; display:flex; align-items:center; padding:0 20px; border:1px solid rgba(255,255,255,0.1); width:90%; max-width:800px; box-shadow:0 10px 30px rgba(0,0,0,0.5); pointer-events:auto; }
                .start-btn { width:40px; height:40px; background:linear-gradient(135deg, #38ef7d, var(--accent)); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:900; font-size:20px; box-shadow:0 0 15px rgba(56,239,125,0.4); transition:0.3s; }
                .start-btn:hover { transform:rotate(15deg) scale(1.1); }
                
                #start-menu { position:absolute; bottom:85px; left:50%; transform:translateX(-50%) translateY(20px); width:380px; background:rgba(15,20,25,0.7); backdrop-filter:blur(40px); border-radius:16px; border:1px solid rgba(255,255,255,0.1); box-shadow:0 20px 50px rgba(0,0,0,0.5); display:flex; flex-direction:column; opacity:0; pointer-events:none; transition:0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index:99999; }
                #start-menu.open { opacity:1; transform:translateX(-50%) translateY(0); pointer-events:auto; }
                .sm-header { padding:20px; border-bottom:1px solid rgba(255,255,255,0.05); font-weight:bold; font-size:18px; display:flex; align-items:center; gap:10px; }
                .sm-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; padding:20px; max-height:350px; overflow-y:auto; }
                .sm-item { background:rgba(255,255,255,0.03); border-radius:8px; padding:15px 5px; text-align:center; font-size:11px; cursor:pointer; transition:0.2s; border:1px solid transparent; }
                .sm-item:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); transform:translateY(-2px); }
                .sm-footer { padding:15px; border-top:1px solid rgba(255,255,255,0.05); text-align:center; cursor:pointer; font-size:12px; color:#aaa; transition:0.2s; }
                .sm-footer:hover { background:rgba(255,255,255,0.1); color:white; }

                .gemi-window { position:absolute; background:rgba(20,25,30,0.85); backdrop-filter:blur(30px); border-radius:12px; border:1px solid rgba(255,255,255,0.15); display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,0.6); animation:popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow:hidden; }
                @keyframes popIn { 0% { opacity:0; transform:scale(0.9) translateY(20px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
                .title-bar { padding:10px 15px; background:rgba(0,0,0,0.4); border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center; cursor:grab; font-size:13px; }
                .close-btn { background:#ff4d4d; border:none; color:white; width:16px; height:16px; border-radius:50%; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:0.8; transition:0.2s; }
                .close-btn:hover { opacity:1; box-shadow:0 0 10px #ff4d4d; }
                .win-content { padding:15px; flex-grow:1; display:flex; flex-direction:column; overflow-y:auto; min-height:100px; }

                .gemi-notif { position:fixed; top:20px; right:20px; background:rgba(20,25,30,0.9); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.1); border-left:4px solid #38ef7d; padding:15px; border-radius:8px; z-index:1000000; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-size:12px; animation:slideIn 0.3s ease-out; }
                @keyframes slideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
            `;
            document.head.appendChild(s);
        }
    }

    // Failsafe
    window.GemiCoreApps = {};
    const OS = new GemiOS_v53();
    OS.init();
}
