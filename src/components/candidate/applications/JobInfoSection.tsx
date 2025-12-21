import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, ExternalLink, PenSquare, DollarSign } from "lucide-react";
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
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">
          Job Overview
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewJob}
          className="h-7 text-[10px] font-bold text-primary hover:bg-primary/10 hover:text-primary px-3 uppercase rounded-lg"
        >
          View Posting <ExternalLink size={10} className="ml-1.5" />
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Stats Block (Location, Salary, Level) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pb-8 border-b border-border">
          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Location
              </div>
              <div className="text-sm font-bold text-foreground">
                {job?.location || "Remote"}
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Salary
              </div>
              <div className="text-sm font-bold text-foreground">
                {job?.salary || "Negotiable"}
              </div>
            </div>
          </div>

          {/* Level & Type */}
          <div className="flex items-start gap-4 col-span-2 lg:col-span-1">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
              <PenSquare size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Level & Type
              </div>
              <div className="text-sm font-bold text-foreground">
                {job?.seniorityLevel || "Mid"} • {job?.type || "Full-Time"}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Block */}
        {job?.keywords && job.keywords.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase mb-4">
              Required Skills
            </div>
            <div className="flex flex-wrap gap-2.5">
              {job.keywords.map((kw: string, i: number) => (
                <span
                  key={i}
                  className="text-xs font-medium text-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Company Block (Bottom) */}
        {company && (
          <div className="pt-6 border-t border-border">
            <div className="text-[10px] font-bold text-muted-foreground uppercase mb-4">
              About Company
            </div>
            <div
              className="flex items-center justify-between gap-4 p-4 bg-secondary/20 rounded-2xl border border-border cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
              onClick={onViewCompany}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 rounded-xl border border-border bg-background">
                  <AvatarImage
                    src={company.logoFile?.url}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold rounded-xl text-lg">
                    {company.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground text-sm truncate mb-0.5">
                    {company.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {company.industryId}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-bold text-primary hover:bg-primary/10 hover:text-primary shrink-0 rounded-lg px-3"
              >
                Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}