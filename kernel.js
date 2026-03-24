// =========================================================================
// GemiOS CLOUD HYPERVISOR - v47.0 (THE SETUP UPDATE)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v47';
console.log("[BOOT] Hypervisor targeting state: " + bootVersion);

if (bootVersion !== 'v47' && bootVersion !== 'v46') { 
    document.open(); document.write('<body style="background:#000;color:#0f0;font-family:monospace;padding:50px;"><h2>Legacy OS Archived.</h2><button onclick="localStorage.setItem(\'GemiOS_TargetVersion\',\'v47\');location.reload()" style="padding:10px;background:#0f0;color:#000;font-weight:bold;cursor:pointer;border:none;">Reboot to V47</button></body>'); document.close(); 
} else {
    class VirtualFileSystem {
        constructor() {
            this.MAX_STORAGE = 10485760;
            let drive = localStorage.getItem('GemiOS_TreeFS');
            if(!drive) {
                this.root = { "C:": { "System": { "boot.log": "GemiOS V47.0 Initialized.", "sys_mail.json": "[]" }, "Users": { "Admin": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} }, "Guest": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} } } } };
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
        constructor() { this.zIndex = 100; this.windows = {}; this.hasAnim = localStorage.getItem('GemiOS_Driver_Anim') !== 'false'; }
        createWindow(pid, title, content, width) {
            let wid = 'win_' + pid;
            let watermark = `<div style="position:absolute; bottom:4px; right:8px; font-size:9px; color:inherit; opacity:0.3; pointer-events:none; font-weight:bold; font-family:sans-serif; z-index:9999;">© 2026 GemiOS Open Source</div>`;
            let animClass = this.hasAnim ? 'win-animated' : 'win-static';
            let html = `
                <div class="win ${animClass}" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${width}px; z-index:${++this.zIndex};" onmousedown="GemiOS.WM.focus('${wid}')">
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
            GemiOS.playSysSound('open'); 
        }
        focus(wid) { let el = document.getElementById(wid); if(el) el.style.zIndex = ++this.zIndex; }
        drag(e, wid) {
            let w = document.getElementById(wid); if(!w || w.dataset.maximized === "true") return;
            let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop; this.focus(wid); 
            if(this.hasAnim) w.style.transition = 'none';
            document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
            document.onmouseup = () => { 
                document.onmousemove = null; document.onmouseup = null; 
                if(this.hasAnim) w.style.transition = 'width 0.3s, height 0.3s, top 0.3s, left 0.3s, background 0.3s, color 0.3s, transform 0.3s'; 
            };
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
        removeWindow(pid) { if(this.windows[pid]) { this.windows[pid].remove(); delete this.windows[pid]; } let tbItem = document.getElementById('tb-item-'+pid); if(tbItem) tbItem.remove(); GemiOS.playSysSound('close'); }
    }

    class ProcessManager {
        constructor() { this.processes = {}; this.pidCounter = 1000; }
        launch(appId, fileData = null) {
            let sm = document.getElementById('start-menu'); if (sm) sm.classList.remove('open');
            if(!GemiOS.Registry[appId]) return GemiOS.notify("Execution Error", `App ${appId} not found in Registry.`, false);
            let pid = ++this.pidCounter; let app = GemiOS.Registry[appId];
            this.processes[pid] = { id: appId, title: app.title, raw: app }; 
            GemiOS.playSysSound('click');
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

    const AppRegistry = {
        'sys_term': { tag: 'sys', icon: '⌨️', title: 'Bash Terminal', width: 500, html: (pid) => `<div id="t-out-${pid}" style="flex-grow:1; background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; overflow-y:auto; border-radius:6px;">GemiOS Shell Active. Type 'help' to see commands.</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span id="t-path-${pid}" style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/${GemiOS.user}></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`, onLaunch: (pid) => { GemiOS.termStates[pid] = 'C:/Users/' + GemiOS.user; setTimeout(()=>document.getElementById('t-in-'+pid).focus(),100); } },
        'sys_drive': { tag: 'sys', icon: '🗂️', title: 'Explorer 2.0', width: 520, html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div><div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px;"></div><div style="margin-top:10px; padding:5px; background:rgba(0,0,0,0.3); border-radius:4px;"><div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;"><span id="d-bar-text-${pid}">Calculating NVRAM...</span><span>10MB MAX</span></div><div style="height:6px; background:#222; border-radius:3px; overflow:hidden;"><div id="d-bar-${pid}" style="height:100%; background:var(--accent); width:0%; transition: width 0.3s ease;"></div></div></div>`, onLaunch: (pid) => { GemiOS.driveStates[pid] = 'C:/Users/' + GemiOS.user; GemiOS.renderDrive(pid); GemiOS.driveItvs = GemiOS.driveItvs || {}; GemiOS.driveItvs[pid] = setInterval(() => { let u = GemiOS.VFS.getUsage(); let pct = Math.max((u.used / u.max) * 100, 0.5); let bar = document.getElementById(`d-bar-${pid}`); let txt = document.getElementById(`d-bar-text-${pid}`); if(bar) { bar.style.width = Math.min(pct, 100) + '%'; bar.style.background = pct > 90 ? '#ff4d4d' : 'var(--accent)'; } if(txt) txt.innerText = `${(u.used/1024).toFixed(2)} KB Used`; }, 500); }, onKill: (pid) => { if(GemiOS.driveItvs && GemiOS.driveItvs[pid]) clearInterval(GemiOS.driveItvs[pid]); } },
        'sys_set': { tag: 'sys', icon: '⚙️', title: 'System Settings', width: 420, html: () => `<div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary">Apply Wallpaper</button></div><div class="sys-card"><b style="font-size:14px;">Accent Color</b><br><div style="display:flex; gap:10px; margin-top:10px;"><div onclick="localStorage.setItem('GemiOS_Accent', '#0078d7'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#0078d7; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ff00cc'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff00cc; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#38ef7d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#38ef7d; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ff4d4d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff4d4d; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ffb400'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ffb400; cursor:pointer;"></div></div></div><div class="sys-card" style="border-left:4px solid var(--accent);"><b style="font-size:14px;">GemiSync (Export OS)</b><br><button onclick="GemiOS.exportNVRAM()" class="btn-primary" style="margin-top:5px;">Export .gemos Backup</button></div><button onclick="alert('Please restart and use F2 BIOS menu for Secure Erase.')" class="btn-danger">Format System (Moved to BIOS)</button>` },
        'sys_update': { tag: 'sys', icon: '☁️', title: 'Cloud Updater', width: 380, html: () => `<div class="sys-card" style="text-align:center; flex-grow:1;"><div style="font-size:40px;">☁️</div><h3 style="margin:5px 0;">Dual-OTA Updater</h3><p style="font-size:13px; opacity:0.8;">Kernel: <b id="kern-ver">v47.0.0-SETUP</b></p><div id="upd-stat" style="font-size:12px; min-height:15px; margin-bottom:10px;">Ready to scan Cloud Network.</div><button id="upd-btn" onclick="GemiOS.triggerOTA(this)" class="btn-primary">Check for Updates</button></div>` },
        'sys_log': { tag: 'sys', icon: '📋', title: 'Chronicles', width: 500, html: () => `<div style="flex-grow:1; overflow-y: auto; padding-right: 5px;"><div class="sys-card" style="border-left:4px solid #38ef7d;"><b>v47.0.0 (The Setup Update)</b> - Introduced Multi-Stage Setup Wizard. OS now natively formats NVRAM, installs Registry to disk, and configures hardware drivers via Loading Bar.</div><div class="sys-card"><b>v46.0.0 (Bounty)</b> - Launched GemiGov Relief Fund. Integrated 500🪙 Bug Bounty program.</div><div class="sys-card"><b>v45.0.0 (Zero-Trust)</b> - GemiDefender Active Memory Scanning.</div><div class="sys-card"><b>v44.1.0 (Heuristic Patch)</b> - Re-engineered Antivirus.</div></div>` },
        'sys_store': { tag: 'sys', icon: '🛍️', title: 'GemiStore Market', width: 700, html: (pid) => `
            <div class="sys-card" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg, var(--accent), #000); border:none; margin-bottom:10px;">
                <div style="font-size:24px; font-weight:bold;">GemiStore</div><div style="font-size:40px;">🛍️</div>
            </div>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button onclick="let c=prompt('Paste GemiApp Cartridge Code:'); if(c) GemiOS.importCartridge(c);" class="btn-sec" style="flex:1; background:rgba(56,239,125,0.2); border-color:#38ef7d; color:#38ef7d; font-weight:bold; margin:0;">📥 Redeem App Cartridge</button>
                <button onclick="GemiOS.renderStore(${pid})" class="btn-sec" style="flex:1; margin:0;">🔄 Refresh Global Network</button>
            </div>
            <div id="store-list-${pid}" style="flex-grow:1; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:5px;"></div>`, 
            onLaunch: (pid) => { GemiOS.renderStore(pid); } 
        },
        'sys_disk': { tag: 'sys', icon: '💽', title: 'GemiDisk', width: 400, html: (pid) => `<div class="sys-card" style="text-align:center;"><div style="font-size:40px;">💽</div><h3 style="margin:5px 0;">NVRAM Status</h3><p style="font-size:12px; opacity:0.8;">Strict Quota Enforced</p><div style="width:100%; height:20px; background:rgba(0,0,0,0.5); border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.2); margin:15px 0;"><div id="disk-fill-${pid}" style="width:0%; height:100%; background:var(--accent); transition:width 0.5s ease;"></div></div><b id="disk-text-${pid}">Calculating...</b></div>`, onLaunch: (pid) => { GemiOS.diskItvs = GemiOS.diskItvs || {}; GemiOS.diskItvs[pid] = setInterval(() => { let u = GemiOS.VFS.getUsage(); let pct = Math.max((u.used / u.max) * 100, 0.2); let elF = document.getElementById(`disk-fill-${pid}`); let elT = document.getElementById(`disk-text-${pid}`); if(elF) { elF.style.width = Math.min(pct, 100) + '%'; elF.style.background = pct > 90 ? '#ff4d4d' : 'var(--accent)'; } if(elT) elT.innerText = `${(u.used/1024).toFixed(2)} KB / 10.00 MB`; }, 500); }, onKill: (pid) => { if(GemiOS.diskItvs && GemiOS.diskItvs[pid]) clearInterval(GemiOS.diskItvs[pid]); } },
        'sys_task': { tag: 'sys', icon: '📊', title: 'System Monitor', width: 450, html: (pid) => `<div style="display:flex; gap:10px;"><div class="sys-card" style="flex:1; border-left: 4px solid #38ef7d;"><b>CPU</b><canvas id="cpu-cvs-${pid}" width="180" height="80"></canvas></div><div class="sys-card" style="flex:1; border-left: 4px solid #4db8ff;"><b>RAM</b><canvas id="ram-cvs-${pid}" width="180" height="80"></canvas></div></div><div class="sys-card" style="border-left: 4px solid #ff4d4d; margin-top:10px;"><b>PIDs</b></div><div id="tm-list-${pid}" style="flex-grow:1; overflow-y:auto;"></div>`, onLaunch: (pid) => { let cpuH = [], ramH = []; GemiOS.tmItvs = GemiOS.tmItvs || {}; GemiOS.tmItvs[pid] = setInterval(() => { let h = ''; let pCount = 0; for(let p in GemiOS.PM.processes) { pCount++; h += `<div style="padding:8px; background:rgba(255,255,255,0.1); margin-bottom:5px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px;">${GemiOS.PM.processes[p].title} [${p}]</span><button onclick="GemiOS.PM.kill(${p})" class="btn-danger" style="padding:4px 8px; width:auto; font-size:11px;">Kill</button></div>`; } let el = document.getElementById(`tm-list-${pid}`); if(el) el.innerHTML = h; let cCvs = document.getElementById(`cpu-cvs-${pid}`); let rCvs = document.getElementById(`ram-cvs-${pid}`); if(cCvs && rCvs) { let cCtx = cCvs.getContext('2d'); let rCtx = rCvs.getContext('2d'); cpuH.push(Math.random() * 20 + (pCount*5)); if(cpuH.length>30) cpuH.shift(); ramH.push(pCount * 12 + (Math.random()*5)); if(ramH.length>30) ramH.shift(); cCtx.clearRect(0,0,180,80); rCtx.clearRect(0,0,180,80); cCtx.strokeStyle = '#38ef7d'; cCtx.lineWidth = 2; cCtx.beginPath(); cpuH.forEach((v,i) => i===0 ? cCtx.moveTo(i*6, 80-v) : cCtx.lineTo(i*6, 80-v)); cCtx.stroke(); rCtx.strokeStyle = '#4db8ff'; rCtx.lineWidth = 2; rCtx.beginPath(); ramH.forEach((v,i) => i===0 ? rCtx.moveTo(i*6, 80-v) : rCtx.lineTo(i*6, 80-v)); rCtx.stroke(); } }, 1000); }, onKill: (pid) => clearInterval(GemiOS.tmItvs[pid]) }
    };

    class CoreOS {
        constructor() { 
            this.VFS = new VirtualFileSystem(); 
            this.WM = new WindowManager(); 
            this.PM = new ProcessManager(); 
            this.Registry = AppRegistry; 
            this.termStates = {}; this.driveStates = {}; 
            this.user = 'Admin'; this.idleTime = 0; 
            this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet'));
            if(isNaN(this.wallet)) this.wallet = 500;
            this.notifications = []; 
            this.edition = localStorage.getItem('GemiOS_Edition'); 
        }

        async init() { 
            this.injectStyles(); 
            window.addEventListener('storage', (e) => { if(e.key === 'GemiChat_Log') { if(this.chatPid) this.updateChatBox(this.chatPid); } }); 
            
            // V47 SETUP INTERCEPT
            if(!this.edition) {
                this.showInstallerStep1();
                return;
            }

            if(this.wallet <= 10 && !localStorage.getItem('GemiOS_Relief_Claimed')) {
                setTimeout(() => {
                    this.wallet += 150; this.saveWallet(); this.updateWalletUI();
                    this.notify("GemiGov Relief Fund 🏦", "150 🪙 deposited to help you recover from malware attacks!");
                    this.playSysSound('success'); localStorage.setItem('GemiOS_Relief_Claimed', 'true');
                }, 4000);
            }

            await this.loadDynamicRegistry(); 
            
            if(sessionStorage.getItem('GemiOS_Session') === 'active') { 
                this.user = sessionStorage.getItem('GemiOS_User') || 'Admin'; 
                this.patchDesktopData(); this.launchDesktop(); this.initScreensaver(); this.startOTADaemon(); this.startEconomyDaemon();
            } else { 
                this.runBootSequence(); 
            } 
        }

        // --- V47 MULTI-STAGE INSTALLER ---
        showInstallerStep1() {
            document.body.innerHTML = `
                <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999999; font-family:'Inter', sans-serif;">
                    <div style="font-size:80px; margin-bottom:10px; filter:drop-shadow(0 0 20px var(--accent));">💿</div>
                    <h1 style="margin:0 0 10px 0; font-weight:600; letter-spacing:3px;">GemiOS Setup Utility</h1>
                    <p style="color:#aaa; margin-bottom:40px;">Step 1: Select your operating environment.</p>
                    <div style="display:flex; gap:20px;">
                        <div onclick="GemiOS.showInstallerStep2('Home')" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:30px; border-radius:12px; width:200px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(-5px)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)'">
                            <div style="font-size:40px; margin-bottom:15px;">🏠</div>
                            <h3 style="margin:0 0 10px 0;">Home</h3>
                            <p style="font-size:12px; color:#888; margin:0;">Standard access. 0% Discount. Pro apps cost GemiCoins.</p>
                        </div>
                        <div onclick="GemiOS.showInstallerStep2('Pro')" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:30px; border-radius:12px; width:200px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)'">
                            <div style="font-size:40px; margin-bottom:15px;">💼</div>
                            <h3 style="margin:0 0 10px 0; color:var(--accent);">Professional</h3>
                            <p style="font-size:12px; color:#888; margin:0;">Permanent 5% Global Discount. GemiDev Studio Pre-Installed.</p>
                        </div>
                        <div onclick="GemiOS.showInstallerStep2('Education')" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:30px; border-radius:12px; width:200px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(-5px)'; this.style.borderColor='#38ef7d'" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)'">
                            <div style="font-size:40px; margin-bottom:15px;">🎓</div>
                            <h3 style="margin:0 0 10px 0; color:#38ef7d;">Education</h3>
                            <p style="font-size:12px; color:#888; margin:0;">Permanent 15% discount on all Educational apps.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        showInstallerStep2(edition) {
            document.body.innerHTML = `
                <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999999; font-family:'Inter', sans-serif;">
                    <h1 style="margin:0 0 10px 0; font-weight:600; letter-spacing:3px;">Hardware Configuration</h1>
                    <p style="color:#aaa; margin-bottom:30px;">Step 2: Select virtual drivers to install.</p>
                    <div style="background:rgba(0,0,0,0.5); padding:30px; border-radius:12px; width:450px; border:1px solid rgba(255,255,255,0.1);">
                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:15px; font-size:16px; cursor:pointer; color:#fff;">
                            <input type="checkbox" id="drv-audio" checked style="width:20px; height:20px; cursor:pointer;"> Haptic Audio Engine (HD Sound)
                        </label>
                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:15px; font-size:16px; cursor:pointer; color:#fff;">
                            <input type="checkbox" id="drv-anim" checked style="width:20px; height:20px; cursor:pointer;"> WebGL Window Compositor (Animations)
                        </label>
                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:30px; font-size:16px; cursor:pointer; color:#fff;">
                            <input type="checkbox" id="drv-net" checked style="width:20px; height:20px; cursor:pointer;"> TCP/IP Global Network Adapter
                        </label>
                        <button onclick="GemiOS.startInstallation('${edition}')" class="btn-primary" style="font-size:16px; padding:15px; width:100%; box-shadow:0 5px 15px rgba(0,0,0,0.5);">Install GemiOS</button>
                    </div>
                </div>
            `;
        }

        async startInstallation(edition) {
            let drvAudio = document.getElementById('drv-audio').checked;
            let drvAnim = document.getElementById('drv-anim').checked;
            let drvNet = document.getElementById('drv-net').checked;

            document.body.innerHTML = `
                <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999999; font-family:'Inter', sans-serif;">
                    <div style="font-size:60px; margin-bottom:20px; animation: spin 2s linear infinite;">⚙️</div>
                    <h2 id="inst-title" style="margin:0 0 20px 0;">Installing GemiOS to NVRAM...</h2>
                    <div style="width:500px; height:30px; background:#111; border-radius:15px; overflow:hidden; border:2px solid #555; box-shadow:inset 0 0 10px rgba(0,0,0,0.8);">
                        <div id="inst-bar" style="width:0%; height:100%; background:linear-gradient(90deg, #38ef7d, #0078d7); transition:width 0.5s ease;"></div>
                    </div>
                    <p id="inst-log" style="margin-top:15px; font-family:monospace; color:#38ef7d; font-size:14px; font-weight:bold;">Initializing...</p>
                </div>
            `;

            let bar = document.getElementById('inst-bar');
            let log = document.getElementById('inst-log');
            const delay = ms => new Promise(res => setTimeout(res, ms));

            // Format
            await delay(800); bar.style.width = '15%'; log.innerText = 'Formatting Virtual Disk (NVRAM)...';
            localStorage.clear();
            
            // Save settings
            localStorage.setItem('GemiOS_Edition', edition);
            localStorage.setItem('GemiOS_Driver_Audio', drvAudio);
            localStorage.setItem('GemiOS_Driver_Anim', drvAnim);
            localStorage.setItem('GemiOS_Driver_Net', drvNet);

            // Build FS
            await delay(1200); bar.style.width = '45%'; log.innerText = 'Building File System Hierarchy...';
            this.VFS = new VirtualFileSystem(); 

            // Download Registry
            await delay(1500); bar.style.width = '75%'; log.innerText = 'Downloading Global App Registry...';
            try {
                let cb = "?t=" + new Date().getTime();
                let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/registry.js" + cb);
                if(r.ok) { let code = await r.text(); localStorage.setItem('GemiOS_Cache_Registry', code); log.innerText = 'Registry successfully written to disk.'; } 
                else throw new Error();
            } catch(e) { log.innerText = 'Network Offline: Using built-in Core Apps.'; }

            // Config
            await delay(1200); bar.style.width = '90%'; log.innerText = 'Configuring Economy & Target OS...';
            localStorage.setItem('GemiOS_Wallet', 500);
            localStorage.setItem('GemiOS_TargetVersion', 'v47');

            // Finish
            await delay(1500); bar.style.width = '100%'; log.innerText = 'INSTALLATION COMPLETE. Restarting system...';
            document.getElementById('inst-title').innerText = 'Setup Successful';
            
            await delay(1500); location.reload();
        }

        saveWallet() { localStorage.setItem('GemiOS_Wallet', this.wallet); }
        updateWalletUI() { let w = document.getElementById('os-wallet-display'); if(w) w.innerText = `🪙 ${Math.floor(this.wallet)}`; }

        async loadDynamicRegistry() {
            let regCache = localStorage.getItem('GemiOS_Cache_Registry');
            let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}'); 
            let globalNetwork = JSON.parse(localStorage.getItem('GemiOS_GlobalNetwork') || '[]'); 
            
            let fuse = () => {
                for(let file in window.GemiRegistry) {
                    let app = window.GemiRegistry[file];
                    if(app && app.id) this.Registry[app.id] = app; 
                }
                for(let cFile in customApps) {
                    let cApp = customApps[cFile];
                    let evalHtml = (pid) => { return cApp.htmlString; };
                    window.GemiRegistry[cFile] = { price: cApp.price, id: cApp.id, icon: cApp.icon, desc: cApp.desc, title: cApp.title, width: 500, html: evalHtml, isCustom: true, htmlString: cApp.htmlString };
                    this.Registry[cApp.id] = window.GemiRegistry[cFile];
                }
                globalNetwork.forEach(gApp => {
                    let fileName = gApp.title.replace(/\s/g, '') + '_net.app';
                    let evalHtml = (pid) => { return gApp.htmlString; };
                    window.GemiRegistry[fileName] = { price: gApp.price, id: gApp.id, icon: gApp.icon, desc: gApp.desc, title: gApp.title, width: 500, html: evalHtml, isNetwork: true, htmlString: gApp.htmlString };
                    this.Registry[gApp.id] = window.GemiRegistry[fileName];
                });
            };

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
            if(localStorage.getItem('GemiOS_Driver_Net') === 'false') return; // Driver check
            let alerted = false; 
            setInterval(async () => { 
                if(alerted) return; 
                try { 
                    let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/version.json?t=" + new Date().getTime()); 
                    if(r.ok) { 
                        let d = await r.json(); let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || "47.0.0-SETUP"; 
                        if(d.version !== currentVer) { this.notify("🚀 Update Available!", `Version ${d.version} is ready.`); alerted = true; } 
                    } 
                } catch(e) {} 
            }, 15000); 
        }

        startEconomyDaemon() {
            setInterval(() => {
                let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}');
                let appKeys = Object.keys(customApps);
                if(appKeys.length > 0 && Math.random() < 0.4) {
                    let randomApp = customApps[appKeys[Math.floor(Math.random() * appKeys.length)]];
                    let price = parseInt(randomApp.price);
                    if(price > 0) {
                        let profit = Math.floor(price * 0.90);
                        this.wallet += profit;
                        this.saveWallet(); this.updateWalletUI();
                        this.notify("App Sale! 💸", `Someone bought ${randomApp.title}. +🪙${profit}`, true);
                        this.playSysSound('buy');
                    }
                }
            }, 20000); 
        }

        patchDesktopData() { 
            let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop', true); 
            let appsToLoad = { 'Explorer.app': 'sys_drive', 'GemiStore.app': 'sys_store', 'Settings.app': 'sys_set', 'Terminal.app': 'sys_term', 'GemiDefender.app':'app_defend' }; 
            if(this.edition === 'Pro') { appsToLoad['GemiDev.app'] = 'app_dev'; appsToLoad['GemiDocs.app'] = 'app_docs'; }
            if(this.edition === 'Education') { appsToLoad['GemiDocs.app'] = 'app_docs'; }
            for(let a in appsToLoad) { if(!desk[a]) this.VFS.write('C:/Users/' + this.user + '/Desktop', a, appsToLoad[a]); } 
        }
        
        runBootSequence() { document.body.innerHTML = `<div id="gui-boot" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:#050505;display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;z-index:999999;transition:opacity 0.5s ease;"><div style="font-size:90px; animation: float 3s ease-in-out infinite; filter:drop-shadow(0 0 25px var(--accent));">🌌</div><h1 style="font-family:'Inter',sans-serif; font-weight:600; letter-spacing:6px; margin-top:20px; font-size:32px;">GemiOS<span style="color:var(--accent);">47.0</span></h1><div style="margin-top:5px; font-family:monospace; font-size:12px; color:#666; letter-spacing:2px;">MOUNTING NVRAM...</div><div class="spinner" style="margin-top:40px;"></div></div>`; setTimeout(() => { let bs = document.getElementById('gui-boot'); bs.style.opacity = '0'; setTimeout(() => this.showLoginScreen(), 500); }, 1000); }
        
        showLoginScreen() { this.loadWallpaper(); document.body.innerHTML = `<div id="desktop-bg" style="filter:blur(15px) brightness(0.6); transform:scale(1.05);"></div><div id="login-ui" style="position:absolute; top:0; left:0; width:100vw; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; z-index:999; animation: fadeIn 0.5s ease forwards;"><div style="font-size:70px; background:rgba(255,255,255,0.1); border-radius:50%; width:120px; height:120px; display:flex; justify-content:center; align-items:center; margin-bottom:20px; border:2px solid rgba(255,255,255,0.2); box-shadow:0 10px 30px rgba(0,0,0,0.5); backdrop-filter:blur(10px);">👥</div><h2 style="margin:0 0 30px 0; font-size:28px; font-weight:500; letter-spacing:2px;">Select User</h2><div style="display:flex; gap:25px; margin-bottom:20px;"><div onclick="GemiOS.authenticate('Admin')" style="cursor:pointer; text-align:center; padding:20px 40px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:16px; transition:0.3s; backdrop-filter:blur(10px);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)';"><div style="font-size:35px; margin-bottom:10px;">👑</div><b style="font-size:16px;">Admin</b></div></div><div style="margin-top:20px; color:#aaa; font-family:monospace; padding:5px 15px; background:rgba(0,0,0,0.5); border-radius:20px;">Edition: ${this.edition}</div></div>`; }
        
        playSysSound(type) {
            if(localStorage.getItem('GemiOS_Driver_Audio') === 'false') return; // V47 Driver Check
            if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)();
            if(this.actx.state === 'suspended') this.actx.resume();
            let t = this.actx.currentTime;
            let osc = this.actx.createOscillator(); let gain = this.actx.createGain();
            osc.connect(gain); gain.connect(this.actx.destination);
            
            if(type === 'open') { osc.type = 'sine'; osc.frequency.setValueAtTime(440, t); osc.frequency.exponentialRampToValueAtTime(880, t + 0.1); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.1, t + 0.05); gain.gain.linearRampToValueAtTime(0, t + 0.15); osc.start(t); osc.stop(t + 0.15); } 
            else if (type === 'close') { osc.type = 'sine'; osc.frequency.setValueAtTime(880, t); osc.frequency.exponentialRampToValueAtTime(440, t + 0.1); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.1, t + 0.05); gain.gain.linearRampToValueAtTime(0, t + 0.15); osc.start(t); osc.stop(t + 0.15); } 
            else if (type === 'buy') { osc.type = 'square'; osc.frequency.setValueAtTime(600, t); osc.frequency.setValueAtTime(1200, t+0.1); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.05, t + 0.05); gain.gain.linearRampToValueAtTime(0, t + 0.2); osc.start(t); osc.stop(t + 0.2); } 
            else if (type === 'error') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, t); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.1, t + 0.05); gain.gain.linearRampToValueAtTime(0, t + 0.3); osc.start(t); osc.stop(t + 0.3); } 
            else if (type === 'click') { osc.type = 'triangle'; osc.frequency.setValueAtTime(1000, t); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.05, t + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05); osc.start(t); osc.stop(t + 0.05); } 
            else if (type === 'alert') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, t); osc.frequency.setValueAtTime(1000, t+0.1); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.1, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4); osc.start(t); osc.stop(t + 0.4); } 
            else if (type === 'success') { osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, t); osc.frequency.setValueAtTime(659.25, t+0.1); osc.frequency.setValueAtTime(783.99, t+0.2); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.1, t + 0.1); gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6); osc.start(t); osc.stop(t + 0.6); }
        }

        playStartupChime() { if(localStorage.getItem('GemiOS_Driver_Audio') === 'false') return; if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)(); if(this.actx.state === 'suspended') this.actx.resume(); const t = this.actx.currentTime; const freqs = [261.63, 329.63, 392.00, 493.88, 587.33]; freqs.forEach((f, i) => { let osc = this.actx.createOscillator(); let gain = this.actx.createGain(); osc.type = 'sine'; osc.frequency.value = f; osc.connect(gain); gain.connect(this.actx.destination); osc.start(t + i * 0.1); gain.gain.setValueAtTime(0, t + i * 0.1); gain.gain.linearRampToValueAtTime(0.2, t + i * 0.1 + 0.5); gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.1 + 3.0); osc.stop(t + i * 0.1 + 3.0); }); }
        playShutdownChime() { if(localStorage.getItem('GemiOS_Driver_Audio') === 'false') return; if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)(); if(this.actx.state === 'suspended') this.actx.resume(); const t = this.actx.currentTime; const freqs = [261.63, 329.63, 392.00, 493.88]; freqs.forEach((f) => { let osc = this.actx.createOscillator(); let gain = this.actx.createGain(); osc.type = 'sine'; osc.frequency.value = f; osc.connect(gain); gain.connect(this.actx.destination); osc.start(t); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.15, t + 0.5); gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.0); osc.stop(t + 3.0); }); }
        
        authenticate(username) { let ui = document.getElementById('login-ui'); if(ui) { ui.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; ui.style.opacity = '0'; ui.style.transform = 'scale(1.1)'; } this.user = username; this.patchDesktopData(); this.playStartupChime(); sessionStorage.setItem('GemiOS_Session', 'active'); sessionStorage.setItem('GemiOS_User', username); setTimeout(() => { this.launchDesktop(); this.startEconomyDaemon(); }, 300); }
        lockSystem() { this.playShutdownChime(); let bg = document.getElementById('desktop-bg'); if(bg) bg.style.filter = "blur(20px) grayscale(100%) brightness(0.2)"; let overlay = document.createElement('div'); overlay.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 0.8s ease;pointer-events:none;color:white;font-family:sans-serif;'; overlay.innerHTML = `<div class="spinner" style="margin-bottom:20px;"></div><div style="font-size:18px; letter-spacing:2px; font-weight:300;">Shutting down peacefully...</div>`; document.body.appendChild(overlay); setTimeout(() => { overlay.style.opacity = '1'; }, 50); setTimeout(() => { sessionStorage.removeItem('GemiOS_Session'); location.reload(); }, 2500); }
        
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
            if(isSuccess) this.playSysSound('success'); else this.playSysSound('alert');
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

        importCartridge(b64String) {
            try {
                let decoded = decodeURIComponent(escape(window.atob(b64String)));
                let appData = JSON.parse(decoded);
                if(!appData.title || !appData.htmlString) throw new Error("Invalid Cartridge Data");
                
                let payload = appData.htmlString;
                if(payload.includes('localStorage.clear') || payload.includes('VFS.format') || payload.includes('VFS.delete')) {
                    this.notify("THREAT BLOCKED", "GemiDefender blocked a Malicious Cartridge Payload!", false);
                    this.playSysSound('error'); return; 
                }

                let safeId = 'app_cart_' + Date.now();
                let fileName = appData.title.replace(/\s/g, '') + '.app';
                appData.id = safeId;
                
                let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}');
                customApps[fileName] = appData; localStorage.setItem('GemiOS_CustomApps', JSON.stringify(customApps));
                
                this.loadDynamicRegistry().then(() => {
                    if(this.VFS.write('C:/Users/' + this.user + '/Desktop', fileName, safeId)) { this.renderDesktopIcons(); this.notify("GemiShare", `${appData.title} redeemed!`, true); this.playSysSound('buy'); } 
                    else { this.notify("Install Failed", "NVRAM Storage is full.", false); }
                });
            } catch(e) { this.notify("Redemption Error", "Invalid Cartridge Code.", false); this.playSysSound('error'); }
        }

        uploadToNetwork(pid) {
            if(localStorage.getItem('GemiOS_Driver_Net') === 'false') return this.notify("Network Offline", "TCP/IP adapter not installed.", false);
            let title = document.getElementById(`dev-title-${pid}`).value.trim();
            let icon = document.getElementById(`dev-icon-${pid}`).value.trim() || '📦';
            let price = parseInt(document.getElementById(`dev-price-${pid}`).value) || 0;
            let htmlStr = document.getElementById(`dev-html-${pid}`).value.trim();
            if(!title || !htmlStr) return this.notify("Publish Error", "Title and HTML required.", false);
            
            if(htmlStr.includes('GemiOS.PM.kill') || htmlStr.includes('GemiOS.VFS.delete')) {
                if(!localStorage.getItem('GemiOS_Bounty_Claimed')) {
                    this.wallet += 500; this.saveWallet(); this.updateWalletUI();
                    this.notify("White Hat Bounty! 🏆", "You earned 500 🪙 for contributing security software to the OS!", true);
                    this.playSysSound('success'); localStorage.setItem('GemiOS_Bounty_Claimed', 'true');
                }
            }

            let safeId = 'app_net_' + Date.now(); let appObj = { id: safeId, title: title, icon: icon, price: price, desc: 'Global Network App', htmlString: htmlStr };
            let net = JSON.parse(localStorage.getItem('GemiOS_GlobalNetwork') || '[]'); net.push(appObj); localStorage.setItem('GemiOS_GlobalNetwork', JSON.stringify(net));
            this.notify("Global Network", `${title} uploaded to GemiStore Server!`, true); this.playSysSound('buy'); this.loadDynamicRegistry();
        }

        publishApp(pid) {
            let title = document.getElementById(`dev-title-${pid}`).value.trim();
            let icon = document.getElementById(`dev-icon-${pid}`).value.trim() || '📦';
            let price = parseInt(document.getElementById(`dev-price-${pid}`).value) || 0;
            let htmlStr = document.getElementById(`dev-html-${pid}`).value.trim();
            if(!title || !htmlStr) return this.notify("Publish Error", "Title and HTML are required.", false);
            let safeId = 'app_custom_' + Date.now(); let fileName = title.replace(/\s/g, '') + '.app';
            let appObj = { id: safeId, title: title, icon: icon, price: price, desc: 'Local Custom App.', htmlString: htmlStr };
            let customApps = JSON.parse(localStorage.getItem('GemiOS_CustomApps') || '{}');
            customApps[fileName] = appObj; localStorage.setItem('GemiOS_CustomApps', JSON.stringify(customApps));
            this.loadDynamicRegistry(); this.notify("GemiDev Studio", `${title} published Locally!`, true); this.playSysSound('buy');
        }

        buyApp(filename, appId, pid, btnId, price, isNetwork = false) { 
            if(this.wallet < price) { this.notify("Transaction Failed", `Insufficient funds. Needs 🪙 ${price}`, false); this.playSysSound('error'); return; }
            let executeInstall = () => {
                this.wallet -= price; this.saveWallet(); this.updateWalletUI();
                if(window.GemiRegistry[filename] && window.GemiRegistry[filename].isCustom) {
                    let devCut = Math.floor(price * 0.90); setTimeout(()=> { this.notify("App Sold!", `Someone bought your app! +🪙${devCut}`); this.wallet += devCut; this.saveWallet(); this.updateWalletUI(); }, 5000);
                }
                if(this.VFS.write('C:/Users/' + this.user + '/Desktop', filename, appId)) { 
                    this.notify("Purchase Successful", `Downloaded ${filename}!`); this.renderDesktopIcons(); 
                    let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-sec'; btn.innerText = 'Installed'; btn.disabled = true; btn.style.background = ''; btn.style.color = 'inherit'; } 
                    this.playSysSound('buy');
                }
            };
            if(isNetwork && window.GemiRegistry[filename]) {
                let htmlCode = window.GemiRegistry[filename].htmlString || "";
                this.notify("GemiDefender Active", "Scanning Global Package...");
                setTimeout(() => {
                    if(htmlCode.includes("VFS.format") || htmlCode.includes("localStorage.clear") || htmlCode.includes("GemiOS.wallet -= ")) {
                        this.notify("THREAT BLOCKED", "GemiDefender blocked a malicious payload!", false); this.playSysSound('error');
                        let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-danger'; btn.innerText = 'BLOCKED BY AV'; btn.disabled = true; }
                    } else { this.notify("GemiDefender", "Scan clear. Installing..."); executeInstall(); }
                }, 1500);
            } else { executeInstall(); }
        }

        renderStore(pid) { 
            if(localStorage.getItem('GemiOS_Driver_Net') === 'false') { document.getElementById(`store-list-${pid}`).innerHTML = "<div style='grid-column:span 2; text-align:center; padding:20px; color:#ff4d4d;'>Network Offline. TCP/IP Driver missing.</div>"; return; }
            let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop'); let h = ''; 
            if(!window.GemiRegistry) { document.getElementById(`store-list-${pid}`).innerHTML = "<div style='grid-column:span 2; text-align:center; padding:20px;'>Registry Offline.</div>"; return; }
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
                if(this.wallet >= cost) { this.wallet -= cost; this.cryptShares++; this.saveWallet(); localStorage.setItem('GemiOS_CryptShares', this.cryptShares); this.updateWalletUI(); let shEl = document.getElementById(`crypt-shares-${pid}`); if(shEl) shEl.innerText = this.cryptShares; this.playSysSound('buy');
                } else { this.notify("Trade Failed", "Insufficient funds.", false); this.playSysSound('error'); }
            } else {
                if(this.cryptShares > 0) { this.wallet += cost; this.cryptShares--; this.saveWallet(); localStorage.setItem('GemiOS_CryptShares', this.cryptShares); this.updateWalletUI(); let shEl = document.getElementById(`crypt-shares-${pid}`); if(shEl) shEl.innerText = this.cryptShares; this.playSysSound('open');
                } else { this.notify("Trade Failed", "No shares to sell.", false); this.playSysSound('error'); }
            }
        }

        runSearch(query) { let q = query.toLowerCase(); let items = document.querySelectorAll('.start-item'); let cats = document.querySelectorAll('.start-cat'); if(q === '') { items.forEach(el => el.style.display = 'flex'); cats.forEach(el => el.style.display = 'block'); return; } cats.forEach(el => el.style.display = 'none'); items.forEach(el => { if(el.innerText.toLowerCase().includes(q)) el.style.display = 'flex'; else el.style.display = 'none'; }); }
        
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
                            let appData = window.GemiRegistry[appName]; let price = appData.price || 0;
                            if(appData.isNetwork) {
                                out.innerHTML += `<br>[GPM] Downloading from Global Network...`;
                                if(appData.htmlString && (appData.htmlString.includes("VFS.format") || appData.htmlString.includes("localStorage.clear"))) { out.innerHTML += `<br><span style="color:red">[GPM ERR] GemiDefender blocked Malicious Network Payload!</span>`; return; }
                            }
                            if(this.wallet >= price) { this.wallet -= price; this.saveWallet(); this.updateWalletUI(); out.innerHTML += `<br>[GPM] Transaction... -🪙${price}`; if(this.VFS.write('C:/Users/' + this.user + '/Desktop', appName, appData.id)) { out.innerHTML += `<br>[GPM] SUCCESS: Installed.`; this.renderDesktopIcons(); this.playSysSound('buy'); } else out.innerHTML += `<br>[GPM] ERROR: NVRAM Full.`; } else { out.innerHTML += `<br>[GPM] ERROR: Insufficient funds. Needs 🪙${price}.`; this.playSysSound('error'); }
                        } else out.innerHTML += `<br>[GPM] ERROR: Package ${appName} not found.`; 
                    } else out.innerHTML += '<br>Usage: gpm install [app_name.app]'; 
                }
                else if(base !== '') { out.innerHTML += `<br>Command not found: ${base}`; }
            } catch(err) { out.innerHTML += `<br>Error: ${err.message}`; } document.getElementById(`t-path-${pid}`).innerText = this.termStates[pid] + '>'; out.scrollTop = out.scrollHeight;
        }

        initRealityBridge() { document.body.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); }); document.body.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); let file = e.dataTransfer.files[0]; if (!file) return; let reader = new FileReader(); reader.onload = (event) => { if(file.name.endsWith('.gemos')) { try { JSON.parse(event.target.result); localStorage.setItem('GemiOS_TreeFS', event.target.result); this.notify("GemiSync", "NVRAM Snapshot Imported. Rebooting..."); setTimeout(()=>location.reload(), 1500); } catch(e) { this.notify("GemiSync Error", "Invalid backup file.", false); } return; } if(this.VFS.write('C:/Users/' + this.user + '/Downloads', file.name, event.target.result)) { this.notify("Reality Bridge", `Imported ${file.name}`); for(let pid in this.driveStates) { this.renderDrive(pid); } } }; if(file.name.endsWith('.txt') || file.name.endsWith('.rtf') || file.name.endsWith('.gbs') || file.name.endsWith('.gemos')) { reader.readAsText(file); } else { reader.readAsDataURL(file); } }); }
        exportFile(path, filename) { let data = this.VFS.read(path, filename); if(!data) return; if(data.startsWith('data:')) { let a = document.createElement('a'); a.href = data; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); } else { let blob = new Blob([data], {type: 'text/plain'}); let url = URL.createObjectURL(blob); let a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); } this.notify("GemiShare", `${filename} exported.`); }
        openFile(path, filename) { let data = this.VFS.read(path, filename); let ext = filename.split('.').pop().toLowerCase(); if(ext === 'app') { this.PM.launch(data); } else if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) { this.PM.launch('app_view', data); } else if (['mp3', 'wav', 'ogg'].includes(ext)) { this.PM.launch('app_amp', data); } else if (['mp4', 'webm'].includes(ext)) { this.PM.launch('app_video', data); } else if (ext === 'gbs') { try { eval(data); this.notify("GemiScript", "Macro executed."); } catch(e) { this.notify("GemiScript Error", e.message, false); } } else if (ext === 'gzip') { try { let archive = JSON.parse(data); for(let f in archive) { this.VFS.write('C:/Users/' + this.user + '/Downloads', f, archive[f]); } this.notify("GemiZip", "Extracted to Downloads."); for(let pid in this.driveStates) { this.renderDrive(pid); } } catch(e) { this.notify("GemiZip", "Corrupted archive.", false); } } else { this.PM.launch('app_note', data); } }
        renderDrive(pid) { let path = this.driveStates[pid]; document.getElementById(`d-path-${pid}`).value = path; let list = document.getElementById(`d-list-${pid}`); let dir = this.VFS.getDir(path); let html = ''; for(let k in dir) { if(typeof dir[k] === 'object') { html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(0,0,0,0.2); border-radius:6px; position:relative;" onmouseover="this.style.background='rgba(0,120,215,0.4)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'" onclick="GemiOS.navDrive(${pid}, '${k}')"><div style="font-size:30px;">📁</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`; } else { let i = '📄'; if(k.endsWith('.app')) i = '🚀'; else if(k.endsWith('.gbs')) i = '📜'; else if(k.endsWith('.gzip')) i = '🗜️'; else if(k.endsWith('.gemos')) i = '💾'; html += `<div style="text-align:center; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px; position:relative;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'"><div style="font-size:30px; cursor:pointer;" onclick="GemiOS.openFile('${path}', '${k}')">${i}</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis; cursor:pointer;" onclick="GemiOS.openFile('${path}', '${k}')">${k}</div><button onclick="GemiOS.exportFile('${path}', '${k}')" style="position:absolute; top:4px; right:4px; background:var(--accent); border:none; color:white; border-radius:3px; cursor:pointer; font-size:10px; padding:2px 5px;" title="Export File">↓</button></div>`; } } if(html === '') html = '<div style="grid-column: span 4; text-align:center; opacity:0.5; padding:20px;">Folder is empty</div>'; list.innerHTML = html; }
        navDrive(pid, target) { let curr = this.driveStates[pid]; if(target === 'UP') { let parts = curr.split('/'); if(parts.length > 1) parts.pop(); this.driveStates[pid] = parts.join('/') || 'C:'; } else { this.driveStates[pid] = curr + '/' + target; } this.renderDrive(pid); }

        renderDesktopIcons() {
            let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop'); let layoutData = this.VFS.read('C:/Users/' + this.user + '/Desktop', '.layout') || "{}"; let layout = JSON.parse(layoutData); let html = ''; let i = 0;
            for(let file in desk) {
                if(file.endsWith('.app') || file.endsWith('.gbs') || file.endsWith('.gzip') || file.endsWith('.txt')) {
                    let top = layout[file] ? layout[file].top : (20 + Math.floor(i / 10) * 100) + 'px'; let left = layout[file] ? layout[file].left : (20 + (i % 10) * 90) + 'px'; let safeFile = file.replace(/'/g, "\\'"); 
                    if(file.endsWith('.app')) { let appId = desk[file]; let app = this.Registry[appId] || (window.GemiRegistry ? window.GemiRegistry[appId] : null); if(app) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.PM.launch('${appId}')"><div>${app.icon}</div>${file.replace('.app','')}</div>`; } } 
                    else if (file.endsWith('.gbs')) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>📜</div>${file}</div>`; } 
                    else if (file.endsWith('.gzip')) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>🗜️</div>${file}</div>`; }
                    else if (file.endsWith('.txt')) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>📝</div>${file}</div>`; }
                    i++;
                }
            }
            document.getElementById('desktop-icons').innerHTML = html;
        }

        dragIcon(e, id, filename) { let el = document.getElementById(id); let ox = e.clientX - el.offsetLeft; let oy = e.clientY - el.offsetTop; document.onmousemove = (ev) => { el.style.left = (ev.clientX - ox) + 'px'; el.style.top = (ev.clientY - oy) + 'px'; }; document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; let layoutData = this.VFS.read('C:/Users/' + this.user + '/Desktop', '.layout') || "{}"; let layout = JSON.parse(layoutData); layout[filename] = { top: el.style.top, left: el.style.left }; this.VFS.write('C:/Users/' + this.user + '/Desktop', '.layout', JSON.stringify(layout)); }; }
        exportNVRAM() { let data = localStorage.getItem('GemiOS_TreeFS'); if(!data) return this.notify("Error", "No NVRAM state found.", false); let blob = new Blob([data], {type: 'text/plain'}); let url = URL.createObjectURL(blob); let a = document.createElement('a'); a.href = url; a.download = `GemiOS_Backup_${this.user}.gemos`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); this.notify("GemiSync", "Exported Successfully!"); }

        async triggerOTA(btn) {
            btn.innerText = 'Pinging Cloud Server...'; btn.style.background = '#444'; let st = document.getElementById('upd-stat'); st.innerText = 'Fetching version.json...';
            try {
                let cb = "?t=" + new Date().getTime(); let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/version.json" + cb); if (!r.ok) throw new Error("GitHub server unreachable."); let d = await r.json();
                let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || "47.0.0-SETUP";
                if (d.version !== currentVer) {
                    st.innerHTML = `<span style="color:#ffeb3b">New Version Found: ${d.version}</span><br><i>${d.notes}</i>`; btn.innerText = 'Download & Install'; btn.style.background = '#ff00cc'; 
                    btn.onclick = async () => {
                        document.getElementById('ota-overlay').style.display = 'flex'; let fill = document.getElementById('ota-fill'); let text = document.getElementById('ota-text');
                        try { text.innerText = "Downloading Kernel..."; fill.style.width = "30%"; let kRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/kernel.js" + cb); if(!kRes.ok) throw new Error("Kernel download failed."); let kCode = await kRes.text(); text.innerText = "Downloading Registry..."; fill.style.width = "60%"; let regRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/registry.js" + cb); if(!regRes.ok) throw new Error("Registry download failed."); let regCode = await regRes.text(); text.innerText = "Writing to NVRAM..."; fill.style.width = "90%"; localStorage.setItem('GemiOS_Cache_Kernel', kCode); localStorage.setItem('GemiOS_Cache_Registry', regCode); localStorage.setItem('GemiOS_Cache_Ver', d.version); fill.style.width = "100%"; document.getElementById('ota-title').innerText = "System Patched"; document.getElementById('ota-restart-prompt').style.display = 'flex'; this.notify("Update Complete", "System requires restart.", true); } catch(e) { text.innerText = "UPDATE FAILED: " + e.message; fill.style.background = "red"; }
                    };
                } else { st.innerHTML = `<span style="color:#38ef7d">System is up to date!</span>`; btn.innerText = 'Latest OS Installed'; btn.style.background = '#38ef7d'; btn.style.color = 'black'; btn.onclick = null; }
            } catch (err) { st.innerHTML = `<span style="color:#ff4d4d">Error: ${err.message}</span>`; btn.innerText = 'Retry'; btn.style.background = '#0078d7'; }
        }

        applyTheme() { let isL = localStorage.getItem('GemiOS_Theme') === 'light'; if(isL) document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); let accent = localStorage.getItem('GemiOS_Accent'); if(accent) { document.documentElement.style.setProperty('--accent', accent); } else { document.documentElement.style.setProperty('--accent', '#0078d7'); } }
        toggleTheme() { let isL = localStorage.getItem('GemiOS_Theme') === 'light'; localStorage.setItem('GemiOS_Theme', !isL ? 'light' : 'dark'); this.applyTheme(); }
        loadWallpaper() { let wp = localStorage.getItem('GemiOS_Wall'); let bg = document.getElementById('desktop-bg'); if(wp && bg) { bg.style.background = `url(${wp}) center/cover`; } }
        startClock() { setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }, 1000); }

        initContextMenu() {
            document.body.addEventListener('contextmenu', (e) => {
                if(e.target.id === 'os-root' || e.target.id === 'desktop-bg' || e.target.id === 'desktop-icons') {
                    e.preventDefault(); let menu = document.getElementById('context-menu'); menu.style.display = 'block'; menu.style.left = e.pageX + 'px'; menu.style.top = e.pageY + 'px'; menu.style.opacity = '0'; menu.style.transform = 'scale(0.9)'; setTimeout(() => { menu.style.opacity = '1'; menu.style.transform = 'scale(1)'; }, 10);
                }
            });
            document.body.addEventListener('click', () => { let cm = document.getElementById('context-menu'); if (cm) { cm.style.opacity = '0'; setTimeout(()=> cm.style.display = 'none', 200); } });
        }

        injectStyles() {
            const s = document.createElement('style');
            s.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                :root { --accent: #0078d7; }
                body { margin:0; overflow:hidden; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Inter', sans-serif; color:white; user-select:none; transition: background 0.6s ease, color 0.6s ease;}
                body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #222; }
                ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; } body.light-mode ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes popIn { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes blink { 0%, 100% { opacity:1; } 50% { opacity:0.2; } }
                .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; }
                .win { position:absolute; background:rgba(20, 30, 40, 0.7); backdrop-filter: blur(30px) saturate(200%); -webkit-backdrop-filter: blur(30px) saturate(200%); color:white; border-radius:12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); display: flex; flex-direction: column; overflow:hidden;}
                .win-animated { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s; }
                .win-static { animation: none; transition: none; opacity:1; }
                body.light-mode .win { background: rgba(255,255,255,0.85); border: 1px solid var(--accent); color: #222; box-shadow: 0 30px 60px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }
                .resize-handle { position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; cursor: nwse-resize; z-index: 10000; background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%); }
                .title-bar { padding:12px 18px; font-weight:600; font-size: 14px; display:flex; justify-content:space-between; align-items: center; border-bottom:1px solid rgba(255,255,255,0.05); cursor:grab; }
                body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.05); }
                .content { padding:15px; flex-grow: 1; overflow-y: auto; display:flex; flex-direction:column; }
                .ctrl-btn { border:none; color:white; cursor:pointer; width: 22px; height: 22px; border-radius:50%; font-weight:bold; font-size: 11px; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; margin-left: 6px; }
                .close-btn { background:rgba(255, 77, 77, 0.8); } .close-btn:hover { background:#ff4d4d; transform: scale(1.1); }
                .min-btn { background:rgba(255, 180, 0, 0.8); } .min-btn:hover { background:#ffb400; transform: scale(1.1); }
                .snap-btn { background:rgba(255, 255, 255, 0.2); } .snap-btn:hover { background:rgba(255, 255, 255, 0.4); transform: scale(1.1); }
                body.light-mode .snap-btn { background:rgba(0, 0, 0, 0.1); color:#222;} body.light-mode .snap-btn:hover { background:rgba(0, 0, 0, 0.2); }
                #taskbar-container { position:absolute; bottom:15px; width:100%; display:flex; justify-content:center; pointer-events:none; z-index:99999; }
                #taskbar { pointer-events:auto; height:60px; background:rgba(10, 15, 20, 0.6); backdrop-filter:blur(25px) saturate(180%); display:flex; align-items:center; padding: 0 15px; border-radius:30px; border:1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1); transition: all 0.3s ease; }
                body.light-mode #taskbar { background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.1); color: #222; box-shadow: 0 15px 35px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.8);}
                .start { width:44px; height:44px; background:linear-gradient(135deg, var(--accent), #005a9e); border-radius:50%; border:2px solid rgba(255,255,255,0.2); text-align:center; line-height:40px; cursor:pointer; font-weight: 600; font-size: 20px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); transition: 0.2s;}
                .start:hover { transform: scale(1.1) translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6); border-color:white; }
                #taskbar-apps { display:flex; align-items:center; margin: 0 20px; gap: 8px; }
                .tb-item { padding: 8px 15px; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity:0.6;}
                .tb-item.active { opacity:1; background:rgba(255,255,255,0.1); border-bottom: 2px solid var(--accent); border-radius: 12px 12px 4px 4px; }
                .tb-item:hover { background: rgba(255,255,255,0.15); transform:translateY(-3px); }
                body.light-mode .tb-item { background: rgba(0,0,0,0.05); } body.light-mode .tb-item.active { background: rgba(0,0,0,0.08); } body.light-mode .tb-item:hover { background: rgba(0,0,0,0.1); }
                #start-menu { position:absolute; bottom:90px; left:50%; transform:translateX(-50%); width:380px; max-height:650px; background:rgba(20, 30, 40, 0.85); backdrop-filter:blur(35px) saturate(200%); border-radius:20px; box-shadow:0 25px 60px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:100000; overflow:hidden; pointer-events:auto;}
                #start-menu.open { display:flex; animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                body.light-mode #start-menu { background:rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.1); color: #222;}
                .start-header { background: linear-gradient(135deg, rgba(0,0,0,0.2), transparent); color:white; padding:25px; font-weight:600; display:flex; align-items:center; gap: 15px; border-bottom:1px solid rgba(255,255,255,0.05);}
                body.light-mode .start-header { color:#222; border-bottom:1px solid rgba(0,0,0,0.05);}
                .start-cat { font-size:11px; font-weight:bold; color:#888; margin: 15px 20px 5px 20px; text-transform:uppercase; letter-spacing:1px; }
                .start-item { padding:10px 20px; cursor:pointer; display:flex; align-items:center; gap:15px; font-size:14px; font-weight:500; transition: 0.2s; border-radius: 10px; margin: 2px 10px; }
                .start-item:hover { background:var(--accent); color:white; transform: translateX(5px); }
                body.light-mode .start-item:hover { background:var(--accent); color:white; }
                .icon { position:absolute; text-align:center; width:80px; cursor:pointer; transition: transform 0.2s; z-index:10; border-radius: 12px; padding: 10px 5px; pointer-events:auto; font-size:13px; font-weight:500; text-shadow:0 1px 3px rgba(0,0,0,0.8);} 
                .icon:hover { background:rgba(255,255,255,0.1); backdrop-filter:blur(5px); }
                .icon:active { transform: scale(0.95); cursor:grabbing; }
                .icon div { font-size: 40px; margin-bottom: 8px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.4)); pointer-events:none;}
                body.light-mode .icon { color: #222; text-shadow:none;}
                #desktop-bg { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; pointer-events: none; background-size: cover !important; background-position: center !important; z-index: 1; transition: filter 1s ease, transform 1s ease;}
                .sys-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 12px; font-size:13px;}
                body.light-mode .sys-card { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); }
                .btn-primary { width:100%; padding:12px; background:var(--accent); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; transition:all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);}
                .btn-primary:hover { transform:translateY(-2px); box-shadow:0 4px 10px rgba(0,0,0,0.3); filter:brightness(1.1); }
                .btn-primary:disabled { background:#555; cursor:not-allowed; transform:none; box-shadow:none; filter:none; }
                .btn-sec { width:100%; padding:12px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:8px; margin-bottom:10px; cursor:pointer; transition:0.2s;}
                .btn-sec:hover { background:rgba(255,255,255,0.2); }
                .btn-sec:disabled { opacity:0.5; cursor:not-allowed; }
                .btn-danger { width:100%; padding:12px; background:rgba(255,77,77,0.8); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; }
                #widget-notes { position:absolute; top:30px; right:30px; width:220px; height:220px; background:linear-gradient(135deg, #fff9c4, #fbc02d); color:#333; box-shadow:5px 10px 20px rgba(0,0,0,0.4); padding:15px; z-index:5; font-family:'Segoe Print', 'Comic Sans MS', cursive; transform: rotate(2deg); transition: transform 0.2s, box-shadow 0.2s; cursor:grab; pointer-events:auto; border-radius:2px 2px 15px 2px;}
                #widget-notes:active { cursor:grabbing; transform: rotate(0deg) scale(1.05); z-index:9999; box-shadow:10px 20px 30px rgba(0,0,0,0.5);}
                #widget-notes textarea { width:100%; height:100%; background:transparent; border:none; outline:none; font-family:inherit; font-size:14px; resize:none; color:#333;}
                
                #context-menu { position:absolute; background:rgba(30, 40, 50, 0.85); backdrop-filter:blur(25px) saturate(200%); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:6px; box-shadow:0 15px 35px rgba(0,0,0,0.6); z-index:999999; display:none; min-width:180px; pointer-events:auto; transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: top left;}
                body.light-mode #context-menu { background:rgba(255,255,255,0.9); color:black; border:1px solid rgba(0,0,0,0.1); }
                .cm-item { padding:10px 15px; cursor:pointer; font-size:13px; font-weight:500; border-radius:6px; display:flex; align-items:center; gap:10px; transition:0.2s; }
                .cm-item:hover { background:var(--accent); color:white; padding-left:20px;}
                
                /* Action Center */
                .gemi-notif { background: rgba(20, 30, 40, 0.85); backdrop-filter: blur(25px) saturate(200%); border: 1px solid var(--accent); border-radius: 12px; padding: 15px 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 15px; transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease; opacity: 0; color: white; width: 320px; pointer-events:auto; }
                body.light-mode .gemi-notif { background: rgba(255,255,255,0.95); border: 1px solid var(--accent); color: black; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
                #notif-panel { position:absolute; top:0; right:-320px; width:320px; height:calc(100vh - 75px); background:rgba(10, 15, 20, 0.85); backdrop-filter:blur(30px) saturate(180%); border-left:1px solid rgba(255,255,255,0.1); z-index:99998; transition:right 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display:flex; flex-direction:column; box-shadow:-10px 0 30px rgba(0,0,0,0.5); }
                body.light-mode #notif-panel { background:rgba(255,255,255,0.9); color:black; border-left:1px solid rgba(0,0,0,0.1); }
                
                .io-indicator { position:absolute; bottom:18px; right:75px; font-size:18px; opacity:0.2; transition:opacity 0.2s ease; z-index:999999; }
                .io-indicator.active { opacity:1; animation: blink 0.2s infinite; color: var(--accent); }
            `;
            document.head.appendChild(s);
        }

        buildUI() {
            const html = `
                <div id="os-root" style="width:100vw; height:100vh; position:absolute; top:0; left:0;">
                    <div id="desktop-bg"></div>
                    <div id="widget-notes" onmousedown="dragWidget(event, 'widget-notes')">
                        <div style="font-weight:bold; border-bottom:1px solid rgba(0,0,0,0.1); margin-bottom:5px; font-size:12px; display:flex; justify-content:space-between; padding-bottom:5px;"><span>📌 Sticky Note</span></div>
                        <textarea id="sticky-text" oninput="localStorage.setItem('GemiOS_Sticky', this.value)" placeholder="Jot a quick note..."></textarea>
                    </div>
                    <div id="desktop-icons"></div>
                    <div id="window-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:50; pointer-events:none;"></div>
                    
                    <div id="start-menu">
                        <div class="start-header">
                            <div style="font-size:35px; background:rgba(255,255,255,0.1); border-radius:50%; width:60px; height:60px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.2);">${this.user === 'Admin' ? '👑' : '👤'}</div>
                            <div>
                                <div style="font-size:20px; font-weight:600;">${this.user}</div>
                                <div style="font-size:12px; opacity:0.7; font-family:monospace;">GemiOS 47.0 / <span style="color:var(--accent); font-weight:bold;">${this.edition.toUpperCase()}</span></div>
                            </div>
                        </div>
                        
                        <div style="padding:10px 20px;">
                            <input type="text" placeholder="🔍 Search apps & settings..." oninput="GemiOS.runSearch(this.value)" style="width:100%; padding:10px; border-radius:8px; border:none; outline:none; background:rgba(0,0,0,0.3); color:white; font-family:sans-serif; box-sizing:border-box;">
                        </div>

                        <div style="overflow-y:auto; padding-bottom:15px; padding-top:5px;" id="start-menu-items">
                            <div class="start-cat">System & Core</div>
                            ${this.edition === 'Pro' ? `<div class="start-item" onclick="GemiOS.PM.launch('app_dev')" style="background:rgba(255,0,204,0.1); border-left:3px solid #ff00cc;"><span style="font-size:20px;">🛠️</span> GemiDev Studio</div>` : ''}
                            ${(this.edition === 'Pro' || this.edition === 'Education') ? `<div class="start-item" onclick="GemiOS.PM.launch('app_docs')"><span style="font-size:20px;">📖</span> GemiDocs (Dev Guide)</div>` : ''}
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_store')"><span style="font-size:20px;">🛍️</span> GemiStore (App Center)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_disk')"><span style="font-size:20px;">💽</span> GemiDisk Utility</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_task')"><span style="font-size:20px;">📊</span> System Monitor</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_drive')"><span style="font-size:20px;">🗂️</span> Explorer 2.0</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_update')"><span style="font-size:20px;">☁️</span> Cloud Updater</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_set')"><span style="font-size:20px;">⚙️</span> Settings (Theming)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_log')"><span style="font-size:20px;">📋</span> Master Chronicles</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_term')"><span style="font-size:20px;">⌨️</span> Bash Terminal</div>
                        </div>
                    </div>

                    <div id="notif-panel">
                        <div style="padding:20px; font-size:18px; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
                            Action Center <button onclick="GemiOS.clearNotifs()" class="btn-sec" style="width:auto; margin:0; padding:4px 8px; font-size:11px;">Clear All</button>
                        </div>
                        <div id="notif-history" style="flex-grow:1; overflow-y:auto; padding:15px;"></div>
                    </div>

                    <div id="taskbar-container">
                        <div id="taskbar">
                            <div class="start" onclick="document.getElementById('start-menu').classList.toggle('open'); document.getElementById('notif-panel').style.right = '-320px';">G</div>
                            <div id="taskbar-apps"></div>
                            <div style="display:flex; align-items:center; gap:15px; margin-left:10px; padding-left:15px; border-left:1px solid rgba(255,255,255,0.1);">
                                <div style="font-weight:600; font-size:10px; opacity:0.5; margin-right:10px;">© 2026 GemiOS</div>
                                <div id="os-wallet-display" style="font-weight:bold; font-family:monospace; color:#ffb400; padding:4px 8px; background:rgba(0,0,0,0.3); border-radius:4px;">🪙 ${this.wallet}</div>
                                
                                <div onclick="let p = document.getElementById('notif-panel'); p.style.right = p.style.right === '0px' ? '-320px' : '0px'; document.getElementById('start-menu').classList.remove('open');" style="cursor:pointer; font-size:20px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Action Center">🔔</div>
                                
                                <div onclick="GemiOS.listen()" style="cursor:pointer; font-size:20px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Voice Commands">🎙️</div>
                                <div onclick="GemiOS.toggleTheme()" style="cursor:pointer; font-size:20px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Toggle Theme">🌓</div>
                                <div style="font-weight:600; font-size:12px; background:rgba(255, 255, 255, 0.2); color:white; padding:4px 10px; border-radius:20px; border:1px solid rgba(255,255,255,0.4);">v47.0</div>
                                <div id="clock" style="font-weight:600; font-size:14px; letter-spacing:1px;">12:00</div>
                                <div onclick="GemiOS.lockSystem()" style="cursor:pointer; font-size:18px; color:#ff4d4d; background:rgba(255,77,77,0.1); padding:5px; border-radius:50%; transition:0.2s;" onmouseover="this.style.background='rgba(255,77,77,0.3)'" onmouseout="this.style.background='rgba(255,77,77,0.1)'" title="Power Off">⏻</div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="io-indicator" class="io-indicator">💾</div>
                    
                    <div id="context-menu">
                        <div class="cm-item" onclick="GemiOS.VFS.delete('C:/Users/'+GemiOS.user+'/Desktop', '.layout'); GemiOS.renderDesktopIcons();">🔲 Auto-Arrange Icons</div>
                        <div class="cm-item" onclick="GemiOS.VFS.write('C:/Users/'+GemiOS.user+'/Desktop', 'New File.txt', ''); GemiOS.renderDesktopIcons();">📄 New Text Document</div>
                        <div class="cm-item" onclick="GemiOS.VFS.write('C:/Users/'+GemiOS.user+'/Desktop', 'Macro.gbs', 'GemiOS.notify(\\'Hello\\');'); GemiOS.renderDesktopIcons();">📜 New Script Macro</div>
                        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:5px 0;">
                        <div class="cm-item" onclick="location.reload()">🔄 Refresh UI</div>
                        <div class="cm-item" onclick="GemiOS.PM.launch('sys_set')">🎨 Change Theme</div>
                        <div class="cm-item" onclick="GemiOS.PM.launch('sys_term')">⌨️ Open Terminal</div>
                        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:5px 0;">
                        <div class="cm-item" onclick="GemiOS.lockSystem();" style="color:#ff4d4d;">⏻ Shut Down</div>
                    </div>
                    <div id="notif-container" style="position:absolute; top:20px; right:20px; z-index:999999; display:flex; flex-direction:column; gap:10px; pointer-events:none;"></div>
                </div>
            `;
            document.body.innerHTML = ''; document.body.insertAdjacentHTML('afterbegin', html);
            let sSticky = localStorage.getItem('GemiOS_Sticky'); if(sSticky) document.getElementById('sticky-text').value = sSticky;
            this.renderActionCenter();
        }
    }
    window.GemiOS = new CoreOS(); window.GemiOS.init();
}
