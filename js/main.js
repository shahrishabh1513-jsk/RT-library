// Page Transition
document.addEventListener('DOMContentLoaded', function () {
    const transition = document.querySelector('.page-transition');
    if (transition) {
        setTimeout(() => {
            transition.classList.add('hide');
        }, 1500);
    }

    loadFeaturedBooks();
    setupNavigation();
    setupMobileMenu();
    setupSmoothScroll();
    setupCategoryFilters();
    setupContactForm();
    setupScrollAnimations();
    setupButtonAnimations();
    startCounterAnimation();
});

// Load featured books
function loadFeaturedBooks() {
    const featuredBooks = getFeaturedBooks();
    const booksGrid = document.getElementById('featuredBooksGrid');

    if (!booksGrid) return;

    booksGrid.innerHTML = featuredBooks.map(book => `
        <div class="book-card" onclick="viewBookDetails(${book.id})">
            <div class="book-cover">
                <i class="fas fa-book"></i>
                <span class="book-status ${book.available > 0 ? 'status-available' : 'status-borrowed'}">
                    ${book.available > 0 ? 'Available' : 'Borrowed'}
                </span>
            </div>
            <div class="book-details">
                <h4 class="book-title">${book.title}</h4>
                <p class="book-author">by ${book.author}</p>
                <span class="book-category">${getCategoryName(book.category)}</span>
            </div>
        </div>
    `).join('');
}

function getCategoryName(categoryId) {
    const categories = {
        'computer-science': 'Computer Science',
        'mathematics': 'Mathematics',
        'physics': 'Physics',
        'literature': 'Literature',
        'history': 'History',
        'biology': 'Biology'
    };
    return categories[categoryId] || categoryId;
}

function viewBookDetails(bookId) {
    sessionStorage.setItem('selectedBookId', bookId);
    showToast('Redirecting to login to borrow this book...', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuToggle.style.transform = mobileMenu.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0)';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuToggle.style.transform = 'rotate(0)';
            }
        });
    }
}

// Setup smooth scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu) mobileMenu.classList.remove('active');
            }
        });
    });
}

// Setup category filters
function setupCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (category) {
                sessionStorage.setItem('selectedCategory', category);
                showToast(`Exploring ${card.querySelector('h3').innerText} books...`, 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    });
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Animate button
            const btn = this.querySelector('button');
            btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                showToast('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
                btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                btn.disabled = false;
            }, 2000);
        });
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .book-card, .category-card, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Setup button animations
function setupButtonAnimations() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-login');

    buttons.forEach(button => {
        button.addEventListener('mousedown', function (e) {
            this.style.transform = 'scale(0.98)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = '';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

// Start counter animation for stats
function startCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = element.getAttribute('data-count') || element.innerText.replace(/[^0-9]/g, '');
                if (target) {
                    animateNumber(element, parseInt(target));
                }
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.innerText = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.innerText = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// Show toast notification
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast styles
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 12px 24px;
        background: white;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10000;
        font-weight: 500;
    }
    .toast-notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    .toast-notification.success {
        background: #10b981;
        color: white;
    }
    .toast-notification.error {
        background: #ef4444;
        color: white;
    }
    .toast-notification.info {
        background: var(--primary);
        color: white;
    }
    .toast-notification i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(toastStyles);

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add hover parallax effect to cards
document.addEventListener('mousemove', function (e) {
    const cards = document.querySelectorAll('.feature-card, .book-card, .category-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
});

document.addEventListener('mouseleave', function () {
    const cards = document.querySelectorAll('.feature-card, .book-card, .category-card');
    cards.forEach(card => {
        card.style.transform = '';
    });
});