"use client"

import { useState } from "react"
import { LayoutDashboard, ClipboardList, UserCog, MapPin, Upload } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { VolunteerOverview } from "./volunteer-overview"
import { VolunteerTasks } from "./volunteer-tasks"
import { VolunteerMyLocation } from "./volunteer-my-location"
import { VolunteerUploadProof } from "./volunteer-upload-proof"
import { ProfileSettings } from "@/components/profile-settings"

const navItems = [
  { label: "Overview", value: "overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "My Tasks", value: "tasks", icon: <ClipboardList className="h-4 w-4" /> },
  
  { label: "Profile", value: "profile", icon: <UserCog className="h-4 w-4" /> },
]

export function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      roleLabel="Volunteer"
    >
      {activeTab === "overview" && <VolunteerOverview />}
      {activeTab === "tasks" && <VolunteerTasks />}
      {activeTab === "location" && <VolunteerMyLocation />}
      {activeTab === "proof" && <VolunteerUploadProof />}
      {activeTab === "profile" && <ProfileSettings />}
    </DashboardShell>
  )
}
