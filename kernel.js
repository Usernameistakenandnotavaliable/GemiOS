/*=====================================================================
   GemiOS KERNEL - v53.0.0 (PROJECT AEGIS / CONNECTIVITY)
   Infrastructure: Cloud Store Manifests & Aegis Math Interfacing.
=====================================================================*/

if (window.__GEMIOS_BOOTED__) {
    console.warn('GemiOS: Aegis handoff already complete.');
} else {
    window.__GEMIOS_BOOTED__ = true;

    class GemiOS_v53 {
        constructor() {
            this.version = "53.0.0-RELEASE";
            this.user = localStorage.getItem('GemiOS_User') || 'Admin';
            this.manifestURL = localStorage.getItem('GemiNet_Source');
            
            // Link to Aegis Hardware Layer
            this.vfs = window.Aegis.VFS; 
            this.math = window.Aegis.Math;
            
            this.pm = new Gemi_PM();
            this.wm = new Gemi_WM();
            
            window.GemiOS = this;
        }

        async init() {
            console.log("Kernel: Connecting to Aegis Pipeline...");
            this.renderDesktop();
            await this.syncCloudRegistry();
            this.refreshDesktop();
            GemiOS.bus.emit('notify', {title: "GemiNet Online", msg: "Cloud Manifest Linked.", success: true});
        }

        // v53 NEW FEATURE: Remote Manifest Sync
        async syncCloudRegistry() {
            window.GemiRegistry = { ...window.GemiCoreApps };
            if (!this.manifestURL) return;

            try {
                const res = await fetch(this.manifestURL + "?t=" + Date.now());
                if (res.ok) {
                    const cloudApps = await res.json();
                    window.GemiRegistry = { ...window.GemiRegistry, ...cloudApps };
                    console.log("Kernel: Decentralized Apps Injected.");
                }
            } catch(e) { console.warn("Kernel: Cloud Sync Failed. Offline mode active."); }
        }

        renderDesktop() {
            // We use the 'window-layer' so we don't destroy the Aegis Background Canvas
            const desktop = document.createElement('div');
            desktop.id = "os-surface";
            desktop.innerHTML = `
                <div id="desktop-icons" style="display:grid; grid-template-columns:repeat(auto-fill, 100px); gap:20px; padding:30px;"></div>
                <div id="window-layer"></div>
                <div id="taskbar-container">
                    <div id="taskbar">
                        <div class="start-btn" onclick="GemiOS.pm.launch('sys_store')">G</div>
                        <div id="dock-icons" style="display:flex; gap:10px;"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(desktop);
        }
        
        // v53 NEW FEATURE: Remote Execution
        launchURLApp(url) {
            this.pm.launchRemote(url);
        }
    }

    // Support logic for v53
    // ... [Process Manager and Window Manager logic optimized for Aegis] ...

    const OS = new GemiOS_v53();
    OS.init();
}
