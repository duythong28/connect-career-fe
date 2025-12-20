import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Bookmark } from "lucide-react";
import { Button } from "../ui/button";

const FeaturedJobs = ({ jobs = [] }: { jobs: any[] }) => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Featured <span className="text-gradient">Opportunities</span>
            </h2>
            {/* Đổi thành CTA: Thúc giục hành động "Discover" và "Apply" ngay lập tức */}
            <p className="text-muted-foreground text-lg">
              Discover your next career breakthrough and apply to these top-tier positions today
            </p>
          </div>
          <Button variant="outline" className="self-start sm:self-auto">
            View All Jobs
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-primary/20 transition-all duration-300"
            >
              {job.featured && (
                <span className="absolute top-4 right-4 px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  Featured
                </span>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                  <img
                    src={job.organization?.logoFile?.url || job.companyLogo}
                    alt={job.organization?.name || job.companyName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {job.organization?.name || job.companyName}
                  </p>
                </div>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Bookmark className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {job.salary ||
                        (job.salaryDetails?.minAmount &&
                        job.salaryDetails?.maxAmount
                          ? `${
                              job.salaryDetails.currency
                            } ${job.salaryDetails.minAmount.toLocaleString()} - ${job.salaryDetails.maxAmount.toLocaleString()}`
                          : "Competitive Package")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(job.keywords || []).slice(0, 2).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;