import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// ━━━ AUTH ENDPOINTS ━━━
export const authAPI = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),
  register: (name, email, password, bio = "") =>
    api.post("/auth/register", { name, email, password, bio }),
  getMe: () => api.get("/auth/me"),
  updateProfile: (name, email, bio) =>
    api.put("/auth/update-profile", { name, email, bio }),
};

// ━━━ RECIPE ENDPOINTS ━━━
export const recipeAPI = {
  suggestRecipes: (ingredients) =>
    api.post("/recipes/suggest", { ingredients }),
  getRecipeById: (id) => api.get(`/recipes/${id}`),
};

// ━━━ CHEF ENDPOINTS ━━━
export const chefAPI = {
  getMyRecipes: () => api.get("/chef/my-recipes"),
  addRecipe: (formData) =>
    api.post("/chef/recipes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  editRecipe: (id, formData) =>
    api.put(`/chef/recipes/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteRecipe: (id) => api.delete(`/chef/recipes/${id}`),
};

// ━━━ ADMIN ENDPOINTS ━━━
export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),
  getAllRecipes: (page = 1, limit = 20, search = "") =>
    api.get("/admin/recipes", { params: { page, limit, search } }),
  deleteRecipe: (id) => api.delete(`/admin/recipes/${id}`),
  getChefs: (page = 1, limit = 20, search = "") =>
    api.get("/admin/chefs", { params: { page, limit, search } }),
  deleteChef: (id) => api.delete(`/admin/chefs/${id}`),
  toggleChefStatus: (id) => api.patch(`/admin/chefs/${id}/toggle-status`),
};

export default api;
