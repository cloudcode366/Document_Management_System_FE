import Icon from "@ant-design/icons";
import { LuBookMinus } from "react-icons/lu";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { getAllTasks } from "@/services/api.service";
import { useCurrentApp } from "@/components/context/app.context";
import React, { useEffect, useState } from "react";
import {
  convertScopeName,
  convertStatus,
  convertTaskType,
} from "@/services/helper";
import { getStatusColor } from "@/services/helper";
import { BeatLoader } from "react-spinners";

const AllTasks = () => {
  const { user } = useCurrentApp();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const data = await getAllTasks(user.userId);
      setLoading(false);
      setTasks(data);
    };
    fetchTasks();
  }, [user.userId]);

  const groupedTasks = tasks.reduce((acc, item) => {
    const { scope } = item;
    if (!acc[scope]) acc[scope] = [];
    acc[scope].push(item.taskDto);
    return acc;
  }, {});

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

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          {Object.entries(groupedTasks).map(([scope, taskList], index) => (
            <div
              key={index}
              style={{
                flex: "1 1 calc(25% - 20px)",
                minWidth: "250px",
                maxWidth: "350px",
                height: "100%",
                maxHeight: "calc(100vh - 100px)",
                backgroundColor: "white",
                padding: "20px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxSizing: "border-box",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {convertScopeName(scope)}
                </h3>
                <IoMdAdd />
              </div>

              {taskList.map((task) => {
                const statusColor = getStatusColor(task.taskStatus);
                return (
                  <div
                    onClick={() => navigate(`/task-detail/${task.taskId}`)}
                    key={task.taskId}
                    style={{
                      backgroundColor: "#f9faff",
                      padding: "15px",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${statusColor}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: statusColor,
                          borderRadius: "50%",
                        }}
                      ></span>
                      <span style={{ fontSize: "12px", color: statusColor }}>
                        {convertStatus(task.taskStatus)}
                      </span>
                    </div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        margin: "5px 0",
                      }}
                    >
                      {task.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#333",
                        margin: "5px 0",
                      }}
                    >
                      {convertTaskType(task.taskType)}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        margin: "5px 0",
                      }}
                    >
                      {task.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTasks;
