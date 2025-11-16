import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  getCandidateProfile,
  updateMyProfile,
} from "@/api/endpoints/candidates.api";
import { getMyCvs } from "@/api/endpoints/cvs.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  User as UserIcon,
  Plus,
  Edit,
  Eye,
  Briefcase,
  GraduationCap,
  FileText,
  Award as AwardIcon,
  BookOpen,
  ShieldCheck,
  Globe,
  MessageCircle,
  Pen,
} from "lucide-react";
import ProfileEditor, {
  ProfileFormValues,
} from "@/components/candidate/profile/ProfileEditor";
import AvatarEditor from "@/components/candidate/profile/AvatarEditor";
import UploadCVButton from "@/components/candidate/profile/UploadCVButton";
import { SkillsEditor } from "@/components/candidate/profile/SkillsEditor";
import RenderMarkDown from "@/components/shared/RenderMarkDown";
import { ExperienceEditor } from "@/components/candidate/profile/ExperienceEditor";
import { EducationEditor } from "@/components/candidate/profile/EducationEditor";
import { ProjectEditor } from "@/components/candidate/profile/ProjectEditor";
import { CertificationEditor } from "@/components/candidate/profile/CertificationEditor";
import { AwardEditor } from "@/components/candidate/profile/AwardEditor";
import { CandidateProfile } from "@/api/types/candidates.types";

export enum CompletionStatus {
  INCOMPLETE = "incomplete",
  PARTIAL = "partial",
  COMPLETE = "complete",
}
export const CompletionStatusLabel: Record<CompletionStatus, string> = {
  [CompletionStatus.INCOMPLETE]: "Incomplete",
  [CompletionStatus.PARTIAL]: "Partial",
  [CompletionStatus.COMPLETE]: "Complete",
};

