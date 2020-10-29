import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  isLoading = false;
  form: FormGroup;


  constructor(public contactUsService: ContactUsService) { }

  ngOnInit() {
    //form mapping
    this.form = new FormGroup({
      'firstName': new FormControl(null, {validators: [Validators.required]}),
      'lastName': new FormControl(null, {validators: [Validators.required]}),
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'content': new FormControl(null, {validators: [Validators.required]})
    });
  }

  onSubmit(formDirective: FormGroupDirective){
    this.contactUsService.onContactUsSubmit(this.form.value.firstName, this.form.value.lastName, this.form.value.email, this.form.value.content);
    formDirective.resetForm();
    this.form.reset();
  }

}
