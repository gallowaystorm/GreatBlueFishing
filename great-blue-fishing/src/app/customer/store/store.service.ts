import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartData } from './cart.model'

const BACKEND_URL = environment.apiUrl + '/store/'

@Injectable({ providedIn: 'root' })
export class StoreService{

  cart: CartData[] = [];

  addToCart(productId: string, itemQuantity: number, price: number){
    const cartData: CartData = {
      productId: productId,
      quantity: itemQuantity,
      price: price
    }
    this.cart.push(cartData);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
}
