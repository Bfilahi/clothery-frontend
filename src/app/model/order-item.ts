import { CartItem } from "./cart-item";

export class OrderItem {
    unitPrice: number;
    quantity: number;
    productId: number;

    constructor(cartItem: CartItem){
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productId = cartItem.id;
    }
}
