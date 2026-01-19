import { MapPin, Users, Globe, Calendar, Award } from "lucide-react";
import { Organization } from "@/api/types/organizations.types";
import { IndustryStatistic } from "@/api/types/public.types";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const baseURL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

interface FeaturedCompaniesSectionProps {
  companies: Organization[];
  industries: IndustryStatistic[];
  selectedIndustry: string;
  onSelectIndustry: (industry: string) => void;
  loading: boolean;
}

interface TooltipPosition {
  top: number;
  left: number;
  maxHeight: number;
}

const formatEnumValue = (value: string) => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CompanyTooltip = ({
  company,
  position,
}: {
  company: Organization;
  position: TooltipPosition;
}) => {
  return (
    <div
      className="fixed z-50 w-[500px] bg-card rounded-3xl shadow-lg border border-border overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxHeight: `${position.maxHeight}px`,
      }}
    >
      <div
        className="overflow-y-auto custom-scrollbar"
        style={{ maxHeight: `${position.maxHeight}px` }}
      >
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-2xl border border-border shadow-sm shrink-0">
              <AvatarImage
                src={company.logo || company.logoFile?.url}
                className="rounded-2xl object-cover"
              />
              <AvatarFallback className="text-xl font-bold bg-muted text-foreground rounded-2xl">
                {company.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2">
                {company.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {company.industry?.name}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {(company.city || company.country) && (
                  <span className="flex items-center text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1 text-primary" />
                    {[company.city, company.country].filter(Boolean).join(", ")}
                  </span>
                )}
                {company.organizationSize && (
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground font-semibold text-xs px-2.5 py-1 rounded-lg hover:bg-secondary/80"
                  >
                    {formatEnumValue(company.organizationSize)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {company.shortDescription && (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {company.shortDescription}
              </p>
            </div>
          )}

          {company.longDescription && (
            <div className="border-t border-border pt-5">
              <h4 className="text-sm font-bold text-foreground mb-3">
                Company Overview
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {company.longDescription}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-5">
            {company.employeeCount && (
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Employees
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    {company.employeeCount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {company.organizationType && (
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Type
                </div>
                <div className="text-sm font-bold text-foreground">
                  {formatEnumValue(company.organizationType)}
                </div>
              </div>
            )}
          </div>

          {company.website && (
            <div className="border-t border-border pt-5">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 hover:underline"
              >
                <Globe className="h-4 w-4" />
                Visit Website
              </a>
            </div>
          )}

          {company.headquartersAddress && (
            <div className="bg-muted/50 rounded-2xl p-4 border border-border">
              <div className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                <MapPin size={12} /> Headquarters
              </div>
              <div className="text-sm font-medium text-foreground leading-relaxed">
                {company.headquartersAddress}
              </div>
            </div>
          )}

          {(company.workingDays?.length > 0 || company.workScheduleTypes?.length > 0) && (
            <div className="bg-accent/30 rounded-2xl p-4 border border-border">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Work Culture
              </h4>
              {company.workingDays?.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase block mb-2">
                    Working Days
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.workingDays.map((day: string) => (
                      <Badge
                        key={day}
                        variant="secondary"
                        className="bg-card text-foreground px-2 py-0.5 rounded border border-border capitalize hover:bg-card"
                      >
                        {day.toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {company.workScheduleTypes?.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase block mb-2">
                    Schedule
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.workScheduleTypes.map((type: string) => (
                      <Badge
                        key={type}
                        className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium border-none hover:bg-primary/90"
                      >
                        {formatEnumValue(type)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-6">
          <a
            href={`${baseURL}/company/${company.id}/profile`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground text-center font-bold h-10 px-4 rounded-xl transition-colors"
          >
            View Full Profile
          </a>
        </div>
      </div>
    </div>
  );
};

const FeaturedCompaniesSection = ({
  companies,
  industries,
  selectedIndustry,
  onSelectIndustry,
  loading,
}: FeaturedCompaniesSectionProps) => {
  const [hoveredCompany, setHoveredCompany] = useState<Organization | null>(
    null,
  );
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
    company: Organization,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = calculateTooltipPosition(rect);

    setTooltipPosition(position);
    setHoveredCompany(company);
    isOverCardOrTooltip.current = true;
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!isOverCardOrTooltip.current) {
        setHoveredCompany(null);
      }
    }, 100);
    isOverCardOrTooltip.current = false;
  };

  const handleTooltipMouseEnter = () => {
    isOverCardOrTooltip.current = true;
  };

  const handleTooltipMouseLeave = () => {
    isOverCardOrTooltip.current = false;
    setHoveredCompany(null);
  };

  return (
    <section className="py-16 bg-[#F8F9FB] animate-fade-in">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Top Hiring Companies
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the world's leading organizations
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectIndustry("all")}
            className={`h-10 px-4 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
              selectedIndustry === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted border border-border"
            }`}
          >
            All
          </button>
          {industries.map((ind) => (
            <button
              key={ind.industryId}
              onClick={() => onSelectIndustry(ind.key)}
              className={`h-10 px-4 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                selectedIndustry === ind.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted border border-border"
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all group cursor-pointer"
                onMouseEnter={(e) => handleMouseEnter(comp, e)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-muted shrink-0 overflow-hidden border border-border">
                    {(comp.logo || comp.logoFile?.url) && (
                      <img
                        src={comp.logo || comp.logoFile.url}
                        alt={comp.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <a className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1"
                      href={`${baseURL}/company/${comp.id}/profile`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {comp.name}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {comp.industry?.name}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {comp.shortDescription ||
                    comp.tagline ||
                    `Join ${comp.name} and be part of an innovative team driving excellence in the industry.`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tooltip - only visible on desktop */}
      {hoveredCompany && (
        <div
          className="hidden lg:block"
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <CompanyTooltip company={hoveredCompany} position={tooltipPosition} />
        </div>
      )}
    </section>
  );
};

export default FeaturedCompaniesSection;