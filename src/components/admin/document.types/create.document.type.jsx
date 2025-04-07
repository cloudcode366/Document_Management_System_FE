import {
  App,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const CreateDocumentType = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    //   const { fullName, password, email, phone } = values;
    //   setIsSubmit(true);
    //   const res = await createUserAPI(fullName, email, password, phone);
    //   if (res && res.data) {
    //     message.success(`Tạo mới user thành công`);
    //     form.resetFields();
    //     setOpenModalCreate(false);
    //     refreshTable();
    //   } else {
    //     notification.error({
    //       message: "Đã có lỗi xảy ra",
    //       description: res.message,
    //     });
    //   }
    //   setIsSubmit(false);
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : null,
    };
    console.log("Submitted Data:", formattedValues);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Tạo loại văn bản"
        width={"50vw"}
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalCreate(false);
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
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên văn bản!" },
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
