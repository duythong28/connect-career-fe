import { useState, useMemo, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, GraduationCap, User, Plus, ArrowLeft, ArrowRight, UploadCloud, CheckCircle2, X, Linkedin, Github, Globe, Trash2, Pencil, Calendar, Mail, FileText, Upload, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createMyProfile } from "@/api/endpoints/candidates.api";
import { CandidateProfile, WorkExperience, Education } from "@/api/types/candidates.types";
import { ExtractedCvData } from "@/api/types/cv.types"; 
import { parseCvFromPdf } from "@/api/endpoints/cvs.api"; 
import { getSignUrl, createFileEntity, uploadFile } from "@/api/endpoints/files.api";
import type { SignedUploadResponse, CreateFileEntityDto } from "@/api/types/files.types";
import { useAuth } from "@/hooks/useAuth";


// --- Utility Functions ---

/** Converts M/Y string to YYYY-MM-DD (setting day to 01) or returns null if invalid. */
const formatMonthYearToDate = (monthYear: string | undefined | null): string | null => {
    if (!monthYear) return null;
    
    const match = monthYear.match(/(\d{4})|([A-Za-z]+)\s*(\d{4})|(\d{1,2})[/-](\d{4})/);
    
    if (!match) {
        if (!isNaN(Date.parse(monthYear))) return monthYear.substring(0, 10);
        return null;
    }
    
    let year: string | undefined;
    let month: string | undefined;

    if (match[1]) {
        year = match[1];
        month = '01';
    } else if (match[2] && match[3]) {
        const monthIndex = new Date(Date.parse(match[2] + " 1, 2000")).getMonth() + 1;
        month = monthIndex.toString().padStart(2, '0');
        year = match[3];
    } else if (match[4] && match[5]) {
        month = match[4].padStart(2, '0');
        year = match[5];
    }
    
    if (year && month) {
        return `${year}-${month}-01`;
    }

    return null;
};

/** Normalizes CV degree strings to match backend enum values. */
const normalizeDegreeType = (degreeString: string | undefined | null): string => {
    if (!degreeString) return "";
    const cleanString = degreeString.toLowerCase().replace(/[^a-z]/g, '');

    if (cleanString.includes('bachelor') || cleanString.includes('bs')) return 'bachelor';
    if (cleanString.includes('master') || cleanString.includes('ms')) return 'master';
    if (cleanString.includes('doctorate') || cleanString.includes('phd')) return 'doctorate';
    if (cleanString.includes('associate') || cleanString.includes('aa')) return 'associate';
    if (cleanString.includes('highschool')) return 'high_school';
    if (cleanString.includes('cert')) return 'certificate';
    if (cleanString.includes('diploma')) return 'diploma';
    
    return "";
};


// --- UI COMPONENTS ---

const InputGroup: React.FC<any> = ({ label, error, children, required, className = "" }) => (
  <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
    <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium mt-1">{error.message}</p>}
  </div>
);

const ModalOverlay: React.FC<any> = ({ children, title, icon: Icon, onClose, onSave, isSubmitting }) => (
  <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white rounded-xl w-full max-w-2xl border border-gray-200 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white shrink-0 flex flex-row justify-between items-center space-y-0">
        <h3 className="flex items-center gap-3 text-lg font-bold text-gray-900">
          <div className="p-2 bg-blue-50 text-[#0EA5E9] rounded-lg">
              {Icon ? <Icon size={20}/> : <User size={20}/>}
          </div>
          {title}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20}/>
        </button>
      </div>

      {/* Body */}
      <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-5">
        {children}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
        <button 
            onClick={onClose} 
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-100 h-auto transition-colors"
        >
            Cancel
        </button>
        <button 
            onClick={onSave} 
            disabled={isSubmitting} 
            className="px-8 py-2.5 bg-[#0EA5E9] text-white rounded-lg font-bold text-sm hover:bg-[#0284c7] transition-colors"
        >
            Save
        </button>
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
    fullName: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    socialLinks: SocialLinksForm;
}

