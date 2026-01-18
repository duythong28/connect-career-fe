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
  Star,
  Settings,
  MessageCircle,
  Loader2,
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
      toast({
        title: "Profile Sync Complete",
        description:
          "Your professional profile has been updated across the ecosystem.",
      });
      queryClient.invalidateQueries({
        queryKey: ["candidateProfile", candidateId || "me"],
      });
      setShowPersonalModal(false);
    },
    onError: () =>
      toast({
        title: "Update Failed",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      }),
  });

  if (isProfileLoading || !profileData) {
    return (
      // PRESERVED BACKGROUND: Using original #F8F9FB as requested
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  console.log("this is profileData?.user", profileData?.user);

  return (
    // PRESERVED BACKGROUND: Using original #F8F9FB as requested
    <div className="min-h-screen bg-[#F8F9FB] overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto py-8 px-6 animate-fade-in">
        {/* Personal Info Modal */}
        {showPersonalModal && (
          <ProfileEditorModal
            data={{
              firstName: profileData.user.firstName,
              lastName: profileData.user.lastName,
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
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary text-muted-foreground"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Button>

        <div className="grid grid-cols-12 gap-8">
          {/* --- LEFT SIDEBAR --- */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* User Card */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm text-center relative group">
              {/* Avatar Section */}
              <div className="relative w-28 h-28 mx-auto mb-5">
                <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-background shadow-lg bg-muted">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                      src={profileData.user.avatarUrl ?? undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                      {profileData.user.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Avatar Editor Button - Visible in Edit Mode */}
                {isMyProfile && editMode && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity rounded-2xl cursor-pointer">
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
              <h2 className="text-xl font-bold text-foreground">
                {[profileData.user.firstName, profileData.user.lastName].join(
                  " ",
                ) || profileData.user.fullName}
              </h2>
              {/* Status Badge */}
              {/* <div
                className={`text-[10px] font-bold px-3 py-1 rounded-full mx-auto w-fit my-3 uppercase tracking-wide border ${
                  profileData?.user?.status === "active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {profileData?.user?.status || "Active"}
              </div> */}
              {profileData?.user?.status === "active" && (
                <div
                  className={`text-[10px] font-bold px-3 py-1 rounded-full mx-auto w-fit my-3 uppercase tracking-wide border ${
                    profileData?.user?.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {"Open to work"}
                </div>
              )}

              {/* PRIMARY ACTION */}
              {isMyProfile ? (
                <Button
                  variant="default" // Standard Primary Action (Solid Blue)
                  onClick={() => setEditMode(!editMode)}
                  className="w-full mb-4 rounded-xl"
                >
                  {editMode ? (
                    <>
                      <Eye size={16} className="mr-2" /> View Public Profile
                    </>
                  ) : (
                    <>
                      <Pencil size={16} className="mr-2" /> Edit Profile
                    </>
                  )}
                </Button>
              ) : (
                <ReportDialog
                  entityId={profileData.user.id}
                  entityType="user"
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full mb-4 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive rounded-xl"
                    >
                      <Flag size={16} className="mr-2" /> Report
                    </Button>
                  }
                />
              )}

              {/* Navigation Menu */}
              <div className="text-left space-y-2 pt-6 border-t border-border">
                {/* 1. Details */}
                <button
                  onClick={() => setActiveTab("details")}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === "details"
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <LayoutGrid size={18} /> Profile Details
                </button>

                {/* 2. Documents (Owner Only) */}
                <button
                  onClick={() => setActiveTab("cvs")}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === "cvs"
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <FileText
                    size={18}
                    className={activeTab !== "cvs" ? "text-orange-500/80" : ""}
                  />{" "}
                  Documents
                </button>

                {/* 3. Recruiter Feedback */}
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === "feedback"
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Star
                    size={18}
                    className={
                      activeTab !== "feedback" ? "text-yellow-500/80" : ""
                    }
                  />{" "}
                  Recruiter Feedback
                </button>

                {/* 4. Interview Feedback */}
                <button
                  onClick={() => setActiveTab("interview-feedback")}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === "interview-feedback"
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <MessageSquare
                    size={18}
                    className={
                      activeTab !== "interview-feedback"
                        ? "text-green-500/80"
                        : ""
                    }
                  />{" "}
                  Interview Feedback
                </button>

                {/* Edit Personal Info Button */}
                {isMyProfile && editMode && (
                  <button
                    onClick={() => setShowPersonalModal(true)}
                    className="w-full bg-secondary/50 text-foreground p-3 rounded-xl flex items-center gap-3 text-sm font-medium hover:bg-secondary border border-border transition-all mt-4 animate-fade-in"
                  >
                    <Settings size={18} /> Edit Personal Info
                  </button>
                )}
              </div>
            </div>
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
            {activeTab === "cvs" && (
              <CVSTab isMyProfile={isMyProfile} userId={profileData?.userId} />
            )}

            {/* 3. RECRUITER FEEDBACK TAB */}
            {activeTab === "feedback" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-lg font-bold text-foreground border-b border-border pb-4 bg-card p-6 rounded-t-3xl shadow-sm">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />{" "}
                  Recruiter Feedback
                </div>
                <div className="bg-card rounded-b-3xl p-6 border-x border-b border-border shadow-sm -mt-6">
                  <FeedbackTab
                    recruiterFeedbacks={
                      profileData.userFeedbacks.givenAsRecruiter
                        .recruiterFeedbacks
                    }
                  />
                </div>
              </div>
            )}

            {/* 4. INTERVIEW FEEDBACK TAB */}
            {activeTab === "interview-feedback" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-lg font-bold text-foreground border-b border-border pb-4 bg-card p-6 rounded-t-3xl shadow-sm">
                  <MessageCircle className="text-green-500" size={24} />{" "}
                  Interview Feedback
                </div>
                <div className="bg-card rounded-b-3xl p-6 border-x border-b border-border shadow-sm -mt-6">
                  <FeedbackTab
                    interviewFeedbacks={
                      profileData.userFeedbacks.receivedAsCandidate
                        .interviewFeedbacks
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
