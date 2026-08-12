import { useAuthContext } from "../../context/AuthContext";
import {
  ArrowRight,
  Sparkles,
  WandSparkles,
  FileText,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50000, suffix: "+", label: "Books Created" },
  { value: 4.9, suffix: "/5", label: "User Rating", decimals: 1 },
  { value: 10, suffix: "min", label: "Avg. Creation" },
];

function CountUpStat({ value, suffix = "", decimals = 0, label }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, value]);

  return (
    <div ref={ref} className="shrink-0">
      <p className="text-gray-900 text-xl sm:text-2xl font-bold tabular-nums">
        {display.toFixed(decimals)}
        {suffix}
      </p>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}

function Hero() {
  const { isAuthenticated } = useAuthContext();

  return (
    <article className="bg-linear-to-br from-violet-50 via-white to-purple-50 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(139,92,246,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      ></div>

      <div className="size-64 bg-violet-200/30 backdrop-blur-3xl rounded-full absolute left-10 top-20 animate-pulse"></div>
      <div className="size-96 bg-purple-200/20 backdrop-blur-3xl rounded-full absolute right-10 bottom-20 animate-pulse delay-700"></div>

      <div className="max-w-7xl px-6 lg:px-8 py-16 sm:py-20 lg:py-32 mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <div className="order-1 lg:order-2 lg:pl-8 relative">
            <div className="relative py-6 lg:py-10">
              <img
                src="/images/hero-image.svg"
                alt="eBookAI editor showing an AI-generated chapter mid-write"
                className="w-full h-auto select-none relative z-10"
              />

              <div
                className="hidden md:flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 shadow-lg px-3.5 py-2.5 absolute -left-4 top-4 z-20 animate-float"
                style={{ animationDelay: "0s" }}
              >
                <div className="size-7 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                  <Zap className="size-3.5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Chapter 4 writing...
                  </p>
                  <p className="text-[11px] text-gray-500">AI in progress</p>
                </div>
              </div>

              <div
                className="hidden md:flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 shadow-lg px-3.5 py-2.5 absolute -right-4 top-1/3 z-20 animate-float"
                style={{ animationDelay: "1.1s" }}
              >
                <div className="size-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Fact-check passed
                  </p>
                  <p className="text-[11px] text-gray-500">98% confidence</p>
                </div>
              </div>

              <div
                className="hidden md:flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 shadow-lg px-3.5 py-2.5 absolute -left-4 bottom-4 z-20 animate-float"
                style={{ animationDelay: "2s" }}
              >
                <div className="size-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <FileText className="size-3.5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Exported to PDF
                  </p>
                  <p className="text-[11px] text-gray-500">Just now</p>
                </div>
              </div>
            </div>
          </div>

          <section className="order-2 lg:order-1 max-w-xl space-y-6 lg:space-y-8">
            <div className="bg-white/80 backdrop-blur-sm border border-violet-100 rounded-full px-4 py-2 shadow-sm inline-flex items-center gap-x-2 w-fit">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-violet-600"></span>
              </span>
              <WandSparkles className="size-4 text-violet-600" />
              <span className="text-violet-900 text-sm font-medium">
                Smart Publishing Platform
              </span>
            </div>

            <h1 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Turn Ideas Into
              <br />
              <span className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                Published eBooks
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Write, design, and export professional eBooks in minutes. Your
              personal publishing assistant that handles the heavy lifting.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="relative overflow-hidden bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl px-8 py-4 shadow-lg shadow-violet-500/30 inline-flex items-center gap-x-2 transition-all duration-200 hover:shadow-violet-500/50 hover:scale-101 focus-visible:shadow-violet-500/50 focus-visible:scale-101 group w-full sm:w-auto justify-center"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-linear-to-r from-transparent via-white/20 to-transparent"></span>
                <span className="relative">
                  {isAuthenticated ? "Go to Dashboard" : "Make Your Imprint"}
                </span>
                <ArrowRight className="relative size-5 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="text-gray-700 font-medium inline-flex items-center gap-x-2 transition-colors duration-200 hover:text-violet-600 focus-visible:text-violet-600 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Sparkles className="size-5 text-violet-600" />
                <span>View Features</span>
              </a>
            </div>
            <div className="pt-6 lg:pt-8 flex flex-wrap items-center gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  <CountUpStat {...stat} />

                  {index !== stats.length - 1 && (
                    <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

export default Hero;