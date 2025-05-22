import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../model/Product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { CartItem } from '../../model/cart-item';
import { CartService } from '../../services/cart.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{

  public product: any = {
    productName: '',
    description: '',
    unitPrice: 0,
    unitsInStock: 0,
    images: [],
    sizes: []
  };

  public isSizeSelected: boolean = false;
  public showErrorMsg: boolean = false;
  public display: string = 'conversion';
  public selectedSize: string = '';
  


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private spinnerService: NgxSpinnerService,
  ){}


  public ngOnInit(): void {
    this.route.paramMap.subscribe(
      param => {
        const id = param.get('id');
        
        if(id){
          this.spinnerService.show();
          this.getProductById(id);
        }
      }
    );
  }


  public getProductById(id: string){
    this.productService.getProductById(+id).subscribe({
      next: (response: Product) => {
        this.product = response;

        this.spinnerService.hide();
      },
      error: (error: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.notificationService.showError(error.error.message);
      }
    });

  }

  public selectSize(size: string){
    this.selectedSize = size;

    this.isSizeSelected = true;
  }


  public addToCart(product: Product, event: Event){
    event.stopPropagation();

    if(!this.isSizeSelected){
      this.showErrorMsg = true;
      return;
    }

    this.showErrorMsg = false;

    const cartItem = new CartItem(product);
    cartItem.selectedSize = this.selectedSize;
    this.cartService.addToCart(cartItem);
  }

  public selectAccordionSection(value: string){
    this.display = value;
  }
}
