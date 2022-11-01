const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

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

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">Arpit <span>9:15pm</span></p>
    <p class="text">
      ${message}
    </p>
  `;

  document.querySelector(".chat-messages").appendChild(div);
}
