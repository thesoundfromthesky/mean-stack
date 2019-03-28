import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";

import { DialogUserType } from "./dialog-user-type";

@Component({
  selector: "app-dialog-user",
  templateUrl: "./dialog-user.component.html",
  styleUrls: ["./dialog-user.component.scss"]
})
export class DialogUserComponent implements OnInit {
  dialogUserType: any = {...DialogUserType};
  usernameFormControl: FormControl = new FormControl("", [Validators.required]);
  previousUsername: string;

  constructor(
    private dialogRef: MatDialogRef<DialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.previousUsername = this.data.username ? this.data.username : undefined;
  }

  public onSave(): void {
    this.dialogRef.close({
      username: this.usernameFormControl.value,
      dialogType: this.data.dialogType,
      previousUsername: this.previousUsername
    });
  }
}
