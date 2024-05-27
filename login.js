let user = [
  {
    id: "1",
    userNamer: "Nestor",
    email: "melendezinv4321@gmail.com",
    password: "David4321",
    photo:
      "https://photos.fife.usercontent.google.com/pw/AP1GczM2lEzu1ZCQvqf2m8a-JFp38-9GrUToRjAaHY_fDhMloYBfXAsRlF41aQ=w739-h739-s-no-gm?authuser=0",
  },
  {
    id: "2",
    userNamer: "Leonardo",
    email: "leonardo@gmail.com",
    password: "David0202",
    photo:
      "https://photos.fife.usercontent.google.com/pw/AP1GczO00N6wDtWMTm_sZbwaDvlDG_F60kmKD5JfnGhzjvK75U4G5E8MZV3eyA=w554-h739-s-no-gm?authuser=0",
  },
  {
    id: "3",
    userNamer: "Leonel",
    email: "leonel@gmail.com",
    password: "David3011",
    photo:
      "https://photos.fife.usercontent.google.com/pw/AP1GczPETPKxAlFPnKnB5hw8ho7hJCM2GJFw-eDSi7vlqcL96E7UP-mw37xLUw=w985-h739-s-no-gm?authuser=0",
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

let userActive = {};

let pageLogin = document.getElementById("page-login");
let pagePost = document.getElementById("page-posts");

var btnSignUp = document.getElementById("btn-sign-up");
var password = document.getElementById("password");
var email = document.getElementById("email");

document.addEventListener("click", (e) => {
  if (e.target.matches(".user-out")) {
    pagePost.classList.toggle("disguise");
    pageLogin.classList.toggle("disguise");
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
      alert("Disculpe el usuario no se encuentra registrado")
      return
    }

    if (userActive.password == password.value) {
      pagePost.classList.toggle("disguise");
      pageLogin.classList.toggle("disguise");
    } else {
        alert("disculpe la contraseña no es valida");
    }
  }
});

function verifyEmail(user, email) {
  for (const usuario of user) {
    if (usuario.email === email) {
      userActive = usuario
    } 
  }
}
