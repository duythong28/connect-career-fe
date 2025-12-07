import {
    MapPin,
    FileText,
    DollarSign,
    Globe,
    Building2,
    Briefcase,
    ExternalLink,
} from "lucide-react";
import { Organization } from "@/api/types/organizations.types";

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
            {/* Header Section */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="p-1.5 text-blue-600 rounded-lg"><FileText size={16} /></div>
                <h3 className="font-bold text-gray-900 text-sm">Job Information</h3>
                <button
                    onClick={onViewJob}
                    className="ml-auto text-xs font-bold text-[#0EA5E9] flex items-center gap-1 hover:underline"
                >
                    View Job <ExternalLink size={12} />
                </button>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Job Title</div>
                    <div className="font-medium text-gray-900">{job?.title || 'N/A'}</div>
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Location</div>
                    <div className="font-medium text-gray-900 flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        {job?.location || 'N/A'}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Salary</div>
                    <div className="font-medium text-gray-900 flex items-center gap-1.5">
                        <DollarSign size={14} className="text-gray-400" />
                        {job?.salary || 'N/A'}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Employment Type</div>
                    <div className="font-medium text-gray-900 flex items-center gap-1.5">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="capitalize">{job?.type || 'N/A'}</span>
                    </div>
                </div>
                <div className="col-span-full">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Keywords</div>
                    <div className="flex flex-wrap gap-2">
                        {job?.keywords?.slice(0, 6).map((kw: string) => (
                            <span key={kw} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                {kw}
                            </span>
                        )) || <span className="text-sm text-gray-400 italic">No keywords listed.</span>}
                    </div>
                </div>
            </div>

            {/* Company Info */}
            {company && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 font-bold text-lg">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-base text-gray-900">{company.name}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                    <MapPin size={10} />
                                    <span>{company.headquartersAddress || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onViewCompany}
                            className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-[#0EA5E9]"
                        >
                            View Company
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-xs mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Size</span>
                            <span className="font-medium text-gray-800">{company.organizationSize || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Website</span>
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] font-medium hover:underline flex items-center gap-1 truncate max-w-[100px]">
                                <Globe size={10} />
                                {company.website ? new URL(company.website).hostname : 'N/A'}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}