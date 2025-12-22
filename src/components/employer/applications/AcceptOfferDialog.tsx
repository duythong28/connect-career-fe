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
import { recruiterAcceptOffer } from "@/api/endpoints/offers.api";

export default function AcceptOfferDialog({
  open,
  onOpenChange,
  applicationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate: acceptOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      notes,
    }: {
      applicationId: string;
      notes?: string;
    }) => recruiterAcceptOffer(applicationId, notes),
    onSuccess: () => {
      toast.success("Offer accepted by recruiter");
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to accept offer");
    },
  });

  const handleConfirm = () => {
    acceptOfferMutate({
      applicationId: applicationId,
      notes: "Accepted candidate's counter offer",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border rounded-3xl shadow-lg">
        <AlertDialogHeader>
          {/* Subheader: text-xl font-bold text-foreground */}
          <AlertDialogTitle className="text-xl font-bold text-foreground">
            Accept Candidate's Offer?
          </AlertDialogTitle>
          {/* Description: text-sm text-muted-foreground */}
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to accept this **counter offer** from the candidate? This action will mark the offer as accepted and move the application forward.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 mt-4">
          {/* Secondary Action: variant="outline", h-9, rounded-xl */}
          <AlertDialogCancel className="h-9 rounded-xl border-border font-bold text-xs text-muted-foreground hover:bg-accent transition-all">
            Cancel
          </AlertDialogCancel>
          {/* Primary Action: bg-primary (Solid Blue), h-9, rounded-xl */}
          <AlertDialogAction
            onClick={handleConfirm}
            className="h-9 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all"
          >
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}