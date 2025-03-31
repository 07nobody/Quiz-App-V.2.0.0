const { axiosInstance } = require(".");

// User registration
export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/register", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// User login
export const loginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/login", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Get user info
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.post("/users/get-user-info", {});
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Get user progress for dashboard
export const getUserProgress = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/progress/${userId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Get user statistics
export const getUserStatistics = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/statistics/${userId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Forgot password functionality
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/users/forgot-password", { email });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Update user profile
export const updateUserProfile = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/update-profile", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Change password
export const changePassword = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/change-password", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
