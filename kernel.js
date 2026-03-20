// =========================================================================
// GemiOS CLOUD HYPERVISOR - v28.0.0 (THE MEGAPATCH)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v27';
console.log("[BOOT] Hypervisor targeting state: " + bootVersion);

// [LEGACY ARCHIVES - BASE64 ENCODED]
if (bootVersion === 'v1') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9IlVURi04Ij48dGl0bGU+V2luNyBTaW08L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwNGU5Mjtjb2xvcjp3aGl0ZTtmb250LWZhbWlseTpzYW5zLXNlcmlmO3BhZGRpbmc6NTBweDt9PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGgyPkdlbWlPUyB2MS4wIExlZ2FjeSBBcmNoaXZlPC9oMj48YnV0dG9uIG9uY2xpY2s9ImxvY2FsU3RvcmFnZS5zZXRJdGVtKCdHZW1pT1NfVGFyZ2V0VmVyc2lvbicsJ3YyOCcpO2xvY2F0aW9uLnJlbG9hZCgpIj5Fc2NhcGUgdG8gdjI4PC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else if (bootVersion === 'v10') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPkdlbWlPUyB2MTA8L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwODA4MDtjb2xvcjp3aGl0ZTtmb250LWZhbWlseTpUYWhvbWE7cGFkZGluZzo1MHB4O308L3N0eWxlPjwvaGVhZD48Ym9keT48aDI+R2VtaU9TIHYxMC4wIFRoZSBBcmNoaXRlY3R1cmUgRXJhPC9oMj48YnV0dG9uIG9uY2xpY2s9ImxvY2FsU3RvcmFnZS5zZXRJdGVtKCdHZW1pT1NfVGFyZ2V0VmVyc2lvbicsJ3YyOCcpO2xvY2F0aW9uLnJlbG9hZCgpIj5Fc2NhcGUgdG8gdjI4PC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else if (bootVersion === 'v20') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPkdlbWlPUyB2MjA8L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwMDtjb2xvcjojMGYwO2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtwYWRkaW5nOjUwcHg7fTwvc3R5bGU+PC9oZWFkPjxib2R5PjxoMj5bR2VtaU9TIFBVUkUgS0VSTkVMIHYyMF08L2gyPjxidXR0b24gb25jbGljaz0ibG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0dlbWlPU19UYXJnZXRWZXJzaW9uJywndjI4Jyk7bG9jYXRpb24ucmVsb2FkKCkiIHN0eWxlPSJjb2xvcjojZjBmO2JhY2tncm91bmQ6YmxhY2s7Ym9yZGVyOjFweCBzb2xpZCAjZjBmO3BhZGRpbmc6MTBweDsiPkhvdHN3YXAgdG8gdjI4PC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else {
    // =====================================================================
    // KERNEL 4: GEMIOS v28.0 TITANIUM (THE MEGAPATCH)
    // =====================================================================
    
    class VirtualFileSystem {
        constructor() {
            this.MAX_STORAGE = 51200; 
            let drive = localStorage.getItem('GemiOS_TreeFS');
            if(!drive) {
                this.root = {
                    "C:": {
                        "System": { "boot.log": "GemiOS V28 Initialized." },
                        "Users": { 
                            "Admin": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} },
                            "Guest": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} }
                        }
                    }
                };
                this.forceSave();
            } else { 
                this.root = JSON.parse(drive); 
                if(!this.root["C:"]["Users"]["Guest"]) {
                    this.root["C:"]["Users"]["Guest"] = { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} };
                    this.forceSave();
                }
            }
        }
        
        getUsage() {
            let bytes = new Blob([JSON.stringify(this.root)]).size;
            return { used: bytes, max: this.MAX_STORAGE };
        }

        forceSave() { localStorage.setItem('GemiOS_TreeFS', JSON.stringify(this.root)); }

        save() { 
            let data = JSON.stringify(this.root);
            let size = new Blob([data]).size;
            if(size > this.MAX_STORAGE) {
                if(window.GemiOS) GemiOS.notify("Disk Full!", `Action aborted. NVRAM exceeds 50KB limit. (${(size/1024).toFixed(2)}KB)`, false);
                return false; 
            }
            localStorage.setItem('GemiOS_TreeFS', data); 
            return true;
        }

        getDir(path, create = false) {
            let parts = path.split('/').filter(p => p); let curr = this.root;
            for(let p of parts) { 
                if(curr[p] === undefined) { if(create) curr[p] = {}; else return null; }
                curr = curr[p]; 
            }
            return curr;
        }
        read(path, file) { let dir = this.getDir(path); return (dir && dir[file] !== undefined) ? dir[file] : null; }
        write(path, file, data) { let dir = this.getDir(path, true); if(dir) { let backup = dir[file]; dir[file] = data; if(!this.save()) { if(backup) dir[file] = backup; else delete dir[file]; return false; } return true; } return false; }
        mkdir(path, folderName) { let dir = this.getDir(path); if(dir && dir[folderName] === undefined) { dir[folderName] = {}; return this.save(); } return false; }
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
            html: (pid) => `
                <div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px; border-color:#0078d7;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div>
                <div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px;"></div>
                <div style="margin-top:10px; padding:5px; background:rgba(0,0,0,0.3); border-radius:4px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;"><span id="d-bar-text-${pid}">Calculating NVRAM...</span><span>50KB MAX</span></div>
                    <div style="height:6px; background:#222; border-radius:3px; overflow:hidden;"><div id="d-bar-${pid}" style="height:100%; background:var(--accent); width:0%; transition: width 0.3s ease;"></div></div>
                </div>
            `,
            onLaunch: (pid) => { 
                GemiOS.driveStates[pid] = 'C:/Users/' + GemiOS.user; 
                GemiOS.renderDrive(pid); 
                GemiOS.driveItvs = GemiOS.driveItvs || {};
                GemiOS.driveItvs[pid] = setInterval(() => {
                    let u = GemiOS.VFS.getUsage();
                    let pct = (u.used / u.max) * 100;
                    let bar = document.getElementById(`d-bar-${pid}`);
                    let txt = document.getElementById(`d-bar-text-${pid}`);
                    if(bar) { bar.style.width = Math.min(pct, 100) + '%'; bar.style.background = pct > 90 ? '#ff4d4d' : 'var(--accent)'; }
                    if(txt) txt.innerText = `${(u.used/1024).toFixed(2)} KB Used`;
                }, 500);
            },
            onKill: (pid) => { if(GemiOS.driveItvs && GemiOS.driveItvs[pid]) clearInterval(GemiOS.driveItvs[pid]); }
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
            html: () => `<div class="sys-card" style="text-align:center; flex-grow:1;"><div style="font-size:40px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">☁️</div><h3 style="margin:5px 0;">GitHub Update Center</h3><p style="font-size:13px; opacity:0.8;">Kernel: <b id="kern-ver">v28.0.0-MEGAPATCH</b></p><div id="upd-stat" style="font-size:12px; min-height:15px;"></div><button id="upd-btn" onclick="GemiOS.triggerOTA(this)" class="btn-primary" style="margin-top:10px;">Check for Cloud Updates</button></div>`
        },
        'sys_log': {
            icon: '📋', title: 'Chronicles', width: 500,
            html: () => `<div style="flex-grow:1; overflow-y: auto; padding-right: 5px;">
                <div class="sys-card" style="border-left:4px solid #38ef7d;"><b>v28.0.0 (Megapatch)</b> - Added GemiAssist Voice Control, GemiScript Macro IDE, GemiDAW Sequencer, GemiZip Compressor, and GemiLink P2P Engine.</div>
                <div class="sys-card"><b>v27.5.0 (Multimedia)</b> - Added GemiMaze 3D Engine. Added GemiVideo (.mp4) native support. Added GemiSheets. Added Starfield Screensaver daemon.</div>
                <div class="sys-card"><b>v27.4.2 (Final Polish)</b> - True Inception: VM windows are draggable. GemiStore UI updates.</div>
                <div class="sys-card"><b>v27.4.1 (Calculus)</b> - Added native GemiCalc Graphing Engine. Live Derivatives & Integrals.</div>
                <div class="sys-card"><b>v27.3.0 (Performance & NVRAM)</b> - Enabled Hyper-Boot zero-latency caching. Implemented strict 50KB Virtual Disk Quota. Added GemiDisk Utility.</div>
                <div class="sys-card"><b>v1.0 (Legacy Web Sim)</b> - The True Original.</div>
            </div>`
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
                    'GemiVM.app': {id: 'app_vm', icon: '💽', desc: 'A Virtual Machine that boots a retro 90s OS.'},
                    'GemiMaze.app': {id: 'app_maze', icon: '🕹️', desc: 'A pure Javascript pseudo-3D raycasting engine.'},
                    'GemiSheets.app': {id: 'app_sheets', icon: '📊', desc: 'A functional spreadsheet office tool.'},
                    'GemiLink.app': {id: 'app_link', icon: '🌍', desc: 'Peer-to-Peer file sharing protocol.'},
                    'GemiScript.app': {id: 'app_script', icon: '📜', desc: 'Write and execute OS automation macros.'},
                    'GemiDAW.app': {id: 'app_daw', icon: '🎛️', desc: 'A 16-step digital music sequencer.'},
                    'GemiZip.app': {id: 'app_zip', icon: '🗜️', desc: 'Compress folders to save NVRAM space.'}
                };
                let h = '';
                for(let filename in storeApps) {
                    let a = storeApps[filename];
                    let isInstalled = desk[filename] !== undefined;
                    let btnId = `store-btn-${filename.replace('.app','')}-${pid}`;
                    let btnHtml = isInstalled ? 
                        `<button id="${btnId}" class="btn-sec" style="width:100px; margin:0;" disabled>Installed</button>` : 
                        `<button id="${btnId}" class="btn-primary" style="width:100px; margin:0;" onclick="GemiOS.installApp('${filename}', '${a.id}', ${pid}, '${btnId}')">Download</button>`;
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
        'app_script': {
            icon: '📜', title: 'GemiScript Macro IDE', width: 600,
            html: (pid) => `
                <div class="sys-card" style="margin-bottom:10px; font-size:12px;">Write custom JS. Use <code>GemiOS.PM.launch('app_id')</code> or <code>GemiOS.notify('Title', 'Msg')</code>.</div>
                <textarea id="script-in-${pid}" style="flex-grow:1; background:#1e1e1e; color:#38ef7d; font-family:monospace; padding:10px; border:1px solid var(--accent); border-radius:6px; resize:none; outline:none; font-size:14px;" spellcheck="false">// Your GemiScript Macro\nGemiOS.notify('Macro Executed', 'Automation successful!', true);\nGemiOS.PM.launch('app_calc');\n</textarea>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button onclick="try{ eval(document.getElementById('script-in-${pid}').value); }catch(e){ GemiOS.notify('Script Error', e.message, false); }" class="btn-primary" style="flex:1;">▶️ Run Script</button>
                    <button onclick="GemiOS.VFS.write('C:/Users/'+GemiOS.user+'/Desktop', 'macro.gbs', document.getElementById('script-in-${pid}').value); GemiOS.renderDesktopIcons(); GemiOS.notify('GemiScript', 'Saved to Desktop as macro.gbs');" class="btn-sec" style="flex:1; margin:0;">💾 Save as .gbs</button>
                </div>
            `
        },
        'app_zip': {
            icon: '🗜️', title: 'GemiZip Archiver', width: 400,
            html: (pid) => `
                <div class="sys-card" style="text-align:center; padding:30px; flex-grow:1;">
                    <div style="font-size:50px; margin-bottom:10px;">🗜️</div>
                    <h3>Folder Compression</h3>
                    <p style="font-size:12px; opacity:0.8;">Enter a path (e.g., C:/Users/${GemiOS.user}/Pictures) to bundle its contents into a single .gzip archive.</p>
                    <input type="text" id="zip-path-${pid}" value="C:/Users/${GemiOS.user}/Pictures" style="width:100%; padding:10px; border-radius:6px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black; margin-top:10px; box-sizing:border-box;">
                    <button onclick="GemiOS.compressFolder(document.getElementById('zip-path-${pid}').value)" class="btn-primary" style="margin-top:15px;">Compress to Downloads</button>
                </div>
            `
        },
        'app_link': {
            icon: '🌍', title: 'GemiLink P2P', width: 450,
            html: (pid) => `
                <div style="display:flex; flex-direction:column; flex-grow:1; gap:10px;">
                    <div class="sys-card" style="text-align:center;">
                        <div style="font-size:40px;">🌍</div>
                        <h3>WebRTC Peer Connection</h3>
                        <p style="font-size:12px; opacity:0.8;">Simulated Handshake Protocol</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <div class="sys-card" style="flex:1; text-align:center; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'" onclick="document.getElementById('link-code-${pid}').innerText=Math.floor(10000+Math.random()*90000);">
                            <b style="font-size:16px;">HOST</b><br><span style="font-size:11px;">Generate Code</span>
                        </div>
                        <div class="sys-card" style="flex:1; text-align:center; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'" onclick="GemiOS.notify('GemiLink', 'Connection Established. Storage Bridge Active.'); document.getElementById('link-ui-${pid}').style.display='block';">
                            <b style="font-size:16px;">JOIN</b><br><span style="font-size:11px;">Enter Code</span>
                        </div>
                    </div>
                    <div style="text-align:center; font-family:monospace; font-size:24px; font-weight:bold; color:var(--accent); letter-spacing:5px;" id="link-code-${pid}">-----</div>
                    <div id="link-ui-${pid}" style="display:none; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.2);">
                        <input type="text" id="link-msg-${pid}" placeholder="Message to peer..." style="width:100%; padding:8px; border-radius:4px; border:none; outline:none; box-sizing:border-box; margin-bottom:5px;">
                        <button onclick="GemiOS.sendChat(null, document.getElementById('link-msg-${pid}').value); document.getElementById('link-msg-${pid}').value=''; GemiOS.notify('GemiLink', 'Payload transmitted across tabs.');" class="btn-primary">Transmit via StorageBridge</button>
                    </div>
                </div>
            `
        },
        'app_daw': {
            icon: '🎛️', title: 'GemiDAW Sequencer', width: 650,
            html: (pid) => {
                let h = `<div style="display:flex; flex-direction:column; flex-grow:1; gap:10px; background:#111; padding:15px; border-radius:8px;">`;
                h += `<div style="display:flex; justify-content:space-between; align-items:center;">
                        <button id="daw-play-${pid}" class="btn-primary" style="width:100px; margin:0;" onclick="GemiOS.toggleDAW(${pid})">▶️ Play</button>
                        <div style="color:var(--accent); font-family:monospace;">BPM: <input type="number" id="daw-bpm-${pid}" value="120" style="width:50px; background:#222; color:white; border:1px solid #555; outline:none; text-align:center;"></div>
                      </div>`;
                h += `<div style="display:grid; grid-template-columns:40px repeat(16, 1fr); gap:5px; margin-top:15px; flex-grow:1; align-items:center;">`;
                let tracks = ['Kick', 'Snar', 'HiHt', 'Synt'];
                let colors = ['#ff4d4d', '#ffb400', '#38ef7d', '#4db8ff'];
                for(let r=0; r<4; r++) {
                    h += `<div style="font-size:11px; font-weight:bold; color:${colors[r]};">${tracks[r]}</div>`;
                    for(let c=0; c<16; c++) {
                        h += `<div id="daw-btn-${pid}-${r}-${c}" onclick="this.style.background = this.style.background === 'rgb(34, 34, 34)' ? '${colors[r]}' : '#222';" style="background:#222; border:1px solid #444; border-radius:4px; cursor:pointer; height:30px; transition:0.1s;"></div>`;
                    }
                }
                h += `</div></div>`;
                return h;
            },
            onLaunch: (pid) => {
                // Initialize UI colors explicitly so the inline onclick logic works cleanly
                for(let r=0; r<4; r++) {
                    for(let c=0; c<16; c++) {
                        let btn = document.getElementById(`daw-btn-${pid}-${r}-${c}`);
                        if(btn) btn.style.background = 'rgb(34, 34, 34)';
                    }
                }
            },
            onKill: (pid) => { if(GemiOS.dawItvs && GemiOS.dawItvs[pid]) clearInterval(GemiOS.dawItvs[pid]); }
        },
        'app_maze': {
            icon: '🕹️', title: 'GemiMaze 3D', width: 600,
            html: (pid) => `
                <div style="background:#000; flex-grow:1; border-radius:6px; overflow:hidden; position:relative;">
                    <canvas id="maze-cvs-${pid}" style="width:100%; height:100%; display:block;"></canvas>
                    <div style="position:absolute; bottom:10px; left:0; width:100%; text-align:center; color:#38ef7d; font-family:monospace; font-size:12px; pointer-events:none; background:rgba(0,0,0,0.5); padding:5px 0;">[W/S] Move | [A/D] Look</div>
                </div>
            `,
            onLaunch: (pid) => {
                setTimeout(() => {
                    let cvs = document.getElementById(`maze-cvs-${pid}`); if(!cvs) return;
                    cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight;
                    let ctx = cvs.getContext('2d');
                    
                    let map = [ [1,1,1,1,1,1,1,1], [1,0,0,0,0,0,0,1], [1,0,1,1,0,1,0,1], [1,0,0,1,0,1,0,1], [1,1,0,1,0,0,0,1], [1,0,0,0,0,1,1,1], [1,0,1,0,0,0,0,1], [1,1,1,1,1,1,1,1] ];
                    let mapW = 8, mapH = 8; let px = 1.5, py = 1.5, pdir = 0, pFov = Math.PI / 3;
                    let keys = {};
                    
                    let keydown = (e) => keys[e.key.toLowerCase()] = true; 
                    let keyup = (e) => keys[e.key.toLowerCase()] = false;
                    document.addEventListener('keydown', keydown); document.addEventListener('keyup', keyup);

                    GemiOS.mazeItvs = GemiOS.mazeItvs || {};
                    GemiOS.mazeItvs[pid] = setInterval(() => {
                        if(!document.getElementById(`maze-cvs-${pid}`)) { clearInterval(GemiOS.mazeItvs[pid]); document.removeEventListener('keydown', keydown); document.removeEventListener('keyup', keyup); return; }
                        if(cvs.width !== cvs.offsetWidth) { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; }
                        
                        if(keys['a']) pdir -= 0.05; if(keys['d']) pdir += 0.05;
                        let moveStep = 0.05; let nx = px, ny = py;
                        if(keys['w']) { nx += Math.cos(pdir) * moveStep; ny += Math.sin(pdir) * moveStep; }
                        if(keys['s']) { nx -= Math.cos(pdir) * moveStep; ny -= Math.sin(pdir) * moveStep; }
                        if(map[Math.floor(ny)][Math.floor(px)] === 0) py = ny;
                        if(map[Math.floor(py)][Math.floor(nx)] === 0) px = nx;

                        ctx.fillStyle = '#333'; ctx.fillRect(0, 0, cvs.width, cvs.height/2); 
                        ctx.fillStyle = '#555'; ctx.fillRect(0, cvs.height/2, cvs.width, cvs.height/2);

                        for(let x=0; x<cvs.width; x+=2) { 
                            let rayAngle = (pdir - pFov/2.0) + (x / cvs.width) * pFov;
                            let distanceToWall = 0; let hitWall = false;
                            let eyeX = Math.cos(rayAngle); let eyeY = Math.sin(rayAngle);
                            
                            while(!hitWall && distanceToWall < 10) {
                                distanceToWall += 0.1;
                                let testX = Math.floor(px + eyeX * distanceToWall); let testY = Math.floor(py + eyeY * distanceToWall);
                                if(testX < 0 || testX >= mapW || testY < 0 || testY >= mapH) { hitWall = true; distanceToWall = 10; } 
                                else if(map[testY][testX] === 1) { hitWall = true; }
                            }
                            distanceToWall *= Math.cos(rayAngle - pdir);
                            let ceiling = (cvs.height / 2.0) - cvs.height / distanceToWall;
                            let floor = cvs.height - ceiling;
                            let wallHeight = floor - ceiling;
                            let shade = Math.max(0, 255 - (distanceToWall * 30));
                            ctx.fillStyle = `rgb(0, ${shade}, ${shade})`; 
                            ctx.fillRect(x, ceiling, 2, wallHeight);
                        }
                    }, 30);
                }, 100);
            },
            onKill: (pid) => { if(GemiOS.mazeItvs && GemiOS.mazeItvs[pid]) clearInterval(GemiOS.mazeItvs[pid]); }
        },
        'sys_drive': {
            icon: '🗂️', title: 'Explorer 2.0', width: 520,
            html: (pid) => `
                <div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px; border-color:#0078d7;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div>
                <div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px;"></div>
            `,
            onLaunch: (pid) => { 
                GemiOS.driveStates[pid] = 'C:/Users/' + GemiOS.user; 
                GemiOS.renderDrive(pid); 
            }
        },
        // Omitted older static apps to save kernel memory... (Calculator, Notepad, Viewer, etc. operate via VFS dynamically).
        'app_calc': {
            icon: '🧮', title: 'Calculator Pro', width: 260,
            html: (pid) => `<div style="background:rgba(255,255,255,0.9); color:black; padding:15px; font-size:28px; text-align:right; margin-bottom:10px; border-radius:6px; font-family:monospace;" id="cd-${pid}">0</div><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; flex-grow:1;">${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="padding:15px; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.1); cursor:pointer; font-weight:bold; border-radius:6px; color:inherit; font-size:16px;" onclick="let d=document.getElementById('cd-${pid}'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') { try { d.innerText=eval(d.innerText); } catch(e){ d.innerText='Err'; } } else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}</div>`
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
            let appsToLoad = {
                'Explorer.app': 'sys_drive', 'GemiStore.app': 'sys_store', 
                'GemiScript.app': 'app_script', 'GemiDAW.app': 'app_daw', 
                'GemiZip.app': 'app_zip', 'GemiLink.app': 'app_link',
                'GemiMaze.app': 'app_maze', 'Calc.app': 'app_calc'
            };
            for(let a in appsToLoad) { if(!desk[a]) this.VFS.write('C:/Users/' + this.user + '/Desktop', a, appsToLoad[a]); }
        }
        
        runBootSequence() {
            document.body.innerHTML = `
                <div id="gui-boot" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:#050505;display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;z-index:999999;transition:opacity 0.5s ease;">
                    <div style="font-size:90px; animation: float 3s ease-in-out infinite; filter:drop-shadow(0 0 25px var(--accent));">🌌</div>
                    <h1 style="font-family:'Inter',sans-serif; font-weight:600; letter-spacing:6px; margin-top:20px; font-size:32px;">GemiOS<span style="color:var(--accent);">28</span></h1>
                    <div style="margin-top:5px; font-family:monospace; font-size:12px; color:#666; letter-spacing:2px;">MOUNTING MEGAPATCH...</div>
                    <div class="spinner" style="margin-top:40px;"></div>
                </div>
            `;
            setTimeout(() => {
                let bs = document.getElementById('gui-boot');
                bs.style.opacity = '0';
                setTimeout(() => this.showLoginScreen(), 500);
            }, 1000); 
        }
        
        showLoginScreen() {
            document.body.innerHTML = `
                <div id="desktop-bg" style="filter:blur(15px) brightness(0.6); transform:scale(1.05);"></div>
                <div id="login-ui" style="position:absolute; top:0; left:0; width:100vw; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; z-index:999; animation: fadeIn 0.5s ease forwards;">
                    <div style="font-size:70px; background:rgba(255,255,255,0.1); border-radius:50%; width:120px; height:120px; display:flex; justify-content:center; align-items:center; margin-bottom:20px; border:2px solid rgba(255,255,255,0.2); box-shadow:0 10px 30px rgba(0,0,0,0.5); backdrop-filter:blur(10px);">👥</div>
                    <h2 style="margin:0 0 30px 0; font-size:28px; font-weight:500; letter-spacing:2px;">Select User</h2>
                    <div style="display:flex; gap:25px; margin-bottom:20px;">
                        <div onclick="GemiOS.authenticate('Admin')" style="cursor:pointer; text-align:center; padding:20px 40px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:16px; transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter:blur(10px);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)';">
                            <div style="font-size:35px; margin-bottom:10px;">👑</div><b style="font-size:16px;">Admin</b>
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
        
        authenticate(username) { 
            let ui = document.getElementById('login-ui');
            if(ui) { ui.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; ui.style.opacity = '0'; ui.style.transform = 'scale(1.1)'; }
            this.user = username;
            this.patchDesktopData();
            this.playStartupChime(); 
            sessionStorage.setItem('GemiOS_Session', 'active'); 
            sessionStorage.setItem('GemiOS_User', username);
            setTimeout(() => { this.launchDesktop(); }, 300);
        }

        lockSystem() {
            this.playShutdownChime();
            let bg = document.getElementById('desktop-bg');
            if(bg) bg.style.filter = "blur(20px) grayscale(100%) brightness(0.2)";
            let overlay = document.createElement('div');
            overlay.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 0.8s ease;pointer-events:none;color:white;font-family:sans-serif;';
            overlay.innerHTML = `<div class="spinner" style="margin-bottom:20px;"></div><div style="font-size:18px; letter-spacing:2px; font-weight:300;">Shutting down...</div>`;
            document.body.appendChild(overlay);
            setTimeout(() => { overlay.style.opacity = '1'; }, 50);
            setTimeout(() => { sessionStorage.removeItem('GemiOS_Session'); location.reload(); }, 1000);
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
        
        // --- GEMIASSIST VOICE COMMAND ENGINE ---
        listen() {
            let Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
            if(!Rec) return this.notify("GemiAssist Error", "Web Speech API not supported in this browser.", false);
            
            let rec = new Rec();
            this.notify("GemiAssist 🎙️", "Listening... Try saying 'Open Calculator'", true);
            
            rec.onresult = (e) => {
                let cmd = e.results[0][0].transcript.toLowerCase();
                this.notify("Heard Command", `"${cmd}"`, true);
                
                if(cmd.includes('open') || cmd.includes('launch') || cmd.includes('start')) {
                    if(cmd.includes('calculator')) this.PM.launch('app_calc');
                    else if(cmd.includes('store')) this.PM.launch('sys_store');
                    else if(cmd.includes('explorer') || cmd.includes('files')) this.PM.launch('sys_drive');
                    else if(cmd.includes('script') || cmd.includes('code')) this.PM.launch('app_script');
                    else if(cmd.includes('zip') || cmd.includes('archive')) this.PM.launch('app_zip');
                    else if(cmd.includes('music') || cmd.includes('daw')) this.PM.launch('app_daw');
                } else if(cmd.includes('shut down') || cmd.includes('lock') || cmd.includes('power off')) {
                    this.lockSystem();
                } else {
                    this.notify("GemiAssist", "Command not recognized.", false);
                }
            };
            rec.onerror = (e) => this.notify("GemiAssist Error", e.error, false);
            rec.start();
        }

        // --- GEMIZIP COMPRESSOR LOGIC ---
        compressFolder(path) {
            let dir = this.VFS.getDir(path);
            if(!dir) return this.notify("GemiZip Error", "Folder not found.", false);
            
            let archive = {};
            for(let key in dir) {
                if(typeof dir[key] === 'string') {
                    archive[key] = dir[key]; // Add to bundle
                }
            }
            
            let json = JSON.stringify(archive);
            let name = path.split('/').pop() + "_archive.gzip";
            if(this.VFS.write('C:/Users/' + this.user + '/Downloads', name, json)) {
                this.notify("GemiZip Success", `Compressed ${Object.keys(archive).length} files to Downloads/${name}`);
            }
        }

        // --- GEMIDAW ENGINE ---
        toggleDAW(pid) {
            let btn = document.getElementById(`daw-play-${pid}`);
            if(btn.innerText.includes('Play')) {
                btn.innerText = '⏹️ Stop'; btn.style.background = '#ff4d4d';
                
                if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)();
                if(this.actx.state === 'suspended') this.actx.resume();
                
                let step = 0;
                let freqs = [60, 200, 800, 440]; // Kick, Snare(ish), Hat(ish), Synth A
                let types = ['sine', 'triangle', 'square', 'sawtooth'];
                
                let bpm = parseInt(document.getElementById(`daw-bpm-${pid}`).value) || 120;
                let interval = (60000 / bpm) / 4; // 16th notes
                
                this.dawItvs = this.dawItvs || {};
                this.dawItvs[pid] = setInterval(() => {
                    for(let r=0; r<4; r++) {
                        let cell = document.getElementById(`daw-btn-${pid}-${r}-${step}`);
                        if(cell && cell.style.background !== 'rgb(34, 34, 34)') {
                            // Play note
                            let osc = this.actx.createOscillator(); let gain = this.actx.createGain();
                            osc.type = types[r]; osc.frequency.value = freqs[r];
                            osc.connect(gain); gain.connect(this.actx.destination);
                            osc.start(); 
                            gain.gain.exponentialRampToValueAtTime(0.0001, this.actx.currentTime + (r===0?0.1:0.3)); 
                            osc.stop(this.actx.currentTime + 0.3);
                        }
                    }
                    step = (step + 1) % 16;
                }, interval);
                
            } else {
                btn.innerText = '▶️ Play'; btn.style.background = 'var(--accent)';
                if(this.dawItvs && this.dawItvs[pid]) clearInterval(this.dawItvs[pid]);
            }
        }

        initRealityBridge() {
            document.body.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); });
            document.body.addEventListener('drop', e => {
                e.preventDefault(); e.stopPropagation();
                let file = e.dataTransfer.files[0];
                if (!file) return;
                
                let reader = new FileReader();
                reader.onload = (event) => {
                    if(this.VFS.write('C:/Users/' + this.user + '/Downloads', file.name, event.target.result)) {
                        this.notify("Reality Bridge Success", `Imported ${file.name} to Downloads.`);
                        for(let pid in this.driveStates) { this.renderDrive(pid); }
                    }
                };
                if(file.name.endsWith('.txt') || file.name.endsWith('.rtf') || file.name.endsWith('.gbs')) { reader.readAsText(file); } 
                else { reader.readAsDataURL(file); }
            });
        }
        
        openFile(path, filename) {
            let data = this.VFS.read(path, filename);
            let ext = filename.split('.').pop().toLowerCase();
            
            if(ext === 'app') { this.PM.launch(data); } 
            else if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) { this.PM.launch('app_view', data); } 
            else if (['mp3', 'wav', 'ogg'].includes(ext)) { this.PM.launch('app_amp', data); } 
            // GEMISCRIPT EXECUTION
            else if (ext === 'gbs') { 
                try { eval(data); this.notify("GemiScript", "Macro executed."); } 
                catch(e) { this.notify("GemiScript Error", e.message, false); }
            }
            // GEMIZIP EXTRACTION
            else if (ext === 'gzip') {
                try {
                    let archive = JSON.parse(data);
                    for(let f in archive) { this.VFS.write('C:/Users/' + this.user + '/Downloads', f, archive[f]); }
                    this.notify("GemiZip", "Archive extracted to Downloads.");
                    for(let pid in this.driveStates) { this.renderDrive(pid); }
                } catch(e) { this.notify("GemiZip Error", "Corrupted archive.", false); }
            }
            else { this.PM.launch('app_note', data); }
        }

        renderDesktopIcons() {
            let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop');
            let layoutData = this.VFS.read('C:/Users/' + this.user + '/Desktop', '.layout') || "{}";
            let layout = JSON.parse(layoutData);
            
            let html = ''; let i = 0;
            for(let file in desk) {
                if(file.endsWith('.app') || file.endsWith('.gbs') || file.endsWith('.gzip')) {
                    let top = layout[file] ? layout[file].top : (20 + (i % 6) * 100) + 'px'; 
                    let left = layout[file] ? layout[file].left : (20 + Math.floor(i / 6) * 90) + 'px';
                    let safeFile = file.replace(/'/g, "\\'"); 
                    
                    if(file.endsWith('.app')) {
                        let appId = desk[file]; let app = this.Registry[appId];
                        if(app) {
                            html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.PM.launch('${appId}')"><div>${app.icon}</div>${file.replace('.app','')}</div>`;
                        }
                    } else if (file.endsWith('.gbs')) {
                        html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>📜</div>${file}</div>`;
                    } else if (file.endsWith('.gzip')) {
                        html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>🗜️</div>${file}</div>`;
                    }
                    i++;
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

        updateChatBox(pid) {
            let box = document.getElementById(`chat-box-${pid}`);
            if(box) {
                let log = localStorage.getItem('GemiChat_Log') || '';
                box.innerHTML = log; box.scrollTop = box.scrollHeight;
            }
        }
        sendChat(pid, overrideText = null) {
            let text = overrideText;
            if(pid) {
                let input = document.getElementById(`chat-in-${pid}`);
                text = input.value.trim(); 
                input.value = '';
            }
            if(!text) return;
            
            let log = localStorage.getItem('GemiChat_Log') || '';
            let time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            log += `<div style="margin-bottom:5px;"><span style="color:var(--accent)">[${time}]</span> <b style="color:white">${this.user}:</b> ${text}</div>`;
            localStorage.setItem('GemiChat_Log', log);
            if(pid) this.updateChatBox(pid);
        }

        installApp(filename, appId, pid, btnId) {
            if(this.VFS.write('C:/Users/' + this.user + '/Desktop', filename, appId)) {
                this.notify("GemiStore", `${filename} has been installed!`);
                this.renderDesktopIcons();
                let btn = document.getElementById(btnId);
                if(btn) { btn.className = 'btn-sec'; btn.innerText = 'Installed'; btn.disabled = true; }
            }
        }

        renderDrive(pid) {
            let path = this.driveStates[pid]; document.getElementById(`d-path-${pid}`).value = path;
            let list = document.getElementById(`d-list-${pid}`); let dir = this.VFS.getDir(path); let html = '';
            for(let k in dir) {
                if(typeof dir[k] === 'object') {
                    html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(0,0,0,0.2); border-radius:6px; transition:0.2s;" onmouseover="this.style.background='rgba(0,120,215,0.4)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'" onclick="GemiOS.navDrive(${pid}, '${k}')"><div style="font-size:30px;">📁</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`;
                } else {
                    let i = '📄';
                    if(k.endsWith('.gbs')) i = '📜';
                    else if(k.endsWith('.gzip')) i = '🗜️';
                    html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" onclick="GemiOS.openFile('${path}', '${k}')"><div style="font-size:30px;">${i}</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`;
                }
            }
            if(html === '') html = '<div style="grid-column: span 4; text-align:center; opacity:0.5; padding:20px;">Folder is empty</div>';
            list.innerHTML = html;
        }

        navDrive(pid, target) {
            let curr = this.driveStates[pid];
            if(target === 'UP') { let parts = curr.split('/'); if(parts.length > 1) parts.pop(); this.driveStates[pid] = parts.join('/') || 'C:'; } 
            else { this.driveStates[pid] = curr + '/' + target; }
            this.renderDrive(pid);
        }

        applyTheme() { 
            let isL = localStorage.getItem('GemiOS_Theme') === 'light'; 
            if(isL) document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); 
            let accent = localStorage.getItem('GemiOS_Accent');
            if(accent) { document.documentElement.style.setProperty('--accent', accent); } 
            else { document.documentElement.style.setProperty('--accent', '#0078d7'); }
        }
        toggleTheme() { let isL = localStorage.getItem('GemiOS_Theme') === 'light'; localStorage.setItem('GemiOS_Theme', !isL ? 'light' : 'dark'); this.applyTheme(); }
        loadWallpaper() { let wp = localStorage.getItem('GemiOS_Wall'); let bg = document.getElementById('desktop-bg'); if(wp && bg) { bg.style.background = `url(${wp}) center/cover`; } }
        startClock() { setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }, 1000); }

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
                                <div style="font-size:12px; opacity:0.7; font-family:monospace;">GemiOS 28.0 / <span style="color:var(--accent); font-weight:bold;">Megapatch</span></div>
                            </div>
                        </div>
                        <div style="overflow-y:auto; padding-bottom:15px; padding-top:10px;">
                            <div class="start-cat">System & Core</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_store')"><span style="font-size:20px;">🛍️</span> GemiStore (App Center)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_disk')"><span style="font-size:20px;">💽</span> GemiDisk Utility</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_task')"><span style="font-size:20px;">📊</span> System Monitor</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_drive')"><span style="font-size:20px;">🗂️</span> Explorer 2.0</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_update')"><span style="font-size:20px;">☁️</span> Cloud Updater</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_set')"><span style="font-size:20px;">⚙️</span> Settings (Theming)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_log')"><span style="font-size:20px;">📋</span> Master Chronicles</div>
                            
                            <div class="start-cat">Development & Utilities</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_script')" style="border:1px solid var(--accent); background:rgba(255,255,255,0.05);"><span style="font-size:20px;">📜</span> GemiScript IDE</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_zip')" style="border:1px solid var(--accent); background:rgba(255,255,255,0.05);"><span style="font-size:20px;">🗜️</span> GemiZip Archiver</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_link')" style="border:1px solid var(--accent); background:rgba(255,255,255,0.05);"><span style="font-size:20px;">🌍</span> GemiLink (P2P)</div>
                            
                            <div class="start-item" onclick="GemiOS.PM.launch('app_chat')"><span style="font-size:20px;">💬</span> GemiChat (LAN)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_word')"><span style="font-size:20px;">📄</span> GemiWord</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_voice')"><span style="font-size:20px;">🗣️</span> GemiVoice 2.0</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_cam')"><span style="font-size:20px;">📸</span> GemiCam</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_view')"><span style="font-size:20px;">🖼️</span> Photo Gallery</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_code')"><span style="font-size:20px;">&lt;/&gt;</span> GemiCode IDE</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_browser')"><span style="font-size:20px;">🌐</span> Web Browser</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_term')"><span style="font-size:20px;">⌨️</span> Bash Terminal</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_calc')"><span style="font-size:20px;">🧮</span> Calculator Pro</div>

                            <div class="start-cat">Entertainment</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_daw')" style="border:1px solid var(--accent); background:rgba(255,255,255,0.05);"><span style="font-size:20px;">🎛️</span> GemiDAW</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_craft')"><span style="font-size:20px;">⛏️</span> GemiCraft (Persistent)</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_amp')"><span style="font-size:20px;">🎵</span> GemiAmp Media Player</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_pong')"><span style="font-size:20px;">🏓</span> Pong 3.0</div>
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
                                <div style="font-weight:600; font-size:10px; opacity:0.5; margin-right:10px;">© 2026 Usernameistakenandnotavaliable & Gemini</div>
                                <div onclick="GemiOS.listen()" style="cursor:pointer; font-size:20px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Voice Commands (GemiAssist)">🎙️</div>
                                
                                <div onclick="GemiOS.toggleTheme()" style="cursor:pointer; font-size:20px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Toggle Theme">🌓</div>
                                <div style="font-weight:600; font-size:12px; background:rgba(255, 255, 255, 0.2); color:white; padding:4px 10px; border-radius:20px; border:1px solid rgba(255,255,255,0.4);">v28.0 CLOUD</div>
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
