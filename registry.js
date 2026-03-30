/*=====================================================================
   GEMIOS REGISTRY - v53.3.0 (THE GEMISTORE UPDATE)
   Added GemiStore 3.0 with Aegis VFS Installation routing.
=====================================================================*/

// 🛠️ THE VFS INSTALLER PROTOCOL
window.GemiStoreAPI = {
    installToDesktop: (appId, appTitle) => {
        if(!window.Gemi_DB) {
            GemiOS.bus.emit('notify', {msg: 'VFS Offline. Cannot install.', err: true});
            return;
        }

        // Open a Read/Write transaction with Aegis VFS
        const tx = window.Gemi_DB.transaction('nodes', 'readwrite');
        const store = tx.objectStore('nodes');
        const req = store.get('root');
        
        req.onsuccess = () => {
            let root = req.result;
            
            // Safely navigate the TreeFS to the user's desktop
            try {
                let desktop = root.data['C:'].Users[GemiOS.user].Desktop;
                
                // Create the file! (e.g., "Calculator.app" = "app_calc")
                desktop[`${appTitle.replace(/\s+/g, '')}.app`] = appId;
                
                // Save the modified tree back to the hard drive
                store.put(root);
                
                GemiOS.bus.emit('notify', {msg: `📦 ${appTitle} installed to Desktop!`});
                GemiOS.refreshDesktop(); // Force the desktop to redraw instantly
                
            } catch (e) {
                GemiOS.bus.emit('notify', {msg: 'VFS Path Error. Is your user profile corrupted?', err: true});
            }
        };
    }
};

