import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import {
  getSignUrl,
  createFileEntity,
  uploadFile,
} from "@/api/endpoints/files.api";
import { toast } from "@/hooks/use-toast";
import type {
  CreateFileEntityDto,
  SignedUploadResponse,
} from "@/api/types/files.types";

interface Props {
  currentUrl?: string | null;
  disabled?: boolean;
  onUploaded: (url: string) => void;
}

export function AvatarEditor({ currentUrl, disabled, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      // 1) Request signed upload metadata from backend
      const signed: SignedUploadResponse = await getSignUrl();

      // 2) Build DTO expected by backend (match CreateFileEntityDto)
      const dto: CreateFileEntityDto = {
        signature: signed.signature,
        timestamp: signed.timestamp,
        cloud_name: signed.cloudName,
        api_key: signed.apiKey,
        public_id: signed.publicId,
        folder: signed.folder || "",
        resourceType: signed.resourceType || "",
        fileId: signed.fileId || "",
        file, // pass File object directly — backend will handle actual upload to cloud
      };

      // 3) Send to backend which will perform the signed upload and return file entity
      const result = await createFileEntity(dto);

      await uploadFile({ fileId: signed.fileId, data: result });

      // 4) Use backend response (expecting file URL or similar)
    //   const publicUrl =
    //     (result as any).fileUrl || (result as any).url || currentUrl || "";
      toast({
        title: "Avatar uploaded",
        description: "Avatar uploaded successfully.",
      });
    //   if (publicUrl) onUploaded(publicUrl);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: err?.message || "Unable to upload avatar.",
      });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        size="sm"
        variant="outline"
        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
        onClick={handleClick}
        disabled={disabled || isUploading}
        aria-label="Upload avatar"
      >
        <Camera className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default AvatarEditor;
