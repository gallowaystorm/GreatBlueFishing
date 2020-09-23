import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Data } from 'src/app/data';
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

  constructor(private formBuilder: FormBuilder, private router: Router, private data: Data) { }

  ngOnInit() {
    this.name = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
    this.shippingAddress = this.formBuilder.group({
      shippingStreetAddress: ['', Validators.required],
      shippingAddressLineTwo: ['', Validators.required],
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
      billingAddressLineTwo: ['', Validators.required],
      billingCity: ['', Validators.required],
      billingState: ['', Validators.required],
      billingPostal: ['', Validators.required]
    });
  }

  onReviewOrder(){
    // const navParamas: NavigationExtras = {
    //   queryParams: {
    //     nameInformation: JSON.stringify(this.name),
    //     shippingInformation: JSON.stringify(this.shippingAddress),
    //     billingInformation: JSON.stringify(this.billing)
    //   }
    // }
    this.data.storage = {
      nameInformation: this.name,
      shippingInformation: this.shippingAddress,
      billingInformation: this.billing
    }
    this.router.navigate(['/review']);
  }

}
