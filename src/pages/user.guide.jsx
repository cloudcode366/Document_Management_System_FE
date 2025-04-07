import React from "react";
import { Card, Typography, Space } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const videos = [
  {
    title: "Hướng dẫn tách nền chữ ký cá nhân",
    url: "https://www.youtube.com/embed/b7Vm2Q6B3qc", // Thay bằng ID thực tế
  },
  {
    title: "Hướng dẫn xác định vị trí số hiệu văn bản khi tạo mẫu văn bản",
    url: "https://www.youtube.com/embed/VIDEO_ID_2", // Thay bằng ID thực tế
  },
  {
    title: "Hướng dẫn ký văn bản bằng chữ ký điện tử",
    url: "https://www.youtube.com/embed/VIDEO_ID_3", // Thay bằng ID thực tế
  },
];

const UserGuide = () => {
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
              <Title
                level={4}
                style={{
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  marginBottom: 16,
                }}
              >
                <PlayCircleOutlined
                  style={{ color: "#1890ff", fontSize: 20 }}
                />{" "}
                {video.title}
              </Title>
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
