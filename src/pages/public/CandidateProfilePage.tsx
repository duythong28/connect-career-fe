import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  getCandidateProfile,
  updateMyProfile,
} from "@/api/endpoints/candidates.api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { User as UserIcon, Globe, Pen } from "lucide-react";
import AvatarEditor from "@/components/candidate/profile/AvatarEditor";

import { CandidateProfile } from "@/api/types/candidates.types";
import FeedbackTab from "@/components/candidate/profile/FeedbackTab";
import ProfileDetailTab from "@/components/candidate/profile/ProfileDetailTab";
import CVSTab from "@/components/candidate/profile/CVSTab";

// --- MAIN COMPONENT ---
export function CandidateProfilePage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isMyProfile = useMemo(() => {
    return !candidateId || candidateId === user?.candidateProfileId;
  }, [candidateId, user]);

  const tabs = [
    { value: "details", label: "Details" },
    { value: "feedback", label: "Feedback" },
    ...(isMyProfile ? [{ value: "cvs", label: "CVs" }] : []),
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const [editMode, setEditMode] = useState(false);

  // --- DATA FETCHING ---
  const { data: profileData, isLoading: isProfileLoading } =
    useQuery<CandidateProfile>({
      queryKey: ["candidateProfile", candidateId || "me"],
      queryFn: () =>
        isMyProfile ? getMyProfile() : getCandidateProfile(candidateId!),
      enabled: isMyProfile ? !!user : !!candidateId,
    });

  // --- MUTATIONS ---
  const { mutate: updateProfile } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated.",
      });
      queryClient.invalidateQueries({
        queryKey: ["candidateProfile", candidateId || "me"],
      });
    },
  });

  if (isProfileLoading || !profileData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Highlight Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileData.user.avatarUrl ?? undefined} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          {isMyProfile && editMode && (
            <AvatarEditor
              currentUrl={profileData.user.avatarUrl}
              onUploaded={() =>
                queryClient.invalidateQueries({
                  queryKey: ["candidateProfile", candidateId || "me"],
                })
              }
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 break-words">
            {profileData.user.fullName ||
              `${profileData.user.firstName} ${profileData.user.lastName}`}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {profileData.email && (
              <span className="flex items-center gap-1">
                <Pen className="w-4 h-4" /> {profileData.email}
              </span>
            )}
            {profileData.phone && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" /> {profileData.phone}
              </span>
            )}
            {profileData.address && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" /> {profileData.address}
              </span>
            )}
            {profileData.city && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" /> {profileData.city}
              </span>
            )}
            {profileData.country && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" /> {profileData.country}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {profileData.socialLinks?.linkedin && (
              <a
                href={profileData.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline"
              >
                LinkedIn
              </a>
            )}
            {profileData.socialLinks?.github && (
              <a
                href={profileData.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline"
              >
                GitHub
              </a>
            )}
            {profileData.socialLinks?.portfolio && (
              <a
                href={profileData.socialLinks.portfolio}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline"
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
        {isMyProfile && (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant={editMode ? "outline" : "default"}
              onClick={() => setEditMode((v) => !v)}
              className="w-full"
            >
              {editMode ? "Switch to View Mode" : "Switch to Edit Mode"}
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* --- DETAILS TAB --- */}
        <TabsContent value="details">
          <ProfileDetailTab
            editMode={editMode}
            isMyProfile={isMyProfile}
            profileData={profileData}
            updateProfile={updateProfile}
          />
        </TabsContent>

        {/* --- FEEDBACK TAB --- */}
        <TabsContent value="feedback">
          <FeedbackTab interviewFeedbacks={profileData.interviewFeedbacks} />
        </TabsContent>

        {/* --- CVS TAB (OWNER ONLY) --- */}
        {isMyProfile && (
          <TabsContent value="cvs">
            <CVSTab isMyProfile={isMyProfile} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default CandidateProfilePage;
