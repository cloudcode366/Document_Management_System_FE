import { Modal, Form, Select, Upload, Button, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Option } = Select;

const CreateInitialSignature = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable, users } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

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
    // Chuyển thông tin về chữ ký nháy ở đây
    const signatureData = {
      ...values,
      signature_image_url: imageUrl, // Thêm URL ảnh
    };
    console.log("Tạo chữ ký nháy: ", signatureData);
    // Sau khi tạo thành công, có thể gọi API hoặc xử lý dữ liệu
    // Refresh bảng nếu cần
    refreshTable();
    setOpenModalCreate(false); // Đóng modal sau khi tạo
  };

  // Reset lại khi modal đóng
  useEffect(() => {
    if (!openModalCreate) {
      form.resetFields();
      setImageUrl(null);
    }
  }, [openModalCreate]);

  return (
    <Modal
      title="Tạo mới chữ ký nháy"
      width={"50vw"}
      open={openModalCreate}
      onCancel={() => setOpenModalCreate(false)} // Đóng modal khi cancel
      onOk={() => form.submit()} // Xử lý khi nhấn lưu
      okText={"Tạo mới"}
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
          name="user_id"
          label="Người dùng"
          rules={[{ required: true, message: "Vui lòng chọn người dùng!" }]}
        >
          <Select
            showSearch
            placeholder="Tìm theo tên hoặc tên đăng nhập"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {users?.map((user) => (
              <Option key={user.user_id} value={user.user_id}>
                {user.fullName} ({user.username})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="signature_image"
          label="Tải lên ảnh chữ ký"
          rules={[{ required: true, message: "Vui lòng tải ảnh chữ ký!" }]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Không upload tự động
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* {imageUrl && (
          <Form.Item label="Xem trước chữ ký">
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
        )} */}
      </Form>
    </Modal>
  );
};

export default CreateInitialSignature;
