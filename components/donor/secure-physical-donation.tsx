"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { store } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import type { PhysicalDonation } from "@/lib/types"

export function SecurePhysicalDonation() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<PhysicalDonation[]>([])

  const loadDonations = useCallback(async () => {
    if (!user) return
    const data = await store.getDonorPhysicalDonations(user.id)
    console.log("All donations:", data)
    const approved = data.filter((d) => d.status === "approved")
    console.log("Approved donations:", approved)
    setDonations(approved)
  }, [user])

  useEffect(() => {
    loadDonations()
  }, [loadDonations])

  if (!user) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Secure Physical Donation</h1>
        <p className="text-muted-foreground">
          Blockchain-verified approved donations
        </p>
      </div>

      {donations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No approved donations yet. Approved donations will appear here with blockchain data.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {donations.map((d, index) => (
            <Card key={d.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-4 w-4 text-success" />
                    {index + 1} — {d.type}
                  </CardTitle>
                  <Badge className="bg-success text-success-foreground">Approved</Badge>
                </div>
                <CardDescription>Submitted on {new Date(d.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Item Type</p>
                    <p className="text-sm font-medium">{d.type}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Quantity</p>
                    <p className="text-sm font-medium">{d.quantity}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Pickup Location</p>
                    <p className="text-sm font-medium">{d.location}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Description</p>
                    <p className="text-sm font-medium">{d.description || "—"}</p>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Block Number</p>
                    <p className="text-sm font-mono font-medium text-primary">{d.blockNumber ?? "—"}</p>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">TxHash</p>
                    <p className="text-xs font-mono break-all text-primary">{d.txHash ?? "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}