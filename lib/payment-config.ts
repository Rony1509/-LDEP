// Payment configuration for manual payment verification
// Admin can update these values as needed

export interface PaymentMethodConfig {
  name: string;
  displayName: string;
  instructions: string;
  // For mobile banking (bKash, Nagad)
  phoneNumber?: string;
  // For bank transfer
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export const paymentConfig: Record<string, PaymentMethodConfig> = {
  bkash: {
    name: "bkash",
    displayName: "bKash",
    instructions: "Send money to the bKash number below and enter the transaction ID",
    phoneNumber: "01405091911",
  },
  nagad: {
    name: "nagad",
    displayName: "Nagad",
    instructions: "Send money to the Nagad number below and enter the transaction ID",
    phoneNumber: "01405091911",
  },
  bank: {
    name: "bank",
    displayName: "Bank Transfer",
    instructions: "Transfer to the bank account below and enter the transaction ID",
    bankName: "ABC Bank",
    accountNumber: "XXXXXXXXXXXX",
    accountName: "Charity Organization",
  },
};

export function getPaymentConfig(method: string): PaymentMethodConfig | undefined {
  return paymentConfig[method.toLowerCase()];
}

export function getAllPaymentMethods(): PaymentMethodConfig[] {
  return Object.values(paymentConfig);
}

