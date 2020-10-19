import { Url } from 'url';

export interface DonationCompany {
  id: string;
  companyName: string;
  imagePath: string;
  description: string;
  companyAddress: {
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    state: string;
    postal: number;
  }
  companyWebsite: string
}
