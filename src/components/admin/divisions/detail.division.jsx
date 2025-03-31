import { Avatar, Descriptions, Drawer, Table, Tag } from "antd";

const DetailDivision = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
      render: (avatar) => <Avatar src={avatar} />,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Vai trò chính",
      dataIndex: "role",
      render: (role) => (
        <Tag color={role === "DIVISION_HEAD" ? "orange" : "gold"}>
          {role === "DIVISION_HEAD" ? "Lãnh đạo phòng ban" : "Chuyên viên"}
        </Tag>
      ),
    },
  ];

  return (
    <>
      {dataViewDetail && (
        <Drawer
          title={`Chi tiết phòng ban`}
          width={"60vw"}
          open={openViewDetail}
          onClose={onClose}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tên phòng ban">
              {dataViewDetail?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {dataViewDetail?.is_deleted ? (
                <Tag color="red">Bị khóa</Tag>
              ) : (
                <Tag color="green">Hoạt động</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
          <Table
            dataSource={dataViewDetail.list_users || []}
            columns={columns}
            rowKey="user_id"
            pagination={false}
            scroll={{ y: 400 }}
          />
        </Drawer>
      )}
    </>
  );
};

export default DetailDivision;
