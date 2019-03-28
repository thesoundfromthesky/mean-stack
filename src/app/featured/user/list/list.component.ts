import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  Sort
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";

import { User } from "../model/user";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, AfterViewInit {
  users: User[];
  columnsToDisplay: string[] = ["select", "index", "username", "name", "email"];
  columnsToDisplayMobile: string[] = ["username", "name"];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<User>(
    this.allowMultiSelect,
    this.initialSelection
  );

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.indexUser();
    this.dataSource = new MatTableDataSource<User>(this.users);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.dataSource.sortingDataAccessor = ((user: User, sortHeaderId: string) => {
    //   return user[sortHeaderId];
    // });
  }

  indexUser(): void {
    this.users = this.route.snapshot.data["users"];
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === "") {
      this.dataSource.data = this.users;
      return;
    }
    const data = [...this.dataSource.data];
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "index":
          return this.compare(a.userId, b.userId, isAsc);
        case "username":
          return this.compare(a.username, b.username, isAsc);
        case "name":
          return this.compare(a.name, b.name, isAsc);
        case "email":
          return this.compare(a.email, b.email, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
