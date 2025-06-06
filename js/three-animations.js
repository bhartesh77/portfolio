import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.hero');
        this.isMobile = this.checkMobile();
        this.isIOS = this.checkIOS();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: !this.isMobile, // Disable antialiasing on mobile
            powerPreference: 'high-performance'
        });
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.animationFrameId = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isTouching = false;
        this.hasPermission = false;

        // Initialize only if WebGL is supported
        if (this.isWebGLSupported()) {
            this.init();
        } else {
            this.addFallbackBackground();
        }
    }

    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    checkMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    checkIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    addFallbackBackground() {
        const gradient = document.createElement('div');
        gradient.className = 'fallback-gradient';
        gradient.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--bg-color) 0%, var(--card-bg) 100%);
            z-index: 0;
        `;
        this.container.insertBefore(gradient, this.container.firstChild);
    }

    init() {
        // Setup renderer with mobile optimizations
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
        this.container.insertBefore(this.renderer.domElement, this.container.firstChild);

        // Setup camera
        this.camera.position.z = this.isMobile ? 40 : 30;

        // Create particles with reduced count on mobile
        const particleCount = this.isMobile ? 800 : 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color = new THREE.Color();
        const colorOptions = [
            new THREE.Color(0x6366f1), // Primary color
            new THREE.Color(0x4f46e5), // Secondary color
            new THREE.Color(0x818cf8)  // Accent color
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * (this.isMobile ? 30 : 50);
            positions[i3 + 1] = (Math.random() - 0.5) * (this.isMobile ? 30 : 50);
            positions[i3 + 2] = (Math.random() - 0.5) * (this.isMobile ? 30 : 50);

            color.copy(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: this.isMobile ? 0.15 : 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);

        // Add event listeners
        if (this.isMobile) {
            this.setupMobileEvents();
        } else {
            document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
        }
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation
        this.animate();
    }

    setupMobileEvents() {
        // Touch events
        this.container.addEventListener('touchstart', (event) => {
            this.isTouching = true;
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
        }, { passive: true });

        this.container.addEventListener('touchmove', (event) => {
            if (!this.isTouching) return;
            
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            
            this.mouseX = (touchX - this.windowHalfX) * 2;
            this.mouseY = (touchY - this.windowHalfY) * 2;
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            this.isTouching = false;
        }, { passive: true });

        // Device orientation for iOS
        if (this.isIOS) {
            this.setupIOSOrientation();
        } else if (window.DeviceOrientationEvent) {
            this.setupDeviceOrientation();
        }
    }

    setupIOSOrientation() {
        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // Add a button or some UI element to request permission
            const permissionButton = document.createElement('button');
            permissionButton.innerHTML = 'Enable Motion';
            permissionButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 20px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 5px;
                z-index: 1000;
                cursor: pointer;
                font-size: 14px;
                opacity: 0.8;
                transition: opacity 0.3s;
            `;
            permissionButton.addEventListener('mouseover', () => {
                permissionButton.style.opacity = '1';
            });
            permissionButton.addEventListener('mouseout', () => {
                permissionButton.style.opacity = '0.8';
            });

            permissionButton.addEventListener('click', async () => {
                try {
                    const permission = await DeviceOrientationEvent.requestPermission();
                    if (permission === 'granted') {
                        this.hasPermission = true;
                        this.setupDeviceOrientation();
                        permissionButton.remove();
                    }
                } catch (error) {
                    console.error('Error requesting device orientation permission:', error);
                }
            });

            document.body.appendChild(permissionButton);
        } else {
            // For older iOS versions
            this.setupDeviceOrientation();
        }
    }

    setupDeviceOrientation() {
        window.addEventListener('deviceorientation', (event) => {
            if (!this.isTouching && (this.hasPermission || !this.isIOS)) {
                let beta = event.beta;  // -180 to 180 (front/back)
                let gamma = event.gamma; // -90 to 90 (left/right)
                
                // Handle iOS specific behavior
                if (this.isIOS) {
                    // iOS returns values in different ranges
                    beta = beta || 0;
                    gamma = gamma || 0;
                    
                    // Scale the values for smoother movement
                    this.mouseX = gamma * 15;
                    this.mouseY = beta * 15;
                } else if (beta !== null && gamma !== null) {
                    this.mouseX = gamma * 10;
                    this.mouseY = beta * 10;
                }
            }
        }, { passive: true });
    }

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX);
        this.mouseY = (event.clientY - this.windowHalfY);
    }

    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

        if (this.isMobile) {
            // Smooth rotation based on touch/gyroscope
            this.targetX = this.mouseX * 0.001;
            this.targetY = this.mouseY * 0.001;

            // Add a small constant rotation when not interacting
            if (!this.isTouching && (!this.isIOS || this.hasPermission)) {
                this.particleSystem.rotation.x += 0.0002;
                this.particleSystem.rotation.y += 0.0002;
            }

            // Smooth rotation based on touch/gyroscope position
            this.particleSystem.rotation.x += (this.targetY - this.particleSystem.rotation.x) * 0.05;
            this.particleSystem.rotation.y += (this.targetX - this.particleSystem.rotation.y) * 0.05;
        } else {
            this.targetX = this.mouseX * 0.001;
            this.targetY = this.mouseY * 0.001;

            this.particleSystem.rotation.x += 0.0005;
            this.particleSystem.rotation.y += 0.0005;

            this.particleSystem.rotation.x += (this.targetY - this.particleSystem.rotation.x) * 0.05;
            this.particleSystem.rotation.y += (this.targetX - this.particleSystem.rotation.y) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }

    // Cleanup method
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.particleSystem) {
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
    }
}

// Initialize particle system when DOM is loaded
let particleSystem;
document.addEventListener('DOMContentLoaded', () => {
    particleSystem = new ParticleSystem();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (particleSystem) {
        particleSystem.destroy();
    }
}); 