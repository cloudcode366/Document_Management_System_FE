import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Divider,
  Tooltip,
  Col,
  Row,
  Space,
  List,
  App,
  Form,
  Input,
  Modal,
  Tag,
  Badge,
  Popover,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  ExportOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "./view.detail.document.scss";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import SignatureContainer from "@/components/client/documents/initial.signature/signature.container";
import { useCurrentApp } from "@/components/context/app.context";
import { BeatLoader } from "react-spinners";
import {
  createHandleTaskActionAPI,
  createRejectDocumentActionAPI,
  viewDetailDocumentAPI,
} from "@/services/api.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { pdfjs } from "react-pdf";
import PDFViewerWithToken from "@/components/pdf.viewer";
import CreateVersionModal from "./create.version.modal";
import { convertProcessingStatus, convertScopeName } from "@/services/helper";

dayjs.extend(utc);
dayjs.extend(timezone);

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Title, Paragraph, Link } = Typography;

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
  InProgress: "#3A91F5",
  Completed: "#2BDBBB",
  Archived: "#82E06E",
  Rejected: "#FF6B6B",
};

const ViewDetailDocument = () => {
  const { documentId } = useParams();
  const { user } = useCurrentApp();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const [openCreateVersionModal, setOpenCreateVersionModal] = useState(false);
  const [openApproveConfirmModal, setOpenApproveConfirmModal] = useState(false);
  const [openRejectConfirmModal, setOpenRejectConfirmModal] = useState(false);
  const [openViewConfirmModal, setOpenViewConfirmModal] = useState(false);
  const [openSubmitConfirmModal, setOpenSubmitConfirmModal] = useState(false);
  const [rejectForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const buttons = [];
  const [isSubmit, setIsSubmit] = useState(false);

  const fetchInfo = async () => {
    setLoading(true);
    const res = await viewDetailDocumentAPI(documentId);
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      const finalVersion = data.versions.find(
        (version) => version.isFinal === true
      );
      const rejectedVersions = data.versions.filter(
        (version) => version.isFinal === false
      );

      const currentTask = data.tasks.find((task) => {
        return task.status === "InProgress";
      });
      const taskType = currentTask?.taskType;
      const taskId = currentTask?.taskId;
      const taskStatus = currentTask?.status;
      const isUsb = currentTask?.isUsb;

      setDocument({
        ...data,
        finalVersion,
        rejectedVersions,
        taskType,
        taskId,
        taskStatus,
        isUsb,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const digitalSignaturesContent = (
    <div style={{ minWidth: 280 }}>
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

  const handleApproveDocument = async () => {
    setIsSubmit(true);
    const res = await createHandleTaskActionAPI(
      document?.taskId,
      user.userId,
      "ApproveDocument"
    );
    if (res?.data?.statusCode === 200) {
      notification.success({
        message: "Duyệt văn bản thành công!",
        description: "Văn bản đã được duyệt thành công.",
      });
      setOpenApproveConfirmModal(false);
      await fetchInfo();
    } else {
      notification.error({
        message: "Hệ thống đang bận!",
        description: "Xin vui lòng thử lại sau.",
      });
    }
    setIsSubmit(false);
  };

  const handleRejectDocument = async () => {
    try {
      setIsSubmit(true);
      const values = await rejectForm.validateFields();
      console.log("Lý do từ chối:", values.reason);
      const res = await createRejectDocumentActionAPI(
        values.reason,
        document?.taskId,
        user?.userId
      );
      if (res?.data?.statusCode === 201) {
        notification.success({
          message: "Văn bản đã bị từ chối thành công!",
          description: `Lý do: ${values.reason}`,
        });
        rejectForm.resetFields();
        setOpenRejectConfirmModal(false);
        await fetchInfo();
      }
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
      notification.error({
        message: "Hệ thống đang trong thời gian bảo trì!",
        description: "Xin vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleViewDocument = async () => {
    setIsSubmit(true);
    const res = await createHandleTaskActionAPI(
      document?.taskId,
      user.userId,
      "SubmitDocument"
    );
    if (res?.data?.statusCode === 200) {
      notification.success({
        message: "Hoàn thành",
        description: "Xác nhận đã xem văn bản thành công.",
      });
      navigate(`/archived-document`);
    } else {
      notification.error({
        message: "Hệ thống đang bận!",
        description: "Xin vui lòng thử lại sau.",
      });
    }
    setIsSubmit(false);
  };

  const handleSubmitDocument = async () => {
    setIsSubmit(true);
    const res = await createHandleTaskActionAPI(
      document?.taskId,
      user.userId,
      "SubmitDocument"
    );
    if (res?.data?.statusCode === 200) {
      notification.success({
        message: "Nộp văn bản thành công!",
        description: "Văn bản đã được nộp thành công.",
      });
      setOpenSubmitConfirmModal(false);
      await fetchInfo();
    } else {
      notification.error({
        message: "Hệ thống đang trong thời gian bảo trì!",
        description: "Xin vui lòng thử lại sau.",
      });
    }
    setIsSubmit(false);
  };

  const handleDownload = async (file) => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    try {
      const response = await fetch(file.attachmentDocumentUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Tải xuống thất bại");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = window.document.createElement("a");
      a.href = url;
      a.download = file.attachmentDocumentName || "file";
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải tệp xuống");
    }
  };

  // Tải văn bản
  if (
    document?.taskType === "Upload" &&
    document?.taskStatus === "InProgress"
  ) {
    buttons.push(
      <Button
        icon={<FileTextOutlined style={{ color: "#08979c" }} />}
        block
        size="middle"
        style={{
          height: 40,
          fontSize: 16,
          background: "#e6fffb",
          border: "1px solid #87e8de",
          color: "#08979c",
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
          e.currentTarget.style.background = "#b5f5ec";
          e.currentTarget.style.border = "1px solid #5cdbd3";
          e.currentTarget.style.color = "#006d75";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#e6fffb";
          e.currentTarget.style.border = "1px solid #87e8de";
          e.currentTarget.style.color = "#08979c";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onClick={() => setOpenCreateVersionModal(true)}
      >
        Tải văn bản lên
      </Button>
    );
  }

  // Ký điện tử
  if (document?.taskType === "Sign" && document?.taskStatus === "InProgress") {
    buttons.push(
      <Button
        icon={<EditOutlined style={{ color: "#1890ff" }} />}
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
        onClick={() =>
          navigate(`/digital-signature/${documentId}`, {
            state: {
              taskId: document?.taskId,
              isUsb: document?.isUsb,
            },
          })
        }
      >
        Ký điện tử
      </Button>
    );
  }

  // Nộp văn bản
  if (
    document?.taskType === "Submit" &&
    document?.taskStatus === "InProgress"
  ) {
    buttons.push(
      <Button
        icon={<ExportOutlined style={{ color: "#fa8c16" }} />}
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
        onClick={() => setOpenSubmitConfirmModal(true)}
      >
        Nộp văn bản
      </Button>
    );
  }

  // Từ chối
  if (
    document?.taskType === "Browse" &&
    document?.taskStatus === "InProgress"
  ) {
    buttons.push(
      <Button
        icon={<CloseOutlined style={{ color: "#ff4d4f" }} />}
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
          setOpenRejectConfirmModal(true);
        }}
      >
        Từ chối văn bản
      </Button>
    );
  }

  // Duyệt văn bản
  if (
    document?.taskType === "Browse" &&
    document?.taskStatus === "InProgress"
  ) {
    buttons.push(
      <Button
        icon={<CheckOutlined style={{ color: "#52c41a" }} />}
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
          setOpenApproveConfirmModal(true);
        }}
      >
        Duyệt văn bản
      </Button>
    );
  }

  // Khởi tạo nhiệm vụ
  if (
    document?.taskType === "Create" &&
    document?.taskStatus === "InProgress"
  ) {
    buttons.push(
      <Button
        icon={<SolutionOutlined />}
        block
        size="middle"
        style={{
          height: 40,
          fontSize: 16,
          background: "#fff7e6",
          border: "1px solid #ffd591",
          color: "#fa8c16",
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
        onClick={() => {
          navigate(`/init-progress/${documentId}/${document?.taskId}`);
        }}
      >
        Phân bổ văn bản
      </Button>
    );
  }

  // Đã xem văn bản
  if (document?.taskType === "View" && document?.taskStatus === "InProgress") {
    buttons.push(
      <Button
        icon={<CheckCircleOutlined />}
        block
        size="middle"
        style={{
          height: 40,
          fontSize: 16,
          background: "#f6ffed",
          border: "1px solid #b7eb8f",
          color: "#52c41a",
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
          e.currentTarget.style.background = "#d9f7be";
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
          setOpenViewConfirmModal(true);
        }}
      >
        Xác nhận đã xem
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
      <div className="view-detail-document">
        <div className="left-panel-vdd hide-scrollbar-vdd">
          <Card className="custom-card-no-padding-vdd hide-scrollbar-vdd">
            <div className="content-wrapper-vdd hide-scrollbar-vdd">
              <PDFViewerWithToken
                documentId={document?.documentId}
                url={document?.finalVersion?.url}
                token={localStorage.getItem(`access_token`)}
                documentName={document?.documentName}
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
          className="right-panel-vdd"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <Card
            className="custom-card-vdd hide-scrollbar-vdd"
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
                onClick={() => navigate("/")}
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
              <Tag
                color={tagColor[convertScopeName(document?.scope)]}
                style={{ fontSize: 14 }}
              >
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
                      text={convertProcessingStatus(document?.status)}
                      className="custom-dot"
                    />
                  </span>
                </div>
              )}
              {document?.workflowName && (
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Luồng xử lý:</span>
                  <span
                    style={{
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {document?.workflowName}
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
                  <span style={{ color: "#5f6368" }}>
                    {document?.scope === "InComing"
                      ? "Người nhận"
                      : "Người tạo"}
                    :
                  </span>
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
              {document?.scope === "InComing" &&
                document?.dateReceived &&
                dayjs(document.dateReceived).year() > 1900 &&
                dayjs(document.dateReceived).year() < 3000 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Ngày nhận:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {document?.dateReceived &&
                        dayjs(document?.dateReceived).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                    </span>
                  </div>
                )}
              {document?.scope !== "InComing" &&
                document?.createDate &&
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
                      {document?.createDate &&
                        dayjs(document?.createDate).format("DD-MM-YYYY HH:mm")}
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
              {document?.validFrom &&
                dayjs(document.validFrom).year() > 1900 &&
                dayjs(document.validFrom).year() < 3000 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Ngày có hiệu lực:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {document?.validFrom &&
                        dayjs
                          .utc(document.validFrom)
                          .tz("Asia/Ho_Chi_Minh")
                          .format("DD-MM-YYYY HH:mm")}
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
              {document?.deadline &&
                dayjs(document.deadline).year() > 1900 &&
                dayjs(document.deadline).year() < 3000 && (
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#5f6368" }}>Hạn xử lý:</span>
                    <span
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {document?.deadline &&
                        dayjs(document?.deadline).format("DD-MM-YYYY HH:mm")}
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
              {Array.isArray(document?.attachments) &&
                document.attachments.length > 0 && (
                  <>
                    <Typography.Text
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        marginBottom: 8,
                        display: "block",
                      }}
                    >
                      Tệp đính kèm
                    </Typography.Text>
                    <List
                      itemLayout="horizontal"
                      dataSource={document.attachments}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Link
                            onClick={() => handleDownload(item)}
                            style={{ cursor: "pointer" }}
                          >
                            <DownloadOutlined style={{ marginRight: 8 }} />
                            {index + 1}. {item.attachmentDocumentName}
                          </Link>
                        </List.Item>
                      )}
                    />
                    <Divider
                      variant="solid"
                      style={{
                        borderColor: "#80868b",
                      }}
                    ></Divider>
                  </>
                )}
              <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
                Danh sách các phiên bản
              </Typography.Text>

              <List
                itemLayout="horizontal"
                dataSource={document?.versions}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      !item.isFinal && item.versionNumber !== "0" && (
                        <Tooltip title="Xem chi tiết" key="view">
                          <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff" }}
                            onClick={() => {
                              navigate("/version-document", {
                                state: {
                                  documentId: document?.documentId,
                                  version: item,
                                  documentName: document?.documentName,
                                  createdBy: document?.createdBy,
                                  createdDate: document?.createdDate,
                                },
                              });
                            }}
                          />
                        </Tooltip>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <FileTextOutlined
                          style={{ fontSize: 20, color: "#8c8c8c" }}
                        />
                      }
                      title={
                        <Space>
                          <Typography.Text>
                            Phiên bản{" "}
                            {item?.versionNumber === "0"
                              ? "gốc"
                              : item?.versionNumber}
                          </Typography.Text>
                        </Space>
                      }
                      description={`Ngày tạo: ${dayjs(item?.createdDate).format(
                        "DD-MM-YYYY HH:mm"
                      )}`}
                    />
                  </List.Item>
                )}
              />
              <Divider
                variant="solid"
                style={{
                  borderColor: "#80868b",
                }}
              ></Divider>
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
      <Modal
        title="Xác nhận duyệt văn bản"
        open={openApproveConfirmModal}
        onOk={handleApproveDocument}
        onCancel={() => setOpenApproveConfirmModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        centered
        maskClosable={false}
        confirmLoading={isSubmit}
      >
        <p>Bạn có chắc chắn muốn duyệt văn bản này không?</p>
      </Modal>

      <Modal
        title="Xác nhận từ chối văn bản"
        open={openRejectConfirmModal}
        onOk={handleRejectDocument}
        onCancel={() => {
          setOpenRejectConfirmModal(false);
          rejectForm.resetFields();
        }}
        okText="Từ chối"
        cancelText="Hủy"
        centered
        maskClosable={false}
        confirmLoading={isSubmit}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Lý do từ chối"
            rules={[
              { required: true, message: "Vui lòng nhập lý do từ chối!" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do từ chối văn bản..."
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận đã xem văn bản"
        open={openViewConfirmModal}
        onOk={handleViewDocument}
        onCancel={() => setOpenViewConfirmModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        centered
        maskClosable={false}
        confirmLoading={isSubmit}
      >
        <p>Bạn có chắc chắn xác nhận đã xem văn bản này không?</p>
      </Modal>

      <Modal
        title="Xác nhận nộp văn bản"
        open={openSubmitConfirmModal}
        onOk={handleSubmitDocument}
        onCancel={() => setOpenSubmitConfirmModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        centered
        maskClosable={false}
        confirmLoading={isSubmit}
      >
        <p>Bạn có chắc chắn xác nhận nộp văn bản này không?</p>
      </Modal>

      <CreateVersionModal
        openCreateVersionModal={openCreateVersionModal}
        setOpenCreateVersionModal={setOpenCreateVersionModal}
        documentId={documentId}
        fetchInfo={fetchInfo}
        taskId={document?.taskId}
      />
    </div>
  );
};

export default ViewDetailDocument;
