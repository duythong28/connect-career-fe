import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  Edit,
  ArrowLeft,
  ExternalLink,
  Globe,
  Building,
  Calendar,
  Factory,
  Eye,
  Save,
  X,
  Briefcase,
  Share2,
  Flag,
  Globe2,
  CheckCircle2,
  Clock,
  LayoutGrid,
  MessageSquare,
  UploadCloud,
  Star,
  ChevronDown,
  Lightbulb
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// API & Logic
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrganizationById,
  updateOrganization,
  createOrganization,
} from "@/api/endpoints/organizations.api";
import {
  getSignUrl,
  createFileEntity,
  uploadFile,
} from "@/api/endpoints/files.api";
import { getIndistries } from "@/api/endpoints/industries.api";
import { getCandidateJobsByOrganization } from "@/api/endpoints/jobs.api";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/constants/routes";
import {
  WorkingDay,
  OrganizationType,
  OrganizationSize,
  OvertimePolicy,
  WorkScheduleType,
} from "@/api/types/organizations.types";
import { useOrganization } from "@/context/OrganizationContext";
import ReportDialog from "@/components/reports/ReportDialog";
import OrganizationReviewDialog from "@/components/reviews/OrganizationReviewDialog";
import { useAuth } from "@/hooks/useAuth";

// Markdown Component
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

// --- Helpers ---

const isHtmlContent = (content: string): boolean => {
  if (!content) return false;
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
};

const RenderHtml = ({ content }: { content: string }) => (
  <div 
    className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
    dangerouslySetInnerHTML={{ __html: content }} 
  />
);

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert text-gray-600 leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-gray-900 mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-gray-900 mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="mb-3 text-xs sm:text-sm">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-outside ml-4 mb-3 space-y-1 text-xs sm:text-sm">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-4 mb-3 space-y-1 text-xs sm:text-sm">{children}</ol>,
          li: ({ children }) => <li className="">{children}</li>,
          a: ({ href, children }) => <a href={href} className="text-[#0EA5E9] hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const formatEnumValue = (value: string) => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const renderStars = (rating: number) => (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </span>
);

// --- Types & Schema ---

type CompanyFormValues = {
  name: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  website?: string;
  headquartersAddress?: string;
  organizationType?: OrganizationType;
  organizationSize?: OrganizationSize;
  industryId?: string;
  employeeCount?: number | "";
  country?: string;
  city?: string;
  workingDays?: WorkingDay[];
  overtimePolicy?: OvertimePolicy;
  workScheduleTypes?: WorkScheduleType[];
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  shortDescription: z.string().optional().nullable().default(""),
  longDescription: z.string().optional().nullable().default(""),
  website: z.string().url().optional().nullable().or(z.literal("")).default(""),
  headquartersAddress: z.string().optional().nullable().default(""),
  organizationType: z.nativeEnum(OrganizationType).optional(),
  organizationSize: z.nativeEnum(OrganizationSize).optional(),
  industryId: z.string().optional().default(""),
  employeeCount: z
    .union([z.number().int().nonnegative(), z.undefined(), z.null()])
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v))
    .nullable(),
  country: z.string().optional().nullable().default(""),
  city: z.string().optional().nullable().default(""),
  workingDays: z.array(z.nativeEnum(WorkingDay)).default([]),
  overtimePolicy: z.nativeEnum(OvertimePolicy).optional(),
  workScheduleTypes: z.array(z.nativeEnum(WorkScheduleType)).default([]),
});

// --- Main Component ---

