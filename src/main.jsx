import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "styles/global.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "pages/client/dashboard/dashboard";
import ListUserPage from "pages/client/users/list.user";
import ListInComingDocumentPage from "pages/client/documents/incoming.documents/list.incoming.document";
import ListOutgoingDocumentPage from "pages/client/documents/outgoing.documents/list.outgoing.document";
import ListSchoolScopedDocumentPage from "pages/client/documents/school.scoped.documents/list.school.scoped.document";
import ListDivisionScopedDocumentPage from "pages/client/documents/division.scoped.documents/list.division.scoped.document";
import LayoutAdmin from "@/layout.admin";
import NotificationPage from "pages/notification";
import ManageDivisionPage from "pages/admin/divisions/manage.division";
import ManageUserPage from "pages/admin/users/manage.user";
import ManageDocumentTypePage from "pages/admin/document.types/manage.document.type";
import ManageLogPage from "pages/admin/log.list/manage.log";
import ManagePermissionPage from "pages/admin/permissions/manage.permission";
import ManageWorkflowPage from "pages/admin/workflows/manage.workflow";
import LoginPage from "pages/auth/login";
import ForgotPasswordPage from "pages/auth/forgot.password";
import ChangePasswordPage from "pages/auth/change.password";
import ProfilePage from "pages/profile";
import UserGuidePage from "pages/user.guide";
import ListArchivedDocumentPage from "pages/client/archived.documents/list.archived.document";
import ListDocumentTemplatePage from "pages/client/document.templates/list.document.template";
import ListDocumentTypePage from "pages/client/document.types/list.document.type";
import ListProgressPage from "pages/client/progresses/list.progress";
import ListTaskPage from "pages/client/tasks/list.task";
import ListWorkflowPage from "pages/client/workflows/list.workflow";
import viVN from "antd/locale/vi_VN";
import { App, ConfigProvider } from "antd";
import ManageDigitalSignature from "./pages/admin/digital.signatures/manage.digital.signature";
import ManageInitialSignature from "./pages/admin/initial.signatures/manage.initial.signature";
import ListAllDocumentPage from "./pages/client/documents/all.documents/list.all.documents";
import LayoutClient from "@/layout";
import DetailDocument from "pages/client/documents/detail.document";
import DraftDocument from "./pages/client/documents/draft.document";
import ApproveDocument from "./components/client/documents/approve.document/approve.document";
import TaskDetailPage from "./pages/client/tasks/task.detail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutClient />,
    children: [
      {
        index: true,
        element: <ListAllDocumentPage />,
      },
      {
        path: "/user",
        element: <ListUserPage />,
      },
      {
        path: "/incoming-document",
        element: <ListInComingDocumentPage />,
      },
      {
        path: "/outgoing-document",
        element: <ListOutgoingDocumentPage />,
      },
      {
        path: "/school-scoped-document",
        element: <ListSchoolScopedDocumentPage />,
      },
      {
        path: "/division-scoped-document",
        element: <ListDivisionScopedDocumentPage />,
      },
      {
        path: "/detail-document",
        element: <DetailDocument />,
      },
      {
        path: "/approve-document",
        element: <ApproveDocument />,
      },
      {
        path: "/draft-document",
        element: <DraftDocument />,
      },
      {
        path: "/archived-document",
        element: <ListArchivedDocumentPage />,
      },
      {
        path: "/document-template",
        element: <ListDocumentTemplatePage />,
      },
      {
        path: "/document-type",
        element: <ListDocumentTypePage />,
      },
      {
        path: "/progress",
        element: <ListProgressPage />,
      },
      {
        path: "/task",
        element: <ListTaskPage />,
      },
      {
        path: "/task-detail",
        element: <TaskDetailPage />,
      },
      {
        path: "/workflow",
        element: <ListWorkflowPage />,
      },
      {
        path: "/change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "/notification",
        element: <NotificationPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/user-guide",
        element: <UserGuidePage />,
      },
    ],
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <NotificationPage />,
      },
      {
        path: "user",
        element: <ManageUserPage />,
      },
      {
        path: "division",
        element: <ManageDivisionPage />,
      },
      {
        path: "document-type",
        element: <ManageDocumentTypePage />,
      },
      {
        path: "log",
        element: <ManageLogPage />,
      },
      {
        path: "permission",
        element: <ManagePermissionPage />,
      },
      {
        path: "workflow",
        element: <ManageWorkflowPage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "user-guide",
        element: <UserGuidePage />,
      },
      {
        path: "digital-signature",
        element: <ManageDigitalSignature />,
      },
      {
        path: "initial-signature",
        element: <ManageInitialSignature />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App>
      <ConfigProvider locale={viVN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </App>
  </StrictMode>
);
