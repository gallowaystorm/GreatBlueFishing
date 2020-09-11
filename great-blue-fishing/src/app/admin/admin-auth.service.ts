import { Injectable } from '@angular/core';
import { UserData } from '../user-model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/admin/user/'

@Injectable({ providedIn: 'root'})
export class AdminAuthService{

  private adminStatusListener = new Subject<boolean>();
  private isAdmin = false;

  constructor(private http: HttpClient, private router: Router) {}
  //to check if admin
  getIsAdmin(){
    const userId = localStorage.getItem('userId');
    const userData = { id: userId };
    if (!userId){
      return false;
    }
    //find user that matches and tell if admin
    this.http.post<{ isAdmin: boolean }>(BACKEND_URL + 'find', userData)
      .subscribe( response => {
        console.log(response);
        this.isAdmin = response.isAdmin;
        this.adminStatusListener.next(this.isAdmin);
      }, error => {
        this.adminStatusListener.next(false);
    });
      return this.getAdminStatusListener();
  }

  getAdminStatusListener(){
    return this.adminStatusListener.asObservable();
  }
}
