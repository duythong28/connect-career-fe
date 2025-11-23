import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Eye,
  Download,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Application,
  ApplicationStatus,
  ApplicationStatusLabel,
} from "@/api/types/applications.types";


export default function ApplicationInfoSection({
  application,
  showCvPreview,
  setShowCvPreview,
}: {
  application: Application;
  showCvPreview: boolean;
  setShowCvPreview: (v: boolean) => void;
}) {
  const candidate = application.candidate;
  const candidateProfile = application?.candidateProfile;
  const cv = application.cv;
  const cvUrl = cv
    ? `https://res.cloudinary.com/det5zeoa0/image/upload/v1763196412/uploads/${cv.fileName}`
    : null;

  const [showFullCoverLetter, setShowFullCoverLetter] = useState(false);
  const COVER_LETTER_PREVIEW_LENGTH = 400;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Application Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <Avatar className="h-14 w-14 mx-auto sm:mx-0">
            <AvatarImage src={candidate?.avatarUrl ?? undefined} />
            <AvatarFallback>
              {candidate?.firstName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base truncate">
              {candidate?.fullName ||
                `${candidate?.firstName ?? ""} ${candidate?.lastName ?? ""}`}
            </div>
            {candidate?.email && (
              <div className="text-xs text-gray-500 truncate">
                {candidate.email}
              </div>
            )}
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto mt-1"
              onClick={() =>
                candidate?.id &&
                window.open(`/candidate/profile/${candidateProfile.id}`, "_blank")
              }
            >
              View Candidate Profile
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {ApplicationStatusLabel[application.status as ApplicationStatus] ||
              application.status}
          </div>
          {application.appliedDate && (
            <div>
              <span className="font-semibold">Applied:</span>{" "}
              {new Date(application.appliedDate).toLocaleDateString()}
            </div>
          )}
          {candidate?.phoneNumber && (
            <div>
              <span className="font-semibold">Phone:</span>{" "}
              {candidate.phoneNumber}
            </div>
          )}
          {candidate?.status && (
            <div>
              <span className="font-semibold">Candidate Status:</span>{" "}
              {candidate.status}
            </div>
          )}
          {application.matchingScore && (
            <div>
              <span className="font-semibold">Matching Score:</span>{" "}
              {application.matchingScore}%
            </div>
          )}
          {application.notes && (
            <div>
              <span className="font-semibold">Notes:</span> {application.notes}
            </div>
          )}
        </div>
        {cv && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-wrap items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">CV:</span>
              <span className="truncate max-w-[120px]">
                {cv.title || cv.fileName}
              </span>
              {cvUrl && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(cvUrl, "_blank")}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const res = await fetch(cvUrl);
                        if (!res.ok)
                          throw new Error("Network response was not ok");
                        const blob = await res.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = objectUrl;
                        link.download = cv.title || cv.fileName || "cv.pdf";
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
                      } catch {
                        toast.error("Download failed");
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCvPreview(!showCvPreview)}
                  >
                    {showCvPreview ? "Hide CV" : "Show CV"}
                  </Button>
                </>
              )}
            </div>
            {showCvPreview && cvUrl && (
              <div className="w-full h-[400px] border rounded-lg overflow-hidden mt-2">
                <iframe
                  src={cvUrl}
                  title="CV Preview"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </div>
            )}
          </div>
        )}
        {application.coverLetter && (
          <div className="mt-2">
            <Label>Cover Letter</Label>
            <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-700 whitespace-pre-line relative">
              {showFullCoverLetter ||
              application.coverLetter.length <= COVER_LETTER_PREVIEW_LENGTH ? (
                application.coverLetter
              ) : (
                <>
                  {application.coverLetter.slice(
                    0,
                    COVER_LETTER_PREVIEW_LENGTH
                  )}
                  ...
                </>
              )}
              {application.coverLetter.length > COVER_LETTER_PREVIEW_LENGTH && (
                <Button
                  variant="link"
                  size="sm"
                  className="absolute right-2 bottom-2"
                  onClick={() => setShowFullCoverLetter((v) => !v)}
                >
                  {showFullCoverLetter ? "Show less" : "Show more"}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}