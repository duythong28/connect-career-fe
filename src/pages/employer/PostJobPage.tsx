import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createRecruiterJob,
  generateJobDescription,
  getCandidateJobById,
  updateRecruiterJob,
} from "@/api/endpoints/jobs.api";
import {
  GenerateJobDto,
  JobSeniorityLevel,
  JobStatus,
} from "@/api/types/jobs.types";
import { getActivePipelines } from "@/api/endpoints/pipelines.api";
import { getOrganizationById } from "@/api/endpoints/organizations.api";

const PostJobPage = () => {
  const { companyId, jobId } = useParams();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const { data: userOrganization } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getOrganizationById(companyId!),
    enabled: !!companyId,
  });

  const { data: editingJob } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getCandidateJobById(jobId!),
    enabled: !!jobId,
  });

  const { data: pipelines } = useQuery({
    queryKey: ["active-pipelines", companyId],
    queryFn: async () => {
      return getActivePipelines(companyId);
    },
    enabled: !!companyId,
  });

  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    salary: "",
    type: "full_time",
    seniorityLevel: JobSeniorityLevel.MID_SENIOR,
    description: "",
    organizationId: companyId || "",
    hiringPipelineId: "",
    keywords: [] as string[],
    conditions: [] as string[],
  });

  const [keywordsInput, setKeywordsInput] = useState("");
  const [conditionsInput, setConditionsInput] = useState("");

  useEffect(() => {
    if (editingJob) {
      setJobForm({
        title: editingJob.title,
        location: editingJob.location,
        salary: editingJob.salary,
        type: editingJob.type,
        seniorityLevel: editingJob.seniorityLevel,
        description: editingJob.description,
        organizationId: editingJob.organizationId,
        hiringPipelineId: editingJob.hiringPipelineId,
        keywords: editingJob.keywords || [],
        conditions: editingJob.requirements || [],
      });
      setKeywordsInput((editingJob.keywords || []).join(", "));
      setConditionsInput((editingJob.requirements || []).join(", "));
    }
  }, [editingJob]);

  const { mutate: generateDescriptionMutate, isPending } = useMutation({
    mutationFn: (data: GenerateJobDto) => generateJobDescription(data),
    onSuccess: (response) => {
      setJobForm({
        ...jobForm,
        description: response?.data?.description || "",
        keywords: response?.data?.keywords || [],
      });
      setKeywordsInput((response?.data?.keywords || []).join(", "));

      toast({
        title: "Job description generated",
        description: "The job description has been generated successfully.",
      });
    },
  });

  const postJobMutation = useMutation({
    mutationFn: (data: any) => createRecruiterJob(data),
    onSuccess: (response) => {
      toast({
        title: "Job created successfully!",
        description: "Your job is now created.",
      });
      navigate(`/jobs/${response.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error posting job",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ jobId, jobData }: { jobId: string; jobData: any }) =>
      updateRecruiterJob(jobId, jobData),
    onSuccess: (response) => {
      toast({
        title: "Job updated successfully!",
        description: "Your job has been updated.",
      });
      navigate(`/jobs/${response.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error updating job",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const postJob = (status: JobStatus) => {
    if (
      !jobForm.title ||
      !jobForm.description ||
      !jobForm.organizationId ||
      !jobForm.hiringPipelineId ||
      jobForm.keywords.length === 0 ||
      jobForm.conditions.length === 0
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields, including keywords.",
        variant: "destructive",
      });
      return;
    }

    const jobData = {
      title: jobForm.title,
      location: jobForm.location,
      salary: jobForm.salary,
      type: jobForm.type,
      seniorityLevel: jobForm.seniorityLevel,
      description: jobForm.description,
      organizationId: jobForm.organizationId,
      hiringPipelineId: jobForm.hiringPipelineId,
      keywords: jobForm.keywords,
      requirements: jobForm.conditions,
      status,
    };

    if (jobId) {
      updateJobMutation.mutate({ jobId, jobData });
    } else {
      postJobMutation.mutate(jobData);
    }
  };

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
  };

  const handleKeywordsBlur = () => {
    const keywordsArray = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);
    setJobForm({ ...jobForm, keywords: keywordsArray });
  };

  const handleConditionsChange = (value: string) => {
    setConditionsInput(value);
  };

  const handleConditionsBlur = () => {
    const conditionsArray = conditionsInput
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);
    setJobForm({ ...jobForm, conditions: conditionsArray });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Create an attractive job posting to find the best candidates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <Card className="rounded-3xl border-border bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase text-muted-foreground">
                  Job Title *
                </Label>
                <Input
                  id="title"
                  className="rounded-xl border-border focus:ring-2 focus:ring-primary h-10"
                  value={jobForm.title}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, title: e.target.value })
                  }
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-bold uppercase text-muted-foreground">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    className="rounded-xl border-border focus:ring-2 focus:ring-primary h-10"
                    value={jobForm.location}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, location: e.target.value })
                    }
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-bold uppercase text-muted-foreground">
                    Job Type *
                  </Label>
                  <Select
                    value={jobForm.type}
                    onValueChange={(value) =>
                      setJobForm({ ...jobForm, type: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-border h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seniorityLevel" className="text-xs font-bold uppercase text-muted-foreground">
                    Level *
                  </Label>
                  <Select
                    value={jobForm.seniorityLevel}
                    onValueChange={(value) =>
                      setJobForm({
                        ...jobForm,
                        seniorityLevel: value as JobSeniorityLevel,
                      })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-border h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value={JobSeniorityLevel.ENTRY_LEVEL}>
                        {JobSeniorityLevel.ENTRY_LEVEL}
                      </SelectItem>
                      <SelectItem value={JobSeniorityLevel.MID_SENIOR}>
                        {JobSeniorityLevel.MID_SENIOR}
                      </SelectItem>
                      <SelectItem value={JobSeniorityLevel.DIRECTOR}>
                        {JobSeniorityLevel.DIRECTOR}
                      </SelectItem>
                      <SelectItem value={JobSeniorityLevel.EXECUTIVE}>
                        {JobSeniorityLevel.EXECUTIVE}
                      </SelectItem>
                      <SelectItem value={JobSeniorityLevel.ASSOCIATE}>
                        {JobSeniorityLevel.ASSOCIATE}
                      </SelectItem>
                      <SelectItem value={JobSeniorityLevel.INTERNSHIP}>
                        {JobSeniorityLevel.INTERNSHIP}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-xs font-bold uppercase text-muted-foreground">
                    Salary Range
                  </Label>
                  <Input
                    id="salary"
                    className="rounded-xl border-border focus:ring-2 focus:ring-primary h-10"
                    value={jobForm.salary}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, salary: e.target.value })
                    }
                    placeholder="e.g., $120,000 - $160,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="description" className="text-xs font-bold uppercase text-muted-foreground">
                    Job Description * (Markdown supported)
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-xl text-xs font-bold uppercase"
                    onClick={() => {
                      generateDescriptionMutate({
                        title: jobForm.title,
                        jobType: jobForm.type,
                        location: jobForm.location,
                        companyName: userOrganization?.name || "",
                        seniorityLevel: jobForm.seniorityLevel,
                        companyDescription:
                          userOrganization?.shortDescription || "",
                      });
                    }}
                    disabled={
                      !jobForm.title ||
                      !jobForm.seniorityLevel ||
                      !jobForm.type ||
                      !jobForm.location ||
                      isPending
                    }
                  >
                    <Sparkles
                      className={`h-3.5 w-3.5 mr-2 text-primary ${
                        isPending ? "animate-spin" : ""
                      }`}
                    />
                    {isPending ? "Generating..." : "Generate"}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={jobForm.description}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, description: e.target.value })
                  }
                  placeholder="## About the Role&#10;We are looking for...&#10;&#10;## Responsibilities&#10;- Develop and maintain...&#10;- Collaborate with teams...&#10;&#10;## Requirements&#10;- 3+ years of experience&#10;- Strong skills in..."
                  rows={10}
                  className="rounded-xl border-border focus:ring-2 focus:ring-primary text-sm leading-relaxed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use Markdown formatting for better presentation. Include
                  responsibilities, requirements, and benefits.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pipeline" className="text-xs font-bold uppercase text-muted-foreground">
                  Pipeline *
                </Label>
                <Select
                  value={jobForm.hiringPipelineId}
                  onValueChange={(value) =>
                    setJobForm({ ...jobForm, hiringPipelineId: value })
                  }
                >
                  <SelectTrigger className="rounded-xl border-border h-10">
                    <SelectValue placeholder="Select pipeline" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {pipelines &&
                      pipelines.length > 0 &&
                      pipelines.map((pipeline) => (
                        <SelectItem key={pipeline.id} value={pipeline.id}>
                          <div className="flex flex-col">
                            <span className="font-semibold">{pipeline.name}</span>
                            {pipeline.description && (
                              <span className="text-xs text-muted-foreground truncate max-w-sm">
                                {pipeline.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {pipelines && pipelines.length === 0 && (
                  <p className="text-xs text-destructive mt-1 font-semibold">
                    No active pipelines found. Please create a pipeline first.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-xs font-bold uppercase text-muted-foreground">
                  Keywords * (comma-separated)
                </Label>
                <Input
                  id="keywords"
                  className="rounded-xl border-border focus:ring-2 focus:ring-primary h-10"
                  value={keywordsInput}
                  onChange={(e) => handleKeywordsChange(e.target.value)}
                  onBlur={handleKeywordsBlur}
                  placeholder="e.g., React, JavaScript, Frontend"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter relevant skills or keywords separated by commas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions" className="text-xs font-bold uppercase text-muted-foreground">
                  Critical Conditions * (comma-separated)
                </Label>
                <Input
                  id="conditions"
                  className="rounded-xl border-border focus:ring-2 focus:ring-primary h-10"
                  value={conditionsInput}
                  onChange={(e) => handleConditionsChange(e.target.value)}
                  onBlur={handleConditionsBlur}
                  placeholder="e.g., Next.js, AWS, 3+ years experience"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must-have criteria for AI auto-screening and rejection.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                <Button
                  onClick={() => postJob(JobStatus.ACTIVE)}
                  className="w-full sm:flex-1 h-10 rounded-xl text-xs font-bold uppercase"
                  disabled={postJobMutation.isPending}
                  variant="default"
                >
                  {postJobMutation.isPending ? "Posting..." : "Publish Job"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => postJob(JobStatus.DRAFT)}
                  className="w-full sm:flex-1 h-10 rounded-xl text-xs font-bold uppercase"
                  disabled={postJobMutation.isPending}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full sm:flex-1 h-10 rounded-xl text-xs font-bold uppercase"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          {showPreview && (
            <Card className="rounded-3xl border-border bg-card shadow-none lg:sticky lg:top-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 rounded-2xl border border-border">
                      <AvatarImage src={userOrganization?.logoFile?.url} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {userOrganization?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-foreground truncate">
                        {jobForm.title || "Job Title"}
                      </h3>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {userOrganization?.name || "Organization Name"}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-muted-foreground">
                        <span className="flex items-center text-xs font-medium">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                          {jobForm.location || "Location"}
                        </span>
                        <span className="flex items-center text-xs font-medium">
                          <DollarSign className="h-3.5 w-3.5 mr-1 text-primary" />
                          {jobForm.salary || "Salary"}
                        </span>
                      </div>

                      <Badge variant="secondary" className="mt-4 capitalize rounded-lg text-[10px] font-bold px-2 py-0.5">
                        {jobForm.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    {jobForm.description ? (
                      <div className="text-foreground">
                        <Markdown
                          content={jobForm.description}
                          className="prose prose-sm max-w-none"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Job description will appear here...
                      </p>
                    )}
                  </div>

                  {jobForm.keywords.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                        Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {jobForm.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="rounded-lg border-border bg-secondary/30 text-[10px] font-semibold px-2 py-0.5">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {jobForm.conditions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase text-destructive tracking-wider">
                        Critical Conditions (Must-Have)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {jobForm.conditions.map((condition, index) => (
                          <Badge key={index} variant="destructive" className="rounded-lg text-[10px] font-bold px-2 py-0.5">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;