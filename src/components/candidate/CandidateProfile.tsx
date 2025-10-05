import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Plus,
  X,
  Edit,
  Save,
  Camera,
  Briefcase,
  GraduationCap,
  FileText,
  Eye,
  Download,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/endpoints/candidates.api";
import { getMyCvs } from "@/api/endpoints/cvs.api";

interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

interface CV {
  id: string;
  name: string;
  fileName: string;
  uploadedAt: string;
  type: "pdf" | "docx" | "image";
  visibility: boolean;
  isDefault: boolean;
}

export function CandidateProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ["candidateProfile"],
    queryFn: async () => {
      return getMyProfile();
    },
  });

  const { data: cvsData } = useQuery({
    queryKey: ["candidateCvs"],
    queryFn: async () => {
      return getMyCvs();
    },
  });

  if (!profileData) return <div>Loading...</div>;

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeSkill = (skill: string) => {
    // setProfile({
    //   ...profile,
    //   skills: profile.skills.filter((s) => s !== skill),
    // });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          disabled={isLoading}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profileData.user.avatarUrl} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={profileData.user.fullName}
                    className="text-center text-xl font-bold"
                  />
                  {/* <Input
                    value={profile.title}
                    onChange={(e) =>
                      setProfile({ ...profile, title: e.target.value })
                    }
                    className="text-center"
                  /> */}
                </div>
              ) : (
                <>
                  <CardTitle className="text-xl">
                    {profileData.user.fullName}
                  </CardTitle>
                  {/* <CardDescription className="text-lg">
                    {profile.title}
                  </CardDescription> */}
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <Input
                      value={profileData.email}
                      // onChange={(e) =>
                      //   setProfile({ ...profile, email: e.target.value })
                      // }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <Input
                      value={profileData.phone}
                      // onChange={(e) =>
                      //   setProfile({ ...profile, phone: e.target.value })
                      // }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <Input
                      value={profileData.address}
                      // onChange={(e) =>
                      //   setProfile({ ...profile, location: e.target.value })
                      // }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.address}</span>
                  </div>
                </div>
              )}

              <Separator />

              {/* Social Links */}
              <div className="space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Linkedin className="w-4 h-4" />
                      <Input
                        placeholder="LinkedIn URL"
                        value={profileData.socialLinks.linkedin}
                        // onChange={(e) =>
                        //   setProfile({
                        //     ...profile,
                        //     linkedinUrl: e.target.value,
                        //   })
                        // }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Github className="w-4 h-4" />
                      <Input
                        placeholder="GitHub URL"
                        value={profileData.socialLinks.github || ""}
                        // onChange={(e) =>
                        //   setProfile({ ...profile, githubUrl: e.target.value })
                        // }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <Input
                        placeholder="Website URL"
                        value={profileData.socialLinks.portfolio || ""}
                        // onChange={(e) =>
                        //   setProfile({ ...profile, website: e.target.value })
                        // }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    {profileData.socialLinks.linkedin && (
                      <Button size="sm" variant="outline" className="p-2">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    )}
                    {profileData.socialLinks.github && (
                      <Button size="sm" variant="outline" className="p-2">
                        <Github className="w-4 h-4" />
                      </Button>
                    )}
                    {profileData.socialLinks.portfolio && (
                      <Button size="sm" variant="outline" className="p-2">
                        <Globe className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {profileData.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {/* {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button size="sm" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {/* <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-muted-foreground">{profile.bio}</p>
              )}
            </CardContent>
          </Card> */}

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Experience
                </div>
                {isEditing && (
                  <Button size="sm">
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
                    {isEditing && (
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {exp.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </div>
                {isEditing && (
                  <Button size="sm">
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
                    {isEditing && (
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CVs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  CVs & Resumes
                </div>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cvsData.data &&
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
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
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
