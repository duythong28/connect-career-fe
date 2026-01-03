import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
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
import { parseCvFromPdf, uploadCv } from "@/api/endpoints/cvs.api";
import { ExtractedCvData } from "@/api/types/cv.types";

interface Props {
  disabled?: boolean;
  onUploadSuccess?: (extractedData: ExtractedCvData) => void;
}

export function UploadFilButton({ disabled, onUploadSuccess }: Props) {
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
      const signed: SignedUploadResponse = await getSignUrl();

      const dto: CreateFileEntityDto = {
        signature: signed.signature,
        timestamp: signed.timestamp,
        cloud_name: signed.cloudName,
        api_key: signed.apiKey,
        public_id: signed.publicId,
        folder: signed.folder || "",
        resourceType: signed.resourceType || "",
        fileId: signed.fileId || "",
        file,
      };

      const result = await createFileEntity(dto);

      const uploadFileResonse = await uploadFile({
        fileId: signed.fileId,
        data: result,
      });

      const url = uploadFileResonse?.url;

      const parseResult = await parseCvFromPdf(url!);

      onUploadSuccess(parseResult.data.extractedText);

      //   uploadCvMutate(
      //     {
      //       fileId: uploadFileResonse?.id,
      //       title: file.name,
      //       description: file.name,
      //       type: "pdf",
      //       isPublic: true,
      //     },
      //     {
      //       onSuccess: (cv) => {
      //         queryClient.invalidateQueries({ queryKey: ["candidateCvs"] });
      //         toast({
      //           title: "CV uploaded",
      //           description: "CV uploaded successfully.",
      //         });
      //       },
      //       onError: (err: any) => {
      //         console.error(err);
      //         toast({
      //           title: "Upload failed",
      //           description: err?.message || "Unable to upload CV.",
      //         });
      //       },
      //     }
      //   );
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
        // accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        size="sm"
        onClick={handleClick}
        disabled={disabled || isUploading}
        arial-label="Choose File"
      >
        <Upload className="w-4 h-4 mr-2" />
        Choose File
      </Button>
    </div>
  );
}

export default UploadFilButton;
