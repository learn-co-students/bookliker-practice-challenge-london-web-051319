document.addEventListener("DOMContentLoaded", function() {
  BOOKSURL = "http://localhost:3000/books";
  const list = document.querySelector("#list-panel");
  const renderBook = () => console.log(this);
  const bam = s => document.createElement(s);
  const $ = s => document.querySelector(s);

  fetch(BOOKSURL)
  .then(resp => resp.json())
  .then(data => {
    const renderBook = (book) => {
      let li = $(`#book-${book.id}`)
      if (li) {
        [...li.children].forEach(e => e.remove())
      } else {
        li = bam("div");
        li.id = "book-" + book.id;
        list.appendChild(li)
      }
      const title = bam ("h2");
      title.innerText = book.title;
      const description = bam("p");
      const img = bam("img");
      img.src = book.img_url;
      const label = bam("h3");
      label.innerText = "Liked by following users"
      const likes = bam("ul");
      book.users.forEach(({id, username}) => {
        const like = bam("li");
        like.innerText = username;
        like.userId = id;
        likes.appendChild(like);
      })
      const button = bam("button")
      const i = book.users.findIndex(({id}) => id === 1)
      button.innerText = i === -1 ? "Like" : "Dislike";
      li.append(title, description, img, label, likes, button);
    }

    data.forEach(renderBook)

    list.addEventListener("click", ({target}) => {
      console.log({target})
      const BOOKURL = BOOKSURL + "/" + target.parentElement.id.split("-")[1];

      target.tagName === "BUTTON" && fetch(BOOKURL)
      .then(resp => resp.json())
      .then(book => {
        const users = book.users;
        const i = users.findIndex(({id}) => id === 1)
        i === -1 && users.push({"id":1, "username":"pouros"});
        i === -1 || users.splice(i, 1)
        const options = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({users: users})
        }
        fetch(BOOKURL, options)
        .then(resp => resp.json())
        .then(renderBook)
      })
    })
  })

});
