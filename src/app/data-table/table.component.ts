import {
  Component, ContentChild, ContentChildren, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, Renderer2, SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef
} from '@angular/core';

import { DataTableIcons, DataTableParams, DataTableTranslations, defaultIcons, defaultTranslations, RowCallback } from './types';
import { ColumnDirective } from './column.directive';
import { DataTableRow } from './row.component';
import { drag } from './utils/drag';
import { BreakpointConfig, BreakpointEvent, breakpointsProvider, BreakpointsService } from './utils/break-points.service';
import { Subscription } from 'rxjs';

const breakpointConfig: BreakpointConfig = {
  xxs: { max: 400 },
  xs: { min: 400, max: 768 },
  sm: { min: 768, max: 992 },
  md: { min: 992, max: 1200 },
  lgs: { min: 1200, max: 1500 },
  lg: { min: 1500 }
};

@Component({
  selector: 'data-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [breakpointsProvider(breakpointConfig)]
})
export class DataTableComponent implements DataTableParams, OnInit, OnDestroy, OnChanges {

  private _items: any[] = [];
  showSelect: boolean = false;
  @Input()
  get items() {
    return this._items;
  }

  set items(items: any[]) {
    this._items = items;
    for (const item of this.items) {
      item.expandColumnVisible = false;
    }
    this._onReloadFinished();
  }

  // UI components:

  @ContentChildren(ColumnDirective) columns: QueryList<ColumnDirective>;
  @ViewChildren(DataTableRow) rows: QueryList<DataTableRow>;
  @ContentChild('dataTableExpand') expandTemplate: TemplateRef<any>;
  @ContentChild('iconExpand') iconExpand: TemplateRef<any>;

  // One-time optional bindings with default values:

  @Input() pagination = true;
  @Input() indexColumn = true;
  @Input() indexColumnHeader = '';
  @Input() rowColors: RowCallback;
  @Input() rowTooltip: RowCallback;
  @Input() selectColumn = false;
  @Input() multiSelect = true;
  @Input() expandableRows = false;
  @Input() multiExpandableRows = true;
  @Input() translations: DataTableTranslations = defaultTranslations;
  @Input() icons: DataTableIcons = defaultIcons;
  @Input() selectOnRowClick = false;
  @Input() autoReload = true;
  @Input() showReloading = false;

  @Input() classTable = 'table-condensed table-bordered';
  // add new
  @Input() totalRecords = 0;
  @Input() currentPage = 0;

  // Ouputs
  @Output() reload = new EventEmitter();

  // event handlers:

  @Output() rowClick = new EventEmitter();
  @Output() rowDoubleClick = new EventEmitter();
  @Output() headerClick = new EventEmitter();
  @Output() cellClick = new EventEmitter();
  @Output() rowSelected = new EventEmitter();
  @Output() actionSelect = new EventEmitter();
  @Output() sortOrder = new EventEmitter();
  @Output() paginationChange = new EventEmitter();
  viewName = '';

  breakPointSub = new Subscription();
  resizeLimit = 30;
  isExpandable = false;

  // column resizing:

  private _resizeInProgress = false;

  // UI state without input:

  indexColumnVisible: boolean;
  selectColumnVisible: boolean;
  expandColumnVisible: boolean;

  _scheduledReload = null;

  // params of the last finished reload
  _displayParams = <DataTableParams>{};

  // Reloading:
  _reloading = false;

  // selection:

  selectedRow: DataTableRow;
  selectedRows: DataTableRow[] = [];

  private _selectAllCheckbox = false;

  // UI state: visible ge/set for the outside with @Input for one-time initial values

  private _sortBy: string;
  private _sortAsc = true;

  private _page = 0;
  private _size = 10;

  @Input()
  get sortBy() {
    return this._sortBy;
  }

  set sortBy(value) {
    this._sortBy = value;
    this._triggerReload();
  }

  @Input()
  get sortAsc() {
    return this._sortAsc;
  }

  set sortAsc(value) {
    this._sortAsc = value;
    this._triggerReload();
  }

  @Input()
  get page() {
    return this._page;
  }

  set page(value) {
    this._page = value;
    this._triggerReload();
  }

