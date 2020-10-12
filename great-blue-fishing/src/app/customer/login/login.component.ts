import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalAuthService } from 'src/app/global-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  form: FormGroup;

  //to handle subscription in ngoninit
  private authStatusSub: Subscription;

  constructor(private globalAuthService: GlobalAuthService) { }

  ngOnInit() {
    //form mapping
    this.form = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      //password must contain one digit, one lowercase alpha, one uppercase alpha, one special character, and be 8 >= x <= 32 characters
      'password': new FormControl(null, {validators: [Validators.required]})
    });

    //for handline error
    this.authStatusSub = this.globalAuthService.getAuthStatusListener().subscribe(
      authStatus =>{
        this.isLoading = false;
      });
  }

  onLogin(){
    if (this.form.invalid) {
      return
    }
    this.isLoading = true;
    this.globalAuthService.loginUser(this.form.value.email, this.form.value.password);

    this.form.reset();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
