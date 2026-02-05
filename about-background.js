// About page photo cosmos
(() => {
    const canvas = document.getElementById('webgl-bg');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const group = new THREE.Group();
    scene.add(group);

    const loader = new THREE.TextureLoader();


    



    
    const images = [
        'images/gallery-1.jpg',
        'images/gallery-2.jpg',
        'images/gallery-3.jpg',
        'images/gallery-4.jpg',
        'images/city-stuttgart.jpg',
        'images/city-munich.jpg',
        'images/city-sofia.jpg',
        'images/city-varna.jpg',
        'images/city-plovdiv.jpg',
        'images/city-vienna.jpg',
        'images/gallery-1.jpg',
        'images/gallery-2.jpg'
    ];

    const sprites = [];
    const fallbackImage = 'images/gallery-1.jpg';


    // Star points
    const starCount = 900;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 40 + 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i3 + 2] = radius * Math.cos(phi);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0x7de9ff,
        size: 0.12,
        transparent: true,
        opacity: 0.25
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    group.add(stars);

    images.forEach((src) => {
        for (let i = 0; i < 1; i++) {
        loader.load(src, (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            texture.minFilter = THREE.LinearFilter;
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.85,
                depthTest: false,
                blending: THREE.NormalBlending
            });
            const sprite = new THREE.Sprite(material);
            const radius = 12 + Math.random() * 28;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            sprite.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            const base = 3.2 + Math.random() * 3.6;
            sprite.scale.set(base * 1.6, base, 1);
            sprite.userData = { drift: Math.random() * Math.PI * 2 };
            group.add(sprite);
            sprites.push(sprite);
        }, undefined, () => {
            const material = new THREE.SpriteMaterial({
                map: fallbackTexture,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });
            const sprite = new THREE.Sprite(material);
            const radius = 12 + Math.random() * 28;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            sprite.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            const base = 3.2 + Math.random() * 3.6;
            sprite.scale.set(base * 1.6, base, 1);
            sprite.userData = { drift: Math.random() * Math.PI * 2 };
            group.add(sprite);
            sprites.push(sprite);
        });
        }
    });

    camera.position.z = 20;

    let scrollProgress = 0;
    let targetScrollProgress = 0;
    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.002;
        scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;

        group.rotation.y = scrollProgress * 1.6 + time * 0.2;
        group.rotation.x = 0.3 + scrollProgress * 0.5;
        camera.position.z = 20 - scrollProgress * 8;

        sprites.forEach(sprite => {
            sprite.material.opacity = 0.35 + Math.sin(time * 2 + sprite.userData.drift) * 0.08;
        });

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
