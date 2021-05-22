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
  totalSizes: number;
  pageCount: number;
  enterPage: number;
  constructor(@Inject(forwardRef(() => DataTableComponent)) public dataTable: DataTableComponent) {
  }

  //init
  ngOnInit(): void {
    this.totalSizes = this.dataTable.size;
    this.pageCount = this.getPageCount();
    this.totalPageButtons();
  }

  sizeChange() {
    this.dataTable.size = +this.totalSizes;
    this.pageCount = this.getPageCount();
    this.totalPageButtons();
    // this.dataTable.paginationChange.emit({ page: this.dataTable.page, size: +this.totalSizes })
  }

  EnterPage() {
    if (this.enterPage && this.pageCount >= this.enterPage) {
      this.dataTable.currentPage = this.enterPage - 1;
      this.dataTable.page = this.dataTable.currentPage;
      this.totalPageButtons();
    }
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

  private getPageCount(): number {
    let totalPage = 0;
    if (this.dataTable.totalRecords > 0 && +this.totalSizes > 0) {
      const pageCount = this.dataTable.totalRecords / +this.totalSizes;
      const roundedPageCount = Math.floor(pageCount);
      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }
    return totalPage;
  }


  //get total page
  totalPageButtons(): void {
    this.dataTable.paginationChange.emit({ page: +this.dataTable.page, size: +this.totalSizes })
    this.pages = this.pagination(+this.dataTable.page, +this.pageCount);
  }

  //get total page
  getPaginationButtons(page: number): PaginationButton[] {
    const pages = [];
    const total = +this.pageCount;
    let startPage = 1;
    let endPage = total;
    const maxSize = 10;
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
    console.log(startPage, endPage)
    for (let num = startPage; num <= endPage; num++) {
      pages.push(new PaginationButton(num, num - 1, num === page));
    }
    return pages;
  }

  pagination(c, m) {
    c = parseInt(c)
    m = parseInt(m)
    var current = c,
      last = m,
      delta = 1,
      left = current - delta + 1,
      right = current + delta + 2,
      range = [],
      rangeWithDots = [],
      l;
    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || i >= left && i < right) {
        range.push(i);
      }
    }
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(new PaginationButton(l + 1, l + 1 - 1, l + 1 === c + 1));
        } else if (i - l !== 1) {
          rangeWithDots.push(new PaginationButton(0 - i, 0 - i - 1, 0 - i === c + 1));
        }
      }
      rangeWithDots.push(new PaginationButton(i, i - 1, i === c + 1));
      l = i;
    }
    return rangeWithDots;
  }

  get size() {
    return this.dataTable.size;
  }

  set size(value) {
    this.dataTable.size = Number(<any>value); // TODO better way to handle that value of number <input> is string?
  }

}
