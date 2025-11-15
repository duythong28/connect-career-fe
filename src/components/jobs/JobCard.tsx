import {
  Users,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobType, JobTypeLabel } from "@/api/types/jobs.types";
import ApplyJobDialog from "../candidate/applications/ApplyJobDialog";

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
  const salary =
    job.salary ||
    (job.salaryMin && job.salaryMax
      ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${
          job.salaryCurrency || ""
        }`
      : "");

  const date = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : "";

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl overflow-hidden w-full">
      <CardContent className="p-4 sm:p-6 w-full min-w-0">
        {/* First row: logo + title/company (mobile: 2col grid, desktop: flex) */}
        <div className="grid grid-cols-[48px_1fr] gap-3 items-center sm:flex sm:gap-5">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border border-gray-200">
            <AvatarImage
              src={job?.organization?.logoFile?.url || job.companyLogo}
              alt={job.companyName}
            />
            <AvatarFallback>{job?.companyName?.charAt(0)}</AvatarFallback>
          </Avatar>
          {/* Add min-w-0 here */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 min-w-0">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                {job.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 truncate">
                {job.companyName}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={onSave}
                aria-label="Save job"
                className="rounded-full p-1"
              >
                <Heart
                  className={`h-5 w-5 md:h-4 md:w-4 ${
                    isSaved ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Badge
                variant="outline"
                className="capitalize border border-blue-400 bg-blue-50 text-blue-700 text-xs md:text-sm px-2 py-0.5"
              >
                {JobTypeLabel[job.type as JobType] || job.type}
              </Badge>
            </div>
          </div>
        </div>
        {/* Info row: min-w-0 and overflow-x-auto */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600 mt-3 mb-2">
          <div className="flex items-center min-w-0">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center min-w-0">
            <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{salary}</span>
          </div>
          <div className="flex items-center min-w-0">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{date}</span>
          </div>
        </div>
        {/* Description */}
        <div className="mb-2">
          <p className="text-gray-700 text-xs sm:text-sm md:text-base line-clamp-2">
            {job.summary ||
              job.description.replace(/[#*]/g, "").substring(0, 150)}
            ...
          </p>
        </div>
        {/* Keywords */}
        <div className="flex flex-wrap gap-1 mb-2">
          {job.keywords.slice(0, 5).map((keyword: string) => (
            <Badge
              key={keyword}
              variant="outline"
              className="text-[11px] border border-gray-300 bg-gray-100 text-gray-700 px-2 py-0.5"
            >
              {keyword}
            </Badge>
          ))}
        </div>
        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {job.applications} applicants
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-1 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <ApplyJobDialog jobId={job?.id ?? ""} />
            </div>
            <button
              type="button"
              onClick={onView}
              className="mt-1 sm:mt-0 text-blue-600 hover:underline text-sm font-medium px-2 py-1 transition"
              style={{ width: "fit-content", alignSelf: "center" }}
            >
              View Details
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
