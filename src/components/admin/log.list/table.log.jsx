import { ProTable } from "@ant-design/pro-components";
import { App, Button } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { viewAllLogsAPI } from "@/services/api.service";

const data = [
  {
    id: "dt1",
    username: "admin",
    time: "2025-02-02T07:50:00.943Z",
    action: "Đã gán vai trò Sub Leader cho namlph1",
  },
  {
    id: "dt1",
    username: "admin",
    time: "2025-02-01T07:00:00.943Z",
    action: "Kết thúc bảo trì hệ thống",
  },
  {
    id: "dt1",
    username: "admin",
    time: "2025-02-01T00:00:00.943Z",
    action: "Hệ thống tiến hành bảo trì",
  },
  {
    id: "dt1",
    username: "minhtgn1",
    time: "2025-01-22T09:11:00.943Z",
    action:
      "minhtgn1 nộp văn bản báo cáo kế hoạch tài chính cho việc khen thưởng tết Ất Tỵ 2025",
  },
  {
    id: "dt1",
    username: "hieuhc1",
    time: "2025-01-21T07:11:00.943Z",
    action: "Ký số văn bản lịch trực tết của cán bộ và giáo viên trong trường",
  },
];

const TableLogs = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });

  const { message } = App.useApp();

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "time",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createdAt).format("DD-MM-YYYY HH:mm")}</>;
      },
      width: "20%",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      fieldProps: {
        placeholder: "Vui lòng nhập tên đăng nhập",
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 },
      },
      width: "20%",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      fieldProps: {
        placeholder: "Vui lòng nhập hành động",
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 },
      },
      width: "60%",
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
        scroll={{ y: "calc(100vh - 350px)" }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          try {
            const filters = {
              userName: params.userName,
              action: params.action,
              startTime: params.startTime,
              endTime: params.endTime,
              sort: sort.timestamp
                ? sort.timestamp === "ascend"
                  ? "timestamp"
                  : "-timestamp"
                : "-timestamp",
            };

            const response = await viewAllLogsAPI(
              params.current,
              params.pageSize,
              filters
            );

            const { content, meatadataDto, size, total } = response.data;

            setMeta({
              current: meatadataDto.page,
              pageSize: meatadataDto.limit,
              pages: meatadataDto.total,
              total: total || size,
            });

            return {
              data: content.map((item, index) => ({
                ...item,
                key: item.timestamp || `log-${index}`, // Generate unique key
              })),
              success: true,
              total: total || size,
              page: meatadataDto.page,
            };
          } catch (error) {
            message.error("Lỗi khi tải nhật ký hệ thống: " + error.message);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
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
          <span style={{ fontWeight: "bold" }}>Lịch sử hệ thống</span>
        }
        toolBarRender={() => []}
      />
    </div>
  );
};

export default TableLogs;

// import { App } from "antd";
// import { useRef, useState } from "react";
// import dayjs from "dayjs";
// import { viewAllLogsAPI } from "@/services/api.service";

// const TableLogs = () => {
//   const actionRef = useRef();
//   const [meta, setMeta] = useState({
//     current: 1,
//     pageSize: 20,
//     pages: 0,
//     total: 0,
//   });
//   const { message } = App.useApp(); // For error notifications

//   const columns = [
//     {
//       title: "Thời gian",
//       dataIndex: "timestamp",
//       valueType: "date",
//       sorter: true,
//       hideInSearch: true,
//       render: (_, entity) => {
//         return dayjs(entity.timestamp).format("DD-MM-YYYY HH:mm");
//       },
//       width: "20%",
//     },
//     {
//       title: "Thời gian",
//       dataIndex: "createdAtRange",
//       valueType: "dateRange",
//       hideInTable: true,
//       search: {
//         transform: (value) => ({
//           startTime: value[0],
//           endTime: value[1],
//         }),
//       },
//     },
//     {
//       title: "Tên đăng nhập",
//       dataIndex: "userName",
//       fieldProps: {
//         placeholder: "Vui lòng nhập tên đăng nhập",
//       },
//       formItemProps: {
//         labelCol: { span: 8 },
//         wrapperCol: { span: 18 },
//       },
//       width: "20%",
//     },
//     {
//       title: "Hành động",
//       dataIndex: "action",
//       fieldProps: {
//         placeholder: "Vui lòng nhập hành động",
//       },
//       formItemProps: {
//         labelCol: { span: 8 },
//         wrapperCol: { span: 18 },
//       },
//       width: "60%",
//     },
//   ];

//   const refreshTable = () => {
//     actionRef.current?.reload();
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-end",
//         backgroundColor: "#e8edfa",
//         padding: "20px 0",
//         width: "100%",
//         height: "100vh",
//       }}
//     >
//       <ProTable
//         style={{
//           width: "100%",
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//         }}
//         scroll={{ y: "calc(100vh - 350px)" }}
//         columns={columns}
//         actionRef={actionRef}
//         cardBordered
//         request={async (params, sort, filter) => {
//           try {
//             const filters = {
//               userName: params.userName,
//               action: params.action,
//               startTime: params.startTime,
//               endTime: params.endTime,
//               sort: sort.timestamp
//                 ? sort.timestamp === "ascend"
//                   ? "timestamp"
//                   : "-timestamp"
//                 : "-timestamp",
//             };

//             const response = await viewAllLogsAPI(
//               params.current,
//               params.pageSize,
//               filters
//             );

//             const { content, meatadataDto, size, total } = response.data;

//             setMeta({
//               current: meatadataDto.page,
//               pageSize: meatadataDto.limit,
//               pages: meatadataDto.total,
//               total: total || size,
//             });

//             return {
//               data: content.map((item, index) => ({
//                 ...item,
//                 key: item.timestamp || `log-${index}`, // Generate unique key
//               })),
//               success: true,
//               total: total || size,
//               page: meatadataDto.page,
//             };
//           } catch (error) {
//             message.error("Lỗi khi tải nhật ký hệ thống: " + error.message);
//             return {
//               data: [],
//               success: false,
//               total: 0,
//             };
//           }
//         }}
//         rowKey="key"
//         pagination={{
//           current: meta.current,
//           pageSize: meta.pageSize,
//           showSizeChanger: true,
//           total: meta.total,
//           showTotal: (total, range) => {
//             return (
//               <div>
//                 {range[0]} - {range[1]} trên {total} dòng
//               </div>
//             );
//           },
//         }}
//         headerTitle={
//           <span style={{ fontWeight: "bold" }}>Lịch sử hệ thống</span>
//         }
//         toolBarRender={() => []}
//       />
//     </div>
//   );
// };

// export default TableLogs;
