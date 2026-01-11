import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GetMyApplicationsParams,
  ApplicationStatusLabel,
} from "@/api/types/applications.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterBar({
  params,
  setParams,
  setFilterOpen,
}: {
  params: GetMyApplicationsParams;
  setParams: React.Dispatch<React.SetStateAction<GetMyApplicationsParams>>;
  setFilterOpen: (open: boolean) => void;
}) {
  // Reusable Pill Style for Select Trigger - updated to match Design System
  const triggerClass =
    "w-auto h-9 px-3 bg-background border border-border rounded-lg text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 transition-all focus:ring-2 focus:ring-primary/20";

  return (
    <div className="flex flex-wrap items-center gap-3 animate-fade-in">
      <div className="hidden lg:flex flex-row gap-3">
        {/* Status */}
        <Select
          value={params.status ?? "all"}
          onValueChange={(value) =>
            setParams((p) => ({
              ...p,
              status: value === "all" ? undefined : value,
              page: 1,
            }))
          }
        >
          <SelectTrigger className={triggerClass}>
            <span className="text-foreground">Status:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(ApplicationStatusLabel).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Has Interviews */}
        <Select
          value={
            params.hasInterviews === undefined
              ? "all"
              : params.hasInterviews
              ? "yes"
              : "no"
          }
          onValueChange={(value) =>
            setParams((p) => ({
              ...p,
              hasInterviews: value === "all" ? undefined : value === "yes",
              page: 1,
            }))
          }
        >
          <SelectTrigger className={triggerClass}>
            <span className="text-foreground">Interviews:</span> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Has Interviews</SelectItem>
            <SelectItem value="no">No Interviews</SelectItem>
          </SelectContent>
        </Select>

        {/* Has Offers */}
        <Select
          value={
            params.hasOffers === undefined
              ? "all"
              : params.hasOffers
              ? "yes"
              : "no"
          }
          onValueChange={(value) =>
            setParams((p) => ({
              ...p,
              hasOffers: value === "all" ? undefined : value === "yes",
              page: 1,
            }))
          }
        >
          <SelectTrigger className={triggerClass}>
            <span className="text-foreground">Offers:</span> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Has Offers</SelectItem>
            <SelectItem value="no">No Offers</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={params.sortBy ?? "appliedDate"}
          onValueChange={(value) =>
            setParams((p) => ({ ...p, sortBy: value, page: 1 }))
          }
        >
          <SelectTrigger className={triggerClass}>
            <span className="text-foreground">Sort:</span> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="appliedDate">Applied Date</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select
          value={params.sortOrder ?? "DESC"}
          onValueChange={(value) =>
            setParams((p) => ({
              ...p,
              sortOrder: value as "ASC" | "DESC",
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-24 h-9 px-3 bg-background border border-border rounded-lg text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground focus:ring-2 focus:ring-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Newest</SelectItem>
            <SelectItem value="ASC">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        size="sm"
        className="sm:hidden flex items-center gap-2 h-9 border-border text-muted-foreground hover:text-foreground"
        onClick={() => setFilterOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </Button>
    </div>
  );
}
