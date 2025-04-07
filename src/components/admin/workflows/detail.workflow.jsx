import React from "react";
import { Modal, Row, Col, Divider, Tag, Space, Form } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const DetailWorkflow = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const handleCancel = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  if (!dataViewDetail) {
    return null; // Nếu không có dữ liệu, không hiển thị modal
  }

  return (
    <Modal
      open={openViewDetail}
      title={
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Chi tiết luồng xử lý
        </span>
      }
      onCancel={handleCancel}
      width="80vw"
      footer={null}
      maskClosable={false}
      centered
      bodyProps={{
        style: {
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <strong style={{ fontSize: "16px" }}>Tên luồng xử lý:</strong>{" "}
          <span style={{ fontSize: "16px" }}>{dataViewDetail.name}</span>
        </Col>
        <Col span={12}>
          <strong style={{ fontSize: "16px" }}>Loại văn bản:</strong>{" "}
          <span style={{ fontSize: "16px" }}>
            {dataViewDetail.docTypes?.join(", ") || "Chưa có loại văn bản"}
          </span>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: "10px" }}>
        <Col span={12}>
          <strong style={{ fontSize: "16px" }}>Phạm vi ban hành:</strong>{" "}
          <span style={{ fontSize: "16px" }}>{dataViewDetail.scope}</span>
        </Col>
      </Row>
      <Divider
        orientation="left"
        variant="solid"
        style={{
          borderColor: "#80868b",
        }}
      >
        Quy trình
      </Divider>

      <Row gutter={8} align="middle" style={{ marginBottom: 12 }}>
        {dataViewDetail.workflowRoles?.map((role, index) => (
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
            {index < dataViewDetail.workflowRoles.length - 1 && (
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

      {dataViewDetail.workflowDetails?.map((detail, idx) => (
        <div key={`${detail.from}-${detail.to}`}>
          <h4 style={{ fontSize: "16px" }}>
            Luồng {idx + 1}:{" "}
            <span style={{ fontSize: "16px" }}>{detail.from}</span> ➝{" "}
            <span style={{ fontSize: "16px" }}>{detail.to}</span>
          </h4>
          {detail.actions.map((action, actionIdx) => (
            <Row
              gutter={16}
              key={actionIdx}
              align="middle"
              style={{ marginTop: "10px" }}
            >
              <Col span={6}>
                <strong style={{ fontSize: "16px" }}>
                  Bước {actionIdx + 1}:
                </strong>{" "}
                <span style={{ fontSize: "16px" }}>{action.content}</span>
              </Col>
              <Col span={6}>
                <strong style={{ fontSize: "16px" }}>Vai trò thực hiện:</strong>{" "}
                <span style={{ fontSize: "16px" }}>{action.role}</span>
              </Col>
            </Row>
          ))}
          <Divider />
        </div>
      ))}
    </Modal>
  );
};

export default DetailWorkflow;