  @Input()
  get size() {
    return this._size;
  }

  set size(value) {
    this._size = value;
    this._triggerReload();
  }

  // setting multiple observable properties simultaneously

  sort(sortBy: string, asc: boolean) {
    this.sortBy = sortBy;
    this.sortAsc = asc;
  }

  private _initDefaultValues() {
    this.indexColumnVisible = this.indexColumn;
    this.selectColumnVisible = this.selectColumn;
    this.expandColumnVisible = this.expandableRows;
  }

  private _initDefaultClickEvents() {
    this.headerClick.subscribe(tableEvent => this.sortColumn(tableEvent.column));
    if (this.selectOnRowClick) {
      this.rowClick.subscribe(tableEvent => tableEvent.row.selected = !tableEvent.row.selected);
    }
  }


  get reloading() {
    return this._reloading;
  }

  reloadItems() {
    this._reloading = true;
    this.reload.emit(this._getRemoteParameters());
  }

  private _onReloadFinished() {
    this._updateDisplayParams();

    this._selectAllCheckbox = false;
    this._reloading = false;
  }

  get displayParams() {
    return this._displayParams;
  }

  _updateDisplayParams() {
    this._displayParams = {
      sortBy: this.sortBy,
      sortAsc: this.sortAsc,
      page: this.page,
      size: this.size
    };
  }

  // for avoiding cascading reloads if multiple params are set at once:
  _triggerReload() {
    if (this._scheduledReload) {
      clearTimeout(this._scheduledReload);
    }
    this._scheduledReload = setTimeout(() => {
      this.reloadItems();
    });
  }
  constructor(private breakpointsService: BreakpointsService, private renderer: Renderer2, public cdf: ChangeDetectorRef) {
    this.breakPointSub = this.breakpointsService.changes.subscribe((event: BreakpointEvent) => {
      this.viewName = event.name;
      this.isExpandable = this.expandable();
    });
    this.renderer.listen('window', 'click', (e: any) => {
      if (e.target.className.indexOf('action-button') == -1) {
        if (e.target.className.indexOf('checkbox-class') != -1 || e.target.className.indexOf('checkbox-class') == 0) {
        } else {
          this.showSelect = false;
        }
      }
    })

  }

  // init
  ngOnInit() {
    this._initDefaultValues();
    this._initDefaultClickEvents();
    this._updateDisplayParams();

    if (this.autoReload && this._scheduledReload == null) {
      this.reloadItems();
    }
  }




  ngOnChanges(changes: SimpleChanges): void {
    if (changes !== undefined) {
      this.isExpandable = this.expandable();
    }
  }

  expandable(): boolean {
    if (this.columns === undefined || this.columns == null) {
      return false;
    }
    const v = this.columns.find(column => this.columnVisibie(column));
    if (v !== undefined) {
      return true;
    }
    return false;
  }

  checkedBox(ev) {
    this.isExpandable = this.expandable();
  }

  collapseAllExpanded(row: DataTableRow) {
    if ((this.rows !== undefined || this.rows !== null) && (!this.multiExpandableRows)) {
      this.rows.map(item => {
        if (item !== row) {
          item.expanded = false;
        }
      });
    }
  }

  columnVisibie(column: ColumnDirective): boolean {
    if (!this.expandableRows) {
      return false;
    }
    if (!column.visible) {
      return false;
    }
    if ((column.breakpoints === undefined || column.breakpoints === null || column.breakpoints === '')) {
      return false;
    }
    const breakpoints = column.breakpoints.split(',');
    return !(breakpoints.findIndex(item => item === this.viewName) === -1 ? true : false);
  }

  public columnVisibility(column: ColumnDirective): boolean {
    if (!this.expandableRows) {
      return false;
    }
    if (!column.visible) {
      return true;
    }
    if ((column.breakpoints === undefined || column.breakpoints === null || column.breakpoints === '')) {
      return false;
    }
    const breakpoints = column.breakpoints.split(',');
    return !(breakpoints.findIndex(item => item === this.viewName) === -1 ? true : false);
  }

