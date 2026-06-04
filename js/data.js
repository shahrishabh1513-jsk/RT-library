// Library Data - 60 Books Across All Categories

const booksData = [
    // Computer Science Books (10 books)
    { id: 1, title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "9780262033848", category: "computer-science", copies: 5, available: 3, description: "The definitive guide to algorithms for computer science students and professionals." },
    { id: 2, title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", category: "computer-science", copies: 4, available: 2, description: "A handbook of agile software craftsmanship." },
    { id: 3, title: "The Pragmatic Programmer", author: "David Thomas", isbn: "9780201616224", category: "computer-science", copies: 3, available: 1, description: "Your journey to mastery in software development." },
    { id: 4, title: "Design Patterns", author: "Erich Gamma", isbn: "9780201633610", category: "computer-science", copies: 4, available: 4, description: "Elements of reusable object-oriented software." },
    { id: 5, title: "Computer Networking", author: "James Kurose", isbn: "9780132856201", category: "computer-science", copies: 3, available: 2, description: "A top-down approach to computer networking." },
    { id: 6, title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "9780078022159", category: "computer-science", copies: 5, available: 3, description: "Comprehensive coverage of database systems." },
    { id: 7, title: "Operating System Concepts", author: "Abraham Silberschatz", isbn: "9781118063330", category: "computer-science", copies: 4, available: 4, description: "Classic textbook on operating systems." },
    { id: 8, title: "Artificial Intelligence", author: "Stuart Russell", isbn: "9780134610993", category: "computer-science", copies: 3, available: 2, description: "A modern approach to AI." },
    { id: 9, title: "JavaScript: The Good Parts", author: "Douglas Crockford", isbn: "9780596517748", category: "computer-science", copies: 3, available: 1, description: "Uncovering the excellent parts of JavaScript." },
    { id: 10, title: "Python Crash Course", author: "Eric Matthes", isbn: "9781593279288", category: "computer-science", copies: 5, available: 4, description: "A hands-on introduction to Python programming." },

    // Mathematics Books (10 books)
    { id: 11, title: "Calculus: Early Transcendentals", author: "James Stewart", isbn: "9781285741550", category: "mathematics", copies: 6, available: 4, description: "The standard textbook for calculus courses." },
    { id: 12, title: "Linear Algebra and Its Applications", author: "David C. Lay", isbn: "9780321982384", category: "mathematics", copies: 4, available: 3, description: "Practical approach to linear algebra." },
    { id: 13, title: "Introduction to Probability", author: "Bertsekas", isbn: "9781886529236", category: "mathematics", copies: 3, available: 2, description: "Comprehensive introduction to probability theory." },
    { id: 14, title: "Discrete Mathematics", author: "Kenneth Rosen", isbn: "9780073383095", category: "mathematics", copies: 5, available: 4, description: "Applications of discrete mathematics." },
    { id: 15, title: "Statistics for Business", author: "Anderson", isbn: "9781337114163", category: "mathematics", copies: 4, available: 2, description: "Business statistics with real-world applications." },
    { id: 16, title: "Number Theory", author: "George Andrews", isbn: "9780486682525", category: "mathematics", copies: 2, available: 1, description: "Introduction to number theory." },
    { id: 17, title: "Geometry Revisited", author: "H.S.M. Coxeter", isbn: "9780883856192", category: "mathematics", copies: 2, available: 2, description: "Classic geometry text." },
    { id: 18, title: "Differential Equations", author: "William Boyce", isbn: "9780470458310", category: "mathematics", copies: 4, available: 3, description: "Introduction to differential equations." },
    { id: 19, title: "Complex Variables", author: "Churchill", isbn: "9780073383170", category: "mathematics", copies: 3, available: 2, description: "Complex analysis and applications." },
    { id: 20, title: "Mathematical Proofs", author: "Gary Chartrand", isbn: "9780321390530", category: "mathematics", copies: 3, available: 3, description: "Transition to advanced mathematics." },

    // Physics Books (10 books)
    { id: 21, title: "Fundamentals of Physics", author: "David Halliday", isbn: "9781118230718", category: "physics", copies: 6, available: 4, description: "The standard introductory physics textbook." },
    { id: 22, title: "Classical Mechanics", author: "Herbert Goldstein", isbn: "9780201657029", category: "physics", copies: 3, available: 2, description: "Graduate-level classical mechanics." },
    { id: 23, title: "Introduction to Electrodynamics", author: "David Griffiths", isbn: "9781108420419", category: "physics", copies: 4, available: 3, description: "Clear introduction to electrodynamics." },
    { id: 24, title: "Quantum Mechanics", author: "David Griffiths", isbn: "9781107179868", category: "physics", copies: 4, available: 2, description: "Principles of quantum mechanics." },
    { id: 25, title: "Thermal Physics", author: "Daniel Schroeder", isbn: "9780201380279", category: "physics", copies: 3, available: 2, description: "Introduction to thermal physics." },
    { id: 26, title: "Optics", author: "Eugene Hecht", isbn: "9780133977226", category: "physics", copies: 4, available: 3, description: "Comprehensive optics textbook." },
    { id: 27, title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", isbn: "9780393609394", category: "physics", copies: 5, available: 5, description: "Brief introduction to astrophysics." },
    { id: 28, title: "The Feynman Lectures on Physics", author: "Richard Feynman", isbn: "9780465023820", category: "physics", copies: 3, available: 1, description: "Classic physics lectures." },
    { id: 29, title: "Statistical Mechanics", author: "R.K. Pathria", isbn: "9780123821881", category: "physics", copies: 2, available: 2, description: "Graduate text on statistical mechanics." },
    { id: 30, title: "Nuclear Physics", author: "Kenneth Krane", isbn: "9780471805533", category: "physics", copies: 3, available: 2, description: "Introduction to nuclear physics." },

    // Literature Books (10 books)
    { id: 31, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", category: "literature", copies: 5, available: 3, description: "Classic American novel about racial injustice." },
    { id: 32, title: "1984", author: "George Orwell", isbn: "9780451524935", category: "literature", copies: 6, available: 4, description: "Dystopian social science fiction novel." },
    { id: 33, title: "Pride and Prejudice", author: "Jane Austen", isbn: "9780141439518", category: "literature", copies: 4, available: 3, description: "Romantic novel of manners." },
    { id: 34, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", category: "literature", copies: 5, available: 4, description: "Tragic story of the American Dream." },
    { id: 35, title: "Moby Dick", author: "Herman Melville", isbn: "9781503280786", category: "literature", copies: 3, available: 2, description: "Epic tale of Captain Ahab's quest." },
    { id: 36, title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "9780316769488", category: "literature", copies: 4, available: 3, description: "Story of teenage rebellion and alienation." },
    { id: 37, title: "Lord of the Flies", author: "William Golding", isbn: "9780399501487", category: "literature", copies: 4, available: 2, description: "Allegorical novel about human nature." },
    { id: 38, title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "9780547928227", category: "literature", copies: 5, available: 4, description: "Fantasy adventure novel." },
    { id: 39, title: "Jane Eyre", author: "Charlotte Bronte", isbn: "9780141441146", category: "literature", copies: 4, available: 3, description: "Gothic romance novel." },
    { id: 40, title: "Wuthering Heights", author: "Emily Bronte", isbn: "9780141439556", category: "literature", copies: 3, available: 2, description: "Tragic tale of passionate love." },

    // History Books (10 books)
    { id: 41, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", isbn: "9780062316097", category: "history", copies: 5, available: 4, description: "History of the human species." },
    { id: 42, title: "The Rise and Fall of the Third Reich", author: "William Shirer", isbn: "9781451651683", category: "history", copies: 3, available: 2, description: "History of Nazi Germany." },
    { id: 43, title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "9780393317558", category: "history", copies: 4, available: 3, description: "Fates of human societies." },
    { id: 44, title: "A People's History of the United States", author: "Howard Zinn", isbn: "9780062397348", category: "history", copies: 4, available: 2, description: "Alternative American history." },
    { id: 45, title: "The History of the Ancient World", author: "Susan Wise Bauer", isbn: "9780393059748", category: "history", copies: 3, available: 2, description: "From the earliest accounts to the fall of Rome." },
    { id: 46, title: "The Crusades", author: "Thomas Asbridge", isbn: "9780060787295", category: "history", copies: 2, available: 1, description: "History of the Crusades." },
    { id: 47, title: "The Silk Roads", author: "Peter Frankopan", isbn: "9781101946329", category: "history", copies: 3, available: 3, description: "New history of the world." },
    { id: 48, title: "The Wright Brothers", author: "David McCullough", isbn: "9781476728742", category: "history", copies: 3, available: 2, description: "Story of the aviation pioneers." },
    { id: 49, title: "1776", author: "David McCullough", isbn: "9780743226721", category: "history", copies: 4, available: 3, description: "Story of America's founding year." },
    { id: 50, title: "The Second World War", author: "Antony Beevor", isbn: "9780316023740", category: "history", copies: 3, available: 2, description: "Comprehensive WWII history." },

    // Biology Books (10 books)
    { id: 51, title: "The Selfish Gene", author: "Richard Dawkins", isbn: "9780199291151", category: "biology", copies: 4, available: 3, description: "Gene-centered view of evolution." },
    { id: 52, title: "The Origin of Species", author: "Charles Darwin", isbn: "9781509827695", category: "biology", copies: 5, available: 4, description: "Darwin's seminal work on evolution." },
    { id: 53, title: "The Human Body", author: "Bill Bryson", isbn: "9780385539302", category: "biology", copies: 3, available: 2, description: "Guide to the human body." },
    { id: 54, title: "Molecular Biology of the Cell", author: "Bruce Alberts", isbn: "9780815344322", category: "biology", copies: 2, available: 1, description: "Standard cell biology textbook." },
    { id: 55, title: "Campbell Biology", author: "Jane Reece", isbn: "9780134093413", category: "biology", copies: 4, available: 2, description: "Comprehensive biology textbook." },
    { id: 56, title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", isbn: "9781400052189", category: "biology", copies: 4, available: 3, description: "Story behind HeLa cells." },
    { id: 57, title: "I Contain Multitudes", author: "Ed Yong", isbn: "9780062368591", category: "biology", copies: 3, available: 2, description: "Microbes within us and our world." },
    { id: 58, title: "The Gene", author: "Siddhartha Mukherjee", isbn: "9781476733500", category: "biology", copies: 4, available: 3, description: "Intimate history of the gene." },
    { id: 59, title: "The Sixth Extinction", author: "Elizabeth Kolbert", isbn: "9781250062185", category: "biology", copies: 3, available: 2, description: "Current mass extinction event." },
    { id: 60, title: "Your Inner Fish", author: "Neil Shubin", isbn: "9780307277459", category: "biology", copies: 3, available: 3, description: "Journey into the 3.5-billion-year history of the human body." }
];

// Categories
const categories = [
    { id: "computer-science", name: "Computer Science", icon: "fa-laptop-code", count: 10 },
    { id: "mathematics", name: "Mathematics", icon: "fa-calculator", count: 10 },
    { id: "physics", name: "Physics", icon: "fa-atom", count: 10 },
    { id: "literature", name: "Literature", icon: "fa-feather-alt", count: 10 },
    { id: "history", name: "History", icon: "fa-landmark", count: 10 },
    { id: "biology", name: "Biology", icon: "fa-dna", count: 10 }
];

// User Data
let currentUser = null;
let isLoggedIn = false;

// Transaction History
let transactions = [];

// Function to get books by category
function getBooksByCategory(category) {
    return booksData.filter(book => book.category === category);
}

// Function to get featured books (first 6)
function getFeaturedBooks() {
    return booksData.slice(0, 6);
}

// Function to search books
function searchBooks(query) {
    const searchTerm = query.toLowerCase();
    return booksData.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.includes(searchTerm)
    );
}

// Function to get book by ID
function getBookById(id) {
    return booksData.find(book => book.id === id);
}

// Function to check if book is available
function isBookAvailable(bookId) {
    const book = getBookById(bookId);
    return book && book.available > 0;
}

// Function to borrow a book
function borrowBook(userId, bookId) {
    const book = getBookById(bookId);
    if (!book || book.available <= 0) {
        return { success: false, message: "Book not available" };
    }

    book.available--;

    const transaction = {
        id: transactions.length + 1,
        userId: userId,
        bookId: bookId,
        bookTitle: book.title,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active"
    };

    transactions.unshift(transaction);

    return { success: true, message: "Book borrowed successfully", transaction };
}

// Function to return a book
function returnBook(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || transaction.status !== "active") {
        return { success: false, message: "Invalid transaction" };
    }

    const book = getBookById(transaction.bookId);
    if (book) {
        book.available++;
    }

    transaction.status = "returned";
    transaction.returnDate = new Date().toISOString();

    return { success: true, message: "Book returned successfully" };
}

// Export for use in other files (for browser)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { booksData, categories, getBooksByCategory, getFeaturedBooks, searchBooks, getBookById, isBookAvailable, borrowBook, returnBook };
}