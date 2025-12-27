import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const footerLinks = {
    "For Candidates": [
      "Browse Opportunities",
      "AI Resume Builder",
      "Career Growth",
      "Salary Insights",
    ],
    "For Employers": [
      "Post a Job",
      "AI Talent Matching",
      "Hiring Solutions",
      "Success Stories",
    ],
    Ecosystem: ["About Us", "Our Technology", "Trust & Safety", "Help Center"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return currentPath === "/" ? (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/career48.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold">CareerHub</span>
            </a>
            <p className="text-primary-foreground/60 text-sm mb-6">
              The unified AI ecosystem for careers and businesses.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2025 CareerHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  ) : (
    <></>
  );
};

export default Footer;
