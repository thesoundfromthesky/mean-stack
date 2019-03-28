import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  OnDestroy
} from "@angular/core";
import { WINDOW } from "../../shared/core/service/window.service";

@Component({
  selector: "app-arkanoid",
  templateUrl: "./arkanoid.component.html",
  styleUrls: ["./arkanoid.component.scss"]
})
export class ArkanoidComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(@Inject(WINDOW) private window: Window) {}

  @ViewChild("myCanvas", { read: ElementRef }) canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  dx: number = 2;
  dy: number = -2;

  ballRadius: number = 10;

  paddleHeight: number = 10;
  paddleWidth: number = 75;
  paddleX: number;

  brickRowCount: number = 3;
  brickColumnCount: number = 5;
  brickWidth: number = 75;
  brickHeight: number = 20;
  brickPadding: number = 10;
  brickOffsetTop: number = 30;
  brickOffsetLeft: number = 30;

  bricks: object[] = [];

  score: number = 0;
  lives: number = 3;

  ongoingTouches: any[] = [];

  rightPressed: boolean = false;
  leftPressed: boolean = false;

  eventHandlers: object;
  animationId: number;
  ngOnInit() {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.x = this.canvas.nativeElement.width / 2;
    this.y = this.canvas.nativeElement.height - 30;
    this.paddleX = (this.canvas.nativeElement.width - this.paddleWidth) / 2;

    for (let c = 0; c < this.brickColumnCount; ++c) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; ++r) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    this.eventHandlers = {
      keydown: this.keyDownHandler.bind(this),
      keyup: this.keyUpHandler.bind(this),
      mousemove: this.mouseMoveHandler.bind(this),
      touchstart: this.touchStartHandler.bind(this),
      touchmove: this.touchMoveHandler.bind(this),
      touchEnd: this.touchEndHandler.bind(this)
    };

    this.window.document.addEventListener(
      "keydown",
      this.eventHandlers["keydown"],
      false
    );
    this.window.document.addEventListener(
      "keyup",
      this.eventHandlers["keyup"],
      false
    );
    this.window.document.addEventListener(
      "mousemove",
      this.eventHandlers["mousemove"],
      false
    );
    this.window.document.addEventListener(
      "touchstart",
      this.eventHandlers["touchstart"],
      false
    );
    this.window.document.addEventListener(
      "touchmove",
      this.eventHandlers["touchmove"],
      false
    );
    this.window.document.addEventListener(
      "touchend",
      this.eventHandlers["touchend"],
      false
    );

    this.draw();
  }

  ngOnDestroy(): void {
    this.window.cancelAnimationFrame(this.animationId);
    this.window.document.removeEventListener(
      "keydown",
      this.eventHandlers["keydown"]
    );
    this.window.document.removeEventListener(
      "keyup",
      this.eventHandlers["keyup"]
    );
    this.window.document.removeEventListener(
      "mousemove",
      this.eventHandlers["mousemove"]
    );
    this.window.document.removeEventListener(
      "touchstart",
      this.eventHandlers["touchstart"]
    );
    this.window.document.removeEventListener(
      "touchmove",
      this.eventHandlers["touchmove"]
    );
    this.window.document.removeEventListener(
      "touchend",
      this.eventHandlers["touchend"]
    );
  }

  keyDownHandler(e: KeyboardEvent): void {
    if (e.keyCode === 39) {
      this.rightPressed = true;
    } else if (e.keyCode === 37) {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e: KeyboardEvent): void {
    if (e.keyCode === 39) {
      this.rightPressed = false;
    } else if (e.keyCode === 37) {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e: MouseEvent): void {
    let relativeX = e.clientX - this.canvas.nativeElement.offsetLeft;
    if (0 < relativeX && relativeX < this.canvas.nativeElement.width) {
      this.paddleX = relativeX - this.paddleWidth / 2;
      if (this.paddleX < 0) {
        this.paddleX = 0;
      } else if (
        this.canvas.nativeElement.width <
        this.paddleX + this.paddleWidth
      ) {
        this.paddleX = this.canvas.nativeElement.width - this.paddleWidth;
      }
    }
  }

  touchStartHandler(e: TouchEvent): void {
    this.enableTouch(e);
  }

  touchMoveHandler(e: TouchEvent): void {
    let touches: Touch[] = Array.from(e.changedTouches);
    let idx: number;

    for (let touch of touches) {
      idx = this.ongoingTouches.findIndex(value => {
        return value.identifier === touch.identifier;
      });

      if (-1 < idx) {
        this.updateTouchPoint(this.ongoingTouches[idx]);
        this.updateTouchPoint(touch);
        this.ongoingTouches.splice(idx, 1, this.generateTouch(touch));
      }
    }
  }

  touchEndHandler(e: TouchEvent): void {
    let touches: Touch[] = Array.from(e.changedTouches);
    let idx: number;
    for (let touch of touches) {
      idx = this.ongoingTouches.findIndex(value => {
        return value.identifier === touch.identifier;
      });

      if (-1 < idx) {
        this.ongoingTouches.splice(idx, 1);
      }
    }
  }

  generateTouch(touch: Touch): object {
    let ratio: number =
      this.canvas.nativeElement.width /
      this.canvas.nativeElement.getBoundingClientRect().width;
    return {
      identifier: touch.identifier,
      clientX: touch.clientX * ratio,
      clientY: touch.clientY * ratio
    };
  }

  updateTouchPoint(touch: Touch): void {
    let ratio: number =
      this.canvas.nativeElement.width /
      this.canvas.nativeElement.getBoundingClientRect().width;

    let relativeX =
      touch.clientX * ratio - this.canvas.nativeElement.offsetLeft;
    if (0 < relativeX && relativeX < this.canvas.nativeElement.width) {
      this.paddleX = relativeX - this.paddleWidth / 2;
      if (this.paddleX < 0) {
        this.paddleX = 0;
      } else if (
        this.canvas.nativeElement.width <
        this.paddleX + this.paddleWidth
      ) {
        this.paddleX = this.canvas.nativeElement.width - this.paddleWidth;
      }
    }
  }

  enableTouch(e: TouchEvent) {
    let touches: Touch[] = Array.from(e.changedTouches);
    for (let touch of touches) {
      this.ongoingTouches.push(this.generateTouch(touch));
      this.updateTouchPoint(touch);
    }
  }

  draw(): void {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.collisionDetection();
    this.drawScore();
    this.drawLives();

    if (
      this.canvas.nativeElement.width - this.ballRadius < this.x + this.dx ||
      this.x + this.dx < this.ballRadius
    ) {
      this.dx = -this.dx;
    }
    if (this.y + this.dy < this.ballRadius) {
      this.dy = -this.dy;
    } else if (
      this.canvas.nativeElement.height - this.ballRadius <
      this.y + this.dy
    ) {
      if (this.paddleX < this.x && this.x < this.paddleX + this.paddleWidth) {
        this.dy = -this.dy;
      } else {
        --this.lives;
        if (!this.lives) {
          this.window.alert("GAME OVER");
          this.window.document.location.reload();
          this.window.cancelAnimationFrame(this.animationId);
        } else {
          this.x = this.canvas.nativeElement.width / 2;
          this.y = this.canvas.nativeElement.height - 30;
          this.dx = 2;
          this.dy = -2;
          this.paddleX =
            (this.canvas.nativeElement.width - this.paddleWidth) / 2;
        }
      }
    }

    if (
      this.rightPressed &&
      this.paddleX < this.canvas.nativeElement.width - this.paddleWidth
    ) {
      this.paddleX += 7;
    } else if (this.leftPressed && 0 < this.paddleX) {
      this.paddleX -= 7;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.animationId = this.window.requestAnimationFrame(this.draw.bind(this));
  }

  drawBall(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawPaddle(): void {
    this.ctx.beginPath();
    this.ctx.rect(
      this.paddleX,
      this.canvas.nativeElement.height - this.paddleHeight,
      this.paddleWidth,
      this.paddleHeight
    );
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawBricks(): void {
    for (let c = 0; c < this.brickColumnCount; ++c) {
      for (let r = 0; r < this.brickRowCount; ++r) {
        if (this.bricks[c][r].status === 1) {
          let brickX =
            c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          let brickY =
            r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
          this.ctx.fillStyle = "#0095DD";
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  }

  collisionDetection(): void {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        let b = this.bricks[c][r];
        if (b.status === 1) {
          if (
            b.x < this.x &&
            this.x < b.x + this.brickWidth &&
            b.y < this.y &&
            this.y < b.y + this.brickHeight
          ) {
            this.dy = -this.dy;
            b.status = 0;
            ++this.score;

            if (this.score === this.brickRowCount * this.brickColumnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              this.window.document.location.reload();
            }
          }
        }
      }
    }
  }

  drawScore(): void {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fillText(`Score: ${this.score}`, 8, 20);
  }

  drawLives(): void {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fillText(
      `Lives: ${this.lives}`,
      this.canvas.nativeElement.width - 65,
      20
    );
  }
}
