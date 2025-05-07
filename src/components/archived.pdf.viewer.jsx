import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "styles/pdf.viewer.scss";
import { Button, Spin } from "antd";
import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

// Cấu hình worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ArchivedPDFViewerWithToken = (props) => {
  const { url, token, documentName, canGrant, canDownLoad } = props;
  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Tải PDF
  useEffect(() => {
    const loadPDF = async () => {
      if (!url || !token) return;

      setIsLoading(true);

      const loadingTask = pdfjsLib.getDocument({
        url,
        httpHeaders: { Authorization: `Bearer ${token}` },
      });

      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      setCurrentPage(1);
      setIsLoading(false);
    };

    loadPDF();
  }, [url, token]);

  // Render trang hiện tại
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !containerRef.current) return;

      containerRef.current.innerHTML = "";

      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      containerRef.current.appendChild(canvas);

      await page.render({ canvasContext: context, viewport }).promise;
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

  // Điều khiển
  const zoomIn = () => setScale((prev) => prev + 0.2);
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.2));
  const goToPrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNext = () => setCurrentPage((prev) => Math.min(numPages, prev + 1));

  const handleDownload = async () => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Lỗi khi tải file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${documentName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Tải file thất bại:", error);
    }
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
        {(canGrant || canDownLoad) && (
          <Button
            onClick={handleDownload}
            className="download-button"
            icon={<DownloadOutlined />}
          ></Button>
        )}
      </div>

      {/* PDF Viewer */}
      <Spin spinning={isLoading} tip="Đang tải mẫu văn bản...">
        <div ref={containerRef} className="pdf-canvas-container" />
      </Spin>
    </div>
  );
};

export default ArchivedPDFViewerWithToken;
