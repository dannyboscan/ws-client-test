import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (accessToken: string) => {
  // http://localhost:9000/socket.io/socket.io.js

  const manager = new Manager("http://localhost:9000/socket.io/socket.io.js", {
    extraHeaders: {
      accessToken: accessToken,
      Authorization: accessToken,
    },
  });

  socket?.removeAllListeners();

  socket = manager.socket("/messages");

  addListener();
};

const addListener = () => {
  const serverStatusLabel =
    document.querySelector<HTMLDivElement>("#server-status");
  const message = document.querySelector<HTMLInputElement>("#message");
  const messageForm = document.querySelector<HTMLFormElement>("#message-form");
  const listMessage = document.querySelector<HTMLDivElement>("#list-message");
  const disconnectBtn =
    document.querySelector<HTMLButtonElement>("#disconnect")!;
  const connectBtn = document.querySelector<HTMLButtonElement>("#connect")!;

  socket.on("connect", () => {
    if (serverStatusLabel)
      serverStatusLabel.innerHTML =
        '<i id="server-status" class="fa-regular fa-circle-dot green"></i> <strong>Online</strong>';
  });

  socket.on("disconnect", () => {
    if (serverStatusLabel)
      serverStatusLabel.innerHTML =
        '<i id="server-status" class="fa-regular fa-circle-dot red"></i> <strong>Offline</strong>';
  });

  socket.on("clients_updated", (clients: string[]) => {
    let clientsHtml: string = "";

    clients.forEach((client) => {
      clientsHtml += `<div><i class="fa-solid fa-tower-broadcast fa-fw fa-heart fa-beat blue"></i>&nbsp; ${client}</div>`;
    });

    const listCLientEle = document.querySelector("#list-client");

    if (listCLientEle) listCLientEle.innerHTML = clientsHtml;
  });

  socket.on(
    "server_message",
    (payload: { fullName: string; message: string }) => {
      if (!listMessage) return;

      listMessage.insertAdjacentHTML(
        "beforeend",
        `<div class="message"><span class="user-message">${payload.fullName}</span> ${payload.message}</div>`
      );
      window.scrollTo(0, document.body.scrollHeight);
    }
  );

  if (messageForm && message) {
    messageForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const messageValue = message.value.trim();
      if (messageValue.length === 0) return;

      socket.emit("client_message", {
        message: messageValue,
      });

      message.value = "";
    });
  }

  disconnectBtn.addEventListener("click", () => {
    socket.disconnect();
    connectBtn.removeAttribute("disabled");
    disconnectBtn.setAttribute("disabled", "");
    document.querySelector("#list-client")!.innerHTML = "";
    listMessage!.innerHTML = "";
  });
};
