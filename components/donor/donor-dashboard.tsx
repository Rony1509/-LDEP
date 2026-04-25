"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  DollarSign,
  Package,
  MessageSquare,
  UserCog,
  Shield,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DonorOverview } from "./donor-overview"
import { MonetaryDonation } from "./monetary-donation"
import { PhysicalDonationForm } from "./physical-donation-form"
import { SecurePhysicalDonation } from "@/components/donor/secure-physical-donation"
import { DonorFeedback } from "./donor-feedback"
import { DonorVerifyBlockchain } from "./donor-verify-blockchain"
import { ProfileSettings } from "@/components/profile-settings"

const navItems = [
  { label: "Overview", value: "overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Donate Money", value: "monetary", icon: <DollarSign className="h-4 w-4" /> },
  { label: "Physical Items", value: "physical", icon: <Package className="h-4 w-4" /> },
  { label: "Secure Physical Donation", value: "secure-physical", icon: <Shield className="h-4 w-4" /> },
  { label: "Verify Blockchain", value: "blockchain", icon: <Shield className="h-4 w-4" /> },
  { label: "Feedback", value: "feedback", icon: <MessageSquare className="h-4 w-4" /> },
  { label: "Profile", value: "profile", icon: <UserCog className="h-4 w-4" /> },
]

export function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      roleLabel="Donor"
    >
      {activeTab === "overview" && <DonorOverview />}
      {activeTab === "monetary" && (
        <MonetaryDonation onVerifyBlockchain={() => setActiveTab("blockchain")} />
      )}
      {activeTab === "physical" && <PhysicalDonationForm />}
      {activeTab === "secure-physical" && <SecurePhysicalDonation />}
      {activeTab === "blockchain" && <DonorVerifyBlockchain />}
      {activeTab === "feedback" && <DonorFeedback />}
      {activeTab === "profile" && <ProfileSettings />}
    </DashboardShell>
  )
}