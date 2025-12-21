import { enhanceCvWithAi } from "@/api/endpoints/cvs.api";
import { ExtractedCvData } from "@/api/types/cv.types";
import { CvAssessment, EnhanceCvWithAiDto } from "@/api/types/cvs.types";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Send, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const JobDescriptionStep = ({
  cvData,
  onNext,
  onBack,
  onCancel,
}: {
  cvData: ExtractedCvData;
  onNext: (data: { cvAssessment: CvAssessment | null }) => void;
  onBack: () => void;
  onCancel: () => void;
}) => {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { mutate: enhanceCvWithAiMutate, isPending } = useMutation({
    mutationFn: async (data: EnhanceCvWithAiDto) => {
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
    if (jobDescription.trim() === "") {
      onNext({ cvAssessment: null });
      return;
    }

    enhanceCvWithAiMutate({ cv: cvData, jobDescription });
  };

  const isProcessing = isPending || isAnalyzing;

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-card rounded-3xl border border-border overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-card">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs font-bold uppercase transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-9 rounded-xl flex items-center gap-1 font-semibold"
          >
            <X size={16} /> Cancel
          </Button>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Job Description
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Paste the job description below to get tailored resume/CV improvements
          </p>

          <div className="bg-card">
            <div className="bg-secondary/50 border border-border rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle
                size={18}
                className="text-primary mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-foreground leading-relaxed">
                Providing the job description is optional, but highly
                recommended. Our AI uses this context to give you the most
                accurate keyword and content suggestions.
              </p>
            </div>

            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Job Description (Copy/Paste)
            </label>
            <textarea
              value={jobDescription}
              disabled={isProcessing}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here (e.g., Responsibilities, Requirements, Qualifications)..."
              className="w-full h-64 p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm outline-none transition-all"
            />

            <div className="mt-6 flex justify-between items-center border-t border-border pt-6">
              <p className="text-xs text-muted-foreground font-medium">
                {jobDescription.length > 0
                  ? `Character count: ${jobDescription.length}`
                  : "You can skip this step, but we recommend providing a job description for better results"}
              </p>
              
              <Button
                variant="default"
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="h-10 px-8 font-bold text-sm flex items-center gap-2 rounded-xl transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : jobDescription.trim() !== "" ? (
                  <>
                    Analyze & Continue{" "}
                    <Send size={14} className="rotate-[-20deg]" />
                  </>
                ) : (
                  <>
                    Skip & Continue{" "}
                    <Send size={14} className="rotate-[-20deg]" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionStep;