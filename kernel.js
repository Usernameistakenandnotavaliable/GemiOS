// GemiOS v21.2 Kernel

// 1. Inject CSS
const style = document.createElement('style');
style.textContent = `
    #desktop { width: 100vw; height: 100vh; background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); position: absolute; top: 0; left: 0; overflow: hidden; font-family: 'Segoe UI', sans-serif; color: white; user-select: none; }
    #taskbar { position: absolute; bottom: 0; width: 100%; height: 45px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; padding: 0 10px; border-top: 1px solid rgba(255,255,255,0.2); z-index: 10000; }
    .start-btn { width: 35px; height: 35px; background: radial-gradient(circle, #4db8ff, #005a9e); border-radius: 50%; border: 2px solid white; display: flex; justify-content: center; align-items: center; font-weight: bold; cursor: pointer; }
    .icon { position: absolute; width: 80px; text-align: center; cursor: pointer; border-radius: 8px; padding: 10px; transition: 0.2s; }
    .icon:hover { background: rgba(255,255,255,0.1); }
    .icon div { font-size: 35px; margin-bottom: 5px; }
    .window { position: absolute; background: rgba(255,255,255,0.9); color: black; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); min-width: 300px; overflow: hidden; border: 1px solid #ccc; }
    .title-bar { background: #eee; padding: 8px; font-weight: bold; display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; cursor: grab; }
    .close-btn { background: #ff4d4d; color: white; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-weight: bold; }
    .content { padding: 15px; }
`;
document.head.appendChild(style);

// 2. Inject HTML
const desktopHTML = `
    <div id="desktop">
        <div class="icon" style="top: 20px; left: 20px;" onclick="openApp('SysInfo')"><div>🖥️</div>System</div>
        <div class="icon" style="top: 120px; left: 20px;" onclick="alert('Checking GitHub for Updates...')"><div>🔄</div>Update</div>
        <div class="icon" style="top: 220px; left: 20px;" onclick="openApp('Terminal')"><div>⌨️</div>Terminal</div>

        <div id="window-layer"></div>

        <div id="taskbar">
            <div class="start-btn" onclick="alert('Start Menu coming soon!')">G</div>
            <div style="margin-left: auto; margin-right: 20px; font-weight: bold; display:flex; gap:15px; align-items:center;">
                <span style="color:#38ef7d;">Network Connected</span>
                <span id="clock">12:00</span>
            </div>
        </div>
    </div>
`;
document.body.innerHTML += desktopHTML;

// 3. OS Logic
let zIndexCount = 100;

setInterval(() => {
    let now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);

window.openApp = function(app) {
    let t = app, c = "";
    if(app === 'SysInfo') c = "<b>GemiOS v21.2</b><br>Network Boot Architecture Active.<br>Running directly from GitHub Repository.";
    if(app === 'Terminal') c = "<div style='background:black; color:lime; padding:10px; font-family:monospace; height:100px;'>> GemiTerm Ready.<br>>_</div>";

    let w = document.createElement('div');
    w.className = 'window'; 
    w.style.top = (Math.random() * 50 + 50) + 'px'; 
    w.style.left = (Math.random() * 50 + 100) + 'px';
    w.style.zIndex = ++zIndexCount;
    w.onmousedown = () => w.style.zIndex = ++zIndexCount;
    
    w.innerHTML = `
        <div class="title-bar" onmousedown="dragW(event, this.parentElement)">
            ${t} <button class="close-btn" onclick="this.parentElement.parentElement.remove()">X</button>
        </div>
        <div class="content">${c}</div>
    `;
    document.getElementById('window-layer').appendChild(w);
};

window.dragW = function(e, win) {
    let ox = e.clientX - win.offsetLeft; let oy = e.clientY - win.offsetTop;
    document.onmousemove = (ev) => { win.style.left = (ev.clientX - ox) + 'px'; win.style.top = Math.max(0, ev.clientY - oy) + 'px'; };
    document.onmouseup = () => document.onmousemove = null;
};

console.log("GemiOS Network Kernel Loaded Successfully!");
