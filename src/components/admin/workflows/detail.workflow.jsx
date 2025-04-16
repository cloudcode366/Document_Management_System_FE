import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Divider,
  Tag,
  Typography,
  Drawer,
  Descriptions,
  Card,
  Timeline,
  Steps,
} from "antd";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import {
  viewDocumentTypeNameByWorkflowId,
  viewWorkflowDetailsWithFlowAndStepAPI,
} from "@/services/api.service";
import { convertRoleName, convertScopeName } from "@/services/helper";
import "./detail.workflow.scss";
import { BeatLoader } from "react-spinners";

const { Title, Text } = Typography;
const { Step } = Steps;

const DetailWorkflow = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const [workflowDetail, setWorkflowDetail] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    const fetchWorkflow = async () => {
      const res = await viewWorkflowDetailsWithFlowAndStepAPI(
        dataViewDetail.workflowId
      );
      if (res?.data?.statusCode === 200) {
        setWorkflowDetail(res.data.content);
      }
    };

    const fetchDocumentTypes = async () => {
      const res = await viewDocumentTypeNameByWorkflowId(
        dataViewDetail.workflowId
      );
      if (res?.data?.statusCode === 200) {
        setDocumentTypes(res.data.content);
      }
    };

    if (openViewDetail && dataViewDetail?.workflowId) {
      fetchWorkflow();
      fetchDocumentTypes();
    }
  }, [openViewDetail, dataViewDetail?.workflowId]);

  const renderWorkflowRoles = () => {
    if (!workflowDetail?.flows?.length) return null;

    const roles = workflowDetail.flows.flatMap((flow, idx, arr) =>
      idx === arr.length - 1 ? [flow.roleStart, flow.roleEnd] : [flow.roleStart]
    );
    const uniqueRoles = [...new Set(roles)];

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
                      {convertRoleName(step.role.roleName)}
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

  const onClose = () => {
    setWorkflowDetail(null);
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  return (
    <Drawer
      title="Chi tiết luồng xử lý"
      width={"50vw"}
      open={openViewDetail}
      onClose={onClose}
      contentStyle={{
        padding: "24px",
        backgroundColor: "#f9fafc ",
        height: "100%",
      }}
    >
      <Descriptions
        bordered
        column={2}
        style={{
          backgroundColor: "#ffffff",
          padding: "12px",
          borderRadius: 10,
        }}
        labelStyle={{
          fontWeight: "bold",
          fontSize: 15,
          backgroundColor: "#F2F2F2",
          padding: "8px 12px",
          color: "#1d1d1f",
        }}
      >
        <Descriptions.Item label="Tên luồng xử lý">
          {dataViewDetail?.workflowName}
        </Descriptions.Item>
        <Descriptions.Item label="Phạm vi">
          {convertScopeName(dataViewDetail?.scope)}
        </Descriptions.Item>
        <Descriptions.Item label="Loại văn bản">
          {documentTypes && documentTypes.length > 0
            ? documentTypes.join(", ")
            : "-"}
        </Descriptions.Item>
      </Descriptions>

      {renderWorkflowRoles()}

      {renderWorkflowDetails()}
    </Drawer>
  );
};

export default DetailWorkflow;
