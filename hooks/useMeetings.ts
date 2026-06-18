"use client";

import { useQuery } from "@tanstack/react-query";

import { getMeeting, getMeetings, getMeetingInsights, getMeetingTranscript } from "@/services/meeting.service";

export function useMeetings() {
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");
  return useQuery({
    queryKey: ["meetings"],

    queryFn: getMeetings,

    enabled: hasToken,
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ["meeting", id],

    queryFn: () => getMeeting(id),

    enabled: !!id,
  });
}

export function useMeetingInsights(id: string) {
  return useQuery({
    queryKey: ["meeting-insights", id],

    queryFn: () => getMeetingInsights(id),

    enabled: !!id,
  });
}

export function useMeetingTranscript(id: string) {
  return useQuery({
    queryKey: ["meeting-transcript", id],

    queryFn: () => getMeetingTranscript(id),

    enabled: !!id,
  });
}
