import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ArkanoidComponent } from "./arkanoid.component";

const routes: Routes = [{ path: "", component: ArkanoidComponent }];

export const routedComponents = [ArkanoidComponent];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArkanoidRoutingModule {}
