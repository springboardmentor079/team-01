import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token") || null;
let storedUser = null;

try {
  const userItem = localStorage.getItem("user");
  storedUser = userItem ? JSON.parse(userItem) : null;
} catch (error) {
  storedUser = null;
}

const initialState = {
  user: storedUser,
  token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
