import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    OfferResponse,
    OfferUpdateDto,
    SalaryPeriod,
} from "@/api/types/offers.types";
import { updateOffer } from "@/api/endpoints/offers.api";

// Assuming RecruiterDialog is a helper wrapper for consistent UI
const RecruiterDialog = ({ open, onOpenChange, title, children, onConfirm, confirmText }) => open ? (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="font-bold text-lg">{title}</div>
                <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">X</button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">{children}</div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-xl">
                <button onClick={() => onOpenChange(false)} className="px-6 py-2.5 border rounded-lg text-gray-600 font-bold text-sm">Cancel</button>
                <button onClick={onConfirm} className="px-8 py-2.5 bg-[#0EA5E9] text-white rounded-lg font-bold text-sm">{confirmText}</button>
            </div>
        </div>
    </div>
) : null;


export default function EditOfferDialog({
    open,
    onOpenChange,
    offer,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    offer: OfferResponse | null;
}) {
    const queryClient = useQueryClient();
    const [offerBaseSalary, setOfferBaseSalary] = useState("");
    const [offerCurrency, setOfferCurrency] = useState("VND");
    const [offerSalaryPeriod, setOfferSalaryPeriod] = useState<SalaryPeriod>(
        SalaryPeriod.YEARLY
    );
    const [offerSigningBonus, setOfferSigningBonus] = useState("");
    const [offerNotes, setOfferNotes] = useState("");
    const [offerIsNegotiable, setOfferIsNegotiable] = useState(false);

    useEffect(() => {
        if (offer) {
            setOfferBaseSalary(offer.baseSalary.toString());
            setOfferCurrency(offer.currency);
            setOfferSalaryPeriod(
                (offer.salaryPeriod as SalaryPeriod) || SalaryPeriod.YEARLY
            );
            setOfferSigningBonus(offer.signingBonus?.toString() || "");
            setOfferNotes(offer.notes || "");
            setOfferIsNegotiable(offer.isNegotiable || false);
        }
    }, [offer]);

    const { mutate: updateOfferMutate } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: OfferUpdateDto }) =>
            updateOffer(id, data),
        onSuccess: () => {
            toast.success("Offer updated successfully");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["applications", offer?.applicationId],
            });
        },
        onError: () => {
            toast.error("Failed to update offer");
        },
    });

    function handleUpdateOffer() {
        if (!offer || !offerBaseSalary || !offerCurrency) {
            toast.error("Please fill in required fields");
            return;
        }
        const data: OfferUpdateDto = {
            baseSalary: parseFloat(offerBaseSalary),
            currency: offerCurrency,
            salaryPeriod: offerSalaryPeriod,
            signingBonus: offerSigningBonus ? parseFloat(offerSigningBonus) : null,
            notes: offerNotes || null,
            isNegotiable: offerIsNegotiable,
        };
        updateOfferMutate({ id: offer.id, data });
    }

    return (
        <RecruiterDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Offer"
            onConfirm={handleUpdateOffer}
            confirmText="Update Offer"
        >
            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase">Base Salary *</Label>
                        <Input
                            type="number"
                            placeholder="70000000"
                            value={offerBaseSalary}
                            onChange={(e) => setOfferBaseSalary(e.target.value)}
                            className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase">Currency *</Label>
                        <select
                            value={offerCurrency}
                            onChange={(e) => setOfferCurrency(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="VND">VND</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Salary Period</Label>
                    <select
                        value={offerSalaryPeriod}
                        onChange={(e) => setOfferSalaryPeriod(e.target.value as SalaryPeriod)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value={SalaryPeriod.YEARLY}>Yearly</option>
                        <option value={SalaryPeriod.MONTHLY}>Monthly</option>
                        <option value={SalaryPeriod.WEEKLY}>Weekly</option>
                        <option value={SalaryPeriod.DAILY}>Daily</option>
                        <option value={SalaryPeriod.HOURLY}>Hourly</option>
                        <option value={SalaryPeriod.PROJECT}>Project</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Signing Bonus</Label>
                    <Input
                        type="number"
                        placeholder="10000000"
                        value={offerSigningBonus}
                        onChange={(e) => setOfferSigningBonus(e.target.value)}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Notes</Label>
                    <Textarea
                        placeholder="Additional offer details..."
                        value={offerNotes}
                        onChange={(e) => setOfferNotes(e.target.value)}
                        rows={2}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="checkbox"
                        id="negotiable-edit"
                        checked={offerIsNegotiable}
                        onChange={(e) => setOfferIsNegotiable(e.target.checked)}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="negotiable-edit" className="text-sm text-gray-700 font-medium">Negotiable</Label>
                </div>
            </div>
        </RecruiterDialog>
    );
}