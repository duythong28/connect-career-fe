import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Eye,
  CheckCircle,
  Filter,
  Heart,
  Target,
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
import { Application, Candidate, Company, Job } from "@/lib/types";
import {
  mockApplications,
  mockCandidates,
  mockCompanies,
  mockJobs,
} from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { calculateMatchingScore } from "@/lib/helpers";

const JobSearchPage = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    location: "",
    type: "",
    salaryRange: [0, 200000],
    industry: "",
  });

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
  const filteredJobs = getFilteredJobs();
  const candidate = candidates.find((c) => c.userId === user?.id);

  const getRecommendedJobs = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return [];

    return jobs
      .filter((job) => job.status === "active")
      .map((job) => ({
        ...job,
        matchScore: calculateMatchingScore(
          candidate.skills,
          job.keywords,
          candidate.experience.length
        ),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  };
  const applyToJob = (jobId: string, cvId: string, coverLetter?: string) => {
    const candidate = candidates.find((c) => c.userId === user?.id);
    if (!candidate) return;

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const matchingScore = calculateMatchingScore(
      candidate.skills,
      job.keywords,
      candidate.experience.length
    );

    const newApplication: Application = {
      id: `app${applications.length + 1}`,
      jobId,
      candidateId: candidate.id,
      status: "New",
      appliedDate: new Date().toISOString().split("T")[0],
      cvId,
      coverLetter,
      matchingScore,
    };

    setApplications([...applications, newApplication]);
    setJobs(
      jobs.map((j) =>
        j.id === jobId ? { ...j, applications: j.applications + 1 } : j
      )
    );

    toast({
      title: "Application submitted",
      description: "Your application has been sent to the employer.",
    });
  };
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
                    value={searchFilters.keyword}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        keyword: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="City, state, or remote"
                    value={searchFilters.location}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        location: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Job Type</Label>
                  <Select
                    value={searchFilters.type}
                    onValueChange={(value) =>
                      setSearchFilters({ ...searchFilters, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
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
                </div>

                <div>
                  <Label>Industry</Label>
                  <Select
                    value={searchFilters.industry}
                    onValueChange={(value) =>
                      setSearchFilters({ ...searchFilters, industry: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All industries</SelectItem>
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
                      value={searchFilters.salaryRange}
                      onValueChange={(value) =>
                        setSearchFilters({
                          ...searchFilters,
                          salaryRange: value,
                        })
                      }
                      max={200000}
                      min={0}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>
                        ${searchFilters.salaryRange[0].toLocaleString()}
                      </span>
                      <span>
                        ${searchFilters.salaryRange[1].toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    setSearchFilters({
                      keyword: "",
                      location: "",
                      type: "",
                      salaryRange: [0, 200000],
                      industry: "",
                    })
                  }
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Jobs for Candidates */}
            {candidate && (
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
            )}
          </div>

          {/* Job Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {filteredJobs.length} Jobs Found
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
              {filteredJobs.map((job) => {
                const company = companies.find((c) => c.id === job.companyId);
                const isApplied = applications.some(
                  (app) =>
                    app.jobId === job.id && app.candidateId === candidate?.id
                );
                const isSaved = candidate?.savedJobs.includes(job.id);

                return (
                  <Card
                    key={job.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={company?.logo} />
                            <AvatarFallback>
                              {company?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                  {job.title}
                                </h3>
                                <p className="text-lg text-gray-700 mb-2">
                                  {company?.name}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2">
                                {candidate && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedCandidates = candidates.map(
                                        (c) =>
                                          c.id === candidate.id
                                            ? {
                                                ...c,
                                                savedJobs: isSaved
                                                  ? c.savedJobs.filter(
                                                      (id) => id !== job.id
                                                    )
                                                  : [...c.savedJobs, job.id],
                                              }
                                            : c
                                      );
                                      setCandidates(updatedCandidates);
                                      toast({
                                        title: isSaved
                                          ? "Job unsaved"
                                          : "Job saved",
                                        description: isSaved
                                          ? "Removed from saved jobs"
                                          : "Added to saved jobs",
                                      });
                                    }}
                                  >
                                    <Heart
                                      className={`h-4 w-4 ${
                                        isSaved
                                          ? "fill-red-500 text-red-500"
                                          : ""
                                      }`}
                                    />
                                  </Button>
                                )}
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

                                {candidate && !isApplied && (
                                  <Button
                                    onClick={() => {
                                      if (candidate.cvs.length === 0) {
                                        toast({
                                          title: "No CV uploaded",
                                          description:
                                            "Please upload a CV before applying to jobs.",
                                          variant: "destructive",
                                        });
                                        return;
                                      }
                                      applyToJob(
                                        job.id,
                                        candidate.cvs.find((cv) => cv.isDefault)
                                          ?.id || candidate.cvs[0].id
                                      );
                                    }}
                                  >
                                    Apply Now
                                  </Button>
                                )}

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

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
