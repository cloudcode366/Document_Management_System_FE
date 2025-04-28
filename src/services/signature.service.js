import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const url = "http://localhost:5000/signatureHub"; // URL của Windows Service

const connection = new HubConnectionBuilder()
  .withUrl(url)
  .configureLogging(LogLevel.Information)
  .build();

// Khởi tạo kết nối
export const startConnection = async () => {
  try {
    if (connection.state === "Disconnected") {
      await connection.start();
      console.log("SignalR Connected!");
    }
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
    // Thử kết nối lại sau 5 giây
    setTimeout(startConnection, 5000);
  }
};

// Nhận thông báo trạng thái
export const onReceiveMessage = (callback) => {
  connection.on("ReceiveMessage", (message) => {
    callback(message);
  });
};

// Nhận kết quả ký số
export const onReceiveSignatureResult = (callback) => {
  connection.on("ReceiveSignatureResult", (documentId, result) => {
    callback(documentId, result);
  });
};

// Gửi vị trí chữ ký
export const sendSignaturePosition = async (reqSignature) => {
  try {
    await connection.invoke(reqSignature);
  } catch (err) {
    console.error("Send Signature Position Error: ", err);
  }
};

// Đóng kết nối (nếu cần)
export const stopConnection = async () => {
  try {
    await connection.stop();
    console.log("SignalR Disconnected!");
  } catch (err) {
    console.error("Stop Connection Error: ", err);
  }
};
