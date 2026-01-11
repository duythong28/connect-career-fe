import { useState, useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  GraduationCap,
  User,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  X,
  Linkedin,
  Github,
  Globe,
  Trash2,
  Pencil,
  Calendar,
  Loader2,
  Mic,
  UploadCloudIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createMyProfile } from "@/api/endpoints/candidates.api";
import {
  CandidateProfile,
  WorkExperience,
  Education,
} from "@/api/types/candidates.types";
import { ExtractedCvData } from "@/api/types/cv.types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import UploadFilButton from "@/components/ai/UploadFileButton";
import VoiceProfileWizard from "./VoiceProfileWizard";

// --- Utility Functions ---

const formatMonthYearToDate = (
  monthYear: string | undefined | null
): string | null => {
  if (!monthYear) return null;

  // Try parsing as full date first (YYYY-MM-DD or ISO format)
  const fullDateMatch = monthYear.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (fullDateMatch) {
    return `${fullDateMatch[1]}-${fullDateMatch[2]}-${fullDateMatch[3]}`;
  }

  // Check if it's a valid full date string
  if (!isNaN(Date.parse(monthYear))) {
    const date = new Date(monthYear);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Match different formats
  const match = monthYear.match(
    /^(\d{4})$|^([A-Za-z]+)\s+(\d{4})$|^(\d{1,2})[/-](\d{4})$/
  );

  if (!match) return null;

  let year: string;
  let month: string;

  // Year only (e.g., "2020")
  if (match[1]) {
    year = match[1];
    month = "01";
  }
  // Month name + Year (e.g., "January 2020")
  else if (match[2] && match[3]) {
    const monthIndex = new Date(Date.parse(match[2] + " 1, 2000")).getMonth() + 1;
    month = monthIndex.toString().padStart(2, "0");
    year = match[3];
  }
  // Numeric Month/Year (e.g., "01/2020" or "1-2020")
  else if (match[4] && match[5]) {
    month = match[4].padStart(2, "0");
    year = match[5];
  } else {
    return null;
  }

  return `${year}-${month}-01`;
};

const normalizeDegreeType = (
  degreeString: string | undefined | null
): string => {
  if (!degreeString) return "";
  const cleanString = degreeString.toLowerCase().replace(/[^a-z]/g, "");

  if (cleanString.includes("bachelor") || cleanString.includes("bs"))
    return "bachelor";
  if (cleanString.includes("master") || cleanString.includes("ms"))
    return "master";
  if (cleanString.includes("doctorate") || cleanString.includes("phd"))
    return "doctorate";
  if (cleanString.includes("associate") || cleanString.includes("aa"))
    return "associate";
  if (cleanString.includes("highschool")) return "high_school";
  if (cleanString.includes("cert")) return "certificate";
  if (cleanString.includes("diploma")) return "diploma";

  return "";
};

// --- UI COMPONENTS ---

const InputGroup: React.FC<any> = ({
  label,
  error,
  children,
  required,
  className = "",
}) => (
  <div className={`flex flex-col gap-2 mb-5 ${className}`}>
    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1 ml-1">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-destructive font-medium ml-1">
        {error.message}
      </p>
    )}
  </div>
);

const ModalOverlay: React.FC<any> = ({
  children,
  title,
  icon: Icon,
  onClose,
  onSave,
  isSubmitting,
}) => (
  <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
    <div
      className="bg-card rounded-3xl w-full max-w-2xl border border-border max-h-[90vh] flex flex-col shadow-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-6 border-b border-border bg-card shrink-0 flex flex-row justify-between items-center rounded-t-3xl">
        <h3 className="flex items-center gap-3 text-lg font-bold text-foreground">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            {Icon ? <Icon size={20} /> : <User size={20} />}
          </div>
          {title}
        </h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-5">
        {children}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border bg-card/50 shrink-0 flex justify-end gap-3 rounded-b-3xl">
        <Button variant="outline" onClick={onClose} className="rounded-xl">
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={onSave}
          disabled={isSubmitting}
          className="rounded-xl"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  </div>
);

// --- INTERFACES & SCHEMAS ---

interface SocialLinksForm {
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
}

interface BasicInfoForm {
  phone?: string | null;
  address?: string | null;
  socialLinks: SocialLinksForm;
}

interface ExperienceItemForm {
  id?: string;
  jobTitle: string;
  organizationName: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
}

