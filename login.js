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

let posts = [
  {
    id: "1",
    userId: "Nestor",
    text: "esto es el primer post",
    date: "25/05/2024 20:20:20",
  },
  {
    id: "2",
    userId: "Nestor",
    text: "esto es el segundo post",
    date: "25/05/2024 20:40:20",
  },
  {
    id: "3",
    userId: "Leonardo",
    text: "esto es el tercer post",
    date: "25/05/2024 21:20:20",
  },
];
let CountedPublications = 0;

let likes = [
  {
    id: "1",
    userId: "3",
    postId: "1",
  },
  {
    id: "2",
    userId: "1",
    postId: "2",
  },
  {
    id: "3",
    userId: "2",
    postId: "3",
  },
];
let CountedLikes = 0;

let comments = [
  {
    id: "1",
    userId: "1",
    postId: "2",
    text: "Este comentario es del usuario Nestor, es el primer comentario de la segunda publicacion",
    date: "25/05/2024 21:20:20",
  },
  {
    id: "2",
    userId: "3",
    postId: "1",
    text: "Este comentario es del usuario Leonel, es el segundo comentario de la primera publicacion",
    date: "25/05/2024 22:20:20",
  },
  {
    id: "3",
    userId: "2",
    postId: "3",
    text: "Este comentario es del usuario Leonardo, es el tercer comentario de la tercera publicacion",
    date: "25/05/2024 23:20:20",
  },
];
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
      generatePostsHtml();
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
      text: inputComment.value,
      image: userActive.photo,
      date: now,
    };

    comments.push(newComment);
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

const generatePostsHtml = (e) => {
  let poster = ``;
  for (let index = 0; index < posts.length; index++) {
    const element = posts[index];

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
      <div class="post-likes">
        <h5>❤️ 0</h5>
        <h5>0 Comentarios</h5>
      </div>
    </div>

    <footer class="btns-comment">
      <button data-like="${index}" class="btn --btn-post btn-like">Me gusta</button>
      <button data-comment="${index}" class="btn --btn-post btn-comment">Comentar</button>
      <button class="btn --btn-post">Compartir</button>
    </footer>

    <article class="container-comment">

      <div class="post-header-user">
        <div class="photo-profile">
          <img src="../" alt="">
        </div>
        <div class="data-user-post">
          <h2> nombre de usuario</h2>
          <h2> fecha de publicacion</h2>
        </div>
        <div class="post-comment">
          <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero cumque aspernatur, repudiandae
            dolor sed hic, temporibus nam esse quia accusamus deleniti. Voluptatum, sunt at optio vero sint
            asperiores expedita rerum!
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea id sequi maxime officia eligendi porro
            placeat, dignissimos iusto quam vero doloremque facere praesentium sed sint. Similique a laborum totam
            deleniti.
          </span>

        </div>
      </div>

      <div class="post-header-user">
        <div class="photo-profile">
          <img src="../" alt="">
        </div>
        <div class="data-user-post">
          <h2> nombre de usuario</h2>
          <h2> fecha de publicacion</h2>
        </div>
        <div class="post-comment">
          <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero cumque aspernatur, repudiandae
            dolor sed hic, temporibus nam esse quia accusamus deleniti. Voluptatum, sunt at optio vero sint
            asperiores expedita rerum!
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea id sequi maxime officia eligendi porro
            placeat, dignissimos iusto quam vero doloremque facere praesentium sed sint. Similique a laborum totam
            deleniti.
          </span>
        </div>
      </div>

      <div class="post-header-user">
        <div class="photo-profile">
          <img src="../" alt="">
        </div>
        <div class="data-user-post">
          <h2> nombre de usuario</h2>
          <h2> fecha de publicacion</h2>
        </div>
        <div class="post-comment">
          <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero cumque aspernatur, repudiandae
            dolor sed hic, temporibus nam esse quia accusamus deleniti. Voluptatum, sunt at optio vero sint
            asperiores expedita rerum!
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea id sequi maxime officia eligendi porro
            placeat, dignissimos iusto quam vero doloremque facere praesentium sed sint. Similique a laborum totam
            deleniti.
          </span>
        </div>
      </div>

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
