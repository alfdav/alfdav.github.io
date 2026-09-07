# Mistakes

## JSON Resume schema kept “for later”
**What happened:** `resume.js` carried `selectedTemplate`, `headings`, `sections`, unused locations/GPA, and three certification shapes. Utils and tests grew to match data that this site never rendered.  
**Root cause:** Compatibility layer for a format we do not import.  
**Prevention:** Store only fields the UI reads. One awards list, one field name each.

## Empty data-URI favicon vs img-src 'self'
**What happened:** After dropping xterm, CSP was tightened to `img-src 'self'`. The existing `href="data:,"` favicon (used to mute 404s) then logged a CSP error in Chrome.  
**Root cause:** Policy and asset were not updated together.  
**Prevention:** If you keep a data favicon, allow `data:` on `img-src`, or drop the icon.

## xterm.js for a command menu
**What happened:** A CDN terminal emulator plus FitAddon, CSP `unsafe-inline`, and OSC-8 helpers existed to print colored help text. That also caused a black-on-black load failure when style-src blocked xterm CSS.  
**Root cause:** Emulator chosen for aesthetic, not capability.  
**Prevention:** `<pre>`/`<div>` + `<input>` + CSS unless we need real PTY/ANSI playback.
