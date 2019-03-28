import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule, MatSelectModule } from "@angular/material";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";

import { HomeRoutingModule, routedComponents } from "./home-routing.module";

import { CounterService } from './service/counter.service';

import { MessageComponent } from "./message/message.component";
import { CounterComponent } from './counter/counter.component';

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCardModule,
  MatListModule
];

@NgModule({
  declarations: [...routedComponents, MessageComponent, CounterComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ...materialModules
  ],
  providers:[CounterService]
})
export class HomeModule {}
