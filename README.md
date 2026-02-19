# Terminal Portfolio Website

## Project Overview
A personal resume website that simulates a command-line terminal interface, providing an interactive and unique way to display professional information.

## Features

### Terminal Emulation
- Realistic terminal appearance with blinking cursor and command prompt
- Command history navigation using arrow keys (↑/↓)
- Tab completion for commands
- Error handling for invalid commands

### Available Commands
- `help`: List all available commands
- `about`: Display personal bio
- `skills`: List technical skills
- `experience`: Show work experience
- `education`: Display educational background
- `projects`: Browse projects
- `certifications`: View professional certifications
- `contact`: Get contact information
- `clear`: Clear the terminal

### Interactive Features
1. **Command History**
   - Up arrow (↑) to navigate to previous commands
   - Down arrow (↓) to navigate to newer commands
   - Preserves current input when starting history navigation
   - Returns to current input when reaching the end of history

2. **Tab Completion**
   - Press Tab to auto-complete commands
   - Shows all possible completions for partial matches
   - Case-insensitive completion
   - Completes common prefixes automatically

3. **Error Handling**
   - Clear error messages for invalid commands
   - Helpful suggestions for similar commands
   - "help" command reminder on errors

## Technical Implementation

### File Structure
```
alfdav.github.io/
├── index.html      # Main HTML file
├── styles.css      # Terminal styling
├── script.js       # Terminal logic
└── resume.js       # Resume data
```

### Technologies Used
- HTML5 for structure
- CSS3 for styling
- JavaScript for interactivity
- xterm.js for terminal emulation

### Design Decisions
- Dark theme with green text (classic terminal look)
- Centered terminal with subtle glow effect
- Responsive design for all devices
- Accessibility considerations

## Development Guidelines

### Code Style
- Keep functions small and focused
- Use clear, descriptive variable names
- Comment complex logic
- Follow SOLID principles

### Best Practices
- Frontend-only implementation
- No sensitive data exposure
- Performance optimization
- Mobile-first responsive design

### Security
- Static content only
- No backend dependencies
- No data persistence
- Safe command execution

## Deployment
- Hosted on GitHub Pages
- No build process required
- Simple static file serving

## Future Enhancements
1. Command history persistence
2. Custom command aliases
3. Easter eggs and hidden commands
4. More interactive features
5. Additional resume sections
6. Performance optimizations
7. Enhanced accessibility
8. Mobile responsiveness improvements
9. Accredible Integration
   - Link certifications to official Accredible credentials
   - Display certification badges and verification status
   - Add `verify` command to check certification authenticity
   - Implement real-time credential validation
   - Show detailed certification information and achievements

## Usage Instructions
1. Visit the website
2. Type 'help' to see available commands
3. Use Tab for command completion
4. Use ↑/↓ arrows for command history
5. Type 'clear' to reset the terminal

## Development Setup
1. Clone the repository
2. No build tools required
3. Serve with any static file server
4. Edit files directly

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License - Feel free to use and modify

## Contact
- LinkedIn: [David Diaz](https://www.linkedin.com/in/0xdaviddiaz/) (Preferred)
- GitHub: [alfdav](https://github.com/alfdav)
- Email: david@toledoranch.com
