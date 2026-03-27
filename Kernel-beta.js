/*=====================================================================
   GemiOS TIME MACHINE HYPERVISOR (v49.0 CLASSIC)
   Target Database: GemiOS_Legacy_Vault
   Features: Blue BIOS, Monolithic Architecture, Legacy UI.
=====================================================================*/

console.log("🕰️ WELCOME TO THE PAST. v49.0 Initializing...");

(() => {
    // 1. Wipe the modern DOM
    document.body.innerHTML = '';
    
    // 2. Inject Legacy Styles (Chunky, old-school web vibes)
    const s = document.createElement('style');
    s.textContent = `
        body { margin:0; overflow:hidden; font-family: 'Tahoma', sans-serif; background: #008080; color: black; user-select:none;}
        #legacy-bios { position:absolute; top:0; left:0; width:100vw; height:100vh; background:#0000aa; color:#aaaaaa; font-family:monospace; z-index:9999999; padding:20px; box-sizing:border-box; font-size:16px;}
        #taskbar { position:absolute; bottom:0; left:0; width:100%; height:40px; background:#c0c0c0; border-top:2px solid #fff; display:flex; align-items:center; padding:0 10px; box-sizing:border-box; z-index:99999;}
        .start-btn { background:#c0c0c0; border:2px solid; border-color:#fff #888 #888 #fff; padding:5px 15px; font-weight:bold; cursor:pointer;}
        .start-btn:active { border-color:#888 #fff #fff #888; }
        .desktop-icon { width:80px; height:80px; display:flex; flex-direction:column; align-items:center; color:white; font-size:12px; margin:10px; cursor:pointer; text-shadow: 1px 1px 0 #000; font-weight:bold;}
        .desktop-icon div { font-size: 32px; margin-bottom:5px; }
        .win-legacy { position:absolute; background:#c0c0c0; border:2px solid; border-color:#fff #000 #000 #fff; display:flex; flex-direction:column; box-shadow: 2px 2px 5px rgba(0,0,0,0.5);}
        .win-header { background:#000080; color:white; padding:5px; font-weight:bold; display:flex; justify-content:space-between; cursor:grab; font-size:12px;}
        .win-close { background:#c0c0c0; border:2px solid; border-color:#fff #888 #888 #fff; width:16px; height:16px; font-weight:bold; font-size:10px; line-height:12px; text-align:center; cursor:pointer; color:black;}
        .win-content { padding:10px; flex-grow:1; background:#fff; border:inset 2px #888; margin:5px;}
    `;
    document.head.appendChild(s);

    // 3. Build the Legacy UI
    document.body.innerHTML = `
        <div id="legacy-bios">
            <div style="font-size:24px; color:#fff; margin-bottom:20px;">GemiOS(TM) ROM BIOS Version 49.0</div>
            Copyright (C) 2023-2024 GemiOS Corp.<br><br>
            Main Processor : Generic Web Engine<br>
            Memory Testing : 10485760K OK<br><br>
            Detecting Primary Master ... GemiOS_Legacy_Vault [OK]<br>
            Mounting Virtual File System ...<br><br>
            <div id="bios-blinker" style="color:#fff;">_</div>
        </div>

        <div id="desktop-layer" style="position:absolute; top:0; left:0; width:100%; height:calc(100% - 40px); display:flex; flex-direction:column; flex-wrap:wrap; align-content:flex-start;">
            
            <div class="desktop-icon" ondblclick="alert('Explorer was broken in v49! Use the terminal.')">
                <div>📁</div> My Files
            </div>
            
            <div class="desktop-icon" ondblclick="LegacyOS.launchNote()">
                <div>📝</div> Notepad
            </div>

            <div class="desktop-icon" ondblclick="LegacyOS.returnToPresent()">
                <div>🚀</div> Return to Present
            </div>
        </div>

        <div id="window-layer"></div>

        <div id="taskbar">
            <div class="start-btn" onclick="alert('Start menu under construction. - Dev Team')">Start</div>
            <div style="flex-grow:1;"></div>
            <div style="border:inset 2px #888; padding:2px 10px; font-size:12px;">v49.0 Classic</div>
        </div>
    `;

    // 4. Legacy OS Logic
    window.LegacyOS = {
        zIndex: 100,
        pid: 0,
        
        // Legacy Isolated VFS
        initVFS: async function() {
            return new Promise((resolve) => {
                let req = indexedDB.open('GemiOS_Legacy_Vault', 1);
                req.onsuccess = (e) => {
                    console.log("Legacy NVRAM Mounted.");
                    resolve(e.target.result);
                };
            });
        },

        launchNote: function() {
            this.pid++;
            let wid = 'legacy-win-' + this.pid;
            let html = `
                <div class="win-legacy" id="${wid}" style="top:50px; left:50px; width:400px; height:300px; z-index:${++this.zIndex};" onmousedown="this.style.zIndex = ++LegacyOS.zIndex;">
                    <div class="win-header" onmousedown="LegacyOS.drag(event, '${wid}')">
                        <span>Notepad</span>
                        <div class="win-close" onclick="document.getElementById('${wid}').remove()">X</div>
                    </div>
                    <div class="win-content">
                        <textarea style="width:100%; height:100%; border:none; outline:none; resize:none; font-family:monospace;">Welcome to v49.0!\n\nThis is a fully isolated time machine. Anything you type here cannot affect your modern v51 OS.</textarea>
                    </div>
                </div>
            `;
            document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);
        },

        drag: function(e, wid) {
            let win = document.getElementById(wid);
            let offsetX = e.clientX - win.offsetLeft;
            let offsetY = e.clientY - win.offsetTop;
            win.style.zIndex = ++this.zIndex;
            
            const move = ev => {
                win.style.left = ev.clientX - offsetX + 'px';
                win.style.top = ev.clientY - offsetY + 'px';
            };
            const up = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        },

        returnToPresent: function() {
            if(confirm("Initiating Temporal Jump. Return to modern GemiOS?")) {
                localStorage.setItem('GemiOS_Boot_Target', 'MODERN');
                document.body.innerHTML = '<div style="background:black; color:white; height:100vh; display:flex; justify-content:center; align-items:center; font-family:monospace; font-size:24px;">Re-aligning timeline...</div>';
                setTimeout(() => location.reload(), 1500);
            }
        }
    };

    // 5. Boot Sequence
    LegacyOS.initVFS();
    
    // Animate BIOS
    let blink = true;
    let blinker = setInterval(() => {
        let el = document.getElementById('bios-blinker');
        if(el) { el.style.opacity = blink ? '1' : '0'; blink = !blink; }
    }, 500);

    setTimeout(() => {
        clearInterval(blinker);
        document.getElementById('legacy-bios').style.display = 'none';
    }, 3500);

})();
