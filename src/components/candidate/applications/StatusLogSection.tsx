import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import {
  StatusHistoryEntry,
} from "@/api/types/applications.types";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function StatusLogSection({
  statusHistory,
}: {
  statusHistory: StatusHistoryEntry[];
}) {
  if (!statusHistory || statusHistory.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Status Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusHistory
            .sort(
              (a, b) =>
                new Date(b.changedAt ?? 0).getTime() -
                new Date(a.changedAt ?? 0).getTime()
            )
            .map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{activity.reason}</p>
                  <p className="text-muted-foreground">
                    {activity.changedAt
                      ? format(new Date(activity.changedAt), "PPP p")
                      : ""}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}