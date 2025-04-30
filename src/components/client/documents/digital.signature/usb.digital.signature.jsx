import React, { useState, useEffect } from "react";
import { Modal, Spin, message } from "antd";
import {
  onReceiveMessage,
  onReceiveSignatureResult,
  sendSignaturePosition,
  startConnection,
  stopConnection,
} from "@/services/signature.service";

const USBDigitalSignatureModal = (props) => {
  const {
    openUSBDigitalSignatureModal,
    setOpenUSBDigitalSignatureModal,
    USBReq, // đã bao gồm các field cần có là (token, documentId, llx, lly, urx, ury, page)
    setUSBReq,
    taskId,
  } = props;

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [signatureResult, setSignatureResult] = useState(null);

  useEffect(() => {
    if (openUSBDigitalSignatureModal) {
      startConnection(); // Khởi tạo kết nối SignalR

      // Nhận thông báo trạng thái
      onReceiveMessage((msg) => {
        setMessages((prev) => [...prev, { id: Date.now(), text: msg }]);
      });

      // Nhận kết quả ký số
      onReceiveSignatureResult((receivedTaskId, result) => {
        setLoading(false); // Tắt loading
        setSignatureResult(result); // Lưu kết quả
        // setUSBReq({ ...USBReq, result }); // Gửi kết quả về component cha qua setUSBReq

        // Hiển thị thông báo Ant Design
        if (result.Status === "Success") {
          message.success(`Ký thành công tài liệu ${receivedTaskId}!`);
        } else {
          message.error(`Ký thất bại: ${result.ErrorMessage}`);
        }
      });

      // Gửi vị trí chữ ký
      handleSendSignaturePosition();

      return () => {
        stopConnection(); // Ngắt kết nối khi modal đóng
      };
    }
  }, [openUSBDigitalSignatureModal, taskId, USBReq, setUSBReq]);

  const handleSendSignaturePosition = async () => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: "Sending signature position..." },
    ]);
    try {
      if (!USBReq || (USBReq.x === 0 && USBReq.y === 0)) {
        throw new Error("Invalid signature position");
      }
      await sendSignaturePosition(USBReq);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Signature position sent. Waiting for response...",
        },
      ]);
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: `Error: ${err.message}` },
      ]);
      message.error("Lỗi khi kết nối với server");
      console.error("Error:", err);
    }
  };

  return (
    <Modal
      title="USB Digital Signature Process"
      open={openUSBDigitalSignatureModal}
      onCancel={() => setOpenUSBDigitalSignatureModal(false)}
      footer={null}
      width={600}
    >
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <p>
            <strong>Signature Position:</strong>
          </p>
          <p>
            X: {USBReq?.x || 0}, Y: {USBReq?.y || 0}, Page: {USBReq?.page || 1}
          </p>
        </div>
        {loading && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Spin size="large" />
            <p>Đang xử lý...</p>
          </div>
        )}
        <div
          style={{
            border: "1px solid #d9d9d9",
            padding: 16,
            maxHeight: 150,
            overflowY: "auto",
            marginBottom: 16,
          }}
        >
          <p>
            <strong>Messages:</strong>
          </p>
          {messages.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  style={{
                    marginBottom: 8,
                    color: msg.text.includes("Error") ? "red" : "black",
                  }}
                >
                  {msg.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
        {signatureResult && (
          <div style={{ border: "1px solid #d9d9d9", padding: 16 }}>
            <p>
              <strong>Kết quả ký:</strong>
            </p>
            {signatureResult.Status === "Success" ? (
              <div>
                <p style={{ color: "green" }}>
                  ✅ Ký thành công tài liệu: {signatureResult.TaskId}
                </p>
                {signatureResult.SignedFileUrl && (
                  <a
                    href={signatureResult.SignedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1890ff" }}
                  >
                    Tải file đã ký
                  </a>
                )}
              </div>
            ) : (
              <div>
                <p style={{ color: "red" }}>
                  ❌ Ký thất bại: {signatureResult.ErrorMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default USBDigitalSignatureModal;
