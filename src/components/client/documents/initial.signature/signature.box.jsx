import React from "react";
import { Card, Typography } from "antd";

const SignatureBox = ({ name, time, signatureImage }) => {
  return (
    <div style={{ width: 220, textAlign: "center" }}>
      <Card
        size="small"
        title="Người duyệt"
        headStyle={{ fontSize: 12, textAlign: "left" }}
        bodyStyle={{ padding: 8 }}
        style={{
          marginBottom: 8,
          border: "none",
        }}
      >
        <img
          src={signatureImage}
          alt="signature"
          style={{
            width: "100%",
            height: 80,
            objectFit: "contain",
            marginBottom: 8,
            border: "2px solid #969696",
            borderRadius: "5px",
          }}
        />
        <Typography.Text
          strong
          style={{
            display: "block", // Đảm bảo full width
            border: "2px solid #969696",
            borderRadius: "5px",
            width: "100%",
            padding: "4px 6px", // Cho khoảng cách đều đẹp hơn
            marginBottom: 13,
          }}
        >
          {name}
        </Typography.Text>

        <Typography.Text
          strong
          style={{
            display: "block", // Đảm bảo full width
            border: "2px solid #969696",
            borderRadius: "5px",
            width: "100%",
            padding: "4px 6px", // Cho khoảng cách đều đẹp hơn
          }}
        >
          {time}
        </Typography.Text>
      </Card>
    </div>
  );
};

export default SignatureBox;
