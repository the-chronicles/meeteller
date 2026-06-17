"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMeeting } from "@/services/meeting.service";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

export function useDeleteMeeting() {
  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation({
    mutationFn: deleteMeeting,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["meetings"],
      });

      queryClient.removeQueries({
        queryKey: ["meeting", String(id)],
      });

      toast.success("Meeting deleted successfully.");

      router.push("/meetings");
    },

    onError: () => {
      toast.error("Unable to delete meeting.");
    },
  });
}
