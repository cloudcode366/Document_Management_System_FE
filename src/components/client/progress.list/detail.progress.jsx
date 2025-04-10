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
import DetailTask from "@/components/client/documents/progresses/detail.task";
import dayjs from "dayjs";
import AddTask from "./add.task";

const DetailProgress = (props) => {
  const {
    openDetailProgressModal,
    setOpenDetailProgressModal,
    dataViewDetail,
    setDataViewDetail,
    refreshTable,
  } = props;
  const [workflowName, setWorkflowName] = useState("");
  const [workflowRoles, setWorkflowRoles] = useState([]);
  const [workflowDetails, setWorkflowDetails] = useState([]);
  const [mode, setMode] = useState("nhiemvu");
  //   const [deadlineTime, setDeadlineTime] = useState(null);
  //   const [reviewTaskTime, setReviewTaskTime] = useState(null);
  const [listTask, setListTask] = useState([]);
  const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openTaskDetailModal, setOpenTaskDetailModal] = useState(false);
  const { message, notification } = App.useApp();
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
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
    setListTask({
      1: [
        {
          title: "Soạn dự thảo văn bản",
          thanhvien: "Nguyễn Văn A",
          start_date: "08/04/2025 08:00",
          end_date: "09/04/2025 17:00",
          status: "Đã hoàn thành",
        },
        {
          title: "Rà soát nội dung văn bản",
          thanhvien: "Trần Thị B",
          start_date: "07/04/2025 08:00",
          end_date: "08/04/2025 17:00",
          status: "Đã quá hạn",
        },
      ],
      2: [
        {
          title: "Duyệt nội dung văn bản",
          thanhvien: "Phạm Văn C",
          start_date: "08/04/2025 08:00",
          end_date: "09/04/2025 17:00",
          status: "Đang thực hiện",
        },
      ],
    });
  }, []);

  //   const handleDeadlineTimeChange = (time) => {
  //     setDeadlineTime(time);
  //     console.log("Thời gian deadline:", time?.format("HH:mm"));
  //   };

  //   const handleReviewTaskTimeChange = (time) => {
  //     setReviewTaskTime(time);
  //     console.log("Thời gian đã chọn:", time?.format("HH:mm"));
  //   };

  const handleCancel = () => {
    setOpenDetailProgressModal(false);
    // setDataViewDetail(null);
    // setWorkflowName("");
    // setWorkflowRoles([]);
    // setWorkflowDetails([]);
    // setDeadlineTime(null);
    // setReviewTaskTime(null);
    setMode("nhiemvu");
    // setListTask([]);
    setHasChanges(false);
  };

  const handleSubmit = () => {
    console.log(`>>> List task: `, listTask);
    const result = {
      tasks: listTask,
    };
    console.log("Cập nhật task trong progress detail:", result);
    notification.success({
      message: "Cập nhật nhiệm vụ thành công",
    });
    handleCancel();
  };

  return (
    <div>
      <Modal
        open={openDetailProgressModal}
        title={
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            Thông tin chi tiết luồng xử lý văn bản
          </span>
        }
        onOk={handleSubmit}
        onCancel={handleCancel}
        maskClosable={false}
        centered
        width="80vw"
        okText={"Hoàn thành"}
        bodyProps={{
          style: {
            maxHeight: "70vh",
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
        okButtonProps={{
          style: {
            display: hasChanges ? undefined : "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <Row gutter={40}>
          <Col span={12}>
            <strong style={{ fontSize: "16px" }}>Tên văn bản:</strong>{" "}
            <span style={{ fontSize: "16px" }}>{dataViewDetail?.name}</span>
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
                  Ngày khởi tạo văn bản
                </span>
              }
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Chọn ngày và giờ"
                value={
                  dataViewDetail?.created_date
                    ? dayjs(dataViewDetail.created_date)
                    : null
                }
                readOnly
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Thời hạn xử lý văn bản
                </span>
              }
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Chọn ngày và giờ"
                value={
                  dataViewDetail?.end_date
                    ? dayjs(dataViewDetail.end_date)
                    : null
                }
                readOnly
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
                  Phương thức xử lý văn bản
                </span>
              }
              required
            >
              <Radio.Group
                onChange={(e) => setMode(e.target.value)}
                value={dataViewDetail?.phuongThucXuLy}
                disabled
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

          {dataViewDetail?.phuongThucXuLy === "thoigian" && (
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
                  value={dataViewDetail?.reviewTaskTime}
                  //   onChange={handleReviewTaskTimeChange}
                  readOnly
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
                        setOpenAddTaskModal(true);
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
                            height: 250,
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            backgroundColor:
                              task.status === "Đã hoàn thành"
                                ? "#e6fffb"
                                : task.status === "Đã quá hạn"
                                ? "#fff1f0"
                                : "#fafafa",
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                            position: "relative",
                          }}
                        >
                          {["Đã hoàn thành", "Đã quá hạn"].includes(
                            task.status
                          ) ? (
                            <Tag
                              color={
                                task.status === "Đã hoàn thành"
                                  ? "#52c41a"
                                  : "#ff4d4f"
                              }
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 10,
                                fontWeight: 500,
                              }}
                            >
                              {task.status}
                            </Tag>
                          ) : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
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
                                    setHasChanges(true);
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
                          )}

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
      <AddTask
        openAddTaskModal={openAddTaskModal}
        setOpenAddTaskModal={setOpenAddTaskModal}
        listTask={listTask}
        setListTask={setListTask}
        stepId={currentStepId}
        setHasChanges={setHasChanges}
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

export default DetailProgress;
