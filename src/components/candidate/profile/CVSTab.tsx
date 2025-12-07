import { useQuery } from "@tanstack/react-query";
import { getMyCvs } from "@/api/endpoints/cvs.api";
import { FileText, Download, Eye, Plus } from "lucide-react";
import UploadCVButton from "@/components/candidate/profile/UploadCVButton";

export default function CVSTab({ isMyProfile }: { isMyProfile: boolean }) {
  const { data: cvsData } = useQuery({ queryKey: ["candidateCvs"], queryFn: getMyCvs, enabled: isMyProfile });

  return (
    <div className="animate-fadeIn">
       <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">My Resumes</h2>
                <p className="text-xs text-gray-500">Manage your uploaded CVs and documents.</p>
            </div>
            <UploadCVButton />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cvsData?.data && cvsData.data.length > 0 ? (
                cvsData.data.map((cv: any) => (
                    <div key={cv.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all group shadow-sm relative">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <FileText size={24}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm truncate mb-1" title={cv.title}>{cv.title}</h3>
                                <div className="text-[10px] text-gray-500">Uploaded {new Date(cv.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => window.open(cv.file.url, "_blank")} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"><Eye size={16}/></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-green-600"><Download size={16}/></button>
                        </div>
                    </div>
                ))
            ) : (
                 <div className="col-span-2 p-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400"><FileText size={24}/></div>
                     <p className="text-sm font-bold text-gray-600">No resumes yet</p>
                     <p className="text-xs text-gray-400">Upload your resume to start applying.</p>
                 </div>
            )}
       </div>
    </div>
  );
}