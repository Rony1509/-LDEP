"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Shield, Copy, Loader2, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MonetaryDonation } from "@/lib/types"

export function AdminBlockchainVerification() {
  const [donations, setDonations] = useState<MonetaryDonation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<MonetaryDonation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchField, setSearchField] = useState<"donor" | "phone" | "txhash">("donor")
  const [loading, setLoading] = useState(true)
  const [totalBlockNumber, setTotalBlockNumber] = useState(0)
  const [verifiedCount, setVerifiedCount] = useState(0)

  useEffect(() => {
    loadBlockchainRecords()
  }, [])

  useEffect(() => {
    // Filter donations based on search term and field
    if (!searchTerm.trim()) {
      setFilteredDonations(donations)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredDonations(
        donations.filter((d) => {
          switch (searchField) {
            case "donor":
              return d.donorName.toLowerCase().includes(term)
            case "phone":
              return d.phone.toLowerCase().includes(term)
            case "txhash":
              return d.txHash?.toLowerCase().includes(term)
            default:
              return true
          }
        })
      )
    }
  }, [searchTerm, searchField, donations])

  async function loadBlockchainRecords() {
    try {
      setLoading(true)
      const response = await fetch("/api/donations/monetary")

      if (!response.ok) {
        throw new Error("Failed to load donations")
      }

      const data = await response.json()
      const verifiedDonations = data.filter(
        (d: MonetaryDonation) => d.status === "completed" && d.blockNumber && d.txHash
      )

      setDonations(verifiedDonations)
      setFilteredDonations(verifiedDonations)

      // Calculate stats
      setTotalBlockNumber(verifiedDonations.length)

      setVerifiedCount(verifiedDonations.length)
    } catch (error) {
      console.error("Load error:", error)
      toast.error("Failed to load blockchain records")
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  function getMethodBadge(method: string) {
    switch (method) {
      case "bkash":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">bKash</Badge>
      case "nagad":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Nagad</Badge>
      case "bank":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Bank</Badge>
      case "sslcommerz":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">SSLCommerz</Badge>
      default:
        return <Badge variant="secondary">{method}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading blockchain records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Blockchain Verification</h1>
        <p className="text-muted-foreground">
          Manage and verify blockchain-recorded donations
        </p>
      </div>

      {/* Stats Cards */}
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
              Total Block Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">#{totalBlockNumber}</div>

            <p className="text-xs text-muted-foreground mt-1">
  Total verified monetary donations on blockchain
</p>

          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Records</CardTitle>
          <CardDescription>
            Search verified blockchain donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {(["donor", "phone", "txhash"] as const).map((field) => (
                <Button
                  key={field}
                  variant={searchField === field ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchField(field)}
                  className="capitalize"
                >
                  {field === "txhash" ? "TxHash" : field}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search by ${searchField}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verified Records</CardTitle>
          <CardDescription>
            {filteredDonations.length} of {donations.length} verified donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDonations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">
                No verified blockchain records found
              </p>
              {searchTerm && (
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search criteria
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Block #</TableHead>
                    <TableHead className="max-w-xs">TxHash</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">
                        {donation.donorName}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {donation.phone}
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        ৳{donation.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getMethodBadge(donation.method)}
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
                        <Badge className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(donation.txHash || "")}
                          disabled={!donation.txHash}
                          title="Copy TxHash to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            About Blockchain Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900">
          <ul className="space-y-2">
            <li>✓ All verified donations are recorded on the blockchain</li>
            <li>✓ Each donation receives a unique Transaction Hash (TxHash)</li>
            <li>✓ Block numbers provide immutable timestamp verification</li>
            <li>✓ Payment methods are permanently recorded for transparency</li>
            <li>✓ Donors can verify their donations using the TxHash</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
