import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Divider,
  Tag,
  App,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import PDFViewerWithToken from "@/components/pdf.viewer";
import { useCurrentApp } from "@/components/context/app.context";
import { PlusOutlined } from "@ant-design/icons";
import { createWithdrawDocumentAPI } from "@/services/api.service";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { TextArea } = Input;

const ConfirmInfoReplace = (props) => {
  const {
    openConfirmModal,
    setOpenConfirmModal,
    resDocument,
    selectedWorkflow,
    selectedTemplate,
    setSelectedTemplate,
    selectedScope,
    selectedDocumentType,
    handleCloseCreateDocumentModal,
    documentId,
  } = props;
  const [form] = Form.useForm();
  const { user } = useCurrentApp();
  const [signerList, setSignerList] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [defaultSigner, setDefaultSigner] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!openConfirmModal) return;
    else {
      form.setFieldsValue({
        templateName: selectedTemplate?.name,
        DocumentTypeId: selectedDocumentType?.documentTypeId,
        DocumentTypeName: selectedDocumentType?.documentTypeName,
        WorkflowId: selectedWorkflow?.workflowId,
        WorkflowName: selectedWorkflow?.workflowName,
      });
    }
  }, [openConfirmModal, resDocument, selectedScope, user, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Sẽ throw nếu còn ô chưa thỏa mãn validate
      const values = await form.validateFields();

      const res = await createWithdrawDocumentAPI(
        selectedTemplate.id,
        selectedWorkflow.workflowId,
        selectedDocumentType.documentTypeId,
        values.Name,
        values.Deadline,
        values.validTo,
        documentId
      );
      if (res && res.data && res.data.statusCode === 200) {
        const data = res.data.content;
        message.success(`Khởi tạo văn bản thành công!`);
        setOpenConfirmModal(false);
        handleCloseCreateDocumentModal();
        setSignerList([]);
        navigate(`/create-first-task/${data}`);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        });
      }
    } catch (err) {
      console.warn("Form chưa hợp lệ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSigner = () => {
    if (inputValue && !signerList.find((item) => item.name === inputValue)) {
      const newList = [...signerList, { name: inputValue, isNew: true }];
      setSignerList(newList);
      setInputVisible(false);
      setInputValue("");
      form.setFieldsValue({ signerNames: newList.map((i) => i.name) });
    }
  };

  const handleRemoveSigner = (name) => {
    const filtered = signerList.filter((item) => item.name !== name);
    setSignerList(filtered);
    form.setFieldsValue({ signerNames: filtered.map((i) => i.name) });
  };

  const handleCloseConfirmInfoDocumentModal = () => {
    handleCloseCreateDocumentModal();
    setOpenConfirmModal(false);
    form.resetFields();
    setSignerList([]);
    setInputVisible(false);
    setInputValue("");
    setDefaultSigner([]);
    setIsLoading(false);
  };

  return (
    <Modal
      open={openConfirmModal}
      title="Vui lòng xác nhận thông tin văn bản"
      width="90%"
      centered
      maskClosable={false}
      footer={null}
      onCancel={handleCloseConfirmInfoDocumentModal}
      className="confirm-info-modal"
    >
      <div className="confirm-info-content">
        <div className="left-panel hide-scrollbar">
          <PDFViewerWithToken
            url={`${selectedTemplate?.url}&isPdf=true`}
            token={localStorage.getItem(`access_token`)}
            documentName={resDocument?.canChange?.Name}
          />
        </div>
        <div className="right-panel">
          <Card title="Thông tin văn bản" className="confirm-card">
            <Form form={form} layout="vertical" className="form-large-text">
              <Form.Item
                label="Tên văn bản"
                name="Name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên văn bản!" },
                  {
                    pattern: `^[^<>:"/\\\\|?*&;#$%@!(){}\\[\\]]+$`, // dùng regex literal thì vẫn cần escape
                    message:
                      'Tên văn bản không được chứa các ký tự đặc biệt: < > : " / \\ | ? * & ; # $ % @ ! ( ) { } [ ]',
                  },
                ]}
              >
                <Input placeholder="Nhập tên văn bản" />
              </Form.Item>

              <Form.Item
                label="Mẫu văn bản"
                name="templateName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn mẫu văn bản!",
                  },
                ]}
              >
                <Input placeholder="Chọn mẫu văn bản" readOnly />
              </Form.Item>

              <Form.Item
                label="Hạn xử lý"
                name="Deadline"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Hạn xử lý xử lý!",
                  },
                ]}
              >
                <DatePicker
                  format="DD-MM-YYYY HH:mm"
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  placeholder="Vui lòng chọn hạn xử lý"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={(current) => {
                    const now = dayjs();
                    if (!current || current.isAfter(now, "day")) return {};
                    return {
                      disabledHours: () => [...Array(now.hour()).keys()],
                      disabledMinutes: (selectedHour) =>
                        selectedHour === now.hour()
                          ? [...Array(now.minute()).keys()]
                          : [],
                    };
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Ngày hết hiệu lực"
                name="validTo"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày hết hiệu lực!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const start = getFieldValue("Deadline");
                      if (!value || !start || value.isAfter(start)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Thời gian hết hiệu lực phải sau thời gian hết hạn xử lý!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <DatePicker
                  format="DD-MM-YYYY HH:mm"
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  placeholder="Vui lòng chọn ngày hết hiệu lực"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={(current) => {
                    const now = dayjs();
                    const start = form.getFieldValue("Deadline");

                    if (!current) return {};

                    // Nếu ngày sau hôm nay và sau ngày bắt đầu => không giới hạn giờ phút
                    if (
                      current.isAfter(now, "day") &&
                      (!start || current.isAfter(start, "day"))
                    ) {
                      return {};
                    }

                    const refTime =
                      start && current.isSame(start, "day") ? start : now;

                    return {
                      disabledHours: () => [...Array(refTime.hour()).keys()],
                      disabledMinutes: (selectedHour) => {
                        if (selectedHour === refTime.hour()) {
                          return [...Array(refTime.minute() + 1).keys()];
                        }
                        return [];
                      },
                    };
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Loại văn bản"
                name="DocumentTypeId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại văn bản!",
                  },
                ]}
                hidden
              >
                <Input placeholder="Loại văn bản" readOnly />
              </Form.Item>

              <Form.Item
                label="Loại văn bản"
                name="DocumentTypeName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại văn bản!",
                  },
                ]}
              >
                <Input placeholder="Loại văn bản" readOnly />
              </Form.Item>

              <Form.Item
                label="Luồng xử lý"
                name="WorkflowId"
                rules={[
                  { required: true, message: "Vui lòng chọn luồng xử lý!" },
                ]}
                hidden
              >
                <Input placeholder="Luồng xử lý" readOnly />
              </Form.Item>

              <Form.Item
                label="Luồng xử lý"
                name="WorkflowName"
                rules={[
                  { required: true, message: "Vui lòng chọn luồng xử lý!" },
                ]}
              >
                <Input placeholder="Luồng xử lý" readOnly />
              </Form.Item>

              <div style={{ marginTop: "auto" }}>
                <Divider />
                <Button
                  loading={isLoading}
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
      </div>
    </Modal>
  );
};

export default ConfirmInfoReplace;
