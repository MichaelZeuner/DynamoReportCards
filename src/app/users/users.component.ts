import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../interfaces/user';
import { ErrorApi } from '../interfaces/error-api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public users: User[] = [];

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.getUsers().subscribe(
      (data: User[]) => { 
        this.users = data; 
        console.log(this.users);
      }
    );
  }

}
