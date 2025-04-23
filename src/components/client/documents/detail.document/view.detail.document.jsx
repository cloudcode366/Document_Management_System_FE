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
      setDocument({
        ...data,
        digitalSignatures,
        initalSignatures,
        finalVersion,
        rejectedVersions,
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
              <span style={{ color: "#5f6368" }}>Người ký:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {document?.digitalSignatures}
              </span>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
                Danh sách các phiên bản
              </Typography.Text>
              <Button
                type="primary"
                size="middle"
                style={{
                  padding: "10px 12px",
                }}
                key="buttonAddNew"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenModalCreateDraftDocument(true);
                }}
              >
                Tạo bản nháp
              </Button>
            </div>

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
            <Row gutter={[12, 12]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Button
                  icon={<EditOutlined style={{ color: "#1890ff" }} />}
                  block
                  size="middle"
                  style={{
                    height: 40,
                    fontSize: 16,
                    background: "#e6f4ff", // xanh dương nhạt
                    border: "1px solid #91d5ff", // viền xanh nhạt
                  }}
                >
                  Ký điện tử
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  icon={<ExportOutlined style={{ color: "#fa8c16" }} />}
                  block
                  size="middle"
                  style={{
                    height: 40,
                    fontSize: 16,
                    background: "#fff7e6", // cam nhạt
                    border: "1px solid #ffd591", // viền cam nhạt
                  }}
                >
                  Nộp văn bản
                </Button>
              </Col>
            </Row>

            <Row gutter={[12, 12]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Button
                  icon={<CloseOutlined style={{ color: "#ff4d4f" }} />}
                  block
                  size="middle"
                  style={{
                    height: 40,
                    fontSize: 16,
                    background: "#fff1f0", // đỏ nhạt
                    border: "1px solid #ffa39e", // viền đỏ nhẹ
                  }}
                  onClick={() => {
                    setOpenRejectConfirmModal(true);
                  }}
                >
                  Từ chối văn bản
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  icon={<CheckOutlined style={{ color: "#52c41a" }} />}
                  block
                  size="middle"
                  style={{
                    height: 40,
                    fontSize: 16,
                    background: "#f6ffed", // xanh lá nhạt
                    border: "1px solid #b7eb8f", // viền xanh lá nhạt
                  }}
                  onClick={() => {
                    setOpenApproveConfirmModal(true);
                  }}
                >
                  Duyệt văn bản
                </Button>
              </Col>
            </Row>
            <Row gutter={[12, 12]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Button
                  icon={<SaveOutlined style={{ color: "#2f54eb" }} />} // icon màu geekblue
                  block
                  size="middle"
                  style={{
                    height: 40,
                    fontSize: 16,
                    background: "#f0f5ff", // nền geekblue nhạt
                    border: "1px solid #adc6ff", // viền geekblue nhạt
                    color: "#2f54eb", // màu chữ chính
                  }}
                  onClick={() => {
                    setOpenArchivedConfirmModal(true);
                  }}
                >
                  Lưu trữ văn bản
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
