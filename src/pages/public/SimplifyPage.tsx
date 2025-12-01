import { useState } from "react";
import {
    Search,
    MapPin,
    Briefcase,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Bell,
    HelpCircle,
    User,
    Grid,
    CheckCircle2,
    Check,
    X,
    FileText,
    UserCheck,
    Settings,
    PuzzleIcon,
    UploadCloud,
    Plus,
    Trash2,
    Linkedin,
    Github,
    Globe,
    Link as LinkIcon,
    Star,
    Crown,
    ArrowRight,
    BarChart3,
    Calendar,
    MessageSquare,
    Heart,
    PenSquare,
    Download,
    Flame,
    Zap,
    ThumbsUp,
    LogOut,
    Eye,
    File,
    Image,
    Flag,
    Building2,
    Globe2,
    Twitter,
    Facebook,
    Chrome,
    Pencil,
    RefreshCcw,
    GripVertical,
    Monitor,
    Share2,
    LayoutTemplate,
    List as ListIcon,
    MoreHorizontal,
    Bold,
    Italic,
    Underline,
    Link2,
    ListOrdered,
    RotateCcw,
    Maximize2,
    Lock,
    Mail,
    Send,
    Filter,
    ExternalLink,
    AlertCircle,
    ThumbsDown,
    Lightbulb,
    Rocket,
    Medal,
    Trophy,
    TrendingUp,
    Award  
} from "lucide-react";
// ...rest of the code...

// --- Mock Data ---

const jobs = [
  {
    id: 1,
    title: "Experienced Quant",
    company: "Da Vinci",
    location: "Mumbai, Maharashtra, India",
    type: "Full-Time",
    salary: "₹8.5M /yr",
    tags: ["In Person"],
    posted: "Applied 11/22/25",
    isNew: true,
    logoInitials: "DV",
    logoColor: "bg-blue-400 text-white",
    descriptionLines: [
        "As a Quant Trader: Generate profits, trading by position taking and market making",
        "As a Quant Trader: Manage and monitor trading risk in real-time",
        "As a Quant Trader: Develop and refine strategies for both existing and new markets",
        "As a Quant Trader: Optimize desk performance, devise new trading strategies and improve trading infrastructure",
        "As a Quant Researcher: Analyze large datasets to identify trading opportunities",
        "As a Quant Researcher: Develop tools that translate data analysis results into useful inputs for trading",
        "As a Quant Researcher: Build and back test quantitative models and strategies",
        "As a Quant Researcher: Collaborate with traders and developers to bring strategies to production",
        "As a Quant Researcher: Explore new markets and refine existing models and tools"
    ],
    status: "Already Applied"
  },
  {
    id: 2,
    title: "Sales Executive - Health Plan Vertical",
    company: "NTT Data",
    location: "San Francisco, CA, USA",
    type: "Full-Time",
    salary: "$8M - $16M /yr",
    tags: ["Hybrid"],
    posted: "1mo ago",
    isNew: false,
    logoInitials: "ND",
    logoColor: "bg-blue-600 text-white",
    descriptionLines: ["Drive sales strategies..."],
    status: null
  },
  {
    id: 3,
    title: "Managing Director - Fourier India",
    company: "Fourier",
    location: "India",
    type: "Full-Time",
    salary: "₹8M - ₹17.5M /yr",
    tags: ["Remote"],
    posted: "3d ago",
    isNew: false,
    logoInitials: "FO",
    logoColor: "bg-black text-white",
    descriptionLines: ["Lead our India operations..."],
    status: null
  },
  {
    id: 4,
    title: "Derivatives Sales Manager",
    company: "Coinbase",
    location: "Remote",
    type: "Full-Time",
    salary: "$140k - $200k /yr",
    tags: ["Remote"],
    posted: "1w ago",
    isNew: true,
    logoInitials: "CO",
    logoColor: "bg-blue-500 text-white",
    descriptionLines: ["Manage derivatives sales..."],
    status: null
  },
];


const initialResumeData = {
  firstName: "Henry",
  lastName: "User",
  email: "henry.user@gmail.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  links: { linkedin: "linkedin.com/in/henry", portfolio: "henry.dev" },
  education: [
    {
      school: "Aalborg University",
      degree: "Master's Bioinformatics",
      date: "Jan 2020 - Jan 2025",
      gpa: "4.0",
    },
  ],
  experience: [
    {
      title: "SDE II",
      company: "Orbitz",
      location: "Chicago, IL, USA",
      date: "Jan 2024 - Jan 2025",
      description: [
        "Developed scalable APIs...",
        "Optimized database queries...",
      ],
    },
  ],
  skills: ["Python", "React", "Node.js", "SQL", "AWS"],
  summary: "",
};

const initialProfileData = {
    firstName: "Henry",
    lastName: "User",
    email: "henry.user@gmail.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    links: {
        linkedin: "linkedin.com/in/henry",
        github: "github.com/henry",
        portfolio: "henry.dev"
    },
    summary: "Motivated software engineer with experience in full-stack development and cloud infrastructure.",
    education: [
        { id: 1, school: "Aalborg University", degree: "Master's, Bioinformatics", date: "Jan 2020 - Jan 2025", gpa: "4.0", location: "Aalborg, Denmark" }
    ],
    experience: [
        { 
            id: 1, 
            title: "Software Engineer II", 
            company: "Orbitz", 
            location: "Chicago, IL, USA", 
            date: "Jan 2024 - Jan 2025", 
            type: "Full Time",
            description: [
                "Developed scalable APIs using Node.js and Express to handle 1M+ daily requests.",
                "Optimized database queries reducing latency by 40%."
            ]
        }
    ],
    projects: [
        { 
            id: 1, 
            name: "NewJeans Fan Site", 
            role: "Frontend Developer",
            date: "Jan 2019 - Feb 2024", 
            location: "Remote",
            description: [
                "Built a responsive fan site using React and Tailwind CSS.",
                "Implemented real-time chat using Firebase."
            ]
        }
    ],
    skills: ["React", "Node.js", "Python", "SQL", "AWS"],
    languages: ["English", "Spanish"]
};

const daVinciProfile = {
    name: "Da Vinci",
    tagline: "Proprietary trading firm with quantitative research",
    website: "Website",
    logoInitials: "DV",
    logoColor: "bg-blue-400 text-white",
    overview: "Da Vinci is a proprietary trading house founded in 2015 by trading experts seeking a new way of working. Its goal is to become the best in the world by using smart methods and by leveraging the full talents of its team. Based in Amsterdam, a city with a long trading history, Da Vinci combines finance and technology with a culture of collaboration and a non-hierarchical structure. The firm emphasizes ownership of work, excellence, and personal growth, supporting flexible internal movement and valuing input from traders, software engineers, researchers, and founders who work closely together every day. The aim is to sustainably grow the business by challenging traditional ideas and maintaining a motivated, well-supported team.",
    stats: {
        size: "N/A",
        stage: "N/A",
        funding: "N/A",
        hq: "Verona, Italy",
        founded: "2016"
    },
    take: {
        believers: [
            "Global presence with offices in Amsterdam, Mumbai, Hong Kong, and Miami supports diverse market access.",
            "Active contributor to industry transparency and sustainability enhances reputation and influence.",
            "Offers competitive compensation and personal growth opportunities attracting top talent."
        ],
        critics: [
            "AI-driven competitors like Jane Street and Citadel threaten proprietary strategy relevance within 24 months.",
            "Increasing regulatory scrutiny on digital asset liquidity providers raises compliance costs soon.",
            "Non-hierarchical culture risks internal silos and inconsistent risk management causing financial losses."
        ],
        unique: [
            "Combines strategic minds with a motivating, non-hierarchical culture fostering innovation.",
            "Trades both digital assets and traditional instruments, focusing on volatility and liquidity.",
            "Emphasizes creative solutions to technical challenges, branding it 'the art of trading'."
        ]
    },
    benefits: [
        "Health Insurance", "Dental Insurance", "Vision Insurance", "Relocation Assistance", "Paid Vacation", "Company Equity"
    ]
};


const trackedJobs = [
  {
    id: 101,
    title: "Machine Learning Engineer",
    company: "TikTok",
    location: "Seattle, WA, USA",
    status: "Offer",
    dateSaved: "11/01/23",
    dateApplied: "11/05/23",
    logoInitials: "TK",
    logoColor: "bg-black text-white",
    notes: "Discussed relocation package during screening.",
    description: "TikTok is looking for a Machine Learning Engineer to join our recommendation team. You will be responsible for building and optimizing models that power our content discovery engine.",
    requirements: ["Ph.D. or Master's in CS", "Experience with PyTorch/TensorFlow", "Strong background in Recommendation Systems"],
    responsibilities: ["Design and implement ML models", "Collaborate with product teams", "Optimize model inference performance"]
  },
  {
    id: 102,
    title: "Experienced Quant",
    company: "Da Vinci",
    location: "Mumbai, Maharashtra, India",
    status: "Applied",
    dateSaved: "11/22/25",
    dateApplied: "11/22/25",
    logoInitials: "DV",
    logoColor: "bg-blue-400 text-white",
    notes: "",
    description: "Da Vinci is looking for experienced quants to join a highly skilled, collaborative team in solving complex problems. You will play a key role in ensuring our operations perform at the highest level possible, working to achieve our goal of building one of the best proprietary trading firms in the world.",
    requirements: [
        "3 to 10 years of experience in a quantitative role (trading, research, or development)",
        "A strong academic background in Mathematics, Physics, Engineering, Computer Science",
        "Deep understanding of financial markets and/or algorithmic trading",
        "Proficiency in programming (Python, C++)"
    ],
    responsibilities: [
        "Generate profits, trading by position taking and market making",
        "Manage and monitor trading risk in real-time",
        "Develop and refine strategies for both existing and new markets",
        "Optimize desk performance, device new trading strategies"
    ]
  },
];

// --- Auth Components ---

const CompanyLogos = () => (
  <div className="grid grid-cols-4 gap-6 mt-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
    {/* Placeholder logos mimicking the image style */}
    <div className="flex items-center justify-center font-bold text-red-500">
      Airbnb
    </div>
    <div className="flex items-center justify-center font-bold text-purple-600">
      Twitch
    </div>
    <div className="flex items-center justify-center font-bold text-green-500">
      Spotify
    </div>
    <div className="flex items-center justify-center font-bold text-indigo-600">
      Stripe
    </div>
    <div className="flex items-center justify-center font-bold text-sky-600">
      Slack
    </div>
    <div className="flex items-center justify-center font-bold text-blue-800">
      VISA
    </div>
    <div className="flex items-center justify-center font-bold text-red-600">
      Netflix
    </div>
    <div className="flex items-center justify-center font-bold text-gray-800">
      OpenAI
    </div>
  </div>
);

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex">
    {/* Left Panel */}
    <div className="hidden lg:flex lg:w-1/2 bg-[#F0F9FF] flex-col justify-center p-16 relative overflow-hidden">
      <div className="max-w-md z-10">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-md transform rotate-12"></div>
          Simplify
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          Apply to jobs in 1-click.
          <br />
          Power your entire job search, with our recruiter-approved AI.
        </h1>
        {/* Fixed Nesting: Changed <p> to <div> because it contains other divs/blocks */}
        <div className="text-gray-600 mb-8 font-medium">
          Browse handpicked jobs from the best companies
          <br />
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full border border-white"></div>
              <div className="w-6 h-6 bg-gray-400 rounded-full border border-white"></div>
            </div>
            <span>Trusted by 1,000,000+ job seekers</span>
          </div>
        </div>
        <CompanyLogos />
      </div>
      {/* Decorative Blob */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
    </div>

    {/* Right Panel (Content) */}
    <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 animate-fadeIn">
      <div className="w-full max-w-md">{children}</div>
    </div>
  </div>
);

const LoginPage = ({ onLogin, onSwitchToRegister, onForgotPassword }) => (
  <AuthLayout>
    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
      Login to your account
    </h2>
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Email Address
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-bold text-gray-500 uppercase">
            Password
          </label>
          <button
            onClick={onForgotPassword}
            className="text-xs text-blue-600 hover:underline"
          >
            Forgot your password?
          </button>
        </div>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="remember"
          className="rounded text-blue-600 focus:ring-blue-500 mr-2"
        />
        <label
          htmlFor="remember"
          className="text-sm text-gray-600 flex items-center"
        >
          Remember this device{" "}
          <HelpCircle size={12} className="inline text-gray-400 ml-1" />
        </label>
      </div>
      <button
        onClick={onLogin}
        className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg shadow-md transition-all"
      >
        Sign In
      </button>
      <div className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 font-bold hover:underline ml-1"
        >
          Register
        </button>
      </div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or log in with</span>
        </div>
      </div>
      <div className="space-y-3">
        <button className="w-full border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-bold text-gray-700">
          <Chrome size={18} /> Continue with Google
        </button>
        <button className="w-full border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-bold text-gray-700">
          <Linkedin size={18} className="text-blue-700" /> Continue with
          LinkedIn
        </button>
      </div>
    </div>
  </AuthLayout>
);

const RegisterPage = ({ onLogin, onSwitchToLogin }) => (
  <AuthLayout>
    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
      Sign up for an account
    </h2>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            First Name
          </label>
          <input
            type="text"
            placeholder="First Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <p className="text-xs text-gray-500">
        By signing up you agree to our{" "}
        <span className="text-blue-600 cursor-pointer hover:underline">
          Terms and Conditions
        </span>{" "}
        and{" "}
        <span className="text-blue-600 cursor-pointer hover:underline">
          Privacy Policy
        </span>
        .
      </p>
      <button
        onClick={onLogin}
        className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg shadow-md transition-all"
      >
        Register
      </button>
      <div className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 font-bold hover:underline ml-1"
        >
          Log In
        </button>
      </div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or register with</span>
        </div>
      </div>
      <div className="space-y-3">
        <button className="w-full border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-bold text-gray-700">
          <Chrome size={18} /> Continue with Google
        </button>
        <button className="w-full border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-bold text-gray-700">
          <Linkedin size={18} className="text-blue-700" /> Continue with
          LinkedIn
        </button>
      </div>
    </div>
  </AuthLayout>
);

const ForgotPasswordPage = ({ onSwitchToLogin, onSwitchToRegister }) => (
  <div className="min-h-screen bg-white flex flex-col">
    {/* Simple Header */}
    <div className="py-6 px-8 flex justify-between items-center max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
        <div className="w-6 h-6 bg-blue-600 rounded-md transform rotate-12"></div>
        Simplify
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
        <a href="#" className="hover:text-gray-900">
          Copilot
        </a>
        <a href="#" className="hover:text-gray-900">
          Job Application Tracker
        </a>
        <a href="#" className="hover:text-gray-900">
          Resume Builder
        </a>
        <a href="#" className="hover:text-gray-900">
          Employers
        </a>
        <a href="#" className="hover:text-gray-900">
          Blog
        </a>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onSwitchToLogin}
          className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
        >
          Log In
        </button>
        <button
          onClick={onSwitchToRegister}
          className="px-4 py-2 rounded-full bg-[#0EA5E9] text-white font-bold text-sm hover:bg-[#0284c7] transition-colors"
        >
          Sign Up
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Need help logging in?
      </h1>
      <p className="text-gray-500 mb-8">
        Type in your email and we will send you a password reset link.
      </p>

      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-gray-100 shadow-lg">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter Email Address"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none mb-6"
        />

        <button className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg shadow-md transition-all mb-4">
          Reset password
        </button>
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 font-bold hover:underline ml-1"
          >
            Register
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 font-medium mb-4">
          Jobs from thousands of companies and employers.
        </p>
        <div className="flex items-center justify-center gap-8 opacity-50 grayscale">
          <span className="text-xl font-bold tracking-widest">NETFLIX</span>
          <span className="text-xl font-serif font-bold">Medium</span>
          <span className="text-xl font-bold">ATLASSIAN</span>
          <div className="text-xl font-bold flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div> Palantir
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Modals & Sheets ---

const ReportModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
            <Flag size={20} />
          </div>
          Report Incorrect Job Info
        </h3>
        <button onClick={onClose}>
          <X size={20} className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">
            Which sections have incorrect information?{" "}
            <span className="text-red-500">*</span>
          </label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option>Select...</option>
            <option>Job Title</option>
            <option>Location</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">
            Description
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe what's wrong..."
          ></textarea>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg shadow-sm transition-all"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
);

const EditModal = ({ title, onClose, children, onSave }) => (
  <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3 text-blue-600 font-bold text-lg">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User size={20} />
          </div>
          {title}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>
      <div className="p-8 overflow-y-auto flex-1">{children}</div>
      <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
        <button
          onClick={onClose}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave || onClose}
          className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

const KeywordMatchModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        Keyword Match - <span className="text-orange-500">Needs Work</span>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Your resume has <strong>0 out of 6</strong> keywords that appear in the
        job description.
      </p>

      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex items-start gap-3 mb-6">
        <div className="p-1 bg-yellow-100 rounded text-yellow-600">
          <Zap size={14} />
        </div>
        <p className="text-xs text-yellow-800 font-medium">
          Try to get your score above 50% to increase your chances!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          "data structure",
          "e-commerce",
          "end-to-end",
          "machine learning",
          "NLP",
          "problem solving",
        ].map((kw, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
            {kw}
          </div>
        ))}
      </div>

      <button className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white py-2.5 rounded-lg font-bold text-sm shadow-sm mb-2">
        Add custom keywords +
      </button>
      <button className="w-full text-red-500 text-xs font-bold hover:underline">
        Report Keywords
      </button>
    </div>
  </div>
);

const TargetIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
    </svg>
);

const UploadResumeModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><UploadCloud size={20}/></div>
                Upload Resume
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 mb-6 leading-relaxed">
            This will replace your current uploaded resume. To unlock unlimited uploaded resumes upgrade to <span className="font-bold cursor-pointer hover:underline">Simplify+</span>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center mb-6 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 group-hover:scale-110 transition-transform">
                <Image size={24}/>
            </div>
            <p className="text-sm font-bold text-blue-600 mb-1">Please upload resume</p>
            <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 5 MB</p>
        </div>

        <div className="flex items-start gap-2 mb-6">
            <input type="checkbox" id="parse-resume" className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"/>
            <label htmlFor="parse-resume" className="text-xs text-gray-600 cursor-pointer">Parse this resume to update your profile information</label>
        </div>

        <button onClick={onClose} className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm mb-4">
            Upload
        </button>
        
        <div className="text-center">
             <span className="text-xs text-[#0EA5E9] font-medium cursor-pointer hover:underline">Or easily build an ATS-optimized resume on Simplify →</span>
        </div>
    </div>
  </div>
);

const PremiumFeaturesModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"><X size={24}/></button>
            
            <div className="p-8 text-center border-b border-gray-100 bg-white sticky top-0 z-10">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded transform rotate-12"></div> 
                    Simplify+ users get <span className="text-[#0EA5E9]">2x more interviews</span> after upgrading
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">Free</h3>
                        <p className="text-sm text-gray-500 mb-6">The best tools on the market to power your job search. Free forever.</p>
                        <ul className="space-y-3 text-sm text-gray-600">
                            {['Unlimited Application Autofilling', 'Unlimited Personalized Job Matches', 'Basic Resume Builder and 1 uploaded resume', 'Advanced Resume Keyword Analysis', 'Unlimited Job Tracking'].map((feat, i) => (
                                <li key={i} className="flex gap-2">
                                    <CheckCircle2 size={18} className="text-gray-400 shrink-0"/> {feat}
                                </li>
                            ))}
                             <li className="flex gap-2 text-gray-400">
                                    <CheckCircle2 size={18} className="text-gray-200 shrink-0"/> Access to <span className="font-bold text-blue-400">The Server</span> discord (Waiting List)
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-[#0EA5E9] mb-2 text-lg">Unlimited Simplify+</h3>
                        <p className="text-sm text-gray-500 mb-6">Our full suite of AI features, to help you optimize every application and get hired even faster.</p>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-2 font-medium"><CheckCircle2 size={18} className="text-[#0EA5E9] shrink-0"/> Everything in Free Plan</li>
                            {['AI Powered Resume Tailoring & Unlimited Resumes', 'AI Cover Letter Generator', 'AI Response Writer', 'Advanced Job Insights', 'AI powered networking & referrals'].map((feat, i) => (
                                <li key={i} className="flex gap-2">
                                    <CheckCircle2 size={18} className="text-[#0EA5E9] shrink-0"/> 
                                    <span>{feat.split('AI').length > 1 ? <><span className="font-bold">AI</span>{feat.split('AI')[1]}</> : feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { dur: '1 week', price: '$2.85/day', total: '$19.99 total', save: null },
                        { dur: '1 month', price: '$1.33/day', total: '$39.99 total', save: 'SAVE 53%', popular: false },
                        { dur: '3 months', price: '$0.99/day', total: '$89.99 total', save: 'SAVE 65%', popular: true }
                    ].map((plan, i) => (
                        <div key={i} className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center text-center ${plan.popular ? 'border-[#0EA5E9] bg-blue-50/30 relative ring-1 ring-[#0EA5E9]' : 'border-gray-200 hover:border-blue-300'}`}>
                            {plan.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1"><Star size={10} fill="white"/> Most Popular Plan</div>}
                            {plan.save && <div className="text-xs font-bold text-[#0EA5E9] mb-1">{plan.save}</div>}
                            <div className="font-bold text-sm text-gray-900 mb-2">{plan.dur} of Simplify+</div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</div>
                            <div className="text-xs text-gray-500">{plan.total}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
                <button className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-3 rounded-lg shadow-md transition-all">
                    Get Started
                </button>
            </div>
        </div>
    </div>
);

// --- Onboarding & Profile Wizard Components ---

const BreadcrumbNav = ({ steps, currentStep }) => (
  <div className="flex justify-center mb-8 overflow-x-auto py-2">
    <div className="flex space-x-6 min-w-max">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col items-center cursor-default ${
            index <= currentStep ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wider pb-1 border-b-2 ${
              index === currentStep ? "border-blue-600" : "border-transparent"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ProfileWizard = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Roles",
    "Education",
    "Experience",
    "Work Authorization",
    "EEO",
    "Skills",
    "Personal",
    "Links",
  ];

  // Helper for inputs
  const InputGroup = ({ label, type = "text", placeholder, value }) => (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-xs font-bold text-gray-700 uppercase">
        {label}
      </label>
      <input
        type={type}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
        placeholder={placeholder}
        defaultValue={value}
      />
    </div>
  );







  const YesNoGroup = ({ label }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
      <label className="text-sm font-medium text-gray-700 max-w-[70%]">
        {label}
      </label>
      <div className="flex gap-2">
        <button className="px-4 py-1.5 border border-gray-200 rounded-md text-sm font-medium hover:border-blue-500 hover:text-blue-600 focus:ring-2 focus:ring-blue-100">
          Yes
        </button>
        <button className="px-4 py-1.5 border border-gray-200 rounded-md text-sm font-medium hover:border-blue-500 hover:text-blue-600 focus:ring-2 focus:ring-blue-100">
          No
        </button>
      </div>
    </div>
  );

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 8));

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Roles
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">
              Great! Let's build your profile to start.
            </h2>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex gap-3 items-start">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                RQ
              </div>
              <p className="text-sm text-blue-900">
                The process takes ~5 minutes. Your progress will be saved!{" "}
                <span className="font-bold underline cursor-pointer">
                  Skip onboarding for now {"->"}
                </span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="First Name" placeholder="First Name" />
              <InputGroup label="Last Name" placeholder="Last Name" />
            </div>
            <SelectGroup
              label="Don't you love Simplify?"
              options={["Yes, I love it!", "Absolutely!"]}
            />
            <div className="mt-6 mb-8">
              <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">
                Upload your resume
              </label>
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-blue-50/30 hover:bg-blue-50 transition-colors cursor-pointer group">
                <UploadCloud
                  className="text-blue-400 mb-3 group-hover:scale-110 transition-transform"
                  size={32}
                />
                <p className="text-sm text-gray-600 mb-1">
                  We'll parse your resume and auto-fill your profile
                  information.
                </p>
                <p className="text-xs text-gray-400">
                  PDFs are recommended for best results.
                </p>
              </div>
            </div>
          </div>
        );
      case 1: // Education
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-8">
              Add your education history.
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Education 1</h3>
              <SelectGroup
                label="School Name"
                options={[
                  "Select School...",
                  "University of Toronto",
                  "Waterloo",
                ]}
              />
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <InputGroup label="Major" placeholder="Major" />
                </div>
                <SelectGroup
                  label="Degree Type"
                  options={["Bachelors", "Masters", "PhD"]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="GPA" placeholder="4.0" />
                <InputGroup label="Max GPA" placeholder="4.0" />
              </div>
            </div>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-2 mb-8 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
              <Plus size={16} /> Add Education
            </button>
          </div>
        );
      case 2: // Experience
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-8">
              Now, let's show off your work experience.
            </h2>
            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600">
                I'm looking for my first job (no prior experience)
              </label>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6 relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
              <h3 className="font-bold text-gray-900 mb-4">
                Work Experience 1
              </h3>
              <InputGroup label="Position Title" placeholder="Title" />
              <InputGroup label="Company" placeholder="Company Name" />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                  placeholder="I worked on..."
                />
              </div>
            </div>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-2 mb-8 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
              <Plus size={16} /> Add Experience
            </button>
          </div>
        );
      case 3: // Work Auth
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">
              Next, some work authorization information.
            </h2>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex gap-3 items-start">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                RQ
              </div>
              <p className="text-sm text-blue-900">
                Filling this out helps us ensure you're matched with jobs that
                fit your work authorization status.
              </p>
            </div>
            <div className="space-y-2">
              <YesNoGroup label="Are you authorized to work in the US?" />
              <YesNoGroup label="Are you authorized to work in Canada?" />
              <YesNoGroup label="Do you require visa sponsorship?" />
            </div>
          </div>
        );
      case 4: // EEO
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">
              Next, add your equal employment information.
            </h2>
            <SelectGroup
              label="What is your ethnicity?"
              options={[
                "Select...",
                "Asian",
                "Black or African American",
                "Hispanic or Latino",
                "White",
                "Prefer not to say",
              ]}
            />
            <div className="space-y-2 mb-6">
              <YesNoGroup label="Do you have a disability?" />
              <YesNoGroup label="Are you a veteran?" />
            </div>
            <SelectGroup
              label="What is your gender?"
              options={[
                "Select...",
                "Male",
                "Female",
                "Non-binary",
                "Prefer not to say",
              ]}
            />
          </div>
        );
      case 5: // Skills
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">
              Let's not forget to show off your skills too.
            </h2>
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">
                What skills do you have experience with?
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search for skills..."
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Python",
                "Java",
                "React",
                "Node.js",
                "SQL",
                "AWS",
                "Machine Learning",
                "Data Analysis",
              ].map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      case 6: // Personal
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">
              Almost there! A few last questions.
            </h2>
            <SelectGroup
              label="Where are you currently located?"
              options={[
                "Select...",
                "United States",
                "Canada",
                "United Kingdom",
              ]}
            />
            <InputGroup label="What is your date of birth?" type="date" />
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-bold text-gray-700 uppercase">
                What is your phone number?
              </label>
              <div className="flex gap-2">
                <div className="w-20 border border-gray-300 rounded-lg px-2 py-2.5 text-sm bg-gray-50 flex items-center justify-center">
                  🇺🇸 +1
                </div>
                <input
                  type="tel"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>
          </div>
        );
      case 7: // Links
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">
              Last step, add your personal links.
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Linkedin size={18} />
                </div>
                <input
                  type="text"
                  placeholder="https://www.linkedin.com/in/..."
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  placeholder="https://myportfolio.com"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 8: // Complete
        return (
          <div className="animate-fadeIn text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Congrats, your profile is complete!
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg max-w-sm mx-auto mb-8">
              <h3 className="font-bold text-lg mb-2">Simplify Copilot</h3>
              <p className="text-gray-500 text-sm mb-6">
                Use Simplify on any supported job sites in your Chrome browser.
              </p>
              <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-6 transform -rotate-12 shadow-lg"></div>
              <button className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                Download Extension
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {currentStep < 8 && (
        <BreadcrumbNav steps={steps} currentStep={currentStep} />
      )}
      <div className="bg-white rounded-xl p-8 min-h-[400px] shadow-sm border border-gray-100">
        {renderStepContent()}
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
          {currentStep < 8 ? (
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              {currentStep === 0 ? "Get Started ->" : "Save and Continue ->"}
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="bg-blue-600 text-white font-bold px-12 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Finish
            </button>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-wider font-medium">
          Question {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
};

const OnboardingFork = ({ onChoice }) => {
  return (
    <div className="max-w-4xl mx-auto pt-16 px-4 text-center animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Where would you like to start?
      </h1>
      <div className="bg-blue-50 border border-blue-100 rounded-full px-6 py-2 flex items-center gap-3 max-w-max mx-auto mb-12">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
          RQ
        </div>
        <p className="text-xs text-blue-900 font-medium">
          Don't worry, you can do these in any order!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col items-center text-center group">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            Get Personalized Recommendations
          </h3>
          <p className="text-gray-500 text-sm mb-8 px-4">
            Take a short questionnaire and discover green roles curated for me.
          </p>
          <div className="w-full h-40 bg-gray-50 rounded-xl mb-8 border border-gray-100 flex items-center justify-center overflow-hidden relative">
            <div className="absolute top-4 left-4 right-4 h-2 bg-blue-200 rounded-full w-3/4"></div>
            <div className="absolute top-8 left-4 h-2 bg-gray-200 rounded-full w-1/2"></div>
          </div>
          <button
            onClick={() => onChoice("preferences")}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg group-hover:bg-blue-600 transition-colors"
          >
            Get Recommendations
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col items-center text-center group">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            Build Resume & Autofill Applications
          </h3>
          <p className="text-gray-500 text-sm mb-8 px-4">
            Fill out a profile to start autofilling with Simplify Copilot and
            tailoring resumes.
          </p>
          <div className="w-full h-40 bg-gray-50 rounded-xl mb-8 border border-gray-100 flex items-center justify-center overflow-hidden relative">
            <div className="w-3/4 bg-white shadow-sm p-4 rounded border border-gray-200 space-y-2">
              <div className="h-2 bg-gray-200 w-1/3 rounded"></div>
              <div className="h-2 bg-blue-200 w-2/3 rounded"></div>
            </div>
          </div>
          <button
            onClick={() => onChoice("wizard")}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg group-hover:bg-blue-600 transition-colors"
          >
            Start Autofilling
          </button>
        </div>
      </div>
    </div>
  );
};

const PreferencesPage = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  // ... Mock data for preferences ...
  const values = [
    "Diversity & inclusion",
    "Impactful work",
    "Independence & autonomy",
    "Innovative product & tech",
    "Mentorship & career development",
  ];
  const roleCategories = [
    "Aerospace Engineering",
    "AI & Machine Learning",
    "Data & Analytics",
    "DevOps",
    "IT & Security",
    "Software Engineering",
  ];
  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "10,000+ employees",
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-center mb-2">
              Let's get started!
            </h2>
            <h3 className="text-xl font-bold text-center mb-8">
              What do you value in a new role?
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
              {values.map((val, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-center mb-8">
              What kinds of roles are you interested in?
            </h3>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-wrap gap-3 mb-8">
                {roleCategories.map((cat, i) => (
                  <button
                    key={i}
                    className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-center mb-8">
              What type of roles are you looking for?
            </h3>
            <div className="max-w-md mx-auto space-y-3 mb-8">
              <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg font-bold text-blue-700 flex items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>{" "}
                Internship
              </div>
              <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg font-bold text-blue-700 flex items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div> Full-Time
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-center mb-8">
              What is your ideal company size?
            </h3>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {companySizes.map((size, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border text-sm font-medium cursor-pointer text-center transition-all ${
                    i === 3
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-[600px] flex flex-col items-center pt-12 pb-8">
      <div className="w-full max-w-md flex items-center gap-4 mb-12 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="hover:text-gray-600 disabled:opacity-50"
        >
          ← Back
        </button>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="w-full max-w-4xl px-4 flex-1">{renderStep()}</div>
      <div className="mt-12">
        <button
          onClick={() => (step < 3 ? setStep((s) => s + 1) : onFinish())}
          className="bg-blue-500 text-white font-bold px-12 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all flex items-center gap-2"
        >
          {step === 3 ? "Finish" : "Save and Continue"} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

// --- Jobs Page Components ---

const FilterBar = () => (
  <div className="bg-white py-4">
    <h1 className="text-xl font-bold text-gray-900 mb-4">Search all Jobs</h1>
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <div className="relative flex-1 w-full max-w-xl">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by title, company, or keywords"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-shadow"
        />
      </div>
      <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
          <MapPin size={14} className="text-blue-500" /> Location{" "}
          <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-md font-bold">
            4
          </span>{" "}
          <ChevronDown size={14} className="text-gray-400" />
        </button>
        <button className="text-blue-600 text-sm font-semibold px-2 hover:underline">
          More filters
        </button>
      </div>
    </div>
  </div>
);



const JobSearchPage = ({ onCompanyClick }) => {
    const [selectedJobId, setSelectedJobId] = useState(1);
    const [rightTab, setRightTab] = useState('Overview'); // 'Overview' | 'Company'
    const [showFullJobPosting, setShowFullJobPosting] = useState(false);
    const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

    const JobCard = ({ job, isSelected }) => (
        <div 
            onClick={() => setSelectedJobId(job.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all mb-3 relative group ${isSelected ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'}`}
        >
             <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${job.logoColor} text-white`}>
                         {job.logoInitials}
                     </div>
                     <div className="font-bold text-xs text-gray-500">{job.company}</div>
                 </div>
                 <div className="text-gray-300 hover:text-gray-600"><Lock size={14}/></div>
             </div>
             <div className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-600 line-clamp-2">{job.title}</div>
             <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-bold mb-3">
                 <span className="bg-gray-100 px-2 py-1 rounded">{job.type}</span>
                 {job.salary && <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">{job.salary}</span>}
                 {job.status && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{job.status}</span>}
                 <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><MapPin size={8}/> {job.location}</span>
                 {job.tags.map(t => <span key={t} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">{t === 'In Person' ? <Building2 size={8}/> : (t === 'Remote' ? <Globe2 size={8}/> : <Briefcase size={8}/>)} {t}</span>)}
             </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto py-6 px-6 h-full flex flex-col font-sans">
            <div className="mb-6">
                 <h1 className="text-xl font-bold text-gray-900 mb-4">Search All Jobs</h1>
                 <div className="flex items-center gap-3">
                     <div className="relative flex-1 max-w-xl">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                         <input className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" placeholder="Search for roles, companies, or locations"/>
                     </div>
                     <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0EA5E9] flex items-center gap-2 hover:bg-blue-50"><MapPin size={14}/> Location <ChevronDown size={14}/></button>
                     <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0EA5E9] flex items-center gap-2 hover:bg-blue-50"><Briefcase size={14}/> Job Type <ChevronDown size={14}/></button>
                     <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0EA5E9] flex items-center gap-2 hover:bg-blue-50"><PenSquare size={14}/> Experience Level <ChevronDown size={14}/></button>
                     <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0EA5E9] flex items-center gap-2 hover:bg-blue-50"><Grid size={14}/> Category <ChevronDown size={14}/></button>
                     <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0EA5E9] flex items-center gap-2 hover:bg-blue-50">More filters <ChevronDown size={14}/></button>
                     <button className="px-3 py-2 text-gray-400 text-sm font-bold flex items-center gap-1 hover:text-gray-600"><Heart size={14} fill="currentColor" className="text-gray-300"/> Save Search</button>
                 </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left List */}
                <div className="w-[400px] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
                     <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                         <span className="text-xs font-bold text-gray-500">Showing 21 of 523,143 Jobs</span>
                         <div className="flex items-center gap-2">
                             <Toggle label="Most recent" />
                         </div>
                     </div>
                     <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
                         {jobs.map(job => <JobCard key={job.id} job={job} isSelected={selectedJobId === job.id} />)}
                     </div>
                </div>

                {/* Right Details Panel */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-w-0 overflow-hidden">
                     {/* Panel Header/Tabs */}
                     <div className="flex items-center justify-between px-8 border-b border-gray-100">
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
                              {selectedJob.status === 'Already Applied' ? (
                                  <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold">Applied 11/22/25</span>
                              ) : null}
                              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-1"><div className="w-3 h-4 border-2 border-gray-400 rounded-sm"></div> Save</button>
                              <button className="bg-[#0EA5E9] text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-sm hover:bg-[#0284c7] flex items-center gap-1"><Zap size={12} fill="currentColor"/> Apply</button>
                         </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                         {rightTab === 'Overview' ? (
                             <div className="max-w-5xl mx-auto animate-fadeIn flex gap-12">
                                  {/* Left Column: Header + Details */}
                                  <div className="w-[340px] shrink-0 space-y-6">
                                       {/* Job Header Bits */}
                                       <div>
                                           <div className="flex items-center justify-between mb-2">
                                               <span className="text-[#0EA5E9] bg-blue-50 px-2 py-0.5 rounded text-xs font-bold">Full-Time</span>
                                               <div className="flex gap-2">
                                                    <button className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-[10px] border border-gray-200 rounded px-2 py-0.5">Hide <ChevronDown size={10}/></button>
                                                    <button className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded p-1"><Share2 size={12}/></button>
                                                    <button className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded p-1"><Flag size={12}/></button>
                                               </div>
                                           </div>
                                           <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">{selectedJob.title}</h2>
                                           <div className="text-xs text-gray-500 mb-2">Confirmed live in the last 24 hours</div>
                                           <div className="flex items-center gap-1 text-[10px] font-bold text-[#0EA5E9] cursor-pointer bg-blue-50 w-fit px-2 py-1 rounded border border-blue-100">
                                               <Lock size={10}/> Unlock job analytics with <span className="italic font-extrabold">Simplify+</span>
                                           </div>
                                       </div>

                                       <div className="flex items-center gap-3">
                                           <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-white bg-blue-400 shadow-sm`}>
                                               <Briefcase size={20}/>
                                           </div>
                                           <div className="font-bold text-lg text-gray-900">Da Vinci</div>
                                       </div>
                                       
                                       <p className="text-xs text-gray-600">Proprietary trading firm with collaborative culture</p>

                                       <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <div className="font-bold text-gray-900 text-xs mb-2">Compensation Overview</div>
                                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg mb-2">
                                                <span className="bg-emerald-100 p-1 rounded"><DollarSign size={16} fill="currentColor"/></span> ₹8.5M /yr
                                            </div>
                                            <div className="text-[10px] text-gray-500 leading-snug">
                                                + Performance-based bonuses + Shareholding in the company
                                            </div>
                                       </div>

                                       <div className="space-y-4">
                                           <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                                               <PenSquare size={14} className="text-gray-400"/> Mid, Senior, Expert
                                           </div>
                                           <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                                               <MapPin size={14} className="text-gray-400"/> Mumbai, Maharashtra, India
                                           </div>
                                           <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                                               <User size={14} className="text-gray-400"/> In Person
                                           </div>
                                           <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                                               <Grid size={14} className="text-gray-400"/> Category
                                           </div>
                                       </div>

                                       {/* Quantitative Finance Card */}
                                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                            <div className="flex items-center gap-2 font-bold text-gray-900 text-xs mb-1">
                                                <Briefcase size={12}/> Quantitative Finance (4)
                                            </div>
                                            <div className="text-[10px] text-gray-500 leading-relaxed">
                                                Quantitative Analysis, Algorithm Development, Quantitative Research, Quantitative Trading
                                            </div>
                                       </div>
                                  </div>

                                  {/* Right Column: Content */}
                                  <div className="flex-1 space-y-6">
                                       {/* Toggle Summary/Full Posting */}
                                      <div className="bg-gray-100 p-1 rounded-lg flex w-full max-w-md ml-auto">
                                          <button 
                                            className={`flex-1 py-1.5 rounded-md shadow-sm text-xs font-bold transition-all ${!showFullJobPosting ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                            onClick={() => setShowFullJobPosting(false)}
                                          >
                                              Summary
                                          </button>
                                          <button 
                                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${showFullJobPosting ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                            onClick={() => setShowFullJobPosting(true)}
                                          >
                                              Full Job Posting
                                          </button>
                                      </div>

                                      {/* Always Visible Match Card */}
                                      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                                          <div className="font-bold text-gray-900 text-sm mb-3">You match the following Da Vinci's candidate preferences</div>
                                          <div className="flex items-center gap-2 text-[10px] font-bold text-yellow-800 bg-yellow-50 w-full px-3 py-2 rounded-lg mb-4 border border-yellow-100">
                                              <Lightbulb size={14} className="text-yellow-500 fill-yellow-500"/> Employers are more likely to interview you if you match these preferences:
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-4 mb-4">
                                              <div className="flex items-center justify-center gap-2 bg-white text-gray-700 font-bold text-xs py-3 rounded-full border border-gray-200 shadow-sm">
                                                  <div className="bg-emerald-500 text-white rounded-full p-0.5"><Check size={10}/></div> Degree
                                              </div>
                                              <div className="flex items-center justify-center gap-2 bg-white text-gray-700 font-bold text-xs py-3 rounded-full border border-gray-200 shadow-sm">
                                                  <div className="bg-red-500 text-white rounded-full p-0.5"><X size={10}/></div> Experience
                                              </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                               <div className="flex -space-x-2">
                                                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100')] bg-cover"></div>)}
                                               </div>
                                               <span className="font-medium">You have ways to get a <span className="font-bold text-gray-900">Da Vinci referral</span> from your network.</span>
                                               <span className="text-blue-500 font-bold cursor-pointer hover:underline ml-auto flex items-center gap-1">Get referrals <ArrowRight size={10}/></span>
                                          </div>
                                      </div>

                                      {/* Content Area */}
                                      <div className="text-xs text-gray-600 leading-relaxed space-y-6">
                                          {/* Common Intro Text (Visible in Both) */}
                                          <div>
                                              <p className="mb-4">
                                                  Da Vinci is looking for experienced quants to join a highly skilled, collaborative team in solving complex problems. You will play a key role in ensuring our operations perform at the highest level possible, working to achieve our goal of building one of the best proprietary trading firms in the world.
                                              </p>
                                              <p>
                                                  Are you looking for an exciting and dynamic work environment, where employees are given the freedom to come up with great ideas and the space to push these to completion? Then this is your once-in-a-lifetime opportunity to be part of a successful and fast-growing company.
                                              </p>
                                          </div>

                                          {/* Responsibilities (Visible in Both) */}
                                          <div>
                                              <div className="font-bold text-gray-900 text-xs mb-2">Responsibilities</div>
                                              <div className="text-xs text-gray-600 mb-2">Depending on your background and focus, your responsibilities may include:</div>
                                              <ul className="list-disc pl-4 space-y-2 text-xs text-gray-600 leading-relaxed">
                                                  {selectedJob.descriptionLines.map((line, i) => (
                                                      <li key={i}>{line}</li>
                                                  ))}
                                              </ul>
                                          </div>

                                          {/* Extended Content (Only in Full Job Posting) */}
                                          {showFullJobPosting && (
                                              <div className="animate-fadeIn space-y-6">
                                                  <div className="h-px bg-gray-100 my-4"></div>
                                                  <div>
                                                      <div className="font-bold text-gray-900 text-xs mb-2">Requirements</div>
                                                      <ul className="list-disc pl-4 space-y-2 text-xs text-gray-600 leading-relaxed">
                                                          {selectedJob.requirements?.map((req, i) => (
                                                              <li key={i}>{req}</li>
                                                          )) || <li>No specific requirements listed.</li>}
                                                      </ul>
                                                  </div>
                                                  <div>
                                                      <div className="font-bold text-gray-900 text-xs mb-2">Benefits</div>
                                                      <ul className="grid grid-cols-2 gap-2">
                                                          {daVinciProfile.benefits.map((b, i) => (
                                                              <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                                                  <CheckCircle2 size={10} className="text-emerald-500"/> {b}
                                                              </li>
                                                          ))}
                                                      </ul>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                             </div>
                         ) : (
                             // Company Tab Content (Updated to match image_ecb524.png and image_ed06ff.png)
                             <div className="max-w-4xl mx-auto animate-fadeIn">
                                 <div className="bg-white rounded-xl mb-8">
                                      <div className="flex items-start justify-between mb-6">
                                          <div className="flex gap-4">
                                              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${daVinciProfile.logoColor} shadow-sm`}>
                                                  <Briefcase size={32}/>
                                              </div>
                                              <div>
                                                  <h1 className="text-2xl font-bold text-gray-900">{daVinciProfile.name}</h1>
                                                  <div className="flex gap-2 mt-2">
                                                      <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">
                                                          <ExternalLink size={12}/> Website
                                                      </button>
                                                      <button className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">
                                                          <Linkedin size={12}/>
                                                      </button>
                                                  </div>
                                              </div>
                                          </div>
                                          <div 
                                            className="text-[#0EA5E9] text-sm font-bold flex items-center gap-1 cursor-pointer hover:underline"
                                            onClick={() => onCompanyClick(selectedJob.company)}
                                          >
                                              View Company Profile <ArrowRight size={14}/>
                                          </div>
                                      </div>

                                      <p className="text-sm text-gray-600 leading-relaxed mb-8 text-justify">
                                          {daVinciProfile.overview}
                                      </p>

                                      <div className="grid grid-cols-4 gap-8 border-t border-gray-100 pt-6 mb-8">
                                          <div><div className="text-xs text-gray-500 font-bold mb-1">Company Size</div><div className="text-sm font-medium italic text-gray-400">N/A</div></div>
                                          <div><div className="text-xs text-gray-500 font-bold mb-1">Company Stage</div><div className="text-sm font-medium italic text-gray-400">N/A</div></div>
                                          <div><div className="text-xs text-gray-500 font-bold mb-1">Total Funding</div><div className="text-sm font-medium italic text-gray-400">N/A</div></div>
                                          <div><div className="text-xs text-gray-500 font-bold mb-1">Headquarters</div><div className="text-sm font-medium">Verona, Italy</div></div>
                                          <div><div className="text-xs text-gray-500 font-bold mb-1">Founded</div><div className="text-sm font-medium">2016</div></div>
                                      </div>

                                      {/* Simplify's Take */}
                                      <div className="border-t border-gray-100 pt-8">
                                          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-6">
                                              <div className="w-5 h-5 bg-blue-500 rounded-md transform -rotate-12"></div>
                                              Simplify's Take <HelpCircle size={14} className="text-gray-400"/>
                                          </h3>

                                          <div className="space-y-6">
                                              <div>
                                                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900 mb-2">
                                                      <div className="p-1 bg-emerald-100 text-emerald-600 rounded"><Rocket size={14}/></div>
                                                      What believers are saying
                                                  </div>
                                                  <ul className="list-disc pl-8 text-xs text-gray-600 space-y-1">
                                                      <li>Global presence with offices in Amsterdam, Mumbai, Hong Kong, and Miami supports diverse market access.</li>
                                                      <li>Active contributor to industry transparency and sustainability enhances reputation and influence.</li>
                                                      <li>Offers competitive compensation and personal growth opportunities attracting top talent.</li>
                                                  </ul>
                                              </div>

                                              <div>
                                                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900 mb-2">
                                                      <div className="p-1 bg-orange-100 text-orange-600 rounded"><Flag size={14}/></div>
                                                      What critics are saying
                                                  </div>
                                                  <ul className="list-disc pl-8 text-xs text-gray-600 space-y-1">
                                                      <li>AI-driven competitors like Jane Street and Citadel threaten proprietary strategy relevance within 24 months.</li>
                                                      <li>Increasing regulatory scrutiny on digital asset liquidity providers raises compliance costs soon.</li>
                                                      <li>Non-hierarchical culture risks internal silos and inconsistent risk management causing financial losses.</li>
                                                  </ul>
                                              </div>

                                              <div>
                                                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900 mb-2">
                                                      <div className="p-1 bg-blue-100 text-blue-600 rounded"><Medal size={14}/></div>
                                                      What makes Da Vinci unique
                                                  </div>
                                                  <ul className="list-disc pl-8 text-xs text-gray-600 space-y-1">
                                                      <li>Combines strategic minds with a motivating, non-hierarchical culture fostering innovation.</li>
                                                      <li>Trades both digital assets and traditional instruments, focusing on volatility and liquidity.</li>
                                                      <li>Emphasizes creative solutions to technical challenges, branding it 'the art of trading'.</li>
                                                  </ul>
                                              </div>
                                          </div>
                                      </div>

                                      {/* Feedback */}
                                      <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-b border-gray-100 py-6 mt-8 mb-8">
                                          Help us improve and share your feedback! Did you find this helpful?
                                          <div className="flex gap-2 ml-auto">
                                              <button className="flex items-center gap-1 px-4 py-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 text-green-600 font-bold"><ThumbsUp size={12}/> Yes</button>
                                              <button className="flex items-center gap-1 px-4 py-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 text-red-600 font-bold"><ThumbsDown size={12}/> No</button>
                                          </div>
                                      </div>

                                      {/* Benefits */}
                                      <div>
                                          <h3 className="font-bold text-gray-900 text-sm mb-4">Benefits</h3>
                                          <div className="grid grid-cols-1 gap-3">
                                              {daVinciProfile.benefits.map((b, i) => (
                                                  <div key={i} className="flex items-center gap-3 text-xs font-medium text-gray-700">
                                                      <div className="w-4 h-4 bg-cyan-100 text-cyan-600 rounded flex items-center justify-center"><CheckCircle2 size={10}/></div>
                                                      {b}
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                 </div>
                             </div>
                         )}
                     </div>
                </div>
            </div>
            
            {/* Floating Feedback Button */}
            <button className="fixed bottom-6 right-6 bg-[#0EA5E9] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-[#0284c7] flex items-center gap-2 z-50">
                <MessageSquare size={16}/> Feedback
            </button>
        </div>
    );
};

// --- Company Profile Components ---

const CompanyPage = ({ onBack }) => {
    return (
        <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-[1400px] mx-auto py-8 px-6 animate-fadeIn font-sans">
                <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 uppercase tracking-wide">
                    <ArrowRight size={12} className="rotate-180"/> Back
                </button>

                <div className="grid grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Header */}
                        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                            <div className="flex gap-6 mb-6">
                                <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-bold ${daVinciProfile.logoColor} shadow-sm`}>
                                    <Briefcase size={40} />
                                </div>
                                <div className="pt-1 w-full">
                                    <div className="flex justify-between items-start w-full">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{daVinciProfile.name}</h1>
                                            <p className="text-gray-500 text-sm mb-3">{daVinciProfile.tagline}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-gray-400 mb-1">Work Here?</div>
                                            <div className="text-[10px] font-bold text-blue-500 cursor-pointer hover:underline">Claim Your Company</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50"><ExternalLink size={12}/> Website</button>
                                        <button className="flex items-center gap-1 px-2 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50"><Linkedin size={14} className="text-gray-600"/></button>
                                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50"><Share2 size={12}/> Share</button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-3">Overview</h2>
                                <p className="text-sm text-gray-600 leading-7 text-justify">
                                    {daVinciProfile.overview}
                                </p>
                            </div>

                            {/* Referral Banner */}
                            <div className="bg-gradient-to-r from-[#FFFBEB] to-white border border-[#FEF3C7] rounded-xl p-5 flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-1">
                                        <div className="text-yellow-500"><Lightbulb size={16} fill="currentColor" /></div>
                                        Want to apply to {daVinciProfile.name}?
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        You have ways to get a {daVinciProfile.name} referral from your network.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100')] bg-cover"></div>)}
                                    </div>
                                    <button className="text-blue-500 font-bold text-sm hover:underline flex items-center gap-1">
                                        Get referrals <ArrowRight size={14}/>
                                    </button>
                                </div>
                            </div>

                            {/* Simplify's Take */}
                            <div className="mb-10">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-5 h-5 bg-blue-500 rounded-md transform -rotate-12"></div>
                                    Simplify's Take <HelpCircle size={14} className="text-gray-400"/>
                                </h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="flex items-center gap-2 font-bold text-sm text-gray-900 mb-2">
                                            <div className="p-1 bg-emerald-100 text-emerald-600 rounded"><Rocket size={14}/></div>
                                            What believers are saying
                                        </h3>
                                        <ul className="space-y-1 pl-8">
                                            {daVinciProfile.take.believers.map((item, i) => (
                                                <li key={i} className="text-xs text-gray-600 list-disc">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h3 className="flex items-center gap-2 font-bold text-sm text-gray-900 mb-2">
                                            <div className="p-1 bg-orange-100 text-orange-600 rounded"><Flag size={14}/></div>
                                            What critics are saying
                                        </h3>
                                        <ul className="space-y-1 pl-8">
                                            {daVinciProfile.take.critics.map((item, i) => (
                                                <li key={i} className="text-xs text-gray-600 list-disc">{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="flex items-center gap-2 font-bold text-sm text-gray-900 mb-2">
                                            <div className="p-1 bg-blue-100 text-blue-600 rounded"><Medal size={14}/></div>
                                            What makes {daVinciProfile.name} unique
                                        </h3>
                                        <ul className="space-y-1 pl-8">
                                            {daVinciProfile.take.unique.map((item, i) => (
                                                <li key={i} className="text-xs text-gray-600 list-disc">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center gap-4 text-xs text-gray-400 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                    Help us improve and share your feedback! Did you find this helpful?
                                    <div className="flex gap-2 ml-auto">
                                        <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50"><ThumbsUp size={12}/> Yes</button>
                                        <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50"><ThumbsDown size={12}/> No</button>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="mb-2">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Benefits</h2>
                                <div className="grid grid-cols-1 gap-y-3">
                                    {daVinciProfile.benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-medium text-gray-700">
                                            <div className="w-4 h-4 bg-cyan-100 text-cyan-600 rounded flex items-center justify-center"><CheckCircle2 size={10}/></div>
                                            {benefit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* About */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm">About {daVinciProfile.name}</h3>
                            <div className="border border-gray-100 rounded-xl p-4 mb-6 bg-white">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
                                    Simplify's Rating <HelpCircle size={12} className="text-gray-400"/>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-bold text-gray-700">Why {daVinciProfile.name} is rated</span>
                                    <span className="bg-[#0EA5E9] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">C</span>
                                </div>
                                <div className="space-y-2 text-[10px] font-bold text-gray-500">
                                    <div className="flex items-center gap-2"><Trophy size={12} className="text-gray-700"/> Rated <span className="text-gray-900 font-mono">D+</span> on Competitive Edge</div>
                                    <div className="flex items-center gap-2"><TrendingUp size={12} className="text-gray-700"/> Rated <span className="text-gray-900 font-mono">B</span> on Growth Potential</div>
                                    <div className="flex items-center gap-2"><Award size={12} className="text-gray-700"/> Rated <span className="text-gray-900 font-mono">C</span> on Differentiation</div>
                                </div>
                            </div>
                            
                            <div className="space-y-4 text-xs text-gray-500">
                                <div>
                                    <div className="font-bold text-gray-400 mb-1">Industries</div>
                                    <div className="font-medium text-gray-900">-</div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-400 mb-1">Company Size</div>
                                    <div className="font-medium text-gray-900">{daVinciProfile.stats.size}</div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-400 mb-1">Company Stage</div>
                                    <div className="font-medium text-gray-900">{daVinciProfile.stats.stage}</div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-400 mb-1">Total Funding</div>
                                    <div className="font-medium text-gray-900">{daVinciProfile.stats.funding}</div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-400 mb-1">Headquarters</div>
                                    <div className="font-medium text-gray-900">{daVinciProfile.stats.hq}</div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-400 mb-1">Founded</div>
                                    <div className="font-medium text-gray-900">{daVinciProfile.stats.founded}</div>
                                </div>
                            </div>
                        </div>

                        {/* Hiring Banner */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">{daVinciProfile.name} is Hiring for 7 Jobs on Simplify!</h3>
                            <p className="text-xs text-gray-500 mb-4">Find jobs on Simplify and start your career today</p>
                            
                            <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg p-3 mb-4">
                                <div className="flex gap-2 text-[10px] text-yellow-800 leading-tight">
                                    <Lightbulb size={14} className="shrink-0 mt-0.5"/>
                                    <span>Don't see your dream role? Check out thousands of other roles on Simplify. <span className="text-blue-500 cursor-pointer font-bold hover:underline">Browse all jobs →</span></span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs font-bold cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                <span className="text-gray-700">Technical & Engineering</span>
                                <span className="text-[#0EA5E9] bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">7 Roles <ChevronDown size={10}/></span>
                            </div>
                        </div>

                        {/* People Also Viewed */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-1 text-sm">People Also Viewed</h3>
                            <p className="text-xs text-gray-500 mb-4">Discover companies similar to {daVinciProfile.name}</p>
                            <div className="space-y-3">
                                {[
                                    {name: "DV Trading", loc: "Chicago, Illinois", tag: "Quantitative Finance", count: "+1"},
                                    {name: "Leonardo.Ai", loc: "Sydney, Australia", tag: "Consumer Software", extra: "Design", count: "+2"},
                                    {name: "DL Trading", loc: "Data & Analytics", tag: "Fintech", count: "+2"}
                                ].map((co, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-3 flex items-start gap-3 hover:border-blue-300 transition-colors cursor-pointer">
                                        <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-bold text-[8px] text-gray-500 shrink-0 overflow-hidden">
                                            {/* Mock Logos */}
                                            {i === 0 ? 'DV' : (i === 1 ? <div className="w-full h-full bg-purple-600"/> : <Briefcase size={12}/>)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs text-gray-900">{co.name}</div>
                                            <div className="text-[10px] text-gray-500 mb-2">{co.loc}</div>
                                            <div className="flex gap-1 flex-wrap">
                                                <span className="bg-gray-50 border border-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded-full font-medium">{co.tag}</span>
                                                {co.extra && <span className="bg-gray-50 border border-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded-full font-medium">{co.extra}</span>}
                                                {co.count && <span className="bg-gray-50 border border-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded-full font-medium">{co.count}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Floating Feedback Button */}
            <button className="fixed bottom-6 right-6 bg-[#0EA5E9] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-[#0284c7] flex items-center gap-2 z-50">
                <MessageSquare size={16}/> Feedback
            </button>
        </div>
    );
};

const EditorSection = ({ title, isOpen, onToggle, children, onReset, badge }) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm transition-all">
        <div 
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 select-none bg-white" 
            onClick={onToggle}
        >
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                {onReset && <span className="text-gray-400 font-normal text-xs hover:text-gray-600" onClick={(e) => {e.stopPropagation(); onReset();}}><RefreshCcw size={12} className="inline mr-1"/> Reset</span>}
            </div>
            <div className="flex items-center gap-3">
                {badge && <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
                <ChevronUp size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}/>
            </div>
        </div>
        {isOpen && (
            <div className="p-5 border-t border-gray-100 bg-white animate-fadeIn">
                {children}
            </div>
        )}
    </div>
);

// --- Resume Builder Components ---

const ResumeBuilder = ({ onBack }) => {
    const [tab, setTab] = useState('content'); // 'content', 'design'
    const [resumeData, setResumeData] = useState(initialProfileData);
    const [designSettings, setDesignSettings] = useState({
        template: 'Classic',
        headerAlignment: 'Center',
        marginSize: 'Medium',
        fontFamily: 'Times New Roman',
        fontSize: '10px',
        lineHeight: '1.2',
        accentColor: '#3B82F6',
        hidePhone: false,
        hideLinkedin: false,
        hideLocation: false
    });

    const [sectionsOpen, setSectionsOpen] = useState({
        header: true,
        summary: true,
        experience: true,
        education: false,
        projects: false,
        skills: false
    });

    const toggleSection = (sec) => setSectionsOpen(prev => ({ ...prev, [sec]: !prev[sec] }));

    const handleDataChange = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const handleDesignChange = (field, value) => {
        setDesignSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-white font-sans">
            {/* Sub-header Toolbar */}
            <div className="h-14 border-b border-gray-200 px-6 flex justify-between items-center shrink-0 bg-white z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-500 hover:text-gray-900 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                        <ArrowRight size={14} className="rotate-180"/> Documents
                    </button>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <span className="font-bold text-gray-900 text-sm group-hover:underline">Henry_User_Resume</span>
                        <Pencil size={12} className="text-gray-400 group-hover:text-gray-600"/>
                    </div>
                </div>
                
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setTab('content')} 
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${tab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <PenSquare size={14}/> Edit Content
                    </button>
                    <button 
                        onClick={() => setTab('design')} 
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${tab === 'design' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Monitor size={14}/> Edit Design
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium hidden md:inline">Saved 1m ago</span>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"><Share2 size={14}/> Share</button>
                    <button className="px-3 py-1.5 bg-[#0EA5E9] rounded-lg text-xs font-bold text-white hover:bg-[#0284c7] flex items-center gap-2 shadow-sm"><Download size={14}/> Export</button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT PANEL: Editor Controls */}
                <div className="w-[450px] border-r border-gray-200 bg-white overflow-y-auto custom-scrollbar">
                    <div className="p-6 pb-24">
                    {tab === 'content' ? (
                        <div className="space-y-4 animate-fadeIn">
                            {/* Tips */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                                        <div className="p-1 bg-blue-100 rounded"><TargetIcon size={14}/></div>
                                        Tailor your resume
                                    </div>
                                    <button className="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded-md font-bold hover:bg-blue-50">Tailor to Job</button>
                                </div>
                                <p className="text-xs text-blue-600/80 ml-8">Add a job description to get AI-powered suggestions.</p>
                            </div>

                            {/* Resume Header */}
                            <EditorSection title="Resume Header" isOpen={sectionsOpen.header} onToggle={() => toggleSection('header')}>
                                <InputGroup label="Location" value={resumeData.location} onChange={(e) => handleDataChange('location', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Toggle label="Hide Phone" checked={designSettings.hidePhone} onChange={(v) => handleDesignChange('hidePhone', v)} />
                                    <Toggle label="Hide LinkedIn" checked={designSettings.hideLinkedin} onChange={(v) => handleDesignChange('hideLinkedin', v)} />
                                    <Toggle label="Hide Location" checked={designSettings.hideLocation} onChange={(v) => handleDesignChange('hideLocation', v)} />
                                </div>
                            </EditorSection>

                            {/* Summary */}
                            <EditorSection title="Professional Summary" isOpen={sectionsOpen.summary} onToggle={() => toggleSection('summary')}>
                                <div className="bg-gray-50 border border-gray-200 rounded-t-lg p-2 flex gap-1 border-b-0">
                                    {['B', 'I', 'U'].map(t => <button key={t} className="w-6 h-6 hover:bg-gray-200 rounded text-xs font-serif font-bold text-gray-600">{t}</button>)}
                                </div>
                                <textarea 
                                    className="w-full border border-gray-200 rounded-b-lg p-3 text-sm h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none -mt-px"
                                    value={resumeData.summary}
                                    onChange={(e) => handleDataChange('summary', e.target.value)}
                                />
                                <div className="flex justify-end mt-2">
                                    <button className="text-xs flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"><Zap size={12}/> AI Rewrite</button>
                                </div>
                            </EditorSection>

                            {/* Experience */}
                            <EditorSection title="Professional Experience" isOpen={sectionsOpen.experience} onToggle={() => toggleSection('experience')} badge={`${resumeData.experience.length} Items`}>
                                <button className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all mb-4 flex items-center justify-center gap-2">
                                    <Plus size={16}/> Add Experience
                                </button>
                                <div className="space-y-3">
                                    {resumeData.experience.map((exp, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:border-blue-300 transition-colors group cursor-pointer">
                                            <div className="flex justify-between items-center">
                                                <div className="font-bold text-sm text-gray-800 flex items-center gap-2">
                                                    <GripVertical size={14} className="text-gray-400 cursor-move"/>
                                                    {exp.title}
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1 hover:bg-white rounded text-gray-500"><Pencil size={14}/></button>
                                                    <button className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={14}/></button>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 ml-6">{exp.company}</div>
                                        </div>
                                    ))}
                                </div>
                            </EditorSection>

                            {/* Education */}
                            <EditorSection title="Education" isOpen={sectionsOpen.education} onToggle={() => toggleSection('education')} badge="1 Item">
                                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-sm text-gray-800">{resumeData.education[0].school}</div>
                                        <div className="text-xs text-gray-500">{resumeData.education[0].degree}</div>
                                    </div>
                                </div>
                            </EditorSection>

                            {/* Skills */}
                            <EditorSection title="Skills" isOpen={sectionsOpen.skills} onToggle={() => toggleSection('skills')}>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.skills.map(skill => (
                                        <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 border border-gray-200">
                                            {skill} <X size={12} className="cursor-pointer hover:text-red-500"/>
                                        </span>
                                    ))}
                                    <button className="text-xs text-blue-600 font-bold hover:underline ml-1">+ Add</button>
                                </div>
                            </EditorSection>

                        </div>
                    ) : (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Templates */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Layout & Design</h3>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {['Classic', 'Accent', 'Minimalist', 'Modern'].map((layout) => (
                                        <div 
                                            key={layout} 
                                            onClick={() => handleDesignChange('template', layout)}
                                            className={`cursor-pointer group relative`}
                                        >
                                            <div className={`w-full aspect-[0.7] border-2 rounded-xl overflow-hidden transition-all ${designSettings.template === layout ? 'border-[#0EA5E9] ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}`}>
                                                {/* Mini Resume Mockup */}
                                                <div className={`w-full h-full p-3 flex flex-col gap-2 ${layout === 'Modern' ? 'bg-slate-800' : 'bg-white'}`}>
                                                    {layout === 'Accent' && <div className="h-8 bg-blue-100 w-full mb-1 rounded-sm"></div>}
                                                    <div className={`h-2 w-2/3 rounded-sm ${layout === 'Modern' ? 'bg-slate-600' : 'bg-gray-200'}`}></div>
                                                    <div className="space-y-1 mt-2">
                                                        <div className={`h-1 w-full rounded-sm ${layout === 'Modern' ? 'bg-slate-700' : 'bg-gray-100'}`}></div>
                                                        <div className={`h-1 w-5/6 rounded-sm ${layout === 'Modern' ? 'bg-slate-700' : 'bg-gray-100'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 px-1">
                                                <span className="text-xs font-bold text-gray-700">{layout}</span>
                                                {designSettings.template === layout && <CheckCircle2 size={14} className="text-[#0EA5E9]"/>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Settings Controls */}
                            <div className="space-y-5">
                                <SelectGroup 
                                    label="Header Alignment" 
                                    value={designSettings.headerAlignment} 
                                    onChange={(e) => handleDesignChange('headerAlignment', e.target.value)}
                                    options={['Left', 'Center', 'Right']} 
                                />
                                <SelectGroup 
                                    label="Margin Size" 
                                    value={designSettings.marginSize}
                                    onChange={(e) => handleDesignChange('marginSize', e.target.value)}
                                    options={['Small', 'Medium', 'Large']} 
                                />
                                <SelectGroup 
                                    label="Font Family" 
                                    value={designSettings.fontFamily}
                                    onChange={(e) => handleDesignChange('fontFamily', e.target.value)}
                                    options={['Times New Roman', 'Arial', 'Courier New']} 
                                />
                                
                                <div className="pt-4 border-t border-gray-100">
                                    <label className="text-xs font-bold text-gray-700 uppercase mb-3 block">Font Size</label>
                                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
                                        {['10px', '11px', '12px'].map(size => (
                                            <button 
                                                key={size}
                                                onClick={() => handleDesignChange('fontSize', size)}
                                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${designSettings.fontSize === size ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {designSettings.template === 'Accent' && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="text-xs font-bold text-gray-700 uppercase mb-3 block">Accent Color</label>
                                        <ColorPicker selected={designSettings.accentColor} onChange={(c) => handleDesignChange('accentColor', c)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* RIGHT PANEL: Live Preview */}
                <div className="flex-1 bg-gray-100 p-8 overflow-y-auto flex flex-col items-center relative bg-dots">
                    {/* Floating Zoom Controls */}
                    <div className="absolute top-6 right-8 flex items-center gap-2 bg-white rounded-lg shadow-md border border-gray-200 p-1.5 z-10">
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronDown size={16}/></button>
                        <span className="text-xs font-bold text-gray-700 px-2 min-w-[3rem] text-center">100%</span>
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronUp size={16}/></button>
                    </div>

                    {/* Page Preview */}
                    <ResumePreview data={resumeData} design={designSettings} />
                </div>
            </div>
        </div>
    );
};

const ColorPicker = ({ selected, onChange }) => {
    const colors = ['#000000', '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B'];
    return (
        <div className="flex gap-2">
            {colors.map(c => (
                <div 
                    key={c}
                    onClick={() => onChange(c)}
                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${selected === c ? 'border-gray-400' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                />
            ))}
        </div>
    );
}


const ResumePreview = ({ data, design }) => {
    const fontFamilyClass = {
        'Times New Roman': 'font-serif',
        'Arial': 'font-sans',
        'Courier New': 'font-mono'
    }[design.fontFamily] || 'font-sans';

    const marginClass = {
        'Small': 'p-4',
        'Medium': 'p-8',
        'Large': 'p-12'
    }[design.marginSize] || 'p-8';

    const alignClass = {
        'Left': 'text-left',
        'Center': 'text-center',
        'Right': 'text-right'
    }[design.headerAlignment] || 'text-center';

    const headerStyle = {
        color: design.template === 'Modern' ? '#fff' : (design.template === 'Accent' ? design.accentColor : '#000')
    };

    // --- Template Headers ---
    const ClassicHeader = () => (
        <div className={`mb-6 border-b-2 border-gray-800 pb-4 ${alignClass}`}>
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-2" style={headerStyle}>{data.firstName} {data.lastName}</h1>
            <div className={`text-[10px] text-gray-600 flex flex-wrap gap-2 ${alignClass === 'text-center' ? 'justify-center' : (alignClass === 'text-right' ? 'justify-end' : 'justify-start')}`}>
                <span>{data.email}</span>
                {!design.hidePhone && <span>• {data.phone}</span>}
                {!design.hideLocation && <span>• {data.location}</span>}
                {!design.hideLinkedin && <span>• {data.links.linkedin}</span>}
            </div>
        </div>
    );

    const AccentHeader = () => (
        <div className="bg-slate-900 text-white p-8 mb-6 text-center">
            <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.firstName} {data.lastName}</h1>
            <div className="text-[10px] text-gray-300 flex flex-wrap justify-center gap-3">
                <span>{data.email}</span>
                {!design.hidePhone && <span>{data.phone}</span>}
                {!design.hideLocation && <span>{data.location}</span>}
            </div>
        </div>
    );

    const MinimalistHeader = () => (
        <div className={`mb-8 ${alignClass}`}>
            <h1 className="text-4xl font-light tracking-tight mb-1">{data.firstName} {data.lastName}</h1>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">Software Engineer</div>
            <div className="text-[10px] text-gray-500 flex flex-col gap-0.5">
                <span>{data.email}</span>
                {!design.hidePhone && <span>{data.phone}</span>}
                {!design.hideLocation && <span>{data.location}</span>}
            </div>
        </div>
    );

    // --- Sections ---
    const SectionTitle = ({ title }) => (
        <h2 className={`text-xs font-bold uppercase mb-3 tracking-wider ${design.template === 'Modern' ? 'text-gray-400' : 'text-gray-900 border-b border-gray-300 pb-1'}`}>
            {title}
        </h2>
    );

    return (
        <div 
            className={`w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto transition-all duration-300 ${fontFamilyClass} ${design.template === 'Modern' ? 'bg-slate-900 text-gray-300' : 'bg-white text-gray-900'}`}
            style={{ fontSize: design.fontSize, lineHeight: design.lineHeight }}
        >
            {design.template === 'Accent' ? <AccentHeader /> : (design.template === 'Minimalist' ? <div className={marginClass}><MinimalistHeader /></div> : <div className={marginClass}><ClassicHeader /></div>)}
            
            <div className={design.template === 'Accent' ? marginClass : (design.template === 'Minimalist' ? 'px-' + marginClass.split('-')[1] : 'px-' + marginClass.split('-')[1])}>
                {/* Summary */}
                {data.summary && (
                    <div className="mb-6">
                        <SectionTitle title="Professional Summary" />
                        <p className="text-justify">{data.summary}</p>
                    </div>
                )}

                {/* Education */}
                <div className="mb-6">
                    <SectionTitle title="Education" />
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <div className="flex justify-between font-bold">
                                <span>{edu.school}</span>
                                <span>{edu.date}</span>
                            </div>
                            <div className="flex justify-between italic text-[0.95em] opacity-90">
                                <span>{edu.degree}</span>
                                <span>{edu.location}</span>
                            </div>
                            {edu.gpa && <div className="text-[0.9em]">GPA: {edu.gpa}</div>}
                        </div>
                    ))}
                </div>

                {/* Experience */}
                <div className="mb-6">
                    <SectionTitle title="Experience" />
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between font-bold">
                                <span>{exp.company}</span>
                                <span>{exp.location}</span>
                            </div>
                            <div className="flex justify-between italic text-[0.95em] mb-1">
                                <span>{exp.title}</span>
                                <span>{exp.date}</span>
                            </div>
                            <ul className="list-disc ml-4 space-y-0.5 opacity-90">
                                {exp.description && exp.description.map((desc, j) => (
                                    <li key={j}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div className="mb-6">
                    <SectionTitle title="Projects" />
                    {data.projects.map((proj, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between font-bold">
                                <span>{proj.name}</span>
                                <span>{proj.date}</span>
                            </div>
                            <div className="italic text-[0.95em] mb-1">{proj.role}</div>
                            <ul className="list-disc ml-4 space-y-0.5 opacity-90">
                                {proj.description && proj.description.map((desc, j) => (
                                    <li key={j}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div className="mb-6">
                    <SectionTitle title="Skills" />
                    <div>
                        <span className="font-bold">Technical Skills:</span> {data.skills.join(', ')}
                    </div>
                    <div className="mt-1">
                        <span className="font-bold">Languages:</span> {data.languages.join(', ')}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DocumentsDashboard = ({ onOpenBuilder, onUpload, onPremium }) => {
    const myResumes = [
        { id: 1, name: 'Henry_User_resume', created: '11/28/23, 10:30 AM', lastEdited: '11/28/23, 10:32 AM', type: 'uploaded' },
        { id: 2, name: 'Machine Learning Engineer', created: '11/28/23, 10:17 AM', lastEdited: '11/28/23, 10:19 AM', type: 'generated' }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 px-6 animate-fadeIn">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">My Documents</h1>
                    <p className="text-sm text-gray-500">Manage and tailor all of your job search documents here!</p>
                </div>
                <button onClick={onUpload} className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition-colors">
                    <UploadCloud size={16}/> Upload a resume
                </button>
            </div>

            <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Create a new document</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onClick={onOpenBuilder} className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors"><FileText size={20}/></div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Resume</h3>
                        <p className="text-xs text-gray-500">Craft your perfect resume and tailor it to job descriptions.</p>
                    </div>
                    <div onClick={onPremium} className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#0EA5E9] text-white p-1 rounded-bl-lg shadow-sm"><Zap size={12} fill="white"/></div>
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors"><File size={20}/></div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Cover Letter</h3>
                        <p className="text-xs text-gray-500">Create and customize a cover letter with AI.</p>
                    </div>
                    <div onClick={onPremium} className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#0EA5E9] text-white p-1 rounded-bl-lg shadow-sm"><Zap size={12} fill="white"/></div>
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors"><MessageSquare size={20}/></div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Question Response</h3>
                        <p className="text-xs text-gray-500">Generate tailored responses to application questions.</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Resumes</h2>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="text" placeholder="Search by name" className="pl-8 pr-4 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-300 w-48"/>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase w-1/2">Resume Name</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Created</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Last Edited</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {myResumes.map((doc) => (
                                <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500"></div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">{doc.name}</div>
                                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mt-1 ${doc.type === 'uploaded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{doc.type === 'uploaded' ? 'Uploaded' : 'Generated'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium uppercase">{doc.created}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium uppercase">{doc.lastEdited}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-3 text-gray-400">
                                            <button onClick={doc.type === 'generated' ? onOpenBuilder : undefined} className="hover:text-gray-900" title="Edit"><PenSquare size={16}/></button>
                                            <button className="hover:text-gray-900" title="Download"><Download size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const DocumentsPage = () => {
    const [view, setView] = useState('list'); // 'list' or 'builder'
    const [showUpload, setShowUpload] = useState(false);
    const [showPremium, setShowPremium] = useState(false);

    if (view === 'builder') {
        return <ResumeBuilder onBack={() => setView('list')} />;
    }

    return (
        <>
            {showUpload && <UploadResumeModal onClose={() => setShowUpload(false)} />}
            {showPremium && <PremiumFeaturesModal onClose={() => setShowPremium(false)} />}
            <DocumentsDashboard 
                onOpenBuilder={() => setView('builder')} 
                onUpload={() => setShowUpload(true)}
                onPremium={() => setShowPremium(true)}
            />
        </>
    );
};

// --- Job Tracker Components ---

const JobTrackerPage = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
  const [selectedJob, setSelectedJob] = useState(null);

  // Kanban Board Component
  const KanbanBoard = () => {
    const columns = [
        { id: 'Saved', title: 'SAVED', count: 0, items: [] },
        { id: 'Applied', title: 'APPLIED', count: 1, items: [trackedJobs[1]] }, // Quant
        { id: 'Interviewing', title: 'INTERVIEWING', count: 0, items: [] },
        { id: 'Offer', title: 'OFFER', count: 1, items: [trackedJobs[0]] }, // TikTok
        { id: 'Rejected', title: 'REJECTED', count: 0, items: [] },
    ];

    return (
        <div className="flex h-[calc(100vh-280px)] gap-4 overflow-x-auto pb-4">
            {columns.map(col => (
                <div key={col.id} className="min-w-[280px] w-full max-w-[320px] flex flex-col bg-gray-50/50 rounded-xl border border-gray-200/60">
                     <div className="p-3 font-bold text-xs text-gray-500 uppercase tracking-wider flex justify-between items-center">
                        {col.title} ({col.items.length})
                        <button className="text-gray-400 hover:text-gray-600"><Plus size={14}/></button>
                     </div>
                     <div className="flex-1 p-2 space-y-3 overflow-y-auto custom-scrollbar">
                        {col.items.map(job => (
                            <div 
                                key={job.id} 
                                onClick={() => setSelectedJob(job)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${job.logoColor}`}>
                                        {job.logoInitials}
                                    </div>
                                    <Heart size={16} className="text-gray-300 group-hover:text-pink-400 transition-colors"/>
                                </div>
                                <div className="font-bold text-gray-900 text-sm mb-1">{job.title}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mb-0.5">
                                    <Building2 size={12}/> {job.company}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin size={12}/> {job.location}
                                </div>
                            </div>
                        ))}
                        {col.items.length === 0 && (
                            <div className="h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs">
                                No jobs
                            </div>
                        )}
                     </div>
                </div>
            ))}
        </div>
    );
  };

  // List View Component (Updated to match Image 220)
  const ListView = () => (
      <div className="space-y-4">
          {trackedJobs.map(job => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center hover:border-blue-300 transition-all shadow-sm group">
                   <div className="p-2 mr-2 cursor-pointer hover:bg-gray-100 rounded-full text-gray-400"><Heart size={18}/></div>
                   
                   <div className="w-[300px] flex items-center gap-4 cursor-pointer" onClick={() => setSelectedJob(job)}>
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm ${job.logoColor}`}>
                           {job.logoInitials}
                       </div>
                       <div>
                           <div className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{job.title}</div>
                           <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                               <span className="font-semibold flex items-center gap-1"><Building2 size={10}/> {job.company}</span>
                               <span className="text-gray-300">•</span>
                               <span className="flex items-center gap-1"><MapPin size={10}/> {job.location}</span>
                           </div>
                       </div>
                   </div>

                   <div className="flex-1 px-8">
                       <div className="relative flex justify-between items-center h-10">
                            {/* Track line background */}
                            <div className="absolute top-[20%] left-0 right-0 h-1 bg-[#E2E8F0] -translate-y-1/2 z-0 rounded-full"></div>
                            
                             {/* Colored Progress Line Overlay */}
                            <div 
                                className="absolute top-[20%]  left-0 h-1 bg-[#22C55E] -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
                                style={{ 
                                    width: job.status === 'Offer' ? '100%' : (job.status === 'Applied' ? '25%' : '0%'),
                                    background: job.status === 'Offer' ? '#10B981' : '#0EA5E9' // Green for offer, Blue for others
                                }}
                            ></div>

                            {/* Steps */}
                            {['Saved', 'Applied', 'Screen', 'Interview', 'Offer'].map((step, idx) => {
                                const currentStep = job.status; 
                                const stepIdx = ['Saved', 'Applied', 'Screen', 'Interview', 'Offer'].indexOf(step);
                                const currentIdx = ['Saved', 'Applied', 'Screen', 'Interview', 'Offer'].indexOf(currentStep);
                                
                                const isCompleted = stepIdx <= currentIdx;
                                const isCurrent = stepIdx === currentIdx;

                                // Specific dates from image 220
                                let dateDisplay = null;
                                if (step === 'Saved') dateDisplay = job.dateSaved;
                                if (step === 'Applied') dateDisplay = job.dateApplied;
                                if (step === 'Interview' && job.status === 'Offer') dateDisplay = "11/05/25";
                                if (step === 'Offer' && job.status === 'Offer') dateDisplay = "11/05/26";


                                return (
                                    <div key={step} className="relative z-10 flex flex-col items-center">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">{step}</div>
                                        
                                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center bg-white ${isCompleted ? (job.status === 'Offer' ? 'border-[#10B981]' : 'border-[#0EA5E9]') : 'border-gray-300'}`}>
                                            {isCompleted && <div className={`w-2 h-2 rounded-full ${job.status === 'Offer' ? 'bg-[#10B981]' : 'bg-[#0EA5E9]'}`}></div>}
                                        </div>

                                        <div className="text-[10px] text-gray-500 font-bold mt-2 font-mono h-4">
                                            {dateDisplay || (isCompleted ? '11/25/25' : '')}
                                        </div>
                                    </div>
                                );
                            })}
                       </div>
                   </div>

                   <div className="w-[140px] flex justify-end">
                       <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
                           {job.status} <ChevronDown size={14} className="text-gray-400"/>
                       </button>
                   </div>
              </div>
          ))}
      </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-6 animate-fadeIn h-full">
      {/* Detail Drawer */}
      {selectedJob && <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />}

      <div className="flex justify-between items-end mb-6">
          <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Job Tracker</h1>
              <div className="flex items-center gap-6 border-b border-gray-200 w-fit">
                  <div className="pb-3 border-b-2 border-[#0EA5E9] text-[#0EA5E9] font-bold text-sm cursor-pointer">
                      2 TOTAL JOBS
                  </div>
                  <div className="pb-3 border-b-2 border-transparent text-gray-500 font-bold text-sm hover:text-gray-700 cursor-pointer flex items-center gap-2">
                      Active
                  </div>
                  <div className="pb-3 border-b-2 border-transparent text-gray-500 font-bold text-sm hover:text-gray-700 cursor-pointer">
                      Archived
                  </div>
              </div>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
              <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-blue-50 text-[#0EA5E9]' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                      <ListIcon size={14}/> Tracked Jobs
                  </button>
                  <button 
                    onClick={() => setViewMode('board')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'board' ? 'bg-blue-50 text-[#0EA5E9]' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                      <LayoutTemplate size={14}/> Flow Chart
                  </button>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-[#0EA5E9] rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
                  <Download size={14}/> Export CSV
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-[#0EA5E9] rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
                  <UploadCloud size={14}/> Import CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] text-white rounded-lg text-xs font-bold hover:bg-[#0284c7] shadow-sm transition-colors">
                  <Plus size={16}/> Add Application
              </button>
          </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 mb-6">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
              <input 
                type="text" 
                placeholder="Search for roles or companies" 
                className="w-full pl-10 pr-4 py-2 text-sm outline-none text-gray-700 placeholder-gray-400"
              />
          </div>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium px-2 cursor-pointer hover:text-gray-700">
              Applied from <ChevronDown size={14}/>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium px-2 cursor-pointer hover:text-gray-700">
              Applied until <ChevronDown size={14}/>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium px-2 cursor-pointer hover:text-gray-700">
              Job Type <ChevronDown size={14}/>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium px-2 cursor-pointer hover:text-gray-700">
              Status <ChevronDown size={14}/>
          </div>
          <div className="p-1.5 rounded-full text-[#0EA5E9] bg-blue-50 cursor-pointer">
              <ChevronDown size={16}/>
          </div>
      </div>

      {/* Manage Bar */}
      <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-700">
                  <Grid size={14}/> Manage Jobs
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 bg-white">
                  <RotateCcw size={12}/> Archive all
              </button>
          </div>
          {viewMode === 'list' && (
               <div className="grid grid-cols-[300px_1fr_140px] w-[calc(100%-350px)] ml-auto text-xs font-bold text-gray-400 uppercase tracking-wider pr-4 pl-8">
                   <div className="text-center">SAVED (0)</div>
                   <div className="flex justify-between px-12">
                        <span>APPLIED (1)</span>
                        <span>INTERVIEWING (0)</span>
                        <span>OFFER (1)</span>
                        <span>REJECTED (0)</span>
                   </div>
                   <div></div>
               </div>
          )}
      </div>

      {viewMode === 'list' ? <ListView /> : <KanbanBoard />}
    </div>
  );
};

const JobDetailDrawer = ({ job, onClose }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    // Enhanced Email State
    const [expandedEmailSection, setExpandedEmailSection] = useState('Application'); // 'Application' | 'Interview' | 'Offer'
    const [selectedEmailType, setSelectedEmailType] = useState('Follow Up After Application');

    const tabs = ['Overview', 'Documents', 'Resume Match', 'AI Email'];

    if (!job) return null;

    const StatusTimeline = () => {
        const steps = [
            { id: 'Saved', date: job.dateSaved, done: true },
            { id: 'Applied', date: job.dateApplied, done: true },
            { id: 'Screen', date: null, done: false },
            { id: 'Interviewing', date: null, done: false },
            { id: 'Offer', date: job.status === 'Offer' ? 'Today' : null, done: job.status === 'Offer' }
        ];

        return (
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-900">Application Status</span>
                </div>
                <div className="mb-4">
                    <div className="relative">
                         <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium">
                            <option>{job.status === 'Offer' ? 'Offer' : 'Applied'}</option>
                            <option>Interviewing</option>
                            <option>Rejected</option>
                        </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                    </div>
                </div>
                <div className="relative pl-2 space-y-6">
                    <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                    {steps.map((step, i) => (
                        <div key={i} className="relative flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 z-10 flex items-center justify-center bg-white ${step.done ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-gray-300'}`}>
                                {step.done && <div className="w-2.5 h-2.5 bg-[#0EA5E9] rounded-full"></div>}
                            </div>
                            <div className="flex-1">
                                <div className={`text-sm font-medium ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.id}</div>
                            </div>
                            {step.done && step.date && (
                                <div className="text-xs text-[#0EA5E9] font-medium flex items-center gap-1">
                                    {step.date} <CheckCircle2 size={12} fill="#0EA5E9" className="text-white"/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const NotesSection = () => (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-[300px]">
            <div className="text-xs font-bold text-gray-900 mb-3">Notes</div>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2 text-gray-400">
                <Bold size={14} className="hover:text-gray-600 cursor-pointer"/>
                <Italic size={14} className="hover:text-gray-600 cursor-pointer"/>
                <Underline size={14} className="hover:text-gray-600 cursor-pointer"/>
                <div className="w-px h-3 bg-gray-200 mx-1"></div>
                <Link2 size={14} className="hover:text-gray-600 cursor-pointer"/>
                <ListOrdered size={14} className="hover:text-gray-600 cursor-pointer"/>
                <div className="w-px h-3 bg-gray-200 mx-1"></div>
                <RotateCcw size={14} className="hover:text-gray-600 cursor-pointer"/>
                <RotateCcw size={14} className="hover:text-gray-600 cursor-pointer rotate-180"/>
            </div>
            <textarea 
                className="w-full flex-1 resize-none outline-none text-sm text-gray-600 placeholder-gray-400"
                placeholder="Add notes, reminders, or contacts for this job"
                defaultValue={job.notes}
            />
        </div>
    );

    const EmailOptionCard = ({ title, description, isSelected, onClick }) => (
        <div 
            onClick={onClick}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${isSelected ? 'border-[#0EA5E9] bg-blue-50/50 ring-1 ring-[#0EA5E9]' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}
        >
            <div className="text-sm font-bold text-gray-900 mb-1">{title}</div>
            <div className="text-xs text-gray-500 leading-snug">{description}</div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 animate-fadeIn" onClick={onClose}>
            <div className="w-full max-w-[95%] lg:max-w-[1100px] bg-white h-full shadow-2xl flex flex-col animate-slideInRight" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${job.logoColor}`}>
                            {job.logoInitials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                                <Lock size={14} className="text-gray-400"/>
                            </div>
                            <div className="text-sm text-gray-500">{job.company}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-blue-200 text-blue-500 rounded-lg text-sm font-bold hover:bg-blue-50">
                            <Heart size={16}/> Favorite
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-blue-500 rounded-lg text-sm font-bold hover:bg-gray-50">
                            <UploadCloud size={16}/> Archive
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-red-100 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50">
                            <Trash2 size={16}/> Delete
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 ml-2">
                            <X size={20}/>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex bg-[#F8F9FB]">
                    {/* Left Panel (Tabs & Content) */}
                    <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 bg-white m-4 mr-0 rounded-l-xl border-y shadow-sm">
                        {/* Tabs */}
                        <div className="flex items-center gap-6 px-6 border-b border-gray-200">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab ? 'border-[#0EA5E9] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab === 'Overview' && <Briefcase size={16}/>}
                                    {tab === 'Documents' && <FileText size={16}/>}
                                    {tab === 'Resume Match' && <CheckCircle2 size={16}/>}
                                    {tab === 'AI Email' && <Mail size={16}/>}
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {activeTab === 'Overview' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Job Posting</h3>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-4 text-sm">
                                                <div>
                                                    <div className="text-gray-500 mb-1">Location</div>
                                                    <div className="font-medium text-gray-900">{job.location}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 mb-1">Salary</div>
                                                    <div className="font-medium text-gray-900 flex items-center gap-2">13.6M <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 rounded">est</span></div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 mb-1">Job Type</div>
                                                    <div className="font-medium text-gray-900">Full-Time</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 mb-1">URL</div>
                                                    <div className="font-bold text-[#0EA5E9] flex items-center gap-1 cursor-pointer hover:underline">View Job Posting <LinkIcon size={12}/></div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded bg-gray-50"><Lock size={16}/></button>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase mb-3">Description</div>
                                        <p className="text-sm text-gray-700 leading-relaxed mb-4">{job.description}</p>
                                        
                                        {job.requirements && (
                                            <>
                                                <div className="text-xs font-bold text-gray-900 mb-2">Requirements</div>
                                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
                                                    {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                                </ul>
                                            </>
                                        )}
                                        {job.responsibilities && (
                                            <>
                                                <div className="text-xs font-bold text-gray-900 mb-2">Responsibilities</div>
                                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                                    {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Documents' && (
                                <div className="animate-fadeIn h-full flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="font-bold text-gray-900 mb-2">Documents</h3>
                                        <p className="text-sm text-gray-500 mb-4">Add resume used to apply</p>
                                        <div className="flex gap-3">
                                            <button className="bg-[#0EA5E9] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-[#0284c7]">Generate a tailored document</button>
                                            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50">Link existing resume</button>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-xl overflow-hidden flex-1 flex flex-col bg-white">
                                         <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Resume</div>
                                                <div className="text-sm font-bold text-gray-900">Machine Learning Engineer</div>
                                            </div>
                                            <div className="flex gap-3 text-xs font-bold">
                                                <button className="text-[#0EA5E9] flex items-center gap-1"><Pencil size={12}/> Change</button>
                                                <button className="text-red-500 flex items-center gap-1"><Trash2 size={12}/> Delete</button>
                                            </div>
                                         </div>
                                         <div className="flex-1 bg-gray-200 p-8 overflow-y-auto">
                                             {/* Resume Preview Box */}
                                             <div className="bg-white shadow-lg mx-auto w-[90%] max-w-[600px] min-h-[500px] rounded-sm p-8 text-[10px]">
                                                 <div className="text-center mb-6">
                                                     <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Henry User</h1>
                                                     <div className="text-gray-600">henry.user@gmail.com</div>
                                                     <div className="text-gray-600">linkedin.com/in/henry | github.com/henry</div>
                                                 </div>
                                                 <div className="mb-4">
                                                     <h2 className="text-sm font-serif font-bold border-b border-gray-300 mb-2 pb-1">Education</h2>
                                                     <div className="flex justify-between font-bold"><span>Aalborg University</span><span>Jan 2020 - 2025</span></div>
                                                     <div className="flex justify-between italic text-gray-600"><span>Master's, Bioinformatics</span><span>GPA: 4.0</span></div>
                                                 </div>
                                                 <div className="mb-4">
                                                     <h2 className="text-sm font-serif font-bold border-b border-gray-300 mb-2 pb-1">Experience</h2>
                                                     <div className="flex justify-between font-bold"><span>Orbitz</span><span>Chicago, IL</span></div>
                                                     <div className="flex justify-between italic text-gray-600 mb-1"><span>Software Engineer II</span><span>Jan 2024 - Present</span></div>
                                                     <ul className="list-disc pl-4 space-y-1 text-gray-700">
                                                         <li>Developed scalable APIs using Node.js...</li>
                                                         <li>Optimized database queries...</li>
                                                     </ul>
                                                 </div>
                                             </div>
                                         </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Resume Match' && (
                                <div className="animate-fadeIn">
                                     <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={16} className="text-gray-900"/>
                                            <h3 className="font-bold text-gray-900">Job Description</h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#F59E0B]">
                                            <CheckCircle2 size={16}/>
                                            <h3 className="font-bold">Keyword Match - Needs Work</h3>
                                        </div>
                                     </div>

                                     <div className="grid grid-cols-2 gap-8">
                                         <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                             {job.description}
                                             <br/><br/>
                                             <span className="font-bold text-gray-900">Responsibilities:</span>
                                             <ul className="list-disc pl-5 mt-2 space-y-2">
                                                {job.responsibilities?.map((r,i) => <li key={i}>{r}</li>)}
                                             </ul>
                                         </div>
                                         <div>
                                             <div className="bg-white border border-gray-200 rounded-xl p-6 text-center mb-6">
                                                 <p className="text-sm text-gray-600 mb-4">Your resume has <strong>0 out of 6 (0%)</strong> keywords that appear in the job description.</p>
                                                 <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-100 mb-2">
                                                     <Zap size={12}/> Try to get your score above 70%
                                                 </div>
                                             </div>
                                             <div className="grid grid-cols-2 gap-4">
                                                 {['Python', 'C++', 'mathematics', 'Financial markets', 'attention to detail', 'communication skills'].map(kw => (
                                                     <div key={kw} className="flex items-center gap-2 text-sm text-gray-700">
                                                         <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center"><CheckCircle2 size={10} className="text-gray-300"/></div>
                                                         {kw}
                                                     </div>
                                                 ))}
                                             </div>
                                             <button className="w-full mt-6 text-red-500 font-bold text-xs hover:underline">Report Keywords</button>
                                         </div>
                                     </div>
                                </div>
                            )}

                            {activeTab === 'AI Email' && (
                                <div className="animate-fadeIn">
                                    <div className="mb-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                                            Select Email Type to Generate
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            {/* Application Stage */}
                                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div 
                                                    className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center text-sm font-bold text-gray-700 cursor-pointer"
                                                    onClick={() => setExpandedEmailSection(expandedEmailSection === 'Application' ? '' : 'Application')}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <PenSquare size={14} className="text-[#0EA5E9]"/> For Application Stage
                                                    </span>
                                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedEmailSection === 'Application' ? 'rotate-180' : ''}`}/>
                                                </div>
                                                {expandedEmailSection === 'Application' && (
                                                    <div className="p-4 grid grid-cols-2 gap-4 bg-white animate-fadeIn">
                                                        <EmailOptionCard 
                                                            title="Follow Up After Application" 
                                                            description="Checks on your application's status to reiterate interest"
                                                            isSelected={selectedEmailType === 'Follow Up After Application'}
                                                            onClick={() => setSelectedEmailType('Follow Up After Application')}
                                                        />
                                                        <EmailOptionCard 
                                                            title="Getting a Referral" 
                                                            description="Asks a contact to refer you for a specific job opening"
                                                            isSelected={selectedEmailType === 'Getting a Referral'}
                                                            onClick={() => setSelectedEmailType('Getting a Referral')}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Interview Stage */}
                                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div 
                                                    className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center text-sm font-bold text-gray-700 cursor-pointer"
                                                    onClick={() => setExpandedEmailSection(expandedEmailSection === 'Interview' ? '' : 'Interview')}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <MessageSquare size={14} className="text-[#0EA5E9]"/> For Interview Stage
                                                    </span>
                                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedEmailSection === 'Interview' ? 'rotate-180' : ''}`}/>
                                                </div>
                                                {expandedEmailSection === 'Interview' && (
                                                    <div className="p-4 grid grid-cols-2 gap-4 bg-white animate-fadeIn">
                                                        <EmailOptionCard 
                                                            title="Thank You After Interview" 
                                                            description="Shows gratitude, and reinforcing interest in the job"
                                                            isSelected={selectedEmailType === 'Thank You After Interview'}
                                                            onClick={() => setSelectedEmailType('Thank You After Interview')}
                                                        />
                                                        <EmailOptionCard 
                                                            title="Follow Up After Interview" 
                                                            description="Checks in on next steps when there's no response"
                                                            isSelected={selectedEmailType === 'Follow Up After Interview'}
                                                            onClick={() => setSelectedEmailType('Follow Up After Interview')}
                                                        />
                                                         <EmailOptionCard 
                                                            title="Reschedule Interview" 
                                                            description="A message to reschedule an interview due to conflict"
                                                            isSelected={selectedEmailType === 'Reschedule Interview'}
                                                            onClick={() => setSelectedEmailType('Reschedule Interview')}
                                                        />
                                                         <EmailOptionCard 
                                                            title="Decline Interview" 
                                                            description="Decline Interview Invitation (with optional reason)"
                                                            isSelected={selectedEmailType === 'Decline Interview'}
                                                            onClick={() => setSelectedEmailType('Decline Interview')}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Offer Stage */}
                                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div 
                                                    className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center text-sm font-bold text-gray-700 cursor-pointer"
                                                    onClick={() => setExpandedEmailSection(expandedEmailSection === 'Offer' ? '' : 'Offer')}
                                                >
                                                     <span className="flex items-center gap-2">
                                                        <Briefcase size={14} className="text-[#0EA5E9]"/> For Offer Stage
                                                    </span>
                                                     <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedEmailSection === 'Offer' ? 'rotate-180' : ''}`}/>
                                                </div>
                                                {expandedEmailSection === 'Offer' && (
                                                    <div className="p-4 grid grid-cols-2 gap-4 bg-white animate-fadeIn">
                                                        <EmailOptionCard 
                                                            title="Offer Negotiation" 
                                                            description="Negotiate offer details like salary, benefits, or timeline."
                                                            isSelected={selectedEmailType === 'Offer Negotiation'}
                                                            onClick={() => setSelectedEmailType('Offer Negotiation')}
                                                        />
                                                        <EmailOptionCard 
                                                            title="Offer Acceptance" 
                                                            description="Confirms and thanks employer for job offer"
                                                            isSelected={selectedEmailType === 'Offer Acceptance'}
                                                            onClick={() => setSelectedEmailType('Offer Acceptance')}
                                                        />
                                                        <EmailOptionCard 
                                                            title="Offer Extension Request" 
                                                            description="Requesting additional time to consider offer with reason."
                                                            isSelected={selectedEmailType === 'Offer Extension Request'}
                                                            onClick={() => setSelectedEmailType('Offer Extension Request')}
                                                        />
                                                        <EmailOptionCard 
                                                            title="Offer Decline" 
                                                            description="Decline offer and express gratitude, keeping door open."
                                                            isSelected={selectedEmailType === 'Offer Decline'}
                                                            onClick={() => setSelectedEmailType('Offer Decline')}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                                            Add Personalization
                                        </h3>
                                        <textarea 
                                            className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none mb-2"
                                            placeholder="Optional: Tell us anything specific you want included in the email..."
                                        />
                                        <div className="text-xs text-gray-500 flex items-start gap-2 bg-yellow-50 p-2 rounded text-yellow-800 border border-yellow-100">
                                            <div className="mt-0.5">💡</div>
                                            Tip: Mention a specific detail from your interview, a unique skill, or how your values align with the company's.
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button className="bg-[#0EA5E9] text-white font-bold px-6 py-2.5 rounded-lg shadow-md hover:bg-[#0284c7] transition-colors flex items-center gap-2">
                                            <Send size={14}/> Generate Email
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel (Status & Notes) */}
                    <div className="w-[300px] border-l border-gray-200 border-y my-4 mr-4 rounded-r-xl bg-gray-50 p-4 flex flex-col shadow-sm">
                         <StatusTimeline />
                         <NotesSection />
                         <div className="mt-auto pt-4 flex justify-end">
                            <button className="bg-[#0EA5E9] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm">
                                <MessageSquare size={12}/> Feedback
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Dashboard ---

const StatCard = ({ icon: Icon, title, subtitle, color }) => (
  <div
    className={`p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 cursor-pointer transition-all hover:shadow-md ${color}`}
  >
    <div className="flex justify-between items-start">
      <div className="p-2 bg-white/60 rounded-lg backdrop-blur-sm">
        <Icon size={20} className="text-gray-700" />
      </div>
    </div>
    <div>
      <div className="font-bold text-gray-800 text-sm mb-1">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  </div>
);

const DashboardPage = () => {
    return (
        <div className="w-full min-h-screen relative">
            <div className="bg-[#0ea5e9] h-[50vh] w-full absolute"></div>
            <div className="max-w-5xl mx-auto py-12 px-4 animate-fadeIn font-sans">
                {/* Header */}
                <h1 className="text-3xl font-bold text-white mb-8 drop-shadow-sm">Welcome, Henry 👋</h1>

                {/* Streak Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-12 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-50 rounded-xl">
                                <Flame size={32} className="text-orange-500 fill-orange-500"/>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-2xl font-bold text-gray-900">1 Day Streak</span>
                                    <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-gray-200">
                                        <Lock size={10}/> Recruiter Highlight
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
                                <Settings size={16}/> Match Preferences
                            </button>
                            <button className="px-6 py-2 bg-[#0EA5E9] text-white rounded-lg text-sm font-bold hover:bg-[#0284c7] shadow-md transition-all">
                                View All Matches
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-end gap-6 mb-8">
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 mb-3 font-medium flex items-center gap-2">
                                <Trophy size={16} className="text-yellow-600 fill-yellow-500"/>
                                Great work! View 5 more matches tomorrow or the day after to keep your streak going!
                            </p>
                            <div className="flex items-center gap-3 w-full max-w-md">
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="w-[14%] h-full bg-[#0EA5E9] rounded-full"></div>
                                </div>
                                <span className="text-xs font-bold text-[#0EA5E9]">day 1/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Colorful Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-5 rounded-xl bg-blue-50/80 border border-blue-100 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:shadow-md transition-all h-24">
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#0EA5E9] text-white text-[9px] font-bold px-2 py-0.5 rounded-b-md uppercase tracking-wide shadow-sm">Upgrade</div>
                            <div className="flex items-center gap-3 z-10">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-400 shadow-sm"><Building2 size={16}/></div>
                                <div className="text-xs font-bold text-gray-600 leading-tight">Companies you're connected with</div>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-orange-50/80 border border-orange-100 flex flex-col justify-center group cursor-pointer hover:shadow-md transition-all h-24">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-orange-400 shadow-sm"><Star size={16} fill="currentColor"/></div>
                                <div className="text-xs font-bold text-gray-600">Your best job matches</div>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-purple-50/80 border border-purple-100 flex flex-col justify-center group cursor-pointer hover:shadow-md transition-all h-24">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-purple-400 shadow-sm"><Calendar size={16}/></div>
                                <div className="text-xs font-bold text-gray-600">Jobs added this week</div>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-green-50/80 border border-green-100 flex flex-col justify-center group cursor-pointer hover:shadow-md transition-all h-24">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-green-500 shadow-sm"><DollarSign size={16}/></div>
                                <div className="text-xs font-bold text-gray-600">Jobs with salary data</div>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-sky-50/80 border border-sky-100 flex flex-col justify-center group cursor-pointer hover:shadow-md transition-all h-24">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-sky-400 shadow-sm"><Globe size={16}/></div>
                                <div className="text-xs font-bold text-gray-600">Jobs that are fully remote</div>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-teal-50/80 border border-teal-100 flex flex-col justify-center group cursor-pointer hover:shadow-md transition-all h-24">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-teal-400 shadow-sm"><Eye size={16}/></div>
                                <div className="text-xs font-bold text-gray-600">Take another look</div>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-yellow-50/80 border border-yellow-100 flex flex-col justify-center group cursor-pointer hover:shadow-md transition-all h-24">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-yellow-500 shadow-sm"><Zap size={16} fill="currentColor"/></div>
                                <div className="text-xs font-bold text-gray-600">Jobs with your favorite skills</div>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-pink-50/80 border border-pink-100 flex flex-col justify-center group cursor-pointer hover:shadow-md transition-all h-24">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-pink-400 shadow-sm"><Search size={16}/></div>
                                <div className="text-xs font-bold text-gray-600">Discover something new</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Get Started Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Get started with Simplify</h2>
                            <p className="text-sm text-gray-500">Complete a few steps to land your next job.</p>
                        </div>
                        <div className="flex items-center gap-3 w-64 mb-2">
                            <div className="flex-1 h-2.5 bg-blue-50 rounded-full overflow-hidden">
                                <div className="w-1/2 h-full bg-[#0EA5E9] rounded-full"></div>
                            </div>
                            <span className="text-xs font-bold text-[#0EA5E9]">3/6</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:border-blue-300 cursor-pointer group hover:shadow-sm transition-all bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0EA5E9]"><User size={24}/></div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm group-hover:text-[#0EA5E9] transition-colors">Complete your profile</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Add more details to qualify for more jobs.</div>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-gray-300 group-hover:text-[#0EA5E9]"/>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:border-blue-300 cursor-pointer group hover:shadow-sm transition-all bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0EA5E9]"><PuzzleIcon /></div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm group-hover:text-[#0EA5E9] transition-colors">Download Chrome Extension</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Install the Simplify Chrome extension to autofill your job applications.</div>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-gray-300 group-hover:text-[#0EA5E9]"/>
                        </div>
                    </div>
                </div>

                {/* AI Contributor Banner */}
                <div className="bg-[#F0F9FF] border border-blue-100 rounded-xl p-6 mb-8 flex justify-between items-center">
                    <div className="flex gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
                            <Monitor size={24} className="text-[#0EA5E9]"/>
                        </div>
                        <div>
                            <div className="inline-block bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded mb-1">Earn up to $160/hour</div>
                            <h2 className="text-lg font-bold text-gray-900">Become a Certified Simplify AI Contributor</h2>
                            <p className="text-xs text-gray-600 mt-1 max-w-md">
                                Get paid to use your expertise to evaluate and train the future of AI models - <span className="font-bold">100% remote & flexible hours.</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-center">
                        <button className="bg-[#0EA5E9] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0284c7] shadow-sm mb-2">
                            Join Simplify AI
                        </button>
                        <div className="flex items-center justify-center gap-[-8px] text-xs text-gray-500">
                            <div className="flex -space-x-2 mr-2">
                                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100')] bg-cover"></div>)}
                            </div>
                            Join <span className="font-bold mx-1">20K+</span> active users
                        </div>
                    </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded w-fit mb-2">Profile 90% complete</div>
                        <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            You are a <span className="font-extrabold">Career Builder</span> 💪
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Your profile is currently being shown to recruiters! <span className="text-[#0EA5E9] font-bold cursor-pointer hover:underline">Edit profile &rarr;</span>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-center">
                        <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Flame size={20} className="text-orange-500 fill-orange-500"/> You saved <span className="font-extrabold">0 hour</span> so far!
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            By autofilling your job applications with our extension
                        </div>
                    </div>
                </div>

                {/* Quick Menu */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-900 mb-4">Quick Menu</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-300 cursor-pointer transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500"><FileText size={20}/></div>
                            <div className="flex-1">
                                <div className="font-bold text-sm text-gray-900">Generate resume</div>
                                <div className="text-xs text-gray-500">Create new</div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={12}/></div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-300 cursor-pointer transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500"><Mail size={20}/></div>
                            <div className="flex-1">
                                <div className="font-bold text-sm text-gray-900">Generate cover letter</div>
                                <div className="text-xs text-gray-500">Create with Simplify+</div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={12}/></div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-300 cursor-pointer transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500"><MessageSquare size={20}/></div>
                            <div className="flex-1">
                                <div className="font-bold text-sm text-gray-900">Question Response</div>
                                <div className="text-xs text-gray-500">Use with Simplify+</div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={12}/></div>
                        </div>
                    </div>
                </div>

                {/* My Job Applications */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-900 mb-4">My Job Applications</h2>
                    <div className="bg-white border border-gray-200 rounded-xl p-8 flex gap-12">
                        {/* Gauge Chart Section */}
                        <div className="flex-1 border-r border-gray-100 pr-8 flex flex-col items-center">
                            <div className="text-sm font-bold text-gray-900 mb-6 w-full text-left">Week of 11/17/2025 - 11/30/2025</div>
                            <div className="relative w-48 h-24 overflow-hidden mb-4">
                                 <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-[#E0F2FE] border-b-transparent border-l-transparent border-r-transparent rotate-[-45deg]"></div>
                                 <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-[#0EA5E9] border-b-transparent border-l-transparent border-r-transparent rotate-[-135deg]"></div>
                                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                                     <div className="text-3xl font-bold text-gray-900">2</div>
                                     <div className="text-xs text-gray-500 uppercase font-bold">jobs applied</div>
                                 </div>
                            </div>
                            
                            <div className="flex gap-4 items-start w-full mt-4">
                                <div className="bg-gray-50 text-gray-400 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">Weekly goal: N/A</div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm text-gray-900 mb-1">No weekly goal set</div>
                                    <p className="text-xs text-gray-500 mb-3">Job seekers who set a weekly applications goal are more likely to land interviews.</p>
                                    <button className="bg-[#0EA5E9] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#0284c7]">Set a weekly goal</button>
                                </div>
                            </div>
                        </div>

                        {/* Stats List */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900 text-sm">Tracker Overview</h3>
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-bold py-1.5 pl-3 pr-8 rounded-lg outline-none cursor-pointer hover:bg-gray-50">
                                        <option>This week</option>
                                        <option>Last week</option>
                                    </select>
                                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-gray-600"><div className="w-5 flex justify-center">📝</div> Applications this week</div>
                                    <span className="font-bold text-gray-900">2</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-gray-600"><div className="w-5 flex justify-center">💬</div> Interviews this week</div>
                                    <span className="font-bold text-gray-900">1</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-gray-600"><div className="w-5 flex justify-center">❤️</div> Saved jobs this week</div>
                                    <span className="font-bold text-gray-900">2</span>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button className="text-[#0EA5E9] font-bold text-sm hover:underline flex items-center gap-1">
                                    Go to tracker <ArrowRight size={14}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Notifications */}
                <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-bold text-gray-900">Sign Up for Email Notifications</h2>
                        <button className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                    </div>
                    
                    <div className="bg-[#F8FAFC] rounded-lg p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 text-sm">When should we email you with new jobs that match your preferences?</h3>
                            <button className="text-[#0EA5E9] text-xs font-bold flex items-center gap-1 hover:underline"><Settings size={12}/> Match Preferences</button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="border border-gray-200 bg-white rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all group">
                                <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">🔥 Daily</div>
                                <p className="text-[10px] text-gray-500 leading-relaxed">Apply to opportunities as soon as they are posted. Early applications get noticed more.</p>
                            </div>
                            <div className="border border-gray-200 bg-white rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all group">
                                <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">💪 Weekly</div>
                                <p className="text-[10px] text-gray-500 leading-relaxed">Check in regularly for new opportunities every week to boost your job search.</p>
                            </div>
                            <div className="border-2 border-[#0EA5E9] bg-sky-50/30 rounded-lg p-4 cursor-pointer relative">
                                <div className="absolute top-3 right-3 bg-[#0EA5E9] rounded-full p-0.5"><Check size={10} className="text-white"/></div>
                                <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">🚫 Never</div>
                                <p className="text-[10px] text-gray-500 leading-relaxed">I don't want to receive any emails about the latest career opportunities.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Grid (Upgrade, Refer, Resume) */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Upgrade */}
                    <div className="bg-[#F0F9FF] border border-blue-100 rounded-xl p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Upgrade to Premium</h2>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Upgrade to Premium</div>
                                <div className="text-xl font-bold text-gray-900 mb-1">Simplify+ <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded align-middle">Beta</span></div>
                            </div>
                            <div className="p-2 bg-white rounded-lg shadow-sm text-[#0EA5E9]"><Crown size={24}/></div>
                        </div>
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">Supercharge your job search with Simplify's AI features!</p>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-gray-700"><span className="text-yellow-500">⚡</span> AI Response Writer</div>
                            <div className="flex items-center gap-2 text-xs text-gray-700"><span className="text-yellow-500">⚡</span> Smart Resume Optimizer</div>
                            <div className="flex items-center gap-2 text-xs text-gray-700"><span className="text-green-500">📊</span> Resume Manager</div>
                            <div className="flex items-center gap-2 text-xs text-gray-700"><span className="text-blue-500">📝</span> Cover Letter Generator</div>
                        </div>
                        <button className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg shadow-sm transition-all text-sm">
                            Subscribe to Simplify+
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Refer */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-4">Refer a Friend!</h2>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Your Referrals:</div>
                                    <div className="text-xs text-gray-500">Earn Simplify+ credit when you refer</div>
                                </div>
                                <div className="bg-cyan-50 text-cyan-700 font-bold text-lg px-4 py-2 rounded-lg">0</div>
                            </div>
                            <button className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold px-4 py-2 rounded-lg shadow-sm transition-all text-xs">
                                Get referral link
                            </button>
                        </div>

                        {/* Resume Review */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-4">Resume Review</h2>
                            <div className="font-bold text-sm text-gray-900 mb-2">45-min session with a recruiter</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100')] bg-cover"></div>)}
                                </div>
                                Used by 2,000+ Simplify job seekers
                            </div>
                            <button className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold px-4 py-2 rounded-lg shadow-sm transition-all text-xs">
                                Book a session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Profile Management Dashboard ---

// Re-defining InputGroup inside ProfileDashboard scope was the issue or missing it in global scope.
// Moving InputGroup and SelectGroup to Global Scope as they are used in multiple places (Wizards, Modals)

const InputGroup = ({
  label,
  type = "text",
  placeholder,
  value,
  required,
  className,
}) => (
  <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
    <label className="text-xs font-bold text-gray-700 uppercase flex gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow placeholder-gray-400"
      placeholder={placeholder}
      defaultValue={value}
    />
  </div>
);

const SectionCard = ({ title, onEdit, children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative hover:border-blue-300 transition-colors ${className}`}
  >
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <PenSquare size={18} />
        </button>
      )}
    </div>
    {children}
  </div>
);

const InfoGrid = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
    {items.map((item, i) => (
      <div key={i}>
        <div className="text-xs font-bold text-gray-500 uppercase mb-1">
          {item.label}
        </div>
        <div className="text-sm font-medium text-gray-900 truncate">
          {item.value || "-"}
        </div>
      </div>
    ))}
  </div>
);
  const ModalOverlay = ({
    children,
    title,
    onClose,
    onSave,
    maxWidth = "max-w-2xl",
  }) => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className={`bg-white rounded-xl w-full ${maxWidth} shadow-2xl max-h-[90vh] flex flex-col`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3 text-gray-900 font-bold text-lg">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FileText size={20} />
            </div>
            {title}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-4">
            <button className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
              <MessageSquare size={16} /> Feedback
            </button>
            <button
              onClick={onSave || onClose}
              className="px-8 py-2.5 bg-[#0EA5E9] text-white rounded-lg font-bold text-sm hover:bg-[#0284c7] transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );


  const Toggle = ({ checked, onChange, label }) => (
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChange && onChange(!checked)}>
        <div className={`w-9 h-5 rounded-full relative transition-colors ${checked ? 'bg-[#0EA5E9]' : 'bg-gray-300'}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-5' : 'left-1'}`}></div>
        </div>
        {label && <span className="text-xs font-bold text-gray-700">{label}</span>}
    </div>
);

    const EditPersonalInfoModal = ({ onClose }) => (
    <ModalOverlay
      title="Edit Personal Info"
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="grid grid-cols-2 gap-6">
        <InputGroup label="First Name" value="Henry" required />
        <InputGroup label="Last Name" value="User" required />
      </div>
      <InputGroup
        label="Preferred Name (Optional)"
        placeholder="Enter Preferred Name"
      />
      <InputGroup label="Email Address" value="henry.user@gmail.com" />
      <InputGroup label="Date of Birth" type="date" value="2005-03-19" />
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-bold text-gray-700 uppercase">
          Phone
        </label>
        <div className="flex gap-3">
          <div className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white flex items-center gap-2">
            🇺🇸 +1
          </div>
          <input
            type="tel"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
      <SelectGroup
        label="Location"
        placeholder="Type city to search"
        options={[]}
      />
      <InputGroup label="Address" placeholder="Enter Address" />
      <InputGroup label="Address Line 2" placeholder="Enter Address Line 2" />
      <InputGroup label="Address Line 3" placeholder="Enter Address Line 3" />
    </ModalOverlay>
  );

const SelectGroup = ({ label, options, placeholder, className }) => (
    <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
      <label className="text-xs font-bold text-gray-700 uppercase">
        {label}
      </label>
      <div className="relative">
        <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-600">
          {placeholder && <option>{placeholder}</option>}
          {options.map((opt, i) => (
            <option key={i}>{opt}</option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        />
      </div>
    </div>
  );



  const AddExperienceModal = ({ onClose }) => (
    <ModalOverlay title="Add Experience" onClose={onClose} maxWidth="max-w-3xl">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3 items-start">
        <div className="text-blue-600 mt-0.5">
          <User size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1">
            Profile Section
          </h4>
          <p className="text-xs text-blue-700">
            Information added to this section is used to directly autofill your
            job applications!
          </p>
        </div>
      </div>
      <InputGroup label="Position Title" placeholder="Title" />
      <div className="mb-4">
        <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">
          Company <HelpCircle size={12} className="inline text-gray-400" />
        </label>
        <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg mb-2 flex gap-2 items-center">
          <CheckCircle2 size={14} /> We couldn't find an exact match for in our
          system. Please confirm or add by searching it below.
        </div>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Search or add company"
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SelectGroup label="Location" placeholder="Search city" options={[]} />
        <SelectGroup
          label="Experience Type"
          placeholder="Type"
          options={["Full Time", "Part Time", "Internship"]}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SelectGroup
          label="Start Month"
          placeholder="Month"
          options={["January", "February"]}
        />
        <SelectGroup
          label="Start Year"
          placeholder="Year"
          options={["2024", "2023"]}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SelectGroup
          label="End Month"
          placeholder="Month"
          options={["January", "February"]}
        />
        <SelectGroup
          label="End Year"
          placeholder="Year"
          options={["2024", "2025"]}
        />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          id="current"
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="current" className="text-sm text-gray-700 font-medium">
          I currently work here
        </label>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase flex gap-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
          placeholder="A couple sentences about your role"
        />
      </div>
    </ModalOverlay>
  );

  const AddEducationModal = ({ onClose }) => (
    <ModalOverlay title="Add Education" onClose={onClose} maxWidth="max-w-3xl">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3 items-start">
        <div className="text-blue-600 mt-0.5">
          <User size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1">
            Profile Section
          </h4>
          <p className="text-xs text-blue-700">
            Information added to this section is used to directly autofill your
            job applications!
          </p>
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">
          School Name <HelpCircle size={12} className="inline text-gray-400" />
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="School Name"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <SelectGroup
            label="Major"
            placeholder="Major"
            options={["Computer Science", "Bioinformatics"]}
          />
        </div>
        <div className="col-span-1">
          <SelectGroup
            label="Degree Type"
            placeholder="Degree"
            options={["Bachelors", "Masters"]}
          />
        </div>
        <div className="col-span-1">
          <InputGroup label="GPA" placeholder="GPA" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <SelectGroup label="Start Month" placeholder="Month" options={[]} />
        <SelectGroup label="Start Year" placeholder="Year" options={[]} />
        <SelectGroup label="End Month" placeholder="Month" options={[]} />
        <SelectGroup label="End Year" placeholder="Year" options={[]} />
      </div>
      <div className="text-right mb-2">
        <button className="text-xs font-bold text-[#0EA5E9] hover:underline">
          Clear Dates
        </button>
      </div>
    </ModalOverlay>
  );

  const AddProjectModal = ({ onClose }) => (
    <ModalOverlay title="Add Project" onClose={onClose} maxWidth="max-w-3xl">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3 items-start">
        <div className="text-blue-600 mt-0.5">
          <User size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1">
            Profile Section
          </h4>
          <p className="text-xs text-blue-700">
            Information added to this section is used to directly autofill your
            job applications!
          </p>
        </div>
      </div>
      <InputGroup label="Project Name" required placeholder="Project Name" />
      <SelectGroup label="Location" placeholder="Search city" options={[]} />
      <InputGroup label="Position Title" placeholder="Title" />
      <div className="grid grid-cols-2 gap-6">
        <SelectGroup label="Start Month" placeholder="Month" options={[]} />
        <SelectGroup label="Start Year" placeholder="Year" options={[]} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SelectGroup label="End Month" placeholder="Month" options={[]} />
        <SelectGroup label="End Year" placeholder="Year" options={[]} />
      </div>
      <div className="text-right mb-4">
        <button className="text-xs font-bold text-[#0EA5E9] hover:underline">
          Clear Dates
        </button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          id="current-proj"
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="current-proj"
          className="text-sm text-gray-700 font-medium"
        >
          I currently work here
        </label>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase flex gap-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
          placeholder="A couple sentences about your role"
        />
      </div>
    </ModalOverlay>
  );

  const EditPortfolioModal = ({ onClose }) => (
    <ModalOverlay title="Edit Portfolio" onClose={onClose} maxWidth="max-w-3xl">
      <InputGroup
        label="LinkedIn URL"
        placeholder="https://www.linkedin.com/in/..."
        value="https://www.linkedin.com/in/simplify-jobs"
      />
      <InputGroup
        label="GitHub URL"
        placeholder="https://github.com/..."
        value="https://github.com/simplify-jobs"
      />
      <InputGroup
        label="Portfolio URL"
        placeholder="https://..."
        value="https://simplify.jobs/profile/..."
      />
      <InputGroup
        label="Other URL"
        placeholder="https://..."
        value="https://simplify.jobs"
      />
    </ModalOverlay>
  );

  const SearchResumesModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <div className="text-[#0EA5E9]">
              <FileText size={20} />
            </div>
            Search Resumes
          </h3>
          <button onClick={onClose}>
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name"
              className="w-full border border-gray-300 rounded-lg pl-4 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
            <UploadCloud size={16} /> Upload
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
            <Plus size={16} /> Generate
          </button>
        </div>
        <div className="space-y-2">
          <div className="p-4 rounded-lg border border-gray-200 flex items-center justify-between group hover:border-blue-400 transition-colors cursor-pointer bg-white hover:bg-blue-50/30">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#0EA5E9] rounded text-white">
                <FileText size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  Henry_User_resume
                </div>
                <div className="text-xs text-gray-500 flex gap-2 mt-0.5">
                  <span className="text-[#0EA5E9] bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                    Uploaded
                  </span>
                  <span>PDF</span>
                  <span>Modified: 11/25/2023, 10:30:03 AM GMT+7</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Eye size={18} className="text-gray-400 hover:text-gray-600" />
              <div className="text-xs font-bold text-[#0EA5E9] bg-blue-50 px-2 py-1 rounded">
                Default
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 flex items-center justify-between group hover:border-blue-400 transition-colors cursor-pointer bg-white hover:bg-blue-50/30">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#0EA5E9] rounded text-white">
                <FileText size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  Machine Learning Engineer
                </div>
                <div className="text-xs text-gray-500 flex gap-2 mt-0.5">
                  <span className="text-[#0EA5E9] bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                    Generated
                  </span>
                  <span>Modified: 11/23/2023, 10:31:05 AM GMT+7</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Eye size={16} className="text-gray-400 hover:text-gray-600" />
              <Pencil size={16} className="text-gray-400 hover:text-gray-600" />
              <Trash2 size={16} className="text-gray-400 hover:text-gray-600" />
              <button className="text-xs font-bold border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">
                Set as default
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button className="bg-[#0EA5E9] text-white font-bold px-6 py-2.5 rounded-lg shadow-sm text-sm hover:bg-[#0284c7]">
            Preview Resume
          </button>
        </div>
      </div>
    </div>
  );

const ProfileDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [profile, setProfile] = useState(initialProfileData);

  const SidebarWidget = ({ title, children, icon }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {icon && icon}
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );

  const SectionHeader = ({ title, onAdd, onEdit }) => (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {onAdd && (
        <button
          onClick={onAdd}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 md:px-8">
      {/* Active Modals */}
      {activeModal === "personal" && (
        <EditPersonalInfoModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "experience" && (
        <AddExperienceModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "education" && (
        <AddEducationModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "project" && (
        <AddProjectModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "portfolio" && (
        <EditPortfolioModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "resumes" && (
        <SearchResumesModal onClose={() => setActiveModal(null)} />
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center mb-6">
            <div className="w-24 h-24 bg-[#0EA5E9] rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              HU
            </div>
            <div className="flex justify-end -mt-8 mb-2 mr-2">
              <div className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                <Pencil size={14} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Henry User</h2>
            <p className="text-xs text-gray-500 mt-1 mb-2">
              Previously dtdrdh @ dtdrdh
            </p>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0EA5E9] bg-blue-50 py-1 px-3 rounded-full mx-auto w-fit mb-6">
              Job Search Status
            </div>
            <div className="text-xs font-bold text-[#0EA5E9] mb-4">
              Actively looking
            </div>

            <div className="text-left">
              <div className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
                My Career Hub
              </div>
              <div className="space-y-2">
                <button className="w-full bg-[#0C4A6E] text-white p-3 rounded-lg flex items-center justify-between text-sm font-bold shadow-sm hover:bg-[#0f5882] transition-colors">
                  <div className="flex items-center gap-2">
                    <Pencil size={16} /> Profile
                  </div>
                  <span className="text-[10px] opacity-70 font-normal">
                    Edit autofill information
                  </span>
                </button>
                <button
                  onClick={() => setActiveModal("personal")}
                  className="w-full bg-gray-50 text-gray-700 p-3 rounded-lg flex items-center justify-between text-sm font-bold hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-green-600" /> Personal
                    Info
                  </div>
                  <span className="text-[10px] text-gray-400 font-normal">
                    Edit demographic data
                  </span>
                </button>
                <button className="w-full bg-gray-50 text-gray-700 p-3 rounded-lg flex items-center justify-between text-sm font-bold hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-orange-800" /> Job
                    Preferences
                  </div>
                  <span className="text-[10px] text-gray-400 font-normal">
                    Refine your job search
                  </span>
                </button>
              </div>
            </div>
          </div>

          <SidebarWidget
            title="My Profile Strength"
            icon={<div className="text-yellow-500">💪</div>}
          >
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <h4 className="font-bold text-gray-900">Career Builder</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Complete your profile to autofill job applications effortlessly!
              </p>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div
                  className="bg-[#0EA5E9] h-2 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
              <div className="text-right text-xs font-bold text-[#0EA5E9]">
                90%
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-300"></div>{" "}
                Add your contact info{" "}
                <span className="text-[#0EA5E9]">+10%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-gray-400 fill-gray-700"
                />{" "}
                Add your education journey{" "}
                <span className="text-gray-400 line-through">+10%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-gray-400 fill-gray-700"
                />{" "}
                Add your work experience{" "}
                <span className="text-gray-400 line-through">+20%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-gray-400 fill-gray-700"
                />{" "}
                Add your resume{" "}
                <span className="text-gray-400 line-through">+10%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-gray-400 fill-gray-700"
                />{" "}
                Add your personal links{" "}
                <span className="text-gray-400 line-through">+10%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-gray-400 fill-gray-700"
                />{" "}
                Add your skills{" "}
                <span className="text-gray-400 line-through">+10%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-gray-400 fill-gray-700"
                />{" "}
                Fill out your job preferences{" "}
                <span className="text-gray-400 line-through">+20%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-gray-400 fill-gray-700"
                />{" "}
                Fill out your employment info{" "}
                <span className="text-gray-400 line-through">+10%</span>
              </div>
            </div>
          </SidebarWidget>

          <div className="bg-[#F0F9FF] border border-blue-100 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                  Upgrade to Premium
                </div>
                <div className="font-bold text-gray-900 text-lg flex items-center gap-1">
                  Simplify+{" "}
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded uppercase">
                    Beta
                  </span>
                </div>
              </div>
              <div className="text-[#0EA5E9]">
                <Crown size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Supercharge your job search with Simplify's AI features!
            </p>
            <div className="space-y-2 mb-4">
              {[
                "AI Response Writer",
                "Smart Resume Optimizer",
                "Resume Manager",
                "Cover Letter Generator",
              ].map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-gray-700 font-medium"
                >
                  <span className="text-yellow-500">⚡</span> {feat}
                </div>
              ))}
            </div>
            <button className="w-full bg-[#0C4A6E] text-white font-bold text-xs py-2.5 rounded-lg hover:bg-[#0f5882] transition-colors">
              Subscribe to Simplify+
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Top Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-full">
              <h3 className="text-gray-800 font-medium mb-4">
                Your Simplify profile is used directly to autofill your job
                applications!
              </h3>
              <div>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm mb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <span className="text-yellow-400">✨</span> Show Profile to
                    Recruiters{" "}
                    <HelpCircle size={14} className="text-gray-400" />
                  </div>
                  <Toggle checked={true} />
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Search size={12} /> Get discovered by companies
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Eye size={12} /> Your current employer can't see you
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  👋 Get more referrals!
                </h3>
                <button className="bg-[#0EA5E9] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#0284c7]">
                  Set Up Network
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Find hidden connections and warm intros in your network to boost
                your job applications.
              </p>
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <SectionHeader
              title="Resume"
              onEdit={() => setActiveModal("resumes")}
            />
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between group hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#0EA5E9] text-white rounded-lg shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                      Henry_User_resume
                    </span>
                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Last uploaded: 11/25/2023, 10:00:00 AM GMT+7
                  </div>
                </div>
              </div>
              <button className="bg-[#0EA5E9] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#0284c7] shadow-sm">
                Preview Resume
              </button>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <SectionHeader
              title="Work Experience"
              onAdd={() => setActiveModal("experience")}
            />
            <div className="space-y-4">
              {profile.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="flex justify-between items-start group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        {exp.title}
                      </div>
                      <div className="text-sm text-gray-500">{exp.company}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {exp.location} &nbsp;•&nbsp; {exp.date} &nbsp;•&nbsp;{" "}
                        {exp.type}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <SectionHeader
              title="Education"
              onAdd={() => setActiveModal("education")}
            />
            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex justify-between items-start group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {edu.school}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 bg-gray-100 w-fit px-2 py-1 rounded-md border border-gray-200 inline-flex items-center gap-2">
                        <span>{edu.date}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{edu.degree}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>GPA: {edu.gpa}</span>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects & Outside Experience */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <SectionHeader
              title="Projects & Outside Experience"
              onAdd={() => setActiveModal("project")}
            />
            <div className="space-y-4">
              {profile.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex justify-between items-start group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-400 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                      <Grid size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{proj.name}</div>
                      <div className="text-xs text-gray-500 mt-1 bg-gray-100 w-fit px-2 py-1 rounded-md border border-gray-200 inline-flex items-center gap-2">
                        <span>{proj.date}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <MapPin size={10} /> {proj.location}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">NewJeans</div>
                      <div className="text-xs text-gray-500">NewJeans</div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio & Links */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <SectionHeader
              title="Portfolio & Links"
              onEdit={() => setActiveModal("portfolio")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                <div className="bg-[#0077b5] text-white p-1.5 rounded">
                  <Linkedin size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold text-gray-900">
                    LinkedIn URL
                  </div>
                  <div className="text-xs text-blue-500 truncate group-hover:underline">
                    {profile.links.linkedin}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                <div className="bg-black text-white p-1.5 rounded">
                  <Github size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold text-gray-900">
                    GitHub URL
                  </div>
                  <div className="text-xs text-blue-500 truncate group-hover:underline">
                    {profile.links.github}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                <div className="bg-pink-200 text-pink-600 p-1.5 rounded">
                  <Globe size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold text-gray-900">
                    Portfolio URL
                  </div>
                  <div className="text-xs text-blue-500 truncate group-hover:underline">
                    {profile.links.portfolio}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                <div className="bg-blue-400 text-white p-1.5 rounded">
                  <LinkIcon size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold text-gray-900">
                    Other URL
                  </div>
                  <div className="text-xs text-blue-500 truncate group-hover:underline">
                    {profile.links.other}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <SectionHeader title="Skills" onEdit={() => {}} />
            <p className="text-xs text-gray-500 mb-4">
              Skills that you'd prefer to utilize in roles are highlighted with
              a heart 💙
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <Heart
                    size={12}
                    className="text-gray-300 hover:text-blue-500"
                  />{" "}
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <SectionHeader title="Languages" onEdit={() => {}} />
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 font-medium bg-gray-50"
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- App Shell ---

const Navbar = ({ currentView, setView, onSignOut }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "matches", label: "Matches" },
    { id: "jobs", label: "Jobs" },
    { id: "tracker", label: "Job Tracker" },
    { id: "documents", label: "Documents" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-0 h-16">
      <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setView("onboarding")}
          >
            <div className="text-blue-600 font-bold text-2xl tracking-tight flex items-center gap-1">
              <div className="w-6 h-6 bg-blue-600 rounded-md transform rotate-12 shadow-sm"></div>
              Simplify
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-500">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`h-16 border-b-2 transition-colors ${
                  currentView === item.id
                    ? "text-gray-900 font-bold border-gray-900"
                    : "border-transparent hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden lg:flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm hover:shadow transition-all">
            <Crown size={14} /> UPGRADE
          </button>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <Bell size={20} />
          </button>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <HelpCircle size={20} />
          </button>
          <button
            className="text-gray-400 hover:text-gray-600 p-1"
            onClick={onSignOut}
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs cursor-pointer hover:bg-blue-200 transition-colors">
            HU
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication State
  const [authView, setAuthView] = useState("login"); // 'login', 'register', 'forgot-password'

  const [currentView, setCurrentView] = useState("onboarding");
  const [onboardingState, setOnboardingState] = useState("start");
  const [subView, setSubView] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleShowCompany = (job) => {
    setSubView("company");
  };

    const handleCompanyClick = () => {
      setSubView('company');
  };

  // Main App Rendering Logic
  const renderAppView = () => {
    if (subView === "company")
      return <CompanyPage onBack={() => setSubView(null)} />;

    switch (currentView) {
      case "dashboard":
        return <DashboardPage />;
      case "tracker":
        return <JobTrackerPage onShowCompany={handleShowCompany} />;
      case "jobs":
   case "jobs": return <JobSearchPage onCompanyClick={handleCompanyClick} />;
      case "documents":
        return <DocumentsPage />;
      case "profile":
        return <ProfileDashboard />;
      case "onboarding":
        if (onboardingState === "start")
          return (
            <OnboardingFork onChoice={(choice) => setOnboardingState(choice)} />
          );
        if (onboardingState === "preferences")
          return <PreferencesPage onFinish={() => setCurrentView("matches")} />;
        if (onboardingState === "wizard")
          return <ProfileWizard onFinish={() => setCurrentView("profile")} />;
        return null;
      default:
        return <DashboardPage />;
    }
  };

  // Auth Rendering Logic
  if (!isAuthenticated) {
    switch (authView) {
      case "register":
        return (
          <RegisterPage
            onLogin={() => setIsAuthenticated(true)}
            onSwitchToLogin={() => setAuthView("login")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordPage
            onSwitchToLogin={() => setAuthView("login")}
            onSwitchToRegister={() => setAuthView("register")}
          />
        );
      case "login":
      default:
        return (
          <LoginPage
            onLogin={() => setIsAuthenticated(true)}
            onSwitchToRegister={() => setAuthView("register")}
            onForgotPassword={() => setAuthView("forgot-password")}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; }
      `}</style>

      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} />
      )}

      <Navbar
        currentView={currentView}
        setView={(view) => {
          setCurrentView(view);
          setSubView(null);
        }}
        onSignOut={() => setIsAuthenticated(false)}
      />

      <main className="max-w-[100vw] mx-auto">{renderAppView()}</main>
    </div>
  );
};

export default App;