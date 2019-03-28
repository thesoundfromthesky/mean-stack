import { Component, OnInit } from "@angular/core";

import { MessageService } from "../../../shared/core/service/message.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"]
})
export class MessageComponent implements OnInit {
  isDev: boolean = !environment.production;

  constructor(public messageService: MessageService) {}

  ngOnInit() {}
}
