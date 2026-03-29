/*=====================================================================
   GemiOS KERNEL - v52.0.0 OFFICIAL RELEASE (PHASE 2)
   Features: GemiLock, Desktop Folders, VFS Wallpapers.
=====================================================================*/

if (window.__GEMIOS_BOOTED_STABLE__) {
    console.warn('GemiOS: Stable Kernel already active.');
} else {
    window.__GEMIOS_BOOTED_STABLE__ = true;

    class GemiOS_Kernel {
        constructor() {
            this.version = "52.0.0-RELEASE";
            this.user = localStorage.getItem('GemiOS_User') || 'Admin';
            this.isLocked = true;
            
            this.bus = new Gemi_EventBus();
            this.vfs = new Gemi_VFS(this.bus);
            this.drivers = new Gemi_DriverManager();
            this.audio = new Gemi_AudioEngine(this.drivers);
            this.pm = new Gemi_ProcessManager(this.bus, this.audio);
            this.wm = new Gemi_WindowManager(this.bus, this.audio, this.drivers);
            
            window.GemiOS = this;
        }

        async boot() {
            this.drivers.init();
            this.injectGlobalStyles();
            await this.vfs.init();
            await this.vfs.verifyUserFolders(this.user);
            await this.loadRemoteModules();
            
            // Initializing environment but keeping it hidden behind GemiLock
            this.renderDesktopEnvironment();
            this.renderLockScreen();
        }

        renderLockScreen() {
            const lock = document.createElement('div');
            lock.id = 'gemi-lock';
            lock.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${localStorage.getItem('GemiOS_Wall') || ''}') center/cover; backdrop-filter:blur(20px); z-index:2000000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; transition: 1s ease-in-out;`;
            
            lock.innerHTML = `
                <div style="font-size:80px; margin-bottom:10px;">👑</div>
                <div style="font-size:24px; font-weight:300; margin-bottom:30px;">Welcome back, <b>${this.user}</b></div>
                <div id="lock-status" style="margin-bottom:15px; font-size:14px; color:#38ef7d;">System Encrypted</div>
                <button onclick="GemiOS.unlock()" style="padding:15px 40px; background:var(--accent); border:none; border-radius:30px; color:white; font-weight:bold; cursor:pointer; font-size:16px; box-shadow:0 10px 20px rgba(0,0,0,0.3);">UNSEAL SESSION</button>
                <div style="margin-top:40px; font-family:monospace; opacity:0.5;">GemiOS v52.0.0 Stable</div>
            `;
            document.body.appendChild(lock);
        }

        unlock() {
            this.isLocked = false;
            this.audio.play('startup');
            const lock = document.getElementById('gemi-lock');
            lock.style.transform = 'translateY(-100%)';
            lock.style.opacity = '0';
            setTimeout(() => lock.remove(), 1000);
            this.refreshDesktop();
        }

        async loadRemoteModules() {
            window.GemiRegistry = { ...window.GemiCoreApps };
            const timestamp = Date.now();
            try {
                const regReq = await fetch(`https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/refs/heads/main/registry.js?t=${timestamp}`);
                if(regReq.ok) eval(await regReq.text());
                window.GemiRegistry = { ...window.GemiCoreApps, ...window.GemiRegistry };
            } catch(e) { console.error("Registry Sync Failed."); }
        }

        renderDesktopEnvironment() {
            document.body.innerHTML = `
                <div id="desktop-bg" style="position:fixed; width:100%; height:100%; z-index:-1; background:url('${localStorage.getItem('GemiOS_Wall') || ''}') center/cover #0f2027;"></div>
                <div id="desktop-icons" style="display:grid; grid-template-columns:repeat(auto-fill, 100px); grid-template-rows:repeat(auto-fill, 110px); gap:20px; padding:30px;"></div>
                <div id="window-layer"></div>
                <div id="taskbar-container">
                    <div id="taskbar">
                        <div class="start-btn" onclick="GemiOS.showPowerMenu()">G</div>
                        <div id="dock-icons" style="display:flex; gap:10px;"></div>
                        <div id="system-clock" style="margin-left:auto; font-size:13px; font-weight:bold;">00:00</div>
                    </div>
                </div>
            `;
            setInterval(() => {
                const el = document.getElementById('system-clock');
                if(el) el.innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            }, 1000);
        }

        async refreshDesktop() {
            const layer = document.getElementById('desktop-icons');
            if(!layer) return; layer.innerHTML = '';
            const path = `C:/Users/${this.user}/Desktop`;
            const files = await this.vfs.getDir(path) || {};
            
            for(let name in files) {
                const item = files[name];
                const icon = document.createElement('div');
                icon.className = 'icon-block';
                
                // Logic for Folders vs Apps
                let isFolder = (typeof item === 'object' && !name.endsWith('.app') && !name.endsWith('.txt') && !name.endsWith('.png'));
                let displayIcon = isFolder ? '📁' : (window.GemiRegistry[item]?.icon || '📄');
                
                icon.innerHTML = `<div style="font-size:45px;">${displayIcon}</div><div style="margin-top:5px; font-weight:500;">${name.replace('.app','')}</div>`;
                icon.ondblclick = () => {
                    if(isFolder) GemiOS.pm.launch('sys_drive', `${path}/${name}`);
                    else GemiOS.pm.launch(item);
                };
                layer.appendChild(icon);
            }
        }

        injectGlobalStyles() {
            const s = document.createElement('style');
            s.textContent = `
                :root { --accent: ${this.drivers.drivers.accent}; }
                body { margin:0; background:#000; font-family:'Inter', sans-serif; color:white; overflow:hidden; }
                .icon-block { display:flex; flex-direction:column; align-items:center; cursor:pointer; text-align:center; font-size:11px; padding:10px; border-radius:8px; transition:0.2s; text-shadow: 1px 1px 4px rgba(0,0,0,0.8); }
                .icon-block:hover { background:rgba(255,255,255,0.1); backdrop-filter:blur(5px); }
                #taskbar { position:absolute; bottom:15px; left:50%; transform:translateX(-50%); height:60px; background:rgba(15,15,15,0.6); backdrop-filter:blur(20px); border-radius:30px; display:flex; align-items:center; padding:0 25px; border:1px solid rgba(255,255,255,0.15); width: auto; min-width:300px; gap:20px; z-index:100000; }
                .start-btn { width:42px; height:42px; background:var(--accent); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:900; transition:0.3s; box-shadow:0 5px 15px rgba(0,0,0,0.3); }
                .start-btn:hover { transform: scale(1.1) rotate(15deg); }
            `;
            document.head.appendChild(s);
        }
    }

    // Support classes omitted for brevity (same as v52.3 refactor)
    // ... [VFS, PM, WM classes from previous message] ...

    const Kernel = new GemiOS_Kernel();
    Kernel.boot();
}
