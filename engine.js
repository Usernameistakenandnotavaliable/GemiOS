/*=====================================================================
   GEMIOS GAME ENGINE CORE (v5.1)
   Dynamically injected by GemiOS Kernel
=====================================================================*/

window.GemiEngine = {
    workspaces: {}, loops: {}, sprites: {}, activeSprite: {},
    getHTML: function(pid) {
        return `
        <style>.engine-block{padding:6px 8px; border:none; border-radius:4px; color:white; font-weight:bold; cursor:pointer; text-align:left; font-size:10px; transition:0.2s; margin-bottom:5px; width:100%; box-shadow:0 2px 4px rgba(0,0,0,0.4);} .engine-block:hover{filter:brightness(1.2); transform:translateY(-1px);} .px-cell{background:transparent; border:1px solid rgba(255,255,255,0.1); cursor:pointer;} .px-cell:hover{background:rgba(255,255,255,0.3);} .cat-title {font-weight:bold; font-size:9px; color:#ffb400; margin-top:10px; margin-bottom:5px; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:2px;} .spr-tab {padding:8px 15px; cursor:pointer; font-size:12px; font-weight:bold; border-radius:6px 6px 0 0;}</style>
        <div style="display:flex; flex-grow:1; gap:10px; height:100%;">
            <div style="width:160px; background:rgba(0,0,0,0.3); border-radius:6px; padding:10px; overflow-y:auto;">
                <div class="cat-title" style="margin-top:0;">MOTION & PHYSICS</div>
                <button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'moveX', 'Move Right (10)')">Move Right</button>
                <button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'moveY', 'Move Down (10)')">Move Down</button>
                <button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'turn', 'Turn 15 Degrees')">Turn 15°</button>
                <button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'bounce', 'Physics: Bounce Edge')">Bounce on Edge</button>
                <button class="engine-block" style="background:#4db8ff;" onclick="GemiEngine.addBlock(${pid}, 'wrap', 'Physics: Screen Wrap')">Wrap Around Screen</button>
                <div class="cat-title">INPUTS & CONTROL</div>
                <button class="engine-block" style="background:#e67e22;" onclick="GemiEngine.addBlock(${pid}, 'wasd', 'Bind WASD Keys')">Bind WASD</button>
                <button class="engine-block" style="background:#e67e22;" onclick="GemiEngine.addBlock(${pid}, 'cursor', 'Glide to Mouse')">Glide to Mouse</button>
                <button class="engine-block" style="background:#e67e22;" onclick="GemiEngine.addBlock(${pid}, 'lockX', 'Lock to Mouse X')">Lock to Mouse X</button>
                <div class="cat-title">INTERACTION (MULTI)</div>
                <button class="engine-block" style="background:#f1c40f; color:black;" onclick="GemiEngine.addBlock(${pid}, 'glideOther', 'Glide to Other Sprite')">Glide to Other</button>
                <button class="engine-block" style="background:#f1c40f; color:black;" onclick="GemiEngine.addBlock(${pid}, 'touchOtherBounce', 'If Touching Other: Bounce')">If Touch Other: Bounce</button>
                <div class="cat-title">LOOKS & SOUND</div>
                <button class="engine-block" style="background:#ff00cc;" onclick="GemiEngine.addBlock(${pid}, 'nextCostume', 'Next Sprite Frame')">Animate Sprite</button>
                <button class="engine-block" style="background:#ff00cc;" onclick="GemiEngine.addBlock(${pid}, 'grow', 'Grow Size (+1)')">Grow Size</button>
                <button class="engine-block" style="background:#ff00cc;" onclick="GemiEngine.addBlock(${pid}, 'say', 'Say Text...', 'What should the sprite say?')">Say Text...</button>
                <button class="engine-block" style="background:#ff00cc;" onclick="GemiEngine.addBlock(${pid}, 'shake', 'Screen Shake Effect')">Screen Shake</button>
                <button class="engine-block" style="background:#9b59b6;" onclick="GemiEngine.addBlock(${pid}, 'sndClick', 'Play Tick Sound')">Play Tick Sound</button>
                <button class="engine-block" style="background:#9b59b6;" onclick="GemiEngine.addBlock(${pid}, 'sndSynth', 'Play Synth...', 'Enter Frequency (e.g. 440):')">Play Synth...</button>
                <div class="cat-title">VECTORS & MATH</div>
                <button class="engine-block" style="background:#2ecc71; color:black;" onclick="GemiEngine.addBlock(${pid}, 'addScore', 'Add 1 to Global Score')">Add 1 to Score</button>
                <button class="engine-block" style="background:#2ecc71; color:black;" onclick="GemiEngine.addBlock(${pid}, 'drawScore', 'Draw Score UI')">Draw Score UI</button>
                <button class="engine-block" style="background:#2ecc71; color:black;" onclick="GemiEngine.addBlock(${pid}, 'bgColor', 'Set BG Color...', 'Enter color (e.g. #222 or red):')">Set BG Color...</button>
                <div class="cat-title" style="color:#ff4d4d;">ADVANCED</div>
                <button class="engine-block" style="background:#ff4d4d;" onclick="GemiEngine.addBlock(${pid}, 'customJS', 'Custom JS Code', 'Available vars: state, other, mouse, keys, ctx, cvs')">Inject Custom JS</button>
            </div>
            <div style="flex:1.2; background:#111; border-radius:6px; border:2px solid #333; display:flex; flex-direction:column;">
                <div style="display:flex; background:#222; border-bottom:1px solid #333; justify-content:space-between; align-items:center; padding-right:10px;">
                    <div style="display:flex;">
                        <div id="tab-A-${pid}" class="spr-tab" style="background:var(--accent); color:white;" onclick="GemiEngine.switchSprite(${pid}, 'A')">Sprite A</div>
                        <div id="tab-B-${pid}" class="spr-tab" style="background:transparent; color:#aaa;" onclick="GemiEngine.switchSprite(${pid}, 'B')">Sprite B</div>
                    </div>
                    <div>
                        <button onclick="GemiEngine.showDocs()" style="background:#4db8ff; border:none; border-radius:4px; color:black; font-weight:bold; cursor:pointer; padding:4px 8px; margin-right:5px; font-size:10px;">📖 Docs</button>
                        <button onclick="GemiEngine.clearWorkspace(${pid})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:11px; font-weight:bold;">Clear</button>
                    </div>
                </div>
                <div id="ws-A-${pid}" style="flex-grow:1; padding:15px; overflow-y:auto; display:flex; flex-direction:column; gap:5px;"><div style="background:#38ef7d; color:black; padding:8px; border-radius:4px; font-weight:bold; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.5);">▶ SPRITE A LOOP</div></div>
                <div id="ws-B-${pid}" style="flex-grow:1; padding:15px; overflow-y:auto; display:none; flex-direction:column; gap:5px;"><div style="background:#ff4d4d; color:white; padding:8px; border-radius:4px; font-weight:bold; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.5);">▶ SPRITE B LOOP</div></div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:10px;">
                <canvas id="engine-cvs-${pid}" tabindex="1" style="height:200px; background:black; border-radius:6px; width:100%; border:2px solid var(--accent); box-shadow:inset 0 0 10px rgba(0,0,0,0.8); outline:none; cursor:crosshair;"></canvas>
                <div style="display:flex; gap:10px;">
                    <button onclick="GemiEngine.compileAndRun(${pid})" class="btn-primary" style="flex:2; background:#38ef7d; color:black; margin:0;">▶️ Play Game</button>
                    <button onclick="GemiEngine.stopGame(${pid})" class="btn-danger" style="flex:1; margin:0;">🛑 Stop</button>
                </div>
                <div style="background:#222; padding:10px; border-radius:6px; display:flex; flex-direction:column; align-items:center; flex-grow:1;">
                    <div style="display:flex; width:100%; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div style="font-size:11px; font-weight:bold; color:#ffb400;" id="editor-title-${pid}">SPRITE A EDITOR</div>
                        <div style="display:flex; gap:5px;">
                            <input type="color" id="clr-${pid}" value="#38ef7d" style="width:25px; height:25px; border:none; background:transparent; cursor:pointer;" title="Brush Color">
                            <button onclick="document.getElementById('clr-${pid}').value = 'transparent'" style="width:25px; height:25px; border:none; border-radius:4px; background:#fff; color:black; cursor:pointer; font-size:12px;" title="Eraser">🧹</button>
                        </div>
                    </div>
                    <div id="sprite-grid-${pid}" style="display:grid; grid-template-columns:repeat(16, 1fr); width:160px; height:160px; background:#000; border:1px solid #555;"></div>
                    <div style="display:flex; width:100%; gap:5px; margin-top:10px;">
                        <button class="btn-sec" style="flex:1; margin:0; font-size:10px; padding:5px;" onclick="GemiEngine.clearSprite(${pid})">Clear Grid</button>
                        <button class="btn-primary" style="flex:2; margin:0; font-size:10px; padding:5px;" onclick="GemiEngine.saveSprite(${pid})">Save Frame</button>
                    </div>
                    <div id="sprite-count-${pid}" style="font-size:10px; margin-top:5px; color:#888;">Frames in Memory: 0</div>
                </div>
            </div>
        </div>`;
    },
    init: function(pid) {
        this.workspaces[pid] = { A: [], B: [] }; this.sprites[pid] = { A: [], B: [] }; this.activeSprite[pid] = 'A';
        let container = document.getElementById(`content_${pid}`); if(container) container.innerHTML = this.getHTML(pid);
        setTimeout(() => { 
            let g = document.getElementById(`sprite-grid-${pid}`);
            if(g) { let h = ''; for(let i=0; i<256; i++) h += `<div class="px-cell" onmousedown="GemiEngine.isDrawing=true; this.style.background=document.getElementById('clr-${pid}').value === 'transparent' ? 'transparent' : document.getElementById('clr-${pid}').value;" onmouseover="if(GemiEngine.isDrawing) this.style.background=document.getElementById('clr-${pid}').value === 'transparent' ? 'transparent' : document.getElementById('clr-${pid}').value;"></div>`; g.innerHTML = h; }
            document.addEventListener('mouseup', () => GemiEngine.isDrawing = false);
            let cvs = document.getElementById(`engine-cvs-${pid}`); if(cvs) { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; } 
        }, 100);
    },
    switchSprite: function(pid, spr) {
        this.activeSprite[pid] = spr;
        document.getElementById(`tab-A-${pid}`).style.background = spr==='A' ? 'var(--accent)' : 'transparent'; document.getElementById(`tab-A-${pid}`).style.color = spr==='A' ? 'white' : '#aaa';
        document.getElementById(`tab-B-${pid}`).style.background = spr==='B' ? '#ff4d4d' : 'transparent'; document.getElementById(`tab-B-${pid}`).style.color = spr==='B' ? 'white' : '#aaa';
        document.getElementById(`ws-A-${pid}`).style.display = spr==='A' ? 'flex' : 'none'; document.getElementById(`ws-B-${pid}`).style.display = spr==='B' ? 'flex' : 'none';
        document.getElementById(`editor-title-${pid}`).innerText = `SPRITE ${spr} EDITOR`; document.getElementById(`clr-${pid}`).value = spr==='A' ? '#38ef7d' : '#ff4d4d';
    },
    showDocs: function() { alert("🎮 GemiMaker v5.1 Docs:\n\n- MULTI-SPRITE: Code Sprite A and B independently.\n- CUSTOM JS: Available vars: `state`, `other`, `mouse`, `keys`, `ctx`, `cvs`, `global`.\n- NEW: Use 'Screen Shake' or 'Play Synth' for juice!\n- NEW: 'Set BG Color' dynamically changes the canvas."); },
    clearSprite: function(pid) { let g = document.getElementById(`sprite-grid-${pid}`); if(g) Array.from(g.children).forEach(c => c.style.background = 'transparent'); },
    saveSprite: function(pid) { let g = document.getElementById(`sprite-grid-${pid}`); if(g) { let act = this.activeSprite[pid]; let frame = Array.from(g.children).map(c => c.style.background === 'transparent' || c.style.background === '' ? null : c.style.background); this.sprites[pid][act].push(frame); if(window.GemiOS) GemiOS.audio.play('click'); } },
    addBlock: function(pid, type, label, promptText = null) { 
        let val = ''; if(promptText) { val = prompt(promptText); if(val === null) return; label += `: ${val}`; type += `|${val}`; }
        let act = this.activeSprite[pid]; this.workspaces[pid][act].push(type); let ws = document.getElementById(`ws-${act}-${pid}`); 
        let color = "#4db8ff"; 
        if(['nextCostume','grow','say','opacity','touchMouseBounce','shake'].includes(type.split('|')[0])) color = "#ff00cc"; 
        if(['cursor', 'wasd', 'lockX'].includes(type.split('|')[0])) color = "#e67e22"; 
        if(['addScore', 'drawScore', 'bgColor'].includes(type.split('|')[0])) color = "#2ecc71";
        if(['sndClick', 'sndSynth'].includes(type.split('|')[0])) color = "#9b59b6";
        if(['glideOther', 'touchOtherBounce'].includes(type.split('|')[0])) color = "#f1c40f"; 
        if(['customJS'].includes(type.split('|')[0])) color = "#ff4d4d"; 
        let fontColor = ['addScore', 'drawScore', 'glideOther', 'touchOtherBounce', 'bgColor'].includes(type.split('|')[0]) ? 'black' : 'white';
        ws.insertAdjacentHTML('beforeend', `<div style="background:${color}; color:${fontColor}; padding:8px; border-radius:4px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.5); animation: popIn 0.2s ease;">${label}</div>`); 
        ws.scrollTop = ws.scrollHeight; if(window.GemiOS) GemiOS.audio.play('click'); 
    },
    clearWorkspace: function(pid) { let act = this.activeSprite[pid]; this.workspaces[pid][act] = []; let loopColor = act === 'A' ? '#38ef7d' : '#ff4d4d'; let fontColor = act === 'A' ? 'black' : 'white'; document.getElementById(`ws-${act}-${pid}`).innerHTML = `<div style="background:${loopColor}; color:${fontColor}; padding:8px; border-radius:4px; font-weight:bold; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.5);">▶ SPRITE ${act} LOOP</div>`; if(window.GemiOS) GemiOS.audio.play('error'); },
    compileAndRun: function(pid) { 
        this.stopGame(pid); let cvs = document.getElementById(`engine-cvs-${pid}`); if(!cvs) return; 
        cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; let ctx = cvs.getContext('2d'); 
        
        let stateA = { x: 50, y: cvs.height/2, size: 40, color: '#38ef7d', opacity: 1.0, vx: 5, vy: 5, rot: 0, frame: 0, tick: 0, text: null, jsError: false }; 
        let stateB = { x: cvs.width-50, y: cvs.height/2, size: 40, color: '#ff4d4d', opacity: 1.0, vx: -5, vy: 5, rot: 0, frame: 0, tick: 0, text: null, jsError: false }; 
        let global = { score: 0, bg: "rgba(0, 0, 0, 0.4)", shakeX: 0, shakeY: 0 };
        let mouse = { x: cvs.width/2, y: cvs.height/2, left: false, right: false }; let keys = {};
        
        cvs.focus();
        cvs.onmousemove = (e) => { mouse.x = e.offsetX; mouse.y = e.offsetY; }; cvs.onmousedown = (e) => { if(e.button === 0) mouse.left = true; if(e.button === 2) mouse.right = true; }; cvs.onmouseup = (e) => { mouse.left = false; mouse.right = false; }; cvs.oncontextmenu = (e) => e.preventDefault(); cvs.onkeydown = (e) => { keys[e.key.toLowerCase()] = true; e.preventDefault(); }; cvs.onkeyup = (e) => { keys[e.key.toLowerCase()] = false; };

        let blocksA = this.workspaces[pid]['A'] || []; let blocksB = this.workspaces[pid]['B'] || [];
        let spritesA = this.sprites[pid]['A'] || []; let spritesB = this.sprites[pid]['B'] || [];
        if(window.GemiOS) GemiOS.audio.play('success'); 
        
        const evaluateLogic = (blocks, state, otherState, savedSprites) => {
            state.tick++; state.text = null; global.shakeX = 0; global.shakeY = 0; state.jsError = false; 
            blocks.forEach(blockStr => { 
                let parts = blockStr.split('|'); let type = parts[0]; let val = parts.slice(1).join('|'); 
                if(type === 'moveX') state.x += state.vx; if(type === 'moveY') state.y += state.vy; if(type === 'turn') state.rot += 5;
                if(type === 'bounce') { if(state.x - state.size/2 < 0 || state.x + state.size/2 > cvs.width) state.vx *= -1; if(state.y - state.size/2 < 0 || state.y + state.size/2 > cvs.height) state.vy *= -1; } 
                if(type === 'wrap') { if(state.x < 0) state.x = cvs.width; if(state.x > cvs.width) state.x = 0; if(state.y < 0) state.y = cvs.height; if(state.y > cvs.height) state.y = 0; }
                if(type === 'cursor') { state.x += (mouse.x - state.x) * 0.1; state.y += (mouse.y - state.y) * 0.1; } 
                if(type === 'lockX') { state.x = mouse.x; } 
                if(type === 'wasd') { if(keys['w']) state.y -= 5; if(keys['s']) state.y += 5; if(keys['a']) state.x -= 5; if(keys['d']) state.x += 5; }
                if(type === 'glideOther') { state.x += (otherState.x - state.x) * 0.05; state.y += (otherState.y - state.y) * 0.05; }
                if(type === 'touchOtherBounce') { let dx = otherState.x - state.x; let dy = otherState.y - state.y; let dist = Math.sqrt(dx*dx + dy*dy); if(dist < (state.size/2 + otherState.size/2)) { state.vx *= -1; state.vy *= -1; } }
                if(type === 'say') state.text = val; if(type === 'opacity') { let o = parseFloat(val); if(!isNaN(o)) state.opacity = o; }
                if(type === 'shake') { global.shakeX = (Math.random()-0.5)*10; global.shakeY = (Math.random()-0.5)*10; }
                if(type === 'bgColor') { global.bg = val; }
                if(type === 'sndClick' && state.tick % 30 === 0) GemiOS.audio.play('click');
                if(type === 'sndSynth' && state.tick % 30 === 0) { let f=parseFloat(val); if(!isNaN(f)) GemiOS.audio._tone(f,f,null,0.1,0,0.2); }
                if(type === 'nextCostume' && savedSprites.length > 0 && state.tick % 15 === 0) { state.frame = (state.frame + 1) % savedSprites.length; }
                if(type === 'grow') { state.size += 0.5; if(state.size > 200) state.size = 20; } 
                if(type === 'addScore' && state.tick % 30 === 0) { global.score += 1; }
                if(type === 'drawScore') { ctx.fillStyle = "#fff"; ctx.font = "14px monospace"; ctx.fillText(`Global Score: ${global.score}`, 10, 20); }
                if(type === 'customJS') {
                    try { let customFunc = new Function('state', 'other', 'mouse', 'keys', 'ctx', 'cvs', 'global', val); customFunc(state, otherState, mouse, keys, ctx, cvs, global); } 
                    catch(err) { if(!state.jsError) { console.error("Custom JS Error: ", err); if(window.GemiOS) GemiOS.bus.emit('notify', {title: 'JS Error', msg: 'Check console. Script halted.', success: false}); state.jsError = true; } }
                }
            }); 
        };

        const renderSprite = (state, savedSprites) => {
            ctx.save(); ctx.translate(state.x + global.shakeX, state.y + global.shakeY); ctx.rotate(state.rot * Math.PI / 180); ctx.globalAlpha = state.opacity;
            if(savedSprites.length > 0 && savedSprites[state.frame]) {
                let pxSize = state.size / 16; let currentGrid = savedSprites[state.frame];
                for(let i=0; i<256; i++) { if(currentGrid[i]) { ctx.fillStyle = currentGrid[i]; let pxX = (i % 16) * pxSize - (state.size/2); let pxY = Math.floor(i / 16) * pxSize - (state.size/2); ctx.fillRect(pxX, pxY, pxSize+0.5, pxSize+0.5); } }
            } else { ctx.fillStyle = state.color; ctx.fillRect(-state.size/2, -state.size/2, state.size, state.size); }
            ctx.restore();
            if(state.text) { ctx.fillStyle = "#fff"; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillText(state.text, state.x + global.shakeX, state.y + global.shakeY - (state.size/2) - 10); }
        };

        const gameLoop = () => { 
            ctx.fillStyle = global.bg; ctx.fillRect(0, 0, cvs.width, cvs.height); 
            if(!stateA.jsError) evaluateLogic(blocksA, stateA, stateB, spritesA); 
            if(!stateB.jsError) evaluateLogic(blocksB, stateB, stateA, spritesB);
            renderSprite(stateB, spritesB); renderSprite(stateA, spritesA);
            this.loops[pid] = requestAnimationFrame(gameLoop); 
        }; 
        gameLoop(); 
    },
    stopGame: function(pid) { if(this.loops[pid]) { cancelAnimationFrame(this.loops[pid]); delete this.loops[pid]; let cvs = document.getElementById(`engine-cvs-${pid}`); if(cvs) { let ctx = cvs.getContext('2d'); ctx.fillStyle = "black"; ctx.fillRect(0,0,cvs.width,cvs.height); } } }
};
console.log("⚙️ GemiEngine Module Loaded Successfully.");
