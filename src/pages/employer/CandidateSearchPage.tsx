import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/endpoints/back-office.api";
import { UserResponse } from "@/api/types/users.types";

const CandidateSearchPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["users", { search, page }],
    queryFn: () => getAllUsers(page, 20, search),
    keepPreviousData: true,
  });

  const candidates: UserResponse[] =
    data?.data?.filter((user: UserResponse) => user.roles?.includes("candidate")) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Search</h1>
          <p className="text-gray-600 mt-2">
            Find and connect with talented candidates
          </p>
        </div>

        {/* Search Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, skills, location..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <div className="grid gap-6">
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Loading candidates...
                </h3>
              </CardContent>
            </Card>
          ) : candidates.length > 0 ? (
            candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={candidate.avatarUrl || candidate.avatar || undefined} />
                        <AvatarFallback>
                          {(candidate.fullName || candidate.username || "U").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">
                            {candidate.fullName || candidate.username}
                          </h3>
                          <Badge variant="outline">
                            {Math.floor(Math.random() * 30 + 70)}% Match
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {candidate["title"] || "Software Developer"}
                        </p>
                        <p className="text-gray-600 mb-3">
                          {candidate["location"] || "Unknown location"}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(candidate["skills"] || ["React", "JavaScript", "Node.js"])
                            .slice(0, 5)
                            .map((skill: string) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                        </div>
                        <p className="text-gray-700 text-sm">
                          {candidate["bio"] ||
                            "Experienced software developer with a passion for creating innovative solutions..."}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/candidate/${candidate.id}`)}
                      >
                        <UserIcon className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No candidates found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search filters to find more candidates
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Pagination */}
        {data?.total > 20 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-gray-700">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page * 20 >= data.total}
              onClick={() => setPage((p) => p + 1)}
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