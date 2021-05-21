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

  ngOnInit(): void {
    this.totalPageButtons();
  }

  setPageNumber(setPage: number) {
    this.dataTable.currentPage = setPage;
    this.dataTable.page = this.dataTable.currentPage;
    this.totalPageButtons();
  }

  pageBack() {
    this.dataTable.currentPage = this.dataTable.currentPage - 1;
    this.dataTable.page = this.dataTable.currentPage;
    this.totalPageButtons();
  }

  pageForward() {
    this.dataTable.currentPage = this.dataTable.currentPage + 1;
    this.dataTable.page = this.dataTable.currentPage;
    this.totalPageButtons();
  }

  pageFirst() {
    this.dataTable.page = 0;
    this.dataTable.currentPage = 0;
    this.totalPageButtons();
  }

  pageLast() {
    this.dataTable.page = this.dataTable.totalPages - 1;
    this.dataTable.currentPage = this.dataTable.totalPages - 1;
    this.totalPageButtons();
  }

  totalPageButtons(): void {
    this.pages = this.getPaginationButtons(this.dataTable.currentPage + 1);
    console.log(this.pages)
  }

  getPaginationButtons(page: number): PaginationButton[] {
    const pages = [];
    const total = this.dataTable.totalPages;
    // document.getElementById('drpSelectSourceLibrary').value = this.dataTable.totalPages.toString();
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
      console.log(num)
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
