import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "styles/pdf.viewer.scss";
import { Button } from "antd";
import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

// Cấu hình worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ViewPdfCreateTemplate = ({ url, token, onPageRendered }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null); // Duy trì canvas duy nhất
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5); // Mặc định zoom
  const [numPages, setNumPages] = useState(0);
  const prevPageRef = useRef(currentPage); // Dùng ref để theo dõi trang trước
  const [isPdfLoaded, setIsPdfLoaded] = useState(false); // Kiểm tra PDF đã tải xong

  // Tải PDF
  useEffect(() => {
    const loadPDF = async () => {
      if (!url || !token) return;

      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      setCurrentPage(1);
      setIsPdfLoaded(true); // Đánh dấu PDF đã tải xong
    };

    loadPDF();
  }, [url, token]);

  // Render trang hiện tại
  useEffect(() => {
    if (!isPdfLoaded || !pdfDoc) return; // Đảm bảo chỉ render khi PDF đã tải xong và có dữ liệu PDF

    const renderPage = async () => {
      if (!canvasRef.current) return;

      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Chỉ gọi onPageRendered khi trang thay đổi
      if (currentPage !== prevPageRef.current && onPageRendered) {
        onPageRendered(viewport);
      }

      prevPageRef.current = currentPage; // Cập nhật trang hiện tại sau khi render

      await page.render({ canvasContext: context, viewport }).promise;
    };

    renderPage();
  }, [pdfDoc, currentPage, scale, onPageRendered, isPdfLoaded]);

  // Điều khiển
  const zoomIn = () => setScale((prev) => prev + 0.2);
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.2));
  const goToPrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNext = () => setCurrentPage((prev) => Math.min(numPages, prev + 1));

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "document.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdf-viewer-container">
      {/* Toolbar */}
      <div className="pdf-toolbar">
        <div className="zoom-controls">
          <Button
            onClick={zoomOut}
            className="zoom-button"
            icon={<ZoomOutOutlined />}
          ></Button>
          <span className="zoom-percentage">
            Zoom: {(scale * 100).toFixed(0)}%
          </span>
          <Button
            onClick={zoomIn}
            className="zoom-button"
            icon={<ZoomInOutlined />}
          ></Button>
        </div>
        <div className="page-controls">
          <Button
            onClick={goToPrev}
            disabled={currentPage === 1}
            className="page-button"
            icon={<LeftOutlined />}
          ></Button>
          <span className="page-number">
            Trang {currentPage} / {numPages}
          </span>
          <Button
            onClick={goToNext}
            disabled={currentPage === numPages}
            className="page-button"
            icon={<RightOutlined />}
          ></Button>
        </div>
        <Button
          onClick={handleDownload}
          className="download-button"
          icon={<DownloadOutlined />}
        ></Button>
      </div>

      {/* PDF Viewer */}
      <div className="pdf-canvas-container" ref={containerRef}>
        <canvas ref={canvasRef} className="pdf-canvas" />
      </div>
    </div>
  );
};

export default ViewPdfCreateTemplate;
