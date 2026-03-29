/*=====================================================================
   GemiOS KERNEL - v53.0.4 (AEGIS-LINKED STABLE)
   Database calls removed. Relying strictly on Aegis Hypervisor.
=====================================================================*/

if (window.__GEMIOS_BOOTED__) {
    console.warn('GemiOS: Aegis handoff already complete.');
} else {
    window.__GEMIOS_BOOTED__ = true;

    class GemiOS_v53 {
        constructor() {
            this.version = "53.0.4-PROTOTYPE";
            this.user = localStorage.getItem('GemiOS_User') || 'Admin';
            this.manifestURL = localStorage.getItem('GemiNet_Source');
            
            // 🛡️ THE FIX: We no longer open IndexedDB here. We use the Aegis Hypervisor connection.
            window.GemiOS = this;
        }

        async init() {
            this.injectStyles();
            this.renderDesktop();
            await this.syncCloudRegistry();
            this.refreshDesktop();
            
            // Failsafe Notification
            const notif = document.createElement('div');
            notif.innerHTML = `✅ GemiOS v53 Online.<br>Aegis VFS Linked.`;
            notif.style.cssText = "position:fixed; top:20px; right:20px; background:#000; color:#38ef7d; padding:15px; border:1px solid #38ef7d; z-index:99999;";
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 4000);
        }

        async syncCloudRegistry() {
            window.GemiRegistry = { ...window.GemiCoreApps };
            if (!this.manifestURL) return;
            try {
                const res = await fetch(this.manifestURL + "?t=" + Date.now());
                if (res.ok) {
                    const cloudApps = await res.json();
                    window.GemiRegistry = { ...window.GemiRegistry, ...cloudApps };
                }
            } catch(e) { console.warn("Cloud Sync Failed. Offline mode active."); }
        }

        renderDesktop() {
            const desktop = document.createElement('div');
            desktop.id = "os-surface";
            desktop.style.cssText = "position:absolute; top:0; left:0; width:100vw; height:100vh; pointer-events:none;";
            desktop.innerHTML = `
                <div id="desktop-icons" style="display:grid; grid-template-columns:repeat(auto-fill, 100px); gap:20px; padding:30px; pointer-events:auto;"></div>
                <div id="window-layer" style="pointer-events:auto;"></div>
                <div id="taskbar" style="position:absolute; bottom:15px; left:50%; transform:translateX(-50%); height:60px; background:rgba(20,20,20,0.8); border-radius:30px; display:flex; align-items:center; padding:0 20px; border:1px solid #444; pointer-events:auto;">
                    <div style="width:40px; height:40px; background:#38ef7d; border-radius:50%; cursor:pointer;" onclick="alert('Start Menu Comming Soon')"></div>
                </div>
            `;
            document.body.appendChild(desktop);
        }

        async refreshDesktop() {
            const layer = document.getElementById('desktop-icons');
            if(!layer) return;
            layer.innerHTML = '';
            
            // 🛡️ Asking Aegis to read the database instead of doing it ourselves
            if(!window.Gemi_DB) return console.error("Aegis DB not found!");
            
            const tx = window.Gemi_DB.transaction('nodes', 'readonly');
            const req = tx.objectStore('nodes').get('root');
            
            req.onsuccess = () => {
                const data = req.result?.data?.['C:']?.Users?.[this.user]?.Desktop || {};
                for(let name in data) {
                    const icon = document.createElement('div');
                    icon.style.cssText = "color:white; text-align:center; font-family:sans-serif; font-size:12px; cursor:pointer;";
                    icon.innerHTML = `<div style="font-size:35px;">📄</div>${name.replace('.app','')}`;
                    layer.appendChild(icon);
                }
            };
        }

        injectStyles() {
            const s = document.createElement('style');
            s.textContent = `body { font-family: 'Inter', sans-serif; color: white; }`;
            document.head.appendChild(s);
        }
    }

    // Hardcoded failsafe apps
    window.GemiCoreApps = {};

    const OS = new GemiOS_v53();
    OS.init();
}
