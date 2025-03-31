import { axiosInstance } from ".";

// Deck Operations
export const createDeck = async (payload) => {
  try {
    const response = await axiosInstance.post("/decks/create", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getUserDecks = async (userId) => {
  try {
    const response = await axiosInstance.get(`/decks/user/${userId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateDeck = async (deckId, payload) => {
  try {
    const response = await axiosInstance.put(`/decks/${deckId}`, payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteDeck = async (deckId) => {
  try {
    const response = await axiosInstance.delete(`/decks/${deckId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const shareDeck = async (deckId, payload) => {
  try {
    const response = await axiosInstance.post(`/decks/${deckId}/share`, payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getDeckStats = async (deckId) => {
  try {
    const response = await axiosInstance.get(`/decks/${deckId}/stats`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getDeckSchedule = async (deckId) => {
  try {
    const response = await axiosInstance.get(`/decks/${deckId}/schedule`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Flashcard Operations
export const createFlashcard = async (payload) => {
  try {
    const response = await axiosInstance.post("/flashcards/create", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getDeckFlashcards = async (deckId) => {
  try {
    const response = await axiosInstance.get(`/flashcards/deck/${deckId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateFlashcard = async (cardId, payload) => {
  try {
    const response = await axiosInstance.put(`/flashcards/${cardId}`, payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteFlashcard = async (cardId) => {
  try {
    const response = await axiosInstance.delete(`/flashcards/${cardId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const reviewFlashcard = async (cardId, payload) => {
  try {
    const response = await axiosInstance.post(`/flashcards/${cardId}/review`, payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getDueCards = async () => {
  try {
    const response = await axiosInstance.get("/flashcards/due");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const reorderFlashcards = async (payload) => {
  try {
    const response = await axiosInstance.post("/flashcards/reorder", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
