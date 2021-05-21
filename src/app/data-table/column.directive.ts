import {ContentChild, Directive, Input, OnInit} from '@angular/core';
import {CellCallback} from './types';
import {DataTableRow} from './row.component';

@Directive({
  selector: 'data-table-column'
})
export class ColumnDirective implements OnInit {

  // init:
  @Input() header: string;
  @Input() sortable = false;
  @Input() resizable = false;
  @Input() property: string;
  @Input() styleClass: string;
  @Input() cellColors: CellCallback;

  // init and state:
  @Input() width: number | string;
  @Input() visible = true;
  // breakpoints
  @Input() breakpoints: string;

  @ContentChild('dataTableCell') cellTemplate;
  @ContentChild('dataTableHeader') headerTemplate;
  @ContentChild('dataTableHeaderExtra') headerTemplateExtra;
  private styleClassObject = {}; // for [ngClass]
  getCellColor(row: DataTableRow, index: number) {
    if (this.cellColors !== undefined) {
      return (<CellCallback>this.cellColors)(row.item, row, this, index);
    }
  }

  ngOnInit() {
    this._initCellClass();
  }

  private _initCellClass() {
    if (!this.styleClass && this.property) {
      if (/^[a-zA-Z0-9_]+$/.test(this.property)) {
        this.styleClass = 'column-' + this.property;
      } else {
        this.styleClass = 'column-' + this.property.replace(/[^a-zA-Z0-9_]/g, '');
      }
    }

    if (this.styleClass != null) {
      this.styleClassObject = {
        [this.styleClass]: true
      };
    }
  }

}
