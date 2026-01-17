import { useEffect, useState } from "react";
import { getCandidateJobs } from "@/api/endpoints/jobs.api";
import { searchOrganizations } from "@/api/endpoints/organizations.api";
import {
  getWorkMarket,
  getIndustryStatistics,
  getJobOpportunityGrowth,
} from "@/api/endpoints/public.api";
import Hero from "@/components/landing/Hero";
import FeaturedJobs from "@/components/landing/FeaturedJobs";
import TopCompanies from "@/components/landing/TopCompanies";
import Industries from "@/components/landing/Industries";
import Features from "@/components/landing/Features";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import JobGrowthChart from "@/components/landing/JobGrowthChart";
import {
  WorkMarketData,
  IndustryStatisticsResponse,
  JobOpportunityGrowthResponse,
} from "@/api/types/public.types";
import { Organization } from "@/api/types/organizations.types";
import { Job } from "@/api/types/jobs.types";

const HomePage = () => {
  const [companies, setCompanies] = useState<Organization[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [workMarketData, setWorkMarketData] = useState<WorkMarketData | null>(
    null
  );
  const [industryStats, setIndustryStats] =
    useState<IndustryStatisticsResponse | null>(null);
  const [jobGrowthData, setJobGrowthData] =
    useState<JobOpportunityGrowthResponse | null>(null);

  useEffect(() => {
    searchOrganizations({
      page: 1,
      limit: 8,
    })
      .then((res) => {
        setCompanies(res.data || []);
      })
      .catch(() => setCompanies([]));
  }, []);

  useEffect(() => {
    getCandidateJobs({
      pageNumber: 1,
      pageSize: 6,
    })
      .then((res) => setJobs(res.data || []))
      .catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    getWorkMarket()
      .then((res) => {
        setWorkMarketData(res.data);
      })
      .catch(() => setWorkMarketData(null));
  }, []);

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

  useEffect(() => {
    getJobOpportunityGrowth()
      .then((res) => {
        setJobGrowthData(res);
      })
      .catch(() => setJobGrowthData(null));
  }, []);

  const featuredJobs = jobs.slice(0, 6);
  const topCompanies = companies.slice(0, 8);

  return (
    <div className="min-h-screen">
      <div>
        <Hero />
        <Stats workMarketData={workMarketData} />
        <FeaturedJobs jobs={featuredJobs} />
        <TopCompanies companies={topCompanies} />
        <Industries industryStats={industryStats} />
        <JobGrowthChart jobGrowthData={jobGrowthData} />
        <Features />
        <CTA />
      </div>
    </div>
  );
};

export default HomePage;