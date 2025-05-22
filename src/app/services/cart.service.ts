import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CartItem } from '../model/cart-item';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private storage!: Storage;

  constructor(@Inject(PLATFORM_ID) private platformId: Object){
    let data;

    if(isPlatformBrowser(this.platformId)){
      this.storage = localStorage;

      data = JSON.parse(this.storage.getItem('cartItems')!);

      if(data != null){
        this.cartItemsSubject.next(data);

        this.computeCartTotals();
      }
    }
    else {
      this.storage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0
      };
    }
  }

  public persistCartItems(){
    if(isPlatformBrowser(this.platformId))
      this.storage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  public addToCart(cartItem: CartItem){

    let isAlreadyInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    let currentCartItems: CartItem[] = this.cartItemsSubject.value;

    if(currentCartItems.length > 0){ 
      existingCartItem = currentCartItems.find(item => item.id === cartItem.id && item.selectedSize === cartItem.selectedSize);

      isAlreadyInCart = (existingCartItem != undefined);
    }

    if(isAlreadyInCart)
      existingCartItem!.quantity++;
    else
      currentCartItems = [...currentCartItems, cartItem];

    this.cartItemsSubject.next(currentCartItems);

    this.computeCartTotals();

    this.isOpen.next(true);
  }

  public computeCartTotals(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    const currentCartItems = this.cartItemsSubject.value;

    for(let cartItem of currentCartItems){
      totalPriceValue += cartItem.unitPrice * cartItem.quantity;
      totalQuantityValue += cartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    if(totalPriceValue === 0)
      this.isOpen.next(false);

    this.persistCartItems();
  }

  public removeFromCart(item: CartItem){
    const currentCartItems = this.cartItemsSubject.value;
    
    currentCartItems.splice(currentCartItems.indexOf(item) , 1);

    if(currentCartItems.length === 0){
      this.clearCart();
      return;
    }

    this.computeCartTotals();
  }

  public clearCart(){
    this.cartItemsSubject.next([]);

    this.computeCartTotals();

    if(isPlatformBrowser(this.platformId))
      this.storage.removeItem('cartItems');
  }

  public resetObservable(){
    this.cartItemsSubject.next([]);
  }

  public closeQuickCart(){
    this.isOpen.next(false);
  }

}
