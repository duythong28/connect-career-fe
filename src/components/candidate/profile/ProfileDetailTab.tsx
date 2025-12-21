import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  User,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CandidateProfile } from "@/api/types/candidates.types";
import RenderMarkDown from "@/components/shared/RenderMarkDown";
import { SkillsEditor } from "@/components/candidate/profile/SkillsEditor";

export enum CompletionStatus {
  INCOMPLETE = "incomplete",
  PARTIAL = "partial",
  COMPLETE = "complete",
}
export const CompletionStatusLabel: Record<CompletionStatus, string> = {
  [CompletionStatus.INCOMPLETE]: "Incomplete",
  [CompletionStatus.PARTIAL]: "Partial",
  [CompletionStatus.COMPLETE]: "Complete",
};

// --- UI COMPONENTS ---

const SectionCard = ({
  title,
  icon: Icon,
  onAdd,
  onEdit,
  children,
}: {
  title: string;
  icon: any;
  onAdd?: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-3xl p-8 shadow-sm mb-6 transition-all hover:border-primary/20">
    <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <Icon size={20} />
        </div>
        {title}
      </h3>
      <div className="flex gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Pencil size={14} className="mr-1.5" /> Edit
          </Button>
        )}
        {onAdd && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdd}
            className="text-primary hover:text-primary hover:bg-primary/10 font-semibold"
          >
            <Plus size={16} className="mr-1.5" /> Add
          </Button>
        )}
      </div>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

const InfoRow = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value?: string | null;
  href?: string | null;
}) => (
  <div className="flex items-center gap-4 text-sm group">
    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-bold text-muted-foreground uppercase mb-1 tracking-wide">
        {label}
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-primary font-medium truncate block hover:underline"
        >
          {value || "-"}
        </a>
      ) : (
        <div className="font-medium text-foreground truncate">
          {value || "-"}
        </div>
      )}
    </div>
  </div>
);

// --- MODAL OVERLAY ---
const ModalOverlay = ({
  children,
  title,
  icon: Icon,
  onClose,
  onSave,
  isSubmitting,
}: any) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl bg-card rounded-3xl p-0 gap-0 overflow-hidden shadow-xl border-border max-h-[90vh] flex flex-col">
      {/* Header */}
      <DialogHeader className="p-6 border-b border-border bg-card shrink-0 flex flex-row justify-between items-center space-y-0">
        <DialogTitle className="flex items-center gap-3 text-lg font-bold text-foreground">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            {Icon ? <Icon size={20} /> : <User size={20} />}
          </div>
          {title}
        </DialogTitle>
      </DialogHeader>

      {/* Body */}
      <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-5">
        {children}
      </div>

      {/* Footer */}
      <DialogFooter className="p-6 border-t border-border bg-muted/30 shrink-0 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="rounded-xl border-border hover:bg-background"
        >
          Cancel
        </Button>
        <Button
          variant="default" // Solid Blue Primary
          onClick={onSave}
          disabled={isSubmitting}
          className="rounded-xl px-6"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const InputGroup = ({ label, error, children, required }: any) => (
  <div className="flex flex-col gap-2 mb-5">
    <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1 ml-1">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-destructive font-medium ml-1">
        {error.message}
      </p>
    )}
  </div>
);

// --- SCHEMAS & EDITOR MODALS ---

// 1. Profile Editor
const profileSchema = z.object({
  user: z.object({ fullName: z.string().min(1, "Name required") }),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  socialLinks: z.object({
    linkedin: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    portfolio: z.string().optional().nullable(),
  }),
});

