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
} from "@ant-design/icons";
import samplePDF from "assets/files/sample.pdf";
import { useNavigate, useParams } from "react-router-dom";
import "./view.detail.document.scss";
import CreateDraftDocument from "@/components/client/documents/draft.documents/create.draft.document";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import signatureImg from "assets/files/signature-removebg-preview.png";
import SignatureContainer from "@/components/client/documents/initial.signature/signature.container";
import { useCurrentApp } from "@/components/context/app.context";
import { BeatLoader } from "react-spinners";
import { viewDetailDocumentAPI } from "@/services/api.service";
import dayjs from "dayjs";
import { version } from "nprogress";
import { Document, Page, pdfjs } from "react-pdf";
import PDFViewerWithToken from "@/components/pdf.viewer";

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
  const [openModalCreateDraftDocument, setOpenModalCreateDraftDocument] =
    useState(false);
  const [openApproveConfirmModal, setOpenApproveConfirmModal] = useState(false);
  const [openRejectConfirmModal, setOpenRejectConfirmModal] = useState(false);
  const [openArchivedConfirmModal, setOpenArchivedConfirmModal] =
    useState(false);
  const [rejectForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const buttons = [];

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
      const taskType = data.tasks[0]?.taskType;
      setDocument({
        ...data,
        digitalSignatures,
        initalSignatures,
        finalVersion,
        rejectedVersions,
        taskType,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleApproveDocument = () => {
    // Gửi dữ liệu lên server ở đây nếu cần
    message.success("Văn bản đã được duyệt thành công!");
    setOpenApproveConfirmModal(false);
    navigate(`/detail-document/${documentId}`);
    // Điều hướng hoặc cập nhật UI nếu cần
  };
  const handleArchiveDocument = () => {
    // Gửi dữ liệu lên server ở đây nếu cần
    message.success("Văn bản đã được lưu trữ thành công!");
    setOpenArchivedConfirmModal(false);
    navigate(`/detail-document/${documentId}`);
    // Điều hướng hoặc cập nhật UI nếu cần
  };

  const handleRejectDocument = async () => {
    try {
      const values = await rejectForm.validateFields();
      console.log("Lý do từ chối:", values.reason); // Thay bằng logic xử lý thật
      setOpenRejectConfirmModal(false);
      notification.success({
        message: "Văn bản đã bị từ chối thành công!",
        description: `Lý do: ${values.reason}`,
      });
      rejectForm.resetFields(); // reset sau khi dùng
      message.success("Đã từ chối văn bản.");
    } catch (errorInfo) {
      // Nếu không nhập lý do thì sẽ báo lỗi
      console.log("Validation Failed:", errorInfo);
    }
  };

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
  if (document?.taskType === "Upload") {
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
        onClick={() => console.log("Tải văn bản")}
      >
        Tải văn bản lên
      </Button>
    );
  }

  if (document?.taskType === "Sign") {
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
        onClick={() => console.log("Ký")}
      >
        Ký điện tử
      </Button>
    );
  }

  if (document?.taskType === "Submit") {
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
        onClick={() => console.log("Nộp văn bản")}
      >
        Nộp văn bản
      </Button>
    );
  }

  if (document?.taskType === "Browse") {
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

  if (document?.taskType === "Browse") {
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

  if (document?.taskType === "Create") {
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
          navigate(`/init-progress/${documentId}`);
        }}
      >
        Khởi tạo nhiệm vụ
      </Button>
    );
  }

  if (document) {
    buttons.push(
      <Button
        icon={<SaveOutlined style={{ color: "#2f54eb" }} />}
        block
        size="middle"
        style={{
          height: 40,
          fontSize: 16,
          background: "#f0f5ff",
          border: "1px solid #adc6ff",
          color: "#2f54eb",
          fontWeight: 600,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#e6f4ff";
          e.currentTarget.style.border = "1px solid #91d5ff";
          e.currentTarget.style.color = "#1d39c4";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#f0f5ff";
          e.currentTarget.style.border = "1px solid #adc6ff";
          e.currentTarget.style.color = "#2f54eb";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onClick={() => {
          setOpenArchivedConfirmModal(true);
        }}
      >
        Lưu trữ văn bản
      </Button>
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
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Luồng xử lý:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
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
                {dayjs(document?.dateReceived).format("DD-MM-YYYY HH:mm")}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Ngày ban hành:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {dayjs(document?.dateIssued).format("DD-MM-YYYY HH:mm")}
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
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              {/* Người ký + tên đầu tiên */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#5f6368" }}>Người ký:</span>
                <span style={{ fontWeight: 500, marginBottom: 4 }}>
                  {document?.digitalSignatures?.[0]?.signerName}
                </span>
              </div>

              {/* Các tên còn lại */}
              <div style={{ textAlign: "right", fontWeight: 500 }}>
                {document?.digitalSignatures?.slice(1).map((sig, index) => (
                  <div key={index} style={{ marginBottom: 4 }}>
                    {sig.signerName}
                  </div>
                ))}
              </div>
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
                    <Tooltip title="Xem chi tiết" key="view">
                      <EyeOutlined
                        style={{ fontSize: 18, color: "#1890ff" }}
                        onClick={() => {
                          navigate("/draft-document");
                        }}
                      />
                    </Tooltip>,
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
                    description={`Ngày tạo: ${item.createdDate}`}
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
                onClick={() => navigate(-1)}
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
        title="Xác nhận lưu trữ văn bản"
        open={openArchivedConfirmModal}
        onOk={handleArchiveDocument}
        onCancel={() => setOpenArchivedConfirmModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        centered
        maskClosable={false}
      >
        <p>Bạn có chắc chắn muốn lưu trữ văn bản này không?</p>
      </Modal>

      <Modal
        title="Xác nhận từ chối văn bản"
        open={openRejectConfirmModal}
        onOk={handleRejectDocument}
        onCancel={() => {
          setOpenRejectConfirmModal(false);
          rejectForm.resetFields(); // reset nếu người dùng huỷ
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
    </div>
  );
};

export default ViewDetailDocument;
