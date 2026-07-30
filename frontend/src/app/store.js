import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import milestoneReducer from "../features/milestones/milestoneSlice";
import siteProgressReducer from "../features/siteProgress/siteProgressSlice";
import resourceReducer from "../features/resources/resourceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    milestones: milestoneReducer,
    siteProgress: siteProgressReducer,
    resources: resourceReducer,
  },
});

export default store;
