import React, { useEffect, useState } from "react";
import {
  Modal,
  Row,
  Col,
  Divider,
  Tag,
  Space,
  Form,
  DatePicker,
  Input,
  Radio,
  Button,
  Card,
  App,
} from "antd";
import {
  ArrowRightOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CreateTask from "@/components/client/documents/progresses/create.task";
import DetailTask from "@/components/client/documents/progresses/detail.task";

const InitProgressDocument = (props) => {
  const {
    openInitProgressDocumentModal,
    setOpenInitProgressDocumentModal,
    refreshTable,
    dataInfoDocument,
    setDataInfoDocument,
    handleCloseConfirmInfoDocumentModal,
  } = props;
  const [workflowName, setWorkflowName] = useState("");
  const [workflowRoles, setWorkflowRoles] = useState([]);
  const [workflowDetails, setWorkflowDetails] = useState([]);
  const [mode, setMode] = useState("nhiemvu");
  const [deadlineTime, setDeadlineTime] = useState(null);
  const [reviewTaskTime, setReviewTaskTime] = useState(null);
  const [listTask, setListTask] = useState([]);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openTaskDetailModal, setOpenTaskDetailModal] = useState(false);
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (dataInfoDocument) {
      if (dataInfoDocument.workflow_id === 1) {
        setWorkflowName("Văn bản đi");
        setWorkflowRoles([
          "Chuyên viên",
          "Lãnh đạo phòng ban",
          "Lãnh đạo trường",
          "Chánh văn phòng",
        ]);
        setWorkflowDetails([
          {
            from: "Chuyên viên",
            to: "Lãnh đạo phòng ban",
            actions: [
              {
                content: "Khởi tạo và chuyển tiếp văn bản",
                role: "Chuyên viên",
                step_id: 1,
              },
              {
                content: "Duyệt văn bản",
                role: "Lãnh đạo phòng ban",
                step_id: 2,
              },
            ],
          },
          {
            from: "Lãnh đạo phòng ban",
            to: "Lãnh đạo trường",
            actions: [
              {
                content: "Khởi tạo và chuyển tiếp văn bản",
                role: "Lãnh đạo phòng ban",
                step_id: 3,
              },
              {
                content: "Duyệt văn bản",
                role: "Lãnh đạo trường",
                step_id: 4,
              },
            ],
          },
          {
            from: "Lãnh đạo trường",
            to: "Chánh văn phòng",
            actions: [
              {
                content: "Khởi tạo và chuyển tiếp văn bản",
                role: "Lãnh đạo trường",
                step_id: 5,
              },
              {
                content: "Duyệt văn bản",
                role: "Chánh văn phòng",
                step_id: 6,
              },
              {
                content: "Lưu trữ văn bản / gửi văn bản ra ngoài",
                role: "Chánh văn phòng",
                step_id: 7,
              },
            ],
          },
        ]);
      }
      if (dataInfoDocument.workflow_id === 2) {
        setWorkflowName("Văn bản đến");
        setWorkflowRoles([
          "Nhân viên văn thư",
          "Chánh văn phòng",
          "Lãnh đạo trường",
        ]);
        setWorkflowDetails([
          {
            from: "Nhân viên văn thư",
            to: "Chánh văn phòng",
            actions: [
              {
                content: "Khởi tạo và lưu trữ văn bản",
                role: "Nhân viên văn thư",
                step_id: 1,
              },
              {
                content: "Duyệt và phân bổ văn bản",
                role: "Chánh văn phòng",
                step_id: 2,
              },
            ],
          },
          {
            from: "Chánh văn phòng",
            to: "Lãnh đạo trường",
            actions: [
              {
                content: "Xem văn bản đã được phân bổ",
                role: "Lãnh đạo phòng ban",
                step_id: 3,
              },
            ],
          },
        ]);
      }
      if (dataInfoDocument.workflow_id === 3) {
        setWorkflowName("Văn bản phòng ban");
        setWorkflowRoles(["Chuyên viên", "Lãnh đạo phòng ban"]);
        setWorkflowDetails([
          {
            from: "Chuyên viên",
            to: "Lãnh đạo phòng ban",
            actions: [
              {
                content: "Khởi tạo và chuyển tiếp văn bản",
                role: "Chuyên viên",
                step_id: 1,
              },
              {
                content: "Duyệt văn bản",
                role: "Lãnh đạo phòng ban",
                step_id: 2,
              },
            ],
          },
        ]);
      }
      if (dataInfoDocument.workflow_id === 4) {
        setWorkflowName("Văn bản toàn trường");
        setWorkflowRoles([
          "Chuyên viên",
          "Lãnh đạo phòng ban",
          "Lãnh đạo trường",
          "Chánh văn phòng",
        ]);
        setWorkflowDetails([
          {
            from: "Chuyên viên",
            to: "Lãnh đạo phòng ban",
            actions: [
              {
                content: "Khởi tạo và chuyển tiếp văn bản",
                role: "Chuyên viên",
                step_id: 1,
              },
              {
                content: "Duyệt văn bản",
                role: "Lãnh đạo phòng ban",
                step_id: 2,
              },
            ],
          },
          {
            from: "Lãnh đạo phòng ban",
            to: "Lãnh đạo trường",
            actions: [
              {
                content: "Khởi tạo và chuyển tiếp văn bản",
                role: "Lãnh đạo phòng ban",
                step_id: 3,
              },
              {
                content: "Duyệt văn bản",
                role: "Lãnh đạo trường",
                step_id: 4,
              },
            ],
          },
          {
            from: "Lãnh đạo trường",
            to: "Chánh văn phòng",
            actions: [
              {
                content: "Khởi tạo và chuyển tiếp văn bản",
                role: "Lãnh đạo trường",
                step_id: 5,
              },
              {
                content: "Duyệt văn bản",
                role: "Chánh văn phòng",
                step_id: 6,
              },
              {
                content: "Lưu trữ văn bản / gửi văn bản ra ngoài",
                role: "Chánh văn phòng",
                step_id: 7,
              },
            ],
          },
        ]);
      }
    }
  }, [dataInfoDocument]);

  const handleDeadlineTimeChange = (time) => {
    setDeadlineTime(time);
    console.log("Thời gian deadline:", time?.format("HH:mm"));
  };

  const handleReviewTaskTimeChange = (time) => {
    setReviewTaskTime(time);
    console.log("Thời gian đã chọn:", time?.format("HH:mm"));
  };

  const handleCancel = () => {
    handleCloseConfirmInfoDocumentModal();
    setOpenInitProgressDocumentModal(false);
    setWorkflowName("");
    setWorkflowRoles([]);
    setWorkflowDetails([]);
    setDeadlineTime(null);
    setReviewTaskTime(null);
    setMode("nhiemvu");
    setListTask([]);
  };

  const handleSubmit = () => {
    const result = {
      workflow_id: dataInfoDocument.workflow_id,
      document_name: dataInfoDocument.name,
      deadline: deadlineTime,
      review_time: mode === "thoigian" ? reviewTaskTime : null,
      mode: mode,
      tasks: listTask,
    };
    console.log("Submit data:", result);
    notification.success({
      message: "Khởi tạo luồng xử lý văn bản thành công",
    });
    handleCancel();
  };

  return (
    <div>
      <Modal
        open={openInitProgressDocumentModal}
        title={
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            Khởi tạo luồng xử lý văn bản
          </span>
        }
        onOk={handleSubmit}
        onCancel={handleCancel}
        maskClosable={false}
        centered
        closable={false}
        width="80vw"
        okText={"Tạo luồng"}
        bodyProps={{
          style: {
            maxHeight: "70vh",
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
      >
        <Row gutter={40}>
          <Col span={12}>
            <strong style={{ fontSize: "16px" }}>Tên văn bản:</strong>{" "}
            <span style={{ fontSize: "16px" }}>{dataInfoDocument.name}</span>
          </Col>
          <Col span={12}>
            <strong style={{ fontSize: "16px" }}>Luồng xử lý:</strong>{" "}
            <span style={{ fontSize: "16px" }}>{workflowName}</span>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "5px" }}>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Thời hạn xử lý văn bản
                </span>
              }
              required
              tooltip="Chọn thời hạn xử lý văn bản"
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Chọn ngày và giờ"
                value={deadlineTime}
                onChange={handleDeadlineTimeChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider
          orientation="left"
          variant="solid"
          style={{
            borderColor: "#80868b",
          }}
        >
          Quy trình xử lý
        </Divider>
        <Row gutter={8} align="middle" style={{ marginBottom: 12 }}>
          {workflowRoles.map((role, index) => (
            <React.Fragment key={index}>
              {/* Hiển thị ô role */}
              <Col>
                <Form.Item style={{ marginBottom: "12px" }}>
                  <Tag style={{ marginBottom: "8px", fontSize: "16px" }}>
                    {role}
                  </Tag>
                </Form.Item>
              </Col>
              {/* Hiển thị dấu mũi tên giữa các ô role */}
              {index < workflowRoles.length - 1 && (
                <Col>
                  <ArrowRightOutlined
                    style={{
                      fontSize: "20px",
                      padding: "0 10px",
                      marginBottom: "20px",
                    }}
                  />
                </Col>
              )}
            </React.Fragment>
          ))}
        </Row>
        <Divider
          orientation="left"
          variant="solid"
          style={{
            borderColor: "#80868b",
          }}
        >
          Thông tin quy trình
        </Divider>
        <Row gutter={40}>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Chọn phương thức xử lý văn bản
                </span>
              }
              required
            >
              <Radio.Group
                onChange={(e) => setMode(e.target.value)}
                value={mode}
              >
                <Radio value="nhiemvu">
                  <span style={{ fontSize: "14px" }}>
                    Theo nhiệm vụ mặc định
                  </span>
                </Radio>
                <Radio value="thoigian">
                  <span style={{ fontSize: "14px" }}>
                    Thời gian xem xét nhiệm vụ
                  </span>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          {mode === "thoigian" && (
            <Col span={12}>
              <Form.Item
                label="Chọn thời gian"
                required
                tooltip="Chọn thời gian hệ thống sẽ tự động xử lý"
                style={{ marginTop: "35px" }}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày và giờ"
                  value={reviewTaskTime}
                  onChange={handleReviewTaskTimeChange}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        {workflowDetails?.map((detail, idx) => (
          <div key={`${detail.from}-${detail.to}`}>
            <h4 style={{ fontSize: "16px" }}>
              Luồng {idx + 1}:{" "}
              <span style={{ fontSize: "16px" }}>{detail.from}</span> ➝{" "}
              <span style={{ fontSize: "16px" }}>{detail.to}</span>
            </h4>
            {detail.actions.map((action, actionIdx) => (
              <div key={actionIdx} style={{ marginBottom: "16px" }}>
                <Row
                  gutter={16}
                  key={actionIdx}
                  align="middle"
                  style={{ marginTop: "10px" }}
                >
                  <Col span={10}>
                    <strong style={{ fontSize: "16px" }}>
                      Bước {actionIdx + 1}:
                    </strong>{" "}
                    <span style={{ fontSize: "16px" }}>{action.content}</span>
                  </Col>
                  <Col span={10}>
                    <strong style={{ fontSize: "16px" }}>
                      Vai trò thực hiện:
                    </strong>{" "}
                    <span style={{ fontSize: "16px" }}>{action.role}</span>
                  </Col>
                  <Col span={4}>
                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      style={{
                        backgroundColor: "#FC8330",
                        borderColor: "#FC8330",
                      }}
                      onClick={() => {
                        setCurrentStepId(action.step_id);
                        setOpenCreateTaskModal(true);
                      }}
                    >
                      Tạo nhiệm vụ
                    </Button>
                  </Col>
                </Row>
                {listTask[action.step_id]?.length > 0 && (
                  <Row
                    gutter={[16, 16]}
                    style={{ marginTop: 12, marginLeft: 8 }}
                  >
                    {listTask[action.step_id].map((task, taskIdx) => (
                      <Col key={taskIdx}>
                        <Card
                          bordered={false}
                          hoverable
                          onClick={() => {
                            setSelectedTask(task);
                            setOpenTaskDetailModal(true);
                          }}
                          style={{
                            width: 300,
                            height: 250, // ✅ Chiều cao cố định
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            backgroundColor: "#fafafa",
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                            position: "relative",
                          }}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation(); // Ngăn việc mở modal xem chi tiết
                              Modal.confirm({
                                title:
                                  "Bạn có chắc chắn muốn xoá nhiệm vụ này?",
                                content: "Hành động này không thể hoàn tác.",
                                okText: "Xác nhận",
                                cancelText: "Hủy",
                                onOk: () => {
                                  const updatedTasks = listTask[
                                    action.step_id
                                  ].filter((_, idx) => idx !== taskIdx);
                                  setListTask((prev) => ({
                                    ...prev,
                                    [action.step_id]: updatedTasks,
                                  }));
                                },
                              });
                            }}
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              cursor: "pointer",
                              zIndex: 10,
                              padding: 4,
                              background: "#fff",
                              borderRadius: "50%",
                              boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                            }}
                          >
                            <CloseCircleOutlined size={14} color="#ff4d4f" />
                          </div>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#1677ff",
                            }}
                          >
                            {task.title}
                          </div>

                          <div style={{ flex: 1, marginTop: 8 }}>
                            <p
                              style={{
                                marginBottom: 6,
                              }}
                            >
                              🧑‍💼 <strong>Người thực hiện:</strong>{" "}
                              {task.thanhvien}
                            </p>
                            <p style={{ marginBottom: 6 }}>
                              🕒 <strong>Bắt đầu:</strong> {task.start_date}
                            </p>
                            <p>
                              📅 <strong>Kết thúc:</strong> {task.end_date}
                            </p>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            ))}
            <Divider />
          </div>
        ))}
      </Modal>
      <CreateTask
        openCreateTaskModal={openCreateTaskModal}
        setOpenCreateTaskModal={setOpenCreateTaskModal}
        listTask={listTask}
        setListTask={setListTask}
        stepId={currentStepId}
      />
      <DetailTask
        openTaskDetailModal={openTaskDetailModal}
        setOpenTaskDetailModal={setOpenTaskDetailModal}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
};

export default InitProgressDocument;
