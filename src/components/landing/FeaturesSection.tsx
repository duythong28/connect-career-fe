import { FileText, Mic, MessageCircle, Target, FileEdit, GitBranch, User, Bell, Sparkles } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FileText className="w-10 h-10" />,
      title: "Intelligent CV Analysis",
      description: "Advanced AI analyzes your CV to identify strengths, gaps, and optimization opportunities for better job matches.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Mic className="w-10 h-10" />,
      title: "AI Mock Interview",
      description: "Practice interviews with AI-powered simulations that provide real-time feedback and personalized improvement tips.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MessageCircle className="w-10 h-10" />,
      title: "AI Chatbot Assistant",
      description: "Get instant answers to your career questions with our intelligent chatbot available 24/7 to guide your journey.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Smart Matching Score",
      description: "Our AI calculates precise compatibility scores between candidates and jobs for optimal placement success.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FileEdit className="w-10 h-10" />,
      title: "Auto-Generate JD",
      description: "Recruiters can instantly create professional job descriptions with AI, saving time and ensuring quality.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <GitBranch className="w-10 h-10" />,
      title: "Streamlined Pipelines",
      description: "Manage hiring workflows efficiently with customizable pipelines that adapt to your recruitment process.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <User className="w-10 h-10" />,
      title: "360° Talent Profiles",
      description: "Comprehensive candidate profiles with skills, experience, assessments, and cultural fit indicators.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Bell className="w-10 h-10" />,
      title: "Real-time Engagement",
      description: "Stay connected with instant notifications, updates, and communications throughout the hiring process.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: "Smart Recommendations",
      description: "AI-powered job and candidate recommendations that learn from your preferences and improve over time.",
      color: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Why Choose Our Platform</h2>
          <p className="text-lg text-gray-600">Powered by cutting-edge AI technology</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all"
            >
              <div
                className={`w-14 h-14 mb-4 rounded-lg bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;