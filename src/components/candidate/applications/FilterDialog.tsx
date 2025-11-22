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
      <DialogContent className="max-w-md w-full p-6">
        <DialogHeader className="p-4 pb-0 sm:p-0">
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
          }}
        >
          <div>
            <Label>Status</Label>
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
              <SelectTrigger className="w-full">
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
            <Label>Has Interviews</Label>
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
              <SelectTrigger className="w-full">
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
            <Label>Has Offers</Label>
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
              <SelectTrigger className="w-full">
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
            <Label>Awaiting Response</Label>
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
              <SelectTrigger className="w-full">
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
            <Label>Sort By</Label>
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appliedDate">Applied Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Order</Label>
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Newest</SelectItem>
                <SelectItem value="ASC">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogClose asChild>
            <Button type="submit" className="w-full mt-2">
              Apply Filters
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
