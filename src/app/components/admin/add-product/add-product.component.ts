import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../../../model/category';
import { NotificationService } from '../../../services/notification.service';
import { Product } from '../../../model/Product';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category-service';
import { UtilityService } from '../../../services/utility.service';



@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit{

  public maxImages: number = 4;
  public errorMessage: string = '';
  public isAnError: boolean = false;
  public defaultValue: string = '';
  public sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46'];
  public categories: Category[] = [];
  public selectCategories: Category[] = [];
  public selectedSizes: string[] = [];
  public correctImageSize: boolean = false;

  public sizeQuantities: { [size: string]: number | string } = {};

  public imageFiles: File[] = [];




  public constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    @Inject(DOCUMENT) private document: Document
  ){}

  public ngOnInit(): void {
    this.getCategories();
  }

  public getCategories(){
    this.categoryService.getProductCategories().subscribe(
      data => this.categories = data
    );
  }

  public listCategories(event: Event){
    const input = event.target as HTMLInputElement;

    this.selectCategories = this.categories.filter(item => item.gender == input.value);
  }

  public onSelectedSizes(size: string, event: Event){
    const input = event.target as HTMLInputElement;

    if(input.checked)
      this.selectedSizes.push(size);
    else{
      this.selectedSizes = this.selectedSizes.filter(s => s != size);
      this.sizeQuantities[size] = '';
    }
  }

  private hasValidSizeQuantities(): boolean{
    return this.selectedSizes.every(size => {
      const quantity = this.sizeQuantities[size];
      return quantity != '' && !isNaN(Number(quantity)) && Number(quantity) >= 0;
    });
  }


  public onImageChange(event: Event){
    let images: File[] | null;
    let imageCheck: boolean | null;
    let message: string;
    let input: HTMLInputElement;

    [images, imageCheck, message, input] = this.utilityService.onImageChange(event);

    if(images == null || imageCheck == null){
      this.isAnError = true;
      this.errorMessage = message;
      input.value = '';
      return;
    }

    this.isAnError = false;
    this.imageFiles = images;
    this.correctImageSize = imageCheck;
  }

  public onAddNewProduct(productForm: NgForm){
    if(productForm.value.productName.trim() === '' || productForm.value.description.trim() === ''){
      this.notificationService.showError('Fields are empty.');
      return;
    }

    if(productForm.invalid || !this.hasValidSizeQuantities()){
      this.notificationService.showError('At least 1 product size should be selected.')
      return;
    }
    
    const categoryId = this.categoryService.getCategoryId(
      this.categories, 
      productForm.value.category, 
      productForm.value.categoryType, 
      productForm.value.gender
    );

    if(categoryId == undefined){
      this.notificationService.showError('Category not found.');
      return;
    }


    const sizeQuantityMap = this.selectedSizes.map(
      size =>({
        size,
        quantity: this.sizeQuantities[size]
      })
    );

    const formData: FormData = this.productService.createProductData(productForm.value, categoryId, sizeQuantityMap, this.imageFiles);

    this.productService.addProduct(formData).subscribe({
      next: (response: Product) => {
        this.resetForm(productForm, false);
        this.notificationService.showSuccess(`${response.productName} was added successfully.`);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error.error.message);
        this.resetForm(productForm, true);
      }
    })
  }

  private resetForm(formData: NgForm, error: boolean){
    this.imageFiles = [];
    this.selectedSizes = [];
    this.correctImageSize = false;

    if(!error){
      formData.reset({
        gender: this.defaultValue,
        category: this.defaultValue,
        categoryType: this.defaultValue
      });
      this.selectCategories = [];

      this.sizes.forEach(size => {
        const checkbox = this.document.getElementById(`size-${size}`) as HTMLInputElement;
        if(checkbox)
          checkbox.checked = false;
      });
    }
  }
}