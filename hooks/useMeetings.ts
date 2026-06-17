"use client";

import { useQuery } from "@tanstack/react-query";

import { getMeeting, getMeetings } from "@/services/meeting.service";

export function useMeetings() {
  return useQuery({
    queryKey: ["meetings"],

    queryFn: getMeetings,
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ["meeting", id],

    queryFn: () => getMeeting(id),

    enabled: !!id,
  });
}