export function ProfileEditorModal({ data, onSave, onClose }: any) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: data,
  });
  return (
    <ModalOverlay
      title="Edit Personal Info"
      icon={User}
      onClose={onClose}
      onSave={handleSubmit(onSave)}
      isSubmitting={isSubmitting}
    >
      <InputGroup label="Full Name" required error={errors.user?.fullName}>
        <Controller
          control={control}
          name="user.fullName"
          render={({ field }) => (
            <Input
              {...field}
              className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
            />
          )}
        />
      </InputGroup>
      <div className="grid grid-cols-2 gap-6">
        <InputGroup label="Email" error={errors.email}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
              />
            )}
          />
        </InputGroup>
        <InputGroup label="Phone" error={errors.phone}>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                {...field}
                className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
              />
            )}
          />
        </InputGroup>
      </div>
      <InputGroup label="Location" error={errors.address}>
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <Input
              {...field}
              className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
              placeholder="City, Country"
            />
          )}
        />
      </InputGroup>
      <div className="pt-6 border-t border-border space-y-5">
        <h4 className="text-sm font-bold text-foreground">Social Links</h4>
        <InputGroup label="LinkedIn URL">
          <div className="relative">
            <Linkedin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Controller
              control={control}
              name="socialLinks.linkedin"
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full border-border rounded-xl pl-12 pr-4 py-3 h-auto focus:ring-primary"
                />
              )}
            />
          </div>
        </InputGroup>
        <InputGroup label="GitHub URL">
          <div className="relative">
            <Github
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Controller
              control={control}
              name="socialLinks.github"
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full border-border rounded-xl pl-12 pr-4 py-3 h-auto focus:ring-primary"
                />
              )}
            />
          </div>
        </InputGroup>
        <InputGroup label="Portfolio URL">
          <div className="relative">
            <Globe
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Controller
              control={control}
              name="socialLinks.portfolio"
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full border-border rounded-xl pl-12 pr-4 py-3 h-auto focus:ring-primary"
                />
              )}
            />
          </div>
        </InputGroup>
      </div>
    </ModalOverlay>
  );
}

// 2. Experience Editor
const experienceSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, "Required"),
  organizationName: z.string().min(1, "Required"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional().nullable(),
});

function ExperienceEditorModal({ initialData, onSubmit, onClose }: any) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      ...initialData,
      organizationName: initialData?.organization?.name || "",
    } || { isCurrent: false },
  });
  const isCurrent = watch("isCurrent");

  return (
    <ModalOverlay
      title={initialData ? "Edit Experience" : "Add Experience"}
      icon={Briefcase}
      onClose={onClose}
      onSave={handleSubmit((val) =>
        onSubmit({ ...val, organization: { name: val.organizationName } })
      )}
      isSubmitting={isSubmitting}
    >
      <InputGroup label="Job Title" required error={errors.jobTitle}>
        <Controller
          control={control}
          name="jobTitle"
          render={({ field }) => (
            <Input
              {...field}
              className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
            />
          )}
        />
      </InputGroup>
      <InputGroup label="Company" required error={errors.organizationName}>
        <Controller
          control={control}
          name="organizationName"
          render={({ field }) => (
            <Input
              {...field}
              className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
            />
          )}
        />
      </InputGroup>
      <div className="grid grid-cols-2 gap-6">
        <InputGroup label="Start Date">
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <Input
                type="date"
                {...field}
                className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
              />
            )}
          />
        </InputGroup>
        <InputGroup label="End Date">
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <Input
                type="date"
                {...field}
                disabled={isCurrent}
                className="w-full border-border rounded-xl focus:ring-primary h-auto py-3 disabled:opacity-50"
              />
            )}
          />
        </InputGroup>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Controller
          control={control}
          name="isCurrent"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              id="curr_work"
              className="border-primary text-primary rounded-md"
            />
          )}
        />
        <label
          htmlFor="curr_work"
          className="text-sm text-foreground font-medium cursor-pointer"
        >
          I currently work here
        </label>
      </div>
      <InputGroup label="Description">
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              {...field}
              rows={5}
              className="w-full border-border rounded-xl focus:ring-primary resize-none p-4"
            />
          )}
        />
      </InputGroup>
    </ModalOverlay>
  );
}

const DEGREE_TYPES = [
  { value: "high_school", label: "High School" },
  { value: "associate", label: "Associate" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "doctorate", label: "Doctorate" },
  { value: "certificate", label: "Certificate" },
  { value: "diploma", label: "Diploma" },
];

