"use client"

import { Suspense, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Copy, Shield, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DonationData {
  id: string
  amount: number
  txHash: string
  blockNumber: number
  tranId: string
  status: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const [donationData, setDonationData] = useState<DonationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const encodedData = searchParams.get("data")
      if (encodedData) {
        const decodedData = JSON.parse(Buffer.from(encodedData, "base64").toString("utf-8"))
        setDonationData(decodedData)
      }
    } catch (error) {
      console.error("Failed to decode donation data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading donation receipt...</p>
        </div>
      </div>
    )
  }

  if (!donationData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              ⚠️ No Donation Data
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Could not retrieve donation details. Your payment may have been processed.
            </p>
            <Link href="/">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Payment Successful!
          </CardTitle>
          <p className="text-sm text-green-700 mt-2">
            Your donation has been recorded on the blockchain
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-border bg-muted/50 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Donation Receipt
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Amount Donated</span>
                  <span className="font-bold text-lg text-primary">৳{donationData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <Badge className="bg-blue-100 text-blue-800">SSLCommerz</Badge>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{donationData.tranId}</span>
                    <button
                      onClick={() => copyToClipboard(donationData.tranId, "Transaction ID")}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Block Number</span>
                  <span className="font-mono text-sm font-bold text-blue-600">#{donationData.blockNumber}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">Blockchain TxHash</span>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-slate-100 p-3 rounded font-mono text-xs break-all">
                      {donationData.txHash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(donationData.txHash, "TX Hash")}
                      className="p-2 hover:bg-muted rounded flex-shrink-0"
                    >
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> You can verify your donation on the blockchain at any time using the "Verify Blockchain" tab in your donor dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}