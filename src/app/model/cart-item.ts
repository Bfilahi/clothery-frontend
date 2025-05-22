import { Product } from "./Product";
import { SizeQuantity } from "./size-quantity";

export class CartItem {
    public id: number;
    public productName: string;
    public description: string;
    public images: string[];
    public unitPrice: number;
    public unitsInStock: number;
    public selectedSize: string;
    public sizes: SizeQuantity[];
    public quantity: number;

    constructor(product: Product){
        this.id = product.id;
        this.productName = product.productName;
        this.description = product.description;
        this.images = product.images;
        this.unitPrice = product.unitPrice;
        this.unitsInStock = product.unitsInStock;
        this.selectedSize = '';
        this.sizes = product.sizes;
        this.quantity = 1;
    }
}