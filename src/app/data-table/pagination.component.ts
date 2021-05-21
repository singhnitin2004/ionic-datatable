import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { DataTableComponent } from './table.component';
import { PaginationButton } from './pagination-button';

@Component({
  selector: 'data-table-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class DataTablePagination implements OnInit {

  pages: PaginationButton[] = [];

  constructor(@Inject(forwardRef(() => DataTableComponent)) public dataTable: DataTableComponent) {
  }

  //init
  ngOnInit(): void {
    this.totalPageButtons();
  }

  // direct redirect page
  setPageNumber(setPage: number) {
    this.dataTable.currentPage = setPage;
    this.dataTable.page = this.dataTable.currentPage;
    this.totalPageButtons();
  }

  // previous
  pageBack() {
    this.dataTable.currentPage = this.dataTable.currentPage - 1;
    this.dataTable.page = this.dataTable.currentPage;
    this.totalPageButtons();
  }

  // next
  pageForward() {
    this.dataTable.currentPage = this.dataTable.currentPage + 1;
    this.dataTable.page = this.dataTable.currentPage;
    this.totalPageButtons();
  }

  // first page
  pageFirst() {
    this.dataTable.page = 0;
    this.dataTable.currentPage = 0;
    this.totalPageButtons();
  }

  //last page
  pageLast() {
    this.dataTable.page = this.dataTable.totalPages - 1;
    this.dataTable.currentPage = this.dataTable.totalPages - 1;
    this.totalPageButtons();
  }

  //get total page
  totalPageButtons(): void {
    this.pages = this.getPaginationButtons(this.dataTable.currentPage + 1);
  }

  //get total page
  getPaginationButtons(page: number): PaginationButton[] {
    const pages = [];
    const total = this.dataTable.totalPages;
    let startPage = 1;
    let endPage = total;
    const maxSize = 5;
    const isMaxSized = maxSize < total;
    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, total);
      } else if (endPage > total) {
        startPage = Math.max(total - maxSize + 1, 1);
        endPage = total;
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      pages.push(new PaginationButton(num, num - 1, num === page));
      if (num == 5) {
        pages.push(new PaginationButton('...', num - 1, false));
        // pages.push(new PaginationButton(9, 8, false));
      }
    }
    return pages;
  }

  get size() {
    return this.dataTable.size;
  }

  set size(value) {
    this.dataTable.size = Number(<any>value); // TODO better way to handle that value of number <input> is string?
  }

}
