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

const educationSchema = z.object({
  id: z.string().optional(),
  institutionName: z.string().min(1, "Institution required"),
  degreeType: z.string().min(1, "Degree required"),
  fieldOfStudy: z.string().min(1, "Field required"),
  startDate: z.string().optional().nullable(),
  graduationDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional().nullable(),
});

export type EducationFormValues = z.infer<typeof educationSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<EducationFormValues> | undefined;
  onSubmit: (data: EducationFormValues) => void;
}

export function EducationEditor({
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
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      id: undefined,
      institutionName: "",
      degreeType: "",
      fieldOfStudy: "",
      startDate: "",
      graduationDate: "",
      isCurrent: false,
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) reset({ ...initialData });
    else
      reset({
        id: undefined,
        institutionName: "",
        degreeType: "",
        fieldOfStudy: "",
        startDate: "",
        graduationDate: "",
        isCurrent: false,
        description: "",
      });
  }, [initialData, reset]);

  const onFormSubmit = (values: EducationFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit Education" : "Add Education"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
          <div>
            <Label>Institution</Label>
            <Controller
              control={control}
              name="institutionName"
              render={({ field }) => <Input {...field} />}
            />
            {errors.institutionName && (
              <p className="text-sm text-red-600">
                {errors.institutionName.message}
              </p>
            )}
          </div>

          <div>
            <Label>Degree</Label>
            <Controller
              control={control}
              name="degreeType"
              render={({ field }) => <Input {...field} />}
            />
            {errors.degreeType && (
              <p className="text-sm text-red-600">
                {errors.degreeType.message}
              </p>
            )}
          </div>

          <div>
            <Label>Field of Study</Label>
            <Controller
              control={control}
              name="fieldOfStudy"
              render={({ field }) => <Input {...field} />}
            />
            {errors.fieldOfStudy && (
              <p className="text-sm text-red-600">
                {errors.fieldOfStudy.message}
              </p>
            )}
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
              <Label>Graduation Date</Label>
              <Controller
                control={control}
                name="graduationDate"
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
            <Label className="mb-0">I currently study here</Label>
          </div>

          <div>
            <Label>Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => <Textarea {...field} rows={4} />}
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

export default EducationEditor;
