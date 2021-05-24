import { Component, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { DataTableComponent } from './table.component';
import { Platform } from '@ionic/angular';

@Component({
  selector: '[dataTableRow]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class DataTableRow implements OnDestroy {

  @Input() item: any;
  @Input() index: number;
  _itemExpand = {};
  expanded: boolean;
  @ViewChild('myIdentifier')
  myIdentifier: ElementRef;

  // row selection:
  public rowSelected = false;
  private _selected: boolean;
  maxWidth: number = 300
  @Output() selectedChange = new EventEmitter();

  get selected() {
    return this._selected;
  }

  set selected(selected) {
    this._selected = selected;
    this.selectedChange.emit(selected);
  }

  get itemExpand() {
    const columns = this.dataTable.columns.filter(column => this.dataTable.columnVisibility(column));
    this._itemExpand = {};
    columns.forEach(value => {
      if (value.visible) {
        this._itemExpand[value.property] = this.item[value.property];
      }
    });
    return this._itemExpand;
  }

  // other:
  get displayIndex() {
    if (this.dataTable.pagination) {
      return this.dataTable.displayParams.page + this.index + 1;
    } else {
      return this.index + 1;
    }
  }

  getTooltip() {
    if (this.dataTable.rowTooltip) {
      return this.dataTable.rowTooltip(this.item, this, this.index);
    }
    return '';
  }

  constructor(@Inject(forwardRef(() => DataTableComponent)) public dataTable: DataTableComponent, private platform: Platform) {
    // on reload window size
    this.platform.ready().then(() => {
      if (this.platform.width() < 450 || this.platform.is('mobile') || this.platform.is('mobileweb') || this.platform.is('tablet') || this.platform.is('ipad')) {
        this.item.showActionMobile = true;
      } else {
        this.item.showActionMobile = false;
      }
    });

  }

  expand() {
    this.dataTable.collapseAllExpanded(this);
    this.expanded = !this.expanded;
  }

  ngOnDestroy() {
    this.selected = false;
  }

  actionSelected(type, row) {
    this.dataTable.actionSelect.emit({ type, row });
    this.item.filterFlag = false;
    this.item.showAction = false;
  }

  // get window size
  onResize(event) {
    event.target.innerWidth;
    setTimeout(() => {
      if (this.platform.width() < 450 || this.platform.is('mobile') || this.platform.is('mobileweb') || this.platform.is('tablet') || this.platform.is('ipad')) {
        this.item.showActionMobile = true;
      } else {
        this.item.showActionMobile = false;
      }
    }, 100);
  }

  public getThisElement(): DataTableRow {
    return this;
  }
}
