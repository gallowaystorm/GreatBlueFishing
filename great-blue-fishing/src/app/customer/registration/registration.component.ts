import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerAuthService } from '../customer-auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  isLoading = false;
  //for form
  form: FormGroup;

  constructor(private customerAuthService: CustomerAuthService) { }

  ngOnInit() {
    //for mapping
    this.form = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]}),
      //password must contain one digit, one lowercase alpha, one uppercase alpha, one special character, and have at least 8 characters
      'password': new FormControl(null, {validators: [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}')]}),
      'firstName': new FormControl(null, {validators: [Validators.required]}),
      'lastName': new FormControl(null, {validators: [Validators.required]})
    });
  }

  onSignup(){
    if (this.form.invalid) {
      return
    }
    this.isLoading = true;
    var createCustomer = this.customerAuthService.createCustomerUser(this.form.value.email, this.form.value.password, this.form.value.firstName, this.form.value.lastName);
    if (createCustomer){
      this.isLoading = false;
      alert("You have registered successfully!");
    }
    this.form.reset();
  }

}
