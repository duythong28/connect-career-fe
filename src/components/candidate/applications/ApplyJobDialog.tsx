import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getMyCvs } from "@/api/endpoints/cvs.api";
import { applyJob } from "@/api/endpoints/applications.api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Download, CheckCircle2 as CheckCircle, Send, X, FileText, UploadCloud } from "lucide-react"; 
import { increaseApplyCount } from "@/api/endpoints/jobs.api";
import type { CV } from "@/api/types/cvs.types";
import { useNavigate } from "react-router-dom";

type Props = {
  jobId: string;
};

const schema = z.object({
  cvId: z.string().min(1, "Please select a CV"),
  coverLetter: z.string().max(20000).optional(),
});

type FormSchema = z.infer<typeof schema>;

// Component button theo style Simplify
const SimplifyButton = ({ children, className = '', ...props }: React.ComponentPropsWithoutRef<'button'>) => (
    <button
        className={`bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors ${className}`}
        {...props}
    >
        {children}
    </button>
);

// Component Outline button theo style Simplify
const SimplifyOutlineButton = ({ children, className = '', ...props }: React.ComponentPropsWithoutRef<'button'>) => (
    <button
        className={`px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-colors ${className}`}
        {...props}
    >
        {children}
    </button>
);


export default function ApplyJobDialog({ jobId }: Props) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isApplied = false;
  
  const { data: cvsData, isLoading: cvsLoading } = useQuery<{ data: CV[] }>({
    queryKey: ["candidateCvs"],
    queryFn: () => getMyCvs(),
    enabled: open,
  });

  const { mutate: increaseApplyCountMutate } = useMutation({
    mutationFn: increaseApplyCount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
  });

  const applyMutation = useMutation({
    mutationFn: applyJob,
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "Your application has been sent to the employer.",
      });
      increaseApplyCountMutate(jobId);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setOpen(false);
      reset();
    },
    onError: () => {
      toast({
        title: "Application failed",
        description: "Could not submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { register, handleSubmit, reset, setValue, watch, formState } =
    useForm<FormSchema>({
      resolver: zodResolver(schema),
      defaultValues: { cvId: "", coverLetter: "" },
    });

  const onSubmit = (values: FormSchema) => {
    if (!user?.id) {
      toast({
        title: "Not authenticated",
        description: "Please login to apply.",
        variant: "destructive",
      });
      return;
    }

    applyMutation.mutate({
      jobId,
      candidateId: user.id,
      cvId: values.cvId,
      coverLetter: values.coverLetter,
      notes: "notes",
      referralSource: "notes",
    });
  };

  const downloadFile = async (url: string, filename?: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename ?? "file";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    } catch {
      toast({
        title: "Download failed",
        description: "Could not download file.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <SimplifyButton className="w-full" onClick={() => navigate("/login")}>
        Login to Apply
      </SimplifyButton>
    );
  }

  if (isApplied) {
    return (
      <SimplifyButton disabled className="w-full bg-emerald-500 hover:bg-emerald-600">
        <CheckCircle className="h-4 w-4 mr-2" />
        Application Submitted
      </SimplifyButton>
    );
  }

  return (
    <>
      <SimplifyButton className="w-full" onClick={() => setOpen(true)}>
        Apply Now
      </SimplifyButton>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* UI: Simplify Modal */}
        <DialogContent className="max-w-2xl p-0 bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <DialogHeader className="p-0 space-y-0">
              {/* Tựa đề Modal (Giống ảnh cff9bc.png) */}
              <DialogTitle className="flex items-center gap-3 text-gray-900 font-bold text-lg">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Send size={20} />
                </div>
                Apply for this job
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 pt-2">
                Choose a CV and optionally add a cover letter.
              </DialogDescription>
            </DialogHeader>
             {/* ĐÃ XÓA NÚT ĐÓNG TÙY CHỈNH. CHỈ GIỮ NÚT ĐÓNG MẶC ĐỊNH CỦA SHADCN (Được render bên ngoài khối này) */}
          </div>

          <form id="apply-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 overflow-y-auto custom-scrollbar flex-1">
            <div>
              {/* Cập nhật Label UI */}
              <Label className="text-xs font-bold text-gray-700 uppercase mb-3 block">
                Select CV
              </Label>

              {/* Cập nhật container CVs UI */}
              <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-white shadow-inner custom-scrollbar">
                {cvsLoading && <p className="text-sm text-gray-500 p-4">Loading CVs...</p>}

                {!cvsLoading &&
                  (cvsData?.data ?? []).map((cv) => (
                    <div
                      key={cv.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-white hover:bg-blue-50/30 transition-colors"
                    >
                      {/* GIỮ NGUYÊN LOGIC RadioGroup VÀ onValueChange CŨ */}
                      <RadioGroup
                        value={watch("cvId") || ""}
                        onValueChange={(v) => setValue("cvId", v)}
                      >
                        <div className="flex items-center w-full justify-between">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={cv.id} id={cv.id} className="text-blue-600 focus:ring-blue-500" />
                            {/* Cho phép click DIV để chọn CV */}
                            <div onClick={() => setValue("cvId", cv.id)} className="cursor-pointer"> 
                              <p className="font-bold text-sm text-gray-900">{cv.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                <FileText size={10} className="inline mr-1 text-gray-400"/> Uploaded {cv.createdAt}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {/* Dùng button style Simplify */}
                            <button
                              title="View"
                              className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                              type="button"
                              onClick={() => window.open(cv.file.url, "_blank")} // GIỮ LOGIC CŨ
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title="Download"
                              className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                              type="button"
                              onClick={() =>
                                downloadFile(cv.file.url, cv.title) // GIỮ LOGIC CŨ
                              }
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  ))}

                {!cvsLoading && (cvsData?.data ?? []).length === 0 && (
                  <div className="text-center p-4 text-sm text-gray-500">
                    <UploadCloud size={20} className="mx-auto mb-2 text-gray-400"/>
                    <p>No CVs found. Upload one in your profile.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              {/* Cập nhật Label UI */}
              <Label
                htmlFor="coverLetter"
                className="text-xs font-bold text-gray-700 uppercase mb-2 block"
              >
                Cover Letter (optional)
              </Label>
              {/* Cập nhật Textarea UI */}
              <Textarea
                id="coverLetter"
                {...register("coverLetter")}
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Write your cover letter here..."
              />
            </div>

          </form>
          {/* Footer actions */}
          <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-xl">
              <SimplifyOutlineButton
                type="button"
                onClick={() => setOpen(false)} // GIỮ LOGIC CŨ
                className="text-sm"
              >
                Cancel
              </SimplifyOutlineButton>
              <SimplifyButton type="submit" disabled={applyMutation.isPending || !watch('cvId')} className="text-sm px-8" form="apply-form">
                {applyMutation.isPending ? "Applying..." : "Submit Application"}
              </SimplifyButton>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}