import React, { useState } from "react";
import { Building2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Company } from "@/lib/types";
import { mockCompanies } from "@/lib/mock-data";

const CompanyOnboarding = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [showCompanyOnboarding, setShowCompanyOnboarding] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    slug: "",
    industry: "",
    size: "",
    headquarters: "",
    website: "",
    description: "",
  });

  const [step, setStep] = useState<"choice" | "create" | "join">("choice");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const joinCompany = (companyId: string) => {};
  // Company Functions
  const createCompany = (formData: typeof companyForm) => {
    const newCompany: Company = {
      id: `comp${companies.length + 1}`,
      ...formData,
      logo: "/api/placeholder/100/100",
      founded: new Date().getFullYear().toString(),
      employees: 0,
      followers: 0,
      jobs: 0,
      members: [
        {
          id: `m${Date.now()}`,
          userId: user?.id || "temp",
          role: "Company Admin",
          joinedAt: new Date().toISOString(),
        },
      ],
      socialLinks: {},
    };

    setCompanies([...companies, newCompany]);

    if (user) {
      const updatedUser = { ...user, companyId: newCompany.id };
    }

    setShowCompanyOnboarding(false);
    toast({
      title: "Company created",
      description: `${formData.name} has been successfully created.`,
    });
  };

  return (
    <Dialog
      open={showCompanyOnboarding}
      onOpenChange={setShowCompanyOnboarding}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Welcome to JobBoard</DialogTitle>
          <DialogDescription>
            Let's get your employer account set up. Choose how you'd like to
            proceed.
          </DialogDescription>
        </DialogHeader>

        {step === "choice" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setStep("create")}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Create a New Company
                  </h3>
                  <p className="text-sm text-gray-600">
                    Start fresh with your company profile and become a Company
                    Admin
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setStep("join")}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <UserPlus className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Join Existing Company
                  </h3>
                  <p className="text-sm text-gray-600">
                    Join your company as a Recruiter or HR member
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === "create" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Create Your Company</h3>
              <p className="text-gray-600">
                Fill in your company details to get started
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyForm.name}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, name: e.target.value })
                    }
                    placeholder="e.g., TechCorp Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="companySlug">Company URL Slug *</Label>
                  <Input
                    id="companySlug"
                    value={companyForm.slug}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, slug: e.target.value })
                    }
                    placeholder="e.g., techcorp-inc"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={companyForm.industry}
                    onValueChange={(value) =>
                      setCompanyForm({ ...companyForm, industry: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="AI & Machine Learning">
                        AI & Machine Learning
                      </SelectItem>
                      <SelectItem value="Design & Creative">
                        Design & Creative
                      </SelectItem>
                      <SelectItem value="Financial Services">
                        Financial Services
                      </SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Company Size *</Label>
                  <Select
                    value={companyForm.size}
                    onValueChange={(value) =>
                      setCompanyForm({ ...companyForm, size: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10 employees">
                        1-10 employees
                      </SelectItem>
                      <SelectItem value="11-50 employees">
                        11-50 employees
                      </SelectItem>
                      <SelectItem value="51-200 employees">
                        51-200 employees
                      </SelectItem>
                      <SelectItem value="201-500 employees">
                        201-500 employees
                      </SelectItem>
                      <SelectItem value="501-1000 employees">
                        501-1000 employees
                      </SelectItem>
                      <SelectItem value="1000+ employees">
                        1000+ employees
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="headquarters">Headquarters *</Label>
                  <Input
                    id="headquarters"
                    value={companyForm.headquarters}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        headquarters: e.target.value,
                      })
                    }
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companyForm.website}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        website: e.target.value,
                      })
                    }
                    placeholder="e.g., https://techcorp.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={companyForm.description}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Tell us about your company, mission, and values..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("choice")}>
                Back
              </Button>
              <Button onClick={() => createCompany(companyForm)}>
                Create Company
              </Button>
            </div>
          </div>
        )}

        {step === "join" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Join Existing Company</h3>
              <p className="text-gray-600">
                Search for your company and request to join
              </p>
            </div>

            <div>
              <Label htmlFor="search">Search Companies</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type company name..."
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={company.logo} />
                      <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{company.name}</h4>
                      <p className="text-sm text-gray-600">
                        {company.industry} • {company.size}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => joinCompany(company.id)}>
                    Join
                  </Button>
                </div>
              ))}
            </div>

            {filteredCompanies.length === 0 && searchQuery && (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No companies found with that name</p>
                <p className="text-sm">
                  Try a different search term or create a new company
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("choice")}>
                Back
              </Button>
              <Button variant="outline" onClick={() => setStep("create")}>
                Create New Instead
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompanyOnboarding;
