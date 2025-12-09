/* =====================================================
   LOKESH PHOTOGRAPHY - MAIN JAVASCRIPT
   With Prashanth Bionic-style Slideshow
   ===================================================== */

document.addEventListener('DOMContentLoaded', init);

function init() {
    initSlideshow();
    initNavigation();
    initHeaderScroll();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
}

/* =====================================================
   FULLSCREEN SLIDESHOW - Prashanth Bionic Style
   ===================================================== */
function initSlideshow() {
    const slideshow = document.getElementById('slideshow');
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 seconds per slide
    let isTransitioning = false;

    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning) return;
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        isTransitioning = true;

        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide]?.classList.remove('active');

        // Update current slide index
        currentSlide = index;

        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide]?.classList.add('active');

        // Reset transition lock after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 1500); // Match CSS transition duration
    }

    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Start auto-advance
    function startSlideshow() {
        stopSlideshow();
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Stop auto-advance
    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Event listeners for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideshow(); // Reset timer on manual navigation
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideshow(); // Reset timer on manual navigation
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentSlide) {
                goToSlide(index);
                startSlideshow(); // Reset timer on manual navigation
            }
        });
    });

    // Pause on hover (optional - for better UX)
    slideshow.addEventListener('mouseenter', stopSlideshow);
    slideshow.addEventListener('mouseleave', startSlideshow);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only if slideshow is in view
        const rect = slideshow.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startSlideshow();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startSlideshow();
            }
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideshow.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left -> next
            } else {
                prevSlide(); // Swipe right -> prev
            }
            startSlideshow();
        }
    }

    // Preload next slide image
    function preloadNextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        const nextImg = slides[nextIndex].querySelector('img');
        if (nextImg && nextImg.loading === 'lazy') {
            nextImg.loading = 'eager';
        }
    }

    // Call preload on slide change
    const originalGoToSlide = goToSlide;
    goToSlide = function (index) {
        originalGoToSlide(index);
        preloadNextSlide();
    };

    // Start the slideshow
    startSlideshow();
    preloadNextSlide();
}

/* =====================================================
   NAVIGATION
   ===================================================== */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        const isActive = navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Toggle hamburger animation
        const hamburger = navToggle.querySelector('.hamburger');
        if (hamburger) {
            if (isActive) {
                hamburger.style.background = 'transparent';
                hamburger.style.setProperty('--before-top', '0');
                hamburger.style.setProperty('--after-bottom', '0');
            }
        }

        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link highlighting
    let ticking = false;
    const updateActiveLink = () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrollY = window.scrollY + 150;
            const sections = document.querySelectorAll('section[id]');
            let currentSection = 'home';

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollY >= top && scrollY < top + height) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${currentSection}`;
                link.classList.toggle('active', isActive);
            });

            ticking = false;
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
}

/* =====================================================
   HEADER SCROLL
   ===================================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;

    const updateHeader = () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            header.classList.toggle('scrolled', window.scrollY > 50);
            ticking = false;
        });
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
}

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.getElementById('header');
    const headerHeight = header ? header.offsetHeight : 80;

    links.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.about-image, .about-content, .gallery-item, .contact-content, .contact-form, .portfolio-card'
    );

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${Math.min(index * 0.1, 0.5)}s`;
        observer.observe(el);
    });
}

/* =====================================================
   CONTACT FORM
   ===================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 1000));
            showToast('Message sent successfully!', 'success');
            form.reset();
        } catch (err) {
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/* =====================================================
   TOAST NOTIFICATION
   ===================================================== */
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(10px)',
        transition: 'all .3s ease'
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