// 3. Education Editor
const educationSchema = z.object({
  id: z.string().optional(),
  institutionName: z.string().min(1, "Required"),
  degreeType: z.enum(
    [
      "high_school",
      "associate",
      "bachelor",
      "master",
      "doctorate",
      "certificate",
      "diploma",
    ],
    {
      errorMap: () => ({ message: "Please select a degree type" }),
    }
  ),
  fieldOfStudy: z.string().min(1, "Required"),
  startDate: z.string().optional().nullable(),
  graduationDate: z.string().optional().nullable(),
});

function EducationEditorModal({ initialData, onSubmit, onClose }: any) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData || { degreeType: "" },
  });
  return (
    <ModalOverlay
      title={initialData ? "Edit Education" : "Add Education"}
      icon={GraduationCap}
      onClose={onClose}
      onSave={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <InputGroup
        label="School / Institution"
        required
        error={errors.institutionName}
      >
        <Controller
          control={control}
          name="institutionName"
          render={({ field }) => (
            <Input
              {...field}
              className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
            />
          )}
        />
      </InputGroup>
      <div className="grid grid-cols-2 gap-6">
        <InputGroup label="Degree" required error={errors.degreeType}>
          <Controller
            control={control}
            name="degreeType"
            render={({ field }) => (
              <select
                {...field}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none h-auto bg-background"
              >
                <option value="">Select degree type</option>
                {DEGREE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}
          />
        </InputGroup>
        <InputGroup label="Field of Study" required error={errors.fieldOfStudy}>
          <Controller
            control={control}
            name="fieldOfStudy"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="e.g. Computer Science"
                className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
              />
            )}
          />
        </InputGroup>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <InputGroup label="Start Date">
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <Input
                type="date"
                {...field}
                className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
              />
            )}
          />
        </InputGroup>
        <InputGroup label="Graduation Date">
          <Controller
            control={control}
            name="graduationDate"
            render={({ field }) => (
              <Input
                type="date"
                {...field}
                className="w-full border-border rounded-xl focus:ring-primary h-auto py-3"
              />
            )}
          />
        </InputGroup>
      </div>
    </ModalOverlay>
  );
}

// --- MAIN COMPONENT ---

