import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data } from 'src/app/data';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.css']
})
export class ReviewOrderComponent implements OnInit {

  nameInformation: any;
  shippingInformation: any;
  billingInformation: any;

  constructor(private data: Data) {
   }

  ngOnInit() {
    this.nameInformation = this.data.storage['nameInformation']['value'];
    this.shippingInformation = this.data.storage['shippingInformation']['value'];
    this.billingInformation = this.data.storage['billingInformatino']['value'];

    //delete eventually
    console.log(this.nameInformation);
    console.log(this.shippingInformation);
    console.log(this.billingInformation);
  }

}
