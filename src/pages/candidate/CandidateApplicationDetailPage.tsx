import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ExternalLink,
  FileText,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { getApplicationById } from "@/api/endpoints/applications.api";
import { getOrganizationById } from "@/api/endpoints/organizations.api";
import {
  Application,
  ApplicationStatus,
  ApplicationStatusLabel,
} from "@/api/types/applications.types";
import { Organization } from "@/api/types/organizations.types";
import {
  OfferResponse,
  OfferStatus,
  SalaryPeriod,
} from "@/api/types/offers.types";
import {
  candidateAcceptOffer,
  candidateRejectOffer,
  candidateCreateOffer,
} from "@/api/endpoints/offers.api";
import { useAuth } from "@/hooks/useAuth";

// Import Sub-components
import JobInfoSection from "@/components/candidate/applications/JobInfoSection";
import ApplicationInfoSection from "@/components/candidate/applications/ApplicationInfoSection";
import OffersSection from "@/components/candidate/applications/OffersSection";
import InterviewsSection from "@/components/candidate/applications/InterviewsSection";
import StatusLogSection from "@/components/candidate/applications/StatusLogSection";
import MessageButton from "@/components/chat/MessageButton";
import RecruiterFeedbackDialog from "@/components/reviews/RecruiterFeedbackDialog";

