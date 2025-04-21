import { convertProcessingStatus } from "@/services/helper";

import { ProTable } from "@ant-design/pro-components";
import { Badge, Tooltip } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import "styles/loading.scss";
import { useNavigate } from "react-router-dom";
import { viewMySelfDocumentAPI } from "@/services/api.service";
import "./table.progress.scss";

const statusColor = {
  InProgress: "#3A91F5", // xanh dương
  Completed: "#2BDBBB", // xanh ngọc
  Archived: "#82E06E", // xanh lá
  Rejected: "#FF6B6B", // đỏ
};

const TableProgress = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const navigate = useNavigate();

  const columns = [
    {
      title: "Tên văn bản",
      dataIndex: "name",
      width: "40%",
      copyable: true,
      render: (_, row) => (
        <Tooltip title="Xem chi tiết">
          <a
            onClick={() => navigate(`/detail-progress/${row.id}`)}
            style={{ cursor: "pointer" }}
          >
            {row.name}
          </a>
        </Tooltip>
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
      render: (text) => dayjs(text).format("DD - MM - YYYY HH:mm"),
      hideInSearch: true,
    },
    {
      title: "Loại văn bản",
      dataIndex: "type",
      width: "20%",
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
      />
    </div>
  );
};

export default TableProgress;
