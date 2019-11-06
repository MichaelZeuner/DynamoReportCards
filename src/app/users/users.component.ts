import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { User } from "../interfaces/user";
import { ErrorApi } from "../interfaces/error-api";
import {
  MatInput,
  MatButtonToggle,
  MatButtonToggleGroup,
  PageEvent
} from "@angular/material";
import { DialogService } from "../shared/dialog.service";
import { MainNavComponent } from "../main-nav/main-nav.component";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  public usersBase: User[] = [];
  public users: User[] = [];
  public usersDisplayed: User[] = [];
  public pageinatorIndex: number = 0;
  public pageinatorSize: number = 10;

  constructor(
    private data: DataService,
    private dialog: DialogService,
    private mainNav: MainNavComponent
  ) {}

  ngOnInit() {
    this.mainNav.displayLoading = true;
    this.data.getUsers().subscribe(
      (data: User[]) => {
        this.mainNav.displayLoading = false;
        this.usersBase = data;
        this.users = this.usersBase;
        console.log(this.users);
        this.refreshPage();
      },
      () => {
        this.mainNav.displayLoading = false;
      }
    );
  }

  deleteUser(id: number, firstName: string, lastName: string) {
    this.dialog
      .openConfirmDialog(
        'Are you sure you wish to remove the user "' +
          firstName +
          " " +
          lastName +
          '"?'
      )
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.mainNav.displayLoading = true;
          this.data.deleteUser(id).subscribe(
            () => {
              this.mainNav.displayLoading = false;
              for (let i = 0; i < this.usersBase.length; i++) {
                const currentUser = this.usersBase[i];
                if (currentUser.id === id) {
                  this.dialog.openSnackBar("User deleted!");
                  this.usersBase.splice(i, 1);
                  this.refreshPage();
                  return;
                }
              }
            },
            () => {
              this.mainNav.displayLoading = false;
            }
          );
        }
      });
  }

  createUser(
    firstName: MatInput,
    lastName: MatInput,
    email: MatInput,
    password: MatInput,
    passwordConfirm: MatInput,
    accessLevel: MatButtonToggleGroup
  ) {
    if (
      this.checkInput(
        true,
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        accessLevel
      ) === false
    ) {
      return;
    }

    let user: User = {
      email: email.value,
      password: password.value,
      access: accessLevel.value,
      first_name: firstName.value,
      last_name: lastName.value
    };

    console.log(user);
    this.mainNav.displayLoading = true;
    this.data.addUser(user).subscribe(
      (data: User) => {
        this.mainNav.displayLoading = false;
        this.usersBase.push(data);
        firstName.value = "";
        lastName.value = "";
        email.value = "";
        password.value = "";
        passwordConfirm.value = "";
        this.dialog.openSnackBar("User Created!");
      },
      () => {
        this.mainNav.displayLoading = false;
      }
    );
    this.refreshPage();
  }

  updateUser(
    id: number,
    firstName: MatInput,
    lastName: MatInput,
    email: MatInput,
    password: MatInput,
    passwordConfirm: MatInput,
    accessLevel: MatButtonToggleGroup
  ) {
    if (
      this.checkInput(
        false,
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        accessLevel
      ) === false
    ) {
      return;
    }
    let user: User = {
      id: id,
      email: email.value,
      password: password.value,
      access: accessLevel.value,
      first_name: firstName.value,
      last_name: lastName.value
    };

    this.mainNav.displayLoading = true;
    this.data.putUser(user).subscribe(
      (data: User) => {
        this.mainNav.displayLoading = false;
        console.log(data);
        this.dialog.openSnackBar("User Updated!");
      },
      (error: ErrorApi) => {
        console.log(error);
        this.mainNav.displayLoading = false;
        this.dialog.openSnackBar(
          "Failed to Update User. Likely cause is a duplicated email address."
        );
      }
    );

    console.log(user);
  }

  checkInput(
    passwordRequired: boolean,
    firstName: MatInput,
    lastName: MatInput,
    email: MatInput,
    password: MatInput,
    passwordConfirm: MatInput,
    accessLevel: MatButtonToggleGroup
  ) {
    if (firstName.value === "") {
      this.dialog.openSnackBar("First Name required!");
      firstName.focus();
      return false;
    }
    if (lastName.value === "") {
      this.dialog.openSnackBar("Last Name required!");
      lastName.focus();
      return false;
    }
    if (email.value === "") {
      this.dialog.openSnackBar("Email required!");
      email.focus();
      return false;
    }
    if (password.value === "" && passwordRequired) {
      this.dialog.openSnackBar("Password required!");
      password.focus();
      return false;
    }
    if (passwordConfirm.value === "" && passwordRequired) {
      this.dialog.openSnackBar("Password Confirm required!");
      passwordConfirm.focus();
      return false;
    }
    if (typeof accessLevel.value === "undefined") {
      this.dialog.openSnackBar("Access Level required!");
      return false;
    }
    if (password.value !== passwordConfirm.value) {
      this.dialog.openSnackBar("Password and Confirm Password do not match.");
      return false;
    }
    return true;
  }

  searchUsers(firstName: MatInput, lastName: MatInput) {
    if (firstName === null || lastName === null) {
      this.users = this.usersBase;
    } else {
      this.users = [];
      for (let i = 0; i < this.usersBase.length; i++) {
        if (
          this.usersBase[i].first_name
            .toUpperCase()
            .indexOf(firstName.value.toUpperCase()) > -1 &&
          this.usersBase[i].last_name
            .toUpperCase()
            .indexOf(lastName.value.toUpperCase()) > -1
        ) {
          this.users.push(this.usersBase[i]);
        }
      }
    }
    this.refreshPage();
  }

  refreshPage() {
    this.pageinatorIndex = 0;
    this.pageChanged(null);
  }

  pageChanged(event: PageEvent) {
    const startingIndex: number =
      event !== null ? event.pageIndex * event.pageSize : 0;
    let endingIndex: number =
      event !== null
        ? (event.pageIndex + 1) * event.pageSize
        : this.pageinatorSize;
    if (endingIndex > this.users.length) {
      endingIndex = this.users.length;
    }

    this.usersDisplayed = [];
    for (let i = startingIndex; i < endingIndex; i++) {
      this.usersDisplayed.push(this.users[i]);
    }
  }
}
