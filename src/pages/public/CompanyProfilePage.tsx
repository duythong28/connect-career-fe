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
  Lightbulb,
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

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

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert text-gray-600 leading-relaxed",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-gray-900 mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-gray-900 mb-2 mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-xs sm:text-sm">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-4 mb-3 space-y-1 text-xs sm:text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-4 mb-3 space-y-1 text-xs sm:text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-[#0EA5E9] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
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
        className={
          i <= rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-200 fill-gray-200"
        }
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
  const [avatar, setAvatar] = useState<{ id: string; url: string } | null>(
    null
  );
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
        organizationType:
          companydata.organizationType || OrganizationType.STARTUP,
        organizationSize:
          companydata.organizationSize || OrganizationSize.MEDIUM,
        industryId: companydata.industryId || "",
        employeeCount:
          typeof companydata.employeeCount === "number"
            ? companydata.employeeCount
            : "",
        country: companydata.country || "",
        city: companydata.city || "",
        workingDays: companydata.workingDays || [
          WorkingDay.MONDAY,
          WorkingDay.TUESDAY,
          WorkingDay.WEDNESDAY,
          WorkingDay.THURSDAY,
          WorkingDay.FRIDAY,
        ],
        overtimePolicy: companydata.overtimePolicy || OvertimePolicy.AS_NEEDED,
        workScheduleTypes: companydata.workScheduleTypes || [
          WorkScheduleType.FULL_TIME,
        ],
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
        employeeCount:
          typeof values.employeeCount === "number"
            ? values.employeeCount
            : null,
        country: values.country || null,
        city: values.city || null,
        workingDays: values.workingDays?.length > 0 ? values.workingDays : null,
        overtimePolicy: values.overtimePolicy || null,
        workScheduleTypes:
          values.workScheduleTypes?.length > 0
            ? values.workScheduleTypes
            : null,
        logoFileId: avatar?.id || null,
      };

      if (companyId && editMode && !pathname.includes("create")) {
        updateMut.mutate({ id: companyId, data: payload });
      } else if (pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION) {
        createMut.mutate(payload);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: "Failed to save company profile.",
        variant: "destructive",
      });
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
      const uploadRes = await uploadFile({
        fileId: signed.fileId,
        data: createRes,
      } as any);
      setAvatar({ id: uploadRes.id, url: uploadRes.url });
    } catch (err: any) {
      console.error("Logo upload error:", err);
      toast({
        title: "Upload failed",
        description: err?.message || "Unable to upload logo.",
        variant: "destructive",
      });
    }
  };

  const handleWorkingDayChange = (day: WorkingDay, checked: boolean) => {
    const currentDays = workingDaysValue || [];
    if (checked) {
      setValue("workingDays", [...currentDays, day]);
    } else {
      setValue(
        "workingDays",
        currentDays.filter((d) => d !== day)
      );
    }
  };

  const handleWorkScheduleTypeChange = (
    type: WorkScheduleType,
    checked: boolean
  ) => {
    const currentTypes = workScheduleTypesValue || [];
    if (checked) {
      setValue("workScheduleTypes", [...currentTypes, type]);
    } else {
      setValue(
        "workScheduleTypes",
        currentTypes.filter((t) => t !== type)
      );
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (pathname !== ROUTES.CANDIDATE.CREATE_ORGANIZATION && !companydata) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Company not found
        </h2>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>
      </div>
    );
  }

  const isViewMode = !editMode || previewMode;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 px-6 animate-fade-in max-w-[1400px] w-full mx-auto">
      {/* Navigation Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 uppercase tracking-wide"
      >
        <ArrowLeft size={12} /> Back
      </button>

      {isViewMode && displayData ? (
        <div className="w-full grid grid-cols-12 gap-8">
          {/* Main Content (Left) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Header Card */}
            <div className="bg-card rounded-3xl p-8 border border-border relative">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl border border-border flex items-center justify-center overflow-hidden bg-card shrink-0">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                      src={displayData?.logoFile?.url}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold text-primary bg-secondary">
                      {displayData?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="pt-1 w-full">
                  <div className="flex justify-between items-start w-full gap-4">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-2xl font-bold text-foreground mb-1 truncate">
                        {displayData?.name}
                      </h1>
                      <p className="text-muted-foreground text-sm mb-4">
                        {displayData?.shortDescription || "No slogan available"}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!editMode &&
                        myOrganizations?.some(
                          (org: any) => org.organizationId === companyId
                        ) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditMode(true)}
                            className="text-xs font-bold h-9 rounded-xl"
                          >
                            <Edit size={14} className="mr-1.5" /> Edit
                          </Button>
                        )}
                      {/* Report & Review triggers */}
                      {!editMode && companyId && (
                        <div className="flex items-center gap-1">
                          <ReportDialog
                            entityId={companyId}
                            entityType="organization"
                            trigger={
                              <Button
                                variant="outline"
                                className="p-2 h-8 w-8 rounded-xl hover:border-destructive hover:text-destructive"
                              >
                                <Flag size={12} />
                              </Button>
                            }
                          />
                          <OrganizationReviewDialog
                            organizationId={companyId}
                            trigger={
                              <Button
                                variant="outline"
                                className="p-2 h-8 w-8 rounded-xl hover:border-primary hover:text-primary"
                              >
                                <MessageSquare size={12} />
                              </Button>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    {displayData?.website && (
                      <a
                        href={displayData.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      >
                        <Globe2 size={14} /> Website
                      </a>
                    )}
                    <Button
                      variant="outline"
                      className="h-8 text-xs font-bold gap-1.5 border-border rounded-xl text-muted-foreground px-3"
                    >
                      <Share2 size={14} /> Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-10">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Building size={20} className="text-primary" /> Overview
                </h2>
                <div className="text-sm text-muted-foreground leading-relaxed text-justify">
                  {isHtmlContent(displayData.longDescription || "") ? (
                    <RenderHtml content={displayData.longDescription || ""} />
                  ) : (
                    <Markdown
                      content={
                        displayData.longDescription ||
                        "No detailed description provided."
                      }
                    />
                  )}
                </div>
              </div>

              {/* Work Environment */}
              {(displayData?.workingDays?.length > 0 ||
                displayData?.workScheduleTypes?.length > 0) && (
                <div className="mb-4 border-t border-border pt-8">
                  <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-primary" /> Work Culture
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {displayData.workingDays?.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-wider">
                          Working Days
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {displayData.workingDays.map((day: string) => (
                            <Badge
                              key={day}
                              variant="secondary"
                              className="bg-muted text-muted-foreground px-2.5 py-1 rounded-lg text-xs font-bold border-none capitalize"
                            >
                              {day.toLowerCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {displayData.workScheduleTypes?.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-wider">
                          Schedule
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {displayData.workScheduleTypes.map((type: string) => (
                            <Badge
                              key={type}
                              className="bg-secondary text-primary px-2.5 py-1 rounded-lg text-xs font-bold border-none capitalize"
                            >
                              {formatEnumValue(type)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* REVIEWS SECTION */}
              <div className="border-t border-border pt-8 mt-10">
                <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <Star size={20} className="text-yellow-400 fill-yellow-400" />{" "}
                  Employee Reviews
                </h2>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="bg-card border border-border rounded-2xl p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              {renderStars(review.overallRating)}
                              <span className="text-xs font-bold text-foreground ml-1">
                                {review.overallRating}.0
                              </span>
                            </div>
                            <div className="font-bold text-foreground text-sm leading-tight">
                              {review.summary}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 italic">
                          "{review.whatMakesYouLoveWorkingHere}"
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                          <div className="text-xs">
                            <span className="text-muted-foreground font-bold uppercase text-[10px] block mb-1.5">
                              Pros
                            </span>
                            <span className="text-foreground font-medium">
                              {review.overtimePolicySatisfaction === "satisfied"
                                ? "Good Work-Life Balance"
                                : "Heavy Workload"}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground font-bold uppercase text-[10px] block mb-1.5">
                              Areas to Improve
                            </span>
                            <span className="text-foreground font-medium">
                              {review.suggestionForImprovement || "None"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-2xl border border-border border-dashed">
                    <MessageSquare
                      size={32}
                      className="mx-auto text-muted-foreground/30 mb-3"
                    />
                    <p className="text-sm text-muted-foreground font-bold">
                      No reviews yet.
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>

              {/* Preview Actions */}
              {previewMode && (
                <div className="absolute top-6 right-6 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(false)}
                    className="bg-card/90 backdrop-blur rounded-xl h-9 font-bold"
                  >
                    <Edit size={14} className="mr-1.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 rounded-xl h-9 font-bold"
                  >
                    <Save size={14} className="mr-1.5" /> Save
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6">
              <h3 className="font-bold text-foreground mb-6 text-sm uppercase tracking-wider">
                Company Details
              </h3>
              <div className="space-y-6 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-secondary rounded-lg shrink-0">
                    <Factory size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-muted-foreground uppercase text-[10px] mb-1">
                      Industry
                    </div>
                    <div className="font-bold text-foreground text-sm">
                      {getIndustryName(displayData.industryId) || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-secondary rounded-lg shrink-0">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-muted-foreground uppercase text-[10px] mb-1">
                      Company Size
                    </div>
                    <div className="font-bold text-foreground text-sm">
                      {displayData.organizationSize || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
                  <div>
                    <div className="font-bold text-muted-foreground uppercase text-[10px] mb-1">
                      Type
                    </div>
                    <div className="font-bold text-foreground capitalize">
                      {displayData.organizationType
                        ? formatEnumValue(displayData.organizationType)
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-muted-foreground uppercase text-[10px] mb-1">
                      Founded
                    </div>
                    <div className="font-bold text-foreground">
                      {displayData.foundedDate
                        ? new Date(displayData.foundedDate).getFullYear()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="font-bold text-muted-foreground uppercase text-[10px] mb-2 flex items-center gap-1.5">
                    <MapPin size={12} /> Headquarters
                  </div>
                  <div className="font-bold text-foreground text-sm leading-relaxed">
                    {displayData.headquartersAddress || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Section (In Sidebar) */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" /> Open Roles
                </h3>
                <Badge className="bg-primary text-white rounded-full text-[10px] font-bold border-none h-5 min-w-[20px] flex items-center justify-center">
                  {companyJobs?.length || 0}
                </Badge>
              </div>

              {companyJobs && companyJobs.length > 0 ? (
                <div className="space-y-3">
                  {companyJobs.slice(0, 5).map((job: any) => (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="p-4 border border-border rounded-2xl hover:border-primary/30 hover:bg-secondary/20 transition-all cursor-pointer bg-card group"
                    >
                      <div className="font-bold text-foreground text-xs group-hover:text-primary transition-colors line-clamp-1 mb-2">
                        {job.title}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                        <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-primary/60" />{" "}
                          {job.location}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[9px] h-4 px-1.5 border-border rounded-md uppercase font-extrabold text-muted-foreground"
                        >
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-4 text-xs font-bold h-10 rounded-xl border-border hover:bg-secondary"
                    onClick={() => navigate("/jobs")}
                  >
                    View All Jobs
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/10 rounded-2xl border border-border border-dashed">
                  <Lightbulb
                    size={24}
                    className="mx-auto mb-2 text-muted-foreground/30"
                  />
                  <p className="text-xs text-muted-foreground font-bold">
                    No active job listings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode Form - Updated UI to match Simplify
        <div className="w-full">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {pathname.includes("create")
                  ? "Create Company Profile"
                  : "Edit Profile"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Update your organization's public information.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(true)}
                className="h-10 px-4 rounded-xl font-bold text-sm border-border bg-card text-foreground"
              >
                <Eye size={16} className="mr-2 text-primary" /> Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION)
                    navigate(-1);
                  else {
                    setEditMode(false);
                    reset();
                  }
                }}
                className="h-10 px-4 rounded-xl font-bold text-sm border-border bg-card text-foreground"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="h-10 px-6 rounded-xl font-bold text-sm bg-primary text-white"
              >
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <Card className="rounded-3xl border-border bg-card shadow-none overflow-hidden">
                <CardHeader className="pb-4 border-b border-border">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Building className="text-primary" size={18} /> Basic
                    Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border border-dashed">
                    <Avatar className="h-16 w-16 border-2 border-white rounded-xl shadow-sm">
                      <AvatarImage
                        src={avatar?.url || companydata?.logoFile?.url}
                      />
                      <AvatarFallback className="bg-secondary text-primary font-bold text-xl rounded-xl">
                        {(watchedValues.name || "C").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <span className="text-sm font-bold text-primary hover:underline">
                          Upload Logo
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleLogoFile(e.target.files[0])
                          }
                        />
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: Square JPG, PNG
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">
                      Company Name *
                    </label>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g. Acme Corp"
                          className="rounded-xl border-border focus:ring-2 focus:ring-primary"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">
                      Tagline
                    </label>
                    <Controller
                      control={control}
                      name="shortDescription"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="Brief catchy description"
                          className="rounded-xl border-border focus:ring-2 focus:ring-primary resize-none"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">
                      Website
                    </label>
                    <Controller
                      control={control}
                      name="website"
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="https://..."
                          className="rounded-xl border-border focus:ring-2 focus:ring-primary"
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border bg-card shadow-none overflow-hidden">
                <CardHeader className="pb-4 border-b border-border">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <MapPin className="text-primary" size={18} /> Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">
                      Headquarters
                    </label>
                    <Controller
                      control={control}
                      name="headquartersAddress"
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Full Address"
                          className="rounded-xl border-border focus:ring-2 focus:ring-primary"
                        />
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase block">
                        City
                      </label>
                      <Controller
                        control={control}
                        name="city"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="City"
                            className="rounded-xl border-border focus:ring-2 focus:ring-primary"
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase block">
                        Country
                      </label>
                      <Controller
                        control={control}
                        name="country"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Country"
                            className="rounded-xl border-border focus:ring-2 focus:ring-primary"
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Details & Culture */}
            <div className="space-y-6">
              <Card className="rounded-3xl border-border bg-card shadow-none overflow-hidden">
                <CardHeader className="pb-4 border-b border-border">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <LayoutGrid className="text-primary" size={18} />{" "}
                    Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">
                      Industry
                    </label>
                    <Controller
                      control={control}
                      name="industryId"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="rounded-xl border-border focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {industriesData?.data?.map((i: any) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase block">
                        Type
                      </label>
                      <Controller
                        control={control}
                        name="organizationType"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="rounded-xl border-border focus:ring-2 focus:ring-primary">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {Object.values(OrganizationType).map((t: any) => (
                                <SelectItem key={t} value={t}>
                                  {formatEnumValue(t)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase block">
                        Size
                      </label>
                      <Controller
                        control={control}
                        name="organizationSize"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="rounded-xl border-border focus:ring-2 focus:ring-primary">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {Object.values(OrganizationSize).map((s: any) => (
                                <SelectItem key={s} value={s}>
                                  {formatEnumValue(s)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">
                      Employee Count
                    </label>
                    <Controller
                      control={control}
                      name="employeeCount"
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                          className="rounded-xl border-border focus:ring-2 focus:ring-primary"
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border bg-card shadow-none overflow-hidden">
                <CardHeader className="pb-4 border-b border-border">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Calendar className="text-primary" size={18} /> Work Culture
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-3 block">
                      Working Days
                    </label>
                    <div className="grid grid-cols-3 gap-y-3 gap-x-2">
                      {Object.values(WorkingDay).map((day: any) => (
                        <div key={day} className="flex items-center gap-2">
                          <Checkbox
                            id={day}
                            checked={workingDaysValue?.includes(day)}
                            onCheckedChange={(c) =>
                              handleWorkingDayChange(day, c as boolean)
                            }
                            className="rounded-md border-border data-[state=checked]:bg-primary"
                          />
                          <label
                            htmlFor={day}
                            className="text-sm text-muted-foreground capitalize cursor-pointer select-none font-medium"
                          >
                            {day.toLowerCase()}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-3 block">
                      Schedule Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(WorkScheduleType).map((type: any) => (
                        <div
                          key={type}
                          className="flex items-center gap-2 bg-secondary/40 px-3 py-2 rounded-xl border border-border"
                        >
                          <Checkbox
                            id={type}
                            checked={workScheduleTypesValue?.includes(type)}
                            onCheckedChange={(c) =>
                              handleWorkScheduleTypeChange(type, c as boolean)
                            }
                            className="rounded-md border-border data-[state=checked]:bg-primary"
                          />
                          <label
                            htmlFor={type}
                            className="text-xs font-bold text-foreground capitalize cursor-pointer select-none"
                          >
                            {formatEnumValue(type)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase block">
                      Overtime Policy
                    </label>
                    <Controller
                      control={control}
                      name="overtimePolicy"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="rounded-xl border-border focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select Policy" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {Object.values(OvertimePolicy).map((p: any) => (
                              <SelectItem key={p} value={p}>
                                {formatEnumValue(p)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Long Description (Full Width) */}
            <div className="md:col-span-2">
              <Card className="rounded-3xl border-border bg-card shadow-none overflow-hidden">
                <CardHeader className="pb-4 border-b border-border">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <UploadCloud className="text-primary" size={18} /> Detailed
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Controller
                    control={control}
                    name="longDescription"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        rows={12}
                        className="rounded-xl border-border focus:ring-2 focus:ring-primary text-sm leading-relaxed min-h-[300px]"
                        placeholder="Tell us about your company (Markdown supported)..."
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground mt-3 text-right font-medium">
                    Supports Markdown
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfilePage;
