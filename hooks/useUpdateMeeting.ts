"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMeeting } from "@/services/meeting.service";

import { toast } from "sonner";

export function useUpdateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;

      data: Record<string, unknown>;
    }) => updateMeeting(id, data),

    onSuccess: (updatedMeeting) => {
      queryClient.invalidateQueries({
        queryKey: ["meetings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["meeting", String(updatedMeeting.id)],
      });

      toast.success("Meeting updated successfully.");
    },

    onError: () => {
      toast.error("Unable to update meeting.");
    },
  });
}
