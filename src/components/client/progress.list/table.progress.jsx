import { convertProcessingStatus, convertScopeName } from "@/services/helper";

import { ProTable } from "@ant-design/pro-components";
import { Badge, Button, Tag, Tooltip } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import "styles/loading.scss";
import { useNavigate } from "react-router-dom";
import { viewMySelfDocumentAPI } from "@/services/api.service";
import "./table.progress.scss";
import { PaperClipOutlined, PlusOutlined } from "@ant-design/icons";
import DrawerProgressDocument from "./drawer.progress";
import CreateDocumentProgress from "./create.document.progress";

const statusColor = {
  InProgress: "#3A91F5", // xanh dương
  Completed: "#2BDBBB", // xanh ngọc
  Archived: "#82E06E", // xanh lá
  Rejected: "#FF6B6B", // đỏ
};

const tagColor = {
  "Văn bản đến": "#FC8330",
  "Văn bản đi": "#18B0FF",
  "Nội bộ phòng ban": "#9254DE",
  "Nội bộ toàn trường": "#F759AB",
};

const TableProgress = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  let clickTimer = null;

  const navigate = useNavigate();

  const columns = [
    {
      title: "Tên văn bản",
      dataIndex: "name",
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
                cursor: "pointer",
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
        placeholder: "Vui lòng nhập tên văn bản",
      },
      formItemProps: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
    },
    {
      title: "Phạm vi",
      dataIndex: "scope",
      hideInTable: true,
      valueType: "select",
      request: async () => {
        return [
          { label: "Văn bản đến", value: "InComing" },
          { label: "Văn bản đi", value: "OutGoing" },
          { label: "Nội bộ phòng ban", value: "Division" },
          { label: "Nội bộ toàn trường", value: "School" },
        ];
      },
      fieldProps: {
        placeholder: "Vui lòng chọn phạm vi",
        showSearch: true,
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      hideInTable: true,
      valueType: "select",
      request: async () => {
        return [
          { label: "Đang xử lý", value: "InProgress" },
          { label: "Đã hoàn thành", value: "Completed" },
          { label: "Đã lưu", value: "Archived" },
          { label: "Bị từ chối", value: "Rejected" },
        ];
      },
      fieldProps: {
        placeholder: "Vui lòng chọn trạng thái",
        showSearch: true,
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
      formItemProps: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      fieldProps: {
        // format: "DD-MM-YYYY",
        placeholder: ["Từ ngày", "Đến ngày"],
      },
    },
    {
      title: "Loại văn bản",
      dataIndex: "type",
      width: "15%",
      hideInSearch: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      sorter: true,
      width: "15%",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm"),
      hideInSearch: true,
    },
    {
      title: "Hạn xử lý",
      dataIndex: "deadline",
      width: "15%",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm"),
      hideInSearch: true,
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      render: (_, row) => (
        <Badge
          color={statusColor[row.status]}
          text={convertProcessingStatus(row.status)}
          className="custom-dot"
        />
      ),
      hideInSearch: true,
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        backgroundColor: "#e8edfa",
        padding: "20px 0",
        width: "100%",
        height: "100vh",
      }}
    >
      <ProTable
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
        search={{
          labelWidth: "auto",
          span: 8,
        }}
        scroll={{ y: "calc(100vh - 400px)" }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          const filters = Object.fromEntries(
            Object.entries(params).filter(
              ([key, value]) =>
                value !== undefined &&
                value !== null &&
                value !== "" &&
                key !== "current" &&
                key !== "pageSize" &&
                key !== "createdAtRange"
            )
          );

          if (params.createdAtRange && params.createdAtRange.length === 2) {
            filters.startCreatedDate = params.createdAtRange[0];
            filters.endCreatedDate = params.createdAtRange[1];
          }

          if (sort && sort.createDate) {
            const sortByCreatedDate =
              sort.createDate === "ascend" ? "Ascending" : "Descending";
            filters.sortByCreatedDate = sortByCreatedDate;
          }
          const res = await viewMySelfDocumentAPI(
            params.current,
            params.pageSize,
            filters
          );
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
        rowKey="id"
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
          <span style={{ fontWeight: "bold" }}>Danh sách văn bản khởi tạo</span>
        }
        toolBarRender={() => [
          <Button
            key="buttonAddNew"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Khởi tạo văn bản
          </Button>,
        ]}
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

            navigate(`/detail-progress/${record.id}`);
          },
        })}
      />
      <CreateDocumentProgress
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <DrawerProgressDocument
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      />
    </div>
  );
};

export default TableProgress;
