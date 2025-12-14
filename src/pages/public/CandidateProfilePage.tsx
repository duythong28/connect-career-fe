import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  getCandidateProfile,
  updateMyProfile,
} from "@/api/endpoints/candidates.api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  MapPin,
  ArrowLeft,
  Flag,
  MessageSquare,
  FileText,
  LayoutGrid,
  Pencil,
  Eye,
  CheckCircle2,
  Star,
  Settings,
  MessageCircle,
} from "lucide-react";
import AvatarEditor from "@/components/candidate/profile/AvatarEditor";
import { CandidateProfile } from "@/api/types/candidates.types";
import FeedbackTab from "@/components/candidate/profile/FeedbackTab";
import ProfileDetailTab, {
  CompletionStatusLabel,
  CompletionStatus,
  ProfileEditorModal,
} from "@/components/candidate/profile/ProfileDetailTab";
import CVSTab from "@/components/candidate/profile/CVSTab";
import ReportDialog from "@/components/reports/ReportDialog";

export function CandidateProfilePage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isMyProfile = useMemo(() => {
    return !candidateId || candidateId === user?.candidateProfileId;
  }, [candidateId, user]);

  // State
  const [activeTab, setActiveTab] = useState("details");
  const [editMode, setEditMode] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);

  // Data Fetching
  const { data: profileData, isLoading: isProfileLoading } =
    useQuery<CandidateProfile>({
      queryKey: ["candidateProfile", candidateId || "me"],
      queryFn: () =>
        isMyProfile ? getMyProfile() : getCandidateProfile(candidateId!),
      enabled: isMyProfile ? !!user : !!candidateId,
    });

  // Profile Update Mutation
  const { mutate: updateProfile } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      toast({ title: "Success", description: "Profile updated successfully." });
      queryClient.invalidateQueries({
        queryKey: ["candidateProfile", candidateId || "me"],
      });
      setShowPersonalModal(false);
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      }),
  });

  if (isProfileLoading || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto py-8 px-6 animate-fadeIn">
        {/* Personal Info Modal (Triggered by Edit Info button) */}
        {showPersonalModal && (
          <ProfileEditorModal
            data={{
              user: {
                fullName:
                  profileData.user.fullName ||
                  `${profileData.user.firstName} ${profileData.user.lastName}`,
              },
              email: profileData.email,
              phone: profileData.phone,
              address: profileData.address,
              socialLinks: profileData.socialLinks,
            }}
            onSave={updateProfile}
            onClose={() => setShowPersonalModal(false)}
          />
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 uppercase tracking-wide"
        >
          <ArrowLeft size={12} /> Back
        </button>

        <div className="grid grid-cols-12 gap-8">
          {/* --- LEFT SIDEBAR --- */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* User Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center relative group">
              {/* Avatar Section */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                      src={profileData.user.avatarUrl ?? undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#0EA5E9] text-white text-2xl font-bold">
                      {profileData.user.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Avatar Editor Button - ONLY visible in Edit Mode */}
                {isMyProfile && editMode && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity rounded-2xl">
                    <AvatarEditor
                      currentUrl={profileData.user.avatarUrl}
                      onUploaded={() =>
                        queryClient.invalidateQueries({
                          queryKey: ["candidateProfile", candidateId || "me"],
                        })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Name & Location */}
              <h2 className="text-xl font-bold text-gray-900">
                {profileData.user.fullName ||
                  `${profileData.user.firstName} ${profileData.user.lastName}`}
              </h2>
              <p className="text-xs text-gray-500 mt-1 mb-2 flex items-center justify-center gap-1">
                <MapPin size={10} />{" "}
                {profileData.city || profileData.address || "Location N/A"}
              </p>

              {/* Status Badge */}
              <div
                className={`text-[10px] font-bold px-3 py-1 rounded-full mx-auto w-fit mb-6 uppercase tracking-wide ${
                  profileData.completionStatus === "complete"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {CompletionStatusLabel[
                  profileData.completionStatus as CompletionStatus
                ] || "Active"}
              </div>

              {/* PRIMARY ACTION: Toggle Edit Mode (Owner) OR Report (Visitor) */}
              {isMyProfile ? (
                <Button
                  onClick={() => setEditMode(!editMode)}
                  className={`w-full mb-4 font-bold shadow-sm transition-all ${
                    editMode
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-[#0EA5E9] hover:bg-[#0284c7] text-white"
                  }`}
                >
                  {editMode ? (
                    <>
                      <Eye size={16} className="mr-2" /> View Profile
                    </>
                  ) : (
                    <>
                      <Pencil size={16} className="mr-2" /> Edit Profile
                    </>
                  )}
                </Button>
              ) : (
                // <--- REPORT BUTTON ĐÃ ĐƯỢC THÊM LẠI Ở ĐÂY
                <ReportDialog
                  entityId={profileData.user.id}
                  entityType="user"
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full mb-4 text-red-500 border-red-100 hover:bg-red-50 font-bold transition-colors"
                    >
                      <Flag size={16} className="mr-2" /> Report Candidate
                    </Button>
                  }
                />
              )}

              {/* Navigation Menu */}
              <div className="text-left space-y-1 pt-4 border-t border-gray-100">
                {/* 1. Details */}
                <button
                  onClick={() => setActiveTab("details")}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 text-sm font-bold transition-colors ${
                    activeTab === "details"
                      ? "bg-blue-50 text-[#0EA5E9]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <LayoutGrid size={16} /> Profile Details
                </button>

                {/* 2. Documents (Owner Only) */}
                {isMyProfile && (
                  <button
                    onClick={() => setActiveTab("cvs")}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 text-sm font-bold transition-colors ${
                      activeTab === "cvs"
                        ? "bg-blue-50 text-[#0EA5E9]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FileText
                      size={16}
                      className={activeTab !== "cvs" ? "text-orange-500" : ""}
                    />{" "}
                    Documents
                  </button>
                )}

                {/* 3. Recruiter Feedback */}
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 text-sm font-bold transition-colors ${
                    activeTab === "feedback"
                      ? "bg-blue-50 text-[#0EA5E9]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Star
                    size={16}
                    className={
                      activeTab !== "feedback" ? "text-yellow-500" : ""
                    }
                  />{" "}
                  Recruiter Feedback
                </button>

                {/* 4. Interview Feedback */}
                <button
                  onClick={() => setActiveTab("interview-feedback")}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 text-sm font-bold transition-colors ${
                    activeTab === "interview-feedback"
                      ? "bg-blue-50 text-[#0EA5E9]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare
                    size={16}
                    className={
                      activeTab !== "interview-feedback" ? "text-green-500" : ""
                    }
                  />{" "}
                  Interview Feedback
                </button>

                {/* EDIT INFO BUTTON: ONLY SHOWS IN EDIT MODE */}
                {isMyProfile && editMode && (
                  <button
                    onClick={() => setShowPersonalModal(true)}
                    className="w-full bg-blue-50/50 text-[#0EA5E9] p-3 rounded-lg flex items-center gap-3 text-sm font-bold hover:bg-blue-100 border border-blue-100 transition-all mt-2 animate-fadeIn"
                  >
                    <Settings size={16} /> Edit Personal Info
                  </button>
                )}
              </div>
            </div>

            {/* Profile Strength Widget (Owner Only) */}
            {isMyProfile && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                    Profile Strength
                  </h4>
                  <span className="text-xs font-bold text-[#0EA5E9]">
                    {profileData.completionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div
                    className="bg-[#0EA5E9] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileData.completionPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  {profileData.completionPercentage === 100 ? (
                    <>
                      <CheckCircle2 size={14} className="text-green-500" /> All
                      set!
                    </>
                  ) : (
                    "Add more details to reach 100%"
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT CONTENT AREA --- */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* 1. DETAILS TAB */}
            {activeTab === "details" && (
              <ProfileDetailTab
                profileData={profileData}
                isMyProfile={isMyProfile}
                editMode={editMode}
                updateProfile={updateProfile}
              />
            )}

            {/* 2. DOCUMENTS TAB */}
            {activeTab === "cvs" && isMyProfile && (
              <CVSTab isMyProfile={isMyProfile} />
            )}

            {/* 3. RECRUITER FEEDBACK TAB */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-200 pb-4 bg-white p-4 rounded-t-xl shadow-sm">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />{" "}
                  Recruiter Feedback
                </div>
                <FeedbackTab
                  recruiterFeedbacks={
                    profileData.userFeedbacks.givenAsRecruiter
                      .recruiterFeedbacks
                  }
                />
              </div>
            )}

            {/* 4. INTERVIEW FEEDBACK TAB */}
            {activeTab === "interview-feedback" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b border-gray-200 pb-4 bg-white p-4 rounded-t-xl shadow-sm">
                  <MessageCircle className="text-green-500" size={20} />{" "}
                  Interview Feedback
                </div>
                <FeedbackTab
                  interviewFeedbacks={
                    profileData.userFeedbacks.receivedAsCandidate
                      .interviewFeedbacks
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