window.GemiRegistry = {
    
    // ==========================================
    // 🛒 GEMISTORE 3.0
    // ==========================================

    'sys_store': {
        id: 'sys_store', tag: 'sys', icon: '🛍️', title: 'GemiStore', width: 750,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; color:white;">
                
                <div style="background:linear-gradient(135deg, rgba(0,120,215,0.4), rgba(56,239,125,0.2)); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.15); margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 10px 20px rgba(0,0,0,0.3);">
                    <div>
                        <h2 style="margin:0; text-shadow:0 2px 5px rgba(0,0,0,0.5);">GemiStore 3.0</h2>
                        <div style="font-size:12px; color:#ddd; margin-top:5px;" id="store-status-${pid}">Scanning Cloud Manifest...</div>
                    </div>
                    <button onclick="GemiOS.pm.launch('sys_update')" style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); color:white; padding:8px 15px; border-radius:6px; cursor:pointer; font-weight:bold; backdrop-filter:blur(5px); transition:0.2s;" onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='rgba(0,0,0,0.5)'">🔄 Force Cloud Sync</button>
                </div>

                <div id="store-grid-${pid}" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; overflow-y:auto; flex-grow:1; padding-right:5px; padding-bottom:10px;">
                    <div style="text-align:center; padding:20px; color:#888; grid-column: 1 / -1;">Connecting to Aegis Network...</div>
                </div>
            </div>`,
        
        onLaunch: (pid) => {
            setTimeout(() => {
                const grid = document.getElementById(`store-grid-${pid}`);
                const status = document.getElementById(`store-status-${pid}`);
                const url = localStorage.getItem('GemiNet_Source') || "Default GemiOS Repository";
                
                status.innerText = `Connected to: ${url}`;
                let html = '';
                
                // Loop through the registry to find installable apps
                for(let id in window.GemiRegistry) {
                    const app = window.GemiRegistry[id];
                    
                    // We can skip system tools like the Updater or Explorer so they don't clutter the store
                    if(id === 'sys_store' || id === 'sys_update') continue; 
                    
                    const isSys = app.tag === 'sys' ? '<span style="color:#ffb400;">Core OS System</span>' : '<span style="color:#38ef7d;">Verified App</span>';

                    html += `
                    <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:15px; display:flex; gap:15px; transition:0.3s; box-shadow:0 5px 15px rgba(0,0,0,0.2);" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0,0,0,0.5)'; this.style.transform='translateY(0)';">
                        
                        <div style="font-size:45px; width:70px; height:70px; background:rgba(0,0,0,0.4); border-radius:14px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.05); filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5));">${app.icon}</div>
                        
                        <div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center;">
                            <div style="font-weight:bold; font-size:16px; text-shadow:0 1px 3px rgba(0,0,0,0.8);">${app.title}</div>
                            <div style="font-size:11px; color:#aaa; margin-bottom:10px;">ID: ${id} | ${isSys}</div>
                            
                            <div style="display:flex; gap:8px;">
                                <button onclick="GemiOS.pm.launch('${id}')" style="background:var(--accent, #0078d7); color:white; border:none; padding:6px 15px; border-radius:20px; font-size:11px; cursor:pointer; font-weight:bold; transition:0.2s; box-shadow:0 4px 10px rgba(0,120,215,0.4);" onmouseover="this.style.filter='brightness(1.2)'" onmouseout="this.style.filter='brightness(1)'">Launch</button>
                                
                                <button onclick="window.GemiStoreAPI.installToDesktop('${id}', '${app.title}')" style="background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.2); padding:6px 15px; border-radius:20px; font-size:11px; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">+ Add to Desktop</button>
                            </div>
                        </div>
                    </div>`;
                }
                
                grid.innerHTML = html;
            }, 400); // Slight delay for the "loading" aesthetic
        }
    },

    // ==========================================
    // ⚙️ SYSTEM CORE APPS (Explorer, Updater)
    // ==========================================
    'sys_drive': {
        id: 'sys_drive', tag: 'sys', icon: '📁', title: 'Explorer 3.0', width: 600,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; color:white;">
                <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); margin-bottom:10px; display:flex; align-items:center; gap:10px;">
                    <button onclick="GemiOS.pm.launch('sys_drive')" style="background:var(--accent, #0078d7); border:none; color:white; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:bold;">🏠 Home</button>
                    <div id="exp-path-${pid}" style="font-family:monospace; color:#38ef7d; flex-grow:1; padding:5px; background:#000; border-radius:4px; border:1px solid #333;">C:/Users/${GemiOS.user}/Desktop</div>
                </div>
                <div id="exp-grid-${pid}" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(85px, 1fr)); gap:15px; overflow-y:auto; flex-grow:1; align-content:start; padding:5px;"></div>
            </div>`,
        onLaunch: (pid) => {
            setTimeout(() => {
                const grid = document.getElementById(`exp-grid-${pid}`);
                if(!window.Gemi_DB) return grid.innerHTML = "VFS Offline.";
                const tx = window.Gemi_DB.transaction('nodes', 'readonly');
                const req = tx.objectStore('nodes').get('root');
                req.onsuccess = () => {
                    grid.innerHTML = '';
                    const data = req.result?.data?.['C:']?.Users?.[GemiOS.user]?.Desktop || {};
                    const entries = Object.keys(data);
                    if(entries.length === 0) return grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; color:#888; margin-top:20px;">Folder is empty. Open GemiStore to install apps!</div>`;
                    entries.forEach(name => {
                        const isApp = name.endsWith('.app');
                        const icon = isApp ? (window.GemiRegistry[data[name]]?.icon || '🚀') : '📄';
                        const realName = name.replace('.app','');
                        grid.innerHTML += `
                            <div style="text-align:center; cursor:pointer; padding:10px; border-radius:8px; transition:0.2s; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05);" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(0,0,0,0.3)'" ondblclick="${isApp ? `GemiOS.pm.launch('${data[name]}')` : ''}">
                                <div style="font-size:35px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.4));">${icon}</div>
                                <div style="font-size:11px; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${realName}</div>
                            </div>`;
                    });
                };
            }, 100);
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
                <button style="padding:12px 25px; background:var(--accent, #0078d7); color:white; border:none; border-radius:30px; cursor:pointer; font-weight:bold; font-size:14px; box-shadow:0 10px 20px rgba(0,120,215,0.4); transition:0.3s;" onclick="this.innerText='Purging Cache...'; this.style.background='#ffb400'; setTimeout(()=>{ localStorage.removeItem('GemiOS_Boot_Target'); location.reload(true); }, 1500);">SYNC NOW</button>
            </div>`
    },

    // ==========================================
    // 🧪 APPS (Physics, Browser, Settings, Calc, Term)
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
                cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight;
                const ctx = cvs.getContext('2d');
                let x = 50, y = 50, vx = 4, vy = 2;
                window.Aegis.Loop.subscribe((t) => {
                    if(!document.getElementById(`phys-cvs-${pid}`)) return;
                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                    vy = window.Aegis.Math.solve("y + 0.5", {y: vy}); 
                    x += vx; y += vy;
                    if(y + 15 > cvs.height) { y = cvs.height - 15; vy *= -0.8; }
                    if(x + 15 > cvs.width || x - 15 < 0) { vx *= -1; }
                    ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fillStyle = '#38ef7d'; ctx.fill(); ctx.shadowBlur = 15; ctx.shadowColor = '#38ef7d';
                });
            }, 300);
        }
    },
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
            </div>`
    },
    'app_calc': {
        id: 'app_calc', tag: 'pro', icon: '🧮', title: 'Calculator', width: 280,
        html: (pid) => `
            <div id="c-disp-${pid}" style="background:rgba(0,0,0,0.6); color:white; font-size:28px; text-align:right; padding:15px; border-radius:8px; margin-bottom:10px; font-family:monospace; border:1px solid rgba(255,255,255,0.1); box-shadow:inset 0 0 10px rgba(0,0,0,0.8);">0</div>
            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px;">
                ${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; padding:15px; font-size:18px; border-radius:8px; cursor:pointer; font-weight:bold;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'" onclick="let d=document.getElementById('c-disp-${pid}'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') try{d.innerText=eval(d.innerText)}catch(e){d.innerText='Err'} else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}
            </div>`
    },
    'sys_term': {
        id: 'sys_term', tag: 'sys', icon: '💻', title: 'Terminal', width: 550,
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; background:rgba(0,0,0,0.7); border-radius:8px; border:1px solid #333; overflow:hidden;">
                <div id="t-out-${pid}" style="flex-grow:1; color:#38ef7d; padding:15px; font-family:monospace; overflow-y:auto; font-size:13px;">
                    GemiOS [Aegis Kernel v53.3]<br>Type 'help' for commands.<br><br>
                </div>
                <div style="display:flex; background:#000; padding:10px; border-top:1px solid #222;">
                    <span style="color:#0078d7; font-family:monospace; margin-right:10px; font-weight:bold;">${GemiOS.user}@Aegis:~$</span>
                    <input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#fff; border:none; outline:none; font-family:monospace; font-size:13px;" onkeydown="if(event.key==='Enter') { const val=this.value; this.value=''; document.getElementById('t-out-${pid}').innerHTML += '<br><span style=\\'color:#fff\\'>'+val+'</span><br>Command executed via Aegis HAL.'; document.getElementById('t-out-${pid}').scrollTop = document.getElementById('t-out-${pid}').scrollHeight; }">
                </div>
            </div>`
    }
};

console.log("🛒 V53.3 GemiStore Integration Complete.");
