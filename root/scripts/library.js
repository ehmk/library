const bookList = document.getElementById('book-list');
let myLibrary = [];

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
  read.textContent = `${book.read ? 'Has been read' : 'Hasn\'t been read'}`
  bookCard.appendChild(read);

  bookList.appendChild(bookCard);
}

function generateCardList(bookList) {
  for (let i = 0; i < bookList.length; i++) {
    generateBookCard(bookList[i]);
  }
}

addBookToLibrary('Harry Potter and the Sorcerer\'s Stone', 'JK Rowling', 500, false);
addBookToLibrary('The Hobbit', 'JRR Tolkien', 500, false);
addBookToLibrary('Game of Thrones: A Song of Fire and Ice', 'George RR Martin', 1000, false);

generateCardList(myLibrary);

