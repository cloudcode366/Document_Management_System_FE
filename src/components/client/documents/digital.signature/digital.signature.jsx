import React, { useEffect, useRef, useState } from "react";
import { Modal, Upload, message } from "antd";
import Draggable from "react-draggable";
import { InboxOutlined } from "@ant-design/icons";
import samplePdf from "@/assets/files/sample.pdf";
import signatureImageFile from "@/assets/files/signature-removebg-preview.png";

const DigitalSignature = (props) => {
  const { openDigitalSignatureModal, setOpenDigitalSignatureModal } = props;
  const viewerRef = useRef(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [pageNumber, setPageNumber] = useState(1);
  const documentId = "demo-doc-id";

  useEffect(() => {
    // Chuyển ảnh chữ ký sang base64 để gắn vào <img>
    if (viewerRef.current) {
      console.log("📄 PDF Viewer ready:", viewerRef.current);
    }
    const loadDefaultSignature = async () => {
      const response = await fetch(signatureImageFile);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => setSignatureImage(reader.result);
      reader.readAsDataURL(blob);
    };

    if (openDigitalSignatureModal) {
      loadDefaultSignature();
    }
  }, [openDigitalSignatureModal]);

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleSubmit = () => {
    if (!signatureImage) {
      message.error("Không tìm thấy ảnh chữ ký!");
      return;
    }

    const result = {
      documentId,
      x: position.x,
      y: position.y,
      pageNumber,
    };

    console.log("✅ Vị trí ký:", result);
    localStorage.setItem("signatureInfo", JSON.stringify(result));
    onClose();
  };

  const onClose = () => {
    setOpenDigitalSignatureModal(false);
  };

  return (
    <Modal
      open={openDigitalSignatureModal}
      onCancel={onClose}
      onOk={handleSubmit}
      title="Ký điện tử văn bản"
      width="90%"
      centered
      okText="Xác nhận vị trí ký"
      cancelText="Hủy"
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ height: "80vh", position: "relative" }}>
        {signatureImage && (
          <Draggable position={position} onDrag={handleDrag}>
            <img
              src={signatureImage}
              alt="Chữ ký"
              style={{
                position: "absolute",
                width: 150,
                height: "auto",
                cursor: "move",
                zIndex: 1000,
              }}
            />
          </Draggable>
        )}
      </div>
    </Modal>
  );
};

export default DigitalSignature;
