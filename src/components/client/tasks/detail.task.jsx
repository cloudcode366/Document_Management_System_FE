import React from "react";
import { Modal, Form, Input } from "antd";

const DetailTask = (props) => {
  const {
    openTaskDetailModal,
    setOpenTaskDetailModal,
    selectedTask,
    setSelectedTask,
  } = props;

  const handleClose = () => {
    setSelectedTask(null);
    setOpenTaskDetailModal(false);
  };

  return (
    <Modal
      open={openTaskDetailModal}
      title="Chi tiết nhiệm vụ"
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <Form
        layout="vertical"
        initialValues={{
          title: selectedTask?.title,
          thanhvien: selectedTask?.thanhvien,
          start_date: selectedTask?.start_date,
          end_date: selectedTask?.end_date,
          description: selectedTask?.description,
        }}
      >
        <Form.Item label="Tên nhiệm vụ" name="title">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Người thực hiện" name="thanhvien">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Ngày bắt đầu" name="start_date">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Ngày kết thúc" name="end_date">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} readOnly />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DetailTask;
