import React, { useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";

const SignatureContainer = ({ children }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        marginTop: 20,
      }}
    >
      {/* Nút trái/phải ở góc trên bên phải */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 16,
          zIndex: 1,
          display: "flex",
          gap: 8,
          padding: "8px",
          background: "#f9fafb",
        }}
      >
        <Button
          onClick={() => scroll("left")}
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "50%",
            padding: 4,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <LeftOutlined />
        </Button>
        <Button
          onClick={() => scroll("right")}
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "50%",
            padding: 4,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <RightOutlined />
        </Button>
      </div>

      {/* Signature container */}
      <div
        ref={scrollRef}
        style={{
          padding: "50px 0 0 0",
          background: "#f9fafb",
          overflowX: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SignatureContainer;
