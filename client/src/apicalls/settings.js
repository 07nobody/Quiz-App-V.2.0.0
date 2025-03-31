import { axiosInstance } from ".";

// Get all settings (admin only)
export const getAllSettings = async () => {
  try {
    const response = await axiosInstance.get("/settings");
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      message: error.message || "Error fetching settings",
      success: false,
      error
    };
  }
};

// Get public settings
export const getPublicSettings = async () => {
  try {
    const response = await axiosInstance.get("/settings/public");
    return response.data;
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return {
      message: error.message || "Error fetching public settings",
      success: false,
      error
    };
  }
};

// Get settings by category
export const getSettingsByCategory = async (category) => {
  try {
    const response = await axiosInstance.get(`/settings/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} settings:`, error);
    return {
      message: error.message || `Error fetching ${category} settings`,
      success: false,
      error
    };
  }
};

// Update settings (admin only)
export const updateSettings = async (settings) => {
  try {
    const response = await axiosInstance.post("/settings/update", { settings });
    return response.data;
  } catch (error) {
    return {
      message: error.response?.data?.message || "Error updating settings",
      success: false,
      error
    };
  }
};