let likes = [];
let CountedLikes = 0;
let CountedComment = 0;
const API_URL = "http://192.168.0.142:4000"
let userActive = {};
let userStorage = "Users";
let pageLogin = document.getElementById("page-login");
let pagePost = document.getElementById("generate-posts");
let nav = document.getElementById("menu");
let bubbleContainer = document.getElementById("bubble-container");
let bubbleChat = document.getElementById("bubble-chat-container");
let btnSignUp = document.getElementById("btn-sign-up");
let password = document.getElementById("password");
let email = document.getElementById("email");
let generatePosts = document.getElementById("generate-posts");
let limpiarCambiarTiempo = null
let chatContactsContainer = document.getElementById("chat-contacts-container");
let chat = ""
let modalBackground = document.getElementById("modal-background");
let ws = null
let sender = ""
function initWebSocket(token) {
  ws = new WebSocket('ws://192.168.0.142:4000');

  ws.onopen = () => {
    console.log('Conexión establecida');
    const objToSend = {
      type: "connected-users",
      token: token // Asegúrate de que `token` sea accesible aquí
    };
    ws.send(JSON.stringify(objToSend));
  };

  ws.onmessage = (event) => {
    handleWebSocketMessage(event);

  };

  ws.onclose = () => {
    console.log('Conexión cerrada');
    alert("Gracias por visitarnos");
  };
}

function handleWebSocketMessage(event) {
  let data = JSON.parse(event.data);
  console.log('Mensaje recibido:', data);

  if (data.type === 'connected-users') {
    updateConnectedUsers(data.users);
    console.log(data.users)
  }
  if (data.type === 'message') {
    console.log("se recibio un mensaje")



    console.log(data.message)
    updateMessageChat(data.message)

  }
}

function updateConnectedUsers(users) {
  let allBubbles = document.querySelectorAll(".bubble-no-active");
  allBubbles.forEach(element => {
    element.classList.remove("contectado");
  });
  users.forEach(user => {
    if (user.id !== userActive.id) {
      let userElement = document.getElementById(`conectado-${user.id}`);
      userElement.classList.add("contectado");
      console.log(user.id)
      console.log(userElement)
    }
  });
}


async function updateMessageChat(message) {
  console.log(message)
  let token = localStorage.getItem("token");
  const myHeadersBubble = new Headers();
  myHeadersBubble.append("Authorization", `Bearer ${token}`);
  const requestOptionsBubble = {
    headers: myHeadersBubble,
  };
  try {
    const responseBubble = await fetch(`${API_URL}/users`, requestOptionsBubble)
    const usersData = await responseBubble.json();
    
    for (let index = 0; index < usersData.length; index++) {
      const element = usersData[index];
      if (element.id == message.userId) {
        sender = element.name
      }
    }
  }
  catch (error) {
    console.log(error)
  }

  let chatReceiver = document.getElementById(`chat-${message.userId}`);

  if (chatReceiver) {
    let messageHTML = `
      <div class="messageReceived" data-user-id="${message.toUserId}">
        <span class="message-text">${sender}</span>
        <span class="message-text">${message.text}</span>
        <span class="message-text">${moment().format("[Enviado a las ]HH:mm")}</span> 
      </div>
    `;
    chatReceiver.innerHTML += messageHTML;
    chatReceiver.scrollTop = chatReceiver.scrollHeight;
  }
}

