import { DataService } from "../data.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { User } from "../interfaces/user";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-user-select",
  template: `
    <mat-form-field class="w-100 input-headline">
      <input
        #userName
        type="text"
        placeholder="Select User"
        aria-label="Users Name"
        matInput
        [value]="userNameForInput"
        [formControl]="myControlUser"
        [matAutocomplete]="auto"
        (input)="onUserChange($event.target.value)"
      />

      <mat-autocomplete
        autoActiveFirstOption
        #auto="matAutocomplete"
        (optionSelected)="onUserChange($event.option.value)"
      >
        <mat-option
          *ngFor="let userFilter of filteredUsers | async"
          [value]="getUserNameAndAccessLevel(userFilter)"
        >
          {{ getUserNameAndAccessLevel(userFilter) }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: []
})
export class UserSelectComponent implements OnInit {
  @Output() selectedUserChange = new EventEmitter<User>();
  @ViewChild("userName") userName;

  public myControlUser = new FormControl();
  public filteredUsers: Observable<User[]>;

  protected users: User[];

  constructor(private data: DataService, private auth: AuthService) {}

  protected previousUser: User = null;
  protected _user: User = null;

  @Input()
  set user(user: User) {
    console.log("USER:", user);
    this.previousUser = this._user;
    if (typeof user === "undefined") {
      this._user = null;
    } else {
      this._user = user;
    }
  }

  get userNameForInput(): string {
    if (this.previousUser !== this._user) {
      if (this._user !== null) {
        return this.getUserNameAndAccessLevel(this._user);
      } else {
        return "";
      }
    } else {
      return this.myControlUser.value;
    }
  }

  getUserNameAndAccessLevel(user: User) {
    if (!user) {
      return "";
    }
    return user.first_name + " " + user.last_name + " (" + user.access + ")";
  }

  ngOnInit() {
    this.data.getUsers().subscribe((data: User[]) => {
      this.users = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].id !== this.auth.user.id) {
          this.users.push(data[i]);
        }
      }

      this.filteredUsers = this.myControlUser.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
      );
    });

    console.log(this._user);
    if (this._user !== null && <any>this._user !== false) {
      console.log("setting value!!!");
      this.myControlUser.setValue(this.getUserNameAndAccessLevel(this._user));
    }
  }

  private _filter(value: string): User[] {
    const filterValue = value !== null ? value.toLowerCase() : "";
    console.log("filter value", filterValue);

    return this.users.filter(
      option =>
        this.getUserNameAndAccessLevel(option)
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }

  public clearUser() {
    this.myControlUser.setValue("");
    this.onUserChange("");
  }

  onUserChange(searchValue: string) {
    const currentUser = this._user;
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (this.getUserNameAndAccessLevel(user) === searchValue) {
        this._user = user;
        break;
      } else {
        this._user = null;
      }
    }

    if (currentUser !== this._user) {
      this.selectedUserChange.emit(this._user);
    }
  }
}
