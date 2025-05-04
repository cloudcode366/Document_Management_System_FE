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
      width: "40%",
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
      title: "Ngày tạo",
      dataIndex: "createDate",
      width: "20%",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm"),
      hideInSearch: true,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "deadline",
      width: "20%",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm"),
      hideInSearch: true,
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "20%",
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
        scroll={{ y: "calc(100vh - 400px)" }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            if (params.name) {
              query += `searchText=${params.name}`;
            }
            query += `&page=${params.current}&pageSize=${params.pageSize}`;
          }

          const res = await viewMySelfDocumentAPI(query);
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
            return <div>{/* {range[0]} - {range[1]} trên {total} dòng */}</div>;
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
