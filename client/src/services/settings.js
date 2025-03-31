import { axiosInstance } from '../apicalls';

/**
 * Get all public settings
 * @returns {Promise<Object>} The public settings
 */
export const getPublicSettings = async () => {
  try {
    const response = await axiosInstance.get('/api/settings/public');
    return response.data;
  } catch (error) {
    console.error('Error fetching public settings:', error);
    // Return default settings as fallback
    return {
      appName: 'Quiz Application',
      defaultTheme: 'light',
      allowRegistration: true
    };
  }
};

/**
 * Get settings by category
 * @param {string} category - The settings category
 * @returns {Promise<Object>} The settings for the specified category
 */
export const getSettingsByCategory = async (category) => {
  try {
    const response = await axiosInstance.get(`/api/settings/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} settings:`, error);
    
    // Return default settings based on category
    if (category === 'theme') {
      return {
        primaryColor: '#1890ff',
        secondaryColor: '#52c41a',
        textColor: '#000000',
        backgroundColor: '#ffffff',
        mode: 'light'
      };
    }
    
    // Return empty object for other categories
    return {};
  }
};

/**
 * Update settings
 * @param {Object} settingsData - The settings data to update
 * @returns {Promise<Object>} The updated settings
 */
export const updateSettings = async (settingsData) => {
  try {
    const response = await axiosInstance.put('/api/settings', settingsData);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};
