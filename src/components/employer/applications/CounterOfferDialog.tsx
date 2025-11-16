import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OfferCreateDto, SalaryPeriod } from "@/api/types/offers.types";
import { createOffer, recruiterRejectOffer } from "@/api/endpoints/offers.api";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      reason: "Offer rejected by recruiter to counter",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Counter Candidate's Offer</DialogTitle>
          <DialogDescription>
            Propose a new offer in response to the candidate's counter offer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Base Salary *</Label>
            <Input
              type="number"
              placeholder="70000000"
              value={offerBaseSalary}
              onChange={(e) => setOfferBaseSalary(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Currency *</Label>
            <Select value={offerCurrency} onValueChange={setOfferCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VND">VND</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Salary Period</Label>
            <Select
              value={offerSalaryPeriod}
              onValueChange={(value) =>
                setOfferSalaryPeriod(value as SalaryPeriod)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SalaryPeriod.YEARLY}>Yearly</SelectItem>
                <SelectItem value={SalaryPeriod.MONTHLY}>Monthly</SelectItem>
                <SelectItem value={SalaryPeriod.WEEKLY}>Weekly</SelectItem>
                <SelectItem value={SalaryPeriod.DAILY}>Daily</SelectItem>
                <SelectItem value={SalaryPeriod.HOURLY}>Hourly</SelectItem>
                <SelectItem value={SalaryPeriod.PROJECT}>Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Signing Bonus</Label>
            <Input
              type="number"
              placeholder="10000000"
              value={offerSigningBonus}
              onChange={(e) => setOfferSigningBonus(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Additional offer details..."
              value={offerNotes}
              onChange={(e) => setOfferNotes(e.target.value)}
              rows={2}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="negotiable-counter"
              checked={offerIsNegotiable}
              onChange={(e) => setOfferIsNegotiable(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="negotiable-counter">Negotiable</Label>
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={handleSendCounterOffer}>
              Send Counter Offer
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
