import React from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function FilterDialog({
  open,
  onOpenChange,
  params,
  setParams,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  params: GetMyApplicationsParams;
  setParams: React.Dispatch<React.SetStateAction<GetMyApplicationsParams>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-card border border-border rounded-3xl shadow-xl animate-fade-in">
        <DialogHeader className="p-4 pb-0 sm:p-0">
          <DialogTitle className="text-xl font-bold text-foreground">Filters</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-5 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
          }}
        >
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Status</Label>
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
              <SelectTrigger className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary h-11">
                <SelectValue placeholder="All Statuses" />
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
          </div>
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Has Interviews</Label>
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
                    value === "all"
                      ? undefined
                      : value === "yes"
                      ? true
                      : false,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary h-11">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Has Interviews</SelectItem>
                <SelectItem value="no">No Interviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Has Offers</Label>
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
                    value === "all"
                      ? undefined
                      : value === "yes"
                      ? true
                      : false,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary h-11">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Has Offers</SelectItem>
                <SelectItem value="no">No Offers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Awaiting Response</Label>
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
                    value === "all"
                      ? undefined
                      : value === "yes"
                      ? true
                      : false,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary h-11">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Awaiting Response</SelectItem>
                <SelectItem value="no">Not Awaiting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Sort By</Label>
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
              <SelectTrigger className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appliedDate">Applied Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Order</Label>
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
              <SelectTrigger className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary h-11">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Newest</SelectItem>
                <SelectItem value="ASC">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogClose asChild>
            <Button type="submit" variant="default" className="w-full mt-4 rounded-xl font-bold h-11">
              Apply Filters
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}