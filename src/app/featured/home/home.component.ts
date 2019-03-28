import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  Inject,
  NgZone
} from "@angular/core";
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from "@angular/router";

import { MatSidenavContainer, MatSidenavContent } from "@angular/material";

import { WINDOW } from "../../shared/core/service/window.service";
import { AuthService } from "../../shared/core/service//auth.service";
import { UtilService } from "../../shared/core/service//util.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;

  @ViewChild("toolbar", { read: ElementRef }) toolbar: ElementRef;
  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;
  @ViewChild(MatSidenavContent, { read: ElementRef })
  sidenavContent: ElementRef;

  prevScrollY: number;
  isResizing: boolean = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(WINDOW) private window: Window,
    public authService: AuthService,
    private utilService: UtilService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.utilService.sidenavContainer = this.sidenavContainer;
    this.detectRouteEvent();
    // this.addWheelEvent();
  }

  ngAfterViewInit() {    
    this.prevScrollY = this.sidenavContainer.scrollable.measureScrollOffset(
      "top"
    );
    this.sidenavContainer.scrollable.elementScrolled().subscribe(
      (event: Event) => {
        this.toggleToolbar(event);
      } /* react to scrolling */
    );
  }

  //for this.window.pageYOffset
  private toggleToolbar(event: Event): void {
    const currentScrollY = this.sidenavContainer.scrollable.measureScrollOffset(
      "top"
    );
    if (currentScrollY <= this.prevScrollY) {
      this.renderer.addClass(this.toolbar.nativeElement, "show-toolbar");
    } else {
      this.renderer.removeClass(this.toolbar.nativeElement, "show-toolbar");
    }
    this.prevScrollY = currentScrollY;
  }

  // no-angular way
  private addWheelEvent(): void {
    this.ngZone.runOutsideAngular(() => {
      this.window.addEventListener(
        "wheel",
        event => {
          if (!this.isResizing) {
            this.isResizing = true;
            this.toggleToolbar(event);
            this.window.setTimeout(() => {
              this.isResizing = false;
            }, 110);
          }
        },
        {
          capture: true,
          passive: true
        }
      );
    });
  }

  private refreshToken(event: RouterEvent): void {
    if (event instanceof NavigationStart && this.authService.isLoggedIn()) {
      this.authService.refresh().subscribe(
        data => {
          console.log("refresh success");
        },
        err => {
          console.error("refresh failed:", err);
          this.authService.logout();
        }
      );
    }
  }

  private updateLoadingBar(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.isLoading = true;
    }
    if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.isLoading = false;
    }
  }

  private scrollToTop(event): void {
    if (event instanceof NavigationEnd) {
      this.sidenavContent.nativeElement.scrollTop = 0;
      this.prevScrollY = 0;
    }
  }

  private detectRouteEvent(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      this.scrollToTop(event);
      this.refreshToken(event);
      this.updateLoadingBar(event);
    });
  }
}
