import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Edit,
  Save,
} from "lucide-react";

const profileSchema = z.object({
  user: z.object({
    fullName: z.string().min(1, "Name required"),
  }),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  socialLinks: z.object({
    linkedin: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    portfolio: z.string().optional().nullable(),
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  data: ProfileFormValues;
  onSave: (payload: Partial<ProfileFormValues>) => void;
  isEditable?: boolean;
}

export function ProfileEditor({ data, onSave, isEditable = true }: Props) {
  const [editing, setEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const submit = (values: ProfileFormValues) => {
    // send only changed/required fields
    const payload: Partial<ProfileFormValues> = {
      user: { fullName: values.user.fullName },
      email: values.email ?? null,
      phone: values.phone ?? null,
      address: values.address ?? null,
      socialLinks: {
        linkedin: values.socialLinks?.linkedin ?? null,
        github: values.socialLinks?.github ?? null,
        portfolio: values.socialLinks?.portfolio ?? null,
      },
    };
    onSave(payload);
    setEditing(false);
  };

  if (!isEditable)
    return (
      <div className="space-y-2">
        <h3 className="text-xl font-bold">{data.user.fullName}</h3>
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{data.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{data.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{data.address}</span>
          </div>
        </div>
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div />
        <div>
          {!editing ? (
            <Button size="sm" onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                reset(data);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {!editing ? (
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-center">
            {data.user.fullName}
          </h3>

          {/* Contact & social — left aligned, name stays centered */}
          <div className="mt-2 text-sm text-left space-y-2 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{data.email ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{data.phone ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{data.address ?? "-"}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {data.socialLinks?.linkedin && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={data.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {data.socialLinks?.github && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={data.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {data.socialLinks?.portfolio && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={data.socialLinks.portfolio}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div className="text-center">
            <Controller
              control={control}
              name="user.fullName"
              render={({ field }) => (
                <Input {...field} className="text-center text-xl font-bold" />
              )}
            />
            {errors.user?.fullName && (
              <p className="text-xs text-destructive">
                {errors.user.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <Controller
                control={control}
                name="email"
                render={({ field }) => <Input {...field} />}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <Controller
                control={control}
                name="phone"
                render={({ field }) => <Input {...field} />}
              />
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <Controller
                control={control}
                name="address"
                render={({ field }) => <Input {...field} />}
              />
            </div>
          </div>

          <hr />

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Linkedin className="w-4 h-4" />
              <Controller
                control={control}
                name="socialLinks.linkedin"
                render={({ field }) => (
                  <Input {...field} placeholder="LinkedIn URL" />
                )}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Github className="w-4 h-4" />
              <Controller
                control={control}
                name="socialLinks.github"
                render={({ field }) => (
                  <Input {...field} placeholder="GitHub URL" />
                )}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <Controller
                control={control}
                name="socialLinks.portfolio"
                render={({ field }) => (
                  <Input {...field} placeholder="Website URL" />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfileEditor;
