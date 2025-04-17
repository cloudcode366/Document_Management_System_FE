import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable from "react-draggable";
import signatureImage from "@/assets/files/signature-removebg-preview.png";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const CreateDraftDocument = (props) => {
  const { openModalCreateDraftDocument, setOpenModalCreateDraftDocument } =
    props;
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signaturePosition, setSignaturePosition] = useState(null);

  const pageRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDragStop = (e, data) => {
    if (pageRef.current) {
      const rect = pageRef.current.getBoundingClientRect();

      const x = data.x;
      const y = data.y;

      const xRatio = x / rect.width;
      const yRatio = y / rect.height;

      setSignaturePosition({
        page: pageNumber,
        xRatio,
        yRatio,
        widthRatio: signatureWidth / rect.width,
        heightRatio: signatureHeight / rect.height,
      });
    }
  };

  const signatureWidth = 120;
  const signatureHeight = 60;

  const handleSubmit = () => {
    if (!signaturePosition) {
      alert("Bạn chưa đặt vị trí chữ ký!");
      return;
    }

    console.log("Tọa độ chữ ký gửi về backend:", signaturePosition);
    // TODO: Gửi dữ liệu này về backend qua API
  };

  return (
    <div style={{ padding: 20 }}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {pdfFile && (
        <>
          <div style={{ margin: "10px 0" }}>
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

          <div style={{ position: "relative", display: "inline-block" }}>
            <div ref={pageRef}>
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading="Đang tải PDF..."
              >
                <Page pageNumber={pageNumber} width={600} />
              </Document>
            </div>

            <Draggable onStop={handleDragStop}>
              <img
                src={signatureImage}
                alt="Chữ ký"
                style={{
                  width: signatureWidth,
                  height: signatureHeight,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  cursor: "move",
                  zIndex: 1000,
                }}
              />
            </Draggable>
          </div>

          <div style={{ marginTop: 20 }}>
            <button onClick={handleSubmit}>Xác nhận vị trí chữ ký</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateDraftDocument;