export default function ProfileDetailTab({
  profileData,
  isMyProfile,
  editMode,
  updateProfile,
}: {
  profileData: CandidateProfile;
  isMyProfile: boolean;
  editMode: boolean;
  updateProfile: (data: any) => void;
}) {
  const [dialog, setDialog] = useState<{
    type:
      | null
      | "experience"
      | "education"
      | "project"
      | "certification"
      | "award"
      | "publication";
    open: boolean;
    initialData?: any;
  }>({ type: null, open: false, initialData: undefined });

  const handleSectionSave = (
    section: keyof CandidateProfile,
    values: any[]
  ) => {
    updateProfile({ [section]: values });
    setDialog({ type: null, open: false });
  };
  const handleSectionDelete = (section: keyof CandidateProfile, id: string) => {
    if (!profileData) return;
    const updated = (profileData[section] as any[]).filter(
      (item) => item.id !== id
    );
    updateProfile({ [section]: updated });
    setDialog({ type: null, open: false });
  };
  // --- HANDLERS ---
  const handleProfileSave = (payload: Partial<ProfileFormValues>) => {
    updateProfile(payload);
  };

  const showSection = (section: keyof CandidateProfile) =>
    isMyProfile && editMode
      ? true
      : !!profileData[section] && Array.isArray(profileData[section])
      ? (profileData[section] as any[]).length > 0
      : !!profileData[section];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Profile Info */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileEditor
            data={{
              user: {
                fullName:
                  profileData.user.fullName ||
                  `${profileData.user.firstName} ${profileData.user.lastName}`,
              },
              email: profileData.email ?? null,
              phone: profileData.phone ?? null,
              address: profileData.address ?? null,
              socialLinks: {
                linkedin: profileData.socialLinks?.linkedin ?? null,
                github: profileData.socialLinks?.github ?? null,
                portfolio: profileData.socialLinks?.portfolio ?? null,
              },
            }}
            onSave={handleProfileSave}
            isEditable={isMyProfile && editMode}
          />
          <div className="mt-2 text-xs text-gray-500">
            Status:{" "}
            {CompletionStatusLabel[
              profileData.completionStatus as CompletionStatus
            ] || profileData.completionStatus}
            <br />
            Completion: {profileData.completionPercentage}%
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      {(showSection("skills") || (isMyProfile && editMode)) && (
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkillsEditor
              skills={profileData.skills}
              isEditable={isMyProfile && editMode}
              onUpdate={(skills) => updateProfile({ skills })}
            />
          </CardContent>
        </Card>
      )}

      {/* Languages */}
      {(showSection("languages") || (isMyProfile && editMode)) && (
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            {isMyProfile && editMode ? (
              <SkillsEditor
                skills={profileData.languages}
                isEditable={true}
                onUpdate={(languages) => updateProfile({ languages })}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.languages.map((lang) => (
                  <span key={lang} className="badge badge-secondary">
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Work Experience */}
      {(showSection("workExperiences") || (isMyProfile && editMode)) && (
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Experience
              </span>
              {isMyProfile && editMode && (
                <Button
                  size="sm"
                  onClick={() =>
                    setDialog({
                      type: "experience",
                      open: true,
                      initialData: undefined,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileData.workExperiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-muted pl-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{exp.jobTitle}</h4>
                    {exp.organization && (
                      <p className="text-brand-primary font-medium">
                        {exp.organization.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {exp.startDate} -{" "}
                      {exp.isCurrent ? "Present" : exp.endDate}
                    </p>
                  </div>
                  {isMyProfile && editMode && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDialog({
                            type: "experience",
                            open: true,
                            initialData: exp,
                          })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleSectionDelete("workExperiences", exp.id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <p className="mt-2">
                  <RenderMarkDown content={exp.description || ""} />
                </p>
              </div>
            ))}
            <ExperienceEditor
              open={dialog.type === "experience" && dialog.open}
              onOpenChange={(open) => setDialog({ type: null, open })}
              initialData={dialog.initialData}
              onSubmit={(data) => {
                const current = profileData.workExperiences ?? [];
                let newExperiences = data.id
                  ? current.map((e) =>
                      e.id === data.id ? { ...e, ...data } : e
                    )
                  : [...current, data];
                handleSectionSave("workExperiences", newExperiences);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {(showSection("educations") || (isMyProfile && editMode)) && (
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> Education
              </span>
              {isMyProfile && editMode && (
                <Button
                  size="sm"
                  onClick={() =>
                    setDialog({
                      type: "education",
                      open: true,
                      initialData: undefined,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileData.educations.map((edu) => (
              <div key={edu.id} className="border-l-2 border-muted pl-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {edu.degreeType} in {edu.fieldOfStudy}
                    </h4>
                    <p className="text-brand-primary font-medium">
                      {edu.institutionName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startDate} -{" "}
                      {edu.isCurrent ? "Present" : edu.graduationDate}
                    </p>
                  </div>
                  {isMyProfile && editMode && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDialog({
                            type: "education",
                            open: true,
                            initialData: edu,
                          })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleSectionDelete("educations", edu.id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <EducationEditor
              open={dialog.type === "education" && dialog.open}
              onOpenChange={(open) => setDialog({ type: null, open })}
              initialData={dialog.initialData}
              onSubmit={(data) => {
                const current = profileData.educations ?? [];
                let newEducations = data.id
                  ? current.map((e) =>
                      e.id === data.id ? { ...e, ...data } : e
                    )
                  : [...current, data];
                handleSectionSave("educations", newEducations);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {(showSection("projects") || (isMyProfile && editMode)) && (
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Projects
              </span>
              {isMyProfile && editMode && (
                <Button
                  size="sm"
                  onClick={() =>
                    setDialog({
                      type: "project",
                      open: true,
                      initialData: undefined,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileData.projects.map((proj) => (
              <div key={proj.id} className="border-l-2 border-muted pl-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{proj.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {proj.startDate} - {proj.endDate || "Present"}
                    </p>
                    {proj.description && (
                      <p className="mt-2">{proj.description}</p>
                    )}
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline mr-2"
                      >
                        Project Link
                      </a>
                    )}
                  </div>
                  {isMyProfile && editMode && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDialog({
                            type: "project",
                            open: true,
                            initialData: proj,
                          })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSectionDelete("projects", proj.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <ProjectEditor
              open={dialog.type === "project" && dialog.open}
              onOpenChange={(open) => setDialog({ type: null, open })}
              initialData={dialog.initialData}
              onSubmit={(data) => {
                const current = profileData.projects ?? [];
                let newProjects = data.id
                  ? current.map((e) =>
                      e.id === data.id ? { ...e, ...data } : e
                    )
                  : [...current, data];
                handleSectionSave("projects", newProjects);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {(showSection("certifications") || (isMyProfile && editMode)) && (
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Certifications
              </span>
              {isMyProfile && editMode && (
                <Button
                  size="sm"
                  onClick={() =>
                    setDialog({
                      type: "certification",
                      open: true,
                      initialData: undefined,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileData.certifications.map((cert) => (
              <div key={cert.id} className="border-l-2 border-muted pl-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuingOrganization}
                      {cert.issueDate && <> | {cert.issueDate}</>}
                      {cert.expiryDate && <> - {cert.expiryDate}</>}
                    </p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-500">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline"
                      >
                        Credential Link
                      </a>
                    )}
                    {cert.description && (
                      <p className="mt-2">{cert.description}</p>
                    )}
                  </div>
                  {isMyProfile && editMode && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDialog({
                            type: "certification",
                            open: true,
                            initialData: cert,
                          })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleSectionDelete("certifications", cert.id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <CertificationEditor
              open={dialog.type === "certification" && dialog.open}
              onOpenChange={(open) => setDialog({ type: null, open })}
              initialData={dialog.initialData}
              onSubmit={(data) => {
                const current = profileData.certifications ?? [];
                let newCerts = data.id
                  ? current.map((e) =>
                      e.id === data.id ? { ...e, ...data } : e
                    )
                  : [...current, data];
                handleSectionSave("certifications", newCerts);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Awards */}
      {(showSection("awards") || (isMyProfile && editMode)) && (
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AwardIcon className="w-5 h-5" /> Awards
              </span>
              {isMyProfile && editMode && (
                <Button
                  size="sm"
                  onClick={() =>
                    setDialog({
                      type: "award",
                      open: true,
                      initialData: undefined,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileData.awards.map((award) => (
              <div key={award.id} className="border-l-2 border-muted pl-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{award.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {award.issuer} | {award.dateReceived}
                    </p>
                    {award.description && <p>{award.description}</p>}
                    {award.certificateUrl && (
                      <a
                        href={award.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline"
                      >
                        Certificate Link
                      </a>
                    )}
                  </div>
                  {isMyProfile && editMode && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDialog({
                            type: "award",
                            open: true,
                            initialData: award,
                          })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSectionDelete("awards", award.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <AwardEditor
              open={dialog.type === "award" && dialog.open}
              onOpenChange={(open) => setDialog({ type: null, open })}
              initialData={dialog.initialData}
              onSubmit={(data) => {
                const current = profileData.awards ?? [];
                let newAwards = data.id
                  ? current.map((e) =>
                      e.id === data.id ? { ...e, ...data } : e
                    )
                  : [...current, data];
                handleSectionSave("awards", newAwards);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
