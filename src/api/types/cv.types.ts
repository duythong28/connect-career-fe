export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  github: string | null;
  linkedin: string | null;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  url: string | null;
  description: string;
  responsibilities: string[];
  techStack: string[];
}

export interface Award {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface ExtractedCvData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  awards: Award[];
}

export interface ParseCvFromPdfResponse {
  data: {
    extractedText: ExtractedCvData;
  };
}
