import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { ThemePalette, MatTooltip } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { UtilService } from "../../../shared/core/service/util.service";
import { PostService } from "../../post/service/post.service";

import { ApiResponse } from "../../../shared/core/model/api-response";

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"]
})
export class NewComponent implements OnInit {
  color: ThemePalette;

  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    title: "Title is required!",
    body: "body is required!"
  };
  formErrorMessages = {
    title: {
      required: "Title is required!",
      pattern: "Title should be less than 100 characters!"
    },
    body: {
      required: "body is required!"
    }
  };

  @ViewChild("createTooltip") createTooltip: MatTooltip;

  constructor(
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private location: Location,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      title: ["", [Validators.required, Validators.pattern(/^.{1,100}$/)]],
      body: ["", [Validators.required]]
    });

    this.form;
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

  onSubmit() {
    this.utilService.makeFormDirtyAndUpdateErrors(
      this.form,
      this.formErrors,
      this.formErrorMessages
    );
    if (this.form.valid) {
      this.postService.createPost(this.form.value).subscribe(
        data => {
          this.router.navigate(["/post", "list"]);
        },
        err => {
          this.errorResponse = err;
          this.utilService.handleFormSubmitError(
            this.errorResponse,
            this.form,
            this.formErrors
          );
          this.setColor("warn", 400);
          this.createTooltip.message = this.errorResponse.message;
          this.createTooltip.show();
        }
      );
    } else {
      this.setColor("warn", 400);
      console.log("createUser failed");
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
