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
} from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";

const UpdateProfile = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    reloadPage,
    setDataUpdate,
    dataUpdate,
  } = props;
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(dataUpdate?.avatar || "");
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        user_id: dataUpdate.user_id,
        fullName: dataUpdate.fullName,
        username: dataUpdate.username,
        email: dataUpdate.email,
        avatar: dataUpdate.avatar,
        phone_number: dataUpdate.phone_number,
        address: dataUpdate.address,
        gender: dataUpdate.gender,
        division_id: dataUpdate.division
          ? dataUpdate.division.division_id
          : undefined,
        position: dataUpdate.position,
        dateOfBirth: dataUpdate.DateOfBirth
          ? dayjs(dataUpdate.DateOfBirth)
          : null,
        role_id: dataUpdate.role ? dataUpdate.role.role_id : undefined,
        sub_role: dataUpdate.subRole ? dataUpdate.subRole.role_id : undefined,
        signature: "",
      });
      setImageUrl(dataUpdate.avatar);
    }
  }, [dataUpdate]);

  const handleImageChange = (info) => {
    const file = info.file;
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
      form.setFieldsValue({ avatar: newImageUrl });
    }
  };

  const onFinish = (values) => {
    // Giả sử bạn gửi dữ liệu đi và nhận lại kết quả thành công
    console.log("Updated values:", values);

    // Gọi hàm reload sau khi update thành công
    reloadPage();
  };

  return (
    <Modal
      title="Cập nhật hồ sơ"
      open={openModalUpdate}
      width={"60vw"}
      centered={true}
      bodyProps={{
        style: {
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
        form.resetFields();
      }}
      okText={"Cập nhật"}
      cancelText={"Hủy"}
      confirmLoading={isSubmit}
      maskClosable={false}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
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
          <Col span={24}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Vui lòng chọn giới tính">
                <Select.Option value="NAM">Nam</Select.Option>
                <Select.Option value="NỮ">Nữ</Select.Option>
                <Select.Option value="KHÁC">Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ảnh đại diện"
              name="avatar"
              rules={[
                { required: true, message: "Vui lòng chọn ảnh đại diện!" },
              ]}
            >
              <Image
                width={200}
                src={imageUrl}
                fallback="/default-avatar.png"
              />
              <Upload
                showUploadList={false}
                beforeUpload={() => false} // Không upload ngay, chỉ chọn ảnh
                onChange={handleImageChange}
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{ marginTop: 8, marginLeft: 20 }}
                >
                  Chọn ảnh mới
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateProfile;
