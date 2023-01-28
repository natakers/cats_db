let main = document.querySelector("main");
let namePopup = "";
let addBtn = document.querySelector("#add");
let popupForm = document.querySelector("#popup-form");
let closePopupForm = popupForm.querySelector(".popup-close");
let form_inner = document.querySelector(".form-inner");

let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];

const updCards = function (data) {
  main.innerHTML = "";
  data.forEach(function (cat) {
    if (cat.id) {
      let card = document.createElement("div");
      if (cat.favourite) {
        card.classList.add("card");
        card.classList.add("like");
      } else card.classList.add("card");
      if (cat.img_link) {
        card.style.backgroundImage = `url(${cat.img_link}`;
      } else card.style.backgroundImage = "url('./images/cat.jpg')";

      let span = document.createElement("span");
      span.innerHTML = cat.name;
      card.append(span);
      main.append(card);
      card.addEventListener("click", () => {
        addChildren("cat", cat);
      });
    }
  });
  let cards = document.getElementsByClassName("card");
  for (let i = 0, cnt = cards.length; i < cnt; i++) {
    const width = cards[i].offsetWidth;
    cards[i].style.height = width * 0.6 + "px";
  }
};

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addChildren("add_pet");
});
closePopupForm.addEventListener("click", () => {
  popupForm.classList.remove("active");
  popupForm.parentElement.classList.remove("active");
});

const api = new Api("nata_kers");

function formAddListener() {
  let form = document.forms[0];
  form.img_link.addEventListener("change", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
  });
  form.img_link.addEventListener("input", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let body = {};
    for (let i = 0; i < form.elements.length; i++) {
      let inp = form.elements[i];
      if (inp.type === "checkbox") {
        body[inp.name] = inp.checked;
      } else if (inp.name && inp.value) {
        if (inp.type === "number") {
          body[inp.name] = +inp.value;
        } else {
          body[inp.name] = inp.value;
        }
      }
    }
    api
      .addCat(body)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          form.reset();
          closePopupForm.click();
          api
            .getCat(body.id)
            .then((res) => res.json())
            .then((cat) => {
              if (cat.message === "ok") {
                catsData.push(cat.data);
                localStorage.setItem("cats", JSON.stringify(catsData)); 
              } else {
                console.log(cat);
              }
            }).then(() => getCats(api, catsData));
        } else {
          console.log(data);
          addChildren("error", data);
          api
            .getIds()
            .then((r) => r.json())
            .then((d) => console.log(d));
        }
      });
  });
}


const getCats = function (api, store) {
  if (!store.length) {
    api
      .getCats()
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          localStorage.setItem("cats", JSON.stringify(data.data));
          catsData = [...data.data];
          updCards(data.data);
        }
      });
  } else {
    updCards(store);
  }
};

if (Cookies.get("user")) {
  getCats(api, catsData);
}


