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
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
      <div className="hidden sm:flex flex-1 flex-wrap gap-2">
        <div className="flex-1 flex flex-wrap gap-2">
          {/* Status filter */}
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
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
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
                hasInterviews:
                  value === "all" ? undefined : value === "yes" ? true : false,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Interviews" />
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
                hasOffers:
                  value === "all" ? undefined : value === "yes" ? true : false,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Offers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Has Offers</SelectItem>
              <SelectItem value="no">No Offers</SelectItem>
            </SelectContent>
          </Select>
          {/* Awaiting Response */}
          <Select
            value={
              params.awaitingResponse === undefined
                ? "all"
                : params.awaitingResponse
                ? "yes"
                : "no"
            }
            onValueChange={(value) =>
              setParams((p) => ({
                ...p,
                awaitingResponse:
                  value === "all" ? undefined : value === "yes" ? true : false,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Awaiting Response" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Awaiting Response</SelectItem>
              <SelectItem value="no">Not Awaiting</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Sort */}
        <div className="flex gap-2">
          <Select
            value={params.sortBy ?? "appliedDate"}
            onValueChange={(value) =>
              setParams((p) => ({
                ...p,
                sortBy: value,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appliedDate">Applied Date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
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
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Newest</SelectItem>
              <SelectItem value="ASC">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Mobile filter button */}
      <div className="flex sm:hidden">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setFilterOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}
