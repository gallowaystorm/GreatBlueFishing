import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminAuthService } from '../admin-auth.service';
import { UserData } from '../../user-model';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  isLoading = false;
  form: FormGroup;

  //for users list
  adminUsersList: UserData[] = [];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor(public adminAuthService: AdminAuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'adminEmail': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      //password must contain one digit, one lowercase alpha, one uppercase alpha, one special character, and be 8 >= x <= 32 characters
      'adminPassword': new FormControl(null, {validators: [Validators.required]}),
      'adminFirstName': new FormControl(null, {validators: [Validators.required]}),
      'adminLastName': new FormControl(null, {validators: [Validators.required]})
    });
  }

  onAdminCreation(){
    if (this.form.invalid) {
      return
    }
    this.isLoading = true;
    var createAdmin = this.adminAuthService.createAdminUser(this.form.value.adminEmail, this.form.value.adminPassword, this.form.value.adminFirstName, this.form.value.adminLastName);
    console.log(createAdmin);
    if (createAdmin){
      this.isLoading = false;
      alert("You have created an admin user successfully!");
    }
    this.form.reset();
  }

}
