import Link from "next/link";
import {
  QrCode,
  BarChart3,
  Trophy,
  Star,
  Activity,
  FileSpreadsheet,
  Zap,
  Shield,
  ArrowRight,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "QR Check-in",
    description:
      "Each attendee gets a unique QR code. Hosts scan to record attendance in under a second. No paper, no hassle.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Beautiful dashboards with real-time metrics. Track attendance trends, peak hours, and engagement scores at a glance.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    title: "Gamification & Leaderboards",
    description:
      "Motivate attendance with points, streaks, and competitive leaderboards. Turn showing up into a rewarding experience.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Star,
    title: "Event Ratings",
    description:
      "Collect instant feedback with star ratings and reviews after every event. Know what works and what to improve.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Activity,
    title: "Real-time Feed",
    description:
      "Live activity stream showing check-ins as they happen. Perfect for monitoring large events and tracking momentum.",
    gradient: "from-rose-500 to-red-500",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel Reports",
    description:
      "Export comprehensive multi-sheet Excel reports with analytics, attendance logs, and participant data in one click.",
    gradient: "from-cyan-500 to-blue-500",
  },
];

const steps = [
  {
    number: "01",
    icon: Calendar,
    title: "Create Events",
    description:
      "Set up your event in seconds with our intuitive creator. Add details, set capacity, and customize check-in rules.",
  },
  {
    number: "02",
    icon: QrCode,
    title: "Scan QR Codes",
    description:
      "Attendees show their unique QR code. One scan records their attendance instantly with timestamp and location.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Track & Analyze",
    description:
      "Watch your dashboard light up with real-time data. Export reports, spot trends, and make data-driven decisions.",
  },
];

const testimonials = [
  {
    quote:
      "NexMeet completely transformed how we manage our 500+ member community events. Check-in went from 20 minutes to under 2.",
    name: "Priya Sharma",
    role: "Community Lead, TechHub Bangalore",
    avatar: "PS",
  },
  {
    quote:
      "The analytics alone are worth it. We finally understand attendance patterns and can plan events that people actually show up to.",
    name: "Marcus Chen",
    role: "Events Director, StartupGrind NYC",
    avatar: "MC",
  },
  {
    quote:
      "Our team loves the gamification features. Attendance went up 40% after we introduced leaderboards. It just works.",
    name: "Aisha Okonkwo",
    role: "HR Manager, Deloitte Africa",
    avatar: "AO",
  },
];