// Updated interface: ID is optional
interface ExperienceItemForm {
    id?: string; 
    jobTitle: string;
    organizationName: string;
    startDate?: string | null;
    endDate?: string | null;
    isCurrent?: boolean;
    description?: string | null;
}

// Updated interface: ID is optional
interface EducationItemForm {
    id?: string;
    institutionName: string;
    degreeType: z.infer<typeof educationItemSchema>['degreeType']; // Ensure type consistency
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
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  socialLinks: z.object({
    linkedin: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    portfolio: z.string().optional().nullable(),
  }).default({}),
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
  degreeType: z.enum(["high_school", "associate", "bachelor", "master", "doctorate", "certificate", "diploma", ""], { // Added "" for default selection handling
     errorMap: () => ({ message: "Please select a degree type" }),
  }).refine(val => val !== "", { message: "Please select a degree type" }), // Enforce selection
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

const StartStep: React.FC<StartStepProps> = ({ onNext, onSkip, onSetInitialData }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [cvFile, setCvFile] = useState<{ name: string } | null>(null);
  const [cvData, setCvData] = useState<ExtractedCvData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const handleUploadClick = () => {
    if (isProcessing) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);

    try {
        const signed: SignedUploadResponse = await getSignUrl(); 
        
        const dto: CreateFileEntityDto = {
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

        const result = await createFileEntity(dto);
        const uploadFileResonse = await uploadFile({
            fileId: signed.fileId,
            data: result,
        });

        const uploadedUrl = uploadFileResonse?.url;
        
        if (!uploadedUrl) throw new Error("File upload failed.");
        const parseResult = await parseCvFromPdf(uploadedUrl);

        const extractedData = parseResult.data.extractedText;

        setUrl(uploadedUrl);
        setCvFile(file);
        setCvData(extractedData);
        onSetInitialData(extractedData);

        toast({ title: "Success", description: "CV analyzed. Data will be auto-filled." });
        
    } catch (error: any) {
        toast({ title: "Error", description: error?.message || "Failed to analyze CV. Please enter manually.", variant: "destructive" });
        console.error(error);
        handleResetUpload(); 
    } finally {
        setIsProcessing(false);
        if (inputRef.current) inputRef.current.value = "";
    }
  };
  
  const handleResetUpload = () => {
    setCvFile(null);
    setCvData(null);
    setUrl(null);
    setIsProcessing(false);
  };

  const handleContinue = () => {
    if (cvData) {
        onNext(cvData as unknown as Partial<CandidateProfile>);
    } else {
        onSkip();
    }
  };

  return (
    <div className="animate-fadeIn max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Step 1: Start your Profile</h2>
        <p className="text-sm text-gray-500 mb-8 text-center">Choose how you want to fill your information.</p>

        {/* Card for Auto-fill with CV (Matching OnboardingFork style) */}
        <div 
            className={`bg-white border rounded-2xl p-8 transition-all flex flex-col items-center text-center group ${cvData ? 'border-[#0EA5E9]' : 'border-gray-200 hover:border-blue-300'}`}
        >
            <h3 className="font-bold text-lg text-gray-900 mb-2">
                Build Profile with CV Upload
            </h3>
            <p className="text-gray-500 text-sm mb-6 px-4">
                We'll parse your resume to auto-fill your profile information.
            </p>
            
            {/* UI Mockup */}
            <div className="w-full h-40 bg-gray-50 rounded-xl mb-6 border border-gray-100 flex items-center justify-center relative overflow-hidden">
                 {/* Internal Mockup */}
                 <div className="w-3/4 bg-white border border-gray-200 p-4 rounded space-y-2">
                    <div className="h-2 bg-gray-200 w-1/3 rounded"></div>
                    <div className="h-2 bg-blue-200 w-2/3 rounded"></div>
                 </div>
                 {/* Success/Processing Overlay */}
                 {cvData && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col p-4">
                        <CheckCircle2 size={32} className="text-green-600 mb-2"/>
                        <p className="text-sm font-bold text-green-800">Ready to proceed!</p>
                        <p className="text-xs text-gray-600">{cvFile?.name}</p>
                    </div>
                 )}
                 {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col p-4">
                        <div className="w-6 h-6 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-blue-800 mt-2">Analyzing CV...</p>
                    </div>
                 )}
                 {!cvData && !isProcessing && (
                     <div className="w-full h-full flex items-center justify-center">
                        <FileText size={40} className="text-gray-400"/>
                     </div>
                 )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
                disabled={isProcessing}
            />
            
            <button 
                onClick={handleUploadClick}
                className={`w-full font-bold py-2.5 text-sm rounded-lg border flex items-center justify-center gap-2 transition-colors ${cvData
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    : 'bg-[#0EA5E9] text-white border-[#0EA5E9] hover:bg-[#0284c7]'
                }`}
                disabled={isProcessing}
            >
                {cvData ? (
                    <>
                        <RefreshCcw size={16} className="mr-2"/> Change CV
                    </>
                ) : (
                    <>
                        <UploadCloud size={16} className="mr-2"/> Upload Resume
                    </>
                )}
            </button>
        </div>

        <div className="relative my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button 
            onClick={handleContinue}
            disabled={isProcessing}
            className="w-full bg-[#0EA5E9] text-white font-bold py-3 text-md rounded-lg hover:bg-[#0284c7] transition-colors"
        >
            {cvData ? "Continue with Auto-fill" : "Start Manually"}
            <ArrowRight size={18} className="inline ml-2"/>
        </button>
    </div>
  );
};

