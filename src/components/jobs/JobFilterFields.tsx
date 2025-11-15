import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    JobFilters,
    JobSeniorityLevel,
    JobType,
    JobTypeLabel,
} from "@/api/types/jobs.types";


export default function JobFilterFields({
  searchFilters,
  setSearchFilters,
  onClear,
}: {
  searchFilters: JobFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<JobFilters>>;
  onClear?: () => void;
}) {
  return (
    <>
      <div>
        <Label>Keyword</Label>
        <Input
          placeholder="Job title, skills..."
          value={searchFilters.searchTerm ?? ""}
          onChange={(e) =>
            setSearchFilters((prev) => ({
              ...prev,
              searchTerm: e.target.value,
              pageNumber: 1,
            }))
          }
        />
      </div>
      <div>
        <Label>Location</Label>
        <Input
          placeholder="City, state, or remote"
          value={searchFilters.location ?? ""}
          onChange={(e) =>
            setSearchFilters((prev) => ({
              ...prev,
              location: e.target.value,
              pageNumber: 1,
            }))
          }
        />
      </div>
      <div>
        <Label>Job Type</Label>
        <Select
          value={searchFilters.type ?? JobType.ALL}
          onValueChange={(value) =>
            setSearchFilters((prev) => ({
              ...prev,
              type: value === JobType.ALL ? undefined : value,
              pageNumber: 1,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(JobType).map((type) => (
              <SelectItem key={type} value={type}>
                {JobTypeLabel[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Seniority Level</Label>
        <Select
          value={searchFilters.seniorityLevel ?? "all"}
          onValueChange={(value) =>
            setSearchFilters((prev) => ({
              ...prev,
              seniorityLevel: value === "all" ? undefined : value,
              pageNumber: 1,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {Object.values(JobSeniorityLevel).map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Status</Label>
        <Select
          value={searchFilters.status ?? "all"}
          onValueChange={(value) =>
            setSearchFilters((prev) => ({
              ...prev,
              status: value === "all" ? undefined : value,
              pageNumber: 1,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Keywords</Label>
        <Input
          placeholder="Comma separated (e.g. python,typescript)"
          value={searchFilters.keywords?.join(",") ?? ""}
          onChange={(e) =>
            setSearchFilters((prev) => ({
              ...prev,
              keywords: e.target.value
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean),
              pageNumber: 1,
            }))
          }
        />
      </div>
      {/* Responsive: Stack date fields vertically on mobile, horizontally on desktop */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 min-w-0">
          <Label
            htmlFor="postedAfter"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Posted After
          </Label>
          <Input
            id="postedAfter"
            type="date"
            value={searchFilters.postedAfter ?? ""}
            onChange={(e) =>
              setSearchFilters((prev) => ({
                ...prev,
                postedAfter: e.target.value || undefined,
                pageNumber: 1,
              }))
            }
            className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Label
            htmlFor="postedBefore"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Posted Before
          </Label>
          <Input
            id="postedBefore"
            type="date"
            value={searchFilters.postedBefore ?? ""}
            onChange={(e) =>
              setSearchFilters((prev) => ({
                ...prev,
                postedBefore: e.target.value || undefined,
                pageNumber: 1,
              }))
            }
            className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm"
          />
        </div>
      </div>
      {onClear && (
        <Button onClick={onClear} variant="outline" className="w-full mt-2">
          Clear Filters
        </Button>
      )}
    </>
  );
}