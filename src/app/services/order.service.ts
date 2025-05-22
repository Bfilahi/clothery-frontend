import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../environments/environment.development';
import { Observable, switchMap } from 'rxjs';
import { Order } from '../interface/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.BASE_URL}/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Get all orders for the current authenticated user
  public getOrders(): Observable<Order[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Encode the auth0Id parameter
        const encodedAuth0Id = encodeURIComponent(user.sub!);
        return this.http.get<Order[]>(`${this.apiUrl}?auth0Id=${encodedAuth0Id}`);
      })
    );
  }

  // Get a specific order by ID
  public getOrderById(orderId: number): Observable<Order> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        // Encode the auth0Id parameter
        const encodedAuth0Id = encodeURIComponent(user.sub!);
        return this.http.get<Order>(`${this.apiUrl}/${orderId}?auth0Id=${encodedAuth0Id}`);
      })
    );
  }
}
