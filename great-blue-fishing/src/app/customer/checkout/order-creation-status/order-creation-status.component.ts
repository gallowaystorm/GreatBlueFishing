import { Component, OnInit } from '@angular/core';
import { Data } from 'src/app/data';

@Component({
  selector: 'app-order-creation-status',
  templateUrl: './order-creation-status.component.html',
  styleUrls: ['./order-creation-status.component.css']
})
export class OrderCreationStatusComponent implements OnInit {

  message: string;
  createdOrder: any;

  constructor(private data: Data) { }


  ngOnInit() {
    console.log(this.data.storage);
    this.message = this.data.storage['message'];
    if (this.data.storage['orderId'] !== null || this.data.storage['orderId'] !== undefined) {
      this.createdOrder = this.data.storage['orderId'];
    }
    console.log(this.message);
    console.log(this.createdOrder);
  }

}
