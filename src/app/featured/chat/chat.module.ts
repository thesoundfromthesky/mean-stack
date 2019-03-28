import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule, MatInputModule } from "@angular/material";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatDialogModule } from "@angular/material/dialog";

import { ChatRoutingModule, routedComponents } from "./chat-routing.module";

import { SocketService } from "./service/socket.service";
import { DialogUserComponent } from "./dialog-user/dialog-user.component";

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatDialogModule
];

@NgModule({
  declarations: [...routedComponents, DialogUserComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  providers: [SocketService],
  entryComponents: [DialogUserComponent]
})
export class ChatModule {}
