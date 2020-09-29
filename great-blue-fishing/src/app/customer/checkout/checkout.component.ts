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
  cart: CartData[] = [];
  displayedColumns: string[] = ['productName', 'price', 'quantity', 'delete'];
  //for total
  totalPrice = 0;
  total: TotalData[] = [{total: "Total", totalAmount: this.totalPrice}];
  displayedColumnsTotal: string[] = ['total', 'totalAmount'];

  //TODO: limit total to only two decimal places

  constructor(public storeService: StoreService) { }

  ngOnInit() {
    this.isLoading = true;
    this.getCart();
    this.totalPrice = this.getTotal();
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
    //format to two decimal places
    this.totalPrice = Number((Math.round(this.totalPrice * 100) / 100).toFixed(2));
    return this.totalPrice;
  }

  onDelete(productId: string, userId: string){
    const isDeleted = this.storeService.deleteItemFromCart(productId, userId);
    if (isDeleted) {
      alert("Product has been deleted from cart!");
      window.location.reload();
    } else {
      alert("Something went wrong when deleting item.");
    }
  }

}
