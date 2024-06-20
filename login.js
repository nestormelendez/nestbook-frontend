const API_URL = "https://nestbook-backend.onrender.com"
let pageLogin = document.getElementById("page-login");
let pagePost = document.getElementById("generate-posts");
let nav = document.getElementById("menu");
let bubbleContainer = document.getElementById("bubble-container");
let bubbleChat = document.getElementById("bubble-chat-container");
let btnSignUp = document.getElementById("btn-sign-up");
let password = document.getElementById("password");
let email = document.getElementById("email");
let generatePosts = document.getElementById("generate-posts");
let modalBackground = document.getElementById("modal-background");
let chatContactsContainer = document.getElementById("chat-contacts-container");
let likes = [];
let userActive = {};
let CountedLikes = 0;
let CountedComment = 0;
let userStorage = "Users";
let ws = null
let limpiarCambiarTiempo = null
let chat = ""
let sender = ""
let reloadMessageValue = ""

function initWebSocket(token) {
  ws = new WebSocket('wss://nestbook-backend.onrender.com');

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
    notificationWindown(data.message)
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
              <div class="photo-text-received">
                <div class="photo-profile-avatar-comment">${sender[0]}</div>
                <span class="message-received-content">${message.text}</span>
              </div>
              <span class="message-received-moment">${moment().format("[Enviado a las ] HH:mm")}</span> 
            </div>
    `;
    chatReceiver.innerHTML += messageHTML;
    chatReceiver.scrollTop = chatReceiver.scrollHeight;
  } else {
    let notificationContent = document.getElementById(`notification-${message.userId}`);
    console.log(notificationContent)
    console.log(message.toUserId)
    let notification = `✉️`;
    notificationContent.innerText = notification;
  }
}
function notificationWindown(message) {
  if (Notification.permission === `granted`) {
    const notificacion = new Notification(`Tienes un mensaje de ${message.userId}`, {
      icon: `./assets/logo2.png`,
      body: `${message.text}`,
    });
    notificacion.onclick = function () {
      // const existingWindow = window.open('https://nestormelendez.github.io/alarma_de_tareas/', 'noopener');
      const existingWindow = window.open("http://127.0.0.1:5500/index.html", "noopener");
      if (existingWindow) {
        existingWindow.focus();
       
      }
      /* window.open(`https://nestormelendez.github.io/alarma_de_tareas/`) */
    };
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
        <input id="${element.id}" class="input-comment" type="text" placeholder="      Comentar como ${userActive.name}">
        <button data-comment="${element.id}" class="--btn-comment btn-comment">
          <svg data-comment="${element.id}" style="width: 35px;" class="btn-comment" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path data-comment="${element.id}" style="width: 35px;" class="btn-comment" fill="#0084ff"
              d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</article>
