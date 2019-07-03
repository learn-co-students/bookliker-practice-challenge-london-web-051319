// document.addEventListener("DOMContentLoaded", function() {});
const listPanel = document.querySelector('div#list-panel');
const showPanel = document.querySelector('div#show-panel');
const BOOKS_URL = 'http://localhost:3000/books';
const USERS_URL = 'http://localhost:3000/users';
const user1 = {'id': 1, "username": "pouros"};

// no function needed as DOMContentLoaded listener is disabled.
   fetch(BOOKS_URL)
   .then(data => data.json())
   .then(results => renderBookList(results))

const renderBookList = (booksData) => {
   for(let book of booksData) {
      let titleDiv = document.createElement('div');
      titleDiv.id = `title_${book.id}`;
      titleDiv.className = 'titles-list';
      titleDiv.innerText = book.title;
      titleDiv.addEventListener('click', (event) => {displayBook(book)})
      listPanel.append(titleDiv);
   }
};

const displayBook = (bookData) => {
   showPanel.innerHTML = "";
   let newContainer = document.createElement('div');
   newContainer.id = `container_${bookData.id}`;
   let newH1 = document.createElement('h1');
   newH1.innerText = bookData.title;
   let newImg = document.createElement('img');
   newImg.id = `image_${bookData.id}`;
   newImg.className = 'book-images';
   newImg.src = bookData.img_url;
   let newP = document.createElement('p');
   newP.innerText = bookData.description;
   newP.className = 'book-description';
   let likeButton = document.createElement('button');
   likeButton.id = `like_button_${bookData.id}`;
   likeButton.className = 'like-button';
   likeButton.innerText = 'Like Book';
   likeButton.addEventListener('click', (e) => likeBook(bookData))
   let bookLikers = document.createElement('p');
   let bookLikersList = document.createElement('ul');
   for(let user of bookData.users) {
      let newLi = document.createElement('li');
      newLi.innerText = user.username;
      newLi.className = 'likers-list';
      bookLikersList.append(newLi);
   }
   bookLikers.append(bookLikersList);
   newContainer.append(newH1, newImg, newP, likeButton, bookLikers);
   showPanel.append(newContainer);
};

const likeBook = (bookData) => {
   if (bookData.users.some(user => user.id === user1.id)) {
      console.log('You have already liked this book!');
      return alert('You have already liked this book!');
   } else {
      let userData = bookData.users;
      bookData.users.push(user1);
      configOpt = {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
         body: JSON.stringify({users: userData})
      }
      
      fetch(`${BOOKS_URL}/${bookData.id}`, configOpt)
      .then(data => data.json())
      .then(result => displayBook(result))
   }
};