// =========================================================================
// GEMIOS VISUAL GAME ENGINE (GemiMaker Core)
// =========================================================================

window.GemiEngine = {
    workspaces: {},
    loops: {},

    // Initialize the Engine inside the Window
    init: function(pid) {
        this.workspaces[pid] = [];
        
        let html = `
            <div style="display:flex; flex-grow:1; gap:10px; height:100%;">
                <div style="width:160px; background:rgba(0,0,0,0.3); border-radius:6px; padding:10px; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    <div style="font-weight:bold; font-size:12px; color:#ffb400; margin-bottom:5px;">MOTION BLOCKS</div>
                    <button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'moveX', 'Move Right (10)')">Move Right</button>
                    <button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'moveY', 'Move Down (10)')">Move Down</button>
                    <button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'bounce', 'Bounce on Edge')">Bounce on Edge</button>
                    
                    <div style="font-weight:bold; font-size:12px; color:#ffb400; margin-top:10px; margin-bottom:5px;">LOOKS BLOCKS</div>
                    <button class="engine-block" style="background:#ff00cc;" onclick="GemiEngine.addBlock(${pid}, 'color', 'Change Color Randomly')">Change Color</button>
                    <button class="engine-block" style="background:#ff00cc;" onclick="GemiEngine.addBlock(${pid}, 'grow', 'Grow Size (+1)')">Grow Size</button>
                    
                    <div style="font-weight:bold; font-size:12px; color:#ffb400; margin-top:10px; margin-bottom:5px;">CONTROL BLOCKS</div>
                    <button class="engine-block" style="background:#ff4d4d;" onclick="GemiEngine.addBlock(${pid}, 'cursor', 'Follow Cursor')">Follow Mouse</button>
                </div>

                <div style="flex:1; background:#111; border-radius:6px; border:2px solid #333; display:flex; flex-direction:column;">
                    <div style="background:#222; padding:10px; font-weight:bold; color:white; border-bottom:1px solid #333; display:flex; justify-content:space-between;">
                        <span>Script Workspace</span>
                        <button onclick="GemiEngine.clearWorkspace(${pid})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">Clear</button>
                    </div>
                    <div id="engine-workspace-${pid}" style="flex-grow:1; padding:15px; overflow-y:auto; display:flex; flex-direction:column; gap:5px;">
                        <div style="background:#38ef7d; color:black; padding:8px; border-radius:4px; font-weight:bold; text-align:center;">▶ ON START LOOP</div>
                    </div>
                </div>

                <div style="flex:1; display:flex; flex-direction:column; gap:10px;">
                    <canvas id="engine-cvs-${pid}" style="flex-grow:1; background:black; border-radius:6px; width:100%; border:2px solid var(--accent);"></canvas>
                    <div style="display:flex; gap:10px;">
                        <button onclick="GemiEngine.compileAndRun(${pid})" class="btn-primary" style="flex:2; background:#38ef7d; color:black;">▶️ Compile & Play</button>
                        <button onclick="GemiEngine.stopGame(${pid})" class="btn-danger" style="flex:1;">🛑 Stop</button>
                    </div>
                </div>
            </div>
            <style>
                .engine-block { padding:8px; border:none; border-radius:4px; color:white; font-weight:bold; cursor:pointer; text-align:left; font-size:12px; box-shadow:0 2px 4px rgba(0,0,0,0.4); transition:0.2s; }
                .engine-block:hover { filter:brightness(1.2); transform:translateY(-1px); }
                .engine-block:active { transform:scale(0.95); }
            </style>
        `;
        
        let container = document.getElementById(`content_${pid}`);
        if(container) container.innerHTML = html;
        
        // Initialize Canvas
        setTimeout(() => {
            let cvs = document.getElementById(`engine-cvs-${pid}`);
            if(cvs) { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; }
        }, 100);
    },

    addBlock: function(pid, type, label) {
        this.workspaces[pid].push(type);
        let ws = document.getElementById(`engine-workspace-${pid}`);
        
        let color = "#4db8ff";
        if(type === 'color' || type === 'grow') color = "#ff00cc";
        if(type === 'cursor') color = "#ff4d4d";

        let blockHtml = `<div style="background:${color}; color:white; padding:8px; border-radius:4px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.5); animation: popIn 0.2s ease;">${label}</div>`;
        ws.insertAdjacentHTML('beforeend', blockHtml);
        ws.scrollTop = ws.scrollHeight;
        if(window.GemiOS) GemiOS.playSysSound('click');
    },

    clearWorkspace: function(pid) {
        this.workspaces[pid] = [];
        document.getElementById(`engine-workspace-${pid}`).innerHTML = `<div style="background:#38ef7d; color:black; padding:8px; border-radius:4px; font-weight:bold; text-align:center;">▶ ON START LOOP</div>`;
        if(window.GemiOS) GemiOS.playSysSound('alert');
    },

    compileAndRun: function(pid) {
        this.stopGame(pid); // Stop previous loop
        
        let cvs = document.getElementById(`engine-cvs-${pid}`);
        if(!cvs) return;
        cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight;
        let ctx = cvs.getContext('2d');

        // Initial Game State (The "Sprite")
        let sprite = { x: cvs.width/2, y: cvs.height/2, size: 20, color: '#38ef7d', vx: 5, vy: 5 };
        let mouse = { x: cvs.width/2, y: cvs.height/2 };
        
        cvs.onmousemove = (e) => { mouse.x = e.offsetX; mouse.y = e.offsetY; };

        let blocks = this.workspaces[pid];
        if(window.GemiOS) GemiOS.playSysSound('success');

        // The Compiler Engine
        const gameLoop = () => {
            // Clear background
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Trailing effect
            ctx.fillRect(0, 0, cvs.width, cvs.height);

            // Execute Blocks sequentially
            blocks.forEach(type => {
                if(type === 'moveX') sprite.x += sprite.vx;
                if(type === 'moveY') sprite.y += sprite.vy;
                if(type === 'bounce') {
                    if(sprite.x < 0 || sprite.x > cvs.width) sprite.vx *= -1;
                    if(sprite.y < 0 || sprite.y > cvs.height) sprite.vy *= -1;
                }
                if(type === 'color') {
                    if(Math.random() < 0.05) sprite.color = `hsl(${Math.random()*360}, 100%, 50%)`;
                }
                if(type === 'grow') {
                    sprite.size += 0.1;
                    if(sprite.size > 100) sprite.size = 10;
                }
                if(type === 'cursor') {
                    sprite.x += (mouse.x - sprite.x) * 0.05;
                    sprite.y += (mouse.y - sprite.y) * 0.05;
                }
            });

            // Draw Sprite
            ctx.fillStyle = sprite.color;
            ctx.fillRect(sprite.x - sprite.size/2, sprite.y - sprite.size/2, sprite.size, sprite.size);

            this.loops[pid] = requestAnimationFrame(gameLoop);
        };

        gameLoop(); // Start engine
    },

    stopGame: function(pid) {
        if(this.loops[pid]) {
            cancelAnimationFrame(this.loops[pid]);
            delete this.loops[pid];
            
            let cvs = document.getElementById(`engine-cvs-${pid}`);
            if(cvs) {
                let ctx = cvs.getContext('2d');
                ctx.fillStyle = "black";
                ctx.fillRect(0,0,cvs.width,cvs.height);
            }
        }
    }
};
console.log("[ENGINE] GemiMaker External Engine Loaded.");
