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
  createdOrderDetais: any;

  constructor(private data: Data) { }


  ngOnInit() {
    console.log(this.data.storage);
    // this.message = this.data.storage['message']['value'];
    // this.createdOrder = this.data.storage['createdOrder']['value'];
    // this.createdOrderDetais = this.data.storage['createdOrderDetais']['value'];
    // console.log(this.message);
    // console.log(this.createdOrder);
    // console.log(this.createdOrder);
  }

}
