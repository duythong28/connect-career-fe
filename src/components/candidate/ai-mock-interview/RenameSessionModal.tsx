import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface RenameSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  onConfirm: (newTitle: string) => Promise<void>;
}

export function RenameSessionModal({
  isOpen,
  onClose,
  currentTitle,
  onConfirm,
}: RenameSessionModalProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNewTitle(currentTitle);
  }, [currentTitle, isOpen]);

  const handleSave = async () => {
    if (!newTitle.trim() || newTitle === currentTitle) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(newTitle.trim());
      onClose();
    } catch (error) {
      console.error("Rename failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="Enter new title..."
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}