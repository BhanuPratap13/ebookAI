
import { useAuthContext } from "../../context/AuthContext";
import { FEATURES } from "../../utils/constants";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

function FeatureCard({ title, icon: Icon, description, bgGradientColors, shadowColor, index, isAuthenticated }) {
  const [ref, isVisible] = useScrollReveal();

  return (
    <li
      ref={ref}
      style={{ transitionDelay: isVisible ? `${index * 80}ms` : "0ms" }}
      className={`bg-white border border-gray-100 rounded-2xl p-6 sm:p-7 lg:p-8 transition-all duration-700 motion-reduce:transition-none motion-reduce:transform-none hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 focus-within:border-violet-200 focus-within:shadow-xl focus-within:shadow-violet-500/10 focus-within:-translate-y-1 relative group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Gradient overlay on hover */}
      <div className="bg-linear-to-br from-violet-50/0 to-purple-50/0 rounded-2xl absolute inset-0 transition-all duration-300 group-hover:from-violet-50/50 group-hover:to-purple-50/50 group-focus-within:from-violet-50/50 group-focus-within:to-purple-50/50 pointer-events-none" />

      <section className="space-y-3 sm:space-y-4 relative">
        <div
          className={`size-12 sm:size-13 lg:size-14 bg-linear-to-br ${bgGradientColors} rounded-xl shadow-lg ${shadowColor} flex justify-center items-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 group-focus-within:scale-110`}
        >
          <Icon className="size-6 sm:size-6.5 lg:size-7 text-white" />
        </div>

        <div>
          <h3 className="text-gray-900 text-lg sm:text-xl font-bold mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-violet-900 group-focus-within:text-violet-900">
            {title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="text-violet-600 pt-1 sm:pt-2 opacity-60 inline-flex items-center gap-x-px transition-all duration-300 hover:opacity-100 hover:gap-x-1.5 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 rounded-sm"
        >
          <span className="text-sm font-medium">Learn more</span>
          <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </section>
    </li>
  );
}

function Features() {
  const { isAuthenticated } = useAuthContext();
  const [headerRef, headerVisible] = useScrollReveal();
  const [footerRef, footerVisible] = useScrollReveal();

  return (
    <article
      id="features"
      className="bg-white py-16 sm:py-20 lg:py-32 overflow-hidden relative"
    >
      {/* Subtle bg gradient + dot grid */}
      <div className="bg-linear-to-b from-violet-50/50 via-transparent to-purple-50/50 absolute inset-0" />
      <div
        className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_50%_40%_at_50%_50%,black,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="max-w-7xl px-6 lg:px-8 mx-auto relative">
        {/* Header */}
        <header
          ref={headerRef}
          className={`text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 lg:mb-20 transition-all duration-700 motion-reduce:transition-none ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Badge */}
          <div className="bg-violet-100 rounded-full px-4 py-2 inline-flex items-center gap-x-2 w-fit mx-auto">
            <span className="size-2 bg-violet-600 rounded-full animate-pulse motion-reduce:animate-none" />
            <span className="text-violet-900 text-sm font-semibold">
              Features
            </span>
          </div>

          <h2 className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight px-4">
            Your Complete
            <br />
            <span className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift motion-reduce:animate-none">
              Author Toolkit
            </span>
          </h2>

          <p className="max-w-2xl text-gray-600 text-sm sm:text-base leading-relaxed mx-auto px-4">
            From blank page to bestseller—everything you need is built right
            in, ready when inspiration strikes.
          </p>
        </header>

        {/* Features grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              index={index}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </ul>

        {/* CTA */}
        <footer
          ref={footerRef}
          className={`text-center mt-12 sm:mt-14 lg:mt-16 transition-all duration-700 motion-reduce:transition-none ${
            footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
            Ready to bring your book to life?
          </p>

          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="relative overflow-hidden bg-linear-to-r from-violet-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg shadow-violet-500/30 inline-flex items-center gap-x-2 transition-all duration-200 hover:shadow-violet-500/50 hover:scale-101 focus-visible:shadow-violet-500/50 focus-visible:scale-101 active:scale-99 group"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative">
              {isAuthenticated ? "My Writing Space" : "Launch Your First Book"}
            </span>
            <ArrowRight className="relative size-4 sm:size-5 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
          </Link>
        </footer>
      </div>
    </article>
  );
}

export default Features;