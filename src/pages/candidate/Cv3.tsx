import React, { useState, useMemo } from 'react';

// ============================================================================
// MOCK DATA & UTILITIES
// ============================================================================

const initialCvData = {
  personalInfo: {
    name: "LÊ MINH TOÀN",
    title: "SOFTWARE ENGINEER INTERN",
    email: "Imtoan311@gmail.com",
    phone: "0896423104",
    address: "Thu Duc, Ho Chi Minh City",
    image: "",
    links: [
      { id: "link-1", label: "GitHub", url: "https://github.com/Lmt310104" },
      { id: "link-2", label: "LinkedIn", url: "" }
    ]
  },
  workExperience: [
    {
      id: "1",
      company: "Webdev Studios",
      position: "Member of Backend Development Team",
      startDate: "2024-12",
      endDate: "Present",
      current: true,
      responsibilities: [
        "Collaborating with multiple Departments' members to maintain project Webdev Adventure for the club."
      ]
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of Information Technology - VNUHCM",
      degree: "B.S Software Engineering",
      fieldOfStudy: "Software Engineering",
      startDate: "2022-09",
      endDate: "2026-01",
      gpa: "9.13/10"
    }
  ],
  skills: [
    "C#", "Java", "JavaScript", "Typescript", "React", "Redux", "HTML5", "CSS3",
    "NestJS", "NodeJS", "ExpressJS", "ASP.NET Core API", "Java Spring Boot",
    "PostgreSQL", "SQL Server", "MySQL", "MongoDB", "AWS", "EC2", "Docker",
    "Github", "Postman", "Jira"
  ],
  projects: [
    {
      id: "1",
      title: "BookNow",
      startDate: "2024-09",
      endDate: "Present",
      current: true,
      url: "GitHub Repository",
      description: "Developed a web application with scalable features, allowing users to browse, book, and manage rental properties.",
      responsibilities: [
        "Designed and implemented APIs in server-side.",
        "Integrated third-party services for chatbot and chat service."
      ],
      techStack: ["Typescript", "ReactJS", "NestJS", "Firebase Cloud Storage", "PostgreSQL"]
    }
  ],
  awards: [
    {
      id: "1",
      title: "Scholarship for Academic Encouragement",
      date: "2024-10",
      description: "Awarded for outstanding academic performance in Semester 1, Semester 2, and Semester 4."
    }
  ],
  sectionVisibility: {
    personalInfo: true,
    skills: true,
    workExperience: true,
    education: true,
    projects: true,
    awards: true
  },
  sectionOrder: ['personalInfo', 'skills', 'projects', 'workExperience', 'education', 'awards']
};

const initialAssessmentData = {
  cvAssessment: {
    content: [
      {
        id: "content-001",
        path: "projects[0].description",
        reason: "Consider adding more quantifiable metrics to showcase impact.",
        diff: [
          { type: "equal", value: "Developed a web application with scalable features" },
          { type: "suggestion", value: ", serving 1000+ users," },
          { type: "equal", value: " allowing users to browse, book, and manage rental properties." }
        ]
      }
    ],
    style: [
      {
        id: "style-001",
        path: "personalInfo.title",
        reason: "Consider a more impactful title that highlights your expertise.",
        diff: [
          { type: "deletion", value: "SOFTWARE ENGINEER INTERN" },
          { type: "suggestion", value: "Full-Stack Software Engineer | Backend Specialist" }
        ]
      }
    ]
  }
};

const mockExistingCVs = [
  { id: "cv-1", name: "Software Engineer CV - v1", date: "2024-10-15" },
  { id: "cv-2", name: "Internship Application CV", date: "2024-09-20" }
];

