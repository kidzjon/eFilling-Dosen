import { createSlice } from "@reduxjs/toolkit";

const initialUser = (() => {
  const stored = localStorage.getItem("efd_user");
  return stored ? JSON.parse(stored) : null;
})();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
  },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      localStorage.setItem("efd_user", JSON.stringify(action.payload));
      localStorage.setItem("efd_token", "dummy-token");
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("efd_user");
      localStorage.removeItem("efd_token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
