import { Modal, Form, Input, Row, Col, DatePicker, Select, Button } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const CreateTask = (props) => {
  const {
    openCreateTaskModal,
    setOpenCreateTaskModal,
    listTask,
    setListTask,
    stepId,
  } = props;
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      const taskData = {
        ...values,
        start_date: values.start_date
          ? dayjs(values.start_date).format("DD-MM-YYYY HH:mm")
          : null,
        end_date: values.end_date
          ? dayjs(values.end_date).format("DD-MM-YYYY HH:mm")
          : null,
        stepId: stepId, // Bắt buộc phải có để phân loại
      };

      console.log("✅ Dữ liệu nhiệm vụ mới:", taskData);

      // Tạo bản sao và cập nhật task cho step tương ứng
      setListTask((prev) => {
        const updated = {
          ...prev,
          [stepId]: [...(prev[stepId] || []), taskData],
        };
        return updated;
      });

      setOpenCreateTaskModal(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setOpenCreateTaskModal(false);
  };

  return (
    <Modal
      open={openCreateTaskModal}
      onCancel={handleCancel}
      footer={null}
      centered
      width={800}
    >
      <h2 style={{ marginBottom: 0 }}>Tạo nhiệm vụ</h2>
      <p style={{ marginBottom: 24, color: "#999" }}>Khởi tạo nhiệm vụ</p>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <Form form={form} layout="vertical" initialValues={{}}>
          <Form.Item
            label="Tên nhiệm vụ"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên nhiệm vụ!" }]}
          >
            <Input placeholder="Nhập tên nhiệm vụ" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea placeholder="Nhập mô tả" rows={3} />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Thời gian bắt đầu" name="start_date">
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  placeholder="Chọn thời gian bắt đầu"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời gian kết thúc" name="end_date">
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  placeholder="Chọn thời gian kết thúc"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Thành viên" name="thanhvien">
                <Select placeholder="Chọn thành viên">
                  <Option value="Ngô Huỳnh Tấn Lộc">Ngô Huỳnh Tấn Lộc</Option>
                  <Option value="Lê Phan Hoài Nam">Lê Phan Hoài Nam</Option>
                  <Option value="Hà Công Hiếu">Hà Công Hiếu</Option>
                  <Option value="Tạ Gia Nhật Minh">Tạ Gia Nhật Minh</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button type="primary" onClick={handleSave} size="large">
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateTask;
