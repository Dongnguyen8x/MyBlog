function sendRequest(url, method, data) {
  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("response is not ok");
      }
      if (res.redirected) {
        window.location.href = res.url;
      }
      return res.json();
    })
    .then((data) => console.log(data))
    .catch((error) => {
      console.error(error.message);
    });
}

function setupListener(method) {
  const btn = document.querySelector(`#${method}-post`);
  if (btn) {
    btn.addEventListener("click", () => {
      const url = "/post";
      const data = {
        postId: document.querySelector("#postId")?.value,
        title: document.querySelector("#title")?.value,
        category: document.querySelector("#category")?.value,
        description: document.querySelector("#description")?.textContent,
        content: document.querySelector("#content")?.textContent,
        author: document.querySelector("#author")?.value,
      };
      sendRequest(url, method.toUpperCase(), data);
    });
  }
}

// save state
saveState();

//use
console.log("sendrequest");
["put","delete"].forEach((method) => {
  console.log(method);
  setupListener(method);
});
loadState();

// load state




function saveState(){
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {item.addEventListener('click',()=>{
   const navState={
      homeItem:false,
      postCreateItem : false
    }
    if(item.getAttribute("id")==="home-item"){
      navState.homeItem=true;
    }
    if(item.getAttribute("id")==="post-create-item"){
      navState.postCreateItem=true;
    }
    localStorage.setItem("navState",JSON.stringify(navState));

    })
    
  });
}
function loadState(){
const navState = JSON.parse(localStorage.getItem("navState"));
document.querySelector('#home-item').classList.toggle('active',navState.homeItem);
document.querySelector('#post-create-item').classList.toggle('active',navState.postCreateItem);

}