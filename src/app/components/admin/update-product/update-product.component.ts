import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { UtilityService } from '../../../services/utility.service';
import { NotificationService } from '../../../services/notification.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../model/Product';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent {

  public sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46'];
  public selectedSizes: string[] = [];
  public correctImageSize: boolean = false;

  public productName: string = '';
  public description: string = '';
  public unitPrice: number = 0;

  public isAnError: boolean = false;
  public errorMessage: string = '';

  public sizeQuantities: {[size: string]: number | string} = {};

  private currentProduct!: Product;
  private imageFiles: File[] = [];


  public constructor(
    private productService: ProductService,
    private router: Router,
    private utilityService: UtilityService,
    private notificationService: NotificationService
  ){}

  public ngOnInit(): void {
    this.productService.productToUpdate.subscribe(
      data => {
        this.currentProduct = data;
        if(this.currentProduct)
          this.fillForm(data);
      }
    );
  }

  private fillForm(product: Product){
    this.productName = product.productName;
    this.description = product.description;
    this.unitPrice = product.unitPrice;

    this.selectedSizes = product.sizes.map(sq => sq.size);

    product.sizes.forEach(sq => {
      this.sizeQuantities[sq.size] = sq.quantity
    });


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

  public onUpdateProduct(ngForm: NgForm){
    if(ngForm.value.productName.trim() === '' && ngForm.value.description.trim() === ''){
      this.notificationService.showError('Fields are empty.');
      return;
    }

    if(ngForm.invalid || !this.hasValidSizeQuantities()){
      this.notificationService.showError('At least 1 product size should be selected.')
      return;
    }

    const confirmation: boolean = confirm(`Are you sure you want to update ${this.currentProduct.productName}?`);

    if(!confirmation)
      return;


    const sizeQuantityMap = this.selectedSizes.map(
      size => ({
        size,
        quantity: this.sizeQuantities[size]
      })
    );

    const formData: FormData = this.productService.createProductData(ngForm.value, this.currentProduct.categoryId, sizeQuantityMap, this.imageFiles);

    this.productService.updateProduct(formData, this.currentProduct.id).subscribe({
      next: (response: Product) => {
        this.imageFiles = [];
        this.selectedSizes = [];
        this.correctImageSize = false;
        this.notificationService.showSuccess(`${response.productName} was updated successfully.`);
        this.router.navigateByUrl('/home');
      },
      error: (error: HttpErrorResponse) => {
        this.imageFiles = [];
        this.selectedSizes = [];
        this.correctImageSize = false;
        this.notificationService.showError(error.error.message);
      }
    });
  }
}
