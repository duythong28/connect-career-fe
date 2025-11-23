import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createCandidateReport } from "@/api/endpoints/reports.api";

import {
  CreateReportDto,
  JobReportReason,
  OrganizationReportReason,
  RefundReportReason,
  ReportEntityType,
  UserReportReason,
} from "@/api/types/reports.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Flag } from "lucide-react";

interface ReportDialogProps {
  entityId: string;
  entityType: ReportEntityType;
  className?: string;
}

const reasonOptionsMap: Record<
  ReportEntityType,
  { value: string; label: string }[]
> = {
  user: [
    {
      value: UserReportReason.INAPPROPRIATE_BEHAVIOR,
      label: "Inappropriate Behavior",
    },
    { value: UserReportReason.SPAM, label: "Spam" },
    { value: UserReportReason.FAKE_ACCOUNT, label: "Fake Account" },
    { value: UserReportReason.HARASSMENT, label: "Harassment" },
    { value: UserReportReason.IMPERSONATION, label: "Impersonation" },
    { value: UserReportReason.FRAUD, label: "Fraud" },
    { value: UserReportReason.OTHER, label: "Other" },
  ],
  organization: [
    { value: OrganizationReportReason.FAKE_COMPANY, label: "Fake Company" },
    { value: OrganizationReportReason.SCAM, label: "Scam" },
    {
      value: OrganizationReportReason.INAPPROPRIATE_CONTENT,
      label: "Inappropriate Content",
    },
    {
      value: OrganizationReportReason.MISLEADING_INFO,
      label: "Misleading Info",
    },
    { value: OrganizationReportReason.OTHER, label: "Other" },
  ],
  job: [
    { value: JobReportReason.FAKE_JOB, label: "Fake Job" },
    { value: JobReportReason.SCAM, label: "Scam" },
    {
      value: JobReportReason.MISLEADING_DESCRIPTION,
      label: "Misleading Description",
    },
    { value: JobReportReason.DISCRIMINATORY, label: "Discriminatory" },
    { value: JobReportReason.DUPLICATE, label: "Duplicate" },
    { value: JobReportReason.EXPIRED, label: "Expired" },
    { value: JobReportReason.OTHER, label: "Other" },
  ],
  refund: [
    { value: RefundReportReason.FRAUD, label: "Fraud" },
    { value: RefundReportReason.MISLEADING_INFO, label: "Misleading Info" },
    { value: RefundReportReason.WRONG_AMOUNT, label: "Wrong Amount" },
    { value: RefundReportReason.WRONG_CURRENCY, label: "Wrong Currency" },
    {
      value: RefundReportReason.WRONG_PAYMENT_METHOD,
      label: "Wrong Payment Method",
    },
    {
      value: RefundReportReason.WRONG_PAYMENT_STATUS,
      label: "Wrong Payment Status",
    },
    {
      value: RefundReportReason.WRONG_PAYMENT_DATE,
      label: "Wrong Payment Date",
    },
    {
      value: RefundReportReason.WRONG_PAYMENT_TIME,
      label: "Wrong Payment Time",
    },
    { value: RefundReportReason.OTHER, label: "Other" },
  ],
};

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const ReportDialog = ({
  entityId,
  entityType,
  className,
}: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [subject, setSubject] = useState("");
  const reasonOptions = reasonOptionsMap[entityType];

  const createReportMutation = useMutation({
    mutationFn: (data: CreateReportDto) => {
      return createCandidateReport(data);
    },
    onSuccess: () => {
      toast({ title: "Report submitted successfully" });
      setOpen(false);
      setReason("");
      setDescription("");
    },
    onError: () => {
      toast({ title: "Failed to submit report", variant: "destructive" });
    },
  });
  const handleSubmit = () => {
    if (!reason || !subject || !description) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    createReportMutation.mutate({
      entityType,
      entityId,
      reason,
      subject,
      description,
      priority,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          title="Report"
        >
          <Flag className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Report {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary (e.g. Fake job posting detected)"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about your report..."
              rows={5}
            />
          </div>
          <div>
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createReportMutation.isPending}
          >
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
