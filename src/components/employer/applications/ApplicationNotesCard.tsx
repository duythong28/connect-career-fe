import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";


export default function ApplicationNotesCard() {
  const [applicationNotes, setApplicationNotes] = useState("");

  const handleSaveNotes = () => {
    // In a real app, this would be a mutation
    toast.success("Notes saved (simulated)");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Add your notes about this candidate..."
          value={applicationNotes}
          onChange={(e) => setApplicationNotes(e.target.value)}
          rows={4}
        />
        <Button className="w-full" onClick={handleSaveNotes}>
          Save Notes
        </Button>
      </CardContent>
    </Card>
  );
}