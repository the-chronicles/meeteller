import api from "@/lib/api";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });

  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });

  return response.data;
};
