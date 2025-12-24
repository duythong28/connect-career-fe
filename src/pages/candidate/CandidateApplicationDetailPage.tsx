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
  Loader2,
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
  // Mapping logic preserved
  const styles: Record<string, string> = {
    [ApplicationStatus.OFFER]: "bg-purple-50 text-purple-700 border-purple-200",
    OFFER_ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    OFFER_REJECTED: "bg-red-50 text-red-700 border-red-200",
    [ApplicationStatus.REJECTED]: "bg-destructive/10 text-destructive border-destructive/20",
    [ApplicationStatus.INTERVIEW]: "bg-blue-50 text-blue-700 border-blue-200",
    [ApplicationStatus.SCREENING]: "bg-orange-50 text-orange-700 border-orange-100",
  };

  let label = ApplicationStatusLabel[status as ApplicationStatus] || status;
  let styleClass = styles[status] || "bg-secondary text-muted-foreground border-border";

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styleClass}`}
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

  // Mutations
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
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
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
    <div className="min-h-screen bg-[#F8F9FB] text-foreground pb-12">
      <div className="max-w-[1400px] mx-auto py-8 px-4 md:px-8 animate-fade-in">
        
        {/* --- HEADER (Compact) --- */}
        <div className="bg-card rounded-3xl border border-border shadow-sm mb-6 overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              {/* Left: Back + Title + Meta */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {/* Back Button Inline with Title */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(-1)} 
                    className="rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground" 
                    title="Back"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  
                  <h1 className="text-2xl font-bold text-foreground leading-tight">{applicationData.job?.title}</h1>
                  <StatusBadge status={applicationData.status} />
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium ml-12">
                  <span className="flex items-center gap-1.5"><Building2 size={14} className="text-muted-foreground"/> {company?.name || "Company"}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-muted-foreground"/> {applicationData.job?.location || "Remote"}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-muted-foreground"/> Applied {new Date(applicationData.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Right: Actions */}
              <Button 
                variant="outline" 
                onClick={() => navigate(`/jobs/${applicationData.job?.id}`)} 
                className="bg-background border-border text-foreground font-bold text-xs h-10 rounded-xl hover:bg-secondary shrink-0"
              >
                View Job <ExternalLink size={14} className="ml-2"/>
              </Button>
            </div>
          </div>

          {/* --- TABS NAVIGATION (Bottom of Header) --- */}
          <div className="flex items-center gap-8 px-8 mt-6 border-t border-border bg-card">
            <button
              onClick={() => setActiveTab('application')}
              className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'application' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText size={18}/> Application
            </button>
            <button
              onClick={() => setActiveTab('hiring')}
              className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'hiring' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckSquare size={18}/> Hiring Process
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* --- LEFT COLUMN (Main Content) --- */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {activeTab === 'application' && (
              <div className="space-y-6 animate-fade-in">
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
              <div className="space-y-6 animate-fade-in">
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
                  <div className="bg-card border border-border rounded-3xl p-12 text-center">
                    <div className="text-muted-foreground/30 mb-3"><CheckSquare size={40} className="mx-auto"/></div>
                    <p className="text-sm text-muted-foreground italic">No offers received yet.</p>
                  </div>
                )}

                {/* Interviews */}
                {interviews.length > 0 ? (
                  <InterviewsSection interviews={interviews} />
                ) : (
                  <div className="bg-card border border-border rounded-3xl p-12 text-center">
                    <div className="text-muted-foreground/30 mb-3"><MessageSquare size={40} className="mx-auto"/></div>
                    <p className="text-sm text-muted-foreground italic">No interviews scheduled.</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* --- RIGHT SIDEBAR --- */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Recruiter Card (Clickable) */}
            {poster && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-muted-foreground mb-4 text-xs uppercase tracking-wide">Recruiter</h3>
                <div className="flex items-center gap-4 mb-5 cursor-pointer group" onClick={handleViewRecruiterProfile}>
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarImage src={poster.avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">{poster.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <div className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">{poster.fullName || "Recruiter"}</div>
                    <div className="text-xs text-muted-foreground truncate">{poster.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MessageButton senderId={user.id} recieverId={poster.id} />
                  <RecruiterFeedbackDialog applicationId={applicationId!} recruiterUserId={poster.id} />
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
               <h3 className="font-bold text-muted-foreground mb-4 text-xs uppercase tracking-wide">Timeline</h3>
               <StatusLogSection statusHistory={statusHistory} />
            </div>

          </div>
        </div>

        {/* --- DIALOGS --- */}
        <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <DialogContent className="max-w-md rounded-3xl p-8 bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-green-600 text-xl"><CheckCircle2 className="h-6 w-6"/> Accept Offer</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">Confirm acceptance of this offer?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAcceptDialog(false)} className="rounded-xl h-11 border-border">Cancel</Button>
              <Button onClick={confirmAcceptOffer} className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-11 font-bold">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
           <DialogContent className="max-w-md rounded-3xl p-8 bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-destructive text-xl"><XCircle className="h-6 w-6"/> Reject Offer</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">Decline this offer? This cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="rounded-xl h-11 border-border">Cancel</Button>
              <Button onClick={confirmRejectOffer} variant="destructive" className="rounded-xl h-11 font-bold">Reject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showCounterOfferDialog} onOpenChange={setShowCounterOfferDialog}>
          <DialogContent className="max-w-lg rounded-3xl p-0 overflow-hidden bg-card border-border">
            <DialogHeader className="p-6 border-b border-border bg-secondary/30">
              <DialogTitle className="text-foreground text-xl">Submit Counter Offer</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">Propose new terms for this position.</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6 bg-card">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Base Salary</Label>
                  <Input type="number" value={counterOfferBaseSalary} onChange={(e) => setCounterOfferBaseSalary(e.target.value)} className="border-border rounded-xl focus:ring-2 focus:ring-primary"/>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Currency</Label>
                  <Input value={counterOfferCurrency} onChange={(e) => setCounterOfferCurrency(e.target.value)} className="border-border rounded-xl focus:ring-2 focus:ring-primary"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Signing Bonus</Label>
                <Input type="number" value={counterOfferSigningBonus} onChange={(e) => setCounterOfferSigningBonus(e.target.value)} className="border-border rounded-xl focus:ring-2 focus:ring-primary"/>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Notes / Reasoning</Label>
                <Textarea value={counterOfferNotes} onChange={(e) => setCounterOfferNotes(e.target.value)} rows={3} className="border-border rounded-xl resize-none focus:ring-2 focus:ring-primary" placeholder="Explain your desired compensation..."/>
              </div>
            </div>
            <DialogFooter className="p-6 bg-secondary/10 border-t border-border flex gap-3">
              <Button variant="outline" onClick={() => setShowCounterOfferDialog(false)} className="rounded-xl font-bold border-border text-muted-foreground h-11">Cancel</Button>
              <Button onClick={submitCounterOffer} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-sm h-11">Send Counter Offer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}