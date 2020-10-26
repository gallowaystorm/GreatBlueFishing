import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DonationCompany } from 'src/app/admin/manage-donations/donation-company.model';
import { DonationService } from 'src/app/admin/manage-donations/donation.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit, OnDestroy {

  isLoading = false;
  private donationCompanyId: string;
  public DonationCompany: DonationCompany;
  donationCompanies: DonationCompany[] = [];
  private donationCompanySub: Subscription;

  constructor(public donationService: DonationService) { }

  ngOnInit() {
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

  ngOnDestroy(){
    this.donationCompanySub.unsubscribe();
  }

}
