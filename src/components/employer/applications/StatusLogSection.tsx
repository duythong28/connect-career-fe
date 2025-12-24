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
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
        <div className="p-1.5 text-muted-foreground rounded-xl bg-muted/50">
          <Clock size={16} />
        </div>
        <h3 className="text-lg font-bold text-foreground">Application Timeline</h3>
      </div>

      {/* Timeline Content */}
      <div className="relative pl-2 py-2">
        {/* The Vertical Line */}
        <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-border rounded-full"></div>

        <div className="space-y-6">
          {sorted.map((log: any, i: number) => {
            const isLatest = i === 0;
            const date = new Date(log.changedAt);

            // Mapping Status Colors to Design System Variables
            const statusColor =
              {
                [ApplicationStatus.HIRED]:
                  "text-[hsl(var(--brand-success))] border-[hsl(var(--brand-success))] ring-[hsl(var(--brand-success)/.1)]",
                [ApplicationStatus.OFFER]:
                  "text-primary border-primary ring-primary/10",
                [ApplicationStatus.REJECTED]:
                  "text-destructive border-destructive ring-destructive/10",
                [ApplicationStatus.INTERVIEW]:
                  "text-primary border-primary ring-primary/10",
                [ApplicationStatus.SCREENING]:
                  "text-[hsl(var(--brand-blue-dark))] border-[hsl(var(--brand-blue-dark))] ring-[hsl(var(--brand-blue-dark)/.1)]",
              }[log.toStatus] || "text-muted-foreground border-border ring-muted/10";

            const icon =
              log.toStatus === ApplicationStatus.HIRED ? (
                <CheckCircle2 size={12} className="text-white" fill="currentColor" />
              ) : null;

            return (
              <div key={i} className="relative flex items-start gap-4 group">
                {/* Dot */}
                <div
                  className={`
                    w-3.5 h-3.5 rounded-full border-[3px] z-10 mt-1 flex-shrink-0 bg-card transition-colors
                    ${
                      isLatest
                        ? `${statusColor} ring-2`
                        : "border-border group-hover:border-muted-foreground"
                    }
                    flex items-center justify-center
                  `}
                >
                  {icon}
                </div>

                <div className="flex-1 -mt-0.5">
                  <div
                    className={`text-sm font-bold ${
                      isLatest ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {ApplicationStatusLabel[log.toStatus] || log.toStatus}
                    {log.reason && log.reason !== `Status: ${log.toStatus}` && (
                      <span className="text-xs font-medium text-muted-foreground ml-2">
                        ({log.reason})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1 flex items-center gap-2">
                    {format(date, "MMM d, yyyy")}
                    <span className="w-1 h-1 rounded-full bg-border"></span>
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