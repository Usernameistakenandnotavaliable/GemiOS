// =========================================================================
// GemiOS CLOUD HYPERVISOR - v22.1 (TRUE ARCHIVE EDITION)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v22';
console.log("Hypervisor targeting state: " + bootVersion);

if (bootVersion === 'v1') {
    // =====================================================================
    // KERNEL 1: THE TRUE, ORIGINAL V1.0 (Windows 7 Web Simulator)
    // =====================================================================
    const originalV1Code = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Windows 7 Web Simulator</title>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; user-select: none; }
        
        /* Desktop Background */
        #desktop {
            width: 100vw; height: 100vh;
            background: linear-gradient(135deg, #004e92, #000428); /* Generic Win7 Blue */
            position: relative;
        }

        /* Aero Window Style */
        .window {
            position: absolute; top: 100px; left: 150px; width: 400px; min-height: 250px;
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            display: none; /* Hidden by default */
            flex-direction: column;
            backdrop-filter: blur(10px); /* Aero Glass effect */
        }
        
        .title-bar {
            padding: 5px 10px; background: rgba(255, 255, 255, 0.4); border-bottom: 1px solid #ccc;
            cursor: grab; display: flex; justify-content: space-between; align-items: center;
            border-top-left-radius: 8px; border-top-right-radius: 8px; font-weight: bold;
        }
        
        .close-btn { background: #ff4d4d; color: white; border: none; padding: 2px 10px; border-radius: 3px; cursor: pointer; }
        .window-content { padding: 15px; flex-grow: 1; background: #fff; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;}

        /* Taskbar */
        #taskbar {
            position: absolute; bottom: 0; width: 100%; height: 40px;
            background: rgba(20, 30, 50, 0.8); backdrop-filter: blur(10px);
            display: flex; align-items: center; padding: 0 10px; box-sizing: border-box;
            border-top: 1px solid rgba(255,255,255,0.2);
        }

        /* Start Button */
        #start-btn {
            width: 36px; height: 36px; background: radial-gradient(circle, #4db8ff, #0078d7);
            border-radius: 50%; border: 2px solid white; cursor: pointer;
            display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;
            box-shadow: 0 0 10px rgba(0, 120, 215, 0.8);
        }

        #start-menu {
            position: absolute; bottom: 45px; left: 0; width: 250px; height: 350px;
            background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);
            border-radius: 5px; box-shadow: 2px 2px 10px rgba(0,0,0,0.5); display: none;
            padding: 10px; box-sizing: border-box;
        }

        .menu-item { padding: 10px; cursor: pointer; border-radius: 3px; margin-bottom: 5px; background: #eee;}
        .menu-item:hover { background: #0078d7; color: white; }

        #clock { margin-left: auto; color: white; font-size: 14px; }

        /* Sliders */
        .setting-row { margin-bottom: 15px; }
        input[type=range] { width: 100%; }
        
        /* Fake File Manager */
        .file-icon { display: inline-block; width: 60px; text-align: center; margin: 10px; cursor: pointer; }
        .file-icon div { font-size: 30px; }
        
        #v1-escape { position:absolute; top:10px; right:10px; background:red; color:white; font-weight:bold; padding:10px; border:2px solid white; border-radius:5px; cursor:pointer; z-index:9999; }
    </style>
</head>
<body>

<div id="desktop">
    <button id="v1-escape" onclick="localStorage.setItem('GemiOS_TargetVersion', 'v22'); location.reload();">🚀 Escape to Modern OS</button>

    <div class="window" id="win-explorer" style="left: 50px; top: 50px; display:flex;">
        <div class="title-bar" onmousedown="dragWindow(event, 'win-explorer')">
            <span>Windows Explorer</span>
            <button class="close-btn" onclick="toggleWindow('win-explorer')">X</button>
        </div>
        <div class="window-content" id="file-content">
            <div class="file-icon" onclick="alert('Accessing C: Drive (Simulation)')"><div>💽</div>C: Drive</div>
            <div class="file-icon" onclick="alert('Opening Documents...')"><div>📁</div>Docs</div>
            <div class="file-icon" onclick="downloadFakeFile()"><div>⬇️</div>Download Test</div>
        </div>
    </div>

    <div class="window" id="win-settings" style="left: 500px; top: 150px; display:flex;">
        <div class="title-bar" onmousedown="dragWindow(event, 'win-settings')">
            <span>System Configuration (Simulated)</span>
            <button class="close-btn" onclick="toggleWindow('win-settings')">X</button>
        </div>
        <div class="window-content">
            <p><i>Note: These control the simulation speed, not actual host hardware.</i></p>
            <div class="setting-row">
                <label>CPU Power (<span id="cpu-val">3.0</span> GHz)</label>
                <input type="range" id="cpu-slider" min="1.0" max="5.0" step="0.1" value="3.0" oninput="updateSysInfo()">
            </div>
            <div class="setting-row">
                <label>CPU Cores (<span id="core-val">4</span>)</label>
                <input type="range" id="core-slider" min="1" max="16" step="1" value="4" oninput="updateSysInfo()">
            </div>
            <div class="setting-row">
                <label>RAM (<span id="ram-val">8</span> GB)</label>
                <input type="range" id="ram-slider" min="2" max="64" step="2" value="8" oninput="updateSysInfo()">
            </div>
            <button onclick="applySettings()" style="padding: 5px 15px;">Apply Hardware Settings</button>
        </div>
    </div>

    <div id="start-menu">
        <div class="menu-item" onclick="toggleWindow('win-explorer'); toggleStartMenu();">📁 File Explorer</div>
        <div class="menu-item" onclick="toggleWindow('win-settings'); toggleStartMenu();">⚙️ System Configuration</div>
        <hr>
        <div class="menu-item" onclick="alert('Shutting down simulator...'); window.close();">Shut Down</div>
    </div>

    <div id="taskbar">
        <div id="start-btn" onclick="toggleStartMenu()">W7</div>
        <div id="clock">12:00 AM</div>
    </div>
</div>

<script>
    // --- Clock Logic ---
    function updateClock() {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- UI Toggles ---
    function toggleStartMenu() {
        const menu = document.getElementById('start-menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }

    function toggleWindow(id) {
        const win = document.getElementById(id);
        win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
    }

    // --- Window Dragging Logic ---
    let activeWindow = null;
    let offsetX = 0, offsetY = 0;

    function dragWindow(e, windowId) {
        activeWindow = document.getElementById(windowId);
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
        activeWindow.style.zIndex = 10;
        
        offsetX = e.clientX - activeWindow.offsetLeft;
        offsetY = e.clientY - activeWindow.offsetTop;
        document.onmousemove = moveWindow;
        document.onmouseup = stopDrag;
    }

    function moveWindow(e) {
        if (activeWindow) {
            activeWindow.style.left = (e.clientX - offsetX) + 'px';
            activeWindow.style.top = (e.clientY - offsetY) + 'px';
        }
    }

    function stopDrag() {
        document.onmousemove = null;
        document.onmouseup = null;
        activeWindow = null;
    }

    // --- System Simulator Logic ---
    function updateSysInfo() {
        document.getElementById('cpu-val').innerText = document.getElementById('cpu-slider').value;
        document.getElementById('core-val').innerText = document.getElementById('core-slider').value;
        document.getElementById('ram-val').innerText = document.getElementById('ram-slider').value;
    }

    function applySettings() {
        const cpu = document.getElementById('cpu-slider').value;
        const ram = document.getElementById('ram-slider').value;
        alert(\`Hardware configuration applied! \\n\\nThe OS simulation will now attempt to run utilizing \${cpu}GHz and \${ram}GB of virtual memory.\`);
    }

    // --- Internet Download Simulation ---
    function downloadFakeFile() {
        const content = "This is a simulated download file from your Windows 7 Web OS!";
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'simulated_download.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
<\/script>
</body>
</html>`;

    // Overwrite the page entirely with the true V1 code
    document.open();
    document.write(originalV1Code);
    document.close();

} else {
    // =====================================================================
    // KERNEL 2: MODERN UI (GemiOS v22)
    // =====================================================================
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        body { margin:0; overflow:hidden; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Inter', sans-serif; color:white; user-select:none; transition: background 0.6s ease, color 0.6s ease;}
        body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #222; }
        
        .win { 
            position:absolute; background:rgba(20, 30, 40, 0.65); backdrop-filter: blur(25px) saturate(180%); -webkit-backdrop-filter: blur(25px) saturate(180%); color:white; border-radius:16px; box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.15); display: flex; flex-direction: column;
        }
        body.light-mode .win { background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.4); color: #222; box-shadow: 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8); }
        .title-bar { padding:12px 15px; font-weight:600; font-size: 14px; display:flex; justify-content:space-between; align-items: center; border-bottom:1px solid rgba(255,255,255,0.1); cursor:grab; }
        body.light-mode .title-bar { border-bottom: 1px solid rgba(0,0,0,0.1); }
        .content { padding:15px; flex-grow: 1; overflow-y: auto; }
        .close-btn { background:rgba(255, 77, 77, 0.8); border:none; color:white; cursor:pointer; width: 24px; height: 24px; border-radius:50%; font-weight:bold; font-size: 10px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .close-btn:hover { background:rgba(255, 77, 77, 1); transform: scale(1.1); }

        #taskbar { position:absolute; bottom:0; width:100%; height:50px; background:rgba(10, 15, 20, 0.75); backdrop-filter:blur(20px) saturate(150%); display:flex; align-items:center; padding: 0 15px; box-sizing: border-box; border-top:1px solid rgba(255,255,255,0.1); z-index:99999; }
        body.light-mode #taskbar { background: rgba(255,255,255,0.75); border-top: 1px solid rgba(0,0,0,0.1); color: #222; }
        .start { width:38px; height:38px; background:radial-gradient(circle at top left, #4db8ff, #005a9e); border-radius:10px; border:1px solid rgba(255,255,255,0.4); text-align:center; line-height:36px; cursor:pointer; font-weight: 600; font-size: 18px; box-shadow: 0 4px 10px rgba(0, 90, 158, 0.5); transition: 0.2s;}
        .start:hover { transform: scale(1.05) translateY(-2px); }

        #start-menu { position:absolute; bottom:65px; left:15px; width:320px; max-height:550px; background:rgba(20, 30, 40, 0.75); backdrop-filter:blur(25px) saturate(180%); border-radius:16px; box-shadow:0 20px 40px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); display:none; flex-direction:column; z-index:100000; overflow:hidden;}
        body.light-mode #start-menu { background:rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.1); color: #222;}
        .start-header { background: rgba(0, 90, 158, 0.8); color:white; padding:20px; font-weight:600; display:flex; align-items:center; gap: 15px; }
        body.light-mode .start-header { background: linear-gradient(135deg, #0078d7, #005a9e); }
        .start-item { padding:12px 20px; cursor:pointer; display:flex; align-items:center; gap:12px; font-size:14px; transition: 0.2s; border-radius: 8px; margin: 4px 8px; }
        .start-item:hover { background:rgba(255,255,255,0.1); transform: translateX(5px); }
        body.light-mode .start-item:hover { background:rgba(0,0,0,0.05); }

        .icon { position:absolute; text-align:center; width:80px; cursor:pointer; transition:all 0.3s; z-index:10; border-radius: 12px; padding: 12px 5px; } 
        .icon:hover { background:rgba(255,255,255,0.1); transform: translateY(-5px) scale(1.05); }
        .icon div { font-size: 38px; margin-bottom: 8px; transition: 0.3s;}
        body.light-mode .icon { color: #222; font-weight: 500;}
        #desktop-bg { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; pointer-events: none; background-size: cover !important; background-position: center !important; z-index: 1;}
        .sys-card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px; }
        body.light-mode .sys-card { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); }
    `;
    document.head.appendChild(style);

    const desktopHTML = `
        <div id="desktop-bg"></div>
        <div id="desktop-icons">
            <div class="icon app-sys" style="top:20px; left:20px;" onclick="openApp('sys_time')"><div>⏳</div>TimeMach</div>
            <div class="icon app-sys" style="top:130px; left:20px;" onclick="openApp('sys_set')"><div>⚙️</div>Settings</div>
            <div class="icon app-util" style="top:240px; left:20px;" onclick="openApp('app_note')"><div>📝</div>Notepad</div>
            <div class="icon app-game" style="top:20px; left:120px;" onclick="openApp('app_pong')"><div>🏓</div>Pong</div>
        </div>
        <div id="window-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:50; pointer-events:none;"></div>
        
        <div id="start-menu">
            <div class="start-header">
                <div style="font-size:30px; background:rgba(255,255,255,0.2); border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center;">👤</div>
                <div><div style="font-size:16px;">System Admin</div><div style="font-size:11px; opacity:0.8;">GemiOS Network Edition</div></div>
            </div>
            <div style="overflow-y:auto; padding: 10px 0;">
                <div class="start-item app-sys" onclick="openApp('sys_time')"><span style="font-size:18px;">⏳</span> Time Machine</div>
                <div class="start-item app-sys" onclick="openApp('sys_set')"><span style="font-size:18px;">⚙️</span> Settings</div>
                <div class="start-item app-util" onclick="openApp('app_note')"><span style="font-size:18px;">📝</span> Notepad</div>
                <div class="start-item app-game" onclick="openApp('app_pong')"><span style="font-size:18px;">🏓</span> Pong</div>
            </div>
        </div>

        <div id="taskbar">
            <div class="start" onclick="document.getElementById('start-menu').style.display=document.getElementById('start-menu').style.display==='flex'?'none':'flex'">G</div>
            <div style="margin-left:auto; display:flex; align-items:center; gap:20px; margin-right:10px;">
                <div onclick="toggleTheme()" style="cursor:pointer; font-size:20px;" title="Toggle Theme">🌓</div>
                <div style="font-weight:600; font-size:12px; background:rgba(56, 239, 125, 0.2); color:#38ef7d; padding:4px 10px; border-radius:20px; border:1px solid rgba(56,239,125,0.3);">CLOUD CONNECTED</div>
                <div id="clock" style="font-weight:600; font-size:14px; letter-spacing:1px;">12:00</div>
            </div>
        </div>
    `;
    document.body.innerHTML += desktopHTML;

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
        let t = "", c = "", w = 400;

        if(id === 'sys_time') {
            t = "True Time Archive"; w = 360;
            c = `
                <div style="text-align:center; font-size:45px; margin-bottom:15px; filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3));">⏳</div>
                <button onclick="jumpVer('v1')" style="width:100%; padding:10px; margin-bottom:8px; background:#008080; color:white; border:2px outset #fff; cursor:pointer; font-family:monospace; box-shadow:2px 2px 0 #000;">Boot TRUE v1.0 (Web Sim)</button>
                <button onclick="jumpVer('v22')" style="width:100%; padding:10px; background:linear-gradient(135deg, #0078d7, #00ccff); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; box-shadow:0 4px 15px rgba(0,120,215,0.4);">Stay on v22.0 (Modern UI)</button>
            `;
        } else if(id === 'sys_set') {
            t = "OmniSettings v22"; w = 420;
            c = `
                <div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br><input type="text" id="wp-in" style="width:100%; margin:8px 0; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(255,255,255,0.9); color:black;" placeholder="Paste Image URL..."><button onclick="let u=document.getElementById('wp-in').value; localStorage.setItem('GemiOS_Wallpaper', u); location.reload();" style="width:100%; background:#0078d7; color:white; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Apply Wallpaper</button></div>
                <button onclick="localStorage.removeItem('GemiOS_Wallpaper'); location.reload();" style="width:100%; background:rgba(255,255,255,0.1); color:inherit; padding:10px; border:1px solid rgba(255,255,255,0.2); border-radius:6px; margin-bottom:10px; cursor:pointer;">Reset Default Wallpaper</button>
            `;
        } else if(id === 'app_note') {
            t = "Notes"; w = 380;
            let st = localStorage.getItem('GemiOS_Notepad') || '';
            c = `<textarea oninput="localStorage.setItem('GemiOS_Notepad', this.value)" style="width:100%; height:250px; box-sizing:border-box; resize:none; border:none; border-radius:6px; padding:12px; font-family:'Inter', sans-serif; font-size:14px; outline:none; background:rgba(255,255,255,0.9); color:black; box-shadow:inset 0 2px 5px rgba(0,0,0,0.1);" placeholder="Jot something down... (Auto-saves to NVRAM)">${st}</textarea>`;
        } else if(id === 'app_pong') {
            t = "GemiPong"; w = 420;
            c = `<canvas id="pong-cvs" width="380" height="240" style="background:#0a0a0a; border-radius:8px; box-shadow:inset 0 5px 15px rgba(0,0,0,0.5); display:block; margin:0 auto; cursor:none;"></canvas>`;
        }

        let wid = 'w_' + Math.random().toString(36).substr(2,9);
        let winHTML = `
            <div class="win" id="${wid}" style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${w}px; z-index:${++zIndexCount}; pointer-events:auto;" onmousedown="this.style.zIndex=++zIndexCount">
                <div class="title-bar" onmousedown="dragW(event, '${wid}')">${t} <button class="close-btn" onclick="document.getElementById('${wid}').remove(); if('${id}'==='app_pong') clearInterval(pongItv);">X</button></div>
                <div class="content">${c}</div>
            </div>
        `;
        document.getElementById('window-layer').insertAdjacentHTML('beforeend', winHTML);
        if(id === 'app_pong') setTimeout(initPong, 100);
    };

    window.dragW = function(e, id) {
        let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
        w.style.zIndex = ++zIndexCount; w.style.transition = 'none';
        document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
        document.onmouseup = () => { document.onmousemove = null; w.style.transition = 'background 0.3s, color 0.3s'; document.onmouseup = null; };
    };

    let pongItv;
    window.initPong = function() {
        let cvs = document.getElementById('pong-cvs'); if(!cvs) return;
        let ctx = cvs.getContext('2d');
        let pY = 100, cY = 100, bX = 190, bY = 120, bDX = 5, bDY = 3;
        clearInterval(pongItv);
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
}
