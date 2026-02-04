class NavComponent extends HTMLElement {
    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.innerHTML = `
            <nav class="fixed top-0 left-0 right-0 z-50">
                <div class="mx-auto max-w-7xl px-4 md:px-12 py-4">
                    <div class="flex items-center justify-between rounded-full border border-white/10 bg-sever-surface/40 backdrop-blur-xl px-5 py-3">
                        <a href="index.html" class="text-lg md:text-xl font-display font-bold tracking-widest text-white/80 hover:text-white transition-colors">
                            SEVER
                        </a>
                        <div class="flex items-center gap-3 md:gap-4">
                            <button type="button" data-tickets-toggle class="magnetic-btn px-4 md:px-5 py-2 rounded-full border border-sever-cyan/40 text-xs md:text-sm tracking-widest text-sever-cyan hover:text-white hover:border-sever-cyan hover:bg-sever-cyan/10 transition-all">
                                БИЛЕТЫ
                            </button>
                            <a href="support.html" class="magnetic-btn px-4 md:px-5 py-2 rounded-full border border-sever-magenta/40 text-xs md:text-sm tracking-widest text-sever-magenta hover:text-white hover:border-sever-magenta hover:bg-sever-magenta/10 transition-all">
                                ПОДДЕРЖКА
                            </a>
                        </div>
                    </div>
                </div>

                <div data-tickets-panel class="hidden absolute left-0 right-0 top-full">
                    <div class="mx-auto max-w-3xl px-4 md:px-12">
                        <div class="mt-3 rounded-2xl border border-white/10 bg-sever-surface/80 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                            <div class="flex items-center justify-between mb-4">
                                <p class="text-xs tracking-[0.35em] text-white/50">ВЫБЕРИТЕ ГОРОД</p>
                                <button type="button" data-tickets-close class="text-xs tracking-widest text-white/50 hover:text-white">ЗАКРЫТЬ</button>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a class="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 hover:text-white hover:border-sever-cyan/60 hover:bg-sever-cyan/10 transition-all" href="event-stuttgart.html">Штуттгарт</a>
                                <a class="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 hover:text-white hover:border-sever-cyan/60 hover:bg-sever-cyan/10 transition-all" href="event-munich.html">Мюнхен</a>
                                <a class="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 hover:text-white hover:border-sever-cyan/60 hover:bg-sever-cyan/10 transition-all" href="event-sofia.html">София</a>
                                <a class="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 hover:text-white hover:border-sever-cyan/60 hover:bg-sever-cyan/10 transition-all" href="event-varna.html">Варна</a>
                                <a class="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 hover:text-white hover:border-sever-cyan/60 hover:bg-sever-cyan/10 transition-all" href="event-plovdiv.html">Пловдив <span class="relative inline-flex h-2.5 w-2.5 ml-2 align-middle">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span></a>
                                <a class="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 hover:text-white hover:border-sever-cyan/60 hover:bg-sever-cyan/10 transition-all" href="event-vienna.html">Вена</a>
                            </div>
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
