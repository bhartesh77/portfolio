// Terminal module
export class Terminal {
    constructor() {
        this.terminal = document.querySelector('.terminal-content');
        this.input = document.querySelector('.terminal-input');
        this.output = document.querySelector('.terminal-output');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.input.value;
                this.executeCommand(cmd);
                this.input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
            }
        } else {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
            }
        }

        this.input.value = this.commandHistory[this.historyIndex] || '';
    }

    executeCommand(cmd) {
        cmd = cmd.trim().toLowerCase();
        
        // Add command to history
        this.commandHistory.push(cmd);
        this.historyIndex = this.commandHistory.length;

        // Create command line
        const commandLine = document.createElement('div');
        commandLine.className = 'line';
        commandLine.innerHTML = `
            <span class="prompt">visitor@bhartesh:~$</span>
            <span class="command">${cmd}</span>
        `;
        this.output.appendChild(commandLine);

        // Execute command and show output
        const response = this.commands[cmd] ? this.commands[cmd]() : `Command not found: ${cmd}. Type 'help' for available commands.`;
        
        if (response) {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'output';
            responseDiv.innerHTML = response.split('\n').map(line => `<p>${line}</p>`).join('');
            this.output.appendChild(responseDiv);
        }

        // Scroll to bottom
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    get commands() {
        return {
            help: () => {
                return `
Available commands:
- about - About me and my skills
- experience - Work experience
- projects - My projects
- education - Educational background
- achievements - Awards and achievements
- contact - Contact information
- clear - Clear terminal
- help - Show this help message`;
            },
            about: () => {
                return `
About Bhartesh Kaushik
=====================
Full Stack Developer with expertise in modern web technologies.

Skills:
-------
Languages:
- JavaScript/TypeScript
- C++
- Python
- Java
- C#
- SQL

Frameworks/Libraries:
- React.js
- React Native
- Node.js
- .NET
- GraphQL
- Tailwind CSS

Tools/Platforms:
- Azure
- AWS
- Docker
- Git/GitHub`;
            },
            experience: () => {
                return `
Work Experience
==============

Software Development Engineer @ Iesoftek (07/2023 - present)
----------------------------------------------------------
Project: Hydreight
- Enabled appointment booking with doctors and nurses
- Implemented VoIP video calling in React Native
- Integrated secure payment functionality
- Reduced API response time to under 1 second
- Implemented notifications using Azure Service Bus
- Integrated lab test booking with LiveHealth API

Tech Stack: React.js, React Native, .Net, JavaScript, C#

Software Development Intern @ Iesoftek (01/2023 - 06/2023)
--------------------------------------------------------
Project: Tradexport
- Developed cross-platform car trading application
- Integrated vehicle booking flow
- Achieved 10,000+ Android downloads

Tech Stack: React.js, TypeScript, React Native, Git/Github, GraphQL`;
            },
            projects: () => {
                return `
Projects
========

1. Code Connect
--------------
Real-time code editor for software development teams
- Web-based real-time code collaborator
- Live changes without local copies
Tech: Node.js, React.js, Express.js, Web Sockets

2. Pokémon Lounge
---------------
Know everything about your favourite pokemon
- Web application integrating with PokeAPI
- Pokémon stats comparison feature
Tech: React.js, TypeScript, Tailwind CSS, VITE

3. Codeforces Problems Predictor
-------------------------------
Analysis of Codeforces contest patterns
- Python script to scrape problems from past 40 contests
- Analysis of most frequently asked topics
Tech: Python, Web Scraping, Beautifulsoup4`;
            },
            education: () => {
                return `
Education
=========

Bachelor of Technology in Computer Science and Engineering
--------------------------------------------------------
J.C. Bose University of Science and Technology, YMCA
CGPA: 8.96 | Class Rank: 1/60
Graduation Year: 2023`;
            },
            achievements: () => {
                return `
Awards & Achievements
===================

🏆 CodeChef
- 5 stars with a 2057 rating

🥇 Codechef Starters
- Global Rank 28, round 42

🏅 Google Kickstart
- Global Rank 676, 2022 round D

👑 CodeKaze Season 5
- National Rank 1 among 16k+ colleges`;
            },
            contact: () => {
                return `
Contact Information
=================

GitHub: https://github.com/bhartesh
LinkedIn: https://linkedin.com/in/bhartesh
Email: bharteshkaushik@gmail.com`;
            },
            clear: () => {
                this.output.innerHTML = '';
                return '';
            }
        };
    }
} 