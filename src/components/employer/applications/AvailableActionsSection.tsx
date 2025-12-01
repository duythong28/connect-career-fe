import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";
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
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <div className="p-1.5 bg-blue-50 text-[#0EA5E9] rounded-lg"><Zap size={16} /></div>
                <h3 className="font-bold text-gray-900 text-sm">Next Steps</h3>
            </div>
            <div className="mb-4 text-sm font-medium text-gray-700 flex items-center gap-2">
                Current Stage: <span className="font-bold text-gray-900">{currentStageName}</span>
            </div>

            {/* Actions List */}
            <div className="space-y-3">
                {availableTransitions.length > 0 ? (
                    availableTransitions.map((transition) => {
                        const isRejection = transition.toStageKey === "rejected";
                        const buttonClass = isRejection ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200";

                        return (
                            <Button
                                key={transition.id}
                                className={`w-full justify-between border shadow-sm text-sm font-bold ${buttonClass} h-10`}
                                variant="outline"
                                onClick={() => onTransition(transition)}
                            >
                                <span className="flex items-center gap-2">
                                    {isRejection ? 'Reject Candidate' : transition.actionName}
                                </span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-400 italic text-center py-4">
                        No immediate actions available from this stage.
                    </p>
                )}
            </div>
        </div>
    );
}