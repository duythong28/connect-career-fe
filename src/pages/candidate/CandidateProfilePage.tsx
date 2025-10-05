import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  Award,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  ArrowLeft,
  Download,
  Upload,
  Edit,
  Eye,
  MessageCircle,
  Star,
  Brain,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { CandidateProfile } from "@/components/candidate/CandidateProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { maskEmail, maskPhone } from "@/lib/helpers";
import { Application, Candidate, Company, CV, Job, User } from "@/lib/types";
import {
  mockApplications,
  mockCandidates,
  mockCompanies,
  mockJobs,
  mockUsers,
} from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";

const CandidateProfilePage = () => {
  const { user } = useAuth();
  const { candidateId } = useParams();
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [users, setUsers] = useState<User[]>(mockUsers);
  if (!candidateId) {
    return <CandidateProfile />;
  }

  const targetCandidate = candidates.find(
    (c) => c.id === candidateId || c.userId === candidateId
  );
  const targetUser = targetCandidate
    ? users.find((u) => u.id === targetCandidate.userId)
    : null;
  const isOwnProfile = user?.id === targetUser?.id;
  const [editMode, setEditMode] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [showCVUpload, setShowCVUpload] = useState(false);

  // If it's the user's own profile, show the detailed profile component
  if (isOwnProfile) {
    return <CandidateProfile />;
  }
  const [showAITools, setShowAITools] = useState(false);

  if (!targetCandidate || !targetUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Candidate not found
          </h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleCVUpload = (file: File) => {
    const newCV: CV = {
      id: `cv${targetCandidate.cvs.length + 1}`,
      name: file.name,
      uploadedAt: new Date().toISOString().split("T")[0],
      contentMarkdown: `# ${
        targetUser.name
      }\n\n## Experience\n- Sample work experience\n\n## Skills\n- ${targetCandidate.skills.join(
        "\n- "
      )}`,
      isDefault: targetCandidate.cvs.length === 0,
      fileName: file.name,
      type: file.name.endsWith(".pdf")
        ? "pdf"
        : file.name.endsWith(".docx")
        ? "docx"
        : "md",
    };

    setCandidates(
      candidates.map((c) =>
        c.id === targetCandidate.id ? { ...c, cvs: [...c.cvs, newCV] } : c
      )
    );

    setShowCVUpload(false);
    toast({
      title: "CV uploaded",
      description: "Your CV has been uploaded successfully.",
    });
  };

  const getCVScore = (
    cv: CV,
    jobKeywords: string[]
  ): { score: number; strengths: string[]; weaknesses: string[] } => {
    const content = cv.contentMarkdown.toLowerCase();
    const matchedKeywords = jobKeywords.filter((keyword) =>
      content.includes(keyword.toLowerCase())
    );
    const score = Math.min(60 + matchedKeywords.length * 10, 100);

    const strengths = [
      `Matches ${matchedKeywords.length} key requirements`,
      "Well-structured resume format",
      "Relevant work experience highlighted",
    ];

    const weaknesses = [
      "Could include more specific achievements",
      "Consider adding quantifiable results",
      "Tailor skills section to job requirements",
    ];

    return {
      score,
      strengths: strengths.slice(0, 2),
      weaknesses: weaknesses.slice(0, 2),
    };
  };

  const generateCVImprovement = (
    candidate: Candidate
  ): { suggestions: string[]; improvedHeadline: string } => {
    const suggestions = [
      "Add specific metrics and achievements to quantify your impact",
      "Include relevant keywords from your target job descriptions",
      "Highlight your most recent and relevant projects prominently",
    ];

    const improvedHeadline = `${candidate.headline.split(" ")[0]} ${
      candidate.headline.split(" ")[1]
    } with proven track record in ${candidate.skills
      .slice(0, 2)
      .join(" and ")} | ${candidate.experience.length}+ years experience`;

    return { suggestions, improvedHeadline };
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
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={targetUser.avatar} />
                      <AvatarFallback className="text-2xl">
                        {targetUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {targetUser.name}
                      </h1>
                      <p className="text-xl text-gray-700 mb-4">
                        {targetCandidate.headline}
                      </p>

                      <div className="flex items-center space-x-4 text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {maskEmail(
                            targetUser.email,
                            targetUser.privacy.email || isOwnProfile
                          )}
                        </span>
                        {targetUser.phone && (
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {maskPhone(
                              targetUser.phone,
                              targetUser.privacy.phone || isOwnProfile
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {targetCandidate.skills.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                        {targetCandidate.skills.length > 6 && (
                          <Badge variant="outline">
                            +{targetCandidate.skills.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isOwnProfile ? (
                      <Button onClick={() => setEditMode(!editMode)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {editMode ? "Cancel" : "Edit Profile"}
                      </Button>
                    ) : (
                      <Button>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {targetCandidate.experience.map((exp) => (
                    <div key={exp.id} className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exp.title}
                        </h3>
                        <p className="text-gray-700 mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          {exp.startDate} -{" "}
                          {exp.current ? "Present" : exp.endDate}
                        </p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {targetCandidate.education.map((edu) => (
                    <div key={edu.id} className="flex items-start space-x-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-gray-700 mb-2">{edu.institution}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          {edu.field} • {edu.startDate} -{" "}
                          {edu.current ? "Present" : edu.endDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CVs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>CVs & Resumes</CardTitle>
                  {isOwnProfile && (
                    <Button size="sm" onClick={() => setShowCVUpload(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {targetCandidate.cvs.length > 0 ? (
                    targetCandidate.cvs.map((cv) => (
                      <div
                        key={cv.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-sm">{cv.name}</p>
                            <p className="text-xs text-gray-600">
                              Uploaded {cv.uploadedAt}
                            </p>
                            {cv.isDefault && (
                              <Badge
                                variant="secondary"
                                className="text-xs mt-1"
                              >
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCV(cv);
                              setShowCVModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No CVs uploaded yet</p>
                    </div>
                  )}
                </div>

                {isOwnProfile && targetCandidate.cvs.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setShowAITools(true)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    AI CV Tools
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {targetCandidate.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{skill}</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${
                              level <= Math.floor(Math.random() * 3) + 3
                                ? "bg-blue-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application History */}
            {isOwnProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applications
                      .filter((app) => app.candidateId === targetCandidate.id)
                      .slice(0, 3)
                      .map((app) => {
                        const job = jobs.find((j) => j.id === app.jobId);
                        const company = job
                          ? companies.find((c) => c.id === job.companyId)
                          : null;

                        return (
                          <div key={app.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">
                                {job?.title}
                              </h4>
                              <Badge
                                variant={
                                  app.status === "Hired"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              {company?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Applied {app.appliedDate}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews (for employers viewing) */}
            {!isOwnProfile && user?.role === "employer" && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        4.5
                      </div>
                      <div className="flex items-center justify-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= 4
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Based on 3 reviews
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Excellent work quality
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-3 w-3 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">TechCorp Inc.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* CV Preview Modal */}
      <Dialog open={showCVModal} onOpenChange={setShowCVModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedCV?.name}</DialogTitle>
            <DialogDescription>
              CV Preview • Uploaded {selectedCV?.uploadedAt}
            </DialogDescription>
          </DialogHeader>

          {selectedCV && (
            <div className="mt-4">
              <Markdown content={selectedCV.contentMarkdown} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CV Upload Modal */}
      <Dialog open={showCVUpload} onOpenChange={setShowCVUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload CV</DialogTitle>
            <DialogDescription>
              Upload your resume or CV in PDF, DOCX, or Markdown format
            </DialogDescription>
          </DialogHeader>

          <div className="border-dashed border-2 border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Drag and drop your CV here, or click to browse
            </p>
            <Input
              type="file"
              accept=".pdf,.docx,.md"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleCVUpload(file);
                }
              }}
              className="hidden"
              id="cv-upload"
            />
            <Label htmlFor="cv-upload">
              <Button variant="outline" className="cursor-pointer">
                Browse Files
              </Button>
            </Label>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Tools Modal */}
      <Dialog open={showAITools} onOpenChange={setShowAITools}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI CV Tools</DialogTitle>
            <DialogDescription>
              Improve your CV with AI-powered suggestions and analysis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {targetCandidate.cvs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">CV Analysis</h3>
                {targetCandidate.cvs.map((cv) => {
                  const analysis = getCVScore(cv, [
                    "React",
                    "TypeScript",
                    "JavaScript",
                  ]);
                  return (
                    <div key={cv.id} className="border rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{cv.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">
                            {analysis.score}
                          </span>
                          <span className="text-sm text-gray-600">/100</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-green-600 mb-2">
                            Strengths
                          </h5>
                          <ul className="text-sm space-y-1">
                            {analysis.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-orange-600 mb-2">
                            Suggestions
                          </h5>
                          <ul className="text-sm space-y-1">
                            {analysis.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start">
                                <Lightbulb className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">AI Improvements</h3>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Enhanced Profile Headline</h4>
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <p className="text-sm text-gray-600 mb-2">Current:</p>
                  <p className="text-sm">{targetCandidate.headline}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-600 mb-2">AI Suggested:</p>
                  <p className="text-sm">
                    {generateCVImprovement(targetCandidate).improvedHeadline}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4 mt-4">
                <h4 className="font-medium mb-3">Improvement Suggestions</h4>
                <ul className="space-y-2">
                  {generateCVImprovement(targetCandidate).suggestions.map(
                    (suggestion, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Sparkles className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateProfilePage;
