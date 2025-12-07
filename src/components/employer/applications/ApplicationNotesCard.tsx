import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";


export default function ApplicationNotesCard() {
    const [applicationNotes, setApplicationNotes] = useState("");

    const handleSaveNotes = () => {
        // In a real app, this would be a mutation
        toast.success("Notes saved (simulated)");
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <div className="p-1.5 bg-gray-100 text-gray-600 rounded-lg"><MessageSquare size={16} /></div>
                <h3 className="font-bold text-gray-900 text-sm">Internal Notes</h3>
            </div>
            
            {/* Content */}
            <div className="space-y-4">
                <Textarea
                    placeholder="Add your internal notes about this candidate for your team..."
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                    rows={4}
                    className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                />
                <Button className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-sm shadow-sm" onClick={handleSaveNotes}>
                    Save Notes
                </Button>
            </div>
        </div>
    );
}