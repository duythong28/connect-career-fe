import { useQuery } from "@tanstack/react-query";
import { getMyCvs } from "@/api/endpoints/cvs.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import UploadCVButton from "@/components/candidate/profile/UploadCVButton";


export default function CVSTab({ isMyProfile }: { isMyProfile: boolean }) {
  const { data: cvsData } = useQuery({
    queryKey: ["candidateCvs"],
    queryFn: getMyCvs,
    enabled: isMyProfile,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5" /> CVs & Resumes
          </span>
          <UploadCVButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cvsData?.data && cvsData.data.length > 0 ? (
          cvsData.data.map((cv: any) => (
            <div
              key={cv.id}
              className="flex items-center justify-between p-3 border rounded-lg mb-2"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-brand-primary" />
                <div>
                  <p className="font-medium">{cv.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded {cv.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(cv.file.url, "_blank")}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No CVs uploaded yet.</div>
        )}
      </CardContent>
    </Card>
  );
}
