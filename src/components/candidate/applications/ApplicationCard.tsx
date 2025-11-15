import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Application, ApplicationStatusLabel } from "@/api/types/applications.types";
import { Job } from "@/api/types/jobs.types";

export default function ApplicationCard({ application, onView }: { application: Application; onView: () => void }) {
  const job: Job | undefined = application.job ?? undefined;
  const companyName = job?.companyName || "Company";
  const companyLogo = job?.organization?.logoFile?.url || job?.companyLogo || undefined;
  const descriptionPlain =
    (job?.description ?? "")
      .replace(/<[^>]*>/g, "")
      .replace(/[#*]/g, "")
      .trim() || "";
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
      : "—");

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl overflow-hidden w-full">
      <CardContent className="p-4 sm:p-6 w-full min-w-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-gray-100 overflow-hidden">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-base font-medium text-gray-600">
                {companyName.charAt(0)}
              </span>
            )}
          </div>
          {/* Main Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between min-w-0">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                  {job?.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 truncate">
                  {companyName}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Badge
                  variant="outline"
                  className="capitalize border border-blue-400 bg-blue-50 text-blue-700 text-xs md:text-sm px-2 py-0.5"
                >
                  {job?.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="capitalize border border-gray-300 bg-gray-100 text-gray-700 text-xs md:text-sm px-2 py-0.5"
                >
                  {ApplicationStatusLabel[application.status] || application.status}
                </Badge>
              </div>
            </div>
            {/* Info row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600 mt-2 mb-1">
              <div className="flex items-center min-w-0">
                <span className="mr-1">Location:</span>
                <span>{job?.location ?? "—"}</span>
              </div>
              <div className="flex items-center min-w-0">
                <span className="mr-1">Salary:</span>
                <span>{salaryLabel}</span>
              </div>
              <div className="flex items-center min-w-0">
                <span className="mr-1">Applied:</span>
                <span>
                  {application.appliedDate
                    ? new Date(application.appliedDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
            {/* Description */}
            <div className="mb-2">
              <p className="text-gray-700 text-xs sm:text-sm md:text-base line-clamp-2">
                {descriptionPlain.substring(0, 150)}
                {descriptionPlain.length > 150 ? "..." : ""}
              </p>
            </div>
            {/* Keywords */}
            <div className="flex flex-wrap gap-1 mb-2">
              {(job?.keywords || []).slice(0, 5).map((kw: string) => (
                <Badge
                  key={kw}
                  variant="outline"
                  className="text-[11px] border border-gray-300 bg-gray-100 text-gray-700 px-2 py-0.5"
                >
                  {kw}
                </Badge>
              ))}
            </div>
            {/* Notes */}
            {application.notes && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1">Recruiter Feedback</p>
                <p className="text-gray-700 bg-gray-50 p-2 rounded-lg text-xs sm:text-sm">
                  {application.notes}
                </p>
              </div>
            )}
            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {job?.applications ?? 0} applicants
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={onView}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
