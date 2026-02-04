// SEVER EVENTS — Main Script
// WebGL, GSAP ScrollTrigger, Custom Cursor, and Smooth Interactions

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// WebGL Background — Cosmic Field
const canvas = document.getElementById('webgl-bg');
let renderer;
let scene;
let camera;
let cosmicGroup;
let starMaterial;
let scrollProgress = 0;
let targetScrollProgress = 0;

function initCosmicField() {
    if (!canvas || !window.THREE) return false;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    cosmicGroup = new THREE.Group();
    scene.add(cosmicGroup);

    // Star points
    const starCount = 2200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const cyan = new THREE.Color(0x00f0ff);
    const magenta = new THREE.Color(0xff00aa);
    const electric = new THREE.Color(0x7000ff);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 40 + 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i3 + 2] = radius * Math.cos(phi);

        const mix = Math.random();
        const mixedColor = mix < 0.33 ? cyan : mix < 0.66 ? magenta : electric;
        starColors[i3] = mixedColor.r;
        starColors[i3 + 1] = mixedColor.g;
        starColors[i3 + 2] = mixedColor.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    starMaterial = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    cosmicGroup.add(stars);

    // Floating squares
    const squareCount = 120;
    const squareGeometry = new THREE.PlaneGeometry(1.2, 1.2);
    const squareColors = [0x00f0ff, 0xff00aa, 0x7000ff];

    squareColors.forEach(color => {
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const mesh = new THREE.InstancedMesh(squareGeometry, material, squareCount);
        for (let i = 0; i < squareCount; i++) {
            const radius = Math.random() * 32 + 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            const rotation = new THREE.Euler(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            const matrix = new THREE.Matrix4();
            matrix.makeRotationFromEuler(rotation);
            matrix.setPosition(x, y, z);
            mesh.setMatrixAt(i, matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        cosmicGroup.add(mesh);
    });

    camera.position.z = 20;
    return true;
}

function startCosmicAnimation() {
    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);

        time += 0.002;
        scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;

        if (cosmicGroup) {
            cosmicGroup.rotation.y = scrollProgress * 2.4 + time * 0.3;
            cosmicGroup.rotation.x = 0.35 + scrollProgress * 0.9 + Math.sin(time * 0.8) * 0.12;
            cosmicGroup.rotation.z = -scrollProgress * 0.9;
        }

        if (camera) {
            const depth = 20 - (scrollProgress * 12);
            camera.position.z = depth;
            camera.position.y = Math.sin(scrollProgress * Math.PI) * 2.2;
        }

        if (starMaterial) {
            starMaterial.size = 0.12 + Math.sin(time * 2.2) * 0.02;
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    animate();

    window.addEventListener('resize', () => {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

if (initCosmicField()) {
    startCosmicAnimation();
} else if (canvas) {
    // Fallback 2D canvas starfield
    const ctx = canvas.getContext('2d');
    const stars = Array.from({ length: 600 }).map(() => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        size: Math.random() * 1.6 + 0.4,
        hue: Math.random() * 360
    }));

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });

    function draw() {
        scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            const dx = (star.x - 0.5) * canvas.width;
            const dy = (star.y - 0.5) * canvas.height;
            const depth = 1 + scrollProgress * 2.5;
            const x = canvas.width / 2 + dx * depth;
            const y = canvas.height / 2 + dy * depth;
            const alpha = 0.6 + scrollProgress * 0.3;
            ctx.fillStyle = `hsla(${180 + star.hue * 0.2}, 90%, 60%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, star.size + scrollProgress * 0.6, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// GSAP ScrollTrigger Animations

// Hero Section Animation
const heroTl = gsap.timeline();
heroTl.to('.hero-title', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.5
})
.to('.hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power4.out"
}, "-=0.8")
.to('.hero-cta', {
    opacity: 1,
    duration: 1,
    ease: "power2.out"
}, "-=0.5");

// Hero parallax on scroll
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 200,
    opacity: 0
});

// City Cards Stagger Animation
gsap.to('.city-card', {
    scrollTrigger: {
        trigger: '#europe',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out"
});

// Section title animation
gsap.to('.section-title', {
    scrollTrigger: {
        trigger: '.section-title',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power4.out"
});

// Support section animations
gsap.to('.support-title', {
    scrollTrigger: {
        trigger: '#support-teaser',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
});

gsap.to('.support-text', {
    scrollTrigger: {
        trigger: '#support-teaser',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "power3.out"
});

gsap.to('.support-btn', {
    scrollTrigger: {
        trigger: '#support-teaser',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.4,
    ease: "power3.out"
});

// 3D Tilt Effect for City Cards
document.querySelectorAll('.city-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Magnetic Button Effect
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// Speed-based scroll distortion
let lastScrollY = 0;
let scrollSpeed = 0;

window.addEventListener('scroll', () => {
    scrollSpeed = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    
    // Apply skew based on scroll speed
    const skewAmount = Math.min(scrollSpeed * 0.1, 5);
    document.querySelectorAll('.city-card').forEach(card => {
        card.style.transform = `skewY(${skewAmount}deg)`;
        setTimeout(() => {
            card.style.transform = 'skewY(0deg)';
        }, 100);
    });
}, { passive: true });

// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
});