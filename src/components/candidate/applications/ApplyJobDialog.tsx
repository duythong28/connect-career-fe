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
import { Button } from "@/components/ui/button";
import { getMyCvs } from "@/api/endpoints/cvs.api";
import { applyJob } from "@/api/endpoints/applications.api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Download, CheckCircle } from "lucide-react";
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
      <Button className="w-full" onClick={() => navigate("/login")}>
        Login to Apply
      </Button>
    );
  }

  if (isApplied) {
    return (
      <Button disabled className="w-full" size="lg">
        <CheckCircle className="h-4 w-4 mr-2" />
        Application Submitted
      </Button>
    );
  }

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        Apply Now
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for this job</DialogTitle>
            <DialogDescription>
              Choose a CV and optionally add a cover letter.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Select CV
              </Label>

              <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-2 bg-gray-50">
                {cvsLoading && <p>Loading CVs...</p>}

                {!cvsLoading &&
                  (cvsData?.data ?? []).map((cv) => (
                    <div
                      key={cv.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <RadioGroup
                        value={watch("cvId") || ""}
                        onValueChange={(v) => setValue("cvId", v)}
                      >
                        <div className="flex items-center w-full justify-between">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={cv.id} id={cv.id} />
                            <div>
                              <p className="font-medium">{cv.title}</p>
                              <p className="text-sm text-gray-600">
                                Uploaded {cv.createdAt}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              onClick={() => window.open(cv.file.url, "_blank")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              onClick={() =>
                                downloadFile(cv.file.url, cv.title)
                              }
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  ))}

                {!cvsLoading && (cvsData?.data ?? []).length === 0 && (
                  <p>No CVs found. Upload one in your profile.</p>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="coverLetter"
                className="text-base font-medium mb-3 block"
              >
                Cover Letter (optional)
              </Label>
              <Textarea
                id="coverLetter"
                {...register("coverLetter")}
                rows={6}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={applyMutation.isPending}>
                {applyMutation.isPending ? "Applying..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
