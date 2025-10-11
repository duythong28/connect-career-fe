import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Users,
  MapPin,
  DollarSign,
  Clock,
  Edit,
  Star,
  ArrowLeft,
  UserPlus,
  ExternalLink,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Candidate, Company, Job, User } from "@/lib/types";
import {
  mockCandidates,
  mockCompanies,
  mockJobs,
  mockUsers,
} from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { getOrganizationById } from "@/api/endpoints/organizations.api";
import { useQuery } from "@tanstack/react-query";

const CompanyProfilePage = () => {
  const { user } = useAuth();
  const { slug } = useParams();

  const { data: companydata } = useQuery({
    queryKey: ["company", slug],
    queryFn: () => getOrganizationById(slug!),
  });

  const isFollowing = false;
  const isCompanyMember = false;
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  if (!companydata) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Company not found
          </h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const toggleFollow = () => {
    if (!user) return;

    toast({
      title: isFollowing ? "Unfollowed company" : "Following company",
      description: isFollowing
        ? "Removed from your followed companies"
        : "Added to your followed companies",
    });
  };

  const saveCompanyEdit = () => {
    toast({
      title: "Company updated",
      description: "Company information has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src={companydata.logoFileId} />
                <AvatarFallback className="text-4xl">
                  {companydata.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-4xl font-bold mb-2">{companydata.name}</h1>
                <p className="text-xl text-blue-100 mb-4">
                  {companydata.industryId}
                </p>

                <div className="flex items-center space-x-6 text-blue-100">
                  <span className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {companydata.headquartersAddress}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {companydata.organizationSize}
                  </span>
                  <span className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Founded {companydata.foundedDate}
                  </span>
                </div>

                <div className="flex items-center space-x-6 mt-4 text-sm">
                  <span>{companydata.employeeCount} employees</span>
                  {/* <span>{companydata.followers} followers</span> */}
                  {/* <span>{companyJobs.length} open positions</span> */}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {user && (
                <Button
                  onClick={toggleFollow}
                  variant={isFollowing ? "secondary" : "outline"}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isFollowing ? "Following" : "Follow Company"}
                </Button>
              )}

              {companydata.website && (
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => window.open(companydata.website, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Website
                </Button>
              )}

              {isCompanyMember && (
                <Button
                  onClick={() => setEditMode(!editMode)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editMode ? "Cancel Edit" : "Edit Company"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {companydata.name}</CardTitle>
                {isCompanyMember && editMode && (
                  <Button onClick={saveCompanyEdit} size="sm">
                    Save Changes
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {/* <div className="space-y-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Industry</Label>
                      <Input
                        value={editForm.industry}
                        onChange={(e) =>
                          setEditForm({ ...editForm, industry: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        rows={10}
                      />
                    </div>
                  </div> */}
                <Markdown content={companydata.longDescription} />
              </CardContent>
            </Card>

            {/* Open Positions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Open Positions ({companyJobs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {companyJobs.length > 0 ? (
                  <div className="space-y-4">
                    {companyJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {job.title}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                {job.location}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <DollarSign className="h-4 w-4 mr-2" />
                                {job.salary}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                {job.postedDate}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.keywords.slice(0, 4).map((keyword) => (
                                <Badge
                                  key={keyword}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>

                            <p className="text-gray-700 text-sm line-clamp-2">
                              {job.description
                                .replace(/[#*]/g, "")
                                .substring(0, 120)}
                              ...
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant="secondary" className="capitalize">
                              {job.type}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Job
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No open positions at the moment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card> */}

            {/* Company Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        4.2
                      </div>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= 4
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Based on 127 reviews
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        rating: 5,
                        title: "Great place to work",
                        content:
                          "Amazing company culture and great opportunities for growth. The team is very supportive and the work is challenging and rewarding.",
                        author: "Software Engineer",
                        date: "2024-01-10",
                      },
                      {
                        id: 2,
                        rating: 4,
                        title: "Good work-life balance",
                        content:
                          "Really appreciate the flexible working arrangements and the company's focus on employee wellbeing. Management is understanding and supportive.",
                        author: "Product Manager",
                        date: "2024-01-05",
                      },
                    ].map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {review.title}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{review.author}</span>
                              <span>•</span>
                              <span>{review.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Industry</span>
                    <span className="font-medium">
                      {companydata.industryId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Company Size</span>
                    <span className="font-medium">
                      {companydata.organizationSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-medium">
                      {companydata.foundedDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Headquarters</span>
                    <span className="font-medium">
                      {companydata.headquartersAddress}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Employees</span>
                    <span className="font-medium">
                      {companydata.employeeCount}
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-medium">{company.followers}</span>
                  </div> */}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Social Links</div>
                  <div className="flex space-x-2">
                    {companydata.socialMedia.linkedin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            companydata.socialMedia.linkedin,
                            "_blank"
                          )
                        }
                      >
                        LinkedIn
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members (for company members only) */}
            {/* {isCompanyMember && (
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {company.members.map((member) => {
                      const user = users.find((u) => u.id === member.userId);
                      if (!user) return null;

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-600">
                                {member.role}
                              </p>
                            </div>
                          </div>

                          {user?.id === user.id && (
                            <Badge variant="secondary" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </CardContent>
              </Card>
            )} */}

            {/* Similar Companies */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Similar Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {companies
                    .filter(
                      (c) =>
                        c.id !== company.id && c.industry === company.industry
                    )
                    .slice(0, 3)
                    .map((similarCompany) => (
                      <div
                        key={similarCompany.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          navigate(`/companies/${similarCompany.slug}`)
                        }
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={similarCompany.logo} />
                          <AvatarFallback>
                            {similarCompany.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {similarCompany.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {similarCompany.industry}
                          </p>
                          <p className="text-xs text-gray-500">
                            {similarCompany.jobs} jobs
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