// --- 1. Step 1: Basic Info ---
const BasicInfoStep: React.FC<WizardStepProps<BasicInfoForm>> = ({ initialData, onNext, onBack }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData,
  });
  
  const handleBackToStart = () => {
    if (onBack) onBack(true);
  };

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Basic Information</h2>
        <form onSubmit={handleSubmit(onNext)}>
            {/* Form Section: Personal Details (Card 1) */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <InputGroup label="Full Name" required error={errors.fullName}>
                    <Controller control={control} name="fullName" render={({ field }) => (
                        <input {...field} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                    )} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Email" error={errors.email}>
                        <Controller control={control} name="email" render={({ field }) => (
                            <input {...field} type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
                    </InputGroup>
                    <InputGroup label="Phone Number" error={errors.phone}>
                        <Controller control={control} name="phone" render={({ field }) => (
                            <input {...field} type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
                    </InputGroup>
                </div>
                <InputGroup label="Location (City, Country)" error={errors.address}>
                    <Controller control={control} name="address" render={({ field }) => (
                        <input {...field} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto" placeholder="e.g. San Francisco, CA"/>
                    )} />
                </InputGroup>
            </div>

            {/* Form Section: Social Links (Card 2) */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Social Links</h3>
                <InputGroup label="LinkedIn URL">
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <Controller control={control} name="socialLinks.linkedin" render={({ field }) => (
                            <input {...field} type="url" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
                    </div>
                </InputGroup>
                <InputGroup label="GitHub URL">
                    <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <Controller control={control} name="socialLinks.github" render={({ field }) => (
                            <input {...field} type="url" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
                    </div>
                </InputGroup>
                <InputGroup label="Portfolio URL">
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <Controller control={control} name="socialLinks.portfolio" render={({ field }) => (
                            <input {...field} type="url" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
                    </div>
                </InputGroup>
            </div>
            
            <div className="mt-8 flex justify-between">
                <button onClick={handleBackToStart} type="button" className="px-6 py-3 border border-gray-300 text-gray-700 font-bold text-md rounded-lg hover:bg-gray-100 flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#0EA5E9] text-white font-bold text-md rounded-lg hover:bg-[#0284c7] transition-colors">
                    Next Step <ArrowRight size={18} className="inline ml-2"/>
                </button>
            </div>
        </form>
    </div>
  );
};

// --- 2. Step 2: Skills ---
const SkillsStep: React.FC<WizardStepProps<{ skills: string[] }>> = ({ initialData, onNext, onBack }) => {
    const [skills, setSkills] = useState<string[]>(initialData.skills || []);
    const [newSkill, setNewSkill] = useState<string>('');

    const addSkill = () => {
        if (newSkill.trim() && !skills.map(s => s.toLowerCase()).includes(newSkill.trim().toLowerCase())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleNext = () => onNext({ skills });

    return (
        <div className="animate-fadeIn max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Skills</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">
                        Add your skills
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter skill (e.g., React, Python, SQL...)"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"
                        />
                        <button onClick={addSkill} type="button" className="bg-[#0EA5E9] text-white hover:bg-[#0284c7] font-bold px-4 py-2.5 rounded-lg border border-blue-700">
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Current Skills ({skills.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No skills added yet.</p>
                        ) : (
                             skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="ml-2 text-red-500 hover:text-red-700 p-1"
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
                <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 font-bold text-md rounded-lg hover:bg-gray-100 flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                </button>
                <button onClick={handleNext} className="px-8 py-3 bg-[#0EA5E9] text-white font-bold text-md rounded-lg hover:bg-[#0284c7] transition-colors">
                    Next Step <ArrowRight size={18} className="inline ml-2"/>
                </button>
            </div>
        </div>
    );
};

// --- 3. Step 3: Work Experience (Modal and Step Component) ---

const ExperienceModal: React.FC<{ item: ExperienceItemForm | null, onClose: () => void, onSubmit: (data: ExperienceItemForm) => void }> = ({ item, onClose, onSubmit }) => {
    const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ExperienceItemForm>({
        resolver: zodResolver(experienceItemSchema),
        // Assign temporary ID only if item is null (new item)
        defaultValues: item || { id: undefined, isCurrent: false, organizationName: '', startDate: null, endDate: null },
    });
    const isCurrent = watch("isCurrent");

    return (
        <ModalOverlay title={item ? "Edit Experience" : "Add Experience"} icon={Briefcase} onClose={onClose} onSave={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3 items-start">
                <div className="text-blue-600 mt-0.5"><Briefcase size={16} /></div>
                <div>
                  <h4 className="text-sm font-bold text-blue-900 mb-1">
                    Profile Section
                  </h4>
                  <p className="text-xs text-blue-700">
                    Information added here is used to autofill your job applications.
                  </p>
                </div>
            </div>
            <form id="exp-form" onSubmit={handleSubmit(onSubmit)}>
                 <InputGroup label="Job Title" required error={errors.jobTitle}>
                    <Controller control={control} name="jobTitle" render={({ field }) => (
                        <input {...field} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                    )} />
                </InputGroup>
                <InputGroup label="Company" required error={errors.organizationName}>
                    <Controller control={control} name="organizationName" render={({ field }) => (
                        <input {...field} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                    )} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-4">
                     <InputGroup label="Start Date">
                        <Controller control={control} name="startDate" render={({ field }) => (
                            <input {...field} type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
                     </InputGroup>
                     <InputGroup label="End Date">
                        <Controller control={control} name="endDate" render={({ field }) => (
                            <input {...field} type="date" disabled={isCurrent} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto disabled:bg-gray-100"/>
                        )} />
                     </InputGroup>
                </div>
                <div className="flex items-center gap-2 mb-6">
                    <Controller control={control} name="isCurrent" render={({ field }) => (
                         <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} id="curr_work_modal" className="border-gray-400 text-blue-600 rounded"/>
                    )} />
                    <label htmlFor="curr_work_modal" className="text-sm text-gray-700 font-medium cursor-pointer">I currently work here</label>
                </div>
                <InputGroup label="Description">
                    <Controller control={control} name="description" render={({ field }) => (
                        <textarea {...field} rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"/>
                    )} />
                </InputGroup>
            </form>
        </ModalOverlay>
    );
  };

const ExperienceStep: React.FC<WizardStepProps<{ workExperiences: WorkExperience[] }>> = ({ initialData, onNext, onBack }) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>(initialData.workExperiences || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItemForm | null>(null);
  
  const handleSaveItem = (data: ExperienceItemForm) => {
    // Check if the item already exists using a temporary ID
    const isNew = !experiences.some(e => e.id === data.id);
    // Assign local ID only if new, otherwise reuse existing ID (if any)
    const id = data.id || Date.now().toString();

    const formattedStartDate = formatMonthYearToDate(data.startDate);
    const formattedEndDate = formatMonthYearToDate(data.endDate);

    const newItem: WorkExperience = {
      ...(data as unknown as WorkExperience),
      id: id, // Use assigned ID (temporary or existing)
      organization: { name: data.organizationName } as any, 
      jobTitle: data.jobTitle,
      startDate: formattedStartDate || '',
      endDate: formattedEndDate,
      isCurrent: !!data.isCurrent,
      description: data.description || null,
      employmentType: 'full_time', // Sửa lỗi API: dùng giá trị enum hợp lệ
      location: 'N/A', skills: [], candidateProfileId: '', organizationId: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    
    if (!isNew) {
      setExperiences(experiences.map(e => e.id === data.id ? newItem : e));
    } else {
      setExperiences([...experiences, newItem]);
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (exp: WorkExperience | null) => {
    const formItem: ExperienceItemForm | null = exp ? {
        id: exp.id,
        jobTitle: exp.jobTitle,
        organizationName: exp.organization?.name || '',
        startDate: exp.startDate ? formatMonthYearToDate(exp.startDate) : null,
        endDate: exp.endDate ? formatMonthYearToDate(exp.endDate) : null,
        isCurrent: exp.isCurrent,
        description: exp.description || undefined,
    } : null;
    setEditingItem(formItem);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const handleNext = () => onNext({ workExperiences: experiences });
    
  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
        {isModalOpen && <ExperienceModal item={editingItem} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveItem} />}
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: Work Experience</h2>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-[#0EA5E9] rounded-lg"><Briefcase size={18}/></div>
                    Work Experience
                </h3>
                <button onClick={() => handleEdit(null)} className="flex items-center gap-1 text-xs font-bold text-[#0EA5E9] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-200">
                    <Plus size={14}/> Add Experience
                </button>
            </div>

            {experiences.length === 0 ? (
                <div className="text-xs text-gray-400 italic">No work experience added yet.</div>
            ) : (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="group relative pl-4 border-l-2 border-gray-200 hover:border-[#0EA5E9] transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{exp.jobTitle}</div>
                                    <div className="text-xs text-[#0EA5E9] font-bold mb-1">{exp.organization?.name}</div>
                                    <div className="text-xs text-gray-500 mb-2 font-medium">{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</div>
                                    <div className="text-xs text-gray-600 leading-relaxed">{exp.description}</div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(exp)} className="p-1 text-gray-400 hover:text-blue-500"><Pencil size={14}/></button>
                                    <button onClick={() => handleDelete(exp.id)} className="p-1 text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-between">
            <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 font-bold text-md rounded-lg hover:bg-gray-100 flex items-center gap-2">
                <ArrowLeft size={18} /> Back
            </button>
            <button onClick={handleNext} className="px-8 py-3 bg-[#0EA5E9] text-white font-bold text-md rounded-lg hover:bg-[#0284c7] transition-colors">
                Next Step <ArrowRight size={18} className="inline ml-2"/>
            </button>
        </div>
    </div>
  );
};

// --- 4. Step 4: Education (Modal and Step Component) ---

const EducationModal: React.FC<{ item: EducationItemForm | null, onClose: () => void, onSubmit: (data: EducationItemForm) => void }> = ({ item, onClose, onSubmit }) => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<EducationItemForm>({
        resolver: zodResolver(educationItemSchema),
        defaultValues: item || { id: undefined, startDate: null, graduationDate: null, degreeType: "" },
    });

    return (
        <ModalOverlay title={item ? "Edit Education" : "Add Education"} icon={GraduationCap} onClose={onClose} onSave={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3 items-start">
                <div className="text-blue-600 mt-0.5"><GraduationCap size={16} /></div>
                <div>
                  <h4 className="text-sm font-bold text-blue-900 mb-1">
                    Profile Section
                  </h4>
                  <p className="text-xs text-blue-700">
                    Information added here is used to autofill your job applications.
                  </p>
                </div>
            </div>
            <form id="edu-form" onSubmit={handleSubmit(onSubmit)}>
                  <InputGroup label="School / Institution" required error={errors.institutionName}>
                      <Controller control={control} name="institutionName" render={({ field }) => (
                          <input {...field} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                      )} />
                  </InputGroup>
                  <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="Degree" required error={errors.degreeType}>
                          <Controller control={control} name="degreeType" render={({ field }) => (
                              <select 
                                  {...field} 
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto bg-white"
                              >
                                  <option value="">Select degree type</option>
                                  {DEGREE_TYPES.map(type => (
                                      <option key={type.value} value={type.value}>{type.label}</option>
                                  ))}
                              </select>
                          )} />
                      </InputGroup>
                      <InputGroup label="Field of Study" required error={errors.fieldOfStudy}>
                          <Controller control={control} name="fieldOfStudy" render={({ field }) => (
                              <input {...field} type="text" placeholder="e.g. Computer Science" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                          )} />
                      </InputGroup>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                       <InputGroup label="Start Date">
                          <Controller control={control} name="startDate" render={({ field }) => (
                              <input {...field} type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                          )} />
                       </InputGroup>
                       <InputGroup label="Graduation Date">
                          <Controller control={control} name="graduationDate" render={({ field }) => (
                              <input {...field} type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                          )} />
                       </InputGroup>
                  </div>
            </form>
        </ModalOverlay>
    );
  };

const EducationStep: React.FC<WizardStepProps<{ educations: Education[] }>> = ({ initialData, onNext, onBack }) => {
  const [educations, setEducations] = useState<Education[]>(initialData.educations || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItemForm | null>(null);

  const handleSaveItem = (data: EducationItemForm) => {
    const isNew = !educations.some(e => e.id === data.id);
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
        graduationDate: formattedGraduationDate || '',
        candidateProfileId: '', isCurrent: false, description: null, coursework: [], honors: [], location: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    
    if (!isNew) {
      setEducations(educations.map(e => e.id === data.id ? newItem : e));
    } else {
      setEducations([...educations, newItem]);
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (edu: Education | null) => {
    const formItem: EducationItemForm | null = edu ? {
        id: edu.id,
        institutionName: edu.institutionName,
        degreeType: edu.degreeType as EducationItemForm['degreeType'],
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate ? formatMonthYearToDate(edu.startDate) : null,
        graduationDate: edu.graduationDate ? formatMonthYearToDate(edu.graduationDate) : null,
    } : null;
    setEditingItem(formItem);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  const handleNext = () => onNext({ educations });

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">
        {isModalOpen && <EducationModal item={editingItem} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveItem} />}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 5: Education</h2>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-[#0EA5E9] rounded-lg"><GraduationCap size={18}/></div>
                    Education
                </h3>
                <button onClick={() => handleEdit(null)} className="flex items-center gap-1 text-xs font-bold text-[#0EA5E9] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-200">
                    <Plus size={14}/> Add Education
                </button>
            </div>
            
            {educations.length === 0 ? (
                <div className="text-xs text-gray-400 italic">No education added yet.</div>
            ) : (
                <div className="space-y-4">
                    {educations.map((edu) => (
                        <div key={edu.id} className="group relative pl-4 border-l-2 border-gray-200 hover:border-[#0EA5E9] transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{edu.institutionName}</div>
                                    <div className="text-xs text-gray-600 mb-1 font-medium">{edu.degreeType}, {edu.fieldOfStudy}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12}/> {edu.startDate} - {edu.graduationDate}</div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(edu)} className="p-1 text-gray-400 hover:text-blue-500"><Pencil size={14}/></button>
                                    <button onClick={() => handleDelete(edu.id)} className="p-1 text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-between">
            <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 font-bold text-md rounded-lg hover:bg-gray-100 flex items-center gap-2">
                <ArrowLeft size={18} /> Back
            </button>
            <button onClick={handleNext} className="px-8 py-3 bg-[#0EA5E9] text-white font-bold text-md rounded-lg hover:bg-[#0284c7] transition-colors">
                Review & Save <CheckCircle2 size={18} className="inline ml-2"/>
            </button>
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
  const {user } = useAuth();

  const { mutate: createProfileMutate, isPending } = useMutation({
    mutationFn: createMyProfile,
    onSuccess: () => {
        toast({ title: "Success", description: "Candidate profile created successfully!" });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
        toast({ title: "Error", description: error?.message || "Failed to create profile.", variant: "destructive" });
    },
  });

  const handleNext = (data: Partial<CandidateProfile>) => {
    const newProfileData: Partial<CandidateProfile> = { ...profileData, ...data };
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
      const parts = finalData.fullName?.trim().split(/\s+/) || [];
      const lastName = parts.length > 0 ? parts[parts.length - 1] : '';
      const firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : (parts.length === 1 ? '' : '');
      
      const cleanWorkExperiences = finalData.workExperiences?.map((exp: WorkExperience) => {
          // Destructuring: Remove temporary/unnecessary local fields before sending
          const { id, candidateProfileId, organizationId, createdAt, updatedAt, organization, ...rest } = exp;
          return {
              ...rest,
              // Use correct enum values and ensure date formatting
              employmentType: 'full_time',
              startDate: formatMonthYearToDate(exp.startDate) || '',
              endDate: formatMonthYearToDate(exp.endDate) || null,
          };
      });

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
        userId: user?.id || '',
          firstName: firstName,
          lastName: lastName,
          email: finalData.email || null,
          phone: finalData.phone || null,
          address: finalData.address || null,
          city: finalData.address ? finalData.address.split(',')[0].trim() : null, 
          country: finalData.address && finalData.address.includes(',') ? finalData.address.split(',').slice(-1)[0].trim() : null, 
          socialLinks: finalData.socialLinks,
          skills: finalData.skills || [],
          
          workExperiences: cleanWorkExperiences as WorkExperience[],
          educations: cleanEducations as Education[],
          
          fullName: undefined, 
      };
      
      createProfileMutate(payload);
  };

  const mapCvDataToInitialState = (cvData: ExtractedCvData) => {
    const personalInfo = cvData.personalInfo || {};
    
    const workExperiences: WorkExperience[] = (cvData.workExperience as any[] || []).map((exp: any) => ({
        id: Date.now().toString() + Math.random(), // Temporary ID for local state
        jobTitle: exp.position || '',
        organization: { name: exp.company || '' } as any,
        startDate: formatMonthYearToDate(exp.startDate) || '',
        endDate: formatMonthYearToDate(exp.endDate) || null,
        isCurrent: exp.isCurrent || false,
        description: (exp.responsibilities || []).join('\n'), 
        candidateProfileId: '', organizationId: '', employmentType: 'full_time', location: 'N/A', skills: [], createdAt: '', updatedAt: '',
    }));
    
    const educations: Education[] = (cvData.education as any[] || []).map((edu: any) => ({
        id: Date.now().toString() + Math.random(), // Temporary ID for local state
        institutionName: edu.institution || '',
        degreeType: normalizeDegreeType(edu.degree) as Education['degreeType'] || '',
        fieldOfStudy: edu.fieldOfStudy || 'N/A',
        startDate: formatMonthYearToDate(edu.startDate) || null,
        graduationDate: formatMonthYearToDate(edu.endDate) || '',
        candidateProfileId: '', isCurrent: false, description: null, coursework: [], honors: [], location: null, createdAt: '', updatedAt: '',
    }));
    
    const fullName = personalInfo.name || "";

    const initialData: Partial<CandidateProfile> = {
        fullName,
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        address: personalInfo.address || '',
        socialLinks: personalInfo.links?.[0] ? {
            linkedin: personalInfo.links.find(l => l.label?.toLowerCase().includes('linkedin'))?.url || '',
            github: personalInfo.links.find(l => l.label?.toLowerCase().includes('github'))?.url || '',
            portfolio: personalInfo.links.find(l => l.label?.toLowerCase().includes('portfolio'))?.url || '',
        } : {},
        skills: cvData.skills || [],
        workExperiences: workExperiences,
        educations: educations,
    };
    
    setProfileData(initialData);
    setStep(1);
  };
  
  const getStepInitialData = (currentStep: number): any => {
      switch(currentStep) {
          case 1: return { 
              fullName: profileData.fullName || '', 
              email: profileData.email || '', 
              phone: profileData.phone || '', 
              address: profileData.address || '', 
              socialLinks: profileData.socialLinks || {} 
          } as BasicInfoForm;
          case 2: return { skills: profileData.skills || [] };
          case 3: return { workExperiences: profileData.workExperiences || [] };
          case 4: return { educations: profileData.educations || [] };
          default: return {};
      }
  }
  
  // Progress bar structure
  const progressSteps = useMemo(() => ([
    { id: 1, title: 'Basic Info', icon: User },
    { id: 2, title: 'Skills', icon: CheckCircle2 },
    { id: 3, title: 'Experience', icon: Briefcase },
    { id: 4, title: 'Education', icon: GraduationCap },
  ]), []);

  const steps = [
      { id: 0, component: StartStep, title: 'Start', props: { onNext: (data: any) => { setCvFile(data.cvFile); handleNext(data); }, onSkip: () => setStep(1), onSetInitialData: mapCvDataToInitialState } },
      { id: 1, component: BasicInfoStep, title: 'Basic Info', props: { onNext: handleNext, onBack: handleBack, initialData: getStepInitialData(1) } },
      { id: 2, component: SkillsStep, title: 'Skills', props: { onNext: handleNext, onBack: handleBack, initialData: getStepInitialData(2) } },
      { id: 3, component: ExperienceStep, title: 'Experience', props: { onNext: handleNext, onBack: handleBack, initialData: getStepInitialData(3) } },
      { id: 4, component: EducationStep, title: 'Education', props: { onNext: handleNext, onBack: handleBack, initialData: getStepInitialData(4) } },
  ];

  const CurrentStepComponent = steps.find(s => s.id === step)?.component;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {isPending && (
          <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
                  <div className="w-6 h-6 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                  <p className="text-lg font-bold text-gray-900">Creating Profile, please wait...</p>
              </div>
          </div>
      )}

      <div className="w-full max-w-5xl">
          
          {/* Multi-Step Progress Bar (Tinh chỉnh cho thanh lịch) */}
          {step > 0 && (
            <div className="mb-8 pt-4"> 
                <div className="flex justify-between items-center relative max-w-4xl mx-auto">
                    {/* Progress Line (thanh mảnh) */}
                    <div className="absolute left-0 right-0 top-[22px] h-0.5 bg-gray-300 -translate-y-1/2 z-0 mx-8">
                        <div 
                            className="h-full bg-[#0EA5E9] transition-all duration-500 rounded-full"
                            style={{ width: `${((step - 1) / (progressSteps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                    
                    {/* Steps Markers */}
                    {progressSteps.map((s, index) => {
                        const isCompleted = step > s.id;
                        const isActive = step === s.id;
                        const Icon = s.icon;
                        return (
                            <div key={s.id} className="flex flex-col items-center z-10 w-1/4">
                                <div 
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white' : (isActive ? 'bg-white border-4 border-[#0EA5E9] text-[#0EA5E9]' : 'bg-white border-gray-300 text-gray-500')}`}
                                >
                                    <Icon size={16} />
                                </div>
                                <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {s.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
          )}

          {/* Current Step Content - Form Card */}
          <div className="p-0 min-h-[500px]">
             {CurrentStepComponent && <CurrentStepComponent {...steps.find(s => s.id === step)?.props} />}
          </div>
      </div>
    </div>
  );
};

export default CandidateProfileCreationWizard;