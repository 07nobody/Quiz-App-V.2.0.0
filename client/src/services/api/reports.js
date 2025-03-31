const { axiosInstance } = require(".");

// Add report
export const addReport = async (payload) => {
  try {
    const response = await axiosInstance.post("/reports/add-report", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || { 
      success: false, 
      message: "Failed to add report" 
    };
  }
};

// Get all reports
export const getAllReports = async (filters) => {
  try {
    const response = await axiosInstance.post(
      "/reports/get-all-reports",
      filters
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { 
      success: false, 
      message: "Failed to fetch reports" 
    };
  }
};

// Get leaderboard data
export const getLeaderboard = async (filters) => {
  try {
    const response = await axiosInstance.get("/reports/leaderboard", {
      params: filters
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { 
      success: false, 
      message: "Failed to fetch leaderboard data" 
    };
  }
};

// Get all reports by user
export const getAllReportsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/reports/user-reports/${userId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { 
      success: false, 
      message: "Failed to fetch user reports" 
    };
  }
};