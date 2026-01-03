import { useEffect, useState } from "react";
import { getCandidateJobs } from "@/api/endpoints/jobs.api";
import { searchOrganizations } from "@/api/endpoints/organizations.api";
import Hero from "@/components/landing/Hero";
import FeaturedJobs from "@/components/landing/FeaturedJobs";
import TopCompanies from "@/components/landing/TopCompanies";
import Industries from "@/components/landing/Industries";
import Features from "@/components/landing/Features";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";

const HomePage = () => {
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    location: "",
    type: "",
    salaryRange: [0, 200000],
    industry: "",
  });

  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    searchOrganizations({
      pageNumber: 1,
      limit: 8,
    })
      .then((res) => {
        setCompanies(res.data || []);
      })
      .catch(() => setCompanies([]));
  }, []);

  // Fetch jobs
  useEffect(() => {
    getCandidateJobs({
      searchTerm: searchFilters.keyword,
      location: searchFilters.location,
      type:
        searchFilters.type && searchFilters.type !== "all"
          ? searchFilters.type
          : undefined,
      pageNumber: 1,
      pageSize: 6,
    })
      .then((res) => setJobs(res.data || []))
      .catch(() => setJobs([]));
  }, [searchFilters.keyword, searchFilters.location, searchFilters.type]);

  const getFilteredJobs = () => {
    return jobs.filter((job) => {
      if (job.status !== "active") return false;

      const matchesIndustry =
        !searchFilters.industry ||
        searchFilters.industry === "all" ||
        companies.find((c) => c.id === job.companyId)?.industry?.id ===
          searchFilters.industry;

      return matchesIndustry;
    });
  };

  const featuredJobs = getFilteredJobs().slice(0, 6);
  const topCompanies = companies.slice(0, 8);

  return (
    <div className="min-h-screen">
      <div>
        <Hero />
        <Stats />
        <FeaturedJobs jobs={featuredJobs} />
        <TopCompanies companies={topCompanies} />
        <Industries />
        <HowItWorks />
        <Features />
        <CTA />
      </div>
    </div>
  );
};

export default HomePage;
