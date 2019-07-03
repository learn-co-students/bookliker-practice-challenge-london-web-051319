const BOOKS_URL = "http://localhost:3000/books"
const USERS_URL = "http://localhost:3000/users"
const i_user = {
    "id": 1,
    "username": "pouros"
}

document.addEventListener("DOMContentLoaded", function() {
    fetchBooks()
});

function fetchBooks() {
    fetch(BOOKS_URL)
        .then( booksData => booksData.json())
        .then( books => showBooks(books))
};

function showBooks(books) {
    books.map(book => {
        addBook(book)
    })
};

function addBook(book) {
    const books_list = document.querySelector("#list")
    const div = makeBooks(book);
    books_list.appendChild(div);

    let click = document.querySelector("#list").lastElementChild.querySelector("p")
    click.addEventListener('click', event => handleClicks(event))
};

function makeBooks(book) {
    const li = document.createElement("li")
    const p = document.createElement("p")
    p.innerText = book.title
    p.id = book.id
    li.appendChild(p)
    return li
};

function handleClicks(event) {
    event.preventDefault();
    fetch(`${BOOKS_URL}/${event.target.id}`)
        .then( bookData => bookData.json())
        .then( book => showBook(book))
};

function createBook(book) {
    const div = document.createElement("div")
    const title = document.createElement("h3")
    title.innerText = book.title
    const img = document.createElement("img")
    img.src = book.img_url
    const desc = document.createElement("p")
    desc.innerText = book.description
    const readers = document.createElement("div")
    bookUsers(book, readers)
    const button = document.createElement("button")
    button.innerText = "Read Book"
    button.id = book.id
    button.addEventListener('click', event => handleLikes(event))
    div.appendChild(title)
    div.appendChild(img)
    div.appendChild(desc)
    div.appendChild(readers)
    div.appendChild(button)
    return div
};

function handleLikes(event) {
    event.preventDefault();
    fetch(`${BOOKS_URL}/${event.target.id}`)
        .then( bookData => bookData.json())
        .then( book => addLike(event, book))
};

function addLike(event, book) {
    if (book.users.some(user => user.id === i_user.id)) {
        removeI_user(book)
    }
    else
        book.users.push(i_user)
        return fetch(`${BOOKS_URL}/${event.target.id}`, {
            method: "PATCH",
            body: JSON.stringify(book),
            headers: {
              "Content-Type": "application/json"
            }
          }).then(book => book.json()).then( book => showBook(book));
};

function removeI_user(book) {
    let current_users = book.users
    for( var i = 0; i < current_users.length; i++){ 
        if ( current_users[i].id === i_user.id) {
          current_users.splice(i, 1); 
          i--;
        }
     }
};

function bookUsers(book, readers) {
    book.users.map(user => {
        const reader = document.createElement("h4")
        reader.innerText = user.username
        readers.appendChild(reader)
        return readers
    })
};

function showBook(book) {
    const book_info = document.querySelector("#show-panel")
    if (book_info.firstChild) {
        book_info.removeChild(book_info.firstChild)
    }
    const div = createBook(book);
    book_info.appendChild(div);
};
