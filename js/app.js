import { Terminal } from './modules/terminal.js';
import { UI } from './modules/ui.js';

// Add smooth fade-in animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in';
        document.body.style.opacity = '1';
    }, 100);

    // Initialize UI
    const ui = new UI();
    window.showLoginScreen = () => ui.showLoginScreen();

    // Initialize Terminal if it exists
    const terminalElement = document.querySelector('.terminal-content');
    if (terminalElement) {
        const terminal = new Terminal();
    }

    // Terminal window controls
    const terminal = document.getElementById('terminal');
    const closeBtn = document.querySelector('.terminal-button.close');
    const minimizeBtn = document.querySelector('.terminal-button.minimize');
    const maximizeBtn = document.querySelector('.terminal-button.maximize');
    const terminalHeader = document.querySelector('.terminal-header');
    const terminalIcon = document.getElementById('terminalIcon');

    let isMaximized = false;
    let originalWidth = '80%';
    let originalHeight = '60vh';
    let originalTop = '80px';
    let originalLeft = '50%';
    let originalTransform = 'translateX(-50%)';

    // Drag functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    function dragStart(e) {
        if (isMaximized) return; // Don't allow dragging when maximized
        
        // Remove transition during drag
        terminal.style.transition = 'none';
        
        // Get the current transform values
        const transform = window.getComputedStyle(terminal).transform;
        const matrix = new DOMMatrix(transform);
        xOffset = matrix.m41;
        yOffset = matrix.m42;
        
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === terminalHeader || terminalHeader.contains(e.target)) {
            isDragging = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        
        // Restore transition after drag
        terminal.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, terminal);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    // Add event listeners for drag
    terminalHeader.addEventListener("mousedown", dragStart, false);
    terminalHeader.addEventListener("touchstart", dragStart, false);
    document.addEventListener("mousemove", drag, false);
    document.addEventListener("touchmove", drag, false);
    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("touchend", dragEnd, false);

    // Set initial terminal position
    terminal.style.position = 'fixed';
    terminal.style.top = originalTop;
    terminal.style.left = originalLeft;
    terminal.style.width = originalWidth;
    terminal.style.height = originalHeight;
    terminal.style.transform = originalTransform;

    // Function to show terminal with animation
    function showTerminal() {
        // Reset position and size to original values
        terminal.style.position = 'fixed';
        terminal.style.top = originalTop;
        terminal.style.left = originalLeft;
        terminal.style.width = originalWidth;
        terminal.style.height = originalHeight;
        
        // Reset transform and transition
        terminal.style.transition = 'none';
        terminal.style.transform = originalTransform;
        
        terminal.style.display = 'flex';
        terminal.style.opacity = '0';
        
        // Force reflow
        terminal.offsetHeight;
        
        // Add transition and animate
        terminal.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        terminal.style.opacity = '1';
        
        // Reset drag offset
        xOffset = 0;
        yOffset = 0;
    }

    // Open terminal from desktop icon
    terminalIcon.addEventListener('click', () => {
        if (terminal.style.display === 'none') {
            showTerminal();
        }
    });

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        terminal.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        terminal.style.opacity = '0';
        terminal.style.transform = `${originalTransform} scale(0.9)`;
        setTimeout(() => {
            terminal.style.display = 'none';
        }, 300);
    });

    // Minimize button functionality
    minimizeBtn.addEventListener('click', () => {
        terminal.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        terminal.style.transform = 'translateY(100vh)';
        terminal.style.opacity = '0';
        setTimeout(() => {
            terminal.style.display = 'none';
            // Reset transform after hiding
            terminal.style.transition = 'none';
            terminal.style.transform = originalTransform;
        }, 300);
    });

    // Maximize button functionality
    maximizeBtn.addEventListener('click', () => {
        if (!isMaximized) {
            // Store original position and size
            originalWidth = terminal.style.width;
            originalHeight = terminal.style.height;
            originalTop = terminal.style.top;
            originalLeft = terminal.style.left;
            originalTransform = terminal.style.transform;

            // Maximize
            terminal.style.transition = 'all 0.3s ease-out';
            terminal.style.width = '100%';
            terminal.style.height = '100vh';
            terminal.style.top = '0';
            terminal.style.left = '0';
            terminal.style.transform = 'none';
            terminal.style.borderRadius = '0';
        } else {
            // Restore original size and position
            terminal.style.transition = 'all 0.3s ease-out';
            terminal.style.width = originalWidth;
            terminal.style.height = originalHeight;
            terminal.style.top = originalTop;
            terminal.style.left = originalLeft;
            terminal.style.transform = originalTransform;
            terminal.style.borderRadius = '8px';
        }
        isMaximized = !isMaximized;
    });

    // Cat Memes Folder functionality
    const catMemesFolder = document.getElementById('catMemesFolder');
    const catMemes = [
        'https://cataas.com/cat/cute/says/Hello?size=50&color=white',
        'https://cataas.com/cat/cute/says/Hi?size=50&color=white',
        'https://cataas.com/cat/cute/says/Meow?size=50&color=white',
        'https://cataas.com/cat/cute/says/Purr?size=50&color=white',
        'https://cataas.com/cat/cute/says/Love?size=50&color=white'
    ];

    // Create folder window
    const folderWindow = document.createElement('div');
    folderWindow.className = 'folder-window';
    folderWindow.style.display = 'none';
    folderWindow.innerHTML = `
        <div class="folder-header">
            <div class="folder-title">
                <i class="fas fa-cat"></i>
                <span>Cat Memes</span>
            </div>
            <div class="folder-controls">
                <span class="folder-button close"></span>
                <span class="folder-button minimize"></span>
                <span class="folder-button maximize"></span>
            </div>
        </div>
        <div class="folder-content">
            <div class="meme-grid"></div>
        </div>
    `;
    document.body.appendChild(folderWindow);

    // Add styles for the folder window
    const style = document.createElement('style');
    style.textContent = `
        .folder-window {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background: rgba(45, 45, 45, 0.95);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            z-index: 1000;
        }

        .folder-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 1rem;
            background: rgba(30, 30, 30, 0.95);
            border-bottom: 1px solid #3d3d3d;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            cursor: move;
        }

        .folder-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
        }

        .folder-controls {
            display: flex;
            gap: 0.5rem;
        }

        .folder-button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            cursor: pointer;
        }

        .folder-button.close {
            background: #ff5f56;
        }

        .folder-button.minimize {
            background: #ffbd2e;
        }

        .folder-button.maximize {
            background: #27c93f;
        }

        .folder-content {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
        }

        .meme-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            padding: 1rem;
        }

        .meme-item {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0.5rem;
            transition: transform 0.2s;
            cursor: pointer;
        }

        .meme-item:hover {
            transform: scale(1.05);
        }

        .meme-item img {
            width: 100%;
            height: auto;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);

    // Open folder on click
    catMemesFolder.addEventListener('click', () => {
        const memeGrid = folderWindow.querySelector('.meme-grid');
        memeGrid.innerHTML = ''; // Clear existing memes
        
        // Add memes to the grid
        catMemes.forEach(memeUrl => {
            const memeItem = document.createElement('div');
            memeItem.className = 'meme-item';
            memeItem.innerHTML = `<img src="${memeUrl}" alt="Cute Cat Meme">`;
            memeGrid.appendChild(memeItem);
        });

        folderWindow.style.display = 'flex';
    });

    // Close folder
    folderWindow.querySelector('.folder-button.close').addEventListener('click', () => {
        folderWindow.style.display = 'none';
    });

    // Minimize folder
    folderWindow.querySelector('.folder-button.minimize').addEventListener('click', () => {
        folderWindow.style.transform = 'translate(-50%, 100%)';
        setTimeout(() => {
            folderWindow.style.display = 'none';
            folderWindow.style.transform = 'translate(-50%, -50%)';
        }, 300);
    });

    // Maximize folder
    let isFolderMaximized = false;
    folderWindow.querySelector('.folder-button.maximize').addEventListener('click', () => {
        if (!isFolderMaximized) {
            folderWindow.style.width = '100%';
            folderWindow.style.height = '100%';
            folderWindow.style.borderRadius = '0';
        } else {
            folderWindow.style.width = '80%';
            folderWindow.style.height = '80%';
            folderWindow.style.borderRadius = '8px';
        }
        isFolderMaximized = !isFolderMaximized;
    });

    // Make folder draggable
    const folderHeader = folderWindow.querySelector('.folder-header');
    let isDraggingFolder = false;
    let folderCurrentX;
    let folderCurrentY;
    let folderInitialX;
    let folderInitialY;
    let folderXOffset = 0;
    let folderYOffset = 0;

    folderHeader.addEventListener('mousedown', dragFolderStart);
    document.addEventListener('mousemove', dragFolder);
    document.addEventListener('mouseup', dragFolderEnd);

    function dragFolderStart(e) {
        if (isFolderMaximized) return;
        
        folderInitialX = e.clientX - folderXOffset;
        folderInitialY = e.clientY - folderYOffset;

        if (e.target === folderHeader || folderHeader.contains(e.target)) {
            isDraggingFolder = true;
        }
    }

    function dragFolder(e) {
        if (isDraggingFolder) {
            e.preventDefault();

            folderCurrentX = e.clientX - folderInitialX;
            folderCurrentY = e.clientY - folderInitialY;

            folderXOffset = folderCurrentX;
            folderYOffset = folderCurrentY;

            setFolderTranslate(folderCurrentX, folderCurrentY, folderWindow);
        }
    }

    function dragFolderEnd(e) {
        folderInitialX = folderCurrentX;
        folderInitialY = folderCurrentY;
        isDraggingFolder = false;
    }

    function setFolderTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
}); 