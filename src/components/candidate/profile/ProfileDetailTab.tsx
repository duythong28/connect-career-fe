import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    Briefcase, GraduationCap,  Plus, Pencil, Trash2, Calendar, User, MapPin, Mail, Phone, Linkedin, Github, Globe,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CandidateProfile } from "@/api/types/candidates.types";
import RenderMarkDown from "@/components/shared/RenderMarkDown";
import { SkillsEditor } from "@/components/candidate/profile/SkillsEditor";

export enum CompletionStatus { INCOMPLETE = "incomplete", PARTIAL = "partial", COMPLETE = "complete" }
export const CompletionStatusLabel: Record<CompletionStatus, string> = { [CompletionStatus.INCOMPLETE]: "Incomplete", [CompletionStatus.PARTIAL]: "Partial", [CompletionStatus.COMPLETE]: "Complete" };

// --- UI COMPONENTS (Simplify Style) ---

const SectionCard = ({ title, icon: Icon, onAdd, onEdit, children }: any) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6 transition-all hover:border-blue-200">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-[#0EA5E9] rounded-lg"><Icon size={18}/></div>
                {title}
            </h3>
            <div className="flex gap-2">
                {onEdit && (
                     <button onClick={onEdit} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#0EA5E9] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                         <Pencil size={14}/> Edit
                     </button>
                )}
                {onAdd && (
                    <button onClick={onAdd} className="flex items-center gap-1 text-xs font-bold text-[#0EA5E9] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Plus size={14}/> Add
                    </button>
                )}
            </div>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const InfoRow = ({ icon: Icon, label, value, href }: any) => (
    <div className="flex items-center gap-3 text-sm">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
            <Icon size={16}/>
        </div>
        <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gray-500 uppercase mb-0.5">{label}</div>
            {href ? (
                <a href={href} target="_blank" rel="noreferrer" className="text-[#0EA5E9] font-medium truncate block hover:underline">{value || "-"}</a>
            ) : (
                <div className="font-medium text-gray-900 truncate">{value || "-"}</div>
            )}
        </div>
    </div>
);

// --- MODAL OVERLAY (Exact Simplify Style) ---
const ModalOverlay = ({ children, title, icon: Icon, onClose, onSave, isSubmitting }: any) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl bg-white rounded-xl p-0 gap-0 overflow-hidden shadow-2xl border-none max-h-[90vh] flex flex-col">
      {/* Header */}
      <DialogHeader className="p-6 border-b border-gray-100 bg-white shrink-0 flex flex-row justify-between items-center space-y-0">
        <DialogTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
          <div className="p-2 bg-blue-50 text-[#0EA5E9] rounded-lg">
              {Icon ? <Icon size={20}/> : <User size={20}/>}
          </div>
          {title}
        </DialogTitle>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20}/>
        </button>
      </DialogHeader>

      {/* Body */}
      <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-5">
        {children}
      </div>

      {/* Footer */}
      <DialogFooter className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
        <Button 
            variant="outline" 
            onClick={onClose} 
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-bold text-sm hover:bg-white h-auto transition-colors"
        >
            Cancel
        </Button>
        <Button 
            onClick={onSave} 
            disabled={isSubmitting} 
            className="px-8 py-2.5 bg-[#0EA5E9] text-white rounded-lg font-bold text-sm hover:bg-[#0284c7] shadow-sm h-auto transition-colors"
        >
            Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const InputGroup = ({ label, error, children, required }: any) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <Label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium mt-1">{error.message}</p>}
  </div>
);

// --- SCHEMAS & EDITOR MODALS ---

