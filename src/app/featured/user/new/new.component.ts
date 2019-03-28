import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette, MatTooltip } from "@angular/material";

import { UserService } from "../service/user.service";
import { UtilService } from "../../../shared/core/service/util.service";

import { ApiResponse } from "../../../shared/core/model/api-response";

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"],
  host: { class: "hello" }
})
export class NewComponent implements OnInit {
  color: ThemePalette;

  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    username: "Username is required!",
    name: "Name is required!",
    email: "",
    password: "Password is required!",
    passwordConfirmation: "Password Confirmation is required!"
  };
  formErrorMessages = {
    username: {
      required: "Username is required!",
      pattern: "Should be 4-12 characters!",
      duplicate: "This username already exists!"
    },
    name: {
      required: "Name is required!",
      pattern: "Should be 4-12 characters!"
    },
    email: {
      pattern: "Should be a vaild email address!"
    },
    password: {
      required: "Password is required!",
      pattern:
        "Should be minimum 8 characters of alphabet and number combination!"
    },
    passwordConfirmation: {
      required: "Password Confirmation is required!",
      match: "Password Confirmation does not matched!"
    }
  };

  @ViewChild("createTooltip") createTooltip: MatTooltip;

  constructor(
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private userService: UserService
  ) {}

  ngOnInit() {

    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group(
      {
        username: ["", [Validators.required, Validators.pattern(/^.{4,12}$/)]],
        name: ["", [Validators.required, Validators.pattern(/^.{4,12}$/)]],
        email: [
          "",
          [
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            )
          ]
        ],
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)
          ]
        ],
        passwordConfirmation: ["", [Validators.required]]
      },
      {
        validator: this.customValidation
      }
    );
    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(
        this.form,
        this.formErrors,
        this.formErrorMessages
      );
      this.color = null;
      this.createTooltip.message = null;
    });
  }

  private customValidation(group: FormGroup) {
    const password = group.get("password");
    const passwordConfirmation = group.get("passwordConfirmation");
    if (
      password.dirty &&
      passwordConfirmation.dirty &&
      password.value != passwordConfirmation.value
    ) {
      passwordConfirmation.setErrors({ match: true });
    }
  }

  onSubmit() {
    this.utilService.makeFormDirtyAndUpdateErrors(
      this.form,
      this.formErrors,
      this.formErrorMessages
    );
    if (this.form.valid) {
      this.userService.createUser(this.form.value).subscribe(
        data => {
          this.router.navigate(["/"]);
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
          this.createTooltip.message = this.errorResponse.message;
          this.createTooltip.show();
          console.log("createUser failed");
        }
      );
    } else {
      this.setColor("warn", 400);
    }
  }

  errorCheck(): void {
    for (const field in this.formErrors) {
      if (this.formErrors[field] === "This username already exists!") {
        this.form.get(field).setErrors({ duplicate: true });
      }
    }
  }

  setColor(color: ThemePalette, time: number) {
    setTimeout(() => {
      this.color = color;
    }, time);
  }

  goBack(): void {
    this.location.back();
  }
}
