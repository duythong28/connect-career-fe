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
            <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-green-700">Accept Candidate's Offer?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        Are you sure you want to accept this **counter offer** from the candidate? This action will mark the offer as accepted and move the application forward.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-bold border-gray-300 hover:bg-gray-100">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} className="bg-green-600 text-white font-bold hover:bg-green-700">Accept</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}