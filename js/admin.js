// Admin Dashboard JavaScript

let currentAdmin = null;
let allStudents = [];
let allFaculty = [];

document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    setupNavigation();
    loadDashboardData();
    loadBooksTable();
    loadStudentsTable();
    loadTransactionsTable();
    setupForms();
});

function loadAdminData() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentAdmin = JSON.parse(storedUser);
        document.getElementById('userName').textContent = currentAdmin.name;
        document.getElementById('userId').textContent = currentAdmin.id;
        document.getElementById('userAvatar').textContent = 'AD';
    } else {
        window.location.href = 'login.html';
    }
    
    // Load students from localStorage
    allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    if (allStudents.length === 0) {
        allStudents = [
            { id: 'S001', name: 'John Doe', email: 'john@example.com', course: 'Computer Science', year: '3rd Year' },
            { id: 'S002', name: 'Jane Smith', email: 'jane@example.com', course: 'Information Technology', year: '3rd Year' }
        ];
        localStorage.setItem('students', JSON.stringify(allStudents));
    }
    
    allFaculty = JSON.parse(localStorage.getItem('faculty') || '[]');
    if (allFaculty.length === 0) {
        allFaculty = [
            { id: 'F001', name: 'Dr. Robert Smith', email: 'robert@example.com', department: 'Computer Science', position: 'Professor' }
        ];
        localStorage.setItem('faculty', JSON.stringify(allFaculty));
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

function setupForms() {
    document.getElementById('addBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });
    
    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addStudent();
    });
}

function loadDashboardData() {
    document.getElementById('totalBooks').textContent = booksData.length;
    document.getElementById('totalStudents').textContent = allStudents.length;
    document.getElementById('totalFaculty').textContent = allFaculty.length;
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const activeBorrowings = transactions.filter(t => t.status === 'active').length;
    document.getElementById('activeBorrowings').textContent = activeBorrowings;
    
    const recent = transactions.slice(0, 5);
    const tbody = document.getElementById('recentTransactions');
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No transactions yet</td></tr>';
    } else {
        tbody.innerHTML = recent.map(t => {
            const book = getBookById(t.bookId);
            return `<tr><td>${t.userId}</td><td>${book?.title || 'Unknown'}</td><td>${t.status === 'active' ? 'Borrowed' : 'Returned'}</td><td>${new Date(t.borrowDate).toLocaleDateString()}</td></tr>`;
        }).join('');
    }
}

function loadBooksTable() {
    const tbody = document.getElementById('booksTable');
    tbody.innerHTML = booksData.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${getCategoryName(book.category)}</td>
            <td>${book.available}/${book.copies}</td>
            <td><button class="action-btn btn-delete" onclick="deleteBook(${book.id})">Delete</button></td>
        </tr>
    `).join('');
}

function loadStudentsTable() {
    const tbody = document.getElementById('studentsTable');
    if (allStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No students added</td></tr>';
        return;
    }
    tbody.innerHTML = allStudents.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td><button class="action-btn btn-delete" onclick="deleteStudent('${student.id}')">Delete</button></td>
        </tr>
    `).join('');
}

function loadTransactionsTable() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const tbody = document.getElementById('transactionsTable');
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No transactions yet</td></tr>';
        return;
    }
    tbody.innerHTML = transactions.map(t => {
        const book = getBookById(t.bookId);
        return `<tr>
            <td>${t.userId}</td>
            <td>${book?.title || 'Unknown'}</td>
            <td>${new Date(t.borrowDate).toLocaleDateString()}</td>
            <td>${new Date(t.dueDate).toLocaleDateString()}</td>
            <td>${t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
            <td><span class="book-status ${t.status === 'active' ? 'status-borrowed' : 'status-available'}">${t.status}</span></td>
        </tr>`;
    }).join('');
}

function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const isbn = document.getElementById('bookISBN').value;
    const copies = parseInt(document.getElementById('bookCopies').value);
    const category = document.getElementById('bookCategory').value;
    
    const newBook = {
        id: booksData.length + 1,
        title, author, isbn, copies, available: copies, category,
        description: 'A new addition to our library collection.'
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
    
    if (allStudents.some(s => s.id === id)) {
        showToast('Student ID already exists!', 'error');
        return;
    }
    
    allStudents.push({ id, name, email, course, year });
    localStorage.setItem('students', JSON.stringify(allStudents));
    showToast('Student added successfully!', 'success');
    loadStudentsTable();
    loadDashboardData();
    document.getElementById('addStudentForm').reset();
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
    if (confirm('Are you sure you want to delete this student?')) {
        allStudents = allStudents.filter(s => s.id !== studentId);
        localStorage.setItem('students', JSON.stringify(allStudents));
        showToast('Student deleted successfully!', 'success');
        loadStudentsTable();
        loadDashboardData();
    }
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
        colorDark: "#000000",
        colorLight: "#ffffff"
    });
    
    document.getElementById('qrResult').style.display = 'block';
    showToast('QR Code generated successfully!', 'success');
}

function downloadQR() {
    const canvas = document.querySelector('#qrCodeContainer canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'library-qr-code.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('QR Code downloaded!', 'success');
    }
}

function getCategoryName(categoryId) {
    const categories = { 'computer-science': 'CS', 'mathematics': 'Math', 'physics': 'Physics', 'literature': 'Literature', 'history': 'History', 'biology': 'Biology' };
    return categories[categoryId] || categoryId;
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