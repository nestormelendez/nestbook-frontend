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
let userStorage = "Users";

let pageLogin = document.getElementById("page-login");
let pagePost = document.getElementById("generate-posts");
let nav = document.getElementById("menu");
let btnSignUp = document.getElementById("btn-sign-up");
let password = document.getElementById("password");
let email = document.getElementById("email");
let generatePosts = document.getElementById("generate-posts");

/* let userStorage = "users"; */

document.addEventListener("click", async (e) => {
  if (e.target.matches(".user-out")) {
    pagePost.classList.toggle("disguise");
    pageLogin.classList.toggle("disguise");
    userActive = ""
    nav.innerHTML = ""
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  if (e.target.matches(".btn-sign-up")) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({ email: email.value, password: password.value, });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch("http://localhost:4000/auth/login", requestOptions);
      const loginData = await response.json();

      let token = loginData.token
      let user = {
        id: loginData.user.id,
        name: loginData.user.name,
        email: loginData.user.email,
        createdAt: loginData.user.createdAt,
        updatedAt: loginData.user.updatedAt,
      };

      const activeUser = JSON.stringify(user);
      localStorage.setItem("user", activeUser);
      localStorage.setItem("token", token);

      userActive = user

      pagePost.classList.toggle("disguise");
      pageLogin.classList.toggle("disguise");

      let menu = `<div class="menu-user">
              <div class="photo-profile-avatar">
                <span>${loginData.user.name.charAt(0)}</span>
              </div>
                  <h2> ${loginData.user.name}</h2>
                    </div>
                  </div>

                  <textarea id="input-post" class="input-post" name="" rows="3" maxlength="255" placeholder="¿Que estas pensando?"></textarea>
              </div>                        
              <div class="btn-options"> 
                <button id="create-post" class="btn --menu-user create-post">Publicar</button>
                <button id="user-out" class="btn --menu-user user-out">Salir</button>
              </div>`;

      nav.innerHTML = menu;
    } catch (error) {
      console.error(error);
    }


    const myHeadersPosts = new Headers();
    myHeadersPosts.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiTmVzdG9yIiwiZW1haWwiOiJuZXN0b3JAbmVzdGJvb2suY29tIiwiY3JlYXRlZEF0IjoiMjAyNC0wNi0xMFQxNDo1MDo0Mi42MTRaIiwidXBkYXRlZEF0IjoiMjAyNC0wNi0xMFQxNDo1MTo0Mi42MTRaIn0sImlhdCI6MTcxODA3MjkzMywiZXhwIjoxNzQ5NjMwNTMzfQ.3_4wyFj461XzJyC38Sv7K67x2jh4f_vvazdez9jq9qA");

    const requestOptionsPosts = {
      headers: myHeadersPosts,
    };

    try {
      const postsList = await fetch("http://localhost:4000/posts", requestOptionsPosts)
      const postsData = await postsList.json();
      console.log(postsData)
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
      } else {
        pagePost.innerHTML = "";
      }

    } catch (error) {
      
    }




  } else {
    /* alert("disculpe la contraseña no es valida"); */
  }
  // }

  if (e.target.matches(".create-post")) {
    CountedPublications++;
    let inputPost = document.getElementById("input-post").value;
    let now = getTime();
    let newPost = {
      id: CountedPublications,
      userId: userActive.name,
      text: inputPost,
      date: now,
      image: userActive.photo,
    };
    posts.unshift(newPost);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiTmVzdG9yIiwiZW1haWwiOiJuZXN0b3JAbmVzdGJvb2suY29tIiwiY3JlYXRlZEF0IjoiMjAyNC0wNi0xMFQxNDo1MDo0Mi42MTRaIiwidXBkYXRlZEF0IjoiMjAyNC0wNi0xMFQxNDo1MTo0Mi42MTRaIn0sImlhdCI6MTcxODA3MjkzMywiZXhwIjoxNzQ5NjMwNTMzfQ.3_4wyFj461XzJyC38Sv7K67x2jh4f_vvazdez9jq9qA");

    const raw = JSON.stringify({
      "content": inputPost,
    });


    try {

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const respuesta = await fetch("http://localhost:4000/posts", requestOptions)

      const postsData = await respuesta.json();

  console.log(postsData)





      generatePostsHtml();
      

      document.getElementById("input-post").value = "";
    }
    catch (error) {
    }
  }

  if (e.target.matches(".btn-like")) {
    CountedLikes++;
    var indice = e.target.dataset.like;
    let post = posts[indice];
    let newLike = {
      id: CountedLikes,
      userId: userActive.name,
      postId: post.id,
    };

    likes.push(newLike);
    let cuantosLikes = foundLikes(likes, post.id);

    generatePostsHtml();
  }

  if (e.target.matches(".btn-comment")) {
    CountedComment++;
    var indice = e.target.dataset.comment;
    let inputComment = document.getElementById(indice);
    let inputCommentValue = inputComment.value;
    let now = getTime();

    let post = posts[indice];

    let newComment = {
      id: CountedComment,
      userId: userActive.name,
      postId: post.id,
      text: inputCommentValue,
      image: userActive.photo,
      date: now,
    };

    comments.unshift(newComment);
    let cuantosComments = foundComment(comments, post.id);
    generatePostsHtml();

  }
});

function getTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let now = `${day}/${month}/${year} - ${hh}:${mm}:${ss}`;
  return now;
}

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
          <div class="photo-profile-avatar-comment">
            <span>${element.userId.charAt(0)}</span>
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

const generatePostsHtml = (postsData) => {
  let poster = ``;
  for (let index = 0; index < postsData.length; index++) {
    const element = postsData[index];
    const postLikes = foundLikes(likes, element.id);
    const postComments = foundComment(comments, element.id);
    const makeComments = makeComment(comments, element.id);
    poster += ` 
         <article class="content post">
    <header class="post-header">
        <div class="post-header-user">
            <div class="photo-profile-avatar">
                <span>${element.user.name.charAt(0)}</span>
            </div>
            <div class="data-user-post">
                <h2> ${element.user.name}</h2>
                <h2> ${element.createdAt}</h2>
            </div>
            <div class="btn-options">
                <button class="btn --option">...</button>
            </div>
        </div>
    </header>
    <div class="container  post-content">
        <span>
            ${element.content}
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
        <div class="post-contentss">
            <div class="post-header-user">
                <div class="photo-profile-avatar">
                    <span>${userActive.name.charAt(0)}</span>
                </div>
                <input id="${index}" class="input-comment" type="text"
                    placeholder="     Comentar como ${userActive.name}">
                <button data-comment="${index}" class="btn --btn-comment btn-comment">Comentar</button>
            </div>
        </div>
    </article>
</article>`;
  }
  pagePost.innerHTML = poster;
};
