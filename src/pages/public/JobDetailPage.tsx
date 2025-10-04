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

const JobDetailPage = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [candidates] = useState<Candidate[]>(
    mockExtendedCandidates as Candidate[]
  );
  const [users, setUsers] = useState<User[]>(mockUsers);
  const job = jobs.find((j) => j.id === id);
  const company = job ? companies.find((c) => c.id === job.companyId) : null;
  const employer = job ? users.find((u) => u.id === job.employerId) : null;
  const candidate = candidates.find((c) => c.userId === user?.id);
  const isApplied = applications.some(
    (app) => app.jobId === job?.id && app.candidateId === candidate?.id
  );
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  if (!job || !company) {
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

  const handleApply = () => {
    if (!selectedCvId) {
      toast({
        title: "Please select a CV",
        description: "You must select a CV to apply for this job.",
        variant: "destructive",
      });
      return;
    }

    applyToJob(job.id, selectedCvId, coverLetter);
    setShowApplyModal(false);
    setSelectedCvId("");
    setCoverLetter("");
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
                      <AvatarImage src={company.logo} />
                      <AvatarFallback className="text-2xl">
                        {company.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {job.title}
                      </CardTitle>
                      <p className="text-xl text-gray-700 mb-2">
                        {company.name}
                      </p>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </span>
                        <Badge variant="secondary" className="capitalize">
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    {candidate && (
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted {job.postedDate}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {job.views} views
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {job.applications} applicants
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Job Description
                    </h3>
                    <Markdown content={job.description} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <h4 className="text-lg font-medium w-full mb-2">
                      Required Skills
                    </h4>
                    {job.keywords.map((keyword) => (
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
                {candidate && !isApplied ? (
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
                    <span className="font-medium">{job.applications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium capitalize">{job.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{job.postedDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 text-sm mb-4">
                      {company.description
                        .replace(/[#*]/g, "")
                        .substring(0, 150)}
                      ...
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Industry</span>
                      <span className="font-medium">{company.industry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Company Size</span>
                      <span className="font-medium">{company.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">
                        {company.headquarters}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/companies/${company.slug}`)}
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
            {employer && (
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
            )}

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Submit your application to {company.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Select CV
              </Label>
              <RadioGroup value={selectedCvId} onValueChange={setSelectedCvId}>
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
              </RadioGroup>
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
