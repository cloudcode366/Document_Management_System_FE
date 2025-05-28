import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  message,
  App,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { updateTaskAPI, viewAllUserAPI } from "@/services/api.service";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { convertTaskType } from "@/services/helper";

dayjs.extend(utc);
dayjs.extend(timezone);

const { TextArea } = Input;
const { Option } = Select;

const EditInitTaskModal = (props) => {
  const {
    openEditInitTaskModal,
    setOpenEditInitTaskModal,
    currentStep,
    setCurrentStep,
    selectedTask,
    setSelectedTask,
    setTaskCreated,
    scope,
    setScope,
  } = props;
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await viewAllUserAPI(
        1,
        100000,
        { role: `${currentStep.role.roleName}` },
        {}
      );
      const data = res.data.content.map((user) => ({
        userId: user.userId,
        fullName: user.fullName,
        userName: user.userName,
      }));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (openEditInitTaskModal) {
      fetchUsers();
      form.setFieldsValue({
        title: selectedTask?.title,
        description: selectedTask?.description,
        startDate: selectedTask?.startDate
          ? dayjs(selectedTask.startDate)
          : null,
        endDate: selectedTask?.endDate ? dayjs(selectedTask.endDate) : null,
        taskType: convertTaskType(selectedTask?.taskType, scope),
        userId: selectedTask?.user?.userId,
      });
    }
  }, [openEditInitTaskModal, selectedTask]);

  const handleEdit = async (values) => {
    setIsSubmit(true);
    const { title, description, userId } = values;

    const startDate = dayjs(values.startDate).tz("Asia/Ho_Chi_Minh").format(); // Định dạng lại theo múi giờ Việt Nam
    const endDate = dayjs(values.endDate).tz("Asia/Ho_Chi_Minh").format();

    const res = await updateTaskAPI(
      selectedTask.taskId,
      title,
      description,
      startDate,
      endDate,
      userId
    );
    if (res && res.data && res.data.statusCode === 200) {
      message.success("Cập nhật nhiệm vụ thành công");
      setTaskCreated(true);
      setOpenEditInitTaskModal(false);
      setSelectedTask(null);
      setCurrentStep(null);
      setUsers([]);
      form.resetFields();
    } else {
      let errorMessage = "";
      errorMessage = res.data.content || "Đã có lỗi xảy ra";
      if (
        errorMessage ===
        "Start times of current task must be greater than end task of previous task"
      ) {
        errorMessage =
          "Thời gian bắt đầu của nhiệm vụ hiện tại phải sau thời gian kết thúc của nhiệm vụ trước đó";
      }
      if (errorMessage === "Start and end times must be greater than current") {
        errorMessage =
          "Thời gian bắt đầu và kết thúc phải lớn hơn thời gian hiện tại";
      }
      if (errorMessage === "Only one task can be created at a time") {
        errorMessage = "Chỉ có thể tạo một nhiệm vụ tại một thời điểm";
      }
      if (errorMessage === "Task in previous step not found") {
        errorMessage = "Không tìm thấy nhiệm vụ trong bước trước đó";
      }
      if (
        errorMessage ===
        "End date of the task must not be greater than the deadline"
      ) {
        errorMessage =
          "Thời gian kết thúc của nhiệm vụ không được lớn hơn thời hạn xử lý";
      }
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: errorMessage,
      });
    }
    setIsSubmit(false);
  };

  const handleCancel = () => {
    setOpenEditInitTaskModal(false);
    setSelectedTask(null);
    setUsers([]);
    setCurrentStep(null);
    form.resetFields();
  };

  return (
    <Modal
      open={openEditInitTaskModal}
      onCancel={handleCancel}
      footer={null}
      centered
      width={800}
    >
      <h2 style={{ marginBottom: 0 }}>Cập nhật nhiệm vụ</h2>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <Form form={form} layout="vertical" initialValues={{}}>
          <Form.Item
            label="Tên nhiệm vụ"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên nhiệm vụ!" }]}
          >
            <Input placeholder="Nhập tên nhiệm vụ" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea placeholder="Nhập mô tả" rows={3} />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Thời gian bắt đầu"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian bắt đầu!",
                  },
                ]}
              >
                <DatePicker
                  format="DD-MM-YYYY HH:mm"
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  placeholder="Chọn thời gian bắt đầu"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={(current) => {
                    const now = dayjs();
                    if (!current || current.isAfter(now, "day")) return {};
                    return {
                      disabledHours: () => [...Array(now.hour()).keys()],
                      disabledMinutes: (selectedHour) =>
                        selectedHour === now.hour()
                          ? [...Array(now.minute()).keys()]
                          : [],
                    };
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thời gian kết thúc"
                name="endDate"
                dependencies={["startDate"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian kết thúc!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const start = getFieldValue("startDate");
                      if (!value || !start || value.isAfter(start)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Thời gian kết thúc phải sau thời gian bắt đầu!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <DatePicker
                  format="DD-MM-YYYY HH:mm"
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  placeholder="Chọn thời gian kết thúc"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={(current) => {
                    const now = dayjs();
                    const start = form.getFieldValue("startDate");

                    if (!current) return {};

                    // Nếu ngày sau hôm nay và sau ngày bắt đầu => không giới hạn giờ phút
                    if (
                      current.isAfter(now, "day") &&
                      (!start || current.isAfter(start, "day"))
                    ) {
                      return {};
                    }

                    const refTime =
                      start && current.isSame(start, "day") ? start : now;

                    return {
                      disabledHours: () => [...Array(refTime.hour()).keys()],
                      disabledMinutes: (selectedHour) => {
                        if (selectedHour === refTime.hour()) {
                          return [...Array(refTime.minute() + 1).keys()];
                        }
                        return [];
                      },
                    };
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Nhiệm vụ chính" name="taskType">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Người thực hiện"
                name="userId"
                rules={[
                  { required: true, message: "Vui lòng chọn người thực hiện!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Vui lòng chọn người thực hiện"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {users.map((user) => (
                    <Select.Option key={user.userId} value={user.userId}>
                      {user.userName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button
              type="primary"
              onClick={async () => {
                try {
                  const values = await form.validateFields();
                  await handleEdit(values);
                } catch (error) {
                  console.log("Validation failed:", error);
                }
              }}
              size="large"
              style={{ backgroundColor: "#FC8330" }}
              loading={isSubmit}
            >
              Cập nhật nhiệm vụ
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditInitTaskModal;
