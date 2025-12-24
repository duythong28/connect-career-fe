import { Button } from "@/components/ui/button";
import { DollarSign, Check, X, MessageSquare, Edit, Ban, Plus } from "lucide-react";
import { format } from "date-fns";
import { OfferResponse, OfferStatus, OfferStatusLabel } from "@/api/types/offers.types";

export default function OffersSection({
    offers,
    isOfferStage,
    onEdit,
    onAddOffer,
    canEdit,
    onAccept,
    onReject,
    onCancel,
    onCounter,
    canRespond,
}: {
    offers: OfferResponse[];
    isOfferStage: boolean;
    onEdit: (offer: OfferResponse) => void;
    onAddOffer: () => void;
    canEdit: (offer: OfferResponse) => boolean;
    onAccept: (offer: OfferResponse) => void;
    onReject: (offer: OfferResponse) => void;
    onCancel: (offer: OfferResponse) => void;
    onCounter: (offer: OfferResponse) => void;
    canRespond: (offer: OfferResponse, idx: number) => boolean;
}) {
    const sortedOffers = [...offers].sort(
        (a: any, b: any) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
    );

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm animate-fade-in">
            {/* Header Section */}
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <div className="p-1.5 text-primary rounded-xl">
                    <DollarSign size={16} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Offers & Compensation</h3>
                {isOfferStage && sortedOffers.length === 0 && (
                    <Button 
                        size="sm" 
                        variant="default"
                        className="ml-auto h-9 rounded-xl text-xs font-bold" 
                        onClick={onAddOffer}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Make Offer
                    </Button>
                )}
                {isOfferStage && sortedOffers.length > 0 && sortedOffers[0].status === OfferStatus.PENDING && !sortedOffers[0].isOfferedByCandidate && (
                    <Button
                        size="sm"
                        variant="destructive"
                        className="ml-auto h-9 rounded-xl text-xs font-bold"
                        onClick={() => onCancel(sortedOffers[0])}
                    >
                        <Ban className="h-4 w-4 mr-1" />
                        Cancel Offer
                    </Button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-4">
                {sortedOffers.length > 0 ? sortedOffers.map((offer, idx) => {
                    const isLatest = idx === 0;
                    const isCounter = offer.isOfferedByCandidate;

                    let borderClass = "border-border bg-card";
                    if (offer.status === OfferStatus.ACCEPTED) borderClass = "border-[hsl(var(--brand-success))] bg-card ring-1 ring-[hsl(var(--brand-success)/0.1)]";
                    else if (offer.status === OfferStatus.REJECTED) borderClass = "border-border bg-muted/30";
                    else if (isLatest && offer.status === OfferStatus.PENDING) borderClass = "border-primary bg-card ring-1 ring-primary/10";

                    let statusClasses = "bg-muted text-muted-foreground";
                    if (offer.status === OfferStatus.ACCEPTED) statusClasses = "bg-emerald-100 text-emerald-700";
                    else if (offer.status === OfferStatus.REJECTED) statusClasses = "bg-destructive/10 text-destructive";
                    else if (offer.status === OfferStatus.PENDING) statusClasses = "bg-amber-100 text-amber-700";

                    const sourceClasses = isCounter ? "bg-primary/10 text-primary border-primary/20" : "bg-purple-100 text-purple-700 border-purple-200";

                    return (
                        <div
                            key={offer.id}
                            className={`relative border rounded-2xl p-4 transition-all ${borderClass}`}
                        >
                            {/* 1. Primary Value and Status Row */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    {/* Primary Value */}
                                    <span className="text-xl font-bold text-foreground tracking-tight">
                                        {Number(offer.baseSalary).toLocaleString()}
                                    </span>
                                    {/* Currency & Period */}
                                    <span className="text-sm font-semibold text-muted-foreground">
                                        {offer.currency}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        ({offer.salaryPeriod})
                                    </span>

                                    {/* Offer Source Badge */}
                                    <span className={`text-[10px] px-2 h-5 font-bold uppercase rounded-full ml-2 border ${sourceClasses} flex items-center`}>
                                        {isCounter ? "Candidate Offer" : "Company Offer"}
                                    </span>

                                    {/* Latest Tag */}
                                    {isLatest && (
                                        <span className="bg-muted text-muted-foreground border border-border text-[9px] px-1.5 h-4 font-bold uppercase rounded-sm ml-1 flex items-center">
                                            Latest
                                        </span>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <span className={`h-6 px-2.5 rounded-full font-bold text-[10px] uppercase flex items-center ${statusClasses}`}>
                                    {OfferStatusLabel[offer.status] || offer.status}
                                </span>
                            </div>

                            {/* Metadata Row (Dates) */}
                            <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-3 pt-1 border-t border-border">
                                <span className="mr-3">
                                    {format(new Date(offer.updatedAt || offer.createdAt), "MMM d, yyyy h:mm a")}
                                </span>
                                {offer.signingBonus && (
                                    <span className="font-bold text-foreground flex items-center gap-1">
                                        <DollarSign size={12} className="text-[hsl(var(--brand-success))]" />
                                        Bonus: {Number(offer.signingBonus).toLocaleString()} {offer.currency}
                                    </span>
                                )}
                            </div>

                            {/* 2. Notes Block */}
                            {offer.notes && (
                                <div className="mt-3 text-xs text-foreground leading-relaxed pl-3 border-l-2 border-border">
                                    <span className="font-bold text-muted-foreground block text-[10px] uppercase mb-1">Note:</span>
                                    {offer.notes}
                                </div>
                            )}

                            {/* 3. Actions */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-border mt-4">
                                {canEdit(offer) && (
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => onEdit(offer)} 
                                        className="text-xs font-bold h-9 rounded-xl px-4"
                                    >
                                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                                        Edit
                                    </Button>
                                )}

                                {canRespond(offer, idx) && (
                                    <>
                                        <Button 
                                            size="sm" 
                                            variant="default"
                                            onClick={() => onAccept(offer)} 
                                            className="bg-[hsl(var(--brand-success))] text-white hover:opacity-90 text-xs font-bold h-9 rounded-xl px-4"
                                        >
                                            <Check className="h-4 w-4 mr-1.5" />
                                            Accept
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => onCounter(offer)} 
                                            className="text-xs font-bold h-9 rounded-xl px-4"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-1.5" />
                                            Counter
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="destructive" 
                                            onClick={() => onReject(offer)} 
                                            className="text-xs font-bold h-9 rounded-xl px-4"
                                        >
                                            <X className="h-4 w-4 mr-1.5" />
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-sm text-muted-foreground italic p-4 text-center">No offers made yet.</div>
                )}
            </div>
        </div>
    );
}