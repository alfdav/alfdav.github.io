# Mistakes

## JSON Resume schema kept “for later”
**What happened:** `resume.js` carried `selectedTemplate`, `headings`, `sections`, unused locations/GPA, and three certification shapes. Utils and tests grew to match data that this site never rendered.  
**Root cause:** Compatibility layer for a format we do not import.  
**Prevention:** Store only fields the UI reads. One awards list, one field name each.

## xterm.js for a command menu
**What happened:** A CDN terminal emulator plus FitAddon, CSP `unsafe-inline`, and OSC-8 helpers existed to print colored help text. That also caused a black-on-black load failure when style-src blocked xterm CSS.  
**Root cause:** Emulator chosen for aesthetic, not capability.  
**Prevention:** `<pre>`/`<div>` + `<input>` + CSS unless we need real PTY/ANSI playback.
