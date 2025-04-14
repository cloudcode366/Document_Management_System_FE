import { App, Col, Form, Input, Modal, Row } from "antd";
import { useState } from "react";
import { createDocumentTypeAPI } from "@/services/api.service";

const CreateDocumentType = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { documentTypeName } = values;
    setIsSubmit(true);
    const res = await createDocumentTypeAPI(documentTypeName);
    if (res && res.data && res.data.statusCode === 201) {
      message.success(`Tạo mới loại văn bản thành công`);
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      let errorMessage = res?.data?.content;

      if (errorMessage === "Document Type name already exists") {
        errorMessage = "Loại văn bản này đã tồn tại!";
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
            Tạo loại văn bản
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
                label="Tên văn bản"
                name="documentTypeName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại văn bản!",
                  },
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

export default CreateDocumentType;
