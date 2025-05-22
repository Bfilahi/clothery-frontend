import { Address } from "./address";
import { OrderItem } from "./order-item";

export interface Order {
  id: number;
  totalQuantity: number;
  totalPrice: number;
  orderTrackingNumber: string;
  dateCreated: string;
  shippingAddress: Address;
  orderItems: OrderItem[];
}