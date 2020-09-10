import { Injectable } from '@angular/core';
import { UserData } from '../user-model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const BAKCEND_URL = environment.apiUrl + '/admin/user/'

@Injectable({ providedIn: 'root'})
export class AdminAuthService{

  constructor(private http: HttpClient, private router: Router) {}

  //to check if admin
  getIsAdmin(){
    const userId = localStorage.getItem('userId');
    if (!userId){
      return false;
    }
    //find user that matches and tell if admin
    this.http.post<{ isAdmin: boolean }>(BAKCEND_URL + 'find', userId).subscribe( response => {
      console.log(response);
      const isAdmin = response.isAdmin;
      return isAdmin;
    });
  }
}
