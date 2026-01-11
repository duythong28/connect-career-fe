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
import BillableActions from "@/components/landing/BillableActions";

const HomePage = () => {
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
      pageNumber: 1,
      pageSize: 6,
    })
      .then((res) => setJobs(res.data || []))
      .catch(() => setJobs([]));
  }, []);

  const featuredJobs = jobs.slice(0, 6);
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
        <BillableActions />
        <CTA />
      </div>
    </div>
  );
};

export default HomePage;
