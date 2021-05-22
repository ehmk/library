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
let removeBookButton = document.getElementsByClassName('remove-book-button');
let toggleReadButton = document.getElementsByClassName('read-status-button');
let myLibrary = [];

addBookButton.addEventListener('click', () => {
  togglePopOutForm();
});
submitBookButton.addEventListener('click', () => {
  submitForm();
});

const db = firebase.firestore();
db.settings({timestampsInSnapshops: true});

function addBooksFromDb(doc) {
  addBookToLibrary(doc.data().title, doc.data().author, doc.data().pages, doc.data().read);
  reloadCardList(myLibrary);
}

// Get data
db.collection('books').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    addBooksFromDb(doc);
  });
});

// Saving data

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
  // addBookToLibrary(formTitle.value, formAuthor.value, formPages.value, read);
  db.collection('books').add({
    title: formTitle.value,
    author: formAuthor.value,
    pages: formPages.value,
    read: read
  });
  resetForm();
  removeAllCards();
  generateCardList(myLibrary);
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleReadStatus = function() {
  if (this.read === true) {
    this.read = false;
  } else if (this.read === false){
    this.read = true;
  }
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

  generateRemoveBookButton(bookCard);
  generateReadStatusButton(bookCard);
  
  bookList.appendChild(bookCard);
}

function generateCardList(bookList) {
  for (let i = 0; i < bookList.length; i++) {
    generateBookCard(bookList[i]);
  }
  setIndex(bookCards);
  addRemoveBookEvents();
  addToggleReadStatusEvents();
}

function generateRemoveBookButton(bookCard) {
  let removeButton = document.createElement('button');
  removeButton.textContent = 'Remove Book';
  removeButton.classList.add('remove-book-button');
  bookCard.appendChild(removeButton);
}

function generateReadStatusButton(bookCard) {
  let readStatusButton = document.createElement('button');
  readStatusButton.textContent = 'Toggle read status';
  readStatusButton.classList.add('read-status-button');
  bookCard.appendChild(readStatusButton);
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
    addBookButton.textContent = 'New Book';
  } else if (popOutForm.style.display === 'none') {
    popOutForm.style.display = 'block';
    addBookButton.textContent = 'Close Form';
  }
}

function resetForm() {
  formTitle.value = '';
  formAuthor.value = '';
  formPages.value = '';
}

function addRemoveBookEvents() {
  for (let i = 0; i < removeBookButton.length; i++) {
    removeBookButton[i].addEventListener('click', () => {
      removeBook(i);
    });
  }
}

function addToggleReadStatusEvents() {
  for (let i = 0; i < toggleReadButton.length; i++) {
    toggleReadButton[i].addEventListener('click', () => {
      let index = bookCards[i].getAttribute('data-index');
      myLibrary[i].toggleReadStatus();
      reloadCardList(myLibrary);
    });
  }
}

function removeBook(i) {
  let index = bookCards[i].getAttribute('data-index');
  myLibrary.splice(i, 1);
  reloadCardList(myLibrary);
}





