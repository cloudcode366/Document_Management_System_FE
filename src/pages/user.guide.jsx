import React from "react";
import { Card, Typography, Space, Button } from "antd";
import { PlayCircleOutlined, DownloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const videos = [
  {
    title: "Hướng dẫn tách nền chữ ký cá nhân",
    url: "https://www.youtube.com/embed/b7Vm2Q6B3qc",
  },
  {
    title: "Hướng dẫn tải và cài đặt ứng dụng ký số",
    url: "https://www.youtube.com/embed/zO4ufXzHvnI",
    showDownload: true, // Dùng flag để hiển thị nút download
  },
];

const UserGuide = () => {
  const handleDownload = () => {
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/api/Log/view-download`,
      "_blank"
    );
  };

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          padding: 32,
          maxWidth: 960,
          margin: "40px auto",
          height: "90vh",
          overflowY: "auto",
        }}
      >
        <Title level={2}>Hướng dẫn sử dụng</Title>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {videos.map((video, index) => (
            <Card
              key={index}
              bordered
              style={{
                width: "100%",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  rowGap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flex: 1,
                    minWidth: 0, // để tránh tràn nội dung
                  }}
                >
                  <PlayCircleOutlined
                    style={{ color: "#1890ff", fontSize: 20 }}
                  />
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {video.title}
                  </Title>
                </div>

                {video.showDownload && (
                  <Button
                    icon={<DownloadOutlined style={{ color: "#1890ff" }} />}
                    size="middle"
                    style={{
                      height: 40,
                      fontSize: 16,
                      background: "#e6f4ff",
                      border: "1px solid #91d5ff",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      padding: "0 12px",
                      minWidth: 150,
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
                    onClick={handleDownload}
                  >
                    Tải ứng dụng ký số
                  </Button>
                )}
              </div>

              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe
                  src={video.url}
                  title={video.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    borderRadius: 8,
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default UserGuide;
