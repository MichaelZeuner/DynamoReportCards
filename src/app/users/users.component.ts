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

  deleteUser(id: number, firstName: string, lastName: string) {
    this.dialog.openConfirmDialog('Are you sure you wish to remove the user "' + firstName + ' ' + lastName + '"?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.data.deleteUser(id).subscribe(() => {
          for(let i=0; i<this.users.length; i++) {
            const currentUser = this.users[i];
            if(currentUser.id === id) {
              this.dialog.openSnackBar("User deleted!");
              this.users.splice(i, 1);
              return;
            }
          }
        });
      }
    });
  }

  createUser(firstName: MatInput, 
              lastName: MatInput, 
              username: MatInput, 
              email: MatInput, 
              password: MatInput, 
              passwordConfirm: MatInput,
              accessLevel: MatButtonToggleGroup) {
    if(this.checkInput(true, firstName, lastName, username, email, password, passwordConfirm, accessLevel) === false) { return; }

    let user: User = {
      username: username.value,
      email: email.value,
      password: password.value,
      access: accessLevel.value,
      first_name: firstName.value,
      last_name: lastName.value
    }

    console.log(user);
    this.data.addUser(user).subscribe(
      (data: User) => {
        this.users.push(data);
        firstName.value = '';
        lastName.value = '';
        username.value = '';
        email.value = '';
        password.value = '';
        passwordConfirm.value = '';
      }
    )
  }

  updateUser( id: number,
              firstName: MatInput, 
              lastName: MatInput, 
              username: MatInput, 
              email: MatInput, 
              password: MatInput, 
              passwordConfirm: MatInput,
              accessLevel: MatButtonToggleGroup) {
    if(this.checkInput(false, firstName, lastName, username, email, password, passwordConfirm, accessLevel) === false) { return; }
    let user: User = {
      id: id,
      username: username.value,
      email: email.value,
      password: password.value,
      access: accessLevel.value,
      first_name: firstName.value,
      last_name: lastName.value
    }

    this.data.putUser(user).subscribe(
      (data: User) => { 
        console.log(data); 
        this.dialog.openSnackBar('User Updated!');
      },
      (error: ErrorApi) => { 
        console.log(error); 
        this.dialog.openSnackBar(error.error.message);
      }
    );

    console.log(user);
  }

  checkInput(passwordRequired: boolean,
              firstName: MatInput, 
              lastName: MatInput, 
              username: MatInput, 
              email: MatInput, 
              password: MatInput, 
              passwordConfirm: MatInput,
              accessLevel: MatButtonToggleGroup) {
    if(firstName.value === '') {
      this.dialog.openSnackBar('First Name required!');
      firstName.focus();
      return false;
    }
    if(lastName.value === '') {
      this.dialog.openSnackBar('Last Name required!');
      lastName.focus();
      return false;
    }
    if(username.value === '') {
      this.dialog.openSnackBar('Username required!');
      username.focus();
      return false;
    }
    if(email.value === '') {
      this.dialog.openSnackBar('Email required!');
      email.focus();
      return false;
    }
    if(password.value === '' && passwordRequired) {
      this.dialog.openSnackBar('Password required!');
      password.focus();
      return false;
    }
    if(passwordConfirm.value === '' && passwordRequired) {
      this.dialog.openSnackBar('Password Confirm required!');
      passwordConfirm.focus();
      return false;
    }
    if(typeof accessLevel.value === 'undefined') {
      this.dialog.openSnackBar('Access Level required!');
      return false;
    }
    if(password.value !== passwordConfirm.value) {
      this.dialog.openSnackBar("Password and Confirm Password do not match.");
      return false;
    }
    return true;
  }
}
