import {
  Users,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2 as CheckCircle, // Dùng CheckCircle2 để nhất quán với SimplifyPage
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

// Component button theo style Simplify
const SimplifyButton = ({ children, className = '', ...props }: React.ComponentPropsWithoutRef<'button'>) => (
    <button
        className={`bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg shadow-sm transition-colors ${className}`}
        {...props}
    >
        {children}
    </button>
);


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
  // Dựa vào mã cũ, sử dụng job?.name?.charAt(0) cho fallback. Tuy nhiên dùng Initials sẽ đẹp hơn theo Simplify UI.
  const logoInitials = (companyName.match(/\b\w/g) || []).join('').toUpperCase().substring(0, 2) || (job?.title?.charAt(0) || "CO"); 

  const salary =
    job.salary ||
    (job.salaryDetails?.minAmount && job.salaryDetails?.maxAmount
      ? `${job.salaryDetails.minAmount.toLocaleString()} - ${job.salaryDetails.maxAmount.toLocaleString()} ${
          job.salaryDetails.currency || ""
        }`
      : job.salaryMin && job.salaryMax
      ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.salaryCurrency || ""}`
      : ""); // Giữ logic salary cũ + thêm logic SalaryDetails từ types.ts

  const date = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : "N/A";
  
  const jobType = JobTypeLabel[job.type as JobType] || job.type;
  const JobTypeIcon = job.type === JobType.REMOTE ? Globe2 : Briefcase; // Thêm icon cho UI Simplify
  
  return (
    <Card className="border border-gray-200 hover:shadow-lg transition-shadow rounded-xl overflow-hidden w-full">
      <CardContent className="p-4 sm:p-6 w-full min-w-0">
        <div className="flex items-start justify-between">
            {/* Logo, Title, Company: UI Simplify, Logic cũ */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="w-12 h-12 rounded-lg shadow-sm flex-shrink-0">
                    <AvatarImage
                        src={job?.organization?.logoFile?.url || job.companyLogo}
                        alt={companyName}
                    />
                    <AvatarFallback className="bg-blue-600 text-white font-bold text-lg rounded-lg">
                        {logoInitials}
                    </AvatarFallback>
                </Avatar>
                
                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-sm text-gray-700 truncate mt-0.5">
                        {companyName}
                    </p>
                </div>
            </div>

            {/* Save Button: DÙNG HÀM onSave CŨ */}
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSave(); }} 
                aria-label="Unsave job"
                className="p-2 ml-4 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
                <Heart
                    className={`h-5 w-5 ${
                        isSaved ? "fill-red-500 text-red-500" : "" // DÙNG PROPS CŨ
                    }`}
                />
            </button>
        </div>
        
        {/* Info row: Badges/Tags (UI: Simplify, Logic cũ) */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-4 mb-3 border-b border-gray-100 pb-3">
             {/* Job Type Badge */}
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                <JobTypeIcon size={10} /> {jobType}
            </span>
             {/* Location Badge */}
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold flex items-center gap-1">
                <MapPin size={10} /> {job.location}
            </span>
            {/* Salary Badge */}
            {salary && (
                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                    <DollarSign size={10} /> {salary}
                </span>
            )}
             {/* Applied/Posted Date Badge */}
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold flex items-center gap-1">
                <Clock size={10} /> {date}
            </span>
        </div>
        
        {/* Description */}
        <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                {job.summary ||
                  (job.description.replace(/[#*]/g, "").substring(0, 150) + "...")}
            </p>
        </div>
        
        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mb-4">
            {job.keywords && job.keywords.slice(0, 5).map((keyword: string) => ( // Dùng slice(0, 5) như cũ
                <Badge
                    key={keyword}
                    variant="outline"
                    className="text-xs border border-gray-300 bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-medium"
                >
                    {keyword}
                </Badge>
            ))}
        </div>
        
        {/* Actions (UI: Simplify, Logic: Cũ) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>{job.applications} applicants</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 w-full sm:w-auto">
                <div className="w-full sm:w-auto">
                    <ApplyJobDialog jobId={job?.id ?? ""} />
                </div>
                {/* NÚT GỌI onView: Vẫn giữ nguyên logic cũ */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onView(); }}
                    className="mt-1 sm:mt-0 text-blue-600 hover:underline text-sm font-bold w-full sm:w-auto p-2 transition"
                    style={{ width: "fit-content", alignSelf: "center" }} // Giữ style cũ
                >
                    View Details
                </button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}