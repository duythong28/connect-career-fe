import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Join the Ecosystem",
    description:
      "Create your professional talent profile or establish your employer brand.",
  },
  {
    number: "02",
    title: "AI Smart Matching",
    description:
      "Our algorithms analyze skills and requirements to connect perfect matches instantly.",
  },
  {
    number: "03",
    title: "Connect & Engage",
    description:
      "Streamline the process with direct messaging, smart scheduling, and automated pipelines.",
  },
  {
    number: "04",
    title: "Achieve Success",
    description:
      "Secure your dream job or hire your next star employee with confidence.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Streamlined <span className="text-gradient">Workflow</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A seamless journey from connection to hiring success for everyone
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
              )}

              <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-full gradient-cta flex items-center justify-center shadow-soft">
                <span className="text-xl font-bold text-primary-foreground">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
