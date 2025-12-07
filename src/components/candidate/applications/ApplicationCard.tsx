import { MapPin, Building2, Calendar, ChevronRight, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/button"; // Using Button styles for badge-like appearance if needed, or standard div
import { Application, ApplicationStatus, ApplicationStatusLabel } from "@/api/types/applications.types";
import { Job } from "@/api/types/jobs.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ApplicationCard({ application, onView }: { application: Application; onView: () => void }) {
  const job: Job | undefined = application.job ?? undefined;
  const companyName = job?.companyName || "Company";
  const companyLogo = job?.organization?.logoFile?.url || job?.companyLogo || undefined;
  
  // Helper for status styling to match Simplify Tracker
  const getStatusColor = (status: ApplicationStatus) => {
      switch (status) {
          case ApplicationStatus.OFFER: return "text-green-700 bg-green-50 border-green-200";
          case ApplicationStatus.REJECTED: return "text-red-700 bg-red-50 border-red-200";
          case ApplicationStatus.INTERVIEW: return "text-purple-700 bg-purple-50 border-purple-200";
          default: return "text-gray-700 bg-white border-gray-200";
      }
  };

  // Salary Label Logic
  const salaryLabel = job?.salary || (job?.salaryDetails && (job.salaryDetails.minAmount || job.salaryDetails.maxAmount)
      ? `${job.salaryDetails.minAmount ? `$${job.salaryDetails.minAmount.toLocaleString()}` : ""}${job.salaryDetails.minAmount && job.salaryDetails.maxAmount ? " - " : ""}${job.salaryDetails.maxAmount ? `$${job.salaryDetails.maxAmount.toLocaleString()}` : ""}`
      : null);

  return (
    <div 
        onClick={onView}
        className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
    >
      {/* Left: Logo & Main Info */}
      <div className="flex items-center gap-4 overflow-hidden">
         {/* Logo */}
         <div className="w-12 h-12 flex-shrink-0 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shadow-sm">
            <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={companyLogo} className="object-contain" />
                <AvatarFallback className="bg-blue-50 text-[#0EA5E9] font-bold text-lg w-full h-full flex items-center justify-center">
                    {companyName.charAt(0)}
                </AvatarFallback>
            </Avatar>
         </div>

         {/* Info */}
         <div className="min-w-0">
             <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#0EA5E9] transition-colors truncate">
                {job?.title || "Unknown Position"}
             </h3>
             <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                 <span className="font-semibold flex items-center gap-1 text-gray-700"><Building2 size={10}/> {companyName}</span>
                 <span className="text-gray-300">•</span>
                 <span className="flex items-center gap-1"><MapPin size={10}/> {job?.location || "Remote"}</span>
             </div>
         </div>
      </div>

      {/* Middle: Salary / Metadata (Hidden on small mobile) */}
      {salaryLabel && (
          <div className="hidden md:flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 whitespace-nowrap">
              <DollarSign size={10} strokeWidth={3}/> {salaryLabel}
          </div>
      )}

      {/* Right: Status & Date */}
      <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Applied</div>
              <div className="text-xs font-bold text-gray-700 flex items-center justify-end gap-1">
                  {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : "N/A"}
              </div>
          </div>

          {/* Status Pill */}
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold capitalize ${getStatusColor(application.status)} flex items-center justify-center min-w-[80px]`}>
              {ApplicationStatusLabel[application.status] || application.status}
          </div>
          
          <ChevronRight size={16} className="text-gray-300 group-hover:text-[#0EA5E9] transition-colors"/>
      </div>
    </div>
  );
}