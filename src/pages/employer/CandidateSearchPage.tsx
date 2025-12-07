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
  const getInitials = (name: string | null, fallback: string) => {
    if (name) {
      const parts = name.split(" ");
      return parts.length > 1
        ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
        : name.charAt(0).toUpperCase();
    }
    return fallback.charAt(0).toUpperCase();
  };

  const displayName =
    candidate.fullName ||
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    candidate.username ||
    "Unknown User";

  return (
    <Card className="border border-gray-200 hover:border-blue-400 transition-all shadow-sm rounded-xl bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Avatar & Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Avatar className="h-14 w-14 border border-gray-100 shrink-0">
              <AvatarImage src={candidate.avatarUrl || candidate.avatar || undefined} />
              <AvatarFallback className="bg-blue-600 text-white font-bold">
                {getInitials(candidate.fullName, candidate.username || "U")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3
                  className="text-lg font-bold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onViewProfile(candidate.id)}
                >
                  {displayName}
                </h3>
                {candidate.emailVerified && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-green-50 text-green-700 border-green-200 font-bold"
                  >
                    Verified
                  </Badge>
                )}
              </div>

              {candidate.email && (
                <p className="text-sm text-gray-500 truncate mb-2">
                  {candidate.email}
                </p>
              )}

              {candidate.phoneNumber && (
                <p className="text-xs text-gray-400 mb-2">
                  {candidate.phoneNumber}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>
                  Joined{" "}
                  {new Date(candidate.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {candidate.lastLoginAt && (
                  <>
                    <span className="text-gray-300">•</span>
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
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(candidate.id)}
              className="text-xs font-bold"
            >
              <UserIcon className="h-3 w-3 mr-1" />
              View Profile
            </Button>
            {currentUserId !== candidate.id && (
              <MessageButton senderId={currentUserId} recieverId={candidate.id} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => (
  <Card className="border border-gray-200 rounded-xl shadow-sm">
    <CardContent className="p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {hasSearch ? "No candidates found" : "Search for candidates"}
      </h3>
      <p className="text-gray-500 text-sm max-w-md mx-auto">
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
      <Card key={i} className="border border-gray-200 rounded-xl">
        <CardContent className="p-5">
          <div className="flex items-start gap-4 animate-pulse">
            <div className="h-14 w-14 bg-gray-200 rounded-full shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-24 bg-gray-200 rounded" />
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
        limit: 20,
      }),
    enabled: true,
  });

  const candidates = data?.people?.items || [];
  const total = data?.people?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleViewProfile = (candidateId: string) => {
    navigate(`/user/${candidateId}/profile`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Candidate Search</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Find and connect with talented candidates
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 border border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, email, or keyword..."
                  className="pl-10 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 text-xs font-bold text-gray-600"
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
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {(page - 1) * 20 + 1}-{Math.min(page * 20, total)}
              </span>{" "}
              of <span className="font-bold text-gray-900">{total}</span>{" "}
              candidates
            </p>
            {isFetching && (
              <span className="text-xs text-blue-600 font-medium">
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
              className="text-xs font-bold"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Page</span>
              <span className="font-bold text-gray-900">{page}</span>
              <span className="text-gray-500">of</span>
              <span className="font-bold text-gray-900">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs font-bold"
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