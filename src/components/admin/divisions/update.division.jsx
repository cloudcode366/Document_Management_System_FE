import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Select,
  Table,
  Button,
  Avatar,
  Tag,
  Divider,
  App,
  Form,
  Row,
  Col,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { updateDivisionAPI } from "@/services/api.service";

const UpdateDivision = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataUpdate,
    setDataUpdate,
    refreshTable,
  } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (openModalUpdate && dataUpdate) {
      const { divisionName } = dataUpdate;
      form.setFieldsValue({ divisionName });
    }
  }, [openModalUpdate, dataUpdate, form]);

  const handleClose = () => {
    setOpenModalUpdate(false);
    setDataUpdate(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setIsSubmit(true);
    const { divisionName } = values;
    const res = await updateDivisionAPI(dataUpdate.divisionId, divisionName);
    if (res && res.data && res.data.statusCode === 200) {
      message.success(`Cập nhật phòng ban thành công!`);
      handleClose();
      refreshTable();
    } else {
      let errMessage = "";
      errMessage = res.data.content;
      if (errMessage === "Division has been deleted") {
        errMessage = "Phòng ban này đã khóa hoạt động rồi!";
      }
      if (errMessage === "Division name already exists") {
        errMessage = "Tên phòng ban này đã tồn tại rồi!";
      }
      notification.error({
        message: "Cập nhật phòng ban thất bại!",
        description: errMessage,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title={
          <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
            Cập nhật phòng ban
          </div>
        }
        width={"40vw"}
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleClose}
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

export default UpdateDivision;
