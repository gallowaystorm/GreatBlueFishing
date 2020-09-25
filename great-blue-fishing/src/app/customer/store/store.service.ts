import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartData } from './cart.model'
import { OrderData } from '../checkout/stepper/orders.model';
import { PaymentData } from '../checkout/stepper/payments.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Data } from 'src/app/data';
import { repeat } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/store/'

@Injectable({ providedIn: 'root' })
export class StoreService{

  cart: CartData[] = [];
  private cartDataListener = new Subject<CartData[]>();
  public userId: string;
  //for orders
  orderData: OrderData[] = [];
  paymentData: PaymentData[] = [];
  cartAfterCheckingUser: CartData[] = [];

  constructor(private http: HttpClient, private router: Router, private data: Data) {}

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
    this.cartAfterCheckingUser = [];
    //retrieves cart from local storage and changes it back to an object
    this.userId = localStorage.getItem('userId');
    let cartBeforeCheckingUser =  JSON.parse(localStorage.getItem('cart'));
    //iterate through cart data and only pull for user currently logged in
    for (let i = 0; i < cartBeforeCheckingUser.length; i++) {
      if(this.userId === cartBeforeCheckingUser[i].userId) {
        this.cartAfterCheckingUser.push(cartBeforeCheckingUser[i]);
      }
    }
    return this.cartAfterCheckingUser;
  }

  placeOrder(nameInformation: any, shippingInformation:any, billingInformation: any, cartData: any){
    this.http.post<{message: string, orderId: any}>(BACKEND_URL + 'order', {cartData, nameInformation, shippingInformation, billingInformation})
      .subscribe(response => {
        //#TODO need to delete cart for that user
        this.data.storage = {
          message: response.message,
          orderId: response.orderId
        }
        // this.router.navigate(['/review'], { skipLocationChange: true });
        this.router.navigate(['/order-status']);
      });
  }

}
