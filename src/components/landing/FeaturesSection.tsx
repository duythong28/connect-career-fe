import { FileText, Mic, MessageCircle, Target, FileEdit, GitBranch, User, Bell, Sparkles } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Intelligent CV Analysis",
      description: "Advanced AI analyzes your CV to identify strengths, gaps, and optimization opportunities for better job matches.",
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "AI Mock Interview",
      description: "Practice interviews with AI-powered simulations that provide real-time feedback and personalized improvement tips.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "AI Chatbot Assistant",
      description: "Get instant answers to your career questions with our intelligent chatbot available 24/7 to guide your journey.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Matching Score",
      description: "Our AI calculates precise compatibility scores between candidates and jobs for optimal placement success.",
    },
    {
      icon: <FileEdit className="w-6 h-6" />,
      title: "Auto-Generate JD",
      description: "Recruiters can instantly create professional job descriptions with AI, saving time and ensuring quality.",
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Streamlined Pipelines",
      description: "Manage hiring workflows efficiently with customizable pipelines that adapt to your recruitment process.",
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "360° Talent Profiles",
      description: "Comprehensive candidate profiles with skills, experience, assessments, and cultural fit indicators.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Real-time Engagement",
      description: "Stay connected with instant notifications, updates, and communications throughout the hiring process.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Smart Recommendations",
      description: "AI-powered job and candidate recommendations that learn from your preferences and improve over time.",
    },
  ];

  return (
    <section className="py-16 bg-[#F8F9FB] animate-fade-in">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Why Choose Our Platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Powered by cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
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