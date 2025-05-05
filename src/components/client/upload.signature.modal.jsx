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
  Radio,
} from "antd";
import { ColumnWidthOutlined, UploadOutlined } from "@ant-design/icons";
import {
  updateInsertNameSignatureImgAPI,
  updateSignatureImgAPI,
} from "@/services/api.service";
import { useCurrentApp } from "../context/app.context";
import { BeatLoader } from "react-spinners";

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
  const { user } = useCurrentApp();
  const [isUSB, setIsUSB] = useState(false);

  const uploadToServer = async (file, name, type) => {
    try {
      const response = await updateInsertNameSignatureImgAPI(file, name);
      if (!response.data) throw new Error("Upload failed");

      const blob = response.data;

      const objectURL = URL.createObjectURL(blob);

      if (type === "initial") {
        setInitialPreview(objectURL);
        setInitialBlob(blob);
      } else {
        setDigitalPreview(objectURL);
        setDigitalBlob(blob);
      }
    } catch (err) {
      message.error(
        "Kích thước hình ảnh phải lớn hơn 300x150 và nhỏ hơn 330x200."
      );
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
      message.success("Xác nhận ảnh chữ ký lên hệ thống thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Lỗi gửi chữ ký:", error);
      message.error("Có lỗi xảy ra khi xác nhận chữ ký.");
    }
    setIsSubmit(false);
  };

  if (isSubmit) {
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
    <Modal
      open={openUploadSignatureModal}
      closable={false}
      footer={null}
      loading={isSubmit}
      centered
      width="50vw"
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={4}>
          Vui lòng cung cấp các ảnh chữ ký được tách nền lên hệ thống
        </Title>
        <Paragraph type="danger" style={{ marginTop: -8, fontSize: 16 }}>
          Nếu là lần đầu đăng nhập, bạn phải tải ảnh chữ ký nháy đã được tách
          nền lên hệ thống trước khi tiếp tục trải nghiệm!
        </Paragraph>
      </div>

      <Row
        gutter={24}
        align="middle"
        justify={
          user?.mainRole?.roleName !== "Chief" &&
          !user?.subRole?.roleName?.endsWith("_Chief") &&
          user?.mainRole?.roleName !== "Leader" &&
          !user?.subRole?.roleName?.endsWith("_Leader")
            ? "center"
            : "start"
        }
      >
        <Col
          span={
            user?.mainRole?.roleName !== "Chief" &&
            !user?.subRole?.roleName?.endsWith("_Chief") &&
            user?.mainRole?.roleName !== "Leader" &&
            !user?.subRole?.roleName?.endsWith("_Leader")
              ? 18
              : 12
          }
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item label="Tên đại diện ảnh chữ ký nháy">
              <Input
                placeholder="Nhập tên đại diện ảnh chữ ký nháy"
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
                Tải ảnh chữ ký nháy
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
        {(user?.mainRole?.roleName === "Chief" ||
          user?.subRole?.roleName?.endsWith("_Chief") ||
          user?.mainRole?.roleName === "Leader" ||
          user?.subRole?.roleName?.endsWith("_Leader")) && (
          <>
            <Col span={12}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Form.Item label="Tên đại diện ảnh chữ ký điện tử">
                  <Input
                    placeholder="Nhập tên ảnh chữ ký điện tử"
                    value={digitalName}
                    onChange={(e) => setDigitalName(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Phương thức ký">
                  <Radio.Group
                    value={isUSB ? "USB" : "API"}
                    onChange={(e) => setIsUSB(e.target.value === "USB")}
                  >
                    <Radio value="API">Ký Online</Radio>
                    <Radio value="USB">Ký bằng USB Token</Radio>
                  </Radio.Group>
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
                    Tải ảnh chữ ký điện tử
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
          </>
        )}
      </Row>
      <Row gutter={24} align="middle" justify="center">
        <Col span={10}>
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
        </Col>
      </Row>
    </Modal>
  );
};

export default UploadSignatureModal;
