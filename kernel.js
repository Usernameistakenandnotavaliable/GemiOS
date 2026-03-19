// =========================================================================
// GemiOS v21.3 - THE COMPLETE CLOUD ECOSYSTEM
// =========================================================================

// 1. INJECT SYSTEM STYLES & CHAMELEON ENGINE
const style = document.createElement('style');
style.textContent = `
    body { margin:0; overflow:hidden; background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); font-family:'Segoe UI', sans-serif; color:white; user-select:none; transition: background 0.5s, color 0.5s;}
    
    /* Light Mode */
    body.light-mode { background: linear-gradient(135deg, #e0eafc, #cfdef3); color: #333; }
    
    /* Legacy v1.0 Mode Overrides */
    body.theme-v1 #desktop-bg { background: #008080 !important; }
    body.theme-v1 .win { background: #c0c0c0 !important; border: 2px outset #fff !important; border-radius: 0 !important; box-shadow: none !important; font-family: 'Courier New', monospace !important; color: black !important;}
    body.theme-v1 .title-bar { background: #000080 !important; color: white !important; font-family: 'Courier New', monospace !important; border-radius: 0 !important; }
    body.theme-v1 #taskbar { background: #c0c0c0 !important; border-top: 2px solid #fff !important; color: black !important; }
    body.theme-v1 .start { background: #c0c0c0 !important; border: 2px outset #fff !important; color: black !important; border-radius: 0 !important; font-family: 'Courier New', monospace !important; }

    /* Modern UI */
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
    .start-item { padding:8px 15px; cursor:pointer; display:flex; align-items:center; gap:10px; font-size:14px; border-bottom:1px solid #eee;}
    .start-item:hover { background:#d9ebf9; }
    
    /* App Specific Styles */
    .terminal-area { background: #000; color: #0f0; padding: 10px; font-family: monospace; height: 200px; overflow-y: auto; }
    .calc-display { background: #eee; padding: 10px; font-size: 24px; text-align: right; margin-bottom: 10px; border-radius: 4px; font-family: monospace; border:1px solid #ccc;}
    .calc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
    .calc-btn { padding: 15px; background: #ddd; border: none; cursor: pointer; font-weight: bold; border-radius: 4px; }
    .ms-board { display: grid; grid-template-columns: repeat(9, 25px); gap: 2px; margin: 0 auto; background: #bbb; padding: 5px; border: 2px solid #999;}
    .ms-cell { width: 25px; height: 25px; background: #e0e0e0; border: 2px outset #fff; text-align: center; font-weight: bold; cursor: pointer; line-height: 25px; }
    .ms-cell.revealed { border: 1px solid #aaa; background: #ddd; cursor: default;}
`;
document.head.appendChild(style);

