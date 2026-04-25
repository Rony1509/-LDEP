// PDF Certificate Generator using jsPDF
// This generates donation certificates with blockchain verification

import { jsPDF } from "jspdf"

interface CertificateData {
  donorName: string
  donorEmail: string
  amount: number
  donationType: "monetary" | "physical"
  itemDescription?: string
  quantity?: number
  txHash: string
  donationId: string
  date: string
  beneficiaryCount: number
}

// Generate a unique certificate ID
function generateCertificateId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `DC-${timestamp}-${random}`.toUpperCase()
}

// Generate donation certificate PDF
export function generateDonationCertificate(data: CertificateData): Blob {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Background gradient effect (simulated with rectangles)
  doc.setFillColor(0, 136, 254) // Primary blue
  doc.rect(0, 0, pageWidth, 40, "F")

  doc.setFillColor(0, 196, 159) // Secondary teal
  doc.rect(0, 35, pageWidth, 10, "F")

  // Header
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text("DonateChain", pageWidth / 2, 20, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Certificate of Donation", pageWidth / 2, 30, { align: "center" })

  // Certificate ID
  const certificateId = generateCertificateId()
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(`Certificate ID: ${certificateId}`, pageWidth - 20, 38, { align: "right" })

  // Main content area
  doc.setTextColor(51, 51, 51)
  
  // Thank you message
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("Thank You for Your Generosity!", pageWidth / 2, 60, { align: "center" })

  // Donor name
  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.text(`Presented to:`, pageWidth / 2, 75, { align: "center" })
  
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text(data.donorName, pageWidth / 2, 85, { align: "center" })

  // Donation details
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  
  const donationType = data.donationType === "monetary" ? "Monetary Donation" : "Physical Donation"
  const donationDetails = data.donationType === "monetary" 
    ? `৳${data.amount.toLocaleString()}`
    : `${data.quantity}x ${data.itemDescription || data.donationType}`

  doc.text(`For your generous contribution:`, pageWidth / 2, 100, { align: "center" })
  
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(donationDetails, pageWidth / 2, 110, { align: "center" })

  // Impact statement
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(
    `Your donation has helped provide assistance to approximately ${data.beneficiaryCount} people in need.`,
    pageWidth / 2,
    125,
    { align: "center" }
  )

  // Blockchain verification section
  doc.setDrawColor(0, 136, 254)
  doc.setLineWidth(0.5)
  doc.line(30, 140, pageWidth - 30, 140)

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Blockchain Verification", 40, 150)
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("Transaction Hash:", 40, 160)
  doc.setFont("courier", "normal")
  doc.setTextColor(0, 100, 200)
  doc.text(data.txHash || "Pending blockchain confirmation", 40, 167)
  
  doc.setTextColor(51, 51, 51)
  doc.setFont("helvetica", "normal")
  doc.text("Donation ID:", 40, 177)
  doc.setFont("courier", "normal")
  doc.text(data.donationId, 40, 184)

  // Date
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Date: ${data.date}`, 40, 194)

  // Certificate ID at bottom
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text(`Certificate ID: ${certificateId}`, pageWidth / 2, 200, { align: "center" })

  // Footer
  doc.setFillColor(51, 51, 51)
  doc.rect(0, pageHeight - 25, pageWidth, 25, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("DonateChain - Transparent Donation Platform", pageWidth / 2, pageHeight - 15, { align: "center" })
  doc.setFontSize(8)
  doc.text("This certificate is verifiable on the blockchain", pageWidth / 2, pageHeight - 8, { align: "center" })

  // Return as blob
  return doc.output("blob")
}

// Generate certificate as base64 for download
export function generateCertificateBase64(data: CertificateData): string {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Background
  doc.setFillColor(0, 136, 254)
  doc.rect(0, 0, pageWidth, 40, "F")

  doc.setFillColor(0, 196, 159)
  doc.rect(0, 35, pageWidth, 10, "F")

  // Header
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text("DonateChain", pageWidth / 2, 20, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Certificate of Donation", pageWidth / 2, 30, { align: "center" })

  const certificateId = generateCertificateId()
  doc.setFontSize(10)
  doc.text(`Certificate ID: ${certificateId}`, pageWidth - 20, 38, { align: "right" })

  // Content
  doc.setTextColor(51, 51, 51)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("Thank You for Your Generosity!", pageWidth / 2, 60, { align: "center" })

  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.text(`Presented to:`, pageWidth / 2, 75, { align: "center" })
  
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text(data.donorName, pageWidth / 2, 85, { align: "center" })

  const donationDetails = data.donationType === "monetary" 
    ? `৳${data.amount.toLocaleString()}`
    : `${data.quantity}x ${data.itemDescription || data.donationType}`

  doc.setFontSize(14)
  doc.text(`For your generous contribution:`, pageWidth / 2, 100, { align: "center" })
  
  doc.setFontSize(18)
  doc.text(donationDetails, pageWidth / 2, 110, { align: "center" })

  doc.setFontSize(12)
  doc.text(`Your donation has helped ${data.beneficiaryCount} people.`, pageWidth / 2, 125, { align: "center" })

  // Verification
  doc.line(30, 140, pageWidth - 30, 140)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Blockchain Verification", 40, 150)
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("Transaction Hash:", 40, 160)
  doc.setFont("courier", "normal")
  doc.setTextColor(0, 0, 200)
  doc.text(data.txHash || "N/A", 40, 167)
  
  doc.setTextColor(51, 51, 51)
  doc.text("Donation ID:", 40, 177)
  doc.text(data.donationId, 40, 184)
  doc.text(`Date: ${data.date}`, 40, 194)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text(`Certificate ID: ${certificateId}`, pageWidth / 2, 200, { align: "center" })

  // Footer
  doc.setFillColor(51, 51, 51)
  doc.rect(0, pageHeight - 25, pageWidth, 25, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text("DonateChain - Transparent Donation Platform", pageWidth / 2, pageHeight - 15, { align: "center" })
  doc.setFontSize(8)
  doc.text("This certificate is verifiable on the blockchain", pageWidth / 2, pageHeight - 8, { align: "center" })

  return doc.output("datauristring")
}

