import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PipelineTransition } from "@/api/types/pipelines.types";


export default function AvailableActionsSection({
  availableTransitions,
  currentStageName,
  onTransition,
}: {
  availableTransitions: PipelineTransition[];
  currentStageName: string;
  onTransition: (transition: PipelineTransition) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Actions</CardTitle>
        <CardDescription>Current stage: {currentStageName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {availableTransitions.length > 0 ? (
          availableTransitions.map((transition) => {
            const isRejection = transition.toStageKey === "rejected";
            return (
              <Button
                key={transition.id}
                className="w-full justify-between"
                variant={isRejection ? "destructive" : "default"}
                onClick={() => onTransition(transition)}
              >
                <span>{transition.actionName}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No actions available from this stage
          </p>
        )}
      </CardContent>
    </Card>
  );
}