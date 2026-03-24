# 🌌 GemiOS: The Browser-Native Hypervisor

![Version](https://img.shields.io/badge/version-46.0.0--BOUNTY-blue.svg)
![Environment](https://img.shields.io/badge/environment-Browser_Native-success.svg)
![Storage](https://img.shields.io/badge/storage-10MB_NVRAM-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**GemiOS** is not just a webpage. It is a fully functional, modular, simulated Operating System running entirely inside your browser's `localStorage`. 

Built with zero external dependencies, GemiOS features a complete Virtual File System, a draggable Window Manager, a dynamic App Registry, a simulated cryptocurrency economy, and an active heuristic Antivirus engine. It is a playground for JavaScript developers, cybersecurity enthusiasts, and retro-computing fans.

---

## ✨ Core Features

### 🖥️ The Operating Environment
* **Megatrends BIOS:** Press `[F2]` during the boot sequence to access a fully functional pre-boot setup utility. Manage hardware quotas, toggle Fast Boot, or initiate a Secure Erase.
* **Virtual File System (VFS):** A hierarchical directory structure (C:/Users/...) with a strict 10MB NVRAM quota.
* **Window Manager:** Draggable, resizable, snap-to-edge window mechanics with active Z-index focusing and taskbar minimization.
* **Haptic Audio Engine:** Synthesized Web Audio API sound profiles for system clicks, alerts, and cinematic boot/shutdown sweeps.

### 💸 The Virtual Economy
* **GemiCoin (🪙) Standard:** A fully integrated virtual economy. Users start with a 500 🪙 grant to purchase applications from the App Store.
* **GemiCrypt Exchange:** A simulated live market ticker. Buy and sell virtual shares in real-time to generate capital and fund your workspace.
* **GemiGov Relief:** Go bankrupt? The OS bootloader will automatically issue a 150 🪙 bailout check to keep you in the game.

### 🛡️ Cybersecurity & Zero-Trust
* **GemiDefender Ultimate:** An enterprise-grade Antivirus built into the OS.
* **Active Memory Scanning:** GemiDefender actively monitors `ProcessManager` to assassinate rogue processes and malware (like the infamous *CoinDrainer* trojan).
* **Heuristic Firewall:** Actively intercepts network downloads to scan HTML/JS payloads for malicious `localStorage.clear()` or `VFS.format` triggers.

### 🛠️ Community & Development
* **GemiDev Studio:** A native IDE. Write custom HTML/JS apps, set a price, and hit Publish.
* **The Global Network:** Upload your creations to the simulated WAN. Other users can buy your apps, and you receive 90% of the profits!
* **GemiShare Cartridges:** Compile your app into an encrypted Base64 string. Share the text string anywhere online, and other users can sideload it via the *GemiEmu Sandbox* or install it directly to their desktop.
* **White Hat Bug Bounty:** Write an app that utilizes OS security commands (`GemiOS.PM.kill`) and the Kernel will automatically award you a 500 🪙 bounty!

---

## 🚀 Quick Start

GemiOS requires no installation, no server hosting, and no databases.

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. Select your OS Edition:
   * **Home:** Standard access.
   * **Pro:** 5% permanent Store discount + GemiDev Studio pre-installed.
   * **Education:** 15% permanent discount on all Educational apps.

### 🛑 The Developer Reset (Hard Wipe)
If you ever brick your OS, accidentally format your NVRAM, or need to pull a fresh Cloud Update, execute a developer wipe:
1. Press `F12` to open Developer Tools.
2. Go to the **Console**.
3. Run: `localStorage.clear()`
4. Hard Refresh the page (`Ctrl + F5` or `Cmd + Shift + R`).

---

## 🧩 Architecture

GemiOS uses a decoupled, modular architecture to simulate Air-Gapped OTA updates.
* `index.html` - The Bootloader, POST screen, and BIOS.
* `kernel.js` - The Core OS logic (VFS, Process Manager, Window Manager, Audio Engine).
* `registry.js` - The App Store catalog. Separated from the Kernel so apps can be updated and injected dynamically without altering the core OS.
* `version.json` - The cloud manifest that triggers the Dual-OTA Updater.

---

## 📦 Sideloading your first Cartridge

Want to see GemiShare in action? Copy this Base64 Cartridge code, open the **GemiStore Mega**, click **📥 Redeem App Cartridge**, and paste it in!

*(Warning: This is the infamous EICAR-style Test Virus. GemiDefender will intercept it if you try to install it. Use the **GemiEmu Sandbox** app to run it safely!)*

```text
JTdCJTIydGl0bGUlMjIlM0ElMjJGcmVlJTIwR2VtaUNvaW5zJTIyJTJDJTIyaWNvbiUyMiUzQSUyMiVGMCU5RiU5MiVCMCUyMiUyQyUyMmRlc2MlMjIlM0ElMjJDb21tdW5pdHklMjBCdWlsdCUyMENhcnRyaWRnZSUyMiUyQyUyMmh0bWxTdHJpbmclMjIlM0ElMjIlM0NkaXYlMjBzdHlsZSUzRCd0ZXh0LWFsaWduJTNBY2VudGVyJTNCJTIwcGFkZGluZyUzQTMwcHglM0IlMjBkaXNwbGF5JTNBZmxleCUzQiUyMGZsZXgtZGlyZWN0aW9uJTNBY29sdW1uJTNCJTIwYWxpZ24taXRlbXMlM0FjZW50ZXIlM0InJTNFJTVDbiUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUzQ2gyJTIwc3R5bGUlM0QnY29sb3IlM0ElMjMzOGVmN2QlM0IlMjBtYXJnaW4tdG9wJTNBMCUzQiclM0VNaW5pbmclMjBHZW1pQ29pbnMuLi4lM0MlMkZoMiUzRSU1Q24lMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0NwJTIwaWQlM0Qndi1tc2cnJTIwc3R5bGUlM0QnZm9udC1mYW1pbHklM0Ftb25vc3BhY2UlM0IlMjBjb2xvciUzQSUyM2FhYSUzQiclM0VCeXBhc3NpbmclMjBmaXJld2FsbC4uLiUzQyUyRnAlM0UlNUNuJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTNDaW1nJTIwc3JjJTNEJ3gnJTIwb25lcnJvciUzRCU1QyUyMiU1Q24lMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjBzZXRUaW1lb3V0KCgpJTIwJTNEJTNFJTIwJTdCJTIwbGV0JTIwbSUyMCUzRCUyMGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2LW1zZycpJTNCJTIwaWYobSklMjAlN0IlMjBtLmlubmVyVGV4dCUyMCUzRCUyMCdFeHRyYWN0aW5nJTIwcGF5bG9hZC4uLiclM0IlMjBtLnN0eWxlLmNvbG9yJTIwJTNEJTIwJyUyM2ZmYjQwMCclM0IlMjAlN0QlMjAlN0QlMkMlMjAxNTAwKSUzQiUyMCU1Q24lMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjBzZXRUaW1lb3V0KCgpJTIwJTNEJTNFJTIwJTdCJTIwbGV0JTIwbSUyMCUzRCUyMGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2LW1zZycpJTNCJTIwaWYobSklMjAlN0IlMjBtLmlubmVyVGV4dCUyMCUzRCUyMCdXYWl0Li4uJTIwdGhpcyUyMGlzbiU1QyU1Qyd0JTIwcmlnaHQuLi4nJTNCJTIwbS5zdHlsZS5jb2xvciUyMCUzRCUyMCclMjNmZjRkNGQnJTNCJTIwJTdEJTIwJTdEJTJDJTIwMzAwMCklM0IlMjAlNUNuJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwc2V0VGltZW91dCgoKSUyMCUzRCUzRSUyMCU3QiUyMCU1Q24lMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjBpZih3aW5kb3cuR2VtaU9TKSUyMEdlbWlPUy5wbGF5U3lzU291bmQoJ2Vycm9yJyklM0IlMjAlNUNuJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwZG9jdW1lbnQuYm9keS5pbm5lckhUTUwlMjAlM0QlMjAnJTNDZGl2JTIwc3R5bGUlM0QlNUMlNUMncG9zaXRpb24lM0FmaXhlZCUzQiUyMHRvcCUzQTAlM0IlMjBsZWZ0JTNBMCUzQiUyMHdpZHRoJTNBMTAwdnclM0IlMjBoZWlnaHQlM0ExMDB2aCUzQiUyMGJhY2tncm91bmQlM0ElMjMwMDAwQUElM0IlMjBjb2xvciUzQSUyM0ZGRiUzQiUyMGZvbnQtZmFtaWx5JTNBbW9ub3NwYWNlJTNCJTIwcGFkZGluZyUzQTUwcHglM0IlMjB6LWluZGV4JTNBOTk5OTk5OTklM0IlNUMlNUMnJTNFJTNDaDElMjBzdHlsZSUzRCU1QyU1QydiYWNrZ3JvdW5kJTNBJTIzRkZGJTNCJTIwY29sb3IlM0ElMjMwMDAwQUElM0IlMjBkaXNwbGF5JTNBaW5saW5lLWJsb2NrJTNCJTIwcGFkZGluZyUzQTJweCUyMDEwcHglM0IlNUMlNUMnJTNFRkFUQUwlMjBFWENFUFRJT04lM0MlMkZoMSUzRSUzQ3AlMjBzdHlsZSUzRCU1QyU1Qydmb250LXNpemUlM0ExOHB4JTNCJTIwbWFyZ2luLXRvcCUzQTMwcHglM0IlNUMlNUMnJTNFQSUyMGZhdGFsJTIwZXhjZXB0aW9uJTIwMEUlMjBoYXMlMjBvY2N1cnJlZC4lM0MlMkZwJTNFJTNDcCUyMHN0eWxlJTNEJTVDJTVDJ2ZvbnQtc2l6ZSUzQTE4cHglM0IlNUMlNUMnJTNFKiUyMFRoZSUyME5WUkFNJTIwaXMlMjBjdXJyZW50bHklMjBiZWluZyUyMHB1cmdlZC4lM0MlMkZwJTNFJTNDcCUyMHN0eWxlJTNEJTVDJTVDJ2ZvbnQtc2l6ZSUzQTE4cHglM0IlMjBtYXJnaW4tdG9wJTNBMzBweCUzQiUyMGNvbG9yJTNBJTIzZmZiNDAwJTNCJTVDJTVDJyUzRVNheSUyMGdvb2RieWUlMjB0byUyMHlvdXIlMjBmaWxlcyElMjAlRjAlOUYlOTIlODAlM0MlMkZwJTNFJTNDcCUyMHN0eWxlJTNEJTVDJTVDJ2ZvbnQtc2l6ZSUzQTE4cHglM0IlMjBtYXJnaW4tdG9wJTNBMzBweCUzQiU1QyU1QyclMjBpZCUzRCU1QyU1QydkLXQlNUMlNUMnJTNFRm9ybWF0dGluZyUyMGluJTIwMy4uLiUzQyUyRnAlM0UlM0MlMkZkaXYlM0UnJTNCJTIwJTVDbiUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCU3RCUyQyUyMDQ1MDApJTNCJTIwJTVDbiUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMHNldFRpbWVvdXQoKCklMjAlM0QlM0UlMjAlN0IlMjBsZXQlMjB0JTIwJTNEJTIwZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2QtdCcpJTNCJTIwaWYodCklMjB0LmlubmVyVGV4dCUyMCUzRCUyMCdGb3JtYXR0aW5nJTIwaW4lMjAyLi4uJyUzQiUyMCU3RCUyQyUyMDU1MDApJTNCJTIwJTVDbiUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMHNldFRpbWVvdXQoKCklMjAlM0QlM0UlMjAlN0IlMjBsZXQlMjB0JTIwJTNEJTIwZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2QtdCcpJTNCJTIwaWYodCklMjB0LmlubmVyVGV4dCUyMCUzRCUyMCdGb3JtYXR0aW5nJTIwaW4lMjAxLi4uJyUzQiUyMCU3RCUyQyUyMDY1MDApJTNCJTIwJTVDbiUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMHNldFRpbWVvdXQoKCklMjAlM0QlM0UlMjAlN0IlMjBsb2NhbFN0b3JhZ2UuY2xlYXIoKSUzQiUyMGxvY2F0aW9uLnJlbG9hZCgpJTNCJTIwJTdEJTJDJTIwNzUwMCklM0IlNUNuJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTVDJTIyJTIwc3R5bGUlM0QnZGlzcGxheSUzQW5vbmUlM0InJTNFJTVDbiUyMCUyMCUyMCUyMCUzQyUyRmRpdiUzRSUyMiUyQyUyMmlzQ3VzdG9tJTIyJTNBdHJ1ZSUyQyUyMnByaWNlJTIyJTNBMCU3RA==
