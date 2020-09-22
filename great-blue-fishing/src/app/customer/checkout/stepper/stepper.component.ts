import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.name = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
    this.shippingAddress = this._formBuilder.group({
      shippingStreetAddress: ['', Validators.required],
      shippingAddressLineTwo: ['', Validators.required],
      shippingCity: ['', Validators.required],
      shippingState: ['', Validators.required],
      shippingPostal: ['', Validators.required]
    });
    this.billing = this._formBuilder.group({
      cardType: ['', Validators.required],
      cardNumber: ['', Validators.required],
      securityCode: ['', Validators.required],
      expiration: ['', Validators.required],
      nameOnCard: ['', Validators.required],
      billingStreetAddress: ['', Validators.required],
      billingAddressLineTwo: ['', Validators.required],
      billingCity: ['', Validators.required],
      billingState: ['', Validators.required],
      billingPostal: ['', Validators.required]
    });
  }

  onPlaceOrder(){
    
  }

}
