import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const footerLinks = {
    "For Candidates": [
      { name: "Browse Opportunities", href: "/jobs" },
      { name: "AI Resume Builder", href: "#" },
      { name: "Career Growth", href: "#" },
      { name: "Salary Insights", href: "#" },
    ],
    "For Employers": [
      { name: "Post a Job", href: "#" },
      { name: "AI Talent Matching", href: "#" },
      { name: "Hiring Solutions", href: "#" },
      { name: "Success Stories", href: "#" },
    ],
    Ecosystem: [
      { name: "About Us", href: "#" },
      { name: "Pricing", href: "/pricing" },
      { name: "How It Work", href: "/how-it-work" },
      { name: "Help Center", href: "#" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Security", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ];

  const legalLinks = [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookies", href: "#" },
  ];

  return ["/", "/pricing", "/how-it-work"].includes(currentPath) ? (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/career48.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold">CareerHub</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm mb-6">
              The unified AI ecosystem for careers and businesses.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
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
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  ) : (
    <></>
  );
};

export default Footer;
