import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib"; // Import pdf-lib
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
import { parseCvFromPdf } from "@/api/endpoints/cvs.api";
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

  /**
   * Helper to merge multiple files (PDFs/Images) into a single PDF Blob
   */
  const mergeFilesToPdf = async (files: File[]): Promise<File> => {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();

      if (file.type === "application/pdf") {
        // Handle PDF merging
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else if (file.type.startsWith("image/")) {
        // Handle Image merging (JPG/PNG)
        let image;
        try {
          if (file.type === "image/jpeg") {
            image = await mergedPdf.embedJpg(arrayBuffer);
          } else if (file.type === "image/png") {
            image = await mergedPdf.embedPng(arrayBuffer);
          }
        } catch (e) {
            console.warn("Unsupported image format, skipping", file.name);
            continue;
        }

        if (image) {
          const page = mergedPdf.addPage([image.width, image.height]);
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          });
        }
      } else {
        // Note: Client-side merging of .doc/.docx is extremely difficult.
        // Usually requires backend conversion.
        console.warn(`Skipping unsupported file type for client-side merge: ${file.type}`);
        toast({
            title: "Skipped File",
            description: `${file.name} could not be merged (DOC/DOCX requires server processing).`
        })
      }
    }

    const pdfBytes = await mergedPdf.save();
    return new File([pdfBytes], "merged_application.pdf", {
      type: "application/pdf",
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Get all selected files
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    setIsUploading(true);

    try {
      // 2. Merge files into one PDF
      const filesArray = Array.from(fileList);
      const mergedFile = await mergeFilesToPdf(filesArray);

      // 3. Proceed with existing flow using the `mergedFile`
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
        file: mergedFile, // Pass the merged PDF here
      };

      const result = await createFileEntity(dto);

      const uploadFileResonse = await uploadFile({
        fileId: signed.fileId,
        data: result,
      });

      const url = uploadFileResonse?.url;

      const parseResult = await parseCvFromPdf(url!);

      if(onUploadSuccess) {
          onUploadSuccess(parseResult.data.extractedText);
      }
      
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: err?.message || "Unable to upload files.",
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
        multiple // Added multiple attribute
        accept=".pdf,.jpg,.jpeg,.png" // Adjusted accept to supported merge types
        className="hidden"
        onChange={handleFile}
      />
      <Button
        size="sm"
        onClick={handleClick}
        disabled={disabled || isUploading}
        aria-label="Choose Files"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Merging..." : "Choose Files"}
      </Button>
    </div>
  );
}

export default UploadFilButton;