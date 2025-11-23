import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Search, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";

const experienceOptions = [
  { value: "all", label: "All levels" },
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior Level (6+ years)" },
];

const educationOptions = [
  { value: "all", label: "All education" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
];

const CandidateSearchPage = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    skills: "",
    location: "",
    experience: "all",
    education: "all",
  });
  const [users] = useState<User[]>(mockUsers);

  const filteredCandidates = users.filter((user) => {
    if (user.role !== "candidate") return false;
    if (
      searchFilters.skills &&
      !user.skills?.some((skill) =>
        skill.toLowerCase().includes(searchFilters.skills.toLowerCase())
      )
    )
      return false;
    if (
      searchFilters.location &&
      !user.location
        ?.toLowerCase()
        .includes(searchFilters.location.toLowerCase())
    )
      return false;
    if (
      searchFilters.experience !== "all" &&
      user.experienceLevel !== searchFilters.experience
    )
      return false;
    if (
      searchFilters.education !== "all" &&
      user.educationLevel !== searchFilters.education
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Search</h1>
          <p className="text-gray-600 mt-2">
            Find and connect with talented candidates
          </p>
        </div>

        {/* Search Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  value={searchFilters.skills}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      skills: e.target.value,
                    })
                  }
                  placeholder="e.g., React, JavaScript"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={searchFilters.location}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Select
                  value={searchFilters.experience}
                  onValueChange={(value) =>
                    setSearchFilters({ ...searchFilters, experience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        // Don't allow empty string as value
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Select
                  value={searchFilters.education}
                  onValueChange={(value) =>
                    setSearchFilters({ ...searchFilters, education: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        // Don't allow empty string as value
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <div className="grid gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={candidate.avatar} />
                      <AvatarFallback>
                        {candidate.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {candidate.name}
                        </h3>
                        <Badge variant="outline">
                          {Math.floor(Math.random() * 30 + 70)}% Match
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-2">
                        {candidate.title || "Software Developer"}
                      </p>
                      <p className="text-gray-600 mb-3">
                        {candidate.location || "San Francisco, CA"}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {(candidate.skills || ["React", "JavaScript", "Node.js"])
                          .slice(0, 5)
                          .map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                      </div>

                      <p className="text-gray-700 text-sm">
                        {candidate.bio ||
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
          ))}

          {filteredCandidates.length === 0 && (
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
      </div>
    </div>
  );
};

export default CandidateSearchPage;