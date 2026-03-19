// =========================================================================
// GemiOS CLOUD HYPERVISOR - v23.0 (THE ECOSYSTEM & WIDGETS)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v23';
console.log("Hypervisor targeting state: " + bootVersion);

if (bootVersion === 'v1') {
    // =====================================================================
    // KERNEL 1: THE TRUE ORIGINAL V1.0 
    // =====================================================================
    const originalV1Code = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Windows 7 Web Simulator</title><style>body,html{margin:0;padding:0;height:100%;overflow:hidden;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;user-select:none;}#desktop{width:100vw;height:100vh;background:linear-gradient(135deg,#004e92,#000428);position:relative;}.window{position:absolute;top:100px;left:150px;width:400px;min-height:250px;background:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.5);border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.5);display:none;flex-direction:column;backdrop-filter:blur(10px);}.title-bar{padding:5px 10px;background:rgba(255,255,255,0.4);border-bottom:1px solid #ccc;cursor:grab;display:flex;justify-content:space-between;align-items:center;border-top-left-radius:8px;border-top-right-radius:8px;font-weight:bold;}.close-btn{background:#ff4d4d;color:white;border:none;padding:2px 10px;border-radius:3px;cursor:pointer;}.window-content{padding:15px;flex-grow:1;background:#fff;border-bottom-left-radius:8px;border-bottom-right-radius:8px;}#taskbar{position:absolute;bottom:0;width:100%;height:40px;background:rgba(20,30,50,0.8);backdrop-filter:blur(10px);display:flex;align-items:center;padding:0 10px;box-sizing:border-box;border-top:1px solid rgba(255,255,255,0.2);}#start-btn{width:36px;height:36px;background:radial-gradient(circle,#4db8ff,#0078d7);border-radius:50%;border:2px solid white;cursor:pointer;display:flex;justify-content:center;align-items:center;color:white;font-weight:bold;box-shadow:0 0 10px rgba(0,120,215,0.8);}#start-menu{position:absolute;bottom:45px;left:0;width:250px;height:350px;background:rgba(255,255,255,0.9);backdrop-filter:blur(10px);border-radius:5px;box-shadow:2px 2px 10px rgba(0,0,0,0.5);display:none;padding:10px;box-sizing:border-box;}.menu-item{padding:10px;cursor:pointer;border-radius:3px;margin-bottom:5px;background:#eee;}.menu-item:hover{background:#0078d7;color:white;}#clock{margin-left:auto;color:white;font-size:14px;}.setting-row{margin-bottom:15px;}input[type=range]{width:100%;}.file-icon{display:inline-block;width:60px;text-align:center;margin:10px;cursor:pointer;}.file-icon div{font-size:30px;}#v1-escape{position:absolute;top:10px;right:10px;background:red;color:white;font-weight:bold;padding:10px;border:2px solid white;border-radius:5px;cursor:pointer;z-index:9999;}</style></head><body><div id="desktop"><button id="v1-escape" onclick="localStorage.setItem('GemiOS_TargetVersion', 'v23'); location.reload();">🚀 Escape to Modern OS</button><div class="window" id="win-explorer" style="left:50px;top:50px;display:flex;"><div class="title-bar" onmousedown="dragWindow(event,'win-explorer')"><span>Windows Explorer</span> <button class="close-btn" onclick="toggleWindow('win-explorer')">X</button></div><div class="window-content" id="file-content"><div class="file-icon" onclick="alert('Accessing C: Drive (Simulation)')"><div>💽</div>C: Drive</div><div class="file-icon" onclick="alert('Opening Documents...')"><div>📁</div>Docs</div><div class="file-icon" onclick="downloadFakeFile()"><div>⬇️</div>Download Test</div></div></div><div class="window" id="win-settings" style="left:500px;top:150px;display:flex;"><div class="title-bar" onmousedown="dragWindow(event,'win-settings')"><span>System Configuration (Simulated)</span> <button class="close-btn" onclick="toggleWindow('win-settings')">X</button></div><div class="window-content"><p><i>Note: These control the simulation speed, not actual host hardware.</i></p><div class="setting-row"><label>CPU Power (<span id="cpu-val">3.0</span> GHz)</label> <input type="range" id="cpu-slider" min="1.0" max="5.0" step="0.1" value="3.0" oninput="updateSysInfo()"></div><div class="setting-row"><label>CPU Cores (<span id="core-val">4</span>)</label> <input type="range" id="core-slider" min="1" max="16" step="1" value="4" oninput="updateSysInfo()"></div><div class="setting-row"><label>RAM (<span id="ram-val">8</span> GB)</label> <input type="range" id="ram-slider" min="2" max="64" step="2" value="8" oninput="updateSysInfo()"></div><button onclick="applySettings()" style="padding:5px 15px;">Apply Hardware Settings</button></div></div><div id="start-menu"><div class="menu-item" onclick="toggleWindow('win-explorer'); toggleStartMenu();">📁 File Explorer</div><div class="menu-item" onclick="toggleWindow('win-settings'); toggleStartMenu();">⚙️ System Configuration</div><hr><div class="menu-item" onclick="alert('Shutting down simulator...'); window.close();">Shut Down</div></div><div id="taskbar"><div id="start-btn" onclick="toggleStartMenu()">W7</div><div id="clock">12:00 AM</div></div></div><script>function updateClock(){const now=new Date();document.getElementById('clock').innerText=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}setInterval(updateClock,1000);updateClock();function toggleStartMenu(){const menu=document.getElementById('start-menu');menu.style.display=menu.style.display==='block'?'none':'block';}function toggleWindow(id){const win=document.getElementById(id);win.style.display=win.style.display==='flex'?'none':'flex';}let activeWindow=null;let offsetX=0,offsetY=0;function dragWindow(e,windowId){activeWindow=document.getElementById(windowId);document.querySelectorAll('.window').forEach(w=>w.style.zIndex=1);activeWindow.style.zIndex=10;offsetX=e.clientX-activeWindow.offsetLeft;offsetY=e.clientY-activeWindow.offsetTop;document.onmousemove=moveWindow;document.onmouseup=stopDrag;}function moveWindow(e){if(activeWindow){activeWindow.style.left=(e.clientX-offsetX)+'px';activeWindow.style.top=(e.clientY-offsetY)+'px';}}function stopDrag(){document.onmousemove=null;document.onmouseup=null;activeWindow=null;}function updateSysInfo(){document.getElementById('cpu-val').innerText=document.getElementById('cpu-slider').value;document.getElementById('core-val').innerText=document.getElementById('core-slider').value;document.getElementById('ram-val').innerText=document.getElementById('ram-slider').value;}function applySettings(){const cpu=document.getElementById('cpu-slider').value;const ram=document.getElementById('ram-slider').value;alert(\`Hardware configuration applied! \\n\\nThe OS simulation will now attempt to run utilizing \${cpu}GHz and \${ram}GB of virtual memory.\`);}function downloadFakeFile(){const content="This is a simulated download file from your Windows 7 Web OS!";const blob=new Blob([content],{type:'text/plain'});const url=window.URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='simulated_download.txt';document.body.appendChild(a);a.click();document.body.removeChild(a);window.URL.revokeObjectURL(url);}<\/script></body></html>`;
    document.open(); document.write(originalV1Code); document.close();
} else {
    // =====================================================================
    // KERNEL 2: MODERN UI (GemiOS v23 Ecosystem)
    // =====================================================================
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        body { margin:0; overflow:hidden; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Inter', sans-serif; color:white; user-select:none; transition: background 0.6s ease, color 0.6s ease;}
        body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #222; }
        
        ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 4px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); } body.light-mode ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }

        .win { position:absolute; background:rgba(20, 30, 40, 0.65); backdrop-filter: blur(25px) saturate(180%); -webkit-backdrop-filter: blur(25px) saturate(180%); color:white; border-radius:12px; box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.15); display: flex; flex-direction: column; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;}
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        body.light-mode .win { background: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.4); color: #222; box-shadow: 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }
        .title-bar { padding:10px 15px; font-weight:600; font-size: 14px; display:flex; justify-content:space-between; align-items: center; border-bottom:1px solid rgba(255,255,255,0.1); cursor:grab; }
        body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.1); }
        .content { padding:15px; flex-grow: 1; overflow-y: auto; }
        .close-btn { background:rgba(255, 77, 77, 0.8); border:none; color:white; cursor:pointer; width: 20px; height: 20px; border-radius:50%; font-weight:bold; font-size: 10px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .close-btn:hover { background:rgba(255, 77, 77, 1); transform: scale(1.1); }

        #taskbar { position:absolute; bottom:0; width:100%; height:50px; background:rgba(10, 15, 20, 0.75); backdrop-filter:blur(20px) saturate(150%); display:flex; align-items:center; padding: 0 15px; box-sizing: border-box; border-top:1px solid rgba(255,255,255,0.1); z-index:99999; }
        body.light-mode #taskbar { background: rgba(255,255,255,0.75); border-top: 1px solid rgba(0,0,0,0.1); color: #222; }
        .start { width:38px; height:38px; background:radial-gradient(circle at top left, #4db8ff, #005a9e); border-radius:10px; border:1px solid rgba(255,255,255,0.4); text-align:center; line-height:36px; cursor:pointer; font-weight: 600; font-size: 18px; box-shadow: 0 4px 10px rgba(0, 90, 158, 0.5); transition: 0.2s;}
        .start:hover { transform: scale(1.05) translateY(-2px); }

        #start-menu { position:absolute; bottom:65px; left:15px; width:340px; max-height:600px; background:rgba(20, 30, 40, 0.75); backdrop-filter:blur(25px) saturate(180%); border-radius:16px; box-shadow:0 20px 40px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:100000; overflow:hidden;}
        body.light-mode #start-menu { background:rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.1); color: #222;}
        .start-header { background: rgba(0, 90, 158, 0.8); color:white; padding:20px; font-weight:600; display:flex; align-items:center; gap: 15px; }
        body.light-mode .start-header { background: linear-gradient(135deg, #0078d7, #005a9e); }
        .start-cat { font-size:11px; font-weight:bold; color:#888; margin: 10px 15px 5px 15px; text-transform:uppercase; letter-spacing:1px; }
        .start-item { padding:8px 20px; cursor:pointer; display:flex; align-items:center; gap:12px; font-size:14px; transition: 0.2s; border-radius: 8px; margin: 2px 8px; }
        .start-item:hover { background:rgba(255,255,255,0.1); transform: translateX(5px); }
        body.light-mode .start-item:hover { background:rgba(0,0,0,0.05); }

        .icon { position:absolute; text-align:center; width:75px; cursor:pointer; transition:all 0.3s; z-index:10; border-radius: 12px; padding: 10px 5px; } 
        .icon:hover { background:rgba(255,255,255,0.1); transform: translateY(-5px) scale(1.05); }
        .icon div { font-size: 35px; margin-bottom: 5px; transition: 0.3s; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));}
        body.light-mode .icon { color: #222; font-weight: 500;}
        #desktop-bg { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; pointer-events: none; background-size: cover !important; background-position: center !important; z-index: 1;}
        .sys-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px; font-size:13px; line-height:1.5;}
        body.light-mode .sys-card { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); }
        
        /* Widget Styles */
        #widget-notes { position:absolute; top:30px; right:30px; width:220px; height:220px; background:#fff9c4; color:#333; box-shadow:5px 5px 15px rgba(0,0,0,0.3); padding:15px; z-index:5; font-family:'Segoe Print', 'Comic Sans MS', cursive; transform: rotate(2deg); transition: transform 0.2s; cursor:grab;}
        #widget-notes:active { cursor:grabbing; transform: rotate(0deg) scale(1.05); z-index:9999;}
        #widget-notes textarea { width:100%; height:100%; background:transparent; border:none; outline:none; font-family:inherit; font-size:14px; resize:none; color:#333;}
    `;
    document.head.appendChild(style);

    const desktopHTML = `
        <div id="desktop-bg"></div>
        
        <div id="widget-notes" onmousedown="dragWidget(event, 'widget-notes')">
            <div style="font-weight:bold; border-bottom:1px solid #ddd; margin-bottom:5px; font-size:12px; display:flex; justify-content:space-between;"><span>📌 Sticky Note</span></div>
            <textarea id="sticky-text" oninput="localStorage.setItem('GemiOS_Sticky', this.value)" placeholder="Jot a quick note..."></textarea>
        </div>

        <div id="desktop-icons">
            <div class="icon app-sys" style="top:20px; left:20px;" onclick="openApp('sys_drive')"><div>🗂️</div>GemiDrive</div>
            <div class="icon app-sys" style="top:120px; left:20px;" onclick="openApp('sys_log')"><div>📋</div>Updates</div>
            <div class="icon app-sys" style="top:220px; left:20px;" onclick="openApp('sys_time')"><div>⏳</div>TimeMach</div>
            <div class="icon app-sys" style="top:320px; left:20px;" onclick="openApp('sys_set')"><div>⚙️</div>Settings</div>
            
            <div class="icon app-util" style="top:20px; left:120px;" onclick="openApp('sys_browser')"><div>🌐</div>Browser</div>
            <div class="icon app-util" style="top:120px; left:120px;" onclick="openApp('sys_term')"><div>⌨️</div>Terminal</div>
            <div class="icon app-util" style="top:220px; left:120px;" onclick="openApp('app_note')"><div>📝</div>Notepad</div>
            <div class="icon app-util" style="top:320px; left:120px;" onclick="openApp('app_calc')"><div>🧮</div>Calc</div>
            
            <div class="icon app-game" style="top:20px; left:220px;" onclick="openApp('app_pong')"><div>🏓</div>Pong</div>
            <div class="icon app-game" style="top:120px; left:220px;" onclick="openApp('app_paint')"><div>🎨</div>Paint</div>
            <div class="icon app-game" style="top:220px; left:220px;" onclick="openApp('app_snake')"><div>🐍</div>Snake</div>
            <div class="icon app-game" style="top:320px; left:220px;" onclick="openApp('app_sweeper')"><div>💣</div>Sweeper</div>
            <div class="icon app-game" style="top:420px; left:220px;" onclick="openApp('app_ttt')"><div>❌</div>TicTac</div>
        </div>
        <div id="window-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:50; pointer-events:none;"></div>
        
        <div id="start-menu">
            <div class="start-header">
                <div style="font-size:30px; background:rgba(255,255,255,0.2); border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center;">👤</div>
                <div><div style="font-size:16px;">System Admin</div><div style="font-size:11px; opacity:0.8;">GemiOS Ecosystem</div></div>
            </div>
            <div style="overflow-y:auto; padding-bottom: 10px;">
                <div class="start-cat">System & Core</div>
                <div class="start-item" onclick="openApp('sys_drive')"><span style="font-size:18px;">🗂️</span> GemiDrive (Files)</div>
                <div class="start-item" onclick="openApp('sys_log')"><span style="font-size:18px;">📋</span> Update History</div>
                <div class="start-item" onclick="openApp('sys_time')"><span style="font-size:18px;">⏳</span> Time Machine</div>
                <div class="start-item" onclick="openApp('sys_set')"><span style="font-size:18px;">⚙️</span> Settings</div>
                
                <div class="start-cat">Utilities</div>
                <div class="start-item" onclick="openApp('sys_browser')"><span style="font-size:18px;">🌐</span> Web Browser</div>
                <div class="start-item" onclick="openApp('sys_term')"><span style="font-size:18px;">⌨️</span> Terminal</div>
                <div class="start-item" onclick="openApp('app_note')"><span style="font-size:18px;">📝</span> Notepad</div>
                <div class="start-item" onclick="openApp('app_calc')"><span style="font-size:18px;">🧮</span> Calculator</div>

                <div class="start-cat">Entertainment</div>
                <div class="start-item" onclick="openApp('app_pong')"><span style="font-size:18px;">🏓</span> Pong</div>
                <div class="start-item" onclick="openApp('app_paint')"><span style="font-size:18px;">🎨</span> Paint</div>
                <div class="start-item" onclick="openApp('app_snake')"><span style="font-size:18px;">🐍</span> Snake</div>
                <div class="start-item" onclick="openApp('app_sweeper')"><span style="font-size:18px;">💣</span> Sweeper</div>
                <div class="start-item" onclick="openApp('app_ttt')"><span style="font-size:18px;">❌</span> Tic-Tac-Toe</div>
            </div>
        </div>

        <div id="taskbar">
            <div class="start" onclick="document.getElementById('start-menu').style.display=document.getElementById('start-menu').style.display==='flex'?'none':'flex'">G</div>
            <div style="margin-left:auto; display:flex; align-items:center; gap:20px; margin-right:10px;">
                <div onclick="toggleTheme()" style="cursor:pointer; font-size:20px;" title="Toggle Theme">🌓</div>
                <div style="font-weight:600; font-size:12px; background:rgba(56, 239, 125, 0.2); color:#38ef7d; padding:4px 10px; border-radius:20px; border:1px solid rgba(56,239,125,0.3);">v23.0 ECOSYSTEM</div>
                <div id="clock" style="font-weight:600; font-size:14px; letter-spacing:1px;">12:00</div>
            </div>
        </div>
    `;
    document.body.innerHTML += desktopHTML;

    // Load Sticky Note
    let savedSticky = localStorage.getItem('GemiOS_Sticky');
    if(savedSticky) document.getElementById('sticky-text').value = savedSticky;

    // Widget Dragging
    window.dragWidget = function(e, id) {
        if(e.target.tagName === 'TEXTAREA') return; // Don't drag if clicking text
        let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
        document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
        document.onmouseup = () => document.onmousemove = null;
    };

    let zIndexCount = 100;
    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }, 1000);

    let isLightMode = localStorage.getItem('GemiOS_Theme') === 'light';
    window.applyTheme = function() { if(isLightMode) document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); };
    window.toggleTheme = function() { isLightMode = !isLightMode; localStorage.setItem('GemiOS_Theme', isLightMode ? 'light' : 'dark'); applyTheme(); };
    applyTheme();

    let savedWP = localStorage.getItem('GemiOS_Wallpaper');
    if(savedWP) document.getElementById('desktop-bg').style.background = `url(${savedWP}) center/cover`;

    window.jumpVer = function(v) { localStorage.setItem('GemiOS_TargetVersion', v); location.reload(); };

    window.openApp = function(id) {
        document.getElementById('start-menu').style.display = 'none';
        let t = "", c = "", w = 420;

        if(id === 'sys_drive') {
            t = "GemiDrive File Explorer"; w = 450;
            let filesHTML = '';
            for(let i=0; i<localStorage.length; i++) {
                let key = localStorage.key(i);
                if(key.startsWith('GemiOS_')) {
                    let type = key.includes('Theme') ? '🎨' : key.includes('Notepad') ? '📝' : key.includes('Snake') ? '🏆' : '📄';
                    filesHTML += `<div style="padding:10px; background:rgba(255,255,255,0.1); margin-bottom:5px; border-radius:6px; display:flex; gap:10px; align-items:center;"><span>${type}</span> <b>${key.replace('GemiOS_','')}</b></div>`;
                }
            }
            if(filesHTML === '') filesHTML = '<i>Drive is empty. Save a note or play a game!</i>';
            c = `<div class="sys-card" style="background:rgba(0,120,215,0.2); border-color:#0078d7;"><b>C:\\ Virtual NVRAM Drive</b><br><span style="font-size:11px;">Scans localStorage for system files.</span></div><div style="max-height:300px; overflow-y:auto;">${filesHTML}</div>`;
        } else if(id === 'sys_log') {
            t = "Update History"; w = 450;
            c = `
                <div class="sys-card"><b>v23.0 (The Ecosystem)</b> - Added GemiDrive, Desktop Widgets, Restored all 14 Apps.</div>
                <div class="sys-card"><b>v22.1 (Archive Edition)</b> - Built True Hypervisor, Restored authentic v1.0 payload.</div>
                <div class="sys-card"><b>v22.0 (Glassmorphism)</b> - Total UI/UX graphics engine rewrite.</div>
                <div class="sys-card"><b>v21.2 (Network Boot)</b> - Shifted to GitHub cloud architecture to fix HTML escaping bugs.</div>
                <div class="sys-card"><b>v21.0 (The Omniverse)</b> - Introduced multi-theme Chameleon Engine.</div>
                <div class="sys-card"><b>v20.0 (The Pure System)</b> - Bare metal refactor, Games banned.</div>
                <div class="sys-card"><b>v14.0 (The Giant Update)</b> - Introduction of Games and App ecosystem.</div>
                <div class="sys-card"><b>v1.0 (Legacy Web Sim)</b> - Windows 7 Clone, Hardware sliders, Terminal.</div>
            `;
        } else if(id === 'sys_time') {
            t = "Time Machine"; w = 360;
            c = `<div style="text-align:center; font-size:45px; margin-bottom:15px; filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3));">⏳</div><button onclick="jumpVer('v1')" style="width:100%; padding:10px; margin-bottom:8px; background:#008080; color:white; border:2px outset #fff; cursor:pointer; font-family:monospace; box-shadow:2px 2px 0 #000;">Boot TRUE v1.0 (Web Sim)</button><button onclick="jumpVer('v23')" style="width:100%; padding:10px; background:linear-gradient(135deg, #0078d7, #00ccff); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Stay on v23.0</button>`;
        } else if(id === 'sys_set') {
            t = "OmniSettings v23";
            c = `<div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Paste Image URL..."><button onclick="let u=document.getElementById('wp-in').value; localStorage.setItem('GemiOS_Wallpaper', u); location.reload();" style="width:100%; background:#0078d7; color:white; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Apply Wallpaper</button></div><button onclick="localStorage.removeItem('GemiOS_Wallpaper'); location.reload();" style="width:100%; background:rgba(255,255,255,0.1); color:inherit; padding:10px; border:1px solid rgba(255,255,255,0.2); border-radius:6px; margin-bottom:10px; cursor:pointer;">Reset Default Wallpaper</button><button onclick="localStorage.clear(); location.reload();" style="width:100%; background:rgba(255,77,77,0.8); color:white; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Format NVRAM Drive</button>`;
        } else if(id === 'sys_term') {
            t = "Terminal"; w = 480;
            c = `<div style="background:#0a0a0a; color:#38ef7d; padding:10px; font-family:monospace; height:250px; overflow-y:auto; border-radius:6px; box-shadow:inset 0 0 10px rgba(0,0,0,0.8);" id="t-out">GemiOS Cloud Terminal v23<br>Type 'help'<br></div><div style="display:flex; background:#111; padding:8px; border-radius:6px; margin-top:5px;"><span style="color:#38ef7d; margin-right:8px; font-weight:bold;">></span><input type="text" style="flex-grow:1; background:transparent; color:#38ef7d; border:none; outline:none; font-family:monospace; font-size:14px;" onkeydown="if(event.key==='Enter'){ let o=document.getElementById('t-out'); o.innerHTML+='<br>> '+this.value; if(this.value==='help') o.innerHTML+='<br>cmds: clear, reboot, v1, nuke, drive'; if(this.value==='clear') o.innerHTML=''; if(this.value==='reboot') location.reload(); if(this.value==='v1') jumpVer('v1'); if(this.value==='nuke'){ localStorage.clear(); location.reload(); } if(this.value==='drive') openApp('sys_drive'); this.value=''; o.scrollTop=o.scrollHeight; }"></div>`;
        } else if(id === 'sys_browser') {
            t = "Web Browser"; w = 800;
            c = `<div style="display:flex; gap:8px; margin-bottom:10px;"><input type="text" id="b-url" value="https://wikipedia.org" style="flex-grow:1; padding:8px 12px; border-radius:20px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;"><button onclick="document.getElementById('b-frame').src=document.getElementById('b-url').value" style="padding:8px 16px; border-radius:20px; border:none; background:#0078d7; color:white; font-weight:bold; cursor:pointer;">Go</button></div><iframe id="b-frame" src="https://wikipedia.org" style="width:100%; height:450px; border:none; border-radius:8px; background:white;"></iframe>`;
        } else if(id === 'app_note') {
            t = "Notepad"; w = 400;
            let st = localStorage.getItem('GemiOS_Notepad') || '';
            c = `<textarea oninput="localStorage.setItem('GemiOS_Notepad', this.value)" style="width:100%; height:300px; box-sizing:border-box; resize:none; border:none; border-radius:6px; padding:15px; font-family:'Inter', sans-serif; font-size:14px; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Jot something down... (Auto-saves to GemiDrive)">${st}</textarea>`;
        } else if(id === 'app_calc') {
            t = "Calculator"; w = 260;
            c = `<div style="background:rgba(255,255,255,0.9); color:black; padding:15px; font-size:28px; text-align:right; margin-bottom:10px; border-radius:6px; font-family:monospace;" id="cd">0</div><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px;">${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="padding:15px; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.1); cursor:pointer; font-weight:bold; border-radius:6px; color:inherit; font-size:16px;" onclick="let d=document.getElementById('cd'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') { try { d.innerText=eval(d.innerText); } catch(e){ d.innerText='Err'; } } else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}</div>`;
        } else if(id === 'app_paint') {
            t = "GemiPaint"; w = 600;
            c = `<div style="margin-bottom:10px; display:flex; gap:10px; align-items:center;"><button onclick="const c=document.getElementById('cvs'); c.getContext('2d').clearRect(0,0,c.width,c.height);" style="padding:6px 12px; border-radius:4px; border:none; cursor:pointer;">Clear Canvas</button> <input type="color" id="p-col" value="#000000" style="cursor:pointer;"></div><canvas id="cvs" style="background:white; border-radius:6px; width:100%; height:400px; cursor:crosshair; box-shadow:inset 0 0 10px rgba(0,0,0,0.1);"></canvas>`;
        } else if(id === 'app_pong') {
            t = "GemiPong"; w = 420;
            c = `<canvas id="pong-cvs" width="380" height="240" style="background:#0a0a0a; border-radius:8px; box-shadow:inset 0 5px 15px rgba(0,0,0,0.5); display:block; margin:0 auto; cursor:none;"></canvas>`;
        } else if(id === 'app_snake') {
            t = "Snake"; w = 340;
            let hs = localStorage.getItem('GemiOS_SnakeHS') || 0;
            c = `<div style="text-align:center; margin-bottom:10px; font-weight:bold;">Score: <b id="sn-score" style="color:#38ef7d;">0</b> | High: <b id="sn-hs" style="color:#4db8ff;">${hs}</b></div><canvas id="sn-cvs" width="300" height="300" style="background:#0a0a0a; display:block; margin:0 auto; border-radius:8px; box-shadow:inset 0 0 15px rgba(0,0,0,0.8);"></canvas><div style="text-align:center; margin-top:10px; font-size:12px; opacity:0.7;">Use Arrow Keys</div>`;
        } else if(id === 'app_sweeper') {
            t = "GemiSweeper"; w = 290;
            c = `<div style="text-align:center; margin-bottom:10px;"><button onclick="initSweeper()" style="padding:6px 15px; border-radius:4px; border:none; background:#0078d7; color:white; font-weight:bold; cursor:pointer;">Restart Game</button></div><div id="ms-grid" style="display:grid; grid-template-columns:repeat(9,25px); gap:2px; justify-content:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px;"></div>`;
        } else if(id === 'app_ttt') {
            t = "Tic-Tac-Toe"; w = 260;
            c = `<div id="ttt-stat" style="text-align:center; font-weight:bold; font-size:18px; margin-bottom:15px; color:#4db8ff;">Player X Turn</div><div id="ttt-b" style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px;"></div><div style="text-align:center; margin-top:15px;"><button onclick="initTTT()" style="padding:6px 15px; border-radius:4px; border:none; background:#444; color:white; cursor:pointer;">Reset</button></div>`;
        }

        let wid = 'w_' + Math.random().toString(36).substr(2,9);
        let winHTML = `
            <div class="win" id="${wid}" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${w}px; z-index:${++zIndexCount}; pointer-events:auto;" onmousedown="this.style.zIndex=++zIndexCount">
                <div class="title-bar" onmousedown="dragW(event, '${wid}')">${t} <button class="close-btn" onclick="closeApp('${wid}', '${id}')">X</button></div>
                <div class="content">${c}</div>
            </div>
        `;
        document.getElementById('window-layer').insertAdjacentHTML('beforeend', winHTML);
        
        if(id === 'app_pong') setTimeout(initPong, 100);
        if(id === 'app_snake') setTimeout(initSnake, 100);
        if(id === 'app_sweeper') setTimeout(initSweeper, 100);
        if(id === 'app_ttt') setTimeout(initTTT, 100);
        if(id === 'app_paint') setTimeout(() => {
            const can = document.getElementById('cvs'); if(!can) return;
            can.width = can.offsetWidth; can.height = can.offsetHeight;
            const ctx = can.getContext('2d'); let drawing = false;
            can.onmousedown = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
            can.onmouseup = () => drawing = false; can.onmouseout = () => drawing = false;
            can.onmousemove = (e) => { if(drawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle = document.getElementById('p-col').value; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); } };
        }, 100);
    };

    window.dragW = function(e, id) {
        let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
        w.style.zIndex = ++zIndexCount; w.style.transition = 'none';
        document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
        document.onmouseup = () => { document.onmousemove = null; w.style.transition = 'background 0.3s, color 0.3s'; document.onmouseup = null; };
    };

    window.closeApp = function(wid, app) {
        document.getElementById(wid).remove();
        if(app === 'app_pong') clearInterval(pongItv);
        if(app === 'app_snake') clearInterval(snakeItv);
    };

    // --- GAME ENGINES ---
    let pongItv;
    window.initPong = function() {
        let cvs = document.getElementById('pong-cvs'); if(!cvs) return; let ctx = cvs.getContext('2d');
        let pY = 100, cY = 100, bX = 190, bY = 120, bDX = 5, bDY = 3; clearInterval(pongItv);
        cvs.onmousemove = (e) => pY = e.offsetY - 20;
        pongItv = setInterval(() => {
            if(!document.getElementById('pong-cvs')) { clearInterval(pongItv); return; }
            bX += bDX; bY += bDY;
            if(bY <= 0 || bY >= 235) bDY = -bDY;
            if(bX <= 10 && bY > pY && bY < pY + 40) bDX = -bDX;
            if(bX >= 365 && bY > cY && bY < cY + 40) bDX = -bDX;
            if(bX < 0 || bX > 380) { bX = 190; bY = 120; bDX = -bDX; }
            cY += (bY - (cY + 20)) * 0.12; 
            ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,380,240);
            ctx.fillStyle = '#4db8ff'; ctx.fillRect(5, pY, 6, 40); 
            ctx.fillStyle = '#ff4d4d'; ctx.fillRect(369, cY, 6, 40); 
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(bX, bY, 4, 0, Math.PI*2); ctx.fill(); 
        }, 30);
    };

    let snakeItv;
    window.initSnake = function() {
        let can = document.getElementById('sn-cvs'); if(!can) return; let ctx = can.getContext('2d');
        let snake = [{x: 150, y: 150}], dx = 10, dy = 0, score = 0, food = {x: 50, y: 50};
        clearInterval(snakeItv); document.getElementById('sn-score').innerText = '0';
        let highScore = parseInt(localStorage.getItem('GemiOS_SnakeHS')) || 0;
        
        let handleKey = (e) => {
            if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
            if(e.key==='ArrowUp' && dy===0) { dx=0; dy=-10; } else if(e.key==='ArrowDown' && dy===0) { dx=0; dy=10; }
            else if(e.key==='ArrowLeft' && dx===0) { dx=-10; dy=0; } else if(e.key==='ArrowRight' && dx===0) { dx=10; dy=0; }
        };
        document.addEventListener('keydown', handleKey);

        snakeItv = setInterval(() => {
            if(!document.getElementById('sn-cvs')) { clearInterval(snakeItv); document.removeEventListener('keydown', handleKey); return; }
            let head = {x: snake[0].x + dx, y: snake[0].y + dy};
            if(head.x<0 || head.x>=300 || head.y<0 || head.y>=300 || snake.some(s=>s.x===head.x && s.y===head.y)) {
                clearInterval(snakeItv); document.removeEventListener('keydown', handleKey);
                if(score > highScore) { localStorage.setItem('GemiOS_SnakeHS', score); alert('New High Score! ' + score); } else { alert('Game Over! Score: ' + score); }
                initSnake(); return;
            }
            snake.unshift(head);
            if(head.x===food.x && head.y===food.y) { score+=10; document.getElementById('sn-score').innerText=score; food={x:Math.floor(Math.random()*30)*10, y:Math.floor(Math.random()*30)*10}; } else snake.pop();
            
            ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,300,300);
            ctx.fillStyle = '#38ef7d'; snake.forEach(s => { ctx.beginPath(); ctx.arc(s.x+5, s.y+5, 4.5, 0, Math.PI*2); ctx.fill(); });
            ctx.fillStyle = '#ff4d4d'; ctx.beginPath(); ctx.arc(food.x+5, food.y+5, 4.5, 0, Math.PI*2); ctx.fill();
        }, 100);
    };

    window.initSweeper = function() {
        let grid = document.getElementById('ms-grid'); if(!grid) return; grid.innerHTML = '';
        for(let i=0; i<81; i++) {
            let cell = document.createElement('div'); 
            cell.style.cssText = "width:25px; height:25px; background:rgba(255,255,255,0.8); color:black; border-radius:3px; text-align:center; font-weight:bold; cursor:pointer; line-height:25px; font-size:14px; box-shadow:inset -1px -1px 2px rgba(0,0,0,0.3);";
            cell.onclick = function() { 
                this.style.background = 'rgba(255,255,255,0.4)'; this.style.boxShadow = 'none'; this.style.color = 'white';
                if(Math.random() < 0.15) { this.innerText='💣'; this.style.background='#ff4d4d'; setTimeout(()=>alert('Boom!'), 50); } 
                else { this.innerText = Math.floor(Math.random()*3)||''; } 
            };
            grid.appendChild(cell);
        }
    };

    let tttBoard = [], tttPlayer = 'X', tttActive = true;
    window.initTTT = function() {
        tttBoard = ['','','','','','','','','']; tttPlayer = 'X'; tttActive = true;
        document.getElementById('ttt-stat').innerText = "Player X Turn"; document.getElementById('ttt-stat').style.color = "#4db8ff";
        let b = document.getElementById('ttt-b'); if(!b) return; b.innerHTML = '';
        for(let i=0; i<9; i++) b.innerHTML += `<button style="height:60px; font-size:28px; font-weight:bold; border:none; border-radius:4px; background:rgba(255,255,255,0.8); cursor:pointer; box-shadow:inset -1px -1px 3px rgba(0,0,0,0.3);" onclick="playTTT(${i}, this)"></button>`;
    };
    window.playTTT = function(i, btn) {
        if(!tttActive || tttBoard[i] !== '') return;
        tttBoard[i] = tttPlayer; btn.innerText = tttPlayer; 
        btn.style.color = tttPlayer==='X'?'#0078d7':'#ff4d4d'; btn.style.background = 'rgba(255,255,255,0.9)'; btn.style.boxShadow = 'none';
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        let won = lines.some(l => tttBoard[l[0]] && tttBoard[l[0]]===tttBoard[l[1]] && tttBoard[l[0]]===tttBoard[l[2]]);
        if(won) { document.getElementById('ttt-stat').innerText = `${tttPlayer} Wins!`; document.getElementById('ttt-stat').style.color = "#38ef7d"; tttActive = false; }
        else if(!tttBoard.includes('')) { document.getElementById('ttt-stat').innerText = "Draw!"; document.getElementById('ttt-stat').style.color = "white"; tttActive = false; }
        else { tttPlayer = tttPlayer === 'X' ? 'O' : 'X'; document.getElementById('ttt-stat').innerText = `Player ${tttPlayer} Turn`; document.getElementById('ttt-stat').style.color = tttPlayer==='X'?'#4db8ff':'#ff4d4d';}
    };
}
