// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        once: true
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    if (mobileMenuButton && mobileMenu) {
        const menuIcon = mobileMenuButton.querySelector('i'); // Query icon once
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (menuIcon) { // Check if icon exists
                menuIcon.classList.toggle('fa-bars');
                menuIcon.classList.toggle('fa-times');
            }
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (menuIcon) { // Check if icon exists
                    menuIcon.classList.add('fa-bars');
                    menuIcon.classList.remove('fa-times');
                }
            });
        });
    }

    // Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10); // adjusted timing for smoother animation
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
    
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            
            // Close other open accordions if you want only one open at a time
            accordionHeaders.forEach(otherHeader => {
                if(otherHeader !== header) {
                    otherHeader.nextElementSibling.style.maxHeight = null;
                    otherHeader.querySelector('i').classList.remove('rotate-180');
                }
            });
            
            // Toggle the clicked accordion
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.classList.remove('rotate-180');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.classList.add('rotate-180');
            }
        });
    });

    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // tsParticles initialization for page background
    if (document.getElementById('page-particles')) {
        tsParticles.load("page-particles", {
            fpsLimit: 60,
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        area: 800
                    }
                },
                color: {
                    value: ["#2563EB", "#10B981", "#38BDF8", "#4F46E5"] // Updated: blue-600, green-500, sky-500, indigo-600
                },
                shape: {
                    type: ["circle", "square", "triangle", "polygon"],
                    polygon: {
                        sides: 5
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true
                },
                size: {
                    value: {min: 5, max: 15},
                    random: true,
                },
                links: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out"
                    }
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: false, // Keep interactivity disabled for global background
                    },
                    onClick: {
                        enable: false, // Keep interactivity disabled for global background
                    }
                }
            },
            detectRetina: true,
            background: {
                color: 'transparent'
            }
        });
    }

    // SwiperJS Hero Slider Initialization
    if (document.querySelector('.hero-slider')) {
        const heroSwiper = new Swiper('.hero-slider', {
            loop: true,
            autoplay: {
                delay: 5000, // 5 seconds
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });
    }

    // Re-initialize Typed.js for the first slide
    if (document.getElementById('typed-subtitle-slide1')) {
        new Typed('#typed-subtitle-slide1', {
            strings: [
                'An exemplary CBSE institution in Sample City.',
                'Dedicated to holistic development.',
                'Fostering knowledge, character, and excellence.'
            ],
            typeSpeed: 50,
            backSpeed: 25,
            loop: true,
            smartBackspace: true
        });
    }

    // Search Functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const mainContent = document.querySelector('main');

    let originalContent = new Map();

    function removeHighlights() {
        const highlights = mainContent.querySelectorAll('span.search-highlight');
        highlights.forEach(span => {
            const parent = span.parentNode;
            if (originalContent.has(parent)) {
                parent.innerHTML = originalContent.get(parent);
            } else {
                parent.replaceChild(document.createTextNode(span.textContent), span);
            }
        });
        originalContent.clear();
    }

    function performSearch() {
        removeHighlights();
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
            return;
        }

        const textElements = mainContent.querySelectorAll('p, h1, h2, h3, h4, li, td, span');
        let firstMatch = null;

        textElements.forEach(el => {
            if (el.closest('script, style, .search-highlight')) return;

            if (!originalContent.has(el) && el.textContent.toLowerCase().includes(searchTerm)) {
                 originalContent.set(el, el.innerHTML);
            }

            const text = el.innerHTML;
            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

            if (regex.test(el.textContent)) {
                el.innerHTML = text.replace(regex, `<span class="search-highlight">$1</span>`);
                if (!firstMatch) {
                    firstMatch = el;
                }
            }
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    if (searchButton && searchInput && mainContent) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Disable context menu on gallery images
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    });

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Section Title Underline Animation
    document.querySelectorAll('.section-title').forEach(title => {
        gsap.to(title, {
            '--underline-width': '80px',
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            duration: 0.7,
            ease: 'power2.out'
        });
    });

    // Statistic Counters Animation
    const statsItems = document.querySelectorAll('.py-16.bg-white .grid.grid-cols-2.md\\:grid-cols-4 > div');
    if (statsItems.length > 0) {
        gsap.from(statsItems, {
            scrollTrigger: {
                trigger: statsItems[0].parentNode,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: 'power2.out',
        });
    }

    // Academic Program Cards Animation
    const academicCards = document.querySelectorAll('#academics .grid.md\\:grid-cols-3 > div');
    if (academicCards.length > 0) {
        gsap.from(academicCards, {
            scrollTrigger: {
                trigger: academicCards[0].parentNode,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: 'power2.out',
        });
    }

    // Admission Popup Functionality
    const admissionPopupOverlay = document.getElementById('admission-popup-overlay');
    const admissionPopupModal = document.getElementById('admission-popup-modal');
    const closeAdmissionPopupButton = document.getElementById('close-admission-popup');
    const popupAdmissionsLink = document.getElementById('popup-admissions-link');

    function showAdmissionPopup() {
        if (admissionPopupOverlay && admissionPopupModal) {
            admissionPopupOverlay.classList.remove('hidden');
            setTimeout(() => {
                admissionPopupModal.classList.remove('opacity-0', 'scale-95');
                admissionPopupModal.classList.add('opacity-100', 'scale-100');
            }, 50);
        }
    }

    function hideAdmissionPopup() {
        if (admissionPopupOverlay && admissionPopupModal) {
            admissionPopupModal.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                 admissionPopupOverlay.classList.add('hidden');
                 admissionPopupModal.classList.remove('opacity-100', 'scale-100');
            }, 300);
        }
    }

    if (closeAdmissionPopupButton) {
        closeAdmissionPopupButton.addEventListener('click', hideAdmissionPopup);
    }

    if (popupAdmissionsLink) {
        popupAdmissionsLink.addEventListener('click', () => {
            setTimeout(hideAdmissionPopup, 100);
        });
    }

    if (admissionPopupOverlay) {
        admissionPopupOverlay.addEventListener('click', function(event) {
            if (event.target === admissionPopupOverlay) {
                hideAdmissionPopup();
            }
        });

        setTimeout(showAdmissionPopup, 2000);
    }

    // Info Box Animation
    const infoBoxes = document.querySelectorAll('.info-box');
    if (infoBoxes.length > 0) {
        gsap.from(infoBoxes, {
            scrollTrigger: {
                trigger: "#why-choose-us",
                start: "top 75%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 60,
            duration: 0.7,
            stagger: 0.25,
            ease: "power3.out",
        });
    }
});