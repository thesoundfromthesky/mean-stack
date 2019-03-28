import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  Sort
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";

import { Post } from "..//model/post";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  posts: Post[];
  pages: number[] = [];
  queryPages: any[] = [];
  currentPage: number;
  startPage: number;
  endPage: number;
  maxPage: number;
  readonly limitPage: number = 9;
  readonly centerPage: number = 5;

  columnsToDisplayDesktop: string[] = ["index", "title", "author", "views"];
  columnsToDisplayMobile: string[] = ["title"];
  dataSource: MatTableDataSource<Post>;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.indexPost();
    this.initPage();
    this.posts = this.posts.slice(0, this.posts.length - 1);
    this.dataSource = new MatTableDataSource<Post>(this.posts);
  }

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.dataSource.sortingDataAccessor = (
    //   post: Post,
    //   sortHeaderId: string
    // ) => {
    //   switch (sortHeaderId) {
    //     case "author":
    //       return post[sortHeaderId].username;
    //       break;
    //     default:
    //       return post[sortHeaderId];
    //   }
    // };
  }

  indexPost(): void {
    this.route.queryParamMap.subscribe(query => {
      this.posts = this.route.snapshot.data["posts"];
    });
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === "") {
      this.dataSource.data = this.posts;
      return;
    }
    const data = [...this.dataSource.data];
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "index":
          return this.compare(a.postId, b.postId, isAsc);
        case "title":
          return this.compare(a.title, b.title, isAsc);
        case "author":
          return this.compare(a.author.username, b.author.username, isAsc);
        case "views":
          return this.compare(a.views, b.views, isAsc);
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

  initPage(): void {
    this.maxPage = this.posts[this.posts.length - 1].maxPage;
    this.currentPage = 1;
    this.startPage = 0;
    this.endPage = this.limitPage;
    for (let i: number = 0; i < this.maxPage; ++i) {
      this.pages.push(i + 1);
      this.queryPages.push({ page: i + 1, limit: 15 });
    }
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
    if (this.currentPage <= this.centerPage) {
      this.startPage = 0;
      this.endPage = 9;
    } else if (this.maxPage - (this.centerPage - 1) <= this.currentPage) {
      this.startPage = this.maxPage - 9;
      this.endPage = this.maxPage;
    } else {
      this.startPage = this.currentPage - this.centerPage;
      this.endPage = this.currentPage + this.centerPage - 1;
    }
  }
}
