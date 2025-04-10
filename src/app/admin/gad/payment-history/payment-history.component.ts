import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { catchError, merge, of, tap } from 'rxjs';
import { Claim_History } from 'src/app/Model/claim';
import { Scheme } from 'src/app/Model/scheme';
import { ClaimDetailsDialogComponent } from 'src/app/pop/claim-details-dialog/claim-details-dialog.component';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';
import { ChipSelectorComponent } from "../../../util/my/chip-selector/chip-selector.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-payment-history',
  standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    MatProgressSpinnerModule,
    ChipSelectorComponent,
    MatSelect
],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PaymentHistoryComponent implements OnInit, AfterViewInit {


  @Input() member: any;
  claimCategory: string[] = [
    Constants.ALL,
    Constants.CATEGORY_OPD,
    Constants.CATEGORY_SHE,
  ];
  selectedCategory: string = Constants.ALL;
  selectedScheme: Scheme[] = []
  selectedMainItem: any;
  columnsSchema: any = Claim_History
  displayedColumns: string[] = this.columnsSchema.map((col: { key: any; }) => col.key)

  dataSource!: LoadDataSource;
  totalLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  expandedElement: any | null;

  constructor(private dialog: MatDialog,
    private auth: AuthServiceService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.dataSource = new LoadDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
    this.loadPaymentHistory();
    this.dataSource.loading$.subscribe((loading) => {
      if (!loading) {
        console.log("loaded ", this.dataSource.data)
        //this.totalLength = this.dataSource.totalCount;
      }
    });

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadPaymentHistory()))
      .subscribe();
  }
  onNotifySelectedScheme(schemes: Scheme[]) {
    this.selectedScheme = schemes
    this.cdr.detectChanges();
  }
  loadPaymentHistory() {
    this.dataSource.getHistoryMain(this.member.empNo);
  }
  onCategoryChange(event: string) {
    this.selectedCategory = event;
  }
  search() {
    console.log("category ", this.selectedCategory)
  }

  onRowClicked(row: any) {
    this.selectedMainItem = row;
    if (this.expandedElement === row) {
      this.expandedElement = null;
    } else {
      this.expandedElement = row;
      this.loadExpandedData(row);
    }
  }

  getTotalMaxAmount() {
    return 2000;//this.dataSource.data.map((t:any) => t.maxAmount).reduce((acc:any, value:any) => acc + value, 0);
  }

  getTotalPaidAmount() {
    return 1000;//this.dataSource.data.map((t:any) => t.paidAmount).reduce((acc:any, value:any) => acc + value, 0);
  }

  loadExpandedData(row: any) {
    console.log("row ", row)
    // Simulate a delay for lazy loading
    setTimeout(() => {
      this.auth.getClaimHistory(this.member.empNo, row.idText)
        .pipe(
          catchError(() => of([]))
        )
        .subscribe((receiveData: any) => {
          console.log("expand loaded receiveData ", receiveData)
          row.data = receiveData.content
        });
    }, 500); // 1 second delay
  }


  openClaimDetails(claimId: number, claimIds:any, event: MouseEvent): void {
    event.preventDefault();
    this.Openpopup(ClaimDetailsDialogComponent, claimId, claimIds)
    /*this.auth.getClaimNew(claimId).then(claim=>{
      console.log("received claim ",claim)
      this.Openpopup(ClaimDetailsDialogComponent, claim, claimId, claimIds)
    });*/
    
  }
  Openpopup(component: any, claimId:any, claimIds: any) {
    var _popup = this.dialog.open(component, {
      panelClass:  'custom-dialog-container',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      width: '400px',
      data: {
        claimId:claimId,
        claimIds:claimIds
      },
    });

    _popup.afterClosed().subscribe((item) => {
      console.log("Close it")
    });
  }


  getSchemeData(idText: string[]): any {
    console.log("expand loaded ", idText)
    //this.dataSource.getSchemeData(idText);
  }
}
