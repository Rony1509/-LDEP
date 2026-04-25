"use client"

import { useState, useEffect } from "react"
import { store } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, MapPin, TrendingUp, ArrowRight, Link2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Animated Counter Component
function AnimatedCounter({ value, prefix = "৳", suffix = "", duration = 2000 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>
}

interface StatsData {
  totalDonors: number
  totalVolunteers: number
  totalMonetary: number
  totalPhysicalDonations: number
  completedTasks: number
}

interface ChartData {
  trends: { month: string; monetary: number; physical: number; donors: number }[]
  areas: { name: string; value: number; count: number }[]
  volunteerPerformance: { name: string; tasks: number }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function ImpactDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalDonors: 0,
    totalVolunteers: 0,
    totalMonetary: 0,
    totalPhysicalDonations: 0,
    completedTasks: 0,
  })
  const [chartData, setChartData] = useState<ChartData>({
    trends: [],
    areas: [],
    volunteerPerformance: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, chartStats] = await Promise.all([
          store.getStats(),
          store.getChartStats(),
        ])
        
        setStats({
          totalDonors: statsData.totalDonors || 0,
          totalVolunteers: statsData.totalVolunteers || 0,
          totalMonetary: statsData.totalMonetary || 0,
          totalPhysicalDonations: statsData.totalPhysicalDonations || 0,
          completedTasks: statsData.completedTasks || 0,
        })
        
        setChartData({
          trends: chartStats.trends || [],
          areas: chartStats.areas || [],
          volunteerPerformance: chartStats.volunteerPerformance || [],
        })
      } catch (error) {
        console.error("Failed to load impact data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calculate total lives impacted
  const totalLivesImpacted = Math.floor(stats.totalMonetary / 500) + stats.totalPhysicalDonations + stats.completedTasks

  // Area data with percentages
  const totalAreaDonations = chartData.areas.reduce((sum, a) => sum + a.value, 0)
  const areaDataWithPercentage = chartData.areas.map(a => ({
    ...a,
    percentage: totalAreaDonations > 0 ? Math.round((a.value / totalAreaDonations) * 100) : 0
  }))

  // Top donors area
  const topAreas = areaDataWithPercentage.slice(0, 6)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading impact data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DonateChain</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <a href="/">Home</a>
            </Button>
            <Button asChild>
              <a href="/">
                Start Donating
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Our <span className="text-primary">Impact</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              See how your donations are making a real difference in communities across Bangladesh.
              Every transaction is transparent and blockchain-verified.
            </p>
          </div>
        </div>
      </section>

      {/* Live Stats Counter */}
      <section className="border-y border-border bg-card py-12 -mt-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Raised</span>
              </div>
              <div className="mt-2 text-4xl font-bold text-primary">
                <AnimatedCounter value={stats.totalMonetary} />
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-chart-3" />
                <span className="text-sm font-medium text-muted-foreground">Lives Impacted</span>
              </div>
              <div className="mt-2 text-4xl font-bold text-chart-3">
                <AnimatedCounter value={totalLivesImpacted} prefix="" suffix="+" />
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Active Donors</span>
              </div>
              <div className="mt-2 text-4xl font-bold text-accent">
                <AnimatedCounter value={stats.totalDonors} prefix="" />
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Volunteers</span>
              </div>
              <div className="mt-2 text-4xl font-bold text-primary">
                <AnimatedCounter value={stats.totalVolunteers} prefix="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Donation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.trends}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`৳${value.toLocaleString()}`, "Amount"]}
                      />
                      <Bar dataKey="monetary" fill="#0088FE" radius={[4, 4, 0, 0]} name="Monetary" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Area Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Donations by Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topAreas}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {topAreas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value} items`, "Quantity"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Areas List */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Top Contributing Areas</h2>
            <p className="mt-4 text-muted-foreground">
              See which areas are leading in charitable giving
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topAreas.map((area, index) => (
              <Card key={area.name} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-lg text-white font-bold"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{area.name}</p>
                      <p className="text-sm text-muted-foreground">{area.count} donations</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{area.percentage}%</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${area.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {topAreas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No donation data available yet. Be the first to contribute!</p>
            </div>
          )}
        </div>
      </section>

      {/* Volunteer Performance */}
      {chartData.volunteerPerformance.length > 0 && (
        <section className="border-t border-border py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Top Volunteers</h2>
              <p className="mt-4 text-muted-foreground">
                Recognizing our most active volunteers who make it all possible
              </p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.volunteerPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value} tasks`, "Completed"]}
                      />
                      <Bar dataKey="tasks" fill="#00C49F" radius={[0, 4, 4, 0]} name="Tasks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-border bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Join the Movement</h2>
            <p className="mt-4 text-muted-foreground">
              Every contribution makes a difference. Join thousands of donors who are 
              creating positive change in communities across Bangladesh.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <a href="/">
                  Make a Donation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/">
                  Become a Volunteer
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">DonateChain</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Secure and transparent donation platform
          </p>
        </div>
      </footer>
    </div>
  )
}

