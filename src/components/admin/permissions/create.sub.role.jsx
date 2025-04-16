import { createSubRoleAPI } from "@/services/api.service";
import { App, Col, Form, Input, Modal, Row } from "antd";
import { useState } from "react";

const CreateSubRole = (props) => {
  const { openModalCreate, setOpenModalCreate, reloadPage } = props;
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { roleName } = values;
    setIsSubmit(true);
    const res = await createSubRoleAPI(roleName);
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
          <Row>
            <Col span={24}>
              <Form.Item
                label="Tên vai trò phụ"
                name="roleName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên vai trò!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateSubRole;
