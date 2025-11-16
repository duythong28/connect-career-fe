import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, DollarSign, Clock, ChevronRight } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockCompanies,
  mockExtendedCandidates,
  mockJobs,
} from "@/lib/mock-data";
import { Candidate, Company, Job } from "@/lib/types";

const HomePage = () => {
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    location: "",
    type: "",
    salaryRange: [0, 200000],
    industry: "",
  });

  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [candidates] = useState<Candidate[]>(
    mockExtendedCandidates as Candidate[]
  );
  // Filtering Functions
  const getFilteredJobs = () => {
    return jobs.filter((job) => {
      if (job.status !== "active") return false;

      const matchesKeyword =
        !searchFilters.keyword ||
        job.title.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
        job.description
          .toLowerCase()
          .includes(searchFilters.keyword.toLowerCase()) ||
        job.keywords.some((k) =>
          k.toLowerCase().includes(searchFilters.keyword.toLowerCase())
        );

      const matchesLocation =
        !searchFilters.location ||
        job.location
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase());

      const matchesType =
        !searchFilters.type ||
        searchFilters.type === "all" ||
        job.type === searchFilters.type;

      const matchesIndustry =
        !searchFilters.industry ||
        searchFilters.industry === "all" ||
        companies.find((c) => c.id === job.companyId)?.industry ===
          searchFilters.industry;

      return (
        matchesKeyword && matchesLocation && matchesType && matchesIndustry
      );
    });
  };
  const featuredJobs = getFilteredJobs().slice(0, 6);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Find Your Dream Job</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with top companies and discover opportunities that match
            your skills and aspirations.
          </p>

          <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Job title or keyword"
                value={searchFilters.keyword}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    keyword: e.target.value,
                  })
                }
                className="text-gray-900"
              />
              <Input
                placeholder="Location"
                value={searchFilters.location}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    location: e.target.value,
                  })
                }
                className="text-gray-900"
              />
              <Select
                value={searchFilters.type}
                onValueChange={(value) =>
                  setSearchFilters({ ...searchFilters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => navigate("/jobs")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">
                {jobs.filter((j) => j.status === "active").length}+
              </div>
              <div className="text-blue-100">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{companies.length}+</div>
              <div className="text-blue-100">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{candidates.length}k+</div>
              <div className="text-blue-100">Candidates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Jobs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => {
              const company = companies.find((c) => c.id === job.companyId);
              return (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={company?.logo} />
                          <AvatarFallback>
                            {company?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <p className="text-sm text-gray-600">
                            {company?.name}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {job.type}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.postedDate}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {job.keywords.slice(0, 3).map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="outline"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => navigate("/jobs")} size="lg">
              View All Jobs
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Top Companies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.slice(0, 4).map((company) => (
              <Card
                key={company.id}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="pt-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={company.logo} />
                    <AvatarFallback className="text-2xl">
                      {company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {company.industry}
                  </p>
                  <div className="text-sm text-gray-500">
                    {company.jobs} open positions
                  </div>
                  <Button
                    onClick={() => navigate(`/company/${company.slug}/profile`)}
                    className="mt-4"
                    variant="outline"
                    size="sm"
                  >
                    View Company
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
