import React from "react";
import { Modal } from "antd";

const FilePreviewModal = (props) => {
  const { open, onClose, fileUrl, name } = props;
  const renderPreview = () => {
    const fileExtension = fileUrl.split(".").pop().toLowerCase();

    // Xử lý theo loại file
    if (["jpg", "jpeg", "png"].includes(fileExtension)) {
      return <iframe src={fileUrl} title={name} style={{ width: "100%" }} />;
    }

    if (["pdf"].includes(fileExtension)) {
      return (
        <iframe
          src={fileUrl}
          title={name}
          style={{ width: "100%", height: "80vh" }}
        />
      );
    }

    if (["doc", "docx", "ppt", "pptx", "xlsx"].includes(fileExtension)) {
      const encodedUrl = encodeURIComponent(fileUrl);
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`}
          title={name}
          style={{ width: "100%", height: "80vh" }}
        />
      );
    }

    return <p>Không thể hiển thị loại tệp này: {fileExtension}</p>;
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="80%"
      centered
      title="Văn bản đính kèm"
    >
      {renderPreview()}
    </Modal>
  );
};

export default FilePreviewModal;
