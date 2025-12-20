const stats = [
  { value: "90M+", label: "Users", description: "talents in network" },
  { value: "200K+", label: "Companies", description: "hiring partners" },
  { value: "500K+", label: "Offers", description: "career opportunities" },
  { value: "150+", label: "Countries", description: "global ecosystem" },
];

const Stats = () => {
  return (
    <section className="py-20 gradient-blue">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Global Scale, Real Impact
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Empowering professionals and companies to succeed together across
            our worldwide network.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-primary-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
