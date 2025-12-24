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
  PenSquare,
  X as XIcon,
  ArrowRight
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
    className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
    dangerouslySetInnerHTML={{ __html: content }} 
  />
);

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert text-muted-foreground leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-foreground mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-foreground mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-foreground mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="mb-3 text-xs sm:text-sm">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-outside ml-4 mb-3 space-y-1 text-xs sm:text-sm">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-4 mb-3 space-y-1 text-xs sm:text-sm">{children}</ol>,
          li: ({ children }) => <li className="">{children}</li>,
          a: ({ href, children }) => <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
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
  
  const [searchFilters, setSearchFilters] = useState<JobFilters>({ ...DEFAULT_FILTERS });
  const [searchTermInput, setSearchTermInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [tempFilters, setTempFilters] = useState<JobFilters>({ ...DEFAULT_FILTERS });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTermInput, 500);

  useEffect(() => {
    setSearchFilters(prev => ({ ...prev, searchTerm: debouncedSearchTerm, pageNumber: 1 }));
  }, [debouncedSearchTerm]);

  const { data: jobsData, isFetching } = useQuery({
    queryKey: ["jobs", searchFilters],
    queryFn: () => getCandidateJobs(searchFilters),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rightTab, setRightTab] = useState<'Overview' | 'Company'>('Overview');
  const [showFullPosting, setShowFullPosting] = useState(false);

  useEffect(() => {
    if (jobsData?.data && jobsData.data.length > 0) {
      if (!selectedJob || !jobsData.data.find(j => j.id === selectedJob.id)) {
        setSelectedJob(jobsData.data[0]);
      }
    } else if (jobsData?.data?.length === 0) {
        setSelectedJob(null);
    }
  }, [jobsData?.data]);

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

  const JobListItem = ({ job, isSelected }: { job: Job; isSelected: boolean }) => (
    <div
      onClick={() => setSelectedJob(job)}
      className={cn(
        "p-4 rounded-xl border cursor-pointer transition-all mb-3 relative group",
        isSelected 
          ? 'bg-accent border-primary ring-1 ring-primary' 
          : 'bg-card border-border hover:border-primary shadow-sm'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border rounded-xl">
            <AvatarImage src={job.organization?.logoFile?.url || job.companyLogo} />
            <AvatarFallback className="rounded-xl bg-secondary text-primary font-bold">
              {job.companyName?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div className="font-bold text-xs text-muted-foreground truncate max-w-[150px]">
            {job.organization?.name || job.companyName}
          </div>
        </div>
        <div className="text-muted-foreground hover:text-foreground">
           {job.savedByUserIds?.includes(user?.id || '') ? <Heart size={14} fill="currentColor" className="text-destructive"/> : <Heart size={14}/>}
        </div>
      </div>
      
      <div className="font-bold text-foreground text-sm mb-2 group-hover:text-primary line-clamp-2">
        {job.title}
      </div>
      
      <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground font-bold mb-1">
        <span className="bg-muted px-2 py-1 rounded-md capitalize">
          {JobTypeLabel[job.type as JobType] || job.type}
        </span>
        {job.salary && (
            <span className="bg-emerald-50 text-brand-success px-2 py-1 rounded-md truncate max-w-[100px]">
            {formatSalary(job)}
            </span>
        )}
        <span className="bg-muted px-2 py-1 rounded-md flex items-center gap-1">
          <Clock size={8} /> {timeAgo(job.postedDate)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-hidden bg-[#F8F9FB] flex flex-col animate-fade-in">
      {/* --- Filter Bar --- */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
            <div className="mb-4">
                 <h1 className="text-2xl font-bold text-foreground">Search All Jobs</h1>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[300px] max-w-xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
                    <input 
                        className="w-full pl-10 pr-4 h-10 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary outline-none placeholder-muted-foreground bg-card" 
                        placeholder="Search for roles, companies, or locations"
                        value={searchTermInput}
                        onChange={(e) => setSearchTermInput(e.target.value)}
                    />
                </div>

                {/* Location Filter */}
                <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                    <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn("h-10 rounded-xl px-3 border-border font-bold flex items-center gap-2", searchFilters.location && "border-primary text-primary bg-accent")}
                        >
                            <MapPin size={14} className="text-primary"/> 
                            {searchFilters.location ? searchFilters.location : "Location"} 
                            <ChevronDown size={14} className="text-muted-foreground"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3 rounded-2xl">
                        <div className="space-y-3">
                            <Input 
                                className="rounded-xl"
                                placeholder="City, state..." 
                                value={locationInput} 
                                onChange={(e) => setLocationInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyLocation()}
                            />
                            <Button size="sm" variant="default" className="w-full h-9" onClick={applyLocation}>Apply</Button>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Job Type Filter */}
                <Select 
                    value={searchFilters.type || "all"} 
                    onValueChange={(val) => setSearchFilters(prev => ({...prev, type: val === "all" ? undefined : val, pageNumber: 1}))}
                >
                    <SelectTrigger className={cn("w-auto h-10 px-3 border-border rounded-xl font-bold gap-2", searchFilters.type && "text-primary bg-accent border-primary")}>
                        <div className="flex items-center gap-2 truncate">
                            <Briefcase size={14} className="text-primary"/> 
                            <span>
                                {searchFilters.type && searchFilters.type !== 'all' 
                                    ? JobTypeLabel[searchFilters.type as JobType] 
                                    : "Job Type"}
                            </span>
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
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
                    <SelectTrigger className={cn("w-auto h-10 px-3 border-border rounded-xl font-bold gap-2", searchFilters.seniorityLevel && "text-primary bg-accent border-primary")}>
                        <div className="flex items-center gap-2 truncate">
                            <PenSquare size={14} className="text-primary"/> 
                            <span>
                                {searchFilters.seniorityLevel && searchFilters.seniorityLevel !== 'all' 
                                    ? searchFilters.seniorityLevel 
                                    : "Experience"}
                            </span>
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
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
                        <Button variant="outline" className="h-10 rounded-xl px-3 border-border font-bold text-primary gap-2">
                            More filters <ChevronDown size={14}/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Advanced Filters</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Skills (Comma separated)</Label>
                                <Input 
                                    className="rounded-xl"
                                    placeholder="e.g. React, Node" 
                                    value={tempFilters.keywords?.join(",") ?? ""} 
                                    onChange={(e) => setTempFilters(prev => ({...prev, keywords: e.target.value.split(",").filter(Boolean)}))} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Posted After</Label>
                                <Input className="rounded-xl" type="date" value={tempFilters.postedAfter || ""} onChange={(e) => setTempFilters(prev => ({...prev, postedAfter: e.target.value || undefined}))} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="h-9 rounded-xl" onClick={() => setIsFilterOpen(false)}>Cancel</Button>
                            <Button variant="default" className="h-9 rounded-xl" onClick={applyAdvancedFilters}>Apply Filters</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Clear Filters */}
                {(Object.keys(searchFilters) as Array<keyof JobFilters>).some((key) => {
                    if (key === 'pageNumber' || key === 'pageSize') return false;
                    return searchFilters[key] != DEFAULT_FILTERS[key];
                }) && (
                    <Button 
                        variant="link"
                        onClick={() => {
                            setSearchFilters(DEFAULT_FILTERS);
                            setSearchTermInput("");
                            setLocationInput("");
                        }}
                        className="h-10 text-muted-foreground font-bold flex items-center gap-1 hover:text-destructive"
                    >
                        <XIcon size={14} /> Clear
                    </Button>
                )}
            </div>
        </div>
      </div>

      {/* --- Main Content Split View --- */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left Column: Job List */}
        <div className="w-full lg:w-[400px] flex flex-col bg-card rounded-3xl border border-border shadow-sm flex-shrink-0 overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              {isFetching ? "Loading..." : `Showing ${jobsData?.data?.length || 0} of ${jobsData?.total || 0} Jobs`}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {jobsData?.data?.map((job) => (
              <JobListItem 
                key={job.id} 
                job={job} 
                isSelected={selectedJob?.id === job.id} 
              />
            ))}
            {jobsData?.data?.length === 0 && !isFetching && (
              <div className="text-center py-10 text-muted-foreground text-sm">No jobs found matching your criteria.</div>
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
        <div className="hidden lg:flex flex-1 bg-card rounded-3xl border border-border shadow-sm flex-col min-w-0 overflow-hidden">
          {selectedJob ? (
            <>
              {/* Detail Header / Tabs */}
              <div className="flex items-center justify-between px-8 border-b border-border bg-card">
                <div className="flex gap-8">
                  <button 
                    onClick={() => setRightTab('Overview')}
                    className={cn("py-4 text-sm font-bold border-b-2 transition-all", rightTab === 'Overview' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setRightTab('Company')}
                    className={cn("py-4 text-sm font-bold border-b-2 transition-all", rightTab === 'Company' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
                  >
                    Company
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleSaveJob(e, selectedJob.id)}
                    className="h-9 rounded-xl border-border font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {selectedJob.savedByUserIds?.includes(user?.id || '') ? <Heart size={14} fill="currentColor" className="text-destructive"/> : <Heart size={14}/>}
                    Save
                  </Button>
                  <ApplyJobDialog jobId={selectedJob.id} trigger={
                    <Button variant="default" size="sm" className="h-9 rounded-xl font-bold flex items-center gap-1">
                      <Zap size={12} fill="currentColor"/> Apply
                    </Button>
                  }/>
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {rightTab === 'Overview' ? (
                  <div className="max-w-5xl mx-auto flex gap-12 animate-fade-in">
                    {/* Left Inner Column: Meta Info */}
                    <div className="w-[340px] shrink-0 space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-primary bg-accent px-2 py-0.5 rounded-md text-xs font-bold capitalize">
                            {JobTypeLabel[selectedJob.type as JobType] || selectedJob.type}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" className="p-2 h-8 w-8 rounded-xl"><Share2 size={12} className="text-muted-foreground"/></Button>
                            <ReportDialog 
                                entityId={selectedJob.id} 
                                entityType="job" 
                                trigger={
                                    <Button variant="outline" className="p-2 h-8 w-8 rounded-xl hover:border-destructive hover:text-destructive">
                                        <Flag size={12}/>
                                    </Button>
                                }
                            />
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground leading-tight mb-1">{selectedJob.title}</h2>
                        <div className="text-xs text-muted-foreground mb-2">Posted {timeAgo(selectedJob.postedDate)}</div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-accent w-fit px-2 py-1 rounded-md border border-primary/10">
                           <Lock size={10}/> Authenticated Job
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-xl border border-border">
                          <AvatarImage src={selectedJob.organization?.logoFile?.url || selectedJob.companyLogo} />
                          <AvatarFallback className="rounded-xl bg-secondary text-primary font-bold text-lg">
                            {selectedJob.companyName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg text-foreground">
                          {selectedJob.organization?.name || selectedJob.companyName}
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-2xl p-4 border border-border">
                        <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Compensation Overview</div>
                        <div className="flex items-center gap-2 text-brand-success font-bold text-lg mb-1">
                          <span className="bg-emerald-100 p-1 rounded-md"><DollarSign size={16} fill="currentColor"/></span> 
                          {formatSalary(selectedJob)}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                          <MapPin size={14} className="text-primary"/> {selectedJob.location}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                          <Building2 size={14} className="text-primary"/> {selectedJob.organization?.industry?.name || "Industry N/A"}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                          <LayoutGrid size={14} className="text-primary"/> {selectedJob.seniorityLevel || "Entry Level"}
                        </div>
                      </div>
                    </div>

                    {/* Right Inner Column: Description */}
                    <div className="flex-1 space-y-6">
                      <div className="bg-muted p-1 rounded-xl flex w-full max-w-sm ml-auto">
                        <button 
                          className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", !showFullPosting ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
                          onClick={() => setShowFullPosting(false)}
                        >
                          Summary
                        </button>
                        <button 
                          className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", showFullPosting ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
                          onClick={() => setShowFullPosting(true)}
                        >
                          Full Job Posting
                        </button>
                      </div>

                      <div className="text-muted-foreground text-sm leading-relaxed">
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
                              <Button variant="link" onClick={() => setShowFullPosting(true)} className="p-0 h-auto text-primary mt-2">Read full posting</Button>
                           </div>
                        )}
                      </div>

                      {/* SKILLS SECTION */}
                      {selectedJob.keywords && selectedJob.keywords.length > 0 && (
                        <div className="pt-6 border-t border-border">
                            <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                                <Zap size={14} className="text-brand-success fill-brand-success"/> Required Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.keywords.map((skill, i) => (
                                    <span key={i} className="bg-secondary text-primary border border-border px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="bg-card rounded-2xl mb-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-4">
                          <Avatar className="h-16 w-16 rounded-2xl border border-border">
                            <AvatarImage src={selectedJob.organization?.logoFile?.url} />
                            <AvatarFallback className="text-2xl font-bold bg-secondary text-primary rounded-2xl">
                              {selectedJob.companyName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h1 className="text-2xl font-bold text-foreground">{selectedJob.organization?.name || selectedJob.companyName}</h1>
                            {selectedJob.organization?.website && (
                                <a 
                                href={selectedJob.organization.website} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-primary text-xs font-bold hover:underline flex items-center gap-1 mt-1"
                                >
                                <Globe2 size={12}/> Visit Website
                                </a>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-9 rounded-xl font-bold" onClick={() => navigate(`/company/${selectedJob.organizationId}/profile`)}>
                          View Full Profile <ArrowRight size={14} className="ml-1"/>
                        </Button>
                      </div>
                      
                      <div className="prose prose-sm text-muted-foreground mb-8">
                        <Markdown content={selectedJob.organization?.longDescription || selectedJob.organization?.shortDescription || "No company description available."} />
                      </div>

                      <div className="grid grid-cols-3 gap-6 border-t border-border pt-6">
                        <div>
                          <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Company Size</div>
                          <div className="text-sm font-medium text-foreground">{selectedJob.organization?.organizationSize || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Headquarters</div>
                          <div className="text-sm font-medium text-foreground">{selectedJob.organization?.headquartersAddress || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Founded</div>
                          <div className="text-sm font-medium text-foreground">{selectedJob.organization?.foundedDate ? new Date(selectedJob.organization.foundedDate).getFullYear() : "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Briefcase size={32} className="text-primary"/>
              </div>
              <p className="font-bold">Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}