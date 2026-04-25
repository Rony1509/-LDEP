"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { store } from "@/lib/store"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Package, Clock, User, Truck } from "lucide-react"
import dynamic from "next/dynamic"
import type { Task } from "@/lib/types"

// Dynamic import for Leaflet to avoid SSR issues
const LeafletMap = dynamic(
  () => import("@/components/ui/leaflet-map").then((mod) => mod.LeafletMap),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[200px] items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }
)

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

interface TaskLocation {
  taskId: string
  volunteerId: string
  volunteerName: string
  donationType: string
  donorName: string
  location: string
  volunteerLatitude: number | null
  volunteerLongitude: number | null
  donorLatitude: number | null
  donorLongitude: number | null
  status: string
  distanceKm: number | null
  updatedAt: string
}

export function DonorTrackPickup() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskLocations, setTaskLocations] = useState<Map<string, TaskLocation>>(new Map())
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const loadTasks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const data = await store.getDonorTasks(user.id)
    setTasks(data)
    setLoading(false)
  }, [user])

  const loadTaskLocations = useCallback(async () => {
    if (!user) return
    const activeTasks = tasks.filter((t) => t.status === "in-progress")
    const locationMap = new Map<string, TaskLocation>()
    
    for (const task of activeTasks) {
      const location = await store.getTaskLocation(task.id)
      if (location) {
        locationMap.set(task.id, location)
      }
    }
    
    setTaskLocations(locationMap)
  }, [tasks, user])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    if (tasks.length === 0) return
    loadTaskLocations()
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      if (!document.hidden) loadTaskLocations()
    }, 30000)
    return () => clearInterval(interval)
  }, [tasks, loadTaskLocations])

  function calculateETA(distanceKm: number | null) {
    if (!distanceKm) return "Unknown"
    const minutes = Math.round((distanceKm / 30) * 60)
    if (minutes < 1) return "Arriving soon"
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  function openOSMNavigation(location: TaskLocation) {
    // Check if we have donor coordinates for navigation
    const hasDonorCoords = location.donorLatitude && location.donorLongitude
    const hasVolunteerCoords = location.volunteerLatitude && location.volunteerLongitude

    // If we have donor coordinates, use OpenStreetMap for navigation
    if (hasDonorCoords) {
      // Try OpenStreetMap first
      if (hasVolunteerCoords) {
        // Route from volunteer to donor
        const osmUrl = `https://www.openstreetmap.org/directions?engine=graphhopper_foot&route=${location.volunteerLatitude}%2C${location.volunteerLongitude}%3B${location.donorLatitude}%2C${location.donorLongitude}`
        window.open(osmUrl, '_blank')
      } else {
        // Just show destination on map
        const osmUrl = `https://www.openstreetmap.org/?mlat=${location.donorLatitude}&mlon=${location.donorLongitude}#map=15/${location.donorLatitude}/${location.donorLongitude}`
        window.open(osmUrl, '_blank')
      }
    } else if (location.location) {
      // Fallback to Google Maps with address/location name
      const encodedLocation = encodeURIComponent(location.location)
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
      window.open(googleMapsUrl, '_blank')
      toast.info("Opened Google Maps with pickup location")
    } else {
      // No coordinates and no location - show error
      toast.error("Pickup location not available. Please contact support.")
    }
  }

  if (!user) return null

  const activeTasks = tasks.filter((t) => t.status === "in-progress")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Track My Pickup</h1>
        <p className="text-muted-foreground">
          Track your donation pickup in real-time using OpenStreetMap
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      ) : activeTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No active pickups. Create a physical donation to see tracking here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {activeTasks.map((task) => {
            const location = taskLocations.get(task.id)
            // Calculate distance when we have donor coordinates
            const distance = location?.donorLatitude && location?.donorLongitude
              ? calculateDistance(
                  location.donorLatitude, 
                  location.donorLongitude, 
                  location.volunteerLatitude || location.donorLatitude, 
                  location.volunteerLongitude || location.donorLongitude
                )
              : null
            const eta = calculateETA(distance)
            
            return (
              <Card key={task.id} className={selectedTask?.id === task.id ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {task.donationType}
                    </span>
                    <Badge className="bg-chart-3/20 text-foreground">In Progress</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {/* Pickup Info */}
                  <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{task.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Volunteer: {location?.volunteerName || "Assigning..."}</span>
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {location && (location.volunteerLatitude || location.donorLatitude) ? (
                    <div className="flex flex-col gap-3">
                      {/* Leaflet Map */}
                      <div className="overflow-hidden rounded-lg">
                        <LeafletMap 
                          markers={[
                            ...(location.volunteerLatitude && location.volunteerLongitude ? [{
                              id: "volunteer",
                              position: [location.volunteerLatitude, location.volunteerLongitude] as [number, number],
                              title: "Volunteer",
                              description: location.volunteerName
                            }] : []),
                            ...(location.donorLatitude && location.donorLongitude ? [{
                              id: "donor",
                              position: [location.donorLatitude, location.donorLongitude] as [number, number],
                              title: "Pickup Location",
                              description: task.location
                            }] : [])
                          ]}
                          height="200px"
                        />
                      </div>

                      {/* Distance & ETA */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-border p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            Distance
                          </div>
                          <div className="mt-1 text-xl font-bold text-foreground">
                            {distance !== null && location.volunteerLatitude 
                              ? `${distance.toFixed(1)} km` 
                              : location?.donorLatitude 
                                ? "Tracking..." 
                                : "N/A"}
                          </div>
                        </div>
                        <div className="rounded-lg border border-border p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            ETA
                          </div>
                          <div className="mt-1 text-xl font-bold text-foreground">
                            {eta}
                          </div>
                        </div>
                      </div>

                      {/* Map Button */}
                      <Button onClick={() => openOSMNavigation(location)} variant="outline">
                        <Navigation className="mr-2 h-4 w-4" />
                        Navigate to Pickup
                      </Button>

                      {/* Last Updated */}
                      <p className="text-xs text-muted-foreground text-center">
                        Last updated: {new Date(location.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <Truck className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Volunteer is on the way
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Location tracking will appear once volunteer starts
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How tracking works</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>1. Once a volunteer accepts your donation pickup, tracking will begin</p>
          <p>2. You can see the volunteer's distance and estimated arrival time</p>
          <p>3. Tap "Navigate" to open directions to the pickup location</p>
          <p>4. Tracking updates every 30 seconds</p>
          <p>5. Using OpenStreetMap - no API key required!</p>
        </CardContent>
      </Card>
    </div>
  )
}
