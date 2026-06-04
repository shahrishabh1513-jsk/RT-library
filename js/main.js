// Main JavaScript for Homepage

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Load featured books
    loadFeaturedBooks();

    // Setup navigation
    setupNavigation();

    // Setup mobile menu
    setupMobileMenu();

    // Setup smooth scrolling
    setupSmoothScroll();

    // Setup category filters
    setupCategoryFilters();

    // Setup contact form
    setupContactForm();

    // Add scroll animations
    setupScrollAnimations();
});

// Load featured books on homepage
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

// Get category display name
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

// View book details (redirects to login if not logged in)
function viewBookDetails(bookId) {
    // Store book ID in session to show after login
    sessionStorage.setItem('selectedBookId', bookId);
    window.location.href = 'login.html';
}

// Setup navigation active state
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
        });
    }
}

// Setup smooth scrolling
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
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
                // Store category preference and redirect to login
                sessionStorage.setItem('selectedCategory', category);
                window.location.href = 'login.html';
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
            showToast('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
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

    document.querySelectorAll('.feature-card, .book-card, .category-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add toast styles
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 12px 24px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    .toast.show {
        transform: translateX(0);
        opacity: 1;
    }
    .toast.success {
        background: #10b981;
        color: white;
    }
    .toast.error {
        background: #ef4444;
        color: white;
    }
    .toast i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(toastStyles);