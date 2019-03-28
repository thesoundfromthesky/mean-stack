import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from "@angular/core";
import { CommonModule } from "@angular/common";

import { CoreRoutingModule } from "./core-routing.module";

import { WINDOW_PROVIDERS } from './service/window.service';
import { MessageService } from "./service/message.service";
import { UtilService } from "./service/util.service";
import { httpInterceptorProviders } from "./service/request-interceptor.service";
import { authGuardProviders } from "./guard/auth.guard";
import { AuthService } from './service/auth.service';
import { RequestCacheService } from './service/request-cache.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, CoreRoutingModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        "CoreModule is already loaded. Import it in the AppModule only"
      );
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        WINDOW_PROVIDERS,
        MessageService,
        UtilService,
        httpInterceptorProviders,
        authGuardProviders,
        AuthService,
        RequestCacheService
      ]
    };
  }
}
