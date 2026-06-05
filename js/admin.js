// Admin Dashboard JavaScript

let currentAdmin = null;
let allStudents = [];
let allFaculty = [];
let allTransactions = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    // Page transition
    setTimeout(() => {
        const transition = document.getElementById('pageTransition');
        if (transition) transition.classList.add('hide');
    }, 800);

    loadAdminData();
    setupNavigation();
    setupThemeToggle();
    loadDashboardData();
    loadBooksTable();
    loadStudentsTable();
    loadFacultyTable();
    loadTransactionsTable();
    setupForms();
    updateSystemInfo();
});

function loadAdminData() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentAdmin = JSON.parse(storedUser);
        document.getElementById('userName').textContent = currentAdmin.name;
        document.getElementById('userId').textContent = currentAdmin.id;
        document.getElementById('welcomeName').textContent = 'Admin';
        document.getElementById('userAvatar').textContent = 'AD';
    } else {
        window.location.href = 'login.html';
    }

    // Load students from localStorage
    allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    if (allStudents.length === 0) {
        allStudents = [
            { id: 'S001', name: 'John Doe', email: 'john@example.com', course: 'Computer Science', year: '3rd Year', phone: '9876543210', borrowedCount: 0 },
            { id: 'S002', name: 'Jane Smith', email: 'jane@example.com', course: 'Information Technology', year: '3rd Year', phone: '9876543211', borrowedCount: 0 }
        ];
        localStorage.setItem('students', JSON.stringify(allStudents));
    }

    // Load faculty from localStorage
    allFaculty = JSON.parse(localStorage.getItem('faculty') || '[]');
    if (allFaculty.length === 0) {
        allFaculty = [
            { id: 'F001', name: 'Dr. Robert Smith', email: 'robert@example.com', department: 'Computer Science', position: 'Professor', researchArea: 'AI', borrowedCount: 0 }
        ];
        localStorage.setItem('faculty', JSON.stringify(allFaculty));
    }

    // Load transactions
    allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
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
            document.documentElement.style.setProperty('--white', '#1a1a2e');
            document.documentElement.style.setProperty('--light', '#16213e');
            document.documentElement.style.setProperty('--dark', '#ffffff');
            document.body.style.background = '#0f0f1a';
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
            showToast('Dark mode activated', 'success');
        } else {
            document.documentElement.style.setProperty('--white', '#ffffff');
            document.documentElement.style.setProperty('--light', '#f8f9fa');
            document.documentElement.style.setProperty('--dark', '#1a1a2e');
            document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            showToast('Light mode activated', 'success');
        }
    });
}

function setupForms() {
    document.getElementById('addBookForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addBook();
    });

    document.getElementById('addStudentForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addStudent();
    });

    document.getElementById('addFacultyForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addFaculty();
    });
}

function loadDashboardData() {
    document.getElementById('totalBooks').textContent = booksData.length;
    document.getElementById('totalStudents').textContent = allStudents.length;
    document.getElementById('totalFaculty').textContent = allFaculty.length;

    const activeBorrowings = allTransactions.filter(t => t.status === 'active').length;
    document.getElementById('activeBorrowings').textContent = activeBorrowings;

    // Update circle progress
    const utilizationRate = Math.round((booksData.reduce((sum, b) => sum + (b.copies - b.available), 0) / booksData.reduce((sum, b) => sum + b.copies, 0)) * 100);
    const activeUsersRate = Math.round(((allStudents.length + allFaculty.length) / 100) * 100);

    updateProgressCircle(utilizationRate, 42);
    updateProgressCircle(activeUsersRate, 79);

    loadRecentTransactions();
}

function updateProgressCircle(percent, offset) {
    const circumference = 283;
    const dashoffset = circumference - (percent / 100) * circumference;
    const circles = document.querySelectorAll('.progress-ring');
    if (circles[Math.floor(offset / 37)]) {
        circles[Math.floor(offset / 37)].style.strokeDashoffset = dashoffset;
    }
}

