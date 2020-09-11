import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserData } from '../user-model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = environment.apiUrl + '/customer/'

@Injectable({ providedIn: 'root' })
export class CustomerAuthService{

  constructor(private http: HttpClient, private router: Router) {}

  createCustomerUser(email: string, password: string, firstName: string, lastName: string){
    const userData: UserData = {email: email, password: password, firstName: firstName, lastName: lastName, isAdmin: null};
    this.http.post(BACKEND_URL + 'registration', userData)
      .subscribe ( () => {
        this.navigateToHomePage();
        return true;
      }, error => {
        console.log(error);
      })
      return false;
  }

  navigateToHomePage(){
    this.router.navigate(['/']);
  }

}
