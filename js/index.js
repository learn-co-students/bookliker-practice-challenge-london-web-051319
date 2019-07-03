document.addEventListener("DOMContentLoaded", function() {
  fetchBooks();
});


const bookUl = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");

const bookUrl = "http://localhost:3000/books";
const userUrl = "http://localhost:3000/users";


const currentUser = {
  "id": 1,
  "username": "pouros"
};
// const currentUser = fetch('http://localhost:3000/users/1').then(resp => resp.json());


function fetchBooks() {
  fetch(bookUrl)
    .then(data => data.json())
    .then(allBooks => renderBookList(allBooks));
}

function renderBookList(allBooks) {
  for (let book of allBooks) {
    let li = document.createElement('li');
    li.innerText = book.title;
    bookUl.appendChild(li);
    li.setAttribute("id", book.id);
    li.addEventListener("click", e => chooseBook(e))
  }
}

function chooseBook(e) {
  let id = e.target.id;
  return fetch(`http://localhost:3000/books/${id}`)
    .then(response => response.json())
    .then(book => renderBookCard(book));
}


function renderBookCard(book) {
  showPanel.innerHTML = ""
  let div = document.createElement('div');
  div.className = "card";
  div.innerHTML = `<h2>${book.title}</h2>
    <img src=${book.img_url} class="book-cover"/>
    <p>${book.description}</p>
    <button class="read-btn" type="button">Read</button>
    `;
  for (let user of book.users) {
    let p = document.createElement('p');
    p.innerText = user.username;
    div.appendChild(p);
  }
  showPanel.appendChild(div);
  const readButton = document.querySelector('.read-btn');
  readButton.addEventListener("click", e => clickSubmission(e, book));
}

function bookUsers(book) {
  let bookUsers = book.users;
  if (bookUsers.some(user => user.id === currentUser.id)) {
    book.users = bookUsers.filter(user => user.id != currentUser.id);
  } else {
    bookUsers.push(currentUser);
  }
  return book;

}

function clickSubmission(e, book) {
  return fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      body: JSON.stringify(
        bookUsers(book)
      ),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(resp => resp.json())
    .then(book => renderBookCard(book));
}