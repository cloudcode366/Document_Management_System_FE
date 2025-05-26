import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Divider,
  Col,
  Row,
  Select,
  App,
  Modal,
  Tag,
  Typography,
  Space,
  Popover,
  Badge,
  List,
  Tooltip,
  Avatar,
  Table,
  Radio,
  Image,
} from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  MailOutlined,
  FileSyncOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EyeOutlined,
  FileTextOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import { PiHandWithdraw } from "react-icons/pi";
import { BeatLoader } from "react-spinners";
import {
  grantPermissionAPI,
  viewAllUserAPI,
  viewArchivedDocumentDetailAPI,
} from "@/services/api.service";
import dayjs from "dayjs";
import axios from "axios";
import { useCurrentApp } from "@/components/context/app.context";
import ArchivedPDFViewerWithToken from "@/components/archived.pdf.viewer";
import "./detail.archived.document.scss";
import { convertArchivedStatus, convertScopeName } from "@/services/helper";
import SignatureContainer from "../../documents/initial.signature/signature.container";
import CreateWithdrawModal from "./create.withdraw.modal";
import CreateReplaceModal from "./create.replace.modal";

const CLIENT_ID =
  "574718261918-j6trtu7cd141fqc26nt436ipmicdaagf.apps.googleusercontent.com";
const SCOPE = "openid email https://mail.google.com/";
const REDIRECT_URI = window.location.origin + "/send-email";

const { Title, Paragraph } = Typography;

const ActionButtonsGroup = ({ buttons }) => {
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    const isLastSingle = i === buttons.length - 1;
    rows.push(
      <Row key={i} justify={isLastSingle ? "center" : "start"}>
        <Col
          span={12}
          style={{
            marginBottom: "10px",
            marginLeft: "12px",
            maxWidth: "calc(50% - 12px)",
          }}
        >
          {buttons[i]}
        </Col>
        {!isLastSingle && (
          <Col
            span={12}
            style={{
              marginBottom: "10px",
              marginLeft: "12px",
              maxWidth: "calc(50% - 12px)",
            }}
          >
            {buttons[i + 1]}
          </Col>
        )}
      </Row>
    );
  }

  return <>{rows}</>;
};

const tagColor = {
  "Văn bản đến": "#FC8330",
  "Văn bản đi": "#18B0FF",
  "Nội bộ phòng ban": "#9254DE",
  "Nội bộ toàn trường": "#F759AB",
};

const statusColor = {
  Sent: "#2BDBBB",
  Archived: "#82E06E",
  Withdrawn: "#FF6B6B",
};

