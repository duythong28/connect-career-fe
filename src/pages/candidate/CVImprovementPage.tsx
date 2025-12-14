import { enhanceCvWithAi, getMyCvs } from "@/api/endpoints/cvs.api";
import { ExtractedCvData } from "@/api/types/cv.types";
import { EnhanceCvWithAiDto } from "@/api/types/cvs.types";
import UploadFilButton from "@/components/ai/UploadFileButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, ArrowRight, Award, Briefcase, Check, CheckCircle2, ChevronDown, ChevronUp, Crown, Download, File, FileText, Grid, GripVertical, LayoutTemplate, Mail, MapPin, Pencil, Phone, Plus, PuzzleIcon, Send, Settings, Star, Trash2, UploadCloud, User, UserCheck, X, Zap } from "lucide-react";
import React, { useState, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";



const cvTemplates = [
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

const set = (obj, path, value) => {
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

// ============================================================================
// CANCEL CONFIRMATION MODAL
// ============================================================================

const CancelModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Cancel CV Improvement?
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel? All your progress will be lost.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Editing
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STEP 1: CV SELECTION/UPLOAD
// ============================================================================

const CVSelectionStep = ({ onNext, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialCvData, setInitialCvData] = useState(null);
  
  // Sử dụng mock data
  const { data: cvsData } = useQuery({
    queryKey: ["candidateCvs"],
    queryFn: async () => {
      // Thay thế bằng hàm mock
      return getMyCvs();
    },
  });

  const handleFileUpload = (cvData: ExtractedCvData) => {
    setInitialCvData(cvData);
    // Khi upload file thành công, tự động chọn option upload
    setSelectedOption("upload"); 
  };

  const handleProceed = async () => {
    // Logic: Kiểm tra dữ liệu hợp lệ trước khi tiếp tục
    const isReady = (selectedOption === "upload" && initialCvData) || 
                    (selectedOption === "existing" && selectedCV);
    
    if (!isReady) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const finalData = selectedOption === "upload" ? initialCvData : { cvId: selectedCV };
    onNext(finalData);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Improve Your Resume / CV
            </h1>
            <p className="text-sm text-gray-500">
              Let's start by selecting or uploading your resume/CV
            </p>
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-sm font-semibold flex items-center gap-1"
          >
            <X size={16}/> Cancel
          </button>
        </div>
        
        {/* Main Selection Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Option 1: Upload New CV */}
          <div
            onClick={() => setSelectedOption("upload")}
            className={`bg-white rounded-xl p-6 cursor-pointer transition-all border ${
              selectedOption === "upload"
                ? "border-[#0EA5E9] ring-2 ring-blue-100"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Upload New Resume
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload a PDF, DOC, or DOCX file
              </p>

              {/* Upload Button/Area (Always visible when this option is selected) */}
              <div className="mt-4">
                <UploadFilButton onUploadSuccess={handleFileUpload} />
                {initialCvData && (
                  <p className="text-sm text-green-600 font-semibold mt-2 flex items-center justify-center gap-1">
                    <Check size={14} /> File uploaded successfully
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Option 2: Select Existing CV */}
          <div
            onClick={() => setSelectedOption("existing")}
            className={`bg-white rounded-xl p-6 cursor-pointer transition-all border ${
              selectedOption === "existing"
                ? "border-[#0EA5E9] ring-2 ring-blue-100"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Select Existing Resume
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Choose from your saved documents
              </p>

              {selectedOption === "existing" && (
                <div className="mt-4 space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar p-1">
                  {(cvsData?.data ? cvsData.data : []).map((cv) => (
                    <div
                      key={cv.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCV(cv.id);
                      }}
                      className={`p-3 rounded-lg cursor-pointer text-left transition-all border ${
                        selectedCV === cv.id
                          ? "bg-blue-50 border-blue-400"
                          : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-sm text-gray-800 flex items-center gap-2">
                          <File size={16} className="text-gray-500" />
                          {cv.title}
                        </p>
                        {selectedCV === cv.id && (
                          <Check size={16} className="text-[#0EA5E9]" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 pl-6">
                        {cv.createdAt}
                      </p>
                    </div>
                  ))}
                  {(cvsData?.data?.length === 0 || !cvsData) && (
                    <div className="text-sm text-gray-500 py-6">
                        No saved resumes found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Action Button */}
        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-xl">
          <button
            onClick={handleProceed}
            disabled={
              isProcessing ||
              !(
                (selectedOption === "upload" && initialCvData) ||
                (selectedOption === "existing" && selectedCV)
              )
            }
            className="px-8 py-3 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284c7] disabled:bg-gray-400 transition-colors font-bold text-sm flex items-center gap-2"
          >
            {isProcessing ? (
                <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    Processing CV...
                </>
            ) : (
                <>
                    Continue <ChevronDown size={14} className="rotate-[-90deg]" />
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STEP 2: JOB DESCRIPTION INPUT
// ============================================================================

const JobDescriptionStep = ({ cvData, onNext, onBack, onCancel }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { mutate: enhanceCvWithAiMutate, isPending } = useMutation({
    mutationFn: async (data: EnhanceCvWithAiDto) => {
      // Bật cờ loading thủ công vì useMutation không cập nhật ngay
      setIsAnalyzing(true); 
      return enhanceCvWithAi(data);
    },
    onSuccess: (data) => {
      onNext({ cvAssessment: data.data.cvAssessment });
    },
    onError: (error) => {
      console.error("AI Analysis failed:", error);
    },
    onSettled: () => {
      setIsAnalyzing(false);
    },
  });

  const handleAnalyze = async () => {
    // Nếu JD rỗng, bỏ qua và tiếp tục
    if (jobDescription.trim() === "") {
        onNext({ cvAssessment: null });
        return;
    }
    
    enhanceCvWithAiMutate(
      { cv: cvData, jobDescription },
    );
  };

  const isProcessing = isPending || isAnalyzing;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-sm font-semibold flex items-center gap-1"
          >
            <X size={16}/> Cancel
          </button>
        </div>

        {/* Title & Description */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Job Description
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Paste the job description below to get tailored resume/CV improvements
          </p>

          <div className="bg-white rounded-xl">
            {/* Alert/Tip Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900 leading-relaxed">
                    Providing the job description is optional, but highly recommended. Our AI uses this context to give you the most accurate keyword and content suggestions.
                </p>
            </div>
            
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Job Description (Copy/Paste)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here (e.g., Responsibilities, Requirements, Qualifications)..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent resize-none text-sm outline-none"
            />

            <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 font-medium">
                {jobDescription.length > 0
                  ? `Character count: ${jobDescription.length}`
                  : "You can skip this step, but we recommend providing a job description for better results"}
              </p>
              <button
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="px-8 py-3 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284c7] disabled:bg-gray-400 transition-colors font-bold text-sm flex items-center gap-2"
              >
                {isProcessing ? (
                    <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        Analyzing...
                    </>
                ) : jobDescription.trim() !== "" ? (
                    <>
                        Analyze & Continue <Send size={14} className="rotate-[-20deg]" />
                    </>
                ) : (
                    <>
                        Skip & Continue <Send size={14} className="rotate-[-20deg]"/>
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STEP 3: REVIEW SUGGESTIONS
// ============================================================================

const EditableField = ({ path, value, suggestion, onApprove, onEdit }) => {
  // Logic useMemo được giả định tồn tại ở nơi gọi
  const displayValue = useMemo(() => {
    if (!suggestion || !Array.isArray(suggestion.diff)) return value;

    // Handle complex array diffs (workExperience, projects)
    if (suggestion.path.includes("workExperience") || suggestion.path.includes("projects")) {
        // UI tối giản cho Complex diff: Chỉ hiện thông báo và button
        return (
            <span className="p-1 rounded-md bg-gray-100 border border-dashed border-blue-400 relative inline-flex items-center">
                <span className="text-blue-700 font-medium italic text-xs">
                    Complex suggestion available in right panel.
                </span>
                <button
                    title="Approve suggestion"
                    className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-all text-xs font-semibold flex items-center"
                    onClick={(e) => { e.stopPropagation(); onApprove(suggestion); }}
                >
                    <Check size={12} className="inline mr-1"/> Approve
                </button>
            </span>
        );
    }
    
    // Handle simple array/string diffs (render inline diff)
    return suggestion.diff.map((segment, index) => (
      <span
        key={index}
        className={
          segment.type === "deletion"
            ? "bg-red-100 text-red-700 line-through"
            : segment.type === "suggestion"
            ? "bg-green-100 text-green-700 font-medium"
            : "text-gray-700"
        }
      >
        {segment.value}
      </span>
    ));
  }, [value, suggestion, onApprove]);

  // If there's an inline suggestion, wrap it in a container
  if (suggestion && Array.isArray(suggestion.diff) && !suggestion.path.includes("workExperience") && !suggestion.path.includes("projects")) {
    const isSkills = suggestion.path === "skills";
    const approveButton = (
        <button
          title="Approve suggestion"
          className="ml-2 px-2 py-0.5 rounded-full bg-green-200 text-green-800 hover:bg-green-300 transition-all text-xs font-semibold flex items-center"
          onClick={(e) => { e.stopPropagation(); onApprove(suggestion); }} // FIX: Thêm e.stopPropagation()
        >
          <Check size={12} className="inline mr-1"/> Approve
        </button>
    );

    return (
        <span className="p-1 rounded-md bg-gray-50 border border-dashed border-blue-300 relative inline-flex items-center flex-wrap">
            {isSkills ? (
                // Render skill pills with diff highlighting
                suggestion.diff.map((segment, index) => (
                    <span
                        key={index}
                        className={`mr-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            segment.type === "deletion"
                                ? "bg-red-100 text-red-700 line-through"
                                : segment.type === "suggestion"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-800"
                        }`}
                    >
                        {segment.value}
                    </span>
                ))
            ) : (
                // Render inline string diff
                displayValue
            )}
            {approveButton}
        </span>
    );
  }

  // No suggestion or complex array suggestion
  return (
    <span
      contentEditable={true}
      suppressContentEditableWarning={true}
      // UI cho chế độ chỉnh sửa
      className={`inline-block min-w-[50px] p-1 rounded-md hover:bg-blue-50 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${suggestion ? 'text-gray-700' : 'text-gray-900'}`}
      onBlur={(e) => onEdit(path, e.target.innerText)}
      dangerouslySetInnerHTML={{ __html: String(value) }}
    />
  );
};

const SuggestionCard = ({ suggestion, onApprove, onDismiss }) => {
  const isComplexArraySuggestion =
    suggestion.path === "workExperience" || suggestion.path === "projects";
  const isObjectSuggestion =
    suggestion.path === "personalInfo" ||
    (suggestion.diff &&
      suggestion.diff.length > 0 &&
      typeof suggestion.diff[0].value === "object" &&
      !Array.isArray(suggestion.diff[0].value));
  const isSimpleArraySuggestion =
    suggestion.path === "skills" && Array.isArray(suggestion.diff);

  const getTitle = (path) => path.replace(/([A-Z])/g, " $1").trim().replace(/work Experience/i, 'Experience').replace(/personal Info/i, 'Header Info');

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 transition-all hover:border-blue-300">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-bold text-gray-800 capitalize flex items-center gap-2">
            <Zap size={16} className="text-blue-500"/> {getTitle(suggestion.path)}
        </h4>
        <button
            title="Dismiss suggestion"
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            onClick={(e) => { e.stopPropagation(); onDismiss(suggestion.id); }} // FIX: Thêm e.stopPropagation()
        >
            <X size={16}/>
        </button>
      </div>
      
      {/* Reason */}
      <p className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded-md border border-gray-100">
        <span className="font-semibold text-gray-800 mr-1">AI Reason:</span>{suggestion.reason}
      </p>

      {/* Diff Area */}
      <div className="text-xs bg-gray-50 p-3 rounded-md mb-4 max-h-96 overflow-y-auto custom-scrollbar border border-gray-100">
        {isComplexArraySuggestion ? (
          // Render complex array suggestions (Experience/Projects)
          <div className="space-y-3">
            {suggestion.diff.map((segment, index) => {
              if (segment.type === "suggestion" && segment.value) {
                const value = segment.value;
                return (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-xs font-bold text-green-800 mb-2 flex items-center gap-1">
                      <Check size={14}/> Suggested New Entry:
                    </div>
                    {Array.isArray(value) ? (
                      value.map((item, idx) => (
                        <div key={idx} className="mb-2 pb-2 border-b border-green-100 last:border-0 pl-2">
                          {typeof item === "object" && item !== null ? (
                            Object.entries(item).map(([key, val]) => (
                              <div key={key} className="text-[10px] flex gap-1">
                                <span className="font-medium text-gray-700 capitalize">
                                  {key}:
                                </span>{" "}
                                <span className="text-green-700 font-semibold flex-1">
                                  {Array.isArray(val) ? val.join(", ") : String(val)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-green-700">
                              {String(item)}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      // Handle single object addition/change
                      typeof value === "object" && value !== null ? (
                          <div className="space-y-1 pl-2">
                                {Object.entries(value).map(([key, val]) => (
                                    <div key={key} className="text-[10px] flex gap-1">
                                        <span className="font-medium text-gray-700 capitalize">
                                            {key}:
                                        </span>{" "}
                                        <span className="text-green-700 font-semibold flex-1">
                                            {Array.isArray(val) ? val.join(", ") : String(val)}
                                        </span>
                                    </div>
                                ))}
                          </div>
                      ) : null
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : isObjectSuggestion ? (
          // Render object suggestions (like personalInfo)
          <div className="space-y-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-xs font-bold text-green-800 mb-2">Suggested Field Updates:</div>
                <div className="space-y-1 pl-2">
                    {suggestion.diff.map((segment, index) => {
                        if (segment.type === "suggestion" && typeof segment.value === "object" && segment.value !== null) {
                            return Object.entries(segment.value).map(([key, val]) => (
                                <div key={key} className="text-[10px] flex gap-1">
                                    <span className="font-medium text-gray-700 capitalize w-1/3">{key}:</span>
                                    <span className="text-green-700 font-semibold flex-1">{String(val || "-")}</span>
                                </div>
                            ));
                        }
                        return null;
                    })}
                </div>
            </div>
          </div>
        ) : isSimpleArraySuggestion ? (
          // Render simple array suggestions (like skills) as pills
          <div className="flex flex-wrap gap-1">
            {suggestion.diff.map((segment, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  segment.type === "deletion"
                    ? "bg-red-100 text-red-700 line-through"
                    : segment.type === "suggestion"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {String(segment.value)}
              </span>
            ))}
          </div>
        ) : (
          // Render string suggestions as inline text
          suggestion.diff.map((segment, index) => (
            <span
              key={index}
              className={
                segment.type === "deletion"
                  ? "bg-red-100 text-red-700 line-through"
                  : segment.type === "suggestion"
                  ? "bg-green-100 text-green-700 font-medium"
                  : "text-gray-700"
              }
            >
              {String(segment.value)}
            </span>
          ))
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          title="Dismiss suggestion"
          className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-xs font-bold flex items-center gap-1"
          onClick={(e) => { e.stopPropagation(); onDismiss(suggestion.id); }} // FIX: Thêm e.stopPropagation()
        >
          <X size={14}/> Dismiss
        </button>
        <button
          title="Approve suggestion"
          className="px-4 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all text-xs font-bold flex items-center gap-1"
          onClick={(e) => { e.stopPropagation(); onApprove(suggestion); }} // FIX: Thêm e.stopPropagation()
        >
          <Check size={14}/> Approve
        </button>
      </div>
    </div>
  );
};

const ReviewSuggestionsStep = ({
  cvData: initialData,
  assessmentData: initialAssessment,
  onNext,
  onBack,
  onCancel,
}) => {
  const [cvData, setCvData] = useState(initialData);
  const [assessmentData, setAssessmentData] = useState(initialAssessment);

  const suggestionMap = useMemo(() => {
    const map = {};
    if (assessmentData && assessmentData.cvAssessment) {
      Object.values(assessmentData.cvAssessment).forEach((suggestions: any) => {
        if (Array.isArray(suggestions)) {
          suggestions.forEach((suggestion: any) => {
            map[suggestion.path] = suggestion;
          });
        }
      });
    }
    return map;
  }, [assessmentData]);

  const removeSuggestion = (suggestionId) => {
    const newAssessment = structuredClone(assessmentData);
    if (newAssessment && newAssessment.cvAssessment) {
      for (const aspect in newAssessment.cvAssessment) {
        newAssessment.cvAssessment[aspect] = newAssessment.cvAssessment[
          aspect
        ].filter((s: any) => s.id !== suggestionId);
      }
    }
    setAssessmentData(newAssessment);
  };

  const handleApprove = (suggestion) => {
    let newValue;

    // Check the type of suggestion based on the diff structure
    const firstDiff = suggestion.diff.find((s) => s.type === "suggestion");

    if (!firstDiff) {
      // No suggestion to apply, just remove the suggestion card
      removeSuggestion(suggestion.id);
      return;
    }

    // Handle object suggestions (like personalInfo)
    if (
      typeof firstDiff.value === "object" &&
      firstDiff.value !== null &&
      !Array.isArray(firstDiff.value)
    ) {
      newValue = firstDiff.value;
    }
    // Handle array of objects (like workExperience, projects)
    else if (
      Array.isArray(firstDiff.value) &&
      firstDiff.value.length > 0 &&
      typeof firstDiff.value[0] === "object"
    ) {
      newValue = firstDiff.value;
    }
    // Handle simple array suggestions (like skills)
    else if (
      suggestion.path === "skills" ||
      (Array.isArray(firstDiff.value) && typeof firstDiff.value[0] === "string")
    ) {
      newValue = suggestion.diff
        .filter((s) => s.type !== "deletion")
        .map((s) => s.value);
    }
    // Handle string diffs
    else {
      newValue = suggestion.diff
        .filter((s) => s.type !== "deletion")
        .map((s) => s.value)
        .join("");
    }

    setCvData((prev) => set(prev, suggestion.path, newValue));
    removeSuggestion(suggestion.id);
  };

  const handleDismiss = (suggestionId) => {
    removeSuggestion(suggestionId);
  };

  const handleEdit = (path, newValue) => {
    setCvData((prev) => set(prev, path, newValue));
  };

  const totalSuggestions = useMemo(() => {
    if (!assessmentData || !assessmentData.cvAssessment) return 0;
    return Object.values(assessmentData.cvAssessment).reduce<number>(
      (sum, suggestions: any) => {
        if (Array.isArray(suggestions)) {
          return sum + suggestions.length;
        }
        return sum;
      },
      0
    );
  }, [assessmentData]);

  // Safely access cvData structure
  const safeCvData = cvData || {};
  const safePersonalInfo = safeCvData.personalInfo || {};
  const safeWorkExperience = safeCvData.workExperience || [];
  const safeProjects = safeCvData.projects || [];
  const safeEducation = safeCvData.education || [];
  const safeAwards = safeCvData.awards || [];
  const safeSkills = safeCvData.skills || [];

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-1 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="text-lg font-bold text-gray-900">
              Review Suggestions
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              {totalSuggestions} suggestions remaining
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-sm font-semibold flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={() => onNext(cvData)}
              className="px-6 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284c7] transition-colors font-bold text-sm flex items-center gap-2"
            >
              Choose Template <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Live Resume Editor */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white border-r border-gray-200 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Resume Preview & Editor
            </h2>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              {/* Personal Info Header */}
              <header className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">
                  <EditableField
                    path="personalInfo.name"
                    value={safePersonalInfo.name}
                    suggestion={suggestionMap["personalInfo.name"]}
                    onApprove={handleApprove}
                    onEdit={handleEdit}
                  />
                </h1>
                <h2 className="text-lg font-medium text-blue-600">
                  <EditableField
                    path="personalInfo.title"
                    value={safePersonalInfo.title}
                    suggestion={suggestionMap["personalInfo.title"]}
                    onApprove={handleApprove}
                    onEdit={handleEdit}
                  />
                </h2>
                <div className="text-sm text-gray-600 mt-2 flex justify-center space-x-4 flex-wrap">
                  <span className="flex items-center">
                    <Mail size={14} className="text-gray-400 mr-1" />
                    <EditableField
                      path="personalInfo.email"
                      value={safePersonalInfo.email}
                      suggestion={suggestionMap["personalInfo.email"]}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                    />
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center">
                    <Phone size={14} className="text-gray-400 mr-1" />
                    <EditableField
                      path="personalInfo.phone"
                      value={safePersonalInfo.phone}
                      suggestion={suggestionMap["personalInfo.phone"]}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                    />
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center">
                    <MapPin size={14} className="text-gray-400 mr-1" />
                    <EditableField
                      path="personalInfo.address"
                      value={safePersonalInfo.address}
                      suggestion={suggestionMap["personalInfo.address"]}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                    />
                  </span>
                </div>
                {safePersonalInfo.links && safePersonalInfo.links.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2 flex justify-center space-x-4 flex-wrap">
                    {safePersonalInfo.links.map((link, index) => (
                      <span
                        key={link.id}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        {index > 0 && (
                          <span className="mx-2 text-gray-400">|</span>
                        )}
                        <EditableField
                          path={`personalInfo.links[${index}].label`}
                          value={link.label}
                          suggestion={
                            suggestionMap[`personalInfo.links[${index}].label`]
                          }
                          onApprove={handleApprove}
                          onEdit={handleEdit}
                        />
                        :{" "}
                        <EditableField
                          path={`personalInfo.links[${index}].url`}
                          value={link.url || "(Not provided)"}
                          suggestion={
                            suggestionMap[`personalInfo.links[${index}].url`]
                          }
                          onApprove={handleApprove}
                          onEdit={handleEdit}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <div className="space-y-8">
                {/* Skills Section */}
                <section>
                  <h3 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestionMap["skills"] ? (
                      <EditableField
                        path="skills"
                        value={null}
                        suggestion={suggestionMap["skills"]}
                        onApprove={handleApprove}
                        onEdit={handleEdit}
                      />
                    ) : (
                      safeSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
                        >
                          <EditableField
                            path={`skills[${index}]`}
                            value={skill}
                            suggestion={suggestionMap[`skills[${index}]`]}
                            onApprove={handleApprove}
                            onEdit={handleEdit}
                          />
                        </span>
                      ))
                    )}
                  </div>
                </section>

                {/* Work Experience Section */}
                <section>
                  <h3 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4 flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-500" /> Work
                    Experience
                  </h3>
                  <div className="space-y-6">
                    {safeWorkExperience.map((work, w_idx) => (
                      <div key={work.id}>
                        <h4 className="text-sm font-bold text-gray-900">
                          <EditableField
                            path={`workExperience[${w_idx}].position`}
                            value={work.position}
                            suggestion={
                              suggestionMap[`workExperience[${w_idx}].position`]
                            }
                            onApprove={handleApprove}
                            onEdit={handleEdit}
                          />
                        </h4>
                        <p className="text-sm font-medium text-gray-700 italic">
                          <EditableField
                            path={`workExperience[${w_idx}].company`}
                            value={work.company}
                            suggestion={
                              suggestionMap[`workExperience[${w_idx}].company`]
                            }
                            onApprove={handleApprove}
                            onEdit={handleEdit}
                          />
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          {work.startDate} – {work.endDate}
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                          {work.responsibilities.map((resp, r_idx) => (
                            <li key={r_idx}>
                              <EditableField
                                path={`workExperience[${w_idx}].responsibilities[${r_idx}]`}
                                value={resp}
                                suggestion={
                                  suggestionMap[
                                    `workExperience[${w_idx}].responsibilities[${r_idx}]`
                                  ]
                                }
                                onApprove={handleApprove}
                                onEdit={handleEdit}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Projects Section */}
                <section>
                  <h3 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-gray-500" /> Projects
                  </h3>
                  <div className="space-y-6">
                    {safeProjects.map((project, p_idx) => (
                      <div key={project.id}>
                        <h4 className="text-sm font-bold text-gray-900">
                          <EditableField
                            path={`projects[${p_idx}].title`}
                            value={project.title}
                            suggestion={
                              suggestionMap[`projects[${p_idx}].title`]
                            }
                            onApprove={handleApprove}
                            onEdit={handleEdit}
                          />
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {project.startDate} – {project.endDate}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <EditableField
                            path={`projects[${p_idx}].description`}
                            value={project.description}
                            suggestion={
                              suggestionMap[`projects[${p_idx}].description`]
                            }
                            onApprove={handleApprove}
                            onEdit={handleEdit}
                          />
                        </p>
                        {project.responsibilities &&
                          project.responsibilities.length > 0 && (
                            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                              {project.responsibilities.map((resp, r_idx) => (
                                <li key={r_idx}>
                                  <EditableField
                                    path={`projects[${p_idx}].responsibilities[${r_idx}]`}
                                    value={resp}
                                    suggestion={
                                      suggestionMap[
                                        `projects[${p_idx}].responsibilities[${r_idx}]`
                                      ]
                                    }
                                    onApprove={handleApprove}
                                    onEdit={handleEdit}
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education Section */}
                <section>
                  <h3 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-gray-500" /> Education
                  </h3>
                  {safeEducation.map((edu, e_idx) => (
                    <div key={edu.id} className="mb-4">
                      <h4 className="text-sm font-bold text-gray-900">
                        <EditableField
                          path={`education[${e_idx}].institution`}
                          value={edu.institution}
                          suggestion={
                            suggestionMap[`education[${e_idx}].institution`]
                          }
                          onApprove={handleApprove}
                          onEdit={handleEdit}
                        />
                      </h4>
                      <p className="text-sm font-medium text-gray-700 italic">
                        <EditableField
                          path={`education[${e_idx}].degree`}
                          value={edu.degree}
                          suggestion={
                            suggestionMap[`education[${e_idx}].degree`]
                          }
                          onApprove={handleApprove}
                          onEdit={handleEdit}
                        />
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {edu.startDate} – {edu.endDate} | GPA: {edu.gpa}
                      </p>
                    </div>
                  ))}
                </section>

                {/* Awards Section */}
                <section>
                  <h3 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4 flex items-center gap-2">
                    <Star size={16} className="text-gray-500" /> Awards
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                    {safeAwards.map((award, a_idx) => (
                      <li key={award.id}>
                        <span className="font-semibold">
                          <EditableField
                            path={`awards[${a_idx}].title`}
                            value={award.title}
                            suggestion={suggestionMap[`awards[${a_idx}].title`]}
                            onApprove={handleApprove}
                            onEdit={handleEdit}
                          />
                        </span>{" "}
                        ({award.date}):{" "}
                        <EditableField
                          path={`awards[${a_idx}].description`}
                          value={award.description}
                          suggestion={
                            suggestionMap[`awards[${a_idx}].description`]
                          }
                          onApprove={handleApprove}
                          onEdit={handleEdit}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Suggestions */}
        <div className="w-full md:w-[350px] flex-shrink-0 h-full bg-gray-50 p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            AI Suggestions
          </h2>
          {totalSuggestions === 0 ? (
            <div className="text-center py-8 bg-white border border-gray-200 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <p className="text-gray-600 font-semibold">
                No suggestions. Looks great!
              </p>
            </div>
          ) : (
            assessmentData &&
            assessmentData.cvAssessment &&
            Object.entries(assessmentData.cvAssessment)
              .filter(
                ([, suggestions]: any) =>
                  Array.isArray(suggestions) && suggestions.length > 0
              )
              .map(([aspect, suggestions]: any) => (
                <div key={aspect} className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 capitalize mb-3 border-b border-gray-200 pb-1">
                    {aspect} ({suggestions.length})
                  </h3>
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onApprove={handleApprove}
                        onDismiss={handleDismiss}
                      />
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CV TEMPLATE RENDERER
// ============================================================================

// Helper function to get section order for rendering
const getSectionRenderOrder = (cvData) => {
    return (
        cvData.sectionOrder || [
            "personalInfo",
            "skills",
            "workExperience",
            "education",
            "projects",
            "awards",
        ]
    );
};

// Helper function to render tech stack
const renderTechStack = (techStack, color) => {
    if (!techStack || techStack.length === 0) return null;
    return (
        <div className="mt-2">
            <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack:</p>
            <div className="flex flex-wrap gap-1">
                {techStack.map((tech, idx) => (
                    <span
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${color}15`, color: color }}
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    );
};

const CVTemplateRenderer = ({
    cvData,
    templateId,
    primaryColor = "#0EA5E9", // Using Simplify's primary color
    fontFamily = "font-sans",
}) => {
    const {
        ModernTemplate,
        SidebarTemplate,
        MinimalTemplate,
        ExecutiveTemplate,
        CreativeTemplate,
        TimelineTemplate,
        CompactTemplate,
        AcademicTemplate,
        TechnicalTemplate,
        ElegantTemplate,
    } = {
        ModernTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header
                        key="personalInfo"
                        className="text-center mb-8 pb-6 border-b-2"
                        style={{ borderColor: color }}
                    >
                        <h1 className="text-5xl font-bold mb-2" style={{ color }}>
                            {personalInfo.name}
                        </h1>
                        <p className="text-xl text-gray-700 mb-3">{personalInfo.title}</p>
                        <div className="text-sm text-gray-600 space-x-3">
                            <span>{personalInfo.email}</span>
                            <span>•</span>
                            <span>{personalInfo.phone}</span>
                            <span>•</span>
                            <span>{personalInfo.address}</span>
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section key="skills" className="mb-6">
                        <h2
                            className="text-2xl font-bold mb-3 pb-2 border-b-2"
                            style={{ color, borderColor: color }}
                        >
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded-full text-sm font-medium print-color"
                                    style={{ backgroundColor: `${color}20`, color }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                ),
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-6">
                            <h2
                                className="text-2xl font-bold mb-3 pb-2 border-b-2"
                                style={{ color, borderColor: color }}
                            >
                                Work Experience
                            </h2>
                            {workExperience.map((work) => (
                                <div key={work.id} className="mb-4">
                                    <h3 className="text-lg font-semibold">{work.position}</h3>
                                    <p className="text-md font-medium" style={{ color }}>
                                        {work.company}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {work.startDate} - {work.endDate}
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li key={idx}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-6">
                        <h2
                            className="text-2xl font-bold mb-3 pb-2 border-b-2"
                            style={{ color, borderColor: color }}
                        >
                            Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-4">
                                <h3 className="text-lg font-semibold">{project.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {project.startDate} - {project.endDate}
                                </p>
                                <p className="text-gray-700 mb-2">{project.description}</p>
                                {project.responsibilities &&
                                    project.responsibilities.length > 0 && (
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            {project.responsibilities.map((resp, idx) => (
                                                <li key={idx}>{resp}</li>
                                            ))}
                                        </ul>
                                    )}
                                {renderTechStack(project.techStack, color)}
                            </div>
                        ))}
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section key="education" className="mb-6">
                        <h2
                            className="text-2xl font-bold mb-3 pb-2 border-b-2"
                            style={{ color, borderColor: color }}
                        >
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="text-lg font-semibold">{edu.institution}</h3>
                                <p className="text-md">{edu.degree}</p>
                                <p className="text-sm text-gray-500">
                                    {edu.startDate} - {edu.endDate} | GPA: {edu.gpa}
                                </p>
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-6">
                        <h2
                            className="text-2xl font-bold mb-3 pb-2 border-b-2"
                            style={{ color, borderColor: color }}
                        >
                            Awards
                        </h2>
                        {awards.map((award) => (
                            <div key={award.id} className="mb-2">
                                <span className="font-semibold">{award.title}</span>
                                <span className="text-gray-500"> ({award.date})</span>
                                <p className="text-gray-700 text-sm">{award.description}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            return (
                <div className={`p-8 bg-white ${font}`} style={{ minHeight: "297mm" }}>
                    {sectionOrder.map((sectionKey) => sections[sectionKey])}
                </div>
            );
        },
        SidebarTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            // Sidebar sections (personalInfo, skills, education go in sidebar)
            const sidebarSections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <div key="personalInfo" className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">{personalInfo.name}</h1>
                        <p className="text-lg mb-4 opacity-90">{personalInfo.title}</p>
                        <div className="text-sm space-y-2 opacity-90">
                            <p>{personalInfo.email}</p>
                            <p>{personalInfo.phone}</p>
                            <p>{personalInfo.address}</p>
                        </div>
                    </div>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <div key="skills" className="mb-6">
                        <h2 className="text-xl font-bold mb-3 pb-2 border-b border-white border-opacity-30">
                            Skills
                        </h2>
                        <div className="space-y-2">
                            {skills.map((skill, idx) => (
                                <div key={idx} className="text-sm py-1">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <div key="education" className="mb-6">
                        <h2 className="text-xl font-bold mb-3 pb-2 border-b border-white border-opacity-30">
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3 text-sm">
                                <p className="font-semibold">{edu.degree}</p>
                                <p className="opacity-90">{edu.institution}</p>
                                <p className="text-xs opacity-80">
                                    {edu.startDate} - {edu.endDate}
                                </p>
                                <p className="text-xs opacity-90">GPA: {edu.gpa}</p>
                            </div>
                        ))}
                    </div>
                ),
            };

            // Main content sections (workExperience, projects, awards)
            const mainSections = {
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-6">
                            <h2
                                className="text-2xl font-bold mb-4 pb-2 border-b-2"
                                style={{ color, borderColor: color }}
                            >
                                Work Experience
                            </h2>
                            {workExperience.map((work) => (
                                <div key={work.id} className="mb-5">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {work.position}
                                    </h3>
                                    <p className="text-md font-medium" style={{ color }}>
                                        {work.company}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {work.startDate} - {work.endDate}
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li key={idx}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-6">
                        <h2
                            className="text-2xl font-bold mb-4 pb-2 border-b-2"
                            style={{ color, borderColor: color }}
                        >
                            Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-5">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {project.startDate} - {project.endDate}
                                </p>
                                <p className="text-gray-700 mb-2">{project.description}</p>
                                {project.responsibilities &&
                                    project.responsibilities.length > 0 && (
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            {project.responsibilities.map((resp, idx) => (
                                                <li key={idx}>{resp}</li>
                                            ))}
                                        </ul>
                                    )}
                                {renderTechStack(project.techStack, color)}
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-6">
                        <h2
                            className="text-2xl font-bold mb-4 pb-2 border-b-2"
                            style={{ color, borderColor: color }}
                        >
                            Awards
                        </h2>
                        {awards.map((award) => (
                            <div key={award.id} className="mb-3">
                                <span className="font-semibold text-gray-900">
                                    {award.title}
                                </span>
                                <span className="text-gray-500"> ({award.date})</span>
                                <p className="text-gray-700 text-sm">{award.description}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            const sidebarKeys = ["personalInfo", "skills", "education"];
            const mainKeys = ["workExperience", "projects", "awards"];

            return (
                <div className={`flex ${font}`} style={{ minHeight: "297mm" }}>
                    <div
                        className="w-1/3 p-6 text-white print-bg"
                        style={{ backgroundColor: color }}
                    >
                        {sectionOrder
                            .filter((key) => sidebarKeys.includes(key))
                            .map((key) => sidebarSections[key])}
                    </div>

                    <div className="w-2/3 p-8 bg-white">
                        {sectionOrder
                            .filter((key) => mainKeys.includes(key))
                            .map((key) => mainSections[key])}
                    </div>
                </div>
            );
        },
        MinimalTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header key="personalInfo" className="mb-8">
                        <h1 className="text-6xl font-light mb-1" style={{ color }}>
                            {personalInfo.name}
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">{personalInfo.title}</p>
                        <div className="text-sm text-gray-500 flex gap-4">
                            <span>{personalInfo.email}</span>
                            <span>{personalInfo.phone}</span>
                            <span>{personalInfo.address}</span>
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section key="skills" className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4"
                            style={{ color }}
                        >
                            Skills
                        </h2>
                        <p className="text-gray-700">{skills.join(" • ")}</p>
                    </section>
                ),
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-8">
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-4"
                                style={{ color }}
                            >
                                Experience
                            </h2>
                            {workExperience.map((work) => (
                                <div key={work.id} className="mb-5">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-semibold">{work.position}</h3>
                                        <span className="text-sm text-gray-500">
                                            {work.startDate} - {work.endDate}
                                        </span>
                                    </div>
                                    <p className="text-md text-gray-700 mb-2">{work.company}</p>
                                    <ul className="list-none text-gray-600 space-y-1 text-sm">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li key={idx}>• {resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4"
                            style={{ color }}
                        >
                            Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-5">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-semibold">{project.title}</h3>
                                    <span className="text-sm text-gray-500">
                                        {project.startDate} - {project.endDate}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                    {project.description}
                                </p>
                                {project.responsibilities &&
                                    project.responsibilities.length > 0 && (
                                        <ul className="list-none text-gray-600 space-y-1 text-sm">
                                            {project.responsibilities.map((resp, idx) => (
                                                <li key={idx}>• {resp}</li>
                                            ))}
                                        </ul>
                                    )}
                                {renderTechStack(project.techStack, color)}
                            </div>
                        ))}
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section key="education" className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4"
                            style={{ color }}
                        >
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="text-lg font-semibold">{edu.degree}</h3>
                                        <p className="text-md text-gray-700">{edu.institution}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4"
                            style={{ color }}
                        >
                            Awards
                        </h2>
                        {awards.map((award) => (
                            <div key={award.id} className="mb-2">
                                <span className="font-semibold">{award.title}</span>
                                <span className="text-gray-500 text-sm"> — {award.date}</span>
                                <p className="text-gray-600 text-sm">{award.description}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            return (
                <div className={`p-12 bg-white ${font}`} style={{ minHeight: "297mm" }}>
                    {sectionOrder.map((sectionKey) => sections[sectionKey])}
                </div>
            );
        },
        ExecutiveTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header
                        key="personalInfo"
                        className="text-center mb-6 pb-4 border-b-4 border-gray-800"
                    >
                        <h1
                            className="text-4xl font-bold mb-1 tracking-wide uppercase"
                            style={{ color }}
                        >
                            {personalInfo.name}
                        </h1>
                        <p className="text-lg text-gray-700 mb-2">{personalInfo.title}</p>
                        <div className="text-xs text-gray-600 space-x-3">
                            <span>{personalInfo.email}</span>
                            <span>|</span>
                            <span>{personalInfo.phone}</span>
                            <span>|</span>
                            <span>{personalInfo.address}</span>
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section key="skills" className="mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
                            Core Skills
                        </h2>
                        <div className="space-y-1">
                            {skills.map((skill, idx) => (
                                <div key={idx} className="text-sm text-gray-700">
                                    • {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                ),
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-6">
                            <h2 className="text-xl font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
                                Professional Experience
                            </h2>
                            {workExperience.map((work) => (
                                <div key={work.id} className="mb-4">
                                    <h3 className="text-md font-bold">{work.position}</h3>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {work.company} | {work.startDate} - {work.endDate}
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-2">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li key={idx}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
                            Key Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-4">
                                <h3 className="text-md font-bold">{project.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {project.startDate} - {project.endDate}
                                </p>
                                <p className="text-gray-700 text-sm mt-1">
                                    {project.description}
                                </p>
                                {project.responsibilities &&
                                    project.responsibilities.length > 0 && (
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-1">
                                            {project.responsibilities.map((resp, idx) => (
                                                <li key={idx}>{resp}</li>
                                            ))}
                                        </ul>
                                    )}
                                {renderTechStack(project.techStack, color)}
                            </div>
                        ))}
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section key="education" className="mb-6">
                        <h2 className="text-lg font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3 text-sm">
                                <p className="font-bold">{edu.degree}</p>
                                <p className="text-gray-700">{edu.institution}</p>
                                <p className="text-gray-600 text-xs">
                                    {edu.startDate} - {edu.endDate}
                                </p>
                                <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-6">
                        <h2 className="text-lg font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
                            Honors
                        </h2>
                        {awards.map((award) => (
                            <div key={award.id} className="mb-2 text-sm">
                                <p className="font-semibold">{award.title}</p>
                                <p className="text-gray-600 text-xs">{award.date}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            return (
                <div className={`p-8 bg-white ${font}`} style={{ minHeight: "297mm" }}>
                    {sectionOrder.map((sectionKey) => sections[sectionKey])}
                </div>
            );
        },
        CreativeTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header
                        key="personalInfo"
                        className="p-8 text-white print-bg"
                        style={{ backgroundColor: color }}
                    >
                        <h1 className="text-5xl font-bold mb-2">{personalInfo.name}</h1>
                        <p className="text-2xl mb-4 opacity-90">{personalInfo.title}</p>
                        <div className="text-sm opacity-80 space-x-3">
                            <span>{personalInfo.email}</span>
                            <span>•</span>
                            <span>{personalInfo.phone}</span>
                            <span>•</span>
                            <span>{personalInfo.address}</span>
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section key="skills" className="mb-6">
                        <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                            Skills & Expertise
                        </h2>
                        <div className="grid grid-cols-3 gap-2">
                            {skills.map((skill, idx) => (
                                <div
                                    key={idx}
                                    className="p-2 border-l-4 text-sm font-medium print-color"
                                    style={{ borderColor: color }}
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                ),
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-6">
                            <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                                Experience
                            </h2>
                            {workExperience.map((work) => (
                                <div
                                    key={work.id}
                                    className="mb-5 border-l-4 pl-4 print-color"
                                    style={{ borderColor: color }}
                                >
                                    <h3 className="text-xl font-bold">{work.position}</h3>
                                    <p className="text-lg font-semibold text-gray-700">
                                        {work.company}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {work.startDate} - {work.endDate}
                                    </p>
                                    <ul className="list-none text-gray-700 space-y-1">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li
                                                key={idx}
                                                className="before:content-['▸'] before:mr-2 print-color"
                                                style={{ color }}
                                            >
                                                {resp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-6">
                        <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                            Featured Projects
                        </h2>
                        <div className="grid gap-4">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-4 border-2 rounded-lg print-color"
                                    style={{ borderColor: `${color}40` }}
                                >
                                    <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {project.startDate} - {project.endDate}
                                    </p>
                                    <p className="text-gray-700 mb-2">{project.description}</p>
                                    {project.responsibilities &&
                                        project.responsibilities.length > 0 && (
                                            <ul className="list-none text-gray-700 space-y-1 text-sm">
                                                {project.responsibilities.map((resp, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="before:content-['▸'] before:mr-2 print-color"
                                                        style={{ color }}
                                                    >
                                                        {resp}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    {renderTechStack(project.techStack, color)}
                                </div>
                            ))}
                        </div>
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section key="education" className="mb-6">
                        <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="text-lg font-bold">{edu.degree}</h3>
                                <p className="text-md text-gray-700">{edu.institution}</p>
                                <p className="text-sm text-gray-500">
                                    {edu.startDate} - {edu.endDate} | GPA: {edu.gpa}
                                </p>
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-6">
                        <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                            Awards & Recognition
                        </h2>
                        {awards.map((award) => (
                            <div key={award.id} className="mb-3">
                                <p className="font-bold">{award.title}</p>
                                <p className="text-sm text-gray-500">{award.date}</p>
                                <p className="text-sm text-gray-700">{award.description}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            const mainSections = sectionOrder.filter((key) => key !== "personalInfo");

            return (
                <div className={`${font}`} style={{ minHeight: "297mm" }}>
                    {sections.personalInfo}
                    <div className="p-8 bg-white">
                        {mainSections.map((sectionKey) => sections[sectionKey])}
                    </div>
                </div>
            );
        },
        TimelineTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header key="personalInfo" className="mb-8">
                        <h1 className="text-5xl font-bold mb-2" style={{ color }}>
                            {personalInfo.name}
                        </h1>
                        <p className="text-xl text-gray-700 mb-3">{personalInfo.title}</p>
                        <div className="text-sm text-gray-600 space-x-3">
                            <span>{personalInfo.email}</span>
                            <span>•</span>
                            <span>{personalInfo.phone}</span>
                            <span>•</span>
                            <span>{personalInfo.address}</span>
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section key="skills" className="mb-8">
                        <h2 className="text-2xl font-bold mb-3" style={{ color }}>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                ),
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-8">
                            <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                                Career Timeline
                            </h2>
                            <div
                                className="border-l-4 pl-6 space-y-6 print-color"
                                style={{ borderColor: color }}
                            >
                                {workExperience.map((work, idx) => (
                                    <div key={work.id} className="relative">
                                        <div
                                            className="absolute -left-9 w-5 h-5 rounded-full border-4 bg-white print-color"
                                            style={{ borderColor: color }}
                                        ></div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-bold">{work.position}</h3>
                                            <p
                                                className="text-md font-semibold print-color"
                                                style={{ color }}
                                            >
                                                {work.company}
                                            </p>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {work.startDate} - {work.endDate}
                                            </p>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                {work.responsibilities.map((resp, idx) => (
                                                    <li key={idx}>{resp}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-8">
                        <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                            Projects Timeline
                        </h2>
                        <div
                            className="border-l-4 pl-6 space-y-6 print-color"
                            style={{ borderColor: color }}
                        >
                            {projects.map((project) => (
                                <div key={project.id} className="relative">
                                    <div
                                        className="absolute -left-9 w-5 h-5 rounded-full border-4 bg-white print-color"
                                        style={{ borderColor: color }}
                                    ></div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-bold">{project.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {project.startDate} - {project.endDate}
                                        </p>
                                        <p className="text-gray-700 mb-2">{project.description}</p>
                                        {project.responsibilities &&
                                            project.responsibilities.length > 0 && (
                                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                    {project.responsibilities.map((resp, idx) => (
                                                        <li key={idx}>{resp}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        {renderTechStack(project.techStack, color)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section key="education" className="mb-6">
                        <h2 className="text-xl font-bold mb-3" style={{ color }}>
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                                <h3 className="font-bold">{edu.degree}</h3>
                                <p className="text-sm text-gray-700">{edu.institution}</p>
                                <p className="text-xs text-gray-500">
                                    {edu.startDate} - {edu.endDate}
                                </p>
                                <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-6">
                        <h2 className="text-xl font-bold mb-3" style={{ color }}>
                            Awards
                        </h2>
                        {awards.map((award) => (
                            <div key={award.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                                <p className="font-bold text-sm">{award.title}</p>
                                <p className="text-xs text-gray-500">{award.date}</p>
                                <p className="text-xs text-gray-700">{award.description}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            return (
                <div className={`p-8 bg-white ${font}`} style={{ minHeight: "297mm" }}>
                    {sectionOrder.map((sectionKey) => sections[sectionKey])}
                </div>
            );
        },
        CompactTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sidebarSections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header
                        key="personalInfo"
                        className="mb-4 pb-3 border-b-2"
                        style={{ borderColor: color }}
                    >
                        <h1 className="text-3xl font-bold" style={{ color }}>
                            {personalInfo.name}
                        </h1>
                        <p className="text-md text-gray-700">{personalInfo.title}</p>
                        <div className="text-xs text-gray-600 mt-1">
                            {personalInfo.email} | {personalInfo.phone} |{" "}
                            {personalInfo.address}
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section key="skills" className="mb-4">
                        <h2 className="text-lg font-bold mb-2" style={{ color }}>
                            Skills
                        </h2>
                        <div className="space-y-1">
                            {skills.map((skill, idx) => (
                                <div key={idx} className="text-xs">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section key="education" className="mb-4">
                        <h2 className="text-lg font-bold mb-2" style={{ color }}>
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-2">
                                <p className="font-bold text-xs">{edu.degree}</p>
                                <p className="text-xs text-gray-700">{edu.institution}</p>
                                <p className="text-xs text-gray-500">
                                    {edu.startDate} - {edu.endDate}
                                </p>
                                <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            const mainSections = {
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-4">
                            <h2 className="text-lg font-bold mb-2" style={{ color }}>
                                Experience
                            </h2>
                            {workExperience.map((work) => (
                                <div key={work.id} className="mb-3">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold">{work.position}</h3>
                                        <span className="text-xs text-gray-500">
                                            {work.startDate} - {work.endDate}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700">
                                        {work.company}
                                    </p>
                                    <ul className="list-disc list-inside text-xs space-y-0.5 mt-1">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li key={idx}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-4">
                        <h2 className="text-lg font-bold mb-2" style={{ color }}>
                            Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-3">
                                <div className="flex justify-between">
                                    <h3 className="font-bold">{project.title}</h3>
                                    <span className="text-xs text-gray-500">
                                        {project.startDate} - {project.endDate}
                                    </span>
                                </div>
                                <p className="text-xs mt-1">{project.description}</p>
                                {renderTechStack(project.techStack, color)}
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-4">
                        <h2 className="text-lg font-bold mb-2" style={{ color }}>
                            Awards
                        </h2>
                        <div className="space-y-1">
                            {awards.map((award) => (
                                <div key={award.id}>
                                    <span className="font-bold text-xs">{award.title}</span>
                                    <span className="text-xs text-gray-500"> ({award.date})</span>
                                </div>
                            ))}
                        </div>
                    </section>
                ),
            };

            const sidebarKeys = ["personalInfo", "skills", "education"];
            const mainKeys = ["workExperience", "projects", "awards"];

            return (
                <div
                    className={`p-6 bg-white ${font} text-sm`}
                    style={{ minHeight: "297mm" }}
                >
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            {sectionOrder
                                .filter((key) => sidebarKeys.includes(key))
                                .map((key) => sidebarSections[key])}
                        </div>
                        <div className="col-span-3">
                            {sectionOrder
                                .filter((key) => mainKeys.includes(key))
                                .map((key) => mainSections[key])}
                        </div>
                    </div>
                </div>
            );
        },
        AcademicTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header
                        key="personalInfo"
                        className="text-center mb-6 pb-4 border-b border-gray-400"
                    >
                        <h1 className="text-4xl font-bold mb-2">{personalInfo.name}</h1>
                        <p className="text-lg text-gray-700 mb-2">{personalInfo.title}</p>
                        <div className="text-sm text-gray-600">
                            {personalInfo.email} • {personalInfo.phone} •{" "}
                            {personalInfo.address}
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section key="skills" className="mb-6">
                        <h2 className="text-xl font-bold mb-3 uppercase">
                            Skills & Competencies
                        </h2>
                        <p className="text-gray-700">{skills.join(", ")}</p>
                    </section>
                ),
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-6">
                            <h2 className="text-xl font-bold mb-3 uppercase">Experience</h2>
                            {workExperience.map((work) => (
                                <div key={work.id} className="mb-4">
                                    <div className="flex justify-between mb-1">
                                        <h3 className="text-lg font-semibold">{work.position}</h3>
                                        <span className="text-sm text-gray-600">
                                            {work.startDate} - {work.endDate}
                                        </span>
                                    </div>
                                    <p className="text-md text-gray-700 italic mb-2">
                                        {work.company}
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li key={idx}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-6">
                        <h2 className="text-xl font-bold mb-3 uppercase">
                            Research & Projects
                        </h2>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <h3 className="text-lg font-semibold">{project.title}</h3>
                                    <span className="text-sm text-gray-600">
                                        {project.startDate} - {project.endDate}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-2">{project.description}</p>
                                {renderTechStack(project.techStack, color)}
                            </div>
                        ))}
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section key="education" className="mb-6">
                        <h2 className="text-xl font-bold mb-3 uppercase">Education</h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">{edu.degree}</h3>
                                        <p className="text-md text-gray-700">{edu.institution}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            {edu.startDate} - {edu.endDate}
                                        </p>
                                        <p className="text-sm font-semibold">GPA: {edu.gpa}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-6">
                        <h2 className="text-xl font-bold mb-3 uppercase">
                            Honors & Awards
                        </h2>
                        {awards.map((award) => (
                            <div key={award.id} className="mb-2">
                                <p className="font-semibold">
                                    {award.title}{" "}
                                    <span className="text-gray-600 font-normal">
                                        ({award.date})
                                    </span>
                                </p>
                                <p className="text-gray-700 text-sm">{award.description}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            return (
                <div className={`p-10 bg-white ${font}`} style={{ minHeight: "297mm" }}>
                    {sectionOrder.map((sectionKey) => sections[sectionKey])}
                </div>
            );
        },
        TechnicalTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header
                        key="personalInfo"
                        className="bg-white p-6 rounded-lg shadow-sm mb-6"
                    >
                        <h1 className="text-4xl font-bold mb-2" style={{ color }}>
                            {personalInfo.name}
                        </h1>
                        <p className="text-xl text-gray-700 mb-3">{personalInfo.title}</p>
                        <div className="text-sm text-gray-600 font-mono">
                            <span className="mr-4">📧 {personalInfo.email}</span>
                            <span className="mr-4">📱 {personalInfo.phone}</span>
                            <span>📍 {personalInfo.address}</span>
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section
                        key="skills"
                        className="bg-white p-6 rounded-lg shadow-sm mb-6"
                    >
                        <h2 className="text-2xl font-bold mb-4 font-mono" style={{ color }}>
                            // Technical Skills
                        </h2>
                        <div className="grid grid-cols-4 gap-2">
                            {skills.map((skill, idx) => (
                                <div
                                    key={idx}
                                    className="px-3 py-2 bg-gray-100 rounded font-mono text-xs border-l-2 print-color"
                                    style={{ borderColor: color }}
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                ),
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section
                            key="workExperience"
                            className="bg-white p-6 rounded-lg shadow-sm mb-6"
                        >
                            <h2
                                className="text-2xl font-bold mb-4 font-mono"
                                style={{ color }}
                            >
                                // Work Experience
                            </h2>
                            {workExperience.map((work) => (
                                <div
                                    key={work.id}
                                    className="mb-5 pb-5 border-b border-gray-200 last:border-0"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold">{work.position}</h3>
                                            <p className="text-md font-semibold text-gray-700">
                                                {work.company}
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-500 font-mono">
                                            {work.startDate} - {work.endDate}
                                        </span>
                                    </div>
                                    <ul className="space-y-1">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li key={idx} className="text-sm text-gray-700">
                                                <span className="font-mono mr-2" style={{ color }}>
                                                    ›
                                                </span>
                                                {resp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section
                        key="projects"
                        className="bg-white p-6 rounded-lg shadow-sm mb-6"
                    >
                        <h2 className="text-2xl font-bold mb-4 font-mono" style={{ color }}>
                            // Projects
                        </h2>
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="mb-5 pb-5 border-b border-gray-200 last:border-0"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold font-mono">
                                        {project.title}
                                    </h3>
                                    <span className="text-sm text-gray-500 font-mono">
                                        {project.startDate} - {project.endDate}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-3">{project.description}</p>
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.techStack.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-gray-800 text-white text-xs rounded font-mono"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section
                        key="education"
                        className="bg-white p-6 rounded-lg shadow-sm mb-6"
                    >
                        <h2 className="text-xl font-bold mb-3 font-mono" style={{ color }}>
                            // Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="font-bold">{edu.degree}</h3>
                                <p className="text-sm text-gray-700">{edu.institution}</p>
                                <p className="text-xs text-gray-500 font-mono">
                                    {edu.startDate} - {edu.endDate}
                                </p>
                                <p className="text-xs text-gray-600 font-mono">
                                    GPA: {edu.gpa}
                                </p>
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section
                        key="awards"
                        className="bg-white p-6 rounded-lg shadow-sm mb-6"
                    >
                        <h2 className="text-xl font-bold mb-3 font-mono" style={{ color }}>
                            // Awards
                        </h2>
                        {awards.map((award) => (
                            <div key={award.id} className="mb-3">
                                <p className="font-bold text-sm">{award.title}</p>
                                <p className="text-xs text-gray-500 font-mono">{award.date}</p>
                            </div>
                        ))}
                    </section>
                ),
            };

            return (
                <div
                    className={`p-8 bg-gray-50 ${font}`}
                    style={{ minHeight: "297mm" }}
                >
                    {sectionOrder.map((sectionKey) => sections[sectionKey])}
                </div>
            );
        },
        ElegantTemplate: ({ cvData, color, font }) => {
            const {
                personalInfo,
                skills,
                workExperience,
                education,
                projects,
                awards,
                sectionVisibility,
            } = cvData;
            const sectionOrder = getSectionRenderOrder(cvData);

            const sections = {
                personalInfo: sectionVisibility.personalInfo && (
                    <header key="personalInfo" className="text-center mb-8">
                        <h1 className="text-5xl font-serif mb-3" style={{ color }}>
                            {personalInfo.name}
                        </h1>
                        <div
                            className="w-24 h-1 mx-auto mb-4"
                            style={{ backgroundColor: color }}
                        ></div>
                        <p className="text-xl text-gray-700 mb-3 italic">
                            {personalInfo.title}
                        </p>
                        <div className="text-sm text-gray-600">
                            {personalInfo.email} · {personalInfo.phone} ·{" "}
                            {personalInfo.address}
                        </div>
                    </header>
                ),
                skills: sectionVisibility.skills && skills.length > 0 && (
                    <section key="skills" className="mb-6">
                        <div className="text-center mb-3">
                            <h2
                                className="text-xl font-serif inline-block px-4 py-1"
                                style={{ color, borderBottom: `2px solid ${color}` }}
                            >
                                Skills
                            </h2>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700">{skills.join(" · ")}</p>
                        </div>
                    </section>
                ),
                workExperience: sectionVisibility.workExperience &&
                    workExperience.length > 0 && (
                        <section key="workExperience" className="mb-8">
                            <div className="text-center mb-4">
                                <h2
                                    className="text-2xl font-serif inline-block px-6 py-2"
                                    style={{ color, borderBottom: `2px solid ${color}` }}
                                >
                                    Professional Experience
                                </h2>
                            </div>
                            {workExperience.map((work) => (
                                <div key={work.id} className="mb-5">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-semibold">{work.position}</h3>
                                        <span className="text-sm text-gray-500 italic">
                                            {work.startDate} - {work.endDate}
                                        </span>
                                    </div>
                                    <p className="text-md text-gray-700 mb-2 italic">
                                        {work.company}
                                    </p>
                                    <ul className="list-none text-gray-700 space-y-1 pl-4">
                                        {work.responsibilities.map((resp, idx) => (
                                            <li
                                                key={idx}
                                                className="relative before:content-['◆'] before:absolute before:-left-4 before:text-xs print-color"
                                                style={{ color }}
                                            >
                                                {resp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    ),
                projects: sectionVisibility.projects && projects.length > 0 && (
                    <section key="projects" className="mb-8">
                        <div className="text-center mb-4">
                            <h2
                                className="text-2xl font-serif inline-block px-6 py-2"
                                style={{ color, borderBottom: `2px solid ${color}` }}
                            >
                                Notable Projects
                            </h2>
                        </div>
                        {projects.map((project) => (
                            <div key={project.id} className="mb-5">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-semibold">{project.title}</h3>
                                    <span className="text-sm text-gray-500 italic">
                                        {project.startDate} - {project.endDate}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-2">{project.description}</p>
                                {renderTechStack(project.techStack, color)}
                            </div>
                        ))}
                    </section>
                ),
                education: sectionVisibility.education && education.length > 0 && (
                    <section key="education" className="mb-6">
                        <div className="text-center mb-3">
                            <h2
                                className="text-xl font-serif inline-block px-4 py-1"
                                style={{ color, borderBottom: `2px solid ${color}` }}
                            >
                                Education
                            </h2>
                        </div>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3 text-center">
                                <h3 className="font-semibold">{edu.degree}</h3>
                                <p className="text-sm text-gray-700 italic">
                                    {edu.institution}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {edu.startDate} - {edu.endDate}
                                </p>
                                <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                            </div>
                        ))}
                    </section>
                ),
                awards: sectionVisibility.awards && awards.length > 0 && (
                    <section key="awards" className="mb-6">
                        <div className="text-center mb-3">
                            <h2
                                className="text-xl font-serif inline-block px-4 py-1"
                                style={{ color, borderBottom: `2px solid ${color}` }}
                            >
                                Honors & Awards
                            </h2>
                        </div>
                        <div className="text-center">
                            {awards.map((award) => (
                                <div key={award.id} className="mb-2">
                                    <span className="font-semibold">{award.title}</span>
                                    <span className="text-gray-500 text-sm italic">
                                        {" "}
                                        — {award.date}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                ),
            };

            return (
                <div className={`p-10 bg-white ${font}`} style={{ minHeight: "297mm" }}>
                    {sectionOrder.map((sectionKey) => sections[sectionKey])}
                </div>
            );
        },
    };

    const templates = {
        modern: ModernTemplate,
        sidebar: SidebarTemplate,
        minimal: MinimalTemplate,
        executive: ExecutiveTemplate,
        creative: CreativeTemplate,
        timeline: TimelineTemplate,
        compact: CompactTemplate,
        academic: AcademicTemplate,
        technical: TechnicalTemplate,
        elegant: ElegantTemplate,
    };

    const Template = templates[templateId] || ModernTemplate;
    return <Template cvData={cvData} color={primaryColor} font={fontFamily} />;
};
// ============================================================================
// STEP 4: TEMPLATE SELECTION WITH PREVIEW
// ============================================================================

const TemplateSelectionStep = ({ cvData, onNext, onBack, onCancel }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [hoveredTemplate, setHoveredTemplate] = useState(null);

    // [Business Logic for safeCvData and previewData remains unchanged]
    const safeCvData = {
        personalInfo: cvData?.personalInfo || {
            name: "", title: "", email: "", phone: "", address: "",
        },
        skills: cvData?.skills || [],
        workExperience: cvData?.workExperience || [],
        education: cvData?.education || [],
        projects: cvData?.projects || [],
        awards: cvData?.awards || [],
        sectionVisibility: cvData?.sectionVisibility || {
            personalInfo: true, skills: true, workExperience: true, education: true, projects: true, awards: true,
        },
        sectionOrder: cvData?.sectionOrder || [
            "personalInfo", "skills", "workExperience", "education", "projects", "awards",
        ],
    };

    const previewData = {
        ...safeCvData,
        personalInfo: {
            ...safeCvData.personalInfo,
            name: "Henry User",
            title: "Software Engineer",
        },
        skills: safeCvData.skills.slice(0, 6).length > 0 ? safeCvData.skills.slice(0, 6) : ["Python", "React", "SQL"],
        workExperience: safeCvData.workExperience.slice(0, 1).length > 0 ? safeCvData.workExperience.slice(0, 1) : [{ id: 1, position: "SDE II", company: "Orbitz", startDate: "Jan 2024", endDate: "Jan 2025", responsibilities: ["Developed scalable APIs..."] }],
        education: safeCvData.education.slice(0, 1).length > 0 ? safeCvData.education.slice(0, 1) : [{ id: 1, institution: "Aalborg University", degree: "Master's", startDate: "2020", endDate: "2025", gpa: "4.0" }],
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
                            <ArrowRight size={14} className="rotate-180"/> Back to Documents
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
                        Select a recruiter-approved template that best highlights your experience.
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
                                ${selectedTemplate === template.id
                                    ? `ring-4 ring-[#0EA5E9]/50 border-[#0EA5E9] shadow-xl`
                                    : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                                }`}
                        >
                            {/* KHUNG PREVIEW TƯƠNG TÁC */}
                            <div 
                                className="h-80 flex items-center justify-center relative bg-gray-100 overflow-hidden"
                            >
                                {/* KHUNG CHỨA MẪU CV (A4 aspect ratio) */}
                                <div 
                                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                                >
                                    {/* MẪU CV THỰC TẾ */}
                                    <div 
                                        className="bg-white shadow-2xl transition-all duration-300"
                                        style={{
                                            // Tỷ lệ A4 (210/297 = 0.707)
                                            width: '80%', 
                                            paddingBottom: `${80 / 0.707}%`, 
                                            position: 'absolute',
                                            // Scale and Hover/Selected effect
                                            transform: `scale(0.8) translate(-50%, -50%)`, // Vị trí mặc định (scale 0.8)
                                            top: '50%',
                                            left: '50%',
                                            height: 'auto',
                                        }}
                                    >
                                        {/* Container bên trong để áp dụng scale nhỏ cho nội dung CVTemplateRenderer */}
                                        <div 
                                            className="absolute top-0 left-0 w-[210mm] h-[297mm] transform origin-top-left"
                                            style={{
                                                transform: 'scale(0.5)', 
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
                                        ${selectedTemplate === template.id
                                            ? 'bg-black/10' // Màu nền nhẹ khi được chọn
                                            : 'group-hover:bg-black/10' // Màu nền nhẹ khi hover
                                        }
                                    `}
                                >
                                    {/* Template Info - Đưa vào góc dưới trái */}
                                    <div className={`p-3 rounded-lg backdrop-blur-sm transition-opacity duration-200 
                                            ${selectedTemplate === template.id ? 'bg-white/90 shadow-lg' : 'bg-white/80'}
                                    `}>
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
                                            <span className="text-xs text-gray-500">Accent Color</span>
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
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${selectedTemplate ? 'bg-[#0EA5E9] text-white' : 'bg-gray-100 text-gray-500'}`}>
                             {selectedTemplate ? <Check size={16}/> : <FileText size={16}/>}
                         </div>
                         <p className="text-sm text-gray-700">
                             {selectedTemplate 
                                ? `Template selected: ${cvTemplates.find(t => t.id === selectedTemplate)?.name}`
                                : "Please select a template to continue."
                             }
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
// ============================================================================
// STEP 5: EDIT TEMPLATE
// ============================================================================
const EditTemplateStep = ({
  cvData: initialData,
  templateId,
  onNext,
  onBack,
  onCancel,
}) => {
  // GIẢ ĐỊNH: Các hàm, constants, và components khác (như useState, set, useRef, useReactToPrint, cvTemplates, colorPresets, lucide icons) đã được định nghĩa và có thể truy cập được.

  const [cvData, setCvData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(true);
  const [primaryColor, setPrimaryColor] = useState(
    cvTemplates.find((t) => t.id === templateId)?.color || "#0EA5E9" // Changed default color to Simplify primary
  );
  const [fontFamily, setFontFamily] = useState("font-sans");
  const [showCustomization, setShowCustomization] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const cvRef = useRef(null);

  // --- CORE LOGIC FUNCTIONS (GIỮ NGUYÊN 100% LOGIC VÀ SIGNATURE) ---

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
  
  // HÀM BỔ SUNG để sử dụng nút Up/Down cho Section Order (thay thế UI D&D)
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
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
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
                <LayoutTemplate size={14} className="inline mr-1" /> Change Template
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
                          <span className="font-bold text-gray-500 text-xs w-4">{index + 1}.</span>
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
                                    className={`p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${index === 0 ? 'text-gray-300' : 'hover:text-[#0EA5E9]'}`}
                                    title="Move Up"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                {/* Move Down */}
                                <button
                                    onClick={() => handleMoveSection(index, 1)}
                                    disabled={index === cvData.sectionOrder.length - 1}
                                    className={`p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${index === cvData.sectionOrder.length - 1 ? 'text-gray-300' : 'hover:text-[#0EA5E9]'}`}
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
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.name}
                      onChange={(e) => handleFieldChange("personalInfo.name", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.title}
                      onChange={(e) => handleFieldChange("personalInfo.title", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                      <input
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => handleFieldChange("personalInfo.email", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                      <input
                        type="tel"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => handleFieldChange("personalInfo.phone", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.address}
                      onChange={(e) => handleFieldChange("personalInfo.address", e.target.value)}
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
                          onChange={(e) => handleFieldChange(`skills[${index}]`, e.target.value)}
                          className="bg-transparent border-none focus:outline-none w-auto max-w-[100px] text-sm font-medium"
                        />
                        <button
                          onClick={() => {
                            const newSkills = cvData.skills.filter((_, i) => i !== index);
                            setCvData((prev) => ({ ...prev, skills: newSkills }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setCvData((prev) => ({ ...prev, skills: [...prev.skills, "New Skill"] }))}
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
                          {idx > 0 && (<button onClick={() => moveItemInArray("workExperience", idx, idx - 1)} className="hover:text-[#0EA5E9]" title="Move up"><ChevronUp size={16} /></button>)}
                          {idx < cvData.workExperience.length - 1 && (<button onClick={() => moveItemInArray("workExperience", idx, idx + 1)} className="hover:text-[#0EA5E9]" title="Move down"><ChevronDown size={16} /></button>)}
                          <button onClick={() => removeItem("workExperience", work.id)} className="text-red-500 hover:text-red-700" title="Remove"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <input
                          type="text" value={work.position} placeholder="Position"
                          onChange={(e) => handleFieldChange(`workExperience[${idx}].position`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text" value={work.company} placeholder="Company"
                          onChange={(e) => handleFieldChange(`workExperience[${idx}].company`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text" value={work.startDate} placeholder="Start Date"
                            onChange={(e) => handleFieldChange(`workExperience[${idx}].startDate`, e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text" value={work.endDate} placeholder="End Date"
                            onChange={(e) => handleFieldChange(`workExperience[${idx}].endDate`, e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        {work.responsibilities.map((resp, rIdx) => (
                          <div key={rIdx} className="flex gap-2 items-start">
                            <textarea
                              value={resp} placeholder="Responsibility"
                              onChange={(e) => handleFieldChange(`workExperience[${idx}].responsibilities[${rIdx}]`, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={2}
                            />
                            <button
                              onClick={() => {
                                const newResp = work.responsibilities.filter((_, i) => i !== rIdx);
                                handleFieldChange(`workExperience[${idx}].responsibilities`, newResp);
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
                            handleFieldChange(`workExperience[${idx}].responsibilities`, newResp);
                          }}
                          className="text-sm text-[#0EA5E9] font-bold hover:underline flex items-center"
                        >
                          <Plus size={16} className="inline mr-1" /> Add Bullet Point
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
                          {idx > 0 && (<button onClick={() => moveItemInArray("education", idx, idx - 1)} className="hover:text-[#0EA5E9]" title="Move up"><ChevronUp size={16} /></button>)}
                          {idx < cvData.education.length - 1 && (<button onClick={() => moveItemInArray("education", idx, idx + 1)} className="hover:text-[#0EA5E9]" title="Move down"><ChevronDown size={16} /></button>)}
                          <button onClick={() => removeItem("education", edu.id)} className="text-red-500 hover:text-red-700" title="Remove"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <input
                          type="text" value={edu.institution} placeholder="Institution"
                          onChange={(e) => handleFieldChange(`education[${idx}].institution`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text" value={edu.degree} placeholder="Degree/Major"
                          onChange={(e) => handleFieldChange(`education[${idx}].degree`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text" value={edu.startDate} placeholder="Start Date"
                            onChange={(e) => handleFieldChange(`education[${idx}].startDate`, e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text" value={edu.endDate} placeholder="End Date"
                            onChange={(e) => handleFieldChange(`education[${idx}].endDate`, e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text" value={edu.gpa} placeholder="GPA"
                            onChange={(e) => handleFieldChange(`education[${idx}].gpa`, e.target.value)}
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
                          {idx > 0 && (<button onClick={() => moveItemInArray("projects", idx, idx - 1)} className="hover:text-[#0EA5E9]" title="Move up"><ChevronUp size={16} /></button>)}
                          {idx < cvData.projects.length - 1 && (<button onClick={() => moveItemInArray("projects", idx, idx + 1)} className="hover:text-[#0EA5E9]" title="Move down"><ChevronDown size={16} /></button>)}
                          <button onClick={() => removeItem("projects", project.id)} className="text-red-500 hover:text-red-700" title="Remove"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <input
                          type="text" value={project.title} placeholder="Project Title"
                          onChange={(e) => handleFieldChange(`projects[${idx}].title`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <textarea
                          value={project.description} placeholder="Description"
                          onChange={(e) => handleFieldChange(`projects[${idx}].description`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text" value={project.startDate} placeholder="Start Date"
                            onChange={(e) => handleFieldChange(`projects[${idx}].startDate`, e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text" value={project.endDate} placeholder="End Date"
                            onChange={(e) => handleFieldChange(`projects[${idx}].endDate`, e.target.value)}
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
                          {idx > 0 && (<button onClick={() => moveItemInArray("awards", idx, idx - 1)} className="hover:text-[#0EA5E9]" title="Move up"><ChevronUp size={16} /></button>)}
                          {idx < cvData.awards.length - 1 && (<button onClick={() => moveItemInArray("awards", idx, idx + 1)} className="hover:text-[#0EA5E9]" title="Move down"><ChevronDown size={16} /></button>)}
                          <button onClick={() => removeItem("awards", award.id)} className="text-red-500 hover:text-red-700" title="Remove"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <input
                          type="text" value={award.title} placeholder="Award Title"
                          onChange={(e) => handleFieldChange(`awards[${idx}].title`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text" value={award.date} placeholder="Date"
                          onChange={(e) => handleFieldChange(`awards[${idx}].date`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <textarea
                          value={award.description} placeholder="Description"
                          onChange={(e) => handleFieldChange(`awards[${idx}].description`, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={2}
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


// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function CvImprovenentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleStepComplete = (step, data) => {
    if (step === 1) {
      setCvData(data);
      setCurrentStep(2);
    } else if (step === 2) {
      console.log("Assessment Data from Step 2:", data);
      setAssessmentData(data);
      setCurrentStep(3);
    } else if (step === 3) {
      setCvData(data);
      setCurrentStep(4);
    } else if (step === 4) {
      setSelectedTemplate(data.templateId);
      setCvData(data.cvData);
      setCurrentStep(5);
    }
  };

  const handleBack = (step) => {
    setCurrentStep(step);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setCurrentStep(1);
    setCvData(null);
    setAssessmentData(null);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen">
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />

      {currentStep === 1 && (
        <CVSelectionStep
          onNext={(data) => handleStepComplete(1, data)}
          onCancel={handleCancel}
        />
      )}

      {currentStep === 2 && (
        <JobDescriptionStep
          cvData={cvData}
          onNext={(data) => handleStepComplete(2, data)}
          onBack={() => handleBack(1)}
          onCancel={handleCancel}
        />
      )}

      {currentStep === 3 && (
        <ReviewSuggestionsStep
          cvData={cvData}
          assessmentData={assessmentData}
          onNext={(data) => handleStepComplete(3, data)}
          onBack={() => handleBack(2)}
          onCancel={handleCancel}
        />
      )}

      {currentStep === 4 && (
        <TemplateSelectionStep
          cvData={cvData}
          onNext={(cvData, templateId) =>
            handleStepComplete(4, { cvData, templateId })
          }
          onBack={() => handleBack(3)}
          onCancel={handleCancel}
        />
      )}

      {currentStep === 5 && (
        <EditTemplateStep
          cvData={cvData}
          templateId={selectedTemplate}
          onNext={(data) => handleStepComplete(5, data)}
          onBack={() => handleBack(4)}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
