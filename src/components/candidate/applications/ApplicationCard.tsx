import { MapPin, Building2, ChevronRight, DollarSign } from "lucide-react";
import {
  Application,
  ApplicationStatus,
  ApplicationStatusLabel,
} from "@/api/types/applications.types";
import { Job } from "@/api/types/jobs.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ApplicationCard({
  application,
  onView,
}: {
  application: Application;
  onView: () => void;
}) {
  const job: Job | undefined = application.job ?? undefined;
  const companyName = job?.companyName || "Company";
  const companyLogo =
    job?.organization?.logoFile?.url || job?.companyLogo || undefined;

  // Helper for status styling to match Design System
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.OFFER:
        return "text-green-700 bg-green-50 border-green-200";
      case ApplicationStatus.REJECTED:
        return "text-destructive bg-destructive/10 border-destructive/20";
      case ApplicationStatus.INTERVIEW:
        return "text-purple-700 bg-purple-50 border-purple-200";
      default:
        return "text-muted-foreground bg-secondary border-border";
    }
  };

  // Salary Label Logic
  const salaryLabel =
    job?.salary ||
    (job?.salaryDetails &&
    (job.salaryDetails.minAmount || job.salaryDetails.maxAmount)
      ? `${
          job.salaryDetails.minAmount
            ? `$${job.salaryDetails.minAmount.toLocaleString()}`
            : ""
        }${
          job.salaryDetails.minAmount && job.salaryDetails.maxAmount
            ? " - "
            : ""
        }${
          job.salaryDetails.maxAmount
            ? `$${job.salaryDetails.maxAmount.toLocaleString()}`
            : ""
        }`
      : null);

  return (
    <div
      onClick={onView}
      className="group bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all cursor-pointer animate-fade-in"
    >
      {/* Left: Logo & Main Info */}
      <div className="flex items-center gap-5 overflow-hidden">
        {/* Logo */}
        <div className="w-14 h-14 flex-shrink-0 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden shadow-sm">
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage src={companyLogo} className="object-contain" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl w-full h-full flex items-center justify-center">
              {companyName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="min-w-0">
          <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors truncate">
            {job?.title || "Unknown Position"}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="font-semibold flex items-center gap-1.5 text-foreground/80">
              <Building2 size={12} /> {companyName}
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> {job?.location || "Remote"}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Salary / Metadata (Hidden on small mobile) */}
      {salaryLabel && (
        <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 whitespace-nowrap">
          <DollarSign size={12} strokeWidth={3} /> {salaryLabel}
        </div>
      )}

      {/* Right: Status & Date */}
      <div className="flex items-center gap-5 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Applied
          </div>
          <div className="text-xs font-semibold text-foreground flex items-center justify-end gap-1">
            {application.appliedDate
              ? new Date(application.appliedDate).toLocaleDateString()
              : "N/A"}
          </div>
        </div>

        {/* Status Pill */}
        <div
          className={`px-4 py-2 rounded-xl border text-xs font-bold capitalize ${getStatusColor(
            application.status
          )} flex items-center justify-center min-w-[90px] shadow-sm`}
        >
          {ApplicationStatusLabel[application.status] || application.status}
        </div>

        <ChevronRight
          size={20}
          className="text-muted-foreground group-hover:text-primary transition-colors"
        />
      </div>
    </div>
  );
}