import CancelModal from "@/components/candidate/resume/CancelModal";
import CVSelectionStep from "@/components/candidate/resume/CVSelectionStep";
import EditTemplateStep from "@/components/candidate/resume/EditTemplateStep";
import JobDescriptionStep from "@/components/candidate/resume/JobDescriptionStep";
import ReviewSuggestionsStep from "@/components/candidate/resume/ReviewSuggestionsStep";
import TemplateSelectionStep from "@/components/candidate/resume/TemplateSelectionStep";
import { useState } from "react";

export default function CvImprovenentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

      console.log("Assessment Data:", assessmentData);


  const handleStepComplete = (step: number, data: any) => {
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

  const handleBack = (step: number) => {
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
    <div className="min-h-screen bg-[#F8F9FB]">
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />

      {currentStep === 1 && (
        <CVSelectionStep
          onNext={(data: any) => handleStepComplete(1, data)}
        />
      )}

      {currentStep === 2 && (
        <JobDescriptionStep
          cvData={cvData}
          onNext={(data: any) => handleStepComplete(2, data)}
          onBack={() => handleBack(1)}
          onCancel={handleCancel}
        />
      )}

      {currentStep === 3 && (
        <ReviewSuggestionsStep
          cvData={cvData}
          assessmentData={assessmentData}
          onNext={(data: any) => handleStepComplete(3, data)}
          onBack={() => handleBack(2)}
          onCancel={handleCancel}
        />
      )}

      {currentStep === 4 && (
        <TemplateSelectionStep
          cvData={cvData}
          onNext={(cvData: any, templateId: any) =>
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
          onNext={(data: any) => handleStepComplete(5, data)}
          onBack={() => handleBack(4)}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
