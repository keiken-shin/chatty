const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const usersList = document.querySelector("#users");
const userNav = document.querySelector(".users-nav");
const sidebar = document.querySelector(".chat-sidebar");

// user nav event
function toggleUserNav(e) {
  if (e.target.dataset.toggle === "false") {
    userNav.setAttribute("data-toggle", "true");
    sidebar.style = "display: block";
  } else {
    userNav.setAttribute("data-toggle", "false");
    sidebar.style = "display: none";
  }
}

userNav.addEventListener("click", toggleUserNav);

// Get username & room from URL
const { username, room } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Bot Message from server
socket.on("botMessage", (message) => {
  outputBotMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message, username);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", messageSubmission);

function messageSubmission(e) {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emitting a message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
}

// Output bot message to DOM
function outputBotMessage(message) {
  const div = document.createElement("div");
  div.classList.add("bot-message");
  div.innerHTML = `
    <p class="text">
      ${message.text}
    </p>
  `;

  document.querySelector(".chat-messages").appendChild(div);
}

// Output message to DOM
function outputMessage(message, username) {
  const div = document.createElement("div");
  div.classList.add("message");

  if (username === message.username) {
    div.classList.add("my-message");
  }

  div.innerHTML = `
    <p class="meta">${message.username}</p>
    <p class="text">
      ${message.text}
      <span class="time">${message.time}</span>
    </p>
  `;

  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = `#${room}`;
}

// Add users to DOM
function outputUsers(users) {
  usersList.innerHTML = `
    ${users
      .map(
        (user) =>
          `<li class="user-item">
            <span class="avatar">${user.username.split("")[0]}</span>
            <span>${user.username}</span>
          </li>`
      )
      .join("")}
  `;
}
