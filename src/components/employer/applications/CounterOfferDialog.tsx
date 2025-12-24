import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OfferCreateDto, SalaryPeriod } from "@/api/types/offers.types";
import { createOffer, recruiterRejectOffer } from "@/api/endpoints/offers.api";
import { X } from "lucide-react";

/**
 * RecruiterDialog: Standardized Dialog Wrapper for CareerHub Design System.
 * Note: animate-fade-in is omitted for Dialogs per system guidelines.
 */
const RecruiterDialog = ({ open, onOpenChange, title, children, onConfirm, confirmText }) =>
  open ? (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-card">
          <div className="text-xl font-bold text-foreground">{title}</div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-1 bg-card">{children}</div>
        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/30">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl px-6 font-bold text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="h-10 rounded-xl px-8 font-bold text-sm"
          >
            {confirmText}
          </Button>
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
        <p className="text-sm text-muted-foreground">
          Propose a new offer in response to the candidate's counter offer.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Base Salary *
            </Label>
            <Input
              type="number"
              placeholder="70000000"
              value={offerBaseSalary}
              onChange={(e) => setOfferBaseSalary(e.target.value)}
              className="border-border rounded-xl h-10 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Currency *
            </Label>
            <select
              value={offerCurrency}
              onChange={(e) => setOfferCurrency(e.target.value)}
              className="w-full border border-border rounded-xl h-10 px-3 text-sm appearance-none bg-card focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Salary Period
          </Label>
          <select
            value={offerSalaryPeriod}
            onChange={(e) => setOfferSalaryPeriod(e.target.value as SalaryPeriod)}
            className="w-full border border-border rounded-xl h-10 px-3 text-sm appearance-none bg-card focus:ring-2 focus:ring-primary outline-none transition-all"
          >
            <option value={SalaryPeriod.YEARLY}>Yearly</option>
            <option value={SalaryPeriod.MONTHLY}>Monthly</option>
            <option value={SalaryPeriod.WEEKLY}>Weekly</option>
            <option value={SalaryPeriod.DAILY}>Daily</option>
            <option value={SalaryPeriod.HOURLY}>Hourly</option>
            <option value={SalaryPeriod.PROJECT}>Project</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Signing Bonus
          </Label>
          <Input
            type="number"
            placeholder="10000000"
            value={offerSigningBonus}
            onChange={(e) => setOfferSigningBonus(e.target.value)}
            className="border-border rounded-xl h-10 text-sm focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Notes
          </Label>
          <Textarea
            placeholder="Additional offer details..."
            value={offerNotes}
            onChange={(e) => setOfferNotes(e.target.value)}
            rows={2}
            className="border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            id="negotiable-counter"
            checked={offerIsNegotiable}
            onChange={(e) => setOfferIsNegotiable(e.target.checked)}
            className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
          />
          <Label
            htmlFor="negotiable-counter"
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            Negotiable
          </Label>
        </div>
      </div>
    </RecruiterDialog>
  );
}