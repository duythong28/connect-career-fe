import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useMutation } from "@tanstack/react-query";
import { createRecruiterJob } from "@/api/endpoints/jobs.api";

const PostJobPage = () => {
  const { user } = useAuth();
  const { myOrganizations } = useOrganization();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  // Form States (aligned with Job interface)
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    salary: "",
    type: "full-time",
    description: "",
    organizationId: "",
    keywords: [] as string[], // Added for keywords
  });

  const userOrganization = myOrganizations?.[0] || null;

  // Generate job description and keywords
  const generateJobDescription = (
    title: string,
    industry: string,
    level: string
  ): { description: string; keywords: string[] } => {
    const templates = {
      technology: {
        senior: {
          description: `# ${title}

## About the Role
We are seeking a ${title} to join our innovative technology team and drive our next generation of products.

## Key Responsibilities
- Lead technical architecture and design decisions
- Mentor junior team members
- Collaborate with cross-functional teams
- Implement best practices and coding standards
- Drive technical innovation and process improvements

## Qualifications
- 5+ years of relevant experience
- Strong technical leadership skills
- Experience with modern development practices
- Excellent communication and collaboration skills
- Bachelor's degree in Computer Science or related field

## What We Offer
- Competitive salary and equity package
- Comprehensive health benefits
- Flexible work arrangements
- Professional development opportunities
- Cutting-edge technology stack`,
          keywords: ["leadership", "architecture", "mentoring", "innovation", "development"],
        },
        mid: {
          description: `# ${title}

## Position Overview
Join our growing team as a ${title} and help build innovative solutions that impact millions of users.

## Responsibilities
- Develop and maintain high-quality software
- Collaborate with product and design teams
- Participate in code reviews and technical discussions
- Contribute to system architecture decisions
- Support junior developers

## Requirements
- 3+ years of relevant experience
- Strong problem-solving skills
- Experience with agile development
- Good communication skills
- Relevant technical degree preferred

## Benefits
- Health and dental insurance
- Professional development budget
- Flexible PTO
- Modern office environment`,
          keywords: ["software", "development", "collaboration", "agile", "problem-solving"],
        },
        junior: {
          description: `# ${title}

## Role Description
Great opportunity for a ${title} to start their career with a dynamic technology company.

## What You'll Do
- Write clean, maintainable code
- Learn from experienced team members
- Participate in team meetings and planning
- Contribute to feature development
- Grow your technical skills

## Qualifications
- 0-2 years of experience
- Strong fundamentals in programming
- Eagerness to learn and grow
- Good problem-solving abilities
- Recent graduate or bootcamp completion

## Why Join Us
- Mentorship and learning opportunities
- Collaborative team environment
- Growth potential
- Competitive entry-level compensation`,
          keywords: ["programming", "mentorship", "learning", "development", "growth"],
        },
      },
    };

    const template = templates.technology?.[level] || templates.technology.mid;
    return template;
  };

  // Mutation for posting job
  const postJobMutation = useMutation({
    mutationFn: (data: any) => createRecruiterJob(data),
    onSuccess: (response) => {
      toast({
        title: "Job posted successfully!",
        description: "Your job is now live.",
      });
      // Redirect to job detail page
      navigate(`/jobs/${response.data.id}`);
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
    if (!jobForm.title || !jobForm.description || !jobForm.organizationId || jobForm.keywords.length === 0) {
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
      description: jobForm.description,
      organizationId: jobForm.organizationId,
      keywords: jobForm.keywords,
      // Add other required fields if needed (e.g., salaryDetails, etc.)
    };

    postJobMutation.mutate(jobData);
  };

  // Handle keywords input (comma-separated)
  const handleKeywordsChange = (value: string) => {
    const keywordsArray = value.split(",").map((k) => k.trim()).filter((k) => k);
    setJobForm({ ...jobForm, keywords: keywordsArray });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
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

              <div>
                <Label htmlFor="organization">Organization *</Label>
                <Select
                  value={jobForm.organizationId}
                  onValueChange={(value) =>
                    setJobForm({ ...jobForm, organizationId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOrganization && (
                      <SelectItem value={userOrganization.id}>
                        {userOrganization.name}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
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

              <div>
                <Label htmlFor="keywords">Keywords * (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={jobForm.keywords.join(", ")}
                  onChange={(e) => handleKeywordsChange(e.target.value)}
                  placeholder="e.g., React, JavaScript, Frontend"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Enter relevant skills or keywords separated by commas.
                </p>
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
                      const generated = generateJobDescription(
                        jobForm.title || "Software Developer",
                        "technology",
                        "senior"
                      );
                      setJobForm({
                        ...jobForm,
                        description: generated.description,
                        keywords: generated.keywords,
                      });
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
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

                  <div className="flex flex-wrap gap-2">
                    <h4 className="text-lg font-medium w-full mb-2">
                      Required Skills
                    </h4>
                    {jobForm.keywords.length > 0 ? (
                      jobForm.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No keywords added yet.</p>
                    )}
                  </div>
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