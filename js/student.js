// Student Dashboard JavaScript

let currentUser = null;
let userTransactions = [];
let userBorrowedBooks = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    loadUserData();
    setupNavigation();
    setupThemeToggle();
    setupModal();
    loadDashboardData();
    loadBorrowedBooks();
    loadAvailableBooks();
    loadProfile();
    loadHistory();
});

function loadUserData() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userId').textContent = currentUser.id;
        document.getElementById('userAvatar').textContent = currentUser.name.charAt(0) + (currentUser.name.split(' ')[1]?.charAt(0) || '');

        // Load user's transactions from localStorage
        const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        userTransactions = allTransactions.filter(t => t.userId === currentUser.id);
        userBorrowedBooks = userTransactions.filter(t => t.status === 'active');
    } else {
        window.location.href = 'login.html';
    }
}

function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    let isDark = false;
    toggle.addEventListener('click', () => {
        isDark = !isDark;
        if (isDark) {
            document.body.style.background = '#1a1a2e';
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

function setupModal() {
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        document.getElementById('bookModal').classList.remove('active');
    });
}

function loadDashboardData() {
    document.getElementById('borrowedCount').textContent = userBorrowedBooks.length;

    const overdue = userBorrowedBooks.filter(book => new Date(book.dueDate) < new Date()).length;
    document.getElementById('overdueCount').textContent = overdue;

    let minDays = Infinity;
    userBorrowedBooks.forEach(book => {
        const days = Math.ceil((new Date(book.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (days > 0 && days < minDays) minDays = days;
    });
    document.getElementById('dueDays').textContent = minDays === Infinity ? 0 : minDays;

    // Load recommended books
    const recommended = getFeaturedBooks();
    const grid = document.getElementById('recommendedGrid');
    grid.innerHTML = recommended.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover"><i class="fas fa-book"></i><span class="book-status ${book.available > 0 ? 'status-available' : 'status-borrowed'}">${book.available > 0 ? 'Available' : 'Borrowed'}</span></div>
            <div class="book-details"><h4 class="book-title">${book.title}</h4><p class="book-author">by ${book.author}</p><span class="book-category">${getCategoryName(book.category)}</span></div>
        </div>
    `).join('');
}

function loadBorrowedBooks() {
    const tbody = document.getElementById('borrowedTable');
    if (userBorrowedBooks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No books borrowed yet</td></tr>';
        return;
    }

    tbody.innerHTML = userBorrowedBooks.map(transaction => {
        const book = getBookById(transaction.bookId);
        const dueDate = new Date(transaction.dueDate);
        const isOverdue = dueDate < new Date();
        const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        let status = isOverdue ? 'Overdue' : `Due in ${daysLeft} days`;
        let statusClass = isOverdue ? 'status-borrowed' : 'status-available';

        return `<tr>
            <td>${book?.title || 'Unknown'}</td>
            <td>${book?.author || 'Unknown'}</td>
            <td>${new Date(transaction.borrowDate).toLocaleDateString()}</td>
            <td>${dueDate.toLocaleDateString()}</td>
            <td><span class="book-status ${statusClass}">${status}</span></td>
            <td><button class="btn-borrow" style="background:var(--danger);padding:0.5rem 1rem" onclick="returnBook(${transaction.id})">Return</button></td>
        </tr>`;
    }).join('');
}

function loadAvailableBooks() {
    const availableBooks = booksData.filter(book => book.available > 0);
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = availableBooks.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover"><i class="fas fa-book"></i><span class="book-status status-available">Available</span></div>
            <div class="book-details"><h4 class="book-title">${book.title}</h4><p class="book-author">by ${book.author}</p><span class="book-category">${getCategoryName(book.category)}</span><p><strong>Available:</strong> ${book.available}/${book.copies}</p></div>
        </div>
    `).join('');
}

function loadProfile() {
    const card = document.getElementById('profileCard');
    card.innerHTML = `
        <div class="profile-header"><div class="profile-avatar">${currentUser.name.charAt(0)}</div><div class="profile-info"><h3>${currentUser.name}</h3><p>${currentUser.id}</p></div></div>
        <div class="info-row"><div class="info-label">Student ID</div><div class="info-value">${currentUser.id}</div></div>
        <div class="info-row"><div class="info-label">Full Name</div><div class="info-value">${currentUser.name}</div></div>
        <div class="info-row"><div class="info-label">Course</div><div class="info-value">${currentUser.course || 'Computer Science'}</div></div>
        <div class="info-row"><div class="info-label">Year</div><div class="info-value">${currentUser.year || '3rd Year'}</div></div>
        <div class="info-row"><div class="info-label">Membership Since</div><div class="info-value">January 2024</div></div>
        <div class="info-row"><div class="info-label">Books Borrowed</div><div class="info-value">${userTransactions.length}</div></div>
    `;
}

function loadHistory() {
    const tbody = document.getElementById('historyTable');
    const completed = userTransactions.filter(t => t.status === 'returned');
    if (completed.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No borrowing history yet</td></tr>';
        return;
    }

    tbody.innerHTML = completed.map(transaction => {
        const book = getBookById(transaction.bookId);
        return `<tr>
            <td>${book?.title || 'Unknown'}</td>
            <td>${book?.author || 'Unknown'}</td>
            <td>${new Date(transaction.borrowDate).toLocaleDateString()}</td>
            <td>${transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : '-'}</td>
            <td><span class="book-status status-available">Returned</span></td>
        </tr>`;
    }).join('');
}

function getCategoryName(categoryId) {
    const categories = { 'computer-science': 'CS', 'mathematics': 'Math', 'physics': 'Physics', 'literature': 'Literature', 'history': 'History', 'biology': 'Biology' };
    return categories[categoryId] || categoryId;
}

function showBookDetails(bookId) {
    const book = getBookById(bookId);
    if (!book) return;

    const isAlreadyBorrowed = userBorrowedBooks.some(t => t.bookId === bookId);

    document.getElementById('modalContent').innerHTML = `
        <h4>${book.title}</h4>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Category:</strong> ${getCategoryName(book.category)}</p>
        <p><strong>Available Copies:</strong> ${book.available}/${book.copies}</p>
        <p><strong>Description:</strong> ${book.description || 'No description available.'}</p>
    `;

    const borrowBtn = document.getElementById('modalBorrowBtn');
    if (book.available > 0 && !isAlreadyBorrowed) {
        borrowBtn.style.display = 'block';
        borrowBtn.onclick = () => borrowBook(bookId);
    } else {
        borrowBtn.style.display = 'none';
    }

    document.getElementById('bookModal').classList.add('active');
}

function borrowBook(bookId) {
    const book = getBookById(bookId);
    if (!book || book.available <= 0) {
        showToast('Book not available!', 'error');
        return;
    }

    const result = borrowBookAPI(currentUser.id, bookId);
    if (result.success) {
        showToast('Book borrowed successfully!', 'success');
        document.getElementById('bookModal').classList.remove('active');
        setTimeout(() => location.reload(), 1000);
    } else {
        showToast(result.message, 'error');
    }
}

function borrowBookAPI(userId, bookId) {
    const book = getBookById(bookId);
    if (!book || book.available <= 0) return { success: false, message: 'Book not available' };

    book.available--;

    const transaction = {
        id: Date.now(),
        userId: userId,
        bookId: bookId,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
    };

    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update book in global booksData
    const bookIndex = booksData.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) booksData[bookIndex] = book;

    return { success: true, transaction };
}

function returnBook(transactionId) {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = transactions.find(t => t.id === transactionId);

    if (transaction && transaction.status === 'active') {
        const book = getBookById(transaction.bookId);
        if (book) book.available++;

        transaction.status = 'returned';
        transaction.returnDate = new Date().toISOString();

        localStorage.setItem('transactions', JSON.stringify(transactions));
        showToast('Book returned successfully!', 'success');
        setTimeout(() => location.reload(), 1000);
    }
}

function searchBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    let filtered = booksData.filter(book => book.available > 0);
    if (query) {
        filtered = filtered.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));
    }
    if (category) {
        filtered = filtered.filter(book => book.category === category);
    }

    const grid = document.getElementById('booksGrid');
    grid.innerHTML = filtered.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover"><i class="fas fa-book"></i><span class="book-status status-available">Available</span></div>
            <div class="book-details"><h4 class="book-title">${book.title}</h4><p class="book-author">by ${book.author}</p><span class="book-category">${getCategoryName(book.category)}</span><p><strong>Available:</strong> ${book.available}/${book.copies}</p></div>
        </div>
    `).join('');
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}