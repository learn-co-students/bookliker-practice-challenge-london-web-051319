URL = 'http://localhost:3000'
books_URL = `${URL}/books`
const current_user = {"id":1, "username":"pouros"}
const list_panel = document.querySelector('#list-panel')
const list = document.querySelector('#list')
const show_panel = document.querySelector('#show-panel')

const fetch_books = () => {
    return fetch(books_URL)
    .then(response => response.json())
    .then(books => renderBooks(books))
}

let renderBooks = (books_array) => {
    books_array.forEach(book => {
        let li = document.createElement("li")
        li.innerText = book.title
        list.appendChild(li)
        li.addEventListener("click", function(){
            showBook(book)
        });
    })
    };


let showBook = (book) => {
    show_panel.innerHTML = ""
    h1 = document.createElement("h1")
    h1.innerText = book.title
    image = document.createElement("img")
    image.src = book.img_url
    description = document.createElement("p")
    description.innerText = book.description
    show_panel.appendChild(h1)
    show_panel.appendChild(image)
    show_panel.appendChild(description)
    let flag = 0;
    book.users.forEach(user => {
        user_ul = document.createElement("ul")
        user_li = document.createElement("li")
        user_li.innerText = user.username
        user_ul.appendChild(user_li)
        show_panel.appendChild(user_ul)
})
    create_button(book)
}

let create_button = (book) => {
        button = document.createElement("button")
        button.innerText = "Read book";
        show_panel.appendChild(button)
        button.addEventListener("click", function(){
                let users_array = []
                book.users.forEach(user => {
                users_array.push(user)
                })
                found = users_array.find(user => user.username === current_user.username)
                if(found){
                    alert("You've read this book");
                }
                else{
                    users_array.push(current_user);
                    patchDB(users_array,book)
                }
            }
        )}


let patchDB = (users_array,book) => {
    return fetch(`http://localhost:3000/books/${book.id}`,{
        method: 'PATCH',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            users: users_array
        })
    })
    .then(response => response.json())
    .then(book => showBook(book))
}

document.addEventListener("DOMContentLoaded", function() {
    fetch_books();
});
