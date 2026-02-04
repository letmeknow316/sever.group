// Shared custom cursor (single dot)
const cursor = document.getElementById('cursor');

if (cursor) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate(${cursorX - 8}px, ${cursorY - 8}px)`;
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .city-card');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX - 8}px, ${cursorY - 8}px) scale(2)`;
            cursor.style.backgroundColor = 'var(--sever-magenta)';
        });

        target.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX - 8}px, ${cursorY - 8}px) scale(1)`;
            cursor.style.backgroundColor = 'var(--sever-cyan)';
        });
    });
}
