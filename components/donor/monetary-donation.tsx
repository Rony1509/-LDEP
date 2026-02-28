"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Shield, CheckCircle, Link2, Loader2, Phone, Building2, Copy } from "lucide-react"
import { paymentConfig } from "@/lib/payment-config"

type Step = "form" | "instructions" | "submit" | "processing" | "success" | "failed"

interface ReceiptData {
  txHash: string
  blockNumber: number
  amount: number
  timestamp: string
  method: string
  tranId: string
  status: string
}

export function MonetaryDonation() {
  const { user } = useAuth()
  const [step, setStep] = useState<Step>("form")
  const [method, setMethod] = useState<"bkash" | "nagad" | "bank">("bkash")
  const [amount, setAmount] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Set email from user when available
  useEffect(() => {
    if (user) {
      setEmail(user.email || "")
    }
  }, [user])

  if (!user) {
    return null
  }

  const userEmail = user.email || ""
  const userId = user.id
  const userName = user.name

  // Get current payment config
  const currentConfig = method === "bank" ? paymentConfig.bank : method === "nagad" ? paymentConfig.nagad : paymentConfig.bkash

  function handleMethodSelect(selectedMethod: "bkash" | "nagad" | "bank") {
    setMethod(selectedMethod)
  }

  function handleProceedToPayment() {
    if (!amount || !phone) {
      toast.error("Please fill in amount and phone number.")
      return
    }
    if (Number(amount) < 10) {
      toast.error("Minimum donation amount is ৳10")
      return
    }
    setStep("instructions")
  }

  async function handleSubmitTransaction(e: React.FormEvent) {
    e.preventDefault()
    if (!transactionId || transactionId.length < 5) {
      toast.error("Please enter a valid transaction ID")
      return
    }

    setStep("processing")

    try {
      const response = await fetch("/api/donations/manual-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donorId: userId,
          donorName: userName,
          email: email || userEmail,
          phone,
          amount: Number.parseFloat(amount),
          method,
          transactionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit donation")
      }

      if (data.success && data.donation) {
        setReceipt({
          txHash: data.donation.txHash,
          blockNumber: data.donation.blockNumber,
          amount: data.donation.amount,
          timestamp: data.donation.timestamp || new Date().toISOString(),
          method: data.donation.method,
          tranId: data.donation.transactionId,
          status: data.donation.status,
        })
        setStep("success")
        toast.success("Donation submitted! Waiting for admin verification.")
      } else {
        throw new Error(data.error || "Failed to submit donation")
      }
    } catch (err) {
      console.error("Submission error:", err)
      setError(err instanceof Error ? err.message : "Failed to submit donation")
      setStep("failed")
      toast.error("Failed to submit donation. Please try again.")
    }
  }

  function handleReset() {
    setStep("form")
    setAmount("")
    setPhone("")
    setTransactionId("")
    setReceipt(null)
    setError(null)
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Make a Donation</h1>
        <p className="text-muted-foreground">
          Send money manually and submit transaction ID for verification
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Choose your payment method and enter the amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "form" && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={method}
                    onValueChange={(v) => handleMethodSelect(v as "bkash" | "nagad" | "bank")}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="bkash" id="bkash" />
                      <Label htmlFor="bkash" className="cursor-pointer font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" /> bKash
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="nagad" id="nagad" />
                      <Label htmlFor="nagad" className="cursor-pointer font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Nagad
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="cursor-pointer font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Bank Transfer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="donation-amount">Amount (BDT)</Label>
                  <Input
                    id="donation-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="10"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="donation-phone">Your Phone Number</Label>
                  <Input
                    id="donation-phone"
                    placeholder="+880-1XXX-XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="donation-email">Email (Optional)</Label>
                  <Input
                    id="donation-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button onClick={handleProceedToPayment} className="w-full">
                  Proceed to Payment
                </Button>
              </div>
            )}

            {step === "instructions" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                  <h3 className="font-semibold mb-2">Send Money To:</h3>
                  {method === "bank" ? (
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Bank:</span> <strong>{currentConfig.bankName}</strong></p>
                      <p><span className="text-muted-foreground">Account:</span> <strong>{currentConfig.accountNumber}</strong></p>
                      <p><span className="text-muted-foreground">Name:</span> <strong>{currentConfig.accountName}</strong></p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Number:</span>
                      <strong className="text-lg">{currentConfig.phoneNumber}</strong>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(currentConfig.phoneNumber || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                  <p className="font-medium text-yellow-800">Amount to send: <span className="text-2xl">৳{Number(amount).toLocaleString()}</span></p>
                  <p className="text-sm text-yellow-700 mt-1">Send exactly this amount to avoid issues</p>
                </div>

                <p className="text-sm text-muted-foreground">{currentConfig.instructions}</p>

                <form onSubmit={(e) => { e.preventDefault(); setStep("submit"); }} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="transaction-id">Transaction ID</Label>
                    <Input
                      id="transaction-id"
                      placeholder="Enter transaction ID from your app"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Find this in your {method === "bank" ? "bank app" : `${method} app`} after sending money
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={transactionId.length < 5}>
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === "submit" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800">Confirm Your Donation</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Amount:</span> <strong>৳{Number(amount).toLocaleString()}</strong></p>
                    <p><span className="text-muted-foreground">Method:</span> <strong>{currentConfig.displayName}</strong></p>
                    <p><span className="text-muted-foreground">Transaction ID:</span> <strong className="font-mono">{transactionId}</strong></p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("instructions")} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleSubmitTransaction} className="flex-1">
                    Confirm & Submit
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
            <CardDescription>
              Manual payment verification process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { step: "1", label: "Choose payment method (bKash/Nagad/Bank)" },
                { step: "2", label: "Send money to admin's account" },
                { step: "3", label: "Copy transaction ID from your app" },
                { step: "4", label: "Submit transaction ID on this page" },
                { step: "5", label: "Admin verifies manually" },
                { step: "6", label: "Donation recorded on blockchain" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {s.step}
                  </div>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Dialog */}
      <Dialog open={step === "processing"}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting Donation
            </DialogTitle>
            <DialogDescription>
              Please wait while we process your submission
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-medium text-foreground">Recording on Blockchain</p>
            <p className="text-sm text-muted-foreground">
              Do not close this window...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Failed Dialog */}
      <Dialog open={step === "failed"} onOpenChange={(open) => {
        if (!open) {
          handleReset()
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              Submission Failed
            </DialogTitle>
            <DialogDescription>
              {error || "There was an issue submitting your donation"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Please try again or contact support.
            </p>
            <Button onClick={handleReset} className="w-full">
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={step === "success"} onOpenChange={(open) => {
        if (!open) {
          handleReset()
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-yellow-600" />
              Donation Submitted
            </DialogTitle>
            <DialogDescription>
              Your donation is pending verification by admin
            </DialogDescription>
          </DialogHeader>
          {receipt && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-bold text-primary">
                      {"৳"}{receipt.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Method</span>
                    <Badge variant="secondary">
                      {receipt.method}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-sm">{receipt.tranId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Pending Verification
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{"Block #"}</span>
                    <span className="font-mono text-sm">#{receipt.blockNumber}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Tx Hash</span>
                    <span className="break-all font-mono text-xs text-foreground">
                      {receipt.txHash}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⏳ Your donation is waiting for admin verification. You will be notified once approved.
                </p>
              </div>
              <Button onClick={handleReset} className="w-full">
                Make Another Donation
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

