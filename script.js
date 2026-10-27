/* =====================================================
   GOLDEN HANDS — script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------
       1. NAVBAR SCROLL EFFECT & MOBILE MENU
       --------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.position = 'fixed';
            navbar.style.background = '#0a0a0a';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            navbar.style.borderBottom = 'none';
        } else {
            navbar.style.position = 'absolute';
            navbar.style.background = 'transparent';
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = 'none';
        }

        // Auto-close menu on scroll
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        }
    });

    /* ---------------------------------------------------
       2. BULLETPROOF SLOW SCROLL (NATIVE OVERRIDE)
       --------------------------------------------------- */
    let scrollTimer = null;

    function slowScrollTo(targetPosition) {
        if (scrollTimer) clearInterval(scrollTimer);

        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1500;
        const startTime = performance.now();

        scrollTimer = setInterval(() => {
            const now = performance.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            const ease = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;

            const currentScroll = startPosition + (distance * ease);
            
            window.scrollTo(0, currentScroll);
            document.documentElement.scrollTop = currentScroll;
            document.body.scrollTop = currentScroll;

            if (progress >= 1) {
                clearInterval(scrollTimer);
                scrollTimer = null;
            }
        }, 16);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                
                const offset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                slowScrollTo(offsetPosition);

                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    /* ---------------------------------------------------
       3. SCROLL REVEAL ANIMATIONS
       --------------------------------------------------- */
    const revealElements = document.querySelectorAll('.service-card, .gallery-item, .about-text, .booking-container, .feature-box, .masseuse-card');
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    /* ---------------------------------------------------
       4. BOOKING FORM SETUP
       --------------------------------------------------- */
    const dateInput = document.getElementById('bookDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    const form = document.getElementById('luxeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const serviceEl = document.querySelector('input[name="service"]:checked');
            const service = serviceEl ? serviceEl.value : '';
            const date = document.getElementById('bookDate').value;
            const time = document.getElementById('bookTime').value;
            const name = document.getElementById('bookName').value;
            const contactMethod = document.querySelector('input[name="contact_method"]:checked').value;

            const formattedDate = new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            });

            const msg = `✨ *NEW BOOKING REQUEST - GOLDEN HANDS* ✨%0A%0A` +
                        `👤 *Name:* ${name}%0A` +
                        `💆 *Service:* ${service}%0A` +
                        `📅 *Date:* ${formattedDate}%0A` +
                        `⏰ *Time:* ${time}%0A%0A` +
                        `Please confirm my reservation. Thank you!`;

            const businessPhone = '251723986314'; 
            const businessTelegram = '+251723986314';  

            if (contactMethod === 'whatsapp') {
                const encodedMsg = encodeURIComponent(msg.replace(/%0A/g, '\n'));
                window.open(`https://wa.me/${businessPhone}?text=${encodedMsg}`, '_blank');
            } 
            else if (contactMethod === 'telegram') {
                navigator.clipboard.writeText(msg.replace(/%0A/g, '\n')).then(() => {
                    window.open(`https://t.me/${businessTelegram}`, '_blank');
                }).catch(err => {
                    window.open(`https://t.me/${businessTelegram}`, '_blank');
                });
            } 
            else if (contactMethod === 'call') {
                const encodedSmsMsg = encodeURIComponent(msg.replace(/%0A/g, '\n'));
                window.location.href = `sms:+${businessPhone}?body=${encodedSmsMsg}`;
            }
            
            form.reset();
            prevStep(1);
        });
    }
});

/* ---------------------------------------------------
   5. GLOBAL FUNCTIONS (Steps & Auto-Select)
   --------------------------------------------------- */
function selectService(serviceName) {
    const serviceMap = {
        'Nuru Massage': 'Nuru Massage',
        'Swedish Massage': 'Swedish Massage',
        'Four-Hands Massage': 'Four-Hands Massage',
        'Body-to-Body': 'Body-to-Body Massage',
        'Outdoor Service': 'Outdoor Service',
        'Deep Tissue': 'Deep Tissue Massage',
        'Hot Stones': 'Swedish Massage' 
    };
    
    const targetValue = serviceMap[serviceName] || serviceName;
    
    const radios = document.querySelectorAll('input[name="service"]');
    radios.forEach(radio => {
        if (radio.value === targetValue) {
            radio.checked = true;
        }
    });
    
    const displayEl = document.getElementById('displayService');
    if (displayEl) displayEl.textContent = targetValue;
    
    const bookingSection = document.getElementById('contact');
    const offset = 80;
    const elementPosition = bookingSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    
    if (typeof nextStep === 'function') {
        nextStep(2);
    }
}

function nextStep(stepNumber) {
    if(stepNumber === 2) {
        const serviceSelected = document.querySelector('input[name="service"]:checked');
        if (!serviceSelected) {
            alert('Please select a treatment to continue.');
            return;
        }
    }
    if(stepNumber === 3) {
        const date = document.getElementById('bookDate').value;
        const time = document.getElementById('bookTime').value;
        if(!date || !time) {
            alert('Please select both a date and a time.');
            return;
        }
    }

    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    const targetStep = document.getElementById('step-' + stepNumber);
    if (targetStep) targetStep.classList.add('active');
}

function prevStep(stepNumber) {
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    const targetStep = document.getElementById('step-' + stepNumber);
    if (targetStep) targetStep.classList.add('active');
    
    if(stepNumber === 1) {
        document.querySelectorAll('input[name="service"]').forEach(r => r.checked = false);
        const displayEl = document.getElementById('displayService');
        if (displayEl) displayEl.textContent = '';
    }
}

