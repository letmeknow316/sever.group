// Scroll-reactive animated background
(() => {
    const root = document.documentElement;
    let ticking = false;

    const update = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        const shift = (progress * 40) - 20; // -20vh to 20vh
        const hue = progress * 120; // 0-120deg
        const alpha = 0.25 + (progress * 0.25);

        root.style.setProperty('--bg-shift', shift.toFixed(2));
        root.style.setProperty('--bg-hue', hue.toFixed(2));
        root.style.setProperty('--bg-alpha', alpha.toFixed(2));
        ticking = false;
    };

    const requestUpdate = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    requestUpdate();
})();
