import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { UtilService } from "../../../shared/core/service/util.service";
import { UserService } from "../service/user.service";
import { AuthService } from "../../../shared/core/service/auth.service";
import { WINDOW } from "../../../shared/core/service/window.service";
import { User } from "../model/user";

@Component({
  selector: "app-show",
  templateUrl: "./show.component.html",
  styleUrls: ["./show.component.scss"]
})
export class ShowComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private utilService: UtilService,
    private userService: UserService,
    public authService: AuthService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    this.user = this.route.snapshot.data["user"];
  }

  deleteUser(): void {
    const answer: boolean = this.window.confirm(
      "Do you want to delete your account?"
    );
    if (answer) {
      const username: string = this.route.snapshot.paramMap.get("username");
      this.userService
        .deleteUser(username)
        .subscribe(
          (user: User) => (this.user = user),
          err => console.error("delete user failed", err)
        );
    }
  }

  goBack(): void {
    this.location.back();
  }
}
