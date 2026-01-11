import { useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

const experienceFormSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, "Job title required"),
  organizationId: z.string().min(1, "Organization required"),
  employmentType: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional().nullable(),
  skillsString: z.string().optional(),
});

const experienceSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string(),
  organizationId: z.string(),
  employmentType: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
type RawFormValues = z.infer<typeof experienceFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ExperienceFormValues> | undefined;
  onSubmit: (data: ExperienceFormValues) => void;
}

export function ExperienceEditor({
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
  } = useForm<RawFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      id: undefined,
      jobTitle: "",
      organizationId: "",
      employmentType: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      skillsString: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        jobTitle: initialData.jobTitle ?? "",
        organizationId: initialData.organizationId ?? "",
        employmentType: (initialData as any).employmentType ?? "",
        location: initialData.location ?? "",
        startDate: (initialData as any).startDate ?? "",
        endDate: (initialData as any).endDate ?? "",
        isCurrent: (initialData as any).isCurrent ?? false,
        description: initialData.description ?? "",
        skillsString: (initialData.skills ?? []).join(", "),
      });
    } else {
      reset({
        id: undefined,
        jobTitle: "",
        organizationId: "",
        employmentType: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        skillsString: "",
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (values: RawFormValues) => {
    const skills = values.skillsString
      ? values.skillsString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const payload: ExperienceFormValues = {
      id: values.id,
      jobTitle: values.jobTitle,
      organizationName: values.organizationName,
      employmentType: values.employmentType ?? undefined,
      location: values.location ?? undefined,
      startDate: values.startDate ?? undefined,
      endDate: values.endDate ?? undefined,
      isCurrent: !!values.isCurrent,
      description: values.description ?? undefined,
      skills: skills.length ? skills : undefined,
    };
    onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
          <div>
            <Label>Job Title</Label>
            <Controller
              control={control}
              name="jobTitle"
              render={({ field }) => <Input {...field} />}
            />
            {errors.jobTitle && (
              <p className="text-sm text-red-600">{errors.jobTitle.message}</p>
            )}
          </div>

          <div>
            <Label>Organization</Label>
            <Controller
              control={control}
              name="organizationId"
              render={({ field }) => <Input {...field} />}
            />
            {errors.organizationId && (
              <p className="text-sm text-red-600">
                {errors.organizationId.message}
              </p>
            )}
          </div>

          <div>
            <Label>Employment Type</Label>
            <Controller
              control={control}
              name="employmentType"
              render={({ field }) => <Input {...field} />}
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

          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="isCurrent"
              render={({ field }) => (
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(Boolean(v))}
                />
              )}
            />
            <Label className="mb-0">I currently work here</Label>
          </div>

          <div>
            <Label>Location</Label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => <Textarea {...field} rows={4} />}
            />
          </div>

          <div>
            <Label>Skills (comma separated)</Label>
            <Controller
              control={control}
              name="skillsString"
              render={({ field }) => <Input {...field} placeholder="React, Node, Docker" />}
            />
            {errors.skillsString && (
              <p className="text-sm text-red-600">{errors.skillsString.message}</p>
            )}
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

export default ExperienceEditor;