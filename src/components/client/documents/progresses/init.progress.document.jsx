import React, { useEffect, useState } from "react";
import {
  Modal,
  Row,
  Col,
  Divider,
  Tag,
  Form,
  DatePicker,
  Radio,
  Button,
  Card,
  App,
  Typography,
  Space,
} from "antd";
import {
  ArrowRightOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CreateTask from "@/components/client/documents/progresses/create.task";
import DetailTask from "@/components/client/documents/progresses/detail.task";
import { useNavigate } from "react-router-dom";
import { viewWorkflowDetailsWithFlowAndStepAPI } from "@/services/api.service";

const { Title, Text } = Typography;

const InitProgressDocument = ({
  openInitProgressDocumentModal,
  setOpenInitProgressDocumentModal,
  refreshTable,
  dataInfoDocument,
  setDataInfoDocument,
  handleCloseConfirmInfoDocumentModal,
}) => {
  const [workflowDetail, setWorkflowDetail] = useState(null);
  const [mode, setMode] = useState("nhiemvu");
  const [deadlineTime, setDeadlineTime] = useState(null);
  const [reviewTaskTime, setReviewTaskTime] = useState(null);
  const [listTask, setListTask] = useState({});
  const [currentStepId, setCurrentStepId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [openTaskDetailModal, setOpenTaskDetailModal] = useState(false);
  const { notification, modal } = App.useApp();
  const navigate = useNavigate();

  // Lấy thông tin workflow
  useEffect(() => {
    const fetchWorkflow = async () => {
      const res = await viewWorkflowDetailsWithFlowAndStepAPI(
        "7dc95e1f-00c5-4791-9435-f7576d430712"
      );
      if (res?.data?.statusCode === 200) {
        setWorkflowDetail(res.data.content);
      }
    };

    if (openInitProgressDocumentModal && dataInfoDocument?.workflow_id) {
      fetchWorkflow();
    }
  }, [openInitProgressDocumentModal, dataInfoDocument?.workflow_id]);

  const handleCancel = () => {
    handleCloseConfirmInfoDocumentModal();
    setOpenInitProgressDocumentModal(false);
    resetForm();
  };

  const resetForm = () => {
    setWorkflowDetail(null);
    setDeadlineTime(null);
    setReviewTaskTime(null);
    setMode("nhiemvu");
    setListTask({});
  };

  const handleSubmit = () => {
    const payload = {
      workflow_id: dataInfoDocument.workflow_id,
      document_name: dataInfoDocument.name,
      deadline: deadlineTime,
      review_time: mode === "thoigian" ? reviewTaskTime : null,
      mode,
      tasks: listTask,
    };

    console.log("Submit data:", payload);
    notification.success({
      message: "Khởi tạo luồng xử lý văn bản thành công",
    });

    handleCancel();
    navigate("/detail-document");
  };

  const renderWorkflowRoles = () => {
    if (!workflowDetail?.flows?.length) return null;
    const roles = workflowDetail.flows.flatMap((flow, idx, arr) =>
      idx === arr.length - 1 ? [flow.roleStart, flow.roleEnd] : [flow.roleStart]
    );
    const uniqueRoles = [...new Set(roles)];
    return (
      <Row gutter={8} align="middle" style={{ marginBottom: 12 }}>
        {uniqueRoles.map((role, idx) => (
          <React.Fragment key={idx}>
            <Col>
              <Tag color="blue" style={{ fontSize: 16 }}>
                {role}
              </Tag>
            </Col>
            {idx < uniqueRoles.length - 1 && (
              <Col>
                <ArrowRightOutlined style={{ fontSize: 18 }} />
              </Col>
            )}
          </React.Fragment>
        ))}
      </Row>
    );
  };

  const renderTaskCard = (task, stepId, index) => (
    <Card
      key={index}
      hoverable
      onClick={() => {
        setSelectedTask(task);
        setOpenTaskDetailModal(true);
      }}
      style={{
        width: 300,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fafafa",
        position: "relative",
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          modal.confirm({
            title: "Bạn có chắc muốn xoá nhiệm vụ này?",
            onOk: () => {
              const updated = listTask[stepId]?.filter((_, i) => i !== index);
              setListTask((prev) => ({ ...prev, [stepId]: updated }));
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
        }}
      >
        <CloseCircleOutlined />
      </div>
      <Space direction="vertical">
        <Title level={5}>{task.title}</Title>
        <Text>👤 Người thực hiện: {task.thanhvien}</Text>
        <Text>🕒 Bắt đầu: {task.start_date}</Text>
        <Text>📅 Kết thúc: {task.end_date}</Text>
      </Space>
    </Card>
  );

  const renderWorkflowDetails = () => {
    if (!workflowDetail?.flows?.length) return null;

    return workflowDetail.flows.map((flow, idx) => (
      <div key={idx}>
        <Divider orientation="left">
          <Text strong>
            Luồng {idx + 1}: {flow.roleStart} ➝ {flow.roleEnd}
          </Text>
        </Divider>

        {flow.steps.map((step, i) => (
          <div key={step.stepId} style={{ marginBottom: 16 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Text strong>
                  Bước {i + 1}: {step.action} ({step.role.roleName})
                </Text>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => {
                    setCurrentStepId(step.step_id);
                    setOpenCreateTaskModal(true);
                  }}
                >
                  Tạo nhiệm vụ
                </Button>
              </Col>
            </Row>

            {listTask[step.stepId]?.length > 0 && (
              <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                {listTask[step.stepId].map((task, idx) =>
                  renderTaskCard(task, step.stepId, idx)
                )}
              </Row>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <>
      <Modal
        open={openInitProgressDocumentModal}
        title="Khởi tạo luồng xử lý văn bản"
        onOk={handleSubmit}
        onCancel={handleCancel}
        width="80vw"
        okText="Tạo luồng"
        maskClosable={false}
        closable={false}
        centered
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Row gutter={40}>
          <Col span={12}>
            <Text strong>Tên văn bản:</Text> {dataInfoDocument.name}
          </Col>
          <Col span={12}>
            <Text strong>Luồng xử lý:</Text> {workflowDetail?.workflowName}
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={12}>
            <Form.Item label="Thời hạn xử lý văn bản" required>
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                value={deadlineTime}
                onChange={setDeadlineTime}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Vai trò trong quy trình</Divider>
        {renderWorkflowRoles()}

        <Divider orientation="left">Thông tin quy trình</Divider>
        <Row gutter={40}>
          <Col span={12}>
            <Form.Item label="Chọn phương thức xử lý" required>
              <Radio.Group
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <Radio value="nhiemvu">Theo nhiệm vụ mặc định</Radio>
                <Radio value="thoigian">Thời gian xem xét nhiệm vụ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {mode === "thoigian" && (
            <Col span={12}>
              <Form.Item label="Chọn thời gian xử lý" required>
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: "100%" }}
                  value={reviewTaskTime}
                  onChange={setReviewTaskTime}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        {renderWorkflowDetails()}
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
    </>
  );
};

export default InitProgressDocument;