export default function ProfileDetailTab({
  profileData,
  isMyProfile,
  editMode,
  updateProfile,
}: {
  profileData: CandidateProfile;
  isMyProfile: boolean;
  editMode: boolean;
  updateProfile: (data: any) => void;
}) {
  const [dialog, setDialog] = useState<{
    type: null | "profile" | "experience" | "education";
    open: boolean;
    initialData?: any;
  }>({ type: null, open: false });

  // Logic handlers
  const handleProfileSave = (payload: any) => {
    updateProfile(payload);
    setDialog({ type: null, open: false });
  };
  const handleExperienceSave = (data: any) => {
    const current = profileData.workExperiences ?? [];
    const { organizationName, ...rest } = data;
    const newItem = { ...rest, organization: { name: organizationName } };

    if (data.id) {
      // Editing existing item
      updateProfile({
        workExperiences: current.map((e) => (e.id === data.id ? newItem : e)),
      });
    } else {
      // Creating new item - don't set id, let backend handle it
      updateProfile({ workExperiences: [...current, newItem] });
    }
    setDialog({ type: null, open: false });
  };
  const handleEducationSave = (data: any) => {
    const current = profileData.educations ?? [];

    if (data.id) {
      // Editing existing item
      updateProfile({
        educations: current.map((e) => (e.id === data.id ? data : e)),
      });
    } else {
      // Creating new item - don't set id, let backend handle it
      updateProfile({ educations: [...current, data] });
    }
    setDialog({ type: null, open: false });
  };
  const handleDelete = (section: keyof CandidateProfile, id: string) => {
    updateProfile({
      [section]: (profileData[section] as any[]).filter(
        (item: any) => item.id !== id
      ),
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Modals */}
      {dialog.type === "profile" && (
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
          onSave={handleProfileSave}
          onClose={() => setDialog({ type: null, open: false })}
        />
      )}
      {dialog.type === "experience" && (
        <ExperienceEditorModal
          initialData={dialog.initialData}
          onSubmit={handleExperienceSave}
          onClose={() => setDialog({ type: null, open: false })}
        />
      )}
      {dialog.type === "education" && (
        <EducationEditorModal
          initialData={dialog.initialData}
          onSubmit={handleEducationSave}
          onClose={() => setDialog({ type: null, open: false })}
        />
      )}

      {/* 1. BASIC INFORMATION CARD */}
      <SectionCard
        title="Basic Information"
        icon={User}
        onEdit={
          isMyProfile && editMode
            ? () => setDialog({ type: "profile", open: true })
            : undefined
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <InfoRow icon={Mail} label="Email" value={profileData.email} />
          <InfoRow icon={Phone} label="Phone" value={profileData.phone} />
          <InfoRow icon={MapPin} label="Location" value={profileData.address} />
          <InfoRow
            icon={Linkedin}
            label="LinkedIn"
            value={profileData.socialLinks?.linkedin}
            href={profileData.socialLinks?.linkedin}
          />
          <InfoRow
            icon={Github}
            label="GitHub"
            value={profileData.socialLinks?.github}
            href={profileData.socialLinks?.github}
          />
          <InfoRow
            icon={Globe}
            label="Portfolio"
            value={profileData.socialLinks?.portfolio}
            href={profileData.socialLinks?.portfolio}
          />
        </div>
      </SectionCard>

      {/* 2. SKILLS CARD */}
      <SectionCard title="Skills" icon={Briefcase}>
        <SkillsEditor
          skills={profileData.skills}
          isEditable={isMyProfile && editMode}
          onUpdate={(skills) => updateProfile({ skills })}
        />
      </SectionCard>

      {/* 3. EXPERIENCE CARD */}
      <SectionCard
        title="Work Experience"
        icon={Briefcase}
        onAdd={
          isMyProfile && editMode
            ? () => setDialog({ type: "experience", open: true })
            : undefined
        }
      >
        {profileData.workExperiences &&
        profileData.workExperiences.length > 0 ? (
          profileData.workExperiences.map((exp) => (
            <div
              key={exp.id}
              className="group relative pl-6 border-l-2 border-border hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-foreground text-base">
                    {exp.jobTitle}
                  </div>
                  <div className="text-sm text-primary font-bold mb-1">
                    {exp.organization?.name}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </div>
                  <div className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">
                    <RenderMarkDown content={exp.description || ""} />
                  </div>
                </div>
                {isMyProfile && editMode && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setDialog({
                          type: "experience",
                          open: true,
                          initialData: exp,
                        })
                      }
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete("workExperiences", exp.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground/60 italic text-center py-4">
            No work experience added yet.
          </div>
        )}
      </SectionCard>

      {/* 4. EDUCATION CARD */}
      <SectionCard
        title="Education"
        icon={GraduationCap}
        onAdd={
          isMyProfile && editMode
            ? () => setDialog({ type: "education", open: true })
            : undefined
        }
      >
        {profileData.educations && profileData.educations.length > 0 ? (
          profileData.educations.map((edu) => (
            <div
              key={edu.id}
              className="group relative pl-6 border-l-2 border-border hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-foreground text-base">
                    {edu.institutionName}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1 font-medium">
                    {edu.degreeType}, {edu.fieldOfStudy}
                  </div>
                  <div className="text-xs text-muted-foreground/80 flex items-center gap-1 uppercase tracking-wide">
                    <Calendar size={12} /> {edu.startDate} -{" "}
                    {edu.graduationDate}
                  </div>
                </div>
                {isMyProfile && editMode && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setDialog({
                          type: "education",
                          open: true,
                          initialData: edu,
                        })
                      }
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete("educations", edu.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground/60 italic text-center py-4">
            No education added yet.
          </div>
        )}
      </SectionCard>
    </div>
  );
}
