import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, merge, of, tap } from 'rxjs';
import { Claim_Data_Review, Claim_History } from 'src/app/Model/claim';
import { Scheme } from 'src/app/Model/scheme';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';

@Component({
  selector: 'app-payment-history',
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

  constructor(
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
    this.dataSource.getHistoryMain();
  }
  onCategoryChange(newCategory: string) {
    this.selectedCategory = newCategory;
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
          row.data = receiveData
        });
    }, 1000); // 1 second delay
  }

  getSchemeData(idText: string[]): any {
    console.log("expand loaded ", idText)
    //this.dataSource.getSchemeData(idText);
  }
}
