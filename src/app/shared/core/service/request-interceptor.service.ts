import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HTTP_INTERCEPTORS,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";

import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { RequestCacheService } from "./request-cache.service";

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem("token");
    let newHeader: HttpHeaders = req.headers;
    newHeader = newHeader.set("Content-Type", "application/json");
    if (token) newHeader = newHeader.set("x-access-token", token);
    const newReq = req.clone({ headers: newHeader });
    return next.handle(newReq);
  }
}

@Injectable()
export class CachingInterceptorService implements HttpInterceptor {
  constructor(private cache: RequestCacheService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (req.method === "GET") {
    //   const cachedResponse = this.cache.get(req);
    //   return cachedResponse
    //     ? of(cachedResponse)
    //     : this.sendRequest(req, next, this.cache);
    // } else {
      return next.handle(req);
    // }
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCacheService
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          cache.put(req, event);
        }
      })
    );
  }
}

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CachingInterceptorService,
    multi: true
  }
];
