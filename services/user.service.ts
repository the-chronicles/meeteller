import type { User } from "@/app/types/user";
import api from "@/lib/api";

export type UpdateProfileData = Partial<
  Pick<User, "name" | "bio" | "timezone" | "picture" | "onboardingCompleted">
>;

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");

  return response.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await api.patch<User>("/users/me", data);

  return response.data;
};
