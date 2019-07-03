const listContainer = document.querySelector('#list');
const currentUsername = 'pouros';
const currentUserId = 1;
const currentUserData = {
  id: currentUserId,
  username: currentUsername
};

fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(books => {
    books.forEach(book => listBook(book));
  });

function listBook(book) {
  const li = document.createElement('li');

  li.textContent = book.title;
  li.addEventListener('click', () => {renderBookThumbnail(book)});
  listContainer.appendChild(li);
}

function renderBookThumbnail(book) {
  const bookContainer = document.querySelector('#show-panel');

  const container = document.createElement('div');
  const userContainer = document.createElement('div');
  const h2 = document.createElement('h2');
  const img = document.createElement('img');
  const p = document.createElement('p');
  const btn = document.createElement('button');

  h2.textContent = book.title;
  img.src = book.img_url;
  p.textContent = book.description;
  btn.textContent = (validateUser(book).exist ? 'Un-read Book' : 'Read Book');

  btn.addEventListener('click', (e) => readBook(e, book, userContainer));
  userContainer.classList.add('flex');

  addUsersToCard(book, userContainer);

  container.append(h2, img, p, userContainer, btn);
  bookContainer.textContent = "";
  bookContainer.append(container);
}

function addUsersToCard(bookData, container) {
  container.textContent = "";

  bookData.users.forEach(user => {
    const span = document.createElement('span');
    span.textContent = user.username;

    container.appendChild(span);
  });
}

function readBook(e, book, userContainer) {

  let userExist = validateUser(book).exist;
  let users;

  if (userExist) {
    users = book.users;
    users.splice(validateUser(book).position, 1);
    e.target.textContent = 'Read book';
  } else {
    users = book.users;
    users.push(currentUserData);
    e.target.textContent = 'Un-read book';
  }

  updateBook(book, users)
    .then(newBook => {
      book = newBook;
      addUsersToCard(newBook, userContainer);
    });
}

function validateUser(book) {
  let exist = false;
  let position;

  book.users.forEach((user, i) => {
    if (user.username === currentUsername) {
      exist = true;
      position = i;
    }
  });

  return {
    exist: exist,
    position: position
  };
}

function updateBook(book, users) {
  return fetch(`http://localhost:3000/books/${book.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
       users: users
    })
  })
  .then(newBook => newBook.json());
}
