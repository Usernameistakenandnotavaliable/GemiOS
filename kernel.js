// =========================================================================
// GemiOS CLOUD HYPERVISOR - v27.2.0 (THE INCEPTION UPDATE)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v27';
console.log("[BOOT] Hypervisor targeting state: " + bootVersion);

// [LEGACY ARCHIVES - BASE64 ENCODED]
if (bootVersion === 'v1') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9IlVURi04Ij48dGl0bGU+V2luNyBTaW08L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwNGU5Mjtjb2xvcjp3aGl0ZTtmb250LWZhbWlseTpzYW5zLXNlcmlmO3BhZGRpbmc6NTBweDt9PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGgyPkdlbWlPUyB2MS4wIExlZ2FjeSBBcmNoaXZlPC9oMj48YnV0dG9uIG9uY2xpY2s9ImxvY2FsU3RvcmFnZS5zZXRJdGVtKCdHZW1pT1NfVGFyZ2V0VmVyc2lvbicsJ3YyNycpO2xvY2F0aW9uLnJlbG9hZCgpIj5Fc2NhcGUgdG8gdjI3PC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else if (bootVersion === 'v10') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPkdlbWlPUyB2MTA8L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwODA4MDtjb2xvcjp3aGl0ZTtmb250LWZhbWlseTpUYWhvbWE7cGFkZGluZzo1MHB4O308L3N0eWxlPjwvaGVhZD48Ym9keT48aDI+R2VtaU9TIHYxMC4wIFRoZSBBcmNoaXRlY3R1cmUgRXJhPC9oMj48YnV0dG9uIG9uY2xpY2s9ImxvY2FsU3RvcmFnZS5zZXRJdGVtKCdHZW1pT1NfVGFyZ2V0VmVyc2lvbicsJ3YyNycpO2xvY2F0aW9uLnJlbG9hZCgpIj5Fc2NhcGUgdG8gdjI3PC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else if (bootVersion === 'v20') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPkdlbWlPUyB2MjA8L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwMDtjb2xvcjojMGYwO2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtwYWRkaW5nOjUwcHg7fTwvc3R5bGU+PC9oZWFkPjxib2R5PjxoMj5bR2VtaU9TIFBVUkUgS0VSTkVMIHYyMF08L2gyPjxidXR0b24gb25jbGljaz0ibG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0dlbWlPU19UYXJnZXRWZXJzaW9uJywndjI3Jyk7bG9jYXRpb24ucmVsb2FkKCkiIHN0eWxlPSJjb2xvcjojZjBmO2JhY2tncm91bmQ6YmxhY2s7Ym9yZGVyOjFweCBzb2xpZCAjZjBmO3BhZGRpbmc6MTBweDsiPkhvdHN3YXAgdG8gdjI3PC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else {
    // =====================================================================
    // KERNEL 4: GEMIOS v27.2 TITANIUM (THE INCEPTION UPDATE)
    // =====================================================================
    
    class VirtualFileSystem {
        constructor() {
            let drive = localStorage.getItem('GemiOS_TreeFS');
            if(!drive) {
                this.root = {
                    "C:": {
                        "System": { "boot.log": "GemiOS V27.2 Initialized." },
                        "Users": { 
                            "Admin": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} },
                            "Guest": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} }
                        }
                    }
                };
                this.save();
            } else { 
                this.root = JSON.parse(drive); 
                if(!this.root["C:"]["Users"]["Guest"]) {
                    this.root["C:"]["Users"]["Guest"] = { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} };
                    this.save();
                }
            }
        }
        save() { localStorage.setItem('GemiOS_TreeFS', JSON.stringify(this.root)); }
        getDir(path, create = false) {
            let parts = path.split('/').filter(p => p); let curr = this.root;
            for(let p of parts) { 
                if(curr[p] === undefined) { if(create) curr[p] = {}; else return null; }
                curr = curr[p]; 
            }
            return curr;
        }
        read(path, file) { let dir = this.getDir(path); return (dir && dir[file] !== undefined) ? dir[file] : null; }
        write(path, file, data) { let dir = this.getDir(path, true); if(dir) { dir[file] = data; this.save(); return true; } return false; }
        mkdir(path, folderName) { let dir = this.getDir(path); if(dir && dir[folderName] === undefined) { dir[folderName] = {}; this.save(); return true; } return false; }
        format() { localStorage.removeItem('GemiOS_TreeFS'); sessionStorage.removeItem('GemiOS_Session'); location.reload(); }
        delete(path, file) { let dir = this.getDir(path); if(dir && dir[file] !== undefined) { delete dir[file]; this.save(); return true; } return false; }
    }

    class WindowManager {
        constructor() { this.zIndex = 100; this.windows = {}; }
        createWindow(pid, title, content, width) {
            let wid = 'win_' + pid;
            let watermark = `<div style="position:absolute; bottom:4px; right:8px; font-size:9px; color:inherit; opacity:0.3; pointer-events:none; font-weight:bold; font-family:sans-serif; z-index:9999; text-shadow: 0 0 2px rgba(0,0,0,0.5);">© 2026 Usernameistakenandnotavaliable & Gemini</div>`;
            let html = `
                <div class="win" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${width}px; z-index:${++this.zIndex}; pointer-events:auto;" onmousedown="GemiOS.WM.focus('${wid}')">
                    <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event, '${wid}')">
                        <span>${title}</span> 
                        <div>
                            <button class="ctrl-btn min-btn" onclick="GemiOS.WM.minimize('${wid}', '${pid}')">-</button>
                            <button class="ctrl-btn snap-btn" onclick="GemiOS.WM.snap('${wid}', 'left')" title="Snap Left">&lt;</button>
                            <button class="ctrl-btn snap-btn" onclick="GemiOS.WM.snap('${wid}', 'right')" title="Snap Right">&gt;</button>
                            <button class="ctrl-btn close-btn" onclick="GemiOS.PM.kill(${pid})">X</button>
                        </div>
                    </div>
                    <div class="content" id="content_${pid}" style="position:relative; overflow:hidden; display:flex; flex-direction:column;">
                        ${content}
                        ${watermark}
                    </div>
                    <div class="resize-handle"></div>
                </div>
            `;
            document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);
            this.windows[pid] = document.getElementById(wid);
            this.updateTaskbar(pid, title);
        }
        focus(wid) { let el = document.getElementById(wid); if(el) el.style.zIndex = ++this.zIndex; }
        drag(e, wid) {
            let w = document.getElementById(wid); if(!w || w.dataset.maximized === "true") return;
            let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
            this.focus(wid); w.style.transition = 'none';
            document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
            document.onmouseup = () => { document.onmousemove = null; w.style.transition = 'width 0.3s, height 0.3s, top 0.3s, left 0.3s, background 0.3s, color 0.3s, transform 0.3s'; document.onmouseup = null; };
        }
        maximize(wid) {
            let w = document.getElementById(wid); if(!w) return;
            if(w.dataset.maximized === "true") { 
                w.style.top = w.dataset.pT; w.style.left = w.dataset.pL; w.style.width = w.dataset.pW; w.style.height = w.dataset.pH; w.dataset.maximized = "false"; w.style.borderRadius = "12px";
            } else { 
                w.dataset.pT = w.style.top; w.dataset.pL = w.style.left; w.dataset.pW = w.style.width; w.dataset.pH = w.style.height; 
                w.style.top = "0px"; w.style.left = "0px"; w.style.width = "100vw"; w.style.height = "calc(100vh - 60px)"; w.dataset.maximized = "true"; w.style.borderRadius = "0px";
            }
        }
        snap(wid, side) {
            let w = document.getElementById(wid); if(!w) return;
            if(w.dataset.maximized === "false") { w.dataset.pT = w.style.top; w.style.left = w.style.left; w.dataset.pW = w.style.width; w.dataset.pH = w.style.height; }
            w.style.top = "0px"; w.style.height = "calc(100vh - 60px)"; w.style.width = "50vw"; w.style.borderRadius = "0px";
            if (side === 'left') { w.style.left = "0px"; } else { w.style.left = "50vw"; }
            w.dataset.maximized = "true"; this.focus(wid);
        }
        minimize(wid, pid) {
            let w = document.getElementById(wid); if(!w) return;
            if(w.style.opacity === '0') { 
                w.style.opacity = '1'; w.style.transform = 'scale(1) translateY(0)'; w.style.pointerEvents = 'auto';
                this.focus(wid); document.getElementById('tb-item-'+pid).classList.add('active'); 
            } else { 
                w.style.opacity = '0'; w.style.transform = 'scale(0.9) translateY(20px)'; w.style.pointerEvents = 'none';
                document.getElementById('tb-item-'+pid).classList.remove('active'); 
            }
        }
        updateTaskbar(pid, title) { document.getElementById('taskbar-apps').innerHTML += `<div id="tb-item-${pid}" class="tb-item active" onclick="GemiOS.WM.minimize('win_${pid}', '${pid}')">${title.substring(0,10)}</div>`; }
        removeWindow(pid) { if(this.windows[pid]) { this.windows[pid].remove(); delete this.windows[pid]; } let tbItem = document.getElementById('tb-item-'+pid); if(tbItem) tbItem.remove(); }
    }

    class ProcessManager {
        constructor() { this.processes = {}; this.pidCounter = 1000; }
        launch(appId, fileData = null) {
            let sm = document.getElementById('start-menu');
            if (sm) sm.classList.remove('open');
            if(!GemiOS.Registry[appId]) return;
            let pid = ++this.pidCounter; let app = GemiOS.Registry[appId];
            this.processes[pid] = { id: appId, title: app.title };
            GemiOS.WM.createWindow(pid, app.title, app.html(pid, fileData), app.width);
            if(app.onLaunch) app.onLaunch(pid, fileData);
        }
        kill(pid) {
            if(!this.processes[pid]) return;
            let appId = this.processes[pid].id;
            if(GemiOS.Registry[appId].onKill) GemiOS.Registry[appId].onKill(pid);
            let w = document.getElementById('win_' + pid);
            if(w) {
                w.style.opacity = '0'; w.style.transform = 'scale(0.9)';
                setTimeout(() => { GemiOS.WM.removeWindow(pid); delete this.processes[pid]; }, 200);
            } else {
                GemiOS.WM.removeWindow(pid); delete this.processes[pid];
            }
        }
    }

    const AppRegistry = {
        'sys_term': {
            icon: '⌨️', title: 'Bash Terminal', width: 500,
            html: (pid) => `<div id="t-out-${pid}" style="flex-grow:1; background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; min-height:250px; overflow-y:auto; border-radius:6px; box-shadow:inset 0 0 10px rgba(0,0,0,0.8);">GemiOS TreeFS Terminal<br>Type 'help' for commands</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span id="t-path-${pid}" style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/${GemiOS.user}></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`,
            onLaunch: (pid) => { GemiOS.termStates[pid] = 'C:/Users/' + GemiOS.user; setTimeout(()=>document.getElementById('t-in-'+pid).focus(),100); }
        },
        'sys_drive': {
            icon: '🗂️', title: 'Explorer 2.0', width: 520,
            html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px; border-color:#0078d7;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div><div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px;"></div>`,
            onLaunch: (pid) => { GemiOS.driveStates[pid] = 'C:/Users/' + GemiOS.user; GemiOS.renderDrive(pid); }
        },
        'sys_set': {
            icon: '⚙️', title: 'System Settings', width: 420,
            html: () => `
                <div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary">Apply Wallpaper</button></div>
                <div class="sys-card"><b style="font-size:14px;">Accent Color</b><br>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <div onclick="localStorage.setItem('GemiOS_Accent', '#0078d7'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#0078d7; cursor:pointer;"></div>
                        <div onclick="localStorage.setItem('GemiOS_Accent', '#ff00cc'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff00cc; cursor:pointer;"></div>
                        <div onclick="localStorage.setItem('GemiOS_Accent', '#38ef7d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#38ef7d; cursor:pointer;"></div>
                        <div onclick="localStorage.setItem('GemiOS_Accent', '#ff4d4d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff4d4d; cursor:pointer;"></div>
                        <div onclick="localStorage.setItem('GemiOS_Accent', '#ffb400'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ffb400; cursor:pointer;"></div>
                    </div>
                </div>
                <button onclick="localStorage.removeItem('GemiOS_Wall'); localStorage.removeItem('GemiOS_Accent'); location.reload();" class="btn-sec">Reset Defaults</button>
                <button onclick="GemiOS.VFS.format();" class="btn-danger">Format System (Erase All Data)</button>`
        },
        'sys_update': {
            icon: '☁️', title: 'Cloud Updater', width: 380,
            html: () => `<div class="sys-card" style="text-align:center; flex-grow:1;"><div style="font-size:40px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">☁️</div><h3 style="margin:5px 0;">GitHub Update Center</h3><p style="font-size:13px; opacity:0.8;">Kernel: <b id="kern-ver">v27.2.0-INCEPTION</b></p><div id="upd-stat" style="font-size:12px; min-height:15px;"></div><button id="upd-btn" onclick="GemiOS.triggerOTA(this)" class="btn-primary" style="margin-top:10px;">Check for Cloud Updates</button></div>`
        },
        'sys_store': {
            icon: '🛍️', title: 'GemiStore', width: 480,
            html: (pid) => `
                <div class="sys-card" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg, var(--accent), #000); border:none;">
                    <div style="font-size:24px; font-weight:bold;">GemiStore</div><div style="font-size:40px;">🛍️</div>
                </div>
                <div id="store-list-${pid}" style="flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; gap:10px;"></div>
            `,
            onLaunch: (pid) => {
                let desk = GemiOS.VFS.getDir('C:/Users/' + GemiOS.user + '/Desktop');
                let storeApps = {
                    'GemiVM.app': {id: 'app_vm', icon: '💽', desc: 'A Virtual Machine that boots a retro 90s OS inside a window.'},
                    'Matrix.app': {id: 'app_matrix', icon: '👨‍💻', desc: 'A digital rain terminal simulator.'},
                    'Clock.app': {id: 'app_clock', icon: '🕰️', desc: 'A beautiful analog desktop clock widget.'}
                };
                let h = '';
                for(let filename in storeApps) {
                    let a = storeApps[filename];
                    let isInstalled = desk[filename] !== undefined;
                    let btnHtml = isInstalled ? 
                        `<button class="btn-sec" style="width:100px; margin:0;" disabled>Installed</button>` : 
                        `<button class="btn-primary" style="width:100px; margin:0;" onclick="GemiOS.installApp('${filename}', '${a.id}', ${pid})">Download</button>`;
                    
                    h += `
                        <div class="sys-card" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0;">
                            <div style="display:flex; align-items:center; gap:15px;">
                                <div style="font-size:30px;">${a.icon}</div>
                                <div><div style="font-weight:bold; font-size:16px;">${filename.replace('.app','')}</div><div style="font-size:12px; opacity:0.7;">${a.desc}</div></div>
                            </div>
                            ${btnHtml}
                        </div>
                    `;
                }
                document.getElementById(`store-list-${pid}`).innerHTML = h;
            }
        },
        'sys_task': {
            icon: '📊', title: 'System Monitor', width: 450,
            html: (pid) => `<div style="display:flex; gap:10px;"><div class="sys-card" style="flex:1; border-left: 4px solid #38ef7d;"><b>CPU Usage</b><canvas id="cpu-cvs-${pid}" width="180" height="80"></canvas></div><div class="sys-card" style="flex:1; border-left: 4px solid #4db8ff;"><b>RAM Usage</b><canvas id="ram-cvs-${pid}" width="180" height="80"></canvas></div></div><div class="sys-card" style="border-left: 4px solid #ff4d4d; margin-top:10px;"><b>Active PIDs</b></div><div id="tm-list-${pid}" style="flex-grow:1; max-height:200px; overflow-y:auto;"></div>`,
            onLaunch: (pid) => {
                let cpuH = [], ramH = [];
                GemiOS.tmItvs = GemiOS.tmItvs || {};
                GemiOS.tmItvs[pid] = setInterval(() => {
                    let h = ''; let pCount = 0;
                    for(let p in GemiOS.PM.processes) {
                        pCount++;
                        h += `<div style="padding:8px; background:rgba(255,255,255,0.1); margin-bottom:5px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px;">${GemiOS.PM.processes[p].title} [${p}]</span><button onclick="GemiOS.PM.kill(${p})" class="btn-danger" style="padding:4px 8px; width:auto; font-size:11px;">Kill</button></div>`;
                    }
                    let el = document.getElementById(`tm-list-${pid}`); if(el) el.innerHTML = h;
                    
                    let cCvs = document.getElementById(`cpu-cvs-${pid}`);
                    let rCvs = document.getElementById(`ram-cvs-${pid}`);
                    if(cCvs && rCvs) {
                        let cCtx = cCvs.getContext('2d'); let rCtx = rCvs.getContext('2d');
                        cpuH.push(Math.random() * 20 + (pCount*5)); if(cpuH.length>30) cpuH.shift();
                        ramH.push(pCount * 12 + (Math.random()*5)); if(ramH.length>30) ramH.shift();
                        
                        cCtx.clearRect(0,0,180,80); rCtx.clearRect(0,0,180,80);
                        cCtx.strokeStyle = '#38ef7d'; cCtx.lineWidth = 2; cCtx.beginPath();
                        cpuH.forEach((v,i) => i===0 ? cCtx.moveTo(i*6, 80-v) : cCtx.lineTo(i*6, 80-v)); cCtx.stroke();
                        rCtx.strokeStyle = '#4db8ff'; rCtx.lineWidth = 2; rCtx.beginPath();
                        ramH.forEach((v,i) => i===0 ? rCtx.moveTo(i*6, 80-v) : rCtx.lineTo(i*6, 80-v)); rCtx.stroke();
                    }
                }, 1000);
            },
            onKill: (pid) => clearInterval(GemiOS.tmItvs[pid])
        },
        'sys_log': {
            icon: '📋', title: 'Chronicles', width: 500,
            html: () => `<div style="flex-grow:1; overflow-y: auto; padding-right: 5px;">
                <div class="sys-card" style="border-left:4px solid #38ef7d;"><b>v27.2.0 (Inception)</b> - Added GemiVM Virtual Machine. Added Native Window Resizing. Added GemiStore.</div>
                <div class="sys-card"><b>v27.1.0 (Aesthetic)</b> - Graphical Boot/Shutdown. Modern Glass Dock. Smoothed Animations.</div>
                <div class="sys-card"><b>v27.0.2 (Ultimate Stable)</b> - Re-written template strings to eradicate syntax crashes. Virtual Blob Injection.</div>
                <div class="sys-card"><b>v27.0.0 (Immersion)</b> - Multi-User Login. GemiChat LAN. GemiCraft World Saving. Themed Accents. Draggable Icons.</div>
                <div class="sys-card"><b>v26.4.0 (Reality Bridge)</b> - Native Drag & Drop file imports. Added GemiAmp.</div>
                <div class="sys-card"><b>v26.3.0 (Game Engine)</b> - Introduced Custom 2D Physics Engine. Added GemiCraft.</div>
                <div class="sys-card"><b>v1.0 (Legacy Web Sim)</b> - The True Original.</div>
            </div>`
        },
        'app_vm': {
            icon: '💽', title: 'GemiVM', width: 700,
            html: (pid) => {
                // A self-contained retro OS inside an iframe!
                let miniOS = `<!DOCTYPE html><html><head><style>body{background:#008080;font-family:Tahoma;overflow:hidden;margin:0;user-select:none;color:black;}#tb{position:absolute;bottom:0;width:100%;height:30px;background:#c0c0c0;border-top:2px solid #fff;display:flex;align-items:center;} .win{position:absolute;background:#c0c0c0;border:2px outset #fff;width:300px;box-shadow:2px 2px 5px rgba(0,0,0,0.5);}.tb-title{background:#000080;color:#fff;padding:5px;font-weight:bold;cursor:pointer;}button{font-family:Tahoma;}</style></head><body><div class="win" style="top:30px;left:30px;"><div class="tb-title">VM Guest System</div><div style="padding:15px;background:#fff;height:100px;">GemiVM Sandbox Active.<br><br><button onclick="alert('Nested Execution Successful!')">Ping Hardware</button></div></div><div class="win" style="top:100px;left:250px;"><div class="tb-title">Virtual Drive A:</div><div style="padding:15px;background:#fff;height:100px;">No Floppy Disk Inserted.</div></div><div id="tb"><button style="font-weight:bold;margin-left:2px;border:2px outset #fff;">Start</button><span style="margin-left:auto;margin-right:10px;">Guest Memory Isolated</span></div></body></html>`;
                let srcDoc = miniOS.replace(/"/g, '&quot;');
                return `<iframe srcdoc="${srcDoc}" style="width:100%; flex-grow:1; border:none; background:#000; border-radius:6px; box-shadow:inset 0 0 10px rgba(0,0,0,0.8);"></iframe>`;
            }
        },
        'app_matrix': {
            icon: '👨‍💻', title: 'Matrix Terminal', width: 500,
            html: (pid) => `<canvas id="matrix-cvs-${pid}" style="width:100%; flex-grow:1; background:#000; border-radius:6px;"></canvas>`,
            onLaunch: (pid) => {
                setTimeout(() => {
                    let cvs = document.getElementById(`matrix-cvs-${pid}`); if(!cvs) return;
                    cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight;
                    let ctx = cvs.getContext('2d');
                    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
                    let fontSize = 14; let columns = cvs.width / fontSize;
                    let drops = []; for(let i=0; i<columns; i++) drops[i] = 1;
                    
                    GemiOS.matrixItvs = GemiOS.matrixItvs || {};
                    GemiOS.matrixItvs[pid] = setInterval(() => {
                        if(!document.getElementById(`matrix-cvs-${pid}`)) { clearInterval(GemiOS.matrixItvs[pid]); return; }
                        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; ctx.fillRect(0, 0, cvs.width, cvs.height);
                        ctx.fillStyle = "var(--accent)"; ctx.font = fontSize + "px monospace";
                        for(let i=0; i<drops.length; i++) {
                            let text = chars[Math.floor(Math.random() * chars.length)];
                            ctx.fillText(text, i*fontSize, drops[i]*fontSize);
                            if(drops[i]*fontSize > cvs.height && Math.random() > 0.975) drops[i] = 0;
                            drops[i]++;
                        }
                    }, 33);
                }, 100);
            },
            onKill: (pid) => { if(GemiOS.matrixItvs && GemiOS.matrixItvs[pid]) clearInterval(GemiOS.matrixItvs[pid]); }
        },
        'app_clock': {
            icon: '🕰️', title: 'Desktop Clock', width: 300,
            html: (pid) => `
                <div style="flex-grow:1; display:flex; justify-content:center; align-items:center; background:rgba(0,0,0,0.2); border-radius:8px;">
                    <div style="width:200px; height:200px; border-radius:50%; border:5px solid var(--accent); position:relative; background:rgba(255,255,255,0.1); box-shadow:0 0 20px rgba(0,0,0,0.5);">
                        <div id="hand-h-${pid}" style="position:absolute; bottom:50%; left:calc(50% - 3px); width:6px; height:50px; background:white; transform-origin:bottom; border-radius:3px;"></div>
                        <div id="hand-m-${pid}" style="position:absolute; bottom:50%; left:calc(50% - 2px); width:4px; height:70px; background:white; transform-origin:bottom; border-radius:2px;"></div>
                        <div id="hand-s-${pid}" style="position:absolute; bottom:50%; left:calc(50% - 1px); width:2px; height:85px; background:#ff4d4d; transform-origin:bottom; border-radius:1px;"></div>
                        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:12px; height:12px; background:var(--accent); border-radius:50%;"></div>
                    </div>
                </div>
            `,
            onLaunch: (pid) => {
                GemiOS.clockItvs = GemiOS.clockItvs || {};
                GemiOS.clockItvs[pid] = setInterval(() => {
                    let d = new Date();
                    let s = document.getElementById(`hand-s-${pid}`);
                    let m = document.getElementById(`hand-m-${pid}`);
                    let h = document.getElementById(`hand-h-${pid}`);
                    if(!s) { clearInterval(GemiOS.clockItvs[pid]); return; }
                    s.style.transform = `rotate(${d.getSeconds() * 6}deg)`;
                    m.style.transform = `rotate(${d.getMinutes() * 6}deg)`;
                    h.style.transform = `rotate(${(d.getHours() % 12) * 30 + (d.getMinutes() * 0.5)}deg)`;
                }, 1000);
            },
            onKill: (pid) => { if(GemiOS.clockItvs && GemiOS.clockItvs[pid]) clearInterval(GemiOS.clockItvs[pid]); }
        },
        'app_chat': {
            icon: '💬', title: 'GemiChat (LAN)', width: 450,
            html: (pid) => `
                <div class="sys-card" style="margin-bottom:10px; font-size:12px;">Open GemiOS in a second browser tab to chat over Local Network!</div>
                <div id="chat-box-${pid}" style="flex-grow:1; background:rgba(0,0,0,0.5); border-radius:6px; padding:10px; overflow-y:auto; margin-bottom:10px; font-family:sans-serif; font-size:14px; border:1px solid rgba(255,255,255,0.2);"></div>
                <div style="display:flex; gap:10px;">
                    <input type="text" id="chat-in-${pid}" style="flex-grow:1; padding:10px; border-radius:20px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Type a message..." onkeydown="if(event.key==='Enter') GemiOS.sendChat(${pid})">
                    <button onclick="GemiOS.sendChat(${pid})" class="btn-primary" style="width:auto; padding:10px 20px; border-radius:20px;">Send</button>
                </div>
            `,
            onLaunch: (pid) => { GemiOS.chatPid = pid; GemiOS.updateChatBox(pid); }
        },
        'app_cam': {
            icon: '📸', title: 'GemiCam', width: 500,
            html: (pid) => `<div style="flex-grow:1; background:#000; border-radius:6px; overflow:hidden; position:relative; display:flex; justify-content:center; align-items:center;"><video id="vid-${pid}" autoplay playsinline style="width:100%; height:100%; object-fit:cover;"></video><button onclick="GemiOS.takePhoto(${pid})" style="position:absolute; bottom:25px; left:50%; transform:translateX(-50%); padding:12px 25px; border-radius:25px; border:2px solid white; background:#ff4d4d; color:white; font-weight:bold; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.5);">📸 Capture</button></div>`,
            onLaunch: (pid) => {
                navigator.mediaDevices.getUserMedia({video:true}).then(s => {
                    let v = document.getElementById(`vid-${pid}`);
                    if(v) { v.srcObject = s; GemiOS.camStreams = GemiOS.camStreams || {}; GemiOS.camStreams[pid] = s; }
                }).catch(e => { document.getElementById(`content_${pid}`).innerHTML = `<div class="sys-card" style="color:#ff4d4d;">Camera access denied.</div>`; });
            },
            onKill: (pid) => { if(GemiOS.camStreams && GemiOS.camStreams[pid]) GemiOS.camStreams[pid].getTracks().forEach(t=>t.stop()); }
        },
        'app_view': {
            icon: '🖼️', title: 'Gallery Viewer', width: 550,
            html: (pid, fileData) => {
                if(fileData) return `<div style="text-align:center; flex-grow:1; display:flex; align-items:center; justify-content:center;"><img src="${fileData}" style="max-width:100%; max-height:100%; border-radius:6px; box-shadow:0 5px 15px rgba(0,0,0,0.5);"></div>`;
                let pics = GemiOS.VFS.getDir('C:/Users/' + GemiOS.user + '/Pictures') || {}; let h = '';
                for(let p in pics) { h += `<img src="${pics[p]}" style="width:100%; border-radius:6px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.2);">`; }
                if(h === '') h = '<div style="text-align:center; padding:40px; opacity:0.5; font-size:18px; flex-grow:1;">No photos found.</div>';
                return `<div style="flex-grow:1; overflow-y:auto; padding-right:5px;">${h}</div>`;
            }
        },
        'app_amp': {
            icon: '🎵', title: 'GemiAmp Media Player', width: 400,
            html: (pid, fileData) => {
                if(!fileData) return `<div class="sys-card" style="text-align:center; padding:30px; flex-grow:1;"><h2>🎵 GemiAmp</h2><p>Drag an .mp3 from your real PC onto the desktop, then double click it in Explorer to play!</p></div>`;
                let accent = localStorage.getItem('GemiOS_Accent') || '#0078d7';
                return `
                    <div style="background:#111; padding:20px; border-radius:8px; text-align:center; border:1px solid #333; flex-grow:1; display:flex; flex-direction:column; justify-content:center;">
                        <div style="font-size:50px; margin-bottom:15px; animation: pulse 2s infinite;">🎵</div>
                        <h3 style="margin-top:0; color:${accent};">Now Playing</h3>
                        <audio controls autoplay style="width:100%; outline:none;">
                            <source src="${fileData}">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                `;
            }
        },
        'app_code': {
            icon: '&lt;/&gt;', title: 'GemiCode IDE', width: 800,
            html: (pid) => {
                let def = "<html>\n<body style='color:white; font-family:sans-serif;'>\n  <h2>Live Preview!</h2>\n</body>\n</html>";
                return `<div style="display:flex; flex-grow:1; gap:10px;"><textarea id="ide-in-${pid}" oninput="document.getElementById('ide-out-${pid}').srcdoc=this.value" style="flex:1; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:10px; border:none; border-radius:6px; resize:none; outline:none;" spellcheck="false">${def}</textarea><iframe id="ide-out-${pid}" style="flex:1; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:6px;" srcdoc="${def}"></iframe></div>`;
            }
        },
        'app_word': {
            icon: '📄', title: 'GemiWord', width: 500,
            html: (pid, fileData) => {
                let saved = fileData || GemiOS.VFS.read('C:/Users/' + GemiOS.user + '/Documents', 'document.rtf') || 'Start typing a rich text document...';
                return `
                <div style="display:flex; gap:5px; margin-bottom:10px; background:rgba(0,0,0,0.2); padding:8px; border-radius:6px;">
                    <button onclick="document.execCommand('bold')" class="btn-sec" style="width:auto; margin:0; padding:4px 10px; font-weight:bold;">B</button>
                    <button onclick="document.execCommand('italic')" class="btn-sec" style="width:auto; margin:0; padding:4px 10px; font-style:italic;">I</button>
                    <button onclick="document.execCommand('underline')" class="btn-sec" style="width:auto; margin:0; padding:4px 10px; text-decoration:underline;">U</button>
                    <div style="width:1px; background:rgba(255,255,255,0.2); margin:0 5px;"></div>
                    <button onclick="document.execCommand('justifyLeft')" class="btn-sec" style="width:auto; margin:0; padding:4px 10px;">Left</button>
                    <button onclick="document.execCommand('justifyCenter')" class="btn-sec" style="width:auto; margin:0; padding:4px 10px;">Center</button>
                </div>
                <div id="word-ed-${pid}" contenteditable="true" style="flex-grow:1; background:#fff; color:#000; padding:15px; border-radius:6px; outline:none; overflow-y:auto; box-shadow:inset 0 2px 5px rgba(0,0,0,0.1);" oninput="GemiOS.VFS.write('C:/Users/' + GemiOS.user + '/Documents', 'document.rtf', this.innerHTML)">${saved}</div>
                `;
            }
        },
        'app_voice': {
            icon: '🗣️', title: 'GemiVoice 2.0 TTS', width: 450,
            html: (pid) => {
                let defaultText = "GemiOS Inception Update active.";
                return `
                <div class="sys-card" style="margin-bottom:15px; display:flex; gap:10px; align-items:center;">
                    <span>Voice:</span>
                    <select id="voice-sel-${pid}" style="flex-grow:1; padding:5px; border-radius:4px; border:none; outline:none;"></select>
                </div>
                <textarea id="voice-text-${pid}" style="flex-grow:1; width:100%; box-sizing:border-box; resize:none; border:none; border-radius:6px; padding:15px; font-family:'Inter', sans-serif; font-size:14px; outline:none; background:rgba(255,255,255,0.9); color:black; margin-bottom:10px;">${defaultText}</textarea>
                <button onclick="GemiOS.speakText(${pid})" class="btn-primary" style="background:#ff00cc;">🗣️ Speak</button>
            `},
            onLaunch: (pid) => {
                let loadVoices = () => {
                    let sel = document.getElementById(`voice-sel-${pid}`); if(!sel) return;
                    let voices = speechSynthesis.getVoices();
                    sel.innerHTML = voices.map((v, i) => `<option value="${i}">${v.name} (${v.lang})</option>`).join('');
                };
                loadVoices();
                if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = loadVoices;
            }
        },
        'sys_browser': {
            icon: '🌐', title: 'Web Browser', width: 750,
            html: (pid) => `<div style="display:flex; gap:8px; margin-bottom:10px;"><input type="text" id="b-url-${pid}" value="https://wikipedia.org" style="flex-grow:1; padding:8px 12px; border-radius:20px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black; box-shadow:inset 0 2px 4px rgba(0,0,0,0.1);"><button onclick="document.getElementById('b-frame-${pid}').src=document.getElementById('b-url-${pid}').value" style="padding:8px 16px; border-radius:20px; border:none; background:var(--accent); color:white; font-weight:bold; cursor:pointer;">Go</button></div><iframe id="b-frame-${pid}" src="https://wikipedia.org" style="width:100%; flex-grow:1; border:none; border-radius:8px; background:white; box-shadow:inset 0 2px 10px rgba(0,0,0,0.1);"></iframe>`
        },
        'app_note': {
            icon: '📝', title: 'Notepad', width: 400,
            html: (pid, fileData) => `<textarea oninput="GemiOS.VFS.write('C:/Users/' + GemiOS.user + '/Documents', 'note.txt', this.value)" style="flex-grow:1; width:100%; box-sizing:border-box; resize:none; border:none; border-radius:6px; padding:15px; font-family:'Inter', sans-serif; font-size:14px; outline:none; background:rgba(255,255,255,0.9); color:black;">${fileData || GemiOS.VFS.read('C:/Users/' + GemiOS.user + '/Documents', 'note.txt') || ''}</textarea>`
        },
        'app_calc': {
            icon: '🧮', title: 'Calculator Pro', width: 260,
            html: (pid) => `<div style="background:rgba(255,255,255,0.9); color:black; padding:15px; font-size:28px; text-align:right; margin-bottom:10px; border-radius:6px; font-family:monospace;" id="cd-${pid}">0</div><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; flex-grow:1;">${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="padding:15px; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.1); cursor:pointer; font-weight:bold; border-radius:6px; color:inherit; font-size:16px;" onclick="let d=document.getElementById('cd-${pid}'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') { try { d.innerText=eval(d.innerText); } catch(e){ d.innerText='Err'; } } else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}</div>`
        },
        'app_craft': {
            icon: '⛏️', title: 'GemiCraft 2.0', width: 630,
            html: (pid) => `
                <div style="background:#87CEEB; border-radius:6px; overflow:hidden; position:relative; flex-grow:1; display:flex; flex-direction:column;">
                    <canvas id="craft-cvs-${pid}" style="flex-grow:1; width:100%; display:block; cursor:crosshair; transition: background 2s ease;"></canvas>
                    <div style="position:absolute; top:10px; right:10px; display:flex; gap:5px;">
                        <button onclick="GemiOS.saveCraft()" class="btn-primary" style="padding:5px 10px; font-size:11px;">💾 Save</button>
                        <button onclick="GemiOS.loadCraft()" class="btn-sec" style="padding:5px 10px; font-size:11px; margin:0;">📂 Load</button>
                    </div>
                    <div style="position:absolute; top:10px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.5); padding:5px; border-radius:8px; display:flex; gap:5px; pointer-events:none;">
                        <div id="hb-2-${pid}" style="width:25px;height:25px;background:#8B4513;border:2px solid yellow;"></div>
                        <div id="hb-3-${pid}" style="width:25px;height:25px;background:#808080;border:2px solid transparent;"></div>
                        <div id="hb-4-${pid}" style="width:25px;height:25px;background:#5C4033;border:2px solid transparent;"></div>
                        <div id="hb-5-${pid}" style="width:25px;height:25px;background:#228B22;border:2px solid transparent;"></div>
                    </div>
                    <div style="text-align:center; padding:8px; background:#222; color:#38ef7d; font-family:monospace; font-size:12px;">[A/D] Move | [W] Jump | [1-4] Select Block | [Click] Break | [Shift+Click] Place</div>
                </div>`,
            onLaunch: (pid) => {
                setTimeout(() => {
                    let cvs = document.getElementById(`craft-cvs-${pid}`); if(!cvs) return;
                    cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight;
                    let ctx = cvs.getContext('2d');
                    let ts = 20; 
                    let cols = Math.ceil(cvs.width/ts); let rows = Math.ceil(cvs.height/ts);
                    
                    GemiOS.craftWorld = []; 
                    for(let x=0; x<cols; x++) {
                        GemiOS.craftWorld[x] = []; let h = 8 + Math.floor(Math.sin(x)*2); 
                        for(let y=0; y<rows; y++) { 
                            if(y < h) GemiOS.craftWorld[x][y] = 0; 
                            else if(y === h) GemiOS.craftWorld[x][y] = 1; 
                            else if(y > h && y < h+4) GemiOS.craftWorld[x][y] = 2; 
                            else GemiOS.craftWorld[x][y] = 3; 
                        }
                        if(x > 2 && x < cols-2 && Math.random() < 0.15) {
                            GemiOS.craftWorld[x][h-1] = 4; GemiOS.craftWorld[x][h-2] = 4; 
                            GemiOS.craftWorld[x][h-3] = 5; GemiOS.craftWorld[x-1][h-3] = 5; GemiOS.craftWorld[x+1][h-3] = 5; 
                            GemiOS.craftWorld[x][h-4] = 5; 
                        }
                    }
                    
                    let p = {x: cvs.width/2, y: 50, vx: 0, vy: 0, w: 14, h: 28, speed: 3.5, jump: -8, ground: false};
                    let keys = {}; let selectedBlock = 2;
                    let time = 0; 
                    
                    let updateHotbar = (b) => {
                        selectedBlock = b;
                        for(let i=2; i<=5; i++) {
                            let el = document.getElementById(`hb-${i}-${pid}`);
                            if(el) el.style.borderColor = (i === selectedBlock) ? 'yellow' : 'transparent';
                        }
                    };

                    let keydown = (e) => {
                        keys[e.key.toLowerCase()] = true;
                        if(e.key === '1') updateHotbar(2); if(e.key === '2') updateHotbar(3); 
                        if(e.key === '3') updateHotbar(4); if(e.key === '4') updateHotbar(5); 
                    }; 
                    let keyup = (e) => keys[e.key.toLowerCase()] = false;
                    document.addEventListener('keydown', keydown); document.addEventListener('keyup', keyup);

                    cvs.onmousedown = (e) => {
                        let bx = Math.floor(e.offsetX / ts); let by = Math.floor(e.offsetY / ts);
                        if(bx>=0 && bx<cols && by>=0 && by<rows) {
                            if(e.shiftKey) { if(GemiOS.craftWorld[bx][by] === 0) GemiOS.craftWorld[bx][by] = selectedBlock; } 
                            else { GemiOS.craftWorld[bx][by] = 0; }
                        }
                    };

                    let checkCol = (nx, ny) => {
                        let left = Math.floor(nx/ts), right = Math.floor((nx+p.w-0.1)/ts);
                        let top = Math.floor(ny/ts), bottom = Math.floor((ny+p.h-0.1)/ts);
                        if(left<0 || right>=cols || bottom>=rows || top<0) return true;
                        for(let i=left; i<=right; i++) { for(let j=top; j<=bottom; j++) { if(GemiOS.craftWorld[i][j] !== 0 && GemiOS.craftWorld[i][j] !== 5) return true; } } 
                        return false;
                    };

                    GemiOS.craftItvs = GemiOS.craftItvs || {};
                    GemiOS.craftItvs[pid] = setInterval(() => {
                        if(!document.getElementById(`craft-cvs-${pid}`)) { clearInterval(GemiOS.craftItvs[pid]); document.removeEventListener('keydown', keydown); document.removeEventListener('keyup', keyup); return; }
                        
                        // Handle resize dynamically
                        if(cvs.width !== cvs.offsetWidth || cvs.height !== cvs.offsetHeight) {
                             cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight;
                        }

                        if(keys['a']) p.vx = -p.speed; else if(keys['d']) p.vx = p.speed; else p.vx = 0;
                        if(keys['w'] && p.ground) { p.vy = p.jump; p.ground = false; }
                        p.vy += 0.45; 
                        if(!checkCol(p.x + p.vx, p.y)) { p.x += p.vx; } else { p.vx = 0; }
                        if(!checkCol(p.x, p.y + p.vy)) { p.y += p.vy; p.ground = false; } else { if(p.vy > 0) p.ground = true; p.vy = 0; p.y = Math.round(p.y); }

                        time += 0.001;
                        let rC = Math.floor(Math.max(20, 135 * Math.sin(time)));
                        let gC = Math.floor(Math.max(20, 206 * Math.sin(time)));
                        let bC = Math.floor(Math.max(40, 235 * Math.sin(time)));
                        cvs.style.background = `rgb(${rC},${gC},${bC})`;
                        ctx.clearRect(0,0,cvs.width,cvs.height); 
                        
                        for(let x=0; x<cols; x++) {
                            for(let y=0; y<rows; y++) {
                                if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 1) { ctx.fillStyle = '#4CAF50'; ctx.fillRect(x*ts, y*ts, ts, ts); ctx.fillStyle = '#8B4513'; ctx.fillRect(x*ts, y*ts+6, ts, ts-6); }
                                else if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 2) { ctx.fillStyle = '#8B4513'; ctx.fillRect(x*ts, y*ts, ts, ts); ctx.strokeStyle = '#6b3410'; ctx.strokeRect(x*ts, y*ts, ts, ts); }
                                else if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 3) { ctx.fillStyle = '#808080'; ctx.fillRect(x*ts, y*ts, ts, ts); ctx.strokeStyle = '#666'; ctx.strokeRect(x*ts, y*ts, ts, ts); }
                                else if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 4) { ctx.fillStyle = '#5C4033'; ctx.fillRect(x*ts+4, y*ts, ts-8, ts); } 
                                else if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 5) { ctx.fillStyle = '#228B22'; ctx.globalAlpha = 0.8; ctx.fillRect(x*ts, y*ts, ts, ts); ctx.globalAlpha = 1.0; } 
                            }
                        }
                        ctx.fillStyle = '#FF4500'; ctx.fillRect(p.x, p.y, p.w, p.h); ctx.fillStyle = '#FFE4C4'; ctx.fillRect(p.x+2, p.y+2, p.w-4, 8); 
                    }, 1000/60); 
                }, 100);
            },
            onKill: (pid) => { if(GemiOS.craftItvs && GemiOS.craftItvs[pid]) clearInterval(GemiOS.craftItvs[pid]); }
        },
        'app_paint': {
            icon: '🎨', title: 'GemiPaint', width: 600,
            html: (pid) => `<div style="margin-bottom:10px; display:flex; gap:10px; align-items:center;"><button onclick="const c=document.getElementById('cvs-${pid}'); c.getContext('2d').clearRect(0,0,c.width,c.height);" class="btn-sec" style="width:auto; margin:0; padding:6px 12px;">Clear</button> <input type="color" id="p-col-${pid}" value="#000000" style="cursor:pointer;"></div><canvas id="cvs-${pid}" style="background:white; border-radius:6px; width:100%; flex-grow:1; cursor:crosshair; box-shadow:inset 0 0 10px rgba(0,0,0,0.1);"></canvas>`,
            onLaunch: (pid) => {
                setTimeout(() => {
                    const can = document.getElementById(`cvs-${pid}`); if(!can) return;
                    can.width = can.offsetWidth; can.height = can.offsetHeight;
                    const ctx = can.getContext('2d'); let drawing = false;
                    can.onmousedown = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
                    can.onmouseup = () => drawing = false; can.onmouseout = () => drawing = false;
                    can.onmousemove = (e) => { if(drawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle = document.getElementById(`p-col-${pid}`).value; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); } };
                    
                    // Handle resize
                    window.addEventListener('resize', () => {
                         if(can.width !== can.offsetWidth) {
                             let temp = ctx.getImageData(0,0,can.width,can.height);
                             can.width = can.offsetWidth; can.height = can.offsetHeight;
                             ctx.putImageData(temp,0,0);
                         }
                    });
                }, 100);
            }
        },
        'app_synth': {
            icon: '🎹', title: "GemiSynth", width: 340,
            html: () => `<div style="text-align:center; margin-bottom:10px; font-weight:bold;">Mini Synthesizer</div><div style="display:flex; justify-content:center; position:relative; background:#111; padding:15px; border-radius:8px; flex-grow:1;"><div class="synth-key" onclick="GemiOS.playNote(261.63)">C</div><div class="synth-key synth-black" onclick="GemiOS.playNote(277.18)">C#</div><div class="synth-key" onclick="GemiOS.playNote(293.66)">D</div><div class="synth-key synth-black" onclick="GemiOS.playNote(311.13)">D#</div><div class="synth-key" onclick="GemiOS.playNote(329.63)">E</div><div class="synth-key" onclick="GemiOS.playNote(349.23)">F</div><div class="synth-key synth-black" onclick="GemiOS.playNote(369.99)">F#</div><div class="synth-key" onclick="GemiOS.playNote(392.00)">G</div><div class="synth-key synth-black" onclick="GemiOS.playNote(415.30)">G#</div><div class="synth-key" onclick="GemiOS.playNote(440.00)">A</div><div class="synth-key synth-black" onclick="GemiOS.playNote(466.16)">A#</div><div class="synth-key" onclick="GemiOS.playNote(493.88)">B</div></div>`
        },
        'app_sweeper': {
            icon: '💣', title: "GemiSweeper", width: 290,
            html: (pid) => `<div style="text-align:center; margin-bottom:10px;"><button onclick="GemiOS.initSweeper(${pid})" class="btn-primary" style="width:auto; padding:6px 15px;">Restart</button></div><div id="ms-grid-${pid}" style="display:grid; grid-template-columns:repeat(9,25px); gap:2px; justify-content:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; flex-grow:1;"></div>`,
            onLaunch: (pid) => GemiOS.initSweeper(pid)
        },
        'app_ttt': {
            icon: '❌', title: "Tic-Tac-Toe", width: 260,
            html: (pid) => `<div id="ttt-stat-${pid}" style="text-align:center; font-weight:bold; font-size:18px; margin-bottom:15px; color:#4db8ff;">Player X Turn</div><div id="ttt-b-${pid}" style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; flex-grow:1;"></div><div style="text-align:center; margin-top:15px;"><button onclick="GemiOS.initTTT(${pid})" class="btn-sec">Reset</button></div>`,
            onLaunch: (pid) => GemiOS.initTTT(pid)
        },
        'app_pong': {
            icon: '🏓', title: 'GemiPong 3.0', width: 420,
            html: (pid) => `<canvas id="pong-cvs-${pid}" width="380" height="240" style="background:#0a0a0a; border-radius:8px; box-shadow:inset 0 5px 15px rgba(0,0,0,0.5); display:block; margin:0 auto; cursor:none; flex-grow:1;"></canvas>`,
            onLaunch: (pid) => { setTimeout(() => {
                let cvs = document.getElementById(`pong-cvs-${pid}`); if(!cvs) return; let ctx = cvs.getContext('2d');
                let pY=100, cY=100, bX=190, bY=120, bDX=4, bDY=2;
                cvs.onmousemove = (e) => pY = Math.max(0, Math.min(cvs.height-50, e.offsetY - 25));
                GemiOS.pongItvs = GemiOS.pongItvs || {};
                GemiOS.pongItvs[pid] = setInterval(() => {
                    if(!document.getElementById(`pong-cvs-${pid}`)) { clearInterval(GemiOS.pongItvs[pid]); return; }
                    if(cvs.width !== cvs.offsetWidth) { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; }
                    bX+=bDX; bY+=bDY;
                    if(bY<=5 || bY>=cvs.height-5) bDY=-bDY;
                    if(bX<=15 && bY>pY && bY<pY+50) { bDX=Math.abs(bDX)+0.2; bDY=(bY-(pY+25))*0.25; }
                    if(bX>=cvs.width-15 && bY>cY && bY<cY+50) { bDX=-Math.abs(bDX)-0.2; bDY=(bY-(cY+25))*0.25; }
                    if(bX<0 || bX>cvs.width) { bX=cvs.width/2; bY=cvs.height/2; bDX=bDX>0?-4:4; bDY=(Math.random()-0.5)*4; }
                    cY += (bY-(cY+25))*0.1; cY = Math.max(0, Math.min(cvs.height-50, cY));
                    ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,cvs.width,cvs.height);
                    ctx.fillStyle='var(--accent)'; ctx.fillRect(5,pY,8,50); ctx.fillStyle='#ff4d4d'; ctx.fillRect(cvs.width-13,cY,8,50); 
                    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(bX,bY,5,0,Math.PI*2); ctx.fill(); 
                }, 30);
            }, 100); },
            onKill: (pid) => clearInterval(GemiOS.pongItvs[pid])
        },
        'app_snake': {
            icon: '🐍', title: "Snake", width: 340,
            html: (pid) => { let hs = localStorage.getItem('GemiOS_SnakeHS') || 0; return `<div style="text-align:center; margin-bottom:10px; font-weight:bold;">Score: <b id="sn-score-${pid}" style="color:#38ef7d;">0</b> | High: <b id="sn-hs-${pid}" style="color:var(--accent);">${hs}</b></div><canvas id="sn-cvs-${pid}" width="300" height="300" style="background:#0a0a0a; display:block; margin:0 auto; border-radius:8px; box-shadow:inset 0 0 15px rgba(0,0,0,0.8); flex-grow:1;"></canvas>`; },
            onLaunch: (pid) => { setTimeout(() => {
                let can = document.getElementById(`sn-cvs-${pid}`); if(!can) return; let ctx = can.getContext('2d');
                let snake = [{x: 150, y: 150}], dx = 10, dy = 0, score = 0, food = {x: 50, y: 50};
                let highScore = parseInt(localStorage.getItem('GemiOS_SnakeHS')) || 0;
                let handleKey = (e) => {
                    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
                    if(e.key==='ArrowUp' && dy===0) { dx=0; dy=-10; } else if(e.key==='ArrowDown' && dy===0) { dx=0; dy=10; }
                    else if(e.key==='ArrowLeft' && dx===0) { dx=-10; dy=0; } else if(e.key==='ArrowRight' && dx===0) { dx=10; dy=0; }
                };
                document.addEventListener('keydown', handleKey);
                GemiOS.snakeItvs = GemiOS.snakeItvs || {};
                GemiOS.snakeItvs[pid] = setInterval(() => {
                    if(!document.getElementById(`sn-cvs-${pid}`)) { clearInterval(GemiOS.snakeItvs[pid]); document.removeEventListener('keydown', handleKey); return; }
                    let head = {x: snake[0].x + dx, y: snake[0].y + dy};
                    if(head.x<0 || head.x>=300 || head.y<0 || head.y>=300 || snake.some(s=>s.x===head.x && s.y===head.y)) {
                        clearInterval(GemiOS.snakeItvs[pid]); document.removeEventListener('keydown', handleKey);
                        if(score > highScore) { localStorage.setItem('GemiOS_SnakeHS', score); alert('New High Score! ' + score); } else { alert('Game Over! Score: ' + score); }
                        return;
                    }
                    snake.unshift(head);
                    if(head.x===food.x && head.y===food.y) { score+=10; document.getElementById(`sn-score-${pid}`).innerText=score; food={x:Math.floor(Math.random()*30)*10, y:Math.floor(Math.random()*30)*10}; } else snake.pop();
                    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,300,300); ctx.fillStyle = '#38ef7d'; snake.forEach(s => { ctx.beginPath(); ctx.arc(s.x+5, s.y+5, 4.5, 0, Math.PI*2); ctx.fill(); });
                    ctx.fillStyle = '#ff4d4d'; ctx.beginPath(); ctx.arc(food.x+5, food.y+5, 4.5, 0, Math.PI*2); ctx.fill();
                }, 100);
            }, 100); },
            onKill: (pid) => clearInterval(GemiOS.snakeItvs[pid])
        }
    };

    class CoreOS {
        constructor() {
            this.VFS = new VirtualFileSystem();
            this.WM = new WindowManager();
            this.PM = new ProcessManager();
            this.Registry = AppRegistry;
            this.termStates = {}; this.driveStates = {};
            this.user = 'Admin'; 
        }

        init() {
            this.injectStyles();
            
            window.addEventListener('storage', (e) => {
                if(e.key === 'GemiChat_Log') { if(this.chatPid) this.updateChatBox(this.chatPid); }
            });

            if(sessionStorage.getItem('GemiOS_Session') === 'active') {
                this.user = sessionStorage.getItem('GemiOS_User') || 'Admin';
                this.patchDesktopData();
                this.launchDesktop();
            } else {
                this.runBootSequence();
            }
        }
        
        patchDesktopData() {
            let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop', true);
            // Notice: VM, Clock, Matrix are NOT loaded to desktop by default. Store only!
            let appsToLoad = {
                'Explorer.app': 'sys_drive', 'TaskMgr.app': 'sys_task', 'Updater.app': 'sys_update',
                'GemiStore.app': 'sys_store', 'Chronicles.app': 'sys_log', 'TimeMach.app': 'sys_time', 
                'Settings.app': 'sys_set', 'Browser.app': 'sys_browser', 'GemiCode.app': 'app_code', 
                'Terminal.app': 'sys_term', 'Notepad.app': 'app_note', 'GemiWord.app': 'app_word', 
                'GemiVoice.app': 'app_voice', 'GemiChat.app': 'app_chat', 'GemiAmp.app': 'app_amp', 
                'Calc.app': 'app_calc', 'Camera.app': 'app_cam', 'Gallery.app': 'app_view', 
                'Pong.app': 'app_pong', 'Paint.app': 'app_paint', 'Synth.app': 'app_synth', 
                'Snake.app': 'app_snake', 'Sweeper.app': 'app_sweeper', 'TicTac.app': 'app_ttt', 
                'GemiCraft.app': 'app_craft'
            };
            for(let a in appsToLoad) { if(!desk[a]) this.VFS.write('C:/Users/' + this.user + '/Desktop', a, appsToLoad[a]); }
        }
        
        runBootSequence() {
            document.body.innerHTML = `
                <div id="gui-boot" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:#050505;display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;z-index:999999;transition:opacity 0.8s ease;">
                    <div style="font-size:90px; animation: float 3s ease-in-out infinite; filter:drop-shadow(0 0 25px var(--accent));">🌌</div>
                    <h1 style="font-family:'Inter',sans-serif; font-weight:600; letter-spacing:6px; margin-top:20px; font-size:32px;">GemiOS<span style="color:var(--accent);">27</span></h1>
                    <div style="margin-top:5px; font-family:monospace; font-size:12px; color:#666; letter-spacing:2px;">LOADING INCEPTION ENGINE...</div>
                    <div class="spinner" style="margin-top:40px;"></div>
                </div>
            `;
            setTimeout(() => {
                let bs = document.getElementById('gui-boot');
                bs.style.opacity = '0';
                setTimeout(() => this.showLoginScreen(), 800);
            }, 3000); 
        }
        
        showLoginScreen() {
            document.body.innerHTML = `
                <div id="desktop-bg" style="filter:blur(15px) brightness(0.6); transform:scale(1.05);"></div>
                <div id="login-ui" style="position:absolute; top:0; left:0; width:100vw; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; z-index:999; animation: fadeIn 1s ease forwards;">
                    <div style="font-size:70px; background:rgba(255,255,255,0.1); border-radius:50%; width:120px; height:120px; display:flex; justify-content:center; align-items:center; margin-bottom:20px; border:2px solid rgba(255,255,255,0.2); box-shadow:0 10px 30px rgba(0,0,0,0.5); backdrop-filter:blur(10px);">👥</div>
                    <h2 style="margin:0 0 30px 0; font-size:28px; font-weight:500; letter-spacing:2px;">Select User</h2>
                    <div style="display:flex; gap:25px; margin-bottom:20px;">
                        <div onclick="GemiOS.authenticate('Admin')" style="cursor:pointer; text-align:center; padding:20px 40px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:16px; transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter:blur(10px);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)';">
                            <div style="font-size:35px; margin-bottom:10px;">👑</div><b style="font-size:16px;">Admin</b>
                        </div>
                        <div onclick="GemiOS.authenticate('Guest')" style="cursor:pointer; text-align:center; padding:20px 40px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:16px; transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter:blur(10px);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)';">
                            <div style="font-size:35px; margin-bottom:10px;">👤</div><b style="font-size:16px;">Guest</b>
                        </div>
                    </div>
                    <div style="position:absolute; bottom:30px; color:rgba(255,255,255,0.5); font-size:12px; font-weight:600; letter-spacing:1px;">© 2026 Usernameistakenandnotavaliable & Gemini</div>
                </div>
            `;
            this.loadWallpaper(); 
        }

        playStartupChime() {
            if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)();
            if(this.actx.state === 'suspended') this.actx.resume();
            const t = this.actx.currentTime;
            const freqs = [523.25, 659.25, 783.99, 1046.50]; 
            freqs.forEach((freq, i) => {
                let osc = this.actx.createOscillator(); let gain = this.actx.createGain();
                osc.type = 'sine'; osc.frequency.value = freq;
                osc.connect(gain); gain.connect(this.actx.destination);
                osc.start(t + i * 0.15);
                gain.gain.setValueAtTime(0, t + i * 0.15);
                gain.gain.linearRampToValueAtTime(0.3, t + i * 0.15 + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 1.5);
                osc.stop(t + i * 0.15 + 1.5);
            });
        }

        playShutdownChime() {
            if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)();
            if(this.actx.state === 'suspended') this.actx.resume();
            const t = this.actx.currentTime;
            const freqs = [1046.50, 783.99, 659.25, 523.25]; 
            freqs.forEach((freq, i) => {
                let osc = this.actx.createOscillator(); let gain = this.actx.createGain();
                osc.type = 'triangle'; osc.frequency.value = freq;
                osc.connect(gain); gain.connect(this.actx.destination);
                osc.start(t + i * 0.2);
                gain.gain.setValueAtTime(0, t + i * 0.2);
                gain.gain.linearRampToValueAtTime(0.2, t + i * 0.2 + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.2 + 1.0);
                osc.stop(t + i * 0.2 + 1.0);
            });
        }

        lockSystem() {
            this.playShutdownChime();
            let bg = document.getElementById('desktop-bg');
            if(bg) bg.style.filter = "blur(20px) grayscale(100%) brightness(0.2)";
            let overlay = document.createElement('div');
            overlay.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 1s ease;pointer-events:none;color:white;font-family:sans-serif;';
            overlay.innerHTML = `<div class="spinner" style="margin-bottom:20px;"></div><div style="font-size:18px; letter-spacing:2px; font-weight:300;">Shutting down...</div>`;
            document.body.appendChild(overlay);
            setTimeout(() => { overlay.style.opacity = '1'; }, 50);
            setTimeout(() => { sessionStorage.removeItem('GemiOS_Session'); location.reload(); }, 2000);
        }
        
        authenticate(username) { 
            let ui = document.getElementById('login-ui');
            if(ui) { ui.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; ui.style.opacity = '0'; ui.style.transform = 'scale(1.1)'; }
            this.user = username;
            this.patchDesktopData();
            this.playStartupChime(); 
            sessionStorage.setItem('GemiOS_Session', 'active'); 
            sessionStorage.setItem('GemiOS_User', username);
            setTimeout(() => { this.launchDesktop(); }, 500);
        }

        notify(title, message, isSuccess = true) {
            let container = document.getElementById('notif-container');
            if(!container) return;
            let icon = isSuccess ? '✅' : '🔔';
            let color = isSuccess ? 'var(--accent)' : '#4db8ff';
            let n = document.createElement('div');
            n.className = 'gemi-notif';
            n.innerHTML = `<div style="font-size:20px;">${icon}</div><div><div style="font-weight:bold; color:${color}; margin-bottom:2px;">${title}</div><div style="font-size:12px; opacity:0.9;">${message}</div></div>`;
            container.appendChild(n);
            void n.offsetWidth;
            n.style.transform = 'translateX(0)'; n.style.opacity = '1';
            setTimeout(() => { n.style.transform = 'translateX(120%)'; n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 3500);
        }

        launchDesktop() {
            this.buildUI(); this.renderDesktopIcons(); this.applyTheme(); this.loadWallpaper(); this.startClock(); this.initContextMenu();
            this.initRealityBridge(); 
            let bg = document.getElementById('desktop-bg');
            if(bg) { bg.style.filter = "none"; bg.style.transform = "scale(1)"; }
            
            window.dragWidget = function(e, id) {
                if(e.target.tagName === 'TEXTAREA') return; 
                let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
                document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
                document.onmouseup = () => document.onmousemove = null;
            };
        }

        // --- GEMISTORE INSTALL LOGIC ---
        installApp(filename, appId, pid) {
            this.VFS.write('C:/Users/' + this.user + '/Desktop', filename, appId);
            this.notify("GemiStore", `${filename} has been installed!`);
            this.renderDesktopIcons();
            // Re-render store list to show it's installed
            if(this.Registry['sys_store'].onLaunch) this.Registry['sys_store'].onLaunch(pid);
        }
        
        initRealityBridge() {
            document.body.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); });
            document.body.addEventListener('drop', e => {
                e.preventDefault(); e.stopPropagation();
                let file = e.dataTransfer.files[0];
                if (!file) return;
                
                let reader = new FileReader();
                reader.onload = (event) => {
                    this.VFS.write('C:/Users/' + this.user + '/Downloads', file.name, event.target.result);
                    this.notify("Reality Bridge Success", `Imported ${file.name} to Downloads.`);
                    for(let pid in this.driveStates) { this.renderDrive(pid); }
                };
                if(file.name.endsWith('.txt') || file.name.endsWith('.rtf')) { reader.readAsText(file); } 
                else { reader.readAsDataURL(file); }
            });
        }
        
        openFile(path, filename) {
            let data = this.VFS.read(path, filename);
            let ext = filename.split('.').pop().toLowerCase();
            
            if(ext === 'app') { this.PM.launch(data); } 
            else if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) { this.PM.launch('app_view', data); } 
            else if (['mp3', 'wav', 'ogg'].includes(ext)) { this.PM.launch('app_amp', data); } 
            else { this.PM.launch('app_note', data); }
        }

        renderDesktopIcons() {
            let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop');
            let layoutData = this.VFS.read('C:/Users/' + this.user + '/Desktop', '.layout') || "{}";
            let layout = JSON.parse(layoutData);
            
            let html = ''; let i = 0;
            for(let file in desk) {
                if(file.endsWith('.app')) {
                    let appId = desk[file]; let app = this.Registry[appId];
                    if(app) {
                        let top = layout[file] ? layout[file].top : (20 + (i % 6) * 100) + 'px'; 
                        let left = layout[file] ? layout[file].left : (20 + Math.floor(i / 6) * 90) + 'px';
                        let safeFile = file.replace(/'/g, "\\'"); 
                        html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.PM.launch('${appId}')"><div>${app.icon}</div>${file.replace('.app','')}</div>`;
                        i++;
                    }
                }
            }
            document.getElementById('desktop-icons').innerHTML = html;
        }

        dragIcon(e, id, filename) {
            let el = document.getElementById(id);
            let ox = e.clientX - el.offsetLeft; let oy = e.clientY - el.offsetTop;
            document.onmousemove = (ev) => { el.style.left = (ev.clientX - ox) + 'px'; el.style.top = (ev.clientY - oy) + 'px'; };
            document.onmouseup = () => {
                document.onmousemove = null; document.onmouseup = null;
                let layoutData = this.VFS.read('C:/Users/' + this.user + '/Desktop', '.layout') || "{}";
                let layout = JSON.parse(layoutData);
                layout[filename] = { top: el.style.top, left: el.style.left };
                this.VFS.write('C:/Users/' + this.user + '/Desktop', '.layout', JSON.stringify(layout));
            };
        }

        takePhoto(pid) {
            let v = document.getElementById(`vid-${pid}`);
            if(!v || !v.srcObject) return this.notify("Camera Error", "Hardware not active.", false);
            let c = document.createElement('canvas'); 
            c.width = v.videoWidth; c.height = v.videoHeight;
            c.getContext('2d').drawImage(v, 0, 0);
            let data = c.toDataURL('image/jpeg');
            let name = 'Photo_' + new Date().getTime() + '.jpg';
            this.VFS.write('C:/Users/' + this.user + '/Pictures', name, data);
            this.notify("Photo Captured", `Saved to Pictures/${name}`);
        }

        updateChatBox(pid) {
            let box = document.getElementById(`chat-box-${pid}`);
            if(box) {
                let log = localStorage.getItem('GemiChat_Log') || '';
                box.innerHTML = log; box.scrollTop = box.scrollHeight;
            }
        }
        sendChat(pid) {
            let input = document.getElementById(`chat-in-${pid}`);
            let text = input.value.trim(); if(!text) return;
            input.value = '';
            let log = localStorage.getItem('GemiChat_Log') || '';
            let time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            log += `<div style="margin-bottom:5px;"><span style="color:var(--accent)">[${time}]</span> <b style="color:white">${this.user}:</b> ${text}</div>`;
            localStorage.setItem('GemiChat_Log', log);
            this.updateChatBox(pid);
        }

        speakText(pid) {
            let text = document.getElementById(`voice-text-${pid}`).value;
            let u = new SpeechSynthesisUtterance(text);
            let sel = document.getElementById(`voice-sel-${pid}`);
            if(sel && sel.value !== "") {
                let voices = speechSynthesis.getVoices();
                u.voice = voices[sel.value];
            }
            speechSynthesis.speak(u);
            this.notify("GemiVoice", "Synthesizing Speech...", true);
        }

        saveCraft() {
            if(this.craftWorld) {
                this.VFS.write('C:/Users/' + this.user + '/Documents', 'world.dat', JSON.stringify(this.craftWorld));
                this.notify("GemiCraft", "World saved to Documents/world.dat");
            }
        }
        loadCraft() {
            let data = this.VFS.read('C:/Users/' + this.user + '/Documents', 'world.dat');
            if(data) { this.craftWorld = JSON.parse(data); this.notify("GemiCraft", "World loaded successfully!"); } 
            else { this.notify("GemiCraft", "No saved world found.", false); }
        }

        initContextMenu() {
            document.body.addEventListener('contextmenu', (e) => {
                if(e.target.id === 'os-root' || e.target.id === 'desktop-bg' || e.target.id === 'desktop-icons') {
                    e.preventDefault();
                    let menu = document.getElementById('context-menu');
                    menu.style.display = 'block'; menu.style.left = e.pageX + 'px'; menu.style.top = e.pageY + 'px';
                    menu.style.opacity = '0'; menu.style.transform = 'scale(0.9)';
                    setTimeout(() => { menu.style.opacity = '1'; menu.style.transform = 'scale(1)'; }, 10);
                }
            });
            document.body.addEventListener('click', () => { 
                let cm = document.getElementById('context-menu'); 
                if (cm) { cm.style.opacity = '0'; setTimeout(()=> cm.style.display = 'none', 200); } 
            });
        }

        async triggerOTA(btn) {
            btn.innerText = 'Pinging Cloud Server...'; btn.style.background = '#444';
            let st = document.getElementById('upd-stat'); st.innerText = 'Fetching version.json...';
            try {
                let cb = "?t=" + new Date().getTime();
                let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/version.json" + cb);
                if (!r.ok) throw new Error("GitHub server unreachable.");
                let d = await r.json();
                
                if (d.version !== "27.2.0-INCEPTION") {
                    st.innerHTML = `<span style="color:#ffeb3b">New Version Found: ${d.version}</span><br><i>${d.notes}</i>`;
                    btn.innerText = 'Emulate Live Install'; btn.style.background = '#ff00cc'; 
                    btn.onclick = async () => {
                        document.getElementById('ota-overlay').style.display = 'flex';
                        let fill = document.getElementById('ota-fill'); let text = document.getElementById('ota-text'); let p = 0;
                        let simItv = setInterval(() => {
                            p += Math.random() * 8;
                            if(p >= 100) {
                                p = 100; clearInterval(simItv); text.innerText = "100% - Writing to Virtual NVRAM...";
                                setTimeout(() => { 
                                    document.getElementById('ota-title').innerText = "System Patched"; 
                                    document.getElementById('ota-restart-prompt').style.display = 'flex';
                                    this.notify("Update Complete", "System requires restart.", true);
                                }, 800);
                            }
                            fill.style.width = p + "%"; if(p < 100) text.innerText = `Downloading & Patching... ${Math.floor(p)}%`;
                        }, 250);
                    };
                } else {
                    st.innerHTML = `<span style="color:#38ef7d">System is up to date!</span>`;
                    btn.innerText = 'Latest Kernel Installed'; btn.style.background = '#38ef7d'; btn.style.color = 'black'; btn.onclick = null;
                }
            } catch (err) { st.innerHTML = `<span style="color:#ff4d4d">Error: ${err.message}</span>`; btn.innerText = 'Retry'; btn.style.background = '#0078d7'; }
        }

        initSweeper(pid) {
            let grid = document.getElementById(`ms-grid-${pid}`); if(!grid) return; grid.innerHTML = '';
            for(let i=0; i<81; i++) {
                let cell = document.createElement('div'); 
                cell.style.cssText = "width:25px; height:25px; background:rgba(255,255,255,0.8); color:black; border-radius:3px; text-align:center; font-weight:bold; cursor:pointer; line-height:25px; font-size:14px; box-shadow:inset -1px -1px 2px rgba(0,0,0,0.3);";
                cell.onclick = function() { 
                    this.style.background = 'rgba(255,255,255,0.4)'; this.style.boxShadow = 'none'; this.style.color = 'white';
                    if(Math.random() < 0.15) { this.innerText='💣'; this.style.background='#ff4d4d'; setTimeout(()=>alert('Boom!'), 50); GemiOS.initSweeper(pid); } 
                    else { this.innerText = Math.floor(Math.random()*3)||''; } 
                };
                grid.appendChild(cell);
            }
        }

        initTTT(pid) {
            this.tttStates = this.tttStates || {}; this.tttStates[pid] = { b: ['','','','','','','','',''], p: 'X', a: true };
            let st = document.getElementById(`ttt-stat-${pid}`); st.innerText = "Player X Turn"; st.style.color = "#4db8ff";
            let grid = document.getElementById(`ttt-b-${pid}`); if(!grid) return; grid.innerHTML = '';
            for(let i=0; i<9; i++) grid.innerHTML += `<button style="height:60px; font-size:28px; font-weight:bold; border:none; border-radius:4px; background:rgba(255,255,255,0.8); cursor:pointer; box-shadow:inset -1px -1px 3px rgba(0,0,0,0.3);" onclick="GemiOS.playTTT(${pid}, ${i}, this)"></button>`;
        }

        playTTT(pid, i, btn) {
            let s = this.tttStates[pid]; if(!s.a || s.b[i] !== '') return;
            s.b[i] = s.p; btn.innerText = s.p; btn.style.color = s.p==='X'?'var(--accent)':'#ff4d4d'; btn.style.background = 'rgba(255,255,255,0.9)'; btn.style.boxShadow = 'none';
            const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            let won = lines.some(l => s.b[l[0]] && s.b[l[0]]===s.b[l[1]] && s.b[l[0]]===s.b[l[2]]);
            let stat = document.getElementById(`ttt-stat-${pid}`);
            if(won) { stat.innerText = `${s.p} Wins!`; stat.style.color = "#38ef7d"; s.a = false; }
            else if(!s.b.includes('')) { stat.innerText = "Draw!"; stat.style.color = "white"; s.a = false; }
            else { s.p = s.p === 'X' ? 'O' : 'X'; stat.innerText = `Player ${s.p} Turn`; stat.style.color = s.p==='X'?'var(--accent)':'#ff4d4d';}
        }

        playNote(freq) {
            if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)();
            let osc = this.actx.createOscillator(); let gain = this.actx.createGain();
            osc.type = 'sine'; osc.frequency.value = freq;
            osc.connect(gain); gain.connect(this.actx.destination);
            osc.start(); gain.gain.exponentialRampToValueAtTime(0.00001, this.actx.currentTime + 1); osc.stop(this.actx.currentTime + 1);
        }

        applyTheme() { 
            let isL = localStorage.getItem('GemiOS_Theme') === 'light'; 
            if(isL) document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); 
            let accent = localStorage.getItem('GemiOS_Accent');
            if(accent) { document.documentElement.style.setProperty('--accent', accent); } 
            else { document.documentElement.style.setProperty('--accent', '#0078d7'); }
        }
        
        toggleTheme() { 
            let isL = localStorage.getItem('GemiOS_Theme') === 'light'; 
            localStorage.setItem('GemiOS_Theme', !isL ? 'light' : 'dark'); 
            this.applyTheme(); 
        }
        
        loadWallpaper() { 
            let wp = localStorage.getItem('GemiOS_Wall'); 
            let bg = document.getElementById('desktop-bg');
            if(wp && bg) { bg.style.background = `url(${wp}) center/cover`; }
        }
        
        startClock() { setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }, 1000); }

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
                
                .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; }
                
                .win { position:absolute; background:rgba(20, 30, 40, 0.7); backdrop-filter: blur(30px) saturate(200%); -webkit-backdrop-filter: blur(30px) saturate(200%); color:white; border-radius:12px; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); display: flex; flex-direction: column; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s; pointer-events:auto; resize:both; overflow:hidden;}
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
                .btn-sec { width:100%; padding:12px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:8px; margin-bottom:10px; cursor:pointer; transition:0.2s;}
                .btn-sec:hover { background:rgba(255,255,255,0.2); }
                .btn-danger { width:100%; padding:12px; background:rgba(255,77,77,0.8); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; }
                
                #widget-notes { position:absolute; top:30px; right:30px; width:220px; height:220px; background:linear-gradient(135deg, #fff9c4, #fbc02d); color:#333; box-shadow:5px 10px 20px rgba(0,0,0,0.4); padding:15px; z-index:5; font-family:'Segoe Print', 'Comic Sans MS', cursive; transform: rotate(2deg); transition: transform 0.2s, box-shadow 0.2s; cursor:grab; pointer-events:auto; border-radius:2px 2px 15px 2px;}
                #widget-notes:active { cursor:grabbing; transform: rotate(0deg) scale(1.05); z-index:9999; box-shadow:10px 20px 30px rgba(0,0,0,0.5);}
                #widget-notes textarea { width:100%; height:100%; background:transparent; border:none; outline:none; font-family:inherit; font-size:14px; resize:none; color:#333;}
                
                #context-menu { position:absolute; background:rgba(20, 30, 40, 0.85); backdrop-filter:blur(25px) saturate(200%); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:6px; box-shadow:0 15px 35px rgba(0,0,0,0.6); z-index:999999; display:none; min-width:180px; pointer-events:auto; transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: top left;}
                body.light-mode #context-menu { background:rgba(255,255,255,0.9); color:black; border:1px solid rgba(0,0,0,0.1); }
                .cm-item { padding:10px 15px; cursor:pointer; font-size:13px; font-weight:500; border-radius:6px; display:flex; align-items:center; gap:10px; transition:0.2s; }
                .cm-item:hover { background:var(--accent); color:white; padding-left:20px;}
                
                .gemi-notif { background: rgba(20, 30, 40, 0.85); backdrop-filter: blur(25px) saturate(200%); border: 1px solid var(--accent); border-radius: 12px; padding: 15px 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 15px; transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease; opacity: 0; color: white; width: 320px; pointer-events:auto; }
                body.light-mode .gemi-notif { background: rgba(255,255,255,0.95); border: 1px solid var(--accent); color: black; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
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
                                <div style="font-size:12px; opacity:0.7; font-family:monospace;">GemiOS 27.2 / <span style="color:var(--accent); font-weight:bold;">Inception</span></div>
                            </div>
                        </div>
                        <div style="overflow-y:auto; padding-bottom:15px; padding-top:10px;">
                            <div class="start-cat">System & Core</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_store')"><span style="font-size:20px;">🛍️</span> GemiStore (App Center)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_task')"><span style="font-size:20px;">📊</span> System Monitor</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_drive')"><span style="font-size:20px;">🗂️</span> Explorer 2.0</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_update')"><span style="font-size:20px;">☁️</span> Cloud Updater</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_set')"><span style="font-size:20px;">⚙️</span> Settings (Theming)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_log')"><span style="font-size:20px;">📋</span> Master Chronicles</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_time')"><span style="font-size:20px;">⏳</span> Time Machine</div>
                            
                            <div class="start-cat">Development & Utilities</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_chat')" style="border:1px solid var(--accent); background:rgba(255,255,255,0.05);"><span style="font-size:20px;">💬</span> GemiChat (LAN)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_word')"><span style="font-size:20px;">📄</span> GemiWord</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_voice')"><span style="font-size:20px;">🗣️</span> GemiVoice 2.0</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_cam')"><span style="font-size:20px;">📸</span> GemiCam</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_view')"><span style="font-size:20px;">🖼️</span> Photo Gallery</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_code')"><span style="font-size:20px;">&lt;/&gt;</span> GemiCode IDE</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_browser')"><span style="font-size:20px;">🌐</span> Web Browser</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_term')"><span style="font-size:20px;">⌨️</span> Bash Terminal</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_calc')"><span style="font-size:20px;">🧮</span> Calculator Pro</div>

                            <div class="start-cat">Entertainment</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_craft')"><span style="font-size:20px;">⛏️</span> GemiCraft (Persistent)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_amp')"><span style="font-size:20px;">🎵</span> GemiAmp Media Player</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_pong')"><span style="font-size:20px;">🏓</span> Pong 3.0</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_synth')"><span style="font-size:20px;">🎹</span> GemiSynth</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_paint')"><span style="font-size:20px;">🎨</span> Paint</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_snake')"><span style="font-size:20px;">🐍</span> Snake</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_sweeper')"><span style="font-size:20px;">💣</span> Sweeper</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_ttt')"><span style="font-size:20px;">❌</span> Tic-Tac-Toe</div>
                        </div>
                    </div>

                    <div id="taskbar-container">
                        <div id="taskbar">
                            <div class="start" onclick="document.getElementById('start-menu').classList.toggle('open');">G</div>
                            <div id="taskbar-apps"></div>
                            <div style="display:flex; align-items:center; gap:15px; margin-left:10px; padding-left:15px; border-left:1px solid rgba(255,255,255,0.1);">
                                <div onclick="GemiOS.toggleTheme()" style="cursor:pointer; font-size:20px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Toggle Theme">🌓</div>
                                <div id="clock" style="font-weight:600; font-size:14px; letter-spacing:1px;">12:00</div>
                                <div onclick="GemiOS.lockSystem()" style="cursor:pointer; font-size:18px; color:#ff4d4d; background:rgba(255,77,77,0.1); padding:5px; border-radius:50%; transition:0.2s;" onmouseover="this.style.background='rgba(255,77,77,0.3)'" onmouseout="this.style.background='rgba(255,77,77,0.1)'" title="Power Off">⏻</div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="context-menu">
                        <div class="cm-item" onclick="location.reload()">🔄 Refresh UI</div>
                        <div class="cm-item" onclick="GemiOS.PM.launch('sys_set')">🎨 Change Theme</div>
                        <div class="cm-item" onclick="GemiOS.PM.launch('sys_term')">⌨️ Open Terminal</div>
                        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:5px 0;">
                        <div class="cm-item" onclick="GemiOS.lockSystem();" style="color:#ff4d4d;">⏻ Shut Down</div>
                    </div>
                    
                    <div id="notif-container" style="position:absolute; top:20px; right:20px; z-index:999999; display:flex; flex-direction:column; gap:10px; pointer-events:none;"></div>
                    
                    <div id="ota-overlay" style="display:none; position:absolute; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); backdrop-filter:blur(15px); z-index:9999999; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:'Segoe UI', sans-serif;">
                        <div style="font-size:60px; margin-bottom:20px; filter:drop-shadow(0 0 20px #38ef7d);">☁️</div>
                        <h2 id="ota-title" style="margin:0 0 20px 0;">Installing Live Update...</h2>
                        <div style="width:400px; height:25px; background:#222; border-radius:15px; overflow:hidden; border:2px solid #555;">
                            <div id="ota-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #38ef7d, #0078d7); transition:width 0.3s ease;"></div>
                        </div>
                        <p id="ota-text" style="margin-top:15px; font-family:monospace; color:#38ef7d; font-size:16px; font-weight:bold;">0%</p>
                        <div id="ota-restart-prompt" style="display:none; flex-direction:column; align-items:center; margin-top:20px;">
                            <p style="color:#ffeb3b; font-weight:bold; margin-bottom:15px;">UPDATE COMPLETE. A restart is required to lock data to NVRAM.</p>
                            <button onclick="location.reload()" style="padding:12px 25px; background:#ff4d4d; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:16px; box-shadow:0 5px 15px rgba(255,77,77,0.4); pointer-events:auto;">Restart Now</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.innerHTML = ''; 
            document.body.insertAdjacentHTML('afterbegin', html);
            
            let sSticky = localStorage.getItem('GemiOS_Sticky');
            if(sSticky) document.getElementById('sticky-text').value = sSticky;
        }
    }

    window.GemiOS = new CoreOS();
    window.GemiOS.init();
}
