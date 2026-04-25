"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { SSLCommerzPaymentForm } from "./sslcommerz-payment-form"

interface MonetaryDonationProps {
  onVerifyBlockchain?: () => void
}

export function MonetaryDonation({ onVerifyBlockchain }: MonetaryDonationProps) {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Make a Donation</h1>
        <p className="text-muted-foreground">
          Secure payment through SSLCommerz gateway
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SSLCommerzPaymentForm
            userId={user.id}
            userName={user.name}
            userEmail={user.email || ""}
            onSuccess={() => {}}
            onVerifyBlockchain={onVerifyBlockchain}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              How SSLCommerz Works
            </CardTitle>
            <CardDescription>
              Secure online payment process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { step: "1", label: "Enter donation amount and phone number" },
                { step: "2", label: "Click 'Donate Now' button" },
                { step: "3", label: "Choose your payment method" },
                { step: "4", label: "Enter OTP from your payment app" },
                { step: "5", label: "Payment is instantly verified" },
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
    </div>
  )
}