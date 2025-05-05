import { useEffect, useRef, useState } from "react";
import { Modal, Button, App, Upload, Select, Input, Card, Tooltip } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import sampleImg from "assets/files/sample.jpg";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "styles/loading.scss";
import "./digital.signature.scss";
import { viewDetailDocumentAPI } from "@/services/api.service";
import { useLocation, useParams } from "react-router-dom";
import axios from "@/services/axios.customize";
import { useCurrentApp } from "@/components/context/app.context";
import LoginESignModal from "./login.e.sign";
import {
  EditOutlined,
  SignatureOutlined,
  UsbOutlined,
} from "@ant-design/icons";
import USBDigitalSignatureModal from "./usb.digital.signature";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Option } = Select;

const DigitalSignatureComponent = () => {
  const { documentId } = useParams();
  const { user } = useCurrentApp();
  const [pageNumber, setPageNumber] = useState(1);
  const [signaturePosition, setSignaturePosition] = useState(null);
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [document, setDocument] = useState(null);
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
  const [resizing, setResizing] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [originalWidth, setOriginalWidth] = useState(null);
  const [originalHeight, setOriginalHeight] = useState(null);
  const [signatureSize, setSignatureSize] = useState({
    width: 100,
    height: 50,
  });
  const [aspectRatio, setAspectRatio] = useState(0);

  const [openLoginESignModal, setOpenLoginESignModal] = useState(false);
  const [resultSignaturePosition, setResultSignaturePosition] = useState({
    llx: 0,
    lly: 0,
    urx: 0,
    ury: 0,
    page: 1,
  });
  const location = useLocation();
  const { taskId } = location.state || {};
  const [openUSBDigitalSignatureModal, setOpenUSBDigitalSignatureModal] =
    useState(false);
  const [USBReq, setUSBReq] = useState(null);

  const fetchInfo = async () => {
    setLoading(true);
    const res = await viewDetailDocumentAPI(documentId);
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      const digitalSignatures = data.digitalSignatures?.filter(
        (signature) => signature.isDigital === true
      );
      const initalSignatures = data.digitalSignatures?.filter(
        (signature) => signature.isDigital === false
      );
      const finalVersion = data.versions.find(
        (version) => version.isFinal === true
      );
      const rejectedVersions = data.versions.filter(
        (version) => version.isFinal === false
      );

      const currentTask = data.tasks.find((task) => {
        return task.status === "InProgress";
      });
      const taskType = currentTask?.taskType;
      const taskId = currentTask?.taskId;
      const taskStatus = currentTask?.status;

      if (finalVersion) {
        const blobRes = await axios.get(finalVersion.url, {
          responseType: "blob",
        });
        const blob = blobRes.data;
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        console.log(`url: `, url);
        return () => URL.revokeObjectURL(url);
      }

      setDocument({
        ...data,
        digitalSignatures,
        initalSignatures,
        finalVersion,
        rejectedVersions,
        taskType,
        taskId,
        taskStatus,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    if (user?.signDigital?.width && user?.signDigital?.height) {
      setSignatureSize({
        width: user?.signDigital?.width,
        height: user?.signDigital?.height,
      });
      setOriginalWidth(user.signDigital.width);
      setOriginalHeight(user.signDigital.height);
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", stopResize);
    };
  });

  const handleSignUSB = () => {
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
    setUSBReq({
      token: localStorage.getItem(`access_token`),
      documentId: documentId,
      llx: intLowerLeftX,
      lly: intLowerLeftY,
      urx: intUpperRightX,
      ury: intUpperRightY,
      page: pageNumber,
    });
    setOpenUSBDigitalSignatureModal(true);
  };

  const handleESign = async () => {
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
    setResultSignaturePosition({
      llx: intLowerLeftX,
      lly: intLowerLeftY,
      urx: intUpperRightX,
      ury: intUpperRightY,
      page: pageNumber,
    });
    setOpenLoginESignModal(true);
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

    // Tính toán kích thước mới
    let newWidth = x - dragPosition.x;
    let newHeight = newWidth / aspectRatio;

    // Giới hạn kích thước ảnh không ra ngoài viền của PDF
    const maxWidth = rect.width - dragPosition.x; // Kích thước tối đa của ảnh
    const maxHeight = rect.height - dragPosition.y; // Chiều cao tối đa của ảnh

    // Đảm bảo newWidth không vượt quá maxWidth và newHeight không vượt quá maxHeight
    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);

    // Cập nhật trạng thái với kích thước mới
    setSignatureSize({
      width: newWidth,
      height: newHeight,
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
    <div style={{ height: "100vh" }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: 16,
          minHeight: "90vh",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <Card
          style={{
            flex: 1,
            minWidth: 300,
            height: "88vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
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
                file={fileUrl}
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
                  src={user?.signDigital}
                  onLoad={(e) => {
                    const img = e.target;
                    setSignatureSize({
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                    });
                    setAspectRatio(img.naturalWidth / img.naturalHeight);
                  }}
                  alt="Số hiệu văn bản"
                  style={{ width: "100%", height: "100%", borderRadius: 5 }}
                  draggable={false}
                />
                <div
                  className="resizer bottom-right"
                  onMouseDown={startResize}
                  style={{
                    width: 10,
                    height: 10,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "30px",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            {(user?.mainRole?.roleName === "Leader" ||
              user?.subRole?.roleName?.endsWith("_Leader")) && (
              <Button
                icon={<SignatureOutlined style={{ color: "#08979c" }} />}
                size="middle"
                style={{
                  height: 40,
                  fontSize: 16,
                  background: "#e6fffb",
                  border: "1px solid #87e8de",
                  color: "#08979c",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  padding: "0 12px",
                  minWidth: 150,
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#b5f5ec";
                  e.currentTarget.style.border = "1px solid #5cdbd3";
                  e.currentTarget.style.color = "#006d75";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#e6fffb";
                  e.currentTarget.style.border = "1px solid #87e8de";
                  e.currentTarget.style.color = "#08979c";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={handleESign}
              >
                Ký điện tử bằng e-Sign
              </Button>
            )}
            {(user?.mainRole?.roleName === "Chief" ||
              user?.subRole?.roleName?.endsWith("_Chief")) && (
              <Button
                icon={<UsbOutlined style={{ color: "#1890ff" }} />}
                size="middle"
                style={{
                  height: 40,
                  fontSize: 16,
                  background: "#e6f4ff",
                  border: "1px solid #91d5ff",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  padding: "0 12px",
                  maxWidth: "100%",
                  minWidth: "150px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d1e9ff";
                  e.currentTarget.style.border = "1px solid #69c0ff";
                  e.currentTarget.style.color = "#096dd9";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#e6f4ff";
                  e.currentTarget.style.border = "1px solid #91d5ff";
                  e.currentTarget.style.color = "#1890ff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={handleSignUSB}
              >
                Ký điện tử bằng USB
              </Button>
            )}
          </div>
        </Card>
      </div>
      <LoginESignModal
        openLoginESignModal={openLoginESignModal}
        setOpenLoginESignModal={setOpenLoginESignModal}
        resultSignaturePosition={resultSignaturePosition}
        setResultSignaturePosition={setResultSignaturePosition}
        documentId={documentId}
        taskId={taskId}
      />
      <USBDigitalSignatureModal
        openUSBDigitalSignatureModal={openUSBDigitalSignatureModal}
        setOpenUSBDigitalSignatureModal={setOpenUSBDigitalSignatureModal}
        USBReq={USBReq}
        setUSBReq={setUSBReq}
        taskId={taskId}
        documentId={documentId}
      />
    </div>
  );
};

export default DigitalSignatureComponent;
