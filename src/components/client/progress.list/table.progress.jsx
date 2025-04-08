import { ProTable } from "@ant-design/pro-components";
import { Tabs, Tag, Button, Badge } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useRef, useState } from "react";
import dayjs from "dayjs";
import { dateRangeValidate } from "@/services/helper";
import "./table.progress.scss";
import DetailProgress from "@/components/client/progress.list/detail.progress";

const dataSource = [
  {
    key: "1",
    name: "Thông báo kế hoạch hoạt động tháng 4",
    reviewer: "Lê Phan Hoài Nam",
    created_date: "2025-04-11T07:11:00.943Z",
    end_date: "2025-04-20T07:11:00.943Z",
    status: "Đang xử lý",
    type: "Thông báo",
    tag: "văn bản phòng ban",
    hasAttachment: true,
    phuongThucXuLy: "nhiemvu",
  },
  {
    key: "2",
    name: "Thông báo lịch họp phòng ban tháng 4",
    reviewer: "Ngô Huỳnh Tấn Lộc",
    created_date: "2025-03-30T07:11:00.943Z",
    end_date: "2025-04-01T07:11:00.943Z",
    status: "Đã lưu",
    type: "Thông báo",
    tag: "văn bản phòng ban",
    hasAttachment: false,
    phuongThucXuLy: "nhiemvu",
  },
  {
    key: "3",
    name: "Thông báo phân công nhiệm vụ công tác",
    reviewer: "Ngô Huỳnh Tấn Lộc",
    created_date: "2025-04-01T07:11:00.943Z",
    end: "2025-04-05T07:11:00.943Z",
    status: "Đã lưu",
    type: "Thông báo",
    tag: "văn bản phòng ban",
    hasAttachment: true,
    phuongThucXuLy: "nhiemvu",
  },
  {
    key: "4",
    name: "Báo cáo thành tích thi đua phòng ban quý I",
    reviewer: "Lê Phan Hoài Nam",
    created_date: "2025-04-05T07:11:00.943Z",
    end_date: "2025-04-09T07:11:00.943Z",
    status: "Đã hoàn thành",
    type: "Báo cáo",
    tag: "văn bản phòng ban",
    hasAttachment: true,
    phuongThucXuLy: "nhiemvu",
  },
];

const statusColor = {
  "Đang xử lý": "#CECECE",
  "Đã hoàn thành": "#2BDBBB",
  "Đã lưu": "#82E06E",
};

const tagColor = {
  "văn bản đến": "#FC8330",
  "văn bản đi": "#18B0FF",
  "văn bản phòng ban": "#9254DE",
  "văn bản toàn trường": "#F759AB",
  "hoàn thành": "#2BDBBB",
};

const TableProgress = () => {
  const [activeKey, setActiveKey] = useState("all");
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const [openDetailProgressModal, setOpenDetailProgressModal] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const columns = [
    {
      title: "Tên văn bản",
      dataIndex: "name",
      width: "35%",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập tên đăng nhập",
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 },
      },
      render: (_, row) => (
        <>
          {row.hasAttachment && (
            <PaperClipOutlined style={{ marginRight: 6, color: "#fa8c16" }} />
          )}
          {row.name} <br />
          <Tag color={tagColor[row.tag]}>{row.tag}</Tag>
        </>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_date",
      width: "10%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.created_date).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Thời hạn xử lý",
      dataIndex: "end_date",
      width: "10%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.end_date).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      hideInSearch: true,
      render: (_, row) => (
        <Badge
          color={statusColor[row.status]}
          text={row.status}
          className="custom-dot"
        />
      ),
    },
    {
      title: "Loại văn bản",
      dataIndex: "type",
      width: "10%",
      hideInSearch: true,
    },
    {
      title: "Hành động",
      width: "10%",
      valueType: "option",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditOutlined
              key="edit"
              style={{ marginLeft: 12, color: "#f57800" }}
              onClick={() => {
                setDataViewDetail(entity);
                setOpenDetailProgressModal(true);
              }}
            />
          </>
        );
      },
    },
  ];

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
        <ProTable
          columns={columns}
          actionRef={actionRef}
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
          scroll={{ y: "calc(100vh - 420px)" }}
          cardBordered
          dataSource={dataSource}
          request={async (params, sort, filter) => {
            console.log(params, sort, filter);

            let query = "";
            if (params) {
              query += `current=${params.current}&pageSize=${params.pageSize}`;
              if (params.email) {
                query += `&email=/${params.email}/i`;
              }
              if (params.fullName) {
                query += `&fullName=/${params.fullName}/i`;
              }

              const createdDateRange = dateRangeValidate(params.createdAtRange);
              if (createdDateRange) {
                query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`;
              }
            }

            // default

            if (sort && sort.createdAt) {
              query += `&sort=${
                sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
              }`;
            } else query += `&sort=-createdAt`;
            return {
              data: dataSource,
              page: 1,
              success: true,
              total: 10,
            };
          }}
          rowKey="key"
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]} - {range[1]} trên {total} dòng
                </div>
              );
            },
          }}
          headerTitle={
            <span style={{ fontWeight: "bold" }}>
              Danh sách văn bản đã khởi tạo
            </span>
          }
          //   toolBarRender={() => [
          //     <Button
          //       key="buttonAddNew"
          //       icon={<PlusOutlined />}
          //       onClick={() => {
          //         setOpenModalCreate(true);
          //       }}
          //       type="primary"
          //     >
          //       Tạo mới văn bản
          //     </Button>,
          //   ]}
        />
        <DetailProgress
          openDetailProgressModal={openDetailProgressModal}
          setOpenDetailProgressModal={setOpenDetailProgressModal}
          dataViewDetail={dataViewDetail}
          setDataViewDetail={setDataViewDetail}
          refreshTable={refreshTable}
        />
      </div>
    </div>
  );
};

export default TableProgress;
