import { Quote, Star, Sparkles } from "lucide-react";
import { TESTIMONIALS } from "../../utils/constants";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const stats = [
  { value: "50K+", label: "Happy Users" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "100K+", label: "eBooks Created" },
];

function TestimonialCard({ username, designation, quote, avatarSrc, rating, index }) {
  const [ref, isVisible] = useScrollReveal();

  return (
    <li
      ref={ref}
      style={{ transitionDelay: isVisible ? `${index * 90}ms` : "0ms" }}
      className={`bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 border border-gray-100 relative group transition-all duration-700 motion-reduce:transition-none motion-reduce:transform-none hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 focus-within:border-violet-200 focus-within:shadow-2xl focus-within:shadow-violet-500/10 focus-within:-translate-y-2 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Decorative quote icon with glow */}
      <div className="absolute -left-3 sm:-left-4 -top-3 sm:-top-4">
        <div className="size-10 sm:size-12 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl sm:rounded-2xl opacity-40 blur-md absolute inset-0 transition-opacity duration-300 group-hover:opacity-70" />
        <div className="size-10 sm:size-12 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg shadow-violet-500/30 flex items-center justify-center relative rotate-6 transition-transform duration-300 group-hover:rotate-12">
          <Quote className="size-5 sm:size-6 text-white" />
        </div>
      </div>

      {/* Rating stars */}
      <div className="mb-4 sm:mb-6 flex items-center gap-x-1">
        {Array(rating)
          .fill(1)
          .map((_, i) => (
            <Star
              key={i}
              className="size-4 sm:size-5 text-violet-500 fill-violet-500 transition-transform duration-300"
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
      </div>

      {/* Testimonial quote */}
      <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
        "{quote}"
      </blockquote>

      {/* Author info */}
      <footer className="flex items-center gap-x-3 sm:gap-x-4">
        <div className="relative">
          <div className="bg-linear-to-br from-violet-500 to-purple-600 rounded-full opacity-30 absolute inset-0 blur-sm transition-opacity duration-300 group-hover:opacity-60" />
          <img
            src={avatarSrc}
            alt={`${username}'s profile picture`}
            className="size-12 sm:size-14 object-cover rounded-full shadow-lg ring-2 ring-white relative"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm sm:text-base font-semibold truncate">
            {username}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm truncate">
            {designation}
          </p>
        </div>
      </footer>

      {/* Hover gradient overlay */}
      <div className="bg-linear-to-br from-violet-50/0 to-purple-50/0 rounded-2xl sm:rounded-3xl absolute inset-0 -z-10 transition-colors duration-300 group-hover:from-violet-50/50 group-hover:to-purple-50/30 group-focus-within:from-violet-50/50 group-focus-within:to-purple-50/30" />
    </li>
  );
}

function StatItem({ value, label, index, isLast }) {
  const [ref, isVisible] = useScrollReveal();

  return (
    <li
      ref={ref}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
      className={`text-center relative transition-all duration-700 motion-reduce:transition-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <p className="text-gray-900 text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 tabular-nums">
        {value}
      </p>
      <p className="text-gray-600 text-sm sm:text-base">{label}</p>

      {!isLast && (
        <div className="sm:hidden w-16 h-px bg-gray-200 mx-auto mt-6" />
      )}
    </li>
  );
}

const Testimonials = () => {
  const [headerRef, headerVisible] = useScrollReveal();

  return (
    <article
      id="testimonials"
      className="bg-linear-to-br from-violet-50 via-purple-50 to-white py-16 sm:py-20 lg:py-32 overflow-hidden relative"
    >
      {/* Decorative bg elements */}
      <div className="size-64 bg-violet-200/30 backdrop-blur-3xl rounded-full absolute top-20 right-10 animate-pulse motion-reduce:animate-none" />
      <div className="size-96 bg-purple-200/20 backdrop-blur-3xl rounded-full absolute bottom-20 left-10 animate-pulse delay-700 motion-reduce:animate-none" />

      <div className="max-w-7xl px-6 lg:px-8 mx-auto relative">
        {/* Header */}
        <header
          ref={headerRef}
          className={`text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 lg:mb-20 transition-all duration-700 motion-reduce:transition-none ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Badge */}
          <div className="bg-white/80 backdrop-blur-sm border border-violet-100 rounded-full px-4 py-2 shadow-sm inline-flex items-center gap-x-2 w-fit mx-auto">
            <Star className="size-4 text-violet-600 fill-violet-600" />
            <span className="text-violet-900 text-sm font-semibold">
              Testimonials
            </span>
          </div>

          <h2 className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight px-4">
            Writers Rave About
            <br />
            <span className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift motion-reduce:animate-none">
              Their Success Stories
            </span>
          </h2>

          <p className="max-w-2xl text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mx-auto px-4">
            Real authors, real results. See how eBookAI helped them go from
            aspiring to accomplished.
          </p>
        </header>

        {/* Testimonials grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.username} index={index} {...testimonial} />
          ))}
        </ul>

        {/* Bottom stats — glass strip */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-16 lg:mt-20 relative">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl sm:rounded-3xl shadow-lg shadow-violet-500/5 px-6 py-8 sm:py-10">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
              {stats.map((stat, index) => (
                <StatItem
                  key={stat.label}
                  {...stat}
                  index={index}
                  isLast={index === stats.length - 1}
                />
              ))}

              {/* Desktop dividers */}
              <div className="hidden sm:block absolute left-1/3 top-1/2 -translate-y-1/2 h-10 w-px bg-gray-200" />
              <div className="hidden sm:block absolute left-2/3 top-1/2 -translate-y-1/2 h-10 w-px bg-gray-200" />
            </ul>
          </div>

          {/* Trust microcopy */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-500">
            <Sparkles className="size-3.5 text-violet-500" />
            <span>Trusted by authors in over 40 countries</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Testimonials;