interface EducationItemForm {
  id?: string;
  institutionName: string;
  degreeType: z.infer<typeof educationItemSchema>["degreeType"];
  fieldOfStudy: string;
  startDate?: string | null;
  graduationDate?: string | null;
}

interface WizardStepProps<T> {
  initialData: T;
  onNext: (data: Partial<CandidateProfile>) => void;
  onBack?: (clearData?: boolean) => void;
}

const basicInfoSchema = z.object({
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  socialLinks: z
    .object({
      linkedin: z.string().optional().nullable(),
      github: z.string().optional().nullable(),
      portfolio: z.string().optional().nullable(),
    })
    .default({}),
});

const experienceItemSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, "Job Title is required"),
  organizationName: z.string().min(1, "Company is required"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional().nullable(),
});

const DEGREE_TYPES = [
  { value: "high_school", label: "High School" },
  { value: "associate", label: "Associate" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "doctorate", label: "Doctorate" },
  { value: "certificate", label: "Certificate" },
  { value: "diploma", label: "Diploma" },
];

const educationItemSchema = z.object({
  id: z.string().optional(),
  institutionName: z.string().min(1, "Institution Name is required"),
  degreeType: z
    .enum(
      [
        "high_school",
        "associate",
        "bachelor",
        "master",
        "doctorate",
        "certificate",
        "diploma",
        "",
      ],
      {
        errorMap: () => ({ message: "Please select a degree type" }),
      }
    )
    .refine((val) => val !== "", { message: "Please select a degree type" }),
  fieldOfStudy: z.string().min(1, "Required"),
  startDate: z.string().optional().nullable(),
  graduationDate: z.string().optional().nullable(),
});

// --- 0. Step 0: Start/Upload CV ---
interface StartStepProps {
  onNext: (data: Partial<CandidateProfile>) => void;
  onSkip: () => void;
  onSetInitialData: (cvData: ExtractedCvData) => void;
}

