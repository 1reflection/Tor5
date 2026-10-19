function addDetail(container, label, value) {
  const paragraph = document.createElement("p");
  paragraph.textContent = `${label}:${value}`;
  container.appendChild(paragraph);
}

function showError(statusElement, error) {
  statusElement.textContent = `Load failed ${error.message}`;
  statusElement.classList.add("error");
  console.error(error);
}

function loadBooks() {
  const status = document.getElementById("books-status");
  const tableBody = document.getElementById("books-body");

  fetch("./book.xml")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.text();
    })
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      if (xmlDoc.querySelector("parsererror")) {
        throw new Error("XML error format,please check label and special characters");
      }

      const books = xmlDoc.querySelectorAll("book");

      tableBody.replaceChildren();

      books.forEach(book => {
        const row = document.createElement("tr");

        const values = [
          book.getAttribute("id"),
          book.querySelector("title").textContent,
          book.querySelector("author").textContent,
          book.querySelector("price").textContent
        ];

        values.forEach(value => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        });

        tableBody.appendChild(row);
      });

      status.textContent = `load successfully ${books.length} books`;
    })
    .catch(error => {
      showError(status, error);
    });
}

function loadUsers() {
  const status = document.getElementById("users-status");
  const usersList = document.getElementById("users-list");

  fetch("./userProfiles.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data.users)) {
        throw new Error("JSON 's users must bu array");
      }

      usersList.replaceChildren();

      data.users.forEach(user => {
        const profile = user.profile;
        const preferences = user.preferences;
        const address = profile.address;

        const card = document.createElement("article");
        card.className = "profile-card";

        const heading = document.createElement("h3");
        heading.textContent =
          `${profile.firstName} ${profile.lastName}`;
        card.appendChild(heading);

        addDetail(card, "name", profile.firstName);
        addDetail(card, "Family name", profile.lastName);
        addDetail(card, "Email", profile.email);
        addDetail(card, "Birthday", profile.dateOfBirth);

        addDetail(card, "Street", address.street);
        addDetail(card, "City", address.city);
        addDetail(card, "area", address.state);
        addDetail(card, "postcode", address.zipCode);

        addDetail(card, "theme", preferences.theme);
        addDetail(card, "language", preferences.language);
        addDetail(
          card,
          "notification",
          preferences.notifications ? "open" : "close"
        );
        addDetail(
          card,
          "Newsletter subscription",
          preferences.subscription ? "yes" : "no"
        );

        usersList.appendChild(card);
      });

      status.textContent =
        `successful loading ${data.users.length} users profile`;
    })
    .catch(error => {
      showError(status, error);
    });
}

loadBooks();
loadUsers();