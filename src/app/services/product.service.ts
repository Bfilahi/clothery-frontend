import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/Product';
import { CustomHttpResponse } from '../model/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environment.BASE_URL;
  private adminUrl: string = environment.ADMIN_URL;

  public productToUpdate: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public keyword: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private httpClient: HttpClient) { }


  public addProduct(formData: FormData): Observable<Product>{
    const url: string = `${this.adminUrl}/product/add`;

    return this.httpClient.post<Product>(url, formData);
  }


  public getProducts(gender: string): Observable<Product[]>{
    const url: string = `${this.baseUrl}/products/${gender}`;

    return this.httpClient.get<Product[]>(url);
  }

  public getProductById(id: number): Observable<Product>{
    const url: string = `${this.baseUrl}/product/${id}`;

    return this.httpClient.get<Product>(url);
  }

  public getProductsByCategory(id: number): Observable<Product[]>{
    const url: string = `${this.baseUrl}/products/category?id=${id}`;

    return this.httpClient.get<Product[]>(url);
  }

  public updateProduct(formData: FormData, id: number): Observable<Product>{
    const url: string = `${this.adminUrl}/product/update/${id}`;

    return this.httpClient.put<Product>(url, formData);
  }

  public deleteProduct(id: number): Observable<CustomHttpResponse>{
    const url: string = `${this.adminUrl}/product/${id}`;
    
    return this.httpClient.delete<CustomHttpResponse>(url);
  }

  public searchProduct(keyword: string): Observable<Product[]>{
    const url: string = `${this.baseUrl}/products/search?keyword=${keyword}`;

    this.keyword.next(keyword);

    return this.httpClient.get<Product[]>(url);
  }


  public setProductToUpdate(product: Product){
    this.productToUpdate.next(product);
  }


  public createProductData(product: Product, categoryId: number, sizes: any, images: File[]): FormData{
    const formData: FormData = new FormData();

    formData.append('productName', product.productName);
    formData.append('description', product.description);
    formData.append('price', product.unitPrice.toString());
    formData.append('categoryId', categoryId.toString());

    formData.append('sizes', JSON.stringify(sizes));

    images.forEach(file => formData.append('image', file));

    return formData;
  }

}