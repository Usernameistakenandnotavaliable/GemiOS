/*=====================================================================
   GEMIOS CHAMELEON CONFIGURATOR (legacy-BIOS.js)
   Fusing v49 Aesthetics with Aegis Hardware Logic.
=====================================================================*/

(() => {
    log("🦎 Chameleon Engine: Virtualizing v49 Environment...");

    const style = document.createElement('style');
    style.textContent = `
        #bios-container { position:fixed; top:0; left:0; width:100vw; height:100vh; background:#0000aa; color:#fff; font-family:monospace; padding:50px; box-sizing:border-box; z-index:100000; }
        .bios-title { background:#fff; color:#0000aa; padding:5px 20px; font-weight:bold; display:inline-block; margin-bottom:20px; }
        .bios-item { margin-bottom:15px; color:#aaa; cursor:pointer; }
        .bios-item.active { color:#fff; text-decoration:underline; }
        .bios-input { background:transparent; border:1px solid #fff; color:#fff; padding:5px; width:400px; outline:none; font-family:monospace; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = "bios-container";
    container.innerHTML = `
        <div class="bios-title">GEMIOS SETUP UTILITY - NETWORKING v53</div>
        <p>Aegis Interface: Virtual v49 Protocol</p>
        <hr>
        <div class="bios-item">GemiNet Manifest URL:</div>
        <input type="text" id="manifest-url" class="bios-input" value="${localStorage.getItem('GemiNet_Source') || 'https://raw.githubusercontent.com/...'}">
        <br><br>
        <div class="bios-item">Security Level: [ MAX_ENCRYPT ]</div>
        <div class="bios-item">Math Kernel: [ ENABLED ]</div>
        <div class="bios-item">VFS Bridge: [ ACTIVE ]</div>
        <hr>
        <p>F10: Save and Handoff | ESC: Reboot Present</p>
    `;
    document.body.appendChild(container);

    // Save Logic
    window.addEventListener('keydown', (e) => {
        if(e.key === 'F10') {
            const url = document.getElementById('manifest-url').value;
            localStorage.setItem('GemiNet_Source', url);
            localStorage.setItem('GemiOS_Boot_Target', 'MODERN');
            log("Config Saved to Aegis NVRAM. Resetting...");
            location.reload();
        }
    });

    // Subscribing to Aegis Loop for a retro "flicker"
    Aegis.Loop.subscribe((t) => {
        container.style.opacity = 0.98 + Math.sin(t/50) * 0.02;
    });

})();
