import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  DollarSign,
  Clock,
  Eye,
  Globe,
  CheckCircle,
  ArrowLeft,
  Share,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCandidateJobById } from "@/api/endpoints/jobs.api";
import RenderMarkDown from "@/components/shared/RenderMarkDown";
import ApplyJobDialog from "@/components/candidate/applications/ApplyJobDialog";

const JobDetailPage = () => {
  const { user } = useAuth();

  const { id } = useParams();
  const navigate = useNavigate();
  const isApplied = false;
  const { data: jobData } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      return await getCandidateJobById(id);
    },
  });

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job not found
          </h2>
          <Button onClick={() => navigate("/jobs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={jobData?.companyLogo} />
                      <AvatarFallback className="text-2xl">
                        {jobData?.companyName?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {jobData.title}
                      </CardTitle>
                      <p className="text-xl text-gray-700 mb-2">
                        {jobData.companyName}
                      </p>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {jobData.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {jobData.salary}
                        </span>
                        <Badge variant="secondary" className="capitalize">
                          {jobData.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    {/* {candidate && (
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    )} */}
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted {jobData.postedDate}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {jobData.views} views
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {jobData.applications} applicants
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Job Description
                    </h3>
                    <RenderMarkDown content={jobData.description} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <h4 className="text-lg font-medium w-full mb-2">
                      Required Skills
                    </h4>
                    {jobData.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Actions */}
            <Card>
              <CardContent className="p-6">
                {user && !isApplied ? (
                  <div className="mb-4">
                    <ApplyJobDialog jobId={id ?? ""} />
                  </div>
                ) : isApplied ? (
                  <Button disabled className="w-full mb-4" size="lg">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Application Submitted
                  </Button>
                ) : (
                  <Button
                    // onClick={() => setShowLogin(true)}
                    className="w-full mb-4"
                    size="lg"
                  >
                    Login to Apply
                  </Button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Applicants</span>
                    <span className="font-medium">{jobData.applications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium capitalize">
                      {jobData.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{jobData.postedDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {jobData.companyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    {/* <p className="text-gray-700 text-sm mb-4">
                      {jobData.description
                        .replace(/[#*]/g, "")
                        .substring(0, 150)}
                      ...
                    </p> */}
                    <p className="text-gray-700 text-sm mb-4">
                      {stripHtml(
                        jobData.organization.shortDescription
                      ).substring(0, 150)}
                      {stripHtml(jobData.organization.shortDescription).length >
                        150 && "..."}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Industry</span>
                      <span className="font-medium">
                        {jobData.organization.industryId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Company Size</span>
                      <span className="font-medium">
                        {jobData.organization.organizationSize}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">
                        {jobData.organization.headquartersAddress}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/companies/${jobData.organizationId}`)
                      }
                      className="flex-1"
                    >
                      View Company
                    </Button>
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recruiter Info */}
            {/* {employer && (
              <Card>
                <CardHeader>
                  <CardTitle>Recruiter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarImage src={employer.avatar} />
                      <AvatarFallback>{employer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employer.name}</p>
                      <p className="text-sm text-gray-600">HR Manager</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/recruiters/${employer.id}`)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Recruiter
                  </Button>
                </CardContent>
              </Card>
            )} */}

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              {/* <CardContent>
                <div className="space-y-3">
                  {jobs
                    .filter(
                      (j) =>
                        j.id !== job.id &&
                        j.status === "active" &&
                        j.companyId === job.companyId
                    )
                    .slice(0, 3)
                    .map((similarJob) => (
                      <div
                        key={similarJob.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/jobs/${similarJob.id}`)}
                      >
                        <h4 className="font-medium text-sm mb-1">
                          {similarJob.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {similarJob.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          {similarJob.salary}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent> */}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
