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

const awardSchema = z.object({
  id: z.string().optional(),
  candidateProfileId: z.string().optional(),
  title: z.string().min(1, "Title required"),
  issuer: z.string().min(1, "Issuer required"),
  dateReceived: z.string().min(1, "Date required"), // ISO string
  description: z.string().optional().nullable(),
  certificateUrl: z.string().optional().nullable(),
});

export type AwardFormValues = z.infer<typeof awardSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<AwardFormValues> | undefined;
  onSubmit: (data: AwardFormValues) => void;
}

export function AwardEditor({
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
  } = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      id: undefined,
      candidateProfileId: undefined,
      title: "",
      issuer: "",
      dateReceived: "",
      description: "",
      certificateUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) reset({ ...initialData });
    else reset({
      id: undefined,
      candidateProfileId: undefined,
      title: "",
      issuer: "",
      dateReceived: "",
      description: "",
      certificateUrl: "",
    });
  }, [initialData, reset]);

  const onFormSubmit = (values: AwardFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit Award" : "Add Award"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
          <div>
            <Label>Title</Label>
            <Controller control={control} name="title" render={({ field }) => <Input {...field} />} />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>
          <div>
            <Label>Issuer</Label>
            <Controller control={control} name="issuer" render={({ field }) => <Input {...field} />} />
            {errors.issuer && <p className="text-sm text-red-600">{errors.issuer.message}</p>}
          </div>
          <div>
            <Label>Date Received</Label>
            <Controller control={control} name="dateReceived" render={({ field }) => <Input {...field} type="date" />} />
            {errors.dateReceived && <p className="text-sm text-red-600">{errors.dateReceived.message}</p>}
          </div>
          <div>
            <Label>Description</Label>
            <Controller control={control} name="description" render={({ field }) => <Textarea {...field} rows={3} />} />
          </div>
          <div>
            <Label>Certificate URL</Label>
            <Controller control={control} name="certificateUrl" render={({ field }) => <Input {...field} />} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AwardEditor;