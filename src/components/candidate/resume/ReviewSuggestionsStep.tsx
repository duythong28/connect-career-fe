import {
  ArrowLeft,
  Briefcase,
  Check,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useState, useMemo } from "react";
import { set } from "./EditTemplateStep";
import { Suggestion, CvAssessment } from "@/api/types/cvs.types";
import { ExtractedCvData, PersonalInfo } from "@/api/types/cv.types";

type EditableFieldProps = {
  path: string;
  value: string | null;
  suggestion?: Suggestion | undefined;
  onApprove: (suggestion: Suggestion) => void;
  onEdit: (path: string, newValue: string) => void;
};

type SuggestionCardProps = {
  suggestion: Suggestion;
  onApprove: (suggestion: Suggestion) => void;
  onDismiss: (suggestionId: string) => void;
};

type AssessmentData = {
  cvAssessment: CvAssessment;
};

type ReviewSuggestionsStepProps = {
  cvData: ExtractedCvData;
  assessmentData: AssessmentData;
  onNext: (cvData: ExtractedCvData) => void;
  onBack: () => void;
  onCancel: () => void;
};

const EditableField = ({
  path,
  value,
  suggestion,
  onApprove,
  onEdit,
}: EditableFieldProps) => {
  if (suggestion) {
    // BUG FIX: Handle complex array diffs (like workExperience)
    // by showing a generic message instead of rendering the raw JSON.
    if (
      suggestion.path === "workExperience" ||
      suggestion.path === "projects"
    ) {
      return (
        <span className="p-1 rounded-md bg-gray-100 border border-dashed border-blue-400 relative">
          <span className="text-blue-700 font-medium italic text-sm">
            Suggestion available in the right panel.
          </span>
          <button
            title="Approve suggestion"
            className="ml-2 px-2 py-0.5 rounded-full bg-green-200 text-green-800 hover:bg-green-300 transition-all text-xs"
            onClick={() => onApprove(suggestion)}
          >
            ✅ Approve
          </button>
        </span>
      );
    }

    // Special handling for simple array suggestions like 'skills'
    if (Array.isArray(suggestion.diff) && suggestion.path === "skills") {
      return (
        <span className="p-1 rounded-md bg-gray-100 border border-dashed border-blue-400 relative">
          {suggestion.diff.map((segment, index) => (
            <span
              key={index}
              className={
                segment.type === "deletion"
                  ? "bg-red-100 text-red-700 line-through mr-1 px-2 py-0.5 rounded-full"
                  : segment.type === "suggestion"
                  ? "bg-green-100 text-green-700 font-medium mr-1 px-2 py-0.5 rounded-full"
                  : "bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-1"
              }
            >
              {segment.value}
            </span>
          ))}
          <button
            title="Approve suggestion"
            className="ml-2 px-2 py-0.5 rounded-full bg-green-200 text-green-800 hover:bg-green-300 transition-all text-xs"
            onClick={() => onApprove(suggestion)}
          >
            ✅ Approve
          </button>
        </span>
      );
    }

    // Default: Handle string diffs
    if (Array.isArray(suggestion.diff)) {
      return (
        <span className="p-1 rounded-md bg-gray-100 border border-dashed border-blue-400 relative">
          {suggestion.diff.map((segment, index) => (
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
          ))}
          <button
            title="Approve suggestion"
            className="ml-2 px-2 py-0.5 rounded-full bg-green-200 text-green-800 hover:bg-green-300 transition-all text-xs"
            onClick={() => onApprove(suggestion)}
          >
            ✅
          </button>
        </span>
      );
    }
  }

  // No suggestion, render the editable field
  return (
    <span
      contentEditable={true}
      suppressContentEditableWarning={true}
      className="p-1 rounded-md hover:bg-blue-50 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      onBlur={(e) => onEdit(path, e.target.innerText)}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

const SuggestionCard = ({
  suggestion,
  onApprove,
  onDismiss,
}: SuggestionCardProps) => {
  // Check if this is a complex array suggestion (like workExperience or projects)
  const isComplexArraySuggestion =
    suggestion.path === "workExperience" || suggestion.path === "projects";

  // Check if this is an object suggestion (like personalInfo)
  const isObjectSuggestion =
    suggestion.path === "personalInfo" ||
    (suggestion.diff &&
      suggestion.diff.length > 0 &&
      typeof suggestion.diff[0].value === "object" &&
      !Array.isArray(suggestion.diff[0].value));

  // Check if this is a simple array suggestion (like skills)
  const isSimpleArraySuggestion =
    suggestion.path === "skills" && Array.isArray(suggestion.diff);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-800 capitalize">
          {suggestion.path.replace(/([A-Z])/g, " $1").trim()}
        </h4>
      </div>
      <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>

      <div className="text-sm bg-gray-50 p-3 rounded-md mb-4 max-h-96 overflow-y-auto">
        {isComplexArraySuggestion ? (
          // Render complex array suggestions as formatted JSON
          <div className="space-y-3">
            {suggestion.diff.map((segment, index) => {
              if (segment.type === "suggestion" && segment.value) {
                const value = segment.value;
                return (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-md p-3"
                  >
                    <div className="text-xs font-semibold text-green-800 mb-2">
                      Suggested Changes:
                    </div>
                    {Array.isArray(value) ? (
                      value.map((item, idx) => (
                        <div
                          key={idx}
                          className="mb-2 pb-2 border-b border-green-100 last:border-0"
                        >
                          {typeof item === "object" && item !== null ? (
                            Object.entries(item).map(([key, val]) => (
                              <div key={key} className="text-xs">
                                <span className="font-medium text-gray-700">
                                  {key}:
                                </span>{" "}
                                <span className="text-gray-600">
                                  {Array.isArray(val)
                                    ? val.join(", ")
                                    : typeof val === "object" && val !== null
                                    ? JSON.stringify(val)
                                    : String(val)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-700">
                              {String(item)}
                            </span>
                          )}
                        </div>
                      ))
                    ) : typeof value === "object" && value !== null ? (
                      <div className="space-y-1">
                        {Object.entries(value).map(([key, val]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium text-gray-700">
                              {key}:
                            </span>{" "}
                            <span className="text-gray-600">
                              {Array.isArray(val)
                                ? val.join(", ")
                                : typeof val === "object" && val !== null
                                ? JSON.stringify(val)
                                : String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-700">
                        {String(value)}
                      </span>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : isObjectSuggestion ? (
          // Render object suggestions (like personalInfo) as field-by-field comparison
          <div className="space-y-2">
            {suggestion.diff.map((segment, index) => {
              if (
                segment.type === "suggestion" &&
                typeof segment.value === "object" &&
                segment.value !== null
              ) {
                // Show the object as key-value pairs
                return (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-md p-3"
                  >
                    <div className="text-xs font-semibold text-green-800 mb-2">
                      Suggested Changes:
                    </div>
                    <div className="space-y-1">
                      {Object.entries(segment.value).map(([key, val]) => (
                        <div key={key} className="text-xs">
                          <span className="font-medium text-gray-700">
                            {key}:
                          </span>{" "}
                          <span className="text-green-700">
                            {Array.isArray(val)
                              ? val.join(", ")
                              : typeof val === "object" && val !== null
                              ? JSON.stringify(val)
                              : String(val || "null")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (
                segment.type === "deletion" &&
                typeof segment.value === "object" &&
                segment.value !== null
              ) {
                // Show deleted object
                return (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded-md p-3"
                  >
                    <div className="text-xs font-semibold text-red-800 mb-2">
                      Current Values:
                    </div>
                    <div className="space-y-1">
                      {Object.entries(segment.value).map(([key, val]) => (
                        <div key={key} className="text-xs">
                          <span className="font-medium text-gray-700">
                            {key}:
                          </span>{" "}
                          <span className="text-red-700 line-through">
                            {Array.isArray(val)
                              ? val.join(", ")
                              : typeof val === "object" && val !== null
                              ? JSON.stringify(val)
                              : String(val || "null")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : isSimpleArraySuggestion ? (
          // Render simple array suggestions as pills
          <div className="flex flex-wrap gap-1">
            {suggestion.diff.map((segment, index) => (
              <span
                key={index}
                className={
                  segment.type === "deletion"
                    ? "bg-red-100 text-red-700 line-through px-2 py-0.5 rounded-full text-xs"
                    : segment.type === "suggestion"
                    ? "bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full text-xs"
                    : "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                }
              >
                {typeof segment.value === "object"
                  ? JSON.stringify(segment.value)
                  : String(segment.value)}
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
              {typeof segment.value === "object"
                ? JSON.stringify(segment.value)
                : String(segment.value)}
            </span>
          ))
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          title="Dismiss suggestion"
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-xs font-medium"
          onClick={() => onDismiss(suggestion.id)}
        >
          ❌ Dismiss
        </button>
        <button
          title="Approve suggestion"
          className="px-3 py-1 rounded-md bg-green-200 text-green-800 hover:bg-green-300 transition-all text-xs font-medium"
          onClick={() => onApprove(suggestion)}
        >
          ✅ Approve
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
}: ReviewSuggestionsStepProps) => {
  const [cvData, setCvData] = useState(initialData);
  const [assessmentData, setAssessmentData] = useState(initialAssessment);

  const suggestionMap = useMemo(() => {
    const map = {};
     if (assessmentData && assessmentData.cvAssessment) {
    Object.values(assessmentData.cvAssessment).forEach((suggestions: any) => {
      suggestions.forEach((suggestion: any) => {
        map[suggestion.path] = suggestion;
      });
    });
  }
    return map;
  }, [assessmentData]);

  const removeSuggestion = (suggestionId) => {
    const newAssessment = structuredClone(assessmentData);
    for (const aspect in newAssessment.cvAssessment) {
      newAssessment.cvAssessment[aspect] = newAssessment.cvAssessment[
        aspect
      ].filter((s: any) => s.id !== suggestionId);
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

  const totalSuggestions = Object.values(
    assessmentData.cvAssessment || {}
  ).reduce<number>((sum, suggestions: any) => sum + suggestions.length, 0);

  

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Review Suggestions
              </h1>
              <p className="text-sm text-gray-600">
                {totalSuggestions} suggestions remaining
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => onNext(cvData)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Choose Template
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Personal Info Header */}
            <header className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900">
                <EditableField
                  path="personalInfo.name"
                  value={cvData.personalInfo.name}
                  suggestion={suggestionMap["personalInfo.name"]}
                  onApprove={handleApprove}
                  onEdit={handleEdit}
                />
              </h1>
              <h2 className="text-xl font-medium text-blue-600">
                <EditableField
                  path="personalInfo.title"
                  value={cvData.personalInfo.title}
                  suggestion={suggestionMap["personalInfo.title"]}
                  onApprove={handleApprove}
                  onEdit={handleEdit}
                />
              </h2>
              <div className="text-sm text-gray-600 mt-2 flex justify-center space-x-4">
                <span>
                  <EditableField
                    path="personalInfo.email"
                    value={cvData.personalInfo.email}
                    suggestion={suggestionMap["personalInfo.email"]}
                    onApprove={handleApprove}
                    onEdit={handleEdit}
                  />
                </span>
                <span>|</span>
                <span>
                  <EditableField
                    path="personalInfo.phone"
                    value={cvData.personalInfo.phone}
                    suggestion={suggestionMap["personalInfo.phone"]}
                    onApprove={handleApprove}
                    onEdit={handleEdit}
                  />
                </span>
                <span>|</span>
                <span>
                  <EditableField
                    path="personalInfo.address"
                    value={cvData.personalInfo.address}
                    suggestion={suggestionMap["personalInfo.address"]}
                    onApprove={handleApprove}
                    onEdit={handleEdit}
                  />
                </span>
              </div>
            </header>

            {/* Skills Section */}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
                Skills
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
                  (cvData?.skills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
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

            {/* Projects Section */}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
                Projects
              </h3>
              <div className="space-y-6">
                {cvData.projects.map((project, p_idx) => (
                  <div key={project.id}>
                    <h4 className="text-lg font-semibold text-gray-900">
                      <EditableField
                        path={`projects[${p_idx}].title`}
                        value={project.title}
                        suggestion={suggestionMap[`projects[${p_idx}].title`]}
                        onApprove={handleApprove}
                        onEdit={handleEdit}
                      />
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {project.startDate} – {project.endDate}
                    </p>
                    <p className="text-gray-700 mb-2">
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
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
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

            {/* Work Experience Section */}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
                Work Experience
              </h3>
              <div className="space-y-6">
                {cvData.workExperience.map((work, w_idx) => (
                  <div key={work.id}>
                    <h4 className="text-lg font-semibold text-gray-900">
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
                    <p className="text-md font-medium text-gray-700">
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
                    <p className="text-sm text-gray-600 mb-2">
                      {work.startDate} – {work.endDate}
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
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

            {/* Education Section */}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
                Education
              </h3>
              {cvData.education.map((edu, e_idx) => (
                <div key={edu.id} className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
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
                  <p className="text-md font-medium text-gray-700">
                    <EditableField
                      path={`education[${e_idx}].degree`}
                      value={edu.degree}
                      suggestion={suggestionMap[`education[${e_idx}].degree`]}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                    />
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {edu.startDate} – {edu.endDate} | GPA: {edu.gpa}
                  </p>
                </div>
              ))}
            </section>

            {/* Awards Section */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
                Awards
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {cvData.awards.map((award, a_idx) => (
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
                      suggestion={suggestionMap[`awards[${a_idx}].description`]}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="w-full md:w-1/3 h-full bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Suggestions</h2>
          {totalSuggestions === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600">No suggestions. Looks great!</p>
            </div>
          ) : (
            Object.entries(assessmentData.cvAssessment)
              .filter(([, suggestions]: any) => suggestions.length > 0)
              .map(([aspect, suggestions]: any) => (
                <div key={aspect} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 capitalize mb-3">
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

export default ReviewSuggestionsStep;
