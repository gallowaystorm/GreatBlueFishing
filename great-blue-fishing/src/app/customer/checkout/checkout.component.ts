import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartData } from '../store/cart.model'
import { TotalData } from './total.model'
import { StoreService } from '../store/store.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})


export class CheckoutComponent implements OnInit {

  isLoading = false;
  showTableHeader = false;

  //for users list
  cart: CartData[] = [{productId: "id", productName: "Test Name", quantity: 3, price: 5.99}];
  displayedColumns: string[] = ['productName', 'price', 'quantity', 'delete'];
  //for total
  total: TotalData[] = [{total: "Total", totalAmount: 3.99}];
  displayedColumnsTotal: string[] = ['total', 'totalAmount'];


  constructor(public storeService: StoreService) { }

  ngOnInit() {
    this.isLoading = true;
    this.getCart();
    this.getTotal();
    this.isLoading = false;
  }

  getCart(){
    const cartData = this.storeService.getCart();
    console.log(cartData);
    this.cart = cartData;
  }

  getTotal(){
    return true;
  }

  onDelete(id: string){

  }

}
