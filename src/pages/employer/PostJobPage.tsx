import React, { useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/context/OrganizationContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createRecruiterJob,
  generateJobDescription,
} from "@/api/endpoints/jobs.api";
import { GenerateJobDto, JobSeniorityLevel } from "@/api/types/jobs.types";
import { getActivePipelines } from "@/api/endpoints/pipelines.api";
import { getOrganizationById } from "@/api/endpoints/organizations.api";

const PostJobPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const { data: userOrganization } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getOrganizationById(companyId!),
    enabled: !!companyId,
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

  const { mutate: generateDescriptionMutate, isPending } = useMutation({
    mutationFn: (data: GenerateJobDto) => generateJobDescription(data),
    onSuccess: (response) => {
      console.log("Generated description:", response);
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

  // Mutation for posting job
  const postJobMutation = useMutation({
    mutationFn: (data: any) => createRecruiterJob(data),
    onSuccess: (response) => {
      toast({
        title: "Job posted successfully!",
        description: "Your job is now live.",
      });
      // Redirect to job detail page
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

  const postJob = () => {
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
    };

    postJobMutation.mutate(jobData);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-2">
            Create an attractive job posting to find the best candidates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={jobForm.title}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, title: e.target.value })
                  }
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={jobForm.location}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, location: e.target.value })
                    }
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Job Type *</Label>
                  <Select
                    value={jobForm.type}
                    onValueChange={(value) =>
                      setJobForm({ ...jobForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seniorityLevel">Level *</Label>
                  <Select
                    value={jobForm.seniorityLevel}
                    onValueChange={(value) =>
                      setJobForm({
                        ...jobForm,
                        seniorityLevel: value as JobSeniorityLevel,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                      <SelectItem value={JobSeniorityLevel.NOT_APPLICABLE}>
                        {JobSeniorityLevel.NOT_APPLICABLE}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={jobForm.salary}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, salary: e.target.value })
                    }
                    placeholder="e.g., $120,000 - $160,000"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">
                    Job Description * (Markdown supported)
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
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
                      className={`h-4 w-4 mr-2 ${
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
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Use Markdown formatting for better presentation. Include
                  responsibilities, requirements, and benefits.
                </p>
              </div>

              <div>
                <Label htmlFor="pipeline">Pipeline *</Label>
                <Select
                  value={jobForm.hiringPipelineId}
                  onValueChange={(value) =>
                    setJobForm({ ...jobForm, hiringPipelineId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines &&
                      pipelines.length > 0 &&
                      pipelines.map((pipeline) => (
                        <SelectItem key={pipeline.id} value={pipeline.id}>
                          <div className="flex flex-col">
                            <span>{pipeline.name}</span>
                            {pipeline.description && (
                              <span className="text-xs text-gray-500 truncate max-w-sm">
                                {pipeline.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {pipelines && pipelines.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No active pipelines found. Please create a pipeline first.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="keywords">Keywords * (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={keywordsInput}
                  onChange={(e) => handleKeywordsChange(e.target.value)}
                  onBlur={handleKeywordsBlur}
                  placeholder="e.g., React, JavaScript, Frontend"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Enter relevant skills or keywords separated by commas.
                </p>
              </div>

              <div>
                <Label htmlFor="conditions">
                  Critical Conditions * (comma-separated)
                </Label>
                <Input
                  id="conditions"
                  value={conditionsInput}
                  onChange={(e) => handleConditionsChange(e.target.value)}
                  onBlur={handleConditionsBlur}
                  placeholder="e.g., Next.js, AWS, 3+ years experience"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Must-have criteria for AI auto-screening and rejection.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={postJob}
                  className="flex-1"
                  disabled={postJobMutation.isPending}
                >
                  {postJobMutation.isPending ? "Posting..." : "Post Job"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex-1"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          {showPreview && (
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={userOrganization?.logoFile?.url} />
                      <AvatarFallback>
                        {userOrganization?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {jobForm.title || "Job Title"}
                      </h3>
                      <p className="text-lg text-gray-700">
                        {userOrganization?.name || "Organization Name"}
                      </p>

                      <div className="flex items-center space-x-4 mt-2 text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {jobForm.location || "Location"}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {jobForm.salary || "Salary"}
                        </span>
                      </div>

                      <Badge variant="secondary" className="mt-2 capitalize">
                        {jobForm.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    {jobForm.description ? (
                      <Markdown
                        content={jobForm.description}
                        className="prose-sm"
                      />
                    ) : (
                      <p className="text-gray-500 italic">
                        Job description will appear here...
                      </p>
                    )}
                  </div>

                  {jobForm.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <h4 className="text-lg font-medium w-full mb-2">
                        Keywords
                      </h4>
                      {jobForm.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {jobForm.conditions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <h4 className="text-lg font-medium w-full mb-2 text-red-600">
                        Critical Conditions (Must-Have)
                      </h4>
                      {jobForm.conditions.map((condition, index) => (
                        <Badge key={index} variant="destructive">
                          {condition}
                        </Badge>
                      ))}
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
