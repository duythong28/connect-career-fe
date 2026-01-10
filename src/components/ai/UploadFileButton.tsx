import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Plus,
  FileIcon,
  FileImage,
  FileType,
  Loader2,
  Trash2,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import axios from "axios";

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

const CONVERT_API_SECRET = import.meta.env.VITE_CONVERT_API_SECRET;

interface Props {
  disabled?: boolean;
  onUploadSuccess?: (extractedData: ExtractedCvData | null) => void;
  onUploadProcess?: (isProcessing: boolean) => void;
}

export function UploadFilButton({
  disabled,
  onUploadSuccess,
  onUploadProcess,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf")
      return <FileText className="w-8 h-8 text-red-500" />;
    if (file.type.startsWith("image/"))
      return <FileImage className="w-8 h-8 text-blue-500" />;
    if (file.name.match(/\.(doc|docx)$/))
      return <FileType className="w-8 h-8 text-blue-700" />;
    if (file.name.match(/\.(ppt|pptx)$/))
      return <FileType className="w-8 h-8 text-orange-600" />;
    return <FileIcon className="w-8 h-8 text-gray-500" />;
  };

  const convertOfficeToPdf = async (file: File): Promise<ArrayBuffer> => {
    let fromFormat = "";
    if (file.name.endsWith(".docx")) fromFormat = "docx";
    else if (file.name.endsWith(".doc")) fromFormat = "doc";
    else if (file.name.endsWith(".pptx")) fromFormat = "pptx";
    else if (file.name.endsWith(".ppt")) fromFormat = "ppt";

    if (!fromFormat) throw new Error("Unsupported format");

    const formData = new FormData();
    formData.append("File", file);
    formData.append("StoreFile", "true");

    const convertResponse = await axios.post(
      `https://v2.convertapi.com/convert/${fromFormat}/to/pdf?Secret=${CONVERT_API_SECRET}`,
      formData
    );

    if (
      !convertResponse.data.Files ||
      convertResponse.data.Files.length === 0
    ) {
      throw new Error("ConvertAPI did not return any files.");
    }

    const downloadUrl = convertResponse.data.Files[0].Url;
    const fileResponse = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
    });
    return fileResponse.data;
  };

  const mergeFilesToPdf = async (filesToMerge: File[]): Promise<File> => {
    const mergedPdf = await PDFDocument.create();
    let hasValidPages = false;

    for (const file of filesToMerge) {
      try {
        let pdfBuffer: ArrayBuffer | null = null;
        setStatusMessage(`Processing: ${file.name}...`);

        if (file.type.startsWith("image/")) {
          const imageBytes = await file.arrayBuffer();
          let image;
          if (file.type === "image/jpeg")
            image = await mergedPdf.embedJpg(imageBytes);
          else if (file.type === "image/png")
            image = await mergedPdf.embedPng(imageBytes);

          if (image) {
            const page = mergedPdf.addPage([image.width, image.height]);
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            });
            hasValidPages = true;
          }
          continue;
        } else if (file.type === "application/pdf") {
          pdfBuffer = await file.arrayBuffer();
        } else if (file.name.match(/\.(doc|docx|ppt|pptx)$/)) {
          try {
            setStatusMessage(`Converting ${file.name} (via API)...`);
            pdfBuffer = await convertOfficeToPdf(file);
          } catch (e) {
            console.error("Convert API error", e);
            toast({
              title: "Convert Failed",
              description: `Failed to convert ${file.name}. Check Console.`,
              variant: "destructive",
            });
            continue;
          }
        }

        if (pdfBuffer) {
          const pdf = await PDFDocument.load(pdfBuffer);
          const copiedPages = await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          hasValidPages = true;
        }
      } catch (err) {
        console.error(`Error merging ${file.name}`, err);
      }
    }

    if (!hasValidPages) throw new Error("No readable content found to merge.");
    const pdfBytes = await mergedPdf.save();
    return new File([pdfBytes], "merged_application.pdf", {
      type: "application/pdf",
    });
  };

  const handleTriggerSelect = () => {
    if (disabled || isProcessing) return;
    inputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    if (isSuccess) {
      setIsSuccess(false);
      setFiles(Array.from(selected));
      if (onUploadSuccess) onUploadSuccess(null);
    } else {
      setFiles((prev) => [...prev, ...Array.from(selected)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRedo = () => {
    setFiles([]);
    setIsSuccess(false);
    setIsProcessing(false);
    if (onUploadProcess) {
      onUploadProcess(false);
    }
    setStatusMessage("");

    if (onUploadSuccess) onUploadSuccess(null);
  };

  const handleConfirmUpload = async () => {
    if (files.length === 0) return;
    if (!CONVERT_API_SECRET) {
      toast({
        title: "Config Error",
        description: "Missing CONVERT_API_SECRET",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    if (onUploadProcess) {
      onUploadProcess(true);
    }

    try {
      setStatusMessage("Merging documents...");
      const mergedFile = await mergeFilesToPdf(files);

      setStatusMessage("Preparing upload...");
      const signed: SignedUploadResponse = await getSignUrl();

      setStatusMessage("Uploading...");
      const dto: CreateFileEntityDto = {
        signature: signed.signature,
        timestamp: signed.timestamp,
        cloud_name: signed.cloudName,
        api_key: signed.apiKey,
        public_id: signed.publicId,
        folder: signed.folder || "",
        resourceType: signed.resourceType || "",
        fileId: signed.fileId || "",
        file: mergedFile,
      };

      const result = await createFileEntity(dto);
      const uploadFileResonse = await uploadFile({
        fileId: signed.fileId,
        data: result,
      });

      setStatusMessage("Analyzing CV...");
      const parseResult = await parseCvFromPdf(uploadFileResonse?.url!);

      toast({ title: "Success", description: "Upload completed!" });
      setIsSuccess(true);

      if (onUploadSuccess) onUploadSuccess(parseResult.data.extractedText);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      if (onUploadProcess) {
        onUploadProcess(false);
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,application/pdf,image/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
        className="hidden"
        onChange={handleFileSelect}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = "";
        }}
      />

      {isSuccess ? (
        // UI KHI THÀNH CÔNG -> Hiện nút REDO
        <div className="border border-green-200 bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <h3 className="font-semibold text-green-800">
              Files Processed Successfully!
            </h3>
            <p className="text-sm text-green-600 text-center">
              Merged {files.length} files.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleRedo}
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Upload New / Redo
          </Button>
        </div>
      ) : (
        <>
          {files.length > 0 && (
            <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">
                  Selected ({files.length})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-red-500 hover:bg-red-50"
                  onClick={() => setFiles([])}
                  disabled={isProcessing}
                >
                  Clear All
                </Button>
              </div>
              <div className="max-h-[200px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-slate-100 rounded hover:bg-slate-50 group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {getFileIcon(file)}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    {!isProcessing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {files.length === 0 ? (
              <Button
                variant="outline"
                className="w-full h-24 border-dashed border-2 flex flex-col gap-2 text-slate-500 hover:border-blue-500 hover:bg-blue-50 transition-all"
                onClick={handleTriggerSelect}
                disabled={disabled || isProcessing}
              >
                <Upload className="w-8 h-8 opacity-50" />
                <span>Drop files or click to upload</span>
                <span className="text-xs text-slate-400 font-normal">
                  (PDF, DOCX, PPTX, Images)
                </span>
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white hover:bg-gray-50 text-slate-700 border-slate-200"
                  onClick={handleTriggerSelect}
                  disabled={disabled || isProcessing}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add More
                </Button>

                <Button
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleConfirmUpload}
                  disabled={disabled || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      {statusMessage}
                    </>
                  ) : (
                    `Confirm Upload (${files.length})`
                  )}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UploadFilButton;
