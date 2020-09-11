import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalAuthService } from '../global-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  //to subscribe to observable made in global-auth-service.ts
  private authListenerSubscription: Subscription

  constructor(private globalAuthService: GlobalAuthService) { }

  ngOnInit() {
    //for auto authentication
    this.userIsAuthenticated = this.globalAuthService.getIsAuth();
    //subscribe to listener for status of auth
    this.authListenerSubscription = this.globalAuthService.getAuthStatusListener()
      .subscribe( isAuthenticated  => {
        //set based off result of above call to authService
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  //for logout
  onLogout(){
    this.globalAuthService.logoutUser();
  }

  ngOnDestroy(){
    //unsubscribe to listener
    this.authListenerSubscription.unsubscribe();
  }

}
