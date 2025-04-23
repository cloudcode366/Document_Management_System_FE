import { useEffect, useRef, useState } from "react";
import { Modal, Button, App, Upload, Select, Input } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import numberOfDocumentImage from "assets/files/NumberOfDocument.png";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "styles/loading.scss";
import { InboxOutlined } from "@ant-design/icons";
import {
  createConvertDocToPdfAPI,
  createTemplateAPI,
} from "@/services/api.service";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Dragger from "antd/es/upload/Dragger";
import "./create.document.template.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Option } = Select;

const CreateDocumentTemplate = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable, documentTypes } =
    props;
  const [pdfFile, setPdfFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signaturePosition, setSignaturePosition] = useState(null);
  const { message, notification } = App.useApp();
  const [step, setStep] = useState(1);
  const [isSubmit, setIsSubmit] = useState(false);
  const [documentTemplateName, setDocumentTemplateName] = useState(``);
  const [documentTypeId, setDocumentTypeId] = useState(``);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [template, setTemplate] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const pageRef = useRef(null);
  const signatureRef = useRef(null);
  const [pdfPageSize, setPdfPageSize] = useState({ width: 0, height: 0 });
  const [lowerLeftX, setLowerLeftX] = useState(0);
  const [lowerLeftY, setLowerLeftY] = useState(0);
  const [upperRightX, setUpperRightX] = useState(0);
  const [upperRightY, setUpperRightY] = useState(0);

  // Kéo thả hình ảnh
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

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".doc,.docx",
    fileList: uploadedFile ? [uploadedFile] : [],
    customRequest({ file, onSuccess, onError }) {
      const isValid = file.name.endsWith(".doc") || file.name.endsWith(".docx");
      if (!isValid) {
        message.error("Chỉ chấp nhận file định dạng .doc, .docx!");
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

  const handleUploadFile = async () => {
    if (!documentTemplateName || !documentTypeId || !uploadedFile) {
      message.error("Vui lòng nhập đủ thông tin và tải lên file!");
      return;
    }

    setIsSubmit(true);

    try {
      setTemplate(uploadedFile);
      const res = await createConvertDocToPdfAPI(uploadedFile);

      if (res && res.data) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob);
        setPdfFile(pdfUrl);
        setStep(2);
      } else {
        notification.error({
          message: "Lỗi đọc file",
          description: "Không thể đọc dữ liệu từ file.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi xử lý file",
        description: error?.message || "Lỗi không xác định.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleOk = async () => {
    if (!signaturePosition) {
      message.warning("Bạn chưa đặt vị trí số văn bản!");
      return;
    }

    console.log("Tọa độ chữ ký gửi về backend:", signaturePosition);
    console.log(`Thong tin khac: `, documentTemplateName, documentTypeId);
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

    const res = await createTemplateAPI(
      documentTemplateName,
      documentTypeId,
      intLowerLeftX,
      intLowerLeftY,
      intUpperRightX,
      intUpperRightY,
      pageNumber,
      template
    );

    if (res && res.data) {
      message.success("Tạo mẫu văn bản thành công!");
      handleClose();
    } else {
      message.error("Tạo mẫu văn bản thất bại!");
    }
  };

  const handleClose = () => {
    setOpenModalCreate(false);
    refreshTable();

    setPdfFile(null);
    setPageNumber(1);
    setSignaturePosition(null);
    setStep(1);
    setIsSubmit(false);
    setDocumentTemplateName("");
    setDocumentTypeId("");
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

    // Cập nhật tọa độ tính theo kích thước gốc của trang PDF
    setLowerLeftX(xRatio * pdfPageSize.width);
    setLowerLeftY(yRatio * pdfPageSize.height);
    setUpperRightX((xRatio + widthRatio) * pdfPageSize.width);
    setUpperRightY((yRatio + heightRatio) * pdfPageSize.height);

    // Cập nhật state vị trí ký
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

      setSignaturePosition({
        page: pageNumber,
        xRatio,
        yRatio,
        widthRatio,
        heightRatio,
      });

      // Tính lại tọa độ tuyệt đối
      setLowerLeftX(xRatio * pdfPageSize.width);
      setLowerLeftY(yRatio * pdfPageSize.height);
      setUpperRightX((xRatio + widthRatio) * pdfPageSize.width);
      setUpperRightY((yRatio + heightRatio) * pdfPageSize.height);
    }
  };

  return (
    <Modal
      title={
        <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
          Tạo mẫu văn bản
        </div>
      }
      open={openModalCreate}
      width="60vw"
      centered
      onCancel={handleClose}
      footer={
        step === 1 ? (
          <Button type="primary" onClick={handleUploadFile} loading={isSubmit}>
            Xác nhận thông tin
          </Button>
        ) : (
          <Button type="primary" loading={isSubmit} onClick={handleOk}>
            Xác nhận vị trí số hiệu
          </Button>
        )
      }
    >
      {step === 1 ? (
        <>
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            Vui lòng nhập tên mẫu văn bản
          </div>
          <Input
            placeholder="Nhập tên mẫu văn bản"
            value={documentTemplateName}
            onChange={(e) => setDocumentTemplateName(e.target.value)}
          />

          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            Vui lòng chọn loại văn bản
          </div>
          <Select
            placeholder="Chọn loại văn bản"
            style={{ width: "100%", marginBottom: "16px" }}
            value={documentTypeId}
            onChange={setDocumentTypeId}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {documentTypes.map((documentType) => (
              <Option
                key={documentType.documentTypeId}
                value={documentType.documentTypeId}
              >
                {documentType.documentTypeName}
              </Option>
            ))}
          </Select>

          <Dragger {...propsUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo file vào khu vực này
            </p>
            <p className="ant-upload-hint">Chỉ hỗ trợ .doc hoặc .docx &nbsp;</p>
          </Dragger>
        </>
      ) : (
        <>
          {pdfFile && (
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
          )}
        </>
      )}
    </Modal>
  );
};

export default CreateDocumentTemplate;
