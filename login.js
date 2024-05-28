let user = [
  {
    id: "1",
    userName: "Nestor",
    email: "melendezinv4321@gmail.com",
    password: "David4321",
    photo: "./assets/nestor.jpg",
  },
  {
    id: "2",
    userName: "Leonardo",
    email: "leonardo@gmail.com",
    password: "David0202",
    photo: "./assets/leonardo.jpg",
  },
  {
    id: "3",
    userName: "Leonel",
    email: "leonel@gmail.com",
    password: "David3011",
    photo: "./assets/leonel.jpg",
  },
];

let posts = [];
let CountedPublications = 0;

let likes = [];
let CountedLikes = 0;

let comments = [];
let CountedComment = 0;

let userActive = {};

let pageLogin = document.getElementById("page-login");
let pagePost = document.getElementById("generate-posts");
let nav = document.getElementById("menu");
let btnSignUp = document.getElementById("btn-sign-up");
let password = document.getElementById("password");
let email = document.getElementById("email");
let generatePosts = document.getElementById("generate-posts");

document.addEventListener("click", (e) => {

  if (e.target.matches(".user-out")) {
    pagePost.classList.toggle("disguise");
    pageLogin.classList.toggle("disguise");
    nav.innerHTML = "";
  }

  if (e.target.matches(".btn-sign-up")) {
    if (email.value === "") {
      alert("el campo usuario es obligatorio");
      return false;
    } else if (password.value === "") {
      alert("el campo contraseña es obligatorio");
      return false;
    }
    userActive = {};

    verifyEmail(user, email.value);

    if (!userActive.email) {
      alert("Disculpe el usuario no se encuentra registrado");
      return;
    }

    if (userActive.password == password.value) {
      pagePost.classList.toggle("disguise");
      pageLogin.classList.toggle("disguise");

      let menu = `<div class="menu-user disguise">
                    <div class="photo-profile">
                      <img src="${userActive.photo}" alt="">
                    </div>
                  <h2> ${userActive.userName}</h2>
                    </div>
                  </div>

                  <textarea id="input-post" class="input-post" name="" rows="3" maxlength="255" placeholder="      ¿Que estas pensando?"></textarea>

                  <div class="btn-options"> 
                    <button id="create-post" class="btn --menu-user create-post">Publicar</button>
                    <button id="user-out" class="btn --menu-user user-out">Salir</button>
                  </div>`;

      nav.innerHTML = menu;
      if (!posts.length == 0) {
        generatePostsHtml();
      } else {
        pagePost.innerHTML = "";
      }
    } else {
      alert("disculpe la contraseña no es valida");
    }
  }

  if (e.target.matches(".create-post")) {
    CountedPublications++;
    let inputPost = document.getElementById("input-post").value;
    let now = new Date().toDateString();
    let newPost = {
      id: CountedPublications,
      userId: userActive.userName,
      text: inputPost,
      date: now,
      image: userActive.photo,
    };
    posts.unshift(newPost);
    generatePostsHtml();
  }

  if (e.target.matches(".btn-like")) {
    CountedLikes++;
    var indice = e.target.dataset.like;
    let post = posts[indice];
    let newLike = {
      id: CountedLikes,
      userId: userActive.userName,
      postId: post.id,
    };

    likes.push(newLike);
    let cuantosLikes = foundLikes(likes, post.id);
    console.log(cuantosLikes);
    console.log(likes);
    console.log(post.id);
    console.log(`<h5>❤️ ${cuantosLikes}</h5>`);
    console.log(e.target);
    console.log(e.target.dataset);
    generatePostsHtml();
  }

  if (e.target.matches(".btn-comment")) {
    CountedComment++;
    var indice = e.target.dataset.comment;
    let inputComment = document.getElementById("input-comment").value;
    let now = new Date().toDateString();
    let post = posts[indice];

    let newComment = {
      id: CountedLikes,
      userId: userActive.userName,
      postId: post.id,
      text: inputComment,
      image: userActive.photo,
      date: now,
    };

    comments.push(newComment);
    let cuantosComments = foundComment(comments, post.id);
    console.log(cuantosComments);
    generatePostsHtml();
  }
});

function verifyEmail(user, email) {
  for (const usuario of user) {
    if (usuario.email === email) {
      userActive = usuario;
    }
  }
}

function foundLikes(likes, postId) {
  let likeCount = 0;
  for (const like of likes) {
    if (like.postId === postId) {
      likeCount++;
    }
  }
  return likeCount;
}
function foundComment(comments, postId) {
  let commentCount = 0;
  for (const comment of comments) {
    if (comment.postId === postId) {
      commentCount++;
    }
  }
  return commentCount;
}

function makeComment(comments, postId) {
  let makeComment = ``;
  let comentario = [];

  for (const comment of comments) {
    if (comment.postId === postId) {
      comentario.unshift(comment);
    }
  }
  for (let index = 0; index < comentario.length; index++) {
    const element = comentario[index];
    makeComment += `
         <div class="post-header-user">
         <div class="photo-profile">
           <img src=${element.image} alt="">
         </div>
         <div class="data-user-post">
           <h2> ${element.userId}</h2>
           <h2> ${element.date}</h2>
         </div>
         <div class="post-comment">
           <span>
           ${element.text}
           </span>
 
         </div>
       </div>         
         `;
  }
  return makeComment;
}

const generatePostsHtml = () => {
  let poster = ``;
  for (let index = 0; index < posts.length; index++) {
    const element = posts[index];
    const postLikes = foundLikes(likes, element.id);
    const postComments = foundComment(comments, element.id);
    const makeComments = makeComment(comments, element.id);

    poster += ` 
    <article class="content post">
    <header class="post-header">
      <div class="post-header-user">
        <div class="photo-profile">
          <img src="${element.image}" alt="">
        </div>
        <div class="data-user-post">
          <h2> ${element.userId}</h2>
          <h2> ${element.date}</h2>
        </div>
      </div>
      <div class="btn-options">
        <button class="btn --option">...</button>
      </div>
    </header>

    <div class="container  post-content">
      <span>
        ${element.text}
      </span>
      <div id="post-likes" class="post-likes">
        <h5>❤️ ${postLikes}</h5>
        <h5>${postComments} Comentarios</h5>
      </div>
    </div>

    <footer class="btns-comment">
      <button data-like="${index}" class="btn --btn-post btn-like">Me gusta</button>
      <button data-comment="${index}" class="btn --btn-post btn-comment">Comentar</button>
      <button class="btn --btn-post">Compartir</button>
    </footer>

    <article class="container-comment">
      ${makeComments}
     
      <div>
        <div class="post-header-user">
          <div class="photo-profile">
            <img src=${userActive.photo} alt="">
          </div>
          <input id="input-comment" class="input-comment" type="text" placeholder="     Comentar como userName">
        </div>

      </div>

    </article>
  </article>`;
  }

  pagePost.innerHTML = poster;
};
