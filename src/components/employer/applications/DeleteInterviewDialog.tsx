import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InterviewResponse,
} from "@/api/types/interviews.types";
import {
  deleteInterview,
} from "@/api/endpoints/interviews.api";


export default function DeleteInterviewDialog({
  open,
  onOpenChange,
  interview,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: InterviewResponse | null;
}) {
  const queryClient = useQueryClient();

  const { mutate: deleteInterviewMutate } = useMutation({
    mutationFn: (id: string) => deleteInterview(id),
    onSuccess: () => {
      toast.success("Interview deleted");
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["applications", interview?.applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to delete interview");
    },
  });

  function confirmDeleteInterview() {
    if (interview) {
      deleteInterviewMutate(interview.id);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Interview</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this interview? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDeleteInterview}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}