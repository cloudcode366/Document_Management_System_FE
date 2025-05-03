// import $ from "jquery";
// import "signalr";

// const DEFAULT_URL = "http://localhost:8080/signalr";

// let connection = null;
// let proxy = null;

// export const startConnection = (userName = "user", customUrl = DEFAULT_URL) => {
//   return new Promise((resolve, reject) => {
//     if (connection) {
//       console.warn("⚠️ SignalR connection already exists.");
//       return resolve();
//     }

//     connection = $.hubConnection(customUrl);
//     proxy = connection.createHubProxy("hubs");

//     // Đăng ký sự kiện
//     proxy.on("ReceiveSignatureResult", (data) => {
//       if (typeof onSignatureResultCallback === "function") {
//         onSignatureResultCallback(data);
//       }
//     });

//     proxy.on("ReceiveMessage", (message) => {
//       if (typeof onMessageCallback === "function") {
//         onMessageCallback(message);
//       }
//     });

//     connection
//       .start()
//       .done(() => {
//         console.log("✅ Legacy SignalR connected.");
//         resolve();
//       })
//       .fail((err) => {
//         console.error("❌ Legacy SignalR Connection Error:", err);
//         reject(err);
//       });
//   });
// };

// export const stopConnection = () => {
//   if (connection) {
//     connection.stop();
//     console.log("🛑 Legacy SignalR Disconnected");
//     connection = null;
//     proxy = null;
//   }
// };

// let onSignatureResultCallback = null;
// let onMessageCallback = null;

// export const onReceiveSignatureResult = (callback) => {
//   onSignatureResultCallback = callback;
// };

// export const onReceiveMessage = (callback) => {
//   onMessageCallback = callback;
// };

// export const sendSignaturePosition = (signatureRequest) => {
//   if (!proxy) {
//     console.error("❌ Cannot send: SignalR proxy not ready.");
//     return;
//   }

//   proxy.invoke("SendSignaturePosition", signatureRequest).fail((err) => {
//     console.error("❌ SendSignaturePosition Error:", err);
//   });
// };
