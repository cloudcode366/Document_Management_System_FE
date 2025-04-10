// import React from 'react';

// const AllTasks = () => {
//     // Sample task data for each category
//     const taskCategories = [
//         {
//             title: "Luồng xử lý văn bản đi",
//             tasks: [
//                 {
//                     title: "Nộp văn bản",
//                     subtitle: "Báo cáo 02/2025/BC-KTNN",
//                     description: "Vụ liên quan KTNN nộp văn bản Báo cáo 02/2025/BC-KTNN nộp lên lãnh đạo trung",
//                     status: "Đang xử lý",
//                     color: "blue",
//                 },
//             ],
//         },
//         {
//             title: "Luồng xử lý văn bản đến",
//             tasks: [
//                 {
//                     title: "Duyệt văn bản",
//                     subtitle: "Quyết định 03/2025/QĐ-KTNN",
//                     description: "Vụ liên quan KTNN xem xét và duyệt văn bản Quyết định 03/2025/QĐ-KTNN thuộc phạm vi xử lý nhiệm vụ hiện hành",
//                     status: "Đang chờ xử lý",
//                     color: "orange",
//                 },
//             ],
//         },
//         {
//             title: "Luồng xử lý văn bản nội bộ phạm vi toàn trung",
//             tasks: [
//                 {
//                     title: "Duyệt văn bản",
//                     subtitle: "Kế hoạch 05/2025/KH-CNTT",
//                     description: "Vụ liên quan duyệt nhiệm vụ văn bản Kế hoạch 05/2025/KH-CNTT",
//                     status: "Đang xử lý",
//                     color: "blue",
//                 },
//             ],
//         },
//         {
//             title: "Luồng xử lý văn bản phạm vi phòng ban",
//             tasks: [
//                 {
//                     title: "Duyệt văn bản",
//                     subtitle: "Thông báo 10/2025/TB-CNTT",
//                     description: "Vụ liên quan duyệt văn bản Thông báo 10/2025/TB-CNTT",
//                     status: "Đã xong",
//                     color: "green",
//                 },
//             ],
//         },
//     ];

//     return (
//         <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
//             <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//                 {/* Task Categories */}
//                 <div
//                     style={{
//                         flex: 1,
//                         padding: "20px",
//                         display: "flex",
//                         flexWrap: "wrap", // Allow cards to wrap to the next row
//                         gap: "20px",
//                         alignItems: "stretch", // Ensure cards stretch to the same height
//                     }}
//                 >
//                     {taskCategories.map((category, index) => (
//                         <div
//     key={index}
//     style={{
//         flex: "1 1 calc(25% - 20px)",
//         minWidth: "250px",
//         maxWidth: "350px",
//         height: "100%", // chiếm hết chiều cao container
//         maxHeight: "calc(100vh - 100px)", // trừ padding/header nếu có
//         backgroundColor: "white",
//         padding: "20px",
//         boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//         borderRadius: "10px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "10px",
//         boxSizing: "border-box",
//         overflowY: "auto", // quan trọng: cho phép cuộn nếu nội dung quá dài
//     }}
// >

//                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                 <h3
//                                     style={{
//                                         fontSize: "16px",
//                                         fontWeight: "bold",
//                                         whiteSpace: "normal", // Allow text to wrap
//                                         wordBreak: "break-word", // Break long words if necessary
//                                     }}
//                                 >
//                                     {category.title}
//                                 </h3>
//                                 <span>⋯</span>
//                             </div>
//                             {category.tasks.map((task, taskIndex) => (
//                                 <div
//                                     key={taskIndex}
//                                     style={{
//                                         backgroundColor: "#f9faff",
//                                         padding: "15px",
//                                         borderRadius: "8px",
//                                         borderLeft: `4px solid ${task.color}`,
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         gap: "5px",
//                                     }}
//                                 >
//                                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                         <h4 style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>
//                                             {task.title}
//                                         </h4>
//                                         <span
//                                             style={{
//                                                 fontSize: "12px",
//                                                 color: task.color,
//                                                 backgroundColor:
//                                                     task.color === "blue" ? "#e6f0ff" : task.color === "orange" ? "#fff5e6" : "#e6ffe6",
//                                                 padding: "2px 8px",
//                                                 borderRadius: "12px",
//                                                 whiteSpace: "nowrap", // Prevent status text from wrapping
//                                             }}
//                                         >
//                                             {task.status}
//                                         </span>
//                                     </div>
//                                     <p
//                                         style={{
//                                             fontSize: "13px",
//                                             fontWeight: "500",
//                                             color: "#333",
//                                             margin: "5px 0",
//                                             whiteSpace: "normal",
//                                             wordBreak: "break-word",
//                                         }}
//                                     >
//                                         {task.subtitle}
//                                     </p>
//                                     <p
//                                         style={{
//                                             fontSize: "12px",
//                                             color: "#666",
//                                             margin: 0,
//                                             whiteSpace: "normal",
//                                             wordBreak: "break-word",
//                                         }}
//                                     >
//                                         {task.description}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Inline CSS for responsiveness */}
//             <style>
//                 {`
//                     @media (max-width: 1200px) {
//                         div[style*="flex: 1 1 calc(25% - 20px)"] {
//                             flex: 1 1 calc(33.33% - 20px); /* 3 cards per row on medium screens */
//                         }
//                     }

//                     @media (max-width: 900px) {
//                         div[style*="flex: 1 1 calc(25% - 20px)"] {
//                             flex: 1 1 calc(50% - 20px); /* 2 cards per row on smaller screens */
//                         }
//                     }

//                      @media (max-width: 900px) {
//             div[style*="flex-wrap: wrap"] {
//                 flex-direction: column !important;
//                 flex-wrap: nowrap !important;
//                 gap: 20px;
//                 overflow-y: auto;
//             }

