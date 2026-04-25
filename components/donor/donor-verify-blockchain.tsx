"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Shield, CheckCircle, Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MonetaryDonation } from "@/lib/types"

export function DonorVerifyBlockchain() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<MonetaryDonation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalBlockNumber, setTotalBlockNumber] = useState(0)
  const [verifiedCount, setVerifiedCount] = useState(0)

  useEffect(() => {
    loadDonations()
  }, [user])

  async function loadDonations() {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/donations/monetary/donor/${user.id}`)

      if (!response.ok) {
        throw new Error("Failed to load donations")
      }

      const data = await response.json()
      const verifiedDonations = data.filter(
        (d: MonetaryDonation) => d.status === "completed" && d.blockNumber
      )

      setDonations(verifiedDonations)
      setTotalBlockNumber(verifiedDonations.length)
      setVerifiedCount(verifiedDonations.length)
    } catch (error) {
      console.error("Load error:", error)
      toast.error("Failed to load blockchain verification data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading blockchain verification data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Verify Blockchain</h1>
        <p className="text-muted-foreground">
          View your verified donations on the blockchain
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{verifiedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total blockchain recorded donations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">#{totalBlockNumber}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total verified donations on blockchain
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Records</CardTitle>
          <CardDescription>
            {donations.length} verified donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No verified donations found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your donations will appear here once verified by admin
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Block #</TableHead>
                    <TableHead className="max-w-xs">TxHash</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">
                        ৳{donation.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {donation.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {donation.sslTransactionId || donation.manualTransactionId || "N/A"}
                      </TableCell>
                      <TableCell className="font-mono">
                        #{donation.blockNumber || "N/A"}
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-xs truncate">
                        {donation.txHash ? (
                          <span title={donation.txHash}>
                            {donation.txHash.substring(0, 16)}...
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            Blockchain Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900">
          <ul className="space-y-2">
            <li>✓ All donations are cryptographically verified on the blockchain</li>
            <li>✓ Transaction hashes ensure authenticity and immutability</li>
            <li>✓ Block numbers provide timestamp verification</li>
            <li>✓ Payment methods are recorded for transparency</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}