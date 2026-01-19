import { ArrowRight, MapPin, DollarSign, Clock, Users } from "lucide-react";
import { Job } from "@/api/types/jobs.types";
import { IndustryStatistic } from "@/api/types/public.types";
import { isHtmlContent } from "@/pages/public/JobSearchPage";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { JobTypeLabel, JobType } from "@/api/types/jobs.types";
import RenderMarkDown from "@/components/shared/RenderMarkDown";
import { Markdown } from "@/components/ui/markdown";

const baseURL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

interface FeaturedJobsSectionProps {
  jobs: Job[];
  industries: IndustryStatistic[];
  selectedIndustry: string;
  onSelectIndustry: (industry: string) => void;
  loading: boolean;
}

const extractPlainText = (content: string): string => {
  if (!content) return "";

  if (isHtmlContent(content)) {
    const div = document.createElement("div");
    div.innerHTML = content;
    return div.textContent || div.innerText || "";
  }

  return content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
};

interface TooltipPosition {
  top: number;
  left: number;
  maxHeight: number;
}

const JobTooltip = ({
  job,
  position,
}: {
  job: Job;
  position: TooltipPosition;
}) => {
  return (
    <div
      className="fixed z-50 w-[500px] bg-card text-card-foreground rounded-2xl shadow-blue border border-border overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxHeight: `${position.maxHeight}px`,
      }}
    >
      <div
        className="overflow-y-auto"
        style={{ maxHeight: `${position.maxHeight}px` }}
      >
        <div className="sticky top-0 bg-card border-b border-border p-5 z-10">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 rounded-xl border border-border shadow-sm shrink-0">
              <AvatarImage
                src={job.organization?.logoFile?.url ?? job.companyLogo}
                className="rounded-xl object-cover"
              />
              <AvatarFallback className="text-lg font-bold bg-secondary text-secondary-foreground rounded-xl">
                {job.companyName?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {job.companyName}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="flex items-center text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1 text-primary" />
                  {job.location}
                </span>
                <Badge
                  variant="secondary"
                  className="capitalize bg-secondary text-secondary-foreground font-semibold text-xs px-2 py-0.5 rounded-md"
                >
                  {JobTypeLabel[job.type as JobType] || job.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <DollarSign className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-xs text-muted-foreground mb-1">Salary</div>
              <div className="text-sm font-bold text-foreground">
                {job.salary || "Competitive"}
              </div>
            </div>

            {job.postedDate && (
              <div className="text-center p-3 bg-secondary/50 rounded-xl border border-border/50">
                <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xs text-muted-foreground mb-1">Posted</div>
                <div className="text-sm font-bold text-foreground">
                  {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>
            )}

            <div className="text-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <Users className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-xs text-muted-foreground mb-1">
                Applicants
              </div>
              <div className="text-sm font-bold text-foreground">
                {job.applications}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-3">
              Job Description
            </h4>
            <div className="prose prose-sm max-w-none text-muted-foreground text-sm leading-relaxed">
              {isHtmlContent(job.description) ? (
                <RenderMarkDown content={job.description} />
              ) : (
                <Markdown content={job.description} />
              )}
            </div>
          </div>

          {job.keywords && job.keywords.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.keywords.map((keyword: string) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="text-xs border-border text-muted-foreground px-2.5 py-1 rounded-lg font-medium"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {job.organization && (
            <div className="bg-secondary/30 rounded-xl p-4 border border-border">
              <h4 className="text-sm font-bold text-foreground mb-3">
                About {job.companyName}
              </h4>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {job.organization.shortDescription}
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                    Industry
                  </span>
                  <span className="font-medium text-foreground">
                    {job.organization.industry?.name}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                    Company Size
                  </span>
                  <span className="font-medium text-foreground">
                    {job.organization.organizationSize}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-5">
          <a
            href={`${baseURL}/jobs/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors shadow-sm"
          >
            View Full Details & Apply
          </a>
        </div>
      </div>
    </div>
  );
};

const FeaturedJobsSection = ({
  jobs,
  industries,
  selectedIndustry,
  onSelectIndustry,
  loading,
}: FeaturedJobsSectionProps) => {
  const navigate = useNavigate();
  const [hoveredJob, setHoveredJob] = useState<Job | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    maxHeight: 600,
  });
  const isOverCardOrTooltip = useRef(false);

  const calculateTooltipPosition = (cardRect: DOMRect): TooltipPosition => {
    const tooltipWidth = 500;
    const tooltipMaxHeight = 600;
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = cardRect.right + padding;
    let top = cardRect.top;

    if (left + tooltipWidth > viewportWidth - padding) {
      left = cardRect.left - tooltipWidth - padding;
    }

    if (left < padding) {
      left = (viewportWidth - tooltipWidth) / 2;
    }

    const availableHeight = viewportHeight - top - padding;
    const maxHeight = Math.min(tooltipMaxHeight, availableHeight);

    if (maxHeight < 400 && top > 100) {
      top = Math.max(padding, viewportHeight - tooltipMaxHeight - padding);
    }

    return { top, left, maxHeight };
  };

  const handleMouseEnter = (
    job: Job,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = calculateTooltipPosition(rect);

    setTooltipPosition(position);
    setHoveredJob(job);
    isOverCardOrTooltip.current = true;
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!isOverCardOrTooltip.current) {
        setHoveredJob(null);
      }
    }, 100);
    isOverCardOrTooltip.current = false;
  };

  const handleTooltipMouseEnter = () => {
    isOverCardOrTooltip.current = true;
  };

  const handleTooltipMouseLeave = () => {
    isOverCardOrTooltip.current = false;
    setHoveredJob(null);
  };

  return (
    <section className="py-16 bg-[#F8F9FB] animate-fade-in">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Featured Opportunities
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Discover your next career move
            </p>
          </div>
          <a
            className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm"
            href={`${baseURL}/jobs`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View All Jobs <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onSelectIndustry("all")}
            className={`h-9 px-6 rounded-xl whitespace-nowrap text-sm font-medium transition-all border ${
              selectedIndustry === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-accent"
            }`}
          >
            All
          </button>
          {industries.map((ind) => (
            <button
              key={ind.key}
              onClick={() => onSelectIndustry(ind.industryId)}
              className={`h-9 px-6 rounded-xl whitespace-nowrap text-sm font-medium transition-all border ${
                selectedIndustry === ind.industryId
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:bg-accent"
              }`}
            >
              {ind.key}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="card-interactive bg-card rounded-2xl p-6 border border-border transition-all group"
                onMouseEnter={(e) => handleMouseEnter(job, e)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 shrink-0 overflow-hidden border border-border">
                    {job.organization?.logoFile?.url && (
                      <img
                        src={job.organization.logoFile.url}
                        alt={job.organization.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      className="font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-0.5"
                      href={`${baseURL}/jobs/${job.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.title}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {job.organization?.name || job.companyName}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {extractPlainText(job.description)}
                </p>

                <div className="flex flex-row flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {job.salary ? job.salary : "Competitive Salary"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(job.keywords || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-lg font-medium border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tooltip - only shows on lg breakpoint and up */}
      {hoveredJob && (
        <div
          className="hidden lg:block"
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <JobTooltip job={hoveredJob} position={tooltipPosition} />
        </div>
      )}
    </section>
  );
};

export default FeaturedJobsSection;
