import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  ArkanoidRoutingModule,
  routedComponents
} from "./arkanoid-routing.module";
import { ArkanoidComponent } from "./arkanoid.component";

@NgModule({
  declarations: [ArkanoidComponent, ...routedComponents],
  imports: [CommonModule, ArkanoidRoutingModule]
})
export class ArkanoidModule {}
