import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Upload, Select, Radio } from "antd";
import { useState } from "react";
import ConfirmInfoDocument from "@/components/client/documents/progresses/confirm.info.document";
import templatePDF from "assets/files/template.pdf";

const { Dragger } = Upload;
const { Option } = Select;

const CreateDocument = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const { message } = App.useApp();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedScope, setSelectedScope] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const documentTemplates = [
    { id: "template1", name: "Mẫu quyết định khen thưởng" },
    { id: "template2", name: "Mẫu công văn thông báo" },
    { id: "template3", name: "Mẫu biên bản họp" },
  ];

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
    onChange(info) {
      if (info.file.status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    onRemove() {
      setUploadedFile(null);
    },
  };

  const handleConfirm = async () => {
    if (selectedScope === "incoming" && !uploadedFile) {
      message.error("Vui lòng tải lên một file trước khi xác nhận.");
      return;
    }

    if (selectedScope !== "incoming" && !selectedTemplate) {
      message.error("Vui lòng chọn một mẫu văn bản trước khi xác nhận.");
      return;
    }

    if (
      selectedScope === "outgoing" ||
      selectedScope === "school" ||
      selectedScope === "division"
    ) {
      const response = await fetch(templatePDF);
      const blob = await response.blob();
      const file = new File([blob], "template.pdf", {
        type: "application/pdf",
      });
      setUploadedFile(file);
    }
    console.log("File:", uploadedFile);
    console.log("Selected Template:", selectedTemplate);

    setOpenModalCreate(false);
    setOpenConfirmModal(true);
  };

  const handleCloseCreateDocumentModal = () => {
    setOpenModalCreate(false);
    setUploadedFile(null);
    setSelectedTemplate(null);
  };

  const handleSelectedScope = (e) => {
    setSelectedScope(e.target.value);
    setUploadedFile(null);
    setSelectedTemplate(null);
  };

  return (
    <>
      <Modal
        title="Khởi tạo văn bản"
        width="50vw"
        centered
        maskClosable={false}
        bodyProps={{
          style: {
            maxHeight: "70vh",
            overflowY: "auto",
          },
        }}
        open={openModalCreate}
        onCancel={handleCloseCreateDocumentModal}
        okText="Xác nhận"
        onOk={handleConfirm}
      >
        <Radio.Group onChange={handleSelectedScope} value={selectedScope}>
          <Radio value="incoming">Văn bản đến</Radio>
          <Radio value="outgoing">Văn bản đi</Radio>
          <Radio value="division">Nội bộ phòng ban</Radio>
          <Radio value="school">Nội bộ toàn trường</Radio>
        </Radio.Group>

        <div style={{ marginTop: 16 }}>
          {selectedScope === "incoming" ? (
            <Dragger {...propsUpload}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Nhấp hoặc kéo văn bản vào khu vực này
              </p>
              <p className="ant-upload-hint">
                Chỉ hỗ trợ định dạng .pdf, .docx, .doc
              </p>
            </Dragger>
          ) : selectedScope ? (
            <Select
              placeholder="Chọn mẫu văn bản"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedTemplate(value)}
              value={selectedTemplate}
            >
              {documentTemplates.map((template) => (
                <Option key={template.id} value={template.id}>
                  {template.name}
                </Option>
              ))}
            </Select>
          ) : null}
        </div>
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
