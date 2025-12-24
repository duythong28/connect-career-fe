import { cvTemplates } from "./TemplateSelectionStep";
import {
  ArrowRight,
  Award,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Download,
  Grid,
  LayoutTemplate,
  Pencil,
  Plus,
  PuzzleIcon,
  Settings,
  Trash2,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CVTemplateRenderer from "./CVTemplateRenderer";

const fontOptions = [
  { id: "inter", name: "Inter", css: "font-sans" },
  { id: "serif", name: "Serif", css: "font-serif" },
  { id: "mono", name: "Monospace", css: "font-mono" },
];

const colorPresets = [
  { name: "Blue", value: "#2563eb" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Green", value: "#059669" },
  { name: "Red", value: "#dc2626" },
  { name: "Gray", value: "#4b5563" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Black", value: "#000000" },
  { name: "Brown", value: "#92400e" },
];

// Utility functions
const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split(/[.\[\]]+/).filter(Boolean);
  let result = obj;
  for (const key of keys) {
    if (result === null || typeof result !== "object" || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }
  return result;
};

export const set = (obj, path, value) => {
  const newObj = structuredClone(obj);
  const keys = path.split(/[.\[\]]+/).filter(Boolean);
  let current = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return newObj;
};

const EditTemplateStep = ({
  cvData: initialData,
  templateId,
  onNext,
  onBack,
  onCancel,
}) => {
  const [cvData, setCvData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(true);
  const [primaryColor, setPrimaryColor] = useState(
    cvTemplates.find((t) => t.id === templateId)?.color || "#0EA5E9"
  );
  const [fontFamily, setFontFamily] = useState("font-sans");
  const [showCustomization, setShowCustomization] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const cvRef = useRef(null);

  const handleFieldChange = (path, value) => {
    setCvData((prev) => set(prev, path, value));
  };

  const toggleSectionVisibility = (section) => {
    setCvData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section],
      },
    }));
  };

  const moveSection = (fromIndex, toIndex) => {
    const newOrder = [...cvData.sectionOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setCvData((prev) => ({ ...prev, sectionOrder: newOrder }));
  };

  const handleMoveSection = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < cvData.sectionOrder.length) {
      moveSection(index, newIndex);
    }
  };

  const moveItemInArray = (section, fromIndex, toIndex) => {
    const newArray = [...cvData[section]];
    const [moved] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, moved);
    setCvData((prev) => ({ ...prev, [section]: newArray }));
  };

  const addItem = (section) => {
    const newItem =
      section === "workExperience"
        ? {
            id: Date.now().toString(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            responsibilities: [""],
          }
        : section === "education"
        ? {
            id: Date.now().toString(),
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
            gpa: "",
          }
        : section === "projects"
        ? {
            id: Date.now().toString(),
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            responsibilities: [],
          }
        : { id: Date.now().toString(), title: "", date: "", description: "" };

    setCvData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };

  const removeItem = (section, id) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const handlePreview = () => {
    setIsEditing(false);
  };

  const handleContinueEditing = () => {
    setIsEditing(true);
  };

  // HÀM GỐC: handleDownloadPDF (GIỮ NGUYÊN)
  const handleDownloadPDF = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `${cvData.personalInfo.name}_CV`,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .print-bg {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-color {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @page {
          margin: 0;
        }
      }
    `,
    print: async (printIframe) => {
      const document = printIframe.contentDocument;
      if (document) {
        const html = document.querySelector("html");
        const printButton = document.querySelector("button");
        if (printButton) {
          printButton.click();
        }
        printIframe.contentWindow?.print();
      }
    },
  });

  const getSectionName = (key) => {
    const names = {
      personalInfo: "Personal Information",
      skills: "Skills",
      workExperience: "Work Experience",
      education: "Education",
      projects: "Projects",
      awards: "Awards",
    };
    return names[key] || key;
  };
  // --- END CORE LOGIC FUNCTIONS ---

  // --- Helper Components cho UI (Simplify Style) ---
  const SectionHeader = ({ title, onToggle, isVisible, onAdd, icon }) => (
    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-md font-bold text-gray-800">{title}</h2>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isVisible
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm"
              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
          }`}
        >
          {isVisible ? "Visible" : "Hidden"}
        </button>
        {onAdd && isVisible && (
          <button
            onClick={onAdd}
            className="w-7 h-7 bg-[#0EA5E9] text-white rounded-full flex items-center justify-center hover:bg-[#0284c7] transition-colors shadow-sm"
            title={`Add ${title}`}
          >
            <Plus size={14} />
          </button>
        )}
      </div>
    </div>
  );

  const EditSectionCard = ({ children, className = "" }) => (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
  // --- End Helper Components ---

  if (!isEditing) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Preview Header (Simplify Style) */}
        <div className="no-print bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleContinueEditing}
                className="flex items-center gap-2 text-sm font-bold text-[#0EA5E9] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Pencil size={16} />
                Continue Editing
              </button>
              <h1 className="text-lg font-bold text-gray-800">Live Preview</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 text-sm font-bold shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 text-sm font-bold shadow-sm"
              >
                <LayoutTemplate size={14} className="inline mr-1" /> Change
                Template
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-2.5 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284c7] transition-colors font-bold text-sm shadow-md flex items-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto" ref={cvRef}>
            <CVTemplateRenderer
              cvData={cvData}
              templateId={templateId}
              primaryColor={primaryColor}
              fontFamily={fontFamily}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 font-sans">
      {/* Edit Header (Simplify Style) */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 uppercase tracking-wider transition-colors"
            >
              <ArrowRight size={14} className="rotate-180" />
              Back to Templates
            </button>
            <h1 className="text-lg font-bold text-gray-800">
              Customize Your CV
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 text-sm font-bold shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className={`px-4 py-2 text-gray-700 rounded-lg border text-sm font-bold shadow-sm flex items-center gap-1 transition-all ${
                showCustomization
                  ? "bg-blue-50 border-[#0EA5E9] text-[#0EA5E9]"
                  : "bg-gray-100 border-gray-300 hover:bg-gray-200"
              }`}
            >
              <Settings size={16} />
              Design
            </button>
            <button
              onClick={handlePreview}
              className="px-6 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284c7] transition-colors font-bold text-sm shadow-md"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Edit Controls */}
        <div className="w-1/2 overflow-y-auto p-8 border-r border-gray-200">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Customization Panel */}
            {showCustomization && (
              <section className="bg-white border-2 border-[#0EA5E9]/50 rounded-xl p-6 shadow-md transition-all animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-[#0EA5E9]" />
                  Customize Appearance
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Color Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Primary Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colorPresets.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setPrimaryColor(color.value)}
                          className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${
                            primaryColor === color.value
                              ? "border-gray-800 scale-110 ring-2 ring-blue-300"
                              : "border-gray-300 hover:scale-[1.05]"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                        style={{ padding: 0 }}
                      />
                    </div>
                  </div>

                  {/* Font Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Font Family
                    </label>
                    <div className="space-y-2">
                      {fontOptions.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setFontFamily(font.css)}
                          className={`w-full px-4 py-2 text-left rounded-lg border-2 text-sm font-medium transition-all ${
                            fontFamily === font.css
                              ? "border-[#0EA5E9] bg-blue-50 text-[#0EA5E9] font-bold"
                              : "border-gray-300 bg-white hover:border-gray-400 text-gray-700"
                          } ${font.css}`}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section Order (UPDATED UI: Using buttons instead of D&D) */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
                    Section Order
                  </label>
                  <div className="space-y-2">
                    {cvData.sectionOrder.map((section, index) => (
                      <div
                        key={section}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-500 text-xs w-4">
                            {index + 1}.
                          </span>
                          <span className="font-medium text-sm text-gray-800">
                            {getSectionName(section)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1 text-gray-500">
                            {/* Move Up */}
                            <button
                              onClick={() => handleMoveSection(index, -1)}
                              disabled={index === 0}
                              className={`p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                                index === 0
                                  ? "text-gray-300"
                                  : "hover:text-[#0EA5E9]"
                              }`}
                              title="Move Up"
                            >
                              <ChevronUp size={16} />
                            </button>
                            {/* Move Down */}
                            <button
                              onClick={() => handleMoveSection(index, 1)}
                              disabled={
                                index === cvData.sectionOrder.length - 1
                              }
                              className={`p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                                index === cvData.sectionOrder.length - 1
                                  ? "text-gray-300"
                                  : "hover:text-[#0EA5E9]"
                              }`}
                              title="Move Down"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => toggleSectionVisibility(section)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                              cvData.sectionVisibility[section]
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                            }`}
                          >
                            {cvData.sectionVisibility[section]
                              ? "Visible"
                              : "Hidden"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Personal Info */}
            <EditSectionCard>
              <SectionHeader
                title="Personal Information"
                icon={<User size={18} className="text-[#0EA5E9]" />}
                onToggle={() => toggleSectionVisibility("personalInfo")}
                isVisible={cvData.sectionVisibility.personalInfo}
              />
              {cvData.sectionVisibility.personalInfo && (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.name}
                      onChange={(e) =>
                        handleFieldChange("personalInfo.name", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.title}
                      onChange={(e) =>
                        handleFieldChange("personalInfo.title", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) =>
                          handleFieldChange(
                            "personalInfo.email",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={cvData.personalInfo.phone}
                        onChange={(e) =>
                          handleFieldChange(
                            "personalInfo.phone",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.address}
                      onChange={(e) =>
                        handleFieldChange(
                          "personalInfo.address",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </EditSectionCard>

            {/* Skills */}
            <EditSectionCard>
              <SectionHeader
                title="Skills"
                icon={<Grid size={18} className="text-[#0EA5E9]" />}
                onToggle={() => toggleSectionVisibility("skills")}
                isVisible={cvData.sectionVisibility.skills}
              />
              {cvData.sectionVisibility.skills && (
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                      >
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) =>
                            handleFieldChange(
                              `skills[${index}]`,
                              e.target.value
                            )
                          }
                          className="bg-transparent border-none focus:outline-none w-auto max-w-[100px] text-sm font-medium"
                        />
                        <button
                          onClick={() => {
                            const newSkills = cvData.skills.filter(
                              (_, i) => i !== index
                            );
                            setCvData((prev) => ({
                              ...prev,
                              skills: newSkills,
                            }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setCvData((prev) => ({
                          ...prev,
                          skills: [...prev.skills, "New Skill"],
                        }))
                      }
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm font-medium border border-gray-300"
                    >
                      <Plus size={14} className="inline mr-1" /> Add Skill
                    </button>
                  </div>
                </div>
              )}
            </EditSectionCard>

            {/* Work Experience */}
            <EditSectionCard>
              <SectionHeader
                title="Work Experience"
                icon={<Briefcase size={18} className="text-[#0EA5E9]" />}
                onToggle={() => toggleSectionVisibility("workExperience")}
                isVisible={cvData.sectionVisibility.workExperience}
                onAdd={() => addItem("workExperience")}
              />
              {cvData.sectionVisibility.workExperience && (
                <div className="p-6 space-y-6">
                  {cvData.workExperience.map((work, idx) => (
                    <div
                      key={work.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-800 text-sm">
                          {work.position || `Experience ${idx + 1}`}
                        </h3>
                        <div className="flex gap-2 text-gray-500">
                          {idx > 0 && (
                            <button
                              onClick={() =>
                                moveItemInArray("workExperience", idx, idx - 1)
                              }
                              className="hover:text-[#0EA5E9]"
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>
                          )}
                          {idx < cvData.workExperience.length - 1 && (
                            <button
                              onClick={() =>
                                moveItemInArray("workExperience", idx, idx + 1)
                              }
                              className="hover:text-[#0EA5E9]"
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              removeItem("workExperience", work.id)
                            }
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <input
                          type="text"
                          value={work.position}
                          placeholder="Position"
                          onChange={(e) =>
                            handleFieldChange(
                              `workExperience[${idx}].position`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          value={work.company}
                          placeholder="Company"
                          onChange={(e) =>
                            handleFieldChange(
                              `workExperience[${idx}].company`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={work.startDate}
                            placeholder="Start Date"
                            onChange={(e) =>
                              handleFieldChange(
                                `workExperience[${idx}].startDate`,
                                e.target.value
                              )
                            }
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            value={work.endDate}
                            placeholder="End Date"
                            onChange={(e) =>
                              handleFieldChange(
                                `workExperience[${idx}].endDate`,
                                e.target.value
                              )
                            }
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        {work.responsibilities.map((resp, rIdx) => (
                          <div key={rIdx} className="flex gap-2 items-start">
                            <textarea
                              value={resp}
                              placeholder="Responsibility"
                              onChange={(e) =>
                                handleFieldChange(
                                  `workExperience[${idx}].responsibilities[${rIdx}]`,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                              rows={2}
                            />
                            <button
                              onClick={() => {
                                const newResp = work.responsibilities.filter(
                                  (_, i) => i !== rIdx
                                );
                                handleFieldChange(
                                  `workExperience[${idx}].responsibilities`,
                                  newResp
                                );
                              }}
                              className="text-red-500 hover:text-red-700 p-2 mt-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newResp = [...work.responsibilities, ""];
                            handleFieldChange(
                              `workExperience[${idx}].responsibilities`,
                              newResp
                            );
                          }}
                          className="text-sm text-[#0EA5E9] font-bold hover:underline flex items-center"
                        >
                          <Plus size={16} className="inline mr-1" /> Add Bullet
                          Point
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </EditSectionCard>

            {/* Education */}
            <EditSectionCard>
              <SectionHeader
                title="Education"
                icon={<UserCheck size={18} className="text-[#0EA5E9]" />}
                onToggle={() => toggleSectionVisibility("education")}
                isVisible={cvData.sectionVisibility.education}
                onAdd={() => addItem("education")}
              />
              {cvData.sectionVisibility.education && (
                <div className="p-6 space-y-6">
                  {cvData.education.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-800 text-sm">
                          {edu.institution || `Education ${idx + 1}`}
                        </h3>
                        <div className="flex gap-2 text-gray-500">
                          {idx > 0 && (
                            <button
                              onClick={() =>
                                moveItemInArray("education", idx, idx - 1)
                              }
                              className="hover:text-[#0EA5E9]"
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>
                          )}
                          {idx < cvData.education.length - 1 && (
                            <button
                              onClick={() =>
                                moveItemInArray("education", idx, idx + 1)
                              }
                              className="hover:text-[#0EA5E9]"
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => removeItem("education", edu.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <input
                          type="text"
                          value={edu.institution}
                          placeholder="Institution"
                          onChange={(e) =>
                            handleFieldChange(
                              `education[${idx}].institution`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          value={edu.degree}
                          placeholder="Degree/Major"
                          onChange={(e) =>
                            handleFieldChange(
                              `education[${idx}].degree`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={edu.startDate}
                            placeholder="Start Date"
                            onChange={(e) =>
                              handleFieldChange(
                                `education[${idx}].startDate`,
                                e.target.value
                              )
                            }
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            value={edu.endDate}
                            placeholder="End Date"
                            onChange={(e) =>
                              handleFieldChange(
                                `education[${idx}].endDate`,
                                e.target.value
                              )
                            }
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            value={edu.gpa}
                            placeholder="GPA"
                            onChange={(e) =>
                              handleFieldChange(
                                `education[${idx}].gpa`,
                                e.target.value
                              )
                            }
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </EditSectionCard>

            {/* Projects */}
            <EditSectionCard>
              <SectionHeader
                title="Projects"
                icon={<PuzzleIcon size={18} className="text-[#0EA5E9]" />}
                onToggle={() => toggleSectionVisibility("projects")}
                isVisible={cvData.sectionVisibility.projects}
                onAdd={() => addItem("projects")}
              />
              {cvData.sectionVisibility.projects && (
                <div className="p-6 space-y-6">
                  {cvData.projects.map((project, idx) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-800 text-sm">
                          {project.title || `Project ${idx + 1}`}
                        </h3>
                        <div className="flex gap-2 text-gray-500">
                          {idx > 0 && (
                            <button
                              onClick={() =>
                                moveItemInArray("projects", idx, idx - 1)
                              }
                              className="hover:text-[#0EA5E9]"
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>
                          )}
                          {idx < cvData.projects.length - 1 && (
                            <button
                              onClick={() =>
                                moveItemInArray("projects", idx, idx + 1)
                              }
                              className="hover:text-[#0EA5E9]"
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => removeItem("projects", project.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <input
                          type="text"
                          value={project.title}
                          placeholder="Project Title"
                          onChange={(e) =>
                            handleFieldChange(
                              `projects[${idx}].title`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <textarea
                          value={project.description}
                          placeholder="Description"
                          onChange={(e) =>
                            handleFieldChange(
                              `projects[${idx}].description`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          rows={3}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={project.startDate}
                            placeholder="Start Date"
                            onChange={(e) =>
                              handleFieldChange(
                                `projects[${idx}].startDate`,
                                e.target.value
                              )
                            }
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            value={project.endDate}
                            placeholder="End Date"
                            onChange={(e) =>
                              handleFieldChange(
                                `projects[${idx}].endDate`,
                                e.target.value
                              )
                            }
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        {/* Note: Responsibilities input handling for Projects section is simplified/omitted here for brevity, matching the existing structure only for Work Experience/Awards/Education fields. */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </EditSectionCard>

            {/* Awards */}
            <EditSectionCard>
              <SectionHeader
                title="Awards & Achievements"
                icon={<Award size={18} className="text-[#0EA5E9]" />}
                onToggle={() => toggleSectionVisibility("awards")}
                isVisible={cvData.sectionVisibility.awards}
                onAdd={() => addItem("awards")}
              />
              {cvData.sectionVisibility.awards && (
                <div className="p-6 space-y-6">
                  {cvData.awards.map((award, idx) => (
                    <div
                      key={award.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-800 text-sm">
                          {award.title || `Award ${idx + 1}`}
                        </h3>
                        <div className="flex gap-2 text-gray-500">
                          {idx > 0 && (
                            <button
                              onClick={() =>
                                moveItemInArray("awards", idx, idx - 1)
                              }
                              className="hover:text-[#0EA5E9]"
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>
                          )}
                          {idx < cvData.awards.length - 1 && (
                            <button
                              onClick={() =>
                                moveItemInArray("awards", idx, idx + 1)
                              }
                              className="hover:text-[#0EA5E9]"
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => removeItem("awards", award.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <input
                          type="text"
                          value={award.title}
                          placeholder="Award Title"
                          onChange={(e) =>
                            handleFieldChange(
                              `awards[${idx}].title`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          value={award.date}
                          placeholder="Date"
                          onChange={(e) =>
                            handleFieldChange(
                              `awards[${idx}].date`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <textarea
                          value={award.description}
                          placeholder="Description"
                          onChange={(e) =>
                            handleFieldChange(
                              `awards[${idx}].description`,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </EditSectionCard>
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto p-8">
          <div className="bg-white max-w-2xl mx-auto shadow-2xl">
            <CVTemplateRenderer
              cvData={cvData}
              templateId={templateId}
              primaryColor={primaryColor}
              fontFamily={fontFamily}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTemplateStep;
