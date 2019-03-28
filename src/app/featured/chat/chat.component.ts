import {
  Component,
  OnInit,
  ViewChildren,
  ViewChild,
  AfterViewInit,
  QueryList,
  ElementRef,
  Inject
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatList,
  MatListItem
} from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { WINDOW } from "../../shared/core/service/window.service";
import { SocketService } from "./service/socket.service";

import { DialogUserComponent } from "./dialog-user/dialog-user.component";
import { DialogUserType } from "./dialog-user/dialog-user-type";

import { Action } from "./model/action";
import { Event } from "./model/event";
import { Message } from "./model/message";
import { User } from "./model/user";

const AVATAR_URL: string = "https://api.adorable.io/avatars/285";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, AfterViewInit {
  action: object = Action;
  user: User;
  messages: Message[] = [];
  messageContent: FormControl = new FormControl("", [
    Validators.maxLength(140)
  ]);
  ioConnection: Subscription;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  newUser: any = {
    disableClose: true,
    data: {
      title: "Welcome",
      dialogType: DialogUserType.NEW
    }
  };

  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<
    MatListItem
  >;

  constructor(
    @Inject(WINDOW) private window: Window,
    private socketService: SocketService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initModel();
    this.onClose();
    setTimeout(() => {
      this.openDialog(this.newUser);
    }, 0);
  }

  private onClose(): void {
    this.window.onunload = () => {
      this.sendNotification({}, Action.LEFT);
    };
  }

  private initModel(): void {
    const randomId: number = this.getRandomId();
    this.user = {
      id: randomId,
      avatar: `${AVATAR_URL}/${randomId}.png`
    };
  }
  private getRandomId(): number {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  ngAfterViewInit() {
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }
  private scrollToBottom(): void {
    this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
  }
  
  private openDialog(of: any): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, of);
    this.dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        return;
      }

      this.user.name = data.username;
      if (data.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(data, Action.JOINED);
      } else if (data.dialogType === DialogUserType.EDIT) {
        this.sendNotification(data, Action.RENAME);
      }
    });
  }

  public openCurrentUser(): void {
    this.openDialog({
      data: {
        username: this.user.name,
        title: "Edit Details",
        dialogType: DialogUserType.EDIT
      }
    });
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService
      .onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.socketService.onEvent(Event.CONNECT).subscribe(() => {
      console.log("connected");
    });

    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log("disconnected");
    });
  }

  public sendNotification(data: any, action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action: action
      };
    } else if (action === Action.RENAME) {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: data.previousUsername
        }
      };
    } else if (action === Action.LEFT) {
      message = {
        from: this.user,
        action: action
      };
    }

    this.socketService.send(message);
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: message,
      action: Action.SEND
    });
    this.messageContent.patchValue("");
  }
}
