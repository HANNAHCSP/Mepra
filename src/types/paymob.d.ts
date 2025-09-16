// src/types/paymob.d.ts

export interface PaymobTransaction {
  id: number;
  pending: boolean;
  amount_cents: number;
  success: boolean;
  is_auth: boolean;
  is_capture: boolean;
  is_standalone_payment: boolean;
  is_voided: boolean;
  is_refunded: boolean;
  is_3d_secure: boolean;
  integration_id: number;
  profile_id: number;
  has_parent_transaction: boolean;
  owner: number;
  created_at: string;
  currency: string;
  is_void: boolean;
  is_refund: boolean;
  error_occured: boolean;
  refunded_amount_cents: number;
  captured_amount: number;
  merchant_staff_tag: null | string;
  updated_at: string;
  is_settled: boolean;
  bill_balanced: boolean;
  is_bill: boolean;
  owner_wallet_cents?: number;
  order: {
    id: number;
    merchant_order_id: string;
  };
  source_data: {
    type: string;
    pan: string;
    sub_type: string;
  };
}

export interface PaymobWebhookPayload {
  type: 'TRANSACTION';
  obj: PaymobTransaction;
  hmac?: string; // Made optional since it comes from query params
}