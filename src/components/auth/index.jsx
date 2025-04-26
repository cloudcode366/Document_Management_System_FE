import { Navigate, useLocation } from "react-router-dom";
import { Result, Button } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import "./index.scss"; // Đảm bảo thêm file CSS này

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isAppLoading } = useCurrentApp();
  const location = useLocation();

  if (isAppLoading) {
    return (
      <div className="full-screen-overlay">
        <Result
          status="403"
          title="403 - Không có quyền truy cập"
          subTitle="Xin lỗi, bạn không có quyền hạn để sử dụng những tính năng này."
          extra={
            <Button type="primary">
              <Link to="/">Quay lại</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const isAdminRoute = location.pathname.includes("admin");
  const role = user?.mainRole?.roleName;

  // Nếu là route admin và người dùng không phải admin
  if (isAdminRoute && role !== "Admin") {
    return (
      <div className="full-screen-overlay">
        <Result
          status="403"
          title="403 - Không có quyền truy cập"
          subTitle="Xin lỗi, bạn không có quyền hạn để sử dụng những tính năng này."
          extra={
            <Button type="primary">
              <Link to="/">Quay lại</Link>
            </Button>
          }
        />
      </div>
    );
  }

  // Nếu là route không phải admin và người dùng là admin
  if (!isAdminRoute && role === "Admin") {
    return (
      <div className="full-screen-overlay">
        <Result
          status="403"
          title="403 - Không có quyền truy cập"
          subTitle="Xin lỗi, bạn không có quyền hạn để sử dụng những tính năng này."
          extra={
            <Button type="primary">
              <Link to="/admin">Quay lại</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
