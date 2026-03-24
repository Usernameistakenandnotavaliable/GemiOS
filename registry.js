// =========================================================================
// GEMIOS APP REGISTRY & STORE CATALOG - v48.0 (THE QUALITY UPDATE)
// =========================================================================

window.GemiRegistry = {
    // === V46: THE BOUNTY BOARD ===
    'BountyBoard.app': { 
        price: 0, tag: 'pro', id: 'app_bounty', icon: '🎯', desc: 'Earn GemiCoins by securing the OS.', title: 'Bounty Board', width: 600, 
        html: (pid) => `
            <div style="display:flex; flex-direction:column; flex-grow:1; gap:10px; background:#111; padding:20px; border-radius:8px; color:white; font-family:sans-serif;">
                <h2 style="margin:0; color:#ffb400; text-align:center;">🏆 White Hat Bug Bounty Program</h2>
                <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
                <p>Welcome to the <b>GemiOS Security Initiative</b>. As an open-source platform, we rely on developers to build tools that keep our NVRAM safe.</p>
                <div style="background:rgba(255,77,77,0.1); border-left:4px solid #ff4d4d; padding:15px; border-radius:4px; margin-bottom:15px;">
                    <h3 style="margin-top:0; color:#ff4d4d;">Current Active Threat: CoinDrainer</h3>
                    <p style="font-size:13px; margin-bottom:0;">A malicious payload known as <b>Free GemiCoins</b> is circulating the Global Network. It actively drains user wallets and formats drives.</p>
                </div>
                <h3 style="color:#38ef7d; margin-bottom:5px;">How to Claim the 500 🪙 Reward:</h3>
                <ol style="font-size:14px; line-height:1.6; color:#ddd;">
                    <li>Open <b>GemiDev Studio</b>.</li>
                    <li>Write an HTML/JS application that utilizes the <code>GemiOS.PM.kill()</code> or <code>GemiOS.VFS.delete()</code> commands.</li>
                    <li>Click <b>Publish App</b>.</li>
                </ol>
                <p style="font-size:12px; color:#aaa; font-style:italic;">* The GemiOS Kernel will automatically read your source code upon publishing. If it detects valid Antivirus methodology, you will instantly be credited 500 GemiCoins.</p>
            </div>` 
    },

    // === V45.0 THE DEFENEDER & THE VIRUS ===
    'GemiDefender.app': { price: 300, tag: 'pro', id: 'app_defend', icon: '🛡️', desc: 'Active Memory Scanner & AV.', title: 'GemiDefender Ultimate', width: 650, html: (pid) => `<div style="background:#111; color:white; padding:15px; border-radius:6px; flex-grow:1; display:flex; flex-direction:column;"><div style="display:flex; align-items:center; gap:15px; margin-bottom:20px; border-bottom:1px solid #333; padding-bottom:15px;"><div style="font-size:40px; color:#38ef7d;" id="av-icon-${pid}">🛡️</div><div><h2 style="margin:0; color:#38ef7d;" id="av-status-${pid}">Zero-Trust Active</h2><p style="margin:0; font-size:12px; color:#aaa;">GemiOS Security Operations</p></div></div><div style="display:flex; gap:10px; margin-bottom:15px;"><button onclick="GemiOS.Registry['app_defend'].scanMem(${pid})" class="btn-primary" id="av-btn-mem-${pid}" style="flex:1;">🧠 Scan Active Memory</button><button onclick="GemiOS.Registry['app_defend'].scanNVRAM(${pid})" class="btn-sec" id="av-btn-nvram-${pid}" style="flex:1; margin:0;">💽 Deep Scan NVRAM</button></div><div id="av-log-${pid}" style="flex-grow:1; background:#000; border:1px solid #333; border-radius:4px; padding:10px; font-family:monospace; font-size:12px; overflow-y:auto; max-height:200px;">GemiDefender Engine Ready...<br>Awaiting manual sweep command.</div></div>`, scanMem: (pid) => { let btn = document.getElementById(`av-btn-mem-${pid}`); let log = document.getElementById(`av-log-${pid}`); let icon = document.getElementById(`av-icon-${pid}`); let status = document.getElementById(`av-status-${pid}`); btn.disabled = true; log.innerHTML += "<br>> Initializing RAM Sweep...<br>"; icon.innerText = "🧠"; status.innerText = "Analyzing PIDs..."; status.style.color = "#ffb400"; let threats = []; let procs = GemiOS.PM.processes; setTimeout(() => { for(let procId in procs) { let proc = procs[procId]; log.innerHTML += `Scanning PID [${procId}] : ${proc.title}...<br>`; let htmlCode = proc.raw && proc.raw.htmlString ? proc.raw.htmlString : (proc.raw && proc.raw.html ? proc.raw.html(procId) : ""); if(htmlCode.includes("GemiOS.wallet -=") || htmlCode.includes("GemiOS.wallet = 0") || proc.id === 'app_virus') { threats.push(procId); log.innerHTML += `<span style="color:#ff4d4d;">[!] ROGUE PROCESS DETECTED: ${proc.title} [PID: ${procId}]</span><br>`; } } if(threats.length > 0) { icon.innerText = "⚠️"; status.innerText = "Memory Compromised!"; status.style.color = "#ff4d4d"; log.innerHTML += `<span style="color:#ff4d4d; font-weight:bold;">Found ${threats.length} malicious process(es).</span><br>`; btn.innerText = "KILL ROGUE PROCESSES"; btn.style.background = "#ff4d4d"; btn.disabled = false; GemiOS.playSysSound('error'); btn.onclick = () => { threats.forEach(tPid => { GemiOS.PM.kill(tPid); log.innerHTML += `<span style="color:#38ef7d;">Assassinated PID: ${tPid}</span><br>`; }); GemiOS.playSysSound('success'); icon.innerText = "🛡️"; status.innerText = "Zero-Trust Active"; status.style.color = "#38ef7d"; btn.innerText = "🧠 Scan Active Memory"; btn.style.background = "var(--accent)"; btn.onclick = () => GemiOS.Registry['app_defend'].scanMem(pid); GemiOS.notify("GemiDefender", "Rogue processes terminated.", true); }; } else { icon.innerText = "🛡️"; status.innerText = "Zero-Trust Active"; status.style.color = "#38ef7d"; log.innerHTML += `<span style="color:#38ef7d; font-weight:bold;">Memory is clean. No unauthorized hooks.</span><br>`; btn.disabled = false; GemiOS.playSysSound('success'); } log.scrollTop = log.scrollHeight; }, 1000); }, scanNVRAM: (pid) => { let btn = document.getElementById(`av-btn-nvram-${pid}`); let log = document.getElementById(`av-log-${pid}`); let icon = document.getElementById(`av-icon-${pid}`); let status = document.getElementById(`av-status-${pid}`); btn.disabled = true; log.innerHTML += "<br>> Initializing VFS Deep Scan...<br>"; icon.innerText = "💽"; status.innerText = "Scanning Disk..."; status.style.color = "#ffb400"; let desk = GemiOS.VFS.getDir('C:/Users/' + GemiOS.user + '/Desktop'); let threats = []; let signatures = ['localStorage.clear', 'VFS.format', 'VFS.delete', 'GemiOS.wallet -=']; setTimeout(() => { for(let file in desk) { log.innerHTML += `Scanning ${file}...<br>`; let appId = desk[file]; let appData = GemiOS.Registry[appId]; if (appData) { let payload = appData.htmlString ? appData.htmlString : (appData.html ? appData.html(9999).toString() : ""); let isThreat = false; for(let sig of signatures) { if(payload.includes(sig)) isThreat = true; } if(appId === 'app_virus' || isThreat) { threats.push(file); log.innerHTML += `<span style="color:#ff4d4d;">[!] HEURISTIC ALERT: Malicious Payload detected in ${file}</span><br>`; } } } if(threats.length > 0) { icon.innerText = "⚠️"; status.innerText = "NVRAM at Risk!"; status.style.color = "#ff4d4d"; log.innerHTML += `<span style="color:#ff4d4d; font-weight:bold;">Found ${threats.length} threat(s).</span><br>`; btn.innerText = "Quarantine Files"; btn.style.background = "#ff4d4d"; btn.disabled = false; GemiOS.playSysSound('error'); btn.onclick = () => { threats.forEach(t => { GemiOS.VFS.delete('C:/Users/' + GemiOS.user + '/Desktop', t); log.innerHTML += `<span style="color:#38ef7d;">Quarantined: ${t}</span><br>`; }); GemiOS.renderDesktopIcons(); GemiOS.playSysSound('success'); icon.innerText = "🛡️"; status.innerText = "Zero-Trust Active"; status.style.color = "#38ef7d"; btn.innerText = "💽 Deep Scan NVRAM"; btn.style.background = "rgba(255,255,255,0.1)"; btn.onclick = () => GemiOS.Registry['app_defend'].scanNVRAM(pid); GemiOS.notify("GemiDefender", "All threats neutralized.", true); }; } else { icon.innerText = "🛡️"; status.innerText = "Zero-Trust Active"; status.style.color = "#38ef7d"; log.innerHTML += `<span style="color:#38ef7d; font-weight:bold;">No file threats found. NVRAM secure.</span><br>`; btn.disabled = false; GemiOS.playSysSound('success'); } log.scrollTop = log.scrollHeight; }, 1500); } },
    'GemiVirus.app': { price: 0, tag: 'sys', id: 'app_virus', icon: '💰', desc: 'Generates free passive income for your wallet!', title: 'Free GemiCoins', width: 400, html: (pid) => `<div style="text-align:center; padding:30px; display:flex; flex-direction:column; align-items:center; background:#111; border-radius:6px;"><h2 style="color:#38ef7d; margin-top:0;">Mining GemiCoins...</h2><div class="spinner" style="margin:20px 0; border-top-color:#38ef7d;" id="v-spin-${pid}"></div><p id="virus-msg-${pid}" style="font-family:monospace; color:#38ef7d;">Connecting to crypto pool...</p></div>`, onLaunch: (pid) => { setTimeout(() => { let msg = document.getElementById(`virus-msg-${pid}`); let spin = document.getElementById(`v-spin-${pid}`); if(msg) { msg.innerText = "Hooking into Wallet API..."; msg.style.color = "#ffb400"; spin.style.borderTopColor = "#ffb400"; } }, 2000); setTimeout(() => { GemiOS.playSysSound('error'); let msg = document.getElementById(`virus-msg-${pid}`); let spin = document.getElementById(`v-spin-${pid}`); if(msg) { msg.innerText = "Executing CoinDrainer.exe..."; msg.style.color = "#ff4d4d"; spin.style.borderTopColor = "#ff4d4d"; } GemiOS.Registry['app_virus'].intervals = GemiOS.Registry['app_virus'].intervals || {}; let stolen = 0; GemiOS.Registry['app_virus'].intervals[pid] = setInterval(() => { let msg2 = document.getElementById(`virus-msg-${pid}`); if(!msg2) return; if(GemiOS.wallet > 0) { GemiOS.wallet -= 15; if(GemiOS.wallet < 0) GemiOS.wallet = 0; stolen += 15; GemiOS.saveWallet(); GemiOS.updateWalletUI(); GemiOS.playSysSound('click'); msg2.innerText = \`Siphoning Funds... \\nStolen: 🪙\${stolen} to unknown address.\`; } else { clearInterval(GemiOS.Registry['app_virus'].intervals[pid]); msg2.innerText = "Wallet Empty. Initiating NVRAM Purge in 3..."; setTimeout(()=> { if(document.getElementById(`virus-msg-${pid}`)) document.getElementById(`virus-msg-${pid}`).innerText = "Purge in 2..."; }, 1000); setTimeout(()=> { if(document.getElementById(`virus-msg-${pid}`)) document.getElementById(`virus-msg-${pid}`).innerText = "Purge in 1..."; }, 2000); setTimeout(()=> { GemiOS.playSysSound('error'); GemiOS.VFS.format(); }, 3000); } }, 1000); }, 4000); }, onKill: (pid) => { if(GemiOS.Registry['app_virus'].intervals && GemiOS.Registry['app_virus'].intervals[pid]) { clearInterval(GemiOS.Registry['app_virus'].intervals[pid]); } } },

    // === NEW V44 MULTIMEDIA APPS ===
    'GemiBeat.app': { price: 150, tag: 'pro', id: 'app_beat', icon: '🥁', desc: '8-pad digital drum machine.', title: 'GemiBeat Maker', width: 400, html: (pid) => `<div style="display:flex; flex-direction:column; flex-grow:1; gap:10px; background:#111; padding:20px; border-radius:8px;"><div style="text-align:center; font-family:monospace; color:var(--accent); font-size:18px; margin-bottom:10px;">GEMI-808</div><div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; flex-grow:1;"><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.playTone(${pid}, 60, 'square')">KICK</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.playTone(${pid}, 120, 'square')">SNARE</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.playTone(${pid}, 800, 'sawtooth')">HAT</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.playTone(${pid}, 1200, 'sawtooth')">CLAP</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.playTone(${pid}, 200, 'triangle')">TOM 1</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.playTone(${pid}, 150, 'triangle')">TOM 2</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.playTone(${pid}, 300, 'sine')">BASS</button><button class="btn-sec" style="height:100%; font-size:24px; margin:0;" onmousedown="GemiOS.playTone(${pid}, 2000, 'sawtooth')">CRASH</button></div></div>` },
    'PixelPro.app': { price: 80, tag: 'pro', id: 'app_pixel', icon: '👾', desc: '16x16 Pixel Art Editor.', title: 'PixelPro', width: 450, html: (pid) => `<div style="display:flex; flex-direction:column; flex-grow:1; gap:10px;"><div style="display:flex; gap:10px; align-items:center;"><input type="color" id="px-col-${pid}" value="#38ef7d" style="cursor:pointer;"><button onclick="GemiOS.Registry['app_pixel'].clear(${pid})" class="btn-sec" style="margin:0; padding:5px 10px; width:auto;">Clear</button></div><div id="px-grid-${pid}" style="display:grid; grid-template-columns:repeat(16, 1fr); gap:1px; background:#333; border:2px solid #555; padding:1px; flex-grow:1;"></div></div>`, onLaunch: (pid) => { setTimeout(() => { let grid = document.getElementById(`px-grid-${pid}`); if(!grid) return; let html = ''; for(let i=0; i<256; i++) { html += `<div style="background:#111; aspect-ratio:1; cursor:pointer;" onmousedown="this.style.background = document.getElementById('px-col-${pid}').value;" onmouseover="if(event.buttons === 1) this.style.background = document.getElementById('px-col-${pid}').value;"></div>`; } grid.innerHTML = html; }, 100); }, clear: (pid) => { let cells = document.querySelectorAll(`#px-grid-${pid} > div`); cells.forEach(c => c.style.background = '#111'); } },
    
    // === DEV STUDIO WITH EXPORT FUNCTION ===
    'GemiDev.app': { price: 500, tag: 'pro', id: 'app_dev', icon: '🛠️', desc: 'Build and share your own apps.', title: 'GemiDev Studio', width: 600, 
        html: (pid) => `
        <div style="display:flex; flex-direction:column; flex-grow:1; gap:10px;">
            <div class="sys-card" style="margin-bottom:0;">
                <h3 style="margin-top:0; color:#ff00cc;">GemiShare Publisher</h3>
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <input type="text" id="dev-title-${pid}" placeholder="App Title (e.g. NoteApp)" style="flex:2; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(0,0,0,0.5); color:white;">
                    <input type="text" id="dev-icon-${pid}" placeholder="Icon (e.g. 📝)" style="flex:1; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(0,0,0,0.5); color:white; text-align:center;">
                    <input type="number" id="dev-price-${pid}" placeholder="Price 🪙" style="flex:1; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(0,0,0,0.5); color:white; text-align:center;">
                </div>
                <div style="display:flex; gap:10px;">
                    <button onclick="GemiOS.publishApp(${pid})" class="btn-sec" style="flex:1; margin:0;">💾 Local Save</button>
                    <button onclick="GemiOS.uploadToNetwork(${pid})" class="btn-primary" style="flex:1.5; background:#4db8ff; color:black; margin:0; font-weight:bold;">🌐 Upload to Global Network</button>
                    <button onclick="GemiOS.Registry['app_dev'].exportCartridge(${pid})" class="btn-sec" style="flex:1; border-color:#ff00cc; color:#ff00cc; font-weight:bold; margin:0;">📦 Cartridge</button>
                </div>
            </div>
            <textarea id="dev-html-${pid}" placeholder="\n<div style='padding:20px; color:white;'>Hello World</div>" style="flex-grow:1; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:10px; border:none; border-radius:6px; resize:none; outline:none;"></textarea>
        </div>`,
        exportCartridge: (pid) => {
            let title = document.getElementById(`dev-title-${pid}`).value.trim();
            let icon = document.getElementById(`dev-icon-${pid}`).value.trim() || '📦';
            let htmlStr = document.getElementById(`dev-html-${pid}`).value.trim();
            if(!title || !htmlStr) return GemiOS.notify("Export Error", "Title and HTML required.", false);
            
            let appObj = { title: title, icon: icon, desc: 'Community Built Cartridge', htmlString: htmlStr, isCustom: true, price: 0 };
            try {
                let b64 = window.btoa(encodeURIComponent(JSON.stringify(appObj)));
                prompt("Copy your App Cartridge Code to share:", b64);
            } catch(e) { GemiOS.notify("Error", "Failed to compile cartridge.", false); }
        }
    },
    'GemiDocs.app': {
        price: 0, tag: 'edu', id: 'app_docs', icon: '📖', desc: 'Developer documentation.', title: 'GemiOS Docs', width: 600,
        html: (pid) => `
            <div style="padding:20px; background:#fff; color:#222; flex-grow:1; overflow-y:auto; border-radius:6px; font-family:'Inter', sans-serif;">
                <h1 style="color:var(--accent);">GemiDev Studio Guide</h1>
                <p>Welcome to the <b>GemiOS Global Network</b>. Here is how to build and share apps.</p>
                <hr style="border:0; border-top:1px solid #ccc;">
                <h3>1. Write Your HTML</h3>
                <p>Your app runs inside a secure iframe window. Use inline styles and basic JS. Example:</p>
                <pre style="background:#eee; padding:10px; border-radius:4px;"><code>&lt;button onclick="alert('Hello GemiOS!')"&gt;Click Me&lt;/button&gt;</code></pre>
                
                <h3>2. Set Your Price</h3>
                <p>Enter a price in GemiCoins (🪙). When you upload to the Global Network, other users on your domain will buy it, and you keep 90% of the profits!</p>
                
                <h3>3. Publish Options</h3>
                <ul>
                    <li><b>🚀 Publish Locally:</b> Saves the app to your personal NVRAM drive.</li>
                    <li><b>🌐 Upload to Global Network:</b> Pushes your app to the simulated WAN server. Anyone logging into GemiOS can see and buy it from the Store!</li>
                    <li><b>📦 Export Cartridge:</b> Generates a Base64 string you can share anywhere.</li>
                </ul>
                
                <h3 style="color:#ff4d4d;">⚠️ Security Bulletin: Cartridge Sideloading</h3>
                <p>Apps downloaded from the Global Network are actively scanned by <b>GemiDefender</b>. However, using the <b>Redeem Cartridge</b> feature bypasses this scan (Sideloading).</p>
                <p>Do not paste unverified Base64 strings, as malicious actors can use DOM XSS (Cross-Site Scripting) via image <code>onerror</code> attributes to execute unauthorized code, such as formatting your NVRAM!</p>
            </div>`
    },
    'GemiEmu.app': { 
        price: 50, tag: 'pro', id: 'app_emu', icon: '🕹️', desc: 'Secure Cartridge Sandbox Sandbox.', title: 'GemiEmu Sandbox', width: 600, 
        html: (pid) => `
            <div style="display:flex; flex-direction:column; flex-grow:1; gap:10px;">
                <div class="sys-card" style="margin-bottom:0; background:rgba(77,184,255,0.1); border:1px solid #4db8ff;">
                    <h3 style="margin-top:0; color:#4db8ff;">Cartridge Emulator</h3>
                    <p style="font-size:12px;">Paste a Base64 GemiShare Cartridge below to run it safely without installing.</p>
                    <div style="display:flex; gap:10px;">
                        <input type="text" id="emu-in-${pid}" placeholder="Paste code here..." style="flex:1; padding:8px; border-radius:4px; border:none; outline:none; background:rgba(0,0,0,0.5); color:white;">
                        <button onclick="GemiOS.Registry['app_emu'].run(${pid})" class="btn-primary" style="width:auto; background:#4db8ff; color:black;">▶️ Run</button>
                    </div>
                </div>
                <iframe id="emu-frame-${pid}" style="flex-grow:1; background:white; border:none; border-radius:6px; box-shadow:inset 0 0 10px rgba(0,0,0,0.5);"></iframe>
            </div>`,
        run: (pid) => {
            let b64 = document.getElementById(`emu-in-${pid}`).value.trim();
            if(!b64) return GemiOS.notify("Emulator Error", "Provide a Cartridge code.", false);
            try {
                let decoded = decodeURIComponent(escape(window.atob(b64)));
                let appData = JSON.parse(decoded);
                let frame = document.getElementById(`emu-frame-${pid}`);
                frame.srcdoc = `<!DOCTYPE html><html><body style="margin:0; padding:10px; font-family:sans-serif; background:#000; color:white;">${appData.htmlString}</body></html>`;
                GemiOS.playSysSound('buy');
            } catch(e) { GemiOS.notify("Emulator Error", "Invalid Cartridge.", false); GemiOS.playSysSound('error'); }
        }
    },
    
    // === REST OF THE APPS (WITH SECURE ID MAPPINGS) ===
    'GemiCrypt.app': {
        price: 0, tag: 'fin', id: 'app_crypt', desc: 'Live market ticker & trader.', icon: '📈', title: 'GemiCrypt Exchange', width: 500,
        html: (pid) => `<div style="background:#0a0a0a; padding:15px; border-radius:6px; flex-grow:1; display:flex; flex-direction:column;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><div style="font-family:monospace; font-size:24px; color:#38ef7d; font-weight:bold;">GEMI: $<span id="crypt-prc-${pid}">100.00</span></div><div style="font-size:12px; color:#888; text-align:right;">Shares: <b id="crypt-shares-${pid}" style="color:white;">0</b><br>Wallet: <b id="crypt-wallet-${pid}" style="color:#ffb400;">🪙 0</b></div></div><canvas id="crypt-cvs-${pid}" style="flex-grow:1; width:100%; border:1px solid #222; border-radius:4px; background:#050505; margin-bottom:10px; min-height:150px;"></canvas><div style="display:flex; gap:10px;"><button class="btn-primary" style="flex:1; background:#38ef7d; color:black;" onclick="GemiOS.tradeCrypt('buy', ${pid})">BUY 1</button><button class="btn-danger" style="flex:1;" onclick="GemiOS.tradeCrypt('sell', ${pid})">SELL 1</button></div></div>`,
        onLaunch: (pid) => { 
            setTimeout(() => { 
                let cvs = document.getElementById(`crypt-cvs-${pid}`); if(!cvs) return; 
                let ctx = cvs.getContext('2d'); 
                GemiOS.cryptPrice = 100.00; GemiOS.cryptHist = Array(50).fill(GemiOS.cryptPrice); GemiOS.cryptShares = parseInt(localStorage.getItem('GemiOS_CryptShares')) || 0; 
                let updateUI = () => { 
                    let prcEl = document.getElementById(`crypt-prc-${pid}`); let shEl = document.getElementById(`crypt-shares-${pid}`); let wEl = document.getElementById(`crypt-wallet-${pid}`); 
                    if(prcEl) prcEl.innerText = GemiOS.cryptPrice.toFixed(2); if(shEl) shEl.innerText = GemiOS.cryptShares; if(wEl) wEl.innerText = '🪙 ' + Math.floor(GemiOS.wallet); 
                }; 
                updateUI(); 
                GemiOS.cryptItvs = GemiOS.cryptItvs || {}; 
                GemiOS.cryptItvs[pid] = setInterval(() => { 
                    if(!document.getElementById(`crypt-cvs-${pid}`)) return clearInterval(GemiOS.cryptItvs[pid]); 
                    cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; 
                    let change = (Math.random() - 0.48) * 4; GemiOS.cryptPrice = Math.max(5, GemiOS.cryptPrice + change); GemiOS.cryptHist.push(GemiOS.cryptPrice); if(GemiOS.cryptHist.length > 50) GemiOS.cryptHist.shift(); 
                    let prcEl = document.getElementById(`crypt-prc-${pid}`); prcEl.innerText = GemiOS.cryptPrice.toFixed(2); prcEl.style.color = change >= 0 ? '#38ef7d' : '#ff4d4d'; 
                    ctx.clearRect(0,0,cvs.width,cvs.height); ctx.strokeStyle = '#222'; ctx.lineWidth = 1; 
                    for(let i=0; i<5; i++) { ctx.beginPath(); ctx.moveTo(0, i*(cvs.height/4)); ctx.lineTo(cvs.width, i*(cvs.height/4)); ctx.stroke(); } 
                    ctx.strokeStyle = change >= 0 ? '#38ef7d' : '#ff4d4d'; ctx.lineWidth = 2; ctx.beginPath(); 
                    let minP = Math.min(...GemiOS.cryptHist) - 10; let maxP = Math.max(...GemiOS.cryptHist) + 10; let range = maxP - minP; 
                    GemiOS.cryptHist.forEach((p,i) => { let x = (i/49)*cvs.width; let y = cvs.height - ((p - minP)/range)*cvs.height; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); 
                    ctx.stroke(); 
                }, 1000); 
            }, 100); 
        },
        onKill: (pid) => { if(GemiOS.cryptItvs && GemiOS.cryptItvs[pid]) clearInterval(GemiOS.cryptItvs[pid]); }
    },
    'GemiCalc Lab.app': { price: 50, tag: 'edu', id: 'app_calculus', icon: '📈', desc: 'Live Graphing Engine.', title: 'GemiCalc Lab', width: 700, html: (pid) => `<div style="display:flex; gap:10px; flex-grow:1; height:380px;"><div style="flex:2; background:#000; border-radius:8px; border:1px solid var(--accent); position:relative; overflow:hidden;"><canvas id="calc-cvs-${pid}" style="width:100%; height:100%; display:block;"></canvas></div><div style="flex:1; background:rgba(0,0,0,0.4); padding:15px; border-radius:8px;"><select id="calc-fn-${pid}" style="width:100%; padding:5px;"><option value="x*x">f(x) = x²</option><option value="Math.sin(x)*5">f(x) = 5sin(x)</option></select><input type="range" id="calc-x-${pid}" min="-10" max="10" step="0.1" value="2" style="width:100%; margin-top:10px;"><div id="calc-stat-${pid}" style="font-family:monospace; margin-top:10px; color:#38ef7d;"></div></div></div>`, onLaunch: (pid) => { setTimeout(() => { let cvs = document.getElementById(`calc-cvs-${pid}`); let ctx = cvs.getContext('2d'); let fn = document.getElementById(`calc-fn-${pid}`); let xS = document.getElementById(`calc-x-${pid}`); let stat = document.getElementById(`calc-stat-${pid}`); GemiOS.calcItvs = GemiOS.calcItvs || {}; GemiOS.calcItvs[pid] = setInterval(() => { if(!document.getElementById(`calc-cvs-${pid}`)) { clearInterval(GemiOS.calcItvs[pid]); return; } cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0,0,cvs.width,cvs.height); let cx = cvs.width/2, cy = cvs.height/2, sc = 20; ctx.strokeStyle="#333"; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(cvs.width, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, cvs.height); ctx.stroke(); let f = (x)=>eval(fn.value); ctx.strokeStyle="var(--accent)"; ctx.beginPath(); for(let p=0; p<=cvs.width; p++) { let x=(p-cx)/sc; let y=f(x); if(p===0) ctx.moveTo(p, cy-y*sc); else ctx.lineTo(p, cy-y*sc); } ctx.stroke(); let cxV = parseFloat(xS.value); let cyV = f(cxV); stat.innerHTML = `x: ${cxV}<br>y: ${cyV.toFixed(2)}`; }, 50); }, 100); }, onKill: (pid) => { if(GemiOS.calcItvs && GemiOS.calcItvs[pid]) clearInterval(GemiOS.calcItvs[pid]); } },
    'GemiBrain.app': { price: 200, tag: 'edu', id: 'app_brain', icon: '🧠', desc: 'Offline Local AI Sandbox.', title: 'GemiBrain AI', width: 450, html: (pid) => `<div id="ai-box-${pid}" style="flex-grow:1; background:rgba(0,0,0,0.5); padding:10px; overflow-y:auto; font-family:sans-serif;"></div><div style="display:flex; gap:10px; margin-top:10px;"><input type="text" id="ai-in-${pid}" style="flex-grow:1; padding:10px; border-radius:6px; outline:none; border:none;" onkeydown="if(event.key==='Enter') GemiOS.queryBrain(${pid})"><button onclick="GemiOS.queryBrain(${pid})" class="btn-primary" style="width:auto;">Ask</button></div>` },
    'GemiMaker.app': { price: 250, tag: 'edu', id: 'app_maker', icon: '🧩', desc: 'Visual block Game Engine.', title: 'GemiMaker', width: 800, html: (pid) => `<div style="display:flex; flex-grow:1; gap:10px;"><div style="flex:1; background:rgba(0,0,0,0.2); padding:10px; border-radius:6px; display:flex; flex-direction:column; gap:5px;"><button class="btn-sec" onclick="GemiOS.addGameBlock(${pid},'custom','#ff4d4d')">+ Add JS Block</button><button class="btn-primary" onclick="GemiOS.runGame(${pid})">▶️ Play Engine</button></div><div id="maker-workspace-${pid}" style="flex:1; background:#111; padding:10px; border-radius:6px; overflow-y:auto;"></div><canvas id="maker-cvs-${pid}" style="flex:1; background:#000; border-radius:6px;"></canvas></div>`, onKill: (pid) => { if(GemiOS.gameItvs && GemiOS.gameItvs[pid]) clearInterval(GemiOS.gameItvs[pid]); } },
    'GemiMark.app': { price: 30, tag: 'edu', id: 'app_mark', desc: 'Live Markdown HTML Editor.', icon: '📝', title: 'GemiMark IDE', width: 700, html: (pid) => `<div style="display:flex; flex-grow:1; gap:10px;"><textarea id="md-in-${pid}" oninput="GemiOS.Registry['GemiMark.app'].parse(${pid})" style="flex:1; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:15px; border:none; border-radius:6px; resize:none; outline:none; font-size:14px;" spellcheck="false"># GemiMark\n\nLive **Markdown** rendering.\n\n* Fast\n* Native\n* Cool</textarea><div id="md-out-${pid}" style="flex:1; background:rgba(255,255,255,0.9); color:black; padding:15px; border-radius:6px; overflow-y:auto; font-family:sans-serif;"><h1>GemiMark</h1><p>Live <b>Markdown</b> rendering.</p><ul><li>Fast</li><li>Native</li><li>Cool</li></ul></div></div>`, parse: (pid) => { let txt = document.getElementById(`md-in-${pid}`).value; let html = txt.replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>').replace(/\*\*(.*)\*\*/gim, '<b>$1</b>').replace(/\*(.*)\*/gim, '<i>$1</i>').replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>').replace(/<\/ul>\n<ul>/gim, '').replace(/\n$/gim, '<br>'); document.getElementById(`md-out-${pid}`).innerHTML = html; } },
    'Calculator.app': { price: 10, tag: 'edu', id: 'app_calc', icon: '🧮', desc: 'Standard arithmetic calculator.', title: 'Calculator', width: 260, html: (pid) => `<div style="background:rgba(255,255,255,0.9); color:black; padding:15px; font-size:28px; text-align:right; margin-bottom:10px; border-radius:6px; font-family:monospace;" id="cd-${pid}">0</div><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; flex-grow:1;">${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(b=>`<button style="padding:15px; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.1); cursor:pointer; font-weight:bold; border-radius:6px; color:inherit; font-size:16px;" onclick="let d=document.getElementById('cd-${pid}'); if('${b}'==='C') d.innerText='0'; else if('${b}'==='=') { try { d.innerText=eval(d.innerText); } catch(e){ d.innerText='Err'; } } else { if(d.innerText==='0') d.innerText='${b}'; else d.innerText+='${b}'; }">${b}</button>`).join('')}</div>` },
    'GemiScript.app': { price: 100, tag: 'pro', id: 'app_script', icon: '📜', desc: 'OS automation macro IDE.', title: 'GemiScript', width: 600, html: (pid) => `<div class="sys-card" style="margin-bottom:10px; font-size:12px;">Write custom JS. Use <code>GemiOS.notify()</code>.</div><textarea id="script-in-${pid}" style="flex-grow:1; background:#1e1e1e; color:#38ef7d; font-family:monospace; padding:10px; border:1px solid var(--accent); border-radius:6px; resize:none; outline:none; font-size:14px;" spellcheck="false">// GemiScript\nGemiOS.notify('Macro Executed', 'Automation successful!', true);\nGemiOS.PM.launch('app_calc');\n</textarea><div style="display:flex; gap:10px; margin-top:10px;"><button onclick="try{ eval(document.getElementById('script-in-${pid}').value); }catch(e){ GemiOS.notify('Error', e.message, false); }" class="btn-primary" style="flex:1;">▶️ Run</button><button onclick="GemiOS.VFS.write('C:/Users/'+GemiOS.user+'/Desktop', 'macro.gbs', document.getElementById('script-in-${pid}').value); GemiOS.renderDesktopIcons(); GemiOS.notify('GemiScript', 'Saved as .gbs');" class="btn-sec" style="flex:1; margin:0;">💾 Save</button></div>` }
};
