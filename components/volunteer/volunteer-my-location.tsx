"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { store } from "@/lib/store"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Loader2 } from "lucide-react"

export function VolunteerMyLocation() {
  const { user } = useAuth()
  const [isTracking, setIsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const userRef = useRef(user)
  userRef.current = user

  // Load tracking state from localStorage on mount
  useEffect(() => {
    const storedTracking = localStorage.getItem("volunteer_tracking_enabled")
    if (storedTracking === "true" && userRef.current) {
      // Restore tracking if it was enabled before
      setIsTracking(true)
    }
  }, [])

  const getLocation = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return Promise.resolve(null)
    }

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          let errorMessage = "Unable to get location"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
          }
          setLocationError(errorMessage)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }, [])

  const sendLocation = useCallback(
    async (lat: number, lng: number) => {
      const currentUser = userRef.current
      if (!currentUser) return
      try {
        await store.updateVolunteerLocation(currentUser.id, lat, lng)
      } catch (error) {
        console.error("Failed to send location:", error)
      }
    },
    []
  )

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTracking && userRef.current) {
      // Get initial location
      getLocation().then((location) => {
        if (location) {
          setCurrentLocation(location)
          sendLocation(location.lat, location.lng)
        }
      })

      // Set up interval for 30 seconds
      interval = setInterval(async () => {
        if (document.hidden) return
        const location = await getLocation()
        if (location) {
          setCurrentLocation(location)
          sendLocation(location.lat, location.lng)
        }
      }, 30000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTracking, getLocation, sendLocation])

  const handleToggleTracking = async () => {
    if (!isTracking) {
      // Starting tracking
      setLoading(true)
      setLocationError(null)
      try {
        const location = await getLocation()
        if (location) {
          setCurrentLocation(location)
          if (userRef.current) {
            const result = await store.updateVolunteerLocation(userRef.current.id, location.lat, location.lng)
            if (result.success) {
              setIsTracking(true)
              // Save to localStorage so tracking persists across navigation/logout
              localStorage.setItem("volunteer_tracking_enabled", "true")
              toast.success("Location tracking started")
            } else {
              toast.error(result.error || "Failed to start tracking")
            }
          }
        }
      } catch {
        // Error already handled in getLocation
      } finally {
        setLoading(false)
      }
    } else {
      // Stopping tracking
      setIsTracking(false)
      setCurrentLocation(null)
      // Remove from localStorage
      localStorage.removeItem("volunteer_tracking_enabled")
      toast.success("Location tracking stopped")
    }
  }

  if (!user) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Location</h1>
        <p className="text-muted-foreground">
          Manage your real-time location sharing with admins
        </p>
      </div>

      {/* Tracking Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Location Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="tracking-toggle" className="text-base font-medium">
                Start Tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                {isTracking
                  ? "Your location is being shared with admins every 30 seconds"
                  : "Turn on to share your location during active tasks"}
              </p>
            </div>
            <Switch
              id="tracking-toggle"
              checked={isTracking}
              onCheckedChange={handleToggleTracking}
              disabled={loading}
            />
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting your location...
            </div>
          )}

          {locationError && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {locationError}
            </div>
          )}

          {currentLocation && isTracking && (
            <div className="rounded-lg bg-success/10 p-3">
              <div className="flex items-center gap-2 text-sm text-success">
                <MapPin className="h-4 w-4" />
                <span>
                  Current: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>1. Turn on tracking when you start a task</p>
          <p>2. Your location is automatically sent every 30 seconds</p>
          <p>3. Admins can see your real-time location on their map</p>
          <p>4. Donors can track your distance and ETA</p>
          <p>5. Turn off tracking when the task is complete</p>
        </CardContent>
      </Card>
    </div>
  )
}
