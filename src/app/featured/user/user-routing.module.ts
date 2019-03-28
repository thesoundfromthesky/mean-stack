import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UsersResolve, UserResolve } from "./resolve/user.resolve";
import { AuthGuard } from "src/app/shared/core/guard/auth.guard";

import { NewComponent } from "./new/new.component";
import { ListComponent } from "./list/list.component";
import { ShowComponent } from "./show/show.component";
import { EditComponent } from "./edit/edit.component";

const routes: Routes = [
  { path: "new", component: NewComponent },
  {
    path: "list",
    component: ListComponent,
    resolve: { users: UsersResolve },
    canActivate: [AuthGuard]
  },
  {
    path: ":username",
    component: ShowComponent,
    resolve: { user: UserResolve },
    canActivate: [AuthGuard]
  },  {
    path: "edit/:username",
    component: EditComponent,
    resolve: { user: UserResolve },
    canActivate: [AuthGuard]
  }
];

export const routedComponents = [
  NewComponent,
  ListComponent,
  ShowComponent,
  EditComponent
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
