// Shared pending transactions store for SSL Commerz payments
// In production, use Redis or store in MongoDB

interface PendingTransaction {
  donorId: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  method: string;
  createdAt: Date;
}

// In-memory store (singleton pattern)
class PendingTransactionsStore {
  private static instance: PendingTransactionsStore;
  private transactions: Map<string, PendingTransaction>;

  private constructor() {
    this.transactions = new Map();
  }

  static getInstance(): PendingTransactionsStore {
    if (!PendingTransactionsStore.instance) {
      PendingTransactionsStore.instance = new PendingTransactionsStore();
    }
    return PendingTransactionsStore.instance;
  }

  set(tranId: string, data: PendingTransaction): void {
    this.transactions.set(tranId, data);
  }

  get(tranId: string): PendingTransaction | undefined {
    return this.transactions.get(tranId);
  }

  delete(tranId: string): boolean {
    return this.transactions.delete(tranId);
  }

  has(tranId: string): boolean {
    return this.transactions.has(tranId);
  }

  // Clean up old transactions (older than 30 minutes)
  cleanup(): void {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    for (const [key, value] of this.transactions.entries()) {
      if (value.createdAt < thirtyMinutesAgo) {
        this.transactions.delete(key);
      }
    }
  }
}

export const pendingTransactionsStore = PendingTransactionsStore.getInstance();
export type { PendingTransaction };
