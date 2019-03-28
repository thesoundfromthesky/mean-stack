import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette, MatTooltip } from "@angular/material";

import { PostService } from "../service/post.service";
import { UtilService } from "../../../shared/core/service/util.service";

import { ApiResponse } from "../../../shared/core/model/api-response";
import { Post } from "../model/post";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class EditComponent implements OnInit {
  post: Post;

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

  @ViewChild("updateTooltip") updateTooltip: MatTooltip;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private postService: PostService,
    private utilService: UtilService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getPost();
    this.buildForm();
  }

  getPost(): void {
    this.post = this.route.snapshot.data["post"];
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      title: [
        this.post.title,
        [Validators.required, Validators.pattern(/^.{1,100}$/)]
      ],
      body: [this.post.body, [Validators.required]]
    });

    this.form;
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

  onSubmit() {
    this.utilService.makeFormDirtyAndUpdateErrors(
      this.form,
      this.formErrors,
      this.formErrorMessages
    );
    if (this.form.valid) {
      const id: string = this.route.snapshot.paramMap.get("id");
      this.postService.updatePost(id, this.form.value).subscribe(
        data => {
          this.router.navigate(["/post", id]);
        },
        err => {
          this.errorResponse = err;
          this.utilService.handleFormSubmitError(
            this.errorResponse,
            this.form,
            this.formErrors
          );
          this.setColor("warn", 400);
          this.updateTooltip.message = this.errorResponse.message;
          this.updateTooltip.show();
        }
      );
    } else {
      this.setColor("warn", 400);
      console.log("updatePost failed");
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
