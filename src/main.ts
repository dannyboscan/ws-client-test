import { connectToServer } from "./socket-client";
import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>WebSocket Cliente</h1>

    <section id="jwt-section">
      <div>
        <textarea name="jwt" id="jwt" placeholder="token" rows="4"></textarea>
      </div>
      <button id="connect">Connect</button>
      <button id="disconnect" disabled>Disconnect</button>
    </section>

    <div class="card">
      <div id="server-status">
        <i id="server-status" class="fa-regular fa-circle-dot red"></i> <strong>Offline</strong>
      </div>
      <div id="list-client"></div>
    </div>

    <div class="card">
      <h3>Chat</h3>
      <section id="list-message">
      </section>
    </div>

    <section id="form-section">
      <form id="message-form">
        <label for="message">Message</label>
        <input
          type="text"
          id="message"
          name="message"
          autocomplete="off"
          placeholder="write your message"
        />
      </form>
    </section>
  </div>
`;

const jwt = document.querySelector<HTMLTextAreaElement>("#jwt")!;
const connectBtn = document.querySelector<HTMLButtonElement>("#connect")!;
const disconnectBtn = document.querySelector<HTMLButtonElement>("#disconnect")!;

connectBtn.addEventListener("click", () => {
  const accessToken = jwt.value.trim();

  if (accessToken.length === 0) return alert("Please enter a valid JWT");
  fetch("http://localhost:9000/api/auth/status/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response: any) => {
      if (!response.ok)
        throw new Error("Network response was not ok, " + response.statusText);

      return response.json();
    })
    .then((data) => {
      console.log({ data });
      if (data.isActive) {
        jwt.value = data.accessToken;
        connectBtn.setAttribute("disabled", "");
        disconnectBtn.removeAttribute("disabled");
        connectToServer(data.accessToken);
      }
    })
    .catch((error) => {
      alert(error.message);
      console.error("There was a problem with your fetch operation:", error);
    });
});

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
