import { Component, OnInit } from '@angular/core';
import { Order } from '../../interface/order';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSpinnerModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{
  public order: Order | null = null;
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
  ) { }

  public ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return;
        }

        this.spinnerService.show();
        
        this.loadOrderDetails();
      }
    );
  }

  public loadOrderDetails(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    
    if (!orderId) {
      this.error = 'Invalid order ID';
      this.isLoading = false;
      this.spinnerService.hide();
      return;
    }
    
    this.orderService.getOrderById(+orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Error loading order details', err);
        this.error = 'Failed to load order details. Please try again later.';
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  public goBack(): void {
    this.router.navigate(['/orders']);
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
