document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-sign-up")) {
        let pageLogin = document.getElementById("page-login");
        let posts =document.getElementById("posts")
        posts.classList.remove("disguise")
        pageLogin.classList.add("disguise")

    }
});
