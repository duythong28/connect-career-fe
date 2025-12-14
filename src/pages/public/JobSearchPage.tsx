import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronDown,
  Heart,
  Share2,
  Flag,
  Lock,
  Zap,
  Clock,
  Building2,
  Globe2,
  LayoutGrid,
  CheckCircle2,
  SlidersHorizontal,
  PenSquare,
  Grid,
  X,
  X as XIcon,
  Lightbulb,
  Check,
  ArrowRight
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

// API & Logic
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCandidateJobs, saveCandidateJobById } from "@/api/endpoints/jobs.api";
import { JobFilters, JobSortBy, JobType, JobTypeLabel, Job, JobSeniorityLevel } from "@/api/types/jobs.types";
import { useAuth } from "@/hooks/useAuth";
import ApplyJobDialog from "@/components/candidate/applications/ApplyJobDialog";
import ReportDialog from "@/components/reports/ReportDialog";
import { SmartPagination } from "@/components/shared/SmartPagination";

// Markdown Libraries
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

// --- Helper Hook: Debounce ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- Helpers & Sub-components ---

const isHtmlContent = (content: string): boolean => {
  if (!content) return false;
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
};

const RenderHtml = ({ content }: { content: string }) => (
  <div 
    className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
    dangerouslySetInnerHTML={{ __html: content }} 
  />
);

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert text-gray-600 leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-gray-900 mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-gray-900 mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="mb-3 text-xs sm:text-sm">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-outside ml-4 mb-3 space-y-1 text-xs sm:text-sm">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-4 mb-3 space-y-1 text-xs sm:text-sm">{children}</ol>,
          li: ({ children }) => <li className="">{children}</li>,
          a: ({ href, children }) => <a href={href} className="text-[#0EA5E9] hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const DEFAULT_FILTERS: JobFilters = {
  pageNumber: 1,
  pageSize: 20,
  searchTerm: "",
  location: "",
  type: undefined,
  seniorityLevel: undefined,
  status: undefined,
  keywords: [],
  postedAfter: undefined,
  postedBefore: undefined,
  sortBy: JobSortBy.POSTED_DATE,
  sortOrder: "DESC",
};

