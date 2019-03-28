import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

import { Observable } from "rxjs";

import { UserService } from "../service/user.service";

import { User } from "../model/user";

@Injectable()
export class UserResolve implements Resolve<User> {

  constructor(private userService: UserService) {}
  
  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User> {
    const username: string = next.paramMap.get("username");
    return this.userService.getUser(username);
  }
}

@Injectable()
export class UsersResolve implements Resolve<User[]> {
  constructor(private userService: UserService) {}
  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User[]> {
    return this.userService.indexUser();
  }
}

export const userResolveProviders = [
  {
    provide: UserResolve,
    useClass: UserResolve
  },
  {
    provide: UsersResolve,
    useClass: UsersResolve
  }
];