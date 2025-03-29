const { default: axiosInstance } = require(".");

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

// Check if user is registered for an exam
export const checkExamRegistration = async (payload) => {
  try {
    const response = await axiosInstance.post("/exams/check-registration", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || { 
      success: false, 
      message: "Failed to check registration status" 
    };
  }
};
