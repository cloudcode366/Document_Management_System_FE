import {
  createHandleTaskActionAPI,
  deleteTaskAPI,
  updateConfirmTaskWithDocumentAPI,
  viewProcessDocumentDetailAPI,
} from "@/services/api.service";
import {
  convertRoleName,
  convertScopeName,
  convertStatus,
} from "@/services/helper";
import {
  ArrowRightOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditTwoTone,
  LeftOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  App,
  Button,
  Card,
  Col,
  Image,
  Input,
  Progress,
  Row,
  Space,
  Steps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import AddTaskModal from "./add.task.modal";
import { useCurrentApp } from "@/components/context/app.context";
import DetailTaskModal from "./detail.task";
import EditInitTaskModal from "./edit.init.task.modal";
import UserInfoModal from "../../users/user.info.modal";

const { Text, Title } = Typography;
const { Step } = Steps;

const getTaskColor = (status) => {
  switch (status) {
    case "Completed":
      return "#52c41a";
    case "Revised":
      return "#ff4d4f";
    case "Waiting":
      return "#d9d9d9";
    case "InProgress":
    default:
      return "#1890ff";
  }
};

const ViewInitProgress = () => {
  const { documentId, taskChiefId } = useParams();
  const [processDetail, setProcessDetail] = useState(null);
  const navigate = useNavigate();
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const { message, notification, modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [taskCreated, setTaskCreated] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const { user } = useCurrentApp();
  const [selectedTask, setSelectedTask] = useState(null);
  const [openTaskDetailModal, setOpenTaskDetailModal] = useState(false);
  const [isDeleteTask, setIsDeleteTask] = useState(false);
  const [openEditInitTaskModal, setOpenEditInitTaskModal] = useState(false);
  const [isSecondTask, setIsSecondTask] = useState(false);
  const [scope, setScope] = useState(null);
  const [openUserInfoModal, setOpenUserInfoModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchProgress = async () => {
    setLoading(true);
    const res = await viewProcessDocumentDetailAPI(documentId);
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      setProcessDetail(data);
      setTaskId(data?.workflowRequest?.flows[0]?.steps[0]?.taskDtos[0]?.taskId);
      if (
        data?.workflowRequest?.flows[0]?.steps[0]?.taskDtos.length === 1 &&
        data?.workflowRequest?.scope !== "InComing"
      ) {
        setIsSecondTask(true);
      } else {
        setIsSecondTask(false);
      }
      setScope(data?.workflowRequest?.scope);
    } else {
      notification.error({
        message: "Tải dữ liệu thất bại",
        description: res?.data?.message,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgress();
    setTaskCreated(false);
  }, [taskCreated]);

  const renderWorkflowRoles = () => {
    if (!processDetail?.workflowRequest?.flows?.length) return null;

    const roles = processDetail?.workflowRequest?.flows.flatMap(
      (flow, idx, arr) =>
        idx === arr.length - 1
          ? [flow.roleStart, flow.roleEnd]
          : [flow.roleStart]
    );

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
        style={{
          margin: "24px 10px",
          padding: "16px 24px",
          backgroundColor: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text
          strong
          style={{
            fontSize: 16,
            color: "#1d1d1f",
            marginBottom: "10px",
          }}
        >
          Sơ đồ quy trình:
        </Text>
        <Row gutter={12} align="middle" justify="start">
          {roles.map((role, idx) => (
            <React.Fragment key={idx}>
              <Col>
                <Tag
                  icon={<UserOutlined />}
                  color="processing"
                  style={{
                    fontSize: 14,
                    padding: "4px 12px",
                    borderRadius: 16,
                    marginTop: "10px",
                  }}
                >
                  {convertRoleName(role)}
                </Tag>
              </Col>
              {idx < roles.length - 1 && (
                <Col>
                  <ArrowRightOutlined
                    style={{ fontSize: 18, color: "#999", marginTop: "10px" }}
                  />
                </Col>
              )}
            </React.Fragment>
          ))}
        </Row>
      </div>
    );
  };

  const renderWorkflowDetails = () => {
    if (!processDetail?.workflowRequest?.flows?.length) return null;

    return processDetail?.workflowRequest?.flows.map((flow, idx) => (
      <div
        key={idx}
        style={{
          margin: "0 10px 20px 10px",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            backgroundColor: "#F2F2F2",
            padding: "12px 16px",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Text
            strong
            style={{
              fontSize: 16,
              color: "#1d1d1f",
            }}
          >
            Luồng {idx + 1}: {convertRoleName(flow.roleStart)} ➝{" "}
            {convertRoleName(flow.roleEnd)}
          </Text>
        </div>

        <div style={{ padding: "16px" }}>
          <Steps direction="vertical" current={flow.steps.length} size="small">
            {flow.steps.map((step, i) => (
              <Step
                key={i}
                title={<span style={{ fontSize: "16px" }}>{step.action}</span>}
                description={
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "16px" }}>Vai trò:{"  "}</span>
                        <Tag color="geekblue">
                          <span style={{ fontSize: "16px" }}>
                            {convertRoleName(step.role.roleName)}
                          </span>
                        </Tag>
                      </div>

                      <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() => {
                          handleOpenModalCreate(step);
                        }}
                        style={{ top: -20, backgroundColor: "#FC8330" }}
                      >
                        Tạo nhiệm vụ
                      </Button>
                    </div>
                    {step.taskDtos.length > 0 && (
                      <div style={{ position: "relative", marginTop: 12 }}>
                        <Button
                          icon={<LeftOutlined />}
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "40%",
                            zIndex: 2,
                            background: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            borderRadius: "50%",
                          }}
                          onClick={() => {
                            document
                              .querySelector(".task-scroll-container")
                              ?.scrollBy({ left: -300, behavior: "smooth" });
                          }}
                        />
                        <Button
                          icon={<RightOutlined />}
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "40%",
                            zIndex: 2,
                            background: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            borderRadius: "50%",
                          }}
                          onClick={() => {
                            document
                              .querySelector(".task-scroll-container")
                              ?.scrollBy({ left: 300, behavior: "smooth" });
                          }}
                        />
                        <div
                          className="task-scroll-container"
                          style={{
                            display: "flex",
                            overflowX: "auto",
                            paddingBottom: 8,
                            gap: 16,
                            scrollBehavior: "smooth",
                            paddingLeft: "40px",
                            paddingRight: "40px",
                          }}
                        >
                          {step.taskDtos.map((task, idx) =>
                            renderTaskCard(task, step, idx)
                          )}
                        </div>
                      </div>
                    )}
                  </>
                }
                icon={
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      textAlign: "center",
                      lineHeight: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#1890ff",
                      color: "white",
                      fontSize: "14px",
                    }}
                  >
                    {i + 1}
                  </div>
                }
              />
            ))}
          </Steps>
        </div>
      </div>
    ));
  };

  const renderTaskCard = (task, step, index) => (
    <Card
      key={index}
      onClick={() => {
        setSelectedTask(task);
        setOpenTaskDetailModal(true);
      }}
      hoverable
      style={{
        width: 300,
        borderRadius: 12,
        border: "1px solid transparent",
        boxShadow: "0 0 20px 4px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        position: "relative",
        padding: "16px",
        height: 320,
        transition: "all 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 28px 6px rgba(0,0,0,0.15)";
        e.currentTarget.style.border = "1px solid #1890ff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 20px 4px rgba(0,0,0,0.1)";
        e.currentTarget.style.border = "1px solid transparent";
      }}
    >
      {task.taskId !== taskId &&
        task.taskStatus !== "Completed" &&
        task.taskStatus !== "InProgress" && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              modal.confirm({
                title: "Bạn có chắc muốn xoá nhiệm vụ này?",
                cancelText: "Huỷ",
                onOk: async () => {
                  setIsDeleteTask(true);

                  try {
                    const res = await deleteTaskAPI(task.taskId);

                    if (res?.data?.statusCode === 200) {
                      message.success("Xoá nhiệm vụ thành công");
                      setTaskCreated(true);
                    } else {
                      let errorMessage = res?.data?.content;
                      if (
                        errorMessage === "Task 1 has completed, cannot delete"
                      ) {
                        errorMessage =
                          "Nhiệm vụ đầu tiên của luồng xử lý đã hoàn thành, không thể xóa nhiệm vụ được nữa!";
                      }
                      notification.error({
                        message: "Hệ thống đang bận",
                        description: errorMessage,
                      });
                    }
                  } catch (error) {
                    notification.error({
                      message: "Lỗi hệ thống",
                      description:
                        "Không thể xóa nhiệm vụ, xin vui lòng thử lại sau.",
                    });
                  } finally {
                    setIsDeleteTask(false);
                  }
                },
                loading: isDeleteTask,
              });
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "#fff",
              borderRadius: "50%",
              boxShadow: "0 0 4px rgba(0,0,0,0.2)",
              padding: 4,
              zIndex: 10,
              cursor: "pointer",
            }}
          >
            <Tooltip title="Xoá nhiệm vụ">
              <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
            </Tooltip>
          </div>
        )}

      <Space direction="vertical" style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            height: "60px",
            background: "rgba(200, 200, 200, 0.3)",
            filter: "blur(4px)",
            borderRadius: "4px",
            margin: "8px 0",
          }}
        >
          <div
            style={{
              width: "80%",
              height: "10px",
              background: "rgba(150, 150, 150, 0.5)",
              margin: "8px auto",
            }}
          />
          <div
            style={{
              width: "60%",
              height: "10px",
              background: "rgba(150, 150, 150, 0.5)",
              margin: "8px auto",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tooltip title={task.title}>
            <Title
              level={5}
              style={{
                margin: 0,
                fontWeight: "bold",
                color: "#333",
                maxWidth: "80%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {task.title}
            </Title>
          </Tooltip>
          {task.taskId !== taskId &&
            task.taskStatus !== "Completed" &&
            task.taskStatus !== "InProgress" && (
              <Tooltip title="Cập nhật nhiệm vụ này">
                <EditTwoTone
                  twoToneColor="#f57800"
                  style={{ cursor: "pointer", marginRight: 15, fontSize: 18 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(task);
                    setCurrentStep(step);
                    setOpenEditInitTaskModal(true);
                  }}
                />
              </Tooltip>
            )}
        </div>

        <Text style={{ color: "#666", fontSize: 14, marginTop: 0 }}>
          {convertRoleName(step.role.roleName)} . Bước {step.stepNumber}
        </Text>

        <div style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: "bold", color: "#333" }}>
            {convertStatus(task.taskStatus)}
          </Text>
          <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
            <Progress
              percent={
                task.taskStatus === "Completed"
                  ? 100
                  : task.taskStatus === "InProgress"
                  ? 50
                  : 0
              }
              showInfo={false}
              strokeColor={getTaskColor(task.taskStatus)}
              trailColor="#e6f7ff"
              style={{ flex: 1 }}
            />
            <Text
              style={{
                marginLeft: 8,
                fontWeight: "bold",
                color: getTaskColor(task.taskStatus),
              }}
            >
              {task.taskStatus === "Completed"
                ? 100
                : task.taskStatus === "InProgress"
                ? 50
                : 0}
              %
            </Text>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#666", fontSize: 14 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {dayjs(task?.startDate).format("DD-MM-YYYY HH:mm")}
          </Text>
          <Tooltip title={task?.user?.fullName}>
            <img
              width={24}
              height={24}
              src={task?.user?.avatar}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              onClick={(e) => {
                e.stopPropagation();
                setOpenUserInfoModal(true);
                setCurrentUser(task?.user);
              }}
            />
          </Tooltip>
        </div>
      </Space>
    </Card>
  );

  const handleComplete = async () => {
    setIsSubmit(true);
    if (
      (user?.mainRole?.roleName === "Chief" ||
        user?.subRole?.roleName?.endsWith("_Chief")) &&
      processDetail?.workflowRequest?.scope === "InComing"
    ) {
      const res = await createHandleTaskActionAPI(
        taskChiefId,
        user.userId,
        "SubmitDocument"
      );
      if (res?.data?.statusCode === 200) {
        notification.success({
          message: "Hoàn thành",
          description: "Hoàn thành phân bổ văn bản thành công.",
        });
        navigate(`/detail-progress/${documentId}`);
      } else {
        notification.error({
          message: "Hệ thống đang bận!",
          description: "Xin vui lòng thử lại sau.",
        });
      }
    } else if (
      (user?.mainRole?.roleName === "Clerical Assistant" ||
        user?.subRole?.roleName === "Clerical Assistant") &&
      processDetail?.workflowRequest?.scope === "InComing"
    ) {
      const res = await updateConfirmTaskWithDocumentAPI(documentId);
      if (res?.data?.statusCode === 200) {
        const res2 = await createHandleTaskActionAPI(
          taskId,
          user.userId,
          "SubmitDocument"
        );
        if (res2?.data?.statusCode === 200) {
          notification.success({
            message: "Hoàn thành",
            description:
              "Hoàn thành giao văn bản tới chánh văn phòng thành công.",
          });
          navigate(`/detail-progress/${documentId}`);
        } else {
          notification.error({
            message: "Xác nhận hoàn thành không thành công!",
            description: res2?.data?.content,
          });
        }
      } else {
        notification.error({
          message: "Hệ thống đang bận!",
          description: "Xin vui lòng thử lại sau.",
        });
      }
    } else {
      const res = await createHandleTaskActionAPI(
        taskId,
        user.userId,
        "SubmitDocument"
      );
      if (res?.data?.statusCode === 200) {
        notification.success({
          message: "Hoàn thành",
          description: "Hoàn thành khởi tạo nhiệm vụ xử lý văn bản thành công.",
        });
        navigate(`/detail-progress/${documentId}`);
      } else {
        let errorMessage = "";
        if (res?.data?.content === "Task 2 step 1 must be upload") {
          errorMessage =
            "Nhiệm vụ thứ 2 của bước 1 trong luồng 1 phải có nhiệm vụ chính là tải văn bản lên!";
        }
        if (res?.data?.content === "There is a step without task") {
          errorMessage = "Có một bước không có nhiệm vụ nào được tạo!";
        }
        notification.error({
          message: "Xác nhận không thành công",
          description:
            errorMessage ||
            "Vui lòng kiểm tra lại đã có ít nhất một nhiệm vụ được phân bổ trong mỗi bước hay chưa!",
        });
      }
    }

    setIsSubmit(false);
  };

  const handleOpenModalCreate = (step) => {
    setCurrentStep(step);
    setOpenModalCreate(true);
  };

  const labelStyle = {
    fontSize: 16,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    height: 40,
  };

  const inputStyle = {
    fontSize: 16,
    height: 40,
  };

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
    <div style={{ height: "100vh" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
          borderRadius: "10px",
          marginTop: "20px",
          height: "calc(100vh - 40px)",
          overflowY: "auto",
        }}
      >
        <h2>Khởi tạo nhiệm vụ xử lý văn bản</h2>
        <div style={{ margin: "20px 10px 0 10px" }}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={4}>
              <div style={labelStyle}>Tên văn bản:</div>
            </Col>
            <Col span={18} style={{ marginRight: 80 }}>
              <Input
                style={inputStyle}
                allowClear
                value={processDetail?.documentName}
                readOnly
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} align="middle" style={{ marginTop: 16 }}>
            <Col span={4}>
              <div style={labelStyle}>Tên luồng xử lý:</div>
            </Col>
            <Col span={18} style={{ marginRight: 80 }}>
              <Input
                style={inputStyle}
                allowClear
                value={processDetail?.workflowRequest?.workflowName}
                readOnly
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} align="middle" style={{ marginTop: 16 }}>
            <Col span={4}>
              <div style={labelStyle}>Loại văn bản:</div>
            </Col>
            <Col span={7}>
              <Input
                style={inputStyle}
                allowClear
                value={processDetail?.documentTypeName}
                readOnly
              />
            </Col>
            <Col span={4}>
              <div style={labelStyle}>Phạm vi ban hành:</div>
            </Col>
            <Col span={7}>
              <Input
                style={inputStyle}
                allowClear
                value={convertScopeName(processDetail?.workflowRequest?.scope)}
                readOnly
              />
            </Col>
          </Row>
        </div>

        {renderWorkflowRoles()}

        {renderWorkflowDetails()}
        <div style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={handleComplete}
            style={{
              backgroundColor: "#FC8330",
              borderColor: "#FC8330",
              marginTop: 20,
              marginBottom: 40,
            }}
            loading={isSubmit}
            icon={<CheckOutlined />}
          >
            Xác nhận hoàn thành
          </Button>
        </div>

        <AddTaskModal
          openModalCreate={openModalCreate}
          setOpenModalCreate={setOpenModalCreate}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          taskCreated={taskCreated}
          setTaskCreated={setTaskCreated}
          documentId={documentId}
          isSecondTask={isSecondTask}
          setIsSecondTask={setIsSecondTask}
          scope={scope}
          setScope={setScope}
        />
        <DetailTaskModal
          openTaskDetailModal={openTaskDetailModal}
          setOpenTaskDetailModal={setOpenTaskDetailModal}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
        <EditInitTaskModal
          openEditInitTaskModal={openEditInitTaskModal}
          setOpenEditInitTaskModal={setOpenEditInitTaskModal}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          setTaskCreated={setTaskCreated}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        <UserInfoModal
          openUserInfoModal={openUserInfoModal}
          setOpenUserInfoModal={setOpenUserInfoModal}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      </div>
    </div>
  );
};

export default ViewInitProgress;
