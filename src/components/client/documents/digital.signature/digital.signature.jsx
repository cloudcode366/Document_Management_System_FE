import { useEffect, useRef, useState } from "react";
import { Modal, Button, App, Upload, Select, Input } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import numberOfDocumentImage from "assets/files/NumberOfDocument.png";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "styles/loading.scss";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./digital.signature.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DigitalSignatureModal = (props) => {
  const {
    openDigitalSignatureModal,
    setOpenDigitalSignatureModal,
    documentUrl,
  } = props;
  const [pdfFile, setPdfFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signaturePosition, setSignaturePosition] = useState(null);
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const pageRef = useRef(null);
  const signatureRef = useRef(null);
  const [pdfPageSize, setPdfPageSize] = useState({ width: 0, height: 0 });
  const [lowerLeftX, setLowerLeftX] = useState(0);
  const [lowerLeftY, setLowerLeftY] = useState(0);
  const [upperRightX, setUpperRightX] = useState(0);
  const [upperRightY, setUpperRightY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [signatureSize, setSignatureSize] = useState({
    width: 120,
    height: 20,
  });
  const [resizing, setResizing] = useState(false);
  useEffect(() => {
    return () => {
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile]);
  useEffect(() => {
    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", stopResize);
    };
  });

  const handleOk = async () => {
    if (!signaturePosition) {
      message.warning("Bạn chưa đặt vị trí số văn bản!");
      return;
    }
    console.log("Tọa độ chữ ký gửi về backend:", signaturePosition);
    console.log(`llx`, lowerLeftX);
    console.log(`lly`, lowerLeftY);
    console.log(`urx`, upperRightX);
    console.log(`ury`, upperRightY);
    console.log(`page`, pageNumber);
    // Convert tọa độ thành số nguyên
    const intLowerLeftX = Math.round(lowerLeftX);
    const intLowerLeftY = Math.round(lowerLeftY);
    const intUpperRightX = Math.round(upperRightX);
    const intUpperRightY = Math.round(upperRightY);
    // const res = await createTemplateAPI(
    //   intLowerLeftX,
    //   intLowerLeftY,
    //   intUpperRightX,
    //   intUpperRightY,
    //   pageNumber,
    // );
    // if (res && res.data) {
    //   message.success("Tạo mẫu văn bản thành công!");
    //   handleClose();
    // } else {
    //   message.error("Tạo mẫu văn bản thất bại!");
    // }
  };
  const handleClose = () => {
    setOpenDigitalSignatureModal(false);
    setPdfFile(null);
    setPageNumber(1);
    setSignaturePosition(null);
    setIsSubmit(false);
    setUploadedFile(null);
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const handleMouseDown = (e) => {
    setDragging(true);
    e.preventDefault();
  };
  const handleMouseMove = (e) => {
    if (dragging && pageRef.current) {
      const rect = pageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Giới hạn x và y sao cho ảnh không ra khỏi trang PDF
      const maxX = rect.width - signatureSize.width;
      const maxY = rect.height - signatureSize.height;
      const boundedX = Math.max(0, Math.min(x, maxX));
      const boundedY = Math.max(0, Math.min(y, maxY));
      setDragPosition({ x: boundedX, y: boundedY });
    }
  };
  const handleMouseUp = () => {
    setDragging(false);
    const rect = pageRef.current.getBoundingClientRect();
    const xRatio = dragPosition.x / rect.width;
    const yRatio = dragPosition.y / rect.height;
    const widthRatio = signatureSize.width / rect.width;
    const heightRatio = signatureSize.height / rect.height;
    // PDF origin (0,0) nằm ở góc dưới trái nên phải đảo yRatio
    const pdfLlx = xRatio * pdfPageSize.width;
    const pdfLly = (1 - yRatio - heightRatio) * pdfPageSize.height;
    const pdfUrx = (xRatio + widthRatio) * pdfPageSize.width;
    const pdfUry = (1 - yRatio) * pdfPageSize.height;
    setLowerLeftX(pdfLlx);
    setLowerLeftY(pdfLly);
    setUpperRightX(pdfUrx);
    setUpperRightY(pdfUry);
    setSignaturePosition({
      page: pageNumber,
      xRatio,
      yRatio,
      widthRatio,
      heightRatio,
    });
  };
  const startResize = (e) => {
    e.stopPropagation();
    setResizing(true);
  };
  const handleResizeMove = (e) => {
    if (!resizing || !pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Giữ nguyên tỉ lệ 6:1
    let newWidth = x - dragPosition.x;
    let newHeight = newWidth / 6;
    setSignatureSize({
      width: newWidth > 30 ? newWidth : 30, // tối thiểu
      height: newHeight > 5 ? newHeight : 5,
    });
  };
  const stopResize = () => {
    if (resizing) {
      setResizing(false);
      const rect = pageRef.current.getBoundingClientRect();
      const xRatio = dragPosition.x / rect.width;
      const yRatio = dragPosition.y / rect.height;
      const widthRatio = signatureSize.width / rect.width;
      const heightRatio = signatureSize.height / rect.height;
      const pdfLlx = xRatio * pdfPageSize.width;
      const pdfLly = (1 - yRatio - heightRatio) * pdfPageSize.height;
      const pdfUrx = (xRatio + widthRatio) * pdfPageSize.width;
      const pdfUry = (1 - yRatio) * pdfPageSize.height;
      setSignaturePosition({
        page: pageNumber,
        xRatio,
        yRatio,
        widthRatio,
        heightRatio,
      });
      setLowerLeftX(pdfLlx);
      setLowerLeftY(pdfLly);
      setUpperRightX(pdfUrx);
      setUpperRightY(pdfUry);
    }
  };
  return (
    <Modal
      title={
        <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
          Ký điện tử
        </div>
      }
      open={openDigitalSignatureModal}
      width="70vw"
      centered
      onCancel={handleClose}
      footer={
        <Button type="primary" loading={isSubmit} onClick={handleOk}>
          Xác nhận ký điện tử
        </Button>
      }
    >
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ margin: "10px 0" }}>
            <Button
              type="primary"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => p - 1)}
            >
              Trang trước
            </Button>
            <span style={{ margin: "0 10px" }}>
              Trang {pageNumber} / {numPages}
            </span>
            <Button
              type="primary"
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((p) => p + 1)}
            >
              Trang sau
            </Button>
          </div>
          <div
            ref={pageRef}
            style={{
              position: "relative",
              display: "inline-block",
              border: "2px solid #d9d9d9", // Viền màu xám nhạt
              borderRadius: 8, // Bo góc nhẹ
              backgroundColor: "#fefefe", // Nền trắng nhẹ
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              loading="Đang tải PDF..."
            >
              <Page
                pageNumber={pageNumber}
                width={600}
                onRenderSuccess={({ width, height }) => {
                  setPdfPageSize({ width, height });
                }}
                inputRef={pageRef}
              />
            </Document>
            <div
              className="resizable-box"
              style={{
                top: dragPosition.y,
                left: dragPosition.x,
                width: signatureSize.width,
                height: signatureSize.height,
              }}
              onMouseDown={handleMouseDown}
              ref={signatureRef}
            >
              <img
                src={numberOfDocumentImage}
                alt="Số hiệu văn bản"
                style={{ width: "100%", height: "100%", borderRadius: 5 }}
                draggable={false}
              />
              <div
                className="resizer bottom-right"
                onMouseDown={startResize}
              ></div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default DigitalSignatureModal;
