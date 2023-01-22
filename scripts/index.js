let main = document.querySelector("main");
let namePopup = ''
let addBtn = document.querySelector("#add");
let popupForm = document.querySelector("#popup-form");
let closePopupForm = popupForm.querySelector(".popup-close");
let form_inner = document.querySelector('.form-inner')

const updCards = function (data) {
  main.innerHTML = "";
  data.forEach(function (cat) {
    if (cat.id) {
      let card = document.createElement('div')
      if (cat.favourite) {
        card.classList.add("card")
        card.classList.add("like")
      } else card.classList.add("card")
      if (cat.img_link) {
        card.style.backgroundImage = `url(${cat.img_link}`
      } else card.style.backgroundImage = "url('./images/cat.jpg')"
      
      let span = document.createElement('span')
      span.innerHTML = cat.name 
      card.append(span)
      // let card = `<div class="${cat.favourite ? "card like" : "card" }" style="background-image: url(${cat.img_link || "images/cat.jpg"})">
      //               <span>${cat.name}</span>
      //             </div>`;
      // main.innerHTML += card;
      main.append(card)
      // cardHandler(card, cat)
      card.addEventListener('click', () => {
        console.log(card);
        console.log(cat);
        addChildren('cat',cat)
      })
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
  addChildren('add_pet')
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
  form.addEventListener("submit", async (e) => {
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
    console.log(body);
    await api
      .addCat(body)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          form.reset();
          closePopupForm.click();
        } else {
          console.log(data);
        }
      });

    getCats(api);
  });
}

const getCats = async function (api) {
  await api
    .getCats()
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "ok") {
        updCards(data.data);
      }
    });
};
getCats(api);

function addChildren(namePopup, cat={}) {
    if (namePopup == 'add_pet') {
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
        <h4>Котики ждут!</h4>`
  }
  if (namePopup == "delete") {
    form_inner.innerHTML = `<h2>Вы уверены?</h2>
      <h4>Удалить котика?</h4>
      <form action="">
        <button class="confirm_delete" type="submit">Да</button>
        <button class="confirm_return">Нет</button>
      </form>`;
      let returnBtn = document.querySelector('.confirm_return')
        returnBtn.addEventListener('click', () => {
          addChildren('cat', cat)
        })
        let deleteConfirm = document.querySelector('.confirm_delete')
        deleteConfirm.addEventListener('click', () => {
          formDeleteListener(cat)
        })
  }
  if (namePopup == "cat") {
    form_inner.innerHTML = `<div class="cat_name"><h2>${cat.name}</h2><div class="btn delete"><i class="fa-solid fa-trash"></i></div></div>
        ${cat.age ? `<p>Возраст: ${cat.age}</p>` : ''}
        ${cat.rate ? `<p>Рейтинг: ${cat.rate}</p>` : ''}
        ${cat.description ? `<p>Описание: ${cat.description}</p>` : ''}
        ${cat.favourite ? `<p>Любимый</p>` : ''}
        `;
        let deleteBtn = document.querySelector('.delete')
        deleteBtn.addEventListener('click', () => {
          addChildren('delete', cat)
        })
  }
  if (!popupForm.classList.contains("active")) {
    popupForm.classList.add("active");
    popupForm.parentElement.classList.add("active");
  }
}


function formDeleteListener(cat) {
  let form = document.forms[0];
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await api
      .delCat(cat.id)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          form.reset();
          closePopupForm.click();
        } else {
          console.log(data);
        }
      });
    getCats(api);
  });
}
