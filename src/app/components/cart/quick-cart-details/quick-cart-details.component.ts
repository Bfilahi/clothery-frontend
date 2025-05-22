import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { CartItem } from '../../../model/cart-item';
import { CartService } from '../../../services/cart.service';
import { RouterModule } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { StripeResponse } from '../../../interface/stripe-response';
import { PaymentRequest } from '../../../interface/payment-request';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-quick-cart-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-cart-details.component.html',
  styleUrl: './quick-cart-details.component.scss'
})
export class QuickCartDetailsComponent implements OnInit{

  public totalPrice: number = 0;
  public totalQuantity: number = 0;

  public isOpen: boolean = false;

  cartItems: CartItem[] = [];

  private isAuthenticated: boolean = false;



  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ){}

  public ngOnInit(): void {
    this.handleCart();

    this.authService.isAuthenticated$.subscribe(
      response => this.isAuthenticated = response
    );

    this.document.addEventListener('click', (event) =>{
      const target = event.target as HTMLElement;
      
      if(target.closest('.cart__container') || target.closest('.btn-remove'))
        return;
      this.cartService.isOpen.next(false);
    });
  }

  public handleCart(){
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.isOpen.subscribe(
      data => this.isOpen = data
    );

    this.cartService.cartItems$.subscribe(
      data => this.cartItems = data
    );
  }

  public closeQuickCart(){
    this.cartService.closeQuickCart();
  }

  public removeProduct(item: CartItem){
    this.cartService.removeFromCart(item);
  }

  public checkout(){
    if (!this.isAuthenticated) {
      // If not authenticated, redirect to login first
      this.authService.loginWithRedirect({
        appState: { target: '/cart-details' } // Redirect back to cart after login
      });
      return;
    }


    if(this.cartItems.length === 0)
      return;
  

    let cart: PaymentRequest = {
      lineItems: []
    };

    for(let item of this.cartItems){
      cart.lineItems.push({
        name: item.productName,
        description: item.description,
        amount: Math.round(item.unitPrice * 100),
        quantity: item.quantity,
      })
    }

    this.paymentService.checkout(cart).subscribe({
      next: (response: StripeResponse) => {
        if (response.status === 'SUCCESS') 
          window.location.href = response.sessionUrl;
        else
          console.error('Payment initialization failed');
      },
      error: (err) => {
        console.error('Payment error', err);
      }
    });
  }
}
