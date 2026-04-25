import { NextRequest, NextResponse } from "next/server"
import { generateCertificateBase64 } from "@/lib/certificate-generator"
import connectDB from "@/lib/mongodb"
import MonetaryDonation from "@/server/models/MonetaryDonation"
import PhysicalDonation from "@/server/models/PhysicalDonation"

export async function POST(request: NextRequest) {
  try {
    const { donationId, donationType } = await request.json()

    await connectDB()

    let donation
    let certificateData

    if (donationType === "monetary") {
      donation = await MonetaryDonation.findById(donationId)
      if (!donation) {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 })
      }

      certificateData = {
        donorName: donation.donorName,
        donorEmail: "",
        amount: donation.amount,
        donationType: "monetary" as const,
        txHash: donation.txHash || `tx-${donation._id}`,
        donationId: donation._id.toString(),
        date: new Date(donation.timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        beneficiaryCount: Math.max(1, Math.floor(donation.amount / 500)),
      }
    } else {
      donation = await PhysicalDonation.findById(donationId)
      if (!donation) {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 })
      }

      certificateData = {
        donorName: donation.donorName,
        donorEmail: "",
        amount: 0,
        donationType: "physical" as const,
        itemDescription: donation.type,
        quantity: donation.quantity,
        txHash: `phy-${donation._id}`,
        donationId: donation._id.toString(),
        date: new Date(donation.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        beneficiaryCount: donation.quantity,
      }
    }

    const certificateBase64 = generateCertificateBase64(certificateData)

    return NextResponse.json({
      success: true,
      certificate: certificateBase64,
      certificateId: certificateData.donationId,
    })
  } catch (error) {
    console.error("Certificate generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    )
  }
}

