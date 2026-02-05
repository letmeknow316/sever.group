// DOM-based photo cosmos for About page (works on file://)
(() => {
    const container = document.querySelector('.about-photo-cosmos');
    if (!container || !window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray('.about-photo-cosmos .photo-card');

    // Global swirl for all photos (match starfield movement)
    gsap.to(container, {
        rotation: 24,
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    cards.forEach((card, index) => {
        const depth = parseFloat(card.dataset.depth || '0.5');
        const float = 8 + depth * 18;
        const sway = 6 + depth * 10;
        const scaleBase = 0.85 + depth * 0.35;
        const tilt = (index % 3 === 0) ? 35 : (index % 3 === 1 ? -28 : 0);
        const flyOut = index % 2 === 0 ? 1 : -1;

        gsap.set(card, {
            transformOrigin: index % 2 === 0 ? '20% 80%' : '80% 20%',
            rotationY: tilt,
            rotationX: tilt !== 0 ? -12 : 0
        });

        // ambient drift
        gsap.to(card, {
            y: `-=${float}`,
            x: `+=${sway}`,
            rotation: (depth * 10) - 4,
            duration: 5 + depth * 4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });

        gsap.to(card, {
            x: `-=${sway * 0.6}`,
            rotation: (depth * 14) - 6,
            duration: 7 + depth * 4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });

        // scroll-driven unified motion: some fly in, some fly out
        gsap.to(card, {
            yPercent: -depth * 180,
            xPercent: flyOut * (40 + depth * 30),
            rotation: depth * 24,
            scale: scaleBase + (flyOut > 0 ? 0.35 : -0.1),
            rotationY: 0,
            rotationX: 0,
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // subtle zoom pulse
        gsap.to(card, {
            scale: scaleBase,
            duration: 4 + depth * 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    });
})();