  public rowClicked(row: DataTableRow, event, property?) {
    this.rows.map(item => item.rowSelected = false);
    row.rowSelected = true;
    if (property?.toLowerCase() == 'action') {

    } else {
      this.rowClick.emit({ row, event, property });
    }
  }

  public rowDoubleClicked(row: DataTableRow, event) {
    this.rowDoubleClick.emit({ row, event });
  }

  public headerClicked(column: ColumnDirective, event: MouseEvent) {
    if (!this._resizeInProgress) {
      this.headerClick.emit({ column, event });
    } else {
      this._resizeInProgress = false; // this is because I can't prevent click from mousup of the drag end
    }
  }

  public cellClicked(column: ColumnDirective, row: DataTableRow, event: MouseEvent) {
    this.cellClick.emit({ row, column, event });
  }

  // functions:

  private _getRemoteParameters(): DataTableParams {
    const params = <DataTableParams>{};

    if (this.sortBy) {
      params.sortBy = this.sortBy;
      params.sortAsc = this.sortAsc;
    }
    if (this.pagination) {
      params.page = this.page;
      params.size = this.size;
    }
    return params;
  }

  private sortColumn(column: ColumnDirective) {
    if (column.sortable) {
      const ascending = this.sortBy === column.property ? !this.sortAsc : true;
      this.sort(column.property, ascending);
      this.sortOrder.emit({ property: column.property, sort: ascending ? 'asc' : 'desc' })
    }
  }

  get columnCount() {
    let count = 0;
    count += this.indexColumnVisible ? 1 : 0;
    count += this.selectColumnVisible ? 1 : 0;
    count += this.expandColumnVisible ? 1 : 0;
    this.columns.toArray().forEach(column => {
      count += column.visible ? 1 : 0;
    });
    return count;
  }

  public getRowColor(item: any, index: number, row: DataTableRow) {
    // if (this.rowColors !== undefined) {
    //   return (<RowCallback>this.rowColors)(item, row, index);
    // }
    if (index % 2 == 0) {
      return 'hsl(0deg 0% 100%)'
    } else {
      return 'hsl(0deg 0 % 98 %)'
    }
  }

  get selectAllCheckbox() {
    return this._selectAllCheckbox;
  }

  set selectAllCheckbox(value) {
    this._selectAllCheckbox = value;
    this._onSelectAllChanged(value);
  }

  // all row selected
  private _onSelectAllChanged(value: boolean) {
    this.rows.toArray().forEach(row => row.selected = value);
  }

  // row selected with checkbox
  onRowSelectChanged(row: DataTableRow) {
    // maintain the selectedRow(s) view
    if (this.multiSelect) {
      const index = this.selectedRows.indexOf(row);
      if (row.selected && index < 0) {
        this.selectedRows.push(row);
      } else if (!row.selected && index >= 0) {
        this.selectedRows.splice(index, 1);
      }
    } else {
      if (row.selected) {
        this.selectedRow = row;
      } else if (this.selectedRow === row) {
        this.selectedRow = undefined;
      }
    }

    // unselect all other rows:
    if (row.selected && !this.multiSelect) {
      this.rows.toArray().filter(row_ => row_.selected).forEach(row_ => {
        if (row_ !== row) { // avoid endless loop
          row_.selected = false;
        }
      });
    }
    this.rowSelected.emit(this.selectedRows)
  }

  // other:

  get substituteItems() {
    return Array.from({ length: this.displayParams.size - this.items.length });
  }

  public resizeColumnStart(event: MouseEvent, column: ColumnDirective, columnElement: HTMLElement) {
    this._resizeInProgress = true;

    drag(event, {
      move: (moveEvent: MouseEvent, dx: number) => {
        if (this._isResizeInLimit(columnElement, dx)) {
          column.width = columnElement.offsetWidth + dx;
        }
      },
    });
  }

  private _isResizeInLimit(columnElement: HTMLElement, dx: number) {
    if ((dx < 0 && (columnElement.offsetWidth + dx) <= this.resizeLimit) ||
      !columnElement.nextElementSibling) {
      return false;
    }
    return true;
  }


  ngOnDestroy(): void {
    this.breakPointSub.unsubscribe();
  }
}
