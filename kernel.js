<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<title>GemiOS v48</title>



<!-- ---------------  CSP – blocks eval & unsafe‑inline scripts --------------- -->

<meta http-equiv="Content-Security-Policy"

      content="default-src 'self' https://cdnjs.cloudflare.com;

               script-src 'self' https://cdnjs.cloudflare.com;

               style-src 'self' 'unsafe-inline';

               object-src 'none';

               connect-src https://raw.githubusercontent.com">



<!-- ---------------  DOMPurify – used for HTML sanitising --------------- -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"

        integrity="sha512-6k8Znbe90x/oaVkk+3EOkkCC1QFZDIwNYM1pcbczG8iOHXPEsFAKZpNBmSJ1tGNr7cFNA25Onw6D3qjBWyZBZg=="

        crossorigin="anonymous" referrerpolicy="no-referrer"></script>



<!-- ---------------  CSS – the V48 look & feel --------------- -->

<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

:root { --accent:#0078d7; --bg:#0f2027; --bg-light:#e0eafc; --text:#fff; --text-light:#222; }

[data-theme="light"] { --bg:var(--bg-light); --text:var(--text-light); }

body{margin:0;overflow:hidden;background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;user-select:none;transition:background .6s,color .6s}

::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.3);border-radius:4px}

body.light-mode ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2)}

@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}

@keyframes spin{100%{transform:rotate(360deg)}}

@keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}

@keyframes popIn{0%{opacity:0;transform:scale(.9) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)}}

@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

.spinner{width:40px;height:40px;border:4px solid rgba(255,255,255,.1);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite}

.win{position:absolute;background:rgba(20,30,40,.7);backdrop-filter:blur(30px) saturate(200%);color:#fff;border-radius:12px;box-shadow:0 30px 60px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);display:flex;flex-direction:column;resize:both;overflow:hidden}

.win-animated{animation:popIn .4s cubic-bezier(.175,.885,.32,1.275) forwards;transition:width .3s,height .3s,top .3s,left .3s}

.win-static{animation:none;transition:none}

body.light-mode .win{background:rgba(255,255,255,.85);border:1px solid var(--accent);color:#222;box-shadow:0 30px 60px rgba(0,0,0,.15), inset 0 1px 1px rgba(255,255,255,.8)}

.resize-handle{position:absolute;bottom:0;right:0;width:20px;height:20px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 50%,rgba(255,255,255,.2) 50%)}

.title-bar{padding:12px 18px;font-weight:600;font-size:14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.05);cursor:grab}

body.light-mode .title-bar{border-bottom:1px solid rgba(0,0,0,.05)}

.content{padding:15px;flex-grow:1;overflow-y:auto;display:flex;flex-direction:column}

