import { useEffect, useState } from "react";
import { getCandidateJobs } from "@/api/endpoints/jobs.api";
import { searchOrganizations } from "@/api/endpoints/organizations.api";
import {
  getWorkMarket,
  getIndustryStatistics,
  getJobOpportunityGrowth,
} from "@/api/endpoints/public.api";
import {
  WorkMarketData,
  IndustryStatisticsResponse,
  JobOpportunityGrowthResponse,
} from "@/api/types/public.types";
import { Organization } from "@/api/types/organizations.types";
import { Job } from "@/api/types/jobs.types";
import BannerSlider from "@/components/landing/BannerSlider";
import FeaturedJobsSection from "@/components/landing/FeaturedJobsSection";
import FeaturedCompaniesSection from "@/components/landing/FeaturedCompaniesSection";
import WorkMarketSection from "@/components/landing/WorkMarketSection";
import TopIndustriesSection from "@/components/landing/TopIndustriesSection";
import FeaturesSection from "@/components/landing/FeaturesSection";

const LandingPage = () => {
  const [companies, setCompanies] = useState<Organization[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [workMarketData, setWorkMarketData] = useState<WorkMarketData | null>(null);
  const [industryStats, setIndustryStats] = useState<IndustryStatisticsResponse | null>(null);
  const [jobGrowthData, setJobGrowthData] = useState<JobOpportunityGrowthResponse | null>(null);
  const [selectedJobIndustry, setSelectedJobIndustry] = useState<string>("all");
  const [selectedCompanyIndustry, setSelectedCompanyIndustry] = useState<string>("all");
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Fetch industry statistics
  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    getIndustryStatistics({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    })
      .then((res) => {
        setIndustryStats(res);
      })
      .catch(() => setIndustryStats(null));
  }, []);

  // Fetch work market data
  useEffect(() => {
    getWorkMarket()
      .then((res) => {
        setWorkMarketData(res.data);
      })
      .catch(() => setWorkMarketData(null));
  }, []);

  // Fetch job growth data
  useEffect(() => {
    getJobOpportunityGrowth()
      .then((res) => {
        setJobGrowthData(res);
      })
      .catch(() => setJobGrowthData(null));
  }, []);

  // Fetch jobs when industry tab changes
  useEffect(() => {
    setLoadingJobs(true);
    const params: any = {
      pageNumber: 1,
      pageSize: 20,
    };

    // Only add industryId if not "all"
    if (selectedJobIndustry !== "all") {
      params.industryId = selectedJobIndustry;
    }

    getCandidateJobs(params)
      .then((res) => setJobs(res.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoadingJobs(false));
  }, [selectedJobIndustry]);

  // Fetch companies when industry tab changes
  useEffect(() => {
    setLoadingCompanies(true);
    const params: any = {
      pageNumber: 1,
      limit: 20,
    };

    // Only add q (industry search) if not "all"
    if (selectedCompanyIndustry !== "all") {
      params.q = selectedCompanyIndustry;
    }

    searchOrganizations(params)
      .then((res) => {
        setCompanies(res.organizations.items || []);
      })
      .catch(() => setCompanies([]))
      .finally(() => setLoadingCompanies(false));
  }, [selectedCompanyIndustry]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSlider />
      
      <FeaturedJobsSection
        jobs={jobs.slice(0, 6)}
        industries={industryStats?.data || []}
        selectedIndustry={selectedJobIndustry}
        onSelectIndustry={setSelectedJobIndustry}
        loading={loadingJobs}
      />

      <FeaturedCompaniesSection
        companies={companies.slice(0, 6)}
        industries={industryStats?.data || []}
        selectedIndustry={selectedCompanyIndustry}
        onSelectIndustry={setSelectedCompanyIndustry}
        loading={loadingCompanies}
      />

      <WorkMarketSection
        workMarketData={workMarketData}
        jobGrowthData={jobGrowthData?.data || []}
        industryStats={industryStats?.data || []}
      />

      <TopIndustriesSection industries={industryStats?.data || []} />

      <FeaturesSection />
    </div>
  );
};

export default LandingPage;