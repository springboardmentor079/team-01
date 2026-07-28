import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import milestoneReducer from "../features/milestones/milestoneSlice";
import siteProgressReducer from "../features/siteProgress/siteProgressSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    milestones: milestoneReducer,
    siteProgress: siteProgressReducer,
  },
});

export default store;