// 2. INJECT HTML UI
const desktopHTML = `
    <div id="desktop-bg"></div>
    <div id="desktop-icons">
        <div class="icon app-sys" style="top:20px; left:20px;" onclick="openApp('sys_time')"><div style="font-size:35px;">⏳</div>TimeMach</div>
        <div class="icon app-sys" style="top:120px; left:20px;" onclick="openApp('sys_set')"><div style="font-size:35px;">⚙️</div>Settings</div>
        <div class="icon app-sys" style="top:220px; left:20px;" onclick="openApp('sys_info')"><div style="font-size:35px;">🖥️</div>SysInfo</div>
        <div class="icon app-sys" style="top:320px; left:20px;" onclick="openApp('sys_av')"><div style="font-size:35px;">🛡️</div>GemiGuard</div>
        
        <div class="icon app-util" style="top:20px; left:120px;" onclick="openApp('sys_browser')"><div style="font-size:35px;">🌐</div>Browser</div>
        <div class="icon app-util" style="top:120px; left:120px;" onclick="openApp('sys_term')"><div style="font-size:35px;">⌨️</div>Terminal</div>
        <div class="icon app-util" style="top:220px; left:120px;" onclick="openApp('app_note')"><div style="font-size:35px;">📝</div>Notepad</div>
        <div class="icon app-util" style="top:320px; left:120px;" onclick="openApp('app_calc')"><div style="font-size:35px;">🧮</div>Calc</div>
        
        <div class="icon app-game" style="top:20px; left:220px;" onclick="openApp('app_pong')"><div style="font-size:35px;">🏓</div>Pong</div>
        <div class="icon app-game" style="top:120px; left:220px;" onclick="openApp('app_paint')"><div style="font-size:35px;">🎨</div>Paint</div>
        <div class="icon app-game" style="top:220px; left:220px;" onclick="openApp('app_sweeper')"><div style="font-size:35px;">💣</div>Sweeper</div>
        <div class="icon app-game" style="top:320px; left:220px;" onclick="openApp('app_snake')"><div style="font-size:35px;">🐍</div>Snake</div>
        <div class="icon app-game" style="top:420px; left:220px;" onclick="openApp('app_ttt')"><div style="font-size:35px;">❌</div>TicTac</div>
    </div>
    
    <div id="window-layer" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:50; pointer-events:none;"></div>

    <div id="start-menu">
        <div style="background:#005a9e; color:white; padding:15px; font-weight:bold;">👤 Cloud Admin</div>
        <div style="overflow-y:auto; max-height:350px;">
            <div class="start-item app-sys" onclick="openApp('sys_time')">⏳ Time Machine</div>
            <div class="start-item app-sys" onclick="openApp('sys_set')">⚙️ Settings</div>
            <div class="start-item app-sys" onclick="openApp('sys_av')">🛡️ GemiGuard</div>
            <div class="start-item app-util" onclick="openApp('sys_browser')">🌐 Browser</div>
            <div class="start-item app-util" onclick="openApp('sys_term')">⌨️ Terminal</div>
            <div class="start-item app-util" onclick="openApp('app_note')">📝 Notepad</div>
            <div class="start-item app-util" onclick="openApp('app_calc')">🧮 Calculator</div>
            <div class="start-item app-game" onclick="openApp('app_pong')">🏓 Pong</div>
            <div class="start-item app-game" onclick="openApp('app_paint')">🎨 Paint</div>
            <div class="start-item app-game" onclick="openApp('app_sweeper')">💣 Sweeper</div>
            <div class="start-item app-game" onclick="openApp('app_snake')">🐍 Snake</div>
        </div>
    </div>

    <div id="taskbar">
        <div class="start" id="sb-btn" onclick="toggleStart()">G</div>
        <div style="margin-left:auto; display:flex; align-items:center; gap:15px; margin-right:20px;">
            <div onclick="toggleTheme()" style="cursor:pointer; font-size:18px;" title="Toggle Light/Dark Mode">🌓</div>
            <div style="font-weight:bold; color:#38ef7d;" id="cloud-status">v21.3 CLOUD</div>
            <div id="clock" style="font-weight:bold;">12:00</div>
        </div>
    </div>
`;
document.body.innerHTML += desktopHTML;

// 3. CORE LOGIC & CHAMELEON ENGINE
let zIndexCount = 100;

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);

window.toggleStart = function() {
    let sm = document.getElementById('start-menu');
    sm.style.display = sm.style.display === 'flex' ? 'none' : 'flex';
};

// Theme Logic
let isLightMode = localStorage.getItem('GemiOS_Theme') === 'light';
window.applyTheme = function() {
    if(isLightMode) document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
};
window.toggleTheme = function() {
    isLightMode = !isLightMode;
    localStorage.setItem('GemiOS_Theme', isLightMode ? 'light' : 'dark');
    applyTheme();
};
applyTheme();

let savedWP = localStorage.getItem('GemiOS_Wallpaper');
if(savedWP) document.getElementById('desktop-bg').style.background = `url(${savedWP}) center/cover`;

// Time Machine (Chameleon Engine)
let activeVer = localStorage.getItem('GemiOS_TargetVersion') || 'v21';
window.applyChameleon = function() {
    document.body.className = ''; // Reset
    if(isLightMode) document.body.classList.add('light-mode');
    
    const games = document.querySelectorAll('.app-game');
    const utils = document.querySelectorAll('.app-util');
    
    if(activeVer === 'v1') {
        document.body.classList.add('theme-v1');
        document.getElementById('sb-btn').innerText = 'Start';
        document.getElementById('cloud-status').innerText = 'v1.0 LEGACY';
        games.forEach(el => el.style.display = 'none');
    } else if (activeVer === 'v20') {
        document.getElementById('cloud-status').innerText = 'v20.0 PURE';
        games.forEach(el => el.style.display = 'none');
        utils.forEach(el => el.style.display = 'none');
    }
};
applyChameleon();

window.jumpVer = function(v) {
    localStorage.setItem('GemiOS_TargetVersion', v);
    location.reload();
};

