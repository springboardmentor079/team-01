import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import milestoneReducer from "../features/milestones/milestoneSlice";
import siteProgressReducer from "../features/siteProgress/siteProgressSlice";
import resourceReducer from "../features/resources/resourceSlice";
import workerReducer from "../features/workers/workerSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import vendorReducer from "../features/vendors/vendorSlice";
import procurementReducer from "../features/procurement/procurementSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import reportReducer from "../features/reports/reportSlice";
import documentReducer from "../features/documents/documentSlice";
import expenseReducer from "../features/expenses/expenseSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import userReducer from "../features/users/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    milestones: milestoneReducer,
    siteProgress: siteProgressReducer,
    resources: resourceReducer,
    workers: workerReducer,
    attendance: attendanceReducer,
    inventory: inventoryReducer,
    vendors: vendorReducer,
    procurement: procurementReducer,
    notifications: notificationReducer,
    reports: reportReducer,
    documents: documentReducer,
    expenses: expenseReducer,
    dashboard: dashboardReducer,
    users: userReducer,
  },
});

export default store;
