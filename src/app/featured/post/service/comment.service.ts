import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, retry, tap, map, debounceTime } from "rxjs/operators";

import { UtilService } from "../../../shared/core/service/util.service";
import { AuthService } from "../../../shared/core/service/auth.service";

import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../shared/core/model/api-response";
import { Comment } from "../model/comment";

@Injectable()
export class CommentService {
  readonly apiBaseUrl: string = `${environment.apiBaseUrl}/comments`;

  constructor(
    private http: HttpClient,
    private utilService: UtilService,
    public authService: AuthService
  ) {}

  //Index
  indexComment(id: string): Observable<Comment[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${id}`).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : fetched all posts`);
      }),
      map(response => {
        return response.data as Comment[];
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "indexComment",
          error
        )
      )
    );
  }

  // Create Comment
  createComment(id: string, comment: Comment): Observable<Comment[]> {
    return this.http
      .post<ApiResponse>(`${this.apiBaseUrl}/${id}`, comment)
      .pipe(
        retry(3),
        debounceTime(300),
        tap(response => {
          this.utilService.checkSuccess(response);
          this.utilService.log(
            `${this.constructor.name} : createComment success`
          );
        }),
        map(response => {
          return response.data as Comment[];
        }),
        catchError(error =>
          this.utilService.handleApiError(
            this.constructor.name,
            "createComment",
            error
          )
        )
      );
  }

  /** PUT: update the comment on the server */
  updateComment(
    id: string,
    commentId: string,
    comment: Comment
  ): Observable<Comment> {
    const url: string = `${this.apiBaseUrl}/${id}/${commentId}`;
    return this.http.put<ApiResponse>(url, comment).pipe(
      retry(3),      
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(
          `${this.constructor.name} : updateComment success`
        );
      }),
      map(response => {
        return response.data as Comment;
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "updateComment",
          error
        )
      )
    );
  }

  //delete Comment
  deleteComment(id: string, commentId: string): Observable<Comment[]> {
    const url: string = `${this.apiBaseUrl}/${id}/${commentId}`;
    return this.http.delete<ApiResponse>(url).pipe(
      retry(3),      
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(
          `${this.constructor.name} : deleteComment success`
        );
      }),
      map(response => {
        console.log(response.data.comments);
        return response.data as Comment[];
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "deleteComment",
          error
        )
      )
    );
  }
}