// 4. WINDOW MANAGER & APPS
window.openApp = function(id) {
    document.getElementById('start-menu').style.display = 'none';
    let t = "", c = "", w = 400;

    switch(id) {
        case 'sys_time':
            t = "Time Machine"; w = 350;
            c = `
                <div style="text-align:center; font-size:40px; margin-bottom:10px;">⏳</div>
                <p style="text-align:center; font-size:12px; margin-top:0;">Select an era to emulate.</p>
                <button onclick="jumpVer('v1')" style="width:100%; padding:8px; margin-bottom:5px; background:#008080; color:white; border:2px outset #fff; cursor:pointer;">v1.0 (Retro Windows)</button>
                <button onclick="jumpVer('v20')" style="width:100%; padding:8px; margin-bottom:5px; background:#333; color:white; border:none; border-radius:4px; cursor:pointer;">v20.0 (Pure Kernel - No Apps)</button>
                <button onclick="jumpVer('v21')" style="width:100%; padding:8px; background:linear-gradient(45deg, #ff00cc, #333399); color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">v21.3 (Omniverse)</button>
            `;
            break;
        case 'sys_set':
            t = "System Settings"; w = 420;
            c = `
                <div class="sys-card">
                    <b>NVRAM Custom Wallpaper</b><br>
                    <input type="text" id="wp-in" style="width:100%; margin:5px 0; padding:5px; box-sizing:border-box;" placeholder="Paste Image URL...">
                    <button onclick="let u=document.getElementById('wp-in').value; localStorage.setItem('GemiOS_Wallpaper', u); location.reload();" style="width:100%; background:#0078d7; color:white; padding:8px; border:none; border-radius:4px; cursor:pointer;">Set & Save Image</button>
                </div>
                <button onclick="localStorage.removeItem('GemiOS_Wallpaper'); location.reload();" style="width:100%; background:#444; color:white; padding:8px; border:none; border-radius:4px; margin-bottom:10px; cursor:pointer;">Reset Wallpaper</button>
                <button onclick="localStorage.clear(); location.reload();" style="width:100%; background:red; color:white; padding:8px; border:none; border-radius:4px; cursor:pointer;">Factory Reset NVRAM</button>
            `;
            break;
        case 'sys_info':
            t = "System Info"; w = 300;
            c = `<div class="sys-card"><b>Kernel:</b> v21.3 Cloud<br><b>Engine:</b> Network Boot<br><b>Storage:</b> NVRAM Connected</div>`;
            break;
        case 'sys_av':
            t = "GemiGuard AV"; w = 350;
            c = `<b>Status: <span style="color:green">Protected</span></b><br><button onclick="document.getElementById('avlog').innerHTML+='> Scanned 0 threats.<br>'" style="padding:5px; margin:10px 0;">Quick Scan</button><div class="sys-card" style="font-family:monospace; height:100px; overflow-y:auto;" id="avlog">> Shield Active.<br></div>`;
            break;
        case 'sys_term':
            t = "Terminal"; w = 450;
            c = `<div class="terminal-area" id="t-out">GemiTerm Cloud Edition<br>Type 'help'<br></div><div style="display:flex; background:#000; padding:5px;"><span style="color:#0f0; margin-right:5px;">></span><input type="text" style="flex-grow:1; background:#000; color:#0f0; border:none; outline:none; font-family:monospace;" onkeydown="if(event.key==='Enter'){ let o=document.getElementById('t-out'); o.innerHTML+='<br>> '+this.value; if(this.value==='help') o.innerHTML+='<br>cmds: clear, reboot, nuke'; if(this.value==='clear') o.innerHTML=''; if(this.value==='reboot') location.reload(); if(this.value==='nuke'){ localStorage.clear(); location.reload(); } this.value=''; o.scrollTop=o.scrollHeight; }"></div>`;
            break;
        case 'sys_browser':
            t = "Web Browser"; w = 700;
            c = `<div style="display:flex; gap:5px; margin-bottom:5px;"><input type="text" id="b-url" value="https://wikipedia.org" style="flex-grow:1; padding:5px;"><button onclick="document.getElementById('b-frame').src=document.getElementById('b-url').value">Go</button></div><iframe id="b-frame" src="https://wikipedia.org" style="width:100%; height:400px; border:1px solid #ccc; background:white;"></iframe>`;
            break;
        case 'app_note':
            t = "Notepad (NVRAM)"; w = 350;
            let st = localStorage.getItem('GemiOS_Notepad') || '';
            c = `<textarea oninput="localStorage.setItem('GemiOS_Notepad', this.value)" style="width:100%; height:250px; box-sizing:border-box; resize:none; border:1px solid #ccc; padding:10px; font-family:monospace; outline:none;" placeholder="Auto-saves to NVRAM...">${st}</textarea>`;
            break;
        case 'app_calc':
            t = "Calculator"; w = 250;
            c = `<div class="calc-display" id="cd">0</div><div class="calc-grid">${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button class="calc-btn" onclick="let d=document.getElementById('cd'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') { try { d.innerText=eval(d.innerText); } catch(e){ d.innerText='Err'; } } else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}</div>`;
            break;
        case 'app_paint':
            t = "Paint"; w = 550;
            c = `<div style="margin-bottom:5px;"><button onclick="const c=document.getElementById('cvs'); c.getContext('2d').clearRect(0,0,c.width,c.height);">Clear</button> <input type="color" id="p-col" value="#000000"></div><canvas id="cvs" style="background:white; border:1px solid #ccc; width:100%; height:350px; cursor:crosshair;"></canvas>`;
            break;
        case 'app_sweeper':
            t = "Sweeper"; w = 260;
            c = `<div style="text-align:center; margin-bottom:5px;"><button onclick="initSweeper()">Reset</button></div><div class="ms-board" id="ms-grid"></div>`;
            break;
        case 'app_snake':
            t = "Snake"; w = 320;
            let hs = localStorage.getItem('GemiOS_SnakeHS') || 0;
            c = `<div style="text-align:center; margin-bottom:5px;">Score: <b id="sn-score">0</b> | High: <b id="sn-hs">${hs}</b></div><canvas id="sn-cvs" width="300" height="300" style="background:#000; display:block; margin:0 auto; border:2px solid #555;"></canvas>`;
            break;
        case 'app_ttt':
            t = "Tic-Tac-Toe"; w = 250;
            c = `<div id="ttt-stat" style="text-align:center; font-weight:bold; margin-bottom:10px;">Player X</div><div style="display:grid; grid-template-columns:repeat(3,1fr); gap:5px; background:#aaa; padding:5px;" id="ttt-b"></div>`;
            break;
        case 'app_pong':
            t = "GemiPong"; w = 420;
            c = `<canvas id="pong-cvs" width="380" height="240" style="background:#000; border:2px solid #555; display:block; margin:0 auto; cursor:none;"></canvas>`;
            break;
    }

    let wid = 'w_' + Math.random().toString(36).substr(2,9);
    let winHTML = `
        <div class="win" id="${wid}" style="top:${Math.random()*50+50}px; left:${Math.random()*50+100}px; width:${w}px; z-index:${++zIndexCount}; pointer-events:auto;" onmousedown="this.style.zIndex=++zIndexCount">
            <div class="title-bar" onmousedown="dragW(event, '${wid}')">${t} <button class="close-btn" onclick="closeApp('${wid}', '${id}')">X</button></div>
            <div class="content">${c}</div>
        </div>
    `;
    document.getElementById('window-layer').innerHTML += winHTML;
    
    // Init Apps
    if(id === 'app_pong') setTimeout(initPong, 100);
    if(id === 'app_sweeper') initSweeper();
    if(id === 'app_snake') initSnake();
    if(id === 'app_ttt') initTTT();
    if(id === 'app_paint') setTimeout(() => {
        const can = document.getElementById('cvs'); if(!can) return;
        can.width = can.offsetWidth; can.height = can.offsetHeight;
        const ctx = can.getContext('2d'); let drawing = false;
        can.onmousedown = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
        can.onmouseup = () => drawing = false; can.onmouseout = () => drawing = false;
        can.onmousemove = (e) => { if(drawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle = document.getElementById('p-col').value; ctx.lineWidth = 3; ctx.stroke(); } };
    }, 100);
};

