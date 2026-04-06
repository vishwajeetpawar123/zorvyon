import { useState, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { Button } from './Button';
import { Sparkles, LayoutDashboard, Target, ArrowRight, X } from 'lucide-react';
import zorvynLogo from '../../assets/zorvynimg.png';

const slides = [
  {
    title: "Welcome to Zorvyn",
    desc: "Your premium financial dashboard designed for clarity and control.",
    icon: <img src={zorvynLogo} alt="Logo" className="w-16 h-16 object-contain" />
  },
  {
    title: "Your Dashboard",
    desc: "Get an at-a-glance view of your net worth, expenses, and transaction history.",
    icon: <LayoutDashboard className="w-16 h-16 text-accent-primary" />
  },
  {
    title: "Track Everything",
    desc: "Set budget goals, monitor your savings, and export professional reports effortlessly.",
    icon: <Target className="w-16 h-16 text-info" />
  },
  {
    title: "You're All Set",
    desc: "Dive into Zorvyn and take control of your financial journey today.",
    icon: <Sparkles className="w-16 h-16 text-warning" />
  }
];

export function WelcomeTour() {
  const { hasSeenTour, setHasSeenTour } = useUIStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasSeenTour) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, [hasSeenTour]);

  if (!isVisible || hasSeenTour) return null;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      finishTour();
    }
  };

  const finishTour = () => {
    setIsVisible(false);
    setHasSeenTour(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={finishTour}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-bg-surface border border-border-default rounded-3xl shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 fade-in duration-500 fill-mode-both">
        <button 
          onClick={finishTour}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-bg-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6 pt-4 h-64 justify-center relative">
          {slides.map((slide, idx) => (
            <div 
              key={idx}
              className={`absolute top-0 inset-x-0 bottom-0 flex flex-col items-center justify-center transition-all duration-500 ${
                idx === currentSlide 
                  ? 'opacity-100 translate-x-0 z-10' 
                  : idx < currentSlide 
                    ? 'opacity-0 -translate-x-full pointer-events-none' 
                    : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              <div className="mb-6 p-4 rounded-full bg-bg-elevated/50 border border-border-default shadow-sm text-accent-primary animate-pulse">
                {slide.icon}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-2">{slide.title}</h2>
              <p className="text-sm text-text-secondary w-5/6 leading-relaxed">{slide.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 relative z-10">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'w-6 bg-accent-primary' : 'w-2 bg-border-active'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentSlide < slides.length - 1 ? (
              <>
                <button 
                  onClick={finishTour}
                  className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  Skip
                </button>
                <Button onClick={nextSlide} className="gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button onClick={nextSlide} className="gap-2 w-full">
                Get Started <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
