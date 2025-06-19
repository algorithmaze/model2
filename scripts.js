// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        once: true
    });

    // Typed.js for Hero Subtitle
    if (document.getElementById('typed-subtitle')) {
        new Typed('#typed-subtitle', {
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

    // tsParticles initialization
    if (document.getElementById('particles-js')) {
        tsParticles.load("particles-js", {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    }
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        quantity: 4
                    }
                }
            },
            particles: {
                color: {
                    value: "#ffffff"
                },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1
                },
                collisions: {
                    enable: true
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce"
                    },
                    random: false,
                    speed: 2,
                    straight: false
                },
                number: {
                    density: {
                        enable: true,
                        area: 800
                    },
                    value: 80
                },
                opacity: {
                    value: 0.5
                },
                shape: {
                    type: "circle"
                },
                size: {
                    value: { min: 1, max: 5 }
                }
            },
            detectRetina: true
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
});