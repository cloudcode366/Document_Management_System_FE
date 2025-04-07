import { Modal, Form, Upload, Button, Image, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const UpdateInitialSignature = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataUpdate,
    setDataUpdate,
    refreshTable,
  } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    dataUpdate ? dataUpdate.signature_image_url : null
  ); // Set ảnh mặc định là ảnh hiện tại

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        user_id: dataUpdate.user_id,
        fullName: dataUpdate.fullName,
        username: dataUpdate.username,
      });
    }
  }, [dataUpdate]);

  // Hàm xử lý khi thay đổi ảnh
  const handleUploadChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result); // base64 preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm xử lý khi người dùng submit form
  const handleFinish = (values) => {
    const updatedSignatureData = {
      ...dataUpdate, // Giữ nguyên các trường không thay đổi
      signature_image_url: imageUrl, // Thay đổi ảnh chữ ký
    };
    console.log("Cập nhật chữ ký nháy: ", updatedSignatureData);
    // Sau khi cập nhật thành công, có thể gọi API hoặc xử lý dữ liệu
    refreshTable();
    setDataUpdate(null);
    setOpenModalUpdate(false); // Đóng modal sau khi cập nhật
  };

  // Reset lại khi modal đóng
  const onClose = () => {
    form.resetFields(); // Reset các trường trong form
    setImageUrl(dataUpdate ? dataUpdate.signature_image_url : null); // Reset lại ảnh chữ ký
    setOpenModalUpdate(false); // Đóng modal
  };

  return (
    <Modal
      title="Cập nhật chữ ký nháy"
      width={"50vw"}
      open={openModalUpdate}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={"Cập nhật"}
      cancelText={"Hủy"}
      confirmLoading={isSubmit}
      maskClosable={false}
      centered={true}
      bodyProps={{
        style: {
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          hidden
          labelCol={{ span: 24 }}
          label="user_id"
          name="user_id"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }} label="Họ và tên" name="fullName">
          <Input disabled />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          label="Tên đăng nhập"
          name="username"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item label="Ảnh chữ ký">
          <Image
            src={imageUrl}
            alt="preview"
            width={200}
            style={{
              border: "1px solid #ccc",
              padding: 4,
              borderRadius: 4,
            }}
          />
        </Form.Item>

        <Form.Item
          name="signature_image_url"
          label="Tải lên ảnh chữ ký mới"
          rules={[{ required: true, message: "Vui lòng tải ảnh chữ ký mới!" }]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Không upload tự động
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateInitialSignature;
