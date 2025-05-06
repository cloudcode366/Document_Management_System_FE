import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Upload, Select, Typography, Button } from "antd";
import React, { useState } from "react";
import { createUploadDocumentForSubmitAPI } from "@/services/api.service";
import { BeatLoader } from "react-spinners";
import ConfirmVersionModal from "./confirm.version.modal";

const { Dragger } = Upload;

const CreateVersionModal = (props) => {
  const {
    openCreateVersionModal,
    setOpenCreateVersionModal,
    documentId,
    fetchInfo,
    taskId,
  } = props;
  const { message, notification } = App.useApp();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resDocument, setResDocument] = useState({});
  const [pdfFile, setPdfFile] = useState(null);

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
    setLoading(true);
    const res = await createUploadDocumentForSubmitAPI(
      documentId,
      uploadedFile
    );
    if (res.data.statusCode === 200) {
      const data = res.data.content;
      const fileURL = convertBase64ToPdf(data.fileBase64);
      setPdfFile(fileURL);
      console.log(`>>> check pdf`, fileURL);
      setResDocument(data);
      setOpenCreateVersionModal(false);
      setOpenConfirmModal(true);
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description: res.data.content || "Xin vui lòng thử lại sau ít phút.",
      });
    }
    setLoading(false);
  };

  const convertBase64ToPdf = (base64Data) => {
    console.log(`>>>check  convertBase64ToPdf: `, base64Data);
    const uint8Array = new Uint8Array(
      atob(base64Data)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const fileBlob = new Blob([uint8Array], { type: "application/pdf" });
    return URL.createObjectURL(fileBlob); // Trả về URL của PDF
  };

  const handleCloseCreateVersionModal = () => {
    setOpenCreateVersionModal(false);
    setUploadedFile(null);
  };

  if (loading) {
    return (
      <div
        className="full-screen-overlay"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            color: "#364AD6",
            textAlign: "center",
            animation: "blink 1.5s infinite",
          }}
        >
          AI đang hỗ trợ scan văn bản của bạn, xin vui lòng đợi trong giây lát
        </div>
        <BeatLoader size={25} color="#364AD6" />
        <style>
          {`
            @keyframes blink {
              0% { opacity: 1; }
              50% { opacity: 0.6; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

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

      <ConfirmVersionModal
        openConfirmModal={openConfirmModal}
        setOpenConfirmModal={setOpenConfirmModal}
        documentId={documentId}
        resDocument={resDocument}
        setResDocument={setResDocument}
        fetchInfo={fetchInfo}
        pdfFile={pdfFile}
        setPdfFile={setPdfFile}
        taskId={taskId}
        handleCloseCreateVersionModal={handleCloseCreateVersionModal}
      />
    </>
  );
};

export default CreateVersionModal;
