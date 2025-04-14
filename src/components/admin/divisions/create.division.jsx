import { createDivisionAPI } from "@/services/api.service";
import { MinusCircleOutlined } from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import { useState } from "react";

const CreateDivision = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { divisionName } = values;
    setIsSubmit(true);
    const res = await createDivisionAPI(divisionName);
    if (res && res.data && res.data.statusCode === 201) {
      message.success(`Tạo mới phòng ban thành công!`);
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      let errorMessage = res?.data?.content;

      if (errorMessage === "Division name already exists") {
        errorMessage = "Phòng ban này đã tồn tại!";
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
            Tạo mới phòng ban
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
                label="Tên phòng ban"
                name="divisionName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên phòng ban!" },
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

export default CreateDivision;
