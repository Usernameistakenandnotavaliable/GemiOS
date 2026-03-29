/*=====================================================================
   GEMIOS CHAMELEON HYPERVISOR (legacy-BIOS.js)
   Fusing v49 Networking with modern v53 logic.
=====================================================================*/

window.Chameleon = {
    version: "v53-ALPHA-HYPERVISOR",
    
    // 🦎 THE ENGINE: Translates modern VFS calls for legacy compatibility
    initEngine: () => {
        console.log("🦎 Chameleon Engine: Shimming APIs...");
        window.VFS_LEGACY = GemiOS.vfs; // Map modern VFS to legacy name
        window.NET_STATUS = "FIRMWARE_LEVEL";
    },

    // 🖥️ THE INTERFACE: Recreating the v49 Blue BIOS for Networking
    renderBlueBIOS: () => {
        document.body.innerHTML = '';
        const style = document.createElement('style');
        style.textContent = `
            body { background:#0000aa !important; color:#aaaaaa !important; font-family:monospace !important; padding:40px !important; }
            .bios-header { background:#aaaaaa; color:#0000aa; padding:2px 10px; font-weight:bold; margin-bottom:20px; }
            .menu-item { margin-bottom:10px; cursor:pointer; }
            .menu-item:hover { color:#fff; }
            .input-box { background:transparent; border:1px solid #fff; color:#fff; font-family:monospace; padding:5px; width:300px; outline:none; }
            .status-bar { position:fixed; bottom:20px; left:40px; color:#fff; }
        `;
        document.head.appendChild(style);

        document.body.innerHTML = `
            <div class="bios-header">GEMIOS SETUP UTILITY - GemiNet Config (v53 Prototype)</div>
            <div style="margin-bottom:30px;">Main > Networking > Advanced</div>
            
            <div class="menu-item">Cloud Manifest URL:</div>
            <input type="text" id="net-url" class="input-box" value="${localStorage.getItem('GemiNet_Source') || 'https://raw.githubusercontent.com/...' }">
            
            <div class="menu-item" style="margin-top:20px;">Proxy Mode: [ DISABLED ]</div>
            <div class="menu-item">Handshake Protocol: [ LEGACY_v49 ]</div>
            <div class="menu-item">Force Encryption: [ ENABLED ]</div>
            
            <div style="margin-top:40px;">
                <button onclick="Chameleon.saveAndExit()" style="background:#aaaaaa; border:none; padding:5px 15px; cursor:pointer;">F10: Save and Exit</button>
                <button onclick="location.reload()" style="background:transparent; border:1px solid #aaa; color:#aaa; margin-left:10px; cursor:pointer;">ESC: Discard Changes</button>
            </div>

            <div class="status-bar">🦎 Chameleon Engine Active | Mode: v49 Emulation</div>
        `;
    },

    saveAndExit: () => {
        const url = document.getElementById('net-url').value;
        localStorage.setItem('GemiNet_Source', url);
        localStorage.setItem('GemiOS_Boot_Target', 'MODERN');
        alert("Configuration Saved to NVRAM. Rebooting to v53 Kernel...");
        location.reload();
    }
};

// Auto-start on load
Chameleon.initEngine();
Chameleon.renderBlueBIOS();
