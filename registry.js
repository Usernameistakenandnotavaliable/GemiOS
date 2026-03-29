/*=====================================================================
   GEMIOS REGISTRY - v53.0.0
   Added: sys_math (Aegis Equation Tester), sys_cloud (Store Manifest)
=====================================================================*/

window.GemiCoreApps = {
    // 🧮 THE EQUATION TERMINAL (New for v53)
    'sys_math': {
        id: 'sys_math', tag: 'sys', icon: '🧮', title: 'Aegis Math Terminal', width: 500,
        html: (pid) => `
            <div style="padding:20px; background:#111; color:#38ef7d; font-family:monospace; height:100%;">
                <div style="margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:10px;">AEGIS MATH KERNEL v1.0</div>
                <div style="font-size:12px; color:#888; margin-bottom:20px;">Enter raw equations to solve via Aegis.</div>
                <input type="text" id="math-in-${pid}" placeholder="Math.sin(x) * 100" style="width:100%; background:#000; border:1px solid #38ef7d; color:#fff; padding:10px; outline:none;">
                <button onclick="GemiOS.solve(${pid})" style="width:100%; margin-top:10px; padding:10px; background:#38ef7d; color:#000; border:none; font-weight:bold; cursor:pointer;">EXECUTE ON AEGIS</button>
                <div id="math-res-${pid}" style="margin-top:20px; font-size:24px; text-align:center; color:#fff;">---</div>
            </div>`,
        onLaunch: (pid) => {
            window.GemiOS.solve = (p) => {
                const eq = document.getElementById(`math-in-${p}`).value;
                // Calling the Aegis Math Kernel directly
                const result = window.Aegis.Math.eval(eq, { x: 45, y: 90, time: Date.now() });
                document.getElementById(`math-res-${p}`).innerText = result;
            };
        }
    },

    // ☁️ THE DECENTRALIZED STORE
    'sys_store': {
        id: 'sys_store', tag: 'sys', icon: '🛒', title: 'GemiNet Cloud Store', width: 600,
        html: (pid) => `
            <div style="padding:20px; background:#f5f5f5; color:#222; height:100%;">
                <h3>Cloud Manifest Manager</h3>
                <div style="display:flex; gap:10px;">
                    <input type="text" id="manifest-in" value="${localStorage.getItem('GemiNet_Source') || ''}" style="flex:1; padding:10px;">
                    <button onclick="localStorage.setItem('GemiNet_Source', document.getElementById('manifest-in').value); location.reload();" class="btn-primary">Link Store</button>
                </div>
                <div id="cloud-status" style="margin-top:20px; font-size:12px; color:#666;">Ready to fetch remote apps...</div>
            </div>`
    }
};
