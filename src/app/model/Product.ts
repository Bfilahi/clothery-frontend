import { SizeQuantity } from "./size-quantity";


export class Product{
    public constructor(
        public id: number,
        public productName: string,
        public description: string,
        public gender: string,
        public unitPrice: number,
        public unitsInStock: number,
        public categoryId: number,
        public sizes: SizeQuantity[],
        public images: string[],
        public selectedSize: string
    ){}
}