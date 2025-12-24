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
import { Button } from "@/components/ui/button";

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
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm animate-fade-in">
            {/* Header Section */}
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <div className="p-1.5 text-primary">
                    <FileText size={16} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Job Information</h3>
                <Button
                    variant="ghost"
                    onClick={onViewJob}
                    className="ml-auto h-9 text-xs font-bold text-primary flex items-center gap-1 hover:bg-transparent hover:underline px-0"
                >
                    View Job <ExternalLink size={12} />
                </Button>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Job Title</div>
                    <div className="text-sm font-medium text-foreground">{job?.title || 'N/A'}</div>
                </div>
                <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Location</div>
                    <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <MapPin size={14} className="text-muted-foreground" />
                        {job?.location || 'N/A'}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Salary</div>
                    <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <DollarSign size={14} className="text-muted-foreground" />
                        {job?.salary || 'N/A'}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Employment Type</div>
                    <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Briefcase size={14} className="text-muted-foreground" />
                        <span className="capitalize">{job?.type || 'N/A'}</span>
                    </div>
                </div>
                <div className="col-span-full">
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Keywords</div>
                    <div className="flex flex-wrap gap-2">
                        {job?.keywords?.slice(0, 6).map((kw: string) => (
                            <span key={kw} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-xl text-xs font-medium">
                                {kw}
                            </span>
                        )) || <span className="text-sm text-muted-foreground italic">No keywords listed.</span>}
                    </div>
                </div>
            </div>

            {/* Company Info */}
            {company && (
                <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary text-secondary-foreground font-bold">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-lg text-foreground leading-tight">{company.name}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    <MapPin size={10} />
                                    <span>{company.headquartersAddress || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={onViewCompany}
                            className="h-9 text-xs font-bold text-muted-foreground flex items-center gap-1 hover:text-primary hover:bg-transparent px-0"
                        >
                            View Company
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-xs mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Size</span>
                            <span className="font-medium text-foreground">{company.organizationSize || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Website</span>
                            <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary font-medium hover:underline flex items-center gap-1 truncate max-w-[100px]"
                            >
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