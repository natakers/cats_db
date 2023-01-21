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
      let card = `<div class="${
        cat.favourite ? "card like" : "card"
      }" style="background-image:
  url(${cat.img_link || "images/cat.jpg"})">
  <span>${cat.name}</span>
  </div>`;
      main.innerHTML += card;
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
  if (!popupForm.classList.contains("active")) {
    popupForm.classList.add("active");
    popupForm.parentElement.classList.add("active");
  }
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

function addChildren(namePopup) {
  console.log('s');
    if (namePopup == 'add_pet') {
      console.log('f');
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
      </form>`
       formAddListener()
    }

  }