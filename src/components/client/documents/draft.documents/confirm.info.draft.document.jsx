import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  Empty,
  Select,
  App,
} from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Title, Text } = Typography;

const docTypeOptions = [
  { id: 1, name: "Quyết định" },
  { id: 2, name: "Chỉ thị" },
  { id: 3, name: "Quy chế" },
  { id: 4, name: "Quy định" },
  { id: 5, name: "Thông báo" },
];

const workflowOptions = [
  { id: 1, name: "Văn bản đi" },
  { id: 2, name: "Văn bản đến" },
  { id: 3, name: "Văn bản phòng ban" },
  { id: 4, name: "Văn bản toàn trường" },
];

const ConfirmInfoDraftDocument = ({
  openModalConfirmInfoDraft,
  setOpenModalConfirmInfoDraft,
  uploadedFile,
  handleCloseCreateDraftDocumentModal,
}) => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    console.log("Dữ liệu submit:", {
      ...values,
      file: uploadedFile,
    });

    // TODO: Gọi API ở đây nếu cần
    // refreshTable();
    onClose();
    notification.success({
      message: "Tạo văn bản nháp thành công",
    });
    navigate("/draft-document");
  };

  const onClose = () => {
    handleCloseCreateDraftDocumentModal();
    setOpenModalConfirmInfoDraft(false);
    form.resetFields();
  };

  return (
    <div>
      <Modal
        open={openModalConfirmInfoDraft}
        onCancel={onClose}
        footer={null}
        width="90vw"
        centered
        style={{ top: 20 }}
        maskClosable={false}
        closable={false}
        bodyStyle={{ padding: 0, height: "80vh" }}
      >
        <div style={{ display: "flex", height: "100%" }}>
          {/* Bên trái: Xem file PDF */}
          <Card
            title={
              <Space>
                <FilePdfOutlined />
                <span>{uploadedFile?.name || "Văn bản"}</span>
              </Space>
            }
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              margin: 0,
              borderRadius: 0,
            }}
            headStyle={{ flexShrink: 0, padding: "12px 16px" }}
            bodyStyle={{ flex: 1, padding: 0 }}
          >
            {uploadedFile && (
              <iframe
                src={URL.createObjectURL(uploadedFile)}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                title="File preview"
              />
            )}
          </Card>

          {/* Bên phải: Form nhập thông tin */}
          <Card
            title="Thông tin chi tiết văn bản nháp"
            style={{
              flex: 1,
              height: "100%",
              overflowY: "auto",
              margin: 0,
              borderRadius: 0,
              borderLeft: "1px solid #f0f0f0",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{ ngayky: null }}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Form.Item
                label="Tên văn bản"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên văn bản!" },
                ]}
              >
                <Input placeholder="Nhập tên văn bản" />
              </Form.Item>

              <Form.Item
                label="Người gửi"
                name="sender"
                rules={[
                  { required: true, message: "Vui lòng nhập người gửi!" },
                ]}
              >
                <Input placeholder="Tên người gửi" />
              </Form.Item>

              <Form.Item
                label="Người nhận"
                name="receiver"
                rules={[
                  { required: true, message: "Vui lòng nhập người nhận!" },
                ]}
              >
                <Input placeholder="Tên người nhận" />
              </Form.Item>

              <Form.Item
                label="Ngày nhận"
                name="received_date"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày nhận!" },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Vui lòng chọn ngày nhận"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  } // Không cho chọn ngày trong tương lai
                />
              </Form.Item>

              <Form.Item
                label="Ban hành từ ngày"
                name="date_issued"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày ban hành!" },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Vui lòng chọn ngày ban hành"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  } // Không cho chọn ngày trong tương lai
                />
              </Form.Item>

              <Form.Item
                label="Ngày hết hiệu lực"
                name="expiration_date"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày hết hiệu lực!",
                  },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Vui lòng chọn ngày hết hạn"
                  // disabledDate={(current) =>
                  //   current && current > dayjs().endOf("day")
                  // } // Không cho chọn ngày trong tương lai
                />
              </Form.Item>

              <Form.Item
                label="Số hiệu văn bản"
                name="number_of_document"
                rules={[
                  { required: true, message: "Vui lòng nhập số hiệu văn bản!" },
                ]}
              >
                <Input placeholder="Tên số hiệu văn bản" />
              </Form.Item>

              <Form.Item
                label="Loại văn bản"
                name="document_type_id"
                rules={[
                  { required: true, message: "Vui lòng chọn loại văn bản!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Vui lòng chọn loại văn bản"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {docTypeOptions.map((docType) => (
                    <Select.Option key={docType.id} value={docType.id}>
                      {docType.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Luồng xử lý"
                name="workflow_id"
                rules={[
                  { required: true, message: "Vui lòng chọn luồng xử lý!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Vui lòng chọn luồng xử lý"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {workflowOptions.map((workflow) => (
                    <Select.Option key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Người ký"
                name="signed_by"
                rules={[{ required: true, message: "Vui lòng nhập người ký!" }]}
              >
                <Input placeholder="Tên người ký" />
              </Form.Item>

              <Form.Item
                label="Nội dung"
                name="noidung"
                rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
              >
                <TextArea rows={4} placeholder="Nhập nội dung tóm tắt" />
              </Form.Item>

              <div style={{ marginTop: "auto" }}>
                <Divider />
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  block
                  size="large"
                >
                  Xác nhận
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmInfoDraftDocument;
