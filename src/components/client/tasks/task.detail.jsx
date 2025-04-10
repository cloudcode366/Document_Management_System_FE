import React from "react";
import { MdOutlineMoreVert } from "react-icons/md";

const TaskDetail = () => {
  // Sample task data
  const task = {
    documentType: "Quyết định",
    workflow: "Văn bản ra",
    flow: "Luồng 1",
    creationDate: "13:30 15/02/2025 - 15:30 16/02/2025",
    description:
      "Follow the video tutorial above. Understand how to use each tool in the Figma application. Also learn how to make a good and correct design. Starting from the spacing, typography, content, and many other design hierarchies. Then try to make yourself with your imagination and inspiration.",
    assignees: [
      {
        name: "Maria Morgan",
        role: "Trưởng phòng - CNTT",
        avatar:
          "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
      },
      {
        name: "Piter Walberg",
        role: "Trưởng phòng - CTSV",
        avatar:
          "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
      },
      {
        name: "Jessica Gold",
        role: "Trưởng phòng - Đào tạo",
        avatar:
          "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
      },
    ],
    creator: {
      name: "Nam Le",
      email: "namlee180502@gmail.com",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
    },
    file: {
      name: "Google-certificate.pdf",
      size: "1 KB",
      status: "Thành công",
    },
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Task Detail Content */}
        <div style={{ display: "flex", flex: 1, padding: "20px", gap: "20px" }}>
          {/* Left Section: Document Preview and Task Details */}
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Document Preview */}
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                padding: "10px",
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              <img
                src="https://moit.gov.vn/upload/2005517/20230717/6389864b4b2f9d217e94904689052455.jpg"
                alt="Document Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "5px",
                  filter: "blur(5px)",
                }}
              />
              {/* Zoom Icon Button */}
              <button
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: "white", fontSize: "20px" }}>🔍</span>
              </button>
            </div>

            {/* Task Metadata */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}
                >
                  Khởi tạo văn bản
                </h3>
                <p style={{ fontSize: "14px", color: "#333", margin: "5px 0" }}>
                  {task.documentType}. {task.workflow}. {task.flow}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#666",
                    fontSize: "12px",
                  }}
                >
                  <span>🕒</span>
                  <span>{task.creationDate}</span>
                </div>
              </div>
              <button
                style={{
                  padding: "5px 15px",
                  backgroundColor: "transparent",
                  color: "#0052cc",
                  border: "1px solid #0052cc",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Mở văn bản
              </button>
            </div>

            {/* Description */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "0 0 10px 0",
                }}
              >
                Mô tả
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {task.description}
              </p>
            </div>

            {/* Assignees */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "0 0 10px 0",
                }}
              >
                Người tham gia
              </h4>
              {task.assignees.map((assignee, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 0",
                    borderBottom: "1px dashed #ddd",
                  }}
                >
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        margin: "0",
                      }}
                    >
                      {assignee.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
                      {assignee.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              fontFamily: "Google Sans, sans-serif",
              width: "360px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Phân bổ nhiệm vụ */}
            <div>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#444" }}>
                Phân bổ nhiệm vụ
              </p>
              <h2
                style={{ fontSize: "20px", fontWeight: 600, margin: "4px 0" }}
              >
                Khởi tạo văn bản
              </h2>
              <p style={{ fontSize: "14px", color: "#5f6368", margin: 0 }}>
                Văn bản ra · Luồng 1
              </p>
            </div>

            {/* Tổng quan nhiệm vụ */}
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Tổng quan nhiệm vụ
              </h3>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Người tạo</span>
                <span style={{ float: "right", fontWeight: 500 }}>Nam Le</span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Bước</span>
                <span style={{ float: "right", fontWeight: 500 }}>1</span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Ngày tạo</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  10/02/2025
                </span>
              </div>
              {/* <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px", // khoảng cách giữa text và ảnh
                    marginTop: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#5f6368",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Người tham gia
                  </div>
                  <div style={{ display: "flex" }}>
                    {[
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                    ].map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`avatar-${index}`}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid white",
                          marginLeft: index === 0 ? 0 : -10,
                          zIndex: 10 - index, // để ảnh xếp chồng đẹp
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div> */}

              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>Người tham gia</span>
                  <div style={{ display: "flex" }}>
                    {[
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                      "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
                    ].map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`avatar-${index}`}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid white",
                          marginLeft: index === 0 ? 0 : -10,
                          zIndex: 10 - index,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Kéo và thả */}
            <div
              style={{
                border: "2px dashed #ddd",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                color: "#999",
                fontSize: "14px",
              }}
            >
              <p style={{ marginBottom: "8px" }}>Kéo và thả văn bản của bạn</p>
              <p
                style={{
                  color: "#1a73e8",
                  fontWeight: 500,
                  cursor: "pointer",
                  margin: 0,
                }}
              >
                Chọn từ máy
              </p>
            </div>

            {/* File đã tải */}
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                alt="pdf"
                style={{ width: "36px", height: "36px" }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    margin: "0 0 4px",
                  }}
                >
                  Google-certificate.pdf
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                  94 KB
                </p>
              </div>
              <span
                style={{ fontSize: "12px", color: "#34a853", fontWeight: 500 }}
              >
                Thành công
              </span>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#d32f2f",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                <MdOutlineMoreVert />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
