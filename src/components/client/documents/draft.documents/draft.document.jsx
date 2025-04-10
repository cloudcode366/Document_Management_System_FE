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
} from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import samplePDF from "assets/files/sample.pdf";
import { useNavigate } from "react-router-dom";
import "./draft.document.scss";
import DigitalSignature from "@/components/client/documents/digital.signature/digital.signature";

const { Title, Paragraph } = Typography;

const ViewDraftDocument = () => {
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const [openDigitalSignatureModal, setOpenDigitalSignatureModal] =
    useState(false);
  const [openSubmitConfirmModal, setOpenSubmitConfirmModal] = useState(false);

  const handleSubmitDocument = () => {
    // Gửi dữ liệu lên server ở đây nếu cần
    message.success("Văn bản đã được nộp thành công!");
    setOpenSubmitConfirmModal(false);
    // Điều hướng hoặc cập nhật UI nếu cần
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
            height: "90vh",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <iframe
            title="Document Viewer"
            src={samplePDF} // thay bằng URL động nếu cần
            style={{
              width: "100%",
              height: "90vh",
              border: "none",
            }}
          />
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
              <span>Thông tin văn bản nháp</span>
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
            <Title level={5}>Tổng quan văn bản nháp lần 1</Title>
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
                  icon={<EditOutlined style={{ color: "#1890ff" }} />}
                  block
                  size="middle"
                  style={{
                    height: 40,
                    fontSize: 16,
                    background: "#F4F5F6",
                  }}
                  onClick={() => {
                    setOpenDigitalSignatureModal(true);
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
                    background: "#F4F5F6",
                  }}
                  onClick={() => {
                    setOpenSubmitConfirmModal(true); // MỞ MODAL
                  }}
                >
                  Nộp văn bản
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
      <DigitalSignature
        openDigitalSignatureModal={openDigitalSignatureModal}
        setOpenDigitalSignatureModal={setOpenDigitalSignatureModal}
      />

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
        <p>Bạn có chắc chắn muốn nộp văn bản này không?</p>
      </Modal>
    </div>
  );
};

export default ViewDraftDocument;
