import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
import "@/styles/notification.scss";

const { Title, Text } = Typography;

const notifications = [
  {
    id: 1,
    date: "21/01/2025 22:31",
    title: "Lịch nghỉ tết nguyên đán Ất Tỵ 2025",
    link: "#",
    content:
      "Công chức, viên chức, người lao động thuộc các cơ quan hành chính, sự nghiệp, tổ chức chính trị sẽ được nghỉ từ 25/1 - 2/2/2025.",
  },
  {
    id: 2,
    date: "20/01/2025 15:45",
    title: "Thông báo về kỳ thi cuối kỳ",
    link: "#",
    content:
      "Kỳ thi cuối kỳ sẽ diễn ra từ 01/02/2025. Sinh viên cần xem lịch thi chi tiết trên hệ thống.",
  },
  {
    id: 3,
    date: "18/01/2025 10:15",
    title: "Thông báo tuyển sinh đợt 1 năm 2025",
    link: "#",
    content:
      "Trường thông báo tuyển sinh đợt 1 với nhiều ngành học hấp dẫn. Chi tiết xem tại thông báo chính thức.",
  },
  {
    id: 4,
    date: "17/01/2025 14:20",
    title: "Hướng dẫn đăng ký học phần kỳ II",
    link: "#",
    content:
      "Sinh viên cần hoàn tất đăng ký học phần trước ngày 25/01/2025. Hướng dẫn chi tiết tại cổng thông tin sinh viên.",
  },
  {
    id: 5,
    date: "15/01/2025 09:30",
    title: "Thông báo tổ chức hội thảo chuyên đề",
    link: "#",
    content:
      "Hội thảo về công nghệ AI sẽ diễn ra vào ngày 30/01/2025. Đăng ký tham gia tại văn phòng khoa.",
  },
  {
    id: 6,
    date: "14/01/2025 16:45",
    title: "Hỗ trợ học bổng kỳ II",
    link: "#",
    content:
      "Danh sách sinh viên nhận học bổng đã được cập nhật. Vui lòng tra cứu tại phòng đào tạo.",
  },
  {
    id: 7,
    date: "13/01/2025 08:10",
    title: "Lịch học lại và cải thiện điểm",
    link: "#",
    content:
      "Sinh viên có nhu cầu học lại, cải thiện điểm có thể đăng ký từ ngày 20/01 - 28/01/2025.",
  },
  {
    id: 8,
    date: "12/01/2025 19:30",
    title: "Thông báo cập nhật phần mềm quản lý sinh viên",
    link: "#",
    content:
      "Hệ thống quản lý sinh viên sẽ được bảo trì từ 22h ngày 15/01/2025 đến 06h ngày 16/01/2025.",
  },
  {
    id: 9,
    date: "11/01/2025 11:00",
    title: "Tuyển tình nguyện viên hỗ trợ sự kiện xuân",
    link: "#",
    content:
      "Trường cần tuyển tình nguyện viên hỗ trợ sự kiện Xuân 2025. Đăng ký tại phòng Công tác Sinh viên.",
  },
  {
    id: 10,
    date: "10/01/2025 13:40",
    title: "Thông báo về việc đăng ký đề tài tốt nghiệp",
    link: "#",
    content:
      "Sinh viên năm cuối cần hoàn tất đăng ký đề tài tốt nghiệp trước ngày 05/02/2025.",
  },
  {
    id: 11,
    date: "09/01/2025 17:20",
    title: "Cập nhật lịch thi thực hành",
    link: "#",
    content:
      "Lịch thi thực hành của các khoa đã được cập nhật. Sinh viên vui lòng kiểm tra trên hệ thống.",
  },
  {
    id: 12,
    date: "08/01/2025 07:55",
    title: "Thông báo tuyển dụng trợ giảng",
    link: "#",
    content:
      "Khoa Công nghệ thông tin tuyển trợ giảng cho các môn lập trình. Ứng tuyển tại văn phòng khoa.",
  },
  {
    id: 13,
    date: "07/01/2025 09:25",
    title: "Thông báo nhận bằng tốt nghiệp",
    link: "#",
    content:
      "Sinh viên tốt nghiệp đợt tháng 12/2024 có thể nhận bằng từ ngày 15/01/2025 tại phòng đào tạo.",
  },
  {
    id: 14,
    date: "06/01/2025 18:00",
    title: "Chương trình giao lưu quốc tế 2025",
    link: "#",
    content:
      "Chương trình trao đổi sinh viên với Nhật Bản, Hàn Quốc mở đơn đăng ký từ ngày 20/01/2025.",
  },
  {
    id: 15,
    date: "05/01/2025 15:30",
    title: "Thông báo lịch học chính trị đầu khóa",
    link: "#",
    content:
      "Sinh viên K46 cần tham gia lớp học chính trị đầu khóa vào ngày 10/01/2025 tại hội trường A.",
  },
  {
    id: 16,
    date: "04/01/2025 12:10",
    title: "Kế hoạch thực tập học kỳ II",
    link: "#",
    content:
      "Sinh viên có thể tra cứu thông tin thực tập trên hệ thống và liên hệ giảng viên hướng dẫn.",
  },
  {
    id: 17,
    date: "03/01/2025 08:45",
    title: "Thông báo đóng học phí kỳ II",
    link: "#",
    content:
      "Hạn cuối đóng học phí kỳ II là ngày 25/01/2025. Sinh viên vui lòng hoàn thành trước thời hạn.",
  },
  {
    id: 18,
    date: "02/01/2025 14:55",
    title: "Cuộc thi lập trình CodeFest 2025",
    link: "#",
    content:
      "Cuộc thi CodeFest 2025 sẽ diễn ra vào tháng 3. Sinh viên có thể đăng ký tham gia tại CLB Lập trình.",
  },
  {
    id: 19,
    date: "01/01/2025 20:20",
    title: "Thông báo lịch học kỳ II",
    link: "#",
    content:
      "Lịch học kỳ II năm học 2024-2025 đã được cập nhật. Sinh viên có thể xem chi tiết trên hệ thống.",
  },
  {
    id: 20,
    date: "31/12/2024 10:00",
    title: "Chương trình chào năm mới 2025",
    link: "#",
    content:
      "Trường tổ chức chương trình đón năm mới vào ngày 01/01/2025. Sinh viên có thể tham gia miễn phí.",
  },
];

const NotificationPage = () => {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) =>
      Math.min(prevCount + 5, notifications.length)
    );
  };

  return (
    <div className="notification-container">
      <Card className="notification-card" bordered>
        <Title level={2}>Thông báo</Title>
        <ul className="notification-list">
          {notifications.slice(0, visibleCount).map((item) => (
            <li key={item.id}>
              <Text strong className="notification-title">
                {item.date}:{" "}
                <a href={item.link} className="notification-link">
                  {item.title}
                </a>
              </Text>
              <Text className="notification-content">{item.content}</Text>
            </li>
          ))}
        </ul>

        {visibleCount < notifications.length && (
          <Button className="load-more-btn" onClick={handleLoadMore}>
            Xem thông báo trước đó
          </Button>
        )}
      </Card>
    </div>
  );
};

export default NotificationPage;
