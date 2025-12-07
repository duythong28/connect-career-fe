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
            <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-red-600">Reject Candidate's Offer?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        Are you sure you want to **reject** this counter offer from the candidate? This action cannot be undone. You can also choose to *counter* the offer instead.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-bold border-gray-300 hover:bg-gray-100">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} className="bg-red-600 text-white font-bold hover:bg-red-700">Reject</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}