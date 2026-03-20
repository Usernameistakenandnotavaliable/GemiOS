// =========================================================================
// GemiOS CLOUD HYPERVISOR - v26.1.0 (THE TIME MACHINE EXPANSION)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v26';
console.log("[BOOT] Hypervisor targeting state: " + bootVersion);

if (bootVersion === 'v1') {
    // --- KERNEL 1: TRUE ORIGINAL V1.0 (Archive) ---
    const v1Code = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Windows 7 Web Simulator</title><style>body,html{margin:0;padding:0;height:100%;overflow:hidden;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;user-select:none;}#desktop{width:100vw;height:100vh;background:linear-gradient(135deg,#004e92,#000428);position:relative;}.window{position:absolute;top:100px;left:150px;width:400px;min-height:250px;background:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.5);border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.5);display:none;flex-direction:column;backdrop-filter:blur(10px);}.title-bar{padding:5px 10px;background:rgba(255,255,255,0.4);border-bottom:1px solid #ccc;cursor:grab;display:flex;justify-content:space-between;align-items:center;border-top-left-radius:8px;border-top-right-radius:8px;font-weight:bold;}.close-btn{background:#ff4d4d;color:white;border:none;padding:2px 10px;border-radius:3px;cursor:pointer;}.window-content{padding:15px;flex-grow:1;background:#fff;border-bottom-left-radius:8px;border-bottom-right-radius:8px;}#taskbar{position:absolute;bottom:0;width:100%;height:40px;background:rgba(20,30,50,0.8);backdrop-filter:blur(10px);display:flex;align-items:center;padding:0 10px;box-sizing:border-box;border-top:1px solid rgba(255,255,255,0.2);}#start-btn{width:36px;height:36px;background:radial-gradient(circle,#4db8ff,#0078d7);border-radius:50%;border:2px solid white;cursor:pointer;display:flex;justify-content:center;align-items:center;color:white;font-weight:bold;box-shadow:0 0 10px rgba(0,120,215,0.8);}#start-menu{position:absolute;bottom:45px;left:0;width:250px;height:350px;background:rgba(255,255,255,0.9);backdrop-filter:blur(10px);border-radius:5px;box-shadow:2px 2px 10px rgba(0,0,0,0.5);display:none;padding:10px;box-sizing:border-box;}.menu-item{padding:10px;cursor:pointer;border-radius:3px;margin-bottom:5px;background:#eee;}.menu-item:hover{background:#0078d7;color:white;}#clock{margin-left:auto;color:white;font-size:14px;}.setting-row{margin-bottom:15px;}input[type=range]{width:100%;}.file-icon{display:inline-block;width:60px;text-align:center;margin:10px;cursor:pointer;}.file-icon div{font-size:30px;}#v1-escape{position:absolute;top:10px;right:10px;background:red;color:white;font-weight:bold;padding:10px;border:2px solid white;border-radius:5px;cursor:pointer;z-index:9999;}</style></head><body><div id="desktop"><button id="v1-escape" onclick="localStorage.setItem('GemiOS_TargetVersion', 'v26'); location.reload();">🚀 Escape to Modern OS</button><div class="window" id="win-explorer" style="left:50px;top:50px;display:flex;"><div class="title-bar" onmousedown="dragWindow(event,'win-explorer')"><span>Windows Explorer</span> <button class="close-btn" onclick="toggleWindow('win-explorer')">X</button></div><div class="window-content" id="file-content"><div class="file-icon" onclick="alert('Accessing C: Drive (Simulation)')"><div>💽</div>C: Drive</div><div class="file-icon" onclick="alert('Opening Documents...')"><div>📁</div>Docs</div><div class="file-icon" onclick="downloadFakeFile()"><div>⬇️</div>Download Test</div></div></div><div id="start-menu"><div class="menu-item" onclick="toggleWindow('win-explorer'); toggleStartMenu();">📁 File Explorer</div><hr><div class="menu-item" onclick="alert('Shutting down simulator...'); window.close();">Shut Down</div></div><div id="taskbar"><div id="start-btn" onclick="toggleStartMenu()">W7</div><div id="clock">12:00 AM</div></div></div><script>function updateClock(){const now=new Date();document.getElementById('clock').innerText=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}setInterval(updateClock,1000);updateClock();function toggleStartMenu(){const menu=document.getElementById('start-menu');menu.style.display=menu.style.display==='block'?'none':'block';}function toggleWindow(id){const win=document.getElementById(id);win.style.display=win.style.display==='flex'?'none':'flex';}let activeWindow=null;let offsetX=0,offsetY=0;function dragWindow(e,windowId){activeWindow=document.getElementById(windowId);document.querySelectorAll('.window').forEach(w=>w.style.zIndex=1);activeWindow.style.zIndex=10;offsetX=e.clientX-activeWindow.offsetLeft;offsetY=e.clientY-activeWindow.offsetTop;document.onmousemove=moveWindow;document.onmouseup=stopDrag;}function moveWindow(e){if(activeWindow){activeWindow.style.left=(e.clientX-offsetX)+'px';activeWindow.style.top=(e.clientY-offsetY)+'px';}}function stopDrag(){document.onmousemove=null;document.onmouseup=null;activeWindow=null;}function downloadFakeFile(){const content="This is a simulated download file from your Windows 7 Web OS!";const blob=new Blob([content],{type:'text/plain'});const url=window.URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='simulated_download.txt';document.body.appendChild(a);a.click();document.body.removeChild(a);window.URL.revokeObjectURL(url);}<\/script></body></html>`;
    document.open(); document.write(v1Code); document.close();

} else if (bootVersion === 'v10') {
    // --- KERNEL 2: THE START MENU ERA v10.0 (Archive) ---
    const v10Code = `<!DOCTYPE html><html><head><title>GemiOS v10</title><style>body{background:#008080;font-family:Tahoma;overflow:hidden;margin:0;user-select:none;}#tb{position:absolute;bottom:0;width:100%;height:35px;background:#c0c0c0;border-top:2px solid #fff;display:flex;align-items:center;z-index:9999;}#sm{position:absolute;bottom:35px;left:0;width:200px;background:#c0c0c0;border:2px outset #fff;display:none;flex-direction:column;z-index:10000;}.app{padding:10px;cursor:pointer;border-bottom:1px solid #a0a0a0;font-weight:bold;}.app:hover{background:#000080;color:#fff;}#wins{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;}.win{position:absolute;background:#c0c0c0;border:2px outset #fff;width:300px;pointer-events:auto;box-shadow:2px 2px 5px rgba(0,0,0,0.5);}.tb-title{background:#000080;color:#fff;padding:5px;cursor:grab;display:flex;justify-content:space-between;font-weight:bold;}#v10-escape{position:absolute;top:10px;right:10px;background:red;color:white;font-weight:bold;padding:10px;border:2px solid white;border-radius:5px;cursor:pointer;z-index:9999;}</style></head><body><button id="v10-escape" onclick="localStorage.setItem('GemiOS_TargetVersion', 'v26'); location.reload();">🚀 Escape to Modern OS</button><div style="position:absolute;top:20px;left:20px;color:white;cursor:pointer;text-align:center;width:60px;" onclick="openW('Notepad')"><div style="font-size:30px;">📝</div>Notepad</div><div id="wins"></div><div id="sm"><div style="background:#000080;color:white;padding:10px;font-weight:bold;">GemiOS v10</div><div class="app" onclick="openW('Terminal')">💻 Terminal</div><div class="app" onclick="alert('Games not yet invented!')">🏓 Pong</div><div class="app" onclick="localStorage.setItem('GemiOS_TargetVersion', 'v26');location.reload();">🚀 Upgrade to Modern</div></div><div id="tb"><button onclick="document.getElementById('sm').style.display=document.getElementById('sm').style.display==='flex'?'none':'flex'" style="font-weight:bold;margin-left:2px;padding:2px 10px;border:2px outset #fff;cursor:pointer;height:28px;">Start</button></div><script>let z=10;function openW(t){let w=document.createElement('div');w.className='win';w.style.top=Math.random()*50+50+'px';w.style.left=Math.random()*50+100+'px';w.style.zIndex=++z;w.innerHTML='<div class="tb-title" onmousedown="dragW(event, this.parentElement)"><span>'+t+'</span><button onclick="this.parentElement.parentElement.remove()" style="font-weight:bold;">X</button></div><div style="padding:15px;background:#fff;min-height:100px;">'+t+' v10 App Loaded.<br><br>The TreeFS architecture does not exist yet.</div>';document.getElementById('wins').appendChild(w);}function dragW(e,win){let ox=e.clientX-win.offsetLeft;let oy=e.clientY-win.offsetTop;win.style.zIndex=++z;document.onmousemove=(ev)=>{win.style.left=(ev.clientX-ox)+'px';win.style.top=(ev.clientY-oy)+'px';};document.onmouseup=()=>document.onmousemove=null;}</script></body></html>`;
    document.open(); document.write(v10Code); document.close();

} else if (bootVersion === 'v20') {
    // --- KERNEL 3: THE PURE SYSTEM v20.0 (Archive) ---
    const v20Code = `<!DOCTYPE html><html><head><title>GemiOS v20 PURE</title><style>body{background:#000;color:#0f0;font-family:monospace;overflow:hidden;margin:0;user-select:none;}#tb{position:absolute;bottom:0;width:100%;height:30px;border-top:1px solid #0f0;background:#050505;display:flex;align-items:center;padding:0 10px;box-sizing:border-box;}#sm{position:absolute;bottom:35px;left:5px;border:1px solid #0f0;background:#000;display:none;flex-direction:column;padding:5px;z-index:10000;}.app{cursor:pointer;padding:8px;}.app:hover{background:#0f0;color:#000;font-weight:bold;}#wins{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;}.win{position:absolute;border:1px solid #0f0;background:#050505;width:400px;pointer-events:auto;box-shadow:5px 5px 0 #0f0;}.tb-title{border-bottom:1px solid #0f0;padding:5px;cursor:grab;display:flex;justify-content:space-between;background:#111;color:#0f0;}</style></head><body><div style="padding:20px;font-size:16px;">[GemiOS PURE KERNEL v20]<br>WARNING: GAMES BANNED. RESOURCES LOCKED.<br><br>Use the [MENU] below to access tools.</div><div id="wins"></div><div id="sm"><div class="app" onclick="openW('Terminal')">> Root Terminal</div><div class="app" onclick="alert('ACCESS DENIED. Games are disabled in v20.')">> GemiPong</div><div class="app" onclick="localStorage.setItem('GemiOS_TargetVersion', 'v26');location.reload();" style="color:#ff00cc;">> Upgrade Kernel (Hotswap)</div></div><div id="tb"><div onclick="document.getElementById('sm').style.display=document.getElementById('sm').style.display==='flex'?'none':'flex'" style="cursor:pointer;border:1px solid #0f0;padding:2px 10px;">[ MENU ]</div><div style="margin-left:auto;margin-right:20px;">v20.0 PURE KERNEL</div></div><script>let z=10;function openW(t){let w=document.createElement('div');w.className='win';w.style.top=Math.random()*50+50+'px';w.style.left=Math.random()*50+50+'px';w.style.zIndex=++z;w.innerHTML='<div class="tb-title" onmousedown="dragW(event, this.parentElement)"><span>'+t+'</span><span style="cursor:pointer;" onclick="this.parentElement.parentElement.remove()">[X]</span></div><div style="padding:15px;height:200px;">C:\\> _</div>';document.getElementById('wins').appendChild(w);}function dragW(e,win){let ox=e.clientX-win.offsetLeft;let oy=e.clientY-win.offsetTop;win.style.zIndex=++z;document.onmousemove=(ev)=>{win.style.left=(ev.clientX-ox)+'px';win.style.top=(ev.clientY-oy)+'px';};document.onmouseup=()=>document.onmousemove=null;}</script></body></html>`;
    document.open(); document.write(v20Code); document.close();

} else {
    // =====================================================================
    // KERNEL 4: GEMIOS v26.1.0 TITANIUM (MODERN OS)
    // =====================================================================
    
    class VirtualFileSystem {
        constructor() {
            let drive = localStorage.getItem('GemiOS_TreeFS');
            if(!drive) {
                this.root = {
                    "C:": {
                        "System": { "boot.log": "GemiOS Kernel Initialized.\nSystem OK.", "users.json": '{"Admin":""}' },
                        "Users": { "Admin": { "Documents": {}, "Pictures": {}, "Desktop": {} } }
                    }
                };
                this.save();
            } else { this.root = JSON.parse(drive); }
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
            let html = `
                <div class="win" id="${wid}" data-maximized="false" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${width}px; z-index:${++this.zIndex}; pointer-events:auto;" onmousedown="GemiOS.WM.focus('${wid}')">
                    <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event, '${wid}')">
                        <span>${title}</span> 
                        <div>
                            <button class="ctrl-btn min-btn" onclick="GemiOS.WM.minimize('${wid}', '${pid}')">-</button>
                            <button class="ctrl-btn close-btn" onclick="GemiOS.PM.kill(${pid})">X</button>
                        </div>
                    </div>
                    <div class="content" id="content_${pid}">${content}</div>
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
            document.onmouseup = () => { document.onmousemove = null; w.style.transition = 'width 0.3s, height 0.3s, top 0.3s, left 0.3s, background 0.3s, color 0.3s'; document.onmouseup = null; };
        }
        maximize(wid) {
            let w = document.getElementById(wid); if(!w) return;
            if(w.dataset.maximized === "true") { w.style.top = w.dataset.pT; w.style.left = w.dataset.pL; w.style.width = w.dataset.pW; w.style.height = w.dataset.pH; w.dataset.maximized = "false"; } 
            else { w.dataset.pT = w.style.top; w.dataset.pL = w.style.left; w.dataset.pW = w.style.width; w.dataset.pH = w.style.height; w.style.top = "0px"; w.style.left = "0px"; w.style.width = "100vw"; w.style.height = "calc(100vh - 50px)"; w.dataset.maximized = "true"; }
        }
        minimize(wid, pid) {
            let w = document.getElementById(wid); if(!w) return;
            if(w.style.display === 'none') { w.style.display = 'flex'; this.focus(wid); document.getElementById('tb-item-'+pid).style.opacity = '1'; } 
            else { w.style.display = 'none'; document.getElementById('tb-item-'+pid).style.opacity = '0.5'; }
        }
        updateTaskbar(pid, title) { document.getElementById('taskbar-apps').innerHTML += `<div id="tb-item-${pid}" class="tb-item" onclick="GemiOS.WM.minimize('win_${pid}', '${pid}')">${title.substring(0,8)}</div>`; }
        removeWindow(pid) { if(this.windows[pid]) { this.windows[pid].remove(); delete this.windows[pid]; } let tbItem = document.getElementById('tb-item-'+pid); if(tbItem) tbItem.remove(); }
    }

    class ProcessManager {
        constructor() { this.processes = {}; this.pidCounter = 1000; }
        launch(appId) {
            document.getElementById('start-menu').style.display = 'none';
            if(!GemiOS.Registry[appId]) return;
            let pid = ++this.pidCounter; let app = GemiOS.Registry[appId];
            this.processes[pid] = { id: appId, title: app.title };
            GemiOS.WM.createWindow(pid, app.title, app.html(pid), app.width);
            if(app.onLaunch) app.onLaunch(pid);
        }
        kill(pid) {
            if(!this.processes[pid]) return;
            let appId = this.processes[pid].id;
            if(GemiOS.Registry[appId].onKill) GemiOS.Registry[appId].onKill(pid);
            GemiOS.WM.removeWindow(pid); delete this.processes[pid];
        }
    }

    const AppRegistry = {
        'sys_term': {
            icon: '⌨️', title: 'Bash Terminal', width: 500,
            html: (pid) => `<div id="t-out-${pid}" style="background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; height:280px; overflow-y:auto; border-radius:6px; box-shadow:inset 0 0 10px rgba(0,0,0,0.8);">GemiOS TreeFS Terminal<br>Type 'help' for commands</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span id="t-path-${pid}" style="color:#0078d7; margin-right:8px; font-weight:bold;">C:/Users/Admin></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`,
            onLaunch: (pid) => { GemiOS.termStates[pid] = 'C:/Users/Admin'; setTimeout(()=>document.getElementById(`t-in-${pid}`).focus(),100); }
        },
        'sys_drive': {
            icon: '🗂️', title: 'Explorer 2.0', width: 480,
            html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center; background:rgba(0,120,215,0.2);"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px; border-color:#0078d7;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:inherit; border:none; font-weight:bold; font-size:14px; outline:none;"></div><div id="d-list-${pid}" style="max-height:300px; min-height:200px; overflow-y:auto; display:grid; grid-template-columns:repeat(4, 1fr); gap:10px;"></div>`,
            onLaunch: (pid) => { GemiOS.driveStates[pid] = 'C:'; GemiOS.renderDrive(pid); }
        },
        'sys_set': {
            icon: '⚙️', title: 'System Settings', width: 420,
            html: () => `<div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary">Apply Wallpaper</button></div><button onclick="localStorage.removeItem('GemiOS_Wall'); location.reload();" class="btn-sec">Reset Default</button><button onclick="GemiOS.VFS.format();" class="btn-danger">Format System (Erase All Data)</button>`
        },
        'sys_update': {
            icon: '💻', title: 'Local Updater', width: 380,
            html: () => `<div class="sys-card" style="text-align:center;"><div style="font-size:40px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">💻</div><h3 style="margin:5px 0;">VS Code Update Center</h3><p style="font-size:13px; opacity:0.8;">Kernel: <b id="kern-ver">v26.1.0-LOCAL</b></p><div id="upd-stat" style="font-size:12px; min-height:15px;"></div><button id="upd-btn" onclick="GemiOS.triggerOTA(this)" class="btn-primary" style="margin-top:10px;">Check for Local Updates</button></div>`
        },
        'sys_time': {
            icon: '⏳', title: 'Time Machine', width: 360,
            html: () => `<div style="text-align:center; font-size:45px; margin-bottom:15px; filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3));">⏳</div><p style="text-align:center; font-size:12px; margin-top:0;">Boot into historical code.</p><button onclick="localStorage.setItem('GemiOS_TargetVersion', 'v1'); location.reload();" class="btn-sec" style="font-family:monospace;">Boot v1.0 (Web Sim)</button><button onclick="localStorage.setItem('GemiOS_TargetVersion', 'v10'); location.reload();" class="btn-sec" style="font-family:monospace;">Boot v10.0 (Start Menu)</button><button onclick="localStorage.setItem('GemiOS_TargetVersion', 'v20'); location.reload();" class="btn-sec" style="font-family:monospace;">Boot v20.0 (Pure System)</button><button onclick="location.reload();" class="btn-primary">Stay on v26.1</button>`
        },
        'sys_task': {
            icon: '📊', title: 'Task Manager', width: 400,
            html: (pid) => `<div class="sys-card" style="border-left: 4px solid #ff4d4d;"><b>Active PIDs</b></div><div id="tm-list-${pid}" style="max-height:300px; overflow-y:auto;"></div>`,
            onLaunch: (pid) => {
                GemiOS.tmItvs = GemiOS.tmItvs || {};
                GemiOS.tmItvs[pid] = setInterval(() => {
                    let h = '';
                    for(let p in GemiOS.PM.processes) h += `<div style="padding:8px; background:rgba(255,255,255,0.1); margin-bottom:5px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px;">${GemiOS.PM.processes[p].title} [${p}]</span><button onclick="GemiOS.PM.kill(${p})" class="btn-danger" style="padding:4px 8px; width:auto; font-size:11px;">Kill</button></div>`;
                    let el = document.getElementById(`tm-list-${pid}`); if(el) el.innerHTML = h;
                }, 1000);
            },
            onKill: (pid) => clearInterval(GemiOS.tmItvs[pid])
        },
        'sys_log': {
            icon: '📋', title: 'Chronicles', width: 500,
            html: () => `<div style="max-height: 400px; overflow-y: auto; padding-right: 5px;">
                <div class="sys-card" style="border-left:4px solid #38ef7d;"><b>v26.1.0 (Time Machine)</b> - Expanded Time Machine to include v10.0 and v20.0 legacy kernels.</div>
                <div class="sys-card"><b>v26.0.0 (Hardware)</b> - Dynamic Desktop Engine. Added GemiCam and Gallery Viewer.</div>
                <div class="sys-card"><b>v25.1.3 (Stable)</b> - Repaired missing core methods. Boot sequence verified.</div>
                <div class="sys-card"><b>v25.1.0 (Auth Update)</b> - Added Real Boot Sequence, Login Screen, and Context Menus.</div>
                <div class="sys-card"><b>v25.0.0 (TreeFS)</b> - Architectural rewrite to hierarchical file system.</div>
                <div class="sys-card"><b>v24.1.0 (Hot-Swap)</b> - Over-the-air kernel patching introduced.</div>
                <div class="sys-card"><b>v24.0.0 (Titanium)</b> - Full OOP rewrite.</div>
                <div class="sys-card"><b>v1.0 (Legacy Web Sim)</b> - The True Original.</div>
            </div>`
        },
        'app_cam': {
            icon: '📸', title: 'GemiCam', width: 500,
            html: (pid) => `<div style="background:#000; border-radius:6px; overflow:hidden; position:relative;"><video id="vid-${pid}" autoplay playsinline style="width:100%; height:350px; object-fit:cover;"></video><button onclick="GemiOS.takePhoto(${pid})" style="position:absolute; bottom:15px; left:50%; transform:translateX(-50%); padding:12px 25px; border-radius:25px; border:2px solid white; background:#ff4d4d; color:white; font-weight:bold; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.5);">📸 Capture</button></div>`,
            onLaunch: (pid) => {
                navigator.mediaDevices.getUserMedia({video:true}).then(s => {
                    let v = document.getElementById(`vid-${pid}`);
                    if(v) { v.srcObject = s; GemiOS.camStreams = GemiOS.camStreams || {}; GemiOS.camStreams[pid] = s; }
                }).catch(e => { document.getElementById(`content_${pid}`).innerHTML = `<div class="sys-card" style="color:#ff4d4d;">Camera access denied or hardware unavailable.</div>`; });
            },
            onKill: (pid) => { if(GemiOS.camStreams && GemiOS.camStreams[pid]) GemiOS.camStreams[pid].getTracks().forEach(t=>t.stop()); }
        },
        'app_view': {
            icon: '🖼️', title: 'Gallery', width: 550,
            html: (pid) => {
                let pics = GemiOS.VFS.getDir('C:/Users/Admin/Pictures') || {};
                let h = '';
                for(let p in pics) { h += `<img src="${pics[p]}" style="width:100%; border-radius:6px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.2);">`; }
                if(h === '') h = '<div style="text-align:center; padding:40px; opacity:0.5; font-size:18px;">No photos found in C:/Users/Admin/Pictures.<br>Use GemiCam to take one!</div>';
                return `<div style="max-height:450px; overflow-y:auto; padding-right:5px;">${h}</div>`;
            }
        },
        'app_code': {
            icon: '&lt;/&gt;', title: 'GemiCode IDE', width: 800,
            html: (pid) => {
                let def = "<html>\\n<body style='color:white; font-family:sans-serif;'>\\n  <h2>Live Preview!</h2>\\n</body>\\n</html>";
                return `<div style="display:flex; height:400px; gap:10px;"><textarea id="ide-in-${pid}" oninput="document.getElementById('ide-out-${pid}').srcdoc=this.value" style="flex:1; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:10px; border:none; border-radius:6px; resize:none; outline:none;" spellcheck="false">${def}</textarea><iframe id="ide-out-${pid}" style="flex:1; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:6px;" srcdoc="${def}"></iframe></div>`;
            }
        },
        'sys_browser': {
            icon: '🌐', title: 'Web Browser', width: 750,
            html: (pid) => `<div style="display:flex; gap:8px; margin-bottom:10px;"><input type="text" id="b-url-${pid}" value="https://wikipedia.org" style="flex-grow:1; padding:8px 12px; border-radius:20px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black; box-shadow:inset 0 2px 4px rgba(0,0,0,0.1);"><button onclick="document.getElementById('b-frame-${pid}').src=document.getElementById('b-url-${pid}').value" style="padding:8px 16px; border-radius:20px; border:none; background:#0078d7; color:white; font-weight:bold; cursor:pointer;">Go</button></div><iframe id="b-frame-${pid}" src="https://wikipedia.org" style="width:100%; height:450px; border:none; border-radius:8px; background:white; box-shadow:inset 0 2px 10px rgba(0,0,0,0.1);"></iframe>`
        },
        'app_note': {
            icon: '📝', title: 'Notepad', width: 400,
            html: () => `<textarea oninput="GemiOS.VFS.write('C:/Users/Admin/Documents', 'note.txt', this.value)" style="width:100%; height:300px; box-sizing:border-box; resize:none; border:none; border-radius:6px; padding:15px; font-family:'Inter', sans-serif; font-size:14px; outline:none; background:rgba(255,255,255,0.9); color:black;">${GemiOS.VFS.read('C:/Users/Admin/Documents', 'note.txt') || ''}</textarea>`
        },
        'app_calc': {
            icon: '🧮', title: 'Calculator', width: 260,
            html: (pid) => `<div style="background:rgba(255,255,255,0.9); color:black; padding:15px; font-size:28px; text-align:right; margin-bottom:10px; border-radius:6px; font-family:monospace;" id="cd-${pid}">0</div><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px;">${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="padding:15px; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.1); cursor:pointer; font-weight:bold; border-radius:6px; color:inherit; font-size:16px;" onclick="let d=document.getElementById('cd-${pid}'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') { try { d.innerText=eval(d.innerText); } catch(e){ d.innerText='Err'; } } else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}</div>`
        },
        'app_paint': {
            icon: '🎨', title: 'GemiPaint', width: 600,
            html: (pid) => `<div style="margin-bottom:10px; display:flex; gap:10px; align-items:center;"><button onclick="const c=document.getElementById('cvs-${pid}'); c.getContext('2d').clearRect(0,0,c.width,c.height);" class="btn-sec" style="width:auto; margin:0; padding:6px 12px;">Clear</button> <input type="color" id="p-col-${pid}" value="#000000" style="cursor:pointer;"></div><canvas id="cvs-${pid}" style="background:white; border-radius:6px; width:100%; height:400px; cursor:crosshair; box-shadow:inset 0 0 10px rgba(0,0,0,0.1);"></canvas>`,
            onLaunch: (pid) => {
                setTimeout(() => {
                    const can = document.getElementById(`cvs-${pid}`); if(!can) return;
                    can.width = can.offsetWidth; can.height = can.offsetHeight;
                    const ctx = can.getContext('2d'); let drawing = false;
                    can.onmousedown = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
                    can.onmouseup = () => drawing = false; can.onmouseout = () => drawing = false;
                    can.onmousemove = (e) => { if(drawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle = document.getElementById(`p-col-${pid}`).value; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); } };
                }, 100);
            }
        },
        'app_synth': {
            icon: '🎹', title: "GemiSynth", width: 340,
            html: () => `<div style="text-align:center; margin-bottom:10px; font-weight:bold;">Mini Synthesizer</div><div style="display:flex; justify-content:center; position:relative; background:#111; padding:15px; border-radius:8px;"><div class="synth-key" onclick="GemiOS.playNote(261.63)">C</div><div class="synth-key synth-black" onclick="GemiOS.playNote(277.18)">C#</div><div class="synth-key" onclick="GemiOS.playNote(293.66)">D</div><div class="synth-key synth-black" onclick="GemiOS.playNote(311.13)">D#</div><div class="synth-key" onclick="GemiOS.playNote(329.63)">E</div><div class="synth-key" onclick="GemiOS.playNote(349.23)">F</div><div class="synth-key synth-black" onclick="GemiOS.playNote(369.99)">F#</div><div class="synth-key" onclick="GemiOS.playNote(392.00)">G</div><div class="synth-key synth-black" onclick="GemiOS.playNote(415.30)">G#</div><div class="synth-key" onclick="GemiOS.playNote(440.00)">A</div><div class="synth-key synth-black" onclick="GemiOS.playNote(466.16)">A#</div><div class="synth-key" onclick="GemiOS.playNote(493.88)">B</div></div>`
        },
        'app_sweeper': {
            icon: '💣', title: "GemiSweeper", width: 290,
            html: (pid) => `<div style="text-align:center; margin-bottom:10px;"><button onclick="GemiOS.initSweeper(${pid})" class="btn-primary" style="width:auto; padding:6px 15px;">Restart</button></div><div id="ms-grid-${pid}" style="display:grid; grid-template-columns:repeat(9,25px); gap:2px; justify-content:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px;"></div>`,
            onLaunch: (pid) => GemiOS.initSweeper(pid)
        },
        'app_ttt': {
            icon: '❌', title: "Tic-Tac-Toe", width: 260,
            html: (pid) => `<div id="ttt-stat-${pid}" style="text-align:center; font-weight:bold; font-size:18px; margin-bottom:15px; color:#4db8ff;">Player X Turn</div><div id="ttt-b-${pid}" style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px;"></div><div style="text-align:center; margin-top:15px;"><button onclick="GemiOS.initTTT(${pid})" class="btn-sec">Reset</button></div>`,
            onLaunch: (pid) => GemiOS.initTTT(pid)
        },
        'app_pong': {
            icon: '🏓', title: 'GemiPong 3.0', width: 420,
            html: (pid) => `<canvas id="pong-cvs-${pid}" width="380" height="240" style="background:#0a0a0a; border-radius:8px; box-shadow:inset 0 5px 15px rgba(0,0,0,0.5); display:block; margin:0 auto; cursor:none;"></canvas>`,
            onLaunch: (pid) => { setTimeout(() => {
                let cvs = document.getElementById(`pong-cvs-${pid}`); if(!cvs) return; let ctx = cvs.getContext('2d');
                let pY=100, cY=100, bX=190, bY=120, bDX=4, bDY=2;
                cvs.onmousemove = (e) => pY = Math.max(0, Math.min(190, e.offsetY - 25));
                GemiOS.pongItvs = GemiOS.pongItvs || {};
                GemiOS.pongItvs[pid] = setInterval(() => {
                    if(!document.getElementById(`pong-cvs-${pid}`)) { clearInterval(GemiOS.pongItvs[pid]); return; }
                    bX+=bDX; bY+=bDY;
                    if(bY<=5 || bY>=235) bDY=-bDY;
                    if(bX<=15 && bY>pY && bY<pY+50) { bDX=Math.abs(bDX)+0.2; bDY=(bY-(pY+25))*0.25; }
                    if(bX>=365 && bY>cY && bY<cY+50) { bDX=-Math.abs(bDX)-0.2; bDY=(bY-(cY+25))*0.25; }
                    if(bX<0 || bX>380) { bX=190; bY=120; bDX=bDX>0?-4:4; bDY=(Math.random()-0.5)*4; }
                    cY += (bY-(cY+25))*0.1; cY = Math.max(0, Math.min(190, cY));
                    ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,380,240);
                    ctx.fillStyle='#4db8ff'; ctx.fillRect(5,pY,8,50); ctx.fillStyle='#ff4d4d'; ctx.fillRect(367,cY,8,50); 
                    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(bX,bY,5,0,Math.PI*2); ctx.fill(); 
                }, 30);
            }, 100); },
            onKill: (pid) => clearInterval(GemiOS.pongItvs[pid])
        },
        'app_snake': {
            icon: '🐍', title: "Snake", width: 340,
            html: (pid) => { let hs = localStorage.getItem('GemiOS_SnakeHS') || 0; return `<div style="text-align:center; margin-bottom:10px; font-weight:bold;">Score: <b id="sn-score-${pid}" style="color:#38ef7d;">0</b> | High: <b id="sn-hs-${pid}" style="color:#4db8ff;">${hs}</b></div><canvas id="sn-cvs-${pid}" width="300" height="300" style="background:#0a0a0a; display:block; margin:0 auto; border-radius:8px; box-shadow:inset 0 0 15px rgba(0,0,0,0.8);"></canvas>`; },
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
        }

        init() {
            this.injectStyles();
            this.patchDesktopData();
            if(sessionStorage.getItem('GemiOS_Session') === 'active') {
                this.launchDesktop();
            } else {
                this.runBootSequence();
            }
        }
        
        patchDesktopData() {
            let desk = this.VFS.getDir('C:/Users/Admin/Desktop', true);
            if(Object.keys(desk).length === 0) {
                this.VFS.write('C:/Users/Admin/Desktop', 'Explorer.app', 'sys_drive');
                this.VFS.write('C:/Users/Admin/Desktop', 'Terminal.app', 'sys_term');
                this.VFS.write('C:/Users/Admin/Desktop', 'Browser.app', 'sys_browser');
                this.VFS.write('C:/Users/Admin/Desktop', 'Camera.app', 'app_cam');
                this.VFS.write('C:/Users/Admin/Desktop', 'Gallery.app', 'app_view');
                this.VFS.write('C:/Users/Admin/Desktop', 'Settings.app', 'sys_set');
            }
        }
        
        runBootSequence() {
            document.body.innerHTML = `
                <div style="background:black; color:#ddd; font-family:monospace; height:100vh; width:100vw; padding:20px; box-sizing:border-box;" id="boot-screen">
                    <div id="boot-logs"></div>
                </div>
            `;
            let logs = [
                "GemiOS BIOS v5.0", "Initializing Hardware API...", "Mounting WebRTC Camera Drivers... OK", 
                "Mounting Dynamic Desktop Engine... OK", "Loading Object-Oriented Framework... OK",
                "Starting GemiOS Display Manager..."
            ];
            let target = document.getElementById('boot-logs'); let i = 0;
            let logItv = setInterval(() => {
                if(i < logs.length) { target.innerHTML += '> ' + logs[i] + '<br>'; i++; } 
                else { clearInterval(logItv); setTimeout(() => this.showLoginScreen(), 800); }
            }, 300);
        }
        
        showLoginScreen() {
            document.body.innerHTML = `
                <div id="desktop-bg" style="filter:blur(10px) brightness(0.7);"></div>
                <div style="position:absolute; top:0; left:0; width:100vw; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; z-index:999;">
                    <div style="font-size:70px; background:rgba(255,255,255,0.2); border-radius:50%; width:120px; height:120px; display:flex; justify-content:center; align-items:center; margin-bottom:20px; border:2px solid rgba(255,255,255,0.4); box-shadow:0 10px 25px rgba(0,0,0,0.5);">👤</div>
                    <h2 style="margin:0 0 20px 0; font-size:28px;">Admin</h2>
                    <button onclick="GemiOS.authenticate()" style="padding:12px 30px; background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.5); border-radius:20px; font-size:16px; cursor:pointer; font-weight:bold; transition:0.3s; backdrop-filter:blur(5px);" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">Sign In</button>
                </div>
            `;
            this.loadWallpaper(); 
        }
        
        authenticate() { sessionStorage.setItem('GemiOS_Session', 'active'); this.launchDesktop(); }

        launchDesktop() {
            this.buildUI(); this.renderDesktopIcons(); this.applyTheme(); this.loadWallpaper(); this.startClock(); this.initContextMenu();
            window.dragWidget = function(e, id) {
                if(e.target.tagName === 'TEXTAREA') return; 
                let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
                document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
                document.onmouseup = () => document.onmousemove = null;
            };
        }
        
        renderDesktopIcons() {
            let desk = this.VFS.getDir('C:/Users/Admin/Desktop');
            let html = '';
            let i = 0;
            for(let file in desk) {
                if(file.endsWith('.app')) {
                    let appId = desk[file];
                    let app = this.Registry[appId];
                    if(app) {
                        let top = 20 + (i % 6) * 100;
                        let left = 20 + Math.floor(i / 6) * 100;
                        html += `<div class="icon" style="top:${top}px; left:${left}px;" onclick="GemiOS.PM.launch('${appId}')"><div>${app.icon}</div>${file.replace('.app','')}</div>`;
                        i++;
                    }
                }
            }
            document.getElementById('desktop-icons').innerHTML = html;
        }

        takePhoto(pid) {
            let v = document.getElementById(`vid-${pid}`);
            if(!v || !v.srcObject) return alert("Camera not active.");
            let c = document.createElement('canvas'); 
            c.width = v.videoWidth; c.height = v.videoHeight;
            c.getContext('2d').drawImage(v, 0, 0);
            let data = c.toDataURL('image/jpeg');
            let name = 'Photo_' + new Date().getTime() + '.jpg';
            this.VFS.write('C:/Users/Admin/Pictures', name, data);
            alert(`Photo captured and saved to C:/Users/Admin/Pictures/${name}`);
        }

        initContextMenu() {
            document.body.addEventListener('contextmenu', (e) => {
                if(e.target.id === 'os-root' || e.target.id === 'desktop-bg' || e.target.id === 'desktop-icons') {
                    e.preventDefault();
                    let menu = document.getElementById('context-menu');
                    menu.style.display = 'block'; menu.style.left = e.pageX + 'px'; menu.style.top = e.pageY + 'px';
                }
            });
            document.body.addEventListener('click', () => { let cm = document.getElementById('context-menu'); if (cm) cm.style.display = 'none'; });
        }

        async triggerOTA(btn) {
            btn.innerText = 'Pinging Local Server...'; btn.style.background = '#444';
            let st = document.getElementById('upd-stat'); st.innerText = 'Fetching version.json...';
            try {
                let cb = "?t=" + new Date().getTime();
                // Assumes you are using Live Server locally for VS Code
                let r = await fetch("./version.json" + cb);
                if (!r.ok) throw new Error("Server unreachable.");
                let d = await r.json();
                
                if (d.version !== "26.1.0-TIMEMACHINE") {
                    st.innerHTML = `<span style="color:#ffeb3b">New Version Found: ${d.version}</span><br><i>${d.notes}</i>`;
                    btn.innerText = 'Emulate Live Install'; btn.style.background = '#ff00cc'; 
                    btn.onclick = async () => {
                        document.getElementById('ota-overlay').style.display = 'flex';
                        let fill = document.getElementById('ota-fill'); let text = document.getElementById('ota-text'); let p = 0;
                        let simItv = setInterval(() => {
                            p += Math.random() * 8;
                            if(p >= 100) {
                                p = 100; clearInterval(simItv); text.innerText = "100% - Writing to Virtual NVRAM...";
                                setTimeout(() => { document.getElementById('ota-title').innerText = "System Patched"; document.getElementById('ota-restart-prompt').style.display = 'flex'; }, 800);
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
            s.b[i] = s.p; btn.innerText = s.p; btn.style.color = s.p==='X'?'#0078d7':'#ff4d4d'; btn.style.background = 'rgba(255,255,255,0.9)'; btn.style.boxShadow = 'none';
            const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            let won = lines.some(l => s.b[l[0]] && s.b[l[0]]===s.b[l[1]] && s.b[l[0]]===s.b[l[2]]);
            let stat = document.getElementById(`ttt-stat-${pid}`);
            if(won) { stat.innerText = `${s.p} Wins!`; stat.style.color = "#38ef7d"; s.a = false; }
            else if(!s.b.includes('')) { stat.innerText = "Draw!"; stat.style.color = "white"; s.a = false; }
            else { s.p = s.p === 'X' ? 'O' : 'X'; stat.innerText = `Player ${s.p} Turn`; stat.style.color = s.p==='X'?'#4db8ff':'#ff4d4d';}
        }

        playNote(freq) {
            if(!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)();
            let osc = this.actx.createOscillator(); let gain = this.actx.createGain();
            osc.type = 'sine'; osc.frequency.value = freq;
            osc.connect(gain); gain.connect(this.actx.destination);
            osc.start(); gain.gain.exponentialRampToValueAtTime(0.00001, this.actx.currentTime + 1); osc.stop(this.actx.currentTime + 1);
        }

        handleTerm(e, pid, inputEl) {
            if(e.key !== 'Enter') return;
            let cmd = inputEl.value.trim(); inputEl.value = '';
            let out = document.getElementById(`t-out-${pid}`); let currPath = this.termStates[pid];
            out.innerHTML += `<br><span style="color:#0078d7">${currPath}></span> ${cmd}`;
            let args = cmd.split(' '); let base = args[0].toLowerCase();
            try {
                if(base === 'help') { out.innerHTML += '<br>cmds: ls, cd [dir], mkdir [dir], echo [text] > [file], cat [file], rm [file], clear'; }
                else if(base === 'clear') { out.innerHTML = ''; }
                else if(base === 'ls' || base === 'dir') {
                    let dir = this.VFS.getDir(currPath);
                    if(!dir) out.innerHTML += '<br>Directory not found.';
                    else {
                        let keys = Object.keys(dir);
                        if(keys.length===0) out.innerHTML += '<br>(Empty)';
                        else keys.forEach(k => out.innerHTML += `<br>${typeof dir[k]==='object' ? '[DIR] ' : '[FILE] '} ${k}`);
                    }
                }
                else if(base === 'cd') {
                    let target = args[1];
                    if(!target) out.innerHTML += '<br>Usage: cd [directory] or cd ..';
                    else if(target === '..') {
                        let parts = currPath.split('/'); if(parts.length > 1) parts.pop();
                        this.termStates[pid] = parts.join('/') || 'C:';
                    } else {
                        let newPath = currPath + '/' + target;
                        if(this.VFS.getDir(newPath) && typeof this.VFS.getDir(newPath) === 'object') this.termStates[pid] = newPath;
                        else out.innerHTML += '<br>Directory not found.';
                    }
                }
                else if(base === 'mkdir') {
                    if(!args[1]) out.innerHTML += '<br>Usage: mkdir [folder_name]';
                    else if(this.VFS.mkdir(currPath, args[1])) out.innerHTML += '<br>Directory created.';
                    else out.innerHTML += '<br>Failed to create directory.';
                }
                else if(base === 'rm') {
                    if(!args[1]) out.innerHTML += '<br>Usage: rm [file_name]';
                    else {
                        let dir = this.VFS.getDir(currPath);
                        if(dir && dir[args[1]] !== undefined) { delete dir[args[1]]; this.VFS.save(); out.innerHTML += '<br>Deleted.'; this.renderDesktopIcons(); }
                        else out.innerHTML += '<br>File not found.';
                    }
                }
                else if(base === 'echo') {
                    let str = cmd.substring(5);
                    if(str.includes('>')) {
                        let parts = str.split('>'); let text = parts[0].trim().replace(/"/g, '').replace(/'/g, ''); let file = parts[1].trim();
                        if(this.VFS.write(currPath, file, text)) { out.innerHTML += `<br>File ${file} saved.`; this.renderDesktopIcons(); }
                    } else { out.innerHTML += '<br>' + str; }
                }
                else if(base === 'cat') {
                    if(!args[1]) out.innerHTML += '<br>Usage: cat [file_name]';
                    else {
                        let data = this.VFS.read(currPath, args[1]);
                        if(data !== null) out.innerHTML += `<br>${data}`;
                        else out.innerHTML += '<br>File not found.';
                    }
                }
                else if(base !== '') { out.innerHTML += `<br>Command not found: ${base}`; }
            } catch(err) { out.innerHTML += `<br>Error: ${err.message}`; }
            
            document.getElementById(`t-path-${pid}`).innerText = this.termStates[pid] + '>';
            out.scrollTop = out.scrollHeight;
        }

        renderDrive(pid) {
            let path = this.driveStates[pid]; document.getElementById(`d-path-${pid}`).value = path;
            let list = document.getElementById(`d-list-${pid}`); let dir = this.VFS.getDir(path); let html = '';
            for(let k in dir) {
                if(typeof dir[k] === 'object') {
                    html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(0,0,0,0.2); border-radius:6px; transition:0.2s;" onmouseover="this.style.background='rgba(0,120,215,0.4)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'" onclick="GemiOS.navDrive(${pid}, '${k}')"><div style="font-size:30px;">📁</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`;
                } else {
                    html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px;" onclick="alert('File Contents:\\n\\n${dir[k]}')"><div style="font-size:30px;">📄</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`;
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

        injectStyles() {
            const s = document.createElement('style');
            s.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                body { margin:0; overflow:hidden; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Inter', sans-serif; color:white; user-select:none; transition: background 0.6s ease, color 0.6s ease;}
                body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #222; }
                ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; } body.light-mode ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
                .win { position:absolute; background:rgba(20, 30, 40, 0.65); backdrop-filter: blur(25px) saturate(180%); -webkit-backdrop-filter: blur(25px) saturate(180%); color:white; border-radius:12px; box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.15); display: flex; flex-direction: column; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s; pointer-events:auto;}
                @keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                body.light-mode .win { background: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.4); color: #222; box-shadow: 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }
                .title-bar { padding:10px 15px; font-weight:600; font-size: 14px; display:flex; justify-content:space-between; align-items: center; border-bottom:1px solid rgba(255,255,255,0.1); cursor:grab; }
                body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.1); }
                .content { padding:15px; flex-grow: 1; overflow-y: auto; }
                .ctrl-btn { border:none; color:white; cursor:pointer; width: 20px; height: 20px; border-radius:50%; font-weight:bold; font-size: 10px; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; margin-left: 5px; }
                .close-btn { background:rgba(255, 77, 77, 0.8); } .close-btn:hover { background:#ff4d4d; transform: scale(1.1); }
                .min-btn { background:rgba(255, 180, 0, 0.8); } .min-btn:hover { background:#ffb400; transform: scale(1.1); }
                #taskbar { position:absolute; bottom:0; width:100%; height:50px; background:rgba(10, 15, 20, 0.75); backdrop-filter:blur(20px) saturate(150%); display:flex; align-items:center; padding: 0 15px; box-sizing: border-box; border-top:1px solid rgba(255,255,255,0.1); z-index:99999; pointer-events:auto; }
                body.light-mode #taskbar { background: rgba(255,255,255,0.75); border-top: 1px solid rgba(0,0,0,0.1); color: #222; }
                .start { width:38px; height:38px; background:radial-gradient(circle at top left, #4db8ff, #005a9e); border-radius:10px; border:1px solid rgba(255,255,255,0.4); text-align:center; line-height:36px; cursor:pointer; font-weight: 600; font-size: 18px; box-shadow: 0 4px 10px rgba(0, 90, 158, 0.5); transition: 0.2s;}
                .start:hover { transform: scale(1.05) translateY(-2px); }
                .tb-item { padding: 5px 10px; background: rgba(255,255,255,0.1); border-radius: 6px; margin-left: 10px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s; }
                .tb-item:hover { background: rgba(255,255,255,0.2); }
                body.light-mode .tb-item { background: rgba(0,0,0,0.05); } body.light-mode .tb-item:hover { background: rgba(0,0,0,0.1); }
                #start-menu { position:absolute; bottom:65px; left:15px; width:340px; max-height:600px; background:rgba(20, 30, 40, 0.75); backdrop-filter:blur(25px) saturate(180%); border-radius:16px; box-shadow:0 20px 40px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:100000; overflow:hidden; pointer-events:auto;}
                body.light-mode #start-menu { background:rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.1); color: #222;}
                .start-header { background: linear-gradient(135deg, rgba(0, 90, 158, 0.8), rgba(44, 83, 100, 0.8)); color:white; padding:20px; font-weight:600; display:flex; align-items:center; gap: 15px; }
                body.light-mode .start-header { background: linear-gradient(135deg, #0078d7, #005a9e); }
                .start-cat { font-size:11px; font-weight:bold; color:#888; margin: 10px 15px 5px 15px; text-transform:uppercase; letter-spacing:1px; }
                .start-item { padding:8px 20px; cursor:pointer; display:flex; align-items:center; gap:12px; font-size:14px; transition: 0.2s; border-radius: 8px; margin: 2px 8px; }
                .start-item:hover { background:rgba(255,255,255,0.1); transform: translateX(5px); }
                body.light-mode .start-item:hover { background:rgba(0,0,0,0.05); }
                .icon { position:absolute; text-align:center; width:75px; cursor:pointer; transition:all 0.3s; z-index:10; border-radius: 12px; padding: 10px 5px; pointer-events:auto; } 
                .icon:hover { background:rgba(255,255,255,0.1); transform: translateY(-5px) scale(1.05); }
                .icon div { font-size: 35px; margin-bottom: 5px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));}
                body.light-mode .icon { color: #222; font-weight: 500;}
                #desktop-bg { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; pointer-events: none; background-size: cover !important; background-position: center !important; z-index: 1;}
                .sys-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px; font-size:13px;}
                body.light-mode .sys-card { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); }
                .btn-primary { width:100%; padding:10px; background:#0078d7; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; }
                .btn-sec { width:100%; padding:10px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:6px; margin-bottom:10px; cursor:pointer; }
                .btn-danger { width:100%; padding:10px; background:rgba(255,77,77,0.8); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; }
                #widget-notes { position:absolute; top:30px; right:30px; width:220px; height:220px; background:#fff9c4; color:#333; box-shadow:5px 5px 15px rgba(0,0,0,0.3); padding:15px; z-index:5; font-family:'Segoe Print', 'Comic Sans MS', cursive; transform: rotate(2deg); transition: transform 0.2s; cursor:grab; pointer-events:auto;}
                #widget-notes:active { cursor:grabbing; transform: rotate(0deg) scale(1.05); z-index:9999;}
                #widget-notes textarea { width:100%; height:100%; background:transparent; border:none; outline:none; font-family:inherit; font-size:14px; resize:none; color:#333;}
                
                #context-menu { position:absolute; background:rgba(30, 40, 50, 0.9); backdrop-filter:blur(15px); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:5px; box-shadow:0 10px 25px rgba(0,0,0,0.5); z-index:999999; display:none; min-width:150px; pointer-events:auto; }
                body.light-mode #context-menu { background:rgba(255,255,255,0.9); color:black; border:1px solid rgba(0,0,0,0.2); }
                .cm-item { padding:8px 12px; cursor:pointer; font-size:13px; border-radius:4px; display:flex; align-items:center; gap:8px; }
                .cm-item:hover { background:rgba(255,255,255,0.1); }
                body.light-mode .cm-item:hover { background:rgba(0,0,0,0.05); }
            `;
            document.head.appendChild(s);
        }

        buildUI() {
            const html = `
                <div id="os-root" style="width:100vw; height:100vh; position:absolute; top:0; left:0;">
                    <div id="desktop-bg"></div>
                    
                    <div id="widget-notes" onmousedown="dragWidget(event, 'widget-notes')">
                        <div style="font-weight:bold; border-bottom:1px solid #ddd; margin-bottom:5px; font-size:12px; display:flex; justify-content:space-between;"><span>📌 Sticky Note</span></div>
                        <textarea id="sticky-text" oninput="localStorage.setItem('GemiOS_Sticky', this.value)" placeholder="Jot a quick note..."></textarea>
                    </div>

                    <div id="desktop-icons"></div>
                    
                    <div id="window-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:50; pointer-events:none;"></div>
                    
                    <div id="start-menu">
                        <div class="start-header">
                            <div style="font-size:30px; background:rgba(255,255,255,0.2); border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center;">👤</div>
                            <div><div style="font-size:16px;">Admin</div><div style="font-size:11px; opacity:0.8;">GemiOS 26.1 Time Machine</div></div>
                        </div>
                        <div style="overflow-y:auto; padding-bottom:10px;">
                            <div class="start-cat">System & Core</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_task')"><span style="font-size:18px;">📊</span> Task Manager</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_drive')"><span style="font-size:18px;">🗂️</span> Explorer 2.0</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_update')"><span style="font-size:18px;">💻</span> Cloud Updater</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_set')"><span style="font-size:18px;">⚙️</span> Settings</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_log')"><span style="font-size:18px;">📋</span> Master Chronicles</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_time')"><span style="font-size:18px;">⏳</span> Time Machine</div>
                            
                            <div class="start-cat">Development & Utilities</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_cam')"><span style="font-size:18px;">📸</span> GemiCam</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_view')"><span style="font-size:18px;">🖼️</span> Photo Gallery</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_code')"><span style="font-size:18px;">&lt;/&gt;</span> GemiCode IDE</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_browser')"><span style="font-size:18px;">🌐</span> Web Browser</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('sys_term')"><span style="font-size:18px;">⌨️</span> Bash Terminal</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_note')"><span style="font-size:18px;">📝</span> Notepad</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_calc')"><span style="font-size:18px;">🧮</span> Calculator</div>

                            <div class="start-cat">Entertainment</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_pong')"><span style="font-size:18px;">🏓</span> Pong 3.0</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_synth')"><span style="font-size:18px;">🎹</span> GemiSynth</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_paint')"><span style="font-size:18px;">🎨</span> Paint</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_snake')"><span style="font-size:18px;">🐍</span> Snake</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_sweeper')"><span style="font-size:18px;">💣</span> Sweeper</div>
                            <div class="start-item" onclick="GemiOS.PM.launch('app_ttt')"><span style="font-size:18px;">❌</span> Tic-Tac-Toe</div>
                            <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:10px;">
                            <div class="start-item" onclick="sessionStorage.removeItem('GemiOS_Session'); location.reload();" style="color:#ff4d4d;"><span style="font-size:18px;">🔒</span> Lock System</div>
                        </div>
                    </div>

                    <div id="taskbar">
                        <div class="start" onclick="let sm=document.getElementById('start-menu'); sm.style.display=sm.style.display==='flex'?'none':'flex';">G</div>
                        <div id="taskbar-apps" style="display:flex; flex-grow:1; overflow:hidden;"></div>
                        <div style="display:flex; align-items:center; gap:20px; margin-right:10px;">
                            <div onclick="GemiOS.toggleTheme()" style="cursor:pointer; font-size:20px;" title="Toggle Theme">🌓</div>
                            <div style="font-weight:600; font-size:12px; background:rgba(56, 239, 125, 0.2); color:#38ef7d; padding:4px 10px; border-radius:20px; border:1px solid rgba(56,239,125,0.3);">v26.1.0 CLOUD</div>
                            <div id="clock" style="font-weight:600; font-size:14px; letter-spacing:1px;">12:00</div>
                        </div>
                    </div>
                    
                    <div id="context-menu">
                        <div class="cm-item" onclick="location.reload()">🔄 Refresh UI</div>
                        <div class="cm-item" onclick="GemiOS.PM.launch('sys_set')">🖼️ Change Wallpaper</div>
                        <div class="cm-item" onclick="GemiOS.PM.launch('sys_term')">⌨️ Open Terminal</div>
                        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:5px 0;">
                        <div class="cm-item" onclick="sessionStorage.removeItem('GemiOS_Session'); location.reload();" style="color:#ff4d4d;">🔒 Lock Desktop</div>
                    </div>
                    
                    <div id="ota-overlay" style="display:none; position:absolute; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); backdrop-filter:blur(15px); z-index:9999999; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:'Segoe UI', sans-serif;">
                        <div style="font-size:60px; margin-bottom:20px; filter:drop-shadow(0 0 20px #38ef7d);">☁️</div>
                        <h2 id="ota-title" style="margin:0 0 20px 0;">Installing Live Update...</h2>
                        <div style="width:400px; height:25px; background:#222; border-radius:15px; overflow:hidden; border:2px solid #555;">
                            <div id="ota-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #38ef7d, #0078d7); transition:width 0.3s ease;"></div>
                        </div>
                        <p id="ota-text" style="margin-top:15px; font-family:monospace; color:#38ef7d; font-size:16px; font-weight:bold;">0%</p>
                        <div id="ota-restart-prompt" style="display:none; flex-direction:column; align-items:center; margin-top:20px;">
                            <p style="color:#ffeb3b; font-weight:bold; margin-bottom:15px;">UPDATE COMPLETE. A restart is required to lock data to NVRAM.</p>
                            <button onclick="location.reload()" style="padding:12px 25px; background:#ff4d4d; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:16px; box-shadow:0 5px 15px rgba(255,77,77,0.4);">Restart Now</button>
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
