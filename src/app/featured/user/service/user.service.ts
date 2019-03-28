import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, retry, tap, map, debounceTime } from "rxjs/operators";

import { UtilService } from "../../../shared/core/service/util.service";
import { AuthService } from "../../../shared/core/service/auth.service";

import { environment } from "../../../../environments/environment";
import { User } from "../model/user";
import { ApiResponse } from "../../../shared/core/model/api-response";

@Injectable()
export class UserService {
  readonly apiBaseUrl: string = `${environment.apiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private utilService: UtilService,
    public authService: AuthService
  ) {}

  //Index
  indexUser(): Observable<User[]> {
    return this.http.get<ApiResponse>(this.apiBaseUrl).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : fetched all users`);
      }),
      map(response => {
        return response.data as User[];
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "indexUser",
          error
        )
      )
    );
  }

  //Get user
  getUser(username: string): Observable<User> {
    const url = `${this.apiBaseUrl}/${username}`;
    return this.http.get<ApiResponse>(url).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(
          `${this.constructor.name} : fetched username : ${username}`
        );
      }),
      map(response => {
        return response.data as User;
      }),
      catchError(error =>
        this.utilService.handleApiError(this.constructor.name, "getUser", error)
      )
    );
  }

  // Create User
  createUser(user: User): Observable<User> {
    return this.http.post<ApiResponse>(this.apiBaseUrl, user).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : createUser success`);
      }),
      map(response => {
        return response.data as User;
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "createUser",
          error
        )
      )
    );
  }

  /** PUT: update the user on the server */
  updateUser(username: string, user: User): Observable<User> {
    const url: string = `${this.apiBaseUrl}/${username}`;
    return this.http.put<ApiResponse>(url, user).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : updateUser success`);
      }),
      map(response => {
        return response.data as User;
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "updateUser",
          error
        )
      )
    );
  }

  //delete user
  deleteUser(username: string): Observable<User> {
    const url: string = `${this.apiBaseUrl}/${username}`;
    return this.http.delete<ApiResponse>(url).pipe(
      retry(3),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : deleteUser success`);
        this.authService.logout();
      }),
      map(response => {
        return response.data as User;
      }),
      catchError(error =>
        this.utilService.handleApiError(this.constructor.name, "deleteUser", error)
      )
    );
  }
}
