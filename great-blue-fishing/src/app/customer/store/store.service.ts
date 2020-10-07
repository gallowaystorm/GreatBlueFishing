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
    if (JSON.parse(localStorage.getItem('cart'))){
      this.cart = JSON.parse(localStorage.getItem('cart'));
    } else {
      this.cart = [];
    }
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

  deleteItemFromCart(productId: string, userId: string){
    var isDeleted = false;
    console.log("product: " + productId + "userId " + userId);
    let cartBeforeCheckingUser = JSON.parse(localStorage.getItem('cart'));
    //iterate through to find corresponding cart entry
    for (let i = 0; i < cartBeforeCheckingUser.length; i++) {
      if(userId === cartBeforeCheckingUser[i].userId && productId === cartBeforeCheckingUser[i].productId){
        cartBeforeCheckingUser.splice(i, 1);
        isDeleted = true;
        break;
      }
    }
    localStorage.setItem('cart', JSON.stringify(cartBeforeCheckingUser));
    return isDeleted;
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
    this.http.post<{message: string, orderId: any, redirectURL: string}>(BACKEND_URL + 'order', {cartData, nameInformation, shippingInformation, billingInformation})
      .subscribe(response => {
        console.log(response.redirectURL);
        if (response.redirectURL !== null) {
          window.location.href = response.redirectURL;
        }
        this.data.storage = {
          message: response.message,
          orderId: response.orderId
        }
        this.router.navigate(['/order-status'], { skipLocationChange: true }
      );

        //delete cart for user who placed order
        if (response.orderId !== null || response.orderId !== undefined) {
          const userId = cartData[0].userId
          let cartBeforeCheckingUser =  JSON.parse(localStorage.getItem('cart'));
          for (var i = 0; i < cartBeforeCheckingUser.length; i++) {
            if (cartBeforeCheckingUser[i].userId === userId) {
              console.log(cartBeforeCheckingUser);
              //delete single array index
              cartBeforeCheckingUser.splice(i, 1);
            }
          }
          //reset cart in localstorage
          localStorage.setItem('cart', JSON.stringify(cartBeforeCheckingUser));
          console.log("Cart has been cleared");
        }
        return response.message;
      });
  }
}
