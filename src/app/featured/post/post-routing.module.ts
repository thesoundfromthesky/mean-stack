import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "src/app/shared/core/guard/auth.guard";
import { PostsResolve, PostResolve } from "./resolve/post.resolve";

import { NewComponent } from "./new/new.component";
import { ListComponent } from "./list/list.component";
import { ShowComponent } from "./show/show.component";
import { EditComponent } from "./edit/edit.component";

const routes: Routes = [
  {
    path: "new",
    component: NewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "list",
    component: ListComponent,
    resolve: { posts: PostsResolve },
    // runGuardsAndResolvers: "paramsOrQueryParamsChange"
    // runGuardsAndResolvers: "pathParamsOrQueryParamsChange"
    runGuardsAndResolvers: "always"
  },
  {
    path: ":id",
    component: ShowComponent,
    resolve: { post: PostResolve }
  },
  {
    path: "edit/:id",
    component: EditComponent,
    resolve: { post: PostResolve },
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
export class PostRoutingModule {}