// 1. Profile Editor
const profileSchema = z.object({
  user: z.object({ fullName: z.string().min(1, "Name required") }),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  socialLinks: z.object({ linkedin: z.string().optional().nullable(), github: z.string().optional().nullable(), portfolio: z.string().optional().nullable() }),
});
export function ProfileEditorModal({ data, onSave, onClose }: any) {
    const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm({ resolver: zodResolver(profileSchema), defaultValues: data });
    return (
        <ModalOverlay title="Edit Personal Info" icon={User} onClose={onClose} onSave={handleSubmit(onSave)} isSubmitting={isSubmitting}>
            <InputGroup label="Full Name" required error={errors.user?.fullName}>
                <Controller control={control} name="user.fullName" render={({ field }) => (
                    <Input {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                )} />
            </InputGroup>
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Email" error={errors.email}>
                    <Controller control={control} name="email" render={({ field }) => (
                        <Input {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                    )} />
                </InputGroup>
                <InputGroup label="Phone" error={errors.phone}>
                    <Controller control={control} name="phone" render={({ field }) => (
                         <Input {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                    )} />
                </InputGroup>
            </div>
            <InputGroup label="Location" error={errors.address}>
                <Controller control={control} name="address" render={({ field }) => (
                    <Input {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto" placeholder="City, Country"/>
                )} />
            </InputGroup>
            <div className="pt-4 border-t border-gray-100 space-y-4">
                <InputGroup label="LinkedIn URL">
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <Controller control={control} name="socialLinks.linkedin" render={({ field }) => (
                            <Input {...field} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
                    </div>
                </InputGroup>
                <InputGroup label="GitHub URL">
                    <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <Controller control={control} name="socialLinks.github" render={({ field }) => (
                            <Input {...field} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
                    </div>
                </InputGroup>
                <InputGroup label="Portfolio URL">
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <Controller control={control} name="socialLinks.portfolio" render={({ field }) => (
                            <Input {...field} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                        )} />
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
  const { control, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: { ...initialData, organizationName: initialData?.organization?.name || "" } || { isCurrent: false },
  });
  const isCurrent = watch("isCurrent");

  return (
    <ModalOverlay title={initialData ? "Edit Experience" : "Add Experience"} icon={Briefcase} onClose={onClose} onSave={handleSubmit((val) => onSubmit({ ...val, organization: { name: val.organizationName } }))} isSubmitting={isSubmitting}>
        <InputGroup label="Job Title" required error={errors.jobTitle}>
            <Controller control={control} name="jobTitle" render={({ field }) => (
                 <Input {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
            )} />
        </InputGroup>
        <InputGroup label="Company" required error={errors.organizationName}>
            <Controller control={control} name="organizationName" render={({ field }) => (
                 <Input {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
            )} />
        </InputGroup>
        <div className="grid grid-cols-2 gap-4">
             <InputGroup label="Start Date">
                <Controller control={control} name="startDate" render={({ field }) => (
                    <Input type="date" {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                )} />
             </InputGroup>
             <InputGroup label="End Date">
                <Controller control={control} name="endDate" render={({ field }) => (
                    <Input type="date" {...field} disabled={isCurrent} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto disabled:bg-gray-100"/>
                )} />
             </InputGroup>
        </div>
        <div className="flex items-center gap-2 mb-2">
            <Controller control={control} name="isCurrent" render={({ field }) => (
                 <Checkbox checked={field.value} onCheckedChange={field.onChange} id="curr_work" className="border-gray-400 text-blue-600 rounded"/>
            )} />
            <label htmlFor="curr_work" className="text-sm text-gray-700 font-medium cursor-pointer">I currently work here</label>
        </div>
        <InputGroup label="Description">
            <Controller control={control} name="description" render={({ field }) => (
                <Textarea {...field} rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"/>
            )} />
        </InputGroup>
    </ModalOverlay>
  );
}

// 3. Education Editor
const educationSchema = z.object({
  id: z.string().optional(),
  institutionName: z.string().min(1, "Required"),
  degreeType: z.string().min(1, "Required"),
  fieldOfStudy: z.string().min(1, "Required"),
  startDate: z.string().optional().nullable(),
  graduationDate: z.string().optional().nullable(),
});
function EducationEditorModal({ initialData, onSubmit, onClose }: any) {
  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm({ resolver: zodResolver(educationSchema), defaultValues: initialData || {} });
  return (
    <ModalOverlay title={initialData ? "Edit Education" : "Add Education"} icon={GraduationCap} onClose={onClose} onSave={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
        <InputGroup label="School / Institution" required error={errors.institutionName}>
             <Controller control={control} name="institutionName" render={({ field }) => (
                 <Input {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
             )} />
        </InputGroup>
        <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Degree" required error={errors.degreeType}>
                <Controller control={control} name="degreeType" render={({ field }) => (
                    <Input {...field} placeholder="e.g. Bachelors" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                )} />
            </InputGroup>
            <InputGroup label="Field of Study" required error={errors.fieldOfStudy}>
                <Controller control={control} name="fieldOfStudy" render={({ field }) => (
                    <Input {...field} placeholder="e.g. Computer Science" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                )} />
            </InputGroup>
        </div>
        <div className="grid grid-cols-2 gap-4">
             <InputGroup label="Start Date">
                <Controller control={control} name="startDate" render={({ field }) => (
                    <Input type="date" {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                )} />
             </InputGroup>
             <InputGroup label="Graduation Date">
                <Controller control={control} name="graduationDate" render={({ field }) => (
                    <Input type="date" {...field} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-auto"/>
                )} />
             </InputGroup>
        </div>
    </ModalOverlay>
  );
}

// --- MAIN COMPONENT ---

export default function ProfileDetailTab({ profileData, isMyProfile, editMode, updateProfile }: { profileData: CandidateProfile; isMyProfile: boolean; editMode: boolean; updateProfile: (data: any) => void; }) {
  const [dialog, setDialog] = useState<{ type: null | "profile" | "experience" | "education"; open: boolean; initialData?: any; }>({ type: null, open: false });

  // Logic handlers
  const handleProfileSave = (payload: any) => { updateProfile(payload); setDialog({ type: null, open: false }); };
  const handleExperienceSave = (data: any) => { const current = profileData.workExperiences ?? []; const newItem = { ...data, id: data.id || Math.random().toString(), organization: { name: data.organizationName } }; updateProfile({ workExperiences: data.id ? current.map(e => e.id === data.id ? newItem : e) : [...current, newItem] }); setDialog({ type: null, open: false }); };
  const handleEducationSave = (data: any) => { const current = profileData.educations ?? []; const newItem = { ...data, id: data.id || Math.random().toString() }; updateProfile({ educations: data.id ? current.map(e => e.id === data.id ? newItem : e) : [...current, newItem] }); setDialog({ type: null, open: false }); };
  const handleDelete = (section: keyof CandidateProfile, id: string) => { updateProfile({ [section]: (profileData[section] as any[]).filter((item: any) => item.id !== id) }); };

  return (
    <div className="animate-fadeIn">
      {/* Modals */}
      {dialog.type === 'profile' && <ProfileEditorModal data={{ user: { fullName: profileData.user.fullName || `${profileData.user.firstName} ${profileData.user.lastName}` }, email: profileData.email, phone: profileData.phone, address: profileData.address, socialLinks: profileData.socialLinks }} onSave={handleProfileSave} onClose={() => setDialog({ type: null, open: false })} />}
      {dialog.type === 'experience' && <ExperienceEditorModal initialData={dialog.initialData} onSubmit={handleExperienceSave} onClose={() => setDialog({ type: null, open: false })} />}
      {dialog.type === 'education' && <EducationEditorModal initialData={dialog.initialData} onSubmit={handleEducationSave} onClose={() => setDialog({ type: null, open: false })} />}

      {/* 1. BASIC INFORMATION CARD */}
      <SectionCard 
          title="Basic Information" 
          icon={User} 
          onEdit={isMyProfile && editMode ? () => setDialog({ type: 'profile', open: true }) : undefined}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <InfoRow icon={Mail} label="Email" value={profileData.email}/>
              <InfoRow icon={Phone} label="Phone" value={profileData.phone}/>
              <InfoRow icon={MapPin} label="Location" value={profileData.address}/>
              <InfoRow icon={Linkedin} label="LinkedIn" value={profileData.socialLinks?.linkedin} href={profileData.socialLinks?.linkedin}/>
              <InfoRow icon={Github} label="GitHub" value={profileData.socialLinks?.github} href={profileData.socialLinks?.github}/>
              <InfoRow icon={Globe} label="Portfolio" value={profileData.socialLinks?.portfolio} href={profileData.socialLinks?.portfolio}/>
          </div>
      </SectionCard>

      {/* 2. SKILLS CARD */}
      <SectionCard title="Skills" icon={Briefcase}>
         <SkillsEditor skills={profileData.skills} isEditable={isMyProfile && editMode} onUpdate={(skills) => updateProfile({ skills })} />
      </SectionCard>

      {/* 3. EXPERIENCE CARD */}
      <SectionCard 
          title="Work Experience" 
          icon={Briefcase} 
          onAdd={isMyProfile && editMode ? () => setDialog({ type: 'experience', open: true }) : undefined}
      >
         {profileData.workExperiences && profileData.workExperiences.length > 0 ? profileData.workExperiences.map(exp => (
             <div key={exp.id} className="group relative pl-4 border-l-2 border-gray-200 hover:border-[#0EA5E9] transition-colors">
                 <div className="flex justify-between items-start">
                    <div>
                        <div className="font-bold text-gray-900 text-sm">{exp.jobTitle}</div>
                        <div className="text-xs text-[#0EA5E9] font-bold mb-1">{exp.organization?.name}</div>
                        <div className="text-xs text-gray-500 mb-2 font-medium">{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</div>
                        <div className="text-xs text-gray-600 leading-relaxed"><RenderMarkDown content={exp.description || ""} /></div>
                    </div>
                    {isMyProfile && editMode && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setDialog({ type: 'experience', open: true, initialData: exp })} className="p-1 text-gray-400 hover:text-blue-500"><Pencil size={14}/></button>
                            <button onClick={() => handleDelete('workExperiences', exp.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                        </div>
                    )}
                 </div>
             </div>
         )) : (
             <div className="text-xs text-gray-400 italic">No work experience added yet.</div>
         )}
      </SectionCard>

      {/* 4. EDUCATION CARD */}
      <SectionCard 
          title="Education" 
          icon={GraduationCap} 
          onAdd={isMyProfile && editMode ? () => setDialog({ type: 'education', open: true }) : undefined}
      >
          {profileData.educations && profileData.educations.length > 0 ? profileData.educations.map(edu => (
             <div key={edu.id} className="group relative pl-4 border-l-2 border-gray-200 hover:border-[#0EA5E9] transition-colors">
                 <div className="flex justify-between items-start">
                    <div>
                        <div className="font-bold text-gray-900 text-sm">{edu.institutionName}</div>
                        <div className="text-xs text-gray-600 mb-1 font-medium">{edu.degreeType}, {edu.fieldOfStudy}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12}/> {edu.startDate} - {edu.graduationDate}</div>
                    </div>
                    {isMyProfile && editMode && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setDialog({ type: 'education', open: true, initialData: edu })} className="p-1 text-gray-400 hover:text-blue-500"><Pencil size={14}/></button>
                            <button onClick={() => handleDelete('educations', edu.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                        </div>
                    )}
                 </div>
             </div>
         )) : (
             <div className="text-xs text-gray-400 italic">No education added yet.</div>
         )}
      </SectionCard>
    </div>
  );
}