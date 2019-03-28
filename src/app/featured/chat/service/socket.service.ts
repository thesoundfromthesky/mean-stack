import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import socketIo from "socket.io-client";

import { environment } from "src/environments/environment";
import { Message } from "../model/message";
import { Event } from "../model/event";

const SERVER_URL: string = environment.production
  ? null
  : "http://localhost:3000";

@Injectable()
export class SocketService {
  private socket: socketIo.Socket;

  constructor() {}

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send(message: Message): void {
    this.socket.emit("message", message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on("message", (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
