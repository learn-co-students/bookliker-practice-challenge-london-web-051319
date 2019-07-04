document.addEventListener("DOMContentLoaded", function() {
  getBookInfo();
});

const BOOKS_URL = "http://localhost:3000/books"
const USERS_URL = "http://localhost:3000/users"
const currentUser = {id:1, username:"pouros"}

// get all books
function getAllBooks() {
  return fetch(BOOKS_URL)
  .then(response => response.json())
}

function getBookInfo() {
  getAllBooks()
  .then(booksArray => {
    for(book of booksArray) {
      displayBookListItem(book)
    }
  })
}

// render a book list item
function displayBookListItem(book) {
  ul = document.querySelector("#list");
  li = document.createElement("li")
  li.innerText = book.title;
  li.id = book.id;
  li.addEventListener("click", event => toggleBookCard(event));
  ul.append(li);
}

// make a book card
function displayBookCard(book) {
  showPanel = document.querySelector("#show-panel")
  likePanel = document.createElement("div")
  likePanel.id = "like-panel";

  h1 = document.createElement("h1")
  h1.innerText = book.title

  img = document.createElement("img")
  img.src = book.img_url

  p = document.createElement("p")
  p.innerText = book.description

  displayBookReaders(book);

  readButton = document.createElement("button");
  readButton.innerText = "Read Book"
  readButton.setAttribute("data-set", book.id);
  readButton.addEventListener("click", event => getSelectedBook(event))

  showPanel.append(h1, img, p, likePanel, readButton );
}

// display current readers of book
function displayBookReaders(book) {
  likePanel.innerHTML = "";
  let readersArray = book.users;
  for(const reader of readersArray) {
    let p = document.createElement("p")
    p.innerText = reader.username;
    likePanel.append(p);
  }
}

// toggle book card on click of list item
function toggleBookCard(event) {
  showPanel = document.querySelector("#show-panel")
  showPanel.innerHTML = "";

  bookID = event.target.id;
  return fetch(`${BOOKS_URL}/${bookID}`)
  .then(response => response.json())
  .then(book => displayBookCard(book));
}

// on read book button, add user to read book list
// get book info
function getSelectedBook(event) {
  bookID = event.target.attributes[0].value;
  return fetch(`${BOOKS_URL}/${bookID}`)
  .then(response => response.json())
  .then(book => updateBookReaders(book));
}

function updateBookReaders(book) {
  liked = !liked;
  if (liked == true) {
    book.users.push(currentUser)
    console.log(book.users)
    updateBookDB(book);
  } else {
    book.users.pop
    console.log(book.users)
    updateBookDB(book);
  }  
}
// update (patch) book info and update DOM
function updateBookDB(book) {
  return fetch(`${BOOKS_URL}/${book.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({book})
  })
  .then(response => response.json())
  .then(displayBookReaders(book))
}

// toggle like on and off
let liked = false; 
