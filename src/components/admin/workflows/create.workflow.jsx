import React, { useState } from "react";
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
  Space,
  Tag,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const availableDocTypes = [
  "Quyết định",
  "Chỉ thị",
  "Thông báo",
  "Báo cáo",
  "Tờ trình",
  "Kế hoạch",
  "Công văn",
];

const roleOptions = [
  "Lãnh đạo trường",
  "Chánh văn phòng",
  "Nhân viên văn thư",
  "Lãnh đạo phòng ban",
  "Chuyên viên",
];

const CreateWorkflow = ({
  openModalCreate,
  setOpenModalCreate,
  refreshTable,
  setDataViewDetail,
}) => {
  const [form] = Form.useForm();
  const [docTypes, setDocTypes] = useState([]);
  const [workflowRoles, setWorkflowRoles] = useState([
    "Chuyên viên",
    "Lãnh đạo phòng ban",
  ]);
  const [workflowDetails, setWorkflowDetails] = useState([]);

  // Add new document type
  const handleAddDocType = (value) => {
    if (!docTypes.includes(value)) {
      setDocTypes([...docTypes, value]);
    }
  };

  // Remove selected document type
  const handleRemoveDocType = (value) => {
    setDocTypes(docTypes.filter((item) => item !== value));
  };

  // Update workflow details when change
  // { from, to, actions: [] }
  const updateWorkflowDetails = (newRoles) => {
    const newDetails = [];
    for (let i = 0; i < newRoles.length - 1; i++) {
      const from = newRoles[i];
      const to = newRoles[i + 1];
      const existing = workflowDetails.find(
        (d) => d.from === from && d.to === to
      );
      newDetails.push(existing || { from, to, actions: [] });
    }
    setWorkflowDetails(newDetails);
  };

  const addRole = () => {
    const newRoles = [...workflowRoles, ""];
    setWorkflowRoles(newRoles);
    updateWorkflowDetails(newRoles);
  };

  const removeRole = (index) => {
    const newRoles = workflowRoles.filter((_, i) => i !== index);
    setWorkflowRoles(newRoles);
    updateWorkflowDetails(newRoles);
  };

  const updateAction = (detailIdx, actionIdx, key, value) => {
    const updated = [...workflowDetails];
    updated[detailIdx].actions[actionIdx][key] = value;
    setWorkflowDetails(updated);
  };

  const addAction = (detailIdx) => {
    const updated = [...workflowDetails];
    updated[detailIdx].actions.push({ content: "", role: "" });
    setWorkflowDetails(updated);
  };

  const removeAction = (detailIdx, actionIdx) => {
    const updated = [...workflowDetails];
    updated[detailIdx].actions.splice(actionIdx, 1);
    setWorkflowDetails(updated);
  };

  const handleCancel = () => {
    setOpenModalCreate(false);
    message.info("Đã hủy tạo luồng xử lý");
  };

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        const data = {
          ...values,
          docTypes,
          workflowRoles,
          workflowDetails,
        };
        console.log("Dữ liệu luồng xử lý:", data);
        setDataViewDetail(data);
        message.success("Tạo luồng xử lý thành công!");
        setOpenModalCreate(false);
        form.resetFields();
        setDocTypes([]);
        setWorkflowRoles(["Phòng ban", "Lãnh đạo trường"]);
        setWorkflowDetails([]);
      })
      .catch((err) => {
        console.error("Lỗi validate:", err);
      });
  };

  return (
    <Modal
      open={openModalCreate}
      title="Tạo mới luồng xử lý"
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
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleCreate}>
          Tạo mới luồng xử lý
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên luồng xử lý"
              rules={[
                { required: true, message: "Vui lòng nhập tên luồng xử lý" },
              ]}
            >
              <Input placeholder="Nhập tên luồng xử lý" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="docTypes"
              label="Loại văn bản"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ít nhất một loại văn bản",
                },
              ]}
            >
              <Select
                value={docTypes}
                showSearch
                placeholder="Tìm và chọn loại văn bản"
                onSelect={handleAddDocType}
                onDeselect={handleRemoveDocType}
                filterOption={(input, option) =>
                  option?.children.toLowerCase().includes(input.toLowerCase())
                }
                mode="multiple"
              >
                {availableDocTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="scope"
          label="Phạm vi ban hành"
          initialValue="Toàn trường"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn phạm vi ban hành",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="Toàn trường">Toàn trường</Radio>
            <Radio value="Phòng ban">Phòng ban</Radio>
            <Radio value="Liên quan">Những người có liên quan</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider
          orientation="left"
          variant="solid"
          style={{
            borderColor: "#80868b",
          }}
        >
          Thiết lập quy trình
        </Divider>

        <Row gutter={8} align="middle" style={{ marginBottom: 12 }}>
          {workflowRoles.map((role, index) => (
            <React.Fragment key={index}>
              {/* Hiển thị MinusCircleOutlined trước mỗi ô role, trừ ô đầu tiên */}
              {index > 0 && (
                <Col>
                  <MinusCircleOutlined
                    onClick={() => removeRole(index)}
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                      marginBottom: "20px",
                    }}
                  />
                </Col>
              )}

              {/* Ô role */}
              <Col>
                <Form.Item
                  name={`role_${index}`}
                  rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                >
                  <Select
                    value={role}
                    style={{ width: 160 }}
                    onChange={(value) => {
                      const updated = [...workflowRoles];
                      updated[index] = value;
                      setWorkflowRoles(updated);
                      updateWorkflowDetails(updated);
                    }}
                  >
                    {roleOptions.map((opt) => (
                      <Option key={opt} value={opt}>
                        {opt}
                      </Option>
                    ))}
                  </Select>
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

              {/* Hiển thị PlusOutlined ở ô cuối cùng */}
              {index === workflowRoles.length - 1 && (
                <Col>
                  <PlusCircleOutlined
                    onClick={addRole}
                    style={{
                      fontSize: "20px",
                      color: "green",
                      cursor: "pointer",
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
        {workflowDetails.map((detail, detailIdx) => (
          <div key={`${detail.from}-${detail.to}`}>
            <h4>
              Luồng {detailIdx + 1}: {detail.from} ➝ {detail.to}
            </h4>
            {detail.actions.map((action, actionIdx) => (
              <Row gutter={16} key={actionIdx} align="middle">
                <Col span={2} style={{ marginBottom: 20 }}>
                  <strong>Bước {actionIdx + 1}:</strong>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={`action_content_${detailIdx}_${actionIdx}`}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập nội dung xử lý",
                      },
                    ]}
                    style={{ marginTop: 5 }}
                  >
                    <Input
                      value={action.content}
                      onChange={(e) =>
                        updateAction(
                          detailIdx,
                          actionIdx,
                          "content",
                          e.target.value
                        )
                      }
                      placeholder="Nhập nội dung xử lý"
                    />
                  </Form.Item>
                </Col>

                <Col span={4} style={{ marginBottom: 20 }}>
                  <strong>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;Vai trò
                    thực hiện:
                  </strong>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={`action_role_${detailIdx}_${actionIdx}`}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn vai trò thực hiện",
                      },
                    ]}
                    style={{ marginTop: 5 }}
                  >
                    <Select
                      value={action.role}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        updateAction(detailIdx, actionIdx, "role", value)
                      }
                      placeholder="Chọn vai trò thực hiện"
                    >
                      {roleOptions.map((opt) => (
                        <Option key={opt} value={opt}>
                          {opt}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2} style={{ marginBottom: 20 }}>
                  <MinusCircleOutlined
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => removeAction(detailIdx, actionIdx)}
                  />
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined style={{ color: "green" }} />}
              style={{ marginBottom: 5, color: "green" }}
              onClick={() => addAction(detailIdx)}
            >
              Thêm bước
            </Button>
            <Divider />
          </div>
        ))}
      </Form>
    </Modal>
  );
};

export default CreateWorkflow;
