import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
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

        let header: HttpHeaders = req.headers
          .set("Authorization", "Basic " + creds)
          .set("Cache-Control", "no-cache")
          .set("Pragma", "no-cache")
          .set("Expires", "Sat, 01 Jan 2000 00:00:00 GMT");

        //header.set("Authorization", "Basic " + creds);

        const cloned = req.clone({
            headers: header
        });

        return next.handle(cloned);
    }
}
