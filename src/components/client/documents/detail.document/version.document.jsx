import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Divider,
  Tooltip,
  Col,
  Row,
  Space,
  List,
  App,
  Form,
  Input,
  Modal,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  ExportOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./view.detail.document.scss";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import signatureImg from "assets/files/signature-removebg-preview.png";
import SignatureContainer from "@/components/client/documents/initial.signature/signature.container";
import { useCurrentApp } from "@/components/context/app.context";
import { BeatLoader } from "react-spinners";
import {
  createHandleTaskActionAPI,
  createRejectDocumentActionAPI,
  viewDetailDocumentAPI,
} from "@/services/api.service";
import dayjs from "dayjs";
import { pdfjs } from "react-pdf";
import PDFViewerWithToken from "@/components/pdf.viewer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Title, Paragraph } = Typography;

const ViewVersionDocument = () => {
  const location = useLocation();
  const { version } = location.state || {};
  const navigate = useNavigate();

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
        {/* Left Panel: PDF Viewer */}
        <Card
          style={{
            flex: 1,
            minWidth: 300,
            height: "88vh",
            overflowY: "auto",
          }}
        >
          <div style={{ height: "100%", overflowY: "auto" }}>
            <PDFViewerWithToken
              url={version?.url}
              token={localStorage.getItem(`access_token`)}
            />

            {/* Signature section */}
            <SignatureContainer>
              <div style={{ display: "inline-block", marginRight: 12 }}>
                <SignatureBox
                  name="Lê Phan Hoài Nam"
                  time="16:05 - 20/03/2025"
                  signatureImage={signatureImg}
                />
              </div>
              <div style={{ display: "inline-block", marginRight: 12 }}>
                <SignatureBox
                  name="Hà Công Hiếu"
                  time="16:05 - 21/03/2025"
                  signatureImage={signatureImg}
                />
              </div>
              <div style={{ display: "inline-block", marginRight: 12 }}>
                <SignatureBox
                  name="Ngô Huỳnh Tấn Lộc"
                  time="16:05 - 22/03/2025"
                  signatureImage={signatureImg}
                />
              </div>
              <div style={{ display: "inline-block", marginRight: 12 }}>
                <SignatureBox
                  name="Tạ Gia Nhật Minh"
                  time="16:05 - 23/04/2025"
                  signatureImage={signatureImg}
                />
              </div>
            </SignatureContainer>
          </div>
        </Card>

        {/* Right Panel: Detail Info */}
        <Card
          className="custom-card"
          style={{
            height: "88vh",
            display: "flex",
            flexDirection: "column",
            width: 400,
            minWidth: 300,
          }}
        >
          <Title
            level={5}
            style={{
              borderBottom: "1px solid #80868b",
              paddingBottom: "10px",
              paddingRight: "5px",
            }}
          >
            Thông tin chi tiết
          </Title>
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
              Phiên bản thứ {version?.versionNumber}
            </Title>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            ></Divider>
            <Title level={5}>Tổng quan phiên bản</Title>

            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Người tạo:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {version?.createdBy}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Ngày tạo:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {version?.createdDate &&
                  dayjs(version?.createdDate).format("DD-MM-YYYY HH:mm")}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <span style={{ color: "#5f6368", whiteSpace: "nowrap" }}>
                  Người ký:
                </span>

                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    wordBreak: "break-word",
                    fontWeight: 500,
                    display: "inline-block",
                    maxWidth: "50%",
                  }}
                >
                  {/* Người ký đầu tiên */}
                  <span>{version?.digitalSignatures?.[0]?.signerName}</span>
                </div>
              </div>

              {/* Các tên còn lại */}
              {version?.digitalSignatures?.slice(1).map((sig, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: "right",
                    fontWeight: 500,
                    wordBreak: "break-word",
                    marginTop: 4,
                    maxWidth: "70%",
                  }}
                >
                  {sig.signerName}
                </div>
              ))}
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Người từ chối:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {version?.rejectedBy}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Ngày bị từ chối:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {dayjs(version?.rejectedDate).format("DD-MM-YYYY HH:mm")}
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ color: "#5f6368" }}>Lý do:</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {version?.reason}
              </span>
            </div>

            <div
              style={{
                position: "absolute",
                top: 10,
                right: 16,
              }}
            >
              <Button
                type="primary"
                ghost
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewVersionDocument;
