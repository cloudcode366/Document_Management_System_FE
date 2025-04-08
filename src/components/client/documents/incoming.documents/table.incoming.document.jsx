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
import "./table.incoming.document.scss";
import CreateDocument from "@/components/client/documents/progresses/create.document";

const { TabPane } = Tabs;

const dataSource = [
  {
    key: "1",
    name: "Quyết định khen thưởng thành tích thi đua dịp lễ 30/4 - 1/5",
    reviewer: "Sở GD&ĐT",
    date: "2025-04-11T07:11:00.943Z",
    status: "Đã lưu",
    type: "Quyết định",
    tag: "văn bản đến",
    hasAttachment: true,
  },
  {
    key: "2",
    name: "Quyết định áp dục chương trình đào tạo kiểu mới cho năm 2024 - 2025",
    reviewer: "Sở GD&ĐT",
    date: "2025-03-30T07:11:00.943Z",
    status: "Đã lưu",
    type: "Quết định",
    tag: "văn bản đến",
    hasAttachment: false,
  },
  {
    key: "3",
    name: "Thông báo lịch nghỉ lễ 30/4 - 1/5",
    reviewer: "Sở GD&ĐT",
    date: "2025-02-15T07:11:00.943Z",
    status: "Đã lưu",
    type: "Thông báo",
    tag: "văn bản đến",
    hasAttachment: true,
  },
  {
    key: "4",
    name: "Quyết định bổ nhiệm nhân sự cấp cao về trường",
    reviewer: "Sở GD&ĐT",
    date: "2025-04-01T07:11:00.943Z",
    status: "Đã lưu",
    type: "Quyết định",
    tag: "văn bản đến",
    hasAttachment: true,
  },
  {
    key: "5",
    name: "Chương trình hưởng ứng tinh thần dịp lễ 30/4 - 1/5",
    reviewer: "Sở GD&ĐT",
    date: "2025-03-13T07:11:00.943Z",
    status: "Đã lưu",
    type: "Chương trình",
    tag: "văn bản đến",
    hasAttachment: true,
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
    title: "Đơn vị ban hành",
    dataIndex: "reviewer",
    width: "20%",
    hideInSearch: true,
  },
  {
    title: "Ngày tạo",
    dataIndex: "date",
    width: "10%",
    hideInSearch: true,
    render(dom, entity, index, action, schema) {
      return <>{dayjs(entity.date).format("DD-MM-YYYY")}</>;
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
    render: () => [
      //   <DownloadOutlined key="download" style={{ color: "green" }} />,
      <EditOutlined key="edit" style={{ marginLeft: 12, color: "#f57800" }} />,
    ],
  },
];

const TableIncomingDocument = () => {
  const [activeKey, setActiveKey] = useState("all");
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const [openModalCreate, setOpenModalCreate] = useState(false);

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
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
          <TabPane tab="TẤT CẢ" key="all" />
          {/* <TabPane tab="ĐẾN LƯỢT DUYỆT" key="review" />
          <TabPane tab="ĐANG CHỜ DUYỆT" key="waiting" />
          <TabPane tab="ĐÃ CHẤP NHẬN" key="accepted" />
          <TabPane tab="ĐÃ TỪ CHỐI" key="rejected" />
          <TabPane tab="QUÁ HẠN" key="overdue" /> */}
        </Tabs>

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
          dataSource={dataSource.filter((doc) => {
            if (activeKey === "all") return true;
            if (activeKey === "review") return doc.status === "Đang xử lý";
            if (activeKey === "waiting") return doc.status === "Đã lưu";
            if (activeKey === "accepted") return doc.status === "Đã được duyệt";
            if (activeKey === "rejected") return doc.status === "Bị từ chối";
            if (activeKey === "overdue") return doc.status === "Đã quá hạn";
            return false;
          })}
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
            <span style={{ fontWeight: "bold" }}>Danh sách văn bản đến</span>
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
              Tạo mới văn bản
            </Button>,
          ]}
        />
        <CreateDocument
          openModalCreate={openModalCreate}
          setOpenModalCreate={setOpenModalCreate}
          refreshTable={refreshTable}
        />
      </div>
    </div>
  );
};

export default TableIncomingDocument;
