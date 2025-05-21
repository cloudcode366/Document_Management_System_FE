import { ProTable } from "@ant-design/pro-components";
import { Tabs, Tooltip, Tag } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import { viewDocumentsByTabForUserAPI } from "@/services/api.service";
import { convertScopeName } from "@/services/helper";
import DrawerIncomingDocument from "./drawer.incoming.document";

const { TabPane } = Tabs;

const tagColor = {
  "Văn bản đến": "#FC8330",
  "Văn bản đi": "#18B0FF",
  "Nội bộ phòng ban": "#9254DE",
  "Nội bộ toàn trường": "#F759AB",
};

const TableIncomingDocument = () => {
  const [activeKey, setActiveKey] = useState("All");
  const { user } = useCurrentApp();
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const navigate = useNavigate();
  let clickTimer = null;

  const getColumns = () => {
    if (activeKey === "Rejected") {
      return [
        {
          title: "Tên văn bản",
          dataIndex: "documentName",
          width: "30%",
          copyable: true,
          ellipsis: {
            showTitle: false,
          },
          render: (_, row) => (
            <div>
              <Tooltip title={row.documentName}>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "80%",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                >
                  {row.hasAttachment && (
                    <PaperClipOutlined
                      style={{ marginRight: 6, color: "#fa8c16" }}
                    />
                  )}
                  {row.documentName}
                </div>
              </Tooltip>
              <br />
              <Tag color={tagColor[convertScopeName(row.scope)]}>
                {convertScopeName(row.scope)}
              </Tag>
            </div>
          ),
          fieldProps: {
            placeholder: "Vui lòng nhập tên văn bản",
          },
          formItemProps: {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          },
        },

        {
          title: "Luồng xử lý",
          dataIndex: "workflowName",
          width: "20%",
          hideInSearch: true,
        },
        {
          title: "Loại văn bản",
          dataIndex: "documentType",
          width: "15%",
          hideInSearch: true,
        },
        {
          title: "Phiên bản",
          dataIndex: "versionNumber",
          width: "10%",
          hideInSearch: true,
        },
        {
          title: "Ngày từ chối",
          dataIndex: "dateReject",
          width: "15%",
          render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm"),
          hideInSearch: true,
        },
        {
          title: "Người từ chối",
          dataIndex: "userReject",
          width: "10%",
          hideInSearch: true,
        },
      ];
    } else {
      return [
        {
          title: "Tên văn bản",
          dataIndex: ["documentDto", "documentName"],
          width: "40%",
          copyable: true,
          ellipsis: {
            showTitle: false,
          },
          render: (_, row) => (
            <div>
              <Tooltip title={row.documentDto?.documentName}>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "80%",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                >
                  {row.hasAttachment && (
                    <PaperClipOutlined
                      style={{ marginRight: 6, color: "#fa8c16" }}
                    />
                  )}
                  {row.documentDto?.documentName}
                </div>
              </Tooltip>
              <br />
              <Tag color={tagColor[convertScopeName(row.scope)]}>
                {convertScopeName(row.scope)}
              </Tag>
            </div>
          ),
          fieldProps: {
            placeholder: "Vui lòng nhập tên văn bản",
          },
          formItemProps: {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          },
        },
        {
          title: "Luồng xử lý",
          dataIndex: "workflowName",
          width: "30%",
          render: (_, row) => row?.workflowName || "-",
          hideInSearch: true,
        },

        {
          title: "Loại văn bản",
          dataIndex: ["documentDto", "documentType", "documentTypeName"],
          width: "10%",
          render: (_, row) =>
            row?.documentDto?.documentType?.documentTypeName || "-",
          hideInSearch: true,
        },
        {
          title: "Người tạo",
          dataIndex: "fullName",
          width: "10%",
          hideInSearch: true,
        },
        {
          title: "Ngày tạo",
          dataIndex: ["documentDto", "createdDate"],
          width: "10%",
          hideInSearch: true,
          render: (_, row) => {
            const createdDate = row?.documentDto?.createdDate;
            return createdDate
              ? dayjs(createdDate).format("DD-MM-YYYY HH:mm")
              : "-";
          },
        },
      ];
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      actionRef.current?.reload();
    }, 0);
    return () => clearTimeout(timeout);
  }, [activeKey]);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={[
            { label: "TẤT CẢ", key: "All" },
            { label: "ĐẾN LƯỢT DUYỆT", key: "PendingApproval" },
            { label: "ĐANG CHỜ DUYỆT", key: "Waiting" },
            { label: "ĐÃ ĐƯỢC CHẤP NHẬN", key: "Accepted" },
            { label: "ĐÃ TỪ CHỐI", key: "Rejected" },
            { label: "QUÁ HẠN", key: "Overdue" },
          ]}
        />

        <ProTable
          key={activeKey}
          columns={getColumns()}
          actionRef={actionRef}
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
          search={{
            labelWidth: "auto",
            span: 8, // mỗi field chiếm 1/3 dòng (24/8)
          }}
          scroll={{ y: "calc(100vh - 400px)" }}
          cardBordered
          request={async (params) => {
            console.log(`>>> Check params: `, params);
            let query = "";
            if (activeKey === "Rejected") {
              if (params) {
                if (params.documentName) {
                  query += `docName=${params.documentName}&`;
                }
                query += `scope=InComing&userId=${user.userId}&tab=${activeKey}&page=${params.current}&limit=${params.pageSize}`;
              }
            } else {
              if (params) {
                if (params.documentDto?.documentName) {
                  query += `docName=${params.documentDto.documentName}&`;
                }
                query += `scope=InComing&userId=${user.userId}&tab=${activeKey}&page=${params.current}&limit=${params.pageSize}`;
              }
            }

            const res = await viewDocumentsByTabForUserAPI(query);
            const { content = [], meatadataDto, size } = res.data || {};

            let flattenedData = content;

            if (activeKey === "Rejected") {
              flattenedData = content.flatMap((doc) =>
                doc.versionOfDocResponses.map((version) => ({
                  documentId: doc.documentId,
                  documentName: doc.documentName,
                  documentType: doc.documentType,
                  workflowName: doc.workflowName,
                  versionNumber: version.versionNumber,
                  dateReject: version.dateReject,
                  userReject: version.userReject,
                  scope: doc.scope,
                }))
              );
            }

            if (res.data) {
              setMeta({
                page: res.data?.meatadataDto.page,
                limit: res.data?.meatadataDto.limit,
                total: res.data?.size,
              });
            }
            return {
              data: flattenedData,
              page: res.data?.meatadataDto.page,
              success: true,
              total: res.data?.size,
            };
          }}
          rowKey={(record) => {
            if (activeKey === "Rejected") {
              return `${record.documentId}-${record.versionNumber}`;
            } else {
              return (
                record.documentDto?.documentId ||
                `${record.documentDto?.documentName}-${Math.random()}`
              );
            }
          }}
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]} - {range[1]} trên {total} văn bản
                </div>
              );
            },
          }}
          headerTitle={
            <span style={{ fontWeight: "bold" }}>
              Danh sách văn bản nội bộ phòng ban
            </span>
          }
          onRow={(record) => ({
            title: "Bấm một lần để xem nhanh, hai lần để mở chi tiết",
            style: { cursor: "pointer" },
            onClick: () => {
              // Đợi để phân biệt single và double click
              clickTimer = setTimeout(() => {
                setSelectedRecord(record);
                setOpenViewDetail(true);
              }, 250); // Delay ngắn, vừa đủ để phân biệt double click
            },
            onDoubleClick: () => {
              clearTimeout(clickTimer); // Hủy click nếu là double click
              activeKey === "Rejected"
                ? navigate(`/detail-document/${record.documentId}`)
                : navigate(`/detail-document/${record.documentDto.documentId}`);
            },
          })}
        />
        <DrawerIncomingDocument
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          activeKey={activeKey}
        />
      </div>
    </div>
  );
};

export default TableIncomingDocument;