`
      ;
    posterArray.unshift(poster)
  }
  pagePost.innerHTML = posterArray.join("");
};
async function reloadMessage(userIdChat) {
  let token = localStorage.getItem("token");
  let chatContent = document.getElementById(`chat-${userIdChat}`);
  let generateChat = ""
  const myHeadersUsers = new Headers();
  myHeadersUsers.append("Authorization", `Bearer ${token}`);
  const requestOptionsUsers = {
    headers: myHeadersUsers,
  };
  try {
    const responseUsers = await fetch(`${API_URL}/users`, requestOptionsUsers)
    const usersList = await responseUsers.json();
    for (let index = 0; index < usersList.length; index++) {
      const element = usersList[index];
      if (element.id == userIdChat) {
        sender = element.name
      }
    }
  }
  catch (error) {
    console.log(error)
  }
  const myHeadersChats = new Headers();
  myHeadersChats.append("Authorization", `Bearer ${token}`);
  const requestOptionsChats = {
    headers: myHeadersChats,
  };
  try {
    const responseChats = await fetch(`${API_URL}/chats/${userIdChat}`, requestOptionsChats)
    const listChats = await responseChats.json();
    if (listChats)
      for (let index = 0; index < listChats.length; index++) {
        const element = listChats[index];
        if (element.userId == userActive.id) {
          generateChat += `
          <div class="messageSend" data-user-id="${element.userId}">
            <p class="message-sender-content">${element.text}</p>
            <span class="message-sender-moment">${moment(element.createdAt).fromNow()}</span> 
          </div>`
        } else {
          generateChat += `
          <div class="messageReceived" data-user-id="${element.toUserId}">
            <div class="photo-text-received">
              <div class="photo-profile-avatar-comment">${sender[0]}</div>
              <span class="message-received-content">${element.text}</span>
            </div>
            <span class="message-received-moment">${moment(element.createdAt).fromNow()}</span> 
          </div>`
        }
      }
    chatContent.innerHTML = generateChat;
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

    Notification.requestPermission().then((resultado) => {
      console.log(`respuesta: `, resultado);
    });

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
      let menu = `
    <div class="user-active">
      <div class="photo-profile-avatar">
        <span>${loginData.user.name.charAt(0)}</span>
      </div>
      <div class="post-input">
        <h2> ${loginData.user.name}</h2>
        <button id="user-out" class="btn --menu-user user-out">Salir</button>
      </div>
    </div>

    <div class="btn-options">
    <textarea id="input-post" class="input-post" name="" rows="3" maxlength="255"
    placeholder="¿Que estas pensando?"></textarea>
    <button id="create-post" class="--menu-user create-post">
        <svg class="create-post" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path class="create-post" fill="#0084ff" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"/></svg>
    </button>
    </div>`;
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
        <span id="notification-${element.id}" class="notification"> </span>
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
    clearInterval(reloadMessageValue)
    let userIdChat = parseInt(e.target.dataset.contact);
    console.log(userIdChat)
    let token = localStorage.getItem("token");
    let notificationContent = document.getElementById(`notification-${userIdChat}`);

    notificationContent.innerText = "";
    let chat = ""
    let generateChat = ""
    const myHeadersUsers = new Headers();
    myHeadersUsers.append("Authorization", `Bearer ${token}`);
    const requestOptionsUsers = {
      headers: myHeadersUsers,
    };
    try {
      const responseUsers = await fetch(`${API_URL}/users`, requestOptionsUsers)
      const usersList = await responseUsers.json();
      for (let index = 0; index < usersList.length; index++) {
        const element = usersList[index];
        if (element.id == userIdChat) {
          sender = element.name
        }
      }
    }
    catch (error) {
      console.log(error)
    }
    const myHeadersChats = new Headers();
    myHeadersChats.append("Authorization", `Bearer ${token}`);
    const requestOptionsChats = {
      headers: myHeadersChats,
    };
    try {
      const responseChats = await fetch(`${API_URL}/chats/${userIdChat}`, requestOptionsChats)
      const listChats = await responseChats.json();
      if (listChats)
        for (let index = 0; index < listChats.length; index++) {
          const element = listChats[index];
          if (element.userId == userActive.id) {
            generateChat += `
            <div class="messageSend" data-user-id="${element.userId}">
              <p class="message-sender-content">${element.text}</p>
              <span class="message-sender-moment">${moment(element.createdAt).fromNow()}</span> 
            </div>`
          } else {
            generateChat += `
            <div class="messageReceived" data-user-id="${element.toUserId}">
              <div class="photo-text-received">
                <div class="photo-profile-avatar-comment">${sender[0]}</div>
                <span class="message-received-content">${element.text}</span>
              </div>
              <span class="message-received-moment">${moment(element.createdAt).fromNow()}</span> 
            </div>`
          }
        }
    } catch (error) {
      console.log(error)
    }
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
        <div id="chat-${userChatData.id}" class="is-active ">${generateChat}</div>
          <footer data-index="${userChatData.id}" class="content-header-footer">
            <input data-index="${userChatData.id}" id="input-chat-contact-${userChatData.id}" class="input input-chat-contacts"
              type="text" placeholder="Chat con ${userChatData.name}">
            <button data-index="${userChatData.id}" id="btn-chat-send-contact-${userChatData.id}"
              class="btn-chat --btn-chat-send-contacts">
              <svg data-index="${userChatData.id}" class="btn-chat --btn-chat-send-contacts" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path data-index="${userChatData.id}" class="btn-chat --btn-chat-send-contacts" fill="#0084ff" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
              </button>
          </footer>
        </div>`
      }
      chatContactsContainer.innerHTML = chat;
      let chatReceiver = document.getElementById(`chat-${userIdChat}`);
      chatReceiver.scrollTop = chatReceiver.scrollHeight;
      reloadMessageValue = setInterval(() => {
        reloadMessage(userIdChat)
      }, 1000);
    } catch (error) {
      console.log(error)
    }
  }
  if (e.target.matches(".--btn-delete")) {
    chatContactsContainer.innerHTML = "";
    clearInterval(reloadMessageValue)
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
              <p class="message-sender-content">${inputMessage}</p>
              <span class="message-sender-moment">${moment().format("[Enviado a las ] HH:mm")}</span> 
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