.ctrl-btn{border:none;color:#fff;cursor:pointer;width:22px;height:22px;border-radius:50%;font-weight:bold;font-size:11px;transition:.2s;margin-left:6px;display:inline-flex;align-items:center;justify-content:center}

.close-btn{background:rgba(255,77,77,.8)}.close-btn:hover{background:#ff4d4d;transform:scale(1.1)}

.min-btn{background:rgba(255,180,0,.8)}.min-btn:hover{background:#ffb400;transform:scale(1.1)}

.snap-btn{background:rgba(255,255,255,.2)}.snap-btn:hover{background:rgba(255,255,255,.4);transform:scale(1.1)}

body.light-mode .snap-btn{background:rgba(0,0,0,.1)}body.light-mode .snap-btn:hover{background:rgba(0,0,0,.2)}

#taskbar-container{position:absolute;bottom:15px;width:100%;display:flex;justify-content:center;pointer-events:none;z-index:99999}

#taskbar{pointer-events:auto;height:60px;background:rgba(10,15,20,.6);backdrop-filter:blur(25px) saturate(180%);display:flex;align-items:center;padding:0 15px;border-radius:30px;border:1px solid rgba(255,255,255,.1);box-shadow:0 15px 35px rgba(0,0,0,.5), inset 0 1px 1px rgba(255,255,255,.1);transition:all .3s}

body.light-mode #taskbar{background:rgba(255,255,255,.7);border:1px solid rgba(0,0,0,.1);color:#222;box-shadow:0 15px 35px rgba(0,0,0,.1), inset 0 1px 1px rgba(255,255,255,.8)}

.start{width:44px;height:44px;background:linear-gradient(135deg,var(--accent),#005a9e);border-radius:50%;border:2px solid rgba(255,255,255,.2);font-weight:600;font-size:20px;text-align:center;line-height:40px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.4);transition:.2s}

.start:hover{transform:scale(1.1) translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.6);border-color:#fff}

.ql-icon{width:35px;height:35px;border-radius:10px;display:flex;justify-content:center;align-items:center;font-size:18px;cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.05);margin-right:5px;transition:.2s}

.ql-icon:hover{background:rgba(255,255,255,.2);transform:translateY(-2px);border-color:rgba(255,255,255,.4)}

body.light-mode .ql-icon{background:rgba(0,0,0,.05);border-color:rgba(0,0,0,.05)}body.light-mode .ql-icon:hover{background:rgba(0,0,0,.1);border-color:rgba(0,0,0,.2)}

#taskbar-apps{display:flex;align-items:center;margin:0 20px;gap:8px}

.tb-item{padding:8px 15px;background:rgba(255,255,255,.05);border-radius:12px;cursor:pointer;font-size:13px;font-weight:500;transition:.2s cubic-bezier(.175,.885,.32,1.275);opacity:.6}

.tb-item.active{opacity:1;background:rgba(255,255,255,.1);border-bottom:2px solid var(--accent);border-radius:12px 12px 4px 4px}

.tb-item:hover{background:rgba(255,255,255,.15);transform:translateY(-3px)}

body.light-mode .tb-item{background:rgba(0,0,0,.05)}body.light-mode .tb-item.active{background:rgba(0,0,0,.08)}body.light-mode .tb-item:hover{background:rgba(0,0,0,.1)}

#start-menu{position:absolute;bottom:90px;left:50%;transform:translateX(-50%);width:380px;max-height:650px;background:rgba(20,30,40,.85);backdrop-filter:blur(35px) saturate(200%);border-radius:20px;box-shadow:0 25px 60px rgba(0,0,0,.7), inset 0 1px 1px rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);display:none;flex-direction:column;z-index:100000;overflow:hidden}

#start-menu.open{display:flex;animation:slideUp .3s cubic-bezier(.175,.885,.32,1.275) forwards}

body.light-mode #start-menu{background:rgba(255,255,255,.9);border:1px solid rgba(0,0,0,.1);color:#222}

.start-header{background:linear-gradient(135deg,rgba(0,0,0,.2),transparent);color:#fff;padding:25px;font-weight:600;display:flex;align-items:center;gap:15px;border-bottom:1px solid rgba(255,255,255,.05)}

body.light-mode .start-header{color:#222;border-bottom:1px solid rgba(0,0,0,.05)}

.start-cat{font-size:11px;font-weight:bold;color:#888;margin:15px 20px 5px;letter-spacing:1px;text-transform:uppercase}

.start-item{padding:10px 20px;cursor:pointer;display:flex;align-items:center;gap:15px;font-size:14px;font-weight:500;transition:.2s;border-radius:10px;margin:2px 10px}

.start-item:hover{background:var(--accent);color:#fff;transform:translateX(5px)}

body.light-mode .start-item:hover{background:var(--accent);color:#fff}

.icon{position:absolute;width:75px;cursor:pointer;transition:.2s;border-radius:12px;padding:10px 5px;text-align:center;color:#fff;font-size:12px;font-weight:500;text-shadow:0 2px 4px rgba(0,0,0,.8);display:flex;flex-direction:column;align-items:center}

.icon:hover{background:rgba(255,255,255,.15);backdrop-filter:blur(10px);outline:1px solid rgba(255,255,255,.3);transform:translateY(-2px);box-shadow:0 10px 20px rgba(0,0,0,.3)}

.icon:active{transform:scale(.95);cursor:grabbing}

.icon div{font-size:38px;margin-bottom:5px}

body.light-mode .icon{color:#222;text-shadow:0 1px 2px rgba(255,255,255,.8)}

body.light-mode .icon:hover{background:rgba(0,0,0,.05);outline:1px solid rgba(0,0,0,.1)}

#desktop-bg{width:100vw;height:100vh;position:absolute;top:0;left:0;pointer-events:none;background-size:cover!important;background-position:center!important;z-index:1;transition:filter 1s ease,transform 1s ease}

.sys-card{background:rgba(255,255,255,.05);padding:15px;border-radius:10px;border:1px solid rgba(255,255,255,.05);margin-bottom:12px;font-size:13px}

body.light-mode .sys-card{background:rgba(0,0,0,.03);border:1px solid rgba(0,0,0,.1)}

.btn-primary{width:100%;padding:12px;background:var(--accent);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold;transition:all .2s cubic-bezier(.175,.885,.32,1.275)}

.btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 10px rgba(0,0,0,.3);filter:brightness(1.1)}

.btn-primary:disabled{background:#555;cursor:not-allowed}

.btn-sec{width:100%;padding:12px;background:rgba(255,255,255,.1);color:inherit;border:1px solid rgba(255,255,255,.2);border-radius:8px;margin-bottom:10px;cursor:pointer;transition:.2s}

.btn-sec:hover{background:rgba(255,255,255,.2)}

.btn-sec:disabled{opacity:.5;cursor:not-allowed}

.btn-danger{width:100%;padding:12px;background:rgba(255,77,77,.8);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold}

#gemi-screensaver{position:absolute;top:0;left:0;width:100vw;height:100vh;background:#000;z-index:9999998;opacity:0;pointer-events:none;transition:opacity 1s ease}

.io-indicator{position:absolute;bottom:18px;right:75px;font-size:18px;opacity:.2;transition:opacity .2s ease;z-index:999999}

.io-indicator.active{opacity:1;animation:blink .2s infinite;color:var(--accent)}

.gemi-notif{background:rgba(20,30,40,.85);backdrop-filter:blur(25px) saturate(200%);border:1px solid var(--accent);border-radius:12px;padding:15px 20px;box-shadow:0 15px 35px rgba(0,0,0,.5);display:flex;align-items:center;gap:15px;transform:translateX(120%);transition:transform .4s cubic-bezier(.175,.885,.32,1.275),opacity .4s ease;opacity:0;color:#fff;width:320px;pointer-events:auto}

body.light-mode .gemi-notif{background:rgba(255,255,255,.95);border:1px solid var(--accent);color:#000;box-shadow:0 15px 35px rgba(0,0,0,.1)}

#notif-container{position:absolute;top:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none}

</style>

</head>

<body>

<script>

/*=====================================================================

   GemiOS – all modules are defined inside this IIFE to avoid globals

=====================================================================*/

(() => {

  /*-------------------------  Event Bus  ---------------------------*/

  class EventBus {

    constructor() { this.handlers = new Map(); }

    on(ev, fn) {

      if (!this.handlers.has(ev)) this.handlers.set(ev, []);

      this.handlers.get(ev).push(fn);

    }

    off(ev, fn) {

      const arr = this.handlers.get(ev);

      if (!arr) return;

      this.handlers.set(ev, arr.filter(f => f !== fn));

    }

    emit(ev, data) {

      const arr = this.handlers.get(ev);

      if (!arr) return;

      arr.forEach(fn => fn(data));

    }

  }



  /*--------------------------  VFS (IndexedDB)  ---------------------*/

  class VFS {

    constructor(bus) {

      this.bus = bus;

      this.MAX_STORAGE = 10 * 1024 * 1024; // 10 MiB

      this.DB_NAME = 'GemiOS_Fs';

      this.STORE = 'nodes';

      this.db = null;

    }



    async _open() {

      if (this.db) return this.db;

      return new Promise((res, rej) => {

        const req = indexedDB.open(this.DB_NAME, 1);

        req.onupgradeneeded = ev => {

          const db = ev.target.result;

          db.createObjectStore(this.STORE, { keyPath: 'path' });

        };

        req.onsuccess = ev => {

          this.db = ev.target.result;

          res(this.db);

        };

        req.onerror = ev => rej(ev.target.error);

      });

    }



    async _store(mode = 'readonly') {

      const db = await this._open();

      return db.transaction(this.STORE, mode).objectStore(this.STORE);

    }



    async ensureRoot() {

      const store = await this._store('readwrite');

      const rec = await store.get('root');

      if (!rec) {

        await store.add({ path: 'root', data: this._defaultTree() });

      }

    }



    _defaultTree() {

      return {

        "C:": {

          System: {

            "boot.log": "GemiOS V48.0 Initialized.",

            "sys_mail.json": "[]"

          },

          Users: {

            Admin: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} },

            Guest: { Desktop: {}, Documents: {}, Pictures: {}, Downloads: {} }

          }

        }

      };

    }



    async getNode(path) {

      const store = await this._store();

      const rec = await store.get(path);

      return rec?.data ?? null;

    }



    async saveNode(path, data) {

      const size = new TextEncoder().encode(JSON.stringify(data)).length;

      const usage = await this.getUsage();

      if (usage.used + size > this.MAX_STORAGE) {

        this.bus.emit('notify', {title:'Disk Full!',msg:'NVRAM quota exceeded.',success:false});

        return false;

      }

      const store = await this._store('readwrite');

      await store.put({ path, data });

      this.bus.emit('vfs:changed');

      return true;

    }



    async getUsage() {

      const store = await this._store();

      const all = await store.getAll();

      const used = all.reduce((t, r) => t + new TextEncoder().encode(JSON.stringify(r.data)).length, 0);

      return { used, max: this.MAX_STORAGE };

    }



    /* ----- helpers for files/folders ----- */

    async getDir(dirPath, create = false) {

      const node = await this.getNode(dirPath);

      if (node && typeof node === 'object') return node;

      if (!node && create) {

        await this.saveNode(dirPath, {});

        return {};

      }

      return null;

    }



    async read(dirPath, file) {

      const dir = await this.getDir(dirPath);

      return dir?.[file] ?? null;

    }



    async write(dirPath, file, data) {

      const dir = await this.getDir(dirPath, true);

      const backup = dir[file];

      dir[file] = data;

      const ok = await this.saveNode(dirPath, dir);

      if (!ok) {

        if (backup) dir[file] = backup; else delete dir[file];

      }

      return ok;

    }



    async mkdir(dirPath, name) {

      const dir = await this.getDir(dirPath);

      if (!dir || dir[name]) return false;

      dir[name] = {};

      return await this.saveNode(dirPath, dir);

    }



    async delete(dirPath, file) {

      const dir = await this.getDir(dirPath);

      if (!dir || !(file in dir)) return false;

      delete dir[file];

      return await this.saveNode(dirPath, dir);

    }



    async format() {

      const db = await this._open();

      db.close();

      indexedDB.deleteDatabase(this.DB_NAME);

      location.reload();

    }

  }



  /*-------------------------- Sanitizer ---------------------------*/

  class Sanitizer {

    static sanitizeHTML(raw) {

      return DOMPurify.sanitize(raw, {

        ALLOWED_TAGS: ['div','span','button','input','textarea','canvas','img','video','audio','style','b','i','u','br'],

        ALLOWED_ATTR: ['class','id','style','src','href','type','value','placeholder','data-*','title'],

        FORBID_ATTR: ['onerror','onload','onclick','onfocus']

      });

    }



    static isSafeCartridge(json) {

      const dangerous = ['localStorage.clear','VFS.format','VFS.delete','GemiOS.wallet','eval','new Function'];

      const txt = JSON.stringify(json);

      return !dangerous.some(s => txt.includes(s));

    }

  }



  /*-------------------------- Registry ---------------------------*/

  class Registry {

    static apps = new Map();



    static async load(bus, vfs) {

      /* ---- Core apps ---------------------------------------------------- */

      const core = {

        sys_term: {

          id: 'sys_term',

          title: 'Bash Terminal',

          icon: '⌨️',

          price: 0,

          width: 500,

          html: (pid) => `

            <div id="t-out-${pid}" style="flex-grow:1;background:#0a0a0a;color:#38ef7d;padding:10px;font-family:monospace;overflow-y:auto;border-radius:6px;">

              GemiOS Shell Active. Type 'help' to see commands.

            </div>

            <div style="display:flex;background:#111;padding:8px;border-radius:6px;margin-top:5px;">

              <span id="t-path-${pid}" style="color:#0078d7;margin-right:8px;font-weight:bold;">

                C:/Users/${GemiOS.user}>

              </span>

              <input type="text" id="t-in-${pid}"

                style="flex-grow:1;background:transparent;color:#38ef7d;border:none;outline:none;font-family:monospace;font-size:14px;"

                onkeydown="GemiOS.handleTerm(event,${pid},this)">

            </div>`,

          onLaunch: (pid) => {

            GemiOS.termStates[pid] = 'C:/Users/' + GemiOS.user;

            setTimeout(() => document.getElementById('t-in-'+pid).focus(),100);

          }

        },

        sys_drive: {

          id: 'sys_drive',

          title: 'Explorer 2.0',

          icon: '🗂️',

          price: 0,

          width: 520,

          html: (pid) => `

            <div class="sys-card" style="display:flex;gap:10px;align-items:center;background:rgba(0,120,215,0.2);">

              <button onclick="GemiOS.navDrive(${pid},'UP')" class="btn-sec" style="margin:0;padding:5px 10px;">⬆️ Up</button>

              <input type="text" id="d-path-${pid}" value="C:/" disabled

                style="flex-grow:1;background:transparent;color:inherit;border:none;font-weight:bold;font-size:14px;">

            </div>

            <div id="d-list-${pid}" style="flex-grow:1;min-height:200px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px;"></div>

            <div style="margin-top:10px;padding:5px;background:rgba(0,0,0,0.3);border-radius:4px;">

              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">

                <span id="d-bar-text-${pid}">Calculating NVRAM...</span><span>10MB MAX</span>

              </div>

              <div style="height:6px;background:#222;border-radius:3px;overflow:hidden;">

                <div id="d-bar-${pid}" style="height:100%;background:var(--accent);width:0%;transition:width .3s ease;"></div>

              </div>

            </div>`,

          onLaunch: (pid) => {

            GemiOS.driveStates[pid] = 'C:/Users/' + GemiOS.user;

            GemiOS.renderDrive(pid);

            GemiOS.driveItvs = GemiOS.driveItvs || {};

            GemiOS.driveItvs[pid] = setInterval(async () => {

              const usage = await GemiOS.VFS.getUsage();

              const pct = Math.max((usage.used / usage.max) * 100, 0.5);

              const bar = document.getElementById(`d-bar-${pid}`);

              const txt = document.getElementById(`d-bar-text-${pid}`);

              if (bar) {

                bar.style.width = Math.min(pct, 100) + '%';

                bar.style.background = pct > 90 ? '#ff4d4d' : 'var(--accent)';

              }

              if (txt) txt.innerText = `${(usage.used / 1024).toFixed(2)} KB Used`;

            }, 500);

          },

          onKill: (pid) => {

            if (GemiOS.driveItvs && GemiOS.driveItvs[pid]) clearInterval(GemiOS.driveItvs[pid]);

          }

        },

        sys_set: {

          id: 'sys_set',

          title: 'System Settings',

          icon: '⚙️',

          price: 0,

          width: 420,

          html: () => `

            <div class="sys-card"><b style="font-size:14px;">Wallpaper Engine</b><br>

              <input type="text" id="wp-in" placeholder="Image URL..."

                style="width:100%;margin:8px 0;padding:8px;border-radius:4px;border:none;outline:none;background:rgba(255,255,255,.9);color:black;">

              <button onclick="localStorage.setItem('GemiOS_Wall',document.getElementById('wp-in').value);location.reload();" class="btn-primary">Apply Wallpaper</button>

            </div>

            <div class="sys-card"><b style="font-size:14px;">Accent Color</b><br>

              <div style="display:flex;gap:10px;margin-top:10px;">

                <div onclick="localStorage.setItem('GemiOS_Accent','#0078d7');location.reload();" style="width:30px;height:30px;border-radius:50%;background:#0078d7;cursor:pointer;"></div>

                <div onclick="localStorage.setItem('GemiOS_Accent','#ff00cc');location.reload();" style="width:30px;height:30px;border-radius:50%;background:#ff00cc;cursor:pointer;"></div>

                <div onclick="localStorage.setItem('GemiOS_Accent','#38ef7d');location.reload();" style="width:30px;height:30px;border-radius:50%;background:#38ef7d;cursor:pointer;"></div>

                <div onclick="localStorage.setItem('GemiOS_Accent','#ff4d4d');location.reload();" style="width:30px;height:30px;border-radius:50%;background:#ff4d4d;cursor:pointer;"></div>

                <div onclick="localStorage.setItem('GemiOS_Accent','#ffb400');location.reload();" style="width:30px;height:30px;border-radius:50%;background:#ffb400;cursor:pointer;"></div>

              </div>

            </div>

            <div class="sys-card" style="border-left:4px solid var(--accent);"><b style="font-size:14px;">GemiSync (Export OS)</b><br>

              <button onclick="GemiOS.exportNVRAM()" class="btn-primary" style="margin-top:5px;">Export .gemos Backup</button>

            </div>

            <button onclick="alert('Please restart and use F2 BIOS menu for Secure Erase.')" class="btn-danger">Format System (Moved to BIOS)</button>`

        }

        // you can add more core apps (store, log, update, etc.) here

      };

      for (const k in core) this.apps.set(core[k].id, core[k]);



      /* ---- Custom cartridges (local) ---- */

      const customStr = localStorage.getItem('GemiOS_CustomApps');

      if (customStr) {

        try {

          const custom = JSON.parse(customStr);

          Object.values(custom).forEach(app => this.apps.set(app.id, app));

        } catch (_) {}

      }



      /* ---- Global network apps ---- */

      const netStr = localStorage.getItem('GemiOS_GlobalNetwork');

      if (netStr) {

        try {

          const net = JSON.parse(netStr);

          net.forEach(app => this.apps.set(app.id, app));

        } catch (_) {}

      }



      bus.emit('registry:ready');

    }



    static get(id) { return this.apps.get(id); }

  }



  /*-------------------------- Audio Engine ---------------------------*/

  class AudioEngine {

    constructor(bus) {

      this.bus = bus;

      this.actx = null;

      this.sounds = {

        open: (t)=> this._tone(440,880,t),

        close: (t)=> this._tone(880,440,t),

        click: (t)=> this._tone(1000,1000,t,0.05,0.05),

        success: (t)=> this._chord([523.25,659.25,783.99],t),

        error: (t)=> this._tone(150,150,t,0.1,0.3),

        buy: (t)=> this._square(600,t),

        alert: (t)=> this._tone(800,1000,t,0.1,0.4),

        shutdown: (t)=> this._tone(300,100,t,0.15,0.8)

      };

    }



    _init() {

      if (!this.actx) this.actx = new (window.AudioContext||window.webkitAudioContext)();

      if (this.actx.state === 'suspended') this.actx.resume();

    }



    _tone(start,end,base,gStart=0.1,gEnd=0){

      this._init(); const t=this.actx.currentTime;

      const osc=this.actx.createOscillator(); const gain=this.actx.createGain();

      osc.type='sine'; osc.frequency.setValueAtTime(start,t);

      osc.frequency.exponentialRampToValueAtTime(end,t+0.2);

      gain.gain.setValueAtTime(gStart,t); gain.gain.exponentialRampToValueAtTime(gEnd+0.0001,t+0.3);

      osc.connect(gain); gain.connect(this.actx.destination);

      osc.start(t); osc.stop(t+0.3);

    }



    _square(freq,base){

      this._init(); const t=this.actx.currentTime;

      const osc=this.actx.createOscillator(); const gain=this.actx.createGain();

      osc.type='square'; osc.frequency.setValueAtTime(freq,t);

      gain.gain.setValueAtTime(0.05,t); gain.gain.exponentialRampToValueAtTime(0.0001,t+0.2);

      osc.connect(gain); gain.connect(this.actx.destination);

      osc.start(t); osc.stop(t+0.2);

    }



    _chord(freqs,base){

      this._init(); const t=this.actx.currentTime;

      freqs.forEach((f,i)=>{

        const osc=this.actx.createOscillator(); const gain=this.actx.createGain();

        osc.type='sine'; osc.frequency.setValueAtTime(f,t+i*0.1);

        gain.gain.setValueAtTime(0,t+i*0.1);

        gain.gain.linearRampToValueAtTime(0.2,t+i*0.1+0.5);

        gain.gain.exponentialRampToValueAtTime(0.0001,t+i*0.1+3);

        osc.connect(gain); gain.connect(this.actx.destination);

        osc.start(t+i*0.1); osc.stop(t+i*0.1+3);

      });

    }



    play(name){ if (localStorage.getItem('GemiOS_Driver_Audio')==='false') return; const fn=this.sounds[name]; if (fn) fn();}

  }



  /*-------------------------- Network ---------------------------*/

  class Network {

    constructor(bus) {

      this.bus = bus;

      this.currentVersion = localStorage.getItem('GemiOS_Cache_Ver') || 'v48.0.0-QUALITY';

    }



    async checkForUpdates() {

      try {

        const resp = await fetch('https://raw.githubusercontent.com/Usernameistakenandnotavaliable/GemiOS/main/version.json?t=' + Date.now());

        if (!resp.ok) return null;

        const data = await resp.json();

        return data.version;

      } catch (_) { return null; }

    }

  }



  /*-------------------------- Theme ---------------------------*/

  class Theme {

    constructor(bus){ this.bus=bus; }

    async applyFromStorage(){

      const accent = localStorage.getItem('GemiOS_Accent')||'#0078d7';

      document.documentElement.style.setProperty('--accent',accent);

      const theme = localStorage.getItem('GemiOS_Theme')||'dark';

      document.documentElement.dataset.theme = theme;

    }

    setAccent(hex){ localStorage.setItem('GemiOS_Accent',hex); document.documentElement.style.setProperty('--accent',hex); this.bus.emit('theme:changed',hex); }

    toggleTheme(){ const cur = document.documentElement.dataset.theme==='light'?'dark':'light'; localStorage.setItem('GemiOS_Theme',cur); document.documentElement.dataset.theme=cur; this.bus.emit('theme:toggled',cur); }

  }



  /*-------------------------- Process Manager ---------------------------*/

  class ProcessManager {

    constructor(bus, vfs, audio){

      this.bus=bus; this.vfs=vfs; this.audio=audio;

      this.nextPid=1000; this.processes=new Map();

      this.bus.on('process:kill', pid=>this.kill(pid));

    }

    async launch(appId,fileData=null){

      const app = Registry.get(appId);

      if (!app){ this.bus.emit('notify',{title:'Execution Error',msg:`App ${appId} not found.`,success:false}); return; }

      const pid = ++this.nextPid;

      this.processes.set(pid,{app,pid});

      this.audio.play('click');

      this.bus.emit('wm:create-window',{pid,app,fileData});

      if (app.onLaunch) app.onLaunch(pid);

    }

    async kill(pid){

      if (!this.processes.has(pid)) return;

      this.bus.emit('wm:close-window',pid);

      setTimeout(()=>{ this.processes.delete(pid); },250);

    }

  }



  /*-------------------------- Window Manager ---------------------------*/

  class WindowManager {

    constructor(bus, audio){

      this.bus = bus; this.audio = audio;

      this.zIndex = 100;

      this.windows = new Map(); // pid → element

      this.enableAnim = localStorage.getItem('GemiOS_Driver_Anim') !== 'false';



      // listen to bus events

      this.bus.on('wm:create-window', cfg => this._createWindow(cfg));

      this.bus.on('wm:close-window', pid => this._closeWindow(pid));

    }



    _createWindow({pid, app, fileData}) {

      const wid = `win_${pid}`;

      const rawHTML = typeof app.html === 'function' ? app.html(pid, fileData) : app.htmlString;

      const safeHTML = Sanitizer.sanitizeHTML(rawHTML);

      const html = `

        <div class="win ${this.enableAnim ? 'win-animated' : 'win-static'}" id="${wid}"

              data-maximized="false"

              style="top:${Math.random()*40+60}px; left:${Math.random()*60+120}px; width:${app.width}px; z-index:${++this.zIndex};"

              onmousedown="GemiOS.WM.focus('${wid}')">

          <div class="title-bar" ondblclick="GemiOS.WM.maximize('${wid}')" onmousedown="GemiOS.WM.drag(event,'${wid}')">

            <span>${app.title}</span>

            <div>

              <button class="ctrl-btn min-btn" title="Minimize" onclick="GemiOS.WM.minimize('${wid}')">-</button>

              <button class="ctrl-btn snap-btn" title="Snap left" onclick="GemiOS.WM.snap('${wid}','left')">&lt;</button>

              <button class="ctrl-btn snap-btn" title="Snap right" onclick="GemiOS.WM.snap('${wid}','right')">&gt;</button>

              <button class="ctrl-btn close-btn" title="Close" onclick="GemiOS.PM.kill(${pid})">×</button>

            </div>

          </div>

          <div class="content">

            <iframe sandbox="allow-scripts allow-same-origin" srcdoc="${safeHTML.replace(/"/g,'&quot;')}"

                    style="width:100%;height:100%;border:none;"></iframe>

          </div>

          <div class="resize-handle"></div>

        </div>`;

      document.getElementById('window-layer').insertAdjacentHTML('beforeend', html);

      const winEl = document.getElementById(wid);

      this.windows.set(pid, winEl);

      this._addTaskbarItem(pid, app.title);

      this.audio.play('open');

    }



    focus(wid){

      const el = document.getElementById(wid);

      if (el) el.style.zIndex = ++this.zIndex;

    }



    drag(e,wid){

      const win = document.getElementById(wid);

      if (!win || win.dataset.maximized==='true') return;

      const offsetX = e.clientX - win.offsetLeft;

      const offsetY = e.clientY - win.offsetTop;

      this.focus(wid);

      if (this.enableAnim) win.style.transition='none';

      const move = ev => {

        win.style.left = ev.clientX - offsetX + 'px';

        win.style.top = Math.max(0, ev.clientY - offsetY) + 'px';

      };

      const up = () => {

        document.removeEventListener('mousemove',move);

        document.removeEventListener('mouseup',up);

        if (this.enableAnim) win.style.transition='';

      };

      document.addEventListener('mousemove',move);

      document.addEventListener('mouseup',up);

    }



    maximize(wid){

      const win = document.getElementById(wid);

      if (!win) return;

      if (win.dataset.maximized==='true'){

        win.style.top   = win.dataset.pT;

        win.style.left  = win.dataset.pL;

        win.style.width = win.dataset.pW;

        win.style.height= win.dataset.pH;

        win.dataset.maximized='false';

        win.style.borderRadius='12px';

      } else {

        win.dataset.pT = win.style.top;

        win.dataset.pL = win.style.left;

        win.dataset.pW = win.style.width;

        win.dataset.pH = win.style.height;

        win.style.top = '0';

        win.style.left = '0';

        win.style.width = '100vw';

        win.style.height = 'calc(100vh - 60px)';

        win.dataset.maximized='true';

        win.style.borderRadius='0';

      }

    }



    snap(wid, side){

      const win = document.getElementById(wid);

      if (!win) return;

      win.style.top = '0';

      win.style.height = 'calc(100vh - 60px)';

      win.style.width = '50vw';

      win.style.left = side==='left' ? '0' : '50vw';

      win.dataset.maximized='true';

      this.focus(wid);

    }



    minimize(wid){

      const win = document.getElementById(wid);

      if (!win) return;

      const tb = document.getElementById('tb-item-'+win.id.split('_')[1]);

      const hidden = win.style.opacity === '0';

      if (hidden){

        win.style.opacity='1';

        win.style.transform='scale(1) translateY(0)';

        win.style.pointerEvents='auto';

        tb.classList.add('active');

      } else {

        win.style.opacity='0';

        win.style.transform='scale(0.9) translateY(20px)';

        win.style.pointerEvents='none';

        tb.classList.remove('active');

      }

    }



    _addTaskbarItem(pid,title){

      const apps = document.getElementById('taskbar-apps');

      const itm = document.createElement('div');

      itm.id = `tb-item-${pid}`;

      itm.className = 'tb-item active';

      itm.textContent = title.length>12? title.slice(0,12) : title;

      itm.onclick = () => this.minimize(`win_${pid}`);

      apps.appendChild(itm);

    }



    _closeWindow(pid){

      const win = document.getElementById(`win_${pid}`);

      if (win){

        win.style.opacity = '0';

        win.style.transform = 'scale(0.9)';

        setTimeout(() => {

          win.remove();

          const tb = document.getElementById(`tb-item-${pid}`);

          if (tb) tb.remove();

          this.audio.play('close');

        }, 200);

      }

    }



    /*------------------- Screensaver (quick‑n‑dirty) -------------------*/

    showScreensaver(){

      let ss = document.getElementById('gemi-screensaver');

      if (!ss){

        ss = document.createElement('canvas');

        ss.id = 'gemi-screensaver';

        ss.style.cssText = 'position:absolute;top:0;left:0;width:100vw;height:100vh;background:black;z-index:999999;opacity:0;pointer-events:none;transition:opacity 1s ease';

        document.body.appendChild(ss);

        const ctx = ss.getContext('2d');

        const stars = [];

        for(let i=0;i<200;i++) stars.push({x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, s:Math.random()*2});

        setInterval(()=> {

          if (ss.style.opacity==='1'){

            if (ss.width!==window.innerWidth){ ss.width=window.innerWidth; ss.height=window.innerHeight; }

            ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(0,0,ss.width,ss.height);

            ctx.fillStyle='white';

            stars.forEach(st=>{ ctx.beginPath(); ctx.arc(st.x,st.y,st.s,0,Math.PI*2); ctx.fill(); st.x-=st.s; if(st.x<0){ st.x=ss.width; st.y=Math.random()*ss.height; } });

          }

        },30);

      }

      ss.style.opacity='1'; ss.style.pointerEvents='auto';

    }



    hideScreensaver(){

      const ss = document.getElementById('gemi-screensaver');

      if (ss){ ss.style.opacity='0'; ss.style.pointerEvents='none'; }

    }

  }



  /*-------------------------- Core (Main) ---------------------------*/

  class Core {

    constructor(){

      this.bus   = new EventBus();

      this.VFS   = new VFS(this.bus);

      this.audio = new AudioEngine(this.bus);

      this.net   = new Network(this.bus);

      this.theme = new Theme(this.bus);

      this.pm    = new ProcessManager(this.bus, this.VFS, this.audio);

      this.wm    = new WindowManager(this.bus, this.audio);

      this.user  = 'Admin';

      this.edition = localStorage.getItem('GemiOS_Edition') || null;

      this.wallet = parseInt(localStorage.getItem('GemiOS_Wallet')) || 500;

      this.termStates = {};

      this.driveStates = {};

      this.idleTime = 0;

      this.notifications = [];



      // expose globally – the rest of the code and the HTML callbacks use it

      window.GemiOS = this;

    }



    async init(){

      await this.VFS.ensureRoot();

      await this.theme.applyFromStorage();

      await Registry.load(this.bus, this.VFS);

      this._setupIdleTimer();

      this._buildUI();

      this._startOTADaemon();

      this._startEconomyDaemon();

    }



    /*------------------- idle & screensaver ----------------------*/

    _setupIdleTimer(){

      const reset = () => this.idleTime = 0;

      document.onmousemove = document.onkeydown = document.onclick = reset;

      setInterval(()=> {

        this.idleTime++;

        if (this.idleTime >= 60) this.wm.showScreensaver();

      },1000);

    }



    /*------------------- OTA daemon -----------------------------*/

    _startOTADaemon(){

      if (localStorage.getItem('GemiOS_Driver_Net')==='false') return;

      setInterval(async ()=>{

        const newVer = await this.net.checkForUpdates();

        if (newVer && newVer!==this.net.currentVersion){

          this.notify('🚀 Update Detected!','Version '+newVer+' found. Launching Updater…',true);

          setTimeout(()=>this.pm.launch('sys_update'),2000);

        }

      },10000);

    }



    /*------------------- Economy daemon --------------------------*/

    _startEconomyDaemon(){

      setInterval(()=>{

        const customStr = localStorage.getItem('GemiOS_CustomApps') || '{}';

        const custom = JSON.parse(customStr);

        const keys = Object.keys(custom);

        if (keys.length && Math.random()<0.4){

          const app = custom[keys[Math.floor(Math.random()*keys.length)]];

          const price = Number(app.price)||0;

          if (price>0){

            const profit = Math.floor(price*0.9);

            this.wallet+=profit; this._saveWallet();

            this.notify('App Sale! 💸',`Someone bought ${app.title}. +🪙${profit}`,true);

            this.audio.play('buy');

          }

        }

      },20000);

    }



    _saveWallet(){

      localStorage.setItem('GemiOS_Wallet',String(this.wallet));

      this.bus.emit('wallet:update',this.wallet);

    }



    /*------------------- notifications ---------------------------*/

    notify(title,msg,success=true){

      this.bus.emit('notify',{title,msg,success});

    }



    /*------------------- UI construction ------------------------*/

    _buildUI(){

      const root = document.createElement('div');

      root.id='os-root';

      root.style.cssText='width:100vw;height:100vh;position:absolute;top:0;left:0';

      root.innerHTML = `

        <div id="desktop-bg"></div>



        <!-- Sticky note widget -->

        <div id="widget-notes">

          <div style="font-weight:bold;margin-bottom:5px;">📌 Sticky Note</div>

          <textarea id="sticky-text" placeholder="Jot a quick note..." style="width:100%;height:100%;border:none;background:transparent;color:#333;"></textarea>

        </div>



        <div id="desktop-icons"></div>

        <div id="window-layer"></div>



        <!-- Start menu -->

        <div id="start-menu">

          <div class="start-header">

            <div style="font-size:35px;background:rgba(255,255,255,0.1);border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;margin-right:10px;">

              ${this.user==='Admin'?'👑':'👤'}

            </div>

            <div>

              <div style="font-size:20px;font-weight:600;">${this.user}</div>

              <div style="font-size:12px;opacity:0.7;">GemiOS 48.0 / <span style="color:var(--accent)">${(this.edition||'HOME').toUpperCase()}</span></div>

            </div>

          </div>

          <input type="text" placeholder="🔍 Search…" oninput="GemiOS.runSearch(this.value)" style="width:100%;padding:8px;margin:10px 0;border:none;background:rgba(0,0,0,0.3);color:#fff;">

          <div id="start-menu-items">

            <div class="start-cat">System</div>

            <div class="start-item" onclick="GemiOS.pm.launch('sys_term')"><span>⌨️</span> Terminal</div>

            <div class="start-item" onclick="GemiOS.pm.launch('sys_drive')"><span>🗂️</span> Explorer</div>

            <div class="start-item" onclick="GemiOS.pm.launch('sys_set')"><span>⚙️</span> Settings</div>

            <div class="start-item" onclick="GemiOS.pm.launch('sys_store')"><span>🛍️</span> Store</div>

            <div class="start-item" onclick="GemiOS.pm.launch('sys_update')"><span>☁️</span> Updater</div>

          </div>

        </div>



        <!-- Taskbar -->

        <div id="taskbar-container">

          <div id="taskbar">

            <div class="start" onclick="document.getElementById('start-menu').classList.toggle('open')">G</div>



            <div style="display:flex;gap:8px;margin-left:15px;padding-right:15px;border-right:1px solid rgba(255,255,255,0.1);">

              <div class="ql-icon" onclick="GemiOS.pm.launch('sys_drive')" title="Explorer">🗂️</div>

              <div class="ql-icon" onclick="GemiOS.pm.launch('sys_store')" title="Store">🛍️</div>

              <div class="ql-icon" onclick="GemiOS.pm.launch('sys_term')" title="Terminal">⌨️</div>

            </div>



            <div id="taskbar-apps"></div>



            <div style="display:flex;align-items:center;gap:15px;margin-left:auto;padding-left:15px;border-left:1px solid rgba(255,255,255,0.1);">

              <div id="os-wallet-display" style="font-weight:bold;background:rgba(0,0,0,0.3);padding:4px 8px;border-radius:4px;">🪙 ${this.wallet}</div>

              <div onclick="GemiOS.toggleTheme()" style="cursor:pointer;font-size:20px;">🌓</div>

              <div id="clock" style="font-weight:600;font-size:14px;letter-spacing:1px;">--:--</div>

              <div onclick="GemiOS.lockSystem()" style="cursor:pointer;font-size:18px;color:#ff4d4d;">⏻</div>

            </div>

          </div>

        </div>



        <!-- Notification container -->

        <div id="notif-container"></div>



        <!-- I/O indicator -->

        <div id="io-indicator" class="io-indicator">💾</div>

      `;

      document.body.innerHTML = '';

      document.body.appendChild(root);



      // sticky‑note persistence

      const sticky = document.getElementById('sticky-text');

      sticky.value = localStorage.getItem('GemiOS_Sticky') || '';

      sticky.oninput = () => localStorage.setItem('GemiOS_Sticky', sticky.value);



      // clock

      setInterval(()=>{ document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); },1000);



      // notification handling (via bus)

      this.bus.on('notify', ({title,msg,success})=>{

        const container = document.getElementById('notif-container');

        const note = document.createElement('div');

        note.className='gemi-notif';

        note.innerHTML = `<div style="font-size:20px;">${success?'✅':'🔔'}</div>

                          <div><div style="font-weight:bold;">${title}</div><div style="font-size:12px;">${msg}</div></div>`;

        container.appendChild(note);

        void note.offsetWidth;

        note.style.transform='translateX(0)'; note.style.opacity='1';

        setTimeout(()=>{ note.style.transform='translateX(120%)'; note.style.opacity='0'; setTimeout(()=>note.remove(),300); },3500);

        this.audio.play(success?'success':'alert');

      });



      // render desktop icons (basic demo – just a few core apps)

      this._renderDesktopIcons();

    }



    /*------------------- Desktop icons --------------------------*/

    async _renderDesktopIcons(){

      const desk = document.getElementById('desktop-icons');

      desk.innerHTML = '';

      const apps = [

        {file:'Terminal.app', icon:'⌨️', id:'sys_term'},

        {file:'Explorer.app', icon:'🗂️', id:'sys_drive'},

        {file:'Settings.app', icon:'⚙️', id:'sys_set'},

        {file:'Store.app', icon:'🛍️', id:'sys_store'}

      ];

      let i=0;

      apps.forEach(app=>{

        const top = 20 + Math.floor(i/10)*100;

        const left = 20 + (i%10)*90;

        const el = document.createElement('div');

        el.className='icon';

        el.style.top=top+'px'; el.style.left=left+'px';

        el.innerHTML = `<div>${app.icon}</div>${app.file.replace('.app','')}`;

        el.onmousedown = e=>GemiOS.dragIcon(e, 'icon'+i, app.file);

        el.ondblclick = ()=> GemiOS.pm.launch(app.id);

        desk.appendChild(el);

        i++;

      });

    }



    /* drag icon on desktop (simple) */

    dragIcon(e,id,filename){

      const el = document.getElementById(id);

      const ox = e.clientX - el.offsetLeft;

      const oy = e.clientY - el.offsetTop;

      document.onmousemove = ev=>{ el.style.left = ev.clientX-ox+'px'; el.style.top = Math.max(0,ev.clientY-oy)+'px'; };

      document.onmouseup = ()=>{ document.onmousemove=null; document.onmouseup=null; };

    }



    /*------------------- Helper UI functions -------------------*/

    runSearch(q){

      const items = document.querySelectorAll('.start-item');

      const cats  = document.querySelectorAll('.start-cat');

      if (!q){ items.forEach(i=>i.style.display='flex'); cats.forEach(c=>c.style.display='block'); return; }

      const low = q.toLowerCase();

      items.forEach(i=> i.style.display = i.textContent.toLowerCase().includes(low) ? 'flex' : 'none');

      cats.forEach(c=>c.style.display='none');

    }



    handleTerm(e,pid,inEl){

      if(e.key!=='Enter') return;

      const cmd = inEl.value.trim(); inEl.value='';

      const out = document.getElementById(`t-out-${pid}`);

      const curr = this.termStates[pid];

      out.innerHTML += `<br><span style="color:#0078d7">${curr}></span> ${cmd}`;

      const args = cmd.split(' ');

      const base = args[0].toLowerCase();



      const log = (msg)=> out.innerHTML += `<br>${msg}`;

      const setPath = (p)=>{ this.termStates[pid]=p; document.getElementById(`t-path-${pid}`).innerText = p+'>'; };

      if(base==='help'){ log('Available: ls, cd, mkdir, clear'); }

      else if(base==='clear'){ out.innerHTML=''; }

      else if(base==='ls'){

        this.VFS.getDir(curr).then(dir=> {

          if(!dir) return log('Directory not found.');

          const keys = Object.keys(dir);

          if(!keys.length) return log('(empty)');

          keys.forEach(k=> log(`${typeof dir[k]==='object'?'[DIR]':'[FILE]'} ${k}`));

        });

      }

      else if(base==='cd'){

        const tgt = args[1];

        if(!tgt) return log('Usage: cd [dir]');

        if(tgt==='..'){

          const parts = curr.split('/');

          if(parts.length>1) parts.pop();

          setPath(parts.join('/')||'C:');

        } else {

          const np = curr+'/'+tgt;

          this.VFS.getDir(np).then(dir=> {

            if(dir) setPath(np); else log('Directory not found.');

          });

        }

      }

      else if(base==='mkdir'){

        const name = args[1];

        if(!name) return log('Usage: mkdir [name]');

        this.VFS.mkdir(curr, name).then(ok=> log(ok?'Folder created.':'Failed.'));

      }

      else log(`Unknown command: ${base}`);

    }



    toggleTheme(){ this.theme.toggleTheme(); }

    lockSystem(){

      this.audio.play('shutdown');

      const overlay = document.createElement('div');

      overlay.style.cssText='position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;';

      overlay.textContent='Shutting down…';

      document.body.appendChild(overlay);

      setTimeout(()=>location.reload(),2000);

    }

  }



  /*--------------------------- Launch OS --------------------------*/

  (async () => {

    const os = new Core();

    await os.init();

  })();



})(); // end IIFE

</script>

</body>

</html>
