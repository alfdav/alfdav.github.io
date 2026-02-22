# Terminal Portfolio Website

> A personal resume website that simulates a command-line terminal interface — an interactive, hacker-flavored way to explore professional information.

🔗 **Live site:** [alfdav.github.io](https://alfdav.github.io/)

---

## Project Overview

A static, frontend-only portfolio built to look and feel like a real terminal. Powered by [xterm.js](https://xtermjs.org/) with the FitAddon for dynamic, responsive sizing. All resume data is stored in `resume.js` and rendered on-demand through typed commands — no backend, no build step, no dependencies to install.

---

## Features

### Terminal Emulation
- Realistic terminal appearance with blinking cursor and command prompt (`visitor@portfolio:~$`)
- Built on **xterm.js** with **FitAddon** for full-window, responsive layout
- Handles window resize and mobile orientation change
- Clickjacking / iframe protection — breaks out of or destroys content when embedded in a frame

### Available Commands

| Command | Alias(es) | Description |
|---|---|---|
| `help` | `ls`, `dir` | List all available commands |
| `about` | | Display personal bio |
| `skills` | | List technical skills |
| `experience` | | Show work experience |
| `education` | | Display educational background |
| `projects` | | Browse projects |
| `certifications` | `certs` | View professional certifications |
| `verify <name>` | | Show detailed info & verification link for a certification |
| `contact` | | Get contact information |
| `clear` | | Clear the terminal |

> **Tip:** Type `certs` as a shortcut for `certifications`.

### Interactive Features

1. **Command History**
   - `↑` to navigate to previous commands
   - `↓` to navigate to newer commands
   - Preserves current input when starting history navigation
   - Returns to current input when reaching the end of history

2. **Tab Completion**
   - Press `Tab` to auto-complete commands
   - Shows all possible completions for partial matches
   - Case-insensitive completion

3. **Paste Sanitization**
   - `Ctrl+V` / `Cmd+V` paste is intercepted and sanitized
   - Strips C0/C1 control characters to prevent ANSI injection
   - Collapses multi-line pastes into a single-line command

4. **Easter Egg**
   - The Konami code is supported 🎮

---

## Technical Implementation

### File Structure

```
alfdav.github.io/
├── index.html               # Main HTML file — loads xterm.js and all scripts
├── styles.css               # Terminal styling
├── script.js                # Terminal logic, command handlers, key input
├── resume.js                # Resume data (JSON on window.resumeData)
├── resume-utils.js          # Data access helpers, sanitization, cert lookup
├── terminal-input-utils.js  # Input parsing, history, aliases, hyperlinks
└── tests/                   # Unit tests
```

### Technologies Used
- **HTML5** — structure
- **CSS3** — styling
- **JavaScript (ES6+)** — all interactivity, no frameworks
- **[xterm.js](https://xtermjs.org/)** — terminal emulation
- **xterm-addon-fit** — responsive terminal sizing

### Design Decisions
- Dark theme, white text (clean modern terminal look)
- Full-viewport terminal via FitAddon — no fixed dimensions
- Resume data is isolated in `resume.js` for easy updates
- Utility logic is split into `resume-utils.js` and `terminal-input-utils.js` for testability
- Easter egg education entry in `resume.js` is filtered out at render time by `resume-utils.js`

---

## Security

- **Static content only** — no backend, no server-side execution
- **Clickjacking protection** — detects iframe embedding and either breaks out or destroys page content
- **Paste sanitization** — strips control characters on clipboard paste to prevent ANSI escape injection
- **No data persistence** — nothing is written to localStorage or cookies
- **No sensitive data** — email is not exposed; contact is via LinkedIn

---

## Development Guidelines

### Code Style
- Keep functions small and focused
- Use clear, descriptive variable names
- Comment complex logic
- Follow SOLID principles

### Best Practices
- Frontend-only implementation
- Mobile-first responsive design
- All resume data lives in `resume.js` — update that file to update the site

---

## Deployment
- Hosted on **GitHub Pages** — pushes to `master` deploy automatically
- No build process required
- Simple static file serving

---

## Usage Instructions
1. Visit [alfdav.github.io](https://alfdav.github.io/)
2. Type `help` to see available commands
3. Use `Tab` for command completion
4. Use `↑` / `↓` arrows for command history
5. Try `verify <cert name>` to view certification details and verification links
6. Type `clear` to reset the terminal

---

## Development Setup
1. Clone the repository
2. No build tools required
3. Open `index.html` directly in a browser, or serve with any static file server:
   ```bash
   npx serve .
   # or
   python3 -m http.server
   ```
4. Edit `resume.js` to update resume content; edit `script.js` for terminal behavior

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License
MIT License — feel free to use and modify.

---

## Contact
- **LinkedIn:** [David Diaz](https://www.linkedin.com/in/0xdaviddiaz/) *(preferred — email available on profile)*
- **GitHub:** [alfdav](https://github.com/alfdav)