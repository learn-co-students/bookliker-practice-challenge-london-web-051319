document.addEventListener("DOMContentLoaded", function() {});

const bookURL = "http://localhost:3000/books"
const pageUser = { id: 1, username: 'pouros'}
const bookShow = document.querySelector('#show-panel')
const bookBar = document.querySelector('#list-panel')



fetch(bookURL)
    .then(response => response.json())
    .then(data => {
        data.forEach(bookData => {
            createBookBar(bookData)
    })
})

const createBookBar = bookData => {

    const barTitle = document.createElement('li')
    const barSpace = document.createElement('br')
    barTitle.innerText = bookData.title
    barTitle.dataset.id = bookData.id

    barTitle.addEventListener("click", onBookBarClick)
  
    bookBar.append(barTitle, barSpace)
}

function onBookBarClick(event) {
    getSingleBook(event.target.dataset.id)
        .then(createBookCard)
}

function createBookCard(bookData){

    bookShow.innerHTML = ""
   
   const cardHeader = document.createElement('h2')
   cardHeader.innerText = bookData.title

   const cardDesc = document.createElement('p')
   cardDesc.innerText = bookData.description

   const cardImg = document.createElement('img')
   cardImg.src = bookData.img_url

   div = document.createElement('div')

   bookData.users.forEach(bookReader => {
       renderBookReader(bookReader, div)
   })

   const cardButton = document.createElement("button")
   cardButton.innerText = "Read Book"
   cardButton.dataset.id = bookData.id

    bookShow.append(cardHeader, cardDesc, cardImg, div, cardButton)

    addReaderFunctionality(bookData, cardButton)
}

function renderBookReader (bookReader, div) {
    bookReaders = document.createElement('p')
    bookReaders.innerText = bookReader.username
    div.append(bookReaders)
}

function addReaderFunctionality (bookData, button) {
    const bookUser = bookData.users
    button.addEventListener('click', event => {
        if (bookUser.includes(pageUser)) {
            let newReader = bookData.users.filter(users => users.id !== pageUser.id)
            bookData.users = newReader
            addReaderBackend(bookData)
                .then(response => response.json())
                .then(createBookCard(bookData))
        } else {
            bookData.users.push(pageUser)
            addReaderBackend(bookData)
                .then(response => response.json())
                .then(createBookCard(bookData))
        }
    })
}

function addReaderBackend(bookData) {
    return fetch(bookURL + `/${bookData.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    })
}

function getSingleBook(id) {
    return fetch(bookURL + `/${id}`)
        .then(response => response.json())
}
