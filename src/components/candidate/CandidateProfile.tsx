import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Plus,
  Edit,
  Briefcase,
  GraduationCap,
  FileText,
  Eye,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
} from "@/api/endpoints/candidates.api";
import { getMyCvs } from "@/api/endpoints/cvs.api";
import { useAuth } from "@/hooks/useAuth";
import { SkillsEditor } from "./profile/SkillsEditor";
import RenderMarkDown from "../shared/RenderMarkDown";
import {
  EducationEditor,
  EducationFormValues,
} from "./profile/EducationEditor";
import {
  ExperienceEditor,
  ExperienceFormValues as ExperienceFormValuesFromEditor,
} from "./profile/ExperienceEditor";
import ProfileEditor, { ProfileFormValues } from "./profile/ProfileEditor";
import AvatarEditor from "./profile/AvatarEditor";
import UploadCVButton from "./profile/UploadCVButton";

export function CandidateProfile() {
  const [isMyProfile, setIsMyProfile] = useState(true);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<
    EducationFormValues | undefined
  >(undefined);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<
    ExperienceFormValuesFromEditor | undefined
  >(undefined);
  const { user } = useAuth();

  const { mutate: createProfileMutate } = useMutation({
    mutationFn: ({ email, userId }: { email: string; userId: string }) =>
      createMyProfile({ email, userId }),
  });

  const {
    data: profileData,
    error,
    refetch,
  } = useQuery({
    queryKey: ["candidateProfile"],
    queryFn: async () => {
      return getMyProfile();
    },
  });

  useEffect(() => {
    if (error) {
      createProfileMutate(
        { email: user?.email || "", userId: user.id },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
  }, [error]);

  const queryClient = useQueryClient();

  const { mutate, isPending: isSkillsUpdating } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });

  const { mutate: mutateEducation, isPending: isEducationUpdating } =
    useMutation({
      mutationFn: async (data: EducationFormValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null)
            formData.append(key, String(value));
        });
        return data.id ? updateMyProfile(formData) : updateMyProfile(formData);
      },
      onSuccess: () => {
        toast({
          title: "Education saved",
          description: "Your education has been updated.",
        });
        queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      },
    });
  const { data: cvsData } = useQuery({
    queryKey: ["candidateCvs"],
    queryFn: async () => {
      return getMyCvs();
    },
  });

  const handleEducationSubmit = (data: EducationFormValues) => {
    const current = profileData.educations ?? [];
    let newEducations: (EducationFormValues & { id?: string })[] = [];

    if (data.id) {
      newEducations = current.map((e) =>
        e.id === data.id ? { ...e, ...data } : e
      );
    } else {
      newEducations = [...current, data];
    }

    mutate({ educations: newEducations });
    setSelectedEducation(undefined);
    setEducationDialogOpen(false);
  };

  const handleDeleteEducation = (id: string) => {
    const current = profileData.educations ?? [];
    const newEducations = current.filter((e) => e.id !== id);
    mutate({ educations: newEducations });
    toast({ title: "Education deleted" });
    queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
  };

  if (!profileData) return <div>Loading...</div>;

  const handleSkillsUpdate = (skills: string[]) => {
    const payload = {
      skills: skills,
    };

    mutate(payload);
  };

  const handleExperienceSubmit = (data: ExperienceFormValuesFromEditor) => {
    const current = profileData.workExperiences ?? [];
    let newExperiences: (ExperienceFormValuesFromEditor & { id?: string })[] =
      [];

    if (data.id) {
      newExperiences = current.map((e) =>
        e.id === data.id ? { ...e, ...data } : e
      );
    } else {
      newExperiences = [...current, data];
    }

    mutate({ workExperiences: newExperiences });
    setSelectedExperience(undefined);
    setExperienceDialogOpen(false);
  };

  const handleDeleteExperience = (id: string) => {
    const current = profileData.workExperiences ?? [];
    const newExperiences = current.filter((e) => e.id !== id);

    mutate({ workExperiences: newExperiences });
    toast({ title: "Experience deleted" });
    queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
  };

  const handleProfileSave = (payload: Partial<ProfileFormValues>) => {
    mutate(payload);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profileData.user.avatarUrl ?? undefined} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>

                {isMyProfile && (
                  <AvatarEditor
                    currentUrl={profileData.user.avatarUrl}
                    onUploaded={(url) => {
                      queryClient.invalidateQueries({
                        queryKey: ["candidateProfile"],
                      });
                    }}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileEditor
                data={{
                  user: {
                    fullName: `${profileData.user.firstName} ${profileData.user.lastName}`,
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
                isEditable={isMyProfile}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsEditor
                skills={profileData.skills}
                isEditable={isMyProfile}
                onUpdate={handleSkillsUpdate}
              />
              {isSkillsUpdating && <div>Updating skills...</div>}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Experience
                </div>
                {isMyProfile && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedExperience(undefined);
                      setExperienceDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.workExperiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-muted pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{exp.jobTitle}</h4>
                      <p className="text-brand-primary font-medium">
                        {exp.organizationId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exp.startDate} -{" "}
                        {exp.isCurrent ? "Present" : exp.endDate}
                      </p>
                    </div>
                    {isMyProfile && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedExperience(
                              exp as ExperienceFormValuesFromEditor
                            );
                            setExperienceDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteExperience(exp.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="mt-2">
                    <RenderMarkDown content={exp.description} />
                  </p>
                </div>
              ))}
              <ExperienceEditor
                open={experienceDialogOpen}
                onOpenChange={setExperienceDialogOpen}
                initialData={selectedExperience}
                onSubmit={handleExperienceSubmit}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </div>
                {isMyProfile && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedEducation(undefined);
                      setEducationDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.educations.map((edu) => (
                <div key={edu.id} className="border-l-2 border-muted pl-4">
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
                    {isMyProfile && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEducation(edu);
                            setEducationDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteEducation(edu.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <EducationEditor
                open={educationDialogOpen}
                onOpenChange={setEducationDialogOpen}
                initialData={selectedEducation}
                onSubmit={handleEducationSubmit}
              />
              {isEducationUpdating && <div>Saving...</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  CVs & Resumes
                </div>
                <UploadCVButton />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cvsData?.data &&
                cvsData.data.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-brand-primary" />
                      <div>
                        <p className="font-medium">{cv.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {cv.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(cv.file.url, "_blank")}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
