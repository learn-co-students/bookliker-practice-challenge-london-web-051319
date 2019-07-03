const BOOKS_URL = 'http://localhost:3000/books'
const USER = {"id":1, "username":"pouros"}

document.addEventListener("DOMContentLoaded", function() {
  addBooksToDOM();
});

function getBooks() {
  return fetch(BOOKS_URL).then(resp =>   resp.json());
}

function updateBook(book) {
  return fetch(`${BOOKS_URL}/${book.id}`, {
    method: 'PATCH', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  }).then(resp =>   resp.json());
}

function setClickFunctionality(book, li) {
  li.addEventListener('click', e => {
    displayBook(book)
  })
}

function setReadBookFunctionality(book, button) {
  button.addEventListener('click', e => {
    toggleUserRead(book, USER)
  })
}

function toggleUserRead(book, user) {
  bookUser = book.users.findIndex(bookUser => bookUser.id === user.id)

  if (bookUser === -1) {
    book.users.push(user);
  } else {
    book.users.splice(bookUser, 1)
  }

  updateBook(book).then(book => {
    displayBook(book);
  })
}

function createBookListItem(book) {
  const li = document.createElement('li')
  li.textContent = book.title

  setClickFunctionality(book, li);

  return li
}

function createBookDisplay(book) {
  const div = document.createElement('div')
  const h2 = document.createElement('h2')
  const img = document.createElement('img')
  const p = document.createElement('p')
  const h3 = document.createElement('h3')
  const button = document.createElement('button')

  h2.textContent = book.title
  img.src = book.img_url
  p.textContent = book.description
  h3.textContent = book.users.map(user => user.username).join(", ")
  button.textContent = 'Read Book'

  div.append(h2,img,p,h3,button)

  setReadBookFunctionality(book, button);

  return div
}

function addBooksToDOM() {
  const ul = document.querySelector('#list')
  getBooks().then(books => {
    books.forEach(book => {
      ul.appendChild(createBookListItem(book));
    })
  })
}

function displayBook(book) {
  const div = document.querySelector('#show-panel')
  while (div.firstChild){
    div.removeChild(div.firstChild)
  }

  div.appendChild(createBookDisplay(book))
}
