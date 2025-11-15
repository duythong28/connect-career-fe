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
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
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

type CompanyFormValues = {
  name: string;
  shortDescription: string;
  longDescription: string;
  website: string;
  headquartersAddress: string;
  organizationType: OrganizationType;
  organizationSize: OrganizationSize;
  industryId: string;
  employeeCount?: number | "";
  country: string;
  city: string;
  workingDays: WorkingDay[];
  overtimePolicy: OvertimePolicy;
  workScheduleTypes: WorkScheduleType[];
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

// Helper functions to format enum values for display
const formatEnumValue = (value: string) => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CompanyProfilePage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<{ id: string; url: string } | null>(
    null
  );
  const { pathname } = useLocation();
  const [previewMode, setPreviewMode] = useState(false);

  const { data: companydata } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getOrganizationById(companyId!),
    enabled: !!companyId,
  });

  const { data: industriesData } = useQuery({
    queryKey: ["industries"],
    queryFn: getIndistries,
  });

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
  const watchedValues = watch(); // Watch all values for preview

  // Reset form when companydata loads/changes
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
      setAvatar({
        id: uploadRes.id,
        url: uploadRes.url,
      });
    } catch (err: any) {
      console.error("Logo upload error:", err);
      toast({
        title: "Upload failed",
        description: err?.message || "Unable to upload logo.",
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

  // Find industry name by ID
  const getIndustryName = (industryId: string) => {
    if (!industryId || !industriesData?.data) return "";
    const industry = industriesData.data.find((ind) => ind.id === industryId);
    return industry?.name || "";
  };

  // Get display data (either from form or company data)
  const getDisplayData = () => {
    if (editMode && previewMode) {
      // In preview mode, merge watched values with company data
      return {
        ...companydata,
        ...watchedValues,
        logoFile: avatar ? { url: avatar.url } : companydata?.logoFile,
      };
    }
    return companydata;
  };

  const displayData = getDisplayData();

  // Show loading for create organization page
  if (pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION) {
    if (!industriesData) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
  } else {
    // For existing company pages
    if (!companydata) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Company not found
            </h2>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      );
    }
  }

  const isViewMode = !editMode || previewMode;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-8">
        {/* Highlight Section - View Mode */}
        {isViewMode && displayData && (
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Logo */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-28 w-28 border-4 border-white/20 shadow-lg">
                  <AvatarImage
                    src={displayData?.logoFile?.url || undefined}
                    alt={displayData?.name || "Company"}
                  />
                  <AvatarFallback className="text-3xl bg-white/20 text-white">
                    {displayData?.name?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Company Info */}
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    {/* Company Name */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                      {displayData?.name || "Company Name"}
                    </h1>

                    {/* Short Description */}
                    {displayData?.shortDescription && (
                      <p className="text-blue-50 text-base md:text-lg leading-relaxed mb-6">
                        {displayData.shortDescription}
                      </p>
                    )}

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-4 text-blue-100">
                      {displayData?.organizationSize && (
                        <span className="flex items-center text-base">
                          <Users className="h-5 w-5 mr-2" />
                          {displayData.organizationSize}
                        </span>
                      )}

                      {displayData?.industryId &&
                        getIndustryName(displayData.industryId) && (
                          <span className="flex items-center text-base">
                            <Factory className="h-5 w-5 mr-2" />
                            {getIndustryName(displayData.industryId)}
                          </span>
                        )}

                      {displayData?.city && displayData?.country && (
                        <span className="flex items-center text-base">
                          <MapPin className="h-5 w-5 mr-2" />
                          {displayData.city}, {displayData.country}
                        </span>
                      )}

                      {displayData?.website && (
                        <span className="flex items-center text-base">
                          <Globe className="h-5 w-5 mr-2" />
                          {(() => {
                            try {
                              return new URL(displayData.website).hostname;
                            } catch {
                              return displayData.website;
                            }
                          })()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {!editMode && displayData?.website && (
                      <Button
                        className="bg-white/20 text-white border-white/20 hover:bg-white/30 hover:border-white/30"
                        onClick={() => {
                          try {
                            const url = displayData.website.startsWith("http")
                              ? displayData.website
                              : `https://${displayData.website}`;
                            window.open(url, "_blank");
                          } catch (error) {
                            console.error("Invalid URL:", error);
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Website
                      </Button>
                    )}

                    {!editMode && (
                      <Button
                        variant="outline"
                        className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/40"
                        onClick={() => setEditMode(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}

                    {editMode && previewMode && (
                      <>
                        <Button
                          className="bg-white/20 text-white border-white/20 hover:bg-white/30 hover:border-white/30"
                          onClick={() => setPreviewMode(false)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/40"
                          onClick={handleSubmit(onSubmit)}
                          disabled={isSubmitting}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Highlight Section - Edit Mode */}
        {editMode && !previewMode && (
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                  {pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION
                    ? "Create Company Profile"
                    : "Edit Company Profile"}
                </h1>
                <p className="text-blue-50 text-base md:text-lg leading-relaxed">
                  {pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION
                    ? "Set up your company profile to start posting jobs and attracting talent."
                    : "Update your company information to keep your profile current and engaging."}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Button
                  className="bg-white/20 text-white border-white/20 hover:bg-white/30 hover:border-white/30"
                  onClick={() => setPreviewMode(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/40"
                  onClick={() => {
                    if (pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION) {
                      navigate(-1);
                    } else {
                      setEditMode(false);
                      setPreviewMode(false);
                      reset();
                      setAvatar(null);
                    }
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="bg-white text-blue-700 hover:bg-white/90"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting
                    ? "Saving..."
                    : pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION
                    ? "Create Company"
                    : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {/* View Mode */}
        {isViewMode && displayData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section - Only show if has content */}
              {displayData?.longDescription && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <Building className="h-5 w-5 mr-2" />
                      About {displayData?.name || "Company"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none text-base">
                      <Markdown content={displayData.longDescription} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Company Info */}
            <div className="space-y-6">
              {/* Company Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {displayData?.organizationType && (
                      <div className="flex items-center justify-between">
                        <span className="text-base text-gray-600">Type</span>
                        <span className="text-base font-medium">
                          {formatEnumValue(displayData.organizationType)}
                        </span>
                      </div>
                    )}

                    {typeof displayData?.employeeCount === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-base text-gray-600">
                          Employees
                        </span>
                        <span className="text-base font-medium">
                          {displayData.employeeCount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {displayData?.foundedDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-base text-gray-600">Founded</span>
                        <span className="text-base font-medium">
                          {new Date(displayData.foundedDate).getFullYear()}
                        </span>
                      </div>
                    )}

                    {displayData?.headquartersAddress && (
                      <div className="flex items-center justify-between">
                        <span className="text-base text-gray-600">
                          Headquarters
                        </span>
                        <span className="text-base font-medium text-right max-w-[200px] truncate">
                          {displayData.headquartersAddress}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Work Information - Only show if has content */}
              {(displayData?.workingDays?.length > 0 ||
                displayData?.workScheduleTypes?.length > 0 ||
                displayData?.overtimePolicy) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <Calendar className="h-5 w-5 mr-2" />
                      Work Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {displayData?.workingDays &&
                      displayData.workingDays.length > 0 && (
                        <div>
                          <span className="text-base text-gray-600 block mb-2">
                            Working Days
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {displayData.workingDays.map((day: string) => (
                              <Badge
                                key={day}
                                variant="outline"
                                className="capitalize"
                              >
                                {day.toLowerCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {displayData?.workScheduleTypes &&
                      displayData.workScheduleTypes.length > 0 && (
                        <div>
                          <span className="text-base text-gray-600 block mb-2">
                            Work Schedule
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {displayData.workScheduleTypes.map(
                              (type: string) => (
                                <Badge key={type} variant="secondary">
                                  {formatEnumValue(type)}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {displayData?.overtimePolicy && (
                      <div>
                        <span className="text-base text-gray-600 block mb-2">
                          Overtime Policy
                        </span>
                        <Badge variant="outline">
                          {formatEnumValue(displayData.overtimePolicy)}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {editMode && !previewMode && (
          <div className="mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl md:text-2xl">
                      <Building className="h-6 w-6 mr-3" />
                      Basic Information
                    </CardTitle>
                    <p className="text-base text-gray-600 mt-2">
                      Essential details about your company that appear in the
                      header
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Logo Upload - Enhanced */}
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg mx-auto md:mx-0">
                          <AvatarImage
                            src={
                              avatar?.url ||
                              companydata?.logoFile?.url ||
                              undefined
                            }
                            alt={companydata?.name || "Company"}
                          />
                          <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {(
                              companydata?.name ||
                              watchedValues?.name ||
                              "C"
                            ).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow text-center md:text-left">
                          <h4 className="text-lg font-semibold mb-2">
                            Company Logo
                          </h4>
                          <label className="block cursor-pointer">
                            <span className="sr-only">Choose logo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="block w-full text-base text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                await handleLogoFile(f);
                              }}
                            />
                          </label>
                          <p className="text-base text-gray-500 mt-2">
                            Upload a company logo (JPG, PNG, max 5MB). This will
                            appear in your profile header.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Company Name *
                        </label>
                        <Controller
                          control={control}
                          name="name"
                          render={({ field, fieldState }) => (
                            <>
                              <Input
                                placeholder="Enter your company name"
                                className="text-base h-12 border-2 focus:border-blue-500"
                                {...field}
                              />
                              {fieldState.error && (
                                <p className="text-red-600 text-base mt-2 flex items-center">
                                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                                  {fieldState.error.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>

                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Short Description
                        </label>
                        <Controller
                          control={control}
                          name="shortDescription"
                          render={({ field }) => (
                            <Textarea
                              placeholder="Brief description that appears in your profile header (e.g., 'Leading fintech company revolutionizing digital payments')"
                              rows={4}
                              className="text-base border-2 focus:border-blue-500 resize-none"
                              {...field}
                            />
                          )}
                        />
                        <p className="text-base text-gray-600 mt-2">
                          This appears prominently in your company header. Keep
                          it concise and impactful.
                        </p>
                      </div>

                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Company Website
                        </label>
                        <Controller
                          control={control}
                          name="website"
                          render={({ field, fieldState }) => (
                            <>
                              <Input
                                placeholder="https://yourcompany.com"
                                className="text-base h-12 border-2 focus:border-blue-500"
                                {...field}
                              />
                              {fieldState.error && (
                                <p className="text-red-600 text-base mt-2 flex items-center">
                                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                                  {fieldState.error.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                        <p className="text-base text-gray-600 mt-2">
                          Your official website URL for external links and
                          verification.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Classification */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl md:text-2xl">
                      <Factory className="h-6 w-6 mr-3" />
                      Company Classification
                    </CardTitle>
                    <p className="text-base text-gray-600 mt-2">
                      Help candidates understand your company type and industry
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Industry
                        </label>
                        <Controller
                          control={control}
                          name="industryId"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="text-base h-12 border-2">
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {industriesData?.data?.map((industry) => (
                                  <SelectItem
                                    key={industry.id}
                                    value={industry.id}
                                    className="text-base py-3"
                                  >
                                    {industry.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Organization Type
                        </label>
                        <Controller
                          control={control}
                          name="organizationType"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="text-base h-12 border-2">
                                <SelectValue placeholder="Select organization type" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(OrganizationType).map((type) => (
                                  <SelectItem
                                    key={type}
                                    value={type}
                                    className="text-base py-3"
                                  >
                                    {formatEnumValue(type)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Organization Size
                        </label>
                        <Controller
                          control={control}
                          name="organizationSize"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="text-base h-12 border-2">
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(OrganizationSize).map((size) => (
                                  <SelectItem
                                    key={size}
                                    value={size}
                                    className="text-base py-3"
                                  >
                                    {formatEnumValue(size)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Employee Count
                        </label>
                        <Controller
                          control={control}
                          name="employeeCount"
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="e.g., 150"
                              className="text-base h-12 border-2 focus:border-blue-500"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                            />
                          )}
                        />
                        <p className="text-base text-gray-600 mt-2">
                          Optional: Exact number of employees for more precision
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl md:text-2xl">
                      <MapPin className="h-6 w-6 mr-3" />
                      Location Information
                    </CardTitle>
                    <p className="text-base text-gray-600 mt-2">
                      Where your company is based and operates
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <label className="text-lg font-semibold text-gray-800 block mb-3">
                        Headquarters Address
                      </label>
                      <Controller
                        control={control}
                        name="headquartersAddress"
                        render={({ field }) => (
                          <Input
                            placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View, CA"
                            className="text-base h-12 border-2 focus:border-blue-500"
                            {...field}
                          />
                        )}
                      />
                      <p className="text-base text-gray-600 mt-2">
                        Full address of your main office or headquarters
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Country
                        </label>
                        <Controller
                          control={control}
                          name="country"
                          render={({ field }) => (
                            <Input
                              placeholder="e.g., United States"
                              className="text-base h-12 border-2 focus:border-blue-500"
                              {...field}
                            />
                          )}
                        />
                      </div>

                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          City
                        </label>
                        <Controller
                          control={control}
                          name="city"
                          render={({ field }) => (
                            <Input
                              placeholder="e.g., San Francisco"
                              className="text-base h-12 border-2 focus:border-blue-500"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Company Description */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl md:text-2xl">
                      <Building className="h-6 w-6 mr-3" />
                      Company Description
                    </CardTitle>
                    <p className="text-base text-gray-600 mt-2">
                      Tell your story in detail using Markdown formatting
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label className="text-lg font-semibold text-gray-800 block mb-3">
                          Detailed Description (Markdown)
                        </label>
                        <Controller
                          control={control}
                          name="longDescription"
                          render={({ field }) => (
                            <Textarea
                              rows={25}
                              placeholder={`## About Us
We are a leading technology company focused on innovation and excellence. Our mission is to transform industries through cutting-edge solutions.

## What We Do
- Develop innovative software solutions
- Provide enterprise consulting services
- Build scalable cloud infrastructure

## Our Culture
- Collaborative and inclusive environment
- Continuous learning and growth
- Work-life balance and flexibility

## Why Join Us?
- Competitive compensation and benefits
- Remote work opportunities
- Professional development programs
- Health and wellness benefits
- Stock options and equity participation

## Our Values
1. **Innovation** - We push boundaries and embrace new ideas
2. **Integrity** - We operate with honesty and transparency
3. **Excellence** - We strive for the highest quality in everything
4. **Collaboration** - We work together to achieve great results`}
                              className="min-h-[600px] font-mono text-base border-2 focus:border-blue-500 resize-none"
                              {...field}
                            />
                          )}
                        />
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="text-base font-semibold text-blue-800 mb-2">
                            💡 Markdown Tips
                          </h4>
                          <ul className="text-base text-blue-700 space-y-1">
                            <li>• Use ## for section headings</li>
                            <li>• Use **bold** for emphasis</li>
                            <li>• Use - or * for bullet points</li>
                            <li>• Use 1. 2. 3. for numbered lists</li>
                            <li>
                              • Include company mission, values, culture, and
                              benefits
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Environment */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl md:text-2xl">
                      <Calendar className="h-6 w-6 mr-3" />
                      Work Environment
                    </CardTitle>
                    <p className="text-base text-gray-600 mt-2">
                      Define your work schedule and policies
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <label className="text-lg font-semibold text-gray-800 block mb-4">
                        Working Days
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.values(WorkingDay).map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <Checkbox
                              id={`working-day-${day}`}
                              checked={workingDaysValue?.includes(day) || false}
                              onCheckedChange={(checked) =>
                                handleWorkingDayChange(day, checked as boolean)
                              }
                              className="w-5 h-5"
                            />
                            <label
                              htmlFor={`working-day-${day}`}
                              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer flex-grow"
                            >
                              {day.toLowerCase()}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-lg font-semibold text-gray-800 block mb-4">
                        Work Schedule Types
                      </label>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.values(WorkScheduleType).map((type) => (
                          <div
                            key={type}
                            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <Checkbox
                              id={`schedule-type-${type}`}
                              checked={
                                workScheduleTypesValue?.includes(type) || false
                              }
                              onCheckedChange={(checked) =>
                                handleWorkScheduleTypeChange(
                                  type,
                                  checked as boolean
                                )
                              }
                              className="w-5 h-5"
                            />
                            <label
                              htmlFor={`schedule-type-${type}`}
                              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-grow"
                            >
                              {formatEnumValue(type)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-lg font-semibold text-gray-800 block mb-3">
                        Overtime Policy
                      </label>
                      <Controller
                        control={control}
                        name="overtimePolicy"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="text-base h-12 border-2">
                              <SelectValue placeholder="Select overtime policy" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(OvertimePolicy).map((policy) => (
                                <SelectItem
                                  key={policy}
                                  value={policy}
                                  className="text-base py-3"
                                >
                                  {formatEnumValue(policy)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <p className="text-base text-gray-600 mt-2">
                        How your company handles overtime work and compensation
                      </p>
                    </div>
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
