import type { User } from "@/app/types/user";
import api from "@/lib/api";

type SignupData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  user?: User;
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", data);

  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);

  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");

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
