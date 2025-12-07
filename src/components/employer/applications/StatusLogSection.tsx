import { Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import {
    StatusHistoryEntry,
    ApplicationStatusLabel,
    ApplicationStatus,
} from "@/api/types/applications.types";

export default function StatusLogSection({
    statusHistory,
}: {
    statusHistory: StatusHistoryEntry[];
}) {
    if (!statusHistory || statusHistory.length === 0) return null;

    const sorted = [...statusHistory].sort(
        (a, b) =>
            new Date(b.changedAt ?? 0).getTime() -
            new Date(a.changedAt ?? 0).getTime()
    );

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* Header Section */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="p-1.5 text-gray-600 rounded-lg"><Clock size={16} /></div>
                <h3 className="font-bold text-gray-900 text-sm">Application Timeline</h3>
            </div>

            {/* Timeline Content */}
            <div className="relative pl-2 py-2">
                {/* The Vertical Line */}
                <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-gray-100 rounded-full"></div>

                <div className="space-y-6">
                    {sorted.map((log: any, i: number) => {
                        const isLatest = i === 0;
                        const date = new Date(log.changedAt);
                        const statusColor = {
                            [ApplicationStatus.HIRED]: 'text-green-600 border-green-400 ring-green-100',
                            [ApplicationStatus.OFFER]: 'text-purple-600 border-purple-400 ring-purple-100',
                            [ApplicationStatus.REJECTED]: 'text-red-600 border-red-400 ring-red-100',
                            [ApplicationStatus.INTERVIEW]: 'text-blue-600 border-blue-400 ring-blue-100',
                            [ApplicationStatus.SCREENING]: 'text-orange-600 border-orange-400 ring-orange-100',
                        }[log.toStatus] || 'text-gray-500 border-gray-300 ring-gray-100';

                        const icon = log.toStatus === ApplicationStatus.HIRED ? <CheckCircle2 size={12} className="text-white" fill="currentColor" /> : null;

                        return (
                            <div key={i} className="relative flex items-start gap-4 group">
                                {/* Dot */}
                                <div className={`
                                    w-3.5 h-3.5 rounded-full border-[3px] z-10 mt-1 flex-shrink-0 bg-white transition-colors
                                    ${isLatest ? `${statusColor} ring-2` : 'border-gray-300 group-hover:border-gray-400'}
                                    flex items-center justify-center
                                `}>
                                    {icon}
                                </div>

                                <div className="flex-1 -mt-0.5">
                                    <div className={`text-sm font-bold ${isLatest ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {ApplicationStatusLabel[log.toStatus] || log.toStatus}
                                        {log.reason && log.reason !== `Status: ${log.toStatus}` && <span className="text-xs font-medium text-gray-500 ml-2">({log.reason})</span>}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1 flex items-center gap-2">
                                        {format(date, "MMM d, yyyy")}
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        {format(date, "h:mm a")}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}