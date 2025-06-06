// Add smooth fade-in animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in';
        document.body.style.opacity = '1';
    }, 100);

    // Initialize mobile menu
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileMenuBtn);

    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    const terminal = document.querySelector('.terminal-content');
    const input = document.querySelector('.terminal-input');
    const output = document.querySelector('.terminal-output');

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    // Available commands and their responses
    const commands = {
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
            output.innerHTML = '';
            return '';
        }
    };

    // Handle command execution
    function executeCommand(cmd) {
        cmd = cmd.trim().toLowerCase();
        
        // Add command to history
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        // Create command line
        const commandLine = document.createElement('div');
        commandLine.className = 'line';
        commandLine.innerHTML = `
            <span class="prompt">visitor@bhartesh:~$</span>
            <span class="command">${cmd}</span>
        `;
        output.appendChild(commandLine);

        // Execute command and show output
        const response = commands[cmd] ? commands[cmd]() : `Command not found: ${cmd}. Type 'help' for available commands.`;
        
        if (response) {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'output';
            responseDiv.innerHTML = response.split('\n').map(line => `<p>${line}</p>`).join('');
            output.appendChild(responseDiv);
        }

        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Handle input
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value;
            executeCommand(cmd);
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });

    // Focus input on click anywhere in terminal
    terminal.addEventListener('click', () => {
        input.focus();
    });

    // Initial focus
    input.focus();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu after clicking a link
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Navbar scroll effect with improved performance
let ticking = false;
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                navbar.style.boxShadow = 'var(--shadow-sm)';
            } else {
                navbar.style.boxShadow = 'var(--shadow-md)';
                
                if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                    navbar.classList.remove('scroll-up');
                    navbar.classList.add('scroll-down');
                } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                    navbar.classList.remove('scroll-down');
                    navbar.classList.add('scroll-up');
                }
            }
            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
});

// Enhanced Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and timeline items
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(50px)';
    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(item);
});

// Enhanced hover effects for cards
const cards = document.querySelectorAll('.project-card, .achievement-card, .skill-category, .education');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = 'var(--shadow-lg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow-md)';
    });
});

// Add CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .fade-out {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .scroll-down {
        transform: translateY(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .scroll-up {
        transform: translateY(0);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .mobile-menu-btn {
        display: none;
    }

    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
    }
`;
document.head.appendChild(style);

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
}); 