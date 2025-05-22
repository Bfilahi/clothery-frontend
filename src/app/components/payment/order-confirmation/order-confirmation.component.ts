import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit{

  public sessionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) { }

  public ngOnInit(): void {
    // Extract session ID from URL if present
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    
    // Clear the cart after successful checkout
    this.cartService.clearCart();
  }

  public viewOrders(): void {
    this.router.navigate(['/orders']);
  }

  public continueShopping(): void {
    this.router.navigate(['/home']);
  }
}
