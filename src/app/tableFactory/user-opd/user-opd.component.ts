import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserOPDDataSource } from './user-opd-datasource';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/app/Model/member';
import { Utils } from 'src/app/util/utils';
import { SharedService } from 'src/app/shared/shared.service';
import { Constants } from 'src/app/util/constants';
import { Claim } from 'src/app/Model/claim';
import { merge, tap } from 'rxjs';

@Component({
  selector: 'app-user-opd',
  templateUrl: './user-opd.component.html',
  styleUrls: ['./user-opd.component.css'],
})
export class UserOPDComponent implements OnInit, AfterViewInit {
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
  dataSource!: UserOPDDataSource;
  displayedColumns = [
    'id',
    'category',
    'requestFor',
    'claimDate',
    'claimStatus',
    'requestAmount',
  ];
  totalLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private share: SharedService,
    private auth: AuthServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.member = this.share.getUser();
    if (this.member == null) this.router.navigate(['/signin']);
    else this.dataSource = new UserOPDDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
      this.selectedCategory === 'All' ? '%' : this.selectedCategory,
      this.year,
      this.member.empNo,
      this.selectedStatus === 'All' ? '%' : this.selectedStatus,
      '',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
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
}
