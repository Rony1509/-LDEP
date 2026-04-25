"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertTriangle } from "lucide-react"

function FailContent() {
  const searchParams = useSearchParams()
  const tranId = searchParams.get("tran_id")
  const errorMsg = searchParams.get("message") || "Your payment could not be processed"

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-red-50 border-b">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Payment Failed
          </CardTitle>
          <p className="text-sm text-red-700 mt-2">
            Please check your payment details and try again
          </p>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
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

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <FailContent />
    </Suspense>
  )
}