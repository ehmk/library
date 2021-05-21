// 4

const bookList = document.getElementById('book-list');
const popOutForm = document.getElementById('popout-form');
const addBookButton = document.getElementById('add-book');
const submitBookButton = document.getElementById('submit-book');
let formTitle = document.getElementById('form-title');
let formAuthor = document.getElementById('form-author');
let formPages = document.getElementById('form-pages');
let formRead = document.getElementById('form-read');
let formNotRead = document.getElementById('form-unread');
let bookCards = document.getElementsByClassName('book-card');
let myLibrary = [];

addBookToLibrary('Harry Potter and the Sorcerer\'s Stone', 'JK Rowling', 500, false);
addBookToLibrary('The Hobbit', 'JRR Tolkien', 500, false);
addBookToLibrary('Game of Thrones: A Song of Fire and Ice', 'George RR Martin', 1000, false);
generateCardList(myLibrary);
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
  let newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
}

function generateBookCard(book) {
  let bookCard = document.createElement('div');
  bookCard.classList.add('book-card');
  
  let title = document.createElement('h3');
  title.textContent = book.title;
  bookCard.appendChild(title);

  let author = document.createElement('p');
  author.textContent = `Author: ${book.author}`;
  bookCard.appendChild(author);

  let pages = document.createElement('p');
  pages.textContent = `Pages: ${book.pages}`;
  bookCard.appendChild(pages);

  let read = document.createElement('p');
  read.textContent = `${book.read ? 'Read: Yes' : 'Read: No'}`
  
  bookCard.appendChild(read);
  
  bookList.appendChild(bookCard);
}

function generateCardList(bookList) {
  for (let i = 0; i < bookList.length; i++) {
    generateBookCard(bookList[i]);
  }
}

function setIndex(array) {
  for (let i = 0; i < array.length; i++) {
    array[i].setAttribute('data-index', i);
  }
}

function removeAllCards() {
  while (bookList.firstChild) {
    bookList.removeChild(bookList.firstChild);
  }
}

function reloadCardList(bookList) {
  removeAllCards();
  generateCardList(bookList);
}

function togglePopOutForm() {
  if (popOutForm.style.display === '') {
    popOutForm.style.display = 'block';
    addBookButton.textContent = 'Close form';
  } else if (popOutForm.style.display === 'block') {
    popOutForm.style.display = 'none';
    addBookButton.textContent = 'Add Book';
  } else if (popOutForm.style.display === 'none') {
    popOutForm.style.display = 'block';
    addBookButton.textContent = 'Close Form';
  }
}

function submitForm() {
  let read;
  if (formRead.checked) {
    read = true;
  } else {
    read = false;
  }
  if (formTitle.value === '' || formAuthor.value === '' || formPages.value === '') {
    alert('Please fill out all fields before submitting.');
    return;
  }
  addBookToLibrary(formTitle.value, formAuthor.value, formPages.value, read);
  resetForm();
  removeAllCards();
  generateCardList(myLibrary);
}

function resetForm() {
  formTitle.value = '';
  formAuthor.value = '';
  formPages.value = '';
}

addBookButton.addEventListener('click', () => {
  togglePopOutForm();
});
submitBookButton.addEventListener('click', () => {
  submitForm();
});