function addChildren(namePopup, data = {}) {
  if (namePopup == "add_pet") {
    form_inner.innerHTML = `
      <h2>Добавить питомца</h2>
      <form action="">
        <div class="form-img"></div>
        <input type="number" name="id" min="1" required placeholder="id" />
        <input type="number" name="age" placeholder="Возраст" />
        <input type="text" name="name" required placeholder="Имя" />
        <input
          type="number"
          name="rate"
          placeholder="Рейтинг (0-10)"
          min="0"
          max="10"
        />
        <textarea name="description" placeholder="Описание"></textarea>
        <label
          >Любимчик <input type="checkbox" name="favourite" placeholder=""
        /></label>
        <input type="text" name="img_link" placeholder="Ссылка на фото" />
        <button type="submit">Добавить котика</button>
      </form>`;
    formAddListener();
  }

  if (namePopup == "auth") {
    form_inner.innerHTML = `<h2>Авторизация</h2>
      <h4>Приветствую, незнакомец! Введи свое имя</h4>
      <form action="">
        <input type="text" name="user" required placeholder="Ваше имя" />
        <button type="submit">Сохранить</button>
      </form>`;
  }
  if (namePopup == "user") {
    form_inner.innerHTML = `<h2>Приветствую, ${Cookies.get("user")}</h2>
        <h4>Котики ждут!</h4>`;
  }
  if (namePopup == "delete") {
    form_inner.innerHTML = `<h2>Вы уверены?</h2>
      <h4>Удалить котика?</h4>
      <form action="">
        <button class="confirm_delete" type="submit">Да</button>
        <button class="confirm_return">Нет</button>
      </form>`;
    let returnBtn = document.querySelector(".confirm_return");
    returnBtn.addEventListener("click", () => {
      addChildren("cat", data);
    });
    let deleteConfirm = document.querySelector(".confirm_delete");
    deleteConfirm.addEventListener("click", () => {
      formDeleteListener(data);
    });
  }
  if (namePopup == "cat") {
    form_inner.innerHTML = `<div class="cat_name">
    <h2>${data.name}</h2>
    <div class="btn delete"><i class="fa-solid fa-trash"></i></div>
    <div class="btn edit"><i class="fa-solid fa-pen"></i></div>
    </div>
        <div class="form-img form-img-edit" style="background-image: url(${
          data.img_link ? data.img_link : "./images/cat.jpg"
        }) "></div>
        ${data.age ? `<p>Возраст: ${data.age}</p>` : ""}
        ${data.rate ? `<p>Рейтинг: ${data.rate}</p>` : ""}
        ${data.description ? `<p>Описание: ${data.description}</p>` : ""}
        ${data.favourite ? `<p>Любимчик: Да</p>` : `<p>Любимчик: Нет</p>`}
        `;
    let deleteBtn = document.querySelector(".delete");
    deleteBtn.addEventListener("click", () => {
      addChildren("delete", data);
    });
    let editBtn = document.querySelector(".edit");
    editBtn.addEventListener("click", () => {
      addChildren("edit", data);
    });
  }
  if (namePopup == "edit") {
    form_inner.innerHTML = `<div class="cat_name">
    <div class="btn back"><i class="fa-sharp fa-solid fa-circle-left"></i>Назад</div>
    <h2 class='title-name'>${data.name}</h2>
    
    </div>
    <form action="">
    <div class="form-img form-img-edit" style="background-image: url(${
      data.img_link ? data.img_link : "./images/cat.jpg"
    }) "></div>
        <div class='input-box'><label>Имя: </label><input type="text" name="name" value=${
          data.name ? data.name : ""
        }></input></div>
        <div class='input-box'><label>Возраст: </label><input type="number" name="age" min="0" value=${
          data.age ? data.age : "0"
        }></input></div>
        <div class='input-box'><label>Рейтинг: </label><input type="number" min="0" max="10" name="rate" value=${
          data.rate ? data.rate : "0"
        }></input></div>
        <div class='input-box'><label>Описание: </label><input type="textarea" name="description" value=${
          data.description ? data.description : ""
        }></input></div>
        <div class='input-box'><label>Ссфлка на фото: </label><input type="text" name="img_link" value=${
          data.img_link ? data.img_link : "./images/cat.jpg"
        }></input></div>
        ${
          data.favourite
            ? `<label>Любимчик <input type="checkbox" name="favourite" checked placeholder=""/></label>`
            : `<label>Любимчик <input type="checkbox" name="favourite" placeholder=""/></label>`
        }
    <button class="update-cat" type="submit">Обновить котика</button>
        </form>
        `;
    formUpdateListener(data);
    let back = document.querySelector(".back");
    back.addEventListener("click", () => {
      addChildren("cat", data);
    });
  }
  if (namePopup == "error") {
    form_inner.innerHTML = `<h2>${data.message}</h2>`;
  }
  if (!popupForm.classList.contains("active")) {
    popupForm.classList.add("active");
    popupForm.parentElement.classList.add("active");
  }
}

function formDeleteListener(cat) {
  let form = document.forms[0];
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    api
      .delCat(cat.id)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          catsData = catsData.filter((item) =>  item.id != cat.id);
          localStorage.setItem("cats", JSON.stringify(catsData));
          getCats(api, catsData);
          form.reset();
          closePopupForm.click();
        } else {
        }
      }).then(() => getCats(api, catsData));;
  });
}

function formUpdateListener(cat) {
  let form = document.forms[0];
  form.img_link.addEventListener("change", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
  });
  form.img_link.addEventListener("input", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
  });
  let cat_name = document.querySelector(".title-name");
  form.name.addEventListener("change", (e) => {
    cat_name.innerHTML = e.target.value;
  });
  form.name.addEventListener("input", (e) => {
    cat_name.innerHTML = e.target.value;
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let body = {};
    for (let i = 0; i < form.elements.length; i++) {
      let inp = form.elements[i];
      console.log(inp);
      if (inp.type === "checkbox") {
        body[inp.name] = inp.checked;
      } else if (inp.name && inp.value) {
        if (inp.type === "number") {
          body[inp.name] = +inp.value;
        } else {
          body[inp.name] = inp.value;
          console.log(inp.value);
        }
      }
    }
    api
      .updCat(cat.id, body)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          form.reset();
          closePopupForm.click();
          api
            .getCat(cat.id)
            .then((res) => res.json())
            .then((cat) => {
              console.log(cat);
              if (cat.message === "ok") {
                catsData = catsData.map((item) =>  item.id == cat.data.id ? cat.data : item);
                console.log(catsData)
                localStorage.setItem("cats", JSON.stringify(catsData));
              } else {
                console.log(cat);
              }
            }).then(() => getCats(api, catsData));;
        } else {
          api
            .getIds()
            .then((r) => r.json())
            .then((d) => console.log(d));
        }
      }).then(() => getCats(api, catsData));
  });
}
