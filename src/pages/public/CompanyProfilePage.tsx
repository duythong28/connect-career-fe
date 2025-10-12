import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  Edit,
  Star,
  ArrowLeft,
  ExternalLink,
  Globe,
  Tag,
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

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/constants/routes";

type CompanyFormValues = {
  name: string;
  shortDescription: string;
  longDescription: string;
  website: string;
  headquartersAddress: string;
  organizationSize: string;
  employeeCount?: number | "";
  country: string;
  city: string;
  workingDaysCsv: string;
  keywordsCsv: string;
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  shortDescription: z.string().optional().nullable().default(""),
  longDescription: z.string().optional().nullable().default(""),
  website: z.string().url().optional().nullable().or(z.literal("")).default(""),
  headquartersAddress: z.string().optional().nullable().default(""),
  organizationSize: z.string().optional().nullable().default(""),
  employeeCount: z
    .union([z.number().int().nonnegative(), z.undefined(), z.null()])
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v))
    .nullable(),
  country: z.string().optional().nullable().default(""),
  city: z.string().optional().nullable().default(""),
  workingDaysCsv: z.string().optional().default(""),
  keywordsCsv: z.string().optional().default(""),
  logoUrl: z.string().optional().nullable().default(""),
});

const CompanyProfilePage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState(null);
  const { pathname } = useLocation();

  const { data: companydata } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getOrganizationById(companyId!),
    enabled: !!companyId,
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
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      website: "",
      headquartersAddress: "",
      organizationSize: "",
      employeeCount: "",
      country: "",
      city: "",
      workingDaysCsv: "",
      keywordsCsv: "",
    },
  });

  // reset form when companydata loads/changes
  useEffect(() => {
    reset({
      name: companydata?.name ?? "",
      shortDescription: companydata?.shortDescription ?? "",
      longDescription:
        companydata?.longDescription ?? companydata?.longDescription ?? "",
      website: companydata?.website ?? "",
      headquartersAddress: companydata?.headquartersAddress ?? "",
      organizationSize: companydata?.organizationSize ?? "",
      employeeCount:
        typeof companydata?.employeeCount === "number"
          ? companydata?.employeeCount
          : "",
      country: companydata?.country ?? "",
      city: companydata?.city ?? "",
      workingDaysCsv: Array.isArray(companydata?.workingDays)
        ? companydata?.workingDays?.join(",")
        : "",
      keywordsCsv: Array.isArray((companydata as any)?.keywords)
        ? (companydata as any)?.keywords?.join(",")
        : "",
    });
  }, [companydata, reset]);

  const onSubmit = async (values: CompanyFormValues) => {
    const payload: Partial<any> = {
      name: values.name,
      shortDescription: values.shortDescription || null,
      longDescription: values.longDescription || null,
      website: values.website || null,
      headquartersAddress: values.headquartersAddress || null,
      organizationSize: values.organizationSize || null,
      employeeCount:
        typeof values.employeeCount === "number"
          ? values.employeeCount
          : undefined,
      country: values.country || null,
      city: values.city || null,
      workingDays: values.workingDaysCsv
        ? values.workingDaysCsv
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      keywords: values.keywordsCsv
        ? values.keywordsCsv
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      logoFileId: avatar?.id,
    };
    if (companyId && editMode) {
      updateMut.mutate({ id: companyId, data: payload });
    }

    if (pathname === ROUTES.CANDIDATE.CREATE_ORGANIZATION) {
      createMut.mutate(payload);
    }
  };

  // logo upload flow (similar to AvatarEditor)
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
      console.error(err);
      toast({
        title: "Upload failed",
        description: err?.message || "Unable to upload logo.",
      });
    }
  };

  if (!companydata && pathname !== ROUTES.CANDIDATE.CREATE_ORGANIZATION) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white">
                  <AvatarImage
                    src={avatar?.url || companydata?.logoFile?.url || undefined}
                  />
                  <AvatarFallback className="text-4xl">
                    {companydata?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {editMode && (
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white/90"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      await handleLogoFile(f);
                    }}
                  />
                )}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  {editMode ? (
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input className="text-4xl font-bold p-2" {...field} />
                      )}
                    />
                  ) : (
                    <h1 className="text-4xl font-bold mb-2">
                      {companydata.name}
                    </h1>
                  )}
                </div>

                {editMode ? (
                  <Controller
                    control={control}
                    name="shortDescription"
                    render={({ field }) => (
                      <Textarea
                        className="text-xl text-blue-100 mb-4"
                        rows={2}
                        {...field}
                      />
                    )}
                  />
                ) : (
                  <p className="text-xl text-blue-100 mb-4">
                    {companydata?.shortDescription}
                  </p>
                )}

                <div className="flex items-center space-x-6 text-blue-100">
                  {editMode ? (
                    <Controller
                      control={control}
                      name="headquartersAddress"
                      render={({ field }) => (
                        <Input
                          placeholder="Headquarters"
                          {...field}
                          className="w-80"
                        />
                      )}
                    />
                  ) : (
                    companydata?.headquartersAddress && (
                      <span className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        {companydata?.headquartersAddress}
                      </span>
                    )
                  )}

                  {editMode ? (
                    <Controller
                      control={control}
                      name="organizationSize"
                      render={({ field }) => (
                        <Input placeholder="Company size" {...field} />
                      )}
                    />
                  ) : (
                    companydata?.organizationSize && (
                      <span className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        {companydata?.organizationSize}
                      </span>
                    )
                  )}
                </div>

                <div className="flex items-center space-x-6 mt-4 text-sm">
                  {editMode ? (
                    <>
                      <Controller
                        control={control}
                        name="employeeCount"
                        render={({ field }) => (
                          <Input
                            type="number"
                            placeholder="Employees"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                            className="w-40"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="website"
                        render={({ field }) => (
                          <Input
                            placeholder="Website"
                            {...field}
                            className="w-64"
                          />
                        )}
                      />
                    </>
                  ) : (
                    <>
                      {typeof companydata?.employeeCount === "number" && (
                        <span>{companydata?.employeeCount} employees</span>
                      )}
                      {companydata?.website && (
                        <span className="flex items-center">
                          <Globe className="h-4 w-4 mr-1" />
                          {new URL(companydata?.website).hostname}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!editMode && companydata?.website && (
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => window.open(companydata?.website, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Website
                </Button>
              )}

              <Button
                onClick={() => {
                  setEditMode((s) => !s);
                }}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4 mr-2" />
                {editMode ? "Cancel" : "Edit Company"}
              </Button>

              {editMode && (
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {companydata?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <Controller
                    control={control}
                    name="longDescription"
                    render={({ field }) => <Textarea rows={8} {...field} />}
                  />
                ) : (
                  <Markdown
                    content={
                      companydata?.longDescription ||
                      companydata?.shortDescription ||
                      ""
                    }
                  />
                )}
              </CardContent>
            </Card>

            {/* Company Reviews (unchanged display) */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        4.2
                      </div>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= 4
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Based on 127 reviews
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        rating: 5,
                        title: "Great place to work",
                        content:
                          "Amazing company culture and great opportunities for growth. The team is very supportive and the work is challenging and rewarding.",
                        author: "Software Engineer",
                        date: "2024-01-10",
                      },
                      {
                        id: 2,
                        rating: 4,
                        title: "Good work-life balance",
                        content:
                          "Really appreciate the flexible working arrangements and the company's focus on employee wellbeing. Management is understanding and supportive.",
                        author: "Product Manager",
                        date: "2024-01-05",
                      },
                    ].map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {review.title}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{review.author}</span>
                              <span>•</span>
                              <span>{review.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {editMode ? (
                  <>
                    <Controller
                      control={control}
                      name="organizationSize"
                      render={({ field }) => (
                        <Input {...field} placeholder="Organization size" />
                      )}
                    />
                    <Controller
                      control={control}
                      name="employeeCount"
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                          placeholder="Employee count"
                        />
                      )}
                    />
                  </>
                ) : (
                  <>
                    {companydata?.organizationType && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-medium">
                          {companydata?.organizationType}
                        </span>
                      </div>
                    )}
                    {companydata?.organizationSize && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Company Size</span>
                        <span className="font-medium">
                          {companydata?.organizationSize}
                        </span>
                      </div>
                    )}
                    {companydata?.employeeCount !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Employees</span>
                        <span className="font-medium">
                          {companydata?.employeeCount}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {editMode ? (
                  <Controller
                    control={control}
                    name="keywordsCsv"
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Comma separated keywords"
                      />
                    )}
                  />
                ) : (
                  companydata?.keywords &&
                  companydata?.keywords.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm">Keywords</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {companydata?.keywords?.map((k: string) => (
                          <Badge key={k} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1 inline" /> {k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Location & Work Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {editMode ? (
                  <>
                    <Controller
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <Input {...field} placeholder="Country" />
                      )}
                    />
                    <Controller
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <Input {...field} placeholder="City" />
                      )}
                    />
                    <Controller
                      control={control}
                      name="workingDaysCsv"
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Working days (comma separated)"
                        />
                      )}
                    />
                  </>
                ) : (
                  <>
                    {companydata?.country && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" /> Country
                        </span>
                        <span className="font-medium">
                          {companydata?.country}
                        </span>
                      </div>
                    )}
                    {companydata?.city && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" /> City
                        </span>
                        <span className="font-medium">{companydata?.city}</span>
                      </div>
                    )}
                    {companydata?.workingDays &&
                      companydata?.workingDays?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm">Working days</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {companydata?.workingDays?.map((d: string) => (
                              <Badge
                                key={d}
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {d}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
