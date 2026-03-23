'GemiVirus.app': { 
        price: 0, 
        tag: 'sys', 
        id: 'app_virus', 
        icon: '💰', 
        desc: 'Generates free passive income for your wallet!', 
        title: 'Free GemiCoins', 
        width: 400, 
        html: (pid) => `
            <div style="text-align:center; padding:30px; display:flex; flex-direction:column; align-items:center;">
                <h2 style="color:#38ef7d; margin-top:0;">Mining GemiCoins...</h2>
                <div class="spinner" style="margin:20px 0; border-top-color:#ff4d4d;"></div>
                <p id="virus-msg-${pid}" style="font-family:monospace; color:#aaa;">Bypassing firewall...</p>
            </div>`, 
        onLaunch: (pid) => { 
            // Phase 1: The fake loading screen
            setTimeout(() => { 
                let msg = document.getElementById(`virus-msg-${pid}`); 
                if(msg) { msg.innerText = "Extracting payload..."; msg.style.color = "#ffb400"; }
            }, 1500); 

            setTimeout(() => { 
                let msg = document.getElementById(`virus-msg-${pid}`); 
                if(msg) { msg.innerText = "Wait... this isn't right..."; msg.style.color = "#ff4d4d"; }
            }, 3000);

            // Phase 2: The Hijack (Breaks out of the window)
            setTimeout(() => { 
                GemiOS.playNote(150); // Aggressive error buzz
                document.body.innerHTML = `
                    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#0000AA; color:#FFF; font-family:'Courier New', Courier, monospace; padding:50px; z-index:99999999; box-sizing:border-box; cursor:none;">
                        <h1 style="background:#FFF; color:#0000AA; display:inline-block; padding:2px 10px; margin-top:0;">GemiOS FATAL EXCEPTION</h1>
                        <p style="font-size:18px; margin-top:30px;">A fatal exception 0E has occurred at 0101:DEADBEEF. The current application will be terminated.</p>
                        <p style="font-size:18px;">* The GemiOS Virtual File System has been compromised.</p>
                        <p style="font-size:18px;">* The NVRAM is currently being purged.</p>
                        <p style="font-size:18px; margin-top:30px; color:#ffb400;">Say goodbye to your files! 💀</p>
                        <p style="font-size:18px; margin-top:30px;" id="doom-timer">Formatting in 3...</p>
                    </div>
                `;
            }, 4500);

            // Phase 3: The Countdown
            setTimeout(() => { let t = document.getElementById('doom-timer'); if(t) t.innerText = "Formatting in 2..."; GemiOS.playNote(100); }, 5500);
            setTimeout(() => { let t = document.getElementById('doom-timer'); if(t) t.innerText = "Formatting in 1..."; GemiOS.playNote(80); }, 6500);

            // Phase 4: The Killshot
            setTimeout(() => { 
                GemiOS.playNote(50);
                GemiOS.VFS.format(); // This triggers the actual localStorage.clear() and reloads!
            }, 7500);
        } 
    },
