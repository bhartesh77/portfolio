// UI module
export class UI {
    constructor() {
        this.setupDateTime();
        this.setupProfileSelection();
    }

    setupDateTime() {
        const updateDateTime = () => {
            const now = new Date();
            const timeElement = document.getElementById('currentTime');
            const dateElement = document.getElementById('currentDate');
            const desktopTimeElement = document.getElementById('desktopTime');
            
            // Update time
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const timeString = `${hours}:${minutes}`;
            
            if (timeElement) timeElement.textContent = timeString;
            if (desktopTimeElement) desktopTimeElement.textContent = timeString;
            
            // Update date
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            if (dateElement) dateElement.textContent = now.toLocaleDateString('en-US', options);
        };

        // Update time every minute
        updateDateTime();
        setInterval(updateDateTime, 60000);
    }

    setupProfileSelection() {
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showRootScreen();
            });
        });
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('terminal').style.display = 'none';
        document.getElementById('guestScreen').style.display = 'none';
    }

    showRootScreen() {
        // First show the desktop
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('guestScreen').style.display = 'flex';
        
        // Then show and position the terminal
        const terminal = document.getElementById('terminal');
        terminal.style.display = 'flex';
        terminal.style.position = 'fixed';
        terminal.style.top = '80px';
        terminal.style.left = '50%';
        terminal.style.transform = 'translateX(-50%)';
        terminal.style.width = '80%';
        terminal.style.height = '60vh';
        terminal.style.zIndex = '9999';
        terminal.style.backgroundColor = 'rgba(30, 30, 30, 0.95)';
        terminal.style.borderRadius = '8px';
        terminal.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    }
} 