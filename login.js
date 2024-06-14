let likes = [];
let CountedLikes = 0;
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


async function cambiarTiempo() {
  let token = localStorage.getItem("token");
  const myHeadersPosts = new Headers();
  myHeadersPosts.append("Authorization", `Bearer ${token}`);

  const requestOptionsPosts = {
    headers: myHeadersPosts,
  };

  try {
    const newPost = await fetch("http://192.168.0.142:4000/posts", requestOptionsPosts)
    const postsData = await newPost.json();

    if (postsData.length !== 0) {

      for (let index = 0; index < postsData.length; index++) {
        const element = postsData[index];
        let IdPost = document.getElementById(`time-post-${element.id}`)
        IdPost.innerText = `${moment(element.createdAt).fromNow()}`;

        for (let i = 0; i < element.comments.length; i++) {
          const elements = element.comments[i];
          let contador = i + 1
          let IdComment = document.getElementById(`post-${elements.postId}-comment-${contador}`)
          IdComment.innerText = `${moment(elements.createdAt).fromNow()}`

        }

      }

    } else {
      pagePost.innerHTML = ``;
    }

  } catch (error) {
    console.log(error)
  }
}

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
    let token = ""
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
      const response = await fetch("http://192.168.0.142:4000/auth/login", requestOptions);
      const loginData = await response.json();

      token = loginData.token
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
    myHeadersPosts.append("Authorization", `Bearer ${token}`);

    const requestOptionsPosts = {
      headers: myHeadersPosts,
    };

    try {
      const newPost = await fetch("http://192.168.0.142:4000/posts", requestOptionsPosts)
      const postsData = await newPost.json();
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
        setInterval(() => {
          cambiarTiempo()
        }, 1000);


      } else {
        pagePost.innerHTML = "";
      }

    } catch (error) {

    }
  } else {

  }

  if (e.target.matches(".create-post")) {
    let inputPost = document.getElementById("input-post").value;
    let token = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      "content": `${inputPost}`
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://192.168.0.142:4000/posts", requestOptions);
      const loginData = await response.json();
      console.log(loginData)
    } catch (error) {
      console.error(error);
    }

    const myHeadersPosts = new Headers();
    myHeadersPosts.append("Authorization", `Bearer ${token}`);

    const requestOptionsPosts = { headers: myHeadersPosts, };

    try {
      const postsList = await fetch("http://192.168.0.142:4000/posts", requestOptionsPosts)
      const postsData = await postsList.json();
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
        document.getElementById("input-post").value = ""
      } else {
        pagePost.innerHTML = "";
      }
    } catch (error) {
    }
  }


  if (e.target.matches(".delete-post")) {

    let deletePostConfirm = confirm("¿Estas seguro de borrar esta publicacion?")
    if (deletePostConfirm) {
      let deletePost = e.target.dataset.delete;
      let token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch(`http://192.168.0.142:4000/posts/${deletePost}`, requestOptions);
        const message = await response.json();
        console.log(message, deletePost)
      } catch (error) {
        console.error(error);
      }

      const myHeadersPosts = new Headers();
      myHeadersPosts.append("Authorization", `Bearer ${token}`);

      const requestOptionsPosts = { headers: myHeadersPosts, };

      try {
        const postsList = await fetch("http://192.168.0.142:4000/posts", requestOptionsPosts)
        const postsData = await postsList.json();
        if (postsData.length !== 0) {
          generatePostsHtml(postsData);
        } else {
          pagePost.innerHTML = "";
        }
      } catch (error) {
        console.log(error)
      }
    }

  }

  if (e.target.matches(".btn-like")) {
    CountedLikes++;
    var indice = e.target.dataset.like;
    let inputComment = document.getElementById(indice);
    let inputCommentValue = inputComment.value;
    let token = localStorage.getItem("token");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    console.log({ indice })
    const raw = JSON.stringify({
      "postId": parseInt(indice)
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://192.168.0.142:4000/likes", requestOptions);
      const loginData = await response.json();
      console.log(loginData)
    } catch (error) {
      console.error(error);
    }

    const myHeadersPosts = new Headers();
    myHeadersPosts.append("Authorization", `Bearer ${token}`);

    const requestOptionsPosts = {
      headers: myHeadersPosts,
    };

    try {
      const newPost = await fetch("http://192.168.0.142:4000/posts", requestOptionsPosts)
      const postsData = await newPost.json();
      console.log(postsData)
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
      } else {
        pagePost.innerHTML = "";
      }

    } catch (error) {

    }
  }

  if (e.target.matches(".btn-comment")) {
    CountedComment++;
    var indice = e.target.dataset.comment;
    let inputComment = document.getElementById(indice);
    let inputCommentValue = inputComment.value;
    let token = localStorage.getItem("token");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    console.log({ indice })
    const raw = JSON.stringify({
      "text": `${inputCommentValue}`,
      "postId": parseInt(indice)
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://192.168.0.142:4000/comments", requestOptions);
      const loginData = await response.json();
      console.log(loginData)
    } catch (error) {
      console.error(error);
    }

    const myHeadersPosts = new Headers();
    myHeadersPosts.append("Authorization", `Bearer ${token}`);

    const requestOptionsPosts = {
      headers: myHeadersPosts,
    };

    try {
      const newPost = await fetch("http://192.168.0.142:4000/posts", requestOptionsPosts)
      const postsData = await newPost.json();
      console.log(postsData)
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
      } else {
        pagePost.innerHTML = "";
      }

    } catch (error) {

    }
  }
});

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
function makeComment(comments) {
  let makeComment = ``;

  for (let index = 0; index < comments.length; index++) {
    const element = comments[index];
    let contador = index + 1;
    makeComment += `
         <div class="post-header-user">
          <div class="photo-profile-avatar-comment">
            <span>${element.user.name[0]}</span>
          </div>   
          <div class="data-user-post">
           <h2> ${element.user.name}</h2>
           <div class="post-comment">
              <span>
              ${element.text}
              </span>
            </div>
           <h2 id="post-${element.postId}-comment-${contador}"> ${moment(element.createdAt).fromNow()}</h2>
           </div>
            <button data-delete="${element.id}" class="btn --delete-comments">...</button>
           
         
       </div>         
         `;
  }
  return makeComment;
}
const generatePostsHtml = (postsData) => {
  let poster = ``;
  let posterArray = [];

  for (let index = 0; index < postsData.length; index++) {
    const element = postsData[index];
    const postLikes = foundLikes(likes, element.id);
    const postComments = foundComment(element.comments, element.id);
    const makeComments = makeComment(element.comments);
    // const makeComments = "";  
    poster = ` 
         <article id="post-${element.id}" class="content post">
    <header class="post-header">
        <div class="post-header-user">
            <div class="photo-profile-avatar">
                <span>${element.user.name.charAt(0)}</span>
            </div>
            <div class="data-user-post">
                <h2> ${element.user.name}</h2>
                <h2 id="time-post-${element.id}"> ${moment(element.createdAt).fromNow()}</h2>
            </div>
            <div class="btn-delete">
                <button data-delete="${element.id}" class="btn delete-post">X</button>
            </div>
        </div>
    </header>
    <div class="container  post-content">
        <span>
            ${element.content}
        </span>
        <div id="post-likes" class="post-likes">
            <h5>❤️ ${element.likes.length}</h5>
            <h5>${postComments} Comentarios</h5>
        </div>
    </div>
    <footer class="btns-comment">
        <button data-like="${element.id}" class="btn --btn-post btn-like">Me gusta</button>
        <button data-comment="${element.id}" class="btn --btn-post btn-comment">Comentar</button>
        <button class="btn --btn-post">Compartir</button>
    </footer>
    <article id="container-comment" class="container-comment">
        ${makeComments}
        <div class="post-contents">
            <div class="post-header-user">
                <div class="photo-profile-avatar">
                    <span>${userActive.name.charAt(0)}</span>
                </div>
                <input id="${element.id}" class="input-comment" type="text"
                    placeholder="     Comentar como ${userActive.name}">
                <button data-comment="${element.id}" class="btn --btn-comment btn-comment">Comentar</button>
            </div>
        </div>
    </article>
</article>`;
    posterArray.unshift(poster)
  }
  pagePost.innerHTML = posterArray;
};