const stats = [
  { value: "12,000+", label: "Events Hosted" },
  { value: "2.4M", label: "Check-ins Tracked" },
  { value: "85,000+", label: "Active Users" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.3),transparent)]" />

          {/* Floating orb 1 - large indigo */}
          <div
            className="absolute animate-float-slow"
            style={{
              top: "10%",
              left: "15%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Floating orb 2 - purple */}
          <div
            className="absolute animate-float"
            style={{
              top: "30%",
              right: "10%",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Floating orb 3 - emerald accent */}
          <div
            className="absolute animate-float-reverse"
            style={{
              bottom: "15%",
              left: "30%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Floating orb 4 - small indigo */}
          <div
            className="absolute animate-float"
            style={{
              top: "60%",
              right: "25%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
              filter: "blur(30px)",
              animationDelay: "2s",
            }}
          />

          {/* Floating orb 5 - tiny pink */}
          <div
            className="absolute animate-float-slow"
            style={{
              top: "20%",
              left: "60%",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
              filter: "blur(20px)",
              animationDelay: "4s",
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            The Future of Event Attendance
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Main heading */}
          <h1 className="animate-slide-up-1 text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-6">
            <span
              className="animate-gradient-shift bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #6366f1, #a855f7, #6366f1, #10b981)",
                backgroundSize: "300% 300%",
              }}
            >
              NexMeet
            </span>
          </h1>

          {/* Tagline */}
          <p className="animate-slide-up-2 text-2xl md:text-3xl lg:text-4xl font-light text-gray-300 mb-4">
            Where Every Check-In Counts
          </p>

          {/* Description */}
          <p className="animate-slide-up-3 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Create events, scan QR codes, track attendance, and unlock
            powerful analytics — all in one beautiful platform built for
            modern communities.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-500/25"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              }}
            >
              <QrCode className="h-5 w-5" />
              Attendee Login
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #4338ca, #6d28d9)",
                }}
              />
              <span className="relative z-10 flex items-center gap-3">
              </span>
            </Link>

            <Link
              href="/host/login"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-500/25"
              style={{
                background: "linear-gradient(135deg, #059669, #10b981)",
              }}
            >
              <Shield className="h-5 w-5" />
              Organizer Login
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="animate-slide-up-5 mt-20 flex flex-col items-center gap-2 text-gray-500">
            <span className="text-xs uppercase tracking-widest">
              Scroll to explore
            </span>
            <div className="w-5 h-8 rounded-full border-2 border-gray-600 flex items-start justify-center p-1">
              <div
                className="w-1.5 h-1.5 rounded-full bg-gray-400"
                style={{
                  animation: "float 2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS SECTION */}
      {/* ============================================ */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-indigo-950/20 to-gray-950" />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                style={{
                  animation: `slide-up 0.8s ease-out ${0.2 * i}s both`,
                }}
              >
                <div
                  className="text-5xl md:text-6xl font-extrabold mb-2 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #6366f1, #a855f7)",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-400 text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURES SECTION */}
      {/* ============================================ */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <div
            className="absolute animate-pulse-glow"
            style={{
              top: "20%",
              right: "5%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Packed with Features
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Everything you need to{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #6366f1, #a855f7)",
                }}
              >
                run great events
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From check-in to analytics, NexMeet covers the full event
              lifecycle with tools your team will actually love using.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card group rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm cursor-default"
                style={{
                  animation: `slide-up 0.8s ease-out ${0.1 * i}s both`,
                }}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS SECTION */}
      {/* ============================================ */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-purple-950/10 to-gray-950" />

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
              <CheckCircle2 className="h-4 w-4" />
              Simple as 1-2-3
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              How{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #a855f7, #6366f1)",
                }}
              >
                NexMeet
              </span>{" "}
              works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get started in minutes. No complex setup, no learning curve.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative text-center"
                style={{
                  animation: `slide-up 0.8s ease-out ${0.2 * i}s both`,
                }}
              >
                {/* Connector line (not on last item) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-indigo-500/40 to-purple-500/40" />
                )}

                {/* Step number circle */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6">
                  <span className="text-3xl font-extrabold text-indigo-400">
                    {step.number}
                  </span>
                  <div className="absolute inset-0 rounded-full animate-pulse-glow bg-indigo-500/5" />
                </div>

                <div className="inline-flex p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] mb-4">
                  <step.icon className="h-6 w-6 text-indigo-400" />
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <div
            className="absolute animate-float-slow"
            style={{
              bottom: "10%",
              left: "5%",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Loved by Teams
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              What people are{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #10b981, #6366f1)",
                }}
              >
                saying
              </span>
            </h2>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1"
                style={{
                  animation: `slide-up 0.8s ease-out ${0.15 * i}s both`,
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 leading-relaxed mb-6 text-sm italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #6366f1, #a855f7)",
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA SECTION */}
      {/* ============================================ */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div
            className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #4338ca 100%)",
            }}
          >
            {/* CTA background effects */}
            <div
              className="absolute animate-float"
              style={{
                top: "-20%",
                right: "-10%",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute animate-float-reverse"
              style={{
                bottom: "-20%",
                left: "-10%",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Get Started Free
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                Ready to transform your events?
              </h2>
              <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-10">
                Join thousands of organizers who have already upgraded their
                event experience. Set up in 2 minutes, free forever for
                small teams.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
                >
                  <QrCode className="h-5 w-5" />
                  Attendee Login
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/host/login"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/20 hover:scale-[1.03] transition-all duration-300"
                >
                  <Shield className="h-5 w-5" />
                  Organizer Login
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                }}
              >
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #6366f1, #a855f7)",
                }}
              >
                NexMeet
              </span>
            </div>

            {/* Tagline */}
            <p className="text-gray-500 text-sm">
              Where Every Check-In Counts
            </p>

            {/* Built with */}
            <p className="text-gray-600 text-xs">
              Built with Next.js, Tailwind CSS & Prisma
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/[0.04] text-center text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} NexMeet. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
