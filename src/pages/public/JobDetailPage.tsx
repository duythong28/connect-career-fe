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
  Heart,
  Share,
  MessageCircle,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Application, Candidate, Company, Job, User } from "@/lib/types";
import {
  mockApplications,
  mockCompanies,
  mockExtendedCandidates,
  mockJobs,
  mockUsers,
} from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { calculateMatchingScore } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { getJob } from "@/api/endpoints/jobs.api";

const JobDetailPage = () => {
  const { user } = useAuth();

  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>(mockUsers);
  const isApplied = false;
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const { data: jobData } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      return await getJob(id);
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

  const applyToJob = (jobId: string, cvId: string, coverLetter?: string) => {
    toast({
      title: "Application submitted",
      description: "Your application has been sent to the employer.",
    });
  };

  const handleApply = () => {
    if (!selectedCvId) {
      toast({
        title: "Please select a CV",
        description: "You must select a CV to apply for this job.",
        variant: "destructive",
      });
      return;
    }

    setShowApplyModal(false);
    setSelectedCvId("");
    setCoverLetter("");
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const formatJobDescription = (html: string) => {
    // Create a temporary DOM element to parse HTML properly
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Extract only the main content div
    const mainContent = tempDiv.querySelector(".show-more-less-html__markup");

    if (!mainContent) {
      // Fallback if structure is different
      return html
        .replace(/<button[^>]*>.*?<\/button>/gs, "")
        .replace(/<icon[^>]*>.*?<\/icon>/gs, "")
        .replace(/class="[^"]*"/g, "")
        .replace(/<section[^>]*>/g, "<div>")
        .replace(/<\/section>/g, "</div>");
    }

    return (
      mainContent.innerHTML
        // Remove LinkedIn specific classes
        .replace(/class="[^"]*"/g, "")
        // Clean up HTML entities
        .replace(/&apos;/g, "'")
        .replace(/&#x2019;/g, "'")
        // Ensure proper list formatting
        .replace(/<li>\s*/g, "<li>")
        .replace(/\s*<\/li>/g, "</li>")
        // Fix spacing issues
        .replace(/<br><br>/g, "</p><p>")
        .trim()
    );
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
                      <AvatarImage src={jobData.companyLogo} />
                      <AvatarFallback className="text-2xl">
                        {jobData.companyName.charAt(0)}
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
                    {/* <Markdown content={jobData.description} /> */}
                    <div
                      className="prose prose-sm max-w-none text-gray-700 
               [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6
               [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-5
               [&>h3]:text-base [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4
               [&>p]:mb-4 [&>p]:leading-relaxed
               [&>ul]:mb-4 [&>ul]:pl-6 [&>ul]:list-disc [&>ul]:space-y-2
               [&>ol]:mb-4 [&>ol]:pl-6 [&>ol]:list-decimal [&>ol]:space-y-2
               [&>li]:mb-1 [&>li]:leading-relaxed
               [&>strong]:font-semibold [&>strong]:text-gray-900
               [&>br]:mb-2
               [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800
               [&_div]:mb-3
               [&_.show-more-less-html__markup]:space-y-3
               [&_section]:space-y-4"
                      dangerouslySetInnerHTML={{
                        __html: formatJobDescription(jobData.description),
                      }}
                    />
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
                  <Button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full mb-4"
                    size="lg"
                  >
                    Apply for this Job
                  </Button>
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
                      {stripHtml(jobData.description).substring(0, 150)}
                      {stripHtml(jobData.description).length > 150 && "..."}
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

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for {jobData.title}</DialogTitle>
            <DialogDescription>
              Submit your application to {jobData.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Select CV
              </Label>
              {/* <RadioGroup value={selectedCvId} onValueChange={setSelectedCvId}>
                {candidate?.cvs.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    <RadioGroupItem value={cv.id} id={cv.id} />
                    <Label htmlFor={cv.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cv.name}</p>
                          <p className="text-sm text-gray-600">
                            Uploaded {cv.uploadedAt}
                          </p>
                        </div>
                        {cv.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup> */}
            </div>

            <div>
              <Label
                htmlFor="coverLetter"
                className="text-base font-medium mb-3 block"
              >
                Cover Letter (Optional)
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell the employer why you're interested in this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowApplyModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleApply}>Submit Application</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetailPage;
