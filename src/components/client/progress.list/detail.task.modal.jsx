import React, { useEffect } from "react";
import { Modal, Form, Input, Row, Col, DatePicker, Image } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const DetailTaskModal = (props) => {
  const {
    openTaskDetailModal,
    setOpenTaskDetailModal,
    selectedTask,
    setSelectedTask,
  } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (openTaskDetailModal) {
      form.setFieldsValue({
        title: selectedTask?.title,
        description: selectedTask?.description,
        startDate: dayjs(selectedTask?.startDate).format("DD-MM-YYYY HH:mm"),
        endDate: dayjs(selectedTask?.endDate).format("DD-MM-YYYY HH:mm"),
        taskType: selectedTask?.taskType,
        fullName: selectedTask?.user.fullName,
      });
    }
  }, [openTaskDetailModal, selectedTask, form]);

  const handleClose = () => {
    setSelectedTask(null);
    setOpenTaskDetailModal(false);
  };

  return (
    <Modal
      open={openTaskDetailModal}
      onCancel={handleClose}
      footer={null}
      centered
      width={800}
    >
      <h2 style={{ marginBottom: 0 }}>Thông tin nhiệm vụ</h2>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <Form form={form} layout="vertical" initialValues={{}}>
          <Form.Item label="Tên nhiệm vụ" name="title">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea placeholder="Nhập mô tả" rows={3} readOnly />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Thời gian bắt đầu" name="startDate">
                <Input readOnly />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Thời gian kết thúc" name="endDate">
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Nhiệm vụ chính" name="taskType">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Người thực hiện" name="fullName">
                <Input
                  readOnly
                  addonBefore={
                    <Image
                      src={selectedTask?.user?.avatar || "/default-avatar.png"}
                      alt="avatar"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default DetailTaskModal;
