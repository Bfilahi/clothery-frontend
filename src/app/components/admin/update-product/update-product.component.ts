import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { UtilityService } from '../../../services/utility.service';
import { NotificationService } from '../../../services/notification.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../model/Product';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Size } from '../../../model/size';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent {
  public selectedSizes: any[] = [];
  public correctImageSize: boolean = false;

  public sizes: Size[] = [];
  public productName: string = '';
  public description: string = '';
  public unitPrice: number = 0;
  public unitsInStock: number = 0;

  public isAnError: boolean = false;
  public errorMessage: string = '';

  public sizeQuantities: { [size: string]: number | string } = {};

  private currentProduct!: Product;
  private imageFiles: File[] = [];

  public constructor(
    private productService: ProductService,
    private router: Router,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private spinnerService: NgxSpinnerService
  ) {}

  public ngOnInit(): void {
    this.productService.productToUpdate.subscribe((data) => {
      this.currentProduct = data;
      if (this.currentProduct) this.fillForm(this.currentProduct);
    });

    this.getSizes();
  }

  private fillForm(product: Product) {
    this.productName = product.productName;
    this.description = product.description;
    this.unitPrice = product.unitPrice;
    this.unitsInStock = product.unitsInStock;
    this.selectedSizes = product.sizes;
  }

  public onSelectedSizes(size: Size, event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.checked && !this.selectedSizes.some(s => s.id === size.id))
      this.selectedSizes.push(size);
    else {
      this.selectedSizes = this.selectedSizes.filter((s) => s != size);
    }
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

  public getSizes() {
    this.productService.getSizes().subscribe({
      next: (response: Size[]) => {
        this.sizes = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error: ', err);
      },
    });
  }

  public isSizeSelected(size: Size): boolean{
    return this.selectedSizes.some(s => s.id === size.id);
  }

  public onUpdateProduct(ngForm: NgForm) {
    if (
      ngForm.value.productName.trim() === '' &&
      ngForm.value.description.trim() === ''
    ) {
      this.notificationService.showError('Fields are empty.');
      return;
    }

    const confirmation: boolean = confirm(
      `Are you sure you want to update ${this.currentProduct.productName}?`
    );

    if (!confirmation) return;
  
    const formData: FormData = this.productService.createProductData(
      ngForm.value,
      this.currentProduct.category.id,
      this.selectedSizes.map(s => s.id),
      this.imageFiles
    );

    this.spinnerService.show();
    this.productService
      .updateProduct(formData, this.currentProduct.id)
      .subscribe({
        next: (response: Product) => {
          this.spinnerService.hide();
          this.imageFiles = [];
          this.selectedSizes = [];
          this.correctImageSize = false;
          this.notificationService.showSuccess(
            `${response.productName} was updated successfully.`
          );
          this.router.navigateByUrl('/home');
        },
        error: (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.imageFiles = [];
          this.selectedSizes = [];
          this.correctImageSize = false;
          this.notificationService.showError(err.error.message);
          console.error(err);
        },
      });
  }
}
