document.addEventListener("DOMContentLoaded", function() {
    const showPanel = document.querySelector('#show-panel')
    const booksUrl = 'http://localhost:3000/books' 
    function getBooks(){
        fetch(booksUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(allBooks) {
                renderAll(allBooks);
            });
            
    }

    function renderAll(allBooks){
        const list = document.querySelector('#list')
        // console.log(list)
        for (let element in allBooks){
            // console.log(allBooks[element])
            const li = document.createElement('li')
            li.innerHTML = allBooks[element].title
            li.id = `${allBooks[element].id}`
            li.addEventListener("click", getBook)
            list.appendChild(li)

        }

       

    }

    function getBook(event){
        // console.log(event)
        // get id from event, then use it to fetch book
        const bookId = event.target.id
        // console.log(bookId)

        fetch(`${booksUrl}/${bookId}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(book) {
                renderBook(book);
            });



        
        
    }

    function renderBook(book){
        clearBook(book)
        // console.log(book)
        const h2 = document.createElement("h2")
        const img = document.createElement("img")
        const p = document.createElement("p")
        const h5 = document.createElement('h5')
        const button = document.createElement("button")


        h2.innerHTML = book.title
        // console.log(h2)
        img.src = book.img_url
        // console.log(img)
        p.innerHTML = book.description
        h5.innerHTML = `users who like this book: ${getUsersLikeBook(book)}`
        // debugger
        // need to display users here

        button.innerHTML = "i like it"
        button.id = book.id
        

        showPanel.appendChild(h2)
        showPanel.appendChild(img)
        showPanel.appendChild(p)
        showPanel.appendChild(h5)
        showPanel.appendChild(button)

        attachToButton(button, book)

    }

    function attachToButton(button, book){
        button.addEventListener("click", e => {
            const newUserObj = book.users
            newUserObj.push({"id":1, "username":"pouros"})
            updateUsers(book)
        })
    }

    function updateUsers(book){
        console.log(book.id)
        return fetch(`${booksUrl}/${book.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(book)
        })
        .then(response => response.json())
        .then(renderBook(book))
    }

    function clearBook(book){
        console.log(book)
        showPanel.innerHTML = ""
    }

    function getUsersLikeBook(book){
        // console.log(book)
        const usersOfBook = book.users
        userStr = ""
        for (let element in usersOfBook){
            userStr += `<div>${usersOfBook[element].username}.</div> `
        }
        return userStr
    }

    getBooks();
});