/* ---------------------------------------------------
   6. FLOATING CONTACT MENU (FAB) & AUTO-CLOSE
   --------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    const fabContainer = document.getElementById('fabContainer');

    if (fabMain && fabMenu && fabContainer) {
        fabMain.addEventListener('click', (e) => {
            e.stopPropagation(); 
            fabMenu.classList.toggle('open');
            fabMain.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (fabMenu.classList.contains('open') && !fabContainer.contains(e.target)) {
                fabMenu.classList.remove('open');
                fabMain.classList.remove('active');
            }
        });

        window.addEventListener('scroll', () => {
            if (fabMenu.classList.contains('open')) {
                fabMenu.classList.remove('open');
                fabMain.classList.remove('active');
            }
        }, { passive: true }); 
    }
});

/* ---------------------------------------------------
   7. SCROLL TO TOP LOGIC
   --------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

/* =====================================================
   AUTOMATIC CUSTOM COUNTDOWN OFFER LOGIC
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const offerSection = document.getElementById('special-offer');
    const titleEl = document.getElementById('offer-title');
    const descEl = document.getElementById('offer-desc');
    
    if (!offerSection) return;

    // 🚨 EACH OFFER NOW HAS A CUSTOM DURATION 🚨
    // Duration is in Minutes. (30 mins, 1440 = 1 day, 2880 = 2 days, etc.)
    const offers = [
        { 
            title: "20% Off Nuru Massage", 
            desc: "Experience our most intimate treatment at a special price. Book today before the discount expires.",
            durationMinutes: 30 
        },
        { 
            title: "🔥 Body-to-Body Sensation", 
            desc: "Maximum skin contact, maximum pleasure. Book a 60-minute Body-to-Body session and receive a free 15-minute extension.",
            durationMinutes: 1440 // 1 Day
        },
        { 
            title: "🔥 7-Day Strict Streak", 
            desc: "Visit us for 7 consecutive days. Complete the streak and your 8th day is absolutely FREE. No skipping allowed!",
            durationMinutes: 7200 // 5 Days
        },
        { 
            title: "🚗 Free Outcall Upgrade", 
            desc: "We come to you! Book any outcall service today and we’ll waive the travel fee completely.",
            durationMinutes: 4320 // 3 Days
        },
        { 
            title: "Extended VIP Session", 
            desc: "Book 90 minutes and get 30 minutes absolutely FREE. Double the relaxation, for a limited time only.",
            durationMinutes: 1440 // 1 Day
        },
        { 
            title: "💆 Nuru + Body-to-Body Combo", 
            desc: "The ultimate experience. Book our Nuru and Body-to-Body combo and save 15% on the total price.",
            durationMinutes: 2880 // 2 Days
        },
        { 
            title: "💸 Buy One, Get One 50% Off", 
            desc: "Bring a friend! Book any massage and get the second one for half price. Double the relaxation for less.",
            durationMinutes: 2880 // 2 Days
        },
        { 
            title: "👑 The Golden Package", 
            desc: "Book a 2-hour session and receive our premium Nuru massage, hot stones, and a glass of champagne.",
            durationMinutes: 4320 // 3 Days
        }
    ];

    // --- CORE LOGIC ---
    let currentOfferIndex = parseInt(localStorage.getItem('luxeOfferIndex')) || 0;
    let cycleStartStr = localStorage.getItem('luxeOfferStart');
    let now = new Date().getTime();

    // Set current offer's duration
    let currentOffer = offers[currentOfferIndex];
    let currentDurationMs = currentOffer.durationMinutes * 60 * 1000;

    // Check if current offer has expired OR if the index is invalid
    if (!cycleStartStr || (now - parseInt(cycleStartStr)) > currentDurationMs) {
        // Start a NEW cycle for the NEXT offer
        cycleStartStr = now.toString();
        localStorage.setItem('luxeOfferStart', cycleStartStr);
        
        currentOfferIndex = (currentOfferIndex + 1) % offers.length;
        localStorage.setItem('luxeOfferIndex', currentOfferIndex);
        
        // Recalculate duration for the new offer
        currentOffer = offers[currentOfferIndex];
        currentDurationMs = currentOffer.durationMinutes * 60 * 1000;
    }

    const startTime = parseInt(cycleStartStr);
    const targetDate = startTime + currentDurationMs;

    // Set the text
    titleEl.innerText = currentOffer.title;
    descEl.innerText = currentOffer.desc;

    // Set the Claim Button to select the right service
    const claimBtn = document.querySelector('.offer-content .btn-neon');
    if (claimBtn) {
        let serviceToSelect = "Nuru Massage";
        if (currentOffer.title.includes("Body-to-Body")) serviceToSelect = "Body-to-Body Massage";
        if (currentOffer.title.includes("Nuru + Body")) serviceToSelect = "Body-to-Body Massage";
        if (currentOffer.title.includes("VIP") || currentOffer.title.includes("Golden Package")) serviceToSelect = "Four-Hands Massage";
        if (currentOffer.title.includes("Outcall")) serviceToSelect = "Outdoor Service";
        
        claimBtn.setAttribute('onclick', `selectService('${serviceToSelect}')`);
    }

    // Countdown Timer
    const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const distance = targetDate - currentTime;

        if (distance < 0) {
            clearInterval(timer);
            // Reload page so the next offer can start
            window.location.reload(); 
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

    }, 1000);
});