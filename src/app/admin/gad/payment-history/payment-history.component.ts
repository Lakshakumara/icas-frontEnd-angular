import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, tap } from 'rxjs';
import { Scheme } from 'src/app/Model/scheme';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit, AfterViewInit {

  @Input() member: any;
  claimCategory: string[] = [
    Constants.ALL,
    Constants.CATEGORY_OPD,
    Constants.CATEGORY_SHE,
  ];
  selectedCategory: string = Constants.CATEGORY_OPD;
  selectedScheme:Scheme [] = []
  dataSource!: LoadDataSource;
  totalLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private auth: AuthServiceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.dataSource = new LoadDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.changeDetectorRef.detectChanges();
    this.loadPaymentHistory();
    this.dataSource.loading$.subscribe((loading) => {
      if (!loading) {
        this.totalLength = this.dataSource.totalCount;
      }
    });

    /*this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadPaymentHistory()))
      .subscribe();*/
  }
  onNotifySelectedScheme(schemes: Scheme[]) {
    this.selectedScheme = schemes
  }
  loadPaymentHistory() {
    
  }
  search() {
    console.log("category ", this.selectedCategory)
    }

}
