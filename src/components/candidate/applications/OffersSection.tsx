import { Button } from "@/components/ui/button";
import { DollarSign, Check, X, MessageSquare } from "lucide-react";
import { OfferStatusLabel, SalaryPeriod } from "@/api/types/offers.types";
import { format } from "date-fns";

// Helper function để định dạng Salary Period
const formatSalaryPeriod = (period: string | undefined): string => {
  if (!period) return "Period N/A";
  switch (period.toLowerCase()) {
    case SalaryPeriod.YEARLY:
      return "Per Year";
    case SalaryPeriod.MONTHLY:
      return "Per Month";
    case SalaryPeriod.WEEKLY:
      return "Per Week";
    case SalaryPeriod.HOURLY:
      return "Per Hour";
    case SalaryPeriod.DAILY:
      return "Per Day";
    case SalaryPeriod.PROJECT:
      return "Per Project";
    default:
      return period.charAt(0).toUpperCase() + period.slice(1);
  }
};

export default function OffersSection({
  offers,
  onAccept,
  onReject,
  onCounter,
  canRespond,
}: any) {
  if (!offers || offers.length === 0) return null;

  const sortedOffers = [...offers].sort(
    (a: any, b: any) =>
      new Date(b.updatedAt || b.createdAt).getTime() -
      new Date(a.updatedAt || a.createdAt).getTime()
  );

  return (
    // PRESERVED: bg-white as requested
    <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
        <div className="p-1.5 bg-green-50 text-green-700 rounded-lg">
          <DollarSign size={16} />
        </div>
        <h3 className="font-bold text-foreground text-sm">
          Offers & Compensation
        </h3>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-4">
        {sortedOffers.map((offer, idx) => {
          const isLatest = idx === 0;
          const isCounter = offer.isOfferedByCandidate;
          const offerDate = offer.updatedAt || offer.createdAt;

          // TÍNH TOÁN STYLING
          // Updated borders to variables, kept bg logic intact
          let borderClass = "border-border bg-white";
          if (offer.status === "accepted")
            borderClass =
              "border-blue-400 bg-white shadow-sm ring-1 ring-blue-100";
          else if (offer.status === "rejected")
            borderClass = "border-border bg-gray-50/50"; // Preserved gray background for rejected
          else if (isLatest)
            borderClass =
              "border-primary bg-white ring-1 ring-primary/20 shadow-sm";

          // Màu Badge Status
          let statusClasses = "bg-secondary text-muted-foreground";

          if (offer.status === "accepted") {
            statusClasses = "bg-green-100 text-green-700";
          } else if (offer.status === "rejected") {
            statusClasses = "bg-red-100 text-red-700";
          } else if (offer.status === "pending") {
            statusClasses = "bg-yellow-100 text-yellow-700";
          }

          return (
            <div
              key={offer.id}
              className={`relative border rounded-2xl p-4 transition-all ${borderClass}`}
            >
              {/* 1. Hàng Giá trị chính và Trạng thái */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {/* Giá trị chính */}
                  <span className="text-lg font-extrabold text-foreground tracking-tight">
                    {Number(offer.baseSalary).toLocaleString()}
                  </span>
                  {/* Currency & Period */}
                  <span className="text-sm font-bold text-muted-foreground">
                    {offer.currency}
                  </span>
                  <span className="text-sm text-muted-foreground/80 font-medium">
                    ({formatSalaryPeriod(offer.salaryPeriod)})
                  </span>

                  {/* Nguồn Offer (Dùng span thay vì Badge) */}
                  <span
                    className={`text-[10px] px-1.5 h-4 font-bold uppercase rounded-full ml-2 bg-primary/10 text-primary border border-primary/20 flex items-center`}
                  >
                    {isCounter ? "Your Counter Offer" : "Offer from company"}
                  </span>

                  {/* Latest (Dùng span thay vì Badge) */}
                  {isLatest && (
                    <span className="bg-secondary text-muted-foreground border border-border text-[9px] px-1.5 h-4 font-bold uppercase rounded-sm ml-1 flex items-center">
                      Latest
                    </span>
                  )}
                </div>

                {/* Status Badge (Dùng span thay vì Badge) */}
                <span
                  className={`h-6 px-2.5 rounded-full font-bold border-0 text-[10px] uppercase flex items-center ${statusClasses}`}
                >
                  {OfferStatusLabel[offer.status] || offer.status}
                </span>
              </div>

              {/* Hàng Metadata (Ngày tháng) */}
              <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-3 pt-1 border-t border-border">
                {offerDate && (
                  <span className="mr-3">
                    {format(new Date(offerDate), "MMM d, yyyy h:mm a")}
                  </span>
                )}
              </div>

              {/* 2. Notes Block */}
              {offer.notes && (
                <div className="mt-3 text-xs text-foreground leading-relaxed pl-3 border-l-2 border-border">
                  <span className="font-bold text-muted-foreground block text-[10px] uppercase mb-1">
                    Note:
                  </span>
                  {offer.notes}
                </div>
              )}

              {/* 3. Actions (Chỉ hiện khi PENDING và là Latest) */}
              {canRespond && isLatest && offer.status === "pending" && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border mt-4">
                  {/* Accept Button (Custom Green preserved for semantic context) */}
                  <Button
                    size="sm"
                    onClick={() => onAccept(offer)}
                    className="flex-1 bg-green-600 text-white font-bold h-9 rounded-xl shadow-sm text-xs transition-none hover:bg-green-700 hover:-translate-y-0.5"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  
                  {/* Counter (Outline) */}
                  {offer.isNegotiable && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCounter(offer)}
                      className="flex-1 font-bold border-border text-foreground h-9 rounded-xl text-xs shadow-sm transition-none hover:bg-secondary"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Negotiate
                    </Button>
                  )}
                  
                  {/* Reject (Ghost with Red Text) */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onReject(offer)}
                    className="font-bold text-destructive hover:bg-destructive/10 h-9 rounded-xl text-xs px-3 transition-none"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}