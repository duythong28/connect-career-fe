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

// Refactored to align with the CareerHub Design System
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
            {/* 4. Radii: Main Container uses rounded-3xl. Shadows: No custom box-shadows added. */}
            <AlertDialogContent className="bg-card border-border rounded-3xl shadow-lg">
                <AlertDialogHeader>
                    {/* 1. Typography: text-xl font-bold for subheaders. text-foreground color variable. */}
                    <AlertDialogTitle className="text-xl font-bold text-foreground">
                        Delete Interview
                    </AlertDialogTitle>
                    
                    {/* 1. Color Variables: text-muted-foreground. 5. Copywriting: Preserved exact text. */}
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        Are you sure you want to delete the interview with{" "}
                        <span className="font-semibold text-foreground">
                            {interview?.interviewerName}
                        </span>{" "}
                        scheduled for{" "}
                        <span className="font-semibold text-foreground">
                            {interview?.scheduledDate 
                                ? new Date(interview.scheduledDate).toLocaleString() 
                                : 'N/A'}
                        </span>? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* 2. Button Hierarchy: Secondary Actions use outline. h-9 size. rounded-xl radius for inner items. */}
                <AlertDialogFooter className="gap-2 sm:gap-3">
                    <AlertDialogCancel 
                        className="h-9 rounded-xl font-bold border-border text-muted-foreground hover:bg-accent transition-all duration-200"
                    >
                        Cancel
                    </AlertDialogCancel>
                    
                    {/* 2. Button Hierarchy: Standard Primary Actions use solid background. h-9 size. */}
                    <AlertDialogAction 
                        onClick={confirmDeleteInterview} 
                        className="h-9 rounded-xl bg-destructive text-destructive-foreground font-bold hover:bg-destructive/90 transition-all duration-200"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}