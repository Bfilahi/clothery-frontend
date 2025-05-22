import { Component, OnInit } from '@angular/core';
import { Order } from '../../interface/order';
import { OrderService } from '../../services/order.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit{
  public orders: Order[] = [];
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return;
        }
        
        this.loadOrders();
      }
    );
  }

  public loadOrders(): void {
    this.isLoading = true;
    this.spinnerService.show();

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.error = 'Failed to load your orders. Please try again later.';
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  public viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  // Format date for display
  public formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
}
