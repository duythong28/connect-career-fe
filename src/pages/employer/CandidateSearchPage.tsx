import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Search, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "@/api/types/users.types";
import { searchUsers } from "@/api/endpoints/users.api";
import { useAuth } from "@/hooks/useAuth";
import MessageButton from "@/components/chat/MessageButton";

// --- Sub-Components ---

interface CandidateCardProps {
  candidate: UserResponse;
  currentUserId: string;
  onViewProfile: (id: string) => void;
}

const CandidateCard = ({
  candidate,
  currentUserId,
  onViewProfile,
}: CandidateCardProps) => {
  // Helper to generate initials
  const getInitials = (name: string | null, fallback: string) => {
    if (name) {
      const parts = name.split(" ");
      return parts.length > 1
        ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
        : name.charAt(0).toUpperCase();
    }
    return fallback.charAt(0).toUpperCase();
  };

  // Determine display name
  const displayName =
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    candidate.fullName ||
    candidate.username ||
    "Unknown User";

  return (
    <Card className="rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary">
      {/* Reduced padding (p-4) for compactness */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Avatar & Info */}
          <div className="flex flex-1 min-w-0 items-start gap-3">
            <Avatar className="h-12 w-12 shrink-0 border border-border">
              <AvatarImage
                src={candidate.avatarUrl || candidate.avatar || undefined}
                alt={displayName}
              />
              <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                {getInitials(candidate.fullName, candidate.username || "U")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {/* Subheader style: text-lg, font-bold, text-foreground */}
                <h3 
                  className="cursor-pointer truncate text-lg font-bold text-foreground transition-colors hover:text-primary"
                  onClick={() => candidate.candidateProfileId && onViewProfile(candidate.candidateProfileId)}
                >
                  {displayName}
                </h3>
              </div>

              {/* Metadata: text-xs, text-muted-foreground */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>
                  Joined{" "}
                  {new Date(candidate.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {candidate.lastLoginAt && (
                  <>
                    <span className="text-border">•</span>
                    <span>
                      Last active{" "}
                      {new Date(candidate.lastLoginAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex shrink-0 flex-col gap-2">
            {candidate?.candidateProfileId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(candidate.candidateProfileId)}
                className="h-9 border-border text-xs font-bold"
              >
                <UserIcon className="mr-1 h-3 w-3 text-primary" />
                View Profile
              </Button>
            )}

            {currentUserId !== candidate.id && (
              <div className="h-9">
                <MessageButton
                  senderId={currentUserId}
                  recieverId={candidate.id}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => (
  <Card className="border border-border rounded-3xl bg-card">
    <CardContent className="p-12 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">
        {hasSearch ? "No candidates found" : "Search for candidates"}
      </h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        {hasSearch
          ? "Try adjusting your search query to find more candidates."
          : "Enter a name, email, or keyword to start searching for potential candidates."}
      </p>
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="border border-border rounded-2xl bg-card">
        <CardContent className="p-5">
          <div className="flex items-start gap-4 animate-pulse">
            <div className="h-14 w-14 bg-muted rounded-full shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-9 w-24 bg-muted rounded-xl" />
              <div className="h-9 w-24 bg-muted rounded-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// --- Main Component ---

const CandidateSearchPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["candidate-search", search, page],
    queryFn: () =>
      searchUsers({
        q: search,
        page,
        limit: 60,
      }),
    enabled: true,
  });

  const candidates = data?.people?.items || [];
  const total = data?.people?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleViewProfile = (candidateId: string) => {
    navigate(`/candidate/profile/${candidateId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Candidate Search
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Find and connect with talented candidates
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 border border-border bg-card rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, email, or keyword..."
                  className="pl-10 h-10 border-border rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 text-xs font-bold text-muted-foreground border-border"
                disabled
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!isLoading && candidates.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {(page - 1) * 20 + 1}-{Math.min(page * 20, total)}
              </span>{" "}
              of <span className="font-bold text-foreground">{total}</span>{" "}
              candidates
            </p>
            {isFetching && (
              <span className="text-xs text-primary font-medium">
                Updating...
              </span>
            )}
          </div>
        )}

        {/* Candidates List */}
        <div className="space-y-4">
          {isLoading ? (
            <LoadingState />
          ) : candidates.length > 0 ? (
            candidates.map((candidate: UserResponse) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                currentUserId={user?.id || ""}
                onViewProfile={handleViewProfile}
              />
            ))
          ) : (
            <EmptyState hasSearch={search.length > 0} />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 text-xs font-bold border-border"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Page</span>
              <span className="font-bold text-foreground">{page}</span>
              <span className="text-muted-foreground">of</span>
              <span className="font-bold text-foreground">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 text-xs font-bold border-border"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateSearchPage;
