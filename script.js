document.addEventListener('DOMContentLoaded', () => {
    function showFatalError(message) {
        var el = document.getElementById('loading-msg');
        if (!el) {
            el = document.createElement('p');
            el.id = 'loading-msg';
            document.body.appendChild(el);
        }
        el.hidden = false;
        el.textContent = message;
        el.className = 'error';
    }

    if (window.top !== window.self) {
        try {
            window.top.location = window.self.location;
        } catch (e) {
            document.body.replaceChildren();
            document.body.textContent = 'This page cannot be displayed in a frame. Visit directly: https://alfdav.github.io/';
            return;
        }
    }

    if (!window.resumeData || !window.resumeUtils || !window.terminalInputUtils) {
        showFatalError('Failed to load resume data. Please refresh or try again later.');
        return;
    }

    const resumeData = window.resumeData;
    const resumeUtils = window.resumeUtils;
    const terminalInputUtils = window.terminalInputUtils;
    const clean = resumeUtils.sanitizeDisplayText;
    const skills = resumeUtils.safeArray(resumeData.skills);
    const workEntries = resumeUtils.safeArray(resumeData.work);
    const educationEntries = resumeUtils.safeArray(resumeData.education);
    const projectEntries = resumeUtils.safeArray(resumeData.projects);
    const certifications = resumeUtils.listCertifications(resumeData);
    const verifySuggestions = resumeUtils.getVerifyCommandSuggestions(certifications);
    const verifyExample = verifySuggestions[0] || 'verify OSCP';

    const terminal = document.getElementById('terminal');
    const output = document.getElementById('output');
    const promptRow = document.getElementById('prompt-row');
    const input = document.getElementById('cmd');
    const loadingMsg = document.getElementById('loading-msg');
    if (!terminal || !output || !promptRow || !input) {
        showFatalError('Terminal failed to initialize. Please refresh or try a different browser.');
        return;
    }

    if (loadingMsg) loadingMsg.remove();
    output.hidden = false;
    promptRow.hidden = false;

    let commandHistory = [];
    let historyIndex = -1;
    let tempBuffer = '';

    function scrollToBottom() {
        terminal.scrollTop = terminal.scrollHeight;
    }

    function put(text, cls) {
        const div = document.createElement('div');
        if (cls) div.className = cls;
        div.textContent = text;
        output.appendChild(div);
        scrollToBottom();
        return div;
    }

    function putLink(before, url, label) {
        const div = document.createElement('div');
        if (before) div.append(before);
        const a = document.createElement('a');
        a.href = url;
        a.textContent = label;
        a.rel = 'noopener noreferrer';
        a.target = '_blank';
        div.append(a);
        output.appendChild(div);
        scrollToBottom();
    }

    function header(title, rule) {
        put('');
        put(title, 'green');
        put(rule, 'gray');
    }

    const commands = {
        help() {
            put('Available commands:');
            put('');
            put('help          - Show this help message');
            put('about         - About me');
            put('skills        - My technical skills');
            put('experience    - Work experience');
            put('education     - Educational background');
            put('projects      - View my projects');
            put('certs         - View professional certifications');
            put(`verify <name> - Verify a certification (e.g., ${verifyExample})`);
            put('contact       - Contact information');
            put('clear         - Clear the terminal');
            put('');
        },
        about() {
            header('ABOUT', '───────────────');
            put(clean(resumeData.basics?.summary) || 'Cybersecurity professional focused on offensive security and practical risk reduction.', 'cyan');
            put('');
        },
        skills() {
            header('SKILLS', '───────────────');
            if (skills.length === 0) {
                put('No skills entries available', 'gray');
                put('');
                return;
            }
            skills.forEach((skill) => {
                const keywords = resumeUtils.safeArray(skill?.keywords).map(clean).filter(Boolean);
                put('');
                put(`・ ${clean(skill?.name) || 'Skill Area'}`, 'yellow');
                put(`  ${keywords.join(', ') || 'No keywords listed'}`, 'magenta');
            });
            put('');
        },
        experience() {
            header('EXPERIENCE', '─────────────────');
            if (workEntries.length === 0) {
                put('No experience entries available', 'gray');
                put('');
                return;
            }
            workEntries.forEach((job) => {
                const highlights = resumeUtils.safeArray(job.highlights).map(clean).filter(Boolean);
                put('');
                put(`・ ${clean(job.position) || 'Unspecified position'}`, 'yellow');
                put(`  ${clean(resumeUtils.getCompanyName(job))}`, 'cyan');
                put(`  ${clean(job.startDate) || ''} - ${clean(job.endDate) || 'Present'}`, 'gray');
                if (highlights.length > 0) {
                    highlights.forEach((highlight) => put(`  • ${highlight}`));
                } else {
                    put('  No highlights available', 'gray');
                }
            });
            put('');
        },
        education() {
            header('EDUCATION', '───────────────');
            if (educationEntries.length === 0) {
                put('No education entries available', 'gray');
                put('');
                return;
            }
            educationEntries.forEach((edu) => {
                const courses = resumeUtils.safeArray(edu.courses).map(clean).filter(Boolean);
                const studyType = clean(edu.studyType) || 'Education';
                const area = clean(edu.area);
                const startDate = clean(edu.startDate);
                const endDate = clean(edu.endDate);
                put('');
                put(`・ ${studyType}${area ? ` in ${area}` : ''}`, 'yellow');
                put(`  ${clean(edu.institution) || 'Unspecified institution'}`, 'cyan');
                put(`  ${startDate}${startDate || endDate ? ' - ' : ''}${endDate}`, 'gray');
                if (courses.length > 0) {
                    put(`  Courses: ${courses.join(', ')}`, 'magenta');
                }
            });
            put('');
        },
        projects() {
            header('PROJECTS', '───────────────');
            if (projectEntries.length === 0) {
                put('No project entries available', 'gray');
                put('');
                return;
            }
            projectEntries.forEach((project) => {
                const keywords = resumeUtils.safeArray(project.keywords).map(clean).filter(Boolean);
                const projectUrl = clean(project.url);
                put('');
                put(`・ ${clean(project.name) || 'Untitled project'}`, 'yellow');
                put(`  Description: ${clean(project.description) || 'No description available'}`);
                if (keywords.length > 0) {
                    put(`  Technologies: ${keywords.join(', ')}`, 'magenta');
                }
                if (projectUrl) {
                    if (resumeUtils.isHttpUrl(projectUrl)) {
                        putLink('  URL: ', projectUrl, projectUrl);
                    } else {
                        put(`  Reference: ${projectUrl}`, 'cyan');
                    }
                }
            });
            put('');
        },
        certifications() {
            header('CERTIFICATIONS', '───────────────────────');
            if (certifications.length === 0) {
                put('No certifications available', 'gray');
                put('');
                return;
            }
            certifications.forEach((cert) => {
                const verifyUrl = clean(cert.verify_url);
                put('');
                put(`・ ${clean(cert.title) || 'Untitled certification'}`, 'yellow');
                put(`  ${clean(cert.issuer) || 'Unspecified issuer'}`, 'cyan');
                if (cert.date) put(`  Issued: ${clean(cert.date)}`, 'gray');
                if (verifyUrl && resumeUtils.isHttpUrl(verifyUrl)) {
                    putLink('  Verify at: ', verifyUrl, 'Open verification link');
                }
            });
            put('ℹ️  Use "verify <name>" for detailed information about a specific certification');
            put('');
        },
        verify(args) {
            const certName = args?.trim().toLowerCase() || '';
            if (!certName) {
                put('Usage: verify <name>', 'yellow');
                if (verifySuggestions.length > 0) {
                    put('Examples:', 'yellow');
                    verifySuggestions.forEach((command) => put(`  ${command}`));
                    if (certifications.length > verifySuggestions.length) {
                        put('  ...and more via "certs"');
                    }
                }
                put('Run "certs" to list available certifications.');
                put('');
                return;
            }

            const cert = resumeUtils.findCertification(certifications, certName);
            if (!cert) {
                put(`No certification found matching "${clean(certName)}"`, 'red');
                const nearby = resumeUtils.getClosestCertificationSuggestions(certifications, certName, 3);
                if (nearby.length > 0) {
                    put('Try:', 'yellow');
                    nearby.forEach((title) => put(`  verify ${title}`));
                }
                put('Run "certs" to list available certifications.');
                put('');
                return;
            }

            const verifyUrl = clean(cert.verify_url);
            header('CERTIFICATION DETAILS', '───────────────────────────────');
            put(`Title: ${clean(cert.title) || 'Untitled certification'}`);
            put(`Issuer: ${clean(cert.issuer) || 'Unspecified issuer'}`);
            if (cert.date) put(`Issued: ${clean(cert.date)}`);
            if (cert.summary) put(`Summary: ${clean(cert.summary)}`);
            if (verifyUrl && resumeUtils.isHttpUrl(verifyUrl)) {
                putLink('Verification URL: ', verifyUrl, 'Open credential page');
            }
            put('');
        },
        contact() {
            header('CONTACT INFORMATION', '──────────────────────');
            putLink('・ LinkedIn: ', 'https://linkedin.com/in/alfdav', 'https://linkedin.com/in/alfdav');
            putLink('・ GitHub:   ', 'https://github.com/alfdav', 'https://github.com/alfdav');
            put('');
            put('Note: For recruiter inquiries, please find my', 'italic-gray');
            put('email address on my LinkedIn profile', 'italic-gray');
            put('');
        },
        clear() {
            output.replaceChildren();
            put("[David's Terminal Portfolio - type \"help\" for commands]", 'gray');
        }
    };

    put("Welcome to David's Terminal Portfolio");
    put('Type "help" to see available commands.');
    put('  This is a simulated terminal. No real commands are executed.', 'gray');
    put('');

    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    function runCommand(raw) {
        const { cmd, args } = terminalInputUtils.parseCommand(raw);
        const resolvedCmd = terminalInputUtils.resolveCommandAlias(cmd);
        commandHistory = terminalInputUtils.addCommandToHistory(commandHistory, raw);
        historyIndex = commandHistory.length;
        tempBuffer = '';

        if (!resolvedCmd) return;
        const handler = commands[resolvedCmd];
        if (handler) {
            handler(args);
        } else {
            put(`Command not found: ${clean(cmd)}`, 'red');
            put('Type "help" to see available commands.');
        }
    }

    input.addEventListener('paste', (event) => {
        event.preventDefault();
        const text = (event.clipboardData || window.clipboardData).getData('text') || '';
        const singleLine = text
            .replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/g, '')
            .replace(/[\r\n]+/g, ' ')
            .trim();
        if (!singleLine) return;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = input.value.slice(0, start) + singleLine + input.value.slice(end);
        input.selectionStart = input.selectionEnd = start + singleLine.length;
    });

    input.addEventListener('keydown', (event) => {
        konamiCode.push(event.key);
        if (konamiCode.length > konamiSequence.length) konamiCode.shift();
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            put('🎉 Nice! You found the easter egg. Achievement unlocked: true gamer.', 'magenta');
            put('');
            konamiCode = [];
        }

        if (event.key === 'Tab') {
            event.preventDefault();
            const typed = input.value.trim().toLowerCase();
            const matches = Object.keys(commands).filter((cmd) => cmd.startsWith(typed));
            if (matches.length === 1) {
                input.value = matches[0];
            } else if (matches.length > 1) {
                put(matches.join('    '));
            }
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            const raw = input.value;
            put(`visitor@portfolio:~$ ${raw}`);
            runCommand(raw);
            input.value = '';
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            const nextState = terminalInputUtils.moveHistoryUp({
                history: commandHistory,
                historyIndex,
                commandBuffer: input.value,
                tempBuffer
            });
            historyIndex = nextState.historyIndex;
            tempBuffer = nextState.tempBuffer;
            input.value = nextState.commandBuffer;
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextState = terminalInputUtils.moveHistoryDown({
                history: commandHistory,
                historyIndex,
                commandBuffer: input.value,
                tempBuffer
            });
            historyIndex = nextState.historyIndex;
            tempBuffer = nextState.tempBuffer;
            input.value = nextState.commandBuffer;
        }
    });

    terminal.addEventListener('click', (event) => {
        if (event.target.tagName !== 'A') input.focus();
    });

    input.focus();
});