async function cambiarTiempo() {
  let token = localStorage.getItem("token");

  const myHeadersPosts = new Headers();
  myHeadersPosts.append("Authorization", `Bearer ${token}`);
  const requestOptionsPosts = {
    headers: myHeadersPosts,
  };
  try {
    const newPost = await fetch(`${API_URL}/posts`, requestOptionsPosts)
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
    clearInterval(limpiarCambiarTiempo)
    pagePost.classList.toggle("disguise");
    pageLogin.classList.toggle("disguise");
    bubbleContainer.classList.toggle("disguise");
    nav.classList.toggle("disguise");
    userActive = ""
    nav.innerHTML = ""
    ws.close()
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    ws = null
  }
  if (e.target.matches(".btn-sign-up")) {

    console.log("hola")




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
      const response = await fetch(`${API_URL}/auth/login`, requestOptions);
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
      bubbleContainer.classList.toggle("disguise");
      nav.classList.toggle("disguise");
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

      /*   const objToSend = {
          type: "connected-users",
          token,
        }
        ws.send(JSON.stringify(objToSend)) */

      initWebSocket(token);
      nav.innerHTML = menu;
    } catch (error) {
      console.log(error);
    }
    const myHeadersBubble = new Headers();
    myHeadersBubble.append("Authorization", `Bearer ${token}`);
    const requestOptionsBubble = {
      headers: myHeadersBubble,
    };
    try {
      const responseBubble = await fetch(`${API_URL}/users`, requestOptionsBubble)
      const usersData = await responseBubble.json();
      let bubble = ""
      for (let index = 0; index < usersData.length; index++) {
        const element = usersData[index];
        if (element.name !== userActive.name) {
          bubble += `
      <div id="bubble-${element.id}" class="bubble-contact">
        <div id="conectado-${element.id}" class="bubble-no-active"> </div>
        <button data-contact="${element.id}" class="bubble-contact">${element.name[0]}</button>
        <span id="notification-${element.id}"> </span>
      </div>  
            `;
        }
      }
      bubbleChat.innerHTML = bubble;
    } catch (error) {
      console.log(error)
    }
    const myHeadersPosts = new Headers();
    myHeadersPosts.append("Authorization", `Bearer ${token}`);
    const requestOptionsPosts = {
      headers: myHeadersPosts,
    };
    try {
      const newPost = await fetch(`${API_URL}/posts`, requestOptionsPosts)
      const postsData = await newPost.json();
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
        limpiarCambiarTiempo = setInterval(() => {
          cambiarTiempo();
        }, 1000);
      } else {
        pagePost.innerHTML = "";
      }
    } catch (error) {
      console.log(error)
    }
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
      const response = await fetch(`${API_URL}/posts`, requestOptions);
      const loginData = await response.json();
      console.log(loginData)
    } catch (error) {
      console.log(error);
    }
    const myHeadersPosts = new Headers();
    myHeadersPosts.append("Authorization", `Bearer ${token}`);
    const requestOptionsPosts = { headers: myHeadersPosts, };
    try {
      const postsList = await fetch(`${API_URL}/posts`, requestOptionsPosts)
      const postsData = await postsList.json();
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
        document.getElementById("input-post").value = ""
        window.scrollTo({ behavior: "smooth", top: 0 });
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
        const response = await fetch(`${API_URL}/posts/${deletePost}`, requestOptions);
        const message = await response.json();
        console.log(message, deletePost)
      } catch (error) {
        console.log(error);
      }


      const myHeadersPosts = new Headers();
      myHeadersPosts.append("Authorization", `Bearer ${token}`);

      const requestOptionsPosts = { headers: myHeadersPosts, };

      try {
        const postsList = await fetch(`${API_URL}/posts`, requestOptionsPosts)
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
  if (e.target.matches(".delete-comment")) {
    let deletePostConfirm = confirm("¿Estas seguro de borrar este comentario?")
    if (deletePostConfirm) {
      let commentIdDelete = e.target.dataset.deleteId;
      console.log(commentIdDelete)
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
        const response = await fetch(`${API_URL}/comments/${commentIdDelete}`, requestOptions);
        const message = await response.json();
      } catch (error) {
        console.log(error);
      }
      const myHeadersPosts = new Headers();
      myHeadersPosts.append("Authorization", `Bearer ${token}`);
      const requestOptionsPosts = { headers: myHeadersPosts, };
      try {
        const postsList = await fetch(`${API_URL}/posts`, requestOptionsPosts)
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
  if (e.target.matches(".edit-comment")) {
    let editPostPrompt = prompt("Editar mensaje")
    if (editPostPrompt) {
      let commentIdEdit = e.target.dataset.editId;
      console.log(commentIdEdit)
      let token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      const raw = JSON.stringify({
        "text": editPostPrompt
      });
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      try {
        const response = await fetch(`${API_URL}/comments/${commentIdEdit}`, requestOptions);
        const message = await response.json();
      } catch (error) {
        console.log(error);
      }
      const myHeadersPosts = new Headers();
      myHeadersPosts.append("Authorization", `Bearer ${token}`);
      const requestOptionsPosts = { headers: myHeadersPosts, };
      try {
        const postsList = await fetch(`${API_URL}/posts`, requestOptionsPosts)
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
  if (e.target.matches(".--options-comments")) {
    let positionPost = e.target.dataset.post
    let positionComment = e.target.dataset.comment
    let targetEdit = document.getElementById(`post-${positionPost}-edit-${positionComment}`)
    let targetDelete = document.getElementById(`post-${positionPost}-delete-${positionComment}`)
    targetEdit.classList.toggle("is-active-btn-edit")
    targetDelete.classList.toggle("is-active-btn-delete")
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
      const response = await fetch(`${API_URL}/likes`, requestOptions);
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
      const newPost = await fetch(`${API_URL}/posts`, requestOptionsPosts)
      const postsData = await newPost.json();
      console.log(postsData)
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
      } else {
        pagePost.innerHTML = "";
      }
    } catch (error) {
      console.log(error)
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
      const response = await fetch(`${API_URL}/comments`, requestOptions);
      const loginData = await response.json();
      console.log(loginData)
    } catch (error) {
      console.log(error);
    }
    const myHeadersPosts = new Headers();
    myHeadersPosts.append("Authorization", `Bearer ${token}`);
    const requestOptionsPosts = {
      headers: myHeadersPosts,
    };
    try {
      const newPost = await fetch(`${API_URL}/posts`, requestOptionsPosts)
      const postsData = await newPost.json();
      console.log(postsData)
      if (postsData.length !== 0) {
        generatePostsHtml(postsData);
      } else {
        pagePost.innerHTML = "";
      }
    } catch (error) {
      console.log(error)
    }
  }
  if (e.target.matches(".--btn-new-chat")) {
    bubbleChat.classList.toggle("bubble-chat-is-active")
    e.target.classList.toggle("btn-new-chat-cancel")
    modalBackground.classList.toggle("none")
    chatContactsContainer.classList.toggle("none")
    nav.classList.toggle("none")
    pagePost.classList.toggle("none")
    window.scrollTo({ behavior: "smooth", top: 0 });
  }
  if (e.target.matches(".bubble-contact")) {
    let userIdChat = e.target.dataset.contact;
    let token = localStorage.getItem("token");
    chat = ""
    const myHeadersBubble = new Headers();
    myHeadersBubble.append("Authorization", `Bearer ${token}`);
    const requestOptionsBubble = {
      headers: myHeadersBubble,
    };
    try {
      const responseBubble = await fetch(`${API_URL}/users/${userIdChat}`, requestOptionsBubble)
      const userChatData = await responseBubble.json();
      if (userChatData) {
        chat = `
        <div id="chat-content-contact-${userChatData.id}" class="chat-content-active">
          <header data-index="${userChatData.id}" class="content-header-footer">
            <div class="user-header-contact">
              <span class="photo-profile-avatar">${userChatData.name[0]}</span>
              <span class="name-contact">${userChatData.name}</span>
            </div>
          <button data-index="${userChatData.id}" class="btn --btn-delete">x</button>
        </header>
        <div id="chat-${userChatData.id}" class="is-active ">aqui van los mensajes}</div>
          <footer data-index="${userChatData.id}" class="content-header-footer">
            <input data-index="${userChatData.id}" id="input-chat-contact-${userChatData.id}" class="input input-chat-contacts"
              type="text" placeholder="Chat con ${userChatData.name}">
            <button data-index="${userChatData.id}" id="btn-chat-send-contact-${userChatData.id}"
              class="btn --btn-chat-send-contacts">✉️</button>
          </footer>
        </div>`
      }
      chatContactsContainer.innerHTML = chat;
    } catch (error) {
      console.log(error)
    }
  }
  if (e.target.matches(".--btn-delete")) {
    chatContactsContainer.innerHTML = "";
  }
  if (e.target.matches(".--btn-chat-send-contacts")) {
    let idReceiver = e.target.dataset.index
    let inputMessage = document.getElementById(`input-chat-contact-${idReceiver}`).value;
    let token = localStorage.getItem("token")
    const mensaje = {
      type: "message",
      token,
      text: inputMessage,
      toUserId: parseInt(idReceiver)
    }
    ws.send(JSON.stringify(mensaje))
    let chatReceiver = document.getElementById(`chat-${idReceiver}`);

    if (chatReceiver) {
      let messageHTML = `
        <div class="messageSend" data-user-id="${idReceiver}">
          <span class="message-text">${userActive.name}</span>
          <span class="message-text">${inputMessage}</span>
          <span class="message-text">${moment().format("[Enviado a las ]HH:mm")}</span> 
        </div>
      `;
      chatReceiver.innerHTML += messageHTML;
      chatReceiver.scrollTop = chatReceiver.scrollHeight;
    }



    console.log(mensaje)
    console.log(inputMessage)
    console.log(idReceiver)
    document.getElementById(`input-chat-contact-${idReceiver}`).value = ""
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
            <button id="post-${element.postId}-comment-${contador}" data-post="${element.postId}" data-comment="${contador}" class="btn --options-comments">...</button>
            <button id="post-${element.postId}-edit-${contador}" data-edit-id="${element.id}" class="btn edit-comment">Edit</button>
            <button id="post-${element.postId}-delete-${contador}" data-delete-id="${element.id}" class="btn delete-comment">Eliminar</button>
       </div >
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
</article > `;
    posterArray.unshift(poster)
  }
  pagePost.innerHTML = posterArray;
};
