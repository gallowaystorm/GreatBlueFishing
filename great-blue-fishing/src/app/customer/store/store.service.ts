import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartData } from './cart.model'
import { OrderData } from '../checkout/stepper/orders.model';
import { PaymentData } from '../checkout/stepper/payments.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/store/'

@Injectable({ providedIn: 'root' })
export class StoreService{

  cart: CartData[] = [];
  private cartDataListener = new Subject<CartData[]>();
  public userId: string;
  //for orders
  orderData: OrderData[] = [];
  paymentData: PaymentData[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  addToCart(productId: string, itemQuantity: number, price: number, productName: string){
    this.userId = localStorage.getItem('userId')
    const cartData: CartData = {
      productId: productId,
      productName: productName,
      quantity: itemQuantity,
      price: price,
      userId: this.userId
    }
    this.cart.push(cartData);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getCart(){
    //retrieves cart from local storage and changes it back to an object
    this.cart = JSON.parse(localStorage.getItem('cart'));
    return this.cart;
  }

  placeOrder(nameInformation: any, shippingInformation:any, billingInformation: any){
    this.http.post<{message: string, createdOrder: any}>(BACKEND_URL + 'order', {cartDetails: this.cart, nameInformation, shippingInformation, billingInformation})
      .subscribe(response => {
        console.log(response);
      });
  }

}
