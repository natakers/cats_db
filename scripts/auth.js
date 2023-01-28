let authBtn = document.querySelector("#auth");
let save = document.querySelector(".save");

if (Cookies.get("user") == undefined) {
  auth();
  authBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addChildren("auth");
    if (!popupForm.classList.contains("active")) {
      popupForm.classList.add("active");
      popupForm.parentElement.classList.add("active");
    }
    auth();
  });
} else {
  userNotFound();
}


authBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (Cookies.get("user") == undefined) {
    auth();
  } else {
    userNotFound();
  }
});

function userNotFound() {
  addChildren("user");
  let entry = document.querySelector(".entry");
  if (entry) {
    entry.addEventListener("click", (e) => {
      e.preventDefault();
      closePopupForm.click();
    });
  }
  
}

function auth() {
  addChildren("auth");
  let form = document.forms[0];
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements.user.value != "") {
      Cookies.set("user", form.elements.user.value);
    }
    form.reset();
    closePopupForm.click();
    getCats(api, catsData);
  });
}