// --- Helper: Status Badge (Fixed Colors & Size) ---
const StatusBadge = ({ status }: { status: string }) => {
  // Mapping màu sắc cụ thể cho từng trạng thái
  const styles: Record<string, string> = {
    // Offer statuses
    [ApplicationStatus.OFFER]: "bg-purple-50 text-purple-700 border-purple-200",
    OFFER_ACCEPTED: "bg-green-50 text-green-700 border-green-200", // Giả định trạng thái
    OFFER_REJECTED: "bg-red-50 text-red-700 border-red-200", // Giả định trạng thái

    // Standard statuses
    [ApplicationStatus.REJECTED]: "bg-red-50 text-red-600 border-red-100",
    [ApplicationStatus.INTERVIEW]: "bg-blue-50 text-blue-700 border-blue-200",
    [ApplicationStatus.SCREENING]:
      "bg-orange-50 text-orange-700 border-orange-100",
  };

  // Xử lý logic hiển thị text
  let label = ApplicationStatusLabel[status as ApplicationStatus] || status;
  let styleClass =
    styles[status] || "bg-gray-100 text-gray-600 border-gray-200";

  // Nếu status là OFFER nhưng trong context đã accept/reject (logic frontend)
  // Bạn có thể tùy chỉnh logic này dựa trên dữ liệu thực tế

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${styleClass}`}
    >
      {label}
    </span>
  );
};

export default function CandidateApplicationDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"application" | "hiring">(
    "application"
  );

  // Dialog & Form States
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCounterOfferDialog, setShowCounterOfferDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferResponse | null>(
    null
  );

  const [counterOfferBaseSalary, setCounterOfferBaseSalary] = useState("");
  const [counterOfferCurrency, setCounterOfferCurrency] = useState("VND");
  const [counterOfferSalaryPeriod, setCounterOfferSalaryPeriod] =
    useState<SalaryPeriod>(SalaryPeriod.YEARLY);
  const [counterOfferSigningBonus, setCounterOfferSigningBonus] = useState("");
  const [counterOfferNotes, setCounterOfferNotes] = useState("");
  const [counterOfferIsNegotiable, setCounterOfferIsNegotiable] =
    useState(true);

  // Queries
  const { data: applicationData, isLoading } = useQuery<Application>({
    queryKey: ["candidate-applications", applicationId],
    queryFn: async () => getApplicationById(applicationId!),
    enabled: !!applicationId,
  });

  const { data: company } = useQuery<Organization | null>({
    queryKey: ["organization", applicationData?.job?.organizationId],
    queryFn: () =>
      applicationData?.job?.organizationId
        ? getOrganizationById(applicationData.job.organizationId)
        : Promise.resolve(null),
    enabled: !!applicationData?.job?.organizationId,
  });

  // Mutations (Giữ nguyên logic cũ)
  const { mutate: acceptOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      notes,
    }: {
      applicationId: string;
      notes?: string;
    }) => candidateAcceptOffer(applicationId, notes),
    onSuccess: () => {
      toast({ title: "Offer Accepted!", description: "Congratulations!" });
      setShowAcceptDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["candidate-applications", applicationId],
      });
    },
    onError: () =>
      toast({ title: "Error", description: "Failed.", variant: "destructive" }),
  });

  const { mutate: rejectOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      reason,
    }: {
      applicationId: string;
      reason?: string;
    }) => candidateRejectOffer(applicationId, reason),
    onSuccess: () => {
      toast({ title: "Offer Rejected", description: "Sent." });
      setShowRejectDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["candidate-applications", applicationId],
      });
    },
    onError: () =>
      toast({ title: "Error", description: "Failed.", variant: "destructive" }),
  });

  const { mutate: createCounterOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: any;
    }) => candidateCreateOffer(applicationId, data),
    onSuccess: () => {
      toast({ title: "Sent", description: "Counter offer submitted." });
      setShowCounterOfferDialog(false);
      resetCounterOfferForm();
      queryClient.invalidateQueries({
        queryKey: ["candidate-applications", applicationId],
      });
    },
    onError: () =>
      toast({ title: "Error", description: "Failed.", variant: "destructive" }),
  });

  const resetCounterOfferForm = () => {
    setCounterOfferBaseSalary("");
    setCounterOfferCurrency("VND");
    setCounterOfferSalaryPeriod(SalaryPeriod.YEARLY);
    setCounterOfferSigningBonus("");
    setCounterOfferNotes("");
    setCounterOfferIsNegotiable(true);
  };

  const handleAcceptOffer = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setShowAcceptDialog(true);
  };
  const handleRejectOffer = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setShowRejectDialog(true);
  };
  const handleCounterOffer = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setCounterOfferBaseSalary(offer.baseSalary?.toString() || "");
    setCounterOfferCurrency(offer.currency || "VND");
    setCounterOfferSalaryPeriod(
      (offer.salaryPeriod as SalaryPeriod) || SalaryPeriod.YEARLY
    );
    setCounterOfferSigningBonus(offer.signingBonus?.toString() || "");
    setShowCounterOfferDialog(true);
  };

  const confirmAcceptOffer = () => {
    if (selectedOffer && applicationId)
      acceptOfferMutate({ applicationId, notes: "Candidate accepted offer" });
  };
  const confirmRejectOffer = () => {
    if (selectedOffer && applicationId)
      rejectOfferMutate({ applicationId, reason: "Candidate rejected offer" });
  };
  const submitCounterOffer = () => {
    if (!counterOfferBaseSalary || !applicationId) {
      toast({ title: "Missing fields", variant: "destructive" });
      return;
    }
    rejectOfferMutate(
      { applicationId, reason: "Counter offer submitted" },
      {
        onSuccess: () => {
          createCounterOfferMutate({
            applicationId,
            data: {
              baseSalary: parseFloat(counterOfferBaseSalary),
              currency: counterOfferCurrency,
              salaryPeriod: counterOfferSalaryPeriod,
              signingBonus: counterOfferSigningBonus
                ? parseFloat(counterOfferSigningBonus)
                : null,
              notes: counterOfferNotes || null,
              offeredBy: user.id,
              isNegotiable: counterOfferIsNegotiable,
              isOfferedByCandidate: true,
            },
          });
        },
      }
    );
  };

  if (isLoading || !applicationData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  const poster = applicationData.job.user;
  const offers = applicationData.offers || [];
  const interviews = applicationData.interviews || [];
  const statusHistory = applicationData.statusHistory || [];
  const canRespondToOffer =
    offers.length > 0 &&
    offers[0].status === OfferStatus.PENDING &&
    offers[0].isOfferedByCandidate === false;

    const handleViewRecruiterProfile = () => {
    if (poster?.id) {
        navigate(`/user/${poster.id}/profile`); 
    }
};

  return (
   <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900 pb-12">
        <div className="max-w-[1400px] mx-auto py-8 px-4 md:px-8 animate-fadeIn">
            
            {/* --- HEADER (Compact) --- */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
                <div className="p-6 pb-0">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        {/* Left: Back + Title + Meta */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {/* Back Button Inline with Title */}
                                <button onClick={() => navigate(-1)} className="group flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors" title="Back">
                                    <ArrowLeft size={18} className="text-gray-400 group-hover:text-gray-800"/>
                                </button>
                                
                                <h1 className="text-xl font-bold text-gray-900 leading-tight">{applicationData.job?.title}</h1>
                                <StatusBadge status={applicationData.status} />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium ml-11">
                                <span className="flex items-center gap-1.5"><Building2 size={12} className="text-gray-400"/> {company?.name || "Company"}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-gray-400"/> {applicationData.job?.location || "Remote"}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400"/> Applied {new Date(applicationData.appliedDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <Button variant="outline" onClick={() => navigate(`/jobs/${applicationData.job?.id}`)} className="bg-white border-gray-200 text-gray-700 font-bold text-xs h-9 rounded-lg hover:bg-gray-50 shrink-0">
                            View Job <ExternalLink size={12} className="ml-2"/>
                        </Button>
                    </div>
                </div>

                {/* --- TABS NAVIGATION (Bottom of Header) --- */}
                <div className="flex items-center gap-8 px-6 mt-6 border-t border-gray-100 bg-white">
                    <button
                        onClick={() => setActiveTab('application')}
                        className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'application' 
                            ? 'border-[#0EA5E9] text-gray-900' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <FileText size={16}/> Application
                    </button>
                    <button
                        onClick={() => setActiveTab('hiring')}
                        className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'hiring' 
                            ? 'border-[#0EA5E9] text-gray-900' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <CheckSquare size={16}/> Hiring Process
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-8">
                {/* --- LEFT COLUMN (Main Content) --- */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    
                    {activeTab === 'application' && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Application Data Card */}
                            <ApplicationInfoSection application={applicationData} />
                            
                            {/* Job Info Card */}
                            <JobInfoSection 
                                job={applicationData.job} 
                                company={company} 
                                onViewJob={() => navigate(`/jobs/${applicationData.job?.id}`)} 
                                onViewCompany={() => company?.id && navigate(`/company/${company.id}/profile`)}
                            />
                        </div>
                    )}

                    {activeTab === 'hiring' && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Offers */}
                            {offers.length > 0 ? (
                                <OffersSection 
                                  offers={offers} 
                                  onAccept={handleAcceptOffer} 
                                  onReject={handleRejectOffer} 
                                  onCounter={handleCounterOffer} 
                                  canRespond={canRespondToOffer}
                                />
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                                    <div className="text-gray-300 mb-2"><CheckSquare size={32} className="mx-auto"/></div>
                                    <p className="text-sm text-gray-500 italic">No offers received yet.</p>
                                </div>
                            )}

                            {/* Interviews */}
                            {interviews.length > 0 ? (
                                <InterviewsSection interviews={interviews} />
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                                    <div className="text-gray-300 mb-2"><MessageSquare size={32} className="mx-auto"/></div>
                                    <p className="text-sm text-gray-500 italic">No interviews scheduled.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* --- RIGHT SIDEBAR --- */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    
                    {/* Recruiter Card (Clickable) */}
                    {poster && (
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wide text-gray-400">Recruiter</h3>
                            <div className="flex items-center gap-3 mb-4 cursor-pointer group" onClick={handleViewRecruiterProfile}>
                                <Avatar className="h-10 w-10 border border-gray-100">
                                    <AvatarImage src={poster.avatarUrl} />
                                    <AvatarFallback className="bg-blue-600 text-white font-bold">{poster.fullName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                    <div className="font-bold text-gray-900 text-sm truncate group-hover:text-[#0EA5E9]">{poster.fullName || "Recruiter"}</div>
                                    <div className="text-xs text-gray-500 truncate">{poster.email}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <MessageButton senderId={user.id} recieverId={poster.id} />
                                <RecruiterFeedbackDialog applicationId={applicationId!} recruiterUserId={poster.id} />
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                         <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wide text-gray-400">Timeline</h3>
                         <StatusLogSection statusHistory={statusHistory} />
                    </div>

                </div>
            </div>

            {/* --- DIALOGS (Giữ nguyên logic) --- */}
            <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <DialogContent className="max-w-md rounded-xl p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-700"><CheckCircle2 className="h-5 w-5"/> Accept Offer</DialogTitle>
                        <DialogDescription>Confirm acceptance of this offer?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>Cancel</Button>
                        <Button onClick={confirmAcceptOffer} className="bg-green-600 hover:bg-green-700 text-white">Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                 <DialogContent className="max-w-md rounded-xl p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600"><XCircle className="h-5 w-5"/> Reject Offer</DialogTitle>
                        <DialogDescription>Decline this offer? This cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                        <Button onClick={confirmRejectOffer} variant="destructive">Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCounterOfferDialog} onOpenChange={setShowCounterOfferDialog}>
                <DialogContent className="max-w-lg rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <DialogTitle className="text-gray-900">Submit Counter Offer</DialogTitle>
                        <DialogDescription className="text-gray-500">Propose new terms for this position.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-5 bg-white">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-700 uppercase">Base Salary</Label>
                                <Input type="number" value={counterOfferBaseSalary} onChange={(e) => setCounterOfferBaseSalary(e.target.value)} className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-700 uppercase">Currency</Label>
                                <Input value={counterOfferCurrency} onChange={(e) => setCounterOfferCurrency(e.target.value)} className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-700 uppercase">Signing Bonus</Label>
                            <Input type="number" value={counterOfferSigningBonus} onChange={(e) => setCounterOfferSigningBonus(e.target.value)} className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-700 uppercase">Notes / Reasoning</Label>
                            <Textarea value={counterOfferNotes} onChange={(e) => setCounterOfferNotes(e.target.value)} rows={3} className="border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500" placeholder="Explain your desired compensation..."/>
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                        <Button variant="outline" onClick={() => setShowCounterOfferDialog(false)} className="rounded-lg font-bold border-gray-300 text-gray-700">Cancel</Button>
                        <Button onClick={submitCounterOffer} className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-lg font-bold shadow-sm">Send Counter Offer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    </div>
    
  );
}
