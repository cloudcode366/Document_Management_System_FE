import {
  Modal,
  Form,
  Input,
  Button,
  Card,
  App,
  Divider,
  Typography,
  Alert,
  Table,
  Radio,
  DatePicker,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PDFViewerWithToken from "@/components/pdf.viewer";
import { useCurrentApp } from "@/components/context/app.context";
import "./confirm.version.modal.scss";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  createHandleTaskActionAPI,
  createUploadAttachmentAPI,
  updateConfirmDocumentBySubmit,
} from "@/services/api.service";
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

dayjs.extend(utc);
dayjs.extend(timezone);

const { TextArea } = Input;

const ConfirmVersionModal = (props) => {
  const {
    openConfirmModal,
    setOpenConfirmModal,
    documentId,
    resDocument,
    fetchInfo,
    pdfFile,
    taskId,
    handleCloseCreateVersionModal,
  } = props;

  const [form] = Form.useForm();
  const { notification, message } = App.useApp();
  const { user } = useCurrentApp();
  const [isLoading, setIsLoading] = useState(false);
  const [effectiveOption, setEffectiveOption] = useState("fromIssueDate");

  useEffect(() => {
    if (openConfirmModal) {
      console.log(`>> Check pdf: `, pdfFile);
      form.setFieldsValue({
        documentName: resDocument.documentName,
        documentTypeName: resDocument.documentTypeName,
        documentContent: resDocument.documentContent,
        numberOfDocument: resDocument.numberOfDocument,
      });
    }
  }, [openConfirmModal, form, resDocument]);

  const reallySubmit = async () => {
    const values = await form.validateFields();
    const effectiveDate =
      effectiveOption === "fromIssueDate" ? null : values.validFrom;
    const attachments = values.attachments.map((item) => ({
      name: item.name,
      file: item.file?.[0]?.originFileObj || null,
    }));
    const res = await updateConfirmDocumentBySubmit(
      documentId,
      values.documentName,
      values.documentTypeName,
      resDocument.aiDocumentName,
      resDocument.aiDocumentType,
      values.documentContent,
      values.numberOfDocument,
      resDocument.isDifferent,
      resDocument.fileBase64,
      effectiveDate,
      attachments
    );
    if (res.data.statusCode === 200) {
      const res2 = await createHandleTaskActionAPI(
        taskId,
        user.userId,
        "SubmitDocument"
      );
      if (res2?.data?.statusCode === 200) {
        notification.success({
          message: "Đã hoàn tất tải văn bản lên hệ thống!",
          description: "Văn bản đã tải lên hệ thống thành công.",
        });
        await fetchInfo();
      } else {
        notification.error({
          message: "Hệ thống đang bận!",
          description: "Xin vui lòng thử lại sau.",
        });
      }
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.data.content,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (resDocument.isDifferent) {
        Modal.confirm({
          title: (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ExclamationCircleOutlined
                style={{ color: "#faad14", fontSize: 24 }}
              />
              <Typography.Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Có sự khác biệt giữa thông tin lúc bạn khởi tạo luồng xử lý văn
                bản và AI phát hiện
              </Typography.Text>
            </div>
          ),
          content: (
            <div style={{ marginTop: 24 }}>
              {/* Alert thông báo sự khác biệt */}
              <Alert
                message="Thông tin bạn nhập và thông tin AI phát hiện có sự khác biệt"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />

              {/* Bảng thông tin */}
              <Table
                rowKey="label"
                dataSource={[
                  {
                    label: "Tên văn bản",
                    userInput: resDocument.documentName,
                    aiInput: resDocument.aiDocumentName,
                  },
                  {
                    label: "Loại văn bản",
                    userInput: resDocument.documentTypeName,
                    aiInput: resDocument.aiDocumentType,
                  },
                ]}
                columns={[
                  {
                    title: "Trường thông tin",
                    dataIndex: "label",
                    key: "label",
                    render: (text) => <Typography.Text>{text}</Typography.Text>,
                  },
                  {
                    title: "Thông tin lúc khởi tạo",
                    dataIndex: "userInput",
                    key: "userInput",
                    render: (text) => <Typography.Text>{text}</Typography.Text>,
                  },
                  {
                    title: "AI phát hiện",
                    dataIndex: "aiInput",
                    key: "aiInput",
                    render: (text) => <Typography.Text>{text}</Typography.Text>,
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowClassName="table-row"
                style={{ marginBottom: 24 }}
              />

              {/* Cảnh báo */}
              <Typography.Text
                style={{
                  color: "red",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Bạn có chắc chắn muốn tải lên văn bản hiện tại không?
              </Typography.Text>
            </div>
          ),
          okText: "Vẫn tải lên",
          cancelText: "Xem lại",
          width: "50vw",
          okButtonProps: {
            type: "primary",
            danger: true,
          },
          onOk: async () => {
            await reallySubmit();
          },
          onCancel: () => {
            setIsLoading(false);
          },

          centered: true,
          maskClosable: false,
        });
      } else {
        await reallySubmit();
      }
    } catch (err) {
      console.warn("Form chưa hợp lệ:", err);
      setIsLoading(false);
    }
  };

  const handleCloseConfirmInfoDocumentModal = () => {
    setOpenConfirmModal(false);
    form.resetFields();
    setIsLoading(false);
    handleCloseCreateVersionModal();
  };

  return (
    <div>
      <Modal
        open={openConfirmModal}
        title="Vui lòng xác nhận thông tin phiên bản"
        width="90%"
        centered
        maskClosable={false}
        footer={null}
        onCancel={handleCloseConfirmInfoDocumentModal}
        className="confirm-info-modal"
      >
        <div className="confirm-info-content">
          <div className="left-panel hide-scrollbar">
            {pdfFile && (
              <PDFViewerWithToken
                url={pdfFile}
                token={localStorage.getItem(`access_token`)}
                documentName={resDocument?.documentName}
              />
            )}
          </div>

          <div className="right-panel">
            <Card title="Thông tin văn bản" className="confirm-card">
              {resDocument.isDifferent && (
                <div
                  style={{
                    backgroundColor: "#fff7e6",
                    border: "1px solid #faad14",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    color: "#d48806",
                    fontSize: "16px",
                  }}
                >
                  ⚠️ AI phát hiện một vài thông tin của văn bản bạn vừa tải lên
                  có sự khác biệt so với lúc bạn khởi tạo luồng xử lý văn bản
                  này. Vui lòng kiểm tra kỹ trước khi xác nhận tải văn bản lên
                  hệ thống.
                </div>
              )}

              <Form form={form} layout="vertical" className="form-large-text">
                <Form.Item
                  label="Tên văn bản"
                  name="documentName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên văn bản!" },
                    {
                      pattern: `^[^<>:"/\\\\|?*&;#$%@!(){}\\[\\]]+$`,
                      message:
                        'Tên văn bản không được chứa các ký tự đặc biệt: < > : " / \\ | ? * & ; # $ % @ ! ( ) { } [ ]',
                    },
                  ]}
                  validateStatus={
                    resDocument?.isDifferent ? "warning" : undefined
                  }
                  help={
                    resDocument?.isDifferent
                      ? `Tên AI nhận dạng: ${resDocument?.aiDocumentName}`
                      : ""
                  }
                >
                  <Input placeholder="Nhập tên văn bản" readOnly />
                </Form.Item>

                <Form.Item
                  label="Loại văn bản"
                  name="documentTypeName"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại văn bản!" },
                  ]}
                  validateStatus={
                    resDocument?.isDifferent ? "warning" : undefined
                  }
                  help={
                    resDocument?.isDifferent
                      ? `Loại văn bản AI nhận dạng: ${resDocument?.aiDocumentType}`
                      : ""
                  }
                >
                  <Input placeholder="Loại văn bản" readOnly />
                </Form.Item>

                <Form.Item
                  label="Số hiệu văn bản"
                  name="numberOfDocument"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số hiệu văn bản!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số hiệu văn bản" readOnly />
                </Form.Item>

                <Form.Item
                  label="Ngày có hiệu lực"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày có hiệu lực!",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) => setEffectiveOption(e.target.value)}
                    value={effectiveOption}
                  >
                    <Radio value="fromIssueDate">
                      Có hiệu lực từ ngày ban hành
                    </Radio>
                    <Radio value="custom">Ngày khác</Radio>
                  </Radio.Group>
                </Form.Item>

                {effectiveOption === "custom" && (
                  <Form.Item
                    name="validFrom"
                    label="Chọn ngày có hiệu lực"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày có hiệu lực!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày"
                      format="DD-MM-YYYY"
                      disabledDate={(current) =>
                        current && current < dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                )}

                <Form.Item
                  label="Nội dung"
                  name="documentContent"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung!" },
                  ]}
                >
                  <TextArea rows={5} placeholder="Nhập nội dung tóm tắt" />
                </Form.Item>
                <Form.List name="attachments">
                  {(fields, { add, remove }) => (
                    <>
                      <div style={{ marginBottom: 8, fontWeight: 600 }}>
                        Danh sách tệp đính kèm
                      </div>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card
                          key={key}
                          size="small"
                          type="inner"
                          style={{ marginBottom: 12 }}
                          title={`Tệp đính kèm ${name + 1}`}
                          extra={
                            <Button
                              danger
                              type="link"
                              icon={<CloseOutlined />}
                              onClick={() => remove(name)}
                            ></Button>
                          }
                        >
                          <Form.Item
                            {...restField}
                            label="Tên tệp hiển thị"
                            name={[name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tên tệp!",
                              },
                            ]}
                          >
                            <Input placeholder="Nhập tên hiển thị của tệp" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            label="Tải tệp"
                            name={[name, "file"]}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                              if (Array.isArray(e)) return e;
                              return e?.fileList;
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng tải tệp lên!",
                              },
                            ]}
                          >
                            <Upload
                              beforeUpload={(file) => {
                                const allowedExtensions = [
                                  ".doc",
                                  ".docx",
                                  ".pdf",
                                  ".xlsx",
                                  ".ppt",
                                  ".pptx",
                                  ".jpg",
                                  ".jpeg",
                                  ".png",
                                ];
                                const fileExtension = file.name
                                  .slice(file.name.lastIndexOf("."))
                                  .toLowerCase();
                                const isValid =
                                  allowedExtensions.includes(fileExtension);

                                if (!isValid) {
                                  message.error(
                                    "Chỉ cho phép các định dạng: .doc, .docx, .pdf, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png"
                                  );
                                  return Upload.LIST_IGNORE;
                                }

                                return true;
                              }}
                              customRequest={async ({
                                file,
                                onError,
                                onSuccess,
                              }) => {
                                try {
                                  const response =
                                    await createUploadAttachmentAPI(file);
                                  const uploadedUrl = response?.data?.content;

                                  // Gán URL để dùng lại lúc submit
                                  file.url = uploadedUrl;

                                  onSuccess(response?.data, file); // cần dòng này để Upload hoạt động đúng
                                } catch (err) {
                                  onError?.(err);
                                  message.error("Tải tệp lên thất bại!");
                                }
                              }}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>
                                Chọn tệp
                              </Button>
                            </Upload>
                          </Form.Item>
                        </Card>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Thêm tệp đính kèm
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

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
    </div>
  );
};

export default ConfirmVersionModal;
