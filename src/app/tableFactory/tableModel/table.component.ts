import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import {
  TablePaginationSettingsModel,
  ColumnSettingsModel,
} from './table-settings.model';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';

@Component({
  selector: 'app-my-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  //@Input() dataSource: any;

  selectedRow!: any;

  /**
   * @description Column names for the table
   */
  columnNames: string[] = [];
  /**
   * @description enable selection of rows
   */
  @Input() enableCheckbox!: boolean;

  /**
   * @description Allowing/Dis-allowing multi-selection of rows
   */
  @Input() allowMultiSelect!: boolean;
  /**
   * @description `sqColumnDefinition` is additional configuration settings provided to `sq-table`.Refer [sqColumnDefinition].
   */
  @Input() sqColumnDefinition!: ColumnSettingsModel[];
  /**
   * @description `sqPaginationConfig` is additional configuration settings provided to `sq-table`.Refer [SqTablePaginationSettingsModel].
   */
  @Input() sqPaginationConfig?: TablePaginationSettingsModel;
  /**
   * @description Data which will be displayed in tabular format
   */
  @Input() rowData: any; //object[];
  /**
   * @description variable to store selection data
   */
  selection = new SelectionModel<{}>();
  /**
   * @description Local variable to convert JSON data object to MatTableDataSource
   */
  dataSource!: MatTableDataSource<{}>;
  /**
   * @description ViewChild to get the MatSort directive from DOM
   */
  @ViewChild(MatSort) sort!: MatSort;
  /**
   * @description ViewChild to get the MatPaginator directive from DOM
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  /**
   * @description Lifecycle hook that is called after a component's view has been fully initialized.
   */
  @Output() getSelectedRows = new EventEmitter();
  /**
   * @description enable Action of rows ie, edit, remove
   */
  @Input() enableRowAction!: boolean;

  @Output() rowAction = new EventEmitter();

  ngAfterViewInit() {
    this.dataSource.sort != this.sort;
    this.dataSource.paginator != this.paginator;
  }
  /**
   * @hidden
   */
  /**
   * Lifecycle hook that is called when any data-bound property of a datasource changes.
   */
  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.rowData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
      : this.dataSource.data.forEach((row: any) => this.selection.select(row));

    //this.myDataSource.data?.forEach(row => this.selection.select(row));
    this.getSelectedRows.emit(this.selection.selected);
  }
  /** Gets the selected rows array on row select. */
  rowSelect() {
    this.getSelectedRows.emit(this.selection.selected);
  }
  /**
   * @hidden
   */
  /**
   * Initialize the directive/component after Angular first displays the data-bound properties
   * and sets the directive/component's input properties
   */
  ngOnInit() {
    for (const column of this.sqColumnDefinition) {
      this.columnNames.push(column.name);
    }
    // Condition to add selection column to the table
    if (this.enableCheckbox) {
      this.columnNames.splice(0, 0, 'select');
      this.sqColumnDefinition.splice(0, 0, {
        name: 'select',
        displayName: '#',
      });
    }

    if (this.enableRowAction) {
      this.columnNames.push('action');
      this.sqColumnDefinition.push({
        name: 'action',
        displayName: '',
        disableSorting: true,
      });
    }
    console.log('this.allowMultiSelect ', this.allowMultiSelect);
    // Setting selection model
    this.selection = new SelectionModel<{}>(this.allowMultiSelect, []);
  }
  /** Highlights the selected row on row click. */
  highlight(row: any) {
    console.log('from table ', row);
    this.selectedRow = row;
  }
}
