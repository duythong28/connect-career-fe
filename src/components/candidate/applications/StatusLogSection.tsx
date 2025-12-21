import { format } from "date-fns";

export default function StatusLogSection({ statusHistory }: any) {
  if (!statusHistory || statusHistory.length === 0)
    return (
      <div className="text-xs text-muted-foreground italic p-4 text-center">
        No status changes recorded.
      </div>
    );

  const sorted = [...statusHistory].sort(
    (a: any, b: any) =>
      new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="relative pl-2 py-2">
      {/* The Vertical Line */}
      <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-border rounded-full"></div>

      <div className="space-y-6">
        {sorted.map((log: any, i: number) => {
          const isLatest = i === 0;
          return (
            <div key={i} className="relative flex items-start gap-4 group">
              {/* Dot */}
              <div
                className={`
                  w-3.5 h-3.5 rounded-full border-[3px] z-10 mt-1 flex-shrink-0 bg-background transition-colors
                  ${
                    isLatest
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border group-hover:border-primary/50"
                  }
                `}
              ></div>

              <div className="flex-1 -mt-0.5">
                <div
                  className={`text-sm font-bold ${
                    isLatest ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {log.reason || `Status: ${log.toStatus}`}
                </div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mt-1 flex items-center gap-2">
                  {log.changedAt
                    ? format(new Date(log.changedAt), "MMM d, yyyy")
                    : ""}
                  <span className="w-1 h-1 rounded-full bg-border"></span>
                  {log.changedAt
                    ? format(new Date(log.changedAt), "h:mm a")
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}