import { ArrowRight, Check, FileText } from "lucide-react";
import { useState } from "react";
import CVTemplateRenderer from "./CVTemplateRenderer";

export const cvTemplates = [
  {
    id: "modern",
    name: "Modern Professional",
    desc: "Clean and professional design perfect for any industry",
    color: "#2563eb",
  },
  {
    id: "sidebar",
    name: "Sidebar Layout",
    desc: "Two-column layout with colored sidebar for emphasis",
    color: "#0891b2",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    desc: "Simple and elegant with focus on content",
    color: "#000000",
  },
  {
    id: "executive",
    name: "Executive Leader",
    desc: "Bold and authoritative for senior positions",
    color: "#1e293b",
  },
  {
    id: "creative",
    name: "Creative Designer",
    desc: "Vibrant and eye-catching for creative fields",
    color: "#7c3aed",
  },
  {
    id: "timeline",
    name: "Timeline View",
    desc: "Visual timeline showing your career progression",
    color: "#0EA5E9",
  },
  {
    id: "compact",
    name: "Compact Dense",
    desc: "Maximizes content in limited space",
    color: "#6b7280",
  },
  {
    id: "academic",
    name: "Academic Research",
    desc: "Formal style for academic and research positions",
    color: "#4b5563",
  },
  {
    id: "technical",
    name: "Technical Expert",
    desc: "Modern tech-focused with monospace accents",
    color: "#059669",
  },
  {
    id: "elegant",
    name: "Elegant Classic",
    desc: "Sophisticated serif design with refined styling",
    color: "#92400e",
  },
];

const TemplateSelectionStep = ({ cvData, onNext, onBack, onCancel }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  // [Business Logic for safeCvData and previewData remains unchanged]
  const safeCvData = {
    personalInfo: cvData?.personalInfo || {
      name: "",
      title: "",
      email: "",
      phone: "",
      address: "",
    },
    skills: cvData?.skills || [],
    workExperience: cvData?.workExperience || [],
    education: cvData?.education || [],
    projects: cvData?.projects || [],
    awards: cvData?.awards || [],
    sectionVisibility: cvData?.sectionVisibility || {
      personalInfo: true,
      skills: true,
      workExperience: true,
      education: true,
      projects: true,
      awards: true,
    },
    sectionOrder: cvData?.sectionOrder || [
      "personalInfo",
      "skills",
      "workExperience",
      "education",
      "projects",
      "awards",
    ],
  };

  const previewData = {
    ...safeCvData,
    personalInfo: {
      ...safeCvData.personalInfo,
      name: "Henry User",
      title: "Software Engineer",
    },
    skills:
      safeCvData.skills.slice(0, 6).length > 0
        ? safeCvData.skills.slice(0, 6)
        : ["Python", "React", "SQL"],
    workExperience:
      safeCvData.workExperience.slice(0, 1).length > 0
        ? safeCvData.workExperience.slice(0, 1)
        : [
            {
              id: 1,
              position: "SDE II",
              company: "Orbitz",
              startDate: "Jan 2024",
              endDate: "Jan 2025",
              responsibilities: ["Developed scalable APIs..."],
            },
          ],
    education:
      safeCvData.education.slice(0, 1).length > 0
        ? safeCvData.education.slice(0, 1)
        : [
            {
              id: 1,
              institution: "Aalborg University",
              degree: "Master's",
              startDate: "2020",
              endDate: "2025",
              gpa: "4.0",
            },
          ],
    projects: safeCvData.projects.slice(0, 1),
    awards: safeCvData.awards.slice(0, 1),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header and Controls */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-900 flex items-center gap-1 uppercase tracking-wider text-xs font-bold transition-colors"
            >
              <ArrowRight size={14} className="rotate-180" /> Back to Documents
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 font-bold text-sm shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => onNext(safeCvData, selectedTemplate)}
              disabled={!selectedTemplate}
              className={`px-6 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284c7] transition-all font-bold text-sm shadow-md flex items-center gap-2 ${
                !selectedTemplate ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Select & Customize <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Resume Template
          </h1>
          <p className="text-md text-gray-600">
            Select a recruiter-approved template that best highlights your
            experience.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {cvTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              // Loại bỏ border-t-0 và đặt border-2
              className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all border-2 relative group 
                                ${
                                  selectedTemplate === template.id
                                    ? `ring-4 ring-[#0EA5E9]/50 border-[#0EA5E9] shadow-xl`
                                    : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                                }`}
            >
              {/* KHUNG PREVIEW TƯƠNG TÁC */}
              <div className="h-80 flex items-center justify-center relative bg-gray-100 overflow-hidden">
                {/* KHUNG CHỨA MẪU CV (A4 aspect ratio) */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  {/* MẪU CV THỰC TẾ */}
                  <div
                    className="bg-white shadow-2xl transition-all duration-300"
                    style={{
                      // Tỷ lệ A4 (210/297 = 0.707)
                      width: "80%",
                      paddingBottom: `${80 / 0.707}%`,
                      position: "absolute",
                      // Scale and Hover/Selected effect
                      transform: `scale(0.8) translate(-50%, -50%)`, // Vị trí mặc định (scale 0.8)
                      top: "50%",
                      left: "50%",
                      height: "auto",
                    }}
                  >
                    {/* Container bên trong để áp dụng scale nhỏ cho nội dung CVTemplateRenderer */}
                    <div
                      className="absolute top-0 left-0 w-[210mm] h-[297mm] transform origin-top-left"
                      style={{
                        transform: "scale(0.5)",
                      }}
                    >
                      <CVTemplateRenderer
                        cvData={previewData}
                        templateId={template.id}
                        primaryColor={template.color}
                      />
                    </div>
                  </div>
                </div>

                {/* Lớp phủ Hover/Selected */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300 pointer-events-none 
                                        ${
                                          selectedTemplate === template.id
                                            ? "bg-black/10" // Màu nền nhẹ khi được chọn
                                            : "group-hover:bg-black/10" // Màu nền nhẹ khi hover
                                        }
                                    `}
                >
                  {/* Template Info - Đưa vào góc dưới trái */}
                  <div
                    className={`p-3 rounded-lg backdrop-blur-sm transition-opacity duration-200 
                                            ${
                                              selectedTemplate === template.id
                                                ? "bg-white/90 shadow-lg"
                                                : "bg-white/80"
                                            }
                                    `}
                  >
                    <h3 className="text-md font-bold text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {template.desc}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: template.color }}
                      ></div>
                      <span className="text-xs text-gray-500">
                        Accent Color
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-4 right-4 bg-[#0EA5E9] text-white p-1 rounded-full shadow-md z-10 pointer-events-none">
                    <Check size={18} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action/Info Bar */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-2xl rounded-t-xl z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                selectedTemplate
                  ? "bg-[#0EA5E9] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {selectedTemplate ? <Check size={16} /> : <FileText size={16} />}
            </div>
            <p className="text-sm text-gray-700">
              {selectedTemplate
                ? `Template selected: ${
                    cvTemplates.find((t) => t.id === selectedTemplate)?.name
                  }`
                : "Please select a template to continue."}
            </p>
          </div>

          <button
            onClick={() => onNext(safeCvData, selectedTemplate)}
            disabled={!selectedTemplate}
            className={`px-8 py-3 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284c7] transition-all font-bold text-md shadow-lg flex items-center gap-2 ${
              !selectedTemplate ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Customize & Next Step <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
