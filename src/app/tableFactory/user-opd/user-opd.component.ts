import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Router } from '@angular/router';
import { Member } from 'src/app/Model/member';
import { Utils } from 'src/app/util/utils';
import { SharedService } from 'src/app/shared/shared.service';
import { Constants } from 'src/app/util/constants';
import { Claim } from 'src/app/Model/claim';
import { merge, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';

@Component({
  selector: 'app-user-opd',
  templateUrl: './user-opd.component.html',
  styleUrls: ['./user-opd.component.css'],
})
export class UserOPDComponent implements OnInit, AfterViewInit {
  isMobile: boolean = false;
  member!: Member;
  year: number = Utils.currentYear;
  claimCategory: string[] = [
    Constants.ALL,
    Constants.CATEGORY_OPD,
    Constants.CATEGORY_SHE,
  ];
  selectedCategory: string = Constants.ALL;
  claimStatus: any = [Constants.ALL, 'Pending', 'Paid'];
  selectedStatus: string = Constants.ALL;
  claim!: Claim;
  dataSource!: LoadDataSource;
  displayedColumns = [
    'id',
    'category',
    'requestFor',
    'claimDate',
    'claimStatus',
    'requestAmount',
    'paidAmount',
  ];
  totalLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ref:ChangeDetectorRef,
    private share: SharedService,
    private auth: AuthServiceService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 600;
    this.ref.detectChanges()
  }
  ngOnInit() {
    this.member = this.share.getUser();
    if (!this.member) this.router.navigate(['/signin']);
    else this.dataSource = new LoadDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.loadClaimPage();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadClaimPage()))
      .subscribe();
    this.dataSource.loading$.subscribe((loading) => {
      if (!loading) {
        this.totalLength = this.dataSource.totalCount;
      }
    });
  }

  loadClaimPage() {
    this.dataSource.loadClaims(
      this.selectedCategory === 'All' ? '' : this.selectedCategory,
      this.selectedStatus === 'All' ? '%' : this.selectedStatus,
      '',
      this.member.empNo,
      this.year,
    );
  }
  onRowClicked(claim: Claim) {
    console.log(claim);
  }

  search() {
    console.log('selectedStatus ', this.selectedStatus);
    console.log('year ', this.year);
    console.log('selectedCategory ', this.selectedCategory);
    this.loadClaimPage();
  }
  readableStatus(status: string) {
    let newstatus: string = ''
    /*0'All',
   1 'Pending',
    2'Head Approved',
    3'MEC',
    4'MEC Approved',
    5'Rejected',
    6'Finance',
    7'Paid',*/
    switch (status) {
      case Constants.CLAIMSTATUS_PENDING: newstatus = Constants.CLAIM_STATUS_VIEW[1]
        break
      case Constants.CLAIMSTATUS_HEAD_APPROVED: newstatus = Constants.CLAIM_STATUS_VIEW[2]
        break
      case Constants.CLAIMSTATUS_MEDICAL_DECISION_PENDING: newstatus = Constants.CLAIM_STATUS_VIEW[3]
        break
      case Constants.CLAIMSTATUS_MEDICAL_DECISION_APPROVED: newstatus = Constants.CLAIM_STATUS_VIEW[4]
        break
      case Constants.CLAIMSTATUS_REJECTED: newstatus = Constants.CLAIM_STATUS_VIEW[5]
        break
      case Constants.CLAIMSTATUS_FINANCE: newstatus = Constants.CLAIM_STATUS_VIEW[6]
        break
      case Constants.CLAIMSTATUS_PAID: newstatus = Constants.CLAIM_STATUS_VIEW[7]
        break
    }
    return newstatus
  }
}
