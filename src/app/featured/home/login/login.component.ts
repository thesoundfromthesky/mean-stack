import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ThemePalette, MatTooltip } from "@angular/material";

import { AuthService } from "../../../shared/core/service/auth.service";
import { UtilService } from "../../../shared/core/service/util.service";
import { ApiResponse } from "../../../shared/core/model/api-response";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
//OnDestroy
export class LoginComponent implements OnInit {
  redirectTo: string;

  color: ThemePalette;

  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    username: "Username is required!",
    password: "Password is required!"
  };
  formErrorMessages = {
    username: {
      required: "Username is required!"
    },
    password: {
      required: "Password is required!"
    }
  };

  @ViewChild("loginTooltip") loginTooltip: MatTooltip;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    // this.utilService.isAuto.next(true);
    this.buildForm();
    this.redirectTo = this.route.snapshot.queryParamMap.get("redirectTo");
  }

  // ngOnDestroy() {
  //   this.utilService.isAuto.next(false);
  // }

  buildForm(): void {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(
        this.form,
        this.formErrors,
        this.formErrorMessages
      );
      this.color = null;
      this.loginTooltip.message = null;
    });
  }

  onSubmit() {
    this.utilService.makeFormDirtyAndUpdateErrors(
      this.form,
      this.formErrors,
      this.formErrorMessages
    );
    if (this.form.valid) {
      this.authService
        .login(this.form.value.username, this.form.value.password)
        .subscribe(
          data => {
            this.router.navigate([this.redirectTo ? this.redirectTo : "/"]);
          },
          err => {
            this.errorResponse = err;
            this.utilService.handleFormSubmitError(
              this.errorResponse,
              this.form,
              this.formErrors
            );
            this.errorCheck();
            this.setColor("warn", 400);
            this.loginTooltip.message = this.errorResponse.message;
            this.loginTooltip.show();
            console.log("login failed", err);
          }
        );
    } else {
      this.setColor("warn", 400);
    }
  }

  errorCheck(): void {
    for (const field in this.formErrors) {
      if (this.formErrors[field]) {
        this.form.get(field).setErrors({ error: true });
      }
    }
  }

  setColor(color: ThemePalette, time: number) {
    setTimeout(() => {
      this.color = color;
    }, time);
  }
}
