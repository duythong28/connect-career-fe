import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBillableActions,
  createBillableAction,
  updateBillableActionPrice,
} from "@/api/endpoints/wallet.api";
import {
  CreateBillableActionRequest,
  BillableAction,
} from "@/api/types/wallet.types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Coins, Plus, Pencil, Tag, FileText } from "lucide-react";

const BillableActionPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<BillableAction | null>(null);

  // Form States
  const [newActionData, setNewActionData] = useState<Partial<CreateBillableActionRequest>>({
    currency: "USD",
    category: "recruiter",
  });
  const [editPrice, setEditPrice] = useState("");

  // 1. Fetch Actions
  const { data, isLoading } = useQuery({
    queryKey: ["billable-actions", page],
    queryFn: () => getBillableActions({ pageNumber: page, pageSize: 10 }),
  });

  // 2. Create Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateBillableActionRequest) => createBillableAction(data),
    onSuccess: () => {
      toast({ title: "Action created successfully" });
      setIsCreateOpen(false);
      setNewActionData({ currency: "USD", category: "recruiter" }); // Reset
      queryClient.invalidateQueries({ queryKey: ["billable-actions"] });
    },
    onError: (err: any) => {
      toast({
        title: "Failed to create action",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // 3. Update Price Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, cost }: { id: string; cost: number }) =>
      updateBillableActionPrice(id, { cost }),
    onSuccess: () => {
      toast({ title: "Price updated successfully" });
      setIsEditOpen(false);
      setEditPrice("");
      setSelectedAction(null);
      queryClient.invalidateQueries({ queryKey: ["billable-actions"] });
    },
    onError: (err: any) => {
      toast({
        title: "Failed to update price",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    if (
      !newActionData.actionCode ||
      !newActionData.actionName ||
      newActionData.cost === undefined || // Allow 0, but check undefined
      !newActionData.category
    ) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (newActionData.cost < 0) {
      toast({ title: "Cost cannot be negative", variant: "destructive" });
      return;
    }

    createMutation.mutate(newActionData as CreateBillableActionRequest);
  };

  const handleEditClick = (action: BillableAction) => {
    setSelectedAction(action);
    setEditPrice(action.cost.toString());
    setIsEditOpen(true);
  };

  const handleUpdatePrice = () => {
    if (!selectedAction || !editPrice) return;
    
    const costValue = parseFloat(editPrice);
    if (costValue < 0) {
      toast({ title: "Cost cannot be negative", variant: "destructive" });
      return;
    }

    updateMutation.mutate({
      id: selectedAction.id,
      cost: costValue,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Billable Actions
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage system actions and their costs
              </p>
            </div>
          </div>
          {/* <Button onClick={() => setIsCreateOpen(true)} className="h-10">
            <Plus className="h-4 w-4 mr-2" />
            Create Action
          </Button> */}
        </div>

        {/* Main Content Card */}
        <Card className="rounded-3xl border-border bg-card shadow-none">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading actions...
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 pl-6 w-[25%]">
                        Action Name / Code
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 w-[15%]">
                        Category
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 w-[15%]">
                        Cost
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 w-[30%]">
                        Description
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 text-right pr-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.items ?? []).map((action: BillableAction) => (
                      <TableRow
                        key={action.id}
                        className="border-border hover:bg-muted/30"
                      >
                        <TableCell className="pl-6 py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">
                              {action.actionName}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded w-fit">
                              {action.actionCode}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="capitalize rounded-lg border-border font-medium"
                            >
                              {action.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <span className="font-bold text-foreground">
                            {parseFloat(action.cost.toString()).toLocaleString()} {action.currency}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm align-top whitespace-normal break-words">
                          {action.description || "-"}
                        </TableCell>
                        <TableCell className="text-right pr-6 align-top">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleEditClick(action)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Edit Price
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!data?.items || data.items.length === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No billable actions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="h-9"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground px-2">
                    Page {page} of {data?.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    className="h-9"
                    disabled={!data || page === data.totalPages}
                    onClick={() => setPage((p) => Math.min(data?.totalPages || 1, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Create Action Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg bg-card border-border sm:rounded-3xl p-0 overflow-hidden gap-0">
            <DialogHeader className="p-6 pb-2 border-b border-border">
              <DialogTitle className="text-xl font-bold text-foreground">
                Create Billable Action
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Action Code</Label>
                  <Input
                    placeholder="e.g. VIEW_CV"
                    value={newActionData.actionCode || ""}
                    onChange={(e) =>
                      setNewActionData({ ...newActionData, actionCode: e.target.value.toUpperCase() })
                    }
                    className="rounded-xl border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Category</Label>
                  <Select
                    value={newActionData.category}
                    onValueChange={(val) =>
                      setNewActionData({ ...newActionData, category: val })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="candidate">Candidate</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Action Name</Label>
                <Input
                  placeholder="e.g. View Candidate CV"
                  value={newActionData.actionName || ""}
                  onChange={(e) =>
                    setNewActionData({ ...newActionData, actionName: e.target.value })
                  }
                  className="rounded-xl border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Cost</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newActionData.cost ?? ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        setNewActionData({ ...newActionData, cost: val });
                      } else if (e.target.value === "") {
                        setNewActionData({ ...newActionData, cost: undefined });
                      }
                    }}
                    className="rounded-xl border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Currency</Label>
                  <Input
                    value={newActionData.currency}
                    disabled
                    className="rounded-xl border-border bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Description</Label>
                <Textarea
                  placeholder="Describe what this action does..."
                  value={newActionData.description || ""}
                  onChange={(e) =>
                    setNewActionData({ ...newActionData, description: e.target.value })
                  }
                  className="rounded-xl border-border resize-none"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="p-4 bg-[#F8F9FB] border-t border-border">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="h-9">
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || (newActionData.cost !== undefined && newActionData.cost < 0)}
                className="h-9"
              >
                {createMutation.isPending ? "Creating..." : "Create Action"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Price Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md bg-card border-border sm:rounded-3xl p-0 overflow-hidden gap-0">
            <DialogHeader className="p-6 pb-2 border-b border-border">
              <DialogTitle className="text-xl font-bold text-foreground">
                Update Price
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div className="bg-muted/30 p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{selectedAction?.actionName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-mono text-xs">{selectedAction?.actionCode}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-muted-foreground">New Cost ({selectedAction?.currency})</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={editPrice}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      setEditPrice(e.target.value);
                    } else if (e.target.value === "") {
                      setEditPrice("");
                    }
                  }}
                  className="rounded-xl border-border focus:ring-primary text-lg font-semibold"
                />
              </div>
            </div>
            <DialogFooter className="p-4 bg-[#F8F9FB] border-t border-border">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-9">
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePrice}
                disabled={updateMutation.isPending || parseFloat(editPrice) < 0 || editPrice === ""}
                className="h-9"
              >
                {updateMutation.isPending ? "Updating..." : "Confirm Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BillableActionPage;