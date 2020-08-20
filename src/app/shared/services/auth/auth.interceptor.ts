import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse,
    HttpErrorResponse, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    request: any;
    constructor() {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('access_token') && req.url.indexOf('api.ai') === -1) {
            this.request = req.clone({
                headers: req.headers.set('Authorization', localStorage.getItem('access_token'))
            });
        } else {
            this.request = req;
        }
        return next
        .handle(this.request)
        .do((ev: HttpEvent<any>) => {
        })
        .catch(response => {
          if (response instanceof HttpErrorResponse) {
          }
          return Observable.throw(response);
        });
    }
}


