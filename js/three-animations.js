import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.hero');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.insertBefore(this.renderer.domElement, this.container.firstChild);

        // Setup camera
        this.camera.position.z = 30;

        // Create particles
        const particleCount = 2000;
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
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;

            // Assign random color from options
            color.copy(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);

        // Add event listeners
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation
        this.animate();
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
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.targetX = this.mouseX * 0.001;
        this.targetY = this.mouseY * 0.001;

        this.particleSystem.rotation.x += 0.0005;
        this.particleSystem.rotation.y += 0.0005;

        // Smooth rotation based on mouse position
        this.particleSystem.rotation.x += (this.targetY - this.particleSystem.rotation.x) * 0.05;
        this.particleSystem.rotation.y += (this.targetX - this.particleSystem.rotation.y) * 0.05;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
}); 