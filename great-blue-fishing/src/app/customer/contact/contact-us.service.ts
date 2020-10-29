import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class ContactUsService{

  constructor() {}

  onContactUsSubmit(firstName: string, lastName: string, email: string, content: string){
    alert("Your feedback has been submitted!  Thank you!!")
  }

}
