import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const bannerSlides = [
    {
      // Key 1: AI supporting recruiters (Screening & Evaluation)
      title: "Optimize Hiring with AI Intelligence",
      subtitle:
        "Streamline screening and evaluate candidate fit with precision-driven AI tools",
      // Image: Professional Team/Recruiters
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&h=600&fit=crop",
      gradient: "from-blue-900/90 to-slate-900/90",
    },
    {
      // Key 2: AI supporting candidates (CV, Advice, Recommendations)
      title: "Elevate Your Career with AI Guidance",
      subtitle:
        "Enhance your CV and discover opportunities with personalized AI recommendations",
      // Image: Handshake/Connection
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      gradient: "from-indigo-900/90 to-blue-900/90",
    },
    {
      // Key 3: Mock Interview Feature
      title: "Master Interviews with AI Simulations",
      subtitle:
        "Build your confidence and refine real-world skills through realistic AI mock interviews",
      // Image: Professional Meeting/Interview
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&h=600&fit=crop",
      gradient: "from-slate-900/90 to-gray-900/90",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-background animate-fade-in">
      {/* Background Slides */}
      {bannerSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Overlay Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} z-10`}
          />
          {/* Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Content Layer */}
      <div className="relative z-20 container-custom h-full flex items-center">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-sm">
            {bannerSlides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-medium drop-shadow-sm">
            {bannerSlides[currentSlide].subtitle}
          </p>

          {/* Search Card */}
          <div className="bg-card rounded-3xl p-3 flex flex-col md:flex-row gap-3 shadow-xl border border-border/50 backdrop-blur-sm bg-opacity-95">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                placeholder="Job title, keywords, or company..."
                className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg h-full py-2"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-md whitespace-nowrap"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls (Hidden on Mobile) */}
      <button
        onClick={() =>
          setCurrentSlide(
            (p) => (p - 1 + bannerSlides.length) % bannerSlides.length,
          )
        }
        className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-20 text-white border border-white/20 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={() => setCurrentSlide((p) => (p + 1) % bannerSlides.length)}
        className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-20 text-white border border-white/20 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/40 w-2 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;