/*=====================================================================
   GEMIMAKER ENGINE - v53.0.0 (AEGIS POWERED)
   Upgraded: Math Kernel Integration for high-speed sprites.
=====================================================================*/

window.GemiEngine = {
    init: (pid) => {
        console.log("Engine: Hooking into Aegis Master Loop...");
        // Instead of a custom setInterval, we subscribe to the Hypervisor
        window.Aegis.Loop.subscribe((t) => {
            if(window.GemiEngine.gameState === 'PLAYING') {
                window.GemiEngine.updateSprites(t);
            }
        });
    },

    // NEW v53 LOGIC: Using Aegis for equation-based movement
    updateSprites: (t) => {
        this.sprites.forEach(s => {
            // Using Aegis.Math to solve movement equations
            s.x += window.Aegis.Math.eval(s.moveFormulaX, {t});
            s.y += window.Aegis.Math.eval(s.moveFormulaY, {t});
        });
        this.render();
    }
};
