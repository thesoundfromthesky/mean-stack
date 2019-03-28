import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  Renderer2
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { ThemePalette, MatTooltip, MatListItem } from "@angular/material";

import { WINDOW } from "src/app/shared/core/service/window.service";
import { UtilService } from "../../../shared/core/service/util.service";
import { CommentService } from "../service/comment.service";
import { AuthService } from "../../../shared/core/service/auth.service";

import { ApiResponse } from "../../../shared/core/model/api-response";
import { Comment } from "../model/comment";
import { Subscription } from "rxjs";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.scss"]
})
export class CommentComponent implements OnInit, AfterViewInit, OnDestroy {
  windowHeight: number;
  subscription: Subscription;

  color: ThemePalette;

  postId: string;
  comments: Comment[];

  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    memo: "Memo is required!"
  };
  formErrorMessages = {
    memo: {
      required: "Memo is required!"
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private utilService: UtilService,
    public authService: AuthService,
    @Inject(WINDOW) private window: Window,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get("id");
    this.indexComment();
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @ViewChild("commentTooltip") createTooltip: MatTooltip;
  @ViewChild("ngForm") ngForm: NgForm;

  @ViewChildren(MatListItem, { read: ElementRef }) matListItem: QueryList<
    ElementRef
  >;

  buildForm(): void {
    this.form = this.formBuilder.group({
      memo: ["", [Validators.required]]
    });

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
      this.commentService.createComment(this.postId, this.form.value).subscribe(
        data => {
          this.form.reset();
          this.ngForm.resetForm();
          this.indexComment();
          // this.router.navigate(["/post", this.postId]);
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
      console.log("createComment failed");
    }
  }

  setColor(color: ThemePalette, time: number) {
    setTimeout(() => {
      this.color = color;
    }, time);
  }

  indexComment() {
    this.commentService
      .indexComment(this.postId)
      .subscribe((comment: Comment[]) => {
        this.comments = [...comment];
      });
  }

  deleteComment(commentId: string): void {
    this.commentService
      .deleteComment(this.postId, commentId)
      .subscribe(data => {
        this.comments = this.comments.filter(comment => {
          return comment._id !== commentId;
        });
        // this.router.navigate(["/post", this.postId]);
      });
  }

  initAnimation(): void {
    this.windowHeight = this.window.innerHeight;
    this.addEventToScroll();
    this.matListItem.changes.subscribe(elements => {
      this.checkPosition();
    });
  }

  addEventToScroll(): void {
    this.subscription = this.utilService.sidenavContainer.scrollable
      .elementScrolled()
      .subscribe((event: Event) => {
        this.checkPosition();
      });
  }

  checkPosition(): void {
    this.matListItem.forEach((item: ElementRef, index: number) => {
      const positionFromBottom =
        item.nativeElement.getBoundingClientRect().top +
        item.nativeElement.getBoundingClientRect().height;
      if (positionFromBottom - this.windowHeight <= 0) {
        this.renderer.removeClass(item.nativeElement, "hidden");
        this.renderer.addClass(item.nativeElement, "animated");
        this.renderer.addClass(item.nativeElement, "bounceInRight");
      }
    });
  }

  isLoggedIn(): void {
    if (!this.authService.isLoggedIn()) {
      this.window.alert("Please login first");
      this.router.navigate(["/login"], {
        queryParams: { redirectTo: this.router.url }
      });
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}
