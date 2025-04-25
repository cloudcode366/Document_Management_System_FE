import React, { useState } from "react";
import {
  Modal,
  Upload,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Image,
  message,
  Form,
  Input,
  Divider,
} from "antd";
import { ColumnWidthOutlined, UploadOutlined } from "@ant-design/icons";
import {
  updateInsertNameSignatureImgAPI,
  updateSignatureImgAPI,
} from "@/services/api.service";

const { Title, Text, Paragraph } = Typography;

const UploadSignatureModal = () => {
  const [openUploadSignatureModal, setOpenUploadSignatureModal] =
    useState(true);
  const [initialPreview, setInitialPreview] = useState(null);
  const [digitalPreview, setDigitalPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialName, setInitialName] = useState("");
  const [digitalName, setDigitalName] = useState("");
  const [initialBlob, setInitialBlob] = useState(null);
  const [digitalBlob, setDigitalBlob] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const uploadToServer = async (file, name, type) => {
    try {
      const response = await updateInsertNameSignatureImgAPI(file, name);
      if (!response.data) throw new Error("Upload failed");

      const blob = response.data;

      const objectURL = URL.createObjectURL(blob);

      if (type === "initial") {
        setInitialPreview(objectURL);
        setInitialBlob(blob); // 👈 lưu lại blob gốc
      } else {
        setDigitalPreview(objectURL);
        setDigitalBlob(blob); // 👈 lưu lại blob gốc
      }
    } catch (err) {
      message.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
    }
  };

  const handleUpload = (file, type) => {
    const name = type === "initial" ? initialName : digitalName;
    uploadToServer(file, name, type);
  };

  const handleFinalSubmit = async () => {
    setIsSubmit(true);
    if (!initialBlob && !digitalBlob) {
      message.error("Bạn cần tải lên ít nhất một ảnh chữ ký.");
      return;
    }

    const normalFile = new File([initialBlob], "normal-signature.png", {
      type: "image/png",
    });
    const digitalFile = new File([digitalBlob], "digital-signature.png", {
      type: "image/png",
    });

    try {
      await updateSignatureImgAPI(normalFile, digitalFile);
      message.success("Gửi chữ ký thành công!");
      setTimeout(() => {
        window.location.reload(); // ✅ Reload lại trang sau khi gửi thành công
      }, 1000); // chờ 1s cho message hiển thị xong
    } catch (error) {
      console.error("Lỗi gửi chữ ký:", error);
      message.error("Có lỗi xảy ra khi gửi chữ ký.");
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      open={openUploadSignatureModal}
      closable={false}
      footer={null}
      centered
      width="60vw"
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={4}>
          Vui lòng cung cấp ảnh ký nháy và ảnh ký điện tử được tách nền lên hệ
          thống
        </Title>
        <Paragraph type="danger" style={{ marginTop: -8 }}>
          Nếu là lần đầu đăng nhập, bạn phải tải ảnh chữ ký nháy đã được tách
          nền lên hệ thống trước khi tiếp tục trải nghiệm!
        </Paragraph>
      </div>

      <Row gutter={24} align="middle">
        <Col span={11}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item label="Tên đại diện ảnh ký nháy">
              <Input
                placeholder="Nhập tên đại diện ảnh ký nháy"
                value={initialName}
                onChange={(e) => setInitialName(e.target.value)}
              />
            </Form.Item>

            <Upload
              accept="image/png"
              showUploadList={false}
              customRequest={({ file }) => {
                if (!initialName.trim()) {
                  message.warning(
                    "Vui lòng nhập tên ảnh ký nháy trước khi upload."
                  );
                  return;
                }
                handleUpload(file, "initial");
              }}
              beforeUpload={(file) => {
                const isPng = file.type === "image/png";
                if (!isPng) {
                  message.error("Chỉ chấp nhận ảnh định dạng PNG!");
                }
                return isPng || Upload.LIST_IGNORE;
              }}
            >
              <Button icon={<UploadOutlined />} block loading={loading}>
                Tải ảnh ký nháy
              </Button>
            </Upload>

            {initialPreview && (
              <Image
                src={initialPreview}
                alt="Ảnh ký nháy"
                style={{
                  borderRadius: 8,
                  maxHeight: 150,
                  objectFit: "contain",
                }}
              />
            )}
          </Space>
        </Col>

        <Col span={2} style={{ textAlign: "center" }}>
          <Divider type="vertical" style={{ height: "100%" }} />
          <ColumnWidthOutlined style={{ fontSize: 24, color: "#999" }} />
        </Col>

        <Col span={11}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item label="Tên ảnh ký điện tử">
              <Input
                placeholder="Nhập tên ảnh ký điện tử"
                value={digitalName}
                onChange={(e) => setDigitalName(e.target.value)}
              />
            </Form.Item>

            <Upload
              accept="image/png"
              showUploadList={false}
              customRequest={({ file }) => {
                if (!digitalName.trim()) {
                  message.warning(
                    "Vui lòng nhập tên ảnh ký điện tử trước khi upload."
                  );
                  return;
                }
                handleUpload(file, "digital");
              }}
              beforeUpload={(file) => {
                const isPng = file.type === "image/png";
                if (!isPng) {
                  message.error("Chỉ chấp nhận ảnh định dạng PNG!");
                }
                return isPng || Upload.LIST_IGNORE;
              }}
            >
              <Button icon={<UploadOutlined />} block loading={loading}>
                Tải ảnh ký điện tử
              </Button>
            </Upload>
            {digitalPreview && (
              <Image
                src={digitalPreview}
                alt="Ảnh ký điện tử"
                style={{
                  borderRadius: 8,
                  maxHeight: 150,
                  objectFit: "contain",
                }}
              />
            )}
          </Space>
        </Col>
      </Row>

      <Button
        type="primary"
        block
        onClick={handleFinalSubmit}
        loading={isSubmit}
        style={{ marginTop: 32 }}
        disabled={!initialPreview && !digitalPreview}
      >
        Xác nhận
      </Button>
    </Modal>
  );
};

export default UploadSignatureModal;
