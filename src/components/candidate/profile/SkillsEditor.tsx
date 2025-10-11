import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface SkillsEditorProps {
  skills: string[];
  isEditable: boolean;
  onUpdate: (skills: string[]) => void;
}

export function SkillsEditor({ skills, isEditable, onUpdate }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState("");
  const [editingSkills, setEditingSkills] = useState<string[]>(skills);

  const addSkill = () => {
    if (newSkill && !editingSkills.includes(newSkill)) {
      const updated = [...editingSkills, newSkill];
      setEditingSkills(updated);
      onUpdate(updated);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    const updated = editingSkills.filter((s) => s !== skill);
    setEditingSkills(updated);
    onUpdate(updated);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {editingSkills.map((skill) => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
            {skill}
            {isEditable && (
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:text-destructive"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      {isEditable && (
        <div className="flex gap-2">
          <Input
            placeholder="Add skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
          />
          <Button size="sm" onClick={addSkill}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}