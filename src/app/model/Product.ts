import { Category } from "./category";
import { Image } from "./image";
import { Size } from "./size";


export class Product {
  public constructor(
    public id: number,
    public productName: string,
    public description: string,
    public gender: string,
    public unitPrice: number,
    public category: Category,
    public unitsInStock: number,
    public sizes: Size[],
    public images: Image[]
  ) {}
}