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