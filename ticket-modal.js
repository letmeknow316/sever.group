class TicketModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        this.currentStep = 1;
        this.selectedEvent = null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                
                :host(.active) {
                    pointer-events: all;
                    opacity: 1;
                }
                
                .overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(10px);
                }
                
                .modal {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.9);
                    width: 90%;
                    max-width: 600px;
                    max-height: 62vh;
                    background: #0a0a0f;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8),
                                0 0 50px rgba(0, 240, 255, 0.1);
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    overflow: hidden;
                }

                .modal-body {
                    max-height: calc(62vh - 6.5rem);
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding-right: 0.5rem;
                }

                .modal-body::-webkit-scrollbar {
                    width: 6px;
                }

                .modal-body::-webkit-scrollbar-track {
                    background: transparent;
                }

                .modal-body::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 999px;
                }
                
                :host(.active) .modal {
                    transform: translate(-50%, -50%) scale(1);
                }
                
                .close-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: rotate(90deg);
                }
                
                h2 {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(90deg, #00f0ff, #ff00aa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .step-indicator {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                
                .step {
                    flex: 1;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    position: relative;
                    overflow: hidden;
                }
                
                .step.active::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, #00f0ff, #ff00aa);
                    animation: fillStep 0.5s ease forwards;
                }
                
                @keyframes fillStep {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                
                .step-content {
                    display: none;
                }

                .step-content.active {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .step-content.active {
                    animation: fadeIn 0.5s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .ticket-option {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 1.1rem;
                    gap: 0.5rem;
                    background: #0c0c12;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .ticket-option:hover {
                    background: #11121a;
                    border-color: rgba(0, 240, 255, 0.35);
                    transform: translateY(-2px);
                }
                
                .ticket-option.selected {
                    background: rgba(0, 240, 255, 0.1);
                    border-color: #00f0ff;
                }

                .ticket-option.table-reservation {
                    background: rgba(0, 255, 170, 0.08);
                    border-color: rgba(0, 255, 170, 0.35);
                }

                .ticket-option.table-reservation:hover {
                    background: rgba(0, 255, 170, 0.15);
                    border-color: rgba(0, 255, 170, 0.55);
                }
                
                .ticket-info h3 {
                    font-size: 1rem;
                    margin-bottom: 0.2rem;
                    color: white;
                }
                
                .ticket-info p {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.5);
                }
                
                .price {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #00f0ff;
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                label {
                    display: block;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                input {
                    width: 100%;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                
                input:focus {
                    outline: none;
                    border-color: #00f0ff;
                    background: rgba(0, 240, 255, 0.05);
                }
                
                .btn-primary {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(90deg, #00f0ff, #ff00aa);
                    border: none;
                    border-radius: 8px;
                    color: black;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 240, 255, 0.3);
                }
                
                .btn-secondary {
                    width: 100%;
                    padding: 1rem;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 0.5rem;
                }
                
                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .confirmation {
                    text-align: center;
                    padding: 2rem;
                }
                
                .checkmark {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #00f0ff, #ff00aa);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    animation: scaleIn 0.5s ease;
                }
                
                @keyframes scaleIn {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                
                .loader {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    margin: 2rem 0;
                }
                
                .loader-bar {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #00f0ff, #ff00aa);
                    animation: load 2s ease forwards;
                }
                
                @keyframes load {
                    to { width: 100%; }
                }
            </style>
            
            <div class="overlay" id="overlay"></div>
            <div class="modal">
                <button class="close-btn" id="closeBtn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <h2>ЗАФИКСИРУЙ СВОЙ ДОСТУП</h2>

                <div class="modal-body">
                <div class="step-indicator">
                    <div class="step active" data-step="1"></div>
                    <div class="step" data-step="2"></div>
                    <div class="step" data-step="3"></div>
                </div>
                
                <!-- Step 1: Select Ticket -->
                <div class="step-content active" data-step="1">
                    <div class="ticket-option" data-ticket="standard" data-price="7">
                        <div class="ticket-info">
                            <h3>Стандартный вход</h3>
                            <p>Один вход • Ограниченная вместимость</p>
                        </div>
                        <div class="price">€7</div>
                    </div>

                    <div class="ticket-option" data-ticket="vip" data-price="12">
                        <div class="ticket-info">
                            <h3>VIP</h3>
                            <p>Проход без очереди • Гарантированный велком дринк</p>
                        </div>
                        <div class="price">€12</div>
                    </div>

                    <div class="ticket-option" data-ticket="backstage" data-price="22">
                        <div class="ticket-info">
                            <h3>Backstage</h3>
                            <p>Проход без очереди • Велком дринк • Личный столик без доп. брони • Общение с организаторами</p>
                        </div>
                        <div class="price">€22</div>
                    </div>

                    <div class="ticket-option table-reservation" data-ticket="table" data-price="3">
                        <div class="ticket-info">
                            <h3>Бронь столика</h3>
                            <p>3€ с человека • Отдельная бронь столика</p>
                        </div>
                        <div class="price">€3</div>
                    </div>
                </div>
                
                <!-- Step 2: Details -->
                <div class="step-content" data-step="2">
                    <div class="form-group">
                        <label>Имя и фамилия</label>
                        <input type="text" placeholder="Введите имя" id="nameInput">
                    </div>
                    <div class="form-group">
                        <label>Почта</label>
                        <input type="email" placeholder="you@mail.com" id="emailInput">
                    </div>
                    <div class="form-group">
                        <label>Телефон</label>
                        <input type="tel" placeholder="+49 ..." id="phoneInput">
                    </div>
                    <button class="btn-primary" id="continueBtn">К оплате</button>
                    <button class="btn-secondary" id="backBtn">Назад</button>
                </div>
                
                <!-- Step 3: Payment / Confirmation -->
                <div class="step-content" data-step="3">
                    <div class="loader">
                        <div class="loader-bar"></div>
                    </div>
                    <p style="text-align: center; color: rgba(255,255,255,0.5); margin-bottom: 2rem;">
                        Идёт безопасная обработка...
                    </p>
                    <div class="confirmation" style="display: none;" id="confirmation">
                        <div class="checkmark">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Билет забронирован!</h3>
                        <p style="color: rgba(255,255,255,0.5); margin-bottom: 2rem;">
                            Проверьте почту — там QR‑код для входа
                        </p>
                        <button class="btn-primary" id="finishBtn">Готово</button>
                    </div>
                </div>
            </div>
            </div>
        `;
    }

    setupEventListeners() {
        const overlay = this.shadowRoot.getElementById('overlay');
        const closeBtn = this.shadowRoot.getElementById('closeBtn');
        const ticketOptions = this.shadowRoot.querySelectorAll('.ticket-option');
        const continueBtn = this.shadowRoot.getElementById('continueBtn');
        const backBtn = this.shadowRoot.getElementById('backBtn');
        const finishBtn = this.shadowRoot.getElementById('finishBtn');

        overlay.addEventListener('click', () => this.close());
        closeBtn.addEventListener('click', () => this.close());
        
        ticketOptions.forEach(option => {
            option.addEventListener('click', () => {
                ticketOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedEvent = {
                    type: option.dataset.ticket,
                    price: option.dataset.price
                };
                setTimeout(() => this.goToStep(2), 300);
            });
        });

        continueBtn.addEventListener('click', () => {
            const name = this.shadowRoot.getElementById('nameInput').value;
            const email = this.shadowRoot.getElementById('emailInput').value;
            
            if (name && email) {
                this.goToStep(3);
                this.simulatePayment();
            } else {
                alert('Пожалуйста, заполните все поля');
            }
        });

        backBtn.addEventListener('click', () => this.goToStep(1));
        finishBtn.addEventListener('click', () => this.close());

        // Listen for custom events from other components
        document.addEventListener('open-ticket-modal', () => this.open());
    }

    open() {
        this.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.currentStep = 1;
        this.updateStepIndicator();
    }

    close() {
        this.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            this.currentStep = 1;
            this.updateStepIndicator();
            this.shadowRoot.querySelectorAll('.ticket-option').forEach(o => o.classList.remove('selected'));
            this.shadowRoot.querySelectorAll('input').forEach(i => i.value = '');
        }, 500);
    }

    goToStep(step) {
        this.shadowRoot.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });
        this.shadowRoot.querySelector(`.step-content[data-step="${step}"]`).classList.add('active');
        
        this.currentStep = step;
        this.updateStepIndicator();
    }

    updateStepIndicator() {
        this.shadowRoot.querySelectorAll('.step').forEach((step, index) => {
            if (index < this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    simulatePayment() {
        setTimeout(() => {
            this.shadowRoot.querySelector('.loader').style.display = 'none';
            this.shadowRoot.querySelector('p').style.display = 'none';
            this.shadowRoot.getElementById('confirmation').style.display = 'block';
        }, 2500);
    }
}

customElements.define('ticket-modal', TicketModal);