window.dragW = function(e, id) {
    let w = document.getElementById(id); let ox = e.clientX - w.offsetLeft; let oy = e.clientY - w.offsetTop;
    w.style.zIndex = ++zIndexCount;
    document.onmousemove = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
    document.onmouseup = () => document.onmousemove = null;
};

window.closeApp = function(wid, app) {
    document.getElementById(wid).remove();
    if(app === 'app_pong') clearInterval(pongItv);
    if(app === 'app_snake') clearInterval(snakeItv);
};

// =========================================================================
// GAME LOGIC ENGINES
// =========================================================================

// PONG
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
        ctx.fillStyle = '#111'; ctx.fillRect(0,0,380,240);
        ctx.fillStyle = '#38ef7d'; 
        ctx.fillRect(5, pY, 5, 40); ctx.fillRect(370, cY, 5, 40); ctx.fillRect(bX, bY, 6, 6);
    }, 30);
};

// SWEEPER
window.initSweeper = function() {
    let grid = document.getElementById('ms-grid'); if(!grid) return;
    grid.innerHTML = '';
    for(let i=0; i<81; i++) {
        let cell = document.createElement('div'); cell.className = 'ms-cell';
        cell.onclick = function() { 
            this.classList.add('revealed'); 
            if(Math.random() < 0.15) { this.innerText='💣'; this.style.background='#ff4d4d'; alert('Boom!'); initSweeper(); } 
            else { this.innerText = Math.floor(Math.random()*3)||''; } 
        };
        grid.appendChild(cell);
    }
};