const ViewDetailArchivedDocument = () => {
  const location = useLocation();
  const documentId = location.state?.documentId;
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const { user } = useCurrentApp();
  const buttons = [];
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false);
  const [openModalReplace, setOpenModalReplace] = useState(false);

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

  useEffect(() => {
    const storedToken = localStorage.getItem("googleToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const handleOpenEmailModal = () => {
    loginWithGoogle();
  };

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await viewArchivedDocumentDetailAPI(documentId);
      if (res?.data?.statusCode === 200) {
        const data = res.data.content;
        const finalVersion = data.versions.find(
          (version) => version.isFinal === true
        );
        const rejectedVersions = data.versions.filter(
          (version) => version.isFinal === false
        );
        setDocument({
          ...data,
          finalVersion,
          rejectedVersions,
        });
      } else {
        message.error("Không thể tải thông tin văn bản!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin văn bản:", error);
      message.error("Lỗi khi lấy thông tin văn bản: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await viewAllUserAPI(1, 100, {}, {});
      if (response?.data?.statusCode === 200) {
        const listUser = response.data.content.filter(
          (user) => user.userName?.trim().toLowerCase() !== "admin"
        );
        const filterUsers = listUser.filter(
          (user) =>
            !document?.granters?.some(
              (granter) => granter.userId === user.userId
            )
        );
        setAllUsers(filterUsers);
      } else {
        message.error("Không thể tải danh sách người dùng!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      message.error("Lỗi khi lấy danh sách người dùng: " + error.message);
    }
  };

  const handleOpenShareModal = () => {
    fetchAllUsers();
    setOpenShareModal(true);
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      message.warning("Vui lòng chọn ít nhất một người dùng để chia sẻ.");
      return;
    }

    const shareData = selectedUsers.map((userId) => ({
      userId,
      grantPermission: userPermissions[userId] || "View",
    }));

    const payload = {
      documentId: documentId,
      userGrantDocuments: shareData,
    };

    try {
      const response = await grantPermissionAPI(payload);
      if (response?.data?.statusCode === 200) {
        message.success("Cấp quyền truy cập văn bản thành công!");
        setOpenShareModal(false);
        setSelectedUsers([]);
        setUserPermissions({});
        await fetchInfo();
      } else {
        message.error("Chia sẻ thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
      message.error("Đã xảy ra lỗi khi chia sẻ: " + error.message);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchInfo();
    }
  }, [documentId]);

  const digitalSignaturesContent = (
    <div
      style={{
        minWidth: 280,
        maxHeight: 300,
        overflowY: "auto",
        paddingRight: 8,
      }}
    >
      {document?.digitalSignatures?.map((signature, index) => (
        <div key={index}>
          <Space direction="vertical" size={4}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserOutlined style={{ color: "#1890ff" }} />
              <span>
                <strong>Người ký:</strong> {signature.signerName}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ClockCircleOutlined style={{ color: "#52c41a" }} />
              <span>
                <strong>Thời gian ký:</strong>{" "}
                {dayjs(signature.signedDate).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          </Space>
          {index < document.digitalSignatures.length - 1 && (
            <Divider style={{ margin: "10px 0" }} />
          )}
        </div>
      ))}
    </div>
  );

  const viewersContent = (
    <div
      style={{
        minWidth: 280,
        maxHeight: 300,
        overflowY: "auto",
        paddingRight: 8,
      }}
    >
      {document?.viewers?.map((viewer, index) => (
        <div key={index}>
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Image
                src={viewer?.avatar}
                width={32}
                height={32}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                fallback="/default-avatar.png"
              />
              <div>
                <div>
                  <strong>{viewer.fullName}</strong>
                </div>
                <div style={{ color: "#888" }}>{viewer.userName}</div>
              </div>
            </div>
          </Space>
          {index < document.viewers.length - 1 && (
            <Divider style={{ margin: "10px 0" }} />
          )}
        </div>
      ))}
    </div>
  );

  const grantersContent = (
    <div
      style={{
        minWidth: 280,
        maxHeight: 300,
        overflowY: "auto",
        paddingRight: 8,
      }}
    >
      {document?.granters?.map((granter, index) => (
        <div key={index}>
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Image
                src={granter?.avatar}
                width={32}
                height={32}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                fallback="/default-avatar.png"
              />
              <div>
                <div>
                  <strong>{granter.fullName}</strong>
                </div>
                <div style={{ color: "#888" }}>{granter.userName}</div>
              </div>
            </div>
          </Space>
          {index < document.granters.length - 1 && (
            <Divider style={{ margin: "10px 0" }} />
          )}
        </div>
      ))}
    </div>
  );

  // Cấp quyền truy cập
  if (document?.canGrant) {
    buttons.push(
      <Button
        icon={<ShareAltOutlined style={{ color: "#1890ff" }} />}
        block
        size="middle"
        style={{
          height: 40,
          fontSize: 16,
          background: "#e6f4ff",
          border: "1px solid #91d5ff",
          fontWeight: 600,
          transition: "all 0.3s ease",
          padding: "0 12px",
          minWidth: 150,
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#d1e9ff";
          e.currentTarget.style.border = "1px solid #69c0ff";
          e.currentTarget.style.color = "#096dd9";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#e6f4ff";
          e.currentTarget.style.border = "1px solid #91d5ff";
          e.currentTarget.style.color = "#1890ff";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onClick={handleOpenShareModal}
      >
        Cấp quyền truy cập
      </Button>
    );
  }

  // Gửi email
  if (
    document?.scope === "OutGoing" &&
    (user?.mainRole?.roleName === "Chief" ||
      user?.subRole?.roleName?.endsWith("_Chief")) &&
    (document?.status === "Archived" || document?.status === "Sent")
  ) {
    buttons.push(
      <Button
        icon={<MailOutlined style={{ color: "#fa8c16" }} />}
        block
        size="middle"
        style={{
          height: 40,
          fontSize: 16,
          background: "#fff7e6",
          border: "1px solid #ffd591",
          fontWeight: 600,
          transition: "all 0.3s ease",
          padding: "0 12px",
          minWidth: 150,
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ffe7ba";
          e.currentTarget.style.border = "1px solid #ffc069";
          e.currentTarget.style.color = "#d46b08";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff7e6";
          e.currentTarget.style.border = "1px solid #ffd591";
          e.currentTarget.style.color = "#fa8c16";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onClick={handleOpenEmailModal}
      >
        Gửi email
      </Button>
    );
  }

  // Thu hồi văn bản
  if (
    document?.scope === "OutGoing" &&
    (user?.mainRole?.roleName === "Chief" ||
      user?.subRole?.roleName?.endsWith("_Chief")) &&
    document?.status === "Sent" &&
    document?.canRevoke === true
  ) {
    buttons.push(
      <Button
        icon={<PiHandWithdraw style={{ color: "#ff4d4f" }} />}
        block
        size="middle"
        style={{
          height: 40,
          fontSize: 16,
          background: "#fff1f0",
          border: "1px solid #ffa39e",
          transition: "all 0.3s ease",
          fontWeight: 600,
          padding: "0 12px",
          minWidth: 150,
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ffccc7";
          e.currentTarget.style.border = "1px solid #ff7875";
          e.currentTarget.style.color = "#f5222d";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff1f0";
          e.currentTarget.style.border = "1px solid #ffa39e";
          e.currentTarget.style.color = "#ff4d4f";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onClick={() => {
          setOpenModalWithdraw(true);
        }}
      >
        Thu hồi văn bản
      </Button>
    );
  }

  // Khởi tạo văn bản thay thế
  if (
    document?.scope === "OutGoing" &&
    document?.status === "Withdrawn" &&
    document?.canRevoke === false
  ) {
    buttons.push(
      <Button
        icon={<FileSyncOutlined style={{ color: "#52c41a" }} />}
        block
        size="middle"
        style={{
          height: 40,
          fontSize: 16,
          background: "#f6ffed",
          border: "1px solid #b7eb8f",
          transition: "all 0.3s ease",
          fontWeight: 600,
          padding: "0 12px",
          minWidth: 150,
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#b7eb8f";
          e.currentTarget.style.border = "1px solid #95de64";
          e.currentTarget.style.color = "#389e0d";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#f6ffed";
          e.currentTarget.style.border = "1px solid #b7eb8f";
          e.currentTarget.style.color = "#52c41a";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onClick={() => {
          setOpenModalReplace(true);
        }}
      >
        Khởi tạo văn bản thay thế
      </Button>
    );
  }

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
    <div>
      <div className="detail-archived-document">
        <div className="left-panel-dad hide-scrollbar-dad">
          <Card className="custom-card-no-padding-dad hide-scrollbar-dad">
            <div className="content-wrapper-dad hide-scrollbar-dad">
              <ArchivedPDFViewerWithToken
                documentId={document?.documentId}
                url={document?.finalVersion?.url}
                token={localStorage.getItem(`access_token`)}
                documentName={document?.documentName}
                canGrant={document?.canGrant}
                canDownLoad={document?.canDownLoad}
              />
              {Array.isArray(document?.approvalSignatures) &&
                document.approvalSignatures.length > 0 && (
                  <SignatureContainer>
                    {document.approvalSignatures.map((signature, index) => (
                      <div
                        key={index}
                        style={{ display: "inline-block", marginRight: 12 }}
                      >
                        <SignatureBox
                          name={signature.signerName}
                          time={dayjs(signature.signedDate).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                          signatureImage={signature.imgUrl}
                        />
                      </div>
                    ))}
                  </SignatureContainer>
                )}
            </div>
          </Card>
        </div>

        <div
          className="right-panel-dad"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <Card
            className="custom-card-dad hide-scrollbar-dad"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #80868b",
                paddingBottom: "10px",
                paddingRight: "5px",
              }}
            >
              <Title level={5} style={{ margin: 0 }}>
                Thông tin chi tiết
              </Title>
              <Button
                type="primary"
                ghost
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/archived-document")}
              >
                Quay lại
              </Button>
            </div>

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
              <Tag color={tagColor[convertScopeName(document?.scope)]}>
                {convertScopeName(document?.scope)}
              </Tag>
              <Divider
                variant="solid"
                style={{
                  borderColor: "#80868b",
                }}
              ></Divider>
              <Title level={5}>Tổng quan văn bản</Title>
              {document?.systemNumberOfDocument && (
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Số hiệu hệ thống:</span>
                  <span
                    style={{
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {document?.systemNumberOfDocument}
                  </span>
                </div>
              )}
              {document?.numberOfDocument && (
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Số hiệu văn bản:</span>
                  <span
                    style={{
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {document?.numberOfDocument}
                  </span>
                </div>
              )}
              {document?.documentTypeName && (
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Loại văn bản:</span>
                  <span
                    style={{
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {document?.documentTypeName}
                  </span>
                </div>
              )}
              {document?.status && (
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Trạng thái:</span>
                  <span
                    style={{
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    <Badge
                      color={statusColor[document?.status]}
                      text={convertArchivedStatus(document?.status)}
                      className="custom-dot"
                    />
                  </span>
                </div>
              )}
              {document?.createdBy && (
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Người tạo:</span>
                  <span
                    style={{
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {document?.createdBy}
                  </span>
                </div>
              )}
              {document?.createDate &&
                dayjs(document.createDate).year() > 1900 &&
                dayjs(document.createDate).year() < 3000 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Ngày tạo:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {dayjs(document.createDate).format("DD-MM-YYYY HH:mm")}
                    </span>
                  </div>
                )}
              {document?.archivedBy && (
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Người lưu:</span>
                  <span
                    style={{
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {document?.archivedBy}
                  </span>
                </div>
              )}
              {document?.archivedDate &&
                dayjs(document.archivedDate).year() > 1900 &&
                dayjs(document.archivedDate).year() < 3000 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Ngày lưu:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {document?.archivedDate &&
                        dayjs(document?.archivedDate).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                    </span>
                  </div>
                )}
              {document?.sender && (
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Người gửi:</span>
                  <span
                    style={{
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {document?.sender}
                  </span>
                </div>
              )}
              {document?.dateIssued &&
                dayjs(document.dateIssued).year() > 1900 &&
                dayjs(document.dateIssued).year() < 3000 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Ngày ban hành:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {document?.dateIssued &&
                        dayjs(document?.dateIssued).format("DD-MM-YYYY HH:mm")}
                    </span>
                  </div>
                )}
              {document?.dateExpires &&
                dayjs(document.dateExpires).year() > 1900 &&
                dayjs(document.dateExpires).year() < 3000 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Ngày hết hiệu lực:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {document?.dateExpires &&
                        dayjs(document?.dateExpires).format("DD-MM-YYYY HH:mm")}
                    </span>
                  </div>
                )}
              {Array.isArray(document?.digitalSignatures) &&
                document.digitalSignatures.length > 0 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Người ký:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {Array.isArray(document?.digitalSignatures) &&
                        document.digitalSignatures.length > 0 && (
                          <Popover
                            content={digitalSignaturesContent}
                            title="Thông tin chữ ký"
                            trigger="click"
                            placement="left"
                          >
                            <span
                              style={{
                                color: "#1890ff",
                                cursor: "pointer",
                              }}
                            >
                              Xem chi tiết
                            </span>
                          </Popover>
                        )}
                    </span>
                  </div>
                )}
              {Array.isArray(document?.granters) &&
                document.granters.length > 0 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>
                      Người có thẩm quyền:
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {Array.isArray(document?.granters) &&
                        document.granters.length > 0 && (
                          <Popover
                            content={grantersContent}
                            title="Thông tin người có thẩm quyền"
                            trigger="click"
                            placement="left"
                          >
                            <span
                              style={{
                                color: "#1890ff",
                                cursor: "pointer",
                              }}
                            >
                              Xem chi tiết
                            </span>
                          </Popover>
                        )}
                    </span>
                  </div>
                )}
              {Array.isArray(document?.viewers) &&
                document.viewers.length > 0 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Người xem:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {Array.isArray(document?.viewers) &&
                        document.viewers.length > 0 && (
                          <Popover
                            content={viewersContent}
                            title="Thông tin người xem"
                            trigger="click"
                            placement="left"
                          >
                            <span
                              style={{
                                color: "#1890ff",
                                cursor: "pointer",
                              }}
                            >
                              Xem chi tiết
                            </span>
                          </Popover>
                        )}
                    </span>
                  </div>
                )}

              <Divider
                variant="solid"
                style={{
                  borderColor: "#80868b",
                }}
              ></Divider>
              {document?.documentContent && (
                <>
                  <Title level={5}>Nội dung</Title>
                  <Paragraph style={{ fontSize: 14 }}>
                    {document?.documentContent}
                  </Paragraph>
                  <Divider
                    variant="solid"
                    style={{
                      borderColor: "#80868b",
                    }}
                  ></Divider>
                </>
              )}
              {(document?.revokeDocument?.documentId ||
                document?.replacedDocument?.documentId) && (
                <>
                  <Typography.Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 12,
                      display: "block",
                    }}
                  >
                    Danh sách các văn bản liên quan
                  </Typography.Text>
                  {document?.revokeDocument?.documentId && (
                    <div
                      style={{
                        marginBottom: "8px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Tooltip title="Xem chi tiết">
                        <Typography.Text
                          strong
                          style={{
                            fontSize: 14,
                            color: "#1677ff",
                            cursor: "pointer",
                            wordBreak: "break-word",
                            paddingTop: 4,
                          }}
                          onClick={() =>
                            navigate("/detail-archived-document", {
                              state: {
                                documentId:
                                  document?.revokeDocument?.documentId,
                              },
                            })
                          }
                        >
                          {document?.revokeDocument?.documentName}
                        </Typography.Text>
                      </Tooltip>
                    </div>
                  )}
                  {document?.replacedDocument?.documentId && (
                    <div
                      style={{
                        marginBottom: "8px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography.Text
                        strong
                        style={{
                          fontSize: 14,
                          color: "#1677ff",
                          cursor: "pointer",
                          wordBreak: "break-word",
                          paddingTop: 4,
                        }}
                        onClick={() =>
                          navigate("/detail-archived-document", {
                            state: {
                              documentId:
                                document?.replacedDocument?.documentId,
                            },
                          })
                        }
                      >
                        {document?.replacedDocument?.documentName}
                      </Typography.Text>
                    </div>
                  )}
                  <Divider
                    variant="solid"
                    style={{
                      borderColor: "#80868b",
                    }}
                  ></Divider>
                </>
              )}
            </div>
            <div
              style={{
                padding: "12px 12px",
                backgroundColor: "#fff",
                position: "sticky",
                bottom: 30,
                zIndex: 10,
              }}
            >
              <ActionButtonsGroup buttons={buttons} />
            </div>
          </Card>
        </div>
      </div>

      {/* Modal cấp quyền xem */}
      <Modal
        title={
          <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
            Cấp quyền truy cập văn bản
          </div>
        }
        open={openShareModal}
        onOk={handleShare}
        onCancel={() => {
          setOpenShareModal(false);
          setSelectedUsers([]);
          setUserPermissions({});
        }}
        okText="Xác nhận"
        cancelText="Hủy"
        width={700}
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

        {/* Bảng thông tin người dùng đã chọn */}
        {selectedUsers.length > 0 && (
          <Table
            rowKey="userId"
            dataSource={allUsers.filter((user) =>
              selectedUsers.includes(user.userId)
            )}
            pagination={false}
            size="small"
            columns={[
              {
                title: "",
                dataIndex: "avatar",
                width: 50,
                render: (_, record) => (
                  <Avatar src={record.avatar} icon={<UserOutlined />} />
                ),
              },
              {
                title: "Họ và tên",
                dataIndex: "fullName",
                key: "fullName",
              },
              {
                title: "Tên đăng nhập",
                dataIndex: "userName",
                key: "userName",
              },
              {
                title: "Quyền",
                dataIndex: "permission",
                width: 150,
                render: (_, record) => (
                  <Radio.Group
                    value={userPermissions[record.userId] || "view"}
                    onChange={(e) =>
                      setUserPermissions({
                        ...userPermissions,
                        [record.userId]: e.target.value,
                      })
                    }
                  >
                    <Radio value="View">Xem</Radio>
                    <Radio value="Download">Tải</Radio>
                  </Radio.Group>
                ),
              },
              {
                title: "Xóa",
                width: 50,
                render: (_, record) => (
                  <Tooltip title="Xóa">
                    <CloseOutlined
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => {
                        setSelectedUsers((prev) =>
                          prev.filter((id) => id !== record.userId)
                        );
                        const updated = { ...userPermissions };
                        delete updated[record.userId];
                        setUserPermissions(updated);
                      }}
                    />
                  </Tooltip>
                ),
              },
            ]}
          />
        )}
      </Modal>

      <CreateWithdrawModal
        openModalWithdraw={openModalWithdraw}
        setOpenModalWithdraw={setOpenModalWithdraw}
        documentId={documentId}
      />
      <CreateReplaceModal
        openModalReplace={openModalReplace}
        setOpenModalReplace={setOpenModalReplace}
        documentId={documentId}
      />
    </div>
  );
};

export default ViewDetailArchivedDocument;
