import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Url } from 'url';
import { DonationCompany } from './donation-company.model';

const BACKEND_URL = environment.apiUrl + '/donations/'

@Injectable({ providedIn: 'root'})
export class DonationService{

  private donationCompany: DonationCompany[] = [];
  private donationCompanyUpdated = new Subject<{ donationCompanies: DonationCompany[]}>();

  constructor(private http: HttpClient, private router: Router){}

  addDonationComapny(companyName: string, image: File, description: string, addressLineOne: string, addressLineTwo: string, city: string, state: string, postal: number, companyWebsite: Url){
    const donationComapnyData = new FormData();
    //append the passed in information
    donationComapnyData.append('companyName', companyName);
    //title is passed in as well to name image
    donationComapnyData.append('image', image, companyName);
    donationComapnyData.append('description', description);
    donationComapnyData.append('addressLineOne', addressLineOne);
    donationComapnyData.append('addressLineTwo', addressLineTwo);
    donationComapnyData.append('city', city);
    donationComapnyData.append('state', state);
    donationComapnyData.append('postal', postal);
    donationComapnyData.append('companyWebsite', companyWebsite);
    this.http.post<{message: string, donationCompany: DonationCompany}>(BACKEND_URL, donationComapnyData)
      .subscribe( (responseData) => {
        return true;
      });
  }

}

