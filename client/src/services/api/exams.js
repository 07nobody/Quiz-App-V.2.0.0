const { axiosInstance } = require(".");

// add exam

export const addExam = async (payload) => {
  try {
    const response = await axiosInstance.post("/exams/add", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// get all exams
export const getAllExams = async () => {
  try {
    const response = await axiosInstance.post("/exams/get-all-exams");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// get exam by id

export const getExamById = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/exams/get-exam-by-id",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// edit exam by id

export const editExamById = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/exams/edit-exam-by-id",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// delete exam by id

export const deleteExamById = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/exams/delete-exam-by-id",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// add question to exam

export const addQuestionToExam = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/exams/add-question-to-exam",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const editQuestionById = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/exams/edit-question-in-exam",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteQuestionById = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/exams/delete-question-in-exam",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Regenerate exam token
export const regenerateExamToken = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/exams/regenerate-exam-token",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { 
      success: false, 
      message: "Failed to regenerate exam token" 
    };
  }
};

// Register for an exam
export const registerForExam = async (payload) => {
  try {
    const response = await axiosInstance.post("/exams/register-exam", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || { 
      success: false, 
      message: "Failed to register for exam. Please try again." 
    };
  }
};

// Check if user is registered for an exam with caching for better performance
const registrationCache = new Map(); // Cache registration status
const pendingChecks = new Map(); // Track in-progress requests

export const checkExamRegistration = async (payload) => {
  const cacheKey = payload.examId;
  
  // Return cached result if available and not expired (valid for 30 seconds)
  const cachedResult = registrationCache.get(cacheKey);
  if (cachedResult && (Date.now() - cachedResult.timestamp < 30000)) {
    return cachedResult.data;
  }
  
  // Avoid duplicate in-flight requests for the same exam
  if (pendingChecks.has(cacheKey)) {
    return pendingChecks.get(cacheKey);
  }
  
  try {
    // Create the promise and store it
    const promise = axiosInstance.post("/exams/check-registration", payload)
      .then(response => {
        const result = response.data;
        // Cache successful results
        if (result.success) {
          registrationCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
        }
        // Remove from pending checks
        pendingChecks.delete(cacheKey);
        return result;
      })
      .catch(error => {
        // Remove from pending checks on error
        pendingChecks.delete(cacheKey);
        return error.response?.data || { 
          success: false, 
          message: "Failed to check registration status" 
        };
      });
    
    // Store the pending promise
    pendingChecks.set(cacheKey, promise);
    return promise;
  } catch (error) {
    pendingChecks.delete(cacheKey);
    return error.response?.data || { 
      success: false, 
      message: "Failed to check registration status" 
    };
  }
};
