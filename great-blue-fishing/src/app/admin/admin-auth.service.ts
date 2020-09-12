import { Injectable } from '@angular/core';
import { UserData } from '../user-model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/admin/user/'

@Injectable({ providedIn: 'root'})
export class AdminAuthService{

  private adminStatusListener = new Subject<boolean>();
  private adminCreationStatusListener = new Subject<boolean>();
  private adminUsersUpdated = new Subject<{adminUsers: UserData[]}>();
  private isAdmin = false;
  private adminUsers: UserData[] = [];

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

  getAdminCreationStatusListener(){
    return this.adminCreationStatusListener.asObservable();
  }

  getAdminUserUpdateListener(){
    return this.adminUsersUpdated.asObservable();
  }


  getAdminUsers(){
    //get all admin users
    this.http.get<{adminUsers: any, message: string}>(BACKEND_URL + 'find')
      .pipe(map((adminUserData => {
        //replace every admin user with...
        return {
          adminUsers: adminUserData.adminUsers.map( adminUser => {
            return {
              firstName: adminUser.firstName,
              lastName: adminUser.lastName,
              email: adminUser.email,
              password: null,
              isAdmin: null
            };
          })
        };
      })))
      //subscribe to remapped posts
      .subscribe( (transformedAdminUsers) => {
        this.adminUsers = transformedAdminUsers.adminUsers;
        this.adminUsersUpdated.next( { adminUsers: [...this.adminUsers] } );
      });
  }

  createAdminUser(email: string, password: string, firstName: string, lastName: string){
    const adminUserData: UserData = {email: email, password: password, firstName: firstName, lastName: lastName, isAdmin: null};
    this.http.post(BACKEND_URL + 'registration', adminUserData)
      .subscribe ( () => {
        this.navigateToAdminUserPage();
        this.adminCreationStatusListener.next(true);
      }, error => {
        console.log(error);
      })
      return this.getAdminCreationStatusListener();
  }

  navigateToAdminUserPage(){
    this.router.navigate(['/admin/users']);
  }
}
