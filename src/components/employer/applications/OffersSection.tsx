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
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* Header Section */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="p-1.5 text-green-700 rounded-lg"><DollarSign size={16} /></div>
                <h3 className="font-bold text-gray-900 text-sm">Offers & Compensation</h3>
                {isOfferStage && sortedOffers.length === 0 && (
                    <Button size="sm" className="ml-auto bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-xs font-bold h-8" onClick={onAddOffer}>
                        <Plus className="h-4 w-4 mr-1" />
                        Make Offer
                    </Button>
                )}
                {isOfferStage && sortedOffers.length > 0 && sortedOffers[0].status === OfferStatus.PENDING && !sortedOffers[0].isOfferedByCandidate && (
                    <Button
                        size="sm"
                        variant="destructive"
                        className="ml-auto bg-red-600 hover:bg-red-700 text-white text-xs font-bold h-8"
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

                    let borderClass = "border-gray-200 bg-white";
                    if (offer.status === OfferStatus.ACCEPTED) borderClass = "border-green-400 bg-white shadow-sm ring-1 ring-green-100";
                    else if (offer.status === OfferStatus.REJECTED) borderClass = "border-gray-200 bg-gray-50/50";
                    else if (isLatest && offer.status === OfferStatus.PENDING) borderClass = "border-[#0EA5E9] bg-white ring-1 ring-blue-100 shadow-sm";

                    let statusClasses = "bg-gray-100 text-gray-600";
                    if (offer.status === OfferStatus.ACCEPTED) statusClasses = "bg-green-100 text-green-700";
                    else if (offer.status === OfferStatus.REJECTED) statusClasses = "bg-red-100 text-red-700";
                    else if (offer.status === OfferStatus.PENDING) statusClasses = "bg-yellow-100 text-yellow-700";

                    const sourceClasses = isCounter ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-purple-100 text-purple-700 border-purple-200";

                    return (
                        <div
                            key={offer.id}
                            className={`relative border rounded-xl p-4 transition-all ${borderClass}`}
                        >
                            {/* 1. Hàng Giá trị chính và Trạng thái */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    {/* Giá trị chính */}
                                    <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                                        {Number(offer.baseSalary).toLocaleString()}
                                    </span>
                                    {/* Currency & Period */}
                                    <span className="text-sm font-bold text-gray-500">
                                        {offer.currency}
                                    </span>
                                    <span className="text-sm text-gray-400 font-medium">
                                        ({offer.salaryPeriod})
                                    </span>

                                    {/* Nguồn Offer */}
                                    <span className={`text-[10px] px-1.5 h-4 font-bold uppercase rounded-full ml-2 border ${sourceClasses} flex items-center`}>
                                        {isCounter ? "Candidate Offer" : "Company Offer"}
                                    </span>

                                    {/* Latest */}
                                    {isLatest && (
                                        <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[9px] px-1.5 h-4 font-bold uppercase rounded-sm ml-1 flex items-center">
                                            Latest
                                        </span>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <span className={`h-6 px-2.5 rounded-full font-bold border-0 text-[10px] uppercase flex items-center ${statusClasses}`}>
                                    {OfferStatusLabel[offer.status] || offer.status}
                                </span>
                            </div>

                            {/* Hàng Metadata (Ngày tháng) */}
                            <div className="flex flex-wrap items-center text-xs text-gray-500 mb-3 pt-1 border-t border-gray-100">
                                <span className="mr-3">
                                    {format(new Date(offer.updatedAt || offer.createdAt), "MMM d, yyyy h:mm a")}
                                </span>
                                {offer.signingBonus && (
                                    <span className="font-bold text-gray-700 flex items-center gap-1">
                                        <DollarSign size={12} className="text-green-500" />
                                        Bonus: {Number(offer.signingBonus).toLocaleString()} {offer.currency}
                                    </span>
                                )}
                            </div>

                            {/* 2. Notes Block */}
                            {offer.notes && (
                                <div className="mt-3 text-xs text-gray-700 leading-relaxed pl-3 border-l-2 border-gray-200">
                                    <span className="font-bold text-gray-500 block text-[10px] uppercase mb-1">Note:</span>
                                    {offer.notes}
                                </div>
                            )}

                            {/* 3. Actions */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 mt-4">
                                {/* Actions for Company Offer (to Edit/Cancel) */}
                                {canEdit(offer) && (
                                    <Button size="sm" variant="outline" onClick={() => onEdit(offer)} className="text-xs font-bold h-8 text-gray-600 hover:bg-gray-100">
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>
                                )}

                                {/* Actions for Candidate Counter Offer (to Respond) */}
                                {canRespond(offer, idx) && (
                                    <>
                                        <Button size="sm" onClick={() => onAccept(offer)} className="bg-green-600 text-white hover:bg-green-700 text-xs font-bold h-8">
                                            <Check className="h-4 w-4 mr-1" />
                                            Accept
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => onCounter(offer)} className="text-xs font-bold h-8 text-gray-700 hover:bg-gray-100">
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            Counter
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => onReject(offer)} className="bg-red-600 text-white hover:bg-red-700 text-xs font-bold h-8">
                                            <X className="h-4 w-4 mr-1" />
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-sm text-gray-400 italic p-4 text-center">No offers made yet.</div>
                )}
            </div>
        </div>
    );
}