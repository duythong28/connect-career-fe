import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Building2, Search } from 'lucide-react';

interface CompanySetupFormProps {
  onComplete: (companyData: any) => void;
  onSkip: () => void;
}

export function CompanySetupForm({ onComplete, onSkip }: CompanySetupFormProps) {
  const [setupType, setSetupType] = useState<'create' | 'join' | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock companies for joining
  const existingCompanies = [
    { id: '1', name: 'TechCorp Inc.', industry: 'Technology', location: 'San Francisco, CA' },
    { id: '2', name: 'InnovateLabs', industry: 'AI & Machine Learning', location: 'New York, NY' },
    { id: '3', name: 'DesignStudio', industry: 'Design & Creative', location: 'Remote' },
  ];

  const filteredCompanies = existingCompanies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create company form state
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    description: '',
    website: ''
  });

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call to create company
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCompany = {
        id: Math.random().toString(36).substr(2, 9),
        ...companyData,
        jobs: 0
      };

      toast({
        title: "Company created successfully",
        description: `Welcome to ${companyData.name}!`,
      });

      onComplete({ type: 'create', company: newCompany });
    } catch (error) {
      toast({
        title: "Error creating company",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCompany = async () => {
    if (!selectedCompany) return;
    
    setIsLoading(true);

    try {
      // Mock API call to join company
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Joined company successfully",
        description: `Welcome to ${selectedCompany.name}!`,
      });

      onComplete({ type: 'join', company: selectedCompany });
    } catch (error) {
      toast({
        title: "Error joining company",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!setupType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary/5 to-brand-accent/5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
            <CardTitle className="text-2xl font-bold">Company Setup</CardTitle>
            <CardDescription>
              Let's get your company information set up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={setupType} onValueChange={setSetupType as any}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="create" id="create" />
                <Label htmlFor="create" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">Create new company</div>
                    <div className="text-sm text-muted-foreground">Set up a new company profile</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="join" id="join" />
                <Label htmlFor="join" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">Join existing company</div>
                    <div className="text-sm text-muted-foreground">Find and join an existing company</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="flex gap-2">
              <Button onClick={onSkip} variant="outline" className="flex-1">
                Skip for now
              </Button>
              <Button 
                onClick={() => setupType && setSetupType(setupType)} 
                disabled={!setupType}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (setupType === 'join') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary/5 to-brand-accent/5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
            <CardTitle className="text-2xl font-bold">Join Company</CardTitle>
            <CardDescription>
              Search and select your company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search companies</Label>
              <Input
                id="search"
                placeholder="Search by company name or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCompany?.id === company.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-muted-foreground">{company.industry}</div>
                  <div className="text-sm text-muted-foreground">{company.location}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setSetupType('')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleJoinCompany} 
                disabled={!selectedCompany || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Joining...' : 'Join Company'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary/5 to-brand-accent/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
          <CardTitle className="text-2xl font-bold">Create Company</CardTitle>
          <CardDescription>
            Set up your company profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="Enter company name"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={companyData.industry} onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}>
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
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size *</Label>
              <Select value={companyData.size} onValueChange={(value) => setCompanyData({ ...companyData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501-1000">501-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                value={companyData.location}
                onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://company.com"
                value={companyData.website}
                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your company..."
                value={companyData.description}
                onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setSetupType('')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={isLoading || !companyData.name || !companyData.industry || !companyData.size || !companyData.location} className="flex-1">
                {isLoading ? 'Creating...' : 'Create Company'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}