import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminAuthService } from '../admin-auth.service';
import { UserData } from '../../user-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit, OnDestroy {

  isLoading = false;
  form: FormGroup;
  private adminUsersSub: Subscription;

  //for users list
  adminUsersList: UserData[] = [];
  displayedColumns: string[] = ['email', 'lastName', 'firstName'];

  constructor(public adminAuthService: AdminAuthService) { }

  ngOnInit() {
    //for form
    this.form = new FormGroup({
      'adminEmail': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      //password must contain one digit, one lowercase alpha, one uppercase alpha, one special character, and be 8 >= x <= 32 characters
      'adminPassword': new FormControl(null, {validators: [Validators.required]}),
      'adminFirstName': new FormControl(null, {validators: [Validators.required]}),
      'adminLastName': new FormControl(null, {validators: [Validators.required]})
    });

    //for list
    this.adminUsersSub = this.adminAuthService.getAdminUserUpdateListener().subscribe((adminUsersData: {adminUsers: UserData[]})  => {
      this.isLoading = false;
      this.adminUsersList = adminUsersData.adminUsers;
    });

    this.adminAuthService.getAdminUsers();
  }

  onAdminCreation(){
    if (this.form.invalid) {
      return
    }
    this.isLoading = true;
    var createAdmin = this.adminAuthService.createAdminUser(this.form.value.adminEmail, this.form.value.adminPassword, this.form.value.adminFirstName, this.form.value.adminLastName);
    if (createAdmin){
      this.isLoading = false;
      alert("You have created an admin user successfully!");
    }
    this.form.reset();
  }

  ngOnDestroy(){
    this.adminUsersSub.unsubscribe();
  }
}
