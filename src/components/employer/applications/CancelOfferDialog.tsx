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
import { OfferResponse } from "@/api/types/offers.types";
import { recruiterCancelOffer, recruiterRejectOffer } from "@/api/endpoints/offers.api";

export default function CancelOfferDialog({
    open,
    onOpenChange,
    offer,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    offer: OfferResponse | null;
}) {
    const queryClient = useQueryClient();

    // Step 1: Reject the current application stage (if in offer stage)
    const { mutate: rejectOfferMutate } = useMutation({
        mutationFn: ({
            applicationId,
            reason,
        }: {
            applicationId: string;
            reason?: string;
        }) => recruiterRejectOffer(applicationId, reason),
        onSuccess: () => {
            if (offer) {
                // Step 2: Cancel the offer itself
                cancelOfferMutate({
                    offerId: offer.id,
                    reason: "Cancelled by recruiter",
                });
            }
        },
        onError: () => {
            toast.error("Failed to prepare offer cancellation (stage update failed)");
        },
    });

    // Step 2 Mutation
    const { mutate: cancelOfferMutate } = useMutation({
        mutationFn: ({ offerId, reason }: { offerId: string; reason?: string }) =>
            recruiterCancelOffer(offerId, reason),
        onSuccess: () => {
            toast.success("Offer successfully cancelled");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["applications", offer?.applicationId],
            });
        },
        onError: () => {
            toast.error("Failed to cancel offer");
        },
    });

    const handleConfirm = () => {
        if (offer) {
            rejectOfferMutate({
                applicationId: offer.applicationId,
                reason: "Offer cancelled by recruiter",
            });
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-card border-border rounded-3xl shadow-lg">
                <AlertDialogHeader>
                    {/* Subheader style for dialog titles */}
                    <AlertDialogTitle className="text-xl font-bold text-destructive">
                        Cancel Offer?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        Are you sure you want to **cancel** this pending offer? This action is highly discouraged and cannot be undone. Canceling the offer will typically move the candidate back to a previous stage or to rejected.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 mt-4">
                    <AlertDialogCancel 
                        className="h-9 rounded-xl border-border font-bold text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                        Back
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleConfirm} 
                        className="h-9 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90 transition-all"
                    >
                        Cancel Offer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}