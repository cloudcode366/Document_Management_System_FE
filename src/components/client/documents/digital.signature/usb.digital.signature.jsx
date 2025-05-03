import React, { useState, useEffect, useCallback, useRef } from "react";
import { App, Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { createHandleTaskActionAPI } from "@/services/api.service";
import { useCurrentApp } from "@/components/context/app.context";

import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/signalr.js/2.4.2/jquery.signalR.min.js";
const $ = (window.jQuery = window.$);

const USBDigitalSignatureModal = ({
  openUSBDigitalSignatureModal,
  setOpenUSBDigitalSignatureModal,
  USBReq,
  setUSBReq,
  taskId,
  documentId,
}) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [signatureResult, setSignatureResult] = useState(null);
  const navigate = useNavigate();
  const connectionRef = useRef(null);
  const mountedRef = useRef(false);
  const { user } = useCurrentApp();
  const { notification, message } = App.useApp();

  const appendMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { id: Date.now(), text }]);
  }, []);

  const initializeSignalR = useCallback(async () => {
    try {
      if (!window.jQuery) {
        throw new Error("jQuery không sẵn sàng.");
      }
      appendMessage("jQuery đã sẵn sàng.");

      // Kiểm tra SignalR
      if (!window.jQuery.hubConnection) {
        throw new Error("SignalR client không được tải đúng cách.");
      }

      // Tải hub proxy từ server
      const script = document.createElement("script");
      script.src = "http://localhost:3979/signalr/hubs";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => appendMessage("Đã tải hub proxy thành công.");
      script.onerror = () => {
        throw new Error("Không thể tải hub proxy.");
      };

      // Chờ một chút để đảm bảo hub proxy được tải
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Khởi tạo kết nối SignalR
      const connection = window.jQuery.hubConnection(
        "http://localhost:3979/signalr/hubs"
      );
      const proxy = connection.createHubProxy("simpleHub");

      connectionRef.current = { connection, proxy };

      // Đăng ký sự kiện từ server
      proxy.on("addMessage", (name, message) => {
        if (mountedRef.current) {
          appendMessage(`[Server] ${name}: ${message}`);
          // Xử lý kết quả ký từ thông điệp
          handleSignatureResultFromMessage(message);
        }
      });

      // Xử lý lỗi kết nối
      connection.error((err) => {
        if (mountedRef.current) {
          appendMessage(`❌ Lỗi kết nối SignalR: ${err}`);
          message.error("Lỗi kết nối với ứng dụng ký.");
          setLoading(false);
        }
      });

      // Xử lý ngắt kết nối
      connection.disconnected(() => {
        if (mountedRef.current) {
          appendMessage("❌ Đã ngắt kết nối SignalR.");
        }
      });

      // Bắt đầu kết nối
      await connection
        .start()
        .done(() => {
          appendMessage("✅ Kết nối SignalR thành công.");
          proxy.invoke("setUserName", "user");
        })
        .fail((err) => {
          throw new Error(`Không thể kết nối SignalR: ${err}`);
        });
    } catch (err) {
      appendMessage(`❌ Lỗi khởi tạo SignalR: ${err.message}`);
      message.error("Không thể khởi tạo kết nối.");
      setLoading(false);
      throw err;
    }
  }, [appendMessage]);

  const stopConnection = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.connection.stop();
      appendMessage("Đã ngắt kết nối SignalR.");
      connectionRef.current = null;
    }
  }, [appendMessage]);

  const sendSignatureRequest = useCallback(
    (usbReqData) => {
      if (!connectionRef.current) {
        throw new Error("Không có kết nối SignalR.");
      }
      return connectionRef.current.proxy
        .invoke("send", usbReqData)
        .done(() => {
          appendMessage("Đã gửi yêu cầu ký đến ứng dụng desktop.");
        })
        .fail((err) => {
          throw new Error(`Gửi yêu cầu ký thất bại: ${err}`);
        });
    },
    [appendMessage]
  );

  const handleSignatureResultFromMessage = useCallback(
    async (message) => {
      // Kiểm tra xem message có phải là kết quả ký không
      let parsedResult;
      try {
        parsedResult = JSON.parse(message);
      } catch (e) {
        appendMessage(
          "Không thể chuyển đổi vị trí chữ ký từ object thành dạng string."
        );
        return;
      }

      setLoading(false);
      setSignatureResult(parsedResult);

      if (parsedResult?.StatusCode === 200) {
        appendMessage("✅ Ký thành công.");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const res = await createHandleTaskActionAPI(
          taskId,
          user.userId,
          "SubmitDocument"
        );
        if (res?.data?.statusCode === 200) {
          navigate(`/detail-document/${documentId}`);
          setOpenUSBDigitalSignatureModal(false);
          setUSBReq(null);
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra!",
            description: res?.data?.content,
          });
        }
      } else {
        const msg = parsedResult?.Message || "Không rõ lý do";
        appendMessage(`❌ Ký thất bại: ${msg}`);
        message.error(`Ký thất bại: ${msg}`);
      }
    },
    [
      USBReq,
      navigate,
      appendMessage,
      setOpenUSBDigitalSignatureModal,
      setUSBReq,
    ]
  );

  const handleSendSignature = useCallback(async () => {
    if (!USBReq) {
      appendMessage("❌ Lỗi: Dữ liệu ký không hợp lệ.");
      message.error("Dữ liệu ký không hợp lệ.");
      return;
    }

    setLoading(true);
    appendMessage("Đang gửi yêu cầu ký...");

    try {
      await sendSignatureRequest(JSON.stringify(USBReq));
      appendMessage("Đang chờ kết quả từ ứng dụng ký...");
    } catch (err) {
      appendMessage(`❌ Lỗi: ${err.message}`);
      message.error("Gửi yêu cầu ký thất bại.");
      setLoading(false);
    }
  }, [USBReq, appendMessage, sendSignatureRequest]);

  useEffect(() => {
    if (!openUSBDigitalSignatureModal) return;

    mountedRef.current = true;

    const init = async () => {
      try {
        await initializeSignalR();
        await handleSendSignature();
      } catch (err) {
        setLoading(false);
      }
    };

    init();

    return () => {
      mountedRef.current = false;
      stopConnection();
      setMessages([]);
      setSignatureResult(null);
    };
  }, [
    openUSBDigitalSignatureModal,
    handleSendSignature,
    initializeSignalR,
    stopConnection,
  ]);

  return (
    <Modal
      title="Quá trình ký số USB"
      open={openUSBDigitalSignatureModal}
      onCancel={() => setOpenUSBDigitalSignatureModal(false)}
      footer={null}
      width={600}
      maskClosable={false}
    >
      <div style={{ padding: 20 }}>
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
            <strong>Thông báo:</strong>
          </p>
          {messages.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  style={{
                    marginBottom: 8,
                    color: msg.text.includes("❌") ? "red" : "black",
                  }}
                >
                  {msg.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có thông báo.</p>
          )}
        </div>

        {signatureResult && (
          <div style={{ border: "1px solid #d9d9d9", padding: 16 }}>
            <p>
              <strong>Kết quả ký:</strong>
            </p>
            {signatureResult.StatusCode === 200 && (
              <p style={{ color: "green" }}>
                ✅ Ký thành công tài liệu: {USBReq?.documentId}
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default USBDigitalSignatureModal;
