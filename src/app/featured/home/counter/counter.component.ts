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
    // this.window.localStorage.removeItem("counter");
    this.initCounter();
  }

  getCounter(): void {
    this.counterService.getCounter().subscribe(counter => {
      this.counter = { ...counter };
      this.window.localStorage.setItem("counter", JSON.stringify(this.counter));
    }),
      err => {
        console.log("getCounter failed", err);
      };
  }

  initCounter(): void {
    if (!this.hasCounter()) {
      this.getCounter();
    } else {
      this.counter = JSON.parse(
        this.window.localStorage.getItem("counter")
      ) as Counter;
      const now = new Date();
      const date =
        now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
      if (this.counter.date == date) return;
      this.getCounter();
    }
  }

  hasCounter(): boolean {
    const counter: string = this.window.localStorage.getItem("counter");
    if (counter) {
      return true;
    } else return false;
  }
}
