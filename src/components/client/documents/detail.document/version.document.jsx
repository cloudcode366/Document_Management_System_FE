import React from "react";
import { Card, Typography, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./view.detail.document.scss";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import SignatureContainer from "@/components/client/documents/initial.signature/signature.container";
import dayjs from "dayjs";
import { pdfjs } from "react-pdf";
import PDFViewerWithToken from "@/components/pdf.viewer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Title, Paragraph } = Typography;

const ViewVersionDocument = () => {
  const location = useLocation();
  const { version, documentName, createdBy } = location.state || {};
  const navigate = useNavigate();

  return (
    <div>
      <div className="view-detail-document">
        <div className="left-panel-vdd hide-scrollbar-vdd">
          <Card className="custom-card-no-padding-vdd hide-scrollbar-vdd">
            <div className="content-wrapper-vdd hide-scrollbar-vdd">
              <PDFViewerWithToken
                url={document?.finalVersion?.url}
                token={localStorage.getItem(`access_token`)}
                documentName={document?.documentName}
              />
            </div>
          </Card>
        </div>

        <div
          className="right-panel-vdd"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <Card
            className="custom-card-vdd hide-scrollbar-vdd"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #80868b",
                paddingBottom: "10px",
                paddingRight: "5px",
              }}
            >
              <Title level={5} style={{ margin: 0 }}>
                Thông tin chi tiết
              </Title>
              <Button
                type="primary"
                ghost
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: 8,
              }}
            >
              <Title
                level={4}
                style={{
                  paddingTop: "20px",
                }}
              >
                Phiên bản{" "}
                {version?.versionNumber === "0"
                  ? "gốc"
                  : version?.versionNumber}
              </Title>
              <Divider
                variant="solid"
                style={{
                  borderColor: "#80868b",
                }}
              ></Divider>
              <Title level={5}>Tổng quan văn bản</Title>
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#5f6368" }}>Người tạo:</span>
                <span
                  style={{
                    fontWeight: 500,
                    textAlign: "right",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  {createdBy}
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#5f6368" }}>Ngày tạo:</span>
                <span
                  style={{
                    fontWeight: 500,
                    textAlign: "right",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  {version?.createdDate &&
                    dayjs(version?.createdDate).format("DD-MM-YYYY HH:mm")}
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#5f6368" }}>Người từ chối:</span>
                <span
                  style={{
                    fontWeight: 500,
                    textAlign: "right",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  {version?.rejectedBy}
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#5f6368" }}>Ngày từ chối:</span>
                <span
                  style={{
                    fontWeight: 500,
                    textAlign: "right",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  {version?.rejectedDate &&
                    dayjs(version?.rejectedDate).format("DD-MM-YYYY HH:mm")}
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#5f6368" }}>Lý do:</span>
                <span
                  style={{
                    fontWeight: 500,
                    textAlign: "right",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  {version?.reason}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewVersionDocument;
