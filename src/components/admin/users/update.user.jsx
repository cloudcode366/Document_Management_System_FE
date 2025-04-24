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
import { updateAvatarAPI, updateUserByAdminAPI } from "@/services/api.service";

const UpdateUser = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
    divisions,
    subRoles,
  } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("/default-avatar.png");
  const [avatarRawUrl, setAvatarRawUrl] = useState("");
  const [signatureImageUrl, setSignatureImageUrl] = useState(
    "/default-avatar.png"
  );
  const [signatureRawUrl, setSignatureRawUrl] = useState("");

  useEffect(() => {
    if (openModalUpdate && dataUpdate) {
      const {
        fullName,
        email,
        address,
        phoneNumber,
        gender,
        dateOfBirth,
        position,
        divisionId,
        avatar,
        signature,
      } = dataUpdate;

      const avatarWithTimestamp = avatar
        ? `${avatar}?t=${Date.now()}`
        : "/default-avatar.png";

      const signatureWithTimestamp = signature
        ? `${signature}?t=${Date.now()}`
        : "/default-avatar.png";

      form.setFieldsValue({
        fullName,
        email,
        address,
        phoneNumber,
        gender,
        dateOfBirth: dateOfBirth ? dayjs(dateOfBirth) : null,
        position,
        divisionId,
        avatar: avatar || "",
        signature: signature || "",
      });

      setImageUrl(avatarWithTimestamp);
      setAvatarRawUrl(avatar || "");
      setSignatureImageUrl(signatureWithTimestamp);
      setSignatureRawUrl(avatar || "");
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

  const handleSignatureImageChange = async (info) => {
    // const file = info.file;
    // if (!file) return;
    // try {
    //   const res = await updateAvatarAPI(dataUpdate.userId, file);
    //   const newAvatarUrl = res?.data?.content;
    //   if (newAvatarUrl) {
    //     setAvatarRawUrl(newAvatarUrl);
    //     setImageUrl(`${newAvatarUrl}?t=${Date.now()}`);
    //     form.setFieldsValue({ avatar: newAvatarUrl });
    //     message.success("Tải ảnh đại diện thành công!");
    //   } else {
    //     message.error("Không nhận được đường dẫn ảnh từ server.");
    //   }
    // } catch (err) {
    //   console.error("Upload avatar failed:", err);
    //   message.error("Tải ảnh lên thất bại.");
    // }
  };

  const onFinish = async (values) => {
    try {
      setIsSubmit(true);
      const {
        fullName,
        email,
        address,
        phoneNumber,
        gender,
        dateOfBirth,
        position,
        divisionId,
        subRoleId,
      } = values;
      await updateUserByAdminAPI(
        dataUpdate.userId,
        fullName,
        email,
        address,
        phoneNumber,
        gender,
        dateOfBirth ? dayjs(dateOfBirth).format("YYYY-MM-DD") : null,
        position,
        divisionId,
        avatarRawUrl,
        subRoleId
      );

      message.success(`Cập nhật tài khoản ${dataUpdate.userName} thành công!`);
      handleClose();
      refreshTable();
    } catch (error) {
      console.error("Update user failed:", error);
      notification.error({ message: "Cập nhật tài khoản thất bại!" });
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
    <>
      <Modal
        title={
          <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
            Cập nhật tài khoản
          </div>
        }
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
        onCancel={handleClose}
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
              <Form.Item label="Vai trò phụ" name="subRoleId">
                <Select
                  showSearch
                  placeholder="Vui lòng chọn vai trò phụ"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {subRoles.map((role) => (
                    <Select.Option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
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
                label="Phòng ban"
                name="divisionId"
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
                  {divisions.map((division) => (
                    <Select.Option
                      key={division.divisionId}
                      value={division.divisionId}
                    >
                      {division.divisionName}
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
            <Col span={8}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Vui lòng chọn giới tính">
                  <Select.Option value="MALE">Nam</Select.Option>
                  <Select.Option value="FEMALE">Nữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
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

          <Row>
            <Col span={12}>
              <Form.Item label="Ảnh chữ ký" name="signature">
                <Image
                  width={150}
                  src={
                    "https://chukydep.vn/Upload/chuky/loc/chu-ky-ten-loc-sm_fontss_139-otf-sm.png"
                  }
                  fallback="/default-avatar.png"
                />
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleSignatureImageChange}
                >
                  <Button
                    icon={<UploadOutlined />}
                    type="link"
                    style={{ marginLeft: 8, marginTop: 8 }}
                  >
                    Chọn ảnh chữ ký mới
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ảnh chữ ký" name="signature">
                <Image
                  width={150}
                  src={
                    "https://chukydep.vn/Upload/chuky/loc/chu-ky-ten-loc-sm_fontss_139-otf-sm.png"
                  }
                  fallback="/default-avatar.png"
                />
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleSignatureImageChange}
                >
                  <Button
                    icon={<UploadOutlined />}
                    type="link"
                    style={{ marginLeft: 8, marginTop: 8 }}
                  >
                    Chọn ảnh chữ ký mới
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={24}>
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
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                >
                  <Button
                    icon={<UploadOutlined />}
                    type="link"
                    style={{ marginLeft: 8, marginTop: 8 }}
                  >
                    Chọn ảnh đại diện mới
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
