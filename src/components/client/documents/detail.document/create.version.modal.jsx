import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Upload, Select, Radio, Typography, Button } from "antd";
import React, { useState } from "react";
import ConfirmInfoDocument from "@/components/client/documents/progresses/confirm.info.document";
import templatePDF from "assets/files/template.pdf";
import {
  createUploadDocumentAPI,
  viewWorkflowByScopeAPI,
  viewWorkflowDetailsWithFlowAndStepAPI,
} from "@/services/api.service";

const { Dragger } = Upload;
const { Option } = Select;
const { Text } = Typography;

const CreateVersionModal = (props) => {
  const { openCreateVersionModal, setOpenCreateVersionModal, documentId } =
    props;
  const { message, notification } = App.useApp();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".doc,.docx",
    fileList: uploadedFile ? [uploadedFile] : [],
    customRequest({ file, onSuccess, onError }) {
      const isValid = file.name.endsWith(".doc") || file.name.endsWith(".docx");
      if (!isValid) {
        message.error("Chỉ chấp nhận file định dạng .doc hoặc .docx!");
        onError?.(new Error("Định dạng file không hợp lệ"));
        return;
      }

      setTimeout(() => {
        file.status = "done";
        setUploadedFile(file);
        onSuccess?.("ok");
        message.success(`${file.name} tải lên thành công.`);
      }, 1000);
    },
    onRemove() {
      setUploadedFile(null);
    },
  };

  const handleConfirm = async () => {
    // const response = await fetch(templatePDF, documentId);
    // const blob = await response.blob();
    // const file = new File([blob], "template.pdf", {
    //   type: "application/pdf",
    // });
    // setUploadedFile(file);
    setOpenCreateVersionModal(false);
    setOpenConfirmModal(true);
  };

  const handleCloseCreateVersionModal = () => {
    setOpenCreateVersionModal(false);
    setUploadedFile(null);
  };

  return (
    <>
      <Modal
        title={
          <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
            Tải văn bản lên hệ thống
          </div>
        }
        width="50vw"
        centered
        maskClosable={false}
        bodyProps={{
          style: {
            maxHeight: "70vh",
            overflowY: "auto",
          },
        }}
        open={openCreateVersionModal}
        onCancel={handleCloseCreateVersionModal}
        footer={
          <Button
            type="primary"
            onClick={handleConfirm}
            disabled={!uploadedFile}
            loading={loading}
          >
            Tiếp tục
          </Button>
        }
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo văn bản vào khu vực này
          </p>
          <p className="ant-upload-hint">Chỉ hỗ trợ định dạng .doc, .docx</p>
        </Dragger>
      </Modal>

      <ConfirmInfoDocument
        openConfirmModal={openConfirmModal}
        setOpenConfirmModal={setOpenConfirmModal}
        uploadedFile={uploadedFile}
        documentId={documentId}
      />
    </>
  );
};

export default CreateVersionModal;
