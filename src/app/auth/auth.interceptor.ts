import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {

        const creds = localStorage.getItem(this.authService.storageLocation);

        const cloned = req.clone({
            headers: req.headers.set("Authorization", "Basic " + creds)
        });

        return next.handle(cloned);
    }
}