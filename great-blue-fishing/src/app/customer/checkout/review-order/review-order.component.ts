import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from 'src/app/data';
import { CartData } from '../../store/cart.model';
import { StoreService } from '../../store/store.service';
import { TotalData } from '../total.model';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.css']
})
export class ReviewOrderComponent implements OnInit {

  nameInformation: any;
  shippingInformation: any;
  billingInformation: any;
  cartData: any;
  isLoading = false;
  showTableHeader = false;
  public stripeToken: any;

  //for users list
  cart: CartData[] = [];
  displayedColumns: string[] = ['productName', 'price', 'quantity'];
  //for total
  totalPrice = 0;
  total: TotalData[] = [{total: "Total", totalAmount: this.totalPrice}];
  displayedColumnsTotal: string[] = ['total', 'totalAmount'];

  constructor(private data: Data, public storeService: StoreService, private router: Router) {
   }

  ngOnInit() {
    this.isLoading = true;
    this.getCart();
    this.totalPrice = this.getTotal();
    this.nameInformation = this.data.storage['nameInformation']['value'];
    this.shippingInformation = this.data.storage['shippingInformation']['value'];
    this.billingInformation = this.data.storage['billingInformation']['value'];
    this.cartData = this.data.storage['cartData'];
    this.isLoading = false;
  }

  getCart(){
    const cartData = this.storeService.getCart();
    this.cart = cartData;
  }

  getTotal(){
    for (let i = 0; i < this.cart.length; i++){
      this.totalPrice = (this.cart[i].price * this.cart[i].quantity) + this.totalPrice;
    }
    return this.totalPrice;
  }

  onNavigateBack(){
    this.router.navigate(['/checkout']);
  }

  onSubmitOrder(){
    this.isLoading = true;
    this.storeService.placeOrder(this.nameInformation, this.shippingInformation, this.billingInformation, this.cartData);
    this.isLoading = false;
  }

  pay(amount){
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51HX4yUDEnGCSjwlXYRIFs3Wj9fFXw8DW7kLUacKFKPIcC0P96E6C4I9kVku5brUOGR33O2KKH6NkfIawr3oo11eU00eL9q8lAk',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        this.stripeToken = token.id;
      }
    });

    console.log('token is ' + this.stripeToken);

    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: amount * 100
    });

    console.log(this.stripeToken + ' again')
  }

}
