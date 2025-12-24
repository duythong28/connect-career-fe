import { Button } from "@/components/ui/button";
import { ChevronRight, Zap } from "lucide-react";
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
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                <div className="p-1.5 bg-primary/10 text-primary rounded-xl">
                    <Zap size={16} />
                </div>
                {/* Subheader: text-lg font-bold */}
                <h3 className="text-lg font-bold text-foreground">Next Steps</h3>
            </div>
            
            {/* Metadata Section */}
            <div className="mb-4 text-sm font-medium text-muted-foreground flex items-center gap-2">
                Current Stage: <span className="font-bold text-foreground">{currentStageName}</span>
            </div>

            {/* Actions List */}
            <div className="space-y-3">
                {availableTransitions.length > 0 ? (
                    availableTransitions.map((transition) => {
                        const isRejection = transition.toStageKey === "rejected";
                        
                        // Mapping specific styles based on transition type while adhering to rounded-xl and h-10 rules
                        const buttonStyles = isRejection 
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20" 
                            : "bg-card text-foreground hover:bg-accent border-border";

                        return (
                            <Button
                                key={transition.id}
                                variant="outline"
                                onClick={() => onTransition(transition)}
                                className={`w-full justify-between border shadow-sm text-sm font-bold h-10 rounded-xl transition-all ${buttonStyles}`}
                            >
                                <span className="flex items-center gap-2">
                                    {isRejection ? 'Reject Candidate' : transition.actionName}
                                </span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        );
                    })
                ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-4">
                        No immediate actions available from this stage.
                    </p>
                )}
            </div>
        </div>
    );
}