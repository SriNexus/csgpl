/**
 * HeroSlider — premium full-width carousel system.
 *
 * Features:
 *   • Auto-slide every 5 seconds (pause on hover)
 *   • Left/right arrow controls
 *   • Pagination dots
 *   • Touch/swipe support
 *   • Responsive (desktop, tablet, mobile)
 *   • Image optimization (desktop vs mobile)
 *   • Smooth transitions via Framer Motion
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import type { HeroSlideRecord } from "@/cms/collections";

export interface HeroSliderProps {
  slides: HeroSlideRecord[];
  autoplayMs?: number;
  onSlideChange?: (index: number) => void;
  className?: string;
}

export default function HeroSlider({
  slides,
  autoplayMs = 5000,
  onSlideChange,
  className,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);

  // Filter active slides
  const activeSlides = slides
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Fallback: show dummy slide if no active slides
  if (activeSlides.length === 0) {
    return <EmptyHeroState />;
  }

  // Normalize current index
  const slideIndex = currentIndex % activeSlides.length;

  // Auto-advance slide
  useEffect(() => {
    if (hovering) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }

    autoplayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }, autoplayMs);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [hovering, autoplayMs]);

  // Notify parent on slide change
  useEffect(() => {
    onSlideChange?.(slideIndex);
  }, [slideIndex, onSlideChange]);

  function goToSlide(index: number) {
    setDirection(index > slideIndex ? 1 : -1);
    setCurrentIndex(index);
  }

  function nextSlide() {
    setDirection(1);
    setCurrentIndex((i) => i + 1);
  }

  function prevSlide() {
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    touchStartRef.current = null;

    // Swipe left → next, swipe right → prev
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }

  const slide = activeSlides[slideIndex];

  return (
    <section
      className={cn(
        "relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-ink-900",
        className
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <SlideContent slide={slide} index={slideIndex} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <NavigationArrows
        onNext={nextSlide}
        onPrev={prevSlide}
        visible={!hovering}
        className="absolute inset-0 z-20 pointer-events-none"
      />

      {/* Pagination Dots */}
      <PaginationDots
        total={activeSlides.length}
        current={slideIndex}
        onDot={goToSlide}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
      />
    </section>
  );
}

/* ============================================================
   SLIDE CONTENT
   ============================================================ */

interface SlideContentProps {
  slide: HeroSlideRecord;
  index: number;
}

function SlideContent({ slide, index }: SlideContentProps) {
  const overlayOpacity = slide.overlayOpacity ?? 0.3;

  return (
    <div className="relative w-full h-full">
      {/* Background Image — responsive */}
      <picture className="absolute inset-0">
        {/* Mobile */}
        <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
        {/* Desktop */}
        <img
          src={slide.desktopImage}
          alt={slide.heading}
          className="w-full h-full object-cover"
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </picture>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content — centered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-12 text-center"
      >
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight max-w-4xl">
          {slide.heading}
        </h2>

        {/* Subheading */}
        {slide.subheading && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed"
          >
            {slide.subheading}
          </motion.p>
        )}

        {/* CTA Button */}
        {slide.buttonText && slide.buttonUrl && (
          <motion.a
            href={slide.buttonUrl}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className={cn(
              "mt-8 px-8 py-3 sm:py-4 bg-brand-600 text-white font-semibold rounded-lg",
              "hover:bg-brand-700 transition-colors duration-200",
              "shadow-lg hover:shadow-xl"
            )}
          >
            {slide.buttonText}
          </motion.a>
        )}
      </motion.div>
    </div>
  );
}

/* ============================================================
   NAVIGATION ARROWS
   ============================================================ */

interface NavigationArrowsProps {
  onNext: () => void;
  onPrev: () => void;
  visible: boolean;
  className?: string;
}

function NavigationArrows({
  onNext,
  onPrev,
  visible,
  className,
}: NavigationArrowsProps) {
  return (
    <div className={className}>
      {/* Left Arrow */}
      <motion.button
        onClick={onPrev}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        disabled={!visible}
        className={cn(
          "absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30",
          "pointer-events-auto p-2 sm:p-3 rounded-full",
          "bg-white/20 hover:bg-white/40 backdrop-blur-sm",
          "transition-colors duration-200",
          "disabled:cursor-not-allowed disabled:opacity-0"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        disabled={!visible}
        className={cn(
          "absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30",
          "pointer-events-auto p-2 sm:p-3 rounded-full",
          "bg-white/20 hover:bg-white/40 backdrop-blur-sm",
          "transition-colors duration-200",
          "disabled:cursor-not-allowed disabled:opacity-0"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </motion.button>
    </div>
  );
}

/* ============================================================
   PAGINATION DOTS
   ============================================================ */

interface PaginationDotsProps {
  total: number;
  current: number;
  onDot: (index: number) => void;
  className?: string;
}

function PaginationDots({
  total,
  current,
  onDot,
  className,
}: PaginationDotsProps) {
  return (
    <div
      className={cn("flex gap-2 items-center", className)}
      role="tablist"
      aria-label="Slide navigation"
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onDot(i)}
          className={cn(
            "h-2.5 rounded-full transition-colors duration-300",
            i === current ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/75"
          )}
          aria-label={`Go to slide ${i + 1}`}
          aria-selected={i === current}
        />
      ))}
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */

function EmptyHeroState() {
  return (
    <section className="w-full h-[75vh] md:h-[85vh] bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center">
      <div className="text-center px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Welcome to CSGPL
        </h2>
        <p className="text-lg text-white/70 max-w-lg mx-auto">
          Power your future with smart solar energy. End-to-end residential,
          commercial & industrial solar solutions.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#consultation"
            className={cn(
              "px-8 py-3 sm:py-4 bg-brand-600 text-white font-semibold rounded-lg",
              "hover:bg-brand-700 transition-colors duration-200",
              "shadow-lg hover:shadow-xl"
            )}
          >
            Get Free Consultation
          </a>
          <a
            href="#process"
            className={cn(
              "px-8 py-3 sm:py-4 bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm",
              "hover:bg-white/30 transition-colors duration-200"
            )}
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
