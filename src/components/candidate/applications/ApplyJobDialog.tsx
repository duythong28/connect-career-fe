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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getMyCvs } from "@/api/endpoints/cvs.api";
import { applyJob } from "@/api/endpoints/applications.api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Download, CheckCircle2 as CheckCircle, Send, FileText, UploadCloud } from "lucide-react";
import { increaseApplyCount } from "@/api/endpoints/jobs.api";
import type { CV } from "@/api/types/cvs.types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Props = {
  jobId: string;
};

const schema = z.object({
  cvId: z.string().min(1, "Please select a CV"),
  coverLetter: z.string().max(20000).optional(),
});

type FormSchema = z.infer<typeof schema>;

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

  const { register, handleSubmit, reset, setValue, watch } =
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
      <Button 
        variant="default"
        className="w-full h-9" // Added h-9
        onClick={() => navigate("/login")}
      >
        Login to Apply
      </Button>
    );
  }

  if (isApplied) {
    return (
      <Button 
        disabled 
        variant="secondary"
        className="w-full text-green-600 font-bold opacity-100 h-9" // Added h-9
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Application Submitted
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="default"
        className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-sm" // Added h-9
        onClick={() => setOpen(true)}
      >
        Apply Now
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 bg-card rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-border">
          <DialogHeader className="p-6 border-b border-border bg-secondary/30">
            <DialogTitle className="flex items-center gap-3 text-foreground font-bold text-xl">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Send size={20} />
              </div>
              Apply for this job
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              Choose a CV and optionally add a cover letter.
            </DialogDescription>
          </DialogHeader>

          <form id="apply-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 overflow-y-auto custom-scrollbar flex-1 bg-card">
            <div>
              <Label className="text-xs font-bold text-muted-foreground uppercase mb-3 block">
                Select CV
              </Label>

              <div className="space-y-3 max-h-64 overflow-y-auto border border-border rounded-2xl p-4 bg-background shadow-inner custom-scrollbar">
                {cvsLoading && <p className="text-sm text-muted-foreground p-4">Loading CVs...</p>}

                {!cvsLoading &&
                  (cvsData?.data ?? []).map((cv) => (
                    <div
                      key={cv.id}
                      className="flex items-center space-x-3 p-4 border border-border rounded-xl bg-card hover:bg-secondary/20 transition-colors hover:border-primary/30"
                    >
                      <RadioGroup
                        value={watch("cvId") || ""}
                        onValueChange={(v) => setValue("cvId", v)}
                        className="w-full"
                      >
                        <div className="flex items-center w-full justify-between">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={cv.id} id={cv.id} className="text-primary border-border" />
                            <div onClick={() => setValue("cvId", cv.id)} className="cursor-pointer">
                              <p className="font-bold text-sm text-foreground">{cv.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                <FileText size={10} className="inline mr-1 text-muted-foreground"/> Uploaded {cv.createdAt}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              title="View"
                              className="p-2 border border-border rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                              type="button"
                              onClick={() => window.open(cv.file.url, "_blank")}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title="Download"
                              className="p-2 border border-border rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                              type="button"
                              onClick={() =>
                                downloadFile(cv.file.url, cv.title)
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
                  <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl">
                    <UploadCloud size={24} className="mx-auto mb-2 text-muted-foreground/50"/>
                    <p>No CVs found. Upload one in your profile.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="coverLetter"
                className="text-xs font-bold text-muted-foreground uppercase mb-2 block"
              >
                Cover Letter (optional)
              </Label>
              <Textarea
                id="coverLetter"
                {...register("coverLetter")}
                rows={6}
                className="w-full border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary bg-background resize-none"
                placeholder="Write your cover letter here..."
              />
            </div>

          </form>
          
          <DialogFooter className="p-6 border-t border-border bg-secondary/10 rounded-b-3xl sm:justify-end gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-bold border-border rounded-xl h-11 px-6 text-muted-foreground hover:text-foreground bg-background"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="default"
                disabled={applyMutation.isPending || !watch('cvId')} 
                className="text-sm font-bold rounded-xl h-11 px-8 shadow-sm" 
                form="apply-form"
              >
                {applyMutation.isPending ? "Applying..." : "Submit Application"}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}