import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Divider,
  Input,
  Col,
  Row,
  Select,
  App,
  Modal,
  Tag,
} from "antd";
import {
  PaperClipOutlined,
  ArrowLeftOutlined,
  SendOutlined,
  AlignLeftOutlined,
  LinkOutlined,
  FontSizeOutlined,
  PictureOutlined,
  ShareAltOutlined,
  MailOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./view.detail.document.scss";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import { PiHandWithdraw } from "react-icons/pi";
import { BeatLoader } from "react-spinners";
import {
  viewAllUserAPI,
  viewArchivedDocumentDetailAPI,
} from "@/services/api.service";
import dayjs from "dayjs";
import PDFViewerWithToken from "@/components/pdf.viewer";
import axios from "axios";
import { useCurrentApp } from "@/components/context/app.context";

const CLIENT_ID =
  "574718261918-j6trtu7cd141fqc26nt436ipmicdaagf.apps.googleusercontent.com";
const SCOPE = "openid email https://mail.google.com/";
const REDIRECT_URI = window.location.origin + "/send-email";

const grantPermissionAPI = async (documentId, userIds) => {
  const urlBackend =
    "http://103.90.227.64:5290/api/UserDocPermission/create-grand-permission-for-document";
  return axios.post(urlBackend, {
    documentId,
    userIds,
  });
};

const ViewDetailArchivedDocument = () => {
  const location = useLocation();
  const documentId = location.state?.documentId;
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    from: [],
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    content: "",
  });
  const [accessToken, setAccessToken] = useState(null);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { user } = useCurrentApp();

  const loginWithGoogle = () => {
    localStorage.setItem("documentId", documentId);
    localStorage.setItem("documentName", document?.documentName || "");
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(SCOPE)}` +
      `&access_type=offline` +
      `&include_granted_scopes=true` +
      `&prompt=consent`;

    window.location.href = authUrl;
  };

  // const handleExchangeToken = async (code) => {
  //   try {
  //     const response = await fetch("https://oauth2.googleapis.com/token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: new URLSearchParams({
  //         code,
  //         client_id: CLIENT_ID,
  //         client_secret: "YOUR_CLIENT_SECRET", // Thay bằng client secret thực tế
  //         redirect_uri: REDIRECT_URI,
  //         grant_type: "authorization_code",
  //       }),
  //     });

  //     const data = await response.json();
  //     if (data.access_token) {
  //       setAccessToken(data.access_token);
  //       localStorage.setItem("googleToken", data.access_token);
  //       message.success("Đăng nhập Google thành công!");
  //       setOpenEmailModal(true);
  //     } else {
  //       throw new Error(data.error || "Không thể lấy access token");
  //     }
  //   } catch (error) {
  //     console.error("❌ Lỗi khi đổi token:", error);
  //     message.error("❌ Lỗi khi đổi token: " + error.message);
  //   }
  // };

  // Thêm logic từ window.onload để xử lý authorization code
  // useEffect(() => {
  //   console.log("useEffect chạy với location.search:", location.search);
  //   const queryParams = new URLSearchParams(location.search);
  //   const authCode = queryParams.get("code");
  //   const error = queryParams.get("error");

  //   if (authCode) {
  //     console.log("✅ Authorization Code:", authCode);
  //     console.log("🔄 Gửi code này lên server để đổi access token...");

  //     // handleExchangeToken(authCode)
  //     //   .then(() => {
  //     //     // Sau khi đổi token thành công, chuyển hướng để xóa code khỏi URL
  //     //     window.history.replaceState({}, document.title, REDIRECT_URI);
  //     //   })
  //     //   .catch((error) => {
  //     //     console.error("❌ Lỗi khi đổi token:", error);
  //     //     window.history.replaceState({}, document.title, REDIRECT_URI);
  //     //   });
  //   } else if (error) {
  //     console.error("❌ Lỗi:", error);
  //     message.error("❌ Lỗi khi đăng nhập: " + error);
  //     window.history.replaceState({}, document.title, REDIRECT_URI);
  //   }
  // }, [location.search]);

  useEffect(() => {
    const storedToken = localStorage.getItem("googleToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const handleOpenEmailModal = () => {
    if (!accessToken) {
      loginWithGoogle();
    } else {
      setOpenEmailModal(true);
    }
  };

  const handleSendEmail = () => {
    if (emailForm.to.length === 0 || !emailForm.subject || !emailForm.content) {
      message.warning(
        "Vui lòng điền đầy đủ thông tin bắt buộc (Đến, Tiêu đề, Nội dung)!"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidTo = emailForm.to.find((email) => !emailRegex.test(email));
    if (invalidTo) {
      message.warning(`Email trong "Đến" không hợp lệ: ${invalidTo}`);
      return;
    }
    const invalidCC = emailForm.cc.find((email) => !emailRegex.test(email));
    if (invalidCC) {
      message.warning(`Email trong "CC" không hợp lệ: ${invalidCC}`);
      return;
    }
    const invalidBCC = emailForm.bcc.find((email) => !emailRegex.test(email));
    if (invalidBCC) {
      message.warning(`Email trong "BCC" không hợp lệ: ${invalidBCC}`);
      return;
    }

    console.log("Gửi email:", emailForm, "với access token:", accessToken);
    message.success("Email đã được gửi thành công!");
    setOpenEmailModal(false);
    setEmailForm({
      from: [],
      to: [],
      cc: [],
      bcc: [],
      subject: "",
      content: "",
    });
  };

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await viewArchivedDocumentDetailAPI(documentId);
      if (res?.data?.statusCode === 200) {
        const data = res.data.content;
        const digitalSignatures = data.signatures.filter(
          (signature) => signature.isDigital === true
        );
        const initalSignatures = data.signatures.filter(
          (signature) => signature.isDigital === false
        );
        const finalVersion = data.versions.find(
          (version) => version.isFinal === true
        );
        const rejectedVersions = data.versions.filter(
          (version) => version.isFinal === false
        );
        setDocument({
          ...data,
          digitalSignatures,
          initalSignatures,
          finalVersion,
          rejectedVersions,
        });
      } else {
        message.error("Không thể tải thông tin văn bản!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin văn bản:", error);
      message.error("Lỗi khi lấy thông tin văn bản: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await viewAllUserAPI(1, 100, {}, {});
      if (response?.data?.statusCode === 200) {
        setAllUsers(response.data.content || []);
      } else {
        message.error("Không thể tải danh sách người dùng!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
      message.error("Lỗi khi lấy danh sách người dùng: " + error.message);
    }
  };

  const handleOpenShareModal = () => {
    fetchAllUsers();
    setOpenShareModal(true);
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      message.warning("Vui lòng chọn ít nhất một người dùng!");
      return;
    }

    try {
      const response = await grantPermissionAPI(documentId, selectedUsers);
      if (response?.data?.statusCode === 200) {
        message.success(
          `Đã cấp quyền xem cho ${selectedUsers.length} người dùng!`
        );
        setOpenShareModal(false);
        setSelectedUsers([]);
      } else {
        message.error("Không thể cấp quyền xem!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi cấp quyền:", error);
      message.error("Lỗi khi cấp quyền: " + error.message);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchInfo();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div
        className="full-screen-overlay"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <BeatLoader size={25} color="#364AD6" />
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: 16,
          minHeight: "90vh",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {/* Left Panel: PDF Viewer */}
        <Card
          style={{
            flex: 1,
            minWidth: 300,
            height: "88vh",
            overflowY: "auto",
          }}
        >
          <div style={{ height: "100%", overflowY: "auto" }}>
            <PDFViewerWithToken
              url={document?.versions?.[0]?.url}
              token={localStorage.getItem(`access_token`)}
            />

            <div style={{ padding: 16 }}>
              {document?.digitalSignatures?.map((signature, index) => (
                <div
                  key={index}
                  style={{ display: "inline-block", marginRight: 12 }}
                >
                  <SignatureBox
                    name={signature.name}
                    time={dayjs(signature.time).format("HH:mm - DD/MM/YYYY")}
                    signatureImage="signatureImg"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Panel: Detail Info */}
        <Card
          className="custom-card"
          style={{
            height: "88vh",
            display: "flex",
            flexDirection: "column",
            width: 400,
            minWidth: 300,
          }}
        >
          <Title
            level={5}
            style={{
              borderBottom: "1px solid #80868b",
              paddingBottom: "10px",
              paddingRight: "5px",
            }}
          >
            Thông tin chi tiết
          </Title>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 8,
            }}
          >
            <Title
              level={4}
              style={{
                paddingTop: "20px",
              }}
            >
              {document?.documentName}
            </Title>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            />
            <Title level={5}>Tổng quan văn bản</Title>
            <div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Người tạo:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.createdBy}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Người gửi:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.sender}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Ngày nhận:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.dateReceived
                    ? dayjs(document.dateReceived).format("DD-MM-YYYY HH:mm")
                    : "N/A"}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Ngày ban hành:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.dateIssued
                    ? dayjs(document.dateIssued).format("DD-MM-YYYY HH:mm")
                    : "N/A"}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Ngày hết hiệu lực:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.dateExpires
                    ? dayjs(document.dateExpires).format("DD-MM-YYYY HH:mm")
                    : "N/A"}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Ngày hết hạn:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.deadline
                    ? dayjs(document.deadline).format("DD-MM-YYYY HH:mm")
                    : "N/A"}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Số hiệu văn bản:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.numberOfDocument || "N/A"}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Loại văn bản:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.documentTypeName || "N/A"}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Luồng xử lý:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.scope || "N/A"}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Người ký:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.digitalSignatures?.map((item) => (
                    <Tag key={item.name} color="blue">
                      {item.name}
                    </Tag>
                  )) || "N/A"}
                </span>
              </div>
            </div>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            />
            <Title level={5}>Nội dung</Title>
            <Paragraph style={{ fontSize: 14 }}>
              {document?.documentContent || "N/A"}
            </Paragraph>

            <Row gutter={[12, 12, 24]}>
              <Col span={12}>
                <Button
                  icon={<ShareAltOutlined style={{ color: "#fa8c16" }} />}
                  block
                  size="middle"
                  onClick={handleOpenShareModal}
                  style={{
                    height: 70,
                    fontSize: 19,
                    background: "#F4F5F6",
                    border: "none",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "normal",
                    textAlign: "center",
                    lineHeight: "1.2",
                  }}
                >
                  Cấp quyền xem
                </Button>
              </Col>
              <Col span={12}>
                {(user?.mainRole?.roleName === "Chief" ||
                  user?.subRole?.roleName === "Chief") && (
                  <Button
                    icon={<MailOutlined style={{ color: "#fa8c16" }} />}
                    block
                    size="middle"
                    onClick={handleOpenEmailModal}
                    style={{
                      height: 70,
                      fontSize: 19,
                      background: "#F4F5F6",
                      border: "none",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "normal",
                      textAlign: "center",
                      lineHeight: "1.2",
                    }}
                  >
                    Gửi Email
                  </Button>
                )}
              </Col>
              <Col span={24}>
                <Button
                  icon={<PiHandWithdraw style={{ color: "#fa8c16" }} />}
                  block
                  size="middle"
                  onClick={() => setOpenEmailModal(true)}
                  style={{
                    height: 70,
                    fontSize: 20,
                    background: "#F4F5F6",
                    border: "none",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "normal",
                    textAlign: "center",
                    lineHeight: "1.2",
                  }}
                >
                  Thu hồi văn bản
                </Button>
              </Col>
            </Row>
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 16,
              }}
            >
              <Button
                type="primary"
                ghost
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal gửi email */}
      <Modal
        open={openEmailModal}
        onCancel={() => {
          setOpenEmailModal(false);
          setEmailForm({
            from: [],
            to: [],
            cc: [],
            bcc: [],
            subject: "",
            content: "",
          });
        }}
        footer={null}
        width={600}
        bodyStyle={{ padding: 16 }}
        closeIcon={<CloseCircleOutlined style={{ color: "#fa8c16" }} />}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: "#5f6368" }}>
              Văn bản quyết định 53/2025 QĐ-TTg chính sách nội trú học sinh,
              sinh viên cao đẳng trung cấp
            </span>
            <PaperClipOutlined style={{ color: "#fa8c16" }} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 4, color: "#5f6368" }}
          >
            Từ
          </label>
          <Input
            value={emailForm.from}
            onChange={(e) =>
              setEmailForm({ ...emailForm, from: e.target.value })
            }
            placeholder="Nhập email người gửi"
            style={{ borderRadius: 4 }}
            disabled
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 4, color: "#5f6368" }}
          >
            Đến
          </label>
          <Select
            mode="tags"
            placeholder="Chọn hoặc nhập email người nhận"
            value={emailForm.to}
            onChange={(value) => setEmailForm({ ...emailForm, to: value })}
            style={{ width: "100%" }}
            tokenSeparators={[","]}
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase()?.includes(input.toLowerCase())
            }
            disabled={allUsers.length === 0}
          >
            {allUsers.map((user) => (
              <Select.Option
                key={user.id}
                value={user.email}
                label={user.email}
              >
                <div>
                  <strong>{user.name}</strong>
                  <div style={{ color: "#5f6368", fontSize: 12 }}>
                    {user.email}
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 4, color: "#5f6368" }}
          >
            CC
          </label>
          <Select
            mode="tags"
            placeholder="Chọn hoặc nhập email CC"
            value={emailForm.cc}
            onChange={(value) => setEmailForm({ ...emailForm, cc: value })}
            style={{ width: "100%" }}
            tokenSeparators={[","]}
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase()?.includes(input.toLowerCase())
            }
            disabled={allUsers.length === 0}
          >
            {allUsers.map((user) => (
              <Select.Option
                key={user.id}
                value={user.email}
                label={user.email}
              >
                <div>
                  <strong>{user.name}</strong>
                  <div style={{ color: "#5f6368", fontSize: 12 }}>
                    {user.email}
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 4, color: "#5f6368" }}
          >
            BCC
          </label>
          <Select
            mode="tags"
            placeholder="Chọn hoặc nhập email BCC"
            value={emailForm.bcc}
            onChange={(value) => setEmailForm({ ...emailForm, bcc: value })}
            style={{ width: "100%" }}
            tokenSeparators={[","]}
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase()?.includes(input.toLowerCase())
            }
            disabled={allUsers.length === 0}
          >
            {allUsers.map((user) => (
              <Select.Option
                key={user.id}
                value={user.email}
                label={user.email}
              >
                <div>
                  <strong>{user.name}</strong>
                  <div style={{ color: "#5f6368", fontSize: 12 }}>
                    {user.email}
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 4, color: "#5f6368" }}
          >
            Tiêu đề
          </label>
          <Input
            value={emailForm.subject}
            onChange={(e) =>
              setEmailForm({ ...emailForm, subject: e.target.value })
            }
            placeholder="Nhập tiêu đề email"
            style={{ borderRadius: 4 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 4, color: "#5f6368" }}
          >
            Nội dung
          </label>
          <TextArea
            value={emailForm.content}
            onChange={(e) =>
              setEmailForm({ ...emailForm, content: e.target.value })
            }
            rows={4}
            placeholder="Nhập nội dung email"
            style={{ borderRadius: 4 }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendEmail}
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
      </Modal>

      {/* Modal cấp quyền xem */}
      <Modal
        title="Cấp quyền xem"
        open={openShareModal}
        onOk={handleShare}
        onCancel={() => {
          setOpenShareModal(false);
          setSelectedUsers([]);
        }}
        okText="Xác nhận"
        cancelText="Hủy"
        width={400}
      >
        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 8, color: "#5f6368" }}
          >
            Chọn người dùng
          </label>
          <Select
            mode="multiple"
            placeholder="Chọn người dùng để cấp quyền"
            value={selectedUsers}
            onChange={(value) => setSelectedUsers(value)}
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase()?.includes(input.toLowerCase())
            }
            style={{ width: "100%" }}
            optionLabelProp="label"
            disabled={allUsers.length === 0}
          >
            {allUsers.map((user) => (
              <Select.Option
                key={user.userId}
                value={user.userId}
                label={user.userName}
              >
                <div>
                  <strong>{user.userName}</strong>
                  <div style={{ color: "#5f6368", fontSize: 12 }}>
                    {user.email}
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

// Custom components
const Title = ({ level, children, style }) => {
  const fontSize = level === 4 ? 20 : level === 5 ? 16 : 24;
  return <h3 style={{ fontSize, margin: "8px 0", ...style }}>{children}</h3>;
};

const Paragraph = ({ children, style }) => {
  return <p style={{ margin: "8px 0", ...style }}>{children}</p>;
};

const TextArea = ({ value, onChange, rows, placeholder, style }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      style={{ width: "100%", padding: 8, ...style }}
    />
  );
};

export default ViewDetailArchivedDocument;
