class NavComponent extends HTMLElement {
    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.innerHTML = `
            <nav class="fixed top-0 left-0 right-0 z-50 sever-nav">
                <div class="mx-auto max-w-7xl px-4 md:px-12 py-4 relative">
                    <div class="sever-nav-bar flex items-center justify-between rounded-full border border-white/10 bg-sever-surface/40 backdrop-blur-xl px-5 py-3">
                        <a href="index.html" class="sever-nav-brand text-lg md:text-xl font-display font-bold tracking-widest text-white/80 hover:text-white transition-colors">
                            SEVER
                        </a>
                        <div class="sever-nav-actions flex items-center gap-3 md:gap-4 relative">
                            <a href="about.html" class="sever-nav-link magnetic-btn px-4 md:px-5 py-2 rounded-full border border-sever-electric/40 text-xs md:text-sm tracking-widest text-sever-electric hover:text-white hover:border-sever-electric hover:bg-sever-electric/10 transition-all">О НАС</a>
                            <button type="button" data-tickets-toggle class="sever-nav-link magnetic-btn px-4 md:px-5 py-2 rounded-full border border-sever-cyan/40 text-xs md:text-sm tracking-widest text-sever-cyan hover:text-white hover:border-sever-cyan hover:bg-sever-cyan/10 transition-all">
                                БИЛЕТЫ
                            </button>
                            <a href="support.html" class="sever-nav-link magnetic-btn px-4 md:px-5 py-2 rounded-full border border-sever-magenta/40 text-xs md:text-sm tracking-widest text-sever-magenta hover:text-white hover:border-sever-magenta hover:bg-sever-magenta/10 transition-all">
                                ПОДДЕРЖКА
                            </a>
                        </div>
                    </div>
                </div>

                <div data-tickets-panel class="sever-ticket-panel hidden absolute top-full right-0 mt-3 w-[min(420px,90vw)]">
                    <div class="rounded-2xl border border-white/10 bg-[#0b0b10] shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
                        <div class="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <p class="text-xs tracking-[0.35em] text-white/50">ВЫБЕРИТЕ ГОРОД</p>
                            <button type="button" data-tickets-close class="text-xs tracking-widest text-white/50 hover:text-white">ЗАКРЫТЬ</button>
                        </div>
                        <div class="flex flex-col">
                            <a class="px-5 py-4 text-base text-white/85 hover:text-white hover:bg-sever-cyan/10 transition-all border-b border-white/5" href="event-stuttgart.html">Штуттгарт</a>
                            <a class="px-5 py-4 text-base text-white/85 hover:text-white hover:bg-sever-cyan/10 transition-all border-b border-white/5" href="event-munich.html">Мюнхен</a>
                            <a class="px-5 py-4 text-base text-white/85 hover:text-white hover:bg-sever-cyan/10 transition-all border-b border-white/5" href="event-sofia.html">София</a>
                            <a class="px-5 py-4 text-base text-white/85 hover:text-white hover:bg-sever-cyan/10 transition-all border-b border-white/5 flex items-center justify-between" href="event-varna.html">
                                <span>Варна</span>
                                <span class="relative inline-flex h-2.5 w-2.5">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                            </a>
                            <a class="px-5 py-4 text-base text-white/85 hover:text-white hover:bg-sever-cyan/10 transition-all border-b border-white/5 flex items-center justify-between" href="event-plovdiv.html">
                                <span>Пловдив</span>
                                <span class="relative inline-flex h-2.5 w-2.5">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                            </a>
                            <a class="px-5 py-4 text-base text-white/85 hover:text-white hover:bg-sever-cyan/10 transition-all" href="event-vienna.html">Вена</a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    bindEvents() {
        const toggle = this.querySelector('[data-tickets-toggle]');
        const panel = this.querySelector('[data-tickets-panel]');
        const closeBtn = this.querySelector('[data-tickets-close]');
        const links = this.querySelectorAll('[data-tickets-panel] a');

        const closePanel = () => {
            panel.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
        };

        const openPanel = () => {
            panel.classList.remove('hidden');
            toggle.setAttribute('aria-expanded', 'true');
        };

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            if (panel.classList.contains('hidden')) {
                openPanel();
            } else {
                closePanel();
            }
        });

        closeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            closePanel();
        });

        links.forEach(link => {
            link.addEventListener('click', () => closePanel());
        });

        document.addEventListener('click', (event) => {
            if (!this.contains(event.target)) {
                closePanel();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closePanel();
            }
        });
    }
}

customElements.define('nav-component', NavComponent);
