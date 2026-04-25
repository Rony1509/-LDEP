"use client"

import { useState, useEffect, useRef } from "react"
import {
  Heart,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  Link2,
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal, type AuthMode } from "@/components/auth-modal"
import { store } from "@/lib/store"


// Animated Counter
function AnimatedCounter({ value, prefix = "৳", suffix = "", duration = 2500 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let start = 0
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplayValue(Math.floor(ease * value + start))
      if (progress < 1) requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>
}

// Floating Orb
function FloatingOrb({ delay = 0, color = "from-blue-500 to-purple-500", className = "" }: { delay?: number; color?: string; className?: string }) {
  return (
    <div 
      className={`absolute rounded-full blur-xl opacity-20 animate-float ${color} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

// Glass Card
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={`backdrop-blur-xl bg-white/20 border-white/30 shadow-2xl ${className}`}>
      {children}
    </Card>
  )
}

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("select-role")
  const [stats, setStats] = useState({
    totalMonetary: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    totalTasks: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await store.getStats()
        setStats({
          totalMonetary: data.totalMonetary || 0,
          totalDonors: data.totalDonors || 156,
          totalVolunteers: data.totalVolunteers || 42,
          totalTasks: data.totalTasks || 89,
        })
      } catch {
        // Fallback
        setStats({ totalMonetary: 125000, totalDonors: 156, totalVolunteers: 42, totalTasks: 89 })
      }
    }
    fetchStats()
    const id = setInterval(fetchStats, 30000)
    return () => clearInterval(id)
  }, [])

  const testimonials = [
    {
      name: "Rahim Khan",
      role: "Donor",
      quote: "Finally a platform where I can see exactly where my donations go. The blockchain transparency gives me confidence.",
      rating: 5,
    },
    {
      name: "Fatema Begum",
      role: "Volunteer",
      quote: "Love the task management and real-time tracking. Very organized and donors get proof of delivery.",
      rating: 5,
    },
    {
      name: "Admin Team",
      role: "Platform Admin",
      quote: "Perfect balance of features for managing volunteers, donations, and analytics. Highly recommend.",
      rating: 5,
    },
  ]

  function openAuth(mode: AuthMode) {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Orbs */}
      <FloatingOrb delay={0} color="from-indigo-400/20 via-blue-400/20 to-purple-400/20" />
      <FloatingOrb delay={1} color="from-emerald-400/20 via-teal-400/20 to-cyan-400/20" className="top-20 right-20" />
      <FloatingOrb delay={2} color="from-rose-400/20 via-pink-400/20 to-orange-400/20" className="bottom-20 left-20" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/50 supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 p-1 shadow-xl">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
                  <Link2 className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  DonateChain
                </h1>
                <p className="text-xs text-muted-foreground">Transparent Giving</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium bg-white/50 hover:bg-white/80"
                onClick={() => openAuth("select-role")}
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                onClick={() => openAuth("register-donor")}
              >
                Donate Now <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl text-center">
          <Badge className="inline-flex px-4 py-2 mb-8 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200 font-semibold shadow-lg">
            <Shield className="w-4 h-4 mr-1" />
            100% Transparent • Blockchain Verified
          </Badge>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
            Transform Lives
            <br />
            <span className="text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text">One Donation</span>
            <br />
            At A Time
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl md:text-2xl text-gray-600 leading-relaxed">
            Connect donors with communities through secure blockchain donations and verified volunteers. 
            Track every Taka from your wallet to real impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 font-semibold group"
              onClick={() => openAuth("register-donor")}
            >
              Start Donating <span className="group-hover:translate-x-1 transition-transform ml-2">→</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-6 border-white/50 bg-white/30 backdrop-blur-sm hover:bg-white/50 hover:border-white/70 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold"
              onClick={() => openAuth("register-volunteer")}
            >
              Join as Volunteer
            </Button>
          </div>

          {/* Hero Mockup */}
          <div className="relative mx-auto max-w-4xl">
            <div className="relative mx-auto h-96 w-96 lg:h-[500px] lg:w-[350px] bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl p-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl -inset-2 animate-pulse" />
              <div className="relative h-full w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white font-bold text-lg">DonateChain Dashboard</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-100 p-3 rounded-xl">
                      <p className="text-xs text-emerald-800 font-medium">Total Impact</p>
                      <p className="text-2xl font-bold text-emerald-600">৳15,420</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <p className="text-xs text-blue-800 font-medium">Tasks Completed</p>
                      <p className="text-2xl font-bold text-blue-600">23</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-500">Latest Donation</p>
                        <p className="font-semibold text-gray-900">Food for 50 families</p>
                      </div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    New Donation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: stats.totalMonetary, label: "Total Donations", icon: Heart, color: "emerald" },
              { value: stats.totalDonors, label: "Happy Donors", icon: Users, color: "blue" },
              { value: stats.totalVolunteers, label: "Active Volunteers", icon: Shield, color: "purple" },
              { value: stats.totalTasks, label: "Completed Tasks", icon: TrendingUp, color: "indigo" },
            ].map((stat, i) => (
              <GlassCard key={stat.label} className="group hover:scale-105 transition-all duration-500 p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-500 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all`}>
                  <stat.icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  <AnimatedCounter value={stat.value} prefix={stat.label.includes('Total Donations') ? '৳' : ''} />
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <Badge className="inline-flex px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200">
              Everything You Need
            </Badge>
            <h2 className="mt-6 text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Complete Donation Platform
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              From secure payments to volunteer coordination to impact tracking - we handle it all
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Blockchain Security", desc: "Every Taka recorded permanently with cryptographic proof", color: "indigo" },
              { icon: TrendingUp, title: "Real-time Tracking", desc: "Live volunteer location + GPS proof delivery", color: "emerald" },
              { icon: Heart, title: "Smart Matching", desc: "AI-powered donor-volunteer assignment by location", color: "rose" },
              { icon: Star, title: "Feedback System", desc: "Rate volunteers + get verified delivery receipts", color: "amber" },
              { icon: Users, title: "Leaderboards", desc: "Compete for top donor status + badges", color: "blue" },
              { icon: Clock, title: "24/7 Support", desc: "Dedicated admin team + instant chat support", color: "purple" },
            ].map((feature, i) => (
              <GlassCard key={i} className="group hover:scale-[1.02] p-8 cursor-pointer transition-all duration-500 hover:shadow-2xl border-white/50">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-${feature.color}-400 to-${feature.color}-500 shadow-xl group-hover:shadow-2xl group-hover:rotate-3 transition-all duration-500 flex items-center justify-center`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              What People Are Saying
            </h2>
          </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <GlassCard key={i} className="p-10 text-center hover:scale-105 transition-all">
            <div className="flex items-center justify-center mb-6">
              {[...Array(testimonial.rating)].map((_, j) => (
                <Star key={j} className="w-6 h-6 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <blockquote className="text-xl italic text-gray-700 mb-6">
              "{testimonial.quote}"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600">
        <div className="mx-auto max-w-4xl px-6 text-center text-white">
          <h2 className="text-5xl font-black mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands of donors transforming communities
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-12 py-8 bg-white text-indigo-600 hover:bg-gray-100 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
              onClick={() => openAuth("register-donor")}
            >
              Donate Now <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-12 py-8 border-white/50 bg-white/20 backdrop-blur-sm hover:bg-white/40 font-bold"
              onClick={() => openAuth("register-volunteer")}
            >
              Volunteer Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Link2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">DonateChain</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Transparent blockchain donations connecting generous hearts with communities in need.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#about-section" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Impact</a></li>
                <li><a href="#gallery-section" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#contact-section" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Info</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  +880 1700-000000
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  contact@donatechain.org
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  Dhaka, Bangladesh
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm text-gray-400">
            © 2024 DonateChain. All rights reserved. | Transparent Giving Platform
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} mode={authMode} onModeChange={setAuthMode} />
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
