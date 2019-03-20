import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public storageLocation: string = 'creds';

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  
  constructor(private router: Router, private http: HttpClient) { }

  login(loginData: Login) {

    localStorage.setItem(this.storageLocation, btoa(`${loginData.username}:${loginData.password}`));

    this.attemptLogin();
  }

  attemptLogin() {
    this.http.get(`${this.baseUrl}/login`).subscribe(
      (result: User) => {
        console.log(result.access);
        this.loggedIn.next(true);
        this.router.navigate(['/']);
      },
      (err: Error) => {
        console.error(err);
        if(err.error !== undefined) {
          console.log(err.error.message);
        }
      }
    );
  }

  autoLogin() {
    if(localStorage.getItem(this.storageLocation)) {
      console.log('Attmeping to auto login');
      this.attemptLogin();
    }
  }

  logout() {
    localStorage.removeItem(this.storageLocation);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
