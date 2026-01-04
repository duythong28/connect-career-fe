import { getMyCvs } from "@/api/endpoints/cvs.api";
import { ExtractedCvData } from "@/api/types/cv.types";
import UploadFilButton from "@/components/ai/UploadFileButton";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronRight,
  File,
  FileText,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CVSelectionStep = ({
  onNext,
}: {
  onNext: (data: ExtractedCvData) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<"upload" | "existing" | null>(null);
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialCvData, setInitialCvData] = useState<ExtractedCvData | null>(null);

  const { data: cvsData } = useQuery({
    queryKey: ["candidateCvs"],
    queryFn: async () => {
      return getMyCvs();
    },
  });

  const allCvs = cvsData?.data?.filter((cv) => cv.content !== null) || [];

  const handleFileUpload = (cvData: ExtractedCvData) => {
    setInitialCvData(cvData);
    setSelectedOption("upload");
  };

  const handleProceed = async () => {
    const isReady =
      (selectedOption === "upload" && initialCvData) ||
      (selectedOption === "existing" && selectedCV);

    if (!isReady) return;

    setIsProcessing(true);

    const finalData =
      selectedOption === "upload"
        ? initialCvData
        : allCvs.find((cv) => cv.id === selectedCV)?.content;
    
    if (finalData) {
      onNext(finalData);
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-card rounded-3xl border border-border overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-border bg-card">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Improve Your Resume / CV
          </h1>
          <p className="text-sm text-muted-foreground">
            Let's start by selecting or uploading your resume/CV
          </p>
        </div>

        {/* Main Selection Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-8 bg-card">
          {/* Option 1: Upload New CV */}
          <div
            onClick={() => setSelectedOption("upload")}
            className={`bg-card rounded-2xl p-6 cursor-pointer transition-all border-2 ${
              selectedOption === "upload"
                ? "border-primary ring-2 ring-primary/10 bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Upload New Resume
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Upload PDF, DOCX, PPTX, Images file
              </p>

              <div className="mt-4">
                <UploadFilButton onUploadSuccess={handleFileUpload} />
                {initialCvData && (
                  <p className="text-xs text-brand-success font-bold mt-3 flex items-center justify-center gap-1.5 uppercase">
                    <Check size={14} /> File uploaded successfully
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Option 2: Select Existing CV */}
          <div
            onClick={() => setSelectedOption("existing")}
            className={`bg-card rounded-2xl p-6 cursor-pointer transition-all border-2 ${
              selectedOption === "existing"
                ? "border-primary ring-2 ring-primary/10 bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Select Existing Resume
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Choose from your saved documents
              </p>

              {selectedOption === "existing" && (
                <div className="mt-4 space-y-2 max-h-[180px] overflow-y-auto p-1">
                  {allCvs.map((cv) => (
                    <div
                      key={cv.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCV(cv.id);
                      }}
                      className={`p-3 rounded-xl cursor-pointer text-left transition-all border ${
                        selectedCV === cv.id
                          ? "bg-card border-primary"
                          : "bg-background border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm text-foreground flex items-center gap-2 truncate">
                          <File size={14} className="text-primary shrink-0" />
                          {cv.title}
                        </p>
                        {selectedCV === cv.id && (
                          <Check size={16} className="text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 pl-6">
                        {cv.createdAt}
                      </p>
                    </div>
                  ))}
                  {allCvs.length === 0 && (
                    <div className="text-xs text-muted-foreground py-6 italic">
                      No saved resumes found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Action Button */}
        <div className="p-6 border-t border-border flex justify-end bg-background">
          <Button
            variant="default"
            onClick={handleProceed}
            disabled={
              isProcessing ||
              !(
                (selectedOption === "upload" && initialCvData) ||
                (selectedOption === "existing" && selectedCV)
              )
            }
            className="px-8 h-10 font-bold text-sm flex items-center gap-2 rounded-xl transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing CV...
              </>
            ) : (
              <>
                Continue <ChevronRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CVSelectionStep;