const StartStep: React.FC<StartStepProps> = ({
  onNext,
  onSkip,
  onSetInitialData,
}) => {
  const [cvData, setCvData] = useState<ExtractedCvData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMode, setSelectedMode] = useState<
    "choose" | "upload" | "voice" | "manual"
  >("choose");

  const handleContinue = () => {
    if (cvData) {
      onNext(cvData as unknown as Partial<CandidateProfile>);
    } else {
      onSkip();
    }
  };

  // Show mode selection first
  if (selectedMode === "choose") {
    return (
      <div className="animate-fadeIn max-w-lg mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Begin Your Journey
          </h2>
          <p className="text-muted-foreground">
            Choose how you'd like to create your profile
          </p>
        </div>

        <div className="space-y-4">
          {/* Voice Option */}
          <button
            onClick={() => setSelectedMode("voice")}
            className="w-full bg-card border border-border hover:border-primary rounded-3xl p-6 transition-all text-left group "
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                <Mic size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  Voice Interview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Have a natural conversation with our AI assistant. Just speak
                  and we'll build your profile automatically.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-primary font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Fast & Natural</span>
                </div>
              </div>
            </div>
          </button>

          {/* Upload Option */}
          <button
            onClick={() => setSelectedMode("upload")}
            className="w-full bg-card border border-border hover:border-primary rounded-3xl p-6 transition-all text-left group "
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                <UploadCloudIcon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  Upload Resume
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload your existing resume and let our AI extract the
                  information automatically.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-primary font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Quick & Easy</span>
                </div>
              </div>
            </div>
          </button>

          {/* Manual Option */}
          <button
            onClick={() => setSelectedMode("manual")}
            className="w-full bg-card border border-border hover:border-primary rounded-3xl p-6 transition-all text-left group "
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  Manual Entry
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fill in your information step by step using our guided form.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                  <User size={14} />
                  <span>Full Control</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Voice mode
  if (selectedMode === "voice") {
    return (
      <div className="animate-fadeIn max-w-5xl mx-auto">
        <VoiceProfileWizard
          onComplete={(data) => {
            setCvData(data);
            onSetInitialData(data);
          }}
          onCancel={() => setSelectedMode("choose")}
        />
      </div>
    );
  }

  // Upload mode
  if (selectedMode === "upload") {
    return (
      <div className="animate-fadeIn max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Upload Your Resume
          </h2>
          <p className="text-muted-foreground text-sm">
            Upload your CV and we'll extract the information automatically
          </p>
        </div>

        <div
          className={`bg-card border rounded-3xl p-8 transition-all ${
            cvData ? "border-primary" : "border-border"
          }`}
        >
          <UploadFilButton
            onUploadSuccess={(data) => {
              setCvData(data);
              onSetInitialData(data);
            }}
            onUploadProcess={(processing) => setIsProcessing(processing)}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={() => setSelectedMode("choose")}
            className="flex-1 rounded-xl"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isProcessing || !cvData}
            className="flex-1 bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-primary-foreground font-bold rounded-xl"
          >
            Continue <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Manual mode (original behavior)
  return (
    <div className="animate-fadeIn max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Manual Entry
        </h2>
        <p className="text-muted-foreground text-sm">
          Fill in your information step by step
        </p>
      </div>

      <Button
        onClick={onSkip}
        className="w-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-primary-foreground font-bold py-6 text-base rounded-xl"
      >
        Start Filling Profile <ArrowRight size={18} className="ml-2" />
      </Button>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => setSelectedMode("choose")}
          className="w-full rounded-xl"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Options
        </Button>
      </div>
    </div>
  );
};

// --- 1. Step 1: Basic Info ---
const BasicInfoStep: React.FC<WizardStepProps<BasicInfoForm>> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData,
  });

  const handleBackToStart = () => {
    if (onBack) onBack(true);
  };

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        Basic Information
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Tell us about yourself to get started.
      </p>

      <form onSubmit={handleSubmit(onNext)}>
        {/* Form Section: Personal Details (Card 1) */}
        <div className="bg-card border border-border rounded-3xl p-8 mb-6">
          <InputGroup label="Phone Number" error={errors.phone}>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
                />
              )}
            />
          </InputGroup>
          <InputGroup label="Location (City, Country)" error={errors.address}>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="e.g. San Francisco, CA"
                />
              )}
            />
          </InputGroup>
        </div>

        {/* Form Section: Social Links (Card 2) */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <h3 className="text-lg font-bold text-foreground mb-6 text-center">
            Digital Presence
          </h3>
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
                  <input
                    {...field}
                    type="url"
                    className="w-full border border-border bg-background text-foreground rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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
                  <input
                    {...field}
                    type="url"
                    className="w-full border border-border bg-background text-foreground rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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
                  <input
                    {...field}
                    type="url"
                    className="w-full border border-border bg-background text-foreground rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                )}
              />
            </div>
          </InputGroup>
        </div>

        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBackToStart}
            className="px-6 rounded-xl"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          <Button
            type="submit"
            variant="default" // Standard Primary - Solid Blue
            disabled={isSubmitting}
            className="px-8 rounded-xl"
          >
            Next Step <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};

// --- 2. Step 2: Skills ---
const SkillsStep: React.FC<WizardStepProps<{ skills: string[] }>> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [newSkill, setNewSkill] = useState<string>("");

  const addSkill = () => {
    if (
      newSkill.trim() &&
      !skills
        .map((s) => s.toLowerCase())
        .includes(newSkill.trim().toLowerCase())
    ) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleNext = () => onNext({ skills });

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        Skills & Expertise
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        What do you bring to the table?
      </p>

      <div className="bg-card border border-border rounded-3xl p-8 mb-6">
        <div className="mb-8">
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block ml-1">
            Add your skills
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter skill (e.g., React, Python, SQL...)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              className="flex-1 border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            />
            <Button
              onClick={addSkill}
              type="button"
              variant="default"
              className="rounded-xl px-4"
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-6 border-t border-border">
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 ml-1">
            Current Skills ({skills.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {skills.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 italic ml-1">
                No skills added yet.
              </p>
            ) : (
              skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-primary/60 hover:text-destructive transition-colors p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="px-6 rounded-xl">
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          className="px-8 rounded-xl"
        >
          Next Step <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// --- 3. Step 3: Work Experience ---

const ExperienceModal: React.FC<{
  item: ExperienceItemForm | null;
  onClose: () => void;
  onSubmit: (data: ExperienceItemForm) => void;
}> = ({ item, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceItemForm>({
    resolver: zodResolver(experienceItemSchema),
    defaultValues: item || {
      id: undefined,
      isCurrent: false,
      organizationName: "",
      startDate: null,
      endDate: null,
    },
  });
  const isCurrent = watch("isCurrent");

  return (
    <ModalOverlay
      title={item ? "Edit Experience" : "Add Experience"}
      icon={Briefcase}
      onClose={onClose}
      onSave={handleSubmit((data) => {
        onSubmit(data);
      })}
      isSubmitting={isSubmitting}
    >
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <div className="text-primary mt-0.5">
          <Briefcase size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground mb-1">
            Profile Section
          </h4>
          <p className="text-xs text-muted-foreground">
            Information added here is used to autofill your job applications.
          </p>
        </div>
      </div>
      <form id="exp-form" onSubmit={handleSubmit(onSubmit)}>
        <InputGroup label="Job Title" required error={errors.jobTitle}>
          <Controller
            control={control}
            name="jobTitle"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            )}
          />
        </InputGroup>
        <InputGroup label="Company" required error={errors.organizationName}>
          <Controller
            control={control}
            name="organizationName"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            )}
          />
        </InputGroup>
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Start Date">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              )}
            />
          </InputGroup>
          <InputGroup label="End Date">
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  disabled={isCurrent}
                  className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              )}
            />
          </InputGroup>
        </div>
        <div className="flex items-center gap-2 mb-6 ml-1">
          <Controller
            control={control}
            name="isCurrent"
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                id="curr_work_modal"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
            )}
          />
          <label
            htmlFor="curr_work_modal"
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
              <textarea
                {...field}
                rows={5}
                className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none custom-scrollbar"
              />
            )}
          />
        </InputGroup>
      </form>
    </ModalOverlay>
  );
};

const ExperienceStep: React.FC<
  WizardStepProps<{ workExperiences: WorkExperience[] }>
> = ({ initialData, onNext, onBack }) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    initialData.workExperiences || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItemForm | null>(
    null
  );

  const handleSaveItem = (data: ExperienceItemForm) => {
        console.log("Saving experience item:", data);
    const isNew = !experiences.some((e) => e.id === data.id);
    const id = data.id || Date.now().toString();

    const formattedStartDate = formatMonthYearToDate(data.startDate);
    const formattedEndDate = formatMonthYearToDate(data.endDate);

    const newItem: WorkExperience = {
      organizationName: data.organizationName,
      id: id,
      jobTitle: data.jobTitle,
      startDate: formattedStartDate || "",
      endDate: formattedEndDate,
      isCurrent: !!data.isCurrent,
      description: data.description || null,
      employmentType: "full_time",
      location: "N/A",
      skills: [],
      candidateProfileId: "",
      organizationId: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("Saving experience item:", newItem);
    if (!isNew) {
      setExperiences(experiences.map((e) => (e.id === data.id ? newItem : e)));
    } else {
      setExperiences([...experiences, newItem]);
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (exp: WorkExperience | null) => {
    const formItem: ExperienceItemForm | null = exp
      ? {
          id: exp.id,
          jobTitle: exp.jobTitle,
          organizationName: exp.organization?.name || "",
          startDate: exp.startDate
            ? formatMonthYearToDate(exp.startDate)
            : null,
          endDate: exp.endDate ? formatMonthYearToDate(exp.endDate) : null,
          isCurrent: exp.isCurrent,
          description: exp.description || undefined,
        }
      : null;
    setEditingItem(formItem);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleNext = () => onNext({ workExperiences: experiences });

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
      {isModalOpen && (
        <ExperienceModal
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveItem}
        />
      )}

      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        Work Experience
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Highlight your professional journey.
      </p>

      <div className="bg-card border border-border rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
              <Briefcase size={18} />
            </div>
            History
          </h3>
          <Button
            onClick={() => handleEdit(null)}
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Plus size={16} className="mr-1" /> Add Experience
          </Button>
        </div>

        {experiences.length === 0 ? (
          <div className="text-sm text-muted-foreground italic text-center py-8">
            No work experience added yet.
          </div>
        ) : (
          <div className="space-y-6">
            {experiences.map((exp) => (
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
                      {exp.startDate} -{" "}
                      {exp.isCurrent ? "Present" : exp.endDate}
                    </div>
                    <div className="text-sm text-muted-foreground/80 leading-relaxed max-w-lg">
                      {exp.description}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(exp)}
                      className="h-8 w-8"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(exp.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="px-6 rounded-xl">
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          className="px-8 rounded-xl"
        >
          Next Step <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// --- 4. Step 4: Education ---

const EducationModal: React.FC<{
  item: EducationItemForm | null;
  onClose: () => void;
  onSubmit: (data: EducationItemForm) => void;
}> = ({ item, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EducationItemForm>({
    resolver: zodResolver(educationItemSchema),
    defaultValues: item || {
      id: undefined,
      startDate: null,
      graduationDate: null,
      degreeType: "",
    },
  });

  return (
    <ModalOverlay
      title={item ? "Edit Education" : "Add Education"}
      icon={GraduationCap}
      onClose={onClose}
      onSave={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <div className="text-primary mt-0.5">
          <GraduationCap size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground mb-1">
            Profile Section
          </h4>
          <p className="text-xs text-muted-foreground">
            Information added here is used to autofill your job applications.
          </p>
        </div>
      </div>
      <form id="edu-form" onSubmit={handleSubmit(onSubmit)}>
        <InputGroup
          label="School / Institution"
          required
          error={errors.institutionName}
        >
          <Controller
            control={control}
            name="institutionName"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            )}
          />
        </InputGroup>
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Degree" required error={errors.degreeType}>
            <Controller
              control={control}
              name="degreeType"
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="">Select degree</option>
                  {DEGREE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </InputGroup>
          <InputGroup
            label="Field of Study"
            required
            error={errors.fieldOfStudy}
          >
            <Controller
              control={control}
              name="fieldOfStudy"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g. Computer Science"
                  className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              )}
            />
          </InputGroup>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Start Date">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              )}
            />
          </InputGroup>
          <InputGroup label="Graduation Date">
            <Controller
              control={control}
              name="graduationDate"
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full border border-border bg-background text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              )}
            />
          </InputGroup>
        </div>
      </form>
    </ModalOverlay>
  );
};

const EducationStep: React.FC<WizardStepProps<{ educations: Education[] }>> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [educations, setEducations] = useState<Education[]>(
    initialData.educations || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItemForm | null>(
    null
  );

  const handleSaveItem = (data: EducationItemForm) => {
    const isNew = !educations.some((e) => e.id === data.id);
    const id = data.id || Date.now().toString();

    const formattedStartDate = formatMonthYearToDate(data.startDate);
    const formattedGraduationDate = formatMonthYearToDate(data.graduationDate);

    const newItem: Education = {
      ...(data as unknown as Education),
      id: id,
      institutionName: data.institutionName,
      degreeType: data.degreeType,
      fieldOfStudy: data.fieldOfStudy,
      startDate: formattedStartDate,
      graduationDate: formattedGraduationDate || "",
      candidateProfileId: "",
      isCurrent: false,
      description: null,
      coursework: [],
      honors: [],
      location: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!isNew) {
      setEducations(educations.map((e) => (e.id === data.id ? newItem : e)));
    } else {
      setEducations([...educations, newItem]);
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (edu: Education | null) => {
    const formItem: EducationItemForm | null = edu
      ? {
          id: edu.id,
          institutionName: edu.institutionName,
          degreeType: edu.degreeType as EducationItemForm["degreeType"],
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate
            ? formatMonthYearToDate(edu.startDate)
            : null,
          graduationDate: edu.graduationDate
            ? formatMonthYearToDate(edu.graduationDate)
            : null,
        }
      : null;
    setEditingItem(formItem);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const handleNext = () => onNext({ educations });

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
      {isModalOpen && (
        <EducationModal
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveItem}
        />
      )}

      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        Education
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Academic background and certifications.
      </p>

      <div className="bg-card border border-border rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
              <GraduationCap size={18} />
            </div>
            Academic Records
          </h3>
          <Button
            onClick={() => handleEdit(null)}
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Plus size={16} className="mr-1" /> Add Education
          </Button>
        </div>

        {educations.length === 0 ? (
          <div className="text-sm text-muted-foreground italic text-center py-8">
            No education added yet.
          </div>
        ) : (
          <div className="space-y-6">
            {educations.map((edu) => (
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
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(edu)}
                      className="h-8 w-8"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(edu.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="px-6 rounded-xl">
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          className="px-8 rounded-xl"
        >
          Review & Save <CheckCircle2 size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// --- Main Wizard Component ---
const CandidateProfileCreationWizard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<number>(0);
  const [profileData, setProfileData] = useState<Partial<CandidateProfile>>({});
  const [cvFile, setCvFile] = useState<any>(null);
  const { user } = useAuth();
  const location = useLocation();
  const voiceData = location.state?.initialData;

  const { mutate: createProfileMutate, isPending } = useMutation({
    mutationFn: createMyProfile,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Candidate profile created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create profile.",
        variant: "destructive",
      });
    },
  });

  const handleNext = (data: Partial<CandidateProfile>) => {
    const newProfileData: Partial<CandidateProfile> = {
      ...profileData,
      ...data,
    };
    setProfileData(newProfileData);
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSave(newProfileData);
    }
  };

  // Logic xử lý nút Back/Quay lại (Tuần tự)
  const handleBack = (clearData = false) => {
    if (step === 1 && clearData) {
      setProfileData({}); // Xóa dữ liệu khi quay lại từ Bước 1 -> Bước 0
      setCvFile(null);
      setStep(0);
    } else if (step > 0) {
      setStep(step - 1); // Quay lại bước trước đó (Tuần tự)
    }
  };

  const handleSave = (finalData: Partial<CandidateProfile>) => {
    const cleanWorkExperiences = finalData.workExperiences?.map(
      (exp: WorkExperience) => {
        // Destructuring: Remove temporary/unnecessary local fields before sending
        const {
          id,
          candidateProfileId,
          organizationId,
          createdAt,
          updatedAt,
          organization,
          ...rest
        } = exp;
        return {
          ...rest,
          // Use correct enum values and ensure date formatting
          employmentType: "full_time",
          startDate: formatMonthYearToDate(exp.startDate) || "",
          endDate: formatMonthYearToDate(exp.endDate) || null,
        };
      }
    );

    const cleanEducations = finalData.educations?.map((edu: Education) => {
      // Destructuring: Remove temporary/unnecessary local fields before sending
      const { id, candidateProfileId, createdAt, updatedAt, ...rest } = edu;
      return {
        ...rest,
        // Use correct enum values and ensure date formatting
        degreeType: normalizeDegreeType(edu.degreeType),
        startDate: formatMonthYearToDate(edu.startDate),
        graduationDate: formatMonthYearToDate(edu.graduationDate),
      };
    });

    const payload: Partial<CandidateProfile> = {
      userId: user?.id || "",
      phone: finalData.phone || null,
      address: finalData.address || null,
      city: finalData.address ? finalData.address.split(",")[0].trim() : null,
      country:
        finalData.address && finalData.address.includes(",")
          ? finalData.address.split(",").slice(-1)[0].trim()
          : null,
      socialLinks: finalData.socialLinks,
      skills: finalData.skills || [],

      workExperiences: cleanWorkExperiences as WorkExperience[],
      educations: cleanEducations as Education[],
    };

    createProfileMutate(payload);
  };

  const mapCvDataToInitialState = (cvData: ExtractedCvData) => {
    const personalInfo = cvData.personalInfo || {};

    const workExperiences: WorkExperience[] = (
      (cvData.workExperience as any[]) || []
    ).map((exp: any) => ({
      id: Date.now().toString() + Math.random(), // Temporary ID for local state
      jobTitle: exp.position || "",
      organization: { name: exp.company || "" } as any,
      startDate: formatMonthYearToDate(exp.startDate) || "",
      endDate: formatMonthYearToDate(exp.endDate) || null,
      isCurrent: exp.isCurrent || false,
      description: (exp.responsibilities || []).join("\n"),
      candidateProfileId: "",
      organizationId: "",
      employmentType: "full_time",
      location: "N/A",
      skills: [],
      createdAt: "",
      updatedAt: "",
    }));

    const educations: Education[] = ((cvData.education as any[]) || []).map(
      (edu: any) => ({
        id: Date.now().toString() + Math.random(), // Temporary ID for local state
        institutionName: edu.institution || "",
        degreeType:
          (normalizeDegreeType(edu.degree) as Education["degreeType"]) || "",
        fieldOfStudy: edu.fieldOfStudy || "N/A",
        startDate: formatMonthYearToDate(edu.startDate) || null,
        graduationDate: formatMonthYearToDate(edu.endDate) || "",
        candidateProfileId: "",
        isCurrent: false,
        description: null,
        coursework: [],
        honors: [],
        location: null,
        createdAt: "",
        updatedAt: "",
      })
    );

    const initialData: Partial<CandidateProfile> = {
      phone: personalInfo.phone || "",
      address: personalInfo.address || "",
      socialLinks: personalInfo.links?.[0]
        ? {
            linkedin:
              personalInfo.links.find((l) =>
                l.label?.toLowerCase().includes("linkedin")
              )?.url || "",
            github:
              personalInfo.links.find((l) =>
                l.label?.toLowerCase().includes("github")
              )?.url || "",
            portfolio:
              personalInfo.links.find((l) =>
                l.label?.toLowerCase().includes("portfolio")
              )?.url || "",
          }
        : {},
      skills: cvData.skills || [],
      workExperiences: workExperiences,
      educations: educations,
    };

    setProfileData(initialData);
    setStep(1);
  };

  const getStepInitialData = (currentStep: number): any => {
    switch (currentStep) {
      case 1:
        return {
          phone: profileData.phone || "",
          address: profileData.address || "",
          socialLinks: profileData.socialLinks || {},
        } as BasicInfoForm;
      case 2:
        return { skills: profileData.skills || [] };
      case 3:
        return { workExperiences: profileData.workExperiences || [] };
      case 4:
        return { educations: profileData.educations || [] };
      default:
        return {};
    }
  };

  // Progress bar structure
  const progressSteps = useMemo(
    () => [
      { id: 1, title: "Basic Info", icon: User },
      { id: 2, title: "Skills", icon: CheckCircle2 },
      { id: 3, title: "Experience", icon: Briefcase },
      { id: 4, title: "Education", icon: GraduationCap },
    ],
    []
  );

  const steps = [
    {
      id: 0,
      component: StartStep,
      title: "Start",
      props: {
        onNext: (data: any) => {
          setCvFile(data.cvFile);
          handleNext(data);
        },
        onSkip: () => setStep(1),
        onSetInitialData: mapCvDataToInitialState,
      },
    },
    {
      id: 1,
      component: BasicInfoStep,
      title: "Basic Info",
      props: {
        onNext: handleNext,
        onBack: handleBack,
        initialData: getStepInitialData(1),
      },
    },
    {
      id: 2,
      component: SkillsStep,
      title: "Skills",
      props: {
        onNext: handleNext,
        onBack: handleBack,
        initialData: getStepInitialData(2),
      },
    },
    {
      id: 3,
      component: ExperienceStep,
      title: "Experience",
      props: {
        onNext: handleNext,
        onBack: handleBack,
        initialData: getStepInitialData(3),
      },
    },
    {
      id: 4,
      component: EducationStep,
      title: "Education",
      props: {
        onNext: handleNext,
        onBack: handleBack,
        initialData: getStepInitialData(4),
      },
    },
  ];

  const CurrentStepComponent = steps.find((s) => s.id === step)?.component;

  useEffect(() => {
    if (voiceData) {
      setProfileData(voiceData);
      setStep(1); // Skip to step 1
    }
  }, [voiceData]);

  return (
    // Reverted to standard background as requested (removed brand-blue-light)
    <div className="flex flex-col items-center justify-center p-8">
      {isPending && (
        <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center backdrop-blur-sm animate-fadeIn">
          <div className="bg-card p-8 rounded-3xl border border-border flex items-center gap-4 shadow-xl">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-lg font-bold text-foreground">
              Creating Profile...
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        {/* Multi-Step Progress Bar (Refined for elegance) */}
        {step > 0 && (
          <div className="mb-12 pt-4">
            <div className="flex justify-between items-center relative max-w-4xl mx-auto">
              {/* Progress Line */}
              <div className="absolute left-0 right-0 top-[20px] h-0.5 bg-border -translate-y-1/2 z-0 mx-10">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{
                    width: `${
                      ((step - 1) / (progressSteps.length - 1)) * 100
                    }%`,
                  }}
                ></div>
              </div>

              {/* Steps Markers */}
              {progressSteps.map((s) => {
                const isCompleted = step > s.id;
                const isActive = step === s.id;
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    className="flex flex-col items-center z-10 w-1/4"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all bg-card ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "border-primary text-primary ring-4 ring-primary/10"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span
                      className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                        isActive || isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Step Content - Form Card */}
        <div className="min-h-[500px] animate-fadeIn">
          {CurrentStepComponent && (
            <CurrentStepComponent
              {...steps.find((s) => s.id === step)?.props}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileCreationWizard;
