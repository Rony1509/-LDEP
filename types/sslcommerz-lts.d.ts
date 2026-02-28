declare module 'sslcommerz-lts' {
  interface SSLCommerzInitData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    emi_option?: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name?: string;
    cus_email?: string;
    cus_phone?: string;
    cus_add1?: string;
    cus_country?: string;
    shipping_method?: string;
  }

  interface SSLCommerzResponse {
    status: string;
    sessionkey?: string;
    GatewayPageURL?: string;
    failedReason?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type SSLCommerzType = new (...args: any[]) => any;

  const SSLCommerzPayment: SSLCommerzType;
  export default SSLCommerzPayment;
}
