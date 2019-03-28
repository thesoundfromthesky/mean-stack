import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, retry, tap, map, debounceTime } from "rxjs/operators";

import { UtilService } from "../../../shared/core/service/util.service";

import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../shared/core/model/api-response";
import { Counter } from "../model/counter";

@Injectable()
export class CounterService {
  readonly apiBaseUrl: string = `${environment.apiBaseUrl}/counters`;

  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) {}

  getCounter(): Observable<Counter> {
    return this.http.get<ApiResponse>(this.apiBaseUrl).pipe(
      retry(3),
      debounceTime(300),
      tap(response => {
        this.utilService.checkSuccess(response);
        this.utilService.log(`${this.constructor.name} : getCounter success`);
      }),
      map(response => {
        return response.data as Counter;
      }),
      catchError(error =>
        this.utilService.handleApiError(
          this.constructor.name,
          "getCounter",
          error
        )
      )
    );
  }  
}
