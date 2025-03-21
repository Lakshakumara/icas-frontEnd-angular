import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, merge, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Claim, Claim_Head_Accept } from 'src/app/Model/claim';
import { SharedService } from 'src/app/shared/shared.service';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-claim-update',
  templateUrl: './claim-update.component.html',
  styleUrls: ['./claim-update.component.css'],
})
export class ClaimUpdateComponent implements OnInit {
  loggeduser: any;
  claim!: Claim;
  selectedClaim!: Claim | null;

  dataSource!: LoadDataSource;
  displayedColumn: string[] = Claim_Head_Accept.map((col) => col.key);
  columnsSchema: any = Claim_Head_Accept;
  searchControl: FormControl = new FormControl();
  totalLength = 0; // Add a total length variable to manage pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private auth: AuthServiceService,
    private share: SharedService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loggeduser = this.share.getUser();
    if (this.loggeduser == null) this.router.navigate(['/signin']);
    this.dataSource = new LoadDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
    this.loadClaimPage();
    this.dataSource.loading$.subscribe((loading) => {
      if (!loading) {
        this.totalLength = this.dataSource.totalCount;
      }
    });
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadClaimPage()))
      .subscribe();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        distinctUntilChanged() // Only emit when value is different from previous value
      )
      .subscribe((value) => {
        //const filterValue = value.trim().toLowerCase();
        this.dataSource.filter = value.trim().toLowerCase();
        this.sort.active = 'member.name'
        this.dataSource.paginator!.firstPage();
        this.loadClaimPage();
      });
  }


  loadClaimPage(department: string = this.loggeduser.department, filter: string = '') {
    this.dataSource.getDepHeadClaims(department);
  }

  onRowClicked(claim: Claim) {
    this.selectedClaim = claim;
  }
  clearClaim() {
    this.selectedClaim = null
  }
  acceptClaim() {
    if (this.selectedClaim == null) return;
    let tobeUpdated: any = [];
    tobeUpdated.push({
      criteria: 'headaccept',
      id: this.selectedClaim.id,
      claimStatus: Constants.CLAIMSTATUS_HEAD_APPROVED,
      acceptedBy: this.loggeduser.id,
    });

    Swal.fire({
      title: 'Accept claim',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await this.auth.updateClaim_new(tobeUpdated);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Accepted', '', 'success');
          this.loadClaimPage();
        } else Swal.fire('Error', 'Failed to Accept', 'error');
      }
    });
  }
}
