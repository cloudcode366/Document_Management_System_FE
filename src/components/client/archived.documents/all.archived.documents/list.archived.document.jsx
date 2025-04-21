import { ProTable } from "@ant-design/pro-components";
import { Tabs, Tag, Button, Badge, Tooltip } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { dateRangeValidate } from "@/services/helper";
import "./table.all.document.scss";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import { getAllArchivedDocuments } from "@/services/api.service";

const { TabPane } = Tabs;

const TableAllArchivedDocument = () => {
  const [activeKey, setActiveKey] = useState("All");
  const { user } = useCurrentApp();
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Tên văn bản",
      dataIndex: "name",
      width: "40%",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập tên",
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 20 },
      },
      render: (_, row) => {
        const hasAttachment = row?.attachmentDocuments?.length > 0;
        return (
          <>
            {hasAttachment && (
              <PaperClipOutlined style={{ marginRight: 6, color: "#fa8c16" }} />
            )}
            <Tooltip title="Xem chi tiết">
              <a
                // onClick={() =>
                //   navigate(
                //     `/detail-document/${row.documentId}`
                //   )
                // }
                style={{ cursor: "pointer" }}
              >
                {row.name}
              </a>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      hideInSearch: true,
    },

    {
      title: "Loại văn bản",
      dataIndex: "type",
      width: "15%",
      hideInSearch: true,
    },
    {
      title: "Người ký",
      dataIndex: "signBy",
      width: "15%",
      hideInSearch: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      width: "15%",
      hideInSearch: true,
      render: (_, row) => {
        return dayjs(row.createDate).format("DD - MM - YYYY HH:mm");
      },
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

            const res = await getAllArchivedDocuments(query);
            if (res.data) {
              setMeta(res.data.meatadataDto);
            }
            return {
              data: res.data?.content,
              page: 1,
              success: true,
              total: res.data?.meatadataDto.total,
            };
          }}
          rowKey={"documentId"}
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
        />
      </div>
    </div>
  );
};

export default TableAllArchivedDocument;