const cvTemplates = [
  { id: 'modern', name: 'Modern Professional', color: '#2563eb' },
  { id: 'creative', name: 'Creative Designer', color: '#7c3aed' },
  { id: 'minimal', name: 'Minimal Clean', color: '#000000' },
  { id: 'executive', name: 'Executive Leader', color: '#1e293b' },
  { id: 'technical', name: 'Technical Expert', color: '#059669' },
  { id: 'academic', name: 'Academic Research', color: '#4b5563' },
  { id: 'bold', name: 'Bold Impact', color: '#dc2626' },
  { id: 'elegant', name: 'Elegant Classic', color: '#92400e' },
  { id: 'sidebar', name: 'Sidebar Layout', color: '#0891b2' },
  { id: 'compact', name: 'Compact Dense', color: '#6b7280' }
];

const fontOptions = [
  { id: 'inter', name: 'Inter', css: 'font-sans' },
  { id: 'serif', name: 'Serif', css: 'font-serif' },
  { id: 'mono', name: 'Monospace', css: 'font-mono' }
];

const colorPresets = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Green', value: '#059669' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Gray', value: '#4b5563' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Black', value: '#000000' },
  { name: 'Brown', value: '#92400e' }
];

// Utility functions
const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split(/[.\[\]]+/).filter(Boolean);
  let result = obj;
  for (const key of keys) {
    if (result === null || typeof result !== 'object' || !(key in result)) {
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
        <h3 className="text-xl font-bold text-gray-900 mb-3">Cancel CV Improvement?</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to cancel? All your progress will be lost.</p>
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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleProceed = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onNext(initialCvData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Improve Your CV</h1>
            <p className="text-gray-600">Let's start by selecting or uploading your CV</p>
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Cancel
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            onClick={() => setSelectedOption('upload')}
            className={`bg-white rounded-xl p-8 cursor-pointer transition-all ${
              selectedOption === 'upload' ? 'ring-4 ring-blue-500 shadow-xl' : 'hover:shadow-lg'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload New CV</h3>
              <p className="text-gray-600 text-sm mb-4">Upload a PDF, DOC, or DOCX file</p>
              
              {selectedOption === 'upload' && (
                <div className="mt-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                  {uploadedFile && (
                    <p className="text-sm text-green-600 mt-2">✓ {uploadedFile.name}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            onClick={() => setSelectedOption('existing')}
            className={`bg-white rounded-xl p-8 cursor-pointer transition-all ${
              selectedOption === 'existing' ? 'ring-4 ring-blue-500 shadow-xl' : 'hover:shadow-lg'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Select Existing CV</h3>
              <p className="text-gray-600 text-sm mb-4">Choose from your saved CVs</p>
              
              {selectedOption === 'existing' && (
                <div className="mt-4 space-y-2">
                  {mockExistingCVs.map(cv => (
                    <div
                      key={cv.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCV(cv.id);
                      }}
                      className={`p-3 rounded-lg cursor-pointer text-left transition-all ${
                        selectedCV === cv.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-medium text-sm text-gray-800">{cv.name}</p>
                      <p className="text-xs text-gray-500">{cv.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {((selectedOption === 'upload' && uploadedFile) || (selectedOption === 'existing' && selectedCV)) && (
          <div className="text-center">
            <button
              onClick={handleProceed}
              disabled={isProcessing}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
            >
              {isProcessing ? 'Processing CV...' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// STEP 2: JOB DESCRIPTION INPUT
// ============================================================================

const JobDescriptionStep = ({ cvData, onNext, onBack, onCancel }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onNext(initialAssessmentData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Cancel
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">Job Description</h1>
        <p className="text-gray-600 mb-8">Paste the job description to get tailored CV improvements</p>

        <div className="bg-white rounded-xl p-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Job Description (Optional but recommended)
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get personalized suggestions..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {jobDescription.length > 0 
                ? `${jobDescription.length} characters` 
                : 'You can skip this step, but we recommend providing a job description for better results'}
            </p>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
            >
              {isAnalyzing ? 'Analyzing...' : jobDescription ? 'Analyze & Continue' : 'Skip & Continue'}
            </button>
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
  if (suggestion) {
    return (
      <span className="inline-flex items-center gap-2 p-1 rounded-md bg-gray-100 border border-dashed border-blue-400">
        {suggestion.diff.map((segment, index) => (
          <span
            key={index}
            className={
              segment.type === 'deletion'
                ? 'bg-red-100 text-red-700 line-through'
                : segment.type === 'suggestion'
                ? 'bg-green-100 text-green-700 font-medium'
                : ''
            }
          >
            {segment.value}
          </span>
        ))}
        <button
          onClick={() => onApprove(suggestion)}
          className="px-2 py-0.5 rounded-full bg-green-200 text-green-800 hover:bg-green-300 transition-all text-xs font-medium"
        >
          ✓ Apply
        </button>
      </span>
    );
  }

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

const SuggestionCard = ({ suggestion, onApprove, onDismiss }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>
      <div className="text-sm bg-gray-50 p-3 rounded-md mb-4">
        {suggestion.diff.map((segment, index) => (
          <span
            key={index}
            className={
              segment.type === 'deletion'
                ? 'bg-red-100 text-red-700 line-through'
                : segment.type === 'suggestion'
                ? 'bg-green-100 text-green-700 font-medium'
                : 'text-gray-700'
            }
          >
            {segment.value}
          </span>
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onDismiss(suggestion.id)}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-xs font-medium"
        >
          Dismiss
        </button>
        <button
          onClick={() => onApprove(suggestion)}
          className="px-3 py-1 rounded-md bg-green-200 text-green-800 hover:bg-green-300 transition-all text-xs font-medium"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const ReviewSuggestionsStep = ({ cvData: initialData, assessmentData: initialAssessment, onNext, onBack, onCancel }) => {
  const [cvData, setCvData] = useState(initialData);
  const [assessmentData, setAssessmentData] = useState(initialAssessment);

  const suggestionMap = useMemo(() => {
    const map = {};
    Object.values(assessmentData.cvAssessment).forEach((suggestions) => {
      suggestions.forEach((suggestion) => {
        map[suggestion.path] = suggestion;
      });
    });
    return map;
  }, [assessmentData]);

  const removeSuggestion = (suggestionId) => {
    const newAssessment = structuredClone(assessmentData);
    for (const aspect in newAssessment.cvAssessment) {
      newAssessment.cvAssessment[aspect] = newAssessment.cvAssessment[aspect].filter(
        (s) => s.id !== suggestionId
      );
    }
    setAssessmentData(newAssessment);
  };

  const handleApprove = (suggestion) => {
    const newValue = suggestion.diff
      .filter((s) => s.type !== 'deletion')
      .map((s) => s.value)
      .join('');
    setCvData((prev) => set(prev, suggestion.path, newValue));
    removeSuggestion(suggestion.id);
  };

  const handleDismiss = (suggestionId) => {
    removeSuggestion(suggestionId);
  };

  const handleEdit = (path, newValue) => {
    setCvData((prev) => set(prev, path, newValue));
  };

  const totalSuggestions = Object.values(assessmentData.cvAssessment).reduce(
    (sum, suggestions) => sum + suggestions.length,
    0
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Review Suggestions</h1>
              <p className="text-sm text-gray-600">{totalSuggestions} suggestions remaining</p>
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
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                <EditableField
                  path="personalInfo.name"
                  value={cvData.personalInfo.name}
                  suggestion={suggestionMap['personalInfo.name']}
                  onApprove={handleApprove}
                  onEdit={handleEdit}
                />
              </h2>
              <p className="text-lg text-blue-600 mt-2">
                <EditableField
                  path="personalInfo.title"
                  value={cvData.personalInfo.title}
                  suggestion={suggestionMap['personalInfo.title']}
                  onApprove={handleApprove}
                  onEdit={handleEdit}
                />
              </p>
            </div>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Projects</h3>
              {cvData.projects.map((project, idx) => (
                <div key={project.id} className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    <EditableField
                      path={`projects[${idx}].title`}
                      value={project.title}
                      suggestion={suggestionMap[`projects[${idx}].title`]}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                    />
                  </h4>
                  <p className="text-gray-700 mt-2">
                    <EditableField
                      path={`projects[${idx}].description`}
                      value={project.description}
                      suggestion={suggestionMap[`projects[${idx}].description`]}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                    />
                  </p>
                </div>
              ))}
            </section>
          </div>
        </div>

        <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Suggestions</h2>
          {totalSuggestions === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600">All suggestions applied!</p>
            </div>
          ) : (
            Object.entries(assessmentData.cvAssessment).map(([aspect, suggestions]) =>
              suggestions.length > 0 ? (
                <div key={aspect} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
                    {aspect} ({suggestions.length})
                  </h3>
                  <div className="space-y-3">
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
              ) : null
            )
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CV TEMPLATE RENDERER
// ============================================================================

const CVTemplateRenderer = ({ cvData, templateId, primaryColor = '#2563eb', fontFamily = 'font-sans' }) => {
  const { personalInfo, workExperience, education, skills, projects, awards, sectionVisibility, sectionOrder } = cvData;

  const renderSection = (sectionKey) => {
    if (!sectionVisibility[sectionKey]) return null;

    if (sectionKey === 'personalInfo') {
      return (
        <header key="personalInfo" className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.name}</h1>
          <p className="text-xl mb-3" style={{ color: primaryColor }}>{personalInfo.title}</p>
          <div className="text-sm text-gray-600 space-x-2">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.address}</span>
          </div>
        </header>
      );
    }

    if (sectionKey === 'skills' && skills.length > 0) {
      return (
        <section key="skills" className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      );
    }

    if (sectionKey === 'workExperience' && workExperience.length > 0) {
      return (
        <section key="workExperience" className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>Work Experience</h2>
          {workExperience.map(work => (
            <div key={work.id} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{work.position}</h3>
              <p className="text-md text-gray-700 font-medium">{work.company}</p>
              <p className="text-sm text-gray-500 mb-2">{work.startDate} - {work.endDate}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {work.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      );
    }

    if (sectionKey === 'education' && education.length > 0) {
      return (
        <section key="education" className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{edu.institution}</h3>
              <p className="text-md text-gray-700">{edu.degree}</p>
              <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate} | GPA: {edu.gpa}</p>
            </div>
          ))}
        </section>
      );
    }

    if (sectionKey === 'projects' && projects.length > 0) {
      return (
        <section key="projects" className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>Projects</h2>
          {projects.map(project => (
            <div key={project.id} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{project.startDate} - {project.endDate}</p>
              <p className="text-gray-700 mb-2">{project.description}</p>
              {project.responsibilities && project.responsibilities.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {project.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      );
    }

    if (sectionKey === 'awards' && awards.length > 0) {
      return (
        <section key="awards" className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>Awards</h2>
          {awards.map(award => (
            <div key={award.id} className="mb-2">
              <span className="font-semibold text-gray-900">{award.title}</span>
              <span className="text-gray-500"> ({award.date})</span>
              <p className="text-gray-700 text-sm">{award.description}</p>
            </div>
          ))}
        </section>
      );
    }

    return null;
  };

  return (
    <div className={`p-8 bg-white ${fontFamily}`}>
      {sectionOrder.map(sectionKey => renderSection(sectionKey))}
    </div>
  );
};

// ============================================================================
// STEP 4: TEMPLATE SELECTION WITH PREVIEW
// ============================================================================

const TemplateSelectionStep = ({ cvData, onNext, onBack, onCancel }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const previewData = {
    ...cvData,
    personalInfo: { ...cvData.personalInfo, name: "John Doe", title: "Professional Title" },
    skills: cvData.skills.slice(0, 6),
    workExperience: cvData.workExperience.slice(0, 1),
    education: cvData.education.slice(0, 1),
    projects: cvData.projects.slice(0, 1),
    awards: cvData.awards.slice(0, 1)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Cancel
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">Choose Your Template</h1>
        <p className="text-gray-600 mb-8">Select a professional template that best represents your style</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cvTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`bg-white rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'ring-4 ring-blue-500 scale-105'
                  : 'hover:shadow-xl hover:scale-102'
              }`}
            >
              <div className="h-64 overflow-hidden relative bg-gray-50">
                <div className="absolute inset-0 scale-[0.35] origin-top-left">
                  <CVTemplateRenderer 
                    cvData={previewData} 
                    templateId={template.id} 
                    primaryColor={template.color}
                  />
                </div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.color }}></div>
                  <span className="text-sm text-gray-500">Default color</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <div className="text-center">
            <button
              onClick={() => onNext(cvData, selectedTemplate)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Customize Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// STEP 5: EDIT TEMPLATE
// ============================================================================

const EditTemplateStep = ({ cvData: initialData, templateId, onNext, onBack, onCancel }) => {
  const [cvData, setCvData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(true);
  const [primaryColor, setPrimaryColor] = useState(cvTemplates.find(t => t.id === templateId)?.color || '#2563eb');
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [showCustomization, setShowCustomization] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleFieldChange = (path, value) => {
    setCvData(prev => set(prev, path, value));
  };

  const toggleSectionVisibility = (section) => {
    setCvData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      }
    }));
  };

  const moveSection = (fromIndex, toIndex) => {
    const newOrder = [...cvData.sectionOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setCvData(prev => ({ ...prev, sectionOrder: newOrder }));
  };

  const moveItemInArray = (section, fromIndex, toIndex) => {
    const newArray = [...cvData[section]];
    const [moved] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, moved);
    setCvData(prev => ({ ...prev, [section]: newArray }));
  };

  const addItem = (section) => {
    const newItem = section === 'workExperience' 
      ? { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', responsibilities: [''] }
      : section === 'education'
      ? { id: Date.now().toString(), institution: '', degree: '', startDate: '', endDate: '', gpa: '' }
      : section === 'projects'
      ? { id: Date.now().toString(), title: '', description: '', startDate: '', endDate: '', responsibilities: [] }
      : { id: Date.now().toString(), title: '', date: '', description: '' };
    
    setCvData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const removeItem = (section, id) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const handlePreview = () => {
    setIsEditing(false);
  };

  const handleContinueEditing = () => {
    setIsEditing(true);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const getSectionName = (key) => {
    const names = {
      personalInfo: 'Personal Information',
      skills: 'Skills',
      workExperience: 'Work Experience',
      education: 'Education',
      projects: 'Projects',
      awards: 'Awards'
    };
    return names[key] || key;
  };

  if (!isEditing) {
    return (
      <div className="min-h-screen bg-gray-100">
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              .printable-cv, .printable-cv * { visibility: visible; }
              .printable-cv { position: absolute; left: 0; top: 0; width: 100%; }
              .no-print { display: none !important; }
              @page { size: A4; margin: 15mm; }
            }
          `}
        </style>
        
        <div className="no-print bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleContinueEditing}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Continue Editing
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Preview</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Change Template
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-4xl mx-auto printable-cv">
            <CVTemplateRenderer cvData={cvData} templateId={templateId} primaryColor={primaryColor} fontFamily={fontFamily} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Templates
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Customize Your CV</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Customize
            </button>
            <button
              onClick={handlePreview}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Edit Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Customization Panel */}
            {showCustomization && (
              <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Customize Appearance
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Color Picker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map(color => (
                        <button
                          key={color.value}
                          onClick={() => setPrimaryColor(color.value)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            primaryColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Font Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <div className="space-y-2">
                      {fontOptions.map(font => (
                        <button
                          key={font.id}
                          onClick={() => setFontFamily(font.css)}
                          className={`w-full px-4 py-2 text-left rounded-lg border-2 transition-all ${
                            fontFamily === font.css 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          } ${font.css}`}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section Order */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Order (Drag to reorder)</label>
                  <div className="space-y-2">
                    {cvData.sectionOrder.map((section, index) => (
                      <div
                        key={section}
                        draggable
                        onDragStart={() => setDraggedItem(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedItem !== null) {
                            moveSection(draggedItem, index);
                            setDraggedItem(null);
                          }
                        }}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 cursor-move hover:border-blue-400 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          <span className="font-medium text-gray-800">{getSectionName(section)}</span>
                        </div>
                        <button
                          onClick={() => toggleSectionVisibility(section)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                            cvData.sectionVisibility[section]
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {cvData.sectionVisibility[section] ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Personal Info */}
            <section className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                <button
                  onClick={() => toggleSectionVisibility('personalInfo')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    cvData.sectionVisibility.personalInfo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {cvData.sectionVisibility.personalInfo ? 'Visible' : 'Hidden'}
                </button>
              </div>
              {cvData.sectionVisibility.personalInfo && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.name}
                      onChange={(e) => handleFieldChange('personalInfo.name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.title}
                      onChange={(e) => handleFieldChange('personalInfo.title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => handleFieldChange('personalInfo.email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => handleFieldChange('personalInfo.phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.address}
                      onChange={(e) => handleFieldChange('personalInfo.address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Skills */}
            <section className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Skills</h2>
                <button
                  onClick={() => toggleSectionVisibility('skills')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    cvData.sectionVisibility.skills ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {cvData.sectionVisibility.skills ? 'Visible' : 'Hidden'}
                </button>
              </div>
              {cvData.sectionVisibility.skills && (
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleFieldChange(`skills[${index}]`, e.target.value)}
                        className="bg-transparent border-none focus:outline-none w-24"
                      />
                      <button
                        onClick={() => {
                          const newSkills = cvData.skills.filter((_, i) => i !== index);
                          setCvData(prev => ({ ...prev, skills: newSkills }));
                        }}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setCvData(prev => ({ ...prev, skills: [...prev.skills, 'New Skill'] }))}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 text-sm"
                  >
                    + Add Skill
                  </button>
                </div>
              )}
            </section>

            {/* Work Experience */}
            <section className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('workExperience')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      cvData.sectionVisibility.workExperience ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {cvData.sectionVisibility.workExperience ? 'Visible' : 'Hidden'}
                  </button>
                  {cvData.sectionVisibility.workExperience && (
                    <button
                      onClick={() => addItem('workExperience')}
                      className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
              {cvData.sectionVisibility.workExperience && (
                <div className="space-y-6">
                  {cvData.workExperience.map((work, idx) => (
                    <div key={work.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800">Experience {idx + 1}</h3>
                        <div className="flex gap-2">
                          {idx > 0 && (
                            <button
                              onClick={() => moveItemInArray('workExperience', idx, idx - 1)}
                              className="text-gray-600 hover:text-gray-800"
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          {idx < cvData.workExperience.length - 1 && (
                            <button
                              onClick={() => moveItemInArray('workExperience', idx, idx + 1)}
                              className="text-gray-600 hover:text-gray-800"
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            onClick={() => removeItem('workExperience', work.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={work.position}
                          onChange={(e) => handleFieldChange(`workExperience[${idx}].position`, e.target.value)}
                          placeholder="Position"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={work.company}
                          onChange={(e) => handleFieldChange(`workExperience[${idx}].company`, e.target.value)}
                          placeholder="Company"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={work.startDate}
                            onChange={(e) => handleFieldChange(`workExperience[${idx}].startDate`, e.target.value)}
                            placeholder="Start Date"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={work.endDate}
                            onChange={(e) => handleFieldChange(`workExperience[${idx}].endDate`, e.target.value)}
                            placeholder="End Date"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {work.responsibilities.map((resp, rIdx) => (
                          <div key={rIdx} className="flex gap-2">
                            <textarea
                              value={resp}
                              onChange={(e) => handleFieldChange(`workExperience[${idx}].responsibilities[${rIdx}]`, e.target.value)}
                              placeholder="Responsibility"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                              rows="2"
                            />
                            <button
                              onClick={() => {
                                const newResp = work.responsibilities.filter((_, i) => i !== rIdx);
                                handleFieldChange(`workExperience[${idx}].responsibilities`, newResp);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newResp = [...work.responsibilities, ''];
                            handleFieldChange(`workExperience[${idx}].responsibilities`, newResp);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Add Responsibility
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Education */}
            <section className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Education</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('education')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      cvData.sectionVisibility.education ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {cvData.sectionVisibility.education ? 'Visible' : 'Hidden'}
                  </button>
                  {cvData.sectionVisibility.education && (
                    <button
                      onClick={() => addItem('education')}
                      className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
              {cvData.sectionVisibility.education && (
                <div className="space-y-6">
                  {cvData.education.map((edu, idx) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800">Education {idx + 1}</h3>
                        <div className="flex gap-2">
                          {idx > 0 && (
                            <button
                              onClick={() => moveItemInArray('education', idx, idx - 1)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ↑
                            </button>
                          )}
                          {idx < cvData.education.length - 1 && (
                            <button
                              onClick={() => moveItemInArray('education', idx, idx + 1)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            onClick={() => removeItem('education', edu.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleFieldChange(`education[${idx}].institution`, e.target.value)}
                          placeholder="Institution"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleFieldChange(`education[${idx}].degree`, e.target.value)}
                          placeholder="Degree"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => handleFieldChange(`education[${idx}].startDate`, e.target.value)}
                            placeholder="Start Date"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => handleFieldChange(`education[${idx}].endDate`, e.target.value)}
                            placeholder="End Date"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => handleFieldChange(`education[${idx}].gpa`, e.target.value)}
                            placeholder="GPA"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Projects */}
            <section className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('projects')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      cvData.sectionVisibility.projects ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {cvData.sectionVisibility.projects ? 'Visible' : 'Hidden'}
                  </button>
                  {cvData.sectionVisibility.projects && (
                    <button
                      onClick={() => addItem('projects')}
                      className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
              {cvData.sectionVisibility.projects && (
                <div className="space-y-6">
                  {cvData.projects.map((project, idx) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800">Project {idx + 1}</h3>
                        <div className="flex gap-2">
                          {idx > 0 && (
                            <button
                              onClick={() => moveItemInArray('projects', idx, idx - 1)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ↑
                            </button>
                          )}
                          {idx < cvData.projects.length - 1 && (
                            <button
                              onClick={() => moveItemInArray('projects', idx, idx + 1)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            onClick={() => removeItem('projects', project.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleFieldChange(`projects[${idx}].title`, e.target.value)}
                          placeholder="Project Title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) => handleFieldChange(`projects[${idx}].description`, e.target.value)}
                          placeholder="Description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={project.startDate}
                            onChange={(e) => handleFieldChange(`projects[${idx}].startDate`, e.target.value)}
                            placeholder="Start Date"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={project.endDate}
                            onChange={(e) => handleFieldChange(`projects[${idx}].endDate`, e.target.value)}
                            placeholder="End Date"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Awards */}
            <section className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Awards & Achievements</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('awards')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      cvData.sectionVisibility.awards ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {cvData.sectionVisibility.awards ? 'Visible' : 'Hidden'}
                  </button>
                  {cvData.sectionVisibility.awards && (
                    <button
                      onClick={() => addItem('awards')}
                      className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
              {cvData.sectionVisibility.awards && (
                <div className="space-y-6">
                  {cvData.awards.map((award, idx) => (
                    <div key={award.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800">Award {idx + 1}</h3>
                        <div className="flex gap-2">
                          {idx > 0 && (
                            <button
                              onClick={() => moveItemInArray('awards', idx, idx - 1)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ↑
                            </button>
                          )}
                          {idx < cvData.awards.length - 1 && (
                            <button
                              onClick={() => moveItemInArray('awards', idx, idx + 1)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            onClick={() => removeItem('awards', award.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) => handleFieldChange(`awards[${idx}].title`, e.target.value)}
                          placeholder="Award Title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={award.date}
                          onChange={(e) => handleFieldChange(`awards[${idx}].date`, e.target.value)}
                          placeholder="Date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={award.description}
                          onChange={(e) => handleFieldChange(`awards[${idx}].description`, e.target.value)}
                          placeholder="Description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="w-1/2 bg-gray-100 overflow-y-auto p-8">
          <div className="bg-white max-w-2xl mx-auto">
            <CVTemplateRenderer cvData={cvData} templateId={templateId} primaryColor={primaryColor} fontFamily={fontFamily} />
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
          onNext={(cvData, templateId) => handleStepComplete(4, { cvData, templateId })}
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

