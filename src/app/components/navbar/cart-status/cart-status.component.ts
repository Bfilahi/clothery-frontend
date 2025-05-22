import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuickCartDetailsComponent } from "../../cart/quick-cart-details/quick-cart-details.component";
import { CartService } from '../../../services/cart.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UserAccountService } from '../../../services/user-account.service';

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [CommonModule, RouterModule, QuickCartDetailsComponent],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.scss'
})
export class CartStatusComponent {
  public totalPrice: number = 0;
  public totalQuantity: number = 0;

  public isOpen: boolean = false;


  constructor(
    private cartService: CartService,
    private userAccountService: UserAccountService,
    @Inject(DOCUMENT) private document: Document
  ){}

  ngOnInit(): void {
    this.updateCartStatus();


    this.document.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;

      if(target.closest('.cart__container'))
        return;

      this.isOpen = false;
    })
  }

  updateCartStatus(){
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }

  showQuickCart(){
    if(this.totalPrice > 0){
      this.userAccountService.isOpen.next(false);
      this.cartService.isOpen.next(true);

      this.isOpen = true;
    }
  }
}