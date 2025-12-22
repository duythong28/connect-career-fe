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
import { recruiterRejectOffer } from "@/api/endpoints/offers.api";

export default function RejectOfferDialog({
    open,
    onOpenChange,
    applicationId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicationId: string;
}) {
    const queryClient = useQueryClient();

    const { mutate: rejectOfferMutate } = useMutation({
        mutationFn: ({
            applicationId,
            reason,
        }: {
            applicationId: string;
            reason?: string;
        }) => recruiterRejectOffer(applicationId, reason),
        onSuccess: () => {
            toast.success("Offer rejected by recruiter");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["applications", applicationId],
            });
        },
        onError: () => {
            toast.error("Failed to reject offer");
        },
    });

    const handleConfirm = () => {
        rejectOfferMutate({
            applicationId: applicationId,
            reason: "Rejected candidate's counter offer",
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {/* Main Container: rounded-3xl, bg-card, border-border */}
            <AlertDialogContent className="bg-card border-border rounded-3xl shadow-lg">
                <AlertDialogHeader>
                    {/* Subheader: text-xl font-bold text-destructive */}
                    <AlertDialogTitle className="text-xl font-bold text-destructive">
                        Reject Candidate's Offer?
                    </AlertDialogTitle>
                    {/* Metadata/Description: text-sm text-muted-foreground */}
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        Are you sure you want to **reject** this counter offer from the candidate? This action cannot be undone. You can also choose to *counter* the offer instead.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <AlertDialogFooter className="gap-3 mt-4">
                    {/* Secondary Action: variant="outline", h-9, rounded-xl */}
                    <AlertDialogCancel 
                        className="h-9 rounded-xl border-border font-bold text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                        Cancel
                    </AlertDialogCancel>
                    
                    {/* Destructive Primary Action: h-9, rounded-xl */}
                    <AlertDialogAction 
                        onClick={handleConfirm} 
                        className="h-9 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90 transition-all"
                    >
                        Reject
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}