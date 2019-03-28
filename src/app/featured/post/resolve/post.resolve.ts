import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

import { Observable } from "rxjs";

import { PostService } from "../service/post.service";

import { Post } from "../model/post";

@Injectable()
export class PostResolve implements Resolve<Post> {
  constructor(private postService: PostService) {}
  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Post> {
    const id: string = next.paramMap.get("id");
    return this.postService.getPost(id);
  }
}

@Injectable()
export class PostsResolve implements Resolve<Post[]> {
  constructor(private postService: PostService) {}
  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Post[]> {
    const page: string = next.queryParamMap.get("page");
    const limit: string = next.queryParamMap.get("limit");
    return this.postService.indexPost(page,limit);
  }
}

export const postResolveProviders = [
  {
    provide: PostResolve,
    useClass: PostResolve
  },
  {
    provide: PostsResolve,
    useClass: PostsResolve
  }
];