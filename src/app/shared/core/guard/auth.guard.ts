import { Injectable, Inject } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

import { WINDOW } from "src/app/shared/core/service/window.service";
import { AuthService } from "../service/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(WINDOW) private window: Window,
    private authService: AuthService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.window.alert("Please login first");
      return this.router.createUrlTree(["/login"], {
        queryParams: { redirectTo: state.url }
      });
    }
  }
}

export const authGuardProviders = [
  {
    provide: AuthGuard,
    useClass: AuthGuard
  }
];
