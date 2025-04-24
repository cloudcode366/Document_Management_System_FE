import {
  createHandleTaskActionAPI,
  updateConfirmTaskWithDocumentAPI,
  viewProcessDocumentDetailAPI,
} from "@/services/api.service";
import { convertRoleName, convertScopeName } from "@/services/helper";
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
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
import { Dropdown, Menu } from "antd";
import { BeatLoader } from "react-spinners";
import AddTaskModal from "./add.task.modal";
import { useCurrentApp } from "@/components/context/app.context";

const { Text, Title } = Typography;
const { Step } = Steps;

const getTaskColor = (status) => {
  switch (status) {
    case "Completed":
      return "#52c41a";
    case "Rejected":
      return "#ff4d4f";
    case "Waiting":
      return "#d9d9d9";
    case "InProgress":
    default:
      return "#1890ff";
  }
};

const ViewInitProgress = () => {
  const { documentId } = useParams();
  const [processDetail, setProcessDetail] = useState(null);
  const navigate = useNavigate();
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const { message, notification, modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [taskCreated, setTaskCreated] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const { user } = useCurrentApp();

  const fetchProgress = async () => {
    setLoading(true);
    const res = await viewProcessDocumentDetailAPI(documentId);
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      setProcessDetail(data);
      setTaskId(data?.workflowRequest?.flows[0]?.steps[0]?.taskDtos[0]?.taskId);
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
    const uniqueRoles = [...new Set(roles)];

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
          {uniqueRoles.map((role, idx) => (
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
              {idx < uniqueRoles.length - 1 && (
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
                          setCurrentStep(step);
                          setOpenModalCreate(true);
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
        // setSelectedTask(task);
        // setOpenTaskDetailModal(true);
      }}
      hoverable
      style={{
        width: 300,
        borderRadius: 12,
        border: "1px solid transparent", // 👈 ẩn viền ban đầu
        boxShadow: "0 0 20px 4px rgba(0,0,0,0.1)", // đổ bóng đều
        backgroundColor: "#fff",
        position: "relative",
        padding: "16px",
        height: 300,
        transition: "all 0.3s ease-in-out", // hiệu ứng mượt cho cả border và shadow
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 28px 6px rgba(0,0,0,0.15)";
        e.currentTarget.style.border = "1px solid #1890ff"; // 👈 hiện viền khi hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 20px 4px rgba(0,0,0,0.1)";
        e.currentTarget.style.border = "1px solid transparent"; // 👈 ẩn lại viền
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          modal.confirm({
            title: "Bạn có chắc muốn xoá nhiệm vụ này?",
            onOk: () => {
              // const updated = listTask[stepId]?.filter((_, i) => i !== index);
              // setListTask((prev) => ({ ...prev, [stepId]: updated }));
              message.success(`Xóa nhiệm vụ thành công`);
            },
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
        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
      </div>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Simulate the blurred "Thông tin chi tiết" section */}
        <div
          style={{
            width: "100%",
            height: "60px", // Adjust height to match the blurred area in the image
            background: "rgba(200, 200, 200, 0.3)", // Light gray background to mimic blur
            filter: "blur(4px)", // CSS blur effect
            borderRadius: "4px",
            margin: "8px 0",
          }}
        >
          {/* Optional: Add placeholder text or shapes to mimic content underneath */}
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
          <Title
            level={5}
            style={{ margin: 0, fontWeight: "bold", color: "#333" }}
          >
            {task.title}
          </Title>
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu
                onClick={({ key }) => {
                  if (key === "edit") {
                    // Thực hiện mở modal chỉnh sửa
                    console.log("Chỉnh sửa:", task);
                    // setSelectedTask(task);
                    // setOpenEditTaskModal(true);
                  } else if (key === "view") {
                    navigate(`/task-detail/${task.taskId}`);
                  }
                }}
                items={[
                  {
                    key: "edit",
                    label: "Chỉnh sửa",
                  },
                  {
                    key: "view",
                    label: "Xem chi tiết",
                  },
                ]}
              />
            }
          >
            <HiOutlineDotsCircleHorizontal
              style={{ fontSize: 20, cursor: "pointer" }}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </div>

        <Text style={{ color: "#666", fontSize: 14, marginTop: 0 }}>
          {convertRoleName(step.role.roleName)} . Bước {step.stepNumber}
        </Text>

        <div style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: "bold", color: "#333" }}>
            {task.taskStatus}
          </Text>
          <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
            <Progress
              percent={task.taskStatus === "Completed" ? 100 : 0}
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
              {task.taskStatus === "Completed" ? 100 : 0}%
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
            <Image
              width={24}
              height={24}
              src={task?.user?.avatar}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </Tooltip>
        </div>
      </Space>
    </Card>
  );

  const handleComplete = async () => {
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
          description: "Hoàn thành xử lý văn bản thành công.",
        });
        navigate(`/detail-progress/${documentId}`);
      } else {
        notification.error({
          message: "Hệ thống đang bận!",
          description: "Xin vui lòng thử lại sau.",
        });
      }
    } else {
      notification.error({
        message: "Hệ thống đang bận!",
        description: "Xin vui lòng thử lại sau.",
      });
    }
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
        <h2>Thông tin quá trình xử lý văn bản</h2>
        <div style={{ margin: "20px 10px 0 10px" }}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={4}>
              <div style={labelStyle}>Tên văn bản:</div>
            </Col>
            <Col span={7} style={{ marginRight: 80 }}>
              <Input
                style={inputStyle}
                allowClear
                value={processDetail?.documentName}
                readOnly
              />
            </Col>

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
          </Row>

          <Row gutter={[16, 16]} align="middle" style={{ marginTop: 16 }}>
            <Col span={4}>
              <div style={labelStyle}>Tên luồng xử lý:</div>
            </Col>
            <Col span={7} style={{ marginRight: 80 }}>
              <Input
                style={inputStyle}
                allowClear
                value={processDetail?.workflowRequest?.workflowName}
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
            }}
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
        />
      </div>
    </div>
  );
};

export default ViewInitProgress;
