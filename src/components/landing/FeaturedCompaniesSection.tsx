import { MapPin, Users } from "lucide-react";
import { Organization } from "@/api/types/organizations.types";
import { IndustryStatistic } from "@/api/types/public.types";

interface FeaturedCompaniesSectionProps {
  companies: Organization[];
  industries: IndustryStatistic[];
  selectedIndustry: string;
  onSelectIndustry: (industry: string) => void;
  loading: boolean;
}

const FeaturedCompaniesSection = ({
  companies,
  industries,
  selectedIndustry,
  onSelectIndustry,
  loading,
}: FeaturedCompaniesSectionProps) => {
  console.log("FeaturedCompaniesSection companies:", companies);
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Top Hiring Companies
            </h2>
            <p className="text-lg text-gray-600">
              Join the world's leading organizations
            </p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Explore Companies
          </button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => onSelectIndustry("all")}
            className={`px-6 py-3 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedIndustry === "all"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All
          </button>
          {industries.map((ind) => (
            <button
              key={ind.industryId}
              onClick={() => onSelectIndustry(ind.key)}
              className={`px-6 py-3 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedIndustry === ind.key
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {ind.key}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-xl p-6 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all group"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                    {(comp.logo || comp.logoFile?.url) && (
                      <img
                        src={comp.logo || comp.logoFile.url}
                        alt={comp.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                      {comp.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {comp.shortDescription || comp.tagline}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>
                      {comp.city}, {comp.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">
                      {comp?.employeeCount?.toLocaleString() ||
                        comp.organizationSize}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCompaniesSection;