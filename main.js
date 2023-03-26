// Show / Hide New Book Modal
const btnAddBook = document.getElementById("show-modal-btn");
const bookCardModal = document.getElementById("new-book-modal");
const mainContent = document.getElementById("main-content");
const btnCloseModal = document.getElementById("close-modal-btn");

btnAddBook.onclick = (e) => {
	e.stopPropagation();
	bookCardModal.classList.remove("hidden");
	mainContent.classList.add("fade");
};

btnCloseModal.onclick = (e) => {
	e.stopPropagation();
	bookCardModal.classList.add("hidden");
	mainContent.classList.remove("fade");
};

// Book Modal Form Controls
const bookCardForm = document.getElementById("new-book-form");
const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPageCount = document.getElementById("page-count");
const inputReadStatus = document.getElementById("read-status");
const btnSubmitEntry = document.getElementById("submit-book");

// Create New Book Object via Form Modal
const bookCollection = document.querySelector(".book-collection");

const library = [];

class Book {
	constructor(title, author, pageCount, readStatus) {
		this.title = title;
		this.author = author;
		this.pageCount = pageCount;
		this.readStatus = readStatus;
	}
}

function addBookToLibrary() {
	const newEntry = new Book(
		inputTitle.value,
		inputAuthor.value,
		Number(inputPageCount.value),
		inputReadStatus.checked
	);
	library.push(newEntry);
	bookCardForm.reset();
}
// Generate Stats
function generateStats() {
	const totalBooksOutput = document.getElementById("total-books");
	totalBooksOutput.textContent = library.length;

	const booksReadOutput = document.getElementById("books-read");
	const booksRead = library.filter((book) => book.readStatus === true);
	booksReadOutput.textContent = booksRead.length;

	const totalPagesReadOutput = document.getElementById("pages-read");
	const totalPagesRead = booksRead.reduce(
		(total, obj) => total + obj.pageCount,
		0
	);
	totalPagesReadOutput.textContent = totalPagesRead;
}

// Generate DOM elements
function generateBookCards() {
	bookCollection.textContent = "";
	library.forEach((book) => {
		const bookCard = document.createElement("div");
		bookCard.classList.add("book-card");
		// Link each bookCard DOM element to library array corresponding index
		bookCard.setAttribute("data-book-index", library.indexOf(book));
		// Add event listeners for bookCard manipulation , update object in library
		bookCard.addEventListener("click", (e) => {
			const bookIndex = bookCard.getAttribute("data-book-index");
			if (e.target.classList.contains("btn-delete-book")) {
				library.splice(bookIndex, 1);
			} else if (e.target.classList.contains("read-status-btn")) {
				if (book.readStatus === true) {
					library[bookIndex].readStatus = false;
				} else if (book.readStatus === false) {
					library[bookIndex].readStatus = true;
				}
			}
			generateBookCards();
			generateStats();
		});
		// Add elements to bookCard DOM element
		const btnDeleteBook = document.createElement("button");
		btnDeleteBook.classList.add("btn-delete-book");

		bookCard.appendChild(btnDeleteBook);

		const cardTitle = document.createElement("p");
		cardTitle.textContent = `"${book.title}"`;
		bookCard.appendChild(cardTitle);

		const cardAuthor = document.createElement("p");
		cardAuthor.textContent = `${book.author}`;
		bookCard.appendChild(cardAuthor);

		const cardPageCount = document.createElement("p");
		cardPageCount.textContent = `${book.pageCount} pgs`;
		bookCard.appendChild(cardPageCount);

		const cardReadStatus = document.createElement("button");
		cardReadStatus.classList.add("button");
		cardReadStatus.classList.add("read-status-btn");
		if (book.readStatus === true) {
			cardReadStatus.classList.add("read-book");
		} else if (book.readStatus === false) {
			cardReadStatus.classList.add("unread-book");
		}
		cardReadStatus.textContent =
			book.readStatus === true ? "Finished" : "Not read";
		bookCard.appendChild(cardReadStatus);

		bookCollection.appendChild(bookCard);
	});
}

// Run all relevant functions when a new book is submitted
btnSubmitEntry.onclick = () => {
	if (
		inputTitle.value !== "" &&
		inputAuthor.value !== "" &&
		inputPageCount.value.match(/\d/)
	) {
		addBookToLibrary();
		generateStats();
		generateBookCards();
		bookCardModal.classList.add("hidden");
		mainContent.classList.remove("fade");
	}
};
