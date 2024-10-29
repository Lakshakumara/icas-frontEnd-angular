import { Scheme, SchemeColumns } from '../../../Model/scheme';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Member } from 'src/app/Model/member';
import { ConfirmDialogComponent } from 'src/app/pop/confirm-dialog/confirm-dialog.component';
import { LoaderService } from 'src/app/service/loader.service';
import { SchemeService } from 'src/app/service/scheme.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-scheme-plan',
  templateUrl: './scheme-plan.component.html',
  styleUrls: ['./scheme-plan.component.css'],
})
export class SchemePlanComponent implements OnInit {
  member!: Member;
  displayedColumns: string[] = SchemeColumns.map((col) => col.key);
  columnsSchema: any = SchemeColumns;
  dataSource = new MatTableDataSource<Scheme>();
  valid: any = {};

  constructor(
    public dialog: MatDialog,
    private schemeService: SchemeService,
    private loader: LoaderService,
    private share: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loader.showLoader();
    this.member = this.share.getUser();
    if (this.member) {
      this.schemeService.getScheme().subscribe((res: any) => {
        this.dataSource.data = res;
      });
    } else this.router.navigate(['/signin']);
    this.loader.hideLoader();
  }

  editRow(row: Scheme) {
    if (row.id === 0) {
      console.log('adding ', row);
      this.schemeService.addScheme(row).subscribe((newScheme: Scheme) => {
        row.id = newScheme.id;
        row.isEdit = false;
      });
    } else {
      console.log('editiing ', row);
      this.schemeService
        .updateScheme(row)
        .subscribe(() => (row.isEdit = false));
    }
  }

  addRow() {
    this.loader.hideLoader();
    const newRow: Scheme = {
      isSelected: false,
      id: 0,
      idText: '',
      title: '',
      descriptionen: '',
      descriptionsi: '',
      descriptionta: '',
      amount: 0,
      unit: '',
      rate: 0,
      isEdit: true,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(id: number) {
    this.schemeService.deleteScheme(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (u: Scheme) => u.id !== id
      );
    });
  }

  removeSelectedRows() {
    const users = this.dataSource.data.filter((u: Scheme) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '40%',
        enterAnimationDuration: '1000ms',
        exitAnimationDuration: '1000ms',
        data: { massage: 'Access denied!' },
      })

      .afterClosed()
      .subscribe((confirm) => {
        /*if (confirm) {
          this.schemeService.deleteSchemes(schemes).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: Scheme) => !u.isSelected,
            )
          })
        }*/
      });
  }

  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false);
    }
    return false;
  }

  isAllSelected() {
    return this.dataSource.data.every((item) => item.isSelected);
  }

  isAnySelected() {
    return this.dataSource.data.some((item) => item.isSelected);
  }

  selectAll(event: any) {
    this.dataSource.data = this.dataSource.data.map((item) => ({
      ...item,
      isSelected: event.checked,
    }));
  }
}
