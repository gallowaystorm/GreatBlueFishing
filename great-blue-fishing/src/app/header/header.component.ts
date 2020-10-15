import { Component, OnInit, OnDestroy} from '@angular/core';
import { GlobalAuthService } from '../global-auth.service';
import { Subscription } from 'rxjs';
import { AdminAuthService } from '../admin/admin-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  userIsAuthenticated = false;
  isAdmin = false;
  //to subscribe to observable made in global-auth-service.ts
  private authListenerSubscription: Subscription;
  //to subscribe to observable made in admin-auth-service.ts
  private adminListenerSubscription: Subscription;

  constructor(private globalAuthService: GlobalAuthService, private adminAuthService: AdminAuthService) { }

  ngOnInit() {
    //for auto authentication
    this.userIsAuthenticated = this.globalAuthService.getIsAuth();
    //subscribe to listener for status of auth
    this.authListenerSubscription = this.globalAuthService.getAuthStatusListener()
      .subscribe( isAuthenticated  => {
        //set based off result of above call to authService
        this.userIsAuthenticated = isAuthenticated;
      });
    this.isAdmin = this.adminAuthService.getIsAdmin();
    this.adminListenerSubscription = this.adminAuthService.getAdminStatusListener()
      .subscribe( isAdmin  => {
        //set based off result of above call to authService
        this.isAdmin = isAdmin;
      });
  }

  //for logout
  onLogout(){
    this.globalAuthService.logoutUser();
    //ensures that system thinks isAdmin == false
    this.adminAuthService.setAdminStatusListner(false);
  }

  ngOnDestroy(){
    //unsubscribe to listener
    this.authListenerSubscription.unsubscribe();
    this.adminListenerSubscription.unsubscribe();
   }

}
