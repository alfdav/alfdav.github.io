document.addEventListener('DOMContentLoaded', () => {
    if (!window.resumeData) {
        console.error('Error: resumeData is not defined on window. Ensure resume.js is loaded correctly.');
        return;
    }
    if (!window.resumeUtils) {
        console.error('Error: resumeUtils is not defined on window. Ensure resume-utils.js is loaded correctly.');
        return;
    }
    if (!window.terminalInputUtils) {
        console.error('Error: terminalInputUtils is not defined on window. Ensure terminal-input-utils.js is loaded correctly.');
        return;
    }

    // Resume data
    const resumeData = window.resumeData;
    const resumeUtils = window.resumeUtils;
    const terminalInputUtils = window.terminalInputUtils;
    const certifications = resumeUtils.listCertifications(resumeData);

    // Initialize command history
    let commandHistory = [];
    let historyIndex = -1;
    let tempBuffer = '';
    
    // Initialize terminal with dynamic sizing
    const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
            background: '#000000',
            foreground: '#ffffff',
            cursor: '#ffffff'
        },
        allowTransparency: true,
        scrollback: 1000,
        convertEol: true
    });

    // Initialize FitAddon
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);

    // Open terminal
    term.open(document.getElementById('terminal'));
    
    // Initial fit
    fitAddon.fit();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        fitAddon.fit();
    });

    // Adjust terminal size on orientation change (mobile)
    window.addEventListener('orientationchange', () => {
        setTimeout(() => fitAddon.fit(), 100);
    });
    
    // Welcome message
    term.writeln('Welcome to David\'s Terminal Portfolio');
    term.writeln('Type "help" to see available commands.');
    term.writeln('');

    // Command prompt
    const prompt = '$ ';
    let commandBuffer = '';

    // Available commands
    const commands = {
        help: {
            callback: () => {
                term.writeln('Available commands:');
                term.writeln('');
                term.writeln('help          - Show this help message');
                term.writeln('about         - About me');
                term.writeln(`skills        - My technical skills: ${resumeData.skills.map(skill => skill.name).join(', ')}`);
                term.writeln('experience    - Work experience');
                term.writeln(`education     - Educational background: ${resumeData.education.map(edu => edu.institution).join(', ')}`);
                term.writeln('projects      - View my projects');
                term.writeln('certifications - View professional certifications');
                term.writeln('verify <name> - Verify a certification');
                term.writeln('contact       - Contact information');
                term.writeln('clear         - Clear the terminal');
                term.writeln('');
            },
            description: 'Show this help message'
        },
        about: {
            callback: () => {
                term.writeln('\x1B[1;32m\nABOUT\x1B[0m');
                term.writeln('\x1B[90m───────────────\x1B[0m');
                
                const summary = resumeUtils.getAboutSummary(resumeData);
                term.writeln(`\x1B[36m${summary}\x1B[0m\n`);
            },
            description: 'Show about information'
        },
        skills: {
            callback: () => {
                term.writeln('\x1B[1;32m\nSKILLS\x1B[0m');
                term.writeln('\x1B[90m───────────────\x1B[0m');

                resumeData.skills.forEach(skill => {
                    term.writeln(`\n\x1B[1;33m・ ${skill.name}\x1B[0m`);
                    term.writeln(`  \x1B[35m${skill.keywords.join(', ')}\x1B[0m`);
                });
                term.writeln('');
            },
            description: 'List technical skills'
        },
        experience: {
            callback: () => {
                term.writeln('\x1B[1;32m\nEXPERIENCE\x1B[0m');
                term.writeln('\x1B[90m─────────────────\x1B[0m');
                
                if (!resumeData.work?.length) {
                    term.writeln('\x1B[90mNo experience entries available\x1B[0m\n');
                    return;
                }

                resumeData.work.forEach(job => {
                    const position = job.position || 'Unspecified position';
                    const company = resumeUtils.getCompanyName(job);
                    const dates = `${job.startDate || ''} - ${job.endDate || 'Present'}`;
                    const highlights = job.highlights || [];

                    term.writeln(`\n\x1B[1;33m・ ${position}\x1B[0m`);
                    term.writeln(`  \x1B[36m${company}\x1B[0m`);
                    term.writeln(`  \x1B[90m${dates}\x1B[0m`);
                    
                    if (highlights.length > 0) {
                        highlights.forEach(highlight => {
                            term.writeln(`  \x1B[37m• ${highlight}\x1B[0m`);
                        });
                    } else {
                        term.writeln('  \x1B[90mNo highlights available\x1B[0m');
                    }
                });
                term.writeln('');
            },
            description: 'Show work experience'
        },
        education: {
            callback: () => {
                term.writeln('\x1B[1;32m\nEDUCATION\x1B[0m');
                term.writeln('\x1B[90m───────────────\x1B[0m');

                resumeData.education.forEach(edu => {
                    term.writeln(`\n\x1B[1;33m・ ${edu.studyType} in ${edu.area}\x1B[0m`);
                    term.writeln(`  \x1B[36m${edu.institution}\x1B[0m`);
                    term.writeln(`  \x1B[90m${edu.startDate} - ${edu.endDate}\x1B[0m`);
                    if(edu.courses?.length) {
                        term.writeln(`  \x1B[35mCourses: ${edu.courses.join(', ')}\x1B[0m`);
                    }
                });
                term.writeln('');
            },
            description: 'Show education background'
        },
        projects: {
            callback: () => {
                term.writeln('\x1B[1;32m\nPROJECTS\x1B[0m');
                term.writeln('\x1B[90m───────────────\x1B[0m');

                resumeData.projects.forEach(project => {
                    term.writeln(`\n\x1B[1;33m・ ${project.name}\x1B[0m`);
                    term.writeln(`  \x1B[36mDescription:\x1B[0m ${project.description}`);

                    if (project.keywords?.length) {
                        term.writeln(`  \x1B[35mTechnologies:\x1B[0m \x1B[35m${project.keywords.join(', ')}\x1B[0m`);
                    }

                    if (project.url) {
                        term.writeln(`  \x1B[36mURL:\x1B[0m \x1B[4;34m${project.url}\x1B[0m`);
                    }
                });
                term.writeln('');
            },
            description: 'Show portfolio projects'
        },
        certifications: {
            callback: () => {
                term.writeln('\x1B[1;32m\nCERTIFICATIONS\x1B[0m');
                term.writeln('\x1B[90m───────────────────────\x1B[0m');

                if (certifications.length > 0) {
                    certifications.forEach((cert) => {
                        term.writeln(`\n\x1B[1;33m・ ${cert.title}\x1B[0m`);
                        term.writeln(`  \x1B[36m${cert.issuer}\x1B[0m`);
                        if (cert.date) {
                            term.writeln(`  \x1B[90mIssued: ${cert.date}\x1B[0m`);
                        }
                        if (cert.verify_url) {
                            term.writeln(`  \x1B[90mVerify at: ${cert.verify_url}\x1B[0m`);
                        }
                    });
                    term.writeln('ℹ️  Use "verify <name>" for detailed information about a specific certification');
                } else {
                    term.writeln('\x1B[90mNo certifications available\x1B[0m');
                }
                term.writeln('');
            },
            description: 'View professional certifications'
        },
        verify: {
            callback: (args) => {
                const certName = args?.trim().toLowerCase() || '';
                if (!certName) {
                    term.writeln('Please specify a certification name.');
                    return;
                }

                const cert = resumeUtils.findCertification(certifications, certName);
                if (cert) {
                    term.writeln(`\x1B[1;32m\nCERTIFICATION DETAILS\x1B[0m`);
                    term.writeln('\x1B[90m───────────────────────────────\x1B[0m');
                    term.writeln(`\x1B[36mTitle:\x1B[0m ${cert.title}`);
                    term.writeln(`\x1B[36mIssuer:\x1B[0m ${cert.issuer}`);
                    if (cert.date) {
                        term.writeln(`\x1B[36mIssued:\x1B[0m ${cert.date}`);
                    }
                    if (cert.summary) {
                        term.writeln(`\x1B[36mSummary:\x1B[0m ${cert.summary}`);
                    }
                    if (cert.verify_url) {
                        term.writeln(`\x1B[36mVerification URL:\x1B[0m ${cert.verify_url}`);
                    }
                    if (cert.accredible_id) {
                        term.writeln(`\x1B[36mCredential ID:\x1B[0m ${cert.accredible_id}`);
                    }
                    term.writeln('');
                } else {
                    term.writeln(`\x1B[1;31mNo certification found matching "${certName}"\x1B[0m`);
                }
                term.writeln('');
            },
            description: 'Verify a certification'
        },
        contact: {
            callback: () => {
                term.writeln('\x1B[1;32m\nCONTACT INFORMATION\x1B[0m');
                term.writeln('\x1B[90m──────────────────────\x1B[0m');
                term.writeln('\x1B[1;33m・ LinkedIn:\x1B[0m \x1B[4;34mhttps://linkedin.com/in/alfdav\x1B[0m');
                term.writeln('\x1B[1;33m・ GitHub:\x1B[0m   \x1B[4;34mhttps://github.com/alfdav\x1B[0m');
                term.writeln('\n\x1B[3;90mNote: For recruiter inquiries, please find my\nemail address on my LinkedIn profile\x1B[0m\n');
            },
            description: 'Show contact information'
        },
        clear: {
            callback: () => {
                term.clear();
            },
            description: 'Clear the terminal'
        }
    };

    // Handle key input
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    term.onKey(({ key, domEvent }) => {
        // Konami code detection
        konamiCode.push(domEvent.key);
        if (konamiCode.length > konamiSequence.length) konamiCode.shift();
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            term.writeln('\n\x1B[35m🎉 Secret unlocked! Activating developer mode...\x1B[0m\n');
            konamiCode = [];
        }
        
        if (domEvent.key === 'Tab') {
            domEvent.preventDefault();
            const input = commandBuffer.trim().toLowerCase();
            const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input) && !commands[cmd].hidden);
            
            if (matches.length === 1) {
                commandBuffer = matches[0];
                term.write('\x1B[2K\r' + prompt + commandBuffer);
            } else if (matches.length > 1) {
                term.writeln('');
                term.writeln(matches.join('    '));
                term.write(prompt + commandBuffer);
            }
            return;
        }

        if (domEvent.key === 'Backspace') {
            if (commandBuffer.length > 0) {
                commandBuffer = commandBuffer.slice(0, -1);
                term.write('\b \b');
            }
            return;
        }
        
        if (domEvent.key === 'Enter') {
            term.writeln('');
            const { cmd, args } = terminalInputUtils.parseCommand(commandBuffer);
            commandHistory = terminalInputUtils.addCommandToHistory(commandHistory, commandBuffer);
            historyIndex = commandHistory.length;
            tempBuffer = '';
            
            if (cmd.length > 0) {
                const handler = commands[cmd];

                if (handler) {
                    if (handler.pattern) {
                        if (commandBuffer.trim().toLowerCase() === handler.pattern.toLowerCase()) {
                            handler.callback();
                        } else {
                            term.writeln(`\x1B[1;31mCommand not found: ${cmd}\x1B[0m`);
                            term.writeln('Type "help" to see available commands.');
                        }
                    } else {
                        handler.callback(args);
                    }
                } else {
                    term.writeln(`\x1B[1;31mCommand not found: ${cmd}\x1B[0m`);
                    term.writeln('Type "help" to see available commands.');
                }
            }
            commandBuffer = '';
            term.write(prompt);
            return;
        }
        
        if (domEvent.key === 'ArrowUp') {
            const nextState = terminalInputUtils.moveHistoryUp({
                history: commandHistory,
                historyIndex,
                commandBuffer,
                tempBuffer
            });
            historyIndex = nextState.historyIndex;
            commandBuffer = nextState.commandBuffer;
            tempBuffer = nextState.tempBuffer;
            term.write('\x1B[2K\r' + prompt + commandBuffer);
            return;
        }
        
        if (domEvent.key === 'ArrowDown') {
            const nextState = terminalInputUtils.moveHistoryDown({
                history: commandHistory,
                historyIndex,
                commandBuffer,
                tempBuffer
            });
            historyIndex = nextState.historyIndex;
            commandBuffer = nextState.commandBuffer;
            tempBuffer = nextState.tempBuffer;
            term.write('\x1B[2K\r' + prompt + commandBuffer);
            return;
        }
        
        const printableCharacter = terminalInputUtils.getPrintableCharacter(key, domEvent);
        if (printableCharacter) {
            commandBuffer += printableCharacter;
            term.write(printableCharacter);
        }
    });

    // Initial prompt
    term.write(prompt);
});
