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
import { NgxSpinnerService } from 'ngx-spinner';
import { Size } from '../../../model/size';



@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  public maxImages: number = 4;
  public errorMessage: string = '';
  public isAnError: boolean = false;
  public defaultValue: string = '';
  public sizes: Size[] = [];
  public categories: Category[] = [];
  public selectCategories: Category[] = [];
  public selectedSizes: Size[] = [];
  public correctImageSize: boolean = false;
  public imageFiles: File[] = [];


  public constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private spinnerService: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public ngOnInit(): void {
    this.getCategories();
    this.getSizes();
  }

  public getCategories() {
    this.categoryService
      .getProductCategories()
      .subscribe((data) => (this.categories = data));
  }

  public listCategories(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectCategories = this.categories.filter(
      (item) => item.gender == input.value
    );
  }

  public onSelectedSizes(size: Size, event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.checked) this.selectedSizes.push(size);
    else 
      this.selectedSizes = this.selectedSizes.filter((s) => s != size);
  }

  public onImageChange(event: Event) {
    let images: File[] | null;
    let imageCheck: boolean | null;
    let message: string;
    let input: HTMLInputElement;

    [images, imageCheck, message, input] =
      this.utilityService.onImageChange(event);

    if (images == null || imageCheck == null) {
      this.isAnError = true;
      this.errorMessage = message;
      input.value = '';
      return;
    }

    this.isAnError = false;
    this.imageFiles = images;
    this.correctImageSize = imageCheck;
  }

  public onAddNewSize(input: HTMLInputElement){
    const value: string = input.value.trim();
    if(value.length <= 0)
      return;

    this.spinnerService.show();

    this.productService.addSize(value).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.notificationService.showSuccess('Size added successfully');
        input.value = '';
        this.getSizes();
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.notificationService.showError(err.error.message);
        console.error('Error: ', err);
      }
    });
  }

  public getSizes(){
    this.productService.getSizes().subscribe({
      next: (response: Size[]) => {
        this.sizes = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error: ', err);
      }
    })
  }

  public removeProduct(item: Size){
    if(!confirm('Are you sure you want to delete the size?'))
      return;

    this.spinnerService.show();
    this.productService.deleteSize(item.id).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.notificationService.showSuccess('Size was deleted successfully');
        this.getSizes();
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.notificationService.showError('Error: ' + err.error.message);
        console.error(err);
      }
    });
  }

  public onAddNewProduct(productForm: NgForm) {
    if (
      productForm.value.productName.trim() === '' ||
      productForm.value.description.trim() === ''
    ) {
      this.notificationService.showError('Fields are empty.');
      return;
    }

    const categoryId = this.categoryService.getCategoryId(
      this.categories,
      productForm.value.category,
      productForm.value.categoryType,
      productForm.value.gender
    );

    if (categoryId == undefined) {
      this.notificationService.showError('Category not found.');
      return;
    }

    const formData: FormData = this.productService.createProductData(
      productForm.value,
      categoryId,
      this.selectedSizes.map(s => s.id),
      this.imageFiles
    );
    this.spinnerService.show();

    this.productService.addProduct(formData).subscribe({
      next: (response: Product) => {
        this.spinnerService.hide();
        this.resetForm(productForm, false);
        this.notificationService.showSuccess(
          `${response.productName} was added successfully.`
        );
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.notificationService.showError(err.error.message);
        this.resetForm(productForm, true);
        console.error(err);
      }
    });
  }

  private resetForm(formData: NgForm, error: boolean) {
    this.imageFiles = [];
    this.selectedSizes = [];
    this.correctImageSize = false;

    if (!error) {
      formData.reset({
        gender: this.defaultValue,
        category: this.defaultValue,
        categoryType: this.defaultValue,
      });
      this.selectCategories = [];

      this.sizes.forEach((size) => {
        const checkbox = this.document.getElementById(
          `size-${size.id}`
        ) as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
      });
    }
  }
}