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
  total: TotalData[] = [{total: "Total", totalAmount: 3.99}];
  displayedColumnsTotal: string[] = ['total', 'totalAmount'];

  constructor(private data: Data, public storeService: StoreService) {
   }

  ngOnInit() {
    this.isLoading = true;
    this.getCart();
    this.isLoading = false;
    console.log(this.data.storage)
    this.nameInformation = this.data.storage['nameInformation']['value'];
    this.shippingInformation = this.data.storage['shippingInformation']['value'];
    this.billingInformation = this.data.storage['billingInformation']['value'];


    //delete eventually
    console.log(this.nameInformation);
    console.log(this.shippingInformation);
    console.log(this.billingInformation);
  }

  getCart(){
    const cartData = this.storeService.getCart();
    this.cart = cartData;
    console.log(this.cart)
  }

}
