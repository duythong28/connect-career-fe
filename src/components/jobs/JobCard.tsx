import {
  Users,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2 as CheckCircle,
  Heart,
  Globe2,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobType, JobTypeLabel } from "@/api/types/jobs.types";
import ApplyJobDialog from "../candidate/applications/ApplyJobDialog";
import React from "react";
import { Button } from "@/components/ui/button";

export default function JobCard({
  job,
  isApplied,
  isSaved,
  onSave,
  onView,
  onApply,
}: {
  job: any;
  isApplied: boolean;
  isSaved: boolean;
  onSave: () => void;
  onView: () => void;
  onApply: () => void;
}) {
  const companyName = job?.organization?.name || job.companyName || "Unknown";
  const logoInitials =
    (companyName.match(/\b\w/g) || []).join("").toUpperCase().substring(0, 2) ||
    job?.title?.charAt(0) ||
    "CO";

  const salary =
    job.salary ||
    (job.salaryDetails?.minAmount && job.salaryDetails?.maxAmount
      ? `${job.salaryDetails.minAmount.toLocaleString()} - ${job.salaryDetails.maxAmount.toLocaleString()} ${
          job.salaryDetails.currency || ""
        }`
      : job.salaryMin && job.salaryMax
      ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${
          job.salaryCurrency || ""
        }`
      : "");

  const date = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : "N/A";

  const jobType = JobTypeLabel[job.type as JobType] || job.type;
  const JobTypeIcon = job.type === JobType.REMOTE ? Globe2 : Briefcase;

  return (
    <Card className="border border-border hover:shadow-md transition-all rounded-2xl overflow-hidden w-full bg-card group">
      <CardContent className="p-5 w-full min-w-0">
        {/* Top Section: Logo, Title, Save */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1 min-w-0">
            <Avatar className="w-12 h-12 rounded-xl border border-border flex-shrink-0 bg-white">
              <AvatarImage
                src={job?.organization?.logoFile?.url || job.companyLogo}
                alt={companyName}
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-base rounded-xl">
                {logoInitials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-foreground truncate leading-tight group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate font-medium">
                    {companyName}
                  </p>
                </div>
              </div>

              {/* Metadata Row (Compact) */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <JobTypeIcon size={12} className="text-primary" />
                  <span className="font-medium text-foreground">{jobType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-primary" />
                  <span>{job.location}</span>
                </div>
                {salary && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={12} className="text-green-600" />
                    <span className="text-green-700 font-medium">{salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>{date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            aria-label="Unsave job"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 -mt-1"
          >
            <Heart
              className={`h-5 w-5 ${
                isSaved ? "fill-destructive text-destructive" : ""
              }`}
            />
          </Button>
        </div>

        {/* Separator */}
        <div className="h-px bg-border my-4" />

        {/* Footer: Keywords & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Keywords (Limited) */}
          <div className="flex flex-wrap gap-2 flex-1">
            {job.keywords &&
              job.keywords.slice(0, 3).map((keyword: string) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="text-[10px] font-medium px-2.5 py-0.5 rounded-lg border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {keyword}
                </Badge>
              ))}
            {job.keywords && job.keywords.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{job.keywords.length - 3}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mr-2">
              <Users className="h-3.5 w-3.5" />
              <span>{job.applications}</span>
            </div>

            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="h-9 text-xs font-bold border-border hover:bg-secondary text-foreground rounded-xl"
            >
              View Details
            </Button>

            <div onClick={(e) => e.stopPropagation()}>
              <ApplyJobDialog jobId={job?.id ?? ""} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}