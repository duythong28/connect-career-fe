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
import { AlertTriangle, Flag, ShieldAlert } from "lucide-react";

interface ReportDialogProps {
  entityId: string;
  entityType: ReportEntityType;
  trigger?: React.ReactNode; // Flexible trigger
  className?: string;
}

const reasonOptionsMap: Record<
  ReportEntityType,
  { value: string; label: string }[]
> = {
  user: [
    { value: UserReportReason.INAPPROPRIATE_BEHAVIOR, label: "Inappropriate Behavior" },
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
    { value: OrganizationReportReason.INAPPROPRIATE_CONTENT, label: "Inappropriate Content" },
    { value: OrganizationReportReason.MISLEADING_INFO, label: "Misleading Info" },
    { value: OrganizationReportReason.OTHER, label: "Other" },
  ],
  job: [
    { value: JobReportReason.FAKE_JOB, label: "Fake Job" },
    { value: JobReportReason.SCAM, label: "Scam" },
    { value: JobReportReason.MISLEADING_DESCRIPTION, label: "Misleading Description" },
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
    { value: RefundReportReason.WRONG_PAYMENT_METHOD, label: "Wrong Payment Method" },
    { value: RefundReportReason.WRONG_PAYMENT_STATUS, label: "Wrong Payment Status" },
    { value: RefundReportReason.WRONG_PAYMENT_DATE, label: "Wrong Payment Date" },
    { value: RefundReportReason.WRONG_PAYMENT_TIME, label: "Wrong Payment Time" },
    { value: RefundReportReason.OTHER, label: "Other" },
  ],
};

const priorityOptions = [
  { value: "low", label: "Low Priority", color: "bg-gray-500" },
  { value: "medium", label: "Medium Priority", color: "bg-yellow-500" },
  { value: "high", label: "High Priority", color: "bg-red-500" },
];

const ReportDialog = ({
  entityId,
  entityType,
  trigger,
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
      toast({ title: "Report submitted", description: "We will review your report shortly." });
      setOpen(false);
      setReason("");
      setDescription("");
      setSubject("");
    },
    onError: () => {
      toast({ title: "Failed to submit report", variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!reason || !subject || !description) {
      toast({
        title: "Missing Information",
        description: "Please provide a reason, subject, and description.",
        variant: "destructive",
      });
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
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={className}
            title={`Report ${entityType}`}
          >
            <Flag className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md bg-white rounded-xl shadow-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-gray-100 bg-white">
          <DialogTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
            <div className="p-2 bg-red-50 text-red-500 rounded-lg">
              <ShieldAlert className="h-5 w-5" />
            </div>
            Report {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1 ml-11">
            Help us maintain a safe community. Your report is anonymous.
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <Label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Reason <span className="text-red-500">*</span></Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
            <Label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Subject <span className="text-red-500">*</span></Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Description <span className="text-red-500">*</span></Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide specific details..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Priority</Label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                        {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="px-5 py-2 border border-gray-200 rounded-lg text-gray-600 font-bold text-sm hover:bg-white h-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createReportMutation.isPending}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-sm h-auto transition-colors"
          >
            {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;