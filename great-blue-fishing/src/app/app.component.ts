import { Component, OnInit } from '@angular/core';
import { GlobalAuthService } from './global-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'great-blue-fishing';

  constructor(private globalAuthService: GlobalAuthService) {}

  ngOnInit(){
    //to auto authenticate user if they have previously logged in within expiration time
    this.globalAuthService.autoAuthUser();
  }

}
