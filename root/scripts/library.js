const firebaseConfig = {
  apiKey: "AIzaSyCeuhJPqxiDkrsqTCCRSZ4ZK77h5UAWG5U",
  authDomain: "library-91ceb.firebaseapp.com",
  projectId: "library-91ceb",
  storageBucket: "library-91ceb.appspot.com",
  messagingSenderId: "1062317287780",
  appId: "1:1062317287780:web:633e2e52a6c6ab7587b271"
};
firebase.initializeApp(firebaseConfig);

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
db.settings({timestampsInSnapshots: true});

function addBooksFromDb(doc) {
  addBookToLibrary(doc.data().title, doc.data().author, doc.data().pages, doc.data().read, doc.id);
  reloadCardList(myLibrary);
}

// Real-time Listener
db.collection('books').orderBy('title').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if(change.type == 'added') {
      addBooksFromDb(change.doc);
    } else if (change.type == 'removed') {
      let card = document.querySelector(`[data-index='${change.doc.id}']`);
      bookList.removeChild(card);
    }
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
  db.collection('books').add({
    title: formTitle.value,
    author: formAuthor.value,
    pages: formPages.value,
    read: read,
  });
  resetForm();
}

// Deleting data 
function removeBook(bookId) {
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].dataId === bookId) {
      myLibrary.splice(i, 1);
    }
  }
  db.collection('books').doc(bookId).delete();
}

class Book {
  constructor(title, author, pages, read, dataId) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.dataId = dataId;
  }
}

Book.prototype.toggleReadStatus = function() {
  if (this.read === true) {
    this.read = false;
    db.collection('books').doc(this.dataId).update({
      read: false
    });
  } else if (this.read === false){
    this.read = true;
    db.collection('books').doc(this.dataId).update({
      read: true
    });
  }
}

function addBookToLibrary(title, author, pages, read, dataId) {
  let newBook = new Book(title, author, pages, read, dataId);
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

  bookCard.setAttribute('data-index', book.dataId);

  generateRemoveBookButton(bookCard);
  generateReadStatusButton(bookCard);
  
  bookList.appendChild(bookCard);
}

function generateCardList(bookList) {
  for (let i = 0; i < bookList.length; i++) {
    generateBookCard(bookList[i]);
  }
}

function generateRemoveBookButton(bookCard) {
  let removeButton = document.createElement('button');
  removeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    removeBook(removeButton.parentElement.getAttribute('data-index'));
  });
  removeButton.textContent = 'Remove Book';
  removeButton.classList.add('remove-book-button');
  bookCard.appendChild(removeButton);
}

function generateReadStatusButton(bookCard) {
  let readStatusButton = document.createElement('button');
  readStatusButton.textContent = 'Toggle read status';
  readStatusButton.classList.add('read-status-button');
  bookCard.appendChild(readStatusButton);

  readStatusButton.addEventListener('click', () => {
    let index = readStatusButton.parentElement.getAttribute('data-index');
    for (let i = 0; i < myLibrary.length; i++) {
      if (index === myLibrary[i].dataId) {
        myLibrary[i].toggleReadStatus();
      }
    }
    reloadCardList(myLibrary);
  });
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








