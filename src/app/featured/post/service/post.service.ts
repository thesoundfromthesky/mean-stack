import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, retry, tap, map, debounceTime } from "rxjs/operators";

import { UtilService } from "../../../shared/core/service/util.service";
import { AuthService } from "../../../shared/core/service/auth.service";

import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../shared/core/model/api-response";
import { Post } from "../model/post";

@Injectable()
export class PostService {
  readonly apiBaseUrl: string = `${environment.apiBaseUrl}/posts`;

  constructor(
    private http: HttpClient,
    private utilService: UtilService,
    public authService: AuthService
  ) {}

  //Index Post
  indexPost(page: string, limit: string): Observable<Post[]> {
    page = page ? page : "1";
    limit = limit ? limit : "15";
    return this.http
      .get<ApiResponse>(`${this.apiBaseUrl}?page=${page}&limit=${limit}`)
      .pipe(
        retry(3),
        debounceTime(300),
        tap(response => {
          this.utilService.checkSuccess(response);
          this.utilService.log(`${this.constructor.name} : fetched all posts`);
        }),
        map(response => {
          return response.data as Post[];
        }),
        catchError(error =>
          this.utilService.handleApiError(
            this.constructor.name,
            "indexPost",
            error
          )
        )
      );
  }

  //Get Post
  getPost(id: string): Observable<Post> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.get<ApiResponse>(url).pipe(
      retry(3),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : fetched post : ${id}`);
      }),
      map(response => {
        return response.data as Post;
      }),
      catchError(error =>
        this.utilService.handleApiError(this.constructor.name, "getPost", error)
      )
    );
  }

  // Create Post
  createPost(post: Post): Observable<Post> {
    return this.http.post<ApiResponse>(this.apiBaseUrl, post).pipe(
      retry(3),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : createPost success`);
      }),
      map(response => {
        return response.data as Post;
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "createPost",
          error
        )
      )
    );
  }

  /** PUT: update the post on the server */
  updatePost(id: string, post: Post): Observable<Post> {
    const url: string = `${this.apiBaseUrl}/${id}`;
    return this.http.put<ApiResponse>(url, post).pipe(
      retry(3),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : updatePost success`);
      }),
      map(response => {
        return response.data as Post;
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "updatePost",
          error
        )
      )
    );
  }

  //delete user
  deletePost(id: string): Observable<Post> {
    const url: string = `${this.apiBaseUrl}/${id}`;
    return this.http.delete<ApiResponse>(url).pipe(
      retry(3),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : deletePost success`);
      }),
      map(response => {
        return response.data as Post;
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "deletePost",
          error
        )
      )
    );
  }
}
