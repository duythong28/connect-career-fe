import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { Button } from "../ui/button";

const TopCompanies = ({ companies = [] }: { companies: any[] }) => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Top Hiring <span className="text-gradient">Organizations</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore thousands of open roles and join the most active teams today
            </p>
          </div>
          <Button variant="outline" className="self-start sm:self-auto">
            View All Companies
          </Button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 shrink-0 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                  <img
                    src={company.logoFile?.url}
                    alt={company.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {company.industry?.name || company.industryId}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {company.city}
                    {company.country ? `, ${company.country}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {company.employeeCount
                      ? `${company.employeeCount.toLocaleString()} professionals`
                      : company.organizationSize}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;