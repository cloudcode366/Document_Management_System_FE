import React from "react";
import { Card, Typography } from "antd";

const SignatureBox = ({ name, time, signatureImage }) => {
  return (
    <div style={{ width: 220, textAlign: "center" }}>
      <Card
        size="small"
        style={{
          marginBottom: 8,
          border: "none",
        }}
        title={
          <div style={{ fontSize: 12, textAlign: "left" }}>Người duyệt</div>
        }
      >
        <div style={{ padding: 8 }}>
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
              display: "block",
              border: "2px solid #969696",
              borderRadius: "5px",
              width: "100%",
              padding: "4px 6px",
              marginBottom: 13,
            }}
          >
            {name}
          </Typography.Text>

          <Typography.Text
            strong
            style={{
              display: "block",
              border: "2px solid #969696",
              borderRadius: "5px",
              width: "100%",
              padding: "4px 6px",
            }}
          >
            {time}
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default SignatureBox;
