import { Metadata } from "next"
import ImpactDashboard from "./impact-dashboard"

export const metadata: Metadata = {
  title: "Impact Dashboard | DonateChain",
  description: "See the impact of donations across Bangladesh - transparent, blockchain-verified giving",
}

export default function ImpactPage() {
  return <ImpactDashboard />
}

