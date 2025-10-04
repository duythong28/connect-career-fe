import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, Edit, Users, MapPin } from "lucide-react";
import { Company } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

export function CompanyProfile() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "TechCorp",
      industry: "Technology", 
      size: "100-500",
      location: "Ho Chi Minh City",
      description: "Leading technology company specializing in software development.",
      jobs: 12
    }
  ]);
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    industry: "",
    size: "",
    location: "",
    description: ""
  });

  const handleCreateCompany = () => {
    if (!formData.name || !formData.industry || !formData.size || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newCompany: Company = {
      id: Date.now().toString(),
      name: formData.name,
      industry: formData.industry,
      size: formData.size,
      location: formData.location,
      description: formData.description || "",
      jobs: 0
    };

    setCompanies([...companies, newCompany]);
    setFormData({ name: "", industry: "", size: "", location: "", description: "" });
    setIsCreateDialogOpen(false);
    toast({
      title: "Success",
      description: "Company created successfully!"
    });
  };

  const handleEditCompany = () => {
    if (!selectedCompany || !formData.name) return;

    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id 
        ? { ...c, ...formData }
        : c
    );
    setCompanies(updatedCompanies);
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
    toast({
      title: "Success", 
      description: "Company updated successfully!"
    });
  };

  const handleJoinCompany = () => {
    // Mock join logic
    if (joinCode === "DEMO123") {
      const mockCompany: Company = {
        id: Date.now().toString(),
        name: "Demo Company",
        industry: "Technology",
        size: "50-100",
        location: "Ha Noi",
        description: "A demo company for testing purposes.",
        jobs: 5
      };
      setCompanies([...companies, mockCompany]);
      setJoinCode("");
      setIsJoinDialogOpen(false);
      toast({
        title: "Success",
        description: "Successfully joined Demo Company!"
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid join code. Try 'DEMO123' for demo.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setFormData(company);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">Manage your company information and settings</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Join Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Existing Company</DialogTitle>
                <DialogDescription>
                  Enter the company join code to become part of an existing company.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="joinCode">Company Join Code</Label>
                  <Input
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter join code"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleJoinCompany}>Join Company</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Company</DialogTitle>
                <DialogDescription>
                  Set up your company profile to start posting jobs.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="size">Company Size *</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-100">51-100 employees</SelectItem>
                      <SelectItem value="101-500">101-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Company location"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your company..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCompany}>Create Company</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {companies.length > 0 ? (
          companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>{company.industry}</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {company.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {company.location}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(company)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{company.description}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{company.jobs} Active Jobs</Badge>
                  <span className="text-sm text-muted-foreground">Company ID: {company.id}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Companies Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first company or join an existing one to start posting jobs.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Company
                </Button>
                <Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Join Company
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update your company information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Company Name</Label>
              <Input
                id="editName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editIndustry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editSize">Company Size</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-100">51-100 employees</SelectItem>
                  <SelectItem value="101-500">101-500 employees</SelectItem>
                  <SelectItem value="501-1000">501-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editLocation">Location</Label>
              <Input
                id="editLocation"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditCompany}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}