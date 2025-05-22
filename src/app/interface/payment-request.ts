import { LineItem } from "./line-item";

export interface PaymentRequest {
  lineItems: LineItem[];
  metadata?: {
    [key: string]: string;
  };
}