import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MapPin,
  DollarSign,
  Clock,
  Eye,
  CheckCircle,
  Filter,
  Heart,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getCandidateJobs } from "@/api/endpoints/jobs.api";
import { JobFilters } from "@/api/types/jobs.types";

const JobSearchPage = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<JobFilters>({
    search: "",
    location: "",
    type: undefined,
    salaryMin: 0,
    salaryMax: 200000,
    industry: undefined,
    seniorityLevel: "",
    page: 1,
    limit: 20,
  });

  const {
    data: jobsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", searchFilters],
    queryFn: () => getCandidateJobs(searchFilters),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load jobs",
        description: "There was an error loading jobs. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Keyword</Label>
                  <Input
                    placeholder="Job title, skills..."
                    value={searchFilters.search ?? ""}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                        page: 1,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="City, state, or remote"
                    value={searchFilters.location ?? ""}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        location: e.target.value,
                        page: 1,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Job Type</Label>
                  <Select
                    value={searchFilters.type ?? ""}
                    onValueChange={(value) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        type: value,
                        page: 1,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Industry</Label>
                  <Select
                    value={searchFilters.industry ?? ""}
                    onValueChange={(value) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        industry: value,
                        page: 1,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="AI & Machine Learning">
                        AI & Machine Learning
                      </SelectItem>
                      <SelectItem value="Design & Creative">
                        Design & Creative
                      </SelectItem>
                      <SelectItem value="Financial Services">
                        Financial Services
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Salary Range</Label>
                  <div className="px-2 py-4">
                    <Slider
                      value={[
                        searchFilters.salaryMin ?? 0,
                        searchFilters.salaryMax ?? 200000,
                      ]}
                      onValueChange={(value) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          salaryMin: value[0],
                          salaryMax: value[1],
                          page: 1,
                        }))
                      }
                      max={200000}
                      min={0}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>
                        ${(searchFilters.salaryMin ?? 0).toLocaleString()}
                      </span>
                      <span>
                        ${(searchFilters.salaryMax ?? 200000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      search: "",
                      location: "",
                      type: undefined,
                      salaryMin: 0,
                      salaryMax: 200000,
                      industry: undefined,
                      seniorityLevel: "",
                      page: 1,
                      limit: prev?.limit ?? 20,
                    }))
                  }
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Jobs for Candidates */}
            {/* {candidate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Recommended for You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getRecommendedJobs(candidate.id)
                      .slice(0, 3)
                      .map((job) => {
                        const company = companies.find(
                          (c) => c.id === job.companyId
                        );
                        return (
                          <div
                            key={job.id}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">
                                {job.title}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {job.matchScore}% match
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              {company?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {job.location}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>

          {/* Job Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {jobsData?.total || 0} Jobs Found
              </h1>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="date">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {jobsData?.data &&
                jobsData?.data?.map((job) => {
                  const isApplied = false;
                  const isSaved = false;

                  return (
                    <Card
                      key={job.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={job.companyLogo} />
                              <AvatarFallback>
                                {job?.companyName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {job.title}
                                  </h3>
                                  <p className="text-lg text-gray-700 mb-2">
                                    {job.companyName}
                                  </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Heart
                                      className={`h-4 w-4 ${
                                        isSaved
                                          ? "fill-red-500 text-red-500"
                                          : ""
                                      }`}
                                    />
                                  </Button>
                                  <Badge
                                    variant="secondary"
                                    className="capitalize"
                                  >
                                    {job.type}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {job.location}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  {job.salary}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {job.postedDate}
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-gray-700 line-clamp-2">
                                  {job.description
                                    .replace(/[#*]/g, "")
                                    .substring(0, 150)}
                                  ...
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {job.keywords.slice(0, 5).map((keyword) => (
                                  <Badge
                                    key={keyword}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Eye className="h-4 w-4 mr-1" />
                                    {job.views} views
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {job.applications} applicants
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                  >
                                    View Details
                                  </Button>

                                  <Button>Apply Now</Button>

                                  {isApplied && (
                                    <Button disabled variant="secondary">
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Applied
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
            {/* 
            {jobsData.total === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
