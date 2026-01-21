import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartItem } from '../../../model/cart-item';
import { CartService } from '../../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { PaymentRequest } from '../../../interface/payment-request';
import { PaymentService } from '../../../services/payment.service';
import { StripeResponse } from '../../../interface/stripe-response';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss',
})
export class CartDetailsComponent {
  public totalPrice: number = 0;
  public cartItems: CartItem[] = [];

  private isAuthenticated: boolean = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateCartDetails();

    this.authService.isAuthenticated$.subscribe(
      (response) => (this.isAuthenticated = response)
    );
  }

  private updateCartDetails() {
    this.cartService.totalPrice.subscribe(
      (response) => (this.totalPrice = response)
    );

    this.cartService.cartItems$.subscribe(
      (response) => (this.cartItems = response)
    );
  }

  public onSizeChange(item: CartItem) {
    item.quantity = 1;
  }

  public increaseQuantity(item: CartItem) {
    item.quantity++;
    this.recalculateTotal();
  }

  public decreaseQuantity(item: CartItem) {
    item.quantity--;
    if (item.quantity == 0) {
      this.removeProduct(item);
    }
    this.recalculateTotal();
  }

  private recalculateTotal() {
    this.cartService.computeCartTotals();
  }

  public removeProduct(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  public checkout() {
    if (!this.isAuthenticated) {
      // If not authenticated, redirect to login first
      this.authService.loginWithRedirect({
        appState: { target: '/cart-details' }, // Redirect back to cart after login
      });
      return;
    }

    if (this.cartItems.length === 0) return;

    let cart: PaymentRequest = {
      lineItems: [],
    };

    for (let item of this.cartItems) {
      cart.lineItems.push({
        name: item.productName,
        description: item.description,
        amount: Math.round(item.unitPrice * 100),
        quantity: item.quantity,
      });
    }

    this.paymentService.checkout(cart).subscribe({
      next: (response: StripeResponse) => {
        if (response.status === 'SUCCESS')
          window.location.href = response.sessionUrl;
        else console.error('Payment initialization failed');
      },
      error: (err) => {
        console.error('Payment error', err);
      },
    });
  }
}
