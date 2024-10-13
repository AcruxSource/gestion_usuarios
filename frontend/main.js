const addBtn = document.getElementById("add");
const createBtn = document.getElementById("create");
const tbody = document.getElementById("userListBody");
const deleteBtn = document.getElementById("deleteBtn");
let lastElementWithFocus = null;
let user = {}; //model

updateTable();

addBtn.addEventListener("click", async (ev) => {
  try {
    const response = await fetch("https://randomuser.me/api");
    const data = await response.json();
    if (response.ok) {
      user = generateUser(data.results[0]);
      document.getElementById("imagen").src = user.imagen;
      const inputs = getChildElements();
      inputs.map((element) => (element.value = user[element.id]));
    }
  } catch (error) {
    console.error(error.massage);
  }
});

createBtn.addEventListener("click", async (ev) => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      const data = await response.json();
      showInfo(data.message);
      addRowTable(user);
    } else {
      const data = await response.json();
      showInfo(data.error);
    }
  } catch (error) {
    console.log(error.message);
  }
});

deleteBtn.addEventListener("click", async () => {
  const email = lastElementWithFocus.lastChild.textContent;
  if (lastElementWithFocus !== null) {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      if (response.ok) {
        const data = await response.json();
        showInfo(data.message);
        lastElementWithFocus.remove();
      } else {
        const data = await response.json();
        showInfo(data.error);
      }
    } catch {
      console.log(error.message);
    }
  }
});

tbody.addEventListener("click", (ev) => {
  const rows = tbody.children;
  Array.from(rows, (element) => {
    element.classList.remove("selected");
  });
  lastElementWithFocus = ev.target.parentNode;
  lastElementWithFocus.classList.add("selected");
});

function generateUser({ name, location, email, dob, picture }) {
  //model
  return {
    nombre: name.first,
    apellido: name.last,
    edad: dob.age,
    pais: location.country,
    ciudad: location.city,
    email: email,
    imagen: picture.large,
  };
}

function getChildElements() {
  const form = document.getElementById("create-Form");
  const inputs = [...form.children].filter(
    (element) => element.tagName.toLowerCase() === "input"
  );
  return inputs;
}

function addRowTable(userObj) {
  const tr = document.createElement("tr");
  ["nombre", "apellido", "edad", "pais", "ciudad", "email"].map((key) => {
    const td = document.createElement("td");
    td.textContent = userObj[key];
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
}

async function updateTable() {
  try {
    const response = await fetch("http://localhost:3000/users");
    if (response.ok) {
      const { rows } = await response.json();
      Object.values(rows).map((userObj) => {
        addRowTable(userObj);
        showInfo(message);
      });
    } else {
      const { message } = await response.json();
      showInfo(message);
    }
  } catch (error) {
    console.error(error.message);
  }
}

function showInfo(message) {
  const span = document.getElementsByTagName("span")[0];
  span.style.display = "block";
  span.textContent = message;
  setTimeout(() => {
    span.style.display = "none";
  }, 1000);
}
