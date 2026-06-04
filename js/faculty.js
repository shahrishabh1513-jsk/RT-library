// Faculty Dashboard JavaScript

let currentUser = null;
let facultyTransactions = [];

document.addEventListener('DOMContentLoaded', function () {
    loadUserData();
    setupNavigation();
    loadDashboardData();
    loadBorrowedBooks();
    loadAvailableBooks();
    loadProfile();
});

function loadUserData() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userId').textContent = currentUser.id;
        document.getElementById('userAvatar').textContent = currentUser.name.charAt(0) + (currentUser.name.split(' ')[1]?.charAt(0) || '');

        const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        facultyTransactions = allTransactions.filter(t => t.userId === currentUser.id);
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

function loadDashboardData() {
    const activeBooks = facultyTransactions.filter(t => t.status === 'active');
    document.getElementById('borrowedCount').textContent = activeBooks.length;

    const overdue = activeBooks.filter(book => new Date(book.dueDate) < new Date()).length;
    document.getElementById('overdueCount').textContent = overdue;

    const recommended = getFeaturedBooks();
    const grid = document.getElementById('recommendedGrid');
    grid.innerHTML = recommended.slice(0, 6).map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover"><i class="fas fa-book"></i><span class="book-status ${book.available > 0 ? 'status-available' : 'status-borrowed'}">${book.available > 0 ? 'Available' : 'Borrowed'}</span></div>
            <div class="book-details"><h4 class="book-title">${book.title}</h4><p class="book-author">by ${book.author}</p></div>
        </div>
    `).join('');
}

function loadBorrowedBooks() {
    const activeBooks = facultyTransactions.filter(t => t.status === 'active');
    const tbody = document.getElementById('borrowedTable');

    if (activeBooks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No books borrowed yet</td></tr>';
        return;
    }

    tbody.innerHTML = activeBooks.map(transaction => {
        const book = getBookById(transaction.bookId);
        return `<tr>
            <td>${book?.title || 'Unknown'}</td>
            <td>${book?.author || 'Unknown'}</td>
            <td>${new Date(transaction.borrowDate).toLocaleDateString()}</td>
            <td>${new Date(transaction.dueDate).toLocaleDateString()}</td>
            <td><span class="book-status status-available">Active</span></td>
            <td><button onclick="returnBook(${transaction.id})" style="background:var(--danger);padding:0.5rem 1rem;border:none;border-radius:8px;color:white;cursor:pointer">Return</button></td>
        </tr>`;
    }).join('');
}

function loadAvailableBooks() {
    const availableBooks = booksData.filter(book => book.available > 0);
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = availableBooks.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover"><i class="fas fa-book"></i><span class="book-status status-available">Available</span></div>
            <div class="book-details"><h4 class="book-title">${book.title}</h4><p class="book-author">by ${book.author}</p><p><strong>Available:</strong> ${book.available}/${book.copies}</p></div>
        </div>
    `).join('');
}

function loadProfile() {
    const card = document.getElementById('profileCard');
    card.innerHTML = `
        <div class="profile-header" style="display:flex;align-items:center;gap:2rem;margin-bottom:2rem"><div class="profile-avatar" style="width:80px;height:80px;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;color:white">${currentUser.name.charAt(0)}</div><div><h3>${currentUser.name}</h3><p>${currentUser.id}</p></div></div>
        <div class="info-row"><div class="info-label">Faculty ID</div><div class="info-value">${currentUser.id}</div></div>
        <div class="info-row"><div class="info-label">Full Name</div><div class="info-value">${currentUser.name}</div></div>
        <div class="info-row"><div class="info-label">Department</div><div class="info-value">${currentUser.department || 'Computer Science'}</div></div>
        <div class="info-row"><div class="info-label">Position</div><div class="info-value">${currentUser.position || 'Professor'}</div></div>
        <div class="info-row"><div class="info-label">Research Credits</div><div class="info-value">150</div></div>
        <div class="info-row"><div class="info-label">Books Borrowed</div><div class="info-value">${facultyTransactions.length}</div></div>
    `;
}

function showBookDetails(bookId) {
    const book = getBookById(bookId);
    if (!book) return;

    const isAlreadyBorrowed = facultyTransactions.some(t => t.bookId === bookId && t.status === 'active');

    if (confirm(`Borrow "${book.title}" by ${book.author}?\n\nAvailable: ${book.available}/${book.copies}\nFaculty members get 90-day borrowing period.`)) {
        if (book.available > 0 && !isAlreadyBorrowed) {
            borrowBook(bookId);
        } else if (isAlreadyBorrowed) {
            showToast('You have already borrowed this book', 'error');
        } else {
            showToast('Book not available', 'error');
        }
    }
}

function borrowBook(bookId) {
    const book = getBookById(bookId);
    if (!book || book.available <= 0) {
        showToast('Book not available!', 'error');
        return;
    }

    book.available--;

    const transaction = {
        id: Date.now(),
        userId: currentUser.id,
        bookId: bookId,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
    };

    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    showToast('Book borrowed successfully! (90-day borrowing period)', 'success');
    setTimeout(() => location.reload(), 1000);
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
    if (query) filtered = filtered.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));
    if (category) filtered = filtered.filter(book => book.category === category);

    const grid = document.getElementById('booksGrid');
    grid.innerHTML = filtered.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover"><i class="fas fa-book"></i><span class="book-status status-available">Available</span></div>
            <div class="book-details"><h4 class="book-title">${book.title}</h4><p class="book-author">by ${book.author}</p><p><strong>Available:</strong> ${book.available}/${book.copies}</p></div>
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