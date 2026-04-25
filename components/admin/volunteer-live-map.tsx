"use client"

import { useState, useEffect, useCallback } from "react"
import { store } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, MapPin, Navigation, Package, User } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import for Leaflet to avoid SSR issues
const LeafletMap = dynamic(
  () => import("@/components/ui/leaflet-map").then((mod) => mod.LeafletMap),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }
)

interface VolunteerLocation {
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
  updatedAt: string
}

export function VolunteerLiveMap() {
  const [locations, setLocations] = useState<VolunteerLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerLocation | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadLocations = useCallback(async () => {
    setLoading(true)
    const data = await store.getActiveVolunteerLocations()
    setLocations(data)
    setLastUpdated(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadLocations()
  }, [loadLocations])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      if (!document.hidden) loadLocations()
    }, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh, loadLocations])

  function formatTime(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleTimeString()
  }

  function calculateETA(distanceKm: number | null) {
    if (!distanceKm) return "Unknown"
    const minutes = Math.round((distanceKm / 30) * 60)
    if (minutes < 1) return "Arriving soon"
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Get selected volunteer route markers
  const selectedMarkers = selectedVolunteer && selectedVolunteer.volunteerLatitude && selectedVolunteer.volunteerLongitude
    ? [{
        id: selectedVolunteer.taskId,
        position: [selectedVolunteer.volunteerLatitude, selectedVolunteer.volunteerLongitude] as [number, number],
        title: selectedVolunteer.volunteerName,
        description: "Volunteer Location"
      }]
    : []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Volunteer Map</h1>
          <p className="text-muted-foreground">
            Monitor active volunteer locations using OpenStreetMap
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            Auto-refresh: {autoRefresh ? "On" : "Off"}
          </Button>
          <Button variant="outline" size="icon" onClick={loadLocations} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Volunteer List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Active Volunteers ({locations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-4 text-center text-muted-foreground">Loading...</p>
            ) : locations.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                No active volunteers with location tracking
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc.taskId}
                    type="button"
                    onClick={() => setSelectedVolunteer(loc)}
                    className={`flex items-start justify-between rounded-lg border p-3 text-left transition-colors ${
                      selectedVolunteer?.taskId === loc.taskId
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{loc.volunteerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-3 w-3" />
                        {loc.donationType}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {loc.donorName}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className="bg-chart-3/20 text-foreground">Active</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(loc.updatedAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map View - Leaflet */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Map View</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVolunteer ? (
              <div className="flex flex-col gap-4">
                {/* Leaflet Map */}
                <div className="overflow-hidden rounded-lg">
                  {selectedMarkers.length > 0 ? (
                    <LeafletMap 
                      markers={selectedMarkers}
                      height="300px"
                    />
                  ) : (
                    <div className="flex h-[300px] items-center justify-center rounded-lg bg-muted">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="mx-auto h-12 w-12" />
                        <p className="mt-2">Location data not available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Volunteer Details */}
                <div className="rounded-lg border border-border p-4">
                  <h3 className="font-semibold text-foreground">
                    {selectedVolunteer.volunteerName}
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Donation Type:</span>
                      <span className="ml-2 font-medium">{selectedVolunteer.donationType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Donor:</span>
                      <span className="ml-2 font-medium">{selectedVolunteer.donorName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pickup Address:</span>
                      <span className="ml-2 font-medium">{selectedVolunteer.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Volunteer Location:</span>
                      <span className="ml-2 font-medium">
                        {selectedVolunteer.volunteerLatitude?.toFixed(4)},{" "}
                        {selectedVolunteer.volunteerLongitude?.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Navigate Button */}
                  <Button 
                    className="mt-4 w-full" 
                    variant="outline"
                    onClick={() => {
                      if (selectedVolunteer.donorLatitude && selectedVolunteer.donorLongitude) {
                        const url = `https://www.openstreetmap.org/directions?engine=graphhopper_foot&route=${selectedVolunteer.volunteerLatitude}%2C${selectedVolunteer.volunteerLongitude}%3B${selectedVolunteer.donorLatitude}%2C${selectedVolunteer.donorLongitude}`
                        window.open(url, '_blank')
                      }
                    }}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Open in OpenStreetMap
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
                <div className="text-center text-muted-foreground">
                  <MapPin className="mx-auto h-12 w-12" />
                  <p className="mt-2">Select a volunteer to view on map</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to enable live tracking</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>1. Volunteers must enable location tracking in their "My Location" tab</p>
          <p>2. Volunteers must have an active "In Progress" task</p>
          <p>3. Location updates every 30 seconds when tracking is enabled</p>
          <p>4. Using OpenStreetMap - no API key required!</p>
        </CardContent>
      </Card>
    </div>
  )
}
