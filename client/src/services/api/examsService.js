import apiClient from './client';

/**
 * Exams API Service
 * Contains all API calls related to exams functionality
 */

/**
 * Get all exams 
 */
export const getAllExams = async () => {
  return await apiClient.post('/exams/get-all-exams');
};

/**
 * Get exam by ID
 */
export const getExamById = async (examId) => {
  return await apiClient.post('/exams/get-exam-by-id', { examId });
};

/**
 * Add new exam
 */
export const addExam = async (examData) => {
  return await apiClient.post('/exams/add', examData);
};

/**
 * Edit existing exam
 */
export const editExam = async (examData) => {
  return await apiClient.post('/exams/edit-exam-by-id', examData);
};

/**
 * Delete exam by ID
 */
export const deleteExam = async (examId) => {
  return await apiClient.post('/exams/delete-exam-by-id', { examId });
};

/**
 * Add question to exam
 */
export const addQuestionToExam = async (questionData) => {
  return await apiClient.post('/exams/add-question-to-exam', questionData);
};

/**
 * Edit question in exam
 */
export const editQuestionInExam = async (questionData) => {
  return await apiClient.post('/exams/edit-question-in-exam', questionData);
};

/**
 * Delete question in exam
 */
export const deleteQuestionInExam = async (questionId, examId) => {
  return await apiClient.post('/exams/delete-question-in-exam', { questionId, examId });
};

/**
 * Register for exam
 */
export const registerExam = async (examId, userId, email) => {
  return await apiClient.post('/exams/register-exam', { examId, userId, email });
};

/**
 * Check exam registration status
 */
export const checkExamRegistration = async (examId, userId) => {
  return await apiClient.post('/exams/check-registration', { examId, userId });
};

/**
 * Regenerate exam token
 */
export const regenerateExamToken = async (examId) => {
  return await apiClient.post('/exams/regenerate-exam-token', { examId });
};