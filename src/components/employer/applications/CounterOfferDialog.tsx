import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OfferCreateDto, SalaryPeriod } from "@/api/types/offers.types";
import { createOffer, recruiterRejectOffer } from "@/api/endpoints/offers.api";

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


export default function CounterOfferDialog({
    open,
    onOpenChange,
    applicationId,
    userId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicationId: string;
    userId: string;
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

    function resetOfferForm() {
        setOfferBaseSalary("");
        setOfferCurrency("VND");
        setOfferSalaryPeriod(SalaryPeriod.YEARLY);
        setOfferSigningBonus("");
        setOfferNotes("");
        setOfferIsNegotiable(false);
    }

    const { mutate: rejectOfferMutate } = useMutation({
        mutationFn: ({
            applicationId,
            reason,
        }: {
            applicationId: string;
            reason?: string;
        }) => recruiterRejectOffer(applicationId, reason),
        onSuccess: () => {
            const data: OfferCreateDto = {
                baseSalary: parseFloat(offerBaseSalary),
                currency: offerCurrency,
                salaryPeriod: offerSalaryPeriod,
                signingBonus: offerSigningBonus ? parseFloat(offerSigningBonus) : null,
                notes: offerNotes || null,
                offeredBy: userId,
                isNegotiable: offerIsNegotiable,
            };
            createOfferMutate({ applicationId: applicationId, data });
        },
        onError: () => {
            toast.error("Failed to send counter offer");
        },
    });

    const { mutate: createOfferMutate } = useMutation({
        mutationFn: ({
            applicationId,
            data,
        }: {
            applicationId: string;
            data: OfferCreateDto;
        }) => createOffer(applicationId, data),
        onSuccess: () => {
            toast.success("Counter offer sent successfully");
            onOpenChange(false);
            resetOfferForm();
            queryClient.invalidateQueries({
                queryKey: ["applications", applicationId],
            });
        },
        onError: () => {
            toast.error("Failed to send counter offer");
        },
    });

    function handleSendCounterOffer() {
        if (!offerBaseSalary || !offerCurrency) {
            toast.error("Please fill in required fields");
            return;
        }
        // Step 1: Reject the candidate's pending offer (if any)
        // This is a necessary business logic step before issuing a new offer
        rejectOfferMutate({
            applicationId: applicationId,
            reason: "Recruiter countered candidate's offer",
        });
    }

    return (
        <RecruiterDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Counter Candidate's Offer"
            onConfirm={handleSendCounterOffer}
            confirmText="Send Counter Offer"
        >
            <div className="space-y-5">
                 <p className="text-sm text-gray-600">Propose a new offer in response to the candidate's counter offer.</p>
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
                            <option value="EUR">EUR</option>
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
                        id="negotiable-counter"
                        checked={offerIsNegotiable}
                        onChange={(e) => setOfferIsNegotiable(e.target.checked)}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="negotiable-counter" className="text-sm font-medium text-gray-700">Negotiable</Label>
                </div>
            </div>
        </RecruiterDialog>
    );
}