//             div[style*="flex: 1 1 calc(25% - 20px)"] {
//                 flex: 1 1 100% !important;
//                 min-width: 0 !important;
//                 max-width: 100% !important;
//             }

//                     @media (max-width: 600px) {
//                         div[style*="flex: 1 1 calc(25% - 20px)"] {
//                             flex: 1 1 calc(100% - 20px); /* 1 card per row on mobile */
//                             min-width: 0; /* Allow full width on small screens */
//                             max-width: none; /* Remove max-width constraint */
//                         }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// };

// export default AllTasks;

import Icon from "@ant-design/icons";
import React from "react";
import { LuBookMinus } from "react-icons/lu";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AllTasks = () => {
  // Sample task data for each category
  const taskCategories = [
    {
      title: "Văn bản đi",
      tasks: [
        {
          title: "Nộp văn bản",
          subtitle: "Báo cáo 02/2025/BC-KTNN",
          description:
            "Vụ liên quan KTNN nộp văn bản Báo cáo 02/2025/BC-KTNN nộp lên lãnh đạo trung",
          status: "Đang xử lý",
          color: "blue",
          assignees: [
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no", // Placeholder for user avatar
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
          ],
        },
      ],
    },
    {
      title: "Văn bản đến",
      tasks: [
        {
          title: "Duyệt văn bản",
          subtitle: "Quyết định 03/2025/QĐ-KTNN",
          description:
            "Vụ liên quan KTNN xem xét và duyệt văn bản Quyết định 03/2025/QĐ-KTNN thuộc phạm vi xử lý nhiệm vụ hiện hành",
          status: "Đang chờ xử lý",
          color: "orange",
          assignees: [
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no", // Placeholder for user avatar
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
          ],
        },
      ],
    },
    {
      title: "Văn bản nội bộ phạm vi toàn trung",
      tasks: [
        {
          title: "Duyệt văn bản",
          subtitle: "Kế hoạch 05/2025/KH-CNTT",
          description:
            "Vụ liên quan duyệt nhiệm vụ văn bản Kế hoạch 05/2025/KH-CNTT",
          status: "Đang xử lý",
          color: "blue",
          assignees: [
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no", // Placeholder for user avatar
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
          ],
        },
      ],
    },
    {
      title: "Văn bản phạm vi phòng ban",
      tasks: [
        {
          title: "Duyệt văn bản",
          subtitle: "Thông báo 10/2025/TB-CNTT",
          description: "Vụ liên quan duyệt văn bản Thông báo 10/2025/TB-CNTT",
          status: "Đã xong",
          color: "green",
          assignees: [
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no", // Placeholder for user avatar
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
            "https://lh3.googleusercontent.com/a/ACg8ocI6cVpQdHFNblzJUq_5RBKcYxIbXDeGwP4ETCbiJLDslfMDek8J=s288-c-no",
          ],
        },
      ],
    },
  ];

  const navigate = useNavigate();

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Task Categories */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexWrap: "wrap", // Allow cards to wrap to the next row
            gap: "20px",
            alignItems: "stretch", // Ensure cards stretch to the same height
          }}
        >
          {taskCategories.map((category, index) => (
            <div
              key={index}
              style={{
                flex: "1 1 calc(25% - 20px)",
                minWidth: "250px",
                maxWidth: "350px",
                height: "100%", // Occupy full height of container
                maxHeight: "calc(100vh - 100px)", // Subtract padding/header if any
                backgroundColor: "white",
                padding: "20px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxSizing: "border-box",
                overflowY: "auto", // Allow scrolling if content is too long
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
                    whiteSpace: "normal", // Allow text to wrap
                    wordBreak: "break-word", // Break long words if necessary
                  }}
                >
                  {category.title}
                </h3>
                <IoMdAdd />
              </div>
              {category.tasks.map((task, taskIndex) => (
                <div
                  onClick={() => navigate(`/task-detail`)}
                  key={taskIndex}
                  style={{
                    backgroundColor: "#f9faff",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${task.color}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
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
                        backgroundColor: task.color,
                        borderRadius: "50%",
                      }}
                    ></span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: task.color,
                      }}
                    >
                      {task.status}
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
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {task.subtitle}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      margin: "5px 0",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {task.description}
                  </p>
                  {/* User Avatars */}
                  <div
                    style={{ display: "flex", gap: "5px", marginTop: "10px" }}
                  >
                    {task.assignees.map((avatar, avatarIndex) => (
                      <img
                        key={avatarIndex}
                        src={avatar}
                        alt="Assignee"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Inline CSS for responsiveness */}
      <style>
        {`
                    @media (max-width: 1200px) {
                        div[style*="flex: 1 1 calc(25% - 20px)"] {
                            flex: 1 1 calc(33.33% - 20px); /* 3 cards per row on medium screens */
                        }
                    }

                    @media (max-width: 900px) {
                        div[style*="flex-wrap: wrap"] {
                            flex-direction: column !important;
                            flex-wrap: nowrap !important;
                            gap: 20px;
                            overflow-y: auto;
                        }

                        div[style*="flex: 1 1 calc(25% - 20px)"] {
                            flex: 1 1 100% !important;
                            min-width: 0 !important;
                            max-width: 100% !important;
                        }
                    }

                    @media (max-width: 600px) {
                        div[style*="flex: 1 1 calc(25% - 20px)"] {
                            flex: 1 1 calc(100% - 20px); /* 1 card per row on mobile */
                            min-width: 0; /* Allow full width on small screens */
                            max-width: none; /* Remove max-width constraint */
                        }
                    }
                `}
      </style>
    </div>
  );
};

export default AllTasks;
