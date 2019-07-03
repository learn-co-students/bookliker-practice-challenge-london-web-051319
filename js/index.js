// document.addEventListener("DOMContentLoaded", function() {});

const BOOKS_URL = 'http://localhost:3000/books'
const pageUser = { id: 1, username: 'pouros' }
const listPanel = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')

// make book fetch request to get book array

fetch(BOOKS_URL)
  .then(response => response.json())
  .then(makeBookList)

// make book list with event listener pointing to book obj render them

function makeBookList (bookArray) {
  bookArray.forEach(book => {
    addBookToList(book)
  })
}

function addBookToList (book) {
  li = document.createElement('li')
  li.innerText = book.title
  listPanel.append(li)
  setUpShowPanel(book, li)
}
// event listener function to render book to show panel

function setUpShowPanel (book, li) {
  li.addEventListener('click', e => {
    showBookInfo(book)
  })
}

function showBookInfo (book) {
  showPanel.innerHTML = ''
  h2 = document.createElement('h2')
  h2.innerText = book.title
  img = document.createElement('img')
  img.src = book.img_url
  p = document.createElement('p')
  p.innerText = book.description
  div = document.createElement('div')
  button = document.createElement('button')
  if (book.users.includes(pageUser)) {
    button.innerText = 'Unlike book!'
  } else {
    button.innerText = 'Like book!'
  }

  book.users.forEach(bookLiker => {
    renderBookLiker(bookLiker, div)
  })

  showPanel.append(h2, img, p, div, button)

  addLikingFunctionality(book, button)
}

function renderBookLiker (bookLiker, div) {
  p = document.createElement('p')
  p.innerText = bookLiker.username
  div.append(p)
}

/// LIKE BUTTON WITH BONUS

function addLikingFunctionality (book, button) {
  const bookUsers = book.users
  button.addEventListener('click', e => {
    if (bookUsers.includes(pageUser)) { 
      let newLikers = book.users.filter(user => user.id !== pageUser.id)
      book.users = newLikers
      addLikerBackend(book)
        .then(response => response.json())
        .then(showBookInfo(book))
    } else {
      book.users.push(pageUser)
      addLikerBackend(book)
        .then(response => response.json())
        .then(showBookInfo(book))
    }
 })
}

function addLikerBackend (book) {
  return fetch(`${BOOKS_URL}/${book.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  })
}