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
import {
  recruiterCancelOffer,
  recruiterRejectOffer,
} from "@/api/endpoints/offers.api";

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

  const { mutate: rejectOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      reason,
    }: {
      applicationId: string;
      reason?: string;
    }) => recruiterRejectOffer(applicationId, reason),
    onSuccess: () => {
      cancelOfferMutate({
        offerId: offer.id,
        reason: "Cancelled by recruiter",
      });
    },
    onError: () => {
      toast.error("Failed to cancel offer");
    },
  });

  const { mutate: cancelOfferMutate } = useMutation({
    mutationFn: ({ offerId, reason }: { offerId: string; reason?: string }) =>
      recruiterCancelOffer(offerId, reason),
    onSuccess: () => {
      toast.success("Offer cancelled");
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
        applicationId: offer?.applicationId,
        reason: "Offer rejected by recruiter to cancel",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Offer?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this offer? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Cancel Offer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
