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
import { InterviewResponse } from "@/api/types/interviews.types";
import { deleteInterview } from "@/api/endpoints/interviews.api";

// This dialog uses native AlertDialog from shadcn/ui but we wrap it for completeness.

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
            <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">Delete Interview</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        Are you sure you want to delete the interview with <span className="font-semibold text-gray-900">{interview?.interviewerName}</span> scheduled for <span className="font-semibold text-gray-900">{interview?.scheduledDate ? new Date(interview.scheduledDate).toLocaleString() : 'N/A'}</span>? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-bold border-gray-300 hover:bg-gray-100">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDeleteInterview} className="bg-red-600 text-white font-bold hover:bg-red-700">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}