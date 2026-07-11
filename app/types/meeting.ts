export type MeetingStatus = "scheduled" | "live" | "processing" | "completed";

export interface MeetingOwner {
  id: number;

  email: string;

  name?: string;

  picture?: string;

  role: string;
}

export interface Meeting {
  id: number;

  title: string;

  description?: string;

  status: MeetingStatus;

  startedAt?: string | null;

  endedAt?: string | null;

  isRecording: boolean;

  isLive: boolean;

  owner: MeetingOwner;

  createdAt: string;

  updatedAt: string;

  meetingType?: string;
  externalMeetingUrl?: string;
  externalMeetingId?: string;
  providerMetadata?: string;

  insights?: {
    id: number;
    summary: string;
    actionItems: string[];
    keyDecisions: string[];
    suggestedTitle?: string;
    tags?: string[];
  } | null;
}
