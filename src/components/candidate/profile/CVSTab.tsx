import { useQuery } from "@tanstack/react-query";
import { getMyCvs } from "@/api/endpoints/cvs.api";
import { FileText, Download, Eye, Plus } from "lucide-react";
import UploadCVButton from "@/components/candidate/profile/UploadCVButton";
import { Button } from "@/components/ui/button";

export default function CVSTab({
  isMyProfile,
  userId,
}: {
  isMyProfile: boolean;
  userId?: string;
}) {
  const { data: cvsData } = useQuery({
    queryKey: ["candidateCvs", userId],
    queryFn: () => getMyCvs(isMyProfile ? "" : userId),
    enabled: userId !== undefined,
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            My Documents
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your resumes and professional credentials.
          </p>
        </div>
        {isMyProfile && <UploadCVButton />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cvsData?.data && cvsData.data.length > 0 ? (
          cvsData.data.map((cv: any) => (
            <div
              key={cv.id}
              className="bg-card border border-border rounded-3xl p-6 hover:border-primary/50 hover:shadow-md transition-all group relative flex flex-col justify-between"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-foreground text-base truncate mb-1"
                    title={cv.title}
                  >
                    {cv.title}
                  </h3>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Uploaded {new Date(cv.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-auto pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(cv.file.url, "_blank")}
                  className="h-9 px-3 text-muted-foreground hover:text-primary hover:bg-primary/10 border-border"
                >
                  <Eye size={16} className="mr-2" /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-muted-foreground hover:text-green-600 hover:bg-green-500/10 border-border"
                >
                  <Download size={16} className="mr-2" /> Download
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 py-16 px-8 text-center border-2 border-dashed border-border rounded-3xl bg-secondary/20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 text-muted-foreground shadow-sm">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No resumes found
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              Upload your first resume to start applying for opportunities in
              the ecosystem.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
