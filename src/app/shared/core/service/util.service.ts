import { Injectable } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";

import { FormGroup } from "@angular/forms";
import { MatSidenavContainer } from '@angular/material';

import { MessageService } from "./message.service";

import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../model/api-response";

@Injectable()
export class UtilService {
  sidenavContainer: MatSidenavContainer;
  
  constructor(private messageService: MessageService) {}

  checkSuccess(response: ApiResponse): void {
    if (!response.success) {
      throw response;
    }
  }

  handleApiError(
    service: string,
    operation: string,
    error: any
  ): Observable<any> {
    if (!environment.production) {
      console.error(`${operation} failed:`, error);
      this.log(`${service} : ${operation} failed`);
    }
    return throwError(error);
  }

  makeAllFormFieldsDirty(form: FormGroup): void {
    if (!form) {
      return;
    }

    for (const field in form.controls) {
      const control = form.get(field);
      if (control) control.markAsDirty();
    }
  }

  updateFormErrors(
    form: FormGroup,
    formErrors: any,
    formErrorMessages: any
  ): void {
    if (!form) {
      return;
    }

    for (const field in formErrors) {
      formErrors[field] = "";
      const control = form.get(field);
      if (control && (control.touched || control.dirty) && !control.valid) {
        const messages = formErrorMessages[field];
        if (messages) {
          for (const key in control.errors) {
            formErrors[field] += `${messages[key]} `;
          }
        }
      }
    }
  }

  makeFormDirtyAndUpdateErrors(
    form: FormGroup,
    formErrors: any,
    formErrorMessages: any
  ): void {
    this.makeAllFormFieldsDirty(form);
    this.updateFormErrors(form, formErrors, formErrorMessages);
  }

  handleFormSubmitError(
    response: ApiResponse,
    form: FormGroup,
    formErrors: any
  ): void {
    if (response.errors) {
      for (const field in formErrors) {
        const control = form.get(field);
        if (response.errors[field] && response.errors[field].message) {
          formErrors[field] += response.errors[field].message;
        }
      }
      if (response.errors.unhandled) {
        response.message += response.errors.unhandled;
      }
    }
  }

  log(message: string): void {
    this.messageService.add(`${message}`);
  }
}
