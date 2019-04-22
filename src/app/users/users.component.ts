import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../interfaces/user';
import { ErrorApi } from '../interfaces/error-api';
import { MatInput, MatButtonToggle, MatButtonToggleGroup } from '@angular/material';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public users: User[] = [];

  constructor(private data: DataService, private dialog: DialogService) { }

  ngOnInit() {
    this.data.getUsers().subscribe(
      (data: User[]) => { 
        this.users = data; 
        console.log(this.users);
      }
    );
  }

  updateUser(firstName: MatInput, 
              lastName: MatInput, 
              username: MatInput, 
              email: MatInput, 
              password: MatInput, 
              passwordConfirm: MatInput,
              accessLevel: MatButtonToggleGroup) {
    if(password.value === passwordConfirm.value) {
      console.log(firstName.value);
      console.log(lastName.value);
      console.log(username.value);
      console.log(email.value);
      console.log(accessLevel.value);
    } else {
      this.dialog.openSnackBar("Password and Confirm Password do not match.");
    }
  }

}
