import React, { useState } from "react";
import {
  Card,
  Descriptions,
  Typography,
  Button,
  Divider,
  Tooltip,
  Input,
  Col,
  Row,
  Tag,
  App,
  Modal,
  Form,
} from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  ExportOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import samplePDF from "assets/files/sample.pdf";
import { useNavigate } from "react-router-dom";
import "./approve.document.scss";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import signatureImg from "assets/files/signature-removebg-preview.png";
import SignatureContainer from "@/components/client/documents/initial.signature/signature.container";

const { Title, Paragraph } = Typography;

const ApproveDocument = () => {
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const [openApproveConfirmModal, setOpenApproveConfirmModal] = useState(false);
  const [openRejectConfirmModal, setOpenRejectConfirmModal] = useState(false);
  const [rejectForm] = Form.useForm();

  const handleApproveDocument = () => {
    // Gửi dữ liệu lên server ở đây nếu cần
    message.success("Văn bản đã được duyệt thành công!");
    setOpenApproveConfirmModal(false);
    navigate("/detail-document");
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
            <iframe
              title="Document Viewer"
              src={samplePDF}
              style={{
                width: "100%",
                height: "75vh",
                border: "none",
                boxShadow: "0 10px 8px rgba(0, 0, 0, 0.1)",
              }}
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
            height: "90vh", // Chiều cao tối đa theo màn hình, trừ 32px margin
            display: "flex",
            flexDirection: "column",
            width: 400,
            minWidth: 300,
          }}
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Thông tin văn bản cần duyệt</span>
            </div>
          }
          bordered={true}
        >
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
            <Title level={4}>
              Văn bản quyết định 53/2025 QĐ-TTg chính sách nội trú học sinh,
              sinh viên học cao đẳng trung cấp
            </Title>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            ></Divider>
            <Title level={5}>Tổng quan văn bản</Title>
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ fontWeight: 500 }}
              style={{ marginBottom: "10px" }}
            >
              <Descriptions.Item label="Người tạo">
                locnht.it@gmail.com
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">10/02/2025</Descriptions.Item>
              <Descriptions.Item label="Ngày hết hạn">
                10/04/2025
              </Descriptions.Item>
              <Descriptions.Item label="Số hiệu văn bản">
                53/2025/QĐ-TTg
              </Descriptions.Item>
              <Descriptions.Item label="Loại văn bản">
                Quyết định
              </Descriptions.Item>
              <Descriptions.Item label="Luồng xử lý">
                Văn bản đi
              </Descriptions.Item>
            </Descriptions>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            ></Divider>
            <Title level={5}>Nội dung</Title>
            <Paragraph style={{ fontSize: 14 }}>
              Quyết định 53/2015/QĐ-TTg về chính sách nội trú đối với học sinh,
              sinh viên học cao đẳng, trung cấp công lập quy định đối tượng
              hưởng chính sách nội trú, mức hỗ trợ và các hỗ trợ khác, nguyên
              tắc thực hiện, phương thức chi trả, nguồn kinh phí thực hiện chính
              sách được ban hành ngày 20/10/2015.
            </Paragraph>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            ></Divider>
            <Row gutter={[12, 12]}>
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
          </div>

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

export default ApproveDocument;
