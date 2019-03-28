import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "../../shared/core/material/material.module";

import { PostRoutingModule, routedComponents } from "./post-routing.module";

import { PostService } from "../post/service/post.service";
import { postResolveProviders } from "./resolve/post.resolve";
import { CommentService } from "./service/comment.service";

import { CommentComponent } from "./comment/comment.component";

@NgModule({
  declarations: [...routedComponents, CommentComponent],
  imports: [CommonModule, PostRoutingModule, MaterialModule],
  providers: [PostService, postResolveProviders, CommentService]
})
export class PostModule {}
