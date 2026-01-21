import { Image } from "./image";
import { Product } from "./Product";
import { Size } from "./size";

export class CartItem {
    public id: number;
    public productName: string;
    public description: string;
    public images: Image[];
    public unitPrice: number;
    public selectedSize: string;
    public sizes: Size[];
    public quantity: number;

    constructor(product: Product){
        this.id = product.id;
        this.productName = product.productName;
        this.description = product.description;
        this.images = product.images;
        this.unitPrice = product.unitPrice;
        this.selectedSize = '';
        this.sizes = product.sizes;
        this.quantity = 1;
    }
}