import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { State } from 'src/app/customer/checkout/stepper/states.model';
import { mimeType } from '../create-blog/mime-type.validator';
import { DonationCompany } from './donation-company.model';
import { DonationService } from './donation.service';

@Component({
  selector: 'app-manage-donations',
  templateUrl: './manage-donations.component.html',
  styleUrls: ['./manage-donations.component.css']
})
export class ManageDonationsComponent implements OnInit, OnDestroy {

  isLoading = false;
  //for reactive form of forms
  form: FormGroup;
    //for imagepreview
  imagePreview: string;
  //for states
  states = State;
  public mode = 'create';
  private donationComapnyId: string;
  public DonationCompany: DonationCompany;

  donationComapnies: DonationCompany[] = [];
  private donationCompanySub: Subscription;

  constructor(public donationService: DonationService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'companyName': new FormControl( null, {validators: [Validators.required]}),
      'companyDescription': new FormControl (null, {validators: [Validators.required]}),
      'addressLineOne': new FormControl( null, {validators: [Validators.required]}),
      'addressLineTwo': new FormControl( null ),
      'city': new FormControl( null, {validators: [Validators.required]}),
      'state': new FormControl( null, {validators: [Validators.required]}),
      'postal': new FormControl( null, {validators: [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]}),
      //TODO: fix this once html is fixed
      'companyWebsite': new FormControl( null ),
      //added mie type validator
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  }

  onImagePicked(event: Event){
    //access file passed in
    const file = (event.target as HTMLInputElement).files[0];
    //target single control on form
    this.form.patchValue({image: file});
    //get access to image and update value and validate it
    this.form.get('image').updateValueAndValidity();
    //convert image to data url
    const reader = new FileReader();
    //executes when done loading
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
 }

  onSubmit(formDirective: FormGroupDirective){
      //check if form is complete
      if (this.form.invalid){
        return
      }
      if (this.mode === 'create'){
        // this.isLoading = true;
        this.donationService.addDonationComapny(this.form.value.companyName, this.form.value.image, this.form.value.companyDescription, this.form.value.addressLineOne, this.form.value.addressLineTwo, this.form.value.city, this.form.value.state, this.form.value.postal, this.form.value.companyWebsite);
        if (this.donationService.addDonationComapny){
          this.isLoading = false;
          alert('Donation company saved successfully');
        }
      // } else {
      //   var confirmUpdate = confirm("Are you sure you want to update this image?");
      //   if (confirmUpdate == true){
      //     var galleryUpdated = this.donationService.updateImage(this.donationCompanyId, this.form.value.title, this.form.value.image);
      //     this.isLoading = false;
      //     if (galleryUpdated == true) {
      //       alert("Gallery image has been updated!");
      //       this.mode = "create";
      //     }
      //   } else {
      //     return;
      //   }
      // }
      // formDirective.resetForm();
      // this.form.reset();
      this.getDonationCompanies();
     }
  }

  getDonationCompanies(){
    // //for gallery list
    // this.donationService.getDonationComapanies();
    // //gallery posts subscription
    // this.donationCompanySub = this.donationService.getDonationCompanyUpdateListener().subscribe((donationComapnyData: { donationCompanies: DonationCompany[] }) => {
    //   this.isLoading = false;
    //   this.donationComapnies = donationComapnyData.donationCompanies;
    //   });
  }

  ngOnDestroy(){
    // this.donationCompanySub.unsubscribe();
  }

}
