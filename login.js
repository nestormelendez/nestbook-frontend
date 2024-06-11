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

  }

  if (e.target.matches(".btn-sign-up")) {


    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email.value,
      password: password.value,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://localhost:4000/auth/login",
        requestOptions
      );
      const loginData = await response.json();
      console.log(
        "loginData",
        loginData,
        "response",
        response,
        loginData.user.name.charAt(0)
      );

      let usersGroup = localStorage.getItem(userStorage);
      let users = [];
      if (usersGroup) {
        users = JSON.parse(usersGroup);
      }
      let user = {
        token: loginData.token,
        user: {
          id: loginData.user.id,
          name: loginData.user.name,
          email: loginData.user.email,
          createdAt: loginData.user.createdAt,
          updatedAt: loginData.user.updatedAt,
        },
      };

      users.push(user);

      const saveUser = JSON.stringify(users);
      localStorage.setItem(loginData.user.name, saveUser);



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

    if (!posts.length == 0) {
      generatePostsHtml();
    } else {
      pagePost.innerHTML = "";
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
      userId: userActive.user.name,
      text: inputPost,
      date: now,
      image: userActive.photo,
    };
    posts.unshift(newPost);
    generatePostsHtml();

    document.getElementById("input-post").value = "";
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
    console.log(inputComment);
    let now = getTime();

    let post = posts[indice];

    let newComment = {
      id: CountedComment,
      userId: userActive.user.name,
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
                              <div class="photo-profile-avatar">
                                     <span>${element.userId.charAt(0)}</span>
                                     
   </div>
           <div class="data-user-post">
                     <h2> ${element.userId}</h2>
                               <h2> ${element.date}</h2>
                                       </div>


                                       <div class="btn-options">
                                               <button class="btn --option">...</button>
                                                     </div>
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
                                  
      <div class="post-contentss">
        <div class="post-header-user">
          <div class="photo-profile-avatar">
            <span>${userActive.user.name.charAt(0)}</span>
          </div>   
          <input id="${index}" class="input-comment" type="text" placeholder="     Comentar como ${userActive.user.name}">
          <button data-comment="${index}" class="btn --btn-comment btn-comment">Comentar</button>    
        </div>
      </div>
                
                    </article>
                      </article>`;
  }

  pagePost.innerHTML = poster;
};
