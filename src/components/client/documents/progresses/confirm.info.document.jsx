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
  Tag,
  notification,
  message,
} from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PDFViewerWithToken from "@/components/pdf.viewer";
import { useCurrentApp } from "@/components/context/app.context";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import "./confirm.info.document.scss";
import { createInComingDocumentAPI } from "@/services/api.service";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CreateFirstTask from "./create.first.task";

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
  const [openCreateFirstTaskModal, setOpenCreateFirstTaskModal] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentId, setDocumentId] = useState(null);

  useEffect(() => {
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
        validTo: resDocument?.canChange?.validTo
          ? dayjs(resDocument?.canChange?.validTo)
          : null,
        validFrom: resDocument?.canChange?.validFrom
          ? dayjs(resDocument?.canChange?.validFrom)
          : null,
        Deadline: resDocument?.canChange?.Deadline
          ? dayjs(resDocument?.canChange?.Deadline)
          : null,
        NumberOfDocument: resDocument?.canChange?.NumberOfDocument || null,
        DocumentContent: resDocument?.canChange?.DocumentContent,
        DocumentTypeId: selectedDocumentType.documentTypeId,
        DocumentTypeName: selectedDocumentType.documentTypeName,
        WorkflowId: selectedWorkflow.workflowId,
        WorkflowName: selectedWorkflow.workflowName,
        signerNames: defaultSignerList,
      });
    }
  }, [openConfirmModal, resDocument, form, selectedScope, user]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const values = await form.validateFields();
    const currentSigners = values.signerNames || [];
    const NewSignerName = currentSigners.filter(
      (s) => !defaultSigner.includes(s)
    );

    const updatedCanChange = {
      ...resDocument?.canChange,
      ...values, // Ghi đè các giá trị mới từ form vào canChange
      NewSignerName: NewSignerName,
    };

    // Ghi đè vào resDocument.canChange
    resDocument.canChange = updatedCanChange;
    console.log(`>>> Check resDocument: `, resDocument);

    const res = await createInComingDocumentAPI(resDocument);
    if (res && res.data && res.data.statusCode === 200) {
      const data = res.data.content;
      message.success(`Khởi tạo văn bản thành công!`);

      setOpenConfirmModal(false);
      handleCloseCreateDocumentModal(); // Đảm bảo đóng modal cha (nếu cần)
      setSignerList([]); // Reset danh sách người ký
      setDocumentId(data[1].documentId);
      setOpenCreateFirstTaskModal(true);
    } else {
      notification.error({ message: "Đã có lỗi xảy ra, vui lòng thử lại sau" });
    }

    setIsLoading(false);
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
    handleCloseCreateDocumentModal(); // Đảm bảo đóng modal cha (nếu cần)
    setOpenConfirmModal(false);
    form.resetFields();

    // Reset thêm các state nếu cần thiết
    setSignerList([]); // Reset danh sách người ký
    setInputVisible(false); // Đóng input thêm người ký
    setInputValue(""); // Clear input value
    setDefaultSigner([]); // Nếu có cần reset lại người ký mặc định
    setIsLoading(false); // Reset trạng thái loading
    setDocumentId(null); // Reset documentId nếu cần thiết
  };

  return (
    <div>
      <Modal
        open={openConfirmModal}
        onCancel={handleCloseConfirmInfoDocumentModal}
        footer={null}
        width="90vw"
        centered
        maskClosable={false}
        closable={false}
        bodyProps={{
          style: {
            maxHeight: "80vh", // Modal body sẽ có chiều cao tối đa 80% màn hình
            overflowY: "auto", // Bật cuộn khi nội dung vượt quá
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%", // Đảm bảo container chiếm toàn bộ chiều cao của Modal
          }}
        >
          {/* Bên trái: Xem file PDF */}
          <Card
            title="Thông tin chi tiết"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              margin: 0,
              borderRadius: 0,
              borderLeft: "1px solid #f0f0f0",
              height: "100%", // Đảm bảo Card chiếm chiều cao tối đa
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: "auto", // Đảm bảo cuộn nếu nội dung quá dài
              }}
            >
              {uploadedFile && (
                <PDFViewerWithToken
                  url={resDocument?.canChange?.url}
                  token={localStorage.getItem(`access_token`)}
                />
              )}
            </div>
          </Card>

          {/* Bên phải: Form nhập thông tin */}
          <Card
            title="Thông tin chi tiết"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              margin: 0,
              borderRadius: 0,
              borderLeft: "1px solid #f0f0f0",
              height: "100%", // Đảm bảo Card chiếm chiều cao tối đa
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: "auto", // Đảm bảo cuộn khi nội dung form vượt quá chiều cao
              }}
            >
              <Form form={form} layout="vertical" className="form-large-text">
                <Form.Item
                  label="Tên văn bản"
                  name="Name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên văn bản!" },
                  ]}
                >
                  <Input placeholder="Nhập tên văn bản" />
                </Form.Item>

                <Form.Item
                  label="Người gửi"
                  name="Sender"
                  rules={[
                    { required: true, message: "Vui lòng nhập người gửi!" },
                  ]}
                >
                  <Input placeholder="Tên người gửi" />
                </Form.Item>

                <Form.Item
                  label="Người nhận"
                  name="Receiver"
                  rules={[
                    { required: true, message: "Vui lòng nhập người nhận!" },
                  ]}
                >
                  <Input placeholder="Tên người nhận" />
                </Form.Item>

                <Form.Item
                  label="Ngày nhận"
                  name="DateReceived"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày nhận!" },
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
                  name="validTo"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày ban hành!" },
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
                  label="Ngày hết hiệu lực"
                  name="validFrom"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày hết hiệu lực!",
                    },
                  ]}
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm"
                    showTime={{ format: "HH:mm" }}
                    style={{ width: "100%" }}
                    placeholder="Vui lòng chọn ngày hết hiệu lực"
                    disabledDate={(current) =>
                      current && current < dayjs().endOf("day")
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Ngày hết hạn"
                  name="Deadline"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày hết hạn xử lý!",
                    },
                  ]}
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm"
                    showTime={{ format: "HH:mm" }}
                    style={{ width: "100%" }}
                    placeholder="Vui lòng chọn ngày hết hạn"
                    disabledDate={(current) =>
                      current && current < dayjs().endOf("day")
                    }
                  />
                </Form.Item>

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
                  <Input placeholder="Nhập số hiệu văn bản" readOnly />
                </Form.Item>

                <Form.Item
                  label="Loại văn bản"
                  name="DocumentTypeId"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại văn bản!" },
                  ]}
                  hidden
                >
                  <Input placeholder="Loại văn bản" readOnly />
                </Form.Item>

                <Form.Item
                  label="Loại văn bản"
                  name="DocumentTypeName"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại văn bản!" },
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
                  label="Loại văn bản"
                  name="WorkflowName"
                  rules={[
                    { required: true, message: "Vui lòng chọn luồng xử lý!" },
                  ]}
                >
                  <Input placeholder="Luồng xử lý" readOnly />
                </Form.Item>

                <Form.Item label="Người ký" name="signerNames">
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {signerList.map((item) => (
                      <Tag
                        key={item.name}
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
                    { required: true, message: "Vui lòng nhập nội dung!" },
                  ]}
                >
                  <TextArea rows={5} placeholder="Nhập nội dung tóm tắt" />
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
            </div>
          </Card>
        </div>
      </Modal>
      <CreateFirstTask
        openCreateFirstTaskModal={openCreateFirstTaskModal}
        setOpenCreateFirstTaskModal={setOpenCreateFirstTaskModal}
        documentId={documentId}
        setDocumentId={setDocumentId}
      />
    </div>
  );
};

export default ConfirmInfoDocument;
