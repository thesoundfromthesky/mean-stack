import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { UtilService } from "../../../shared/core/service/util.service";
import { PostService } from "../service/post.service";
import { WINDOW } from "../../../shared/core/service/window.service";
import { Post } from "../model/post";
import { AuthService } from "../../../shared/core/service/auth.service";

@Component({
  selector: "app-show",
  templateUrl: "./show.component.html",
  styleUrls: ["./show.component.scss"]
})
export class ShowComponent implements OnInit {
  post: Post;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private postService: PostService,
    public authService: AuthService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    this.getPost();
  }

  getPost(): void {
    this.post = this.route.snapshot.data["post"];
  }

  deletePost(): void {
    const answer: boolean = this.window.confirm(
      "Do you want to delete this post?"
    );
    if (answer) {
      const id: string = this.route.snapshot.paramMap.get("id");
      this.postService
        .deletePost(id)
        .subscribe(
          (post: Post) => (this.post = post),
          err => console.error("delete post failed", err)
        );
    }
  }

  goBack(): void {
    this.location.back();
  }
}
