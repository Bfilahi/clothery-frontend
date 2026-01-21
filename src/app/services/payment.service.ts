import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { StripeResponse } from '../interface/stripe-response';
import { PaymentRequest } from '../interface/payment-request';
import { environment } from '../../environments/environment.development';
import { AuthService } from '@auth0/auth0-angular';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = environment.BASE_URL;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  public checkout(paymentRequest: PaymentRequest): Observable<StripeResponse> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if(!user)
          throw new Error('User not authenticated');
        
        // Adding the auth0Id to the payment request
        const enrichedRequest = {
          ...paymentRequest,
          metadata: {
            auth0Id: user.sub  // This is the Auth0 ID (format: 'auth0|12345abcde')
          }
        };

        return this.httpClient.post<StripeResponse>(`${this.apiUrl}/checkout`, enrichedRequest);
      })
    );
  }
  
}