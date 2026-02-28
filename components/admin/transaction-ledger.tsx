"use client"

import { useEffect, useState } from "react"
import { store } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Shield, Link2, CheckCircle, XCircle, Eye } from "lucide-react"
import { toast } from "sonner"
import type { MonetaryDonation } from "@/lib/types"

export function TransactionLedger() {
  const [donations, setDonations] = useState<MonetaryDonation[]>([])
  const [selectedDonation, setSelectedDonation] = useState<MonetaryDonation | null>(null)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [adminNote, setAdminNote] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadDonations()
  }, [])

  async function loadDonations() {
    const data = await store.getMonetaryDonations()
    setDonations(data)
  }

  const pendingDonations = donations.filter(d => d.status === "pending")
  const approvedDonations = donations.filter(d => d.status === "completed")
  const rejectedDonations = donations.filter(d => d.status === "failed")

  async function handleApprove() {
    if (!selectedDonation) return
    setProcessing(true)

    try {
      const response = await fetch(`/api/donations/monetary/${selectedDonation.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: selectedDonation.id,
          adminId: "admin", // In real app, get from auth
          note: adminNote,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve")
      }

      toast.success("Donation approved successfully!")
      setShowVerifyDialog(false)
      setSelectedDonation(null)
      setAdminNote("")
      loadDonations()
    } catch (error) {
      console.error("Approve error:", error)
      toast.error("Failed to approve donation")
    } finally {
      setProcessing(false)
    }
  }

  async function handleReject() {
    if (!selectedDonation) return
    setProcessing(true)

    try {
      const response = await fetch(`/api/donations/monetary/${selectedDonation.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: selectedDonation.id,
          adminId: "admin",
          note: adminNote,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject")
      }

      toast.success("Donation rejected")
      setShowRejectDialog(false)
      setSelectedDonation(null)
      setAdminNote("")
      loadDonations()
    } catch (error) {
      console.error("Reject error:", error)
      toast.error("Failed to reject donation")
    } finally {
      setProcessing(false)
    }
  }

  function openVerifyDialog(donation: MonetaryDonation) {
    setSelectedDonation(donation)
    setShowVerifyDialog(true)
  }

  function openRejectDialog(donation: MonetaryDonation) {
    setSelectedDonation(donation)
    setShowRejectDialog(true)
  }

  function getMethodBadge(method: string) {
    switch (method) {
      case "bkash": return <Badge variant="secondary" className="bg-purple-100 text-purple-700">bKash</Badge>
      case "nagad": return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Nagad</Badge>
      case "bank": return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Bank</Badge>
      default: return <Badge variant="secondary">{method}</Badge>
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending": return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case "completed": return <Badge className="bg-green-100 text-green-700">Approved</Badge>
      case "rejected": return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Donation Management</h1>
        <p className="text-muted-foreground">
          Verify and manage monetary donations
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Shield className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-card-foreground">{pendingDonations.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-card-foreground">{approvedDonations.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-card-foreground">{rejectedDonations.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold text-card-foreground">
                {"৳"}{approvedDonations.reduce((s, d) => s + d.amount, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No donations recorded yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.donorName}</TableCell>
                      <TableCell className="font-mono text-sm">{d.phone}</TableCell>
                      <TableCell className="font-medium text-primary">
                        {"৳"}{d.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getMethodBadge(d.method)}</TableCell>
                      <TableCell className="font-mono text-sm max-w-[150px] truncate">
                        {d.manualTransactionId || d.sslTransactionId || "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(d.status)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(d.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {d.status === "pending" && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => openVerifyDialog(d)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => openRejectDialog(d)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {d.status === "completed" && (
                          <Button size="sm" variant="ghost" className="h-8">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Donation</DialogTitle>
            <DialogDescription>
              Verify this donation by checking the transaction in your payment app
            </DialogDescription>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p><span className="font-medium">Donor:</span> {selectedDonation.donorName}</p>
                <p><span className="font-medium">Amount:</span> ৳{selectedDonation.amount.toLocaleString()}</p>
                <p><span className="font-medium">Method:</span> {selectedDonation.method}</p>
                <p><span className="font-medium">Transaction ID:</span> <span className="font-mono">{selectedDonation.manualTransactionId || selectedDonation.sslTransactionId || "N/A"}</span></p>
                <p><span className="font-medium">Phone:</span> {selectedDonation.phone}</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Note (optional)</label>
                <Input 
                  placeholder="Add a note..." 
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleApprove} 
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? "Processing..." : "Approve Donation"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Donation</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this donation?
            </DialogDescription>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p><span className="font-medium">Donor:</span> {selectedDonation.donorName}</p>
                <p><span className="font-medium">Amount:</span> ৳{selectedDonation.amount.toLocaleString()}</p>
                <p><span className="font-medium">Transaction ID:</span> <span className="font-mono">{selectedDonation.manualTransactionId || selectedDonation.sslTransactionId || "N/A"}</span></p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Reason for rejection</label>
                <Input 
                  placeholder="Enter reason..." 
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleReject} 
                  disabled={processing || !adminNote}
                  variant="destructive"
                >
                  {processing ? "Processing..." : "Reject Donation"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

