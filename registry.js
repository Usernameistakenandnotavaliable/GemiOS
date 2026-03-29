/*=====================================================================
   GEMIOS REGISTRY - v53.1.5 (THE GRAND RESTORATION)
   All classic apps restored, optimized for Aegis & Glassmorphism.
=====================================================================*/

window.GemiRegistry = {
    
    // ==========================================
    // ⚙️ CORE SYSTEM APPS
    // ==========================================

    'sys_drive': {
        id: 'sys_drive', tag: 'sys', icon: '📁', title: 'Explorer', width: 550,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; color:white;">
                <div style="background:rgba(0,0,0,0.4); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); margin-bottom:10px; display:flex; align-items:center; gap:10px;">
                    <button onclick="GemiOS.pm.launch('sys_drive')" style="background:rgba(255,255,255,0.1); border:none; color:white; padding:5px 10px; border-radius:4px; cursor:pointer;">🏠 Home</button>
                    <div style="font-family:monospace; color:#38ef7d;">C:/Users/${GemiOS.user}/Desktop</div>
                </div>
                <div id="drive-grid-${pid}" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:15px; overflow-y:auto; flex-grow:1; align-content:start;">
                    <div style="text-align:center; cursor:pointer; padding:10px; border-radius:8px; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'"><div style="font-size:35px;">📄</div>readme.txt</div>
                    <div style="text-align:center; cursor:pointer; padding:10px; border-radius:8px; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'"><div style="font-size:35px;">🖼️</div>photo.png</div>
                </div>
            </div>`
    },

    'sys_browser': {
        id: 'sys_browser', tag: 'sys', icon: '🌐', title: 'GemiNet', width: 850,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%;">
                <div style="display:flex; gap:10px; margin-bottom:10px; background:rgba(0,0,0,0.4); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
                    <input type="text" id="url-${pid}" value="https://wikipedia.org" style="flex:1; padding:8px 15px; border-radius:20px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white; outline:none; font-family:sans-serif;">
                    <button onclick="let u=document.getElementById('url-${pid}').value; if(!u.startsWith('http'))u='https://'+u; document.getElementById('ifr-${pid}').src=u;" style="padding:8px 25px; border-radius:20px; border:none; background:var(--accent); color:white; cursor:pointer; font-weight:bold; box-shadow:0 0 10px rgba(0,120,215,0.5);">Go</button>
                </div>
                <iframe id="ifr-${pid}" src="https://wikipedia.org" style="flex-grow:1; width:100%; border:none; border-radius:8px; background:white;"></iframe>
            </div>`
    },

    'sys_set': { 
        id: 'sys_set', tag: 'sys', icon: '⚙️', title: 'Settings', width: 450, 
        html: (pid) => `
            <div style="display:flex; flex-direction:column; gap:15px; color:white;">
                <div style="background:rgba(0,0,0,0.4); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin:0 0 15px 0; color:var(--accent);">🎨 Personalization</h3>
                    <label style="font-size:12px; font-weight:bold;">Wallpaper URL</label>
                    <div style="display:flex; gap:10px; margin-top:5px;">
                        <input type="text" id="wp-in-${pid}" value="${localStorage.getItem('GemiOS_Wall') || ''}" style="flex:1; padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white; outline:none;" placeholder="https://...">
                        <button onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-in-${pid}').value); location.reload();" style="padding:8px 15px; background:var(--accent); color:white; border:none; border-radius:6px; cursor:pointer;">Apply</button>
                    </div>
                </div>
                <div style="background:rgba(0,0,0,0.4); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin:0 0 15px 0; color:var(--accent);">☁️ GemiNet Setup</h3>
                    <label style="font-size:12px; font-weight:bold;">Cloud Store Manifest</label>
                    <div style="display:flex; gap:10px; margin-top:5px;">
                        <input type="text" id="man-in-${pid}" value="${localStorage.getItem('GemiNet_Source') || ''}" style="flex:1; padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white; outline:none;">
                        <button onclick="localStorage.setItem('GemiNet_Source', document.getElementById('man-in-${pid}').value); GemiOS.bus.emit('notify', {msg:'Manifest Updated. Rebooting...'}); setTimeout(()=>location.reload(), 1500);" style="padding:8px 15px; background:var(--accent); color:white; border:none; border-radius:6px; cursor:pointer;">Sync</button>
                    </div>
                </div>
            </div>`
    },

    'sys_store': { 
        id: 'sys_store', tag: 'sys', icon: '🛒', title: 'GemiStore Hub', width: 650, 
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; color:white;">
                <div style="background:linear-gradient(135deg, rgba(0,120,215,0.5), rgba(0,0,0,0.8)); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                    <div><h2 style="margin:0; text-shadow:0 2px 4px rgba(0,0,0,0.5);">GemiStore Hub</h2><p style="margin:0; font-size:12px; opacity:0.8;">Decentralized App Marketplace</p></div>
                    <div style="font-size:40px; filter:drop-shadow(0 0 10px rgba(255,255,255,0.3));">🛒</div>
                </div>
                <div id="store-grid-${pid}" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; overflow-y:auto; flex-grow:1; padding-right:5px;">
                    <div style="background:rgba(0,0,0,0.4); padding:15px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); text-align:center;"><i>Fetching Manifest...</i></div>
                </div>
            </div>`,
        onLaunch: (pid) => {
            setTimeout(() => {
                const grid = document.getElementById(`store-grid-${pid}`);
                if(!grid) return;
                let html = '';
                for(let id in window.GemiRegistry) {
                    const app = window.GemiRegistry[id];
                    html += `<div style="background:rgba(0,0,0,0.4); padding:15px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); display:flex; gap:15px; align-items:center; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(0,0,0,0.4)'">
                        <div style="font-size:30px; background:rgba(0,0,0,0.5); width:50px; height:50px; border-radius:12px; display:flex; align-items:center; justify-content:center;">${app.icon}</div>
                        <div style="flex-grow:1;"><div style="font-weight:bold; font-size:14px;">${app.title}</div><div style="font-size:11px; color:#aaa; margin-bottom:5px;">ID: ${id}</div><button onclick="GemiOS.pm.launch('${id}')" style="background:var(--accent); color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; cursor:pointer; width:100%;">Open</button></div>
                    </div>`;
                }
                grid.innerHTML = html;
            }, 500);
        }
    },

    'sys_task': { 
        id: 'sys_task', tag: 'sys', icon: '📊', title: 'Task Manager', width: 450, 
        html: (pid) => `
            <div style="display:flex; flex-direction:column; gap:15px; height:100%; color:white;">
                <div style="background:rgba(0,0,0,0.4); padding:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
                    <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold; margin-bottom:5px;"><span>Aegis Heartbeat</span><span style="color:#38ef7d;">60 FPS</span></div>
                    <div style="width:100%; height:6px; background:#000; border-radius:3px; overflow:hidden;"><div style="width:100%; height:100%; background:#38ef7d;"></div></div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold; margin-top:10px; margin-bottom:5px;"><span>VFS Active Nodes</span><span style="color:#0078d7;" id="tm-ram-${pid}">Calculating...</span></div>
                    <div style="width:100%; height:6px; background:#000; border-radius:3px; overflow:hidden;"><div id="tm-rambar-${pid}" style="width:30%; height:100%; background:#0078d7; transition:width 0.5s;"></div></div>
                </div>
                <div id="tm-list-${pid}" style="background:rgba(0,0,0,0.4); border-radius:12px; border:1px solid rgba(255,255,255,0.1); padding:10px; flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; gap:5px;"></div>
            </div>`,
        onLaunch: (pid) => {
            window.GemiOS.tmInterval = setInterval(() => {
                const list = document.getElementById(`tm-list-${pid}`);
                if(!list) return clearInterval(window.GemiOS.tmInterval);
                const pids = Array.from(GemiOS.pm.procs.values());
                let h = '';
                pids.forEach((app, index) => {
                    const actualPid = Array.from(GemiOS.pm.procs.keys())[index];
                    h += `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:6px;">
                        <span style="font-size:13px;">${app.icon} ${app.title}</span>
                        <button onclick="GemiOS.pm.kill(${actualPid})" style="background:#ff4d4d; border:none; color:white; border-radius:4px; padding:4px 8px; font-size:10px; cursor:pointer;">End Task</button>
                    </div>`;
                });
                list.innerHTML = h;
                const fakeRam = Math.floor(150 + pids.length * 25 + Math.random() * 10);
                document.getElementById(`tm-ram-${pid}`).innerText = fakeRam + " MB";
                document.getElementById(`tm-rambar-${pid}`).style.width = Math.min((fakeRam/512)*100, 100) + "%";
            }, 1000);
        },
        onKill: () => clearInterval(window.GemiOS.tmInterval)
    },

    'sys_term': {
        id: 'sys_term', tag: 'sys', icon: '💻', title: 'Terminal', width: 550,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; background:rgba(0,0,0,0.7); border-radius:8px; border:1px solid #333; overflow:hidden;">
                <div id="t-out-${pid}" style="flex-grow:1; color:#38ef7d; padding:15px; font-family:monospace; overflow-y:auto; font-size:13px;">
                    GemiOS [Aegis Kernel v53.1]<br>
                    Connected to Remote Manifest.<br>Type 'help' for commands.<br><br>
                </div>
                <div style="display:flex; background:#000; padding:10px; border-top:1px solid #222;">
                    <span style="color:#0078d7; font-family:monospace; margin-right:10px; font-weight:bold;">${GemiOS.user}@Aegis:~$</span>
                    <input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#fff; border:none; outline:none; font-family:monospace; font-size:13px;" onkeydown="if(event.key==='Enter') { const val=this.value; this.value=''; document.getElementById('t-out-${pid}').innerHTML += '<br><span style=\\'color:#fff\\'>'+val+'</span><br>Command executed via Aegis HAL.'; document.getElementById('t-out-${pid}').scrollTop = document.getElementById('t-out-${pid}').scrollHeight; }">
                </div>
            </div>`
    },

    // ==========================================
    // 📝 PRODUCTIVITY & CREATOR APPS
    // ==========================================

    'app_calc': {
        id: 'app_calc', tag: 'pro', icon: '🧮', title: 'Calculator', width: 280,
        html: (pid) => `
            <div id="c-disp-${pid}" style="background:rgba(0,0,0,0.6); color:white; font-size:28px; text-align:right; padding:15px; border-radius:8px; margin-bottom:10px; font-family:monospace; border:1px solid rgba(255,255,255,0.1); box-shadow:inset 0 0 10px rgba(0,0,0,0.8);">0</div>
            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px;">
                ${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; padding:15px; font-size:18px; border-radius:8px; cursor:pointer; transition:0.2s; font-weight:bold;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'" onclick="let d=document.getElementById('c-disp-${pid}'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') try{d.innerText=eval(d.innerText)}catch(e){d.innerText='Err'} else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}
            </div>`
    },

    'app_note': {
        id: 'app_note', tag: 'pro', icon: '📝', title: 'Notepad', width: 450,
        html: (pid) => `
            <textarea style="width:100%; height:300px; background:rgba(0,0,0,0.5); color:#ddd; border:1px solid rgba(255,255,255,0.1); border-radius:8px; outline:none; resize:none; font-family:monospace; font-size:14px; padding:15px; box-sizing:border-box;" placeholder="Start typing..."></textarea>`
    },

    'app_draw': { 
        id: 'app_draw', tag: 'art', icon: '🎨', title: 'GemiDraw Studio', width: 600, 
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; gap:10px;">
                <div style="display:flex; gap:10px; padding:10px; background:rgba(0,0,0,0.4); border-radius:8px; border:1px solid rgba(255,255,255,0.1); align-items:center;">
                    <input type="color" id="draw-clr-${pid}" value="#38ef7d" style="width:40px; height:30px; border:none; background:transparent; cursor:pointer;">
                    <input type="range" id="draw-sz-${pid}" min="1" max="50" value="5" style="flex:1;">
                    <button style="padding:5px 15px; background:rgba(255,255,255,0.1); color:white; border:none; border-radius:4px; cursor:pointer;" onclick="let cvs=document.getElementById('draw-cvs-${pid}'); let ctx=cvs.getContext('2d'); ctx.clearRect(0,0,cvs.width,cvs.height);">Clear</button>
                </div>
                <canvas id="draw-cvs-${pid}" style="flex-grow:1; background:rgba(255,255,255,0.9); border-radius:8px; cursor:crosshair; min-height:300px;"></canvas>
            </div>`, 
        onLaunch: (pid) => { 
            setTimeout(() => { 
                let cvs = document.getElementById(`draw-cvs-${pid}`); if(!cvs) return; 
                cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; 
                let ctx = cvs.getContext('2d'); 
                let isDrawing = false; let lastX=0; let lastY=0; 
                cvs.onmousedown = (e) => { isDrawing = true; lastX = e.offsetX; lastY = e.offsetY; }; 
                cvs.onmouseup = () => isDrawing = false; 
                cvs.onmouseout = () => isDrawing = false; 
                cvs.onmousemove = (e) => { 
                    if(!isDrawing) return; 
                    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(e.offsetX, e.offsetY); 
                    ctx.strokeStyle = document.getElementById(`draw-clr-${pid}`).value; 
                    ctx.lineWidth = document.getElementById(`draw-sz-${pid}`).value; 
                    ctx.lineCap = 'round'; ctx.stroke(); 
                    lastX = e.offsetX; lastY = e.offsetY; 
                }; 
            }, 100); 
        } 
    },

    'app_crypt': { 
        id: 'app_crypt', tag: 'fin', icon: '📈', title: 'GemiCrypt', width: 600, 
        html: (pid) => `
            <div style="background:rgba(0,0,0,0.6); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); display:flex; flex-direction:column; height:100%;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <div style="font-family:monospace; font-size:28px; color:#38ef7d; font-weight:bold;">GEMI: $<span id="cr-prc-${pid}">100.00</span></div>
                    <div style="text-align:right; font-size:12px; color:#aaa;">Shares: <b id="cr-sh-${pid}" style="color:white;">0</b><br>Net Value: <b id="cr-tot-${pid}" style="color:#ffb400;">$0.00</b></div>
                </div>
                <div id="cr-graph-${pid}" style="flex-grow:1; border:1px solid #333; border-radius:8px; background:#000; position:relative; overflow:hidden; margin-bottom:15px; min-height:150px;"></div>
                <div style="display:flex; gap:10px;">
                    <button style="flex:1; padding:12px; background:#38ef7d; color:black; font-weight:bold; border:none; border-radius:6px; cursor:pointer;" onclick="let prc=parseFloat(document.getElementById('cr-prc-${pid}').innerText); let shEl=document.getElementById('cr-sh-${pid}'); let sh=parseInt(shEl.innerText)+1; shEl.innerText=sh; document.getElementById('cr-tot-${pid}').innerText='$'+(sh*prc).toFixed(2);">BUY</button>
                    <button style="flex:1; padding:12px; background:#ff4d4d; color:white; font-weight:bold; border:none; border-radius:6px; cursor:pointer;" onclick="let prc=parseFloat(document.getElementById('cr-prc-${pid}').innerText); let shEl=document.getElementById('cr-sh-${pid}'); let sh=Math.max(0, parseInt(shEl.innerText)-1); shEl.innerText=sh; document.getElementById('cr-tot-${pid}').innerText='$'+(sh*prc).toFixed(2);">SELL</button>
                </div>
            </div>`,
        onLaunch: (pid) => {
            let price = 100.00;
            window.GemiOS.cryptInterval = setInterval(() => {
                const el = document.getElementById(`cr-prc-${pid}`);
                const graph = document.getElementById(`cr-graph-${pid}`);
                if(!el || !graph) return clearInterval(window.GemiOS.cryptInterval);
                
                let change = (Math.random() - 0.48) * 5;
                price = Math.max(10, price + change);
                let isUp = change >= 0;
                
                el.innerText = price.toFixed(2);
                el.style.color = isUp ? "#38ef7d" : "#ff4d4d";
                
                // Simple DOM graph
                const bar = document.createElement('div');
                bar.style.cssText = `position:absolute; bottom:0; right:0; width:5px; height:${Math.min(100, (price/200)*100)}%; background:${isUp?'#38ef7d':'#ff4d4d'};`;
                graph.appendChild(bar);
                
                // Move older bars left
                Array.from(graph.children).forEach(c => {
                    let r = parseInt(c.style.right || 0);
                    c.style.right = (r + 6) + 'px';
                    if(r > graph.offsetWidth) c.remove();
                });
                
                let sh = parseInt(document.getElementById(`cr-sh-${pid}`).innerText);
                document.getElementById(`cr-tot-${pid}`).innerText = '$'+(sh*price).toFixed(2);
            }, 1000);
        },
        onKill: () => clearInterval(window.GemiOS.cryptInterval)
    },

    'app_beat': { 
        id: 'app_beat', tag: 'art', icon: '🥁', title: 'GemiBeat MPC', width: 450, 
        html: (pid) => `
            <div style="background:linear-gradient(135deg, rgba(60,60,60,0.8), rgba(20,20,20,0.9)); padding:20px; border-radius:12px; border:2px solid #222; display:flex; flex-direction:column; height:100%; box-shadow:inset 0 0 20px rgba(0,0,0,0.8);">
                <div style="display:flex; justify-content:space-between; align-items:center; background:#000; padding:10px 20px; border-radius:8px; margin-bottom:20px; border:1px solid #333;">
                    <div style="color:#ff4d4d; font-size:24px; font-weight:900; font-style:italic;">AKAI</div>
                    <div style="color:#38ef7d; font-family:monospace;">MPC-Aegis Edition</div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:15px; flex-grow:1;">
                    ${['KICK', 'SNARE', 'HAT', 'CLAP', 'TOM 1', 'TOM 2', 'BASS', 'CRASH'].map((p, i) => `
                        <div style="background:linear-gradient(to bottom, #555, #333); border:2px solid #111; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#aaa; font-family:monospace; font-weight:bold; cursor:pointer; font-size:14px; box-shadow:0 5px 15px rgba(0,0,0,0.5);" onmousedown="this.style.transform='scale(0.95)'; this.style.background='linear-gradient(to bottom, #666, #444)'; this.style.color='white'; this.style.borderColor='var(--accent)';" onmouseup="this.style.transform='scale(1)'; this.style.background='linear-gradient(to bottom, #555, #333)'; this.style.color='#aaa'; this.style.borderColor='#111';" onmouseout="this.style.transform='scale(1)'; this.style.background='linear-gradient(to bottom, #555, #333)'; this.style.color='#aaa'; this.style.borderColor='#111';">
                            ${p}
                        </div>
                    `).join('')}
                </div>
            </div>`
    },

    'app_maker': {
        id: 'app_maker', tag: 'pro', icon: '🎮', title: 'GemiMaker Engine', width: 600,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; background:rgba(0,0,0,0.5); border-radius:12px; border:1px solid rgba(255,255,255,0.1); color:white; text-align:center;">
                <div style="font-size:60px; margin-bottom:20px;">🎮</div>
                <h2 style="margin:0 0 10px 0; color:#ffb400;">GemiMaker Pro (v6.0)</h2>
                <p style="font-size:13px; color:#aaa; max-width:80%;">The physics engine is currently being re-written to utilize the <b>Aegis Math Kernel</b>. Please check back after the Engine.js update.</p>
                <div style="margin-top:20px; padding:10px 20px; background:rgba(255,255,255,0.1); border-radius:30px; font-size:12px; border:1px solid rgba(255,255,255,0.2);">Status: Awaiting engine.js payload</div>
            </div>`
    }
};

console.log("💎 V53 Glass Registry Deployed Successfully.");
