import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinPipe } from './utils/min';
import { DataTablePagination } from './pagination.component';
import { Hide } from './utils/hide';
import { PixelConverter } from './utils/px';
import { DataTableRow } from './row.component';
import { DataTableComponent } from './table.component';
import { ColumnDirective } from './column.directive';
import { FormsModule } from '@angular/forms';

export * from './table.component';
export * from './column.directive';
export * from './row.component';
export * from './pagination.component';
export * from './pagination-button';
export * from './tools/data-table-resource';
export * from './utils/hide';
export * from './utils/min';
export * from './utils/px';
export * from './utils/break-points.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    DataTableComponent,
    ColumnDirective,
    DataTableRow,
    Hide,
    MinPipe,
    PixelConverter,
    DataTablePagination,
  ],
  exports: [
    DataTableComponent,
    ColumnDirective,
    DataTableRow,
    Hide,
    MinPipe,
    PixelConverter,
    DataTablePagination,
  ]
})
export class DataTableModule {
  static forRoot(): ModuleWithProviders<DataTableModule> {
    return {
      ngModule: DataTableModule,
      providers: []
    };
  }
}