// TIC-TAC-TOE
let tttBoard = [], tttPlayer = 'X', tttActive = true;
window.initTTT = function() {
    tttBoard = ['', '', '', '', '', '', '', '', '']; tttPlayer = 'X'; tttActive = true;
    document.getElementById('ttt-stat').innerText = "Player X Turn";
    let b = document.getElementById('ttt-b'); if(!b) return; b.innerHTML = '';
    for(let i=0; i<9; i++) b.innerHTML += `<button style="height:60px; font-size:24px; font-weight:bold; border:none; background:white; cursor:pointer;" onclick="playTTT(${i}, this)"></button>`;
};
window.playTTT = function(i, btn) {
    if(!tttActive || tttBoard[i] !== '') return;
    tttBoard[i] = tttPlayer; btn.innerText = tttPlayer; btn.style.color = tttPlayer==='X'?'red':'blue';
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let won = lines.some(l => tttBoard[l[0]] && tttBoard[l[0]]===tttBoard[l[1]] && tttBoard[l[0]]===tttBoard[l[2]]);
    if(won) { document.getElementById('ttt-stat').innerText = `${tttPlayer} Wins!`; tttActive = false; }
    else if(!tttBoard.includes('')) { document.getElementById('ttt-stat').innerText = "Draw!"; tttActive = false; }
    else { tttPlayer = tttPlayer === 'X' ? 'O' : 'X'; document.getElementById('ttt-stat').innerText = `Player ${tttPlayer} Turn`; }
};

// SNAKE
let snakeItv;
window.initSnake = function() {
    let can = document.getElementById('sn-cvs'); if(!can) return;
    let ctx = can.getContext('2d');
    let snake = [{x: 150, y: 150}], dx = 10, dy = 0, score = 0, food = {x: 50, y: 50};
    clearInterval(snakeItv); document.getElementById('sn-score').innerText = '0';
    let highScore = parseInt(localStorage.getItem('GemiOS_SnakeHS')) || 0;
    
    document.onkeydown = (e) => {
        if(e.key==='ArrowUp' && dy===0) { dx=0; dy=-10; } else if(e.key==='ArrowDown' && dy===0) { dx=0; dy=10; }
        else if(e.key==='ArrowLeft' && dx===0) { dx=-10; dy=0; } else if(e.key==='ArrowRight' && dx===0) { dx=10; dy=0; }
    };

    snakeItv = setInterval(() => {
        if(!document.getElementById('sn-cvs')) { clearInterval(snakeItv); return; }
        let head = {x: snake[0].x + dx, y: snake[0].y + dy};
        if(head.x<0 || head.x>=300 || head.y<0 || head.y>=300 || snake.some(s=>s.x===head.x && s.y===head.y)) {
            clearInterval(snakeItv); 
            if(score > highScore) { localStorage.setItem('GemiOS_SnakeHS', score); alert('New High Score! ' + score); } 
            else { alert('Game Over! Score: ' + score); }
            initSnake(); return;
        }
        snake.unshift(head);
        if(head.x===food.x && head.y===food.y) { score+=10; document.getElementById('sn-score').innerText=score; food={x:Math.floor(Math.random()*30)*10, y:Math.floor(Math.random()*30)*10}; } 
        else snake.pop();
        
        ctx.fillStyle = 'black'; ctx.fillRect(0,0,300,300);
        ctx.fillStyle = 'lime'; snake.forEach(s => ctx.fillRect(s.x, s.y, 9, 9));
        ctx.fillStyle = 'red'; ctx.fillRect(food.x, food.y, 9, 9);
    }, 100);
};

console.log("GemiOS v21.3 Cloud Engine Successfully Booted.");
