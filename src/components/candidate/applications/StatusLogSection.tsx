import { format } from "date-fns";

export default function StatusLogSection({ statusHistory }: any) {
  if (!statusHistory || statusHistory.length === 0) return <div className="text-xs text-gray-400 italic p-4 text-center">No status changes recorded.</div>;
  
  const sorted = [...statusHistory].sort((a: any, b: any) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
  
  return (
    <div className="relative pl-2 py-2">
        {/* The Vertical Line */}
        <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-gray-100 rounded-full"></div>
        
        <div className="space-y-6">
            {sorted.map((log: any, i: number) => {
                const isLatest = i === 0;
                return (
                    <div key={i} className="relative flex items-start gap-4 group">
                        {/* Dot */}
                        <div className={`
                            w-3.5 h-3.5 rounded-full border-[3px] z-10 mt-1 flex-shrink-0 bg-white transition-colors
                            ${isLatest ? 'border-[#0EA5E9] ring-2 ring-blue-50' : 'border-gray-300 group-hover:border-gray-400'}
                        `}>
                        </div>
                        
                        <div className="flex-1 -mt-0.5">
                            <div className={`text-sm font-bold ${isLatest ? 'text-gray-900' : 'text-gray-500'}`}>
                                {log.reason || `Status: ${log.toStatus}`}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1 flex items-center gap-2">
                                {log.changedAt ? format(new Date(log.changedAt), "MMM d, yyyy") : ""}
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                {log.changedAt ? format(new Date(log.changedAt), "h:mm a") : ""}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}