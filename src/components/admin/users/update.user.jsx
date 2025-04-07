import {
  App,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";

const UpdateUser = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(dataUpdate?.avatar || "");

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

  const departmentOptions = [
    { id: 1, name: "Phòng Nhân sự" },
    { id: 2, name: "Phòng Kế toán" },
    { id: 3, name: "Phòng IT" },
  ];

  const roleOptions = [
    { id: 1, name: "LEADER" },
    { id: 2, name: "DIVISION HEAD" },
    { id: 3, name: "CHIEF" },
    { id: 4, name: "CLERICAL ASSISTANT" },
    { id: 5, name: "SPECIALIST" },
  ];

  const onFinish = async (values) => {
    // const { _id, fullName, phone } = values;
    // setIsSubmit(true);
    // const res = await updateUserAPI(_id, fullName, phone);
    // if (res && res.data) {
    //   message.success(`Cập nhật user thành công`);
    //   form.resetFields();
    //   setOpenModalUpdate(false);
    //   setDataUpdate(null);
    //   refreshTable();
    // } else {
    //   notification.error({
    //     message: "Đã có lỗi xảy ra",
    //     description: res.message,
    //   });
    // }
    // setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title="Cập nhật người dùng"
        open={openModalUpdate}
        width={"80vw"}
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
        <Divider />
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone_number"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại gồm 10 chữ số!",
                  },
                ]}
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
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Vui lòng chọn giới tính">
                  <Select.Option value="NAM">Nam</Select.Option>
                  <Select.Option value="NỮ">Nữ</Select.Option>
                  <Select.Option value="KHÁC">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Vui lòng chọn ngày sinh"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  } // Không cho chọn ngày trong tương lai
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phòng ban"
                name="division_id"
                rules={[
                  { required: true, message: "Vui lòng chọn phòng ban!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Vui lòng chọn phòng ban"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {departmentOptions.map((dept) => (
                    <Select.Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Chức vụ"
                name="position"
                rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Vai trò"
                name="role_id"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select
                  showSearch
                  placeholder="Vui lòng chọn vai trò"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {roleOptions.map((role) => (
                    <Select.Option key={role.id} value={role.id}>
                      {role.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vai trò phụ"
                name="sub_role"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select
                  showSearch
                  placeholder="Vui lòng chọn vai trò"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {roleOptions.map((role) => (
                    <Select.Option key={role.id} value={role.id}>
                      {role.name}
                    </Select.Option>
                  ))}
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
                  width={150}
                  src={imageUrl}
                  fallback="/default-avatar.png"
                />
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false} // Không upload ngay, chỉ chọn ảnh
                  onChange={handleImageChange}
                >
                  <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                    Chọn ảnh mới
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateUser;
