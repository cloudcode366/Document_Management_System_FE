import { App, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { createUserByFormAPI } from "@/services/api.service";

const CreateUser = (props) => {
  const {
    openModalCreate,
    setOpenModalCreate,
    refreshTable,
    divisions,
    roles,
  } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const divisionList = divisions.filter((division) => !division.isDeleted);

  const onFinish = async (values) => {
    const {
      fullName,
      userName,
      email,
      phoneNumber,
      identityCard,
      divisionId,
      roleId,
      dateOfBirth,
      position,
      address,
      gender,
    } = values;
    setIsSubmit(true);
    const res = await createUserByFormAPI(
      fullName,
      userName,
      email,
      phoneNumber,
      identityCard,
      divisionId,
      roleId,
      dateOfBirth,
      position,
      address,
      gender
    );
    if (res && res.data && res.data.statusCode === 201) {
      message.success(`Tạo mới tài khoản thành công`);
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title={
          <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
            Tạo mới tài khoản
          </div>
        }
        width={"80vw"}
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalCreate(false);
          setIsSubmit(false);
          form.resetFields();
        }}
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
                label="Tên đăng nhập"
                name="userName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input />
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
                label="Căn cước công dân"
                name="identityCard"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập căn cước công dân!",
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
            <Col span={12}>
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const age = dayjs().diff(value, "year");
                      return age >= 18
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Người dùng phải ít nhất 18 tuổi!")
                          );
                    },
                  },
                ]}
              >
                <DatePicker
                  format="DD-MM-YYYY"
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
                  {divisionList.map((division) => (
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
            <Col span={12}>
              <Form.Item
                label="Vai trò"
                name="roleId"
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
                  {roles.map((role) => (
                    <Select.Option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;
