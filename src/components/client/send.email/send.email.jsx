import React, { useState, useEffect } from "react";
import { Input, Button, Select, message } from "antd";
import {
  PaperClipOutlined,
  SendOutlined,
  AlignLeftOutlined,
  LinkOutlined,
  FontSizeOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { createSendEmailAPI } from "@/services/api.service";

const SendEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailForm, setEmailForm] = useState({
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    content: "",
  });
  const [errors, setErrors] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Hàm kiểm tra định dạng email
  const isValidEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Xử lý query params từ URL (authorization code)
  useEffect(() => {
    console.log("useEffect chạy với location.search:", location.search);
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get("code");
    const error = queryParams.get("error");

    if (authCode) {
      console.log("✅ Authorization Code:", authCode);
      localStorage.setItem("token", authCode);
      console.log("🔄 Gửi code này lên server để đổi access token...");
    } else if (error) {
      console.error("❌ Lỗi:", error);
      message.error("❌ Lỗi khi đăng nhập: " + error);
    }
  }, [location.search]);

  // Hàm kiểm tra danh sách email (cho cc, bcc)
  const validateAndFilterEmails = (emails, fieldName) => {
    const validEmails = [];
    let errorMessage = "";

    // Nếu emails rỗng, không cần kiểm tra
    if (!emails || emails.length === 0) {
      return { validEmails, errorMessage };
    }

    for (let email of emails) {
      if (!isValidEmail(email)) {
        errorMessage = `Email không đúng định dạng`;
      } else {
        validEmails.push(email);
      }
    }

    return { validEmails, errorMessage };
  };

  // Hàm xử lý khi thay đổi giá trị
  const handleEmailChange = (field, value) => {
    // if (field === "to") {
    //   const errorMessage = isValidEmail(value)
    //     ? ""
    //     : "Email không đúng định dạng";
    //   setEmailForm({ ...emailForm, [field]: value });
    //   setErrors({ ...errors, [field]: errorMessage });
    // } else {
    const fieldNames = { to: "to", cc: "CC", bcc: "BCC" };
    const { validEmails, errorMessage } = validateAndFilterEmails(
      value,
      fieldNames[field]
    );
    setEmailForm({ ...emailForm, [field]: validEmails });
    setErrors({ ...errors, [field]: errorMessage });
    // }
  };

  // Hàm kiểm tra các trường bắt buộc
  const validateRequiredFields = () => {
    const newErrors = { ...errors };

    if (!emailForm.to) {
      newErrors.to = "Trường Đến không được để trống";
    } else if (!newErrors.to) {
      newErrors.to = "";
    }

    if (!emailForm.subject) {
      newErrors.subject = "Trường Tiêu đề không được để trống";
    } else {
      newErrors.subject = "";
    }

    if (!emailForm.content) {
      newErrors.content = "Trường Nội dung không được để trống";
    } else {
      newErrors.content = "";
    }

    setErrors(newErrors);
    return !newErrors.to && !newErrors.subject && !newErrors.content;
  };

  // Hàm gửi email
  const handleSendEmail = async () => {
    // Kiểm tra các trường bắt buộc
    const isValid = validateRequiredFields();
    if (!isValid) {
      return;
    }

    // Kiểm tra lỗi định dạng email cho 'to' (bắt buộc)
    if (errors.to) {
      message.error("Vui lòng sửa email người nhận không hợp lệ!");
      return;
    }

    // Kiểm tra lỗi định dạng email cho 'cc' và 'bcc' (nếu có dữ liệu)
    if (errors.cc || errors.bcc) {
      message.error("Vui lòng sửa các email CC hoặc BCC không hợp lệ!");
      return;
    }

    // Lấy accessToken và documentId từ localStorage
    const accessToken = localStorage.getItem("token");
    const documentId = localStorage.getItem("documentId");

    // Kiểm tra accessToken và documentId
    if (!accessToken || !documentId) {
      message.error("Thiếu accessToken hoặc documentId!");
      return;
    }

    // Chuẩn bị dữ liệu cho API
    const emailData = {
      receiverEmail: emailForm.to,
      ccEmails: emailForm.cc, // Có thể là mảng rỗng
      bccEmails: emailForm.bcc, // Có thể là mảng rỗng
      subject: emailForm.subject,
      body: emailForm.content,
      accessToken: accessToken,
      documentId: documentId,
    };

    try {
      setIsLoading(true);
      const res = await createSendEmailAPI(emailData);
      if (res.data.statusCode === 200) {
        message.success("Email đã được gửi thành công!");
        //navigate("/archived-document");
        navigate("/detail-archived-document", {
          state: {
            documentId: documentId, // truyền documentId
          },
        });
      } else {
        message.error("Gửi email không thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra khi gửi email!";
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEmailForm({
      to: [],
      cc: [],
      bcc: [],
      subject: "",
      content: "",
    });
    setErrors({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      content: "",
    });
    navigate("/archived-document");
  };

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
          borderRadius: "10px",
          marginTop: "20px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 40px)",
        }}
      >
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h2 style={{ fontSize: 24, margin: 0, color: "#1a1a1a" }}>
              Gửi Email
            </h2>
            <Button
              onClick={handleCancel}
              style={{ borderRadius: 4, color: "#5f6368" }}
            >
              Hủy
            </Button>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, color: "#5f6368" }}>
                {localStorage.getItem("documentName")}
              </span>
              <PaperClipOutlined style={{ color: "#fa8c16" }} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                color: "#5f6368",
                fontWeight: 500,
              }}
            >
              Đến
            </label>
            {errors.to && (
              <div style={{ color: "red", fontSize: 12, marginBottom: 4 }}>
                {errors.to}
              </div>
            )}
            {/* <Input
              placeholder="Nhập email người nhận"
              value={emailForm.to}
              onChange={(e) => handleEmailChange("to", e.target.value)}
              style={{ width: "100%", borderRadius: 4 }}
            /> */}
            <Select
              mode="tags"
              placeholder="Nhập email người nhận"
              value={emailForm.to}
              onChange={(value) => handleEmailChange("to", value)}
              style={{ width: "100%" }}
              tokenSeparators={[","]}
              showSearch
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                color: "#5f6368",
                fontWeight: 500,
              }}
            >
              CC
            </label>
            {errors.cc && (
              <div style={{ color: "red", fontSize: 12, marginBottom: 4 }}>
                {errors.cc}
              </div>
            )}
            <Select
              mode="tags"
              placeholder="Chọn hoặc nhập email CC"
              value={emailForm.cc}
              onChange={(value) => handleEmailChange("cc", value)}
              style={{ width: "100%" }}
              tokenSeparators={[","]}
              showSearch
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                color: "#5f6368",
                fontWeight: 500,
              }}
            >
              BCC
            </label>
            {errors.bcc && (
              <div style={{ color: "red", fontSize: 12, marginBottom: 4 }}>
                {errors.bcc}
              </div>
            )}
            <Select
              mode="tags"
              placeholder="Chọn hoặc nhập email BCC"
              value={emailForm.bcc}
              onChange={(value) => handleEmailChange("bcc", value)}
              style={{ width: "100%" }}
              tokenSeparators={[","]}
              showSearch
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                color: "#5f6368",
                fontWeight: 500,
              }}
            >
              Tiêu đề
            </label>
            {errors.subject && (
              <div style={{ color: "red", fontSize: 12, marginBottom: 4 }}>
                {errors.subject}
              </div>
            )}
            <Input
              value={emailForm.subject}
              onChange={(e) =>
                setEmailForm({ ...emailForm, subject: e.target.value })
              }
              placeholder="Nhập tiêu đề email"
              style={{ borderRadius: 4 }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                color: "#5f6368",
                fontWeight: 500,
              }}
            >
              Nội dung
            </label>
            {errors.content && (
              <div style={{ color: "red", fontSize: 12, marginBottom: 4 }}>
                {errors.content}
              </div>
            )}
            <Input.TextArea
              value={emailForm.content}
              onChange={(e) =>
                setEmailForm({ ...emailForm, content: e.target.value })
              }
              rows={6}
              placeholder="Nhập nội dung email"
              style={{ borderRadius: 4 }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendEmail}
              loading={isLoading}
              style={{
                background: "#fa8c16",
                borderColor: "#fa8c16",
                borderRadius: 4,
              }}
            >
              Gửi
            </Button>
            <AlignLeftOutlined style={{ color: "#5f6368" }} />
            <LinkOutlined style={{ color: "#5f6368" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <FontSizeOutlined style={{ color: "#5f6368" }} />
              <span style={{ color: "#5f6368" }}>10 px</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#ff4d4f",
              }}
            >
              <span style={{ borderBottom: "2px solid #ff4d4f" }}>A</span>
            </div>
            <PictureOutlined style={{ color: "#5f6368" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailPage;