export default function JobSearchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for Filters
  const [searchFilters, setSearchFilters] = useState<JobFilters>({ ...DEFAULT_FILTERS });
  
  // Local State for Inputs (Debounce & Dialogs)
  const [searchTermInput, setSearchTermInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [tempFilters, setTempFilters] = useState<JobFilters>({ ...DEFAULT_FILTERS });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTermInput, 500);

  // Sync Debounced Search to Main Filters
  useEffect(() => {
    setSearchFilters(prev => ({ ...prev, searchTerm: debouncedSearchTerm, pageNumber: 1 }));
  }, [debouncedSearchTerm]);

  // Main Query
  const { data: jobsData, isFetching } = useQuery({
    queryKey: ["jobs", searchFilters],
    queryFn: () => getCandidateJobs(searchFilters),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rightTab, setRightTab] = useState<'Overview' | 'Company'>('Overview');
  const [showFullPosting, setShowFullPosting] = useState(false);

  // Auto-select logic
  useEffect(() => {
    if (jobsData?.data && jobsData.data.length > 0) {
      if (!selectedJob || !jobsData.data.find(j => j.id === selectedJob.id)) {
        setSelectedJob(jobsData.data[0]);
      }
    } else if (jobsData?.data?.length === 0) {
        setSelectedJob(null);
    }
  }, [jobsData?.data]);

  // Mutations
  const saveJobMutation = useMutation({
    mutationFn: (id: string) => saveCandidateJobById(id),
    onSuccess: () => toast({ title: "Saved", description: "Job saved successfully." }),
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const handleSaveJob = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!id) return;
    saveJobMutation.mutate(id);
  };

  // Helper formatters
  const formatSalary = (job: Job) => {
    if (job.salary) return job.salary;
    if (job.salaryDetails?.minAmount && job.salaryDetails?.maxAmount) {
      return `${job.salaryDetails.currency} ${job.salaryDetails.minAmount.toLocaleString()} - ${job.salaryDetails.maxAmount.toLocaleString()}`;
    }
    return "Salary not disclosed";
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 86400) return "Today";
    const days = Math.floor(seconds / 86400);
    return `${days}d ago`;
  };

  // Filter Handlers
  const applyAdvancedFilters = () => {
      setSearchFilters(prev => ({
          ...prev,
          keywords: tempFilters.keywords,
          postedAfter: tempFilters.postedAfter,
          postedBefore: tempFilters.postedBefore,
          pageNumber: 1
      }));
      setIsFilterOpen(false);
  };

  const applyLocation = () => {
      setSearchFilters(prev => ({ ...prev, location: locationInput, pageNumber: 1 }));
      setLocationOpen(false);
  };

  // --- UI Components ---

  const JobListItem = ({ job, isSelected }: { job: Job; isSelected: boolean }) => (
    <div
      onClick={() => setSelectedJob(job)}
      className={`p-4 rounded-xl border cursor-pointer transition-all mb-3 relative group ${
        isSelected 
          ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500' 
          : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-100 rounded-lg">
            <AvatarImage src={job.organization?.logoFile?.url || job.companyLogo} />
            <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 font-bold">
              {job.companyName?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div className="font-bold text-xs text-gray-500 truncate max-w-[150px]">
            {job.organization?.name || job.companyName}
          </div>
        </div>
        <div className="text-gray-300 hover:text-gray-600">
           {job.savedByUserIds?.includes(user?.id || '') ? <Heart size={14} fill="red" className="text-red-500"/> : <Heart size={14}/>}
        </div>
      </div>
      
      <div className="font-bold text-gray-900 text-sm mb-2 group-hover:text-[#0EA5E9] line-clamp-2">
        {job.title}
      </div>
      
      <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-bold mb-1">
        <span className="bg-gray-100 px-2 py-1 rounded capitalize">
          {JobTypeLabel[job.type as JobType] || job.type}
        </span>
        {job.salary && (
            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded truncate max-w-[100px]">
            {formatSalary(job)}
            </span>
        )}
        <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
          <Clock size={8} /> {timeAgo(job.postedDate)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-hidden bg-[#F8F9FB] font-sans flex flex-col">
      {/* --- Filter Bar (Simplify Design) --- */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto">
            <div className="mb-4">
                 <h1 className="text-xl font-bold text-gray-900">Search All Jobs</h1>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[300px] max-w-xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                    <input 
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" 
                        placeholder="Search for roles, companies, or locations"
                        value={searchTermInput}
                        onChange={(e) => setSearchTermInput(e.target.value)}
                    />
                </div>

                {/* Location Filter */}
                <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                    <PopoverTrigger asChild>
                        <button className={`px-3 py-2 bg-white border rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${searchFilters.location ? 'border-[#0EA5E9] text-[#0EA5E9] bg-blue-50' : 'border-gray-200 text-[#0EA5E9] hover:bg-blue-50'}`}>
                            <MapPin size={14}/> 
                            {/* FIX: Display actual location or default label */}
                            {searchFilters.location ? searchFilters.location : "Location"} 
                            <ChevronDown size={14}/>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                        <div className="space-y-3">
                            <Input 
                                placeholder="City, state..." 
                                value={locationInput} 
                                onChange={(e) => setLocationInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyLocation()}
                            />
                            <Button size="sm" className="w-full bg-[#0EA5E9] hover:bg-[#0284c7]" onClick={applyLocation}>Apply</Button>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Job Type Filter */}
                <Select 
                    value={searchFilters.type || "all"} 
                    onValueChange={(val) => setSearchFilters(prev => ({...prev, type: val === "all" ? undefined : val, pageNumber: 1}))}
                >
                    <SelectTrigger className={`w-auto px-3 py-2 bg-white border rounded-lg text-sm font-bold hover:bg-blue-50 gap-2 border-none ring-0 focus:ring-0 ${searchFilters.type ? 'text-[#0EA5E9] bg-blue-50' : 'text-[#0EA5E9]'}`}>
                        <div className="flex items-center gap-2 truncate">
                            <Briefcase size={14}/> 
                            {/* FIX: Display actual Job Type Label or default */}
                            <span>
                                {searchFilters.type && searchFilters.type !== 'all' 
                                    ? JobTypeLabel[searchFilters.type as JobType] 
                                    : "Job Type"}
                            </span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {Object.values(JobType).map((t) => (
                            <SelectItem key={t} value={t}>{JobTypeLabel[t]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Experience Level */}
                <Select 
                    value={searchFilters.seniorityLevel || "all"} 
                    onValueChange={(val) => setSearchFilters(prev => ({...prev, seniorityLevel: val === "all" ? undefined : val, pageNumber: 1}))}
                >
                    <SelectTrigger className={`w-auto px-3 py-2 bg-white border rounded-lg text-sm font-bold hover:bg-blue-50 gap-2 border-none ring-0 focus:ring-0 ${searchFilters.seniorityLevel ? 'text-[#0EA5E9] bg-blue-50' : 'text-[#0EA5E9]'}`}>
                        <div className="flex items-center gap-2 truncate">
                            <PenSquare size={14}/> 
                            {/* FIX: Display actual Experience Level or default */}
                            <span>
                                {searchFilters.seniorityLevel && searchFilters.seniorityLevel !== 'all' 
                                    ? searchFilters.seniorityLevel 
                                    : "Experience"}
                            </span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {Object.values(JobSeniorityLevel).map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* More Filters */}
                <Dialog open={isFilterOpen} onOpenChange={(open) => {
                    if (open) setTempFilters(searchFilters);
                    setIsFilterOpen(open);
                }}>
                    <DialogTrigger asChild>
                        <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0EA5E9] flex items-center gap-2 hover:bg-blue-50 whitespace-nowrap">
                            More filters <ChevronDown size={14}/>
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Advanced Filters</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Skills (Comma separated)</Label>
                                <Input 
                                    placeholder="e.g. React, Node" 
                                    value={tempFilters.keywords?.join(",") ?? ""} 
                                    onChange={(e) => setTempFilters(prev => ({...prev, keywords: e.target.value.split(",").filter(Boolean)}))} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Posted After</Label>
                                <Input type="date" value={tempFilters.postedAfter || ""} onChange={(e) => setTempFilters(prev => ({...prev, postedAfter: e.target.value || undefined}))} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsFilterOpen(false)}>Cancel</Button>
                            <Button className="bg-[#0EA5E9] hover:bg-[#0284c7]" onClick={applyAdvancedFilters}>Apply Filters</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Clear Filters */}
                {(Object.keys(searchFilters) as Array<keyof JobFilters>).some((key) => {
                    if (key === 'pageNumber' || key === 'pageSize') return false;
                    return searchFilters[key] != DEFAULT_FILTERS[key];
                }) && (
                    <button 
                        onClick={() => {
                            setSearchFilters(DEFAULT_FILTERS);
                            setSearchTermInput("");
                            setLocationInput("");
                        }}
                        className="px-3 py-2 text-gray-400 text-sm font-bold flex items-center gap-1 hover:text-red-500 whitespace-nowrap"
                    >
                        <XIcon size={14} /> Clear
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* --- Main Content Split View --- */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left Column: Job List */}
        <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500">
              {isFetching ? "Loading..." : `Showing ${jobsData?.data?.length || 0} of ${jobsData?.total || 0} Jobs`}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
            {jobsData?.data?.map((job) => (
              <JobListItem 
                key={job.id} 
                job={job} 
                isSelected={selectedJob?.id === job.id} 
              />
            ))}
            {jobsData?.data?.length === 0 && !isFetching && (
              <div className="text-center py-10 text-gray-500 text-sm">No jobs found matching your criteria.</div>
            )}
            
            <div className="pt-4 px-2 pb-2">
                <SmartPagination 
                    page={searchFilters.pageNumber || 1}
                    totalPages={jobsData?.totalPages || 1}
                    onPageChange={(p) => setSearchFilters(prev => ({...prev, pageNumber: p}))}
                />
            </div>
          </div>
        </div>

        {/* Right Column: Job Detail Panel */}
        <div className="hidden lg:flex flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex-col min-w-0 overflow-hidden">
          {selectedJob ? (
            <>
              {/* Detail Header / Tabs */}
              <div className="flex items-center justify-between px-8 border-b border-gray-100 bg-white">
                <div className="flex gap-8">
                  <button 
                    onClick={() => setRightTab('Overview')}
                    className={`py-4 text-sm font-bold border-b-2 transition-all ${rightTab === 'Overview' ? 'border-[#0EA5E9] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setRightTab('Company')}
                    className={`py-4 text-sm font-bold border-b-2 transition-all ${rightTab === 'Company' ? 'border-[#0EA5E9] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Company
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleSaveJob(e, selectedJob.id)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                  >
                    {selectedJob.savedByUserIds?.includes(user?.id || '') ? <Heart size={14} fill="red" className="text-red-500"/> : <Heart size={14}/>}
                    Save
                  </button>
                  <ApplyJobDialog jobId={selectedJob.id} trigger={
                    <button className="bg-[#0EA5E9] text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-sm hover:bg-[#0284c7] flex items-center gap-1">
                      <Zap size={12} fill="currentColor"/> Apply
                    </button>
                  }/>
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {rightTab === 'Overview' ? (
                  <div className="max-w-5xl mx-auto flex gap-12 animate-fadeIn">
                    {/* Left Inner Column: Meta Info */}
                    <div className="w-[340px] shrink-0 space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#0EA5E9] bg-blue-50 px-2 py-0.5 rounded text-xs font-bold capitalize">
                            {JobTypeLabel[selectedJob.type as JobType] || selectedJob.type}
                          </span>
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded p-1"><Share2 size={12}/></button>
                            {/* Report Button */}
                            <ReportDialog 
                                entityId={selectedJob.id} 
                                entityType="job" 
                                trigger={
                                    <button className="text-gray-400 hover:text-red-500 border border-gray-200 rounded p-1 hover:border-red-200 transition-colors">
                                        <Flag size={12}/>
                                    </button>
                                }
                            />
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">{selectedJob.title}</h2>
                        <div className="text-xs text-gray-500 mb-2">Posted {timeAgo(selectedJob.postedDate)}</div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#0EA5E9] bg-blue-50 w-fit px-2 py-1 rounded border border-blue-100">
                           <Lock size={10}/> Authenticated Job
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-lg border border-gray-100">
                          <AvatarImage src={selectedJob.organization?.logoFile?.url || selectedJob.companyLogo} />
                          <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 font-bold text-lg">
                            {selectedJob.companyName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg text-gray-900">
                          {selectedJob.organization?.name || selectedJob.companyName}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="font-bold text-gray-900 text-xs mb-2">Compensation Overview</div>
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg mb-1">
                          <span className="bg-emerald-100 p-1 rounded"><DollarSign size={16} fill="currentColor"/></span> 
                          {formatSalary(selectedJob)}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                          <MapPin size={14} className="text-gray-400"/> {selectedJob.location}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                          <Building2 size={14} className="text-gray-400"/> {selectedJob.organization?.industry?.name || "Industry N/A"}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                          <LayoutGrid size={14} className="text-gray-400"/> {selectedJob.seniorityLevel || "Entry Level"}
                        </div>
                      </div>
                    </div>

                    {/* Right Inner Column: Description */}
                    <div className="flex-1 space-y-6">
                      <div className="bg-gray-100 p-1 rounded-lg flex w-full max-w-sm ml-auto">
                        <button 
                          className={`flex-1 py-1.5 rounded-md shadow-sm text-xs font-bold transition-all ${!showFullPosting ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={() => setShowFullPosting(false)}
                        >
                          Summary
                        </button>
                        <button 
                          className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${showFullPosting ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={() => setShowFullPosting(true)}
                        >
                          Full Job Posting
                        </button>
                      </div>

                      {/* Content Rendering */}
                      <div className="text-gray-600 text-sm leading-relaxed">
                        {showFullPosting ? (
                           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                              {isHtmlContent(selectedJob.description) ? (
                                <RenderHtml content={selectedJob.description} />
                              ) : (
                                <Markdown content={selectedJob.description} />
                              )}
                           </div>
                        ) : (
                           <div>
                              <div className="line-clamp-6">
                                {isHtmlContent(selectedJob.summary || selectedJob.description) ? (
                                    <RenderHtml content={selectedJob.summary || selectedJob.description} />
                                ) : (
                                    <Markdown content={selectedJob.summary || selectedJob.description} />
                                )}
                              </div>
                              <Button variant="link" onClick={() => setShowFullPosting(true)} className="p-0 h-auto text-[#0EA5E9] mt-2">Read full posting</Button>
                           </div>
                        )}
                      </div>

                      {/* SKILLS SECTION */}
                      {selectedJob.keywords && selectedJob.keywords.length > 0 && (
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                <Zap size={14} className="text-yellow-500 fill-yellow-500"/> Required Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.keywords.map((skill, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Company Tab Content
                  <div className="max-w-4xl mx-auto animate-in fade-in">
                    <div className="bg-white rounded-xl mb-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-4">
                          <Avatar className="h-16 w-16 rounded-xl border border-gray-100">
                            <AvatarImage src={selectedJob.organization?.logoFile?.url} />
                            <AvatarFallback className="text-2xl font-bold bg-gray-100 text-gray-500 rounded-xl">
                              {selectedJob.companyName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900">{selectedJob.organization?.name || selectedJob.companyName}</h1>
                            {selectedJob.organization?.website && (
                                <a 
                                href={selectedJob.organization.website} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[#0EA5E9] text-xs font-bold hover:underline flex items-center gap-1 mt-1"
                                >
                                <Globe2 size={12}/> Visit Website
                                </a>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/company/${selectedJob.organizationId}/profile`)}>
                          View Full Profile <ArrowRight size={14} className="ml-1"/>
                        </Button>
                      </div>
                      
                      <div className="prose prose-sm text-gray-600 mb-8">
                        <Markdown content={selectedJob.organization?.longDescription || selectedJob.organization?.shortDescription || "No company description available."} />
                      </div>

                      <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                        <div>
                          <div className="text-xs text-gray-500 font-bold mb-1">Company Size</div>
                          <div className="text-sm font-medium">{selectedJob.organization?.organizationSize || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold mb-1">Headquarters</div>
                          <div className="text-sm font-medium">{selectedJob.organization?.headquartersAddress || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold mb-1">Founded</div>
                          <div className="text-sm font-medium">{selectedJob.organization?.foundedDate ? new Date(selectedJob.organization.foundedDate).getFullYear() : "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase size={32} />
              </div>
              <p className="font-bold">Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}