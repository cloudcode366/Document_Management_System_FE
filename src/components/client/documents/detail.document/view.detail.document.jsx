import React, { useState } from "react";
import {
  Card,
  Descriptions,
  Typography,
  Button,
  Divider,
  Tooltip,
  Input,
  Col,
  Row,
  Space,
  Tag,
  List,
  App,
  Modal,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import samplePDF from "assets/files/sample.pdf";
import { useNavigate } from "react-router-dom";
import "./view.detail.document.scss";
import CreateDraftDocument from "@/components/client/documents/draft.documents/create.draft.document";
import SignatureBox from "@/components/client/documents/initial.signature/signature.box";
import signatureImg from "assets/files/signature-removebg-preview.png";
import SignatureContainer from "@/components/client/documents/initial.signature/signature.container";

const { Title, Paragraph } = Typography;

const ViewDetailDocument = () => {
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const [openModalCreateDraftDocument, setOpenModalCreateDraftDocument] =
    useState(false);

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
            <iframe
              title="Document Viewer"
              src={samplePDF}
              style={{
                width: "100%",
                height: "75vh",
                border: "none",
                boxShadow: "0 10px 8px rgba(0, 0, 0, 0.1)",
              }}
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
              Văn bản quyết định 53/2025 QĐ-TTg chính sách nội trú học sinh,
              sinh viên học cao đẳng trung cấp
            </Title>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            ></Divider>
            <Title level={5}>Tổng quan văn bản</Title>
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ fontWeight: 500 }}
              style={{ marginBottom: "10px" }}
            >
              <Descriptions.Item label="Người nhận">
                namlee180505@gmail.com
              </Descriptions.Item>
              <Descriptions.Item label="Người gửi">
                locnht.it@gmail.com
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">10/02/2025</Descriptions.Item>
              <Descriptions.Item label="Ngày hết hạn">
                10/04/2025
              </Descriptions.Item>
              <Descriptions.Item label="Số hiệu văn bản">
                53/2025/QĐ-TTg
              </Descriptions.Item>
              <Descriptions.Item label="Loại văn bản">
                Quyết định
              </Descriptions.Item>
              <Descriptions.Item label="Luồng xử lý">
                Văn bản đi
              </Descriptions.Item>
              <Descriptions.Item label="Người ký">Nam Lê</Descriptions.Item>
            </Descriptions>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            ></Divider>
            <Title level={5}>Nội dung</Title>
            <Paragraph style={{ fontSize: 14 }}>
              Quyết định 53/2015/QĐ-TTg về chính sách nội trú đối với học sinh,
              sinh viên học cao đẳng, trung cấp công lập quy định đối tượng
              hưởng chính sách nội trú, mức hỗ trợ và các hỗ trợ khác, nguyên
              tắc thực hiện, phương thức chi trả, nguồn kinh phí thực hiện chính
              sách được ban hành ngày 20/10/2015.
            </Paragraph>
            <Divider
              variant="solid"
              style={{
                borderColor: "#80868b",
              }}
            ></Divider>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
                Danh sách các phiên bản
              </Typography.Text>
              <Button
                type="primary"
                size="middle"
                style={{
                  padding: "10px 12px",
                }}
                key="buttonAddNew"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenModalCreateDraftDocument(true);
                }}
              >
                Tạo bản nháp
              </Button>
            </div>

            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: "Dự thảo lần 1",
                  date: "10/04/2025",
                },
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tooltip title="Xem chi tiết" key="view">
                      <EyeOutlined
                        style={{ fontSize: 18, color: "#1890ff" }}
                        onClick={() => {
                          navigate("/draft-document");
                        }}
                      />
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <FileTextOutlined
                        style={{ fontSize: 20, color: "#8c8c8c" }}
                      />
                    }
                    title={
                      <Space>
                        <Typography.Text>{item.title}</Typography.Text>
                      </Space>
                    }
                    description={`Ngày tạo: ${item.date}`}
                  />
                </List.Item>
              )}
            />
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
      <CreateDraftDocument
        openModalCreateDraftDocument={openModalCreateDraftDocument}
        setOpenModalCreateDraftDocument={setOpenModalCreateDraftDocument}
      />
    </div>
  );
};

export default ViewDetailDocument;
