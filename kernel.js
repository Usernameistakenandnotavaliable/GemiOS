// =========================================================================
// GemiOS CLOUD HYPERVISOR - v25.0.1 (HOTFIX)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v25';
console.log("[BOOT] Hypervisor targeting state: " + bootVersion);

if (bootVersion === 'v1') {
    // =====================================================================
    // KERNEL 1: THE TRUE ORIGINAL V1.0 
    // =====================================================================
    const originalV1Code = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Windows 7 Web Simulator</title><style>body,html{margin:0;padding:0;height:100%;overflow:hidden;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;user-select:none;}#desktop{width:100vw;height:100vh;background:linear-gradient(135deg,#004e92,#000428);position:relative;}.window{position:absolute;top:100px;left:150px;width:400px;min-height:250px;background:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.5);border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.5);display:none;flex-direction:column;backdrop-filter:blur(10px);}.title-bar{padding:5px 10px;background:rgba(255,255,255,0.4);border-bottom:1px solid #ccc;cursor:grab;display:flex;justify-content:space-between;align-items:center;border-top-left-radius:8px;border-top-right-radius:8px;font-weight:bold;}.close-btn{background:#ff4d4d;color:white;border:none;padding:2px 10px;border-radius:3px;cursor:pointer;}.window-content{padding:15px;flex-grow:1;background:#fff;border-bottom-left-radius:8px;border-bottom-right-radius:8px;}#taskbar{position:absolute;bottom:0;width:100%;height:40px;background:rgba(20,30,50,0.8);backdrop-filter:blur(10px);display:flex;align-items:center;padding:0 10px;box-sizing:border-box;border-top:1px solid rgba(255,255,255,0.2);}#start-btn{width:36px;height:36px;background:radial-gradient(circle,#4db8ff,#0078d7);border-radius:50%;border:2px solid white;cursor:pointer;display:flex;justify-content:center;align-items:center;color:white;font-weight:bold;box-shadow:0 0 10px rgba(0,120,215,0.8);}#start-menu{position:absolute;bottom:45px;left:0;width:250px;height:350px;background:rgba(255,255,255,0.9);backdrop-filter:blur(10px);border-radius:5px;box-shadow:2px 2px 10px rgba(0,0,0,0.5);display:none;padding:10px;box-sizing:border-box;}.menu-item{padding:10px;cursor:pointer;border-radius:3px;margin-bottom:5px;background:#eee;}.menu-item:hover{background:#0078d7;color:white;}#clock{margin-left:auto;color:white;font-size:14px;}.setting-row{margin-bottom:15px;}input[type=range]{width:100%;}.file-icon{display:inline-block;width:60px;text-align:center;margin:10px;cursor:pointer;}.file-icon div{font-size:30px;}#v1-escape{position:absolute;top:10px;right:10px;background:red;color:white;font-weight:bold;padding:10px;border:2px solid white;border-radius:5px;cursor:pointer;z-index:9999;}</style></head><body><div id="desktop"><button id="v1-escape" onclick="localStorage.setItem('GemiOS_TargetVersion', 'v25'); location.reload();">🚀 Escape to Modern OS</button><div class="window" id="win-explorer" style="left:50px;top:50px;display:flex;"><div class="title-bar" onmousedown="dragWindow(event,'win-explorer')"><span>Windows Explorer</span> <button class="close-btn" onclick="toggleWindow('win-explorer')">X</button></div><div class="window-content" id="file-content"><div class="file-icon" onclick="alert('Accessing C: Drive (Simulation)')"><div>💽</div>C: Drive</div><div class="file-icon" onclick="alert('Opening Documents...')"><div>📁</div>Docs</div><div class="file-icon" onclick="downloadFakeFile()"><div>⬇️</div>Download Test</div></div></div><div class="window" id="win-settings" style="left:500px;top:150px;display:flex;"><div class="title-bar" onmousedown="dragWindow(event,'win-settings')"><span>System Configuration (Simulated)</span> <button class="close-btn" onclick="toggleWindow('win-settings')">X</button></div><div class="window-content"><p><i>Note: These control the simulation speed, not actual host hardware.</i></p><div class="setting-row"><label>CPU Power (<span id="cpu-val">3.0</span> GHz)</label> <input type="range" id="cpu-slider" min="1.0" max="5.0" step="0.1" value="3.0" oninput="updateSysInfo()"></div><div class="setting-row"><label>CPU Cores (<span id="core-val">4</span>)</label> <input type="range" id="core-slider" min="1" max="16" step="1" value="4" oninput="updateSysInfo()"></div><div class="setting-row"><label>RAM (<span id="ram-val">8</span> GB)</label> <input type="range" id="ram-slider" min="2" max="64" step="2" value="8" oninput="updateSysInfo()"></div><button onclick="applySettings()" style="padding:5px 15px;">Apply Hardware Settings</button></div></div><div id="start-menu"><div class="menu-item" onclick="toggleWindow('win-explorer'); toggleStartMenu();">📁 File Explorer</div><div class="menu-item" onclick="toggleWindow('win-settings'); toggleStartMenu();">⚙️ System Configuration</div><hr><div class="menu-item" onclick="alert('Shutting down simulator...'); window.close();">Shut Down</div></div><div id="taskbar"><div id="start-btn" onclick="toggleStartMenu()">W7</div><div id="clock">12:00 AM</div></div></div><script>function updateClock(){const now=new Date();document.getElementById('clock').innerText=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}setInterval(updateClock,1000);updateClock();function toggleStartMenu(){const menu=document.getElementById('start-menu');menu.style.display=menu.style.display==='block'?'none':'block';}function toggleWindow(id){const win=document.getElementById(id);win.style.display=win.style.display==='flex'?'none':'flex';}let activeWindow=null;let offsetX=0,offsetY=0;function dragWindow(e,windowId){activeWindow=document.getElementById(windowId);document.querySelectorAll('.window').forEach(w=>w.style.zIndex=1);activeWindow.style.zIndex=10;offsetX=e.clientX-activeWindow.offsetLeft;offsetY=e.clientY-activeWindow.offsetTop;document.onmousemove=moveWindow;document.onmouseup=stopDrag;}function moveWindow(e){if(activeWindow){activeWindow.style.left=(e.clientX-offsetX)+'px';activeWindow.style.top=(e.clientY-offsetY)+'px';}}function stopDrag(){document.onmousemove=null;document.onmouseup=null;activeWindow=null;}function updateSysInfo(){document.getElementById('cpu-val').innerText=document.getElementById('cpu-slider').value;document.getElementById('core-val').innerText=document.getElementById('core-slider').value;document.getElementById('ram-val').innerText=document.getElementById('ram-slider').value;}function applySettings(){const cpu=document.getElementById('cpu-slider').value;const ram=document.getElementById('ram-slider').value;alert('Hardware configuration applied! \\n\\nThe OS simulation will now attempt to run utilizing '+cpu+'GHz and '+ram+'GB of virtual memory.');}function downloadFakeFile(){const content="This is a simulated download file from your Windows 7 Web OS!";const blob=new Blob([content],{type:'text/plain'});const url=window.URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='simulated_download.txt';document.body.appendChild(a);a.click();document.body.removeChild(a);window.URL.revokeObjectURL(url);}<\/script></body></html>`;
    document.open(); document.write(originalV1Code); document.close();
} else {
    // =====================================================================
    // KERNEL 2: GEMIOS v25.0.1 TREE-FS (HOTFIX)
    // =====================================================================
    
    // --- HIERARCHICAL FILE SYSTEM ---
    class VirtualFileSystem {
        constructor() {
            let drive = localStorage.getItem('GemiOS_TreeFS');
            if(!drive) {
                this.root = {
                    "C:": {
                        "System": { "boot.log": "GemiOS v25 Kernel Initialized." },
                        "Users": {
                            "Admin": {
                                "Documents": { "welcome.txt": "Welcome to the TreeFS architecture!" },
                                "Pictures": {},
                                "Desktop": {}
                            }
                        }
                    }
                };
                this.save();
            } else {
                this.root = JSON.parse(drive);
            }
        }
        
        save() { localStorage.setItem('GemiOS_TreeFS', JSON.stringify(this.root)); }
        
        getDir(path, create = false) {
            let parts = path.split('/').filter(p => p);
            let curr = this.root;
            for(let p of parts) { 
                if(curr[p] === undefined) {
                    if(create) curr[p] = {};
                    else return null;
                }
                curr = curr[p]; 
            }
            return curr;
        }

        read(path, file) {
            let dir = this.getDir(path);
            return (dir && dir[file] !== undefined) ? dir[file] : null;
        }

        write(path, file, data) {
            let dir = this.getDir(path, true); // Auto-creates missing folders
            if(dir) { dir[file] = data; this.save(); return true; }
            return false;
        }

        mkdir(path, folderName) {
            let dir = this.getDir(path);
            if(dir && dir[folderName] === undefined) { dir[folderName] = {}; this.save(); return true; }
            return false;
        }

        format() { localStorage.removeItem('GemiOS_TreeFS'); location.reload(); }
    }

    // --- WINDOW MANAGER ---
    class WindowManager {
        constructor() { this.zIndex = 100; this.windows = {}; }
        createWindow(pid, title, content, width) {
            let wid = 'win_' + pid;
            let html = `
                <div class="win" id="${wid}" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${width}px; z-index:${++this.zIndex};" onmousedown="GemiOS.WM.focus('${wid}')">
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
        focus(wid) { document.getElementById(wid).style.zIndex = ++this.zIndex; }
        drag(e, wid) {
            let w = document.getElementById(wid); if(w.dataset.maximized === "true") return;
            let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
            this.focus(wid); w.style.transition = 'none';
            document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
            document.onmouseup = () => { document.onmousemove = null; w.style.transition = 'all 0.3s ease'; document.onmouseup = null; };
        }
        maximize(wid) {
            let w = document.getElementById(wid);
            if(w.dataset.maximized === "true") { w.style.top = w.dataset.pT; w.style.left = w.dataset.pL; w.style.width = w.dataset.pW; w.style.height = w.dataset.pH; w.dataset.maximized = "false"; } 
            else { w.dataset.pT = w.style.top; w.dataset.pL = w.style.left; w.dataset.pW = w.style.width; w.dataset.pH = w.style.height; w.style.top = "0px"; w.style.left = "0px"; w.style.width = "100vw"; w.style.height = "calc(100vh - 50px)"; w.dataset.maximized = "true"; }
        }
        minimize(wid, pid) {
            let w = document.getElementById(wid);
            if(w.style.display === 'none') { w.style.display = 'flex'; this.focus(wid); document.getElementById('tb-item-'+pid).style.opacity = '1'; } 
            else { w.style.display = 'none'; document.getElementById('tb-item-'+pid).style.opacity = '0.5'; }
        }
        updateTaskbar(pid, title) { document.getElementById('taskbar-apps').innerHTML += `<div id="tb-item-${pid}" class="tb-item" onclick="GemiOS.WM.minimize('win_${pid}', '${pid}')">${title.substring(0,8)}</div>`; }
        removeWindow(pid) { if(this.windows[pid]) { this.windows[pid].remove(); delete this.windows[pid]; } let tbItem = document.getElementById('tb-item-'+pid); if(tbItem) tbItem.remove(); }
    }

    // --- PROCESS MANAGER ---
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

    // --- APP REGISTRY ---
    const AppRegistry = {
        'sys_term': {
            title: 'Bash Terminal', width: 500,
            html: (pid) => `<div id="t-out-${pid}" style="background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; height:280px; overflow-y:auto; border-radius:6px;">GemiOS TreeFS Terminal<br>Type 'help' for commands</div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span id="t-path-${pid}" style="color:#0078d7; margin-right:8px;">C:/Users/Admin></span><input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace;" onkeydown="GemiOS.handleTerm(event, ${pid}, this)"></div>`,
            onLaunch: (pid) => { GemiOS.termStates[pid] = 'C:/Users/Admin'; setTimeout(()=>document.getElementById(`t-in-${pid}`).focus(),100); }
        },
        'sys_drive': {
            title: 'Explorer 2.0', width: 450,
            html: (pid) => `<div class="sys-card" style="display:flex; gap:10px; align-items:center;"><button onclick="GemiOS.navDrive(${pid}, 'UP')" class="btn-sec" style="width:auto; margin:0; padding:5px 10px;">⬆️ Up</button><input type="text" id="d-path-${pid}" value="C:/" disabled style="flex-grow:1; background:transparent; color:white; border:none; font-weight:bold;"></div><div id="d-list-${pid}" style="max-height:300px; overflow-y:auto; display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;"></div>`,
            onLaunch: (pid) => { GemiOS.driveStates[pid] = 'C:'; GemiOS.renderDrive(pid); }
        },
        'sys_set': {
            title: 'System Settings', width: 420,
            html: () => `<div class="sys-card"><b>Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none;" placeholder="Image URL..."><button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in').value); location.reload();" class="btn-primary">Apply Wallpaper</button></div><button onclick="localStorage.removeItem('GemiOS_Wall'); location.reload();" class="btn-sec">Reset Default</button><button onclick="GemiOS.VFS.format();" class="btn-danger">Format Entire TreeFS</button>`
        },
        'sys_update': {
            title: 'Cloud Updater', width: 380,
            html: () => `<div class="sys-card" style="text-align:center;"><div style="font-size:40px;">☁️</div><h3>Update Center</h3><p>Kernel: <b>v25.0.1 (HOTFIX)</b></p><div id="upd-stat" style="font-size:12px; min-height:15px;"></div><button id="upd-btn" onclick="checkUpdate(this)" class="btn-primary" style="margin-top:10px;">Ping GitHub</button></div>`
        },
        'app_note': {
            title: 'Notepad', width: 400,
            html: () => `<textarea oninput="GemiOS.VFS.write('C:/Users/Admin/Documents', 'note.txt', this.value)" style="width:100%; height:300px; box-sizing:border-box; resize:none; border:none; border-radius:6px; padding:15px; font-family:monospace; outline:none; background:rgba(255,255,255,0.9); color:black;">${GemiOS.VFS.read('C:/Users/Admin/Documents', 'note.txt') || ''}</textarea>`
        },
        'app_pong': {
            title: 'GemiPong 3.0', width: 420,
            html: () => `<canvas id="pong-cvs" width="380" height="240" style="background:#0a0a0a; border-radius:8px; box-shadow:inset 0 5px 15px rgba(0,0,0,0.5); display:block; margin:0 auto; cursor:none;"></canvas>`,
            onLaunch: (pid) => { setTimeout(() => {
                let cvs = document.getElementById('pong-cvs'); if(!cvs) return; let ctx = cvs.getContext('2d');
                let pY=100, cY=100, bX=190, bY=120, bDX=4, bDY=2;
                cvs.onmousemove = (e) => pY = Math.max(0, Math.min(190, e.offsetY - 25));
                GemiOS.pongItv = setInterval(() => {
                    if(!document.getElementById('pong-cvs')) { clearInterval(GemiOS.pongItv); return; }
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
            onKill: () => clearInterval(GemiOS.pongItv)
        }
    };

    // --- CORE OS MANAGER ---
    class CoreOS {
        constructor() {
            this.VFS = new VirtualFileSystem();
            this.WM = new WindowManager();
            this.PM = new ProcessManager();
            this.Registry = AppRegistry;
            this.termStates = {};
            this.driveStates = {};
        }

        init() {
            this.injectStyles(); this.buildUI(); this.applyTheme(); this.loadWallpaper(); this.startClock();
        }

        handleTerm(e, pid, inputEl) {
            if(e.key !== 'Enter') return;
            let cmd = inputEl.value.trim(); inputEl.value = '';
            let out = document.getElementById(`t-out-${pid}`);
            let currPath = this.termStates[pid];
            out.innerHTML += `<br><span style="color:#0078d7">${currPath}></span> ${cmd}`;
            
            let args = cmd.split(' '); let base = args[0].toLowerCase();
            try {
                if(base === 'help') { out.innerHTML += '<br>cmds: ls, cd [dir], mkdir [dir], echo [text] > [file], cat [file], clear'; }
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
                else if(base === 'echo') {
                    let str = cmd.substring(5);
                    if(str.includes('>')) {
                        let parts = str.split('>');
                        let text = parts[0].trim().replace(/"/g, '').replace(/'/g, '');
                        let file = parts[1].trim();
                        if(this.VFS.write(currPath, file, text)) out.innerHTML += `<br>File ${file} saved.`;
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
            let path = this.driveStates[pid];
            document.getElementById(`d-path-${pid}`).value = path;
            let list = document.getElementById(`d-list-${pid}`);
            let dir = this.VFS.getDir(path);
            let html = '';
            for(let k in dir) {
                if(typeof dir[k] === 'object') {
                    html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(0,0,0,0.2); border-radius:6px; transition:0.2s;" onmouseover="this.style.background='rgba(0,120,215,0.4)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'" onclick="GemiOS.navDrive(${pid}, '${k}')"><div style="font-size:30px;">📁</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`;
                } else {
                    html += `<div style="text-align:center; cursor:pointer; padding:10px; background:rgba(255,255,255,0.1); border-radius:6px;" onclick="alert('File Contents:\\n\\n${dir[k]}')"><div style="font-size:30px;">📄</div><div style="font-size:12px; overflow:hidden; text-overflow:ellipsis;">${k}</div></div>`;
                }
            }
            if(html === '') html = '<div style="grid-column: span 3; text-align:center; opacity:0.5; padding:20px;">Folder is empty</div>';
            list.innerHTML = html;
        }

        navDrive(pid, target) {
            let curr = this.driveStates[pid];
            if(target === 'UP') {
                let parts = curr.split('/'); if(parts.length > 1) parts.pop();
                this.driveStates[pid] = parts.join('/') || 'C:';
            } else {
                this.driveStates[pid] = curr + '/' + target;
            }
            this.renderDrive(pid);
        }

        injectStyles() {
            const s = document.createElement('style');
            s.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                body { margin:0; overflow:hidden; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Inter', sans-serif; color:white; user-select:none; transition: background 0.6s ease, color 0.6s ease;}
                body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #222; }
                ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; } body.light-mode ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
                .win { position:absolute; background:rgba(20, 30, 40, 0.65); backdrop-filter: blur(25px) saturate(180%); -webkit-backdrop-filter: blur(25px) saturate(180%); color:white; border-radius:12px; box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.15); display: flex; flex-direction: column; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transition: all 0.3s ease;}
                @keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                body.light-mode .win { background: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.4); color: #222; box-shadow: 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }
                .title-bar { padding:10px 15px; font-weight:600; font-size: 14px; display:flex; justify-content:space-between; align-items: center; border-bottom:1px solid rgba(255,255,255,0.1); cursor:grab; }
                body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.1); }
                .content { padding:15px; flex-grow: 1; overflow-y: auto; }
                .ctrl-btn { border:none; color:white; cursor:pointer; width: 20px; height: 20px; border-radius:50%; font-weight:bold; font-size: 10px; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; margin-left: 5px; }
                .close-btn { background:rgba(255, 77, 77, 0.8); } .close-btn:hover { background:#ff4d4d; transform: scale(1.1); }
                .min-btn { background:rgba(255, 180, 0, 0.8); } .min-btn:hover { background:#ffb400; transform: scale(1.1); }
                #taskbar { position:absolute; bottom:0; width:100%; height:50px; background:rgba(10, 15, 20, 0.75); backdrop-filter:blur(20px) saturate(150%); display:flex; align-items:center; padding: 0 15px; box-sizing: border-box; border-top:1px solid rgba(255,255,255,0.1); z-index:99999; }
                body.light-mode #taskbar { background: rgba(255,255,255,0.75); border-top: 1px solid rgba(0,0,0,0.1); color: #222; }
                .start { width:38px; height:38px; background:radial-gradient(circle at top left, #4db8ff, #005a9e); border-radius:10px; border:1px solid rgba(255,255,255,0.4); text-align:center; line-height:36px; cursor:pointer; font-weight: 600; font-size: 18px; box-shadow: 0 4px 10px rgba(0, 90, 158, 0.5); transition: 0.2s;}
                .start:hover { transform: scale(1.05) translateY(-2px); }
                .tb-item { padding: 5px 10px; background: rgba(255,255,255,0.1); border-radius: 6px; margin-left: 10px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s; }
                .tb-item:hover { background: rgba(255,255,255,0.2); }
                body.light-mode .tb-item { background: rgba(0,0,0,0.05); } body.light-mode .tb-item:hover { background: rgba(0,0,0,0.1); }
                #start-menu { position:absolute; bottom:65px; left:15px; width:300px; background:rgba(20, 30, 40, 0.75); backdrop-filter:blur(25px) saturate(180%); border-radius:16px; box-shadow:0 20px 40px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:100000; overflow:hidden;}
                body.light-mode #start-menu { background:rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.1); color: #222;}
                .start-header { background: linear-gradient(135deg, rgba(0, 90, 158, 0.8), rgba(44, 83, 100, 0.8)); color:white; padding:20px; font-weight:600; display:flex; align-items:center; gap: 15px; }
                body.light-mode .start-header { background: linear-gradient(135deg, #0078d7, #005a9e); }
                .start-item { padding:10px 20px; cursor:pointer; display:flex; align-items:center; gap:12px; font-size:14px; transition: 0.2s; border-radius: 8px; margin: 2px 8px; }
                .start-item:hover { background:rgba(255,255,255,0.1); transform: translateX(5px); }
                body.light-mode .start-item:hover { background:rgba(0,0,0,0.05); }
                .icon { position:absolute; text-align:center; width:75px; cursor:pointer; transition:all 0.3s; z-index:10; border-radius: 12px; padding: 10px 5px; } 
                .icon:hover { background:rgba(255,255,255,0.1); transform: translateY(-5px) scale(1.05); }
                .icon div { font-size: 35px; margin-bottom: 5px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));}
                body.light-mode .icon { color: #222; font-weight: 500;}
                #desktop-bg { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; pointer-events: none; background-size: cover !important; background-position: center !important; z-index: 1;}
                .sys-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px; font-size:13px;}
                body.light-mode .sys-card { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); }
                .btn-primary { width:100%; padding:10px; background:#0078d7; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; }
                .btn-sec { width:100%; padding:10px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid rgba(255,255,255,0.2); border-radius:6px; margin-bottom:10px; cursor:pointer; }
                .btn-danger { width:100%; padding:10px; background:rgba(255,77,77,0.8); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; }
                body.light-mode .btn-sec { background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); }
            `;
            document.head.appendChild(s);
        }

        buildUI() {
            const html = `
                <div id="desktop-bg"></div>
                <div id="desktop-icons">
                    <div class="icon" style="top:20px; left:20px;" onclick="GemiOS.PM.launch('sys_drive')"><div>🗂️</div>TreeFS</div>
                    <div class="icon" style="top:120px; left:20px;" onclick="GemiOS.PM.launch('sys_term')"><div>⌨️</div>Terminal</div>
                    <div class="icon" style="top:220px; left:20px;" onclick="GemiOS.PM.launch('app_note')"><div>📝</div>Notepad</div>
                    <div class="icon" style="top:320px; left:20px;" onclick="GemiOS.PM.launch('sys_update')"><div>☁️</div>Update</div>
                </div>
                <div id="window-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:50; pointer-events:none;"></div>
                
                <div id="start-menu">
                    <div class="start-header">
                        <div style="font-size:30px; background:rgba(255,255,255,0.2); border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center;">👤</div>
                        <div><div style="font-size:16px;">Sys Admin</div><div style="font-size:11px; opacity:0.8;">GemiOS 25.0.1 TreeFS</div></div>
                    </div>
                    <div style="overflow-y:auto; padding: 10px 0;">
                        <div class="start-item" onclick="GemiOS.PM.launch('sys_drive')">🗂️ Explorer 2.0</div>
                        <div class="start-item" onclick="GemiOS.PM.launch('sys_term')">⌨️ Bash Terminal</div>
                        <div class="start-item" onclick="GemiOS.PM.launch('sys_set')">⚙️ Settings</div>
                        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:10px;">
                        <div class="start-item" onclick="GemiOS.PM.launch('app_note')">📝 Notepad</div>
                        <div class="start-item" onclick="GemiOS.PM.launch('app_pong')">🏓 Pong</div>
                    </div>
                </div>

                <div id="taskbar">
                    <div class="start" onclick="document.getElementById('start-menu').style.display=document.getElementById('start-menu').style.display==='flex'?'none':'flex'">G</div>
                    <div id="taskbar-apps" style="display:flex; flex-grow:1; overflow:hidden;"></div>
                    <div style="display:flex; align-items:center; gap:20px; margin-right:10px;">
                        <div onclick="GemiOS.toggleTheme()" style="cursor:pointer; font-size:20px;" title="Toggle Theme">🌓</div>
                        <div style="font-weight:600; font-size:12px; background:rgba(56, 239, 125, 0.2); color:#38ef7d; padding:4px 10px; border-radius:20px; border:1px solid rgba(56,239,125,0.3);">v25.0.1 HOTFIX</div>
                        <div id="clock" style="font-weight:600; font-size:14px; letter-spacing:1px;">12:00</div>
                    </div>
                </div>
            `;
            
            // [HOTFIX] Complete overwrite of innerHTML removes the Hot-Swap blindfold!
            document.body.innerHTML = html;
        }

        applyTheme() { let isL = localStorage.getItem('GemiOS_Theme') === 'light'; if(isL) document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); }
        toggleTheme() { let isL = localStorage.getItem('GemiOS_Theme') === 'light'; localStorage.setItem('GemiOS_Theme', !isL ? 'light' : 'dark'); this.applyTheme(); }
        loadWallpaper() { let wp = localStorage.getItem('GemiOS_Wall'); if(wp) document.getElementById('desktop-bg').style.background = `url(${wp}) center/cover`; }
        startClock() { setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }, 1000); }
    }

    // Live Hot-Swap Updater Logic 
    window.checkUpdate = async function(btn) {
        btn.innerText = 'Pinging GitHub Servers...'; btn.style.background = '#444';
        let st = document.getElementById('upd-stat'); st.innerText = 'Fetching version.json...';
        try {
            let cb = "?t=" + new Date().getTime();
            let r = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/version.json" + cb);
            if (!r.ok) throw new Error("Server unreachable.");
            let d = await r.json();
            
            if (d.version !== "25.0.1-HOTFIX") {
                st.innerHTML = `<span style="color:#ffeb3b">New Version Found: ${d.version}</span><br><i>${d.notes}</i>`;
                btn.innerText = 'Hot-Swap & Install'; btn.style.background = '#ff00cc'; 
                btn.onclick = async () => {
                    btn.innerText = "Downloading Kernel...";
                    let kr = await fetch("https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/kernel.js" + cb);
                    let kCode = await kr.text();
                    document.body.innerHTML = '<div style="background:black; color:#ff00cc; height:100vh; width:100vw; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:24px; font-weight:bold; z-index:999999; position:absolute; top:0; left:0;">[HOT-SWAP] Flushing Memory & Injecting New Kernel...</div>';
                    let highestTimeoutId = setTimeout(";"); for (let i = 0; i < highestTimeoutId ; i++) { clearTimeout(i); }
                    setTimeout(() => { let script = document.createElement('script'); script.text = "{" + kCode + "}"; document.body.appendChild(script); }, 1500);
                };
            } else {
                st.innerHTML = `<span style="color:#38ef7d">System is up to date!</span>`;
                btn.innerText = 'Latest Kernel Installed'; btn.style.background = '#38ef7d'; btn.style.color = 'black'; btn.onclick = null;
            }
        } catch (err) { st.innerHTML = `<span style="color:#ff4d4d">Error: ${err.message}</span>`; btn.innerText = 'Retry'; btn.style.background = '#0078d7'; }
    };

    window.GemiOS = new CoreOS();
    window.GemiOS.init();
}
