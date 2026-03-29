/*=====================================================================
   GEMIMAKER ENGINE - v6.0 (AEGIS POWERED)
   Direct Hardware integration for zero-lag physics.
=====================================================================*/

console.log("🎮 GemiMaker v6.0 Engine Module Loaded.");

window.GemiEngine = {
    // Overriding the placeholder in the Registry!
    injectApp: () => {
        window.GemiRegistry['app_maker'] = {
            id: 'app_maker', tag: 'pro', icon: '🎮', title: 'GemiMaker Pro', width: 750,
            html: (pid) => `
                <div style="display:flex; height:400px; gap:15px; color:white;">
                    <div style="flex-grow:1; background:#000; border-radius:8px; border:1px solid #333; position:relative; overflow:hidden;">
                        <canvas id="gm-cvs-${pid}" style="width:100%; height:100%;"></canvas>
                        <div style="position:absolute; top:10px; left:10px; font-family:monospace; font-size:10px; color:#38ef7d; background:rgba(0,0,0,0.5); padding:5px; border-radius:4px;">AEGIS ENGINE 6.0</div>
                    </div>
                    
                    <div style="width:220px; background:rgba(0,0,0,0.4); border-radius:8px; border:1px solid rgba(255,255,255,0.1); padding:15px; display:flex; flex-direction:column; gap:10px; overflow-y:auto;">
                        <h4 style="margin:0; color:var(--accent);">Sprite Properties</h4>
                        
                        <label style="font-size:11px; color:#aaa;">X Velocity Equation:</label>
                        <input type="text" id="gm-vx-${pid}" value="vx" style="background:rgba(0,0,0,0.5); border:1px solid #444; color:white; padding:5px; border-radius:4px; font-family:monospace;">
                        
                        <label style="font-size:11px; color:#aaa;">Y Velocity Equation:</label>
                        <input type="text" id="gm-vy-${pid}" value="vy + 0.2" style="background:rgba(0,0,0,0.5); border:1px solid #444; color:white; padding:5px; border-radius:4px; font-family:monospace;">
                        
                        <button onclick="window.GemiEngine.applyMath(${pid})" style="margin-top:10px; background:var(--accent); color:white; border:none; padding:8px; border-radius:4px; cursor:pointer; font-weight:bold;">Compile to Aegis</button>
                        
                        <div style="border-top:1px solid #444; margin-top:10px; padding-top:10px;">
                            <button onclick="window.GemiEngine.resetSprite(${pid})" style="width:100%; background:rgba(255,255,255,0.1); color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">Reset Position</button>
                        </div>
                    </div>
                </div>`,
            onLaunch: (pid) => {
                window.GemiEngine.start(pid);
            }
        };
    },

    // Engine Instance Data
    instances: new Map(),

    start: (pid) => {
        setTimeout(() => {
            const cvs = document.getElementById(`gm-cvs-${pid}`);
            if(!cvs || !window.Aegis) return;
            
            cvs.width = cvs.offsetWidth;
            cvs.height = cvs.offsetHeight;
            
            // Register this game instance
            window.GemiEngine.instances.set(pid, {
                x: cvs.width / 2, y: 50,
                vx: 3, vy: 0,
                eqX: "vx", eqY: "vy + 0.2", // Default Gravity
                ctx: cvs.getContext('2d'),
                w: cvs.width, h: cvs.height
            });

            // If we haven't hooked the Aegis Loop yet, do it now.
            if(!window.GemiEngine.loopActive) {
                window.Aegis.Loop.subscribe(() => window.GemiEngine.tick());
                window.GemiEngine.loopActive = true;
            }
        }, 100);
    },

    applyMath: (pid) => {
        const inst = window.GemiEngine.instances.get(pid);
        if(!inst) return;
        inst.eqX = document.getElementById(`gm-vx-${pid}`).value;
        inst.eqY = document.getElementById(`gm-vy-${pid}`).value;
        GemiOS.bus.emit('notify', {msg: 'Equations Compiled to Aegis Math Kernel.'});
    },

    resetSprite: (pid) => {
        const inst = window.GemiEngine.instances.get(pid);
        if(!inst) return;
        inst.x = inst.w / 2;
        inst.y = 50;
        inst.vx = 3;
        inst.vy = 0;
    },

    // Master Game Loop - Processes all open GemiMaker windows at once!
    tick: () => {
        window.GemiEngine.instances.forEach((inst, pid) => {
            // Check if window was closed
            if(!document.getElementById(`gm-cvs-${pid}`)) {
                window.GemiEngine.instances.delete(pid);
                return;
            }
            
            inst.ctx.clearRect(0, 0, inst.w, inst.h);
            
            // The Magic: Using Aegis Math to evaluate the string equations securely
            inst.vx = window.Aegis.Math.solve(inst.eqX, {vx: inst.vx, vy: inst.vy, x: inst.x, y: inst.y});
            inst.vy = window.Aegis.Math.solve(inst.eqY, {vx: inst.vx, vy: inst.vy, x: inst.x, y: inst.y});
            
            inst.x += inst.vx;
            inst.y += inst.vy;
            
            // Floor / Wall Collisions
            if(inst.y > inst.h - 20) { inst.y = inst.h - 20; inst.vy *= -0.8; }
            if(inst.y < 20) { inst.y = 20; inst.vy *= -0.8; }
            if(inst.x > inst.w - 20) { inst.x = inst.w - 20; inst.vx *= -1; }
            if(inst.x < 20) { inst.x = 20; inst.vx *= -1; }
            
            // Draw Sprite
            inst.ctx.fillStyle = '#ffb400';
            inst.ctx.fillRect(inst.x - 20, inst.y - 20, 40, 40);
            
            // Draw Velocity Vector
            inst.ctx.beginPath();
            inst.ctx.moveTo(inst.x, inst.y);
            inst.ctx.lineTo(inst.x + (inst.vx * 5), inst.y + (inst.vy * 5));
            inst.ctx.strokeStyle = 'white';
            inst.ctx.stroke();
        });
    }
};

// Inject it into the registry immediately upon download!
window.GemiEngine.injectApp();
