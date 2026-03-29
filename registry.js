/*=====================================================================
   GEMIOS REGISTRY - v53.2.0 (AEGIS ENGINE INTEGRATION)
   Added Explorer 3.0, Updater 3.0, and Aegis Physics Sandbox.
=====================================================================*/

window.GemiRegistry = {
    
    // ==========================================
    // ⚙️ SYSTEM CORE APPS
    // ==========================================

    'sys_drive': {
        id: 'sys_drive', tag: 'sys', icon: '📁', title: 'Explorer 3.0', width: 600,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; color:white;">
                <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); margin-bottom:10px; display:flex; align-items:center; gap:10px;">
                    <button onclick="GemiOS.pm.launch('sys_drive')" style="background:var(--accent, #0078d7); border:none; color:white; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:bold;">🏠 Home</button>
                    <div id="exp-path-${pid}" style="font-family:monospace; color:#38ef7d; flex-grow:1; padding:5px; background:#000; border-radius:4px; border:1px solid #333;">C:/Users/${GemiOS.user}/Desktop</div>
                </div>
                <div id="exp-grid-${pid}" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(85px, 1fr)); gap:15px; overflow-y:auto; flex-grow:1; align-content:start; padding:5px;">
                    <div style="text-align:center; opacity:0.5; margin-top:20px; grid-column: 1 / -1;">Querying Aegis VFS...</div>
                </div>
            </div>`,
        onLaunch: (pid) => {
            // Explorer 3.0 reads directly from the Aegis Database
            setTimeout(() => {
                const grid = document.getElementById(`exp-grid-${pid}`);
                if(!window.Gemi_DB) { grid.innerHTML = "VFS Offline."; return; }
                
                const tx = window.Gemi_DB.transaction('nodes', 'readonly');
                const req = tx.objectStore('nodes').get('root');
                
                req.onsuccess = () => {
                    grid.innerHTML = '';
                    const data = req.result?.data?.['C:']?.Users?.[GemiOS.user]?.Desktop || {};
                    const entries = Object.keys(data);
                    
                    if(entries.length === 0) {
                        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; color:#888; margin-top:20px;">Folder is empty.</div>`;
                        return;
                    }
                    
                    entries.forEach(name => {
                        const icon = name.endsWith('.app') ? '🚀' : (name.endsWith('.png') ? '🖼️' : '📄');
                        grid.innerHTML += `
                            <div style="text-align:center; cursor:pointer; padding:10px; border-radius:8px; transition:0.2s; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05);" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(0,0,0,0.3)'">
                                <div style="font-size:35px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.4));">${icon}</div>
                                <div style="font-size:11px; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name.replace('.app','')}</div>
                            </div>`;
                    });
                };
            }, 300);
        }
    },

    'sys_update': {
        id: 'sys_update', tag: 'sys', icon: '🔄', title: 'Updater 3.0', width: 450,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:white; text-align:center; padding:20px; box-sizing:border-box;">
                <div style="font-size:50px; margin-bottom:15px; animation: spin 4s linear infinite;">⚙️</div>
                <style>@keyframes spin { 100% { transform:rotate(360deg); } }</style>
                <h3 style="margin:0 0 10px 0; color:#38ef7d;">GemiOS Cloud Sync</h3>
                <p style="font-size:12px; color:#aaa; margin-bottom:20px;">Force the system to clear local caches and fetch the latest Kernel and Registry from the GitHub Master Branch.</p>
                <button id="btn-upd-${pid}" style="padding:12px 25px; background:var(--accent, #0078d7); color:white; border:none; border-radius:30px; cursor:pointer; font-weight:bold; font-size:14px; box-shadow:0 10px 20px rgba(0,120,215,0.4); transition:0.3s;" onclick="this.innerText='Purging Cache...'; this.style.background='#ffb400'; setTimeout(()=>{ localStorage.removeItem('GemiOS_Boot_Target'); location.reload(true); }, 1500);">SYNC NOW</button>
            </div>`
    },

    // ==========================================
    // 🧪 AEGIS ENGINE DEMOS
    // ==========================================

    'app_phys': {
        id: 'app_phys', tag: 'dev', icon: '⚛️', title: 'Aegis Physics', width: 500,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; color:white;">
                <div style="background:rgba(0,0,0,0.6); padding:10px; border-radius:8px; font-size:12px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.1);">
                    <b style="color:#38ef7d;">Engine:</b> Aegis Master Loop (60FPS) <br>
                    <b style="color:#0078d7;">Math:</b> Aegis.Math.solve()
                </div>
                <canvas id="phys-cvs-${pid}" style="flex-grow:1; background:rgba(0,0,0,0.8); border-radius:8px; border:1px solid #333; min-height:250px;"></canvas>
            </div>`,
        onLaunch: (pid) => {
            setTimeout(() => {
                const cvs = document.getElementById(`phys-cvs-${pid}`);
                if(!cvs || !window.Aegis) return;
                
                cvs.width = cvs.offsetWidth; 
                cvs.height = cvs.offsetHeight;
                const ctx = cvs.getContext('2d');
                
                // Physics Variables
                let x = 50, y = 50;
                let vx = 4, vy = 2;
                const gravity = "y + 0.5"; // Raw equation for Aegis.Math

                // Subscribe to the Aegis Master Loop
                window.Aegis.Loop.subscribe((t) => {
                    // Only render if the window still exists
                    if(!document.getElementById(`phys-cvs-${pid}`)) return;
                    
                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                    
                    // Math Kernel Processing
                    vy = window.Aegis.Math.solve(gravity, {y: vy}); 
                    x += vx;
                    y += vy;
                    
                    // Bounce Logic
                    if(y + 15 > cvs.height) { y = cvs.height - 15; vy *= -0.8; }
                    if(x + 15 > cvs.width || x - 15 < 0) { vx *= -1; }
                    
                    // Render Particle
                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fillStyle = '#38ef7d';
                    ctx.fill();
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#38ef7d';
                });
            }, 300);
        }
    },

    // ... [Keep your sys_browser, app_calc, app_note, sys_term, etc. from the previous code here] ...
    
    'sys_browser': {
        id: 'sys_browser', icon: '🌐', title: 'GemiNet', width: 800,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%;">
                <div style="display:flex; gap:10px; margin-bottom:10px; background:rgba(0,0,0,0.4); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
                    <input type="text" id="url-${pid}" value="https://wikipedia.org" style="flex:1; padding:8px 15px; border-radius:20px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.5); color:white; outline:none; font-family:sans-serif;">
                    <button onclick="let u=document.getElementById('url-${pid}').value; if(!u.startsWith('http'))u='https://'+u; document.getElementById('ifr-${pid}').src=u;" style="padding:8px 25px; border-radius:20px; border:none; background:var(--accent, #0078d7); color:white; cursor:pointer; font-weight:bold;">Go</button>
                </div>
                <iframe id="ifr-${pid}" src="https://wikipedia.org" style="flex-grow:1; width:100%; border:none; border-radius:8px; background:white;"></iframe>
            </div>`
    }
};

console.log("🚀 V53.2 Engine-Integrated Registry Deployed.");
