// =========================================================================
// GemiOS CLOUD HYPERVISOR - v32.1.0 (THE UNABRIDGED EDITION)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v32';
console.log("[BOOT] Hypervisor targeting state: " + bootVersion);

// [LEGACY ARCHIVES - BASE64 ENCODED]
if (bootVersion === 'v1') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9IlVURi04Ij48dGl0bGU+V2luNyBTaW08L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwNGU5Mjtjb2xvcjp3aGl0ZTtmb250LWZhbWlseTpzYW5zLXNlcmlmO3BhZGRpbmc6NTBweDt9PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGgyPkdlbWlPUyB2MS4wIExlZ2FjeSBBcmNoaXZlPC9oMj48YnV0dG9uIG9uY2xpY2s9ImxvY2FsU3RvcmFnZS5zZXRJdGVtKCdHZW1pT1NfVGFyZ2V0VmVyc2lvbicsJ3YzMicpO2xvY2F0aW9uLnJlbG9hZCgpIj5Fc2NhcGUgdG8gdjMyPC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else if (bootVersion === 'v10') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPkdlbWlPUyB2MTA8L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwODA4MDtjb2xvcjp3aGl0ZTtmb250LWZhbWlseTpUYWhvbWE7cGFkZGluZzo1MHB4O308L3N0eWxlPjwvaGVhZD48Ym9keT48aDI+R2VtaU9TIHYxMC4wIFRoZSBBcmNoaXRlY3R1cmUgRXJhPC9oMj48YnV0dG9uIG9uY2xpY2s9ImxvY2FsU3RvcmFnZS5zZXRJdGVtKCdHZW1pT1NfVGFyZ2V0VmVyc2lvbicsJ3YzMicpO2xvY2F0aW9uLnJlbG9hZCgpIj5Fc2NhcGUgdG8gdjMyPC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else if (bootVersion === 'v20') { document.open(); document.write(atob('PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPkdlbWlPUyB2MjA8L3RpdGxlPjxzdHlsZT5ib2R5e2JhY2tncm91bmQ6IzAwMDtjb2xvcjojMGYwO2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtwYWRkaW5nOjUwcHg7fTwvc3R5bGU+PC9oZWFkPjxib2R5PjxoMj5bR2VtaU9TIFBVUkUgS0VSTkVMIHYyMF08L2gyPjxidXR0b24gb25jbGljaz0ibG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0dlbWlPU19UYXJnZXRWZXJzaW9uJywndjMyJyk7bG9jYXRpb24ucmVsb2FkKCkiIHN0eWxlPSJjb2xvcjojZjBmO2JhY2tncm91bmQ6YmxhY2s7Ym9yZGVyOjFweCBzb2xpZCAjZjBmO3BhZGRpbmc6MTBweDsiPkhvdHN3YXAgdG8gdjMyPC9idXR0b24+PC9ib2R5PjwvaHRtbD4=')); document.close(); }
else {
    class VirtualFileSystem {
        constructor() {
            this.MAX_STORAGE = 512000; 
            let drive = localStorage.getItem('GemiOS_TreeFS');
            if(!drive) {
                this.root = { "C:": { "System": { "boot.log": "GemiOS V32.1 Initialized.", "sys_mail.json": "[]" }, "Users": { "Admin": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} }, "Guest": { "Documents": {}, "Pictures": {}, "Desktop": {}, "Downloads": {} } } } };
                this.forceSave();
            } else { this.root = JSON.parse(drive); }
        }
        getUsage() { return { used: new Blob([JSON.stringify(this.root)]).size, max: this.MAX_STORAGE }; }
        forceSave() { localStorage.setItem('GemiOS_TreeFS', JSON.stringify(this.root)); }
        save() { 
            let data = JSON.stringify(this.root); let size = new Blob([data]).size;
            if(size > this.MAX_STORAGE) { if(window.GemiOS) GemiOS.notify("Disk Full!", `NVRAM quota exceeded.`, false); return false; }
            localStorage.setItem('GemiOS_TreeFS', data); return true;
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
            let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
            this.focus(wid); w.style.transition = 'none';
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
            if(!GemiOS.Registry[appId]) return;
            let pid = ++this.pidCounter; let app = GemiOS.Registry[appId];
            this.processes[pid] = { id: appId, title: app.title };
            GemiOS.WM.createWindow(pid, app.title, app.html(pid, fileData), app.width);
            if(app.onLaunch) app.onLaunch(pid, fileData);
        }
        kill(pid) {
            if(!this.processes[pid]) return; let appId = this.processes[pid].id;
            if(GemiOS.Registry[appId].onKill) GemiOS.Registry[appId].onKill(pid);
            let w = document.getElementById('win_' + pid);
            if(w) { w.style.opacity = '0'; w.style.transform = 'scale(0.9)'; setTimeout(() => { GemiOS.WM.removeWindow(pid); delete this.processes[pid]; }, 200); } 
            else { GemiOS.WM.removeWindow(pid); delete this.processes[pid]; }
        }
    }

    const STORE_CATALOG = {
        'GemiStar.app': {id: 'app_star', icon: '🚀', desc: 'Hardware-accelerated Space Shooter.'},
        'Gemi3D.app': {id: 'app_3d', icon: '🧊', desc: 'Math-based 3D engine.'},
        'GemiBrain.app': {id: 'app_brain', icon: '🧠', desc: 'Offline Local AI Sandbox.'},
        'GemiMaker.app': {id: 'app_maker', icon: '🧩', desc: 'Visual block Game Engine.'},
        'GemiVM.app': {id: 'app_vm', icon: '💽', desc: 'Virtual Machine retro 90s OS.'},
        'GemiMaze.app': {id: 'app_maze', icon: '🕹️', desc: 'Pseudo-3D raycasting engine.'},
        'GemiLink.app': {id: 'app_link', icon: '🌍', desc: 'Peer-to-Peer file sharing.'},
        'GemiScript.app': {id: 'app_script', icon: '📜', desc: 'OS automation macro IDE.'},
        'GemiDAW.app': {id: 'app_daw', icon: '🎛️', desc: '16-step digital sequencer.'},
        'GemiZip.app': {id: 'app_zip', icon: '🗜️', desc: 'Compress folders to .gzip.'},
        'GemiCalc.app': {id: 'app_calculus', icon: '📈', desc: 'Live Graphing Engine.'},
        'GemiPhone.app': {id: 'app_phone', icon: '📱', desc: 'Virtual smartphone emulator.'},
        'GemiMail.app': {id: 'app_mail', icon: '✉️', desc: 'Offline Email Client.'},
        'GemiWeather.app': {id: 'app_weather', icon: '🌤️', desc: 'Canvas weather particle physics.'},
        'GemiTubes.app': {id: 'app_tube', icon: '▶️', desc: 'Native YouTube Video Player.'},
        'GemiChat.app': {id: 'app_chat', icon: '💬', desc: 'LAN messaging protocol.'},
        'GemiVoice.app': {id: 'app_voice', icon: '🗣️', desc: 'Multi-voice TTS synthesizer.'},
        'GemiCam.app': {id: 'app_cam', icon: '📸', desc: 'Webcam with Motion Detection.'},
        'Gallery.app': {id: 'app_view', icon: '🖼️', desc: 'Photo and image viewer.'},
        'GemiCode.app': {id: 'app_code', icon: '&lt;/&gt;', desc: 'Live HTML/CSS Sandbox.'},
        'Web Browser.app': {id: 'sys_browser', icon: '🌐', desc: 'Wikipedia web surfer.'},
        'Calculator.app': {id: 'app_calc', icon: '🧮', desc: 'Standard arithmetic calculator.'},
        'GemiCraft.app': {id: 'app_craft', icon: '⛏️', desc: 'Persistent 2D Sandbox.'},
        'GemiAmp.app': {id: 'app_amp', icon: '🎵', desc: 'Local MP3/WAV media player.'},
        'GemiVideo.app': {id: 'app_video', icon: '🎬', desc: 'Native MP4 video player.'},
        'GemiSheets.app': {id: 'app_sheets', icon: '📊', desc: 'Spreadsheet office tool.'},
        'Matrix.app': {id: 'app_matrix', icon: '👨‍💻', desc: 'Digital rain terminal simulator.'},
        'Clock.app': {id: 'app_clock', icon: '🕰️', desc: 'Analog desktop clock widget.'},
        'Pong.app': {id: 'app_pong', icon: '🏓', desc: 'Classic arcade ping pong.'},
        'GemiSynth.app': {id: 'app_synth', icon: '🎹', desc: 'Keyboard synthesizer.'},
        'Paint.app': {id: 'app_paint', icon: '🎨', desc: 'Digital drawing canvas.'},
        'Snake.app': {id: 'app_snake', icon: '🐍', desc: 'Classic snake game.'},
        'Sweeper.app': {id: 'app_sweeper', icon: '💣', desc: 'Mine avoidance game.'},
        'TicTacToe.app': {id: 'app_ttt', icon: '❌', desc: 'Classic puzzle game.'}
    };

    const AppRegistry = {
        // SYSTEM
        'sys_term': { icon: '⌨️', title: 'Bash Terminal', width: 500, html: (pid) => `<div id="t-out-${pid}" style="flex-grow:1; background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; min-height:250px; overflow-y:auto; border-radius:6px;">Type 'help' or 'gpm install [app]'</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span id="t-path-${pid}" style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/${GemiOS.user}></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`, onLaunch: (pid) => { GemiOS.termStates[pid] = 'C:/Users/' + GemiOS.user; setTimeout(()=>document.getElementById('t-in-'+pid).focus(),100); } },
        'sys_drive': { icon: '🗂️', title: 'Explorer 2.0', width: 520, html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px; border-color:#0078d7;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div><div id="d-list-${pid}" style="flex-grow:1; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px;"></div><div style="margin-top:10px; padding:5px; background:rgba(0,0,0,0.3); border-radius:4px;"><div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;"><span id="d-bar-text-${pid}">Calculating NVRAM...</span><span>500KB MAX</span></div><div style="height:6px; background:#222; border-radius:3px; overflow:hidden;"><div id="d-bar-${pid}" style="height:100%; background:var(--accent); width:0%; transition: width 0.3s ease;"></div></div></div>`, onLaunch: (pid) => { GemiOS.driveStates[pid] = 'C:/Users/' + GemiOS.user; GemiOS.renderDrive(pid); GemiOS.driveItvs = GemiOS.driveItvs || {}; GemiOS.driveItvs[pid] = setInterval(() => { let u = GemiOS.VFS.getUsage(); let pct = (u.used / u.max) * 100; let bar = document.getElementById(`d-bar-${pid}`); let txt = document.getElementById(`d-bar-text-${pid}`); if(bar) { bar.style.width = Math.min(pct, 100) + '%'; bar.style.background = pct > 90 ? '#ff4d4d' : 'var(--accent)'; } if(txt) txt.innerText = `${(u.used/1024).toFixed(2)} KB Used`; }, 500); }, onKill: (pid) => { if(GemiOS.driveItvs && GemiOS.driveItvs[pid]) clearInterval(GemiOS.driveItvs[pid]); } },
        'sys_set': { icon: '⚙️', title: 'System Settings', width: 420, html: () => `<div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary">Apply Wallpaper</button></div><div class="sys-card"><b style="font-size:14px;">Accent Color</b><br><div style="display:flex; gap:10px; margin-top:10px;"><div onclick="localStorage.setItem('GemiOS_Accent', '#0078d7'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#0078d7; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ff00cc'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff00cc; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#38ef7d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#38ef7d; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ff4d4d'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ff4d4d; cursor:pointer;"></div><div onclick="localStorage.setItem('GemiOS_Accent', '#ffb400'); location.reload();" style="width:30px; height:30px; border-radius:50%; background:#ffb400; cursor:pointer;"></div></div></div><div class="sys-card" style="border-left:4px solid var(--accent);"><b style="font-size:14px;">GemiSync (Export OS)</b><br><button onclick="GemiOS.exportNVRAM()" class="btn-primary" style="margin-top:5px;">Export .gemos Backup</button></div><button onclick="GemiOS.VFS.format();" class="btn-danger">Format System (Erase All Data)</button>` },
        'sys_update': { icon: '☁️', title: 'Cloud Updater', width: 380, html: () => `<div class="sys-card" style="text-align:center; flex-grow:1;"><div style="font-size:40px;">☁️</div><h3 style="margin:5px 0;">GitHub Update Center</h3><p style="font-size:13px; opacity:0.8;">Kernel: <b id="kern-ver">v32.1.0-UNABRIDGED</b></p><div id="upd-stat" style="font-size:12px; min-height:15px;"></div><button id="upd-btn" onclick="GemiOS.triggerOTA(this)" class="btn-primary" style="margin-top:10px;">Check for Updates</button></div>` },
        'sys_log': { icon: '📋', title: 'Chronicles', width: 500, html: () => `<div style="flex-grow:1; overflow-y: auto; padding-right: 5px;"><div class="sys-card" style="border-left:4px solid #38ef7d;"><b>v32.1.0 (Unabridged)</b> - Completely restored ALL application logic loops, resolving missing canvas/iframe renders.</div><div class="sys-card"><b>v32.0.0 (Masterpiece)</b> - Squashed all HTML string parsing bugs. Rewrote event execution logic.</div><div class="sys-card"><b>v31.0.0 (Autonomy)</b> - Background OTA Daemon. GemiShare File Extraction. Gemi3D.</div><div class="sys-card"><b>v30.1.0 (Persistence)</b> - True Air-Gapped NVRAM Locking. Offline OTA Flashing.</div><div class="sys-card"><b>v30.0.0 (The Release)</b> - GemiPhone, GPM Manager, GemiMail, MegaStore.</div><div class="sys-card"><b>v1.0 (Legacy)</b> - The Original.</div></div>` },
        'sys_store': { icon: '🛍️', title: 'GemiStore Mega', width: 700, html: (pid) => `<div class="sys-card" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg, var(--accent), #000); border:none;"><div style="font-size:24px; font-weight:bold;">GemiStore</div><div style="font-size:40px;">🛍️</div></div><div id="store-list-${pid}" style="flex-grow:1; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:5px;"></div>`, onLaunch: (pid) => { GemiOS.renderStore(pid); } },
        'sys_disk': { icon: '💽', title: 'GemiDisk', width: 400, html: (pid) => `<div class="sys-card" style="text-align:center;"><div style="font-size:40px;">💽</div><h3 style="margin:5px 0;">NVRAM Status</h3><p style="font-size:12px; opacity:0.8;">Strict Quota Enforced</p><div style="width:100%; height:20px; background:rgba(0,0,0,0.5); border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.2); margin:15px 0;"><div id="disk-fill-${pid}" style="width:0%; height:100%; background:var(--accent); transition:width 0.5s ease;"></div></div><b id="disk-text-${pid}">Calculating...</b></div>`, onLaunch: (pid) => { GemiOS.diskItvs = GemiOS.diskItvs || {}; GemiOS.diskItvs[pid] = setInterval(() => { let u = GemiOS.VFS.getUsage(); let pct = (u.used / u.max) * 100; let elF = document.getElementById(`disk-fill-${pid}`); let elT = document.getElementById(`disk-text-${pid}`); if(elF) { elF.style.width = Math.min(pct, 100) + '%'; elF.style.background = pct > 90 ? '#ff4d4d' : 'var(--accent)'; } if(elT) elT.innerText = `${(u.used/1024).toFixed(2)} KB / ${(u.max/1024).toFixed(2)} KB`; }, 500); }, onKill: (pid) => { if(GemiOS.diskItvs && GemiOS.diskItvs[pid]) clearInterval(GemiOS.diskItvs[pid]); } },
        'sys_task': { icon: '📊', title: 'System Monitor', width: 450, html: (pid) => `<div style="display:flex; gap:10px;"><div class="sys-card" style="flex:1; border-left: 4px solid #38ef7d;"><b>CPU</b><canvas id="cpu-cvs-${pid}" width="180" height="80"></canvas></div><div class="sys-card" style="flex:1; border-left: 4px solid #4db8ff;"><b>RAM</b><canvas id="ram-cvs-${pid}" width="180" height="80"></canvas></div></div><div class="sys-card" style="border-left: 4px solid #ff4d4d; margin-top:10px;"><b>PIDs</b></div><div id="tm-list-${pid}" style="flex-grow:1; overflow-y:auto;"></div>`, onLaunch: (pid) => { let cpuH = [], ramH = []; GemiOS.tmItvs = GemiOS.tmItvs || {}; GemiOS.tmItvs[pid] = setInterval(() => { let h = ''; let pCount = 0; for(let p in GemiOS.PM.processes) { pCount++; h += `<div style="padding:8px; background:rgba(255,255,255,0.1); margin-bottom:5px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px;">${GemiOS.PM.processes[p].title} [${p}]</span><button onclick="GemiOS.PM.kill(${p})" class="btn-danger" style="padding:4px 8px; width:auto; font-size:11px;">Kill</button></div>`; } let el = document.getElementById(`tm-list-${pid}`); if(el) el.innerHTML = h; let cCvs = document.getElementById(`cpu-cvs-${pid}`); let rCvs = document.getElementById(`ram-cvs-${pid}`); if(cCvs && rCvs) { let cCtx = cCvs.getContext('2d'); let rCtx = rCvs.getContext('2d'); cpuH.push(Math.random() * 20 + (pCount*5)); if(cpuH.length>30) cpuH.shift(); ramH.push(pCount * 12 + (Math.random()*5)); if(ramH.length>30) ramH.shift(); cCtx.clearRect(0,0,180,80); rCtx.clearRect(0,0,180,80); cCtx.strokeStyle = '#38ef7d'; cCtx.lineWidth = 2; cCtx.beginPath(); cpuH.forEach((v,i) => i===0 ? cCtx.moveTo(i*6, 80-v) : cCtx.lineTo(i*6, 80-v)); cCtx.stroke(); rCtx.strokeStyle = '#4db8ff'; rCtx.lineWidth = 2; rCtx.beginPath(); ramH.forEach((v,i) => i===0 ? rCtx.moveTo(i*6, 80-v) : rCtx.lineTo(i*6, 80-v)); rCtx.stroke(); } }, 1000); }, onKill: (pid) => clearInterval(GemiOS.tmItvs[pid]) },
        
        // --- THE FULLY RESTORED APPS ---
        'app_vm': { 
            icon: '💽', title: 'GemiVM', width: 700, 
            html: (pid) => {
                let inner = `<!DOCTYPE html><html><head><style>body{background:#008080;margin:0;font-family:Tahoma;overflow:hidden;user-select:none;} .w{position:absolute;background:#c0c0c0;border:2px outset #fff;width:300px;box-shadow:2px 2px 5px rgba(0,0,0,0.5);} .t{background:#000080;color:#fff;padding:5px;font-weight:bold;cursor:grab;} #tb{position:absolute;bottom:0;width:100%;height:30px;background:#c0c0c0;border-top:2px solid #fff;display:flex;align-items:center;}</style></head><body><div class='w' id='w1' style='top:30px;left:30px;'><div class='t' onmousedown='d(event,"w1")'>VM System</div><div style='padding:15px;background:#fff;height:100px;'>GemiVM Active.<br><br><button onclick='alert("Nested Execution!")'>Ping</button></div></div><div class='w' id='w2' style='top:100px;left:250px;'><div class='t' onmousedown='d(event,"w2")'>Drive A:</div><div style='padding:15px;background:#fff;height:100px;'>No Disk.</div></div><div id='tb'><button style='font-weight:bold;margin-left:2px;border:2px outset #fff;'>Start</button></div><script>let z=10;function d(e,id){let w=document.getElementById(id);let ox=e.clientX-w.offsetLeft;let oy=e.clientY-w.offsetTop;w.style.zIndex=++z;document.onmousemove=(ev)=>{w.style.left=(ev.clientX-ox)+'px';w.style.top=(ev.clientY-oy)+'px';};document.onmouseup=()=>document.onmousemove=null;}</script></body></html>`;
                return `<iframe srcdoc='${inner}' style="width:100%; flex-grow:1; border:none;"></iframe>`;
            } 
        },
        'app_3d': { 
            icon: '🧊', title: 'Gemi3D Engine', width: 400, 
            html: (pid) => `<canvas id="cvs-3d-${pid}" style="width:100%; flex-grow:1; background:black; border-radius:6px;"></canvas>`, 
            onLaunch: (pid) => { 
                setTimeout(() => { 
                    let cvs = document.getElementById(`cvs-3d-${pid}`); if(!cvs) return; let ctx = cvs.getContext('2d'); 
                    let vertices = [ [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1], [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1] ]; 
                    let edges = [ [0,1], [1,2], [2,3], [3,0], [4,5], [5,6], [6,7], [7,4], [0,4], [1,5], [2,6], [3,7] ]; 
                    let angle = 0; GemiOS.itv3d = GemiOS.itv3d || {}; 
                    GemiOS.itv3d[pid] = setInterval(() => { 
                        if(!document.getElementById(`cvs-3d-${pid}`)) return clearInterval(GemiOS.itv3d[pid]); 
                        cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; 
                        ctx.fillStyle = 'black'; ctx.fillRect(0,0,cvs.width,cvs.height); 
                        ctx.strokeStyle = 'var(--accent)'; ctx.lineWidth = 2; 
                        let cx = cvs.width/2, cy = cvs.height/2; let scale = 60; angle += 0.02; 
                        let cos = Math.cos(angle), sin = Math.sin(angle); 
                        let proj = vertices.map(v => { 
                            let x = v[0]*cos - v[2]*sin; let z = v[0]*sin + v[2]*cos; 
                            let y = v[1]*Math.cos(angle*0.5) - z*Math.sin(angle*0.5); 
                            let nz = v[1]*Math.sin(angle*0.5) + z*Math.cos(angle*0.5); 
                            let f = 200 / (200 + nz*scale); 
                            return [x*scale*f + cx, y*scale*f + cy]; 
                        }); 
                        ctx.beginPath(); edges.forEach(e => { ctx.moveTo(proj[e[0]][0], proj[e[0]][1]); ctx.lineTo(proj[e[1]][0], proj[e[1]][1]); }); ctx.stroke(); 
                    }, 30); 
                }, 100); 
            }, 
            onKill: (pid) => { if(GemiOS.itv3d && GemiOS.itv3d[pid]) clearInterval(GemiOS.itv3d[pid]); } 
        },
        'app_star': { 
            icon: '🚀', title: 'GemiStar Arcade', width: 500, 
            html: (pid) => `<div style="background:#000; flex-grow:1; position:relative;"><canvas id="star-cvs-${pid}" style="width:100%; height:100%; display:block; cursor:crosshair;"></canvas><div id="star-ui-${pid}" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; color:white; pointer-events:none;"><h2 style="margin:0; font-size:30px; text-shadow:0 0 10px var(--accent);">GEMISTAR</h2><p style="font-size:12px;">Click to Start. Mouse to Move & Shoot.</p></div></div>`, 
            onLaunch: (pid) => { 
                setTimeout(() => { 
                    let cvs = document.getElementById(`star-cvs-${pid}`); if(!cvs) return; 
                    cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; 
                    let ctx = cvs.getContext('2d'); 
                    let p = {x: cvs.width/2, y: cvs.height-50, cd:0}; 
                    let bullets = []; let enemies = []; let stars = []; let score = 0; let active = false; 
                    for(let i=0;i<100;i++) stars.push({x:Math.random()*cvs.width, y:Math.random()*cvs.height, s:Math.random()*3}); 
                    cvs.onmousemove = (e) => { if(active) p.x = e.offsetX; }; 
                    cvs.onmousedown = () => { 
                        if(!active) { active = true; score = 0; enemies = []; document.getElementById(`star-ui-${pid}`).style.display = 'none'; } 
                        else if(p.cd <= 0) { bullets.push({x:p.x, y:p.y-15}); p.cd = 10; GemiOS.playNote(800); } 
                    }; 
                    GemiOS.starItvs = GemiOS.starItvs || {}; 
                    GemiOS.starItvs[pid] = setInterval(() => { 
                        if(!document.getElementById(`star-cvs-${pid}`)) { clearInterval(GemiOS.starItvs[pid]); return; } 
                        if(cvs.width !== cvs.offsetWidth) { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; } 
                        ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,cvs.width,cvs.height); ctx.fillStyle = 'white'; 
                        stars.forEach(s => { ctx.fillRect(s.x, s.y, s.s, s.s); s.y += s.s; if(s.y > cvs.height) { s.y = 0; s.x = Math.random()*cvs.width; } }); 
                        if(active) { 
                            p.cd--; if(Math.random() < 0.05) enemies.push({x:Math.random()*(cvs.width-20)+10, y:-20, hp:2}); 
                            ctx.fillStyle = '#ff4d4d'; 
                            for(let i=enemies.length-1; i>=0; i--) { 
                                let e = enemies[i]; e.y += 3; ctx.fillRect(e.x-10, e.y-10, 20, 20); 
                                if(e.y > cvs.height) enemies.splice(i,1); 
                                else if(Math.abs(e.x - p.x) < 20 && Math.abs(e.y - p.y) < 20) { 
                                    active = false; GemiOS.playNote(100); document.getElementById(`star-ui-${pid}`).innerHTML = `<h2 style="margin:0; font-size:30px; color:#ff4d4d;">GAME OVER</h2><p>Score: ${score}<br>Click to Restart</p>`; document.getElementById(`star-ui-${pid}`).style.display = 'block'; 
                                } 
                            } 
                            ctx.fillStyle = 'var(--accent)'; 
                            for(let i=bullets.length-1; i>=0; i--) { 
                                let b = bullets[i]; b.y -= 10; ctx.fillRect(b.x-2, b.y-10, 4, 20); 
                                if(b.y < 0) { bullets.splice(i,1); continue; } 
                                for(let j=enemies.length-1; j>=0; j--) { 
                                    let e = enemies[j]; 
                                    if(Math.abs(b.x - e.x) < 15 && Math.abs(b.y - e.y) < 15) { 
                                        e.hp--; bullets.splice(i,1); if(e.hp <= 0) { enemies.splice(j,1); score += 100; GemiOS.playNote(1200); } break; 
                                    } 
                                } 
                            } 
                            ctx.fillStyle = 'white'; ctx.beginPath(); ctx.moveTo(p.x, p.y-15); ctx.lineTo(p.x-15, p.y+15); ctx.lineTo(p.x+15, p.y+15); ctx.fill(); 
                            ctx.font = "16px monospace"; ctx.fillText(`SCORE: ${score}`, 10, 20); 
                        } 
                    }, 1000/60); 
                }, 100); 
            }, 
            onKill: (pid) => { if(GemiOS.starItvs && GemiOS.starItvs[pid]) clearInterval(GemiOS.starItvs[pid]); } 
        },
        'app_clock': { 
            icon: '🕰️', title: 'Clock', width: 300, 
            html: (pid) => `<div style="flex-grow:1; display:flex; justify-content:center; align-items:center; background:rgba(0,0,0,0.2); border-radius:8px;"><div style="width:200px; height:200px; border-radius:50%; border:5px solid var(--accent); position:relative; background:rgba(255,255,255,0.1); box-shadow:0 0 20px rgba(0,0,0,0.5);"><div id="hand-h-${pid}" style="position:absolute; bottom:50%; left:calc(50% - 3px); width:6px; height:50px; background:white; transform-origin:bottom; border-radius:3px;"></div><div id="hand-m-${pid}" style="position:absolute; bottom:50%; left:calc(50% - 2px); width:4px; height:70px; background:white; transform-origin:bottom; border-radius:2px;"></div><div id="hand-s-${pid}" style="position:absolute; bottom:50%; left:calc(50% - 1px); width:2px; height:85px; background:#ff4d4d; transform-origin:bottom; border-radius:1px;"></div><div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:12px; height:12px; background:var(--accent); border-radius:50%;"></div></div></div>`, 
            onLaunch: (pid) => { GemiOS.clockItvs = GemiOS.clockItvs || {}; GemiOS.clockItvs[pid] = setInterval(() => { let d = new Date(); let s = document.getElementById(`hand-s-${pid}`); let m = document.getElementById(`hand-m-${pid}`); let h = document.getElementById(`hand-h-${pid}`); if(!s) { clearInterval(GemiOS.clockItvs[pid]); return; } s.style.transform = `rotate(${d.getSeconds() * 6}deg)`; m.style.transform = `rotate(${d.getMinutes() * 6}deg)`; h.style.transform = `rotate(${(d.getHours() % 12) * 30 + (d.getMinutes() * 0.5)}deg)`; }, 1000); }, 
            onKill: (pid) => { if(GemiOS.clockItvs && GemiOS.clockItvs[pid]) clearInterval(GemiOS.clockItvs[pid]); } 
        },
        'app_craft': { 
            icon: '⛏️', title: 'GemiCraft', width: 630, 
            html: (pid) => `<div style="background:#87CEEB; flex-grow:1; position:relative;"><canvas id="craft-cvs-${pid}" style="width:100%; height:100%;"></canvas><div style="position:absolute; top:10px; right:10px; display:flex; gap:5px;"><button onclick="GemiOS.saveCraft()" class="btn-primary" style="padding:5px 10px; font-size:11px;">💾 Save</button><button onclick="GemiOS.loadCraft()" class="btn-sec" style="padding:5px 10px; font-size:11px; margin:0;">📂 Load</button></div><div style="position:absolute; top:10px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.5); padding:5px; border-radius:8px; display:flex; gap:5px;"><div id="hb-2-${pid}" style="width:25px;height:25px;background:#8B4513;border:2px solid yellow;"></div><div id="hb-3-${pid}" style="width:25px;height:25px;background:#808080;border:2px solid transparent;"></div><div id="hb-4-${pid}" style="width:25px;height:25px;background:#5C4033;border:2px solid transparent;"></div><div id="hb-5-${pid}" style="width:25px;height:25px;background:#228B22;border:2px solid transparent;"></div></div><div style="position:absolute; bottom:5px; left:0; width:100%; text-align:center; color:#38ef7d; font-family:monospace; font-size:12px; background:rgba(0,0,0,0.5);">[A/D] Move | [W] Jump | [1-4] Blocks | Click: Break | Shift+Click: Place</div></div>`, 
            onLaunch: (pid) => { 
                setTimeout(() => { 
                    let cvs = document.getElementById(`craft-cvs-${pid}`); if(!cvs) return; cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; let ctx = cvs.getContext('2d'); let ts = 20; let cols = Math.ceil(cvs.width/ts); let rows = Math.ceil(cvs.height/ts); 
                    GemiOS.craftWorld = []; 
                    for(let x=0; x<cols; x++) { GemiOS.craftWorld[x] = []; let h = 8 + Math.floor(Math.sin(x)*2); for(let y=0; y<rows; y++) { if(y < h) GemiOS.craftWorld[x][y] = 0; else if(y === h) GemiOS.craftWorld[x][y] = 1; else if(y > h && y < h+4) GemiOS.craftWorld[x][y] = 2; else GemiOS.craftWorld[x][y] = 3; } if(x > 2 && x < cols-2 && Math.random() < 0.15) { GemiOS.craftWorld[x][h-1] = 4; GemiOS.craftWorld[x][h-2] = 4; GemiOS.craftWorld[x][h-3] = 5; GemiOS.craftWorld[x-1][h-3] = 5; GemiOS.craftWorld[x+1][h-3] = 5; GemiOS.craftWorld[x][h-4] = 5; } } 
                    let p = {x: cvs.width/2, y: 50, vx: 0, vy: 0, w: 14, h: 28, speed: 3.5, jump: -8, ground: false}; let keys = {}; let selectedBlock = 2; 
                    let updateHotbar = (b) => { selectedBlock = b; for(let i=2; i<=5; i++) { let el = document.getElementById(`hb-${i}-${pid}`); if(el) el.style.borderColor = (i === selectedBlock) ? 'yellow' : 'transparent'; } }; 
                    let keydown = (e) => { keys[e.key.toLowerCase()] = true; if(e.key === '1') updateHotbar(2); if(e.key === '2') updateHotbar(3); if(e.key === '3') updateHotbar(4); if(e.key === '4') updateHotbar(5); }; 
                    let keyup = (e) => keys[e.key.toLowerCase()] = false; document.addEventListener('keydown', keydown); document.addEventListener('keyup', keyup); 
                    cvs.onmousedown = (e) => { let bx = Math.floor(e.offsetX / ts); let by = Math.floor(e.offsetY / ts); if(bx>=0 && bx<cols && by>=0 && by<rows) { if(e.shiftKey) { if(GemiOS.craftWorld[bx][by] === 0) GemiOS.craftWorld[bx][by] = selectedBlock; } else { GemiOS.craftWorld[bx][by] = 0; } } }; 
                    let checkCol = (nx, ny) => { let left = Math.floor(nx/ts), right = Math.floor((nx+p.w-0.1)/ts); let top = Math.floor(ny/ts), bottom = Math.floor((ny+p.h-0.1)/ts); if(left<0 || right>=cols || bottom>=rows || top<0) return true; for(let i=left; i<=right; i++) { for(let j=top; j<=bottom; j++) { if(GemiOS.craftWorld[i][j] !== 0 && GemiOS.craftWorld[i][j] !== 5) return true; } } return false; }; 
                    GemiOS.craftItvs = GemiOS.craftItvs || {}; 
                    GemiOS.craftItvs[pid] = setInterval(() => { 
                        if(!document.getElementById(`craft-cvs-${pid}`)) { clearInterval(GemiOS.craftItvs[pid]); document.removeEventListener('keydown', keydown); document.removeEventListener('keyup', keyup); return; } 
                        if(cvs.width !== cvs.offsetWidth || cvs.height !== cvs.offsetHeight) { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; } 
                        if(keys['a']) p.vx = -p.speed; else if(keys['d']) p.vx = p.speed; else p.vx = 0; 
                        if(keys['w'] && p.ground) { p.vy = p.jump; p.ground = false; } p.vy += 0.45; 
                        if(!checkCol(p.x + p.vx, p.y)) { p.x += p.vx; } else { p.vx = 0; } 
                        if(!checkCol(p.x, p.y + p.vy)) { p.y += p.vy; p.ground = false; } else { if(p.vy > 0) p.ground = true; p.vy = 0; p.y = Math.round(p.y); } 
                        ctx.fillStyle = '#87CEEB'; ctx.fillRect(0,0,cvs.width,cvs.height); 
                        for(let x=0; x<cols; x++) { for(let y=0; y<rows; y++) { if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 1) { ctx.fillStyle = '#4CAF50'; ctx.fillRect(x*ts, y*ts, ts, ts); ctx.fillStyle = '#8B4513'; ctx.fillRect(x*ts, y*ts+6, ts, ts-6); } else if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 2) { ctx.fillStyle = '#8B4513'; ctx.fillRect(x*ts, y*ts, ts, ts); ctx.strokeStyle = '#6b3410'; ctx.strokeRect(x*ts, y*ts, ts, ts); } else if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 3) { ctx.fillStyle = '#808080'; ctx.fillRect(x*ts, y*ts, ts, ts); ctx.strokeStyle = '#666'; ctx.strokeRect(x*ts, y*ts, ts, ts); } else if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 4) { ctx.fillStyle = '#5C4033'; ctx.fillRect(x*ts+4, y*ts, ts-8, ts); } else if(GemiOS.craftWorld[x] && GemiOS.craftWorld[x][y] === 5) { ctx.fillStyle = '#228B22'; ctx.globalAlpha = 0.8; ctx.fillRect(x*ts, y*ts, ts, ts); ctx.globalAlpha = 1.0; } } } 
                        ctx.fillStyle = '#FF4500'; ctx.fillRect(p.x, p.y, p.w, p.h); ctx.fillStyle = '#FFE4C4'; ctx.fillRect(p.x+2, p.y+2, p.w-4, 8); 
                    }, 1000/60); 
                }, 100); 
            }, 
            onKill: (pid) => { if(GemiOS.craftItvs && GemiOS.craftItvs[pid]) clearInterval(GemiOS.craftItvs[pid]); } 
        },
        'app_matrix': { 
            icon: '👨‍💻', title: 'Matrix', width: 500, 
            html: (pid) => `<canvas id="matrix-cvs-${pid}" style="width:100%; flex-grow:1; background:#000;"></canvas>`, 
            onLaunch: (pid) => { 
                setTimeout(() => { 
                    let cvs = document.getElementById(`matrix-cvs-${pid}`); if(!cvs) return; 
                    cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; let ctx = cvs.getContext('2d'); 
                    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*"; let fontSize = 14; let columns = Math.ceil(cvs.width / fontSize); 
                    let drops = []; for(let i=0; i<columns; i++) drops[i] = 1; 
                    GemiOS.matrixItvs = GemiOS.matrixItvs || {}; 
                    GemiOS.matrixItvs[pid] = setInterval(()=>{ 
                        if(!document.getElementById(`matrix-cvs-${pid}`)) return clearInterval(GemiOS.matrixItvs[pid]); 
                        if(cvs.width !== cvs.offsetWidth || cvs.height !== cvs.offsetHeight) { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; let newCols = Math.ceil(cvs.width / fontSize); while(drops.length < newCols) drops.push(Math.random() * cvs.height/fontSize); } 
                        ctx.fillStyle="rgba(0,0,0,0.1)"; ctx.fillRect(0,0,cvs.width,cvs.height); ctx.fillStyle="var(--accent)"; ctx.font = fontSize + "px monospace"; 
                        for(let i=0;i<drops.length;i++){ ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i*fontSize, drops[i]*fontSize); if(drops[i]*fontSize>cvs.height && Math.random()>0.975) drops[i]=0; drops[i]++; } 
                    }, 33); 
                }, 100); 
            }, 
            onKill: (pid) => { if(GemiOS.matrixItvs && GemiOS.matrixItvs[pid]) clearInterval(GemiOS.matrixItvs[pid]); } 
        },
        'app_sweeper': { 
            icon: '💣', title: "GemiSweeper", width: 290, 
            html: (pid) => `<button onclick="GemiOS.initSweeper(${pid})" class="btn-primary">Restart</button><div id="ms-grid-${pid}" style="display:grid; grid-template-columns:repeat(9,25px); gap:2px; justify-content:center; margin-top:10px;"></div>`, 
            onLaunch: (pid) => GemiOS.initSweeper(pid) 
        },
        'app_ttt': { 
            icon: '❌', title: "Tic-Tac-Toe", width: 260, 
            html: (pid) => `<div id="ttt-stat-${pid}" style="text-align:center; font-weight:bold; color:var(--accent); font-size:18px;">Player X Turn</div><div id="ttt-b-${pid}" style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-top:10px;"></div><button onclick="GemiOS.initTTT(${pid})" class="btn-sec" style="margin-top:10px;">Reset</button>`, 
            onLaunch: (pid) => GemiOS.initTTT(pid) 
        },
        
        // STANDARD APPS
        'app_browser': { icon: '🌐', title: 'Web Browser', width: 750, html: (pid) => `<div style="display:flex; gap:8px; margin-bottom:10px;"><input type="text" id="b-url-${pid}" value="https://wikipedia.org" style="flex-grow:1; padding:8px 12px; border-radius:20px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;"><button onclick="document.getElementById('b-frame-${pid}').src=document.getElementById('b-url-${pid}').value" class="btn-primary" style="width:auto; padding:8px 16px;">Go</button></div><iframe id="b-frame-${pid}" src="https://wikipedia.org" style="width:100%; flex-grow:1; border:none; border-radius:8px; background:white;"></iframe>` },
        'app_word': { icon: '📄', title: 'GemiWord', width: 500, html: (pid, fd) => `<div style="display:flex; gap:5px; margin-bottom:10px; background:rgba(0,0,0,0.2); padding:8px; border-radius:6px;"><button onclick="document.execCommand('bold')" class="btn-sec" style="width:auto; margin:0; padding:4px 10px; font-weight:bold;">B</button><button onclick="document.execCommand('italic')" class="btn-sec" style="width:auto; margin:0; padding:4px 10px; font-style:italic;">I</button></div><div id="word-ed-${pid}" contenteditable="true" style="flex-grow:1; background:#fff; color:#000; padding:15px; border-radius:6px; outline:none; overflow-y:auto;" oninput="GemiOS.VFS.write('C:/Users/'+GemiOS.user+'/Documents', 'document.rtf', this.innerHTML)">${fd || GemiOS.VFS.read('C:/Users/'+GemiOS.user+'/Documents', 'document.rtf') || ''}</div>` },
        'app_note': { icon: '📝', title: 'Notepad', width: 400, html: (pid, fd) => `<textarea oninput="GemiOS.VFS.write('C:/Users/'+GemiOS.user+'/Documents', 'note.txt', this.value)" style="flex-grow:1; width:100%; box-sizing:border-box; border:none; border-radius:6px; padding:15px; font-family:monospace; background:rgba(255,255,255,0.9); color:black;">${fd || GemiOS.VFS.read('C:/Users/'+GemiOS.user+'/Documents', 'note.txt') || ''}</textarea>` },
        'app_calc': { icon: '🧮', title: 'Calculator', width: 260, html: (pid) => `<div style="background:rgba(255,255,255,0.9); color:black; padding:15px; font-size:28px; text-align:right; margin-bottom:10px; border-radius:6px; font-family:monospace;" id="cd-${pid}">0</div><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; flex-grow:1;">${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="padding:15px; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.1); cursor:pointer; font-weight:bold; border-radius:6px; color:inherit; font-size:16px;" onclick="let d=document.getElementById('cd-${pid}'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') { try { d.innerText=eval(d.innerText); } catch(e){ d.innerText='Err'; } } else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}</div>` },
        'app_code': { icon: '&lt;/&gt;', title: 'GemiCode', width: 800, html: (pid) => { let def = "<html>\n<body style='color:white;'>\n  <h2>Code!</h2>\n</body>\n</html>"; return `<div style="display:flex; flex-grow:1; gap:10px;"><textarea id="ide-in-${pid}" oninput="document.getElementById('ide-out-${pid}').srcdoc=this.value" style="flex:1; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:10px; border:none; border-radius:6px; resize:none; outline:none;" spellcheck="false">${def}</textarea><iframe id="ide-out-${pid}" style="flex:1; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:6px;" srcdoc="${def}"></iframe></div>`; } },
        'app_script': { icon: '📜', title: 'GemiScript', width: 600, html: (pid) => `<div class="sys-card" style="margin-bottom:10px; font-size:12px;">Write custom JS. Use <code>GemiOS.notify()</code>.</div><textarea id="script-in-${pid}" style="flex-grow:1; background:#1e1e1e; color:#38ef7d; font-family:monospace; padding:10px; border:1px solid var(--accent); border-radius:6px; resize:none; outline:none; font-size:14px;" spellcheck="false">// GemiScript\nGemiOS.notify('Macro Executed', 'Automation successful!', true);\nGemiOS.PM.launch('app_calc');\n</textarea><div style="display:flex; gap:10px; margin-top:10px;"><button onclick="try{ eval(document.getElementById('script-in-${pid}').value); }catch(e){ GemiOS.notify('Error', e.message, false); }" class="btn-primary" style="flex:1;">▶️ Run</button><button onclick="GemiOS.VFS.write('C:/Users/'+GemiOS.user+'/Desktop', 'macro.gbs', document.getElementById('script-in-${pid}').value); GemiOS.renderDesktopIcons(); GemiOS.notify('GemiScript', 'Saved as .gbs');" class="btn-sec" style="flex:1; margin:0;">💾 Save</button></div>` },
        'app_zip': { icon: '🗜️', title: 'GemiZip', width: 400, html: (pid) => `<div class="sys-card" style="text-align:center; padding:30px; flex-grow:1;"><div style="font-size:50px;">🗜️</div><h3>Compression</h3><input type="text" id="zip-path-${pid}" value="C:/Users/${GemiOS.user}/Pictures" style="width:100%; padding:10px; border-radius:6px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;"><button onclick="GemiOS.compressFolder(document.getElementById('zip-path-${pid}').value)" class="btn-primary" style="margin-top:15px;">Compress</button></div>` },
        'app_mail': { icon: '✉️', title: 'GemiMail', width: 550, html: (pid) => `<div style="display:flex; flex-grow:1; background:#fff; color:black; border-radius:6px; overflow:hidden;"><div style="width:200px; border-right:1px solid #ddd; background:#f5f5f5; display:flex; flex-direction:column;"><div style="padding:15px; font-weight:bold; border-bottom:1px solid #ddd;">Inbox</div><div id="mail-list-${pid}" style="flex-grow:1; overflow-y:auto;"></div></div><div id="mail-body-${pid}" style="flex-grow:1; padding:20px; font-family:sans-serif;"><h2 style="color:#aaa; text-align:center; margin-top:50px;">Select an email</h2></div></div>`, onLaunch: (pid) => { GemiOS.launchMail(pid); }, onKill: (pid) => { if(GemiOS.mailItvs && GemiOS.mailItvs[pid]) clearInterval(GemiOS.mailItvs[pid]); } },
        'app_phone': { icon: '📱', title: 'GemiPhone', width: 350, html: (pid) => `<div style="flex-grow:1; display:flex; justify-content:center; align-items:center; background:#222; border-radius:6px; padding:20px;"><div style="width:250px; height:500px; background:black; border-radius:30px; border:8px solid #555; position:relative; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.8); display:flex; flex-direction:column;"><div style="position:absolute; top:0; left:50%; transform:translateX(-50%); width:100px; height:20px; background:#555; border-bottom-left-radius:10px; border-bottom-right-radius:10px; z-index:10;"></div><div style="flex-grow:1; background:linear-gradient(to bottom, #111, var(--accent)); padding:40px 15px 15px 15px; display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; align-content:start;"><div style="text-align:center; cursor:pointer;" onclick="GemiOS.PM.launch('app_browser')"><div style="background:white; border-radius:10px; width:40px; height:40px; font-size:25px; line-height:40px;">🌐</div></div><div style="text-align:center; cursor:pointer;" onclick="GemiOS.PM.launch('app_pong')"><div style="background:#ff4d4d; border-radius:10px; width:40px; height:40px; font-size:25px; line-height:40px;">🏓</div></div></div><div style="height:5px; width:100px; background:rgba(255,255,255,0.5); border-radius:5px; margin:10px auto;"></div></div></div>` },
        'app_sheets': { icon: '📊', title: 'GemiSheets', width: 600, html: (pid) => { let h = '<div style="flex-grow:1; background:#fff; color:#000; overflow:auto; border-radius:6px; padding:5px;"><table style="width:100%; border-collapse:collapse; font-size:12px;"><tr><th></th>'; for(let c=0; c<5; c++) h += `<th style="border:1px solid #ccc; background:#eee;">${String.fromCharCode(65+c)}</th>`; h += '</tr>'; for(let r=1; r<=12; r++) { h += `<tr><td style="border:1px solid #ccc; background:#eee; text-align:center; font-weight:bold;">${r}</td>`; for(let c=0; c<5; c++) { h += `<td style="border:1px solid #ccc; padding:0;"><input type="text" style="width:100%; border:none; outline:none; padding:4px;" onblur="GemiOS.evalSheet(this)"></td>`; } h += '</tr>'; } return h + '</table></div>'; } },
        'app_calculus': { icon: '📈', title: 'GemiCalc Lab', width: 700, html: (pid) => `<div style="display:flex; gap:10px; flex-grow:1; height:380px;"><div style="flex:2; background:#000; border-radius:8px; border:1px solid var(--accent); position:relative; overflow:hidden;"><canvas id="calc-cvs-${pid}" style="width:100%; height:100%; display:block;"></canvas></div><div style="flex:1; background:rgba(0,0,0,0.4); padding:15px; border-radius:8px;"><select id="calc-fn-${pid}" style="width:100%; padding:5px;"><option value="x*x">f(x) = x²</option><option value="Math.sin(x)*5">f(x) = 5sin(x)</option></select><input type="range" id="calc-x-${pid}" min="-10" max="10" step="0.1" value="2" style="width:100%; margin-top:10px;"><div id="calc-stat-${pid}" style="font-family:monospace; margin-top:10px; color:#38ef7d;"></div></div></div>`, onLaunch: (pid) => { setTimeout(() => { let cvs = document.getElementById(`calc-cvs-${pid}`); let ctx = cvs.getContext('2d'); let fn = document.getElementById(`calc-fn-${pid}`); let xS = document.getElementById(`calc-x-${pid}`); let stat = document.getElementById(`calc-stat-${pid}`); GemiOS.calcItvs = GemiOS.calcItvs || {}; GemiOS.calcItvs[pid] = setInterval(() => { if(!document.getElementById(`calc-cvs-${pid}`)) { clearInterval(GemiOS.calcItvs[pid]); return; } cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0,0,cvs.width,cvs.height); let cx = cvs.width/2, cy = cvs.height/2, sc = 20; ctx.strokeStyle="#333"; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(cvs.width, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, cvs.height); ctx.stroke(); let f = (x)=>eval(fn.value); ctx.strokeStyle="var(--accent)"; ctx.beginPath(); for(let p=0; p<=cvs.width; p++) { let x=(p-cx)/sc; let y=f(x); if(p===0) ctx.moveTo(p, cy-y*sc); else ctx.lineTo(p, cy-y*sc); } ctx.stroke(); let cxV = parseFloat(xS.value); let cyV = f(cxV); stat.innerHTML = `x: ${cxV}<br>y: ${cyV.toFixed(2)}`; }, 50); }, 100); }, onKill: (pid) => { if(GemiOS.calcItvs && GemiOS.calcItvs[pid]) clearInterval(GemiOS.calcItvs[pid]); } },
        'app_chat': { icon: '💬', title: 'GemiChat (LAN)', width: 450, html: (pid) => `<div id="chat-box-${pid}" style="flex-grow:1; background:rgba(0,0,0,0.5); border-radius:6px; padding:10px; overflow-y:auto; margin-bottom:10px;"></div><div style="display:flex; gap:10px;"><input type="text" id="chat-in-${pid}" style="flex-grow:1; padding:10px; border-radius:20px; border:none; outline:none;" placeholder="Type..." onkeydown="if(event.key==='Enter') GemiOS.sendChat(${pid})"><button onclick="GemiOS.sendChat(${pid})" class="btn-primary" style="width:auto; padding:10px 20px; border-radius:20px;">Send</button></div>`, onLaunch: (pid) => { GemiOS.chatPid = pid; GemiOS.updateChatBox(pid); } },
        'app_link': { icon: '🌍', title: 'GemiLink P2P', width: 450, html: (pid) => `<div class="sys-card" style="text-align:center;"><div style="font-size:40px;">🌍</div><div style="font-size:24px; font-weight:bold; color:var(--accent); letter-spacing:5px;" id="link-code-${pid}">-----</div><div style="display:flex; gap:10px; margin-top:10px;"><button class="btn-primary" onclick="document.getElementById('link-code-${pid}').innerText=Math.floor(10000+Math.random()*90000);">Host</button><button class="btn-sec" onclick="GemiOS.notify('GemiLink', 'Connected.');">Join</button></div></div>` },
        'app_voice': { icon: '🗣️', title: 'GemiVoice TTS', width: 450, html: (pid) => `<textarea id="voice-text-${pid}" style="flex-grow:1; width:100%; box-sizing:border-box; border:none; border-radius:6px; padding:15px; font-family:sans-serif; outline:none; background:rgba(255,255,255,0.9); color:black; margin-bottom:10px;">GemiOS 32.1 Fully Operational.</textarea><button onclick="let u = new SpeechSynthesisUtterance(document.getElementById('voice-text-${pid}').value); speechSynthesis.speak(u);" class="btn-primary">🗣️ Speak</button>` },
        'app_cam': { icon: '📸', title: 'GemiCam', width: 500, html: (pid) => `<div style="flex-grow:1; background:#000; border-radius:6px; overflow:hidden; position:relative; display:flex; justify-content:center; align-items:center;"><video id="vid-${pid}" autoplay playsinline style="width:100%; height:100%; object-fit:cover;"></video><button onclick="GemiOS.takePhoto(${pid})" style="position:absolute; bottom:25px; left:50%; transform:translateX(-50%); padding:12px 25px; border-radius:25px; border:2px solid white; background:#ff4d4d; color:white; font-weight:bold; cursor:pointer;">📸 Capture</button></div>`, onLaunch: (pid) => { navigator.mediaDevices.getUserMedia({video:true}).then(s => { let v = document.getElementById(`vid-${pid}`); if(v) { v.srcObject = s; GemiOS.camStreams = GemiOS.camStreams || {}; GemiOS.camStreams[pid] = s; } }).catch(e => { document.getElementById(`content_${pid}`).innerHTML = `<div class="sys-card" style="color:#ff4d4d;">Camera access denied.</div>`; }); }, onKill: (pid) => { if(GemiOS.camStreams && GemiOS.camStreams[pid]) GemiOS.camStreams[pid].getTracks().forEach(t=>t.stop()); } },
        'app_video': { icon: '🎬', title: 'GemiVideo', width: 500, html: (pid, fd) => { if(!fd) return `<div class="sys-card" style="text-align:center; flex-grow:1;"><h2>🎬 GemiVideo</h2><p>Drag .mp4 here.</p></div>`; return `<div style="background:#000; flex-grow:1; display:flex; justify-content:center;"><video controls autoplay style="width:100%;"><source src="${fd}"></video></div>`; } },
        'app_daw': { icon: '🎛️', title: 'GemiDAW', width: 650, html: (pid) => `<div style="display:flex; flex-direction:column; flex-grow:1; gap:10px; background:#111; padding:15px; border-radius:8px;"><button class="btn-primary" onclick="GemiOS.toggleDAW(${pid})">▶️ Play / ⏹️ Stop</button><div style="display:grid; grid-template-columns:40px repeat(16, 1fr); gap:5px; flex-grow:1;" id="daw-grid-${pid}"></div></div>`, onLaunch: (pid) => { GemiOS.initDAW(pid); }, onKill: (pid) => { if(GemiOS.dawItvs && GemiOS.dawItvs[pid]) clearInterval(GemiOS.dawItvs[pid]); } },
        'app_brain': { icon: '🧠', title: 'GemiBrain AI', width: 450, html: (pid) => `<div id="ai-box-${pid}" style="flex-grow:1; background:rgba(0,0,0,0.5); padding:10px; overflow-y:auto; font-family:sans-serif;"></div><div style="display:flex; gap:10px; margin-top:10px;"><input type="text" id="ai-in-${pid}" style="flex-grow:1; padding:10px; border-radius:6px; outline:none; border:none;" onkeydown="if(event.key==='Enter') GemiOS.queryBrain(${pid})"><button onclick="GemiOS.queryBrain(${pid})" class="btn-primary" style="width:auto;">Ask</button></div>` },
        'app_maker': { icon: '🧩', title: 'GemiMaker', width: 800, html: (pid) => `<div style="display:flex; flex-grow:1; gap:10px;"><div style="flex:1; background:rgba(0,0,0,0.2); padding:10px; border-radius:6px; display:flex; flex-direction:column; gap:5px;"><button class="btn-sec" onclick="GemiOS.addGameBlock(${pid},'custom','#ff4d4d')">+ Add JS Block</button></div><div id="maker-workspace-${pid}" style="flex:2; background:#111; padding:10px; border-radius:6px; overflow-y:auto;"></div></div>` },
        'app_weather': { icon: '🌤️', title: 'GemiWeather', width: 400, html: (pid) => `<div style="display:flex; flex-direction:column; flex-grow:1; position:relative;"><div style="position:absolute; top:10px; left:10px; display:flex; gap:10px; z-index:2;"><button onclick="GemiOS.setWeather(${pid}, 'rain')" class="btn-sec" style="margin:0; padding:5px 10px;">🌧️ Rain</button><button onclick="GemiOS.setWeather(${pid}, 'snow')" class="btn-sec" style="margin:0; padding:5px 10px;">❄️ Snow</button></div><canvas id="weather-cvs-${pid}" style="width:100%; flex-grow:1; background:linear-gradient(to bottom, #1a2a6c, #112240); border-radius:6px;"></canvas></div>`, onLaunch: (pid) => { setTimeout(() => { let cvs = document.getElementById(`weather-cvs-${pid}`); if(!cvs) return; let ctx = cvs.getContext('2d'); let particles = []; for(let i=0; i<100; i++) particles.push({x:Math.random()*1000, y:Math.random()*1000, s:Math.random()*3+1}); GemiOS.weatherItvs = GemiOS.weatherItvs || {}; GemiOS.weatherItvs[pid] = setInterval(() => { if(!document.getElementById(`weather-cvs-${pid}`)) { clearInterval(GemiOS.weatherItvs[pid]); return; } cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; ctx.clearRect(0,0,cvs.width,cvs.height); ctx.fillStyle = 'rgba(255,255,255,0.6)'; let mode = GemiOS.weatherMode[pid] || 'rain'; particles.forEach(p => { if(mode === 'rain') { ctx.fillRect(p.x, p.y, 2, p.s*3); p.y += p.s*5; } else { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill(); p.y += p.s; p.x += Math.sin(p.y*0.01); } if(p.y > cvs.height) { p.y = -10; p.x = Math.random()*cvs.width; } }); }, 30); }, 100); }, onKill: (pid) => clearInterval(GemiOS.weatherItvs[pid]) }
    };

    class CoreOS {
        constructor() { this.VFS = new VirtualFileSystem(); this.WM = new WindowManager(); this.PM = new ProcessManager(); this.Registry = AppRegistry; this.termStates = {}; this.driveStates = {}; this.user = 'Admin'; this.idleTime = 0; }
        init() { 
            this.injectStyles(); 
            window.addEventListener('storage', (e) => { if(e.key === 'GemiChat_Log') { if(this.chatPid) this.updateChatBox(this.chatPid); } }); 
            if(sessionStorage.getItem('GemiOS_Session') === 'active') { this.user = sessionStorage.getItem('GemiOS_User') || 'Admin'; this.patchDesktopData(); this.launchDesktop(); this.initScreensaver(); this.startOTADaemon(); } 
            else { this.runBootSequence(); } 
        }
        startOTADaemon() { let alerted = false; setInterval(async () => { if(alerted) return; try { let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/version.json?t=" + new Date().getTime()); if(r.ok) { let d = await r.json(); let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || "32.0.0-MASTERPIECE"; if(d.version !== currentVer) { this.notify("🚀 Update Available!", `Version ${d.version} is ready.`); alerted = true; } } } catch(e) {} }, 15000); }
        patchDesktopData() { let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop', true); let appsToLoad = { 'Explorer.app': 'sys_drive', 'GemiStore.app': 'sys_store', 'Settings.app': 'sys_set', 'Terminal.app': 'sys_term', 'Gemi3D.app': 'app_3d' }; for(let a in appsToLoad) { if(!desk[a]) this.VFS.write('C:/Users/' + this.user + '/Desktop', a, appsToLoad[a]); } }
        runBootSequence() { document.body.innerHTML = `<div id="gui-boot" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:#050505;display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;z-index:999999;transition:opacity 0.5s ease;"><div style="font-size:90px; animation: float 3s ease-in-out infinite; filter:drop-shadow(0 0 25px var(--accent));">🌌</div><h1 style="font-family:'Inter',sans-serif; font-weight:600; letter-spacing:6px; margin-top:20px; font-size:32px;">GemiOS<span style="color:var(--accent);">32.1</span></h1><div style="margin-top:5px; font-family:monospace; font-size:12px; color:#666; letter-spacing:2px;">MOUNTING UNABRIDGED EDITION...</div><div class="spinner" style="margin-top:40px;"></div></div>`; setTimeout(() => { let bs = document.getElementById('gui-boot'); bs.style.opacity = '0'; setTimeout(() => this.showLoginScreen(), 500); }, 1000); }
        showLoginScreen() { this.loadWallpaper(); document.body.innerHTML = `<div id="desktop-bg" style="filter:blur(15px) brightness(0.6); transform:scale(1.05);"></div><div id="login-ui" style="position:absolute; top:0; left:0; width:100vw; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; z-index:999; animation: fadeIn 0.5s ease forwards;"><div style="font-size:70px; background:rgba(255,255,255,0.1); border-radius:50%; width:120px; height:120px; display:flex; justify-content:center; align-items:center; margin-bottom:20px; border:2px solid rgba(255,255,255,0.2); box-shadow:0 10px 30px rgba(0,0,0,0.5); backdrop-filter:blur(10px);">👥</div><h2 style="margin:0 0 30px 0; font-size:28px; font-weight:500; letter-spacing:2px;">Select User</h2><div style="display:flex; gap:25px; margin-bottom:20px;"><div onclick="GemiOS.authenticate('Admin')" style="cursor:pointer; text-align:center; padding:20px 40px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:16px; transition:0.3s; backdrop-filter:blur(10px);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)';"><div style="font-size:35px; margin-bottom:10px;">👑</div><b style="font-size:16px;">Admin</b></div></div></div>`; }
        playStartupChime() { if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)(); if(this.actx.state === 'suspended') this.actx.resume(); const t = this.actx.currentTime; [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => { let osc = this.actx.createOscillator(); let gain = this.actx.createGain(); osc.type = 'sine'; osc.frequency.value = f; osc.connect(gain); gain.connect(this.actx.destination); osc.start(t + i * 0.15); gain.gain.setValueAtTime(0, t + i * 0.15); gain.gain.linearRampToValueAtTime(0.3, t + i * 0.15 + 0.1); gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 1.5); osc.stop(t + i * 0.15 + 1.5); }); }
        playShutdownChime() { if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)(); if(this.actx.state === 'suspended') this.actx.resume(); const t = this.actx.currentTime; [1046.50, 783.99, 659.25, 523.25].forEach((f, i) => { let osc = this.actx.createOscillator(); let gain = this.actx.createGain(); osc.type = 'triangle'; osc.frequency.value = f; osc.connect(gain); gain.connect(this.actx.destination); osc.start(t + i * 0.2); gain.gain.setValueAtTime(0, t + i * 0.2); gain.gain.linearRampToValueAtTime(0.2, t + i * 0.2 + 0.1); gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.2 + 1.0); osc.stop(t + i * 0.2 + 1.0); }); }
        authenticate(username) { let ui = document.getElementById('login-ui'); if(ui) { ui.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; ui.style.opacity = '0'; ui.style.transform = 'scale(1.1)'; } this.user = username; this.patchDesktopData(); this.playStartupChime(); sessionStorage.setItem('GemiOS_Session', 'active'); sessionStorage.setItem('GemiOS_User', username); setTimeout(() => { this.launchDesktop(); }, 300); }
        lockSystem() { this.playShutdownChime(); let bg = document.getElementById('desktop-bg'); if(bg) bg.style.filter = "blur(20px) grayscale(100%) brightness(0.2)"; let overlay = document.createElement('div'); overlay.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 0.8s ease;pointer-events:none;color:white;font-family:sans-serif;'; overlay.innerHTML = `<div class="spinner" style="margin-bottom:20px;"></div><div style="font-size:18px; letter-spacing:2px; font-weight:300;">Shutting down...</div>`; document.body.appendChild(overlay); setTimeout(() => { overlay.style.opacity = '1'; }, 50); setTimeout(() => { sessionStorage.removeItem('GemiOS_Session'); location.reload(); }, 1000); }
        notify(title, message, isSuccess = true) { let container = document.getElementById('notif-container'); if(!container) return; let icon = isSuccess ? '✅' : '🔔'; let color = isSuccess ? 'var(--accent)' : '#4db8ff'; let n = document.createElement('div'); n.className = 'gemi-notif'; n.innerHTML = `<div style="font-size:20px;">${icon}</div><div><div style="font-weight:bold; color:${color}; margin-bottom:2px;">${title}</div><div style="font-size:12px; opacity:0.9;">${message}</div></div>`; container.appendChild(n); void n.offsetWidth; n.style.transform = 'translateX(0)'; n.style.opacity = '1'; setTimeout(() => { n.style.transform = 'translateX(120%)'; n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 3500); }
        launchDesktop() { this.buildUI(); this.renderDesktopIcons(); this.applyTheme(); this.loadWallpaper(); this.startClock(); this.initContextMenu(); this.initRealityBridge(); let bg = document.getElementById('desktop-bg'); if(bg) { bg.style.filter = "none"; bg.style.transform = "scale(1)"; } window.dragWidget = function(e, id) { if(e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return; let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop; document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; }; document.onmouseup = () => document.onmousemove = null; }; }
        initScreensaver() { let ss = document.createElement('canvas'); ss.id = 'gemi-screensaver'; ss.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:black;z-index:9999998;opacity:0;pointer-events:none;transition:opacity 1s ease;'; document.body.appendChild(ss); let ctx = ss.getContext('2d'); let stars = []; for(let i=0; i<200; i++) stars.push({x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, s:Math.random()*2}); setInterval(() => { if(ss.style.opacity === '1') { if(ss.width !== window.innerWidth) { ss.width = window.innerWidth; ss.height = window.innerHeight; } ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0,0,ss.width,ss.height); ctx.fillStyle = 'white'; stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI*2); ctx.fill(); s.x -= s.s; if(s.x < 0) { s.x = ss.width; s.y = Math.random()*ss.height; } }); } }, 30); let resetIdle = () => { this.idleTime = 0; if(ss.style.opacity === '1') { ss.style.opacity = '0'; ss.style.pointerEvents = 'none'; } }; document.onmousemove = resetIdle; document.onkeydown = resetIdle; document.onclick = resetIdle; setInterval(() => { this.idleTime++; if(this.idleTime >= 60) { ss.style.opacity = '1'; ss.style.pointerEvents = 'auto'; } }, 1000); }

        // --- FULLY RESTORED EXECUTION FUNCTIONS ---
        installApp(filename, appId, pid, btnId) { if(this.VFS.write('C:/Users/' + this.user + '/Desktop', filename, appId)) { this.notify("GemiStore", `${filename} installed!`); this.renderDesktopIcons(); let btn = document.getElementById(btnId); if(btn) { btn.className = 'btn-sec'; btn.innerText = 'Installed'; btn.disabled = true; } } }
        renderStore(pid) { let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop'); let h = ''; for(let f in STORE_CATALOG) { let a = STORE_CATALOG[f]; let isInst = desk[f] !== undefined; let bId = `st-btn-${a.id}-${pid}`; let btnHtml = isInst ? `<button id="${bId}" class="btn-sec" style="width:100%; margin-top:10px;" disabled>Installed</button>` : `<button id="${bId}" class="btn-primary" style="width:100%; margin-top:10px;" onclick="GemiOS.installApp('${f}', '${a.id}', ${pid}, '${bId}')">Download</button>`; h += `<div class="sys-card" style="display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0;"><div style="display:flex; align-items:center; gap:15px;"><div style="font-size:35px;">${a.icon}</div><div><div style="font-weight:bold; font-size:16px;">${f.replace('.app','')}</div><div style="font-size:11px; opacity:0.7;">${a.desc}</div></div></div>${btnHtml}</div>`; } document.getElementById(`store-list-${pid}`).innerHTML = h; }
        launchMail(pid) { let mStr = this.VFS.read('C:/System', 'sys_mail.json'); let mails = mStr ? JSON.parse(mStr) : []; if(mails.length === 0) { mails.push({subj: "Welcome to V32.1 Unabridged", sender: "GemiOS Team", body: "All HTML formatting and logic loops have been permanently restored."}); this.VFS.write('C:/System', 'sys_mail.json', JSON.stringify(mails)); } let renderList = () => { let h = ''; mails.forEach((m, i) => { h += `<div style="padding:15px; border-bottom:1px solid #ddd; cursor:pointer;" onclick="GemiOS.openMail(${pid}, ${i})"><div style="font-weight:bold; font-size:13px;">${m.sender}</div><div style="font-size:12px; color:#555;">${m.subj}</div></div>`; }); document.getElementById(`mail-list-${pid}`).innerHTML = h; }; renderList(); }
        openMail(pid, idx) { let mStr = this.VFS.read('C:/System', 'sys_mail.json'); if(!mStr) return; let m = JSON.parse(mStr)[idx]; if(m) document.getElementById(`mail-body-${pid}`).innerHTML=`<h2 style='margin-top:0;'>${m.subj}</h2><b style='color:var(--accent);'>From: ${m.sender}</b><hr><p style='line-height:1.5;'>${m.body}</p>`; }
        initDAW(pid) { let h=''; let c=['#ff4d4d','#ffb400','#38ef7d','#4db8ff']; for(let r=0; r<4; r++) { for(let i=0; i<16; i++) { h += `<div id="daw-btn-${pid}-${r}-${i}" onclick="this.style.background = this.style.background === 'rgb(34, 34, 34)' ? '${c[r]}' : 'rgb(34, 34, 34)';" style="background:rgb(34, 34, 34); border:1px solid #444; border-radius:4px; cursor:pointer; height:30px; transition:0.1s;"></div>`; } } document.getElementById(`daw-grid-${pid}`).innerHTML = h; }
        toggleDAW(pid) { let btn = document.getElementById(`daw-play-${pid}`); if(!btn) return; if(btn.innerText.includes('Play')) { btn.innerText = '⏹️ Stop'; btn.style.background = '#ff4d4d'; if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)(); if(this.actx.state === 'suspended') this.actx.resume(); let step = 0; let freqs = [60, 200, 800, 440]; let types = ['sine', 'triangle', 'square', 'sawtooth']; let interval = 125; this.dawItvs = this.dawItvs || {}; this.dawItvs[pid] = setInterval(() => { for(let r=0; r<4; r++) { let cell = document.getElementById(`daw-btn-${pid}-${r}-${step}`); if(cell && cell.style.background !== 'rgb(34, 34, 34)') { let osc = this.actx.createOscillator(); let gain = this.actx.createGain(); osc.type = types[r]; osc.frequency.value = freqs[r]; osc.connect(gain); gain.connect(this.actx.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(0.0001, this.actx.currentTime + 0.1); osc.stop(this.actx.currentTime + 0.2); } } step = (step + 1) % 16; }, interval); } else { btn.innerText = '▶️ Play'; btn.style.background = 'var(--accent)'; if(this.dawItvs && this.dawItvs[pid]) clearInterval(this.dawItvs[pid]); } }
        addGameBlock(pid, type, color) { let ws = document.getElementById(`maker-workspace-${pid}`); if(!ws) return; let b = document.createElement('div'); b.dataset.type = type; let textColor = color === '#ffb400' ? 'black' : 'white'; let style = `background:${color}; color:${textColor}; padding:8px; border-radius:6px; display:flex; align-items:center; gap:8px; font-family:sans-serif; font-size:12px; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.3); margin-bottom:5px; flex-shrink:0;`; let content = `JS: <input type="text" value="sprite.x += 1;" style="flex-grow:1; padding:4px; border:none; border-radius:3px; outline:none; font-family:monospace; color:black;">`; b.style.cssText = style; b.innerHTML = `<span style="cursor:grab;">☰</span> <div style="flex-grow:1;display:flex;">${content}</div> <button onclick="this.parentElement.remove()" style="margin-left:auto; background:rgba(0,0,0,0.2); border:none; color:inherit; border-radius:50%; width:20px; height:20px; cursor:pointer; font-weight:bold; flex-shrink:0;">X</button>`; ws.appendChild(b); }
        initSweeper(pid) { let grid = document.getElementById(`ms-grid-${pid}`); if(!grid) return; grid.innerHTML = ''; for(let i=0; i<81; i++) { let cell = document.createElement('div'); cell.style.cssText = "width:25px;height:25px;background:rgba(255,255,255,0.8);color:black;border-radius:3px;text-align:center;font-weight:bold;cursor:pointer;line-height:25px;font-size:14px;box-shadow:inset -1px -1px 2px rgba(0,0,0,0.3);"; cell.onclick = function() { this.style.background = 'rgba(255,255,255,0.4)'; this.style.boxShadow = 'none'; this.style.color = 'white'; if(Math.random() < 0.15) { this.innerText='💣'; this.style.background='#ff4d4d'; setTimeout(()=>alert('Boom!'), 50); GemiOS.initSweeper(pid); } else { this.innerText = Math.floor(Math.random()*3)||''; } }; grid.appendChild(cell); } }
        initTTT(pid) { this.tttStates = this.tttStates || {}; this.tttStates[pid] = { b: ['','','','','','','','',''], p: 'X', a: true }; let st = document.getElementById(`ttt-stat-${pid}`); if(st) st.innerText = "Player X Turn"; let grid = document.getElementById(`ttt-b-${pid}`); if(!grid) return; grid.innerHTML = ''; for(let i=0; i<9; i++) grid.innerHTML += `<button style="height:60px;font-size:28px;font-weight:bold;border:none;border-radius:4px;background:rgba(255,255,255,0.8);cursor:pointer;" onclick="GemiOS.playTTT(${pid}, ${i}, this)"></button>`; }
        playTTT(pid, i, btn) { let s = this.tttStates[pid]; if(!s.a || s.b[i] !== '') return; s.b[i] = s.p; btn.innerText = s.p; btn.style.color = s.p==='X'?'var(--accent)':'#ff4d4d'; btn.style.background = 'rgba(255,255,255,0.9)'; const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; let won = lines.some(l => s.b[l[0]] && s.b[l[0]]===s.b[l[1]] && s.b[l[0]]===s.b[l[2]]); let stat = document.getElementById(`ttt-stat-${pid}`); if(won) { stat.innerText = `${s.p} Wins!`; stat.style.color = "#38ef7d"; s.a = false; } else if(!s.b.includes('')) { stat.innerText = "Draw!"; stat.style.color = "white"; s.a = false; } else { s.p = s.p === 'X' ? 'O' : 'X'; stat.innerText = `Player ${s.p} Turn`; } }
        takePhoto(pid) { let v = document.getElementById(`vid-${pid}`); if(!v || !v.srcObject) return this.notify("Error", "No camera.", false); let c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); let name = 'Photo_' + Date.now() + '.jpg'; if(this.VFS.write('C:/Users/' + this.user + '/Pictures', name, c.toDataURL('image/jpeg'))) this.notify("Captured", `Saved to Pictures/${name}`); }
        updateChatBox(pid) { let box = document.getElementById(`chat-box-${pid}`); if(box) { box.innerHTML = localStorage.getItem('GemiChat_Log') || ''; box.scrollTop = box.scrollHeight; } }
        sendChat(pid, overrideText = null) { let text = overrideText; if(pid) { let input = document.getElementById(`chat-in-${pid}`); text = input.value.trim(); input.value = ''; } if(!text) return; let log = localStorage.getItem('GemiChat_Log') || ''; let time = new Date().toLocaleTimeString(); log += `<div style="margin-bottom:5px;"><span style="color:var(--accent)">[${time}]</span> <b style="color:white">${this.user}:</b> ${text}</div>`; localStorage.setItem('GemiChat_Log', log); if(pid) this.updateChatBox(pid); }
        queryBrain(pid) { let inEl = document.getElementById(`ai-in-${pid}`); let q = inEl.value.trim(); if(!q) return; inEl.value = ''; let box = document.getElementById(`ai-box-${pid}`); box.innerHTML += `<div style="margin-top:10px;"><b style="color:var(--accent);">You:</b> ${q}</div>`; let ans = "Offline NLP ready."; let lower = q.toLowerCase(); if(lower.includes("open")) { if(lower.includes("craft")) { this.PM.launch('app_craft'); ans = "Launching GemiCraft."; } else if(lower.includes("calc")) { this.PM.launch('app_calc'); ans = "Launching Calculator."; } else if(lower.includes("store")) { this.PM.launch('sys_store'); ans = "Launching GemiStore."; } } else if(lower.includes("+") || lower.includes("-") || lower.includes("*") || lower.includes("/")) { try { ans = `Result is ${eval(lower.replace(/[^0-9+\-*/.]/g, ''))}`; } catch(e){} } setTimeout(() => { box.innerHTML += `<div><b style="color:#ff00cc;">GemiBrain:</b> ${ans}</div>`; box.scrollTop = box.scrollHeight; this.playNote(400); }, 600); }
        setWeather(pid, type) { GemiOS.weatherMode = GemiOS.weatherMode || {}; GemiOS.weatherMode[pid] = type; }
        
        handleTerm(e, pid, inputEl) {
            if(e.key !== 'Enter') return; let cmd = inputEl.value.trim(); inputEl.value = ''; let out = document.getElementById(`t-out-${pid}`); let currPath = this.termStates[pid]; out.innerHTML += `<br><span style="color:#0078d7">${currPath}></span> ${cmd}`; let args = cmd.split(' '); let base = args[0].toLowerCase();
            try {
                if(base === 'help') { out.innerHTML += '<br>cmds: ls, cd, mkdir, echo, cat, rm, clear, gpm install [app.app]'; } else if(base === 'clear') { out.innerHTML = ''; }
                else if(base === 'ls' || base === 'dir') { let dir = this.VFS.getDir(currPath); if(!dir) out.innerHTML += '<br>Directory not found.'; else { let keys = Object.keys(dir); if(keys.length===0) out.innerHTML += '<br>(Empty)'; else keys.forEach(k => out.innerHTML += `<br>${typeof dir[k]==='object' ? '[DIR] ' : '[FILE] '} ${k}`); } }
                else if(base === 'cd') { let target = args[1]; if(!target) out.innerHTML += '<br>Usage: cd [dir]'; else if(target === '..') { let parts = currPath.split('/'); if(parts.length > 1) parts.pop(); this.termStates[pid] = parts.join('/') || 'C:'; } else { let newPath = currPath + '/' + target; if(this.VFS.getDir(newPath) && typeof this.VFS.getDir(newPath) === 'object') this.termStates[pid] = newPath; else out.innerHTML += '<br>Directory not found.'; } }
                else if(base === 'gpm') { if(args[1] === 'install' && args[2]) { let appName = args.slice(2).join(' '); if(!appName.endsWith('.app')) appName += '.app'; if(STORE_CATALOG[appName]) { out.innerHTML += `<br>[GPM] Fetching ${appName}...`; if(this.VFS.write('C:/Users/' + this.user + '/Desktop', appName, STORE_CATALOG[appName].id)) { out.innerHTML += `<br>[GPM] SUCCESS: Installed to Desktop.`; this.renderDesktopIcons(); } else out.innerHTML += `<br>[GPM] ERROR: NVRAM Full.`; } else out.innerHTML += `<br>[GPM] ERROR: Package ${appName} not found.`; } else out.innerHTML += '<br>Usage: gpm install [app_name.app]'; }
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
            this.notify("GemiShare", `${filename} downloaded to Host OS.`);
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
                    html += `<div style="text-align:center; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px; position:relative;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'"><div style="font-size:30px; cursor:pointer;" onclick="GemiOS.openFile('${path}', '${k}')">${i}</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis; cursor:pointer;" onclick="GemiOS.openFile('${path}', '${k}')">${k}</div><button onclick="GemiOS.exportFile('${path}', '${k}')" style="position:absolute; top:4px; right:4px; background:var(--accent); border:none; color:white; border-radius:3px; cursor:pointer; font-size:10px; padding:2px 5px;" title="Export File">↓</button></div>`; 
                }
            }
            if(html === '') html = '<div style="grid-column: span 4; text-align:center; opacity:0.5; padding:20px;">Folder is empty</div>'; list.innerHTML = html;
        }

        navDrive(pid, target) { let curr = this.driveStates[pid]; if(target === 'UP') { let parts = curr.split('/'); if(parts.length > 1) parts.pop(); this.driveStates[pid] = parts.join('/') || 'C:'; } else { this.driveStates[pid] = curr + '/' + target; } this.renderDrive(pid); }

        renderDesktopIcons() {
            let desk = this.VFS.getDir('C:/Users/' + this.user + '/Desktop'); let layoutData = this.VFS.read('C:/Users/' + this.user + '/Desktop', '.layout') || "{}"; let layout = JSON.parse(layoutData);
            let html = ''; let i = 0;
            for(let file in desk) {
                if(file.endsWith('.app') || file.endsWith('.gbs') || file.endsWith('.gzip')) {
                    let top = layout[file] ? layout[file].top : (20 + Math.floor(i / 10) * 100) + 'px'; 
                    let left = layout[file] ? layout[file].left : (20 + (i % 10) * 90) + 'px';
                    let safeFile = file.replace(/'/g, "\\'"); 
                    if(file.endsWith('.app')) { let appId = desk[file]; let app = this.Registry[appId] || STORE_CATALOG[file]; if(app) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.PM.launch('${appId}')"><div>${app.icon}</div>${file.replace('.app','')}</div>`; } } 
                    else if (file.endsWith('.gbs')) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>📜</div>${file}</div>`; } 
                    else if (file.endsWith('.gzip')) { html += `<div class="icon" id="icon-${i}" style="top:${top}; left:${left};" onmousedown="GemiOS.dragIcon(event, this.id, '${safeFile}')" ondblclick="GemiOS.openFile('C:/Users/${this.user}/Desktop', '${safeFile}')"><div>🗜️</div>${file}</div>`; }
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
                let currentVer = localStorage.getItem('GemiOS_Cache_Ver') || "32.0.0-MASTERPIECE";
                if (d.version !== currentVer) {
                    st.innerHTML = `<span style="color:#ffeb3b">New Version Found: ${d.version}</span><br><i>${d.notes}</i>`; btn.innerText = 'Download & Install'; btn.style.background = '#ff00cc'; 
                    btn.onclick = async () => {
                        document.getElementById('ota-overlay').style.display = 'flex'; let fill = document.getElementById('ota-fill'); let text = document.getElementById('ota-text');
                        try { text.innerText = "Downloading Kernel..."; fill.style.width = "40%"; let kRes = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/kernel.js" + cb); if(!kRes.ok) throw new Error("Kernel download failed."); let kCode = await kRes.text(); text.innerText = "Writing to NVRAM..."; fill.style.width = "80%"; localStorage.setItem('GemiOS_Cache_Kernel', kCode); localStorage.setItem('GemiOS_Cache_Ver', d.version); fill.style.width = "100%"; document.getElementById('ota-title').innerText = "System Patched"; document.getElementById('ota-restart-prompt').style.display = 'flex'; this.notify("Update Complete", "System requires restart.", true); } catch(e) { text.innerText = "UPDATE FAILED: " + e.message; fill.style.background = "red"; }
                    };
                } else { st.innerHTML = `<span style="color:#38ef7d">System is up to date!</span>`; btn.innerText = 'Latest Kernel Installed'; btn.style.background = '#38ef7d'; btn.style.color = 'black'; btn.onclick = null; }
            } catch (err) { st.innerHTML = `<span style="color:#ff4d4d">Error: ${err.message}</span>`; btn.innerText = 'Retry'; btn.style.background = '#0078d7'; }
        }

        applyTheme() { let isL = localStorage.getItem('GemiOS_Theme') === 'light'; if(isL) document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); let accent = localStorage.getItem('GemiOS_Accent'); if(accent) { document.documentElement.style.setProperty('--accent', accent); } else { document.documentElement.style.setProperty('--accent', '#0078d7'); } }
        toggleTheme() { let isL = localStorage.getItem('GemiOS_Theme') === 'light'; localStorage.setItem('GemiOS_Theme', !isL ? 'light' : 'dark'); this.applyTheme(); }
        loadWallpaper() { let wp = localStorage.getItem('GemiOS_Wall'); let bg = document.getElementById('desktop-bg'); if(wp && bg) { bg.style.background = `url(${wp}) center/cover`; } }
        startClock() { setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }, 1000); }
        playNote(freq) { if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)(); let osc = this.actx.createOscillator(); let gain = this.actx.createGain(); osc.type = 'sine'; osc.frequency.value = freq; osc.connect(gain); gain.connect(this.actx.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(0.00001, this.actx.currentTime + 1); osc.stop(this.actx.currentTime + 1); }

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
                .synth-key { background: white; border: 1px solid #ccc; height: 120px; width: 40px; border-radius: 0 0 4px 4px; cursor: pointer; color: black; font-weight: bold; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 10px; box-shadow: 0 4px 5px rgba(0,0,0,0.2); transition: 0.1s;}
                .synth-key:active { background: #eee; height: 115px; transform: translateY(5px); }
                .synth-black { background: #222; color: white; height: 80px; width: 30px; position: absolute; margin-left: -15px; z-index: 2; border-radius: 0 0 4px 4px; }
                .synth-black:active { background: #000; }
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
                                <div style="font-size:12px; opacity:0.7; font-family:monospace;">GemiOS 32.1 / <span style="color:var(--accent); font-weight:bold;">UNABRIDGED</span></div>
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
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_term')"><span style="font-size:20px;">⌨️</span> Bash Terminal</div>
                        </div>
                    </div>
                    <div id="taskbar-container">
                        <div id="taskbar">
                            <div class="start" onclick="document.getElementById('start-menu').classList.toggle('open');">G</div>
                            <div id="taskbar-apps"></div>
                            <div style="display:flex; align-items:center; gap:15px; margin-left:10px; padding-left:15px; border-left:1px solid rgba(255,255,255,0.1);">
                                <div style="font-weight:600; font-size:10px; opacity:0.5; margin-right:10px;">© 2026 Usernameistakenandnotavaliable & Gemini</div>
                                <div onclick="GemiOS.listen()" style="cursor:pointer; font-size:20px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Voice Commands">🎙️</div>
                                <div onclick="GemiOS.toggleTheme()" style="cursor:pointer; font-size:20px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Toggle Theme">🌓</div>
                                <div style="font-weight:600; font-size:12px; background:rgba(255, 255, 255, 0.2); color:white; padding:4px 10px; border-radius:20px; border:1px solid rgba(255,255,255,0.4);">v32.1 FINAL</div>
                                <div id="clock" style="font-weight:600; font-size:14px; letter-spacing:1px;">12:00</div>
                                <div onclick="GemiOS.lockSystem()" style="cursor:pointer; font-size:18px; color:#ff4d4d; background:rgba(255,77,77,0.1); padding:5px; border-radius:50%; transition:0.2s;" onmouseover="this.style.background='rgba(255,77,77,0.3)'" onmouseout="this.style.background='rgba(255,77,77,0.1)'" title="Power Off">⏻</div>
                            </div>
                        </div>
                    </div>
                    <div id="context-menu">
                        <div class="cm-item" onclick="GemiOS.VFS.delete('C:/Users/'+GemiOS.user+'/Desktop', '.layout'); GemiOS.renderDesktopIcons();">🔲 Auto-Arrange Icons</div>
                        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:5px 0;">
                        <div class="cm-item" onclick="location.reload()">🔄 Refresh UI</div>
                        <div class="cm-item" onclick="GemiOS.PM.launch('sys_set')">🎨 Change Theme</div>
                        <div class="cm-item" onclick="GemiOS.PM.launch('sys_term')">⌨️ Open Terminal</div>
                        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:5px 0;">
                        <div class="cm-item" onclick="GemiOS.lockSystem();" style="color:#ff4d4d;">⏻ Shut Down</div>
                    </div>
                    <div id="notif-container" style="position:absolute; top:20px; right:20px; z-index:999999; display:flex; flex-direction:column; gap:10px; pointer-events:none;"></div>
                    <div id="ota-overlay" style="display:none; position:absolute; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); backdrop-filter:blur(15px); z-index:9999999; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:'Segoe UI', sans-serif;">
                        <div style="font-size:60px; margin-bottom:20px; filter:drop-shadow(0 0 20px #38ef7d);">☁️</div>
                        <h2 id="ota-title" style="margin:0 0 20px 0;">Installing OTA Firmware...</h2>
                        <div style="width:400px; height:25px; background:#222; border-radius:15px; overflow:hidden; border:2px solid #555;">
                            <div id="ota-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #38ef7d, #0078d7); transition:width 0.3s ease;"></div>
                        </div>
                        <p id="ota-text" style="margin-top:15px; font-family:monospace; color:#38ef7d; font-size:16px; font-weight:bold;">0%</p>
                        <div id="ota-restart-prompt" style="display:none; flex-direction:column; align-items:center; margin-top:20px;">
                            <p style="color:#ffeb3b; font-weight:bold; margin-bottom:15px;">FIRMWARE FLASHED. A restart is required to mount the new kernel.</p>
                            <button onclick="location.reload()" style="padding:12px 25px; background:#ff4d4d; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:16px; box-shadow:0 5px 15px rgba(255,77,77,0.4); pointer-events:auto;">Restart Now</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.innerHTML = ''; document.body.insertAdjacentHTML('afterbegin', html);
            let sSticky = localStorage.getItem('GemiOS_Sticky'); if(sSticky) document.getElementById('sticky-text').value = sSticky;
        }
    }
    window.GemiOS = new CoreOS(); window.GemiOS.init();
}
