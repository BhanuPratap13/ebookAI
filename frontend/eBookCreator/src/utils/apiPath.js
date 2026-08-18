const BASE_URL = "http://localhost:8000";

export const API_BASE_URL = BASE_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GET_PROFILE: `${BASE_URL}/api/auth/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/auth/profile`,
  },
  BOOKS: {
    GET_ALL: `${BASE_URL}/api/books`,
    GET_BY_ID: (id) => `${BASE_URL}/api/books/${id}`,
    CREATE: `${BASE_URL}/api/books`,
    UPDATE: (id) => `${BASE_URL}/api/books/${id}`,
    DELETE: (id) => `${BASE_URL}/api/books/${id}`,
    UPDATE_COVER: (id) => `${BASE_URL}/api/books/cover/${id}`,
  },
  AI: {
    GENERATE_OUTLINE: `${BASE_URL}/api/ai/generate-outline`,
    GENERATE_CHAPTER: `${BASE_URL}/api/ai/generate-chapter-content`,
    GENERATE_COVER: `${BASE_URL}/api/ai/generate-cover`,
  },
  EXPORT: {
    PDF: (id) => `${BASE_URL}/api/export/${id}/pdf`,
    DOCX: (id) => `${BASE_URL}/api/export/${id}/doc`,
  },
};
