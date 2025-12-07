import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Briefcase, ExternalLink, Building2, PenSquare, DollarSign, Globe, Clock } from "lucide-react";
import { Organization } from "@/api/types/organizations.types";
import { format } from "date-fns";

export default function JobInfoSection({
  job,
  company,
  onViewJob,
  onViewCompany,
}: {
  job: any;
  company: Organization | null;
  onViewJob: () => void;
  onViewCompany: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-400">Job Overview</h3>
            <Button variant="ghost" size="sm" onClick={onViewJob} className="h-6 text-[10px] font-bold text-[#0EA5E9] hover:bg-blue-50 px-2 uppercase">
                View Posting <ExternalLink size={10} className="ml-1" />
            </Button>
        </div>

        <div className="flex flex-col gap-6">
            
            {/* Stats Block (Location, Salary, Level) - Sử dụng grid gọn gàng */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pb-6 border-b border-gray-100">
                 {/* Location */}
                 <div className="flex items-start gap-3">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><MapPin size={18}/></div>
                     <div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase">Location</div>
                         <div className="text-sm font-bold text-gray-900">{job?.location || "Remote"}</div>
                     </div>
                 </div>
                 
                 {/* Salary */}
                 <div className="flex items-start gap-3">
                     <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0"><DollarSign size={18}/></div>
                     <div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase">Salary</div>
                         <div className="text-sm font-bold text-gray-900">{job?.salary || "Negotiable"}</div>
                     </div>
                 </div>

                 {/* Level & Type */}
                 <div className="flex items-start gap-3 col-span-2 lg:col-span-1">
                     <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0"><PenSquare size={18}/></div>
                     <div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase">Level & Type</div>
                         <div className="text-sm font-bold text-gray-900">{job?.seniorityLevel || "Mid"} • {job?.type || "Full-Time"}</div>
                     </div>
                 </div>
            </div>

            {/* Skills Block */}
            {job?.keywords && job.keywords.length > 0 && (
                <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-3">Required Skills</div>
                    <div className="flex flex-wrap gap-2">
                        {job.keywords.map((kw: string, i: number) => (
                        <span key={i} className="text-[11px] font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                            {kw}
                        </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Company Block (Bottom) */}
            {company && (
                <div className="pt-4 border-t border-gray-100">
                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-3">About Company</div>
                    <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={onViewCompany}>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-lg border border-gray-100 bg-white">
                                <AvatarImage src={company.logoFile?.url} className="object-cover" />
                                <AvatarFallback className="bg-gray-800 text-white font-bold rounded-lg">{company.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 text-sm truncate">{company.name}</div>
                                <div className="text-xs text-gray-500 truncate">{company.industryId}</div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-[#0EA5E9] hover:bg-white shrink-0">
                            Profile
                        </Button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}