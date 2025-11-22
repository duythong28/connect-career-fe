import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Edit, MessageSquare, Plus, DollarSign, Check, X } from "lucide-react";
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
  if (!isOfferStage && offers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Offers
        </CardTitle>
        {isOfferStage &&
          offers.length > 0 &&
          offers[0].status === OfferStatus.PENDING && (
            <Button
              size="sm"
              variant="destructive"
              className="ml-auto"
              onClick={() => onCancel(offers[0])}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel Offer
            </Button>
          )}
        {isOfferStage && offers.length === 0 && (
          <Button size="sm" className="ml-auto" onClick={onAddOffer}>
            <Plus className="h-4 w-4 mr-1" />
            Make Offer
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          {offers
            .sort(
              (a, b) =>
                new Date(b.updatedAt || b.createdAt).getTime() -
                new Date(a.updatedAt || a.createdAt).getTime()
            )
            .map((offer, idx) => (
              <div
                key={offer.id}
                className={`border rounded-lg p-4 space-y-3 ${
                  idx === 0 ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold">
                        {Number(offer.baseSalary).toLocaleString()}{" "}
                        {offer.currency}
                      </h4>
                      {idx === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Latest
                        </Badge>
                      )}
                      {offer.isOfferedByCandidate ? (
                        <Badge variant="secondary" className="text-xs">
                          Candidate Offer
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          Company Offer
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {offer.salaryPeriod}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(offer.updatedAt || offer.createdAt),
                        "PPP p"
                      )}
                      {offer.isOfferedByCandidate
                        ? " • Candidate counter offer"
                        : " • Offer from company"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      offer.status === "accepted"
                        ? "default"
                        : offer.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {OfferStatusLabel[offer.status] || offer.status}
                  </Badge>
                </div>
                {offer.signingBonus && (
                  <div className="text-sm">
                    <Label>Signing Bonus</Label>
                    <p className="text-muted-foreground mt-1">
                      {Number(offer.signingBonus).toLocaleString()}{" "}
                      {offer.currency}
                    </p>
                  </div>
                )}
                {offer.notes && (
                  <div className="text-sm">
                    <Label>Notes</Label>
                    <p className="text-muted-foreground mt-1">{offer.notes}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  {offer.isNegotiable && (
                    <Badge variant="outline">Negotiable</Badge>
                  )}
                  {offer.isOfferedByCandidate ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      🙋‍♂️ Candidate Counter Offer
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                    >
                      🏢 Company's Offer
                    </Badge>
                  )}
                </div>
                {/* Action buttons */}
                {canEdit(offer) && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(offer)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
                {canRespond(offer, idx) && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 pt-2">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => onAccept(offer)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    {offer.isNegotiable && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => onCounter(offer)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Counter
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={() => onReject(offer)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
