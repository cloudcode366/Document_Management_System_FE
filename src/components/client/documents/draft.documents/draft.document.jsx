import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import { App } from "antd";

import signatureImage from "assets/files/signature-removebg-preview.png";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfSigner() {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signaturePosition, setSignaturePosition] = useState(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const { message } = App.useApp();

  const pageRef = useRef(null);

  const [signatureBox, setSignatureBox] = useState({
    x: 100,
    y: 100,
    width: 120,
    height: 60,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageLoad = (page) => {
    const { width, height } = page.getViewport({ scale: 1 });
    setPageDimensions({ width, height });
  };

  const updateSignatureCoordinates = (box) => {
    if (!pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();

    const lowerLeftX = box.x;
    const lowerLeftY = rect.height - (box.y + box.height);
    const upperRightX = box.x + box.width;
    const upperRightY = rect.height - box.y;

    const position = {
      page: pageNumber,
      lowerLeftX,
      lowerLeftY,
      upperRightX,
      upperRightY,
    };

    setSignaturePosition(position);
    console.log("Tọa độ chữ ký:", position);
  };

  const handleSubmit = () => {
    if (!signaturePosition) {
      message.warning("Bạn chưa đặt vị trí chữ ký!");
      return;
    }

    message.success("Tọa độ chữ ký đã được gửi về backend");
    // TODO: Gửi dữ liệu signaturePosition về backend
  };

  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {pdfFile && (
        <>
          <div
            style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
          >
            <button onClick={handleSubmit}>Xác nhận vị trí chữ ký</button>
          </div>

          <div style={{ margin: "10px 0", textAlign: "center" }}>
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => p - 1)}
            >
              Trang trước
            </button>
            <span style={{ margin: "0 10px" }}>
              Trang {pageNumber} / {numPages}
            </span>
            <button
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((p) => p + 1)}
            >
              Trang sau
            </button>
          </div>

          <div
            style={{
              position: "relative",
              display: "inline-block",
              height: "100%",
            }}
          >
            <div ref={pageRef}>
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading="Đang tải PDF..."
              >
                <Page
                  pageNumber={pageNumber}
                  width={600}
                  onLoadSuccess={handlePageLoad}
                />
              </Document>
            </div>

            {pageDimensions.width > 0 && (
              <Rnd
                size={{
                  width: signatureBox.width,
                  height: signatureBox.height,
                }}
                position={{
                  x: signatureBox.x,
                  y: signatureBox.y,
                }}
                onDragStop={(e, d) => {
                  const newBox = {
                    ...signatureBox,
                    x: d.x,
                    y: d.y,
                  };
                  setSignatureBox(newBox);
                  updateSignatureCoordinates(newBox);
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const newBox = {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                  };
                  setSignatureBox(newBox);
                  updateSignatureCoordinates(newBox);
                }}
                bounds="parent"
                enableResizing={{
                  topLeft: true,
                  topRight: true,
                  bottomLeft: true,
                  bottomRight: true,
                  top: false,
                  right: false,
                  bottom: false,
                  left: false,
                }}
                style={{
                  border: "2px dashed black",
                  zIndex: 1000,
                  position: "absolute",
                  cursor: "move",
                  backgroundColor: "rgba(255,255,255,0.6)",
                }}
              >
                <img
                  src={signatureImage}
                  alt="Chữ ký"
                  style={{
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </Rnd>
            )}
          </div>
        </>
      )}
    </div>
  );
}
