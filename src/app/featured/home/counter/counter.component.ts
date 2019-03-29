import { Component, OnInit, Inject } from "@angular/core";

import { WINDOW } from "../../../shared/core/service/window.service";

import { CounterService } from "../service/counter.service";
import { Counter } from "../model/counter";

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.scss"]
})
export class CounterComponent implements OnInit {
  counter: Counter;

  constructor(
    private counterService: CounterService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    this.initCounter();
  }

  initCounter(): void {
    this.counterService.getCounter().subscribe(counter => {
      this.counter = { ...counter };
    }),
      err => {
        console.log("getCounter failed", err);
      };
  }
}
