import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Button,
  Row,
  Col,
  Divider,
  message,
  Typography,
  Steps,
  Tag,
  Descriptions,
  Tooltip,
  notification,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  ArrowRightOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  createWorkflowAPI,
  viewAllDocumentTypesAPI,
  viewAllFlowsAPI,
  viewAllRoles,
  viewWorkflowDetailsWithFlowAndStepAPI,
} from "@/services/api.service";
import { convertRoleName, convertScopeName } from "@/services/helper";
import "styles/loading.scss";
import { BeatLoader } from "react-spinners";
import { useCurrentApp } from "@/components/context/app.context";
import uniqBy from "lodash/uniqBy";

const { Option } = Select;
const { Title, Text } = Typography;
const { Step } = Steps;

const CreateWorkflow = ({
  openModalCreate,
  setOpenModalCreate,
  refreshTable,
  mainWorkflows,
}) => {
  const { user } = useCurrentApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [roleRes, setRoleRes] = useState([]);
  const [flows, setFlows] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [scope, setScope] = useState("");
  const [workflowDetail, setWorkflowDetail] = useState(null);
  const [workflowRoles, setWorkflowRoles] = useState([]);
  const [addingIndex, setAddingIndex] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const fetchDocumentTypes = async () => {
    setLoading(true);
    const res = await viewAllDocumentTypesAPI("page=1&limit=1000");
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      const newDocumentTypeData = data.map((docType) => ({
        documentTypeId: docType.documentTypeId,
        documentTypeName: docType.documentTypeName,
      }));
      setDocumentTypes(newDocumentTypeData);
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    setLoading(true);
    const res = await viewAllRoles();
    if (res?.data?.statusCode === 200) {
      const mainRole = res.data.content.filter((r) => r.createdDate === null);
      const newRolesData = mainRole
        .filter((role) => role.roleName !== "Admin")
        .map((role) => ({
          roleId: role.roleId,
          roleName: role.roleName,
        }));
      console.log(`>>> newRolesData: `, newRolesData);
      setRoleRes(newRolesData);
    }
    setLoading(false);
  };

  const fetchFlows = async () => {
    setLoading(true);
    const res = await viewAllFlowsAPI();
    if (res?.data?.statusCode === 200) {
      const newFlowsData = res.data.content;
      setFlows(newFlowsData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocumentTypes();
    fetchRoles();
    fetchFlows();
  }, [openModalCreate]);

  const getWorkflowDetailsData = async (workflowId) => {
    const res = await viewWorkflowDetailsWithFlowAndStepAPI(workflowId);
    const filterScope = mainWorkflows.find(
      (w) => w.workflowId === workflowId
    )?.scope;
    setScope(filterScope);
    if (res?.data?.statusCode === 200) {
      const detail = res.data.content;
      setWorkflowDetail(detail);

      // Tạo danh sách role từ flows
      const roles = detail.flows.flatMap((flow, idx, arr) =>
        idx === arr.length - 1
          ? [flow.roleStart, flow.roleEnd]
          : [flow.roleStart]
      );
      const uniqueRoles = [...new Set(roles)];
      setWorkflowRoles(uniqueRoles);
      setCurrentStep(2);
    }
  };

  const handleAddRoleAtIndex = (index, selectedRole) => {
    const prevRole = workflowRoles[index];
    const nextRole = workflowRoles[index + 1];

    const pair1 = { roleStart: prevRole, roleEnd: selectedRole };
    const pair2 = { roleStart: selectedRole, roleEnd: nextRole };

    const isValid =
      flows.some(
        (flow) =>
          flow.roleStart === pair1.roleStart && flow.roleEnd === pair1.roleEnd
      ) &&
      flows.some(
        (flow) =>
          flow.roleStart === pair2.roleStart && flow.roleEnd === pair2.roleEnd
      );

    if (!isValid) {
      message.error(
        "Không thể chèn vai trò này vào vị trí đó vì không tồn tại flow hợp lệ."
      );
      return;
    }

    // Nếu hợp lệ, thêm vào mảng workflowRoles
    const updatedRoles = [...workflowRoles];
    updatedRoles.splice(index + 1, 0, selectedRole);
    setWorkflowRoles(updatedRoles);

    // Cập nhật flows sau khi thêm role
    const updatedFlows = generateFlowsFromRoles(updatedRoles);
    setWorkflowDetail((prev) => ({
      ...prev,
      flows: updatedFlows,
    }));
  };

  const generateFlowsFromRoles = (roles) => {
    const newFlows = [];
    for (let i = 0; i < roles.length - 1; i++) {
      const start = roles[i];
      const end = roles[i + 1];
      const foundFlow = flows.find(
        (flow) => flow.roleStart === start && flow.roleEnd === end
      );
      if (foundFlow) {
        newFlows.push(foundFlow);
      }
    }
    return uniqBy(newFlows, (flow) => `${flow.roleStart}-${flow.roleEnd}`);
  };

  const handleRemoveRole = (roleToRemove) => {
    const updatedRoles = workflowRoles.filter((role) => role !== roleToRemove);

    // Kiểm tra cặp liên tiếp mới có hợp lệ không
    const newPairs = [];
    for (let i = 0; i < updatedRoles.length - 1; i++) {
      newPairs.push({
        roleStart: updatedRoles[i],
        roleEnd: updatedRoles[i + 1],
      });
    }

    const isValid = newPairs.every((pair) =>
      flows.some(
        (flow) =>
          flow.roleStart === pair.roleStart && flow.roleEnd === pair.roleEnd
      )
    );

    if (!isValid) {
      message.error("Không thể xóa role này vì không có flow tương ứng!");
      return;
    }

    // Nếu hợp lệ thì tiếp tục
    const filteredFlows = flows.filter(
      (flow) =>
        updatedRoles.includes(flow.roleStart) &&
        updatedRoles.includes(flow.roleEnd)
    );

    const remainingFlows = uniqBy(
      filteredFlows,
      (flow) => `${flow.roleStart}-${flow.roleEnd}`
    );

    setWorkflowRoles(updatedRoles);
    setWorkflowDetail((prev) => ({
      ...prev,
      flows: remainingFlows,
    }));
  };

  const renderWorkflowRoles = () => {
    if (!workflowDetail?.flows?.length) return null;

    const roles = workflowDetail.flows.flatMap((flow, idx, arr) =>
      idx === arr.length - 1 ? [flow.roleStart, flow.roleEnd] : [flow.roleStart]
    );

    let rolesToSelect = [];
    if (scope === "OutGoing") {
      rolesToSelect = roleRes.filter(
        (role) =>
          role.roleName !== "Leader" &&
          role.roleName !== "Chief" &&
          role.roleName !== "Clerical Assistant"
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
        <Row gutter={15} align="middle" justify="start">
          {workflowRoles.map((role, idx) => (
            <React.Fragment key={idx}>
              {JSON.parse(workflowDetail.requiredRolesJson).includes(role) ? (
                <Tooltip title="Vai trò bắt buộc, không thể xóa">
                  <LockOutlined
                    style={{ color: "gray", fontSize: 20, marginTop: "10px" }}
                  />
                </Tooltip>
              ) : (
                <Col>
                  <MinusCircleOutlined
                    onClick={() => handleRemoveRole(role)}
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  />
                </Col>
              )}
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
              <Col>
                {!(scope === "OutGoing" && idx === roles.length - 1) &&
                  !(scope === "OutGoing" && idx === roles.length - 2) && (
                    <PlusCircleOutlined
                      onClick={() => {
                        // Mở Select tại vị trí này
                        setAddingIndex(idx); // Ghi lại vị trí để thêm role
                      }}
                      style={{
                        fontSize: "20px",
                        color: "green",
                        cursor: "pointer",
                        marginTop: "10px",
                      }}
                    />
                  )}
              </Col>

              {/* Hiển thị Select nếu đang thêm role tại vị trí này */}
              {addingIndex === idx && (
                <Col>
                  <Select
                    showSearch
                    style={{ width: 200, marginTop: 8 }}
                    placeholder="Chọn vai trò"
                    onSelect={(value) => {
                      handleAddRoleAtIndex(idx, value);
                      setAddingIndex(null); // Ẩn Select sau khi chọn
                    }}
                    onBlur={() => setAddingIndex(null)} // Đóng Select nếu mất focus
                    filterOption={(input, option) =>
                      (option?.children ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {rolesToSelect.map((roleOption) => (
                      <Select.Option
                        key={roleOption.roleId}
                        value={roleOption.roleName}
                      >
                        {convertRoleName(roleOption.roleName)}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              )}
              {idx < workflowRoles.length - 1 && (
                <Col>
                  <ArrowRightOutlined
                    style={{
                      fontSize: 30,
                      color: "#121212",
                      marginTop: "10px",
                    }}
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
    // Đảm bảo rằng mỗi lần render lại, flows đã được cập nhật
    if (!workflowDetail?.flows?.length) return null;

    return workflowDetail.flows.map((flow, idx) => (
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
              fontSize: 15,
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
                title={`${step.action}`}
                description={
                  <>
                    Vai trò:{"  "}
                    <Tag color="geekblue">
                      {convertRoleName(step.role?.roleName) || "Không xác định"}
                    </Tag>
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

  const handleCancel = () => {
    setOpenModalCreate(false);
    setDocumentTypes([]);
    setRoleRes([]);
    setFlows([]);
    setCurrentStep(1);
    setScope("");
    setWorkflowDetail(null);
    form.resetFields();
  };

  const handleCreateWorkflow = async (values) => {
    setIsSubmit(true);
    const { workflowName, documentTypeIds } = values;
    const flowIds = workflowDetail?.flows?.map((flow) => flow.flowId) || [];
    const payload = {
      workflowName,
      scope,
      createBy: user.userId,
      documentTypeIds,
      flowIds,
    };
    const res = await createWorkflowAPI(payload);
    if (res && res.data && res.data.statusCode === 201) {
      message.success(`Tạo mới luồng xử lý ${workflowName} thành công!`);
      handleCancel();
      refreshTable();
    } else {
      notification.error({
        message: "Tạo mới luồng xử lý thất bại!",
        description: res.data.content,
      });
    }
    setIsSubmit(false);
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
    <Modal
      open={openModalCreate}
      title={
        <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
          Tạo mới luồng xử lý
        </div>
      }
      onCancel={handleCancel}
      width="80vw"
      maskClosable={false}
      centered
      bodyProps={{
        style: {
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
      onOk={() => {
        form.submit();
      }}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateWorkflow}
        autoComplete="off"
      >
        {currentStep === 1 && (
          <>
            <Form.Item
              label="Chọn phạm vi ban hành:"
              rules={[
                { required: true, message: "Vui lòng chọn phạm vi ban hành!" },
              ]}
            >
              {console.log(`>>> Check mainWorkflows: `, mainWorkflows)}
              <Radio.Group
                onChange={(e) => {
                  const workflowId = e.target.value;
                  getWorkflowDetailsData(workflowId);
                }}
              >
                {mainWorkflows.map((workflow) => (
                  <Radio key={workflow.workflowId} value={workflow.workflowId}>
                    {convertScopeName(workflow.scope)}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </>
        )}
        {currentStep === 2 && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="workflowName"
                  label="Tên luồng xử lý"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên luồng xử lý!",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập tên luồng xử lý" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="documentTypeIds"
                  label="Loại văn bản"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ít nhất một loại văn bản",
                    },
                  ]}
                >
                  <Select
                    value={documentTypes}
                    showSearch
                    placeholder="Tìm và chọn loại văn bản"
                    filterOption={(input, option) =>
                      option?.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    mode="multiple"
                  >
                    {documentTypes.map((documentType) => (
                      <Option
                        key={documentType.documentTypeId}
                        value={documentType.documentTypeId}
                      >
                        {documentType.documentTypeName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {renderWorkflowRoles()}

            {renderWorkflowDetails()}
            <Row justify="end" gutter={10} style={{ marginTop: 20 }}>
              <Col>
                <Button key="cancel" onClick={handleCancel}>
                  Hủy
                </Button>
              </Col>
              <Col>
                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  loading={isSubmit}
                >
                  Tạo mới
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default CreateWorkflow;
