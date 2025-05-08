import { getTaskById, viewProfileUserAPI } from "@/services/api.service";
import {
  convertRoleName,
  convertScopeName,
  convertTaskType,
} from "@/services/helper";
import { Image, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const TaskDetail = () => {
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(taskId);
        setTaskData(data);
        const res = await viewProfileUserAPI(data.taskDto.userId);
        const mainRole = res?.data?.content?.roles?.find(
          (r) => r.createdDate === null
        );
        const subRole = res?.data?.content?.roles?.filter(
          (r) => r.createdDate !== null
        );
        setProfile({ ...res?.data?.content, mainRole, subRole });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div
        className="full-screen-overlay"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <BeatLoader size={25} color="#364AD6" />
      </div>
    );
  }
  if (error) return <p>Lỗi: {error}</p>;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flex: 1, padding: "20px", gap: "20px" }}>
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
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
              <Tooltip title="Xem văn bản cần xử lý">
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
                  onClick={() =>
                    navigate(`/detail-document/${taskData.documentId}`)
                  }
                >
                  <span style={{ color: "white", fontSize: "20px" }}>🔍</span>
                </button>
              </Tooltip>
            </div>

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
                  {taskData.taskDto.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#5f6368",
                    paddingTop: "10px",
                  }}
                >
                  {convertScopeName(taskData.scope)} · {taskData.stepAction}
                </p>
                <div
                  style={{
                    paddingTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#666",
                    fontSize: "12px",
                  }}
                >
                  <span>🕒</span>
                  <span>
                    {formatDateTime(taskData.taskDto.startDate)} -{" "}
                    {formatDateTime(taskData.taskDto.endDate)}
                  </span>
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
                onClick={() =>
                  navigate(`/detail-document/${taskData.documentId}`)
                }
              >
                Mở văn bản
              </button>
            </div>

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
                {taskData.taskDto.description}
              </p>
            </div>

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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 0",
                  borderBottom: "1px dashed #ddd",
                }}
              >
                <Image
                  src={profile.avatar}
                  alt={profile.fullName}
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
                    {profile?.fullName}
                  </p>
                  <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
                    {convertRoleName(profile?.mainRole?.roleName)}
                  </p>
                </div>
              </div>
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
            <div>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#444" }}>
                Phân bổ nhiệm vụ
              </p>
              <h2
                style={{ fontSize: "20px", fontWeight: 600, margin: "4px 0" }}
              >
                {taskData.taskDto.title}
              </h2>

              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Loại văn bản:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {taskData.documentTypeName}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Luồng xử lý:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {taskData.workflowName}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Nhiệm vụ chính:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {convertTaskType(taskData.taskDto.taskType)}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Người giao nhiệm vụ:</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {taskData.userNameCreateTask}
                </span>
              </div>
            </div>

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
                <span style={{ float: "right", fontWeight: 500 }}>
                  {taskData.userNameCreateTask}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Bước</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {taskData.stepAction}
                </span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ color: "#5f6368" }}>Ngày tạo</span>
                <span style={{ float: "right", fontWeight: 500 }}>
                  {formatDateTime(taskData.taskDto.createdDate)}
                </span>
              </div>

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
                    <Tooltip title={profile.fullName}>
                      <Image
                        src={profile.avatar}
                        alt={profile.fullName}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid white",
                          zIndex: 10,
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

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
              <div
                style={{
                  flex: 1,
                  maxWidth: "60%",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    margin: "0 0 4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                  }}
                  title={taskData.documentName} // để hiển thị full tên khi hover
                  onClick={() =>
                    navigate(`/detail-document/${taskData.documentId}`)
                  }
                >
                  {taskData.documentName}
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                  {taskData.fileSize}
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
