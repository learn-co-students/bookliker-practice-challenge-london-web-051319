const LISTPANEL = document.querySelector("#list-panel")
const SHOWPANEL = document.querySelector("#show-panel")
const MYUSER = {"id":1, "username":"pouros"}
const BOOKURL = "http://localhost:3000/books"

init()

function init(){
    fetch(BOOKURL)
    .then(response => response.json())
    .then(books => {books.forEach(book => {
        createBookList(book)
    })
})}

function createBookList(book){
    const li = document.createElement('li')
    li.innerText = book.title
    showDetails(book, li)
    LISTPANEL.querySelector("#list").append(li)
}

function showDetails(book, li){
    li.addEventListener('click', (event) => {
        renderDetails(book,li)
    })
}

function readFunctionality(book, readButton, li){
    readButton.addEventListener("click", (event) => {
        book
        const read = checkRead(book)
        if (read){
            alert("Already read")
        } else {
            book.users.push(MYUSER)
            updateBookInBackend(book)
            .then(updatedBook => {
              renderDetails(updatedBook,li)
            })
        }
    })
}

function checkRead(book){
    let readUsers = []
    book.users.forEach(book => {
        readUsers.push(book["username"])
    })
    if (readUsers.includes(MYUSER.username)){
        return true
    } else {
        return false
    }
}


function updateBookInBackend(book){
    return fetch(`${BOOKURL}/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      })
        .then(res => res.json())
}

function renderDetails(book, li){
    const h2 = document.createElement('h2')
    h2.innerText = book.title
    const img = document.createElement('img')
    img.src = book.img_url
    const p = document.createElement('p')
    p.innerText = book.description
    const readers = document.createElement("div")
    for (const reader of book.users) {
        const readerLine = document.createElement("h3")
        readerLine.append(reader.username);
        readers.append(readerLine)
      }
    
    const readButton = document.createElement('button') // create
    readButton.classList.add('like-btn')
    readButton.innerHTML = `Read <3` // change

    readFunctionality(book, readButton, li)

    SHOWPANEL.innerHTML = ''
    SHOWPANEL.append(h2, img, p, readers, readButton)
}