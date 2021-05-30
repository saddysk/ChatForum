// const socket = io("http://localhost:8000", {
const socket = io("http://13.233.118.146:8000", {
  transports: ["websocket"],
});

const form = document.getElementById("message-container");
const inputMessage = document.getElementById("message-input");
const chatContainer = document.querySelector(".container");

const append = (username, message) => {
  let time = new Date().toLocaleString().replace(",", "").replace(/:.. /, " ");
  let html = `
    <span class="user">${username}: </span><span class="timestamp">${time}</span>
    <p class="textMessage">${message}</p>
  `;
  const chatElement = document.createElement("div");
  chatElement.innerHTML = html;
  chatElement.classList.add("message");
  chatContainer.appendChild(chatElement);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = inputMessage.value;
  const isMessageValid = message.replace(/\s+/, "");
  if (isMessageValid !== "") {
    socket.emit("send", message);
    append("You", message);
  }
  inputMessage.value = "";
});

const username = prompt("Enter your name to join");
socket.emit("new-user-joined", username);

socket.on("user-joined", (username) => {
  append(username, "Joined the chat");
});

socket.on("receive", (data) => {
  append(data.username, data.message);
});

socket.on("hasLeft", (username) => {
  append(username, "Left the chat");
});
