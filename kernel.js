// =========================================================================
// GemiOS CLOUD HYPERVISOR (Multi-Kernel Architecture)
// =========================================================================

const bootVersion = localStorage.getItem('GemiOS_TargetVersion') || 'v21.3';
console.log("Hypervisor targeting state: " + bootVersion);

if (bootVersion === 'v1') {
    // =====================================================================
    // KERNEL 1: THE EXACT v1.0 ORIGINAL CODEBASE
    // =====================================================================
    const style = document.createElement('style');
    style.textContent = `
        body { margin:0; overflow:hidden; background:#008080; font-family:'Courier New', Courier, monospace; user-select:none; color:black;}
        .win { position:absolute; background:#c0c0c0; border:2px outset #fff; width:300px; }
        .title { background:#000080; color:white; padding:5px; font-weight:bold; display:flex; justify-content:space-between;}
        .content { padding:10px; }
        #taskbar { position:absolute; bottom:0; width:100%; height:35px; background:#c0c0c0; border-top:2px outset #fff; display:flex; align-items:center;}
        .start { border:2px outset #fff; padding:2px 10px; font-weight:bold; cursor:pointer; margin-left:5px;}
        .icon { position:absolute; color:white; text-align:center; width:60px; cursor:pointer; }
        #notif { position:absolute; bottom:50px; right:-400px; width:320px; background:#c0c0c0; border:2px outset #fff; padding:15px; transition:right 0.5s; z-index:999;}
    `;
    document.head.appendChild(style);

    const v1HTML = `
        <div id="notif">
            <h4 style="margin: 0 0 8px 0; color: #000080;">✨ Welcome to GemiOS</h4>
            wow this is cool right? windows 7 cloned into the browser... no this is NOT windows 7. This is GemiOS an artificially created operating system designed and fully created by google's Gemini.
        </div>
        <div class="icon" style="top:20px; left:20px;" onclick="openTerm()">💻<br>Term</div>
        <div class="icon" style="top:100px; left:20px;" onclick="openInfo()">📄<br>Info</div>
        <div id="taskbar"><div class="start" onclick="alert('Start menu not implemented in v1.0')">Start</div><div style="margin-left:auto;margin-right:10px;">v1.0</div></div>
        <div id="wins"></div>
    `;
    document.body.innerHTML = v1HTML;

    setTimeout(() => { document.getElementById('notif').style.right = '10px'; }, 1000);

    let z = 100;
    window.openTerm = function() {
        let w = document.createElement('div');
        w.className = 'win'; w.style.top = '50px'; w.style.left = '100px'; w.style.zIndex = ++z;
        w.innerHTML = `
            <div class="title" onmousedown="dragW(event, this.parentElement)">Terminal <b onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;background:#c0c0c0;color:black;border:2px outset #fff;padding:0 5px;">X</b></div>
            <div class="content" style="background:black; color:lime;">
                GemiOS v1.0 Booted.<br>
                Type 'upgrade' to return to modern OS.<br><br>
                C:\\> <input type="text" style="background:black; color:lime; border:none; outline:none; font-family:monospace; width:80%;" 
                onkeydown="if(event.key==='Enter'){ if(this.value==='upgrade'){ localStorage.setItem('GemiOS_TargetVersion', 'v21.3'); location.reload(); } }">
            </div>
        `;
        document.getElementById('wins').appendChild(w);
    };

    window.openInfo = function() {
        let w = document.createElement('div');
        w.className = 'win'; w.style.top = '150px'; w.style.left = '150px'; w.style.zIndex = ++z;
        w.innerHTML = `
            <div class="title" onmousedown="dragW(event, this.parentElement)">SysInfo <b onclick="this.parentElement.parentElement.remove()" style="cursor:pointer;background:#c0c0c0;color:black;border:2px outset #fff;padding:0 5px;">X</b></div>
            <div class="content"><b>GemiOS Virtual System</b><br>Build: v1.0 First Edition<br>Features: Dragging, Terminal.</div>
        `;
        document.getElementById('wins').appendChild(w);
    };

    window.dragW = function(e, win) {
        let ox = e.clientX - win.offsetLeft; let oy = e.clientY - win.offsetTop;
        win.style.zIndex = ++z;
        document.onmousemove = (ev) => { win.style.left = (ev.clientX - ox) + 'px'; win.style.top = (ev.clientY - oy) + 'px'; };
        document.onmouseup = () => document.onmousemove = null;
    };

} else {
    // =====================================================================
    // KERNEL 2: THE MODERN v21.3 OMNIVERSE CODEBASE
    // =====================================================================
    const style = document.createElement('style');
    style.textContent = `
        body { margin:0; overflow:hidden; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Segoe UI', sans-serif; color:white; user-select:none; transition: background 0.5s, color 0.5s;}
        body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #333; }
        .win { position:absolute; background:rgba(255,255,255,0.85); backdrop-filter:blur(20px); color:black; border-radius:12px; box-shadow:0 20px 40px rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.4);}
        body.light-mode .win { background: rgba(255,255,255,0.95); border: 1px solid #ccc; }
        .title-bar { background:rgba(255,255,255,0.5); padding:10px; font-weight:bold; border-radius:12px 12px 0 0; display:flex; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,0.1); cursor:grab;}
        body.light-mode .title-bar { background: rgba(220,220,220,0.8); }
        .content { padding:15px; }
        #taskbar { position:absolute; bottom:0; width:100%; height:45px; background:rgba(0,0,0,0.8); backdrop-filter:blur(20px); display:flex; align-items:center; border-top:1px solid rgba(255,255,255,0.2); z-index:99999;}
        body.light-mode #taskbar { background: rgba(255,255,255,0.85); color: black; }
        .start { width:35px; height:35px; background:radial-gradient(circle, #4db8ff, #005a9e); border-radius:50%; border:2px solid white; text-align:center; line-height:35px; margin-left:10px; cursor:pointer;}
        .icon { position:absolute; text-align:center; width:80px; cursor:pointer; transition:0.2s; z-index:10;} 
        .icon:hover { background:rgba(255,255,255,0.1); border-radius:8px;}
        body.light-mode .icon { color: #333; }
        .close-btn { background:#ff4d4d; border:none; color:white; cursor:pointer; padding:2px 8px; border-radius:4px; font-weight:bold; }
        #desktop-bg { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; pointer-events: none; background-size: cover !important; background-position: center !important; z-index: 1;}
        .sys-card { background: rgba(0,0,0,0.05); padding: 12px; border-radius: 6px; border: 1px solid #ccc; margin-bottom: 10px; }
        #start-menu { position:absolute; bottom:55px; left:10px; width:300px; max-height:500px; background:rgba(255,255,255,0.95); backdrop-filter:blur(10px); border-radius:8px; box-shadow:2px 5px 20px rgba(0,0,0,0.5); display:none; flex-direction:column; z-index:100000; color:black; overflow:hidden; }
        .start-item { padding:10px 15px; cursor:pointer; display:flex; align-items:center; gap:10px; font-size:14px; border-bottom:1px solid #eee;}
        .start-item:hover { background:#d9ebf9; }
    `;
    document.head.appendChild(style);

    const desktopHTML = `
        <div id="desktop-bg"></div>
        <div id="desktop-icons">
            <div class="icon" style="top:20px; left:20px;" onclick="openApp('sys_time')"><div style="font-size:35px;">⏳</div>TimeMach</div>
            <div class="icon" style="top:120px; left:20px;" onclick="openApp('sys_set')"><div style="font-size:35px;">⚙️</div>Settings</div>
            <div class="icon" style="top:220px; left:20px;" onclick="openApp('sys_term')"><div style="font-size:35px;">⌨️</div>Terminal</div>
            <div class="icon" style="top:20px; left:120px;" onclick="openApp('app_pong')"><div style="font-size:35px;">🏓</div>Pong</div>
        </div>
        <div id="window-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:50; pointer-events:none;"></div>
        
        <div id="start-menu">
            <div style="background:#005a9e; color:white; padding:15px; font-weight:bold;">👤 Cloud Admin</div>
            <div style="overflow-y:auto; max-height:350px;">
                <div class="start-item" onclick="openApp('sys_time')">⏳ Time Machine</div>
                <div class="start-item" onclick="openApp('sys_set')">⚙️ Settings</div>
                <div class="start-item" onclick="openApp('app_pong')">🏓 Pong</div>
            </div>
        </div>

        <div id="taskbar">
            <div class="start" id="sb-btn" onclick="document.getElementById('start-menu').style.display=document.getElementById('start-menu').style.display==='flex'?'none':'flex'">G</div>
            <div style="margin-left:auto; display:flex; align-items:center; gap:15px; margin-right:20px;">
                <div onclick="toggleTheme()" style="cursor:pointer; font-size:18px;" title="Toggle Light/Dark Mode">🌓</div>
                <div style="font-weight:bold; color:#38ef7d;" id="cloud-status">v21.3 CLOUD</div>
                <div id="clock" style="font-weight:bold;">12:00</div>
            </div>
        </div>
    `;
    document.body.innerHTML = desktopHTML;

    let zIndexCount = 100;
    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }, 1000);

    let isLightMode = localStorage.getItem('GemiOS_Theme') === 'light';
    window.applyTheme = function() { if(isLightMode) document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); };
    window.toggleTheme = function() { isLightMode = !isLightMode; localStorage.setItem('GemiOS_Theme', isLightMode ? 'light' : 'dark'); applyTheme(); };
    applyTheme();

    let savedWP = localStorage.getItem('GemiOS_Wallpaper');
    if(savedWP) document.getElementById('desktop-bg').style.background = `url(${savedWP}) center/cover`;

    window.jumpVer = function(v) {
        localStorage.setItem('GemiOS_TargetVersion', v);
        location.reload();
    };

    window.openApp = function(id) {
        document.getElementById('start-menu').style.display = 'none';
        let t = "", c = "", w = 400;

        if(id === 'sys_time') {
            t = "True Time Machine"; w = 350;
            c = `
                <div style="text-align:center; font-size:40px; margin-bottom:10px;">⏳</div>
                <p style="text-align:center; font-size:12px; margin-top:0;">Boot into exact historical source code.</p>
                <button onclick="jumpVer('v1')" style="width:100%; padding:8px; margin-bottom:5px; background:#008080; color:white; border:2px outset #fff; cursor:pointer;">Boot v1.0 (True Original)</button>
                <button onclick="jumpVer('v21.3')" style="width:100%; padding:8px; background:linear-gradient(45deg, #ff00cc, #333399); color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Stay on v21.3 (Modern)</button>
            `;
        } else if(id === 'sys_set') {
            t = "System Settings"; w = 420;
            c = `<div class="sys-card"><b>NVRAM Custom Wallpaper</b><br><input type="text" id="wp-in" style="width:100%; margin:5px 0; padding:5px;"><button onclick="let u=document.getElementById('wp-in').value; localStorage.setItem('GemiOS_Wallpaper', u); location.reload();" style="width:100%; background:#0078d7; color:white; padding:8px; border:none; cursor:pointer;">Set & Save Image</button></div>`;
        } else if(id === 'sys_term') {
            t = "Terminal"; w = 450;
            c = `<div style="background:#000; color:#0f0; padding:10px; font-family:monospace; height:200px;" id="t-out">GemiTerm Cloud Edition<br>Type 'v1' to time travel.<br></div><div style="display:flex; background:#000; padding:5px;"><span style="color:#0f0; margin-right:5px;">></span><input type="text" style="flex-grow:1; background:#000; color:#0f0; border:none; outline:none;" onkeydown="if(event.key==='Enter'){ if(this.value==='v1') jumpVer('v1'); this.value=''; }"></div>`;
        } else if(id === 'app_pong') {
            t = "GemiPong"; w = 420;
            c = `<canvas id="pong-cvs" width="380" height="240" style="background:#000; display:block; margin:0 auto; cursor:none;"></canvas>`;
        }

        let wid = 'w_' + Math.random().toString(36).substr(2,9);
        let winHTML = `
            <div class="win" id="${wid}" style="top:${Math.random()*50+50}px; left:${Math.random()*50+100}px; width:${w}px; z-index:${++zIndexCount}; pointer-events:auto;" onmousedown="this.style.zIndex=++zIndexCount">
                <div class="title-bar" onmousedown="dragW(event, '${wid}')">${t} <button class="close-btn" onclick="document.getElementById('${wid}').remove()">X</button></div>
                <div class="content">${c}</div>
            </div>
        `;
        document.getElementById('window-layer').innerHTML += winHTML;
    };

    window.dragW = function(e, id) {
        let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
        w.style.zIndex = ++zIndexCount;
        document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
        document.onmouseup = () => document.onmousemove = null;
    };
}
