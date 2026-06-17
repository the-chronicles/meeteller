"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMeeting } from "@/services/meeting.service";

import { toast } from "sonner";

export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMeeting,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meetings"],
      });

      toast.success("Meeting created successfully.");
    },

    onError: () => {
      toast.error("Unable to create meeting.");
    },
  });
}
