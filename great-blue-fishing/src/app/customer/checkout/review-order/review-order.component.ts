import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  isLoading = false;
  showTableHeader = false;

  //for users list
  cart: CartData[] = [];
  displayedColumns: string[] = ['productName', 'price', 'quantity'];
  //for total
  totalPrice = 0;
  total: TotalData[] = [{total: "Total", totalAmount: this.totalPrice}];
  displayedColumnsTotal: string[] = ['total', 'totalAmount'];

  constructor(private data: Data, public storeService: StoreService) {
   }

  ngOnInit() {
    this.isLoading = true;
    this.getCart();
    this.totalPrice = this.getTotal();
    this.nameInformation = this.data.storage['nameInformation']['value'];
    this.shippingInformation = this.data.storage['shippingInformation']['value'];
    this.billingInformation = this.data.storage['billingInformation']['value'];
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

  onSubmitOrder(){
    this.isLoading = true;
    this.storeService.placeOrder(this.nameInformation, this.shippingInformation, this.billingInformation);
  }

}
