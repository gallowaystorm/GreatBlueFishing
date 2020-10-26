import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Url } from 'url';
import { DonationCompany } from './donation-company.model';

const BACKEND_URL = environment.apiUrl + '/donations/'

@Injectable({ providedIn: 'root'})
export class DonationService{

  private donationCompanies: DonationCompany[] = [];
  private donationCompaniesUpdated = new Subject<{ donationCompanies: DonationCompany[]}>();

  constructor(private http: HttpClient, private router: Router){}

  addDonationComapny(companyName: string, image: File, description: string, addressLineOne: string, addressLineTwo: string, city: string, state: string, postal: number, companyWebsite: string){
    const donationCompanyData = new FormData();
    //append the passed in information
    donationCompanyData.append('companyName', companyName);
    //title is passed in as well to name image
    donationCompanyData.append('image', image, companyName);
    donationCompanyData.append('description', description);
    donationCompanyData.append('addressLineOne', addressLineOne);
    donationCompanyData.append('addressLineTwo', addressLineTwo);
    donationCompanyData.append('city', city);
    donationCompanyData.append('state', state);
    donationCompanyData.append('postal', postal.toString());
    donationCompanyData.append('companyWebsite', companyWebsite.toString());
    this.http.post<{message: string, donationCompany: DonationCompany}>(BACKEND_URL, donationCompanyData)
      .subscribe( (responseData) => {
        if (responseData) {
          return true
        } else {
          return false
        }
      });
  }

  deleteCompany(companyId){
    return this.http.delete(BACKEND_URL +  companyId);
  }

  getDonationCompanies(){
    this.http.get<{message: string, donationCompanies: any }>(BACKEND_URL)
      //to change id to _id
      .pipe(map((donationCompanyData => {
        //replace every post with...
        return { donationCompany: donationCompanyData.donationCompanies.map(donationCompany => {
          return {
            id: donationCompany._id,
            companyName: donationCompany.name,
            imagePath: donationCompany.imagePath,
            description: donationCompany.description
          };
        })};
      })))
      //subscribe to observable with remapped posts
      .subscribe( (transformedDonationCompaniesData) => {
        this.donationCompanies = transformedDonationCompaniesData.donationCompany;
        this.donationCompaniesUpdated.next( { donationCompanies: [...this.donationCompanies] } );
      });
  }

  updateDonationCompany(companyName: string, image: File | string, description: string, addressLineOne: string, addressLineTwo: string, city: string, state: string, postal: number, companyWebsite: string, companyId: string){
    let donationCompanyData: DonationCompany | FormData;
    console.log(typeof(image))
    if(typeof(image) === 'object') {
      donationCompanyData = new FormData();
      donationCompanyData.append('companyName', companyName);
      //title is passed in as well to name image
      donationCompanyData.append('image', image, companyName);
      donationCompanyData.append('description', description);
      donationCompanyData.append('addressLineOne', addressLineOne);
      donationCompanyData.append('addressLineTwo', addressLineTwo);
      donationCompanyData.append('city', city);
      donationCompanyData.append('state', state);
      donationCompanyData.append('postal', postal.toString());
      donationCompanyData.append('companyWebsite', companyWebsite.toString());
    } else {
      //create new post data
      donationCompanyData = {
        id: companyId,
        companyName: companyName,
        imagePath: image,
        description: description,
        companyAddress: {
          addressLineOne: addressLineOne,
          addressLineTwo: addressLineTwo,
          city: city,
          state: state,
          postal: postal
        },
        companyWebsite: companyWebsite
      }
    }
    this.http.put(BACKEND_URL + companyId, donationCompanyData).subscribe( response => {
      this.navigateToDonationPage();
      if (response) {
        return true
      }
    });
      return false
  }

  getSingleCompany(companyId: string){
    return this.http.get<{   _id: string, name: string, imagePath: string, description: string, companyAddress: {streetAddress: string, addressLineTwo: string, city: string, state: string, postal: number}, companyWebsite: string}>(BACKEND_URL + companyId);
  }

  getDonationCompanyUpdateListener(){
    return this.donationCompaniesUpdated.asObservable();
  }

  navigateToDonationPage(){
    this.router.navigate(["/admin/donations"]);
  }

}

