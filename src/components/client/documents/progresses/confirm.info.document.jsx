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
  Upload,
} from "antd";
import { FilePdfOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PDFViewerWithToken from "@/components/pdf.viewer";
import { useCurrentApp } from "@/components/context/app.context";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import "./confirm.info.document.scss";
import {
  createDocumentByTemplateAPI,
  createInComingDocumentAPI,
  createUploadAttachmentAPI,
} from "@/services/api.service";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { TextArea } = Input;

const ConfirmInfoDocument = (props) => {
  const {
    openConfirmModal,
    setOpenConfirmModal,
    uploadedFile,
    resDocument,
    selectedWorkflow,
    setSelectedTemplate,
    selectedTemplate,
    selectedDocumentType,
    selectedScope,
    handleCloseCreateDocumentModal,
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
    if (selectedScope === "InComing") {
      const defaultSignerList = resDocument?.canChange?.signerName || [];
      setSignerList(defaultSignerList.map((name) => ({ name, isNew: false })));
      setDefaultSigner(defaultSignerList);
      form.setFieldsValue({
        Name: resDocument?.canChange?.Name,
        Sender: resDocument?.canChange?.Sender || null,
        Receiver: user.fullName,
        DateReceived: resDocument?.canChange?.DateReceived
          ? dayjs(resDocument?.canChange?.DateReceived)
          : null,
        // validTo: resDocument?.canChange?.validTo
        //   ? dayjs(resDocument?.canChange?.validTo)
        //   : null,
        // validFrom: resDocument?.canChange?.validFrom
        //   ? dayjs(resDocument?.canChange?.validFrom)
        //   : null,
        Deadline: resDocument?.canChange?.Deadline
          ? dayjs(resDocument?.canChange?.Deadline)
          : null,
        NumberOfDocument: resDocument?.canChange?.NumberOfDocument || null,
        DocumentContent: resDocument?.canChange?.DocumentContent,
        DocumentTypeId: selectedDocumentType?.documentTypeId,
        DocumentTypeName: selectedDocumentType?.documentTypeName,
        WorkflowId: selectedWorkflow?.workflowId,
        WorkflowName: selectedWorkflow?.workflowName,
        signerNames: defaultSignerList,
      });
    } else {
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

      if (selectedScope === "InComing") {
        const currentSigners = values.signerNames || [];
        const NewSignerName = currentSigners.filter(
          (s) => !defaultSigner.includes(s)
        );
        const attachments =
          values?.attachments?.length > 0
            ? values?.attachments?.map((item) => ({
                name: item.name,
                url: item.file?.[0]?.url,
              }))
            : null;

        const updatedCanChange = {
          ...resDocument?.canChange,
          ...values,
          NewSignerName: NewSignerName,
          attachments: attachments,
          // validFrom: dayjs(values.validFrom).format("DD-MM-YYYY HH:mm"),
        };

        resDocument.canChange = updatedCanChange;
        console.log(
          `>>> Check data when confirm document Incoming: `,
          resDocument
        );
        const res = await createInComingDocumentAPI(resDocument);
        if (res && res.data && res.data.statusCode === 200) {
          const data = res.data.content;
          message.success(`Khởi tạo văn bản thành công!`);

          setOpenConfirmModal(false);
          handleCloseCreateDocumentModal();
          setSignerList([]);
          navigate(`/create-first-task/${data[1].documentId}`, {
            state: { scope: selectedScope },
          });
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          });
        }
      } else {
        console.log(
          selectedTemplate.id,
          values.Name,
          selectedWorkflow.workflowId,
          selectedDocumentType.documentTypeId,
          values.validTo,
          values.Deadline
        );
        const res = await createDocumentByTemplateAPI(
          selectedTemplate.id,
          selectedWorkflow.workflowId,
          selectedDocumentType.documentTypeId,
          values.Name,
          values.Deadline,
          values.validTo
        );
        if (res.data.statusCode === 200) {
          const data = res.data.content;
          message.success(`Khởi tạo văn bản thành công!`);
          setOpenConfirmModal(false);
          handleCloseCreateDocumentModal();
          setSignerList([]);
          navigate(`/create-first-task/${data}`, {
            state: { scope: selectedScope },
          });
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          });
        }
      }
    } catch (err) {
      console.warn("Warning:", err);
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
          {selectedScope === "InComing" ? (
            <PDFViewerWithToken
              url={resDocument?.canChange?.url}
              token={localStorage.getItem(`access_token`)}
              documentName={resDocument?.canChange?.Name}
            />
          ) : (
            <PDFViewerWithToken
              url={`${selectedTemplate?.url}&isPdf=true`}
              token={localStorage.getItem(`access_token`)}
              documentName={resDocument?.canChange?.Name}
            />
          )}
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

              {selectedScope !== "InComing" && (
                <>
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
                </>
              )}
              {selectedScope === "InComing" && (
                <>
                  <Form.Item
                    label="Người gửi"
                    name="Sender"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập người gửi!",
                      },
                    ]}
                  >
                    <Input placeholder="Tên người gửi" />
                  </Form.Item>
                  <Form.Item
                    label="Người nhận"
                    name="Receiver"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập người nhận!",
                      },
                    ]}
                  >
                    <Input placeholder="Tên người nhận" />
                  </Form.Item>
                  <Form.Item
                    label="Ngày nhận"
                    name="DateReceived"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày nhận!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY HH:mm"
                      showTime={{ format: "HH:mm" }}
                      style={{ width: "100%" }}
                      placeholder="Vui lòng chọn ngày nhận"
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Ngày ban hành"
                    name="dateIssued"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày ban hành!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const DateReceived = getFieldValue("DateReceived");

                          if (!value) return Promise.resolve();

                          if (
                            DateReceived &&
                            value.isAfter(DateReceived, "minute")
                          ) {
                            return Promise.reject(
                              new Error("Ngày ban hành phải trước ngày nhận!")
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY HH:mm"
                      showTime={{ format: "HH:mm" }}
                      style={{ width: "100%" }}
                      placeholder="Vui lòng chọn ngày ban hành"
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      } // Không cho chọn ngày trong tương lai
                    />
                  </Form.Item>
                  <Form.Item
                    label="Ngày có hiệu lực"
                    name="validFrom"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày có hiệu lực!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const issuedDate = getFieldValue("dateIssued");
                          const deadline = getFieldValue("Deadline");
                          const validTo = getFieldValue("validTo");

                          if (!value) return Promise.resolve();

                          if (
                            issuedDate &&
                            value.isBefore(issuedDate, "minute")
                          ) {
                            return Promise.reject(
                              new Error(
                                "Ngày có hiệu lực phải cùng ngày hoặc sau ngày ban hành!"
                              )
                            );
                          }

                          if (deadline && value.isAfter(deadline, "minute")) {
                            return Promise.reject(
                              new Error(
                                "Ngày có hiệu lực phải trước hạn xử lý!"
                              )
                            );
                          }

                          if (validTo && value.isAfter(validTo, "minute")) {
                            return Promise.reject(
                              new Error(
                                "Ngày có hiệu lực phải trước ngày hết hiệu lực!"
                              )
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY HH:mm"
                      showTime={{ format: "HH:mm" }}
                      style={{ width: "100%" }}
                      placeholder="Vui lòng chọn ngày có hiệu lực"
                      // disabledDate={(current) =>
                      //   current && current > dayjs().endOf("day")
                      // } // Không cho chọn ngày trong tương lai
                    />
                  </Form.Item>
                </>
              )}

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

              {selectedScope === "InComing" && (
                <>
                  <Form.Item
                    label="Số hiệu văn bản"
                    name="NumberOfDocument"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số hiệu văn bản!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số hiệu văn bản" />
                  </Form.Item>
                </>
              )}

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

              {selectedScope === "InComing" && (
                <>
                  <Form.Item label="Người ký" name="signerNames">
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {signerList.map((item, index) => (
                        <Tag
                          key={`${item.name}-${index}`}
                          color="blue"
                          closable={item.isNew}
                          onClose={() => handleRemoveSigner(item.name)}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {item.name}
                        </Tag>
                      ))}
                      {inputVisible ? (
                        <Input
                          size="small"
                          style={{ width: 160 }}
                          value={inputValue}
                          autoFocus
                          onChange={(e) => setInputValue(e.target.value)}
                          onBlur={handleAddSigner}
                          onPressEnter={handleAddSigner}
                        />
                      ) : (
                        <Tag
                          onClick={() => setInputVisible(true)}
                          style={{
                            background: "#fff",
                            borderStyle: "dashed",
                            cursor: "pointer",
                          }}
                        >
                          <PlusOutlined /> Thêm
                        </Tag>
                      )}
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="Nội dung"
                    name="DocumentContent"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập nội dung!",
                      },
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
                </>
              )}

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

export default ConfirmInfoDocument;
