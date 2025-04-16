import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Upload,
  Image,
  message,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { updateAvatarAPI, updateProfileAPI } from "@/services/api.service";

const UpdateProfile = ({
  openModalUpdate,
  setOpenModalUpdate,
  setDataUpdate,
  dataUpdate,
  reloadPage,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("/default-avatar.png");
  const [avatarRawUrl, setAvatarRawUrl] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (openModalUpdate && dataUpdate) {
      const { userId, fullName, avatar, address, gender, dateOfBirth } =
        dataUpdate;

      const avatarWithTimestamp = avatar
        ? `${avatar}?t=${Date.now()}`
        : "/default-avatar.png";

      form.setFieldsValue({
        userId,
        fullName,
        avatar: avatar || "",
        address,
        gender,
        dateOfBirth: dateOfBirth ? dayjs(dateOfBirth) : null,
      });

      setImageUrl(avatarWithTimestamp);
      setAvatarRawUrl(avatar || "");
    }
  }, [openModalUpdate, dataUpdate, form]);

  const handleImageChange = async (info) => {
    const file = info.file;
    if (!file) return;

    try {
      const res = await updateAvatarAPI(dataUpdate.userId, file);
      const newAvatarUrl = res?.data?.content;
      if (newAvatarUrl) {
        setAvatarRawUrl(newAvatarUrl);
        setImageUrl(`${newAvatarUrl}?t=${Date.now()}`);
        form.setFieldsValue({ avatar: newAvatarUrl });
        message.success("Tải ảnh đại diện thành công!");
      } else {
        message.error("Không nhận được đường dẫn ảnh từ server.");
      }
    } catch (err) {
      console.error("Upload avatar failed:", err);
      message.error("Tải ảnh lên thất bại.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmit(true);
      const { address, dateOfBirth, gender } = values;
      await updateProfileAPI(
        dataUpdate.userId,
        address,
        dateOfBirth ? dayjs(dateOfBirth).format("YYYY-MM-DD") : null,
        gender,
        avatarRawUrl
      );

      message.success("Cập nhật hồ sơ thành công!");
      handleClose();
      reloadPage();
    } catch (error) {
      console.error("Update profile failed:", error);
      message.error("Cập nhật hồ sơ thất bại.");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleClose = () => {
    setOpenModalUpdate(false);
    setDataUpdate(null);
    setImageUrl("");
    setAvatarRawUrl("");
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
          Cập nhật hồ sơ
        </div>
      }
      open={openModalUpdate}
      width={"60vw"}
      centered
      bodyProps={{
        style: {
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
      onOk={() => form.submit()}
      onCancel={handleClose}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Vui lòng chọn giới tính">
                <Select.Option value="MALE">Nam</Select.Option>
                <Select.Option value="FEMALE">Nữ</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="dateOfBirth"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker
                format="DD - MM - YYYY"
                style={{ width: "100%" }}
                placeholder="Vui lòng chọn ngày sinh"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Ảnh đại diện"
              name="avatar"
              rules={[
                { required: true, message: "Vui lòng chọn ảnh đại diện!" },
              ]}
            >
              <>
                <Image
                  width={200}
                  src={imageUrl}
                  fallback="/default-avatar.png"
                />
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{ marginTop: 8, marginLeft: 20 }}
                  >
                    Chọn ảnh mới
                  </Button>
                </Upload>
              </>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateProfile;
