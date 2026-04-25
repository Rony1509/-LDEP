"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"

function CancelContent() {
  const searchParams = useSearchParams()
  const tranId = searchParams.get("tran_id")

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-yellow-50 border-b">
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            Payment Cancelled
          </CardTitle>
          <p className="text-sm text-yellow-700 mt-2">
            You have cancelled the payment process
          </p>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Your donation was not completed. You can try again anytime.
          </p>
          {tranId && (
            <div className="bg-muted p-3 rounded text-xs font-mono">
              <p className="text-muted-foreground">Transaction ID: {tranId}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Link href="/">
              <Button className="w-full">Return to Dashboard</Button>
            </Link>
            <Link href="/?tab=monetary">
              <Button variant="outline" className="w-full">
                Try Again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CancelContent />
    </Suspense>
  )
}