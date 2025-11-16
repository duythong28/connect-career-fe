import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const projectSchema = z.object({
  id: z.string().optional(),
  candidateProfileId: z.string().optional(),
  title: z.string().min(1, "Title required"),
  description: z.string().optional().nullable(),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().nullable(),
  projectUrl: z.string().nullable(),
  name: z.string().optional(), // to match API structure
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ProjectFormValues> | undefined;
  onSubmit: (data: ProjectFormValues) => void;
}

export function ProjectEditor({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: undefined,
      candidateProfileId: undefined,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      name: "",
    },
  });

  useEffect(() => {
    if (initialData) reset({ ...initialData });
    else reset({
      id: undefined,
      candidateProfileId: undefined,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      name: "",
    });
  }, [initialData, reset]);

  const onFormSubmit = (values: ProjectFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit Project / Achievement" : "Add Project / Achievement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
          <div>
            <Label>Title</Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => <Input {...field} />}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label>Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => <Textarea {...field} rows={3} />}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Start Date</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => <Input {...field} type="date" />}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>
            <div className="flex-1">
              <Label>End Date</Label>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => <Input {...field} type="date" />}
              />
            </div>
          </div>
          <div>
            <Label>Project URL</Label>
            <Controller
              control={control}
              name="projectUrl"
              render={({ field }) => <Input {...field} />}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectEditor;