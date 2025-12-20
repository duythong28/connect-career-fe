import { motion } from "framer-motion";
import {
  Bot,
  FileSearch,
  GitGraph,
  BrainCircuit,
  MessageSquare,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Smart Matching",
    description:
      "Instantly calculates compatibility scores between candidates and jobs to ensure the perfect fit.",
  },
  {
    icon: FileSearch,
    title: "Intelligent CV Analysis",
    description:
      "Automated scoring and filtering based on skills and experience, saving hours of manual review.",
  },
  {
    icon: Bot,
    title: "AI Interview Coach",
    description:
      "Candidates practice with AI agents to sharpen skills, ensuring higher quality interviews for employers.",
  },
  {
    icon: GitGraph,
    title: "Streamlined Pipelines",
    description:
      "Visualize and manage the entire hiring process from application to offer in one intuitive dashboard.",
  },
  {
    icon: Layers,
    title: "360° Talent Profiles",
    description:
      "Go beyond resumes with comprehensive profiles featuring skill assessments and past employer ratings.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Engagement",
    description:
      "Direct messaging, instant notifications, and seamless offer management to keep everyone aligned.",
  },
];

const Features = () => {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient">CareerHub</span>?
          </h2>
          <p className="text-muted-foreground text-lg">
            Powered by advanced AI to revolutionize how talent and opportunities
            connect
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 lg:p-8 rounded-2xl bg-background border border-border hover:shadow-card-hover hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
