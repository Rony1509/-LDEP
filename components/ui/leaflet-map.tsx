"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

const getDefaultIcon = () => {
  if (typeof window === "undefined") return undefined
  const L = require("leaflet")
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

const setMarkerIcon = () => {
  if (typeof window === "undefined") return
  const L = require("leaflet")
  const icon = getDefaultIcon()
  if (icon) L.Marker.prototype.options.icon = icon
}

interface MapMarker {
  id: string
  position: [number, number]
  title: string
  description?: string
}

interface LeafletMapProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  height?: string
  showPopup?: boolean
}

export function LeafletMap({
  markers,
  center = [23.8103, 90.4125],
  zoom = 12,
  height = "400px",
  showPopup = true,
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setMarkerIcon()
  }, [])

  if (!isMounted) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-muted"
        style={{ height }}
      >
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  const mapCenter =
    markers.length > 0 && markers[0].position[0] !== 0
      ? markers[0].position
      : center

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height, width: "100%", borderRadius: "0.5rem" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position}>
          {showPopup && (
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{marker.title}</p>
                {marker.description && (
                  <p className="text-muted-foreground">{marker.description}</p>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  )
}

interface VolunteerMapProps {
  volunteerPosition: [number, number] | null
  donorPosition: [number, number] | null
  volunteerName: string
  donorLocation: string
  height?: string
}

export function VolunteerRouteMap({
  volunteerPosition,
  donorPosition,
  volunteerName,
  donorLocation,
  height = "300px",
}: VolunteerMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setMarkerIcon()
  }, [])

  if (!isMounted) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-muted"
        style={{ height }}
      >
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  const defaultCenter: [number, number] = [23.8103, 90.4125]
  const volunteerPos = volunteerPosition || defaultCenter
  const donorPos = donorPosition || defaultCenter

  const mapCenter: [number, number] = [
    (volunteerPos[0] + donorPos[0]) / 2,
    (volunteerPos[1] + donorPos[1]) / 2,
  ]

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height, width: "100%", borderRadius: "0.5rem" }}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {volunteerPosition && (
        <Marker position={volunteerPosition}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Volunteer: {volunteerName}</p>
              <p className="text-muted-foreground">Current Location</p>
            </div>
          </Popup>
        </Marker>
      )}
      {donorPosition && (
        <Marker position={donorPosition}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Pickup Location</p>
              <p className="text-muted-foreground">{donorLocation}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}