'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, MapPin, DollarSign, Clock, Filter, Star, Heart, 
  Building2, Users, Eye, Send, Calendar, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { mockJobs, mockCompanies } from '@/lib/mock-data';

export default function JobSearchPage() {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    type: '',
    industry: '',
    salaryRange: [0, 200000],
    experience: '',
    remote: false,
    benefits: [] as string[]
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const getFilteredJobs = () => {
    let filtered = mockJobs.filter(job => {
      const matchesKeyword = !searchFilters.keyword || 
        job.title.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(searchFilters.keyword.toLowerCase());
      const matchesLocation = !searchFilters.location || 
        job.location.toLowerCase().includes(searchFilters.location.toLowerCase());
      const matchesType = !searchFilters.type || job.type === searchFilters.type;
      const matchesRemote = !searchFilters.remote || job.type === 'remote';
      
      return matchesKeyword && matchesLocation && matchesType && matchesRemote && job.status === 'active';
    });

    // Sort jobs
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'salary':
        filtered.sort((a, b) => {
          const aSalary = parseInt(a.salary.replace(/[^0-9]/g, ''));
          const bSalary = parseInt(b.salary.replace(/[^0-9]/g, ''));
          return bSalary - aSalary;
        });
        break;
      case 'company':
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  };

  const filteredJobs = getFilteredJobs();

  const toggleSavedJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Keyword Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Keywords</label>
                  <Input
                    placeholder="Job title, company, skills..."
                    value={searchFilters.keyword}
                    onChange={(e) => setSearchFilters({...searchFilters, keyword: e.target.value})}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="City, state, or remote"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Type</label>
                  <Select value={searchFilters.type} onValueChange={(value) => setSearchFilters({...searchFilters, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <Select value={searchFilters.industry} onValueChange={(value) => setSearchFilters({...searchFilters, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All industries</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                      <SelectItem value="Design & Creative">Design & Creative</SelectItem>
                      <SelectItem value="Financial Services">Financial Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Salary Range: ${searchFilters.salaryRange[0].toLocaleString()} - ${searchFilters.salaryRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={searchFilters.salaryRange}
                    onValueChange={(value) => setSearchFilters({...searchFilters, salaryRange: value})}
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                </div>

                {/* Remote Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={searchFilters.remote}
                    onCheckedChange={(checked) => setSearchFilters({...searchFilters, remote: checked as boolean})}
                  />
                  <label htmlFor="remote" className="text-sm font-medium">
                    Remote only
                  </label>
                </div>

                <Button 
                  onClick={() => setSearchFilters({
                    keyword: '',
                    location: '',
                    type: '',
                    industry: '',
                    salaryRange: [0, 200000],
                    experience: '',
                    remote: false,
                    benefits: []
                  })}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredJobs.length} jobs found
                </h2>
                <p className="text-gray-600">
                  {searchFilters.keyword && `for "${searchFilters.keyword}"`}
                  {searchFilters.location && ` in ${searchFilters.location}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date Posted</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                    const company = mockCompanies.find(c => c.name === job.company);
                const isSaved = savedJobs.includes(job.id);
                
                return (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={company?.logo} />
                            <AvatarFallback>{company?.name?.charAt(0) || job.company.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                    onClick={() => router.push(`/jobs/${job.id}`)}>
                                  {job.title}
                                </h3>
                                <p className="text-gray-600 font-medium">{company?.name || job.company}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleSavedJob(job.id)}
                                className={isSaved ? 'text-red-500' : 'text-gray-400'}
                              >
                                <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                            
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {job.salary}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                Posted {job.postedDate}
                              </div>
                            </div>
                            
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                              {job.requirements?.slice(0, 3).map((req) => (
                                <Badge key={req} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {Math.floor(Math.random() * 100) + 50} views
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applications} applications
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Quick Apply
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => router.push(`/jobs/${job.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No Results */}
            {filteredJobs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or browse all available positions.
                  </p>
                  <Button onClick={() => setSearchFilters({
                    keyword: '',
                    location: '',
                    type: '',
                    industry: '',
                    salaryRange: [0, 200000],
                    experience: '',
                    remote: false,
                    benefits: []
                  })}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
}