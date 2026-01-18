import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, MapPin } from "lucide-react";

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      title: "Where Great Talent Meets Endless Opportunities",
      subtitle: "The unified platform connecting top candidates with leading employers",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
      gradient: "from-emerald-600 to-teal-700"
    },
    {
      title: "Build Your Career with Industry Leaders",
      subtitle: "Access thousands of opportunities from verified companies",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      gradient: "from-blue-600 to-cyan-700"
    },
    {
      title: "Smart Matching, Better Results",
      subtitle: "AI-powered recruitment platform for the modern workforce",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
      gradient: "from-purple-600 to-pink-700"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(p => (p + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700">
      {bannerSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-90`} />
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover mix-blend-overlay" />
        </div>
      ))}
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl text-white z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {bannerSlides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {bannerSlides[currentSlide].subtitle}
          </p>
          
          <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                placeholder="Job title, keywords, or company..."
                className="flex-1 outline-none text-gray-700 text-lg"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                placeholder="City or remote..."
                className="flex-1 outline-none text-gray-700 text-lg"
              />
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentSlide(p => (p - 1 + bannerSlides.length) % bannerSlides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-sm transition-colors z-10"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={() => setCurrentSlide(p => (p + 1) % bannerSlides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-sm transition-colors z-10"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;