import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MapPin, Star, MessageCircle, Eye } from "lucide-react";
import { Candidate } from "@/lib/types";
import { mockExtendedCandidates } from "@/lib/mock-data";

export function CandidateSearch() {
  const [candidates] = useState<Candidate[]>(mockExtendedCandidates as Candidate[]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(candidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCandidates(candidates);
      return;
    }

    const filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(query.toLowerCase()) ||
      candidate.title.toLowerCase().includes(query.toLowerCase()) ||
      candidate.location.toLowerCase().includes(query.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredCandidates(filtered);
  };

  const handleSkillFilter = (skill: string) => {
    const filtered = candidates.filter(candidate =>
      candidate.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    setFilteredCandidates(filtered);
    setSearchQuery(skill);
  };

  const viewCandidateProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  // Get unique skills for quick filter buttons
  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills))).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find Candidates</h1>
        <p className="text-muted-foreground">Search and discover talented candidates for your open positions</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, title, location, or skills..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Quick skill filters:</p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSkillFilter(skill)}
                  >
                    {skill}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredCandidates(candidates);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          {filteredCandidates.length} candidates found
        </p>
        
        <div className="grid gap-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.avatar} />
                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          <p className="text-muted-foreground">{candidate.title}</p>
                        </div>
                        <Badge variant={candidate.status === 'active' ? 'default' : 'secondary'}>
                          {candidate.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {candidate.location}
                        </span>
                        <span>{candidate.experience}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => viewCandidateProfile(candidate)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{candidate.name}</DialogTitle>
                          <DialogDescription>{candidate.title}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{candidate.name}</h3>
                              <p className="text-muted-foreground">{candidate.title}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {candidate.location}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Experience</h4>
                            <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            <Button className="flex-1">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Star className="h-4 w-4 mr-2" />
                              Save Candidate
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredCandidates.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find more candidates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}