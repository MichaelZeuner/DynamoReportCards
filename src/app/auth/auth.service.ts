import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../interfaces/login';
import { MatSnackBar } from '@angular/material';
import { ErrorApi } from '../interfaces/error-api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public storageLocation: string = 'creds';
  public user: User; 
  
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  
  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar) { }

  login(loginData: Login) {

    localStorage.setItem(this.storageLocation, btoa(`${loginData.username}:${loginData.password}`));

    this.attemptLogin(true);
  }

  attemptLogin(isErrorDisplayed: boolean) {
    this.http.get(`${this.baseUrl}/login`).subscribe(
      (result: User) => {
        console.log(result.access);
        this.user = result;
        this.loggedIn.next(true);
        this.router.navigate(['/']);
      },
      (err: ErrorApi) => {
        console.error(err);
        let message = 'Error Unknown...';
        if(err.error !== undefined) {
          message = err.error.message;
        }
        if(isErrorDisplayed) {
          this.openSnackBar(message)
        }
      }
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

  autoLogin() {
    if(localStorage.getItem(this.storageLocation)) {
      console.log('Attmeping to auto login');
      this.attemptLogin(false);
    }
  }

  logout() {
    localStorage.removeItem(this.storageLocation);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}