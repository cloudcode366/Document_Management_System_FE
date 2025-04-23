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
import samplePDF from "assets/files/sample.pdf";
import { useNavigate, useParams } from "react-router-dom";
import "./view.detail.document.scss";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import signatureImg from "assets/files/signature-removebg-preview.png";
import SignatureContainer from "@/components/client/documents/initial.signature/signature.container";
import { PiHandWithdraw } from "react-icons/pi";
import { BeatLoader } from "react-spinners";
import { viewArchivedDocumentDetailAPI } from "@/services/api.service";
import dayjs from "dayjs";
import PDFViewerWithToken from "@/components/pdf.viewer";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ViewDetailArchivedDocument = () => {
  const { message, notification } = App.useApp();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);

  const [openEmailModal, setOpenEmailModal] = useState(false);

  // const [emailForm, setEmailForm] = useState({
  //   from: "",
  //   to: "",
  //   cc: "",
  //   bcc: "",
  //   subject: "",
  //   content: "",
  // });
  const [emailForm, setEmailForm] = useState({
    from: [],
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    content: "",
  });

  const handleSendEmail = () => {
    if (emailForm.to.length === 0 || !emailForm.subject || !emailForm.content) {
      message.warning(
        "Vui lòng điền đầy đủ thông tin bắt buộc (Đến, Tiêu đề, Nội dung)!"
      );
      return;
    }

    // Validate email (tùy chọn)
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

    // Giả lập gửi email thành công
    console.log("Gửi email:", emailForm);
    message.success("Email đã được gửi thành công!");
    setOpenEmailModal(false);
    setEmailForm({
      from: "",
      to: [],
      cc: [],
      bcc: [],
      subject: "",
      content: "",
    });
  };

  /// Cấp quyền xem
  const [openShareModal, setOpenShareModal] = useState(false); // Trạng thái mở/đóng modal
  const [selectedUsers, setSelectedUsers] = useState([]); // Danh sách người dùng được chọn

  // Danh sách người dùng (giả lập, bạn có thể thay bằng dữ liệu từ API)
  const users = [
    { id: 1, name: "Lê Phan Hoài Nam", email: "namlee180505@gmail.com" },
    { id: 2, name: "Hà Công Hiếu", email: "hieu.hc@gmail.com" },
    { id: 3, name: "Ngô Huỳnh Tấn Lộc", email: "locnht.it@gmail.com" },
    { id: 4, name: "Tạ Gia Nhật Minh", email: "minh.tgn@gmail.com" },
  ];

  const fetchInfo = async () => {
    setLoading(true);
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Xử lý khi nhấn nút "Xác nhận"
  const handleShare = () => {
    if (selectedUsers.length === 0) {
      message.warning("Vui lòng chọn ít nhất một người dùng!");
      return;
    }

    // Logic cấp quyền xem (giả lập, bạn có thể thay bằng API)
    console.log("Cấp quyền xem cho:", selectedUsers);
    message.success(`Đã cấp quyền xem cho ${selectedUsers.length} người dùng!`);

    // Đóng modal và reset danh sách người dùng được chọn
    setOpenShareModal(false);
    setSelectedUsers([]);
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
            <div>
              <h2
                style={{ fontSize: "20px", fontWeight: 600, margin: "4px 0" }}
              >
                {/* {taskData.taskDto.title} */}
              </h2>

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
                  {document?.scope}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Người ký:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {document?.digitalSignatures?.map((item) => (
                    <Tag
                      key={item.name}
                      color="blue"
                      // closable={item.isNew}
                      // onClose={() => handleRemoveSigner(item.name)}
                      // style={{ display: "flex", alignItems: "center" }}
                    >
                      {item.name}
                    </Tag>
                  ))}
                </span>
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

            <Row gutter={[12, 12, 24]}>
              <Col span={12}>
                <Button
                  icon={<ShareAltOutlined style={{ color: "#fa8c16" }} />}
                  block
                  size="middle"
                  onClick={() => setOpenShareModal(true)} // Mở modal khi nhấn nút
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
                <Button
                  icon={<MailOutlined style={{ color: "#fa8c16" }} />}
                  block
                  size="middle"
                  onClick={() => setOpenEmailModal(true)} // Mở modal khi nhấn nút "Gửi Email"
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

      {/* Modal open email */}
      <Modal
        open={openEmailModal}
        onCancel={() => {
          setOpenEmailModal(false);
          setEmailForm({
            from: "",
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
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map((user) => (
              <Select.Option
                key={user.email}
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
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map((user) => (
              <Select.Option
                key={user.email}
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
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map((user) => (
              <Select.Option
                key={user.email}
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

      {/* Modal grant view permission */}
      <Modal
        title="Cấp quyền xem"
        open={openShareModal}
        onOk={handleShare} // Xử lý khi nhấn "Xác nhận"
        onCancel={() => {
          setOpenShareModal(false);
          setSelectedUsers([]); // Reset danh sách khi đóng modal
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
            mode="multiple" // Cho phép chọn nhiều người dùng
            placeholder="Chọn người dùng để cấp quyền"
            value={selectedUsers}
            onChange={(value) => setSelectedUsers(value)} // Cập nhật danh sách người dùng được chọn
            showSearch // Hiển thị thanh tìm kiếm
            filterOption={
              (input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase()) // Lọc theo name (label)
            }
            style={{ width: "100%" }}
            optionLabelProp="label"
          >
            {users.map((user) => (
              <Select.Option key={user.id} value={user.id} label={user.name}>
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
      </Modal>
    </div>
  );
};

export default ViewDetailArchivedDocument;