function loadRecentTransactions() {
    const activityList = document.getElementById('recentActivity');
    const recent = allTransactions.slice(0, 5);

    if (recent.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon"><i class="fas fa-inbox"></i></div>
                <div class="activity-details">
                    <p>No recent transactions</p>
                </div>
            </div>
        `;
        return;
    }

    activityList.innerHTML = recent.map(t => {
        const book = getBookById(t.bookId);
        return `
            <div class="activity-item">
                <div class="activity-icon"><i class="fas ${t.status === 'active' ? 'fa-hand-holding' : 'fa-check-circle'}"></i></div>
                <div class="activity-details">
                    <p><strong>${t.userId}</strong> ${t.status === 'active' ? 'borrowed' : 'returned'} "${book?.title || 'Unknown'}"</p>
                    <span class="activity-time">${new Date(t.borrowDate).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }).join('');
}

function loadBooksTable() {
    const tbody = document.getElementById('booksTable');
    tbody.innerHTML = booksData.map(book => `
        <tr>
            <td data-label="Title">${book.title}</td>
            <td data-label="Author">${book.author}</td>
            <td data-label="ISBN">${book.isbn}</td>
            <td data-label="Category">${getCategoryName(book.category)}</td>
            <td data-label="Available">${book.available}</td>
            <td data-label="Total">${book.copies}</td>
            <td data-label="Action">
                <button class="action-btn btn-delete" onclick="deleteBook(${book.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function loadStudentsTable() {
    const tbody = document.getElementById('studentsTable');
    if (allStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No students added</td></tr>';
        return;
    }

    // Update borrowed count for each student
    allStudents.forEach(student => {
        student.borrowedCount = allTransactions.filter(t => t.userId === student.id && t.status === 'active').length;
    });

    tbody.innerHTML = allStudents.map(student => `
        <tr>
            <td data-label="ID">${student.id}</td>
            <td data-label="Name">${student.name}</td>
            <td data-label="Email">${student.email}</td>
            <td data-label="Course">${student.course}</td>
            <td data-label="Year">${student.year}</td>
            <td data-label="Books Borrowed">${student.borrowedCount || 0}</td>
            <td data-label="Action">
                <button class="action-btn btn-qr" onclick="generateUserQR('${student.id}', '${student.name}', 'student')"><i class="fas fa-qrcode"></i></button>
                <button class="action-btn btn-delete" onclick="deleteStudent('${student.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function loadFacultyTable() {
    const tbody = document.getElementById('facultyTable');
    if (allFaculty.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No faculty members added</td></tr>';
        return;
    }

    // Update borrowed count for each faculty
    allFaculty.forEach(faculty => {
        faculty.borrowedCount = allTransactions.filter(t => t.userId === faculty.id && t.status === 'active').length;
    });

    tbody.innerHTML = allFaculty.map(faculty => `
        <tr>
            <td data-label="ID">${faculty.id}</td>
            <td data-label="Name">${faculty.name}</td>
            <td data-label="Email">${faculty.email}</td>
            <td data-label="Department">${faculty.department}</td>
            <td data-label="Position">${faculty.position}</td>
            <td data-label="Books Borrowed">${faculty.borrowedCount || 0}</td>
            <td data-label="Action">
                <button class="action-btn btn-qr" onclick="generateUserQR('${faculty.id}', '${faculty.name}', 'faculty')"><i class="fas fa-qrcode"></i></button>
                <button class="action-btn btn-delete" onclick="deleteFaculty('${faculty.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function loadTransactionsTable() {
    const tbody = document.getElementById('transactionsTable');
    if (allTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No transactions yet</td></tr>';
        return;
    }

    tbody.innerHTML = allTransactions.map(t => {
        const book = getBookById(t.bookId);
        return `
            <tr>
                <td data-label="User ID">${t.userId}</td>
                <td data-label="User Name">${t.userName || '-'}</td>
                <td data-label="Book Title">${book?.title || 'Unknown'}</td>
                <td data-label="Borrow Date">${new Date(t.borrowDate).toLocaleDateString()}</td>
                <td data-label="Due Date">${new Date(t.dueDate).toLocaleDateString()}</td>
                <td data-label="Return Date">${t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
                <td data-label="Status"><span class="book-status ${t.status === 'active' ? 'status-borrowed' : 'status-available'}">${t.status}</span></td>
            </tr>
        `;
    }).join('');
}

function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const isbn = document.getElementById('bookISBN').value;
    const copies = parseInt(document.getElementById('bookCopies').value);
    const category = document.getElementById('bookCategory').value;
    const description = document.getElementById('bookDescription').value;

    const newBook = {
        id: booksData.length + 1,
        title, author, isbn, copies, available: copies, category,
        description: description || 'A new addition to our library collection.'
    };

    booksData.push(newBook);
    showToast('Book added successfully!', 'success');
    loadBooksTable();
    loadDashboardData();
    document.getElementById('addBookForm').reset();
}

function addStudent() {
    const id = document.getElementById('studentId').value;
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const course = document.getElementById('studentCourse').value;
    const year = document.getElementById('studentYear').value;
    const phone = document.getElementById('studentPhone').value;

    if (allStudents.some(s => s.id === id)) {
        showToast('Student ID already exists!', 'error');
        return;
    }

    allStudents.push({ id, name, email, course, year, phone, borrowedCount: 0 });
    localStorage.setItem('students', JSON.stringify(allStudents));
    showToast('Student added successfully! Default password: student123', 'success');
    loadStudentsTable();
    loadDashboardData();
    document.getElementById('addStudentForm').reset();
}

function addFaculty() {
    const id = document.getElementById('facultyId').value;
    const name = document.getElementById('facultyName').value;
    const email = document.getElementById('facultyEmail').value;
    const department = document.getElementById('facultyDepartment').value;
    const position = document.getElementById('facultyPosition').value;
    const researchArea = document.getElementById('facultyResearch').value;

    if (allFaculty.some(f => f.id === id)) {
        showToast('Faculty ID already exists!', 'error');
        return;
    }

    allFaculty.push({ id, name, email, department, position, researchArea, borrowedCount: 0 });
    localStorage.setItem('faculty', JSON.stringify(allFaculty));
    showToast('Faculty member added successfully! Default password: faculty123', 'success');
    loadFacultyTable();
    loadDashboardData();
    document.getElementById('addFacultyForm').reset();
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        const index = booksData.findIndex(b => b.id === bookId);
        if (index !== -1) {
            booksData.splice(index, 1);
            showToast('Book deleted successfully!', 'success');
            loadBooksTable();
            loadDashboardData();
        }
    }
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student? This will also remove their borrowing history.')) {
        allStudents = allStudents.filter(s => s.id !== studentId);
        localStorage.setItem('students', JSON.stringify(allStudents));
        showToast('Student deleted successfully!', 'success');
        loadStudentsTable();
        loadDashboardData();
    }
}

function deleteFaculty(facultyId) {
    if (confirm('Are you sure you want to delete this faculty member?')) {
        allFaculty = allFaculty.filter(f => f.id !== facultyId);
        localStorage.setItem('faculty', JSON.stringify(allFaculty));
        showToast('Faculty member deleted successfully!', 'success');
        loadFacultyTable();
        loadDashboardData();
    }
}

function searchBooksTable() {
    const searchTerm = document.getElementById('bookSearchInput').value.toLowerCase();
    const category = document.getElementById('bookCategoryFilter').value;

    let filtered = booksData;
    if (searchTerm) {
        filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.isbn.includes(searchTerm)
        );
    }
    if (category) {
        filtered = filtered.filter(book => book.category === category);
    }

    const tbody = document.getElementById('booksTable');
    tbody.innerHTML = filtered.map(book => `
        <tr>
            <td data-label="Title">${book.title}</td>
            <td data-label="Author">${book.author}</td>
            <td data-label="ISBN">${book.isbn}</td>
            <td data-label="Category">${getCategoryName(book.category)}</td>
            <td data-label="Available">${book.available}</td>
            <td data-label="Total">${book.copies}</td>
            <td data-label="Action">
                <button class="action-btn btn-delete" onclick="deleteBook(${book.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function filterBooksTable() {
    searchBooksTable();
}

function searchStudentsTable() {
    const searchTerm = document.getElementById('studentSearchInput').value.toLowerCase();
    const filtered = allStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
    );

    const tbody = document.getElementById('studentsTable');
    tbody.innerHTML = filtered.map(student => `
        <tr>
            <td data-label="ID">${student.id}</td>
            <td data-label="Name">${student.name}</td>
            <td data-label="Email">${student.email}</td>
            <td data-label="Course">${student.course}</td>
            <td data-label="Year">${student.year}</td>
            <td data-label="Books Borrowed">${student.borrowedCount || 0}</td>
            <td data-label="Action">
                <button class="action-btn btn-qr" onclick="generateUserQR('${student.id}', '${student.name}', 'student')"><i class="fas fa-qrcode"></i></button>
                <button class="action-btn btn-delete" onclick="deleteStudent('${student.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function searchFacultyTable() {
    const searchTerm = document.getElementById('facultySearchInput').value.toLowerCase();
    const filtered = allFaculty.filter(faculty =>
        faculty.name.toLowerCase().includes(searchTerm) ||
        faculty.id.toLowerCase().includes(searchTerm) ||
        faculty.email.toLowerCase().includes(searchTerm) ||
        faculty.department.toLowerCase().includes(searchTerm)
    );

    const tbody = document.getElementById('facultyTable');
    tbody.innerHTML = filtered.map(faculty => `
        <tr>
            <td data-label="ID">${faculty.id}</td>
            <td data-label="Name">${faculty.name}</td>
            <td data-label="Email">${faculty.email}</td>
            <td data-label="Department">${faculty.department}</td>
            <td data-label="Position">${faculty.position}</td>
            <td data-label="Books Borrowed">${faculty.borrowedCount || 0}</td>
            <td data-label="Action">
                <button class="action-btn btn-qr" onclick="generateUserQR('${faculty.id}', '${faculty.name}', 'faculty')"><i class="fas fa-qrcode"></i></button>
                <button class="action-btn btn-delete" onclick="deleteFaculty('${faculty.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function filterTransactions() {
    const type = document.getElementById('transactionTypeFilter').value;
    const searchTerm = document.getElementById('transactionSearchInput').value.toLowerCase();

    let filtered = allTransactions;
    if (type !== 'all') {
        filtered = filtered.filter(t => t.status === type);
    }
    if (searchTerm) {
        filtered = filtered.filter(t =>
            t.userId.toLowerCase().includes(searchTerm) ||
            (t.userName && t.userName.toLowerCase().includes(searchTerm))
        );
    }

    const tbody = document.getElementById('transactionsTable');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No transactions found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(t => {
        const book = getBookById(t.bookId);
        return `
            <tr>
                <td data-label="User ID">${t.userId}</td>
                <td data-label="User Name">${t.userName || '-'}</td>
                <td data-label="Book Title">${book?.title || 'Unknown'}</td>
                <td data-label="Borrow Date">${new Date(t.borrowDate).toLocaleDateString()}</td>
                <td data-label="Due Date">${new Date(t.dueDate).toLocaleDateString()}</td>
                <td data-label="Return Date">${t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
                <td data-label="Status"><span class="book-status ${t.status === 'active' ? 'status-borrowed' : 'status-available'}">${t.status}</span></td>
            </tr>
        `;
    }).join('');
}

function exportTransactions() {
    let csv = 'User ID,User Name,Book Title,Borrow Date,Due Date,Return Date,Status\n';
    allTransactions.forEach(t => {
        const book = getBookById(t.bookId);
        csv += `"${t.userId}","${t.userName || ''}","${book?.title || 'Unknown'}","${new Date(t.borrowDate).toLocaleDateString()}","${new Date(t.dueDate).toLocaleDateString()}","${t.returnDate ? new Date(t.returnDate).toLocaleDateString() : ''}","${t.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Transactions exported successfully!', 'success');
}

let currentQRCode = null;

function generateQR() {
    const userType = document.getElementById('qrUserType').value;
    const userId = document.getElementById('qrUserId').value;
    const userName = document.getElementById('qrUserName').value;

    if (!userId || !userName) {
        showToast('Please fill all fields', 'error');
        return;
    }

    const qrData = JSON.stringify({ userType, userId, userName });
    document.getElementById('qrCodeContainer').innerHTML = '';

    currentQRCode = new QRCode(document.getElementById('qrCodeContainer'), {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#78A2D2",
        colorLight: "#ffffff"
    });

    document.getElementById('qrInfo').innerHTML = `
        <p><strong>User Type:</strong> ${userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>User Name:</strong> ${userName}</p>
        <p><strong>System:</strong> RT Library System</p>
    `;

    document.getElementById('qrResult').style.display = 'block';
    showToast('QR Code generated successfully!', 'success');
}

function generateUserQR(userId, userName, userType) {
    document.getElementById('qrUserType').value = userType;
    document.getElementById('qrUserId').value = userId;
    document.getElementById('qrUserName').value = userName;

    const qrData = JSON.stringify({ userType, userId, userName });
    document.getElementById('qrCodeContainer').innerHTML = '';

    currentQRCode = new QRCode(document.getElementById('qrCodeContainer'), {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#78A2D2",
        colorLight: "#ffffff"
    });

    document.getElementById('qrInfo').innerHTML = `
        <p><strong>User Type:</strong> ${userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>User Name:</strong> ${userName}</p>
        <p><strong>System:</strong> RT Library System</p>
    `;

    document.getElementById('qrResult').style.display = 'block';
    document.querySelector('[data-tab="qr"]').click();
    showToast('QR Code generated successfully!', 'success');
}

function downloadQR() {
    const canvas = document.querySelector('#qrCodeContainer canvas');
    if (canvas) {
        const link = document.createElement('a');
        const userId = document.getElementById('qrUserId').value;
        link.download = `RT_Library_QR_${userId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('QR Code downloaded!', 'success');
    }
}

function setTheme(theme) {
    document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
    event.target.classList.add('active');

    if (theme === 'dark') {
        document.documentElement.style.setProperty('--white', '#1a1a2e');
        document.documentElement.style.setProperty('--light', '#16213e');
        document.documentElement.style.setProperty('--dark', '#ffffff');
        document.body.style.background = '#0f0f1a';
        showToast('Dark theme applied', 'success');
    } else if (theme === 'light') {
        document.documentElement.style.setProperty('--white', '#ffffff');
        document.documentElement.style.setProperty('--light', '#f8f9fa');
        document.documentElement.style.setProperty('--dark', '#1a1a2e');
        document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        showToast('Light theme applied', 'success');
    }
}

function backupData() {
    const backup = {
        books: booksData,
        students: allStudents,
        faculty: allFaculty,
        transactions: allTransactions,
        backupDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    localStorage.setItem('lastBackup', new Date().toLocaleString());
    document.getElementById('lastBackup').textContent = new Date().toLocaleString();
    showToast('Data backup completed!', 'success');
}

function clearData() {
    if (confirm('⚠️ WARNING: This will delete ALL data including books, users, and transactions. This action cannot be undone. Are you sure?')) {
        if (confirm('Type "CONFIRM" to proceed with data deletion')) {
            const confirmation = prompt('Type "CONFIRM" to delete all data:');
            if (confirmation === 'CONFIRM') {
                // Reset books to default
                booksData.length = 0;
                booksData.push(...defaultBooksData);

                // Clear users
                localStorage.removeItem('students');
                localStorage.removeItem('faculty');
                localStorage.removeItem('transactions');

                // Reload
                location.reload();
                showToast('All data has been cleared', 'success');
            } else {
                showToast('Data deletion cancelled', 'info');
            }
        }
    }
}

function updateSystemInfo() {
    document.getElementById('totalUsers').textContent = allStudents.length + allFaculty.length + 1;
    const lastBackup = localStorage.getItem('lastBackup');
    if (lastBackup) {
        document.getElementById('lastBackup').textContent = lastBackup;
    }
}

function getCategoryName(categoryId) {
    const categories = {
        'computer-science': 'CS',
        'mathematics': 'Math',
        'physics': 'Physics',
        'literature': 'Literature',
        'history': 'History',
        'biology': 'Biology'
    };
    return categories[categoryId] || categoryId;
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function logout() {
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

// Default books data for reset
const defaultBooksData = [...booksData];