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
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ExportOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
  SaveOutlined,
  SolutionOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "./view.detail.document.scss";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import signatureImg from "assets/files/signature-removebg-preview.png";
import SignatureContainer from "@/components/client/documents/initial.signature/signature.container";
import { useCurrentApp } from "@/components/context/app.context";
import { BeatLoader } from "react-spinners";
import {
  createHandleTaskActionAPI,
  createRejectDocumentActionAPI,
  viewDetailDocumentAPI,
} from "@/services/api.service";
import dayjs from "dayjs";
import { Document, Page, pdfjs } from "react-pdf";
import PDFViewerWithToken from "@/components/pdf.viewer";
import CreateVersionModal from "./create.version.modal";
import { version } from "nprogress";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

      const currentTask = data.tasks.find((task) => {
        return task.status === "InProgress";
      });
      const taskType = currentTask?.taskType;
      const taskId = currentTask?.taskId;
      const taskStatus = currentTask?.status;
      console.log("currentTask", currentTask);
      setDocument({
        ...data,
        digitalSignatures,
        initalSignatures,
        finalVersion,
        rejectedVersions,
        taskType,
        taskId,
        taskStatus,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

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
        description: "Văn bản đã được duyệt thành công.",
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
            },
          })
        }
      >
        Ký điện tử
      </Button>
    );
  }

  // Nộp văn bản: đã xử lý
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

  // Từ chối: đã xử lý
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

  // Duyệt văn bản: đã xử lý
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

  // Khởi tạo nhiệm vụ: đã xử lý
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

  // Đã xem văn bản: đã xử lý
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
              url={document?.finalVersion?.url}
              token={localStorage.getItem(`access_token`)}
            />

            {/* Signature section */}
            <SignatureContainer>
              <div style={{ display: "inline-block", marginRight: 12 }}>
                <SignatureBox
                  name="Lê Phan Hoài Nam"
                  time="16:05 - 20/03/2025"
                  signatureImage={signatureImg}
                />
              </div>
              <div style={{ display: "inline-block", marginRight: 12 }}>
                <SignatureBox
                  name="Hà Công Hiếu"
                  time="16:05 - 21/03/2025"
                  signatureImage={signatureImg}
                />
              </div>
              <div style={{ display: "inline-block", marginRight: 12 }}>
                <SignatureBox
                  name="Ngô Huỳnh Tấn Lộc"
                  time="16:05 - 22/03/2025"
                  signatureImage={signatureImg}
                />
              </div>
              <div style={{ display: "inline-block", marginRight: 12 }}>
                <SignatureBox
                  name="Tạ Gia Nhật Minh"
                  time="16:05 - 23/04/2025"
                  signatureImage={signatureImg}
                />
              </div>
            </SignatureContainer>
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
            ></Divider>
            <Title level={5}>Tổng quan văn bản</Title>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Số hiệu văn bản:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {document?.numberOfDocument}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Loại văn bản:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {document?.documentTypeName}
              </span>
            </div>
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
                  maxWidth: "50%",
                  wordBreak: "break-word",
                }}
              >
                {document?.workflowName}
              </span>
            </div>

            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Người gửi:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {document?.sender}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Người tạo:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {document?.createdBy}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Ngày nhận:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {document?.dateReceived &&
                  dayjs(document?.dateReceived).format("DD-MM-YYYY HH:mm")}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Ngày ban hành:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {document?.dateIssued &&
                  dayjs(document?.dateIssued).format("DD-MM-YYYY HH:mm")}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Ngày hết hiệu lực:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {dayjs(document?.dateExpires).format("DD-MM-YYYY HH:mm")}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Ngày hết hạn:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {dayjs(document?.deadline).format("DD-MM-YYYY HH:mm")}
              </span>
            </div>
            {/* <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#5f6368" }}>Người ký:</span>
                <span style={{ fontWeight: 500, marginBottom: 4 }}>
                  {document?.digitalSignatures?.[0]?.signerName}
                </span>
              </div>
  
              <div style={{ textAlign: "right", fontWeight: 500 }}>
                {document?.digitalSignatures?.slice(1).map((sig, index) => (
                  <div key={index} style={{ marginBottom: 4 }}>
                    {sig.signerName}
                  </div>
                ))}
              </div>
            </div> */}
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <span style={{ color: "#5f6368", whiteSpace: "nowrap" }}>
                  Người ký:
                </span>

                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    wordBreak: "break-word",
                    fontWeight: 500,
                    display: "inline-block",
                    maxWidth: "50%",
                  }}
                >
                  {/* Người ký đầu tiên */}
                  <span>{document?.digitalSignatures?.[0]?.signerName}</span>
                </div>
              </div>

              {/* Các tên còn lại */}
              {document?.digitalSignatures?.slice(1).map((sig, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: "right",
                    fontWeight: 500,
                    wordBreak: "break-word",
                    marginTop: 4,
                    maxWidth: "70%",
                  }}
                >
                  {sig.signerName}
                </div>
              ))}
            </div>

            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            ></Divider>
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

            <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
              Danh sách các phiên bản
            </Typography.Text>

            <List
              itemLayout="horizontal"
              dataSource={document?.versions}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    !item.isFinal && (
                      <Tooltip title="Xem chi tiết" key="view">
                        <EyeOutlined
                          style={{ fontSize: 18, color: "#1890ff" }}
                          onClick={() => {
                            navigate("/version-document", {
                              state: {
                                version: item,
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
                          Phiên bản thứ {item.versionNumber}
                        </Typography.Text>
                      </Space>
                    }
                    description={`Ngày tạo: ${dayjs(item?.createdDate).format(
                      "DD-MM-YYYY"
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

            <ActionButtonsGroup buttons={buttons} />

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
                onClick={() => navigate("/")}
              >
                Quay lại
              </Button>
            </div>
          </div>
        </Card>
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
