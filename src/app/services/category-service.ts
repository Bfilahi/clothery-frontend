import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category';
import { CustomHttpResponse } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl: string = environment.BASE_URL;
  private adminUrl: string = environment.ADMIN_URL;

  public categoryToUpdate: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient) { }

  public getProductCategories(): Observable<Category[]>{
    const url: string = `${this.baseUrl}/categories`;

    return this.httpClient.get<GetResponseProductCategory>(url).pipe(
      map(item => item._embedded.categories)
    );
  }

  public getCategoryId(categories: Category[], categoryName: string, categoryType: string, gender: string): number | undefined {
    const targetedCategory: Category | undefined = categories.find(
      category => category.categoryName === categoryName && 
      category.type === categoryType && 
      category.gender === gender
    )
    
    if(targetedCategory)
      return targetedCategory.id;
    return undefined;
  }

  public addCategory(formData: FormData): Observable<Category>{
    const url: string = `${this.adminUrl}/category/add`;
    return this.httpClient.post<Category>(url, formData);
  }

  public deleteCategory(type: string, gender: string): Observable<CustomHttpResponse>{
    const url: string = `${this.adminUrl}/category/${type}/${gender}`;
    return this.httpClient.delete<CustomHttpResponse>(url);
  }

  public updateCategory(formData: FormData): Observable<Category>{
    const url: string = `${this.adminUrl}/category/update`;
    return this.httpClient.put<Category>(url, formData);
  }

  public setCategoryToUpdate(category: Category){
    this.categoryToUpdate.next(category);
  }

  public createCategoryData(category: Category, image: File): FormData{
    const formData: FormData = new FormData();

    formData.append('categoryName', category.categoryName);
    formData.append('type', category.type);
    formData.append('imgUrl', image);
    formData.append('gender', category.gender);

    return formData;
  }

}


interface GetResponseProductCategory{
  _embedded: {
    categories: Category[]
  }
}