const CompanyProfilePage = () => {
  const { companyId } = useParams();
  const { myOrganizations } = useOrganization();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<{ id: string; url: string } | null>(null);
  const { pathname } = useLocation();
  const [previewMode, setPreviewMode] = useState(false);
  const { user } = useAuth();

  const { data: companydata } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getOrganizationById(companyId!),
    enabled: !!companyId,
  });

  const { data: industriesData } = useQuery({
    queryKey: ["industries"],
    queryFn: getIndistries,
  });

  // Fetch Jobs
  const { data: companyJobs } = useQuery({
    queryKey: ["company-jobs", companyId],
    queryFn: () =>
      getCandidateJobsByOrganization({
        id: companyId!,
        limit: 5,
        page: 1,
      }),
    enabled: !!companyId,
  });

  const reviews = companydata?.reviews || [];

  const [editMode, setEditMode] = useState(
    pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION
  );

  const updateMut = useMutation({
    mutationFn: (payload: { id: string; data: Partial<any> }) =>
      updateOrganization(payload.id, payload.data),
    onSuccess: (data) => {
      toast({ title: "Company updated", description: "Company saved." });
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      setEditMode(false);
      setPreviewMode(false);
      setAvatar(null);
    },
    onError: (err: any) => {
      toast({
        title: "Update failed",
        description: err?.message || "Unable to save.",
        variant: "destructive",
      });
    },
  });

  const createMut = useMutation({
    mutationFn: (data: Partial<any>) => createOrganization(data),
    onSuccess: (data) => {
      toast({ title: "Company created", description: "Company saved." });
      navigate("/company/" + data.id + ROUTES.COMPANY.DASHBOARD);
      setEditMode(false);
      setPreviewMode(false);
      setAvatar(null);
      queryClient.invalidateQueries({ queryKey: ["my-organizations"] });
    },
    onError: (err: any) => {
      toast({
        title: "Creation failed",
        description: err?.message || "Unable to create company.",
        variant: "destructive",
      });
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      website: "",
      headquartersAddress: "",
      organizationType: OrganizationType.STARTUP,
      organizationSize: OrganizationSize.MEDIUM,
      industryId: "",
      employeeCount: "",
      country: "",
      city: "",
      workingDays: [
        WorkingDay.MONDAY,
        WorkingDay.TUESDAY,
        WorkingDay.WEDNESDAY,
        WorkingDay.THURSDAY,
        WorkingDay.FRIDAY,
      ],
      overtimePolicy: OvertimePolicy.AS_NEEDED,
      workScheduleTypes: [WorkScheduleType.FULL_TIME],
    },
  });

  const workingDaysValue = watch("workingDays");
  const workScheduleTypesValue = watch("workScheduleTypes");
  const watchedValues = watch(); 

  useEffect(() => {
    if (companydata) {
      reset({
        name: companydata.name || "",
        shortDescription: companydata.shortDescription || "",
        longDescription: companydata.longDescription || "",
        website: companydata.website || "",
        headquartersAddress: companydata.headquartersAddress || "",
        organizationType: companydata.organizationType || OrganizationType.STARTUP,
        organizationSize: companydata.organizationSize || OrganizationSize.MEDIUM,
        industryId: companydata.industryId || "",
        employeeCount: typeof companydata.employeeCount === "number" ? companydata.employeeCount : "",
        country: companydata.country || "",
        city: companydata.city || "",
        workingDays: companydata.workingDays || [WorkingDay.MONDAY, WorkingDay.TUESDAY, WorkingDay.WEDNESDAY, WorkingDay.THURSDAY, WorkingDay.FRIDAY],
        overtimePolicy: companydata.overtimePolicy || OvertimePolicy.AS_NEEDED,
        workScheduleTypes: companydata.workScheduleTypes || [WorkScheduleType.FULL_TIME],
      });
    }
  }, [companydata, reset]);

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      const payload: Partial<any> = {
        name: values.name,
        shortDescription: values.shortDescription || null,
        longDescription: values.longDescription || null,
        website: values.website || null,
        headquartersAddress: values.headquartersAddress || null,
        organizationType: values.organizationType || null,
        organizationSize: values.organizationSize || null,
        industryId: values.industryId || null,
        employeeCount: typeof values.employeeCount === "number" ? values.employeeCount : null,
        country: values.country || null,
        city: values.city || null,
        workingDays: values.workingDays?.length > 0 ? values.workingDays : null,
        overtimePolicy: values.overtimePolicy || null,
        workScheduleTypes: values.workScheduleTypes?.length > 0 ? values.workScheduleTypes : null,
        logoFileId: avatar?.id || null,
      };

      if (companyId && editMode && !pathname.includes("create")) {
        updateMut.mutate({ id: companyId, data: payload });
      } else if (pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION) {
        createMut.mutate(payload);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({ title: "Error", description: "Failed to save company profile.", variant: "destructive" });
    }
  };

  const handleLogoFile = async (file?: File) => {
    if (!file) return;
    try {
      const signed = await getSignUrl();
      const dto = {
        signature: signed.signature,
        timestamp: signed.timestamp,
        cloud_name: signed.cloudName,
        api_key: signed.apiKey,
        public_id: signed.publicId,
        folder: signed.folder || "",
        resourceType: signed.resourceType || "",
        fileId: signed.fileId || "",
        file,
      };
      const createRes = await createFileEntity(dto as any);
      const uploadRes = await uploadFile({ fileId: signed.fileId, data: createRes } as any);
      setAvatar({ id: uploadRes.id, url: uploadRes.url });
    } catch (err: any) {
      console.error("Logo upload error:", err);
      toast({ title: "Upload failed", description: err?.message || "Unable to upload logo.", variant: "destructive" });
    }
  };

  const handleWorkingDayChange = (day: WorkingDay, checked: boolean) => {
    const currentDays = workingDaysValue || [];
    if (checked) {
      setValue("workingDays", [...currentDays, day]);
    } else {
      setValue("workingDays", currentDays.filter((d) => d !== day));
    }
  };

  const handleWorkScheduleTypeChange = (type: WorkScheduleType, checked: boolean) => {
    const currentTypes = workScheduleTypesValue || [];
    if (checked) {
      setValue("workScheduleTypes", [...currentTypes, type]);
    } else {
      setValue("workScheduleTypes", currentTypes.filter((t) => t !== type));
    }
  };

  const getIndustryName = (industryId: string) => {
    if (!industryId || !industriesData?.data) return "";
    const industry = industriesData.data.find((ind) => ind.id === industryId);
    return industry?.name || "";
  };

  const getDisplayData = () => {
    if (editMode && previewMode) {
      return {
        ...companydata,
        ...watchedValues,
        logoFile: avatar ? { url: avatar.url } : companydata?.logoFile,
      };
    }
    return companydata;
  };

  const displayData = getDisplayData();

  if (pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION && !industriesData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (pathname !== ROUTES.CANDIDATE.CREATE_ORGANIZATION && !companydata) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h2>
        <Button onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Home</Button>
      </div>
    );
  }

  const isViewMode = !editMode || previewMode;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[#F8F9FB]">
      <div className="max-w-[1400px] mx-auto py-8 px-6 animate-fadeIn">
        {/* Navigation Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 uppercase tracking-wide">
            <ArrowLeft size={12}/> Back
        </button>

        {isViewMode && displayData ? (
            <div className="grid grid-cols-12 gap-8">
                {/* Main Content (Left) */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm relative">
                        <div className="flex gap-6 mb-6">
                            <div className="w-20 h-20 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden bg-white shadow-sm shrink-0">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={displayData?.logoFile?.url} className="object-cover"/>
                                    <AvatarFallback className="text-2xl font-bold text-[#0EA5E9] bg-blue-50">
                                        {displayData?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="pt-1 w-full">
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-1">{displayData?.name}</h1>
                                        <p className="text-gray-500 text-sm mb-3">{displayData?.shortDescription || "No slogan available"}</p>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {!editMode && myOrganizations?.some((org) => org.organizationId === companyId) && (
                                            <Button variant="outline" size="sm" onClick={() => setEditMode(true)} className="text-xs font-bold h-8">
                                                <Edit size={14} className="mr-1"/> Edit
                                            </Button>
                                        )}
                                        {/* Report & Review */}
                                        {!editMode && companyId && <ReportDialog entityId={companyId} entityType="organization" trigger={<Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"><Flag size={16}/></Button>} />}
                                        {!editMode && user && companyId && <OrganizationReviewDialog organizationId={companyId} trigger={<Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-[#0EA5E9]"><MessageSquare size={16}/></Button>} />}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                    {displayData?.website && (
                                        <a href={displayData.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                                            <Globe2 size={12}/> Website
                                        </a>
                                    )}
                                    <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                                        <Share2 size={12}/> Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Building size={18} className="text-gray-400"/> Overview
                            </h2>
                            <div className="text-sm text-gray-600 leading-7 text-justify">
                                {isHtmlContent(displayData.longDescription || "") ? 
                                    <RenderHtml content={displayData.longDescription || ""} /> : 
                                    <Markdown content={displayData.longDescription || "No detailed description provided."} />
                                }
                            </div>
                        </div>

                        {/* Work Environment */}
                        {(displayData?.workingDays?.length > 0 || displayData?.workScheduleTypes?.length > 0) && (
                            <div className="mb-8 border-t border-gray-100 pt-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar size={18} className="text-gray-400"/> Work Culture
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {displayData.workingDays?.length > 0 && (
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">Working Days</div>
                                            <div className="flex flex-wrap gap-2">
                                                {displayData.workingDays.map((day: string) => (
                                                    <span key={day} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium capitalize border border-gray-200">{day.toLowerCase()}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {displayData.workScheduleTypes?.length > 0 && (
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">Schedule</div>
                                            <div className="flex flex-wrap gap-2">
                                                {displayData.workScheduleTypes.map((type: string) => (
                                                    <span key={type} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100 capitalize">{formatEnumValue(type)}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* REVIEWS SECTION */}
                        <div className="border-t border-gray-100 pt-6 mt-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Star size={18} className="text-yellow-400 fill-yellow-400"/> Employee Reviews
                            </h2>
                            
                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {renderStars(review.overallRating)}
                                                        <span className="text-xs font-bold text-gray-900">{review.overallRating}.0</span>
                                                    </div>
                                                    <div className="font-bold text-gray-900 text-sm">{review.summary}</div>
                                                </div>
                                                <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            <p className="text-xs text-gray-600 leading-relaxed mb-4">"{review.whatMakesYouLoveWorkingHere}"</p>

                                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="text-xs">
                                                    <span className="text-gray-500 font-medium block mb-1">Pros</span>
                                                    <span className="text-gray-700">{review.overtimePolicySatisfaction === 'satisfied' ? 'Good Work-Life Balance' : 'Heavy Workload'}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-gray-500 font-medium block mb-1">Areas to Improve</span>
                                                    <span className="text-gray-700">{review.suggestionForImprovement || "None"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                                    <MessageSquare size={24} className="mx-auto text-gray-300 mb-2"/>
                                    <p className="text-sm text-gray-500 font-medium">No reviews yet.</p>
                                    <p className="text-xs text-gray-400">Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Preview Actions */}
                        {previewMode && (
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPreviewMode(false)} className="bg-white/90 backdrop-blur">
                                    <Edit size={14} className="mr-1"/> Edit
                                </Button>
                                <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-[#0EA5E9] hover:bg-[#0284c7]">
                                    <Save size={14} className="mr-1"/> Save
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm">Company Details</h3>
                        <div className="space-y-4 text-xs text-gray-500">
                            <div>
                                <div className="font-bold text-gray-400 mb-1">Industry</div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                    <Factory size={14} className="text-gray-400"/>
                                    {getIndustryName(displayData.industryId) || "N/A"}
                                </div>
                            </div>
                            <div>
                                <div className="font-bold text-gray-400 mb-1">Company Size</div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                    <Users size={14} className="text-gray-400"/>
                                    {displayData.organizationSize || "N/A"}
                                </div>
                            </div>
                            {displayData.employeeCount && (
                                <div>
                                    <div className="font-bold text-gray-400 mb-1">Employees</div>
                                    <div className="font-medium text-gray-900">{displayData.employeeCount}</div>
                                </div>
                            )}
                            <div>
                                <div className="font-bold text-gray-400 mb-1">Type</div>
                                <div className="font-medium text-gray-900 capitalize">{displayData.organizationType ? formatEnumValue(displayData.organizationType) : "N/A"}</div>
                            </div>
                            <div>
                                <div className="font-bold text-gray-400 mb-1">Headquarters</div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400"/>
                                    {displayData.headquartersAddress || "N/A"}
                                </div>
                            </div>
                            <div>
                                <div className="font-bold text-gray-400 mb-1">Founded</div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                    <Clock size={14} className="text-gray-400"/>
                                    {displayData.foundedDate ? new Date(displayData.foundedDate).getFullYear() : "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jobs Section (In Sidebar) */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <Briefcase size={16} className="text-gray-400"/> Open Roles
                            </h3>
                            <span className="text-[#0EA5E9] bg-blue-50 px-2 py-1 rounded-full text-[10px] font-bold">
                                {companyJobs?.length || 0}
                            </span>
                        </div>
                        
                        {companyJobs && companyJobs.length > 0 ? (
                            <div className="space-y-3">
                                {companyJobs.map((job) => (
                                    <div 
                                        key={job.id} 
                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                        className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer bg-white group"
                                    >
                                        <div className="font-bold text-gray-900 text-xs group-hover:text-[#0EA5E9] line-clamp-1 mb-1">{job.title}</div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <MapPin size={10}/> {job.location}
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400">{job.type}</div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full mt-2 text-xs font-bold h-8" onClick={() => navigate('/jobs')}>View All Jobs</Button>
                            </div>
                        ) : (
                            <div className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg text-center">
                                <Lightbulb size={16} className="mx-auto mb-1 text-gray-400"/>
                                No active job listings found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            // Edit Mode Form - Updated UI to match Simplify
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{pathname.includes("create") ? "Create Company Profile" : "Edit Profile"}</h1>
                        <p className="text-sm text-gray-500">Update your organization's public information.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setPreviewMode(true)} className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm h-10 px-4">
                            <Eye size={16} className="mr-2"/> Preview
                        </Button>
                        <Button variant="outline" onClick={() => {
                             if (pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION) navigate(-1);
                             else { setEditMode(false); reset(); }
                        }} className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm h-10 px-4">Cancel</Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-[#0EA5E9] hover:bg-[#0284c7] font-bold text-sm text-white shadow-sm h-10 px-6">
                            <Save size={16} className="mr-2"/> Save Changes
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Building className="text-[#0EA5E9]" size={18}/> Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                                    <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                                        <AvatarImage src={avatar?.url || companydata?.logoFile?.url} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xl">{(watchedValues.name || "C").charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <label className="cursor-pointer">
                                            <span className="text-sm font-bold text-[#0EA5E9] hover:underline">Upload Logo</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLogoFile(e.target.files[0])}/>
                                        </label>
                                        <p className="text-xs text-gray-400 mt-1">Recommended: Square JPG, PNG</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Company Name *</label>
                                    <Controller control={control} name="name" render={({field}) => <Input {...field} placeholder="e.g. Acme Corp" />} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Tagline</label>
                                    <Controller control={control} name="shortDescription" render={({field}) => <Textarea {...field} rows={2} placeholder="Brief catchy description" />} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Website</label>
                                    <Controller control={control} name="website" render={({field}) => <Input {...field} placeholder="https://..." />} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <MapPin className="text-[#0EA5E9]" size={18}/> Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Headquarters</label>
                                    <Controller control={control} name="headquartersAddress" render={({field}) => <Input {...field} placeholder="Full Address" />} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">City</label>
                                        <Controller control={control} name="city" render={({field}) => <Input {...field} placeholder="City" />} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Country</label>
                                        <Controller control={control} name="country" render={({field}) => <Input {...field} placeholder="Country" />} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Details & Culture */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <LayoutGrid className="text-[#0EA5E9]" size={18}/> Classification
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Industry</label>
                                    <Controller control={control} name="industryId" render={({field}) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Industry" /></SelectTrigger>
                                            <SelectContent>
                                                {industriesData?.data?.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Type</label>
                                        <Controller control={control} name="organizationType" render={({field}) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(OrganizationType).map(t => <SelectItem key={t} value={t}>{formatEnumValue(t)}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Size</label>
                                        <Controller control={control} name="organizationSize" render={({field}) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(OrganizationSize).map(s => <SelectItem key={s} value={s}>{formatEnumValue(s)}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Employee Count</label>
                                    <Controller control={control} name="employeeCount" render={({field}) => <Input type="number" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : "")} />} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="text-[#0EA5E9]" size={18}/> Work Culture
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Working Days</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.values(WorkingDay).map(day => (
                                            <div key={day} className="flex items-center gap-2">
                                                <Checkbox 
                                                    id={day} 
                                                    checked={workingDaysValue?.includes(day)}
                                                    onCheckedChange={(c) => handleWorkingDayChange(day, c as boolean)}
                                                />
                                                <label htmlFor={day} className="text-sm text-gray-600 capitalize cursor-pointer select-none">{day.toLowerCase()}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Schedule Types</label>
                                    <div className="flex flex-wrap gap-3">
                                        {Object.values(WorkScheduleType).map(type => (
                                            <div key={type} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                <Checkbox 
                                                    id={type} 
                                                    checked={workScheduleTypesValue?.includes(type)}
                                                    onCheckedChange={(c) => handleWorkScheduleTypeChange(type, c as boolean)}
                                                />
                                                <label htmlFor={type} className="text-xs font-bold text-gray-600 capitalize cursor-pointer select-none">{formatEnumValue(type)}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Overtime Policy</label>
                                    <Controller control={control} name="overtimePolicy" render={({field}) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Policy" /></SelectTrigger>
                                            <SelectContent>
                                                {Object.values(OvertimePolicy).map(p => <SelectItem key={p} value={p}>{formatEnumValue(p)}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Long Description (Full Width) */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <UploadCloud className="text-[#0EA5E9]" size={18}/> Detailed Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Controller control={control} name="longDescription" render={({field}) => (
                                    <Textarea {...field} rows={12} className="font-mono text-sm leading-relaxed" placeholder="Tell us about your company (Markdown supported)..." />
                                )} />
                                <p className="text-xs text-gray-400 mt-2 text-right">Supports Markdown</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfilePage;