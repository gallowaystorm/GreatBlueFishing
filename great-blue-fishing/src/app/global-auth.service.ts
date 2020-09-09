import { Injectable } from '@angular/core';
import { UserData } from './user-model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const BAKCEND_URL = environment.apiUrl + '/global/user/'

@Injectable({ providedIn: 'root'})
export class GlobalAuthService{

  private token: string;
  //subject is used to push information to compoenents that need it
  private authStatusListener = new Subject<boolean>();
  //to allow constant update of authstatus on pages
  private isAuthenticated = false;
  private userId: string;
  //for token timer
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  //for logging in users
  loginUser(email: string, password: string){
    const userData: UserData = {email: email, password: password, firstName: null, lastName: null, isAdmin: null};
    //send request
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BAKCEND_URL + 'login', userData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        //check if token exists
        if (token) {
          //for expiring of token
          const expiresInDuration = response.expiresIn;
          //set timer
          this.setAuthTimer(expiresInDuration);
          //sets status to true
          this.isAuthenticated = true;
          //set user id
          this.userId = response.userId;
          console.log('You are now logged in!');
          this.authStatusListener.next(true);
          //call saveAuthData to store expiration in local storage
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          //navigate to home page
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
    });
  }

  //for logout
  logoutUser(){
    this.token = null;
    this.isAuthenticated = false;
    //use subject to push to rest of app
    this.authStatusListener.next(false);
    //reset userId field on logout
    this.userId = null;
    //navigate to home page
    this.router.navigate(['/']);
    //clears timer for token expriation
    clearTimeout(this.tokenTimer);
    //clear token stored in browser
    this.clearAuthData();
  }

  //auto auth the user from local storage
  autoAuthUser() {
    const authInformation = this.getAuthData();
    //check if we have expiartion date
    if (!authInformation) {
      return;
    }
    //check if expiration is still valid
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      //set user id
      this.userId = authInformation.userId;
      //set expiration timer and divide because it works in milliseconds and we did seconds
      this.setAuthTimer(expiresIn / 1000);
      //inform app of new authentication status
      this.authStatusListener.next(true);
    }
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  //for getting auth data from local storage
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    //timer for expiration of token (multiply by 1000 because we set it as seconds in user.js not milliseconds)
    this.tokenTimer = setTimeout( () => { this.logoutUser(); }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    //comes out of the box
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
