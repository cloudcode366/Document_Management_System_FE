import { createSubRoleAPI } from "@/services/api.service";
import { convertRoleName } from "@/services/helper";
import { App, Col, Form, Input, Modal, Row, Select } from "antd";
import { useState } from "react";

const CreateSubRole = (props) => {
  const {
    openModalCreate,
    setOpenModalCreate,
    reloadPage,
    mainRoles,
    setMainRoles,
  } = props;
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { subRoleName, roleName } = values;
    setIsSubmit(true);
    const payload = `${subRoleName}_${roleName}`;
    const res = await createSubRoleAPI(payload);
    if (res && res.data && res.data.statusCode === 201) {
      message.success(`Tạo mới vai trò phụ thành công!`);
      form.resetFields();
      setOpenModalCreate(false);
      reloadPage();
    } else {
      let errorMessage = res?.data?.content;

      if (errorMessage === "Role already exists") {
        errorMessage = "Vai trò phụ này đã tồn tại!";
      }
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: errorMessage,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title={
          <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
            Tạo mới vai trò phụ
          </div>
        }
        width={"40vw"}
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
                label="Tên vai trò phụ"
                name="subRoleName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên vai trò!" },
                ]}
              >
                <Input placeholder="Vui lòng nhập tên vai trò phụ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vai trò chính"
                name="roleName"
                rules={[
                  { required: true, message: "Vui lòng chọn vai trò chính!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Vui lòng chọn vai trò chính"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {mainRoles?.map((role) => (
                    <Select.Option key={role.roleName} value={role.roleName}>
                      {convertRoleName(role.roleName)}
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

export default CreateSubRole;
