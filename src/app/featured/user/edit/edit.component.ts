import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette, MatTooltip } from "@angular/material";

import { UserService } from "../service/user.service";
import { UtilService } from "../../../shared/core/service/util.service";

import { ApiResponse } from "../../../shared/core/model/api-response";
import { User } from "../model/user";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class EditComponent implements OnInit {
  user: User;

  color: ThemePalette;

  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    name: "Name is required!",
    email: "",
    currentPassword: "Current password is required!",
    newPassword: "",
    passwordConfirmation: ""
  };
  formErrorMessages = {
    name: {
      required: "Name is required!",
      pattern: "Should be 4-12 characters!"
    },
    email: {
      pattern: "Should be a vaild email address!"
    },
    currentPassword: {
      required: "Current password is required!",
      pattern:
        "Should be minimum 8 characters of alphabet and number combination!",

      invalid: "Current Password is invalid!"
    },
    newPassword: {
      pattern:
        "Should be minimum 8 characters of alphabet and number combination!"
    },
    passwordConfirmation: {
      match: "Password Confirmation does not matched!"
    }
  };

  @ViewChild("updateTooltip") updateTooltip: MatTooltip;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private userService: UserService,
    private utilService: UtilService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getUser();
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.formBuilder.group(
      {
        name: [
          { value: this.user.name, disabled: false },
          [Validators.required, Validators.pattern(/^.{4,12}$/)]
        ],
        email: [
          { value: this.user.email, disabled: false },
          [
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            )
          ]
        ],
        currentPassword: [
          "",
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)
          ]
        ],
        newPassword: [
          "",
          [Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)]
        ],
        passwordConfirmation: [""]
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
      this.updateTooltip.message = null;
    });
  }

  private customValidation(group: FormGroup) {
    const password = group.get("newPassword");
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
    const username: string = this.route.snapshot.paramMap.get("username");
    this.utilService.makeFormDirtyAndUpdateErrors(
      this.form,
      this.formErrors,
      this.formErrorMessages
    );
    if (this.form.valid) {
      this.userService.updateUser(username, this.form.value).subscribe(
        data => {
          this.router.navigate(["/user", username]);
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
          this.updateTooltip.message = this.errorResponse.message;
          this.updateTooltip.show();
        }
      );
    } else {
      this.setColor("warn", 400);
      console.log("updateUser failed");
    }
  }

  getUser(): void {
    this.user = this.route.snapshot.data["user"];
  }

  errorCheck(): void {
    for (const field in this.formErrors) {
      if (this.formErrors[field] === "Current Password is invalid!") {
        this.form.get(field).setErrors({ invalid: true });
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
