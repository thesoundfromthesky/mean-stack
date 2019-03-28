import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home.component";
import { LoginComponent } from "./login/login.component";
import { Error404Component } from "./error404/error404.component";
import { IntroComponent } from "./intro/intro.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      { path: "", component: IntroComponent },
      { path: "login", component: LoginComponent },
      {
        path: "user",
        loadChildren: "../user/user.module#UserModule"
      },
      {
        path: "chat",
        loadChildren: "../chat/chat.module#ChatModule"
      },
      {
        path: "post",
        loadChildren: "../post/post.module#PostModule"
      },
      {
        path: "arkanoid",
        loadChildren: "../arkanoid/arkanoid.module#ArkanoidModule"
      }
    ]
  },
  { path: "**", component: Error404Component }
];

export const routedComponents = [
  HomeComponent,
  LoginComponent,
  Error404Component,
  IntroComponent
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
