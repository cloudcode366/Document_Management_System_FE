import { InboxOutlined } from "@ant-design/icons";
import {
  App,
  Modal,
  Table,
  Upload,
  Select,
  Button,
  Input,
  Form,
  InputNumber,
  DatePicker,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import ConfirmInfoDocument from "@/components/client/documents/progresses/confirm.info.document";

const { Dragger } = Upload;
const { Option } = Select;

const CreateDocument = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".pdf,.doc,.docx",
    fileList: uploadedFile ? [uploadedFile] : [],
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        file.status = "done";
        onSuccess("ok");
        setUploadedFile(file);
        message.success(`${file.name} tải lên thành công.`);
      }, 1000);
    },
    async onChange(info) {
      if (info.file.status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    async onRemove() {
      setUploadedFile(null); // Khi xoá file, cập nhật state
    },
  };

  const handleConfirm = () => {
    if (!uploadedFile) {
      message.error("Vui lòng tải lên một file trước khi xác nhận.");
      return;
    }
    console.log(`Check uploaded file: `, uploadedFile);
    setOpenModalCreate(false);
    setOpenConfirmModal(true);
  };

  const handleCloseCreateDocumentModal = () => {
    setOpenModalCreate(false);
    setUploadedFile(null);
  };

  return (
    <>
      <Modal
        title="Tạo mới văn bản"
        width="80vw"
        centered={true}
        maskClosable={false}
        bodyProps={{
          style: {
            maxHeight: "70vh", // ✅ Giới hạn chiều cao modal
            overflowY: "auto", // ✅ Tạo thanh cuộn trong modal
          },
        }}
        open={openModalCreate}
        onCancel={handleCloseCreateDocumentModal}
        okText="Xác nhận"
        onOk={handleConfirm}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo văn bản vào khu vực này
          </p>
          <p className="ant-upload-hint">
            Chỉ hỗ trợ định dạng .pdf, .docx, .doc &nbsp;
          </p>
        </Dragger>
      </Modal>
      <ConfirmInfoDocument
        openConfirmModal={openConfirmModal}
        setOpenConfirmModal={setOpenConfirmModal}
        refreshTable={refreshTable}
        uploadedFile={uploadedFile}
        handleCloseCreateDocumentModal={handleCloseCreateDocumentModal}
      />
    </>
  );
};

export default CreateDocument;
