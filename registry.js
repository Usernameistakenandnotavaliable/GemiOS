window.GemiRegistry = {
    // V49 GEMIMAKER STUDIO (Hooks into the new external engine.js!)
    'app_maker': { 
        price: 0, tag: 'pro', id: 'app_maker', icon: '🧩', desc: 'Visual Block Game Engine.', title: 'GemiMaker Studio', width: 850, 
        // The HTML structure is now generated dynamically by the external engine!
        html: (pid) => `<div style="padding:20px; text-align:center;">Loading Engine...</div>`,
        onLaunch: (pid) => {
            // Check if the Kernel successfully fetched engine.js
            setTimeout(() => {
                if(window.GemiEngine) {
                    window.GemiEngine.init(pid);
                } else {
                    document.getElementById(`content_${pid}`).innerHTML = `<div style="color:red; padding:20px;">FATAL ERROR: engine.js failed to load from GitHub. Check your repository.</div>`;
                }
            }, 500);
        },
        onKill: (pid) => {
            if(window.GemiEngine) GemiEngine.stopGame(pid);
        }
    },
    'sys_store': { 
        tag: 'sys', icon: '🛍️', title: 'GemiStore Market', width: 700, 
        html: (pid) => `
            <div class="sys-card" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg, var(--accent), #000); border:none; margin-bottom:10px;">
                <div style="font-size:24px; font-weight:bold;">GemiStore</div><div style="font-size:40px;">🛍️</div>
            </div>
            <div id="store-list-${pid}" style="flex-grow:1; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:5px;">
                <div style="padding:20px; text-align:center; opacity:0.5;">Store undergoing V49 Maintenance...</div>
            </div>`
    }
};
