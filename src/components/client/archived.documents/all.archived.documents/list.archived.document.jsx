import { ProTable } from "@ant-design/pro-components";
import { Badge, Tag, Tooltip } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import dayjs from "dayjs";
import "./table.archived.document.scss";
import { useNavigate } from "react-router-dom";
import { getAllArchivedDocuments } from "@/services/api.service";
import {
  convertArchivedStatus,
  convertColorArchivedStatus,
  convertScopeName,
} from "@/services/helper";
import DrawerArchivedDocument from "./drawer.archived.document";

const tagColor = {
  "Văn bản đến": "#FC8330",
  "Văn bản đi": "#18B0FF",
  "Nội bộ phòng ban": "#9254DE",
  "Nội bộ toàn trường": "#F759AB",
};

const statusColor = {
  Sent: "#2BDBBB", // xanh ngọc
  Archived: "#82E06E", // xanh lá
  Withdrawn: "#FF6B6B", // đỏ
};

const TableAllArchivedDocument = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  let clickTimer = null;

  const navigate = useNavigate();

  const columns = [
    {
      title: "Tên văn bản",
      dataIndex: "Name",
      width: "30%",
      copyable: true,
      ellipsis: {
        showTitle: false,
      },
      render: (_, row) => (
        <div>
          <Tooltip title={row.name}>
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
              {row.name}
            </div>
          </Tooltip>
          <br />
          <Tag color={tagColor[convertScopeName(row.scope)]}>
            {convertScopeName(row.scope)}
          </Tag>
        </div>
      ),
      fieldProps: {
        placeholder: "Vui lòng nhập tên",
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 20 },
      },
    },
    {
      title: "Loại văn bản",
      dataIndex: "type",
      width: "15%",
      hideInSearch: true,
    },
    {
      title: "Người lưu",
      dataIndex: "createBy",
      width: "15%",
      hideInSearch: true,
    },
    {
      title: "Ngày lưu",
      dataIndex: "createdDate",
      width: "15%",
      hideInSearch: true,
      render: (_, row) => {
        return dayjs(row.createdDate).format("DD-MM-YYYY HH:mm");
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      render: (_, row) => (
        <Badge
          color={statusColor[row.status]}
          text={convertArchivedStatus(row.status)}
          className="custom-dot"
        />
      ),
      hideInSearch: true,
    },
  ];

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
        <ProTable
          columns={columns}
          actionRef={actionRef}
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
          scroll={{ y: "calc(100vh - 350px)" }}
          cardBordered
          request={async (params) => {
            let query = "";
            if (params) {
              if (params.Name) {
                query += `docName=${params.Name}&`;
              }
              query += `page=${params.current}&pageSize=${params.pageSize}`;
            }
            const res = await getAllArchivedDocuments(query);
            if (res.data) {
              setMeta({
                page: res.data?.meatadataDto.page,
                limit: res.data?.meatadataDto.limit,
                total: res.data?.size,
              });
            }
            return {
              data: res.data?.content,
              page: res.data?.meatadataDto.page,
              success: true,
              total: res.data?.size,
            };
          }}
          rowKey={"id"}
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => {
              return (
                <div>{/* {range[0]} - {range[1]} trên {total} dòng */}</div>
              );
            },
          }}
          headerTitle={
            <span style={{ fontWeight: "bold" }}>
              Danh sách văn bản lưu trữ
            </span>
          }
          onRow={(record) => ({
            title: "Bấm một lần để xem nhanh, hai lần để mở chi tiết",
            onClick: () => {
              // Đợi để phân biệt single và double click
              clickTimer = setTimeout(() => {
                setSelectedRecord(record);
                setOpenViewDetail(true);
              }, 250); // Delay ngắn, vừa đủ để phân biệt double click
            },
            onDoubleClick: () => {
              clearTimeout(clickTimer); // Hủy click nếu là double click

              // navigate(`/detail-archived-document/${record.id}`);
              navigate("/detail-archived-document", {
                state: {
                  documentId: record.id, // truyền documentId
                },
              });
            },
          })}
        />
        <DrawerArchivedDocument
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
        />
      </div>
    </div>
  );
};

export default TableAllArchivedDocument;
