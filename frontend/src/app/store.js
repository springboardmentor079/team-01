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
  },
});

export default store;
