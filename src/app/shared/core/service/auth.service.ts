import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable } from "rxjs";
import { catchError, tap, map, retry, debounceTime } from "rxjs/operators";

import { UtilService } from "./util.service";

import { environment } from "src/environments/environment";
import { ApiResponse } from "../model/api-response";
import { User } from "../../../featured/user/model/user";

@Injectable()
export class AuthService {
  private readonly apiBaseUrl: string = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private utilService: UtilService
  ) {}

  login(username: string, password: string): Observable<ApiResponse> {
    const user: object = {
      username: username,
      password: password
    };
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/login`, user).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        localStorage.setItem("token", response.data);
        this.utilService.log(`${this.constructor.name} : login success`);
      }),
      catchError(error =>
        this.utilService.handleApiError(this.constructor.name, "login", error)
      )
    );
  }

  me(): Observable<User> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/me`).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        localStorage.setItem("currentUser", JSON.stringify(response.data));
        this.utilService.log(`${this.constructor.name} : me success`);
      }),
      map(response => {
        return response.data as User;
      }),
      catchError(error => {
        this.logout();
        return this.utilService.handleApiError(
          this.constructor.name,
          "me",
          error
        );
      })
    );
  }

  refresh(): Observable<User> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/refresh`).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        localStorage.setItem("token", response.data);
        this.utilService.log(`${this.constructor.name} : refresh success`);
      }),
      map(response => {
        if (!this.getCurrentUser()) {
          this.me().subscribe(
            data => {
              console.log("me success", data);
            },
            err => {
              console.error("me failed:", err);
            }
          );
        } else {
          return response.data as User;
        }
      }),
      catchError(error => {
        this.logout();
        return this.utilService.handleApiError(
          this.constructor.name,
          "refresh",
          error
        );
      })
    );
  }

  getToken(): string {
    return localStorage.getItem("token");
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem("currentUser")) as User;
  }

  isLoggedIn(): boolean {
    const token: string = localStorage.getItem("token");
    if (token) return true;
    else return false;
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    if (!environment.production) {
      this.utilService.log(`${this.constructor.name} : logout success`);
    }
    this.router.navigate(["/"]);
  }
}
