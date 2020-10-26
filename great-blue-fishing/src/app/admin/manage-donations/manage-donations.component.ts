import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  private donationCompanyId: string;
  public DonationCompany: DonationCompany;

  donationCompanies: DonationCompany[] = [];
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

    //for create vs edit mode
      //pulls the path that you are at to determine between /create and /edit/:productID
      this.route.paramMap
      //subscribes to observable
      .subscribe( (paramMap: ParamMap) => {
        //check if path exists
        if (paramMap.has('companyId')) {
          this.mode = 'edit';
          //sets productId in the path equal to productId variable
          this.donationCompanyId = paramMap.get('companyId');
          //spinner on load
          this.isLoading = true;
          //call overloaded getPost function that finds post in database that matches id
          this.donationService.getSingleCompany(this.donationCompanyId)
            //subscribe to observable
            .subscribe(donationCompanyData => {
              //stop spinner
              this.isLoading = false;
              this.DonationCompany = {
                id: donationCompanyData._id,
                companyName: donationCompanyData.name,
                imagePath: donationCompanyData.imagePath,
                description: donationCompanyData.description,
                companyAddress: {
                  addressLineOne: donationCompanyData.companyAddress.streetAddress,
                  addressLineTwo: donationCompanyData.companyAddress.addressLineTwo,
                  city: donationCompanyData.companyAddress.city,
                  state: donationCompanyData.companyAddress.state,
                  postal: donationCompanyData.companyAddress.postal
                },
                companyWebsite: donationCompanyData.companyWebsite
              };
              //overite default form value on init
              this.form.setValue({
                'companyName': this.DonationCompany.companyName,
                'image': this.DonationCompany.imagePath,
                'companyDescription': this.DonationCompany.description,
                'addressLineOne': this.DonationCompany.companyAddress.addressLineOne,
                'addressLineTwo': this.DonationCompany.companyAddress.addressLineTwo,
                'city': this.DonationCompany.companyAddress.city,
                'state': this.DonationCompany.companyAddress.state,
                'postal': this.DonationCompany.companyAddress.postal,
                'companyWebsite': this.DonationCompany.companyWebsite
              });
            });
        } else {
          this.mode = 'create';
          this.donationCompanyId = null;
        }
      });

    this.getDonationCompanies();
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
      } else {
        var confirmUpdate = confirm("Are you sure you want to update this donation company?");
        if (confirmUpdate == true){
          var donationCompanyUpdated = this.donationService.updateDonationCompany(this.form.value.companyName, this.form.value.image, this.form.value.companyDescription, this.form.value.addressLineOne, this.form.value.addressLineTwo, this.form.value.city, this.form.value.state, this.form.value.postal, this.form.value.companyWebsite, this.donationCompanyId);
          this.isLoading = false;
          if (donationCompanyUpdated == true) {
            alert("Donation company has been updated!");
            this.mode = "create";
          }
        } else {
          return;
        }
      }
      formDirective.resetForm();
      this.form.reset();
      this.getDonationCompanies();
     }

  getDonationCompanies(){
    //for gallery list
    this.donationService.getDonationCompanies();
    //gallery posts subscription
    this.donationCompanySub = this.donationService.getDonationCompanyUpdateListener().subscribe((donationComapnyData: { donationCompanies: DonationCompany[] }) => {
      this.isLoading = false;
      this.donationCompanies = donationComapnyData.donationCompanies;
      });
  }

  onDelete(companyId: string) {
    var confirmDelete = confirm("Are you sure you want to delete this company? This cannot be undone.");
    if (confirmDelete){
      this.isLoading = true;
      this.donationService.deleteCompany(companyId).subscribe( () => {
        //to update product list on frontend on delete
        this.donationService.getDonationCompanies();
      }, () => {
        //this method helps handle errors
        this.isLoading = false;
      });
    } else {
      return;
    }
  }

  ngOnDestroy(){
    this.donationCompanySub.unsubscribe();
  }

}
