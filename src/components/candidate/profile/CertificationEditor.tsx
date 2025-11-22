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

const certificationSchema = z.object({
  id: z.string().optional(),
  candidateProfileId: z.string().optional(),
  name: z.string().min(1, "Certification/Scholarship name required"),
  issuingOrganization: z.string().min(1, "Issuing organization required"),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  issueDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
});

export type CertificationFormValues = z.infer<typeof certificationSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<CertificationFormValues> | undefined;
  onSubmit: (data: CertificationFormValues) => void;
}

export function CertificationEditor({
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
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      id: undefined,
      candidateProfileId: undefined,
      name: "",
      issuingOrganization: "",
      credentialId: "",
      credentialUrl: "",
      description: "",
      issueDate: "",
      expiryDate: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
      });
    } else {
      reset({
        id: undefined,
        candidateProfileId: undefined,
        name: "",
        issuingOrganization: "",
        credentialId: "",
        credentialUrl: "",
        description: "",
        issueDate: "",
        expiryDate: "",
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (values: CertificationFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id
              ? "Edit Certification/Scholarship"
              : "Add Certification/Scholarship"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
          <div>
            <Label>Name</Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => <Input {...field} />}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label>Issuing Organization</Label>
            <Controller
              control={control}
              name="issuingOrganization"
              render={({ field }) => <Input {...field} />}
            />
            {errors.issuingOrganization && (
              <p className="text-sm text-red-600">
                {errors.issuingOrganization.message}
              </p>
            )}
          </div>
          <div>
            <Label>Credential ID</Label>
            <Controller
              control={control}
              name="credentialId"
              render={({ field }) => <Input {...field} />}
            />
          </div>
          <div>
            <Label>Credential URL</Label>
            <Controller
              control={control}
              name="credentialUrl"
              render={({ field }) => <Input {...field} />}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => <Textarea {...field} rows={2} />}
            />
          </div>
          <div>
            <Label>Issue Date</Label>
            <Controller
              control={control}
              name="issueDate"
              render={({ field }) => <Input {...field} type="date" />}
            />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Controller
              control={control}
              name="expiryDate"
              render={({ field }) => <Input {...field} type="date" />}
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

export default CertificationEditor;
