/* =====================================================
   LOKESH PHOTOGRAPHY - PHOTOCREW INSPIRED SCRIPTS
   ===================================================== */

// Theme Toggle - Initialize immediately for no flash
(function () {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // Default to dark
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            if (newTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }

            localStorage.setItem('theme', newTheme);
        });
    }
    // Mobile Navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // Hero Slideshow
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 1) {
        setInterval(nextSlide, 5000);
    }

    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });

        statsAnimated = true;
    }

    // Intersection Observer for Stats
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // Active Navigation Link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .stat-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            console.log('Form submitted:', data);
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });

    // Reveal more elements on scroll
    const additionalRevealElements = document.querySelectorAll('.feature-card, .process-step, .faq-item');
    additionalRevealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Gallery Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    if (item.dataset.category === filter) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 300);
                    }
                }
            });
        });
    });

    // =========================================
    // SERVICE GALLERY MODAL
    // =========================================
    const galleryModal = document.getElementById('gallery-modal');
    const modalTitle = document.getElementById('modal-title');
    const galleryTrack = document.getElementById('modal-gallery-track');
    const galleryDots = document.getElementById('gallery-dots');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const arrowLeft = document.querySelector('.gallery-arrow-left');
    const arrowRight = document.querySelector('.gallery-arrow-right');

    // Service image collections (12 images each for more content)
    const serviceGalleries = {
        'Pre-Wedding': ['outdoor-couple.jpg', 'couple-1.jpg', 'wedding-couple.jpg', 'outdoor-candid.jpg', 'wedding_3.jpg', 'wedding_5.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_4.jpg', 'wedding_6.jpg'],
        'Wedding': ['wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'wedding_7.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg', 'hero_bride_3.jpg', 'hero_bride_4.jpg', 'hero_bride_5.jpg'],
        'Maternity': ['bridal-1.jpg', 'bridal-2.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg', 'hero_bride_3.jpg', 'hero_bride_4.jpg', 'hero_bride_5.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg'],
        'Birthday': ['outdoor-kid.jpg', 'outdoor-candid.jpg', 'outdoor-musicians.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'outdoor-couple.jpg', 'couple-1.jpg', 'wedding_7.jpg'],
        'House warming': ['wedding_5.jpg', 'wedding_6.jpg', 'wedding_7.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg', 'hero_bride_3.jpg', 'outdoor-couple.jpg', 'couple-1.jpg'],
        'Christian': ['hero_bride_1.jpg', 'hero_bride_2.jpg', 'hero_bride_3.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'wedding_7.jpg', 'bridal-1.jpg', 'bridal-2.jpg'],
        'Muslim': ['hero_bride_3.jpg', 'hero_bride_4.jpg', 'hero_bride_5.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'wedding_7.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'bridal-1.jpg', 'bridal-2.jpg'],
        'Upanayanam': ['wedding-haldi.jpg', 'wedding-mehndi.jpg', 'wedding-prep.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'wedding_7.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg'],
        'Engagement': ['wedding-couple.jpg', 'couple-1.jpg', 'outdoor-couple.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg', 'hero_bride_3.jpg', 'outdoor-candid.jpg'],
        'Naming Ceremony': ['outdoor-musicians.jpg', 'outdoor-kid.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'wedding_7.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'outdoor-candid.jpg', 'outdoor-couple.jpg', 'couple-1.jpg'],
        'Recreation': ['wedding-mehndi.jpg', 'wedding-haldi.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'wedding_7.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg', 'hero_bride_3.jpg'],
        'Temple Wedding': ['wedding_7.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg', 'hero_bride_3.jpg', 'hero_bride_4.jpg', 'hero_bride_5.jpg'],
        'Elements': ['hero_bride_5.jpg', 'hero_bride_1.jpg', 'hero_bride_2.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg', 'wedding_7.jpg', 'bridal-1.jpg', 'bridal-2.jpg'],
        'Newborn': ['outdoor-kid.jpg', 'outdoor-candid.jpg', 'bridal-1.jpg', 'bridal-2.jpg', 'wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'outdoor-musicians.jpg', 'outdoor-couple.jpg', 'couple-1.jpg']
    };

    let currentImages = [];
    let currentIndex = 0;

    // Open modal on VIEW MORE click
    document.querySelectorAll('.btn-visual').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.service-card-visual');
            const titleText = card.querySelector('h3').innerText.replace(/<br>/g, ' ').replace(/\n/g, ' ');

            // Find matching gallery
            let images = ['wedding_1.jpg', 'wedding_2.jpg', 'wedding_3.jpg', 'wedding_4.jpg', 'wedding_5.jpg', 'wedding_6.jpg'];
            for (let key in serviceGalleries) {
                if (titleText.toLowerCase().includes(key.toLowerCase())) {
                    images = serviceGalleries[key];
                    break;
                }
            }

            currentImages = images;
            currentIndex = 0;
            modalTitle.textContent = titleText;

            renderGallery();
            renderDots();
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function renderGallery() {
        galleryTrack.innerHTML = '';
        const visibleImages = currentImages.slice(currentIndex, currentIndex + 3);

        // Fill to 3 if not enough
        while (visibleImages.length < 3 && visibleImages.length < currentImages.length) {
            visibleImages.push(currentImages[visibleImages.length % currentImages.length]);
        }

        visibleImages.forEach(img => {
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';
            slide.innerHTML = `<img src="assets/images/${img}" alt="Gallery Image" loading="lazy">`;
            galleryTrack.appendChild(slide);
        });
    }

    function renderDots() {
        galleryDots.innerHTML = '';
        const totalGroups = Math.ceil(currentImages.length / 3);
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot' + (i === Math.floor(currentIndex / 3) ? ' active' : '');
            dot.addEventListener('click', () => {
                currentIndex = i * 3;
                renderGallery();
                updateDots();
            });
            galleryDots.appendChild(dot);
        }
    }

    function updateDots() {
        document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.floor(currentIndex / 3));
        });
    }

    // Arrow navigation
    if (arrowLeft) {
        arrowLeft.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 3);
            renderGallery();
            updateDots();
        });
    }

    if (arrowRight) {
        arrowRight.addEventListener('click', () => {
            if (currentIndex + 3 < currentImages.length) {
                currentIndex += 3;
                renderGallery();
                updateDots();
            }
        });
    }

    // Close modal
    function closeModal() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
            closeModal();
        }
    });
});

// Load More Gallery Images
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const masonryGallery = document.querySelector('.masonry-gallery');

    if (loadMoreBtn && masonryGallery) {
        loadMoreBtn.addEventListener('click', () => {
            masonryGallery.classList.add('show-all');
            loadMoreBtn.style.display = 'none';
        });
    }
});
