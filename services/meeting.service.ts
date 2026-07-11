import { Meeting } from "@/app/types/meeting";
import api from "@/lib/api";

export const getMeetings = async (): Promise<Meeting[]> => {
  const response = await api.get("/meetings");

  return response.data;
};

export const getMeeting = async (id: string): Promise<Meeting> => {
  const response = await api.get(`/meetings/${id}`);

  return response.data;
};

export const createMeeting = async (data: {
  title: string;
  description?: string;
  status?: string;
  startedAt?: string;
  endedAt?: string;
  meetingType?: string;
}): Promise<Meeting> => {
  const response = await api.post("/meetings", data);

  return response.data;
};

export const updateMeeting = async (
  id: string,
  data: Partial<Meeting>,
): Promise<Meeting> => {
  const response = await api.patch(`/meetings/${id}`, data);

  return response.data;
};

export const deleteMeeting = async (id: string) => {
  const response = await api.delete(`/meetings/${id}`);

  return response.data;
};

export const getMeetingInsights = async (id: string): Promise<any> => {
  const response = await api.get(`/meetings/${id}/insights`);

  return response.data;
};

export const getMeetingTranscript = async (id: string): Promise<any> => {
  const response = await api.get(`/meetings/${id}/transcript`);

  return response.data;
};

export const syncGoogleCalendar = async (): Promise<any> => {
  const response = await api.get("/integrations/sync");

  return response.data;
};
