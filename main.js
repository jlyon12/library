// Show / Hide New Book Modal
const btnAddBook = document.getElementById("show-modal-btn");
const bookCardModal = document.getElementById("new-book-modal");
const mainContent = document.getElementById("main-content");
const btnCloseModal = document.getElementById("close-modal-btn");

// Book Modal Form Controls
const bookCardForm = document.getElementById("new-book-form");
const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPageCount = document.getElementById("page-count");
const inputReadStatus = document.getElementById("read-status");
const btnSubmitEntry = document.getElementById("submit-book");
const btnEditEntry = document.getElementById("edit-book");

btnAddBook.onclick = (e) => {
	e.stopPropagation();
	bookCardModal.classList.remove("hidden");
	mainContent.classList.add("fade");
	bookCardForm.reset();
};

btnCloseModal.onclick = (e) => {
	e.stopPropagation();
	bookCardModal.classList.add("hidden");
	mainContent.classList.remove("fade");
};

// Create New Book Object via Form Modal
const bookCollection = document.querySelector(".book-collection");

let library = [];

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
// Generate Library Statistics
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

// Generate DOM element for each book object in library array and save an updated library in local storage
function generateBookCards(array) {
	function saveLibrary() {
		localStorage.setItem("savedLibrary", JSON.stringify(library));
	}
	bookCollection.textContent = "";
	array.forEach((book) => {
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
			// Repurpose the add book form to edit the book object and update the array via hidden form button
			else if (e.target.classList.contains("btn-edit-book")) {
				bookCardModal.classList.remove("hidden");
				mainContent.classList.add("fade");
				btnSubmitEntry.classList.add("hidden");
				btnEditEntry.classList.remove("hidden");
				inputTitle.value = library[bookIndex].title;
				inputAuthor.value = library[bookIndex].author;
				inputPageCount.value = library[bookIndex].pageCount;
				inputReadStatus.checked = library[bookIndex].readStatus;
				btnEditEntry.addEventListener("click", () => {
					library[bookIndex].title = inputTitle.value;
					library[bookIndex].author = inputAuthor.value;
					library[bookIndex].pageCount = Number(inputPageCount.value);
					library[bookIndex].readStatus = inputReadStatus.checked;
					bookCardModal.classList.add("hidden");
					mainContent.classList.remove("fade");
					btnSubmitEntry.classList.remove("hidden");
					btnEditEntry.classList.add("hidden");
					generateStats();
					generateBookCards(array);
				});
			}
			generateBookCards(array);
			generateStats();
		});
		// Add elements to bookCard DOM element
		const bookControlsContainer = document.createElement("div");
		bookControlsContainer.classList.add("book-card-btns");
		bookCard.appendChild(bookControlsContainer);
		const btnEditBook = document.createElement("button");
		btnEditBook.classList.add("btn-edit-book");
		bookControlsContainer.appendChild(btnEditBook);
		const btnDeleteBook = document.createElement("button");
		btnDeleteBook.classList.add("btn-delete-book");
		bookControlsContainer.appendChild(btnDeleteBook);

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
	saveLibrary();
}

// Check if localStorage is present and generate the library + stats on page
const savedLibrary = JSON.parse(localStorage.getItem("savedLibrary"));
if (savedLibrary !== null) {
	library = library.concat(savedLibrary);
	generateStats();
	generateBookCards(library);
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
		generateBookCards(library);
		bookCardModal.classList.add("hidden");
		mainContent.classList.remove("fade");
	}
};

// Show / Hide sorting btns

const showSortingBtn = document.getElementById("show-sorting-btn");
const sortingBtnsContainer = document.getElementById("sort-btns");

showSortingBtn.onclick = () => {
	sortingBtnsContainer.classList.toggle("hidden");

	if (sortingBtnsContainer.classList.contains("hidden")) {
		showSortingBtn.textContent = "Show Sorting Options";
	} else if (!sortingBtnsContainer.classList.contains("hidden")) {
		showSortingBtn.textContent = "Hide Sorting Options";
	}
};

// Methods to sort the library
const sortAuthorsBtn = document.getElementById("sort-author-btn");
const sortTitlesBtn = document.getElementById("sort-title-btn");
const sortShortestBtn = document.getElementById("sort-shortest-btn");
const sortLongestBtn = document.getElementById("sort-longest-btn");
const sortUnreadBtn = document.getElementById("sort-unread-btn");

sortAuthorsBtn.addEventListener("click", () => {
	const sortedAuthors = library.sort((a, b) => {
		const splitAuthorNameA = a.author.split(" ");
		const authorLastNameA = splitAuthorNameA[splitAuthorNameA.length - 1];
		const splitAuthorNameB = b.author.split(" ");
		const authorLastNameB = splitAuthorNameB[splitAuthorNameB.length - 1];
		if (authorLastNameA.toLowerCase() > authorLastNameB.toLowerCase()) {
			return 1;
		}
		if (authorLastNameA.toLowerCase() < authorLastNameB.toLowerCase()) {
			return -1;
		}
	});

	generateBookCards(sortedAuthors);
});

sortTitlesBtn.addEventListener("click", () => {
	const sortedTitles = library.sort((a, b) => {
		if (a.title.toLowerCase() > b.title.toLowerCase()) {
			return 1;
		}
		if (a.title.toLowerCase() < b.title.toLowerCase()) {
			return -1;
		}
	});

	generateBookCards(sortedTitles); //
});

sortShortestBtn.addEventListener("click", () => {
	const sortedShortest = library.sort((a, b) =>
		a.pageCount > b.pageCount ? 1 : -1
	);

	generateBookCards(sortedShortest); //
});

sortLongestBtn.addEventListener("click", () => {
	const sortedLongest = library.sort((a, b) =>
		a.pageCount < b.pageCount ? 1 : -1
	);

	generateBookCards(sortedLongest); //
});

sortUnreadBtn.addEventListener("click", () => {
	const sortedUnread = library.sort((a, b) => {
		if (a.readStatus === true && b.readStatus === false) {
			return 1;
		}
		if (a.readStatus === false && b.readStatus === true) {
			return -1;
		}
	});

	generateBookCards(sortedUnread); //
});
