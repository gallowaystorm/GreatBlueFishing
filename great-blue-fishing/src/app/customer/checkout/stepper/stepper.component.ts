import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Data } from 'src/app/data';
import { StoreService } from '../../store/store.service';
import { CardType } from './payments.model';
import { State } from './states.model';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {

  //for stepper
    //linear forces them to complete the first step before moving to next
  isLinear = false;
  name: FormGroup;
  shippingAddress: FormGroup;
  billing: FormGroup;

  //for states
  states = State;
  //for credit cards
  creditCardTypes = CardType;

  constructor(private formBuilder: FormBuilder, private router: Router, private data: Data, public storeService: StoreService) { }

  ngOnInit() {
    this.name = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
    this.shippingAddress = this.formBuilder.group({
      shippingStreetAddress: ['', Validators.required],
      shippingAddressLineTwo: [null],
      shippingCity: ['', Validators.required],
      shippingState: ['', Validators.required],
      shippingPostal: ['', Validators.required]
    });
    this.billing = this.formBuilder.group({
      cardType: ['', Validators.required],
      cardNumber: ['', Validators.required],
      securityCode: ['', Validators.required],
      expiration: ['', Validators.required],
      nameOnCard: ['', Validators.required],
      billingStreetAddress: ['', Validators.required],
      billingAddressLineTwo: [null],
      billingCity: ['', Validators.required],
      billingState: ['', Validators.required],
      billingPostal: ['', Validators.required]
    });
  }

  onReviewOrder(){
    this.data.storage = {
      nameInformation: this.name,
      shippingInformation: this.shippingAddress,
      billingInformation: this.billing,
      cartData: this.storeService.getCart()
    }
    // this.router.navigate(['/review'], { skipLocationChange: true });
    this.router.navigate(['/review']);
  }

}
