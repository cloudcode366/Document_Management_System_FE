import {
  ArrowRightOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Modal,
  Upload,
  Select,
  Radio,
  notification,
  Typography,
  Row,
  Col,
  Tag,
  Button,
} from "antd";
import React, { useState } from "react";
import ConfirmInfoDocument from "@/components/client/documents/progresses/confirm.info.document";
import templatePDF from "assets/files/template.pdf";
import {
  createUploadDocumentAPI,
  viewWorkflowByScopeAPI,
  viewWorkflowDetailsWithFlowAndStepAPI,
} from "@/services/api.service";
import { convertRoleName } from "@/services/helper";
import { useCurrentApp } from "@/components/context/app.context";

const { Dragger } = Upload;
const { Option } = Select;
const { Text } = Typography;

const CreateDocument = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const { message, notification } = App.useApp();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedScope, setSelectedScope] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [listWorkflows, setListWorkflows] = useState([]);
  const [listDocumentTypes, setListDocumentTypes] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState({});
  const [selectedDocumentType, setSelectedDocumentType] = useState({});
  const [showWorkflowSelect, setShowWorkflowSelect] = useState(false);
  const [showDocumentTypeSelect, setShowDocumentTypeSelect] = useState(false);
  const [workflowDetail, setWorkflowDetail] = useState(null);
  const [resDocument, setResDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useCurrentApp();

  const documentTemplates = [
    { id: "template1", name: "Mẫu quyết định khen thưởng" },
    { id: "template2", name: "Mẫu công văn thông báo" },
    { id: "template3", name: "Mẫu biên bản họp" },
  ];

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".pdf",
    fileList: uploadedFile ? [uploadedFile] : [],
    customRequest({ file, onSuccess, onError }) {
      const isValid = file.name.endsWith(".pdf");
      if (!isValid) {
        message.error("Chỉ chấp nhận file định dạng .pdf!");
        onError?.(new Error("Định dạng file không hợp lệ"));
        return;
      }

      setTimeout(() => {
        file.status = "done";
        setUploadedFile(file);
        onSuccess?.("ok");
        message.success(`${file.name} tải lên thành công.`);
      }, 1000);
    },
    onRemove() {
      setUploadedFile(null);
    },
  };

  const handleSelectedScope = async (e) => {
    const scope = e.target.value;
    setSelectedScope(scope);
    setSelectedWorkflow({});
    setSelectedDocumentType({});
    setShowWorkflowSelect(false);
    setShowDocumentTypeSelect(false);
    setUploadedFile(null);
    setSelectedTemplate(null);
    setWorkflowDetail(null);

    const res = await viewWorkflowByScopeAPI(scope);
    if (res && res.data && res.data.statusCode === 200) {
      const data = res.data.content;
      setListWorkflows(data);
      setShowWorkflowSelect(true);
    } else {
      notification.error({
        message: "Lấy dữ liệu luồng xử lý không thành công!",
        description: "Vui lòng thử lại sau!",
      });
    }
  };

  const handleSelectedWorkflow = async (workflowId) => {
    const workflow = listWorkflows.find(
      (item) => item.workflowId === workflowId
    );
    if (workflow) {
      setSelectedWorkflow(workflow);
      setListDocumentTypes(workflow.documentTypes || []);
      const res = await viewWorkflowDetailsWithFlowAndStepAPI(
        workflow.workflowId
      );
      if (res?.data?.statusCode === 200) {
        const data = res.data.content;
        if (
          user?.mainRole.roleName === data.flows[0].roleStart ||
          user?.subRole.roleName === data.flows[0].roleStart
        ) {
          setWorkflowDetail(res.data.content);
          setShowDocumentTypeSelect(true);
        } else {
          setShowDocumentTypeSelect(false);
          message.error("Bạn không có quyền khởi tạo văn bản cho luồng này!");
        }
      } else {
        notification.error({
          message: "Lấy dữ liệu chi tiết luồng xử lý không thành công!",
          description: "Vui lòng thử lại sau!",
        });
      }
    }
  };

  const handleConfirmInComing = async (file) => {
    if (selectedScope === "InComing" && !uploadedFile) {
      message.error("Vui lòng tải lên một file trước khi xác nhận.");
      return;
    }

    setLoading(true);

    const res = await createUploadDocumentAPI(file);
    if (res && res.data && res.data.statusCode === 200) {
      const data = res.data.content;
      setResDocument(data);
      setOpenConfirmModal(true);
      setOpenModalCreate(false);
    } else {
      notification.error({
        message: "Upload file văn bản đến hệ thống không thành công!",
        description: "Vui lòng thử lại sau!",
      });
    }
    setLoading(false);
  };

  const handleConfirmRest = async (documentTemplateId) => {
    if (selectedScope !== "InComing" && !selectedTemplate) {
      message.error("Vui lòng chọn một mẫu văn bản trước khi xác nhận.");
      return;
    }

    if (
      selectedScope === "Outgoing" ||
      selectedScope === "School" ||
      selectedScope === "Division"
    ) {
      const response = await fetch(templatePDF);
      const blob = await response.blob();
      const file = new File([blob], "template.pdf", {
        type: "application/pdf",
      });
      setUploadedFile(file);
    }

    setOpenModalCreate(false);
    setOpenConfirmModal(true);
  };

  const handleCloseCreateDocumentModal = () => {
    setOpenModalCreate(false);
    setUploadedFile(null);
    setSelectedTemplate(null);
    setSelectedScope("");
    setSelectedWorkflow({});
    setSelectedDocumentType({});
    setListWorkflows([]);
    setListDocumentTypes([]);
    setWorkflowDetail(null);
    setShowDocumentTypeSelect(false);
    setShowWorkflowSelect(null);
    setResDocument(null);
    setLoading(false);
  };

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

  const handleSelectedDocumentType = (value) => {
    const docType = listDocumentTypes.find((dt) => dt.documentTypeId === value);
    setSelectedDocumentType(docType);
  };

  return (
    <>
      <Modal
        title={
          <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
            Khởi tạo văn bản
          </div>
        }
        width="50vw"
        centered
        maskClosable={false}
        bodyProps={{
          style: {
            maxHeight: "70vh",
            overflowY: "auto",
          },
        }}
        open={openModalCreate}
        onCancel={handleCloseCreateDocumentModal}
        footer={
          <Button
            type="primary"
            onClick={() => {
              selectedScope === "InComing"
                ? handleConfirmInComing(uploadedFile)
                : handleConfirmRest(selectedTemplate);
            }}
            disabled={!selectedDocumentType?.documentTypeId}
            loading={loading}
          >
            Tiếp tục
          </Button>
        }
      >
        <div>
          <div
            style={{
              marginBottom: 8,
              marginTop: 8,
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            Vui lòng chọn phạm vi ban hành:
          </div>
          <Radio.Group onChange={handleSelectedScope} value={selectedScope}>
            <Radio value="InComing">Văn bản đến</Radio>
            <Radio value="OutGoing">Văn bản đi</Radio>
            <Radio value="Division">Nội bộ phòng ban</Radio>
            <Radio value="School">Nội bộ toàn trường</Radio>
          </Radio.Group>
        </div>

        {showWorkflowSelect && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                marginBottom: 8,
                marginTop: 8,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Vui lòng chọn luồng xử lý:
            </div>
            <Select
              placeholder="Chọn luồng xử lý"
              style={{ width: "100%" }}
              onChange={handleSelectedWorkflow}
              value={selectedWorkflow?.workflowId}
            >
              {listWorkflows.map((workflow) => (
                <Option key={workflow.workflowId} value={workflow.workflowId}>
                  {workflow.workflowName}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {showDocumentTypeSelect && (
          <div style={{ marginTop: 16 }}>
            {renderWorkflowRoles()}
            <div
              style={{
                marginBottom: 8,
                marginTop: 8,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Vui lòng chọn loại văn bản:
            </div>
            <Select
              placeholder="Chọn loại văn bản"
              style={{ width: "100%" }}
              onChange={handleSelectedDocumentType}
              value={selectedDocumentType?.documentTypeId}
            >
              {listDocumentTypes.map((dt) => (
                <Option key={dt.documentTypeId} value={dt.documentTypeId}>
                  {dt.documentTypeName}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {selectedDocumentType?.documentTypeId && (
          <div style={{ marginTop: 16 }}>
            {selectedScope === "InComing" ? (
              <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Nhấp hoặc kéo văn bản vào khu vực này
                </p>
                <p className="ant-upload-hint">Chỉ hỗ trợ định dạng .pdf</p>
              </Dragger>
            ) : (
              <Select
                placeholder="Chọn mẫu văn bản"
                style={{ width: "100%" }}
                onChange={(value) => setSelectedTemplate(value)}
                value={selectedTemplate}
              >
                {documentTemplates.map((template) => (
                  <Option key={template.id} value={template.id}>
                    {template.name}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        )}
      </Modal>

      <ConfirmInfoDocument
        openConfirmModal={openConfirmModal}
        setOpenConfirmModal={setOpenConfirmModal}
        refreshTable={refreshTable}
        uploadedFile={uploadedFile}
        resDocument={resDocument}
        selectedWorkflow={selectedWorkflow}
        selectedTemplate={selectedTemplate}
        selectedScope={selectedScope}
        selectedDocumentType={selectedDocumentType}
        handleCloseCreateDocumentModal={handleCloseCreateDocumentModal}
      />
    </>
  );
};

export default CreateDocument;
