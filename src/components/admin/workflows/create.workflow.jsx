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
  App,
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
  viewMainWorkflowByScopeAPI,
  viewWorkflowDetailsWithFlowAndStepAPI,
} from "@/services/api.service";
import { convertRoleName, convertScopeName } from "@/services/helper";
import "styles/loading.scss";
import { BeatLoader } from "react-spinners";
import { useCurrentApp } from "@/components/context/app.context";
import uniqBy from "lodash/uniqBy";
import { values } from "lodash";

const { Option } = Select;
const { Text } = Typography;
const { Step } = Steps;

const CreateWorkflow = ({
  openModalCreate,
  setOpenModalCreate,
  refreshTable,
}) => {
  const { user } = useCurrentApp();
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
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
  const [workflowId, setWorkflowId] = useState(null);
  const [workflowOptions, setWorkflowOptions] = useState([]);
  const [showSelect, setShowSelect] = useState(false);

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

  const handleScopeChange = async (selectedScope) => {
    setScope(selectedScope);
    const res = await viewMainWorkflowByScopeAPI(selectedScope);
    if (res?.data?.statusCode === 200) {
      setWorkflowOptions(res.data.content);
      setWorkflowId(null);
      setShowSelect(true);
    } else {
      notification.error({
        message: "Hệ thống đang trong thời gian bảo trì!",
        description: "Xin lòng thử lại sau ít phút",
      });
    }
  };

  const getWorkflowDetailsData = async (workflowId) => {
    const res = await viewWorkflowDetailsWithFlowAndStepAPI(workflowId);
    if (res?.data?.statusCode === 200) {
      const detail = res.data.content;
      setWorkflowDetail(detail);

      const roles = detail.flows.flatMap((flow, idx, arr) =>
        idx === arr.length - 1
          ? [flow.roleStart, flow.roleEnd]
          : [flow.roleStart]
      );
      setWorkflowRoles(roles);
      setCurrentStep(2);
    }
  };

  const handleAddRoleAtIndex = (index, selectedRole) => {
    const prevRole = workflowRoles[index];
    const nextRole = workflowRoles[index + 1];

    const pair1 = { roleStart: prevRole, roleEnd: selectedRole };
    const pair2 = nextRole
      ? { roleStart: selectedRole, roleEnd: nextRole }
      : null;

    const isValid =
      flows.some(
        (flow) =>
          flow.roleStart === pair1.roleStart && flow.roleEnd === pair1.roleEnd
      ) &&
      (pair2 === null ||
        flows.some(
          (flow) =>
            flow.roleStart === pair2.roleStart && flow.roleEnd === pair2.roleEnd
        ));

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
    return newFlows;
  };

  const handleRemoveRole = (idx) => {
    const updatedRoles = [...workflowRoles];
    console.log(`>>> Check idx: `, idx);
    updatedRoles.splice(idx, 1);

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

    setWorkflowRoles(updatedRoles);
    const updatedFlows = generateFlowsFromRoles(updatedRoles);

    setWorkflowDetail((prev) => ({
      ...prev,
      flows: updatedFlows,
    }));
  };

  const renderWorkflowRoles = () => {
    if (!workflowDetail?.flows?.length) return null;

    const roles = workflowDetail.flows.flatMap((flow, idx, arr) =>
      idx === arr.length - 1 ? [flow.roleStart, flow.roleEnd] : [flow.roleStart]
    );
    console.log(`Roles: `, roles[0]);
    console.log(`RolesRes: `, roleRes);

    let rolesToSelect = [];
    if (scope === "OutGoing") {
      rolesToSelect = roleRes.filter(
        (role) =>
          role.roleName !== "Chief" && role.roleName !== "Clerical Assistant"
      );
    }

    if (scope === "InComing") {
      rolesToSelect = roleRes.filter(
        (role) =>
          role.roleName !== "Chief" && role.roleName !== "Clerical Assistant"
      );
    }

    if (scope === "Division" && roles[0] === "Specialist") {
      rolesToSelect = roleRes.filter(
        (role) =>
          role.roleName === "Specialist" || role.roleName === "Division Head"
      );
    }
    if (scope === "Division" && roles[0] === "Clerical Assistant") {
      rolesToSelect = roleRes.filter(
        (role) =>
          role.roleName === "Clerical Assistant" || role.roleName === "Chief"
      );
    }
    if (scope === "Division" && roles[0] === "Leader") {
      rolesToSelect = roleRes.filter((role) => role.roleName === "Leader");
    }

    if (scope === "School") {
      rolesToSelect = roleRes;
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
              {JSON.parse(workflowDetail.requiredRolesJson).includes(role) ||
              (scope === "Division" && (idx === 0 || idx === 1)) ||
              (scope === "InComing" &&
                (idx === 0 || idx === 1 || idx === 2)) ? (
                <Tooltip title="Vai trò bắt buộc, không thể xóa">
                  <LockOutlined
                    style={{ color: "gray", fontSize: 20, marginTop: "10px" }}
                  />
                </Tooltip>
              ) : (
                <Col>
                  <MinusCircleOutlined
                    onClick={() => handleRemoveRole(idx)}
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
                {!(
                  scope === "OutGoing" &&
                  (idx === roles.length - 1 || idx === roles.length - 2)
                ) &&
                  !(scope === "InComing" && idx === 0) &&
                  !(
                    scope === "School" &&
                    (idx === roles.length - 1 || idx === roles.length - 2)
                  ) && (
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
                      setAddingIndex(null);
                    }}
                    onBlur={() => setAddingIndex(null)}
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
                      {convertRoleName(step?.role?.roleName)}
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
    setShowSelect(false);
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
            <Form.Item label="Vui lòng chọn phạm vi ban hành">
              <Radio.Group
                value={scope}
                onChange={(e) => handleScopeChange(e.target.value)}
              >
                <Radio value="InComing">Văn bản đến</Radio>
                <Radio value="OutGoing">Văn bản đi</Radio>
                <Radio value="Division">Nội bộ phòng ban</Radio>
                <Radio value="School">Nội bộ toàn trường</Radio>
              </Radio.Group>
            </Form.Item>

            {showSelect && (
              <Form.Item label="Vui lòng chọn luồng xử lý mẫu">
                <Select
                  showSearch
                  value={workflowId}
                  placeholder="Chọn luồng xử lý mẫu"
                  optionFilterProp="children"
                  onChange={(value) => getWorkflowDetailsData(value)}
                >
                  {workflowOptions.map((wf) => (
                    <Option key={wf.workflowId} value={wf.workflowId}>
                      {wf.workflowName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
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
