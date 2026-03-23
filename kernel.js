// =========================================================================
// GemiOS CLOUD HYPERVISOR - v38.1.1 (THE POLISH PATCH)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v38';
console.log("[BOOT] Hypervisor targeting state: " + bootVersion);

if (bootVersion !== 'v38' && bootVersion !== 'v37') { 
    document.open(); document.write('<body style="background:#000;color:#0f0;font-family:monospace;padding:50px;"><h2>Legacy OS Archived.</h2><button onclick="localStorage.setItem(\'GemiOS_TargetVersion\',\'v38\');location.reload()" style="padding:10px;background:#0f0;color:#000;font-weight:bold;cursor:pointer;border:none;">Reboot to V38.1.1</button></body>'); document.close(); 
} else {
    class VirtualFileSystem {
        constructor() {
            this.MAX_STORAGE = 10485760; // 10MB Quota
            let drive = localStorage.getItem('GemiOS_TreeFS');
            if(!drive) {
                this.root = { "C:": { "System": { "boot.log": "GemiOS V38.1.1 Initialized.", "sys_mail.json": "[]" }, "Users": { "Admin": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} }, "Guest": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} } } } };
                this.forceSave();
            } else { this.root = JSON.parse(drive); }
        }
        getUsage() { return { used: new Blob([JSON.stringify(this.root)]).size, max: this.MAX_STORAGE }; }
        forceSave() { localStorage.setItem('GemiOS_TreeFS', JSON.stringify(this.root)); }
        save() { 
            let data = JSON.stringify(this.root); let size = new Blob([data]).size;
            if(size > this.MAX_STORAGE) { if(window.GemiOS) GemiOS.notify("Disk Full!", `NVRAM quota exceeded.`, false); return false; }
            try { localStorage.setItem('GemiOS_TreeFS', data); if(window.GemiOS && GemiOS.triggerIO) GemiOS.triggerIO(); return true; } catch(e) { if(window.GemiOS) GemiOS.notify("Save Failed", "Browser blocked storage.", false); return false; }
        }
        getDir(path, create = false) {
            let parts = path.split('/').filter(p => p); let curr = this.root;
            for(let p of parts) { if(curr[p] === undefined) { if(create) curr[p] = {}; else return null; } curr = curr[p]; }
            return curr;
        }
        read(path, file) { let dir = this.getDir(path); return (dir && dir[file] !== undefined) ? dir[file] : null; }
        write(path, file, data) { let dir = this.getDir(path, true); if(dir) { let backup = dir[file]; dir[file] = data; if(!this.save()) { if(backup) dir[file] = backup; else delete dir[file]; return false; } return true; } return false; }
        mkdir(path, folderName) { let dir = this.getDir(path); if(dir && dir[folderName] === undefined) { dir[folderName] = {}; return this.save(); } return false; }
        format() { localStorage.clear(); location.reload(); }
        delete(path, file) { let dir = this.getDir(path); if(dir && dir[file] !== undefined) { delete dir[file]; this.save(); return true; } return false; }
    }

    class WindowManager {
        constructor() { this.zIndex = 100; this.windows = {}; }
        createWindow(pid, title, content, width) {
            let wid = 'win_' + pid;
            let watermark = `<div style="position:absolute; bottom:4px; right:8px; font-size:9px; color:inherit; opacity:0.3; pointer-events:none; font-weight:bold; font-family:sans-serif; z-index:9999;">© 2026 GemiOS</div>`;
            let html = `
                <div class="win" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${width}px; z-index:${++this.zIndex};" onmousedown="GemiOS.WM.focus('${wid}')">
                    <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event, '${wid}')">
                        <span>${title}</span> 
                        <div>
                            <button class="ctrl-btn min-btn" onclick="GemiOS.WM.minimize('${wid}', '${pid}')">-</button>
                            <button class="ctrl-btn snap-btn" onclick="GemiOS.WM.snap('${wid}', 'left')">&lt;</button>
                            <button class="ctrl-btn snap-btn" onclick="GemiOS.WM.snap('${wid}', 'right')">&gt;</button>
                            <button class="ctrl-btn close-btn" onclick="GemiOS.PM.kill(${pid})">X</button>
                        </div>
                    </div>
                    <div class="content" id="content_${pid}" style="position:relative; overflow:hidden; display:flex; flex-direction:column;">${content}${watermark}</div>
                    <div class="resize-handle"></div>
                </div>`;
            document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);
            this.windows[pid] = document.getElementById(wid);
            this.updateTaskbar(pid, title);
        }
        focus(wid) { let el = document.getElementById(wid); if(el) el.style.zIndex = ++this.zIndex; }
        drag(e, wid) {
            let w = document.getElementById(wid); if(!w || w.dataset.maximized === "true") return;
            let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop; this.focus(wid); w.style.transition = 'none';
            document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
            document.onmouseup = () => { document.onmousemove = null; w.style.transition = 'width 0.3s, height 0.3s, top 0.3s, left 0.3s, background 0.3s, color 0.3s, transform 0.3s'; document.onmouseup = null; };
        }
        maximize(wid) {
            let w = document.getElementById(wid); if(!w) return;
            if(w.dataset.maximized === "true") { w.style.top = w.dataset.pT; w.style.left = w.dataset.pL; w.style.width = w.dataset.pW; w.style.height = w.dataset.pH; w.dataset.maximized = "false"; w.style.borderRadius = "12px"; } 
            else { w.dataset.pT = w.style.top; w.dataset.pL = w.style.left; w.dataset.pW = w.style.width; w.dataset.pH = w.style.height; w.style.top = "0px"; w.style.left = "0px"; w.style.width = "100vw"; w.style.height = "calc(100vh - 60px)"; w.dataset.maximized = "true"; w.style.borderRadius = "0px"; }
        }
        snap(wid, side) {
            let w = document.getElementById(wid); if(!w) return;
            if(w.dataset.maximized === "false") { w.dataset.pT = w.style.top; w.style.left = w.style.left; w.dataset.pW = w.style.width; w.dataset.pH = w.style.height; }
            w.style.top = "0px"; w.style.height = "calc(100vh - 60px)"; w.style.width = "50vw"; w.style.borderRadius = "0px";
            if (side === 'left') w.style.left = "0px"; else w.style.left = "50vw"; w.dataset.maximized = "true"; this.focus(wid);
        }
        minimize(wid, pid) {
            let w = document.getElementById(wid); if(!w) return;
            if(w.style.opacity === '0') { w.style.opacity = '1'; w.style.transform = 'scale(1) translateY(0)'; w.style.pointerEvents = 'auto'; this.focus(wid); document.getElementById('tb-item-'+pid).classList.add('active'); 
            } else { w.style.opacity = '0'; w.style.transform = 'scale(0.9) translateY(20px)'; w.style.pointerEvents = 'none'; document.getElementById('tb-item-'+pid).classList.remove('active'); }
        }
        updateTaskbar(pid, title) { document.getElementById('taskbar-apps').innerHTML += `<div id="tb-item-${pid}" class="tb-item active" onclick="GemiOS.WM.minimize('win_${pid}', '${pid}')">${title.substring(0,10)}</div>`; }
        removeWindow(pid) { if(this.windows[pid]) { this.windows[pid].remove(); delete this.windows[pid]; } let tbItem = document.getElementById('tb-item-'+pid); if(tbItem) tbItem.remove(); }
    }

    class ProcessManager {
        constructor() { this.processes = {}; this.pidCounter = 1000; }
        launch(appId, fileData = null) {
            let sm = document.getElementById('start-menu'); if (sm) sm.classList.remove('open');
            if(!GemiOS.Registry[appId]) return GemiOS.notify("Execution Error", `App ${appId} not found in Registry.`, false);
            let pid = ++this.pidCounter; let app = GemiOS.Registry[appId];
            this.processes[pid] = { id: appId, title: app.title };
            GemiOS.WM.createWindow(pid, app.title, app.html(pid, fileData), app.width);
            if(app.onLaunch) app.onLaunch(pid, fileData);
        }
        kill(pid) {
            if(!this.processes[pid]) return; let appId = this.processes[pid].id;
            if(GemiOS.Registry[appId] && GemiOS.Registry[appId].onKill) GemiOS.Registry[appId].onKill(pid);
            let w = document.getElementById('win_' + pid);
            if(w) { w.style.opacity = '0'; w.style.transform = 'scale(0.9)'; setTimeout(() => { GemiOS.WM.removeWindow(pid); delete this.processes[pid]; }, 200); } 
            else { GemiOS.WM.removeWindow(pid); delete this.processes[pid]; }
        }
    }

    // SYSTEM CORE APPS ONLY (To keep kernel tiny)
    const AppRegistry = {
        'sys_term': { icon: '⌨️', title: 'Bash Terminal', width: 500, html: (pid) => `<div id="t-out-${pid}" style="flex-grow:1; background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; overflow-y:auto; border-radius:6px;">GemiOS Core Kernel Active.<br>Type 'help' to see commands.</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span id="t-path-${pid}" style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/${GemiOS.user}></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`, onLaunch: (pid) => { GemiOS.termStates[pid] = 'C:/Users/' + GemiOS.user; setTimeout(()=>document.getElementById('t-in-'+pid).focus(),100); } },
        'sys_drive': { icon: '🗂️', title: 'Explorer 2.0', width: 520, html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div><div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px;"></div><div style="margin-top:10px; padding:5px; background:rgba(0,0,0,0.3); border-radius:4px;"><div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;"><span id="d-bar-text-${pid}">Calculating NVRAM...</span><span>10MB MAX</span></div><div style="height:6px; background:#222; border-radius:3px; overflow:hidden;"><div id="d-bar-${pid}" style="height:100%; background:var(--accent); width:0%; transition: width 0.3s ease;"></div></div></div>`, onLaunch: (pid) => { GemiOS.driveStates[pid] = 'C:/Users/' + GemiOS.user; GemiOS.renderDrive(pid); GemiOS.driveItvs = GemiOS.driveItvs || {}; GemiOS.driveItvs[pid] = setInterval(() => { let u = GemiOS.VFS.getUsage(); let pct = Math.max((u.used / u.max) * 100, 0.5); let bar = document.getElementById(`d-bar-${pid}`); let txt = document.getElementById(`d-bar-text-${pid}`); if(bar) { bar.style.width = Math.min(pct, 100) + '%'; bar.style.background = pct > 90 ? '#ff4d4d' : 'var(--accent)'; } if(txt) txt.innerText = `${(u.used/1024).toFixed(2)} KB Used`; }, 500); }, onKill: (pid) => { if(GemiOS.driveItvs && GemiOS.driveItvs[pid]) clearInterval(GemiOS.driveItvs[pid]); } },
        'sys_set': { icon: '⚙️', title: 'System Settings', width: 420, html: () => `<div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary">Apply Wallpaper</button></div><div class="sys-card"><b style="font-size:14px;">Accent Color</b><br><div style="display:flex; gap:10px; margin-top:10px;"><div onclick="localStorage.setItem('GemiOS_Accent', '#0078d7'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#0078d7; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ff00cc'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff00cc; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#38ef7d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#38ef7d; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ff4d4d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff4d4d; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ffb400'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ffb400; cursor:pointer;"></div></div></div><div class="sys-card" style="border-left:4px solid var(--accent);"><b style="font-size:14px;">GemiSync (Export OS)</b><br><button onclick="GemiOS.exportNVRAM()" class="btn-primary" style="margin-top:5px;">Export .gemos Backup</button></div><button onclick="alert('Please restart and use F2 BIOS menu for Secure Erase.')" class="btn-danger">Format System (Moved to BIOS)</button>` },
        'sys_update': { icon: '☁️', title: 'Cloud Updater', width: 380, html: () => `<div class="sys-card" style="text-align:center; flex-grow:1;"><div style="font-size:40px;">☁️</div><h3 style="margin:5px 0;">Dual-OTA Updater</h3><p style="font-size:13px; opacity:0.8;">Kernel: <b id="kern-ver">v38.1.1-POLISH</b></p><div id="upd-stat" style="font-size:12px; min-height:15px; margin-bottom:10px;">Ready to scan Cloud Network.</div><button id="upd-btn" onclick="GemiOS.triggerOTA(this)" class="btn-primary">Check for Updates</button></div>` },
        'sys_log': { icon: '📋', title: 'Chronicles', width: 500, html: () => `<div style="flex-grow:1; overflow-y: auto; padding-right: 5px;"><div class="sys-card" style="border-left:4px solid #38ef7d;"><b>v38.1.1 (The Polish Patch)</b> - Context menus dynamically generate unique filenames. Rewrote Web Audio API for a majestic EMaj9 shutdown sequence.</div><div class="sys-card"><b>v38.1.0 (Linker Hotfix)</b> - Repaired Dynamic Linker ID mapping.</div><div class="sys-card"><b>v38.0.0 (Command & Control)</b> - Added GemiSearch and Native Action Center.</div><div class="sys-card"><b>v37.0.0 (Economy)</b> - Virtual Wallet added. Monetized App Store.</div><div class="sys-card"><b>v36.1.0 (Dynamic Linker)</b> - Kernel and Registry decoupled.</div><div class="sys-card"><b>v35.0.0 (The BIOS)</b> - Added F2 Pre-Boot setup utility.</div><div class="sys-card"><b>v1.0 (Legacy)</b> - The Original.</div></div>` },
        'sys_store': { icon: '🛍️', title: 'GemiStore Market', width: 700, html: (pid) => `<div class="sys-card" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg, var(--accent), #000); border:none;"><div style="font-size:24px; font-weight:bold;">GemiStore</div><div style="font-size:40px;">🛍️</div></div><div id="store-list-${pid}" style="flex-grow:1; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:5px;"></div>`, onLaunch: (pid) => { GemiOS.renderStore(pid); } },
        'sys_disk': { icon: '💽', title: 'GemiDisk', width: 400, html: (pid) => `<div class="sys-card" style="text-align:center;"><div style="font-size:40px;">💽</div><h3 style="margin:5px 0;">NVRAM Status</h3><p style="font-size:12px; opacity:0.8;">Strict Quota Enforced</p><div style="width:100%; height:20px; background:rgba(0,0,0,0.5); border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.2); margin:15px 0;"><div id="disk-fill-${pid}" style="width:0%; height:100%; background:var(--accent); transition:width 0.5s ease;"></div></div><b id="disk-text-${pid}">Calculating...</b></div>`, onLaunch: (pid) => { GemiOS.diskItvs = GemiOS.diskItvs || {}; GemiOS.diskItvs[pid] = setInterval(() => { let u = GemiOS.VFS.getUsage(); let pct = Math.max((u.used / u.max) * 100, 0.2); let elF = document.getElementById(`disk-fill-${pid}`); let elT = document.getElementById(`disk-text-${pid}`); if(elF) { elF.style.width = Math.min(pct, 100) + '%'; elF.style.background = pct > 90 ? '#ff4d4d' : 'var(--accent)'; } if(elT) elT.innerText = `${(u.used/1024).toFixed(2)} KB / 10.00 MB`; }, 500); }, onKill: (pid) => { if(GemiOS.diskItvs && GemiOS.diskItvs[pid]) clearInterval(GemiOS.diskItvs[pid]); } },
        'sys_task': { icon: '📊', title: 'System Monitor', width: 450, html: (pid) => `<div style="display:flex; gap:10px;"><div class="sys-card" style="flex:1; border-left: 4px solid #38ef7d;"><b>CPU</b><canvas id="cpu-cvs-${pid}" width="180" height="80"></canvas></div><div class="sys-card" style="flex:1; border-left: 4px solid #4db8ff;"><b>RAM</b><canvas id="ram-cvs-${pid}" width="180" height="80"></canvas></div></div><div class="sys-card" style="border-left: 4px solid #ff4d4d; margin-top:10px;"><b>PIDs</b></div><div id="tm-list-${pid}" style="flex-grow:1; overflow-y:auto;"></div>`, onLaunch: (pid) => { let cpuH = [], ramH = []; GemiOS.tmItvs = GemiOS.tmItvs || {}; GemiOS.tmItvs[pid] = setInterval(() => { let h = ''; let pCount = 0; for(let p in GemiOS.PM.processes) { pCount++; h += `<div style="padding:8px; background:rgba(255,255,255,0.1); margin-bottom:5px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px;">${GemiOS.PM.processes[p].title} [${p}]</span><button onclick="GemiOS.PM.kill(${p})" class="btn-danger" style="padding:4px 8px; width:auto; font-size:11px;">Kill</button></div>`; } let el = document.getElementById(`tm-list-${pid}`); if(el) el.innerHTML = h; let cCvs = document.getElementById(`cpu-cvs-${pid}`); let rCvs = document.getElementById(`ram-cvs-${pid}`); if(cCvs && rCvs) { let cCtx = cCvs.getContext('2d'); let rCtx = rCvs.getContext('2d'); cpuH.push(Math.random() * 20 + (pCount*5)); if(cpuH.length>30) cpuH.shift(); ramH.push(pCount * 12 + (Math.random()*5)); if(ramH.length>30) ramH.shift(); cCtx.clearRect(0,0,180,80); rCtx.clearRect(0,0,180,80); cCtx.strokeStyle = '#38ef7d'; cCtx.lineWidth = 2; cCtx.beginPath(); cpuH.forEach((v,i) => i===0 ? cCtx.moveTo(i*6, 80-v) : cCtx.lineTo(i*6, 80-v)); cCtx.stroke(); rCtx.strokeStyle = '#4db8ff'; rCtx.lineWidth = 2; rCtx.beginPath(); ramH.forEach((v,i) => i===0 ? rCtx.moveTo(i*6, 80-v) : rCtx.lineTo(i*6, 80-v)); rCtx.stroke(); } }, 1000); }, onKill: (pid) => clearInterval(GemiOS.tmItvs[pid]) }
    };

    class CoreOS {
        constructor() { 
            this.VFS = new VirtualFileSystem(); 
            this.WM = new WindowManager(); 
            this.PM = new ProcessManager(); 
            this.Registry = AppRegistry; 
            this.termStates = {}; this.driveStates = {}; 
            this.user = 'Admin'; this.idleTime = 0; 
            this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet')) || 500; 
            this.notifications = []; 
        }

        async init() { 
            this.injectStyles(); 
            window.addEventListener('storage', (e) => { if(e.key === 'GemiChat_Log') { if(this.chatPid) this.updateChatBox(this.chatPid); } }); 
            
            await this.loadDynamicRegistry(); 
            
            if(sessionStorage.getItem('GemiOS_Session') === 'active') { 
                this.user = sessionStorage.getItem('GemiOS_User') || 'Admin'; 
                this.patchDesktopData(); this.launchDesktop(); this.initScreensaver(); this.startOTADaemon(); 
            } else { 
                this.runBootSequence(); 
            } 
        }

        saveWallet() { localStorage.setItem('GemiOS_Wallet', this.wallet); }
        updateWalletUI() { let w = document.getElementById('os-wallet-display'); if(w) w.innerText = `🪙 ${Math.floor(this.wallet)}`; }

        async loadDynamicRegistry() {
            let regCache = localStorage.getItem('GemiOS_Cache_Registry');
            let fuse = () => { for(let file in window.GemiRegistry) { let app = window.GemiRegistry[file]; if(app && app.id) this.Registry[app.id] = app; } };
            if(regCache) {
                try { eval(regCache); fuse(); console.log("[LINKER] App Registry fused securely."); } 
                catch(e) { console.error("[LINKER] Cache Corrupt:", e); }
            } else {
                try {
                    let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/registry.js?t=" + Date.now());
                    if(r.ok) { let code = await r.text(); localStorage.setItem('GemiOS_Cache_Registry', code); eval(code); fuse(); }
                } catch(e) { console.warn("[LINKER] Offline."); }
            }
        }

        startOTADaemon() { 
            let alerted = false; 
            setInterval(async () => { 
                if(alerted) return; 
                try { 
                    let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/version.json?t=" + new Date().getTime()); 
                    if(r.ok) { 
                        let d = await r.json(); let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || "38.1.1-POLISH"; 
                        if(d.version !== currentVer) { this.notify("🚀 Update Available!", `Version ${d.version} is ready.`); alerted = true; } 
                    } 
                } catch(e) {} 
            }, 15000); 
        }

        patchDesktopData() { let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop', true); let appsToLoad = { 'Explorer.app': 'sys_drive', 'GemiStore.app': 'sys_store', 'Settings.app': 'sys_set', 'Terminal.app': 'sys_term' }; for(let a in appsToLoad) { if(!desk[a]) this.VFS.write('C:/Users/' + this.user + '/Desktop', a, appsToLoad[a]); } }
        
        runBootSequence() { document.body.innerHTML = `<div id="gui-boot" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:#050505;display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;z-index:999999;transition:opacity 0.5s ease;"><div style="font-size:90px; animation: float 3s ease-in-out infinite; filter:drop-shadow(0 0 25px var(--accent));">🌌</div><h1 style="font-family:'Inter',sans-serif; font-weight:600; letter-spacing:6px; margin-top:20px; font-size:32px;">GemiOS<span style="color:var(--accent);">38.1.1</span></h1><div style="margin-top:5px; font-family:monospace; font-size:12px; color:#666; letter-spacing:2px;">MOUNTING DESKTOP...</div><div class="spinner" style="margin-top:40px;"></div></div>`; setTimeout(() => { let bs = document.getElementById('gui-boot'); bs.style.opacity = '0'; setTimeout(() => this.showLoginScreen(), 500); }, 1000); }
        
        showLoginScreen() { this.loadWallpaper(); document.body.innerHTML = `<div id="desktop-bg" style="filter:blur(15px) brightness(0.6); transform:scale(1.05);"></div><div id="login-ui" style="position:absolute; top:0; left:0; width:100vw; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; z-index:999; animation: fadeIn 0.5s ease forwards;"><div style="font-size:70px; background:rgba(255,255,255,0.1); border-radius:50%; width:120px; height:120px; display:flex; justify-content:center; align-items:center; margin-bottom:20px; border:2px solid rgba(255,255,255,0.2); box-shadow:0 10px 30px rgba(0,0,0,0.5); backdrop-filter:blur(10px);">👥</div><h2 style="margin:0 0 30px 0; font-size:28px; font-weight:500; letter-spacing:2px;">Select User</h2><div style="display:flex; gap:25px; margin-bottom:20px;"><div onclick="GemiOS.authenticate('Admin')" style="cursor:pointer; text-align:center; padding:20px 40px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:16px; transition:0.3s; backdrop-filter:blur(10px);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)';"><div style="font-size:35px; margin-bottom:10px;">👑</div><b style="font-size:16px;">Admin</b></div></div></div>`; }
        
        playStartupChime() { if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)(); if(this.actx.state === 'suspended') this.actx.resume(); const t = this.actx.currentTime; const freqs = [261.63, 329.63, 392.00, 493.88, 587.33]; freqs.forEach((f, i) => { let osc = this.actx.createOscillator(); let gain = this.actx.createGain(); osc.type = 'sine'; osc.frequency.value = f; osc.connect(gain); gain.connect(this.actx.destination); osc.start(t + i * 0.1); gain.gain.setValueAtTime(0, t + i * 0.1); gain.gain.linearRampToValueAtTime(0.2, t + i * 0.1 + 0.5); gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.1 + 3.0); osc.stop(t + i * 0.1 + 3.0); }); }
        
        // V38.1.1 EMaj9 Shutdown Sweep + Sub Bass Drop
        playShutdownChime() { 
            if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)(); 
            if(this.actx.state === 'suspended') this.actx.resume(); 
            const t = this.actx.currentTime; 
            const freqs = [1108.73, 987.77, 830.61, 659.25, 329.63]; 
            freqs.forEach((f, i) => { 
                let osc = this.actx.createOscillator(); let gain = this.actx.createGain(); 
                osc.type = 'sine'; osc.frequency.value = f; osc.connect(gain); gain.connect(this.actx.destination); 
                osc.start(t + i * 0.12); 
                gain.gain.setValueAtTime(0, t + i * 0.12); 
                gain.gain.linearRampToValueAtTime(0.15, t + i * 0.12 + 0.1); 
                gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 2.5); 
                osc.stop(t + i * 0.12 + 2.5); 
            }); 
            let bass = this.actx.createOscillator(); let bGain = this.actx.createGain();
            bass.type = 'triangle'; bass.frequency.value = 164.81; // E3
            bass.connect(bGain); bGain.connect(this.actx.destination);
            bass.start(t + 0.6);
            bGain.gain.setValueAtTime(0, t + 0.6);
            bGain.gain.linearRampToValueAtTime(0.3, t + 0.7);
            bGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.0);
            bass.stop(t + 3.0);
        }
        
        authenticate(username) { let ui = document.getElementById('login-ui'); if(ui) { ui.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; ui.style.opacity = '0'; ui.style.transform = 'scale(1.1)'; } this.user = username; this.patchDesktopData(); this.playStartupChime(); sessionStorage.setItem('GemiOS_Session', 'active'); sessionStorage.setItem('GemiOS_User', username); setTimeout(() => { this.launchDesktop(); }, 300); }
        
        lockSystem() { this.playShutdownChime(); let bg = document.getElementById('desktop-bg'); if(bg) bg.style.filter = "blur(20px) grayscale(100%) brightness(0.2)"; let overlay = document.createElement('div'); overlay.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 0.8s ease;pointer-events:none;color:white;font-family:sans-serif;'; overlay.innerHTML = `<div class="spinner" style="margin-bottom:20px;"></div><div style="font-size:18px; letter-spacing:2px; font-weight:300;">Shutting down...</div>`; document.body.appendChild(overlay); setTimeout(() => { overlay.style.opacity = '1'; }, 50); setTimeout(() => { sessionStorage.removeItem('GemiOS_Session'); location.reload(); }, 1500); }
        
        notify(title, message, isSuccess = true) { 
            let container = document.getElementById('notif-container'); if(!container) return; 
            let icon = isSuccess ? '✅' : '🔔'; let color = isSuccess ? 'var(--accent)' : '#4db8ff'; 
            let n = document.createElement('div'); n.className = 'gemi-notif'; 
            n.innerHTML = `<div style="font-size:20px;">${icon}</div><div><div style="font-weight:bold; color:${color}; margin-bottom:2px;">${title}</div><div style="font-size:12px; opacity:0.9;">${message}</div></div>`; 
            container.appendChild(n); void n.offsetWidth; n.style.transform = 'translateX(0)'; n.style.opacity = '1'; 
            setTimeout(() => { n.style.transform = 'translateX(120%)'; n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 3500); 
            
            let time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            this.notifications.unshift({time, title, message, color});
            this.renderActionCenter();
        }

        renderActionCenter() {
            let hist = document.getElementById('notif-history');
            if(hist) {
                if(this.notifications.length === 0) { hist.innerHTML = '<div style="opacity:0.5; text-align:center; margin-top:20px;">No new notifications</div>'; return; }
                let h = '';
                this.notifications.forEach(n => { h += `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-bottom:10px; border-left:3px solid ${n.color};"><div style="display:flex; justify-content:space-between; font-size:11px; color:#888; margin-bottom:5px;"><span>${n.title}</span><span>${n.time}</span></div><div style="font-size:13px;">${n.message}</div></div>`; });
                hist.innerHTML = h;
            }
        }
        
        clearNotifs() { this.notifications = []; this.renderActionCenter(); }

        launchDesktop() { this.buildUI(); this.renderDesktopIcons(); this.applyTheme(); this.loadWallpaper(); this.startClock(); this.initContextMenu(); this.initRealityBridge(); let bg = document.getElementById('desktop-bg'); if(bg) { bg.style.filter = "none"; bg.style.transform = "scale(1)"; } window.dragWidget = function(e, id) { if(e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return; let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop; document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; }; document.onmouseup = () => document.onmousemove = null; }; }
        
        initScreensaver() { let ss = document.createElement('canvas'); ss.id = 'gemi-screensaver'; ss.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:black;z-index:9999998;opacity:0;pointer-events:none;transition:opacity 1s ease;'; document.body.appendChild(ss); let ctx = ss.getContext('2d'); let stars = []; for(let i=0; i<200; i++) stars.push({x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, s:Math.random()*2}); setInterval(() => { if(ss.style.opacity === '1') { if(ss.width !== window.innerWidth) { ss.width = window.innerWidth; ss.height = window.innerHeight; } ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0,0,ss.width,ss.height); ctx.fillStyle = 'white'; stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI*2); ctx.fill(); s.x -= s.s; if(s.x < 0) { s.x = ss.width; s.y = Math.random()*ss.height; } }); } }, 30); let resetIdle = () => { this.idleTime = 0; if(ss.style.opacity === '1') { ss.style.opacity = '0'; ss.style.pointerEvents = 'none'; } }; document.onmousemove = resetIdle; document.onkeydown = resetIdle; document.onclick = resetIdle; setInterval(() => { this.idleTime++; if(this.idleTime >= 60) { ss.style.opacity = '1'; ss.style.pointerEvents = 'auto'; } }, 1000); }
        triggerIO() { let io = document.getElementById('io-indicator'); if(io) { io.style.opacity = '1'; clearTimeout(this.ioTimer); this.ioTimer = setTimeout(() => { io.style.opacity = '0.2'; }, 800); } }

        buyApp(filename, appId, pid, btnId, price) { 
            if(this.wallet < price) { this.notify("Transaction Failed", `Insufficient funds. Needs 🪙 ${price}`, false); this.playNote(150); return; }
            this.wallet -= price; this.saveWallet(); this.updateWalletUI();
            if(this.VFS.write('C:/Users/' + this.user + '/Desktop', filename, appId)) { this.notify("Purchase Successful", `Downloaded ${filename}!`); this.renderDesktopIcons(); let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-sec'; btn.innerText = 'Installed'; btn.disabled = true; btn.style.background = ''; btn.style.color = 'inherit'; } } 
        }

        renderStore(pid) { 
            let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop'); let h = ''; 
            if(!window.GemiRegistry) { document.getElementById(`store-list-${pid}`).innerHTML = "<div style='grid-column:span 2; text-align:center; padding:20px;'>Registry Offline.</div>"; return; }
            for(let f in window.GemiRegistry) { 
                let a = window.GemiRegistry[f]; if(!a.desc) continue;
                let isInst = desk[f] !== undefined; let bId = `st-btn-${a.title.replace(/\s/g,'')}-${pid}`; let price = a.price || 0;
                let btnHtml = isInst ? `<button id="${bId}" class="btn-sec" style="width:100%; margin-top:10px;" disabled>Installed</button>` : `<button id="${bId}" class="btn-primary" style="width:100%; margin-top:10px; background:#ffb400; color:black;" onclick="GemiOS.buyApp('${f}', '${a.id}', ${pid}, '${bId}', ${price})">Buy (🪙 ${price})</button>`; 
                h += `<div class="sys-card" style="display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0;"><div style="display:flex; align-items:center; gap:15px;"><div style="font-size:35px;">${a.icon}</div><div><div style="font-weight:bold; font-size:16px;">${a.title}</div><div style="font-size:11px; opacity:0.7;">${a.desc}</div></div></div>${btnHtml}</div>`; 
            } 
            document.getElementById(`store-list-${pid}`).innerHTML = h; 
        }

        runSearch(query) {
            let q = query.toLowerCase(); let items = document.querySelectorAll('.start-item'); let cats = document.querySelectorAll('.start-cat');
            if(q === '') { items.forEach(el => el.style.display = 'flex'); cats.forEach(el => el.style.display = 'block'); return; }
            cats.forEach(el => el.style.display = 'none');
            items.forEach(el => { if(el.innerText.toLowerCase().includes(q)) el.style.display = 'flex'; else el.style.display = 'none'; });
        }
        
        handleTerm(e, pid, inputEl) {
            if(e.key !== 'Enter') return; let cmd = inputEl.value.trim(); inputEl.value = ''; let out = document.getElementById(`t-out-${pid}`); let currPath = this.termStates[pid]; out.innerHTML += `<br><span style="color:#0078d7">${currPath}></span> ${cmd}`; let args = cmd.split(' '); let base = args[0].toLowerCase();
            try {
                if(base === 'help') { out.innerHTML += '<br>cmds: ls, cd, mkdir, echo, cat, rm, clear, gpm install [app.app]'; } else if(base === 'clear') { out.innerHTML = ''; }
                else if(base === 'ls' || base === 'dir') { let dir = this.VFS.getDir(currPath); if(!dir) out.innerHTML += '<br>Directory not found.'; else { let keys = Object.keys(dir); if(keys.length===0) out.innerHTML += '<br>(Empty)'; else keys.forEach(k => out.innerHTML += `<br>${typeof dir[k]==='object' ? '[DIR] ' : '[FILE] '} ${k}`); } }
                else if(base === 'cd') { let target = args[1]; if(!target) out.innerHTML += '<br>Usage: cd [dir]'; else if(target === '..') { let parts = currPath.split('/'); if(parts.length > 1) parts.pop(); this.termStates[pid] = parts.join('/') || 'C:'; } else { let newPath = currPath + '/' + target; if(this.VFS.getDir(newPath) && typeof this.VFS.getDir(newPath) === 'object') this.termStates[pid] = newPath; else out.innerHTML += '<br>Directory not found.'; } }
                else if(base === 'gpm') { 
                    if(args[1] === 'install' && args[2]) { 
                        let appName = args.slice(2).join(' '); if(!appName.endsWith('.app')) appName += '.app'; 
                        if(window.GemiRegistry && window.GemiRegistry[appName]) { 
                            let price = window.GemiRegistry[appName].price || 0;
                            if(this.wallet >= price) {
                                this.wallet -= price; this.saveWallet(); this.updateWalletUI(); out.innerHTML += `<br>[GPM] Transaction... -🪙${price}`; 
                                if(this.VFS.write('C:/Users/' + this.user + '/Desktop', appName, window.GemiRegistry[appName].id)) { out.innerHTML += `<br>[GPM] SUCCESS: Installed.`; this.renderDesktopIcons(); } else out.innerHTML += `<br>[GPM] ERROR: NVRAM Full.`; 
                            } else out.innerHTML += `<br>[GPM] ERROR: Insufficient funds. Needs 🪙${price}.`;
                        } else out.innerHTML += `<br>[GPM] ERROR: Package ${appName} not found.`; 
                    } else out.innerHTML += '<br>Usage: gpm install [app_name.app]'; 
                }
                else if(base !== '') { out.innerHTML += `<br>Command not found: ${base}`; }
            } catch(err) { out.innerHTML += `<br>Error: ${err.message}`; } document.getElementById(`t-path-${pid}`).innerText = this.termStates[pid] + '>'; out.scrollTop = out.scrollHeight;
        }

        initRealityBridge() {
            document.body.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); });
            document.body.addEventListener('drop', e => {
                e.preventDefault(); e.stopPropagation(); let file = e.dataTransfer.files[0]; if (!file) return; let reader = new FileReader();
                reader.onload = (event) => {
                    if(file.name.endsWith('.gemos')) { try { JSON.parse(event.target.result); localStorage.setItem('GemiOS_TreeFS', event.target.result); this.notify("GemiSync", "NVRAM Snapshot Imported. Rebooting..."); setTimeout(()=>location.reload(), 1500); } catch(e) { this.notify("GemiSync Error", "Invalid backup file.", false); } return; }
                    if(this.VFS.write('C:/Users/' + this.user + '/Downloads', file.name, event.target.result)) { this.notify("Reality Bridge", `Imported ${file.name}`); for(let pid in this.driveStates) { this.renderDrive(pid); } }
                };
                if(file.name.endsWith('.txt') || file.name.endsWith('.rtf') || file.name.endsWith('.gbs') || file.name.endsWith('.gemos')) { reader.readAsText(file); } else { reader.readAsDataURL(file); }
            });
        }
        
        exportFile(path, filename) {
            let data = this.VFS.read(path, filename); if(!data) return;
            if(data.startsWith('data:')) { let a = document.createElement('a'); a.href = data; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); } 
            else { let blob = new Blob([data], {type: 'text/plain'}); let url = URL.createObjectURL(blob); let a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
            this.notify("GemiShare", `${filename} exported.`);
        }

        openFile(path, filename) {
            let data = this.VFS.read(path, filename); let ext = filename.split('.').pop().toLowerCase();
            if(ext === 'app') { this.PM.launch(data); } 
            else if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) { this.PM.launch('app_view', data); } 
            else if (['mp3', 'wav', 'ogg'].includes(ext)) { this.PM.launch('app_amp', data); } 
            else if (['mp4', 'webm'].includes(ext)) { this.PM.launch('app_video', data); }
            else if (ext === 'gbs') { try { eval(data); this.notify("GemiScript", "Macro executed."); } catch(e) { this.notify("GemiScript Error", e.message, false); } }
            else if (ext === 'gzip') { try { let archive = JSON.parse(data); for(let f in archive) { this.VFS.write('C:/Users/' + this.user + '/Downloads', f, archive[f]); } this.notify("GemiZip", "Extracted to Downloads."); for(let pid in this.driveStates) { this.renderDrive(pid); } } catch(e) { this.notify("GemiZip", "Corrupted archive.", false); } }
            else { this.PM.launch('app_note', data); }
        }

        renderDrive(pid) {
            let path = this.driveStates[pid]; document.getElementById(`d-path-${pid}`).value = path;
            let list = document.getElementById(`d-list-${pid}`); let dir = this.VFS.getDir(path); let html = '';
            for(let k in dir) {
                if(typeof dir[k] === 'object') { 
                    html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(0,0,0,0.2); border-radius:6px; position:relative;" onmouseover="this.style.background='rgba(0,120,215,0.4)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'" onclick="GemiOS.navDrive(${pid}, '${k}')"><div style="font-size:30px;">📁</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`; 
                } 
                else { 
                    let i = '📄'; if(k.endsWith('.app')) i = '🚀'; else if(k.endsWith('.gbs')) i = '📜'; else if(k.endsWith('.gzip')) i = '🗜️'; else if(k.endsWith('.gemos')) i = '💾'; 
                    html += `<div style="text-align:center; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px; position:relative;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'"><div style="font-size:30px; cursor:pointer;" onclick="GemiOS.openFile('${path}', '${k}')">${i
