import { ArrowRight, MapPin, DollarSign, Clock, Bookmark } from "lucide-react";
import { Job } from "@/api/types/jobs.types";
import { IndustryStatistic } from "@/api/types/public.types";
import { isHtmlContent } from "@/pages/public/JobSearchPage";

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

const FeaturedJobsSection = ({
  jobs,
  industries,
  selectedIndustry,
  onSelectIndustry,
  loading,
}: FeaturedJobsSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Featured Opportunities
            </h2>
            <p className="text-lg text-gray-600">
              Discover your next career move
            </p>
          </div>
          <button className="text-emerald-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            View All Jobs <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => onSelectIndustry("all")}
            className={`px-6 py-3 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedIndustry === "all"
                ? "bg-emerald-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {industries.map((ind) => (
            <button
              key={ind.key}
              onClick={() => onSelectIndustry(ind.industryId)}
              className={`px-6 py-3 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedIndustry === ind.industryId
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {ind.key}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all group"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                    {job.organization?.logoFile?.url && (
                      <img
                        src={job.organization.logoFile.url}
                        alt={job.organization.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {job.organization?.name || job.companyName}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-emerald-500 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {extractPlainText(job.description)}
                </p>

                <div className="flex flex-row flex-wrap gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">
                      {job.salary ? job.salary : "Competitive Salary"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(job.keywords || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full font-medium"
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
    </section>
  );
};

export default FeaturedJobsSection;