/*=====================================================================
   GEMIOS APP REGISTRY - v52.0.0 (OFFICIAL STABLE)
   Refactored for Recursive VFS, Folder Navigation, and GemiLock.
=====================================================================*/

window.GemiCoreApps = {
    
    // ==========================================
    // ⚙️ CORE SYSTEM SUITE
    // ==========================================

    'sys_drive': { 
        id: 'sys_drive', tag: 'sys', icon: '📁', title: 'GemiExplorer', width: 650, 
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; background:#1a1a1a; color:white; font-family:sans-serif;">
                <div style="padding:10px; background:#252525; border-bottom:1px solid #333; display:flex; gap:10px; align-items:center;">
                    <button class="btn-sec" style="width:auto; margin:0; padding:5px 12px;" onclick="GemiOS.navBack(${pid})">⬅</button>
                    <div id="path-display-${pid}" style="flex-grow:1; background:#000; padding:6px 12px; border-radius:4px; font-family:monospace; font-size:12px; color:#38ef7d; border:1px solid #444;">C:/Users/${GemiOS.user}/Desktop</div>
                </div>
                <div id="file-grid-${pid}" style="flex-grow:1; padding:20px; display:grid; grid-template-columns:repeat(auto-fill, minmax(85px, 1fr)); gap:20px; overflow-y:auto; align-content:start;">
                    </div>
            </div>`, 
        onLaunch: async (pid, targetPath) => {
            const defaultPath = `C:/Users/${GemiOS.user}/Desktop`;
            let currentPath = targetPath || defaultPath;
            
            window.GemiOS.renderDir = async (p) => {
                const grid = document.getElementById(`file-grid-${pid}`);
                const pathEl = document.getElementById(`path-display-${pid}`);
                if(!grid) return;
                
                grid.innerHTML = '';
                pathEl.innerText = p;
                const dirData = await GemiOS.vfs.getDir(p) || {};
                
                for(let name in dirData) {
                    const item = dirData[name];
                    const isFolder = (typeof item === 'object' && !name.endsWith('.app') && !name.endsWith('.txt') && !name.endsWith('.png'));
                    const icon = isFolder ? '📁' : (window.GemiRegistry[item]?.icon || '📄');
                    
                    const el = document.createElement('div');
                    el.className = 'icon-block'; // Reusing kernel icon styles
                    el.style.cssText = "display:flex; flex-direction:column; align-items:center; cursor:pointer; width:80px; text-align:center;";
                    el.innerHTML = `<div style="font-size:35px;">${icon}</div><div style="font-size:11px; margin-top:5px; word-break:break-all;">${name.replace('.app','')}</div>`;
                    
                    el.ondblclick = () => {
                        if(isFolder) GemiOS.renderDir(`${p}/${name}`);
                        else if(name.endsWith('.app')) GemiOS.pm.launch(item);
                        else if(name.endsWith('.txt')) GemiOS.vfs.read(p, name).then(d => GemiOS.pm.launch('app_note', d));
                        else if(name.endsWith('.png')) GemiOS.vfs.read(p, name).then(d => GemiOS.pm.launch('sys_view', d));
                    };
                    grid.appendChild(el);
                }
            };
            
            window.GemiOS.navBack = (p) => {
                let parts = currentPath.split('/');
                if(parts.length > 1) {
                    parts.pop();
                    currentPath = parts.join('/');
                    GemiOS.renderDir(currentPath);
                }
            };

            GemiOS.renderDir(currentPath);
        } 
    },

    'sys_browser': { 
        id: 'sys_browser', tag: 'sys', icon: '🌐', title: 'GemiNet Browser', width: 850, 
        html: (pid) => `
            <div style="display:flex; flex-direction:column; height:100%; background:#fff; border-radius:0 0 8px 8px; overflow:hidden;">
                <div style="display:flex; gap:10px; padding:10px; background:#f1f1f1; border-bottom:1px solid #ccc; align-items:center;">
                    <div style="display:flex; gap:5px;">
                        <div style="width:10px; height:10px; border-radius:50%; background:#ff5f56;"></div>
                        <div style="width:10px; height:10px; border-radius:50%; background:#ffbd2e;"></div>
                        <div style="width:10px; height:10px; border-radius:50%; background:#27c93f;"></div>
                    </div>
                    <input type="text" id="url-${pid}" value="https://www.wikipedia.org" style="flex-grow:1; padding:6px 12px; border:1px solid #ccc; border-radius:20px; font-size:12px; outline:none;" onkeydown="if(event.key==='Enter') GemiOS.goWeb(${pid})">
                    <button onclick="GemiOS.goWeb(${pid})" style="padding:6px 15px; background:var(--accent); color:white; border:none; border-radius:20px; font-size:12px; cursor:pointer;">Go</button>
                </div>
                <iframe id="frame-${pid}" src="https://www.wikipedia.org" style="flex-grow:1; border:none; background:white;" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
            </div>`,
        onLaunch: (pid) => {
            window.GemiOS.goWeb = (p) => {
                let input = document.getElementById(`url-${p}`);
                let frame = document.getElementById(`frame-${p}`);
                let url = input.value.trim();
                if (!url.startsWith('http')) url = 'https://' + url;
                frame.src = url;
            };
        }
    },

    'sys_term': { 
        id: 'sys_term', tag: 'sys', icon: '💻', title: 'Terminal', width: 550, 
        html: (pid) => `
            <div id="t-out-${pid}" style="flex-grow:1; background:#000; color:#38ef7d; padding:15px; font-family:monospace; overflow-y:auto; font-size:13px;">GemiOS [Version ${GemiOS.version}]<br>Ready for instructions...<br></div>
            <div style="display:flex; background:#000; padding:10px; border-top:1px solid #222;">
                <span style="color:#0078d7; font-family:monospace; margin-right:10px;">${GemiOS.user}@GemiOS:~$</span>
                <input type="text" id="t-in-${pid}" style="flex-grow:1; background:transparent; color:#fff; border:none; outline:none; font-family:monospace;" onkeydown="if(event.key==='Enter') { GemiOS.bus.emit('notify', {title:'Terminal', msg:'Command: ' + this.value, success:true}); this.value=''; }">
            </div>`
    },

    'sys_set': { 
        id: 'sys_set', tag: 'sys', icon: '⚙️', title: 'Settings', width: 400, 
        html: (pid) => `
            <div class="sys-card" style="margin:0; border-radius:0; height:100%;">
                <h3 style="margin-top:0; color:var(--accent);">Settings</h3>
                <p style="font-size:12px; opacity:0.7;">Personalize your environment.</p>
                <hr style="border:0; border-top:1px solid #333; margin:15px 0;">
                <label style="font-size:13px; font-weight:bold;">Wallpaper URL</label>
                <input type="text" id="wp-val" placeholder="https://..." style="width:100%; padding:10px; margin:10px 0; background:#111; border:1px solid #444; color:white; border-radius:4px;">
                <button class="btn-primary" onclick="localStorage.setItem('GemiOS_Wall', document.getElementById('wp-val').value); location.reload();">Save & Reboot</button>
                <div style="margin-top:20px;">
                    <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                        <input type="checkbox" checked onchange="GemiOS.drivers.update('audio', this.checked)"> Enable Sound FX
                    </label>
                </div>
            </div>`
    },

    // ==========================================
    // 📝 PRODUCTIVITY & APPS
    // ==========================================

    'app_calc': { 
        id: 'app_calc', tag: 'pro', icon: '🧮', title: 'Calculator', width: 280, 
        html: (pid) => `
            <div style="background:#eee; color:#222; padding:15px; font-size:24px; text-align:right; border-radius:4px; margin-bottom:10px; font-family:monospace;" id="calc-val-${pid}">0</div>
            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:5px;">
                ${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="padding:15px; cursor:pointer;" onclick="let v=document.getElementById('calc-val-${pid}'); if('${b}'==='C') v.innerText='0'; else if('${b}'==='=') try { v.innerText=eval(v.innerText); } catch(e) { v.innerText='Err'; } else { if(v.innerText==='0') v.innerText='${b}'; else v.innerText+='${b}'; }">${b}</button>`).join('')}
            </div>`
    },

    'app_note': { 
        id: 'app_note', tag: 'pro', icon: '📝', title: 'GemiNote', width: 450, 
        html: (pid, content) => `
            <textarea id="note-txt-${pid}" style="width:100%; height:100%; background:transparent; color:white; border:none; resize:none; outline:none; font-family:monospace; padding:10px;">${content || 'Untitled Note...'}</textarea>`,
        onKill: async (pid) => {
            const val = document.getElementById(`note-txt-${pid}`).value;
            // Future: Auto-save logic
        }
    }
};

console.log("📦 GemiRegistry v52.0.0 Stable Loaded.");
