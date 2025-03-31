/**
 * Question Types Constants
 * Defines all the question types supported in the application
 */

export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  TRUE_FALSE: 'TRUE_FALSE',
  SHORT_ANSWER: 'SHORT_ANSWER',
  LONG_ANSWER: 'LONG_ANSWER',
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.SINGLE_CHOICE]: 'Single Choice',
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QUESTION_TYPES.TRUE_FALSE]: 'True/False',
  [QUESTION_TYPES.SHORT_ANSWER]: 'Short Answer',
  [QUESTION_TYPES.LONG_ANSWER]: 'Long Answer',
};

export const QUESTION_TYPE_DESCRIPTIONS = {
  [QUESTION_TYPES.SINGLE_CHOICE]: 'Select one option from a list of choices',
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Select multiple options from a list of choices',
  [QUESTION_TYPES.TRUE_FALSE]: 'Choose between True or False',
  [QUESTION_TYPES.SHORT_ANSWER]: 'Answer with a short text response',
  [QUESTION_TYPES.LONG_ANSWER]: 'Answer with a detailed text response',
};