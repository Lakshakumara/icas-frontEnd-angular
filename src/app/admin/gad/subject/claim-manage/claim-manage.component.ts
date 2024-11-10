import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Router } from '@angular/router';
import { merge, tap } from 'rxjs';
import { Member } from 'src/app/Model/member';
import Swal from 'sweetalert2';
import { Claim, Claim_All } from 'src/app/Model/claim';
import { SharedService } from 'src/app/shared/shared.service';
import { ClaimDataSource } from 'src/app/admin/dep-head/claim-update/claim-dataSource';
import { Constants } from 'src/app/util/constants';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-claim-manage',
  templateUrl: './claim-manage.component.html',
  styleUrls: ['./claim-manage.component.css'],
})
export class ClaimManageComponent implements OnInit, AfterViewInit{
  status_Pending: string = new Constants().isHeadforClaim;
  status_reject: string = Constants.CLAIMSTATUS_REJECTED;
  status_finance: string = Constants.CLAIMSTATUS_FINANCE;
  status_mecApproved: string = Constants.CLAIMSTATUS_MEDICAL_DECISION_APPROVED;
  defaultFalse: boolean = false;
  loggeduser!: Member;
  search_year!: number;
  claim!: Claim;
  selectedClaim!: Claim | null;
  tobeUpdated!: any[];
  dataSource!: ClaimDataSource;
  displayedColumn: string[] = Claim_All.map((col) => col.key);
  columnsSchema: any = Claim_All;

  claimViewOptions: string[] = Constants.CLAIM_STATUS_VIEW;
  claimViewOptionSelected: string = 'All';
  search: any;

  totalLength = 0; // Add a total length variable to manage pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private auth: AuthServiceService,
    private share: SharedService,
    private router: Router
  ) {}
  formGroup = this.fb.group({
    rejected: this.fb.control(false, [Validators.required]),
    rejectremarks: this.fb.control(
      { value: '', disabled: true },
      Validators.required
    ),
  });

  onPageChange(page: number): void {
    this.loadClaimPage();
  }

  disableField(checked: any) {
    if (!checked) {
      this.formGroup.controls.rejectremarks.disable();
    } else {
      this.formGroup.controls.rejectremarks.enable();
    }
  }
  ngOnInit() {
    this.loggeduser = this.share.getUser();
    if (this.loggeduser == null) this.router.navigate(['/signin']);
    this.dataSource = new ClaimDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.loadClaimPage()
    this.dataSource.loading$.subscribe(loading => {
      if (!loading) {
        this.totalLength = this.dataSource.totalCount;
      }
    });

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadClaimPage()))
      .subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const val = filterValue.trim().toLowerCase();
    this.dataSource.requestData(this.getSelectedClaimStatus(), val, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  loadClaimPage() {
    this.selectedClaim = null;
    this.dataSource.requestData(this.getSelectedClaimStatus(),'', this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }
  getSelectedClaimStatus(): string {
    let sop: string = '';
    switch (this.claimViewOptionSelected) {
      case 'All':
        sop = Constants.CLAIMSTATUS_ALL;
        break;
      case 'Pending':
        sop = Constants.CLAIMSTATUS_PENDING;
        break;
      case 'Head Approved':
        sop = Constants.CLAIMSTATUS_HEAD_APPROVED;
        break;
      case 'MEC':
        sop = Constants.CLAIMSTATUS_MEDICAL_DECISION_PENDING;
        break;
      case 'MEC Approved':
        sop = Constants.CLAIMSTATUS_MEDICAL_DECISION_APPROVED;
        break;
      case 'Rejected':
        sop = Constants.CLAIMSTATUS_REJECTED;
        break;
      case 'Finance':
        sop = Constants.CLAIMSTATUS_FINANCE;
        break;
      case 'Paid':
        sop = Constants.CLAIMSTATUS_PAID;
        break;
    }
    return sop;
  }
  onRowClicked(claim: Claim) {
    this.formGroup.reset();
    this.selectedClaim = claim;
  }

  forwordMEC() {
    if (this.selectedClaim == null) return;
    this.tobeUpdated = [];
    this.tobeUpdated.push({
      criteria: 'forwordmec',
      id: this.selectedClaim!.id,
      claimStatus: Constants.CLAIMSTATUS_MEDICAL_DECISION_PENDING,
    });
    Swal.fire({
      title: 'Forward to Medical Board',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Forward',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await this.auth.updateClaim_new(this.tobeUpdated);
        /* .subscribe((a) => {
          if (a >= 1) {
            return Swal.showValidationMessage('Sent');
          } else return Swal.showValidationMessage('Not Updated Try againg');
        });
        return ret;*/
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Sent to Medical Board', '', 'success');
          this.loadClaimPage();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }
  forwordMVoucherPage() {
    this.router.navigate(['/admin/gad/subject/voucher']);
  }
  forwordPaid() {
    if (this.selectedClaim == null) return;
    this.tobeUpdated = [];
    this.tobeUpdated.push({
      criteria: 'forwordpaid',
      id: this.selectedClaim!.id,
      claimStatus: Constants.CLAIMSTATUS_PAID,
    });
    Swal.fire({
      title: 'Payment Complete',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Complete',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await this.auth.updateClaim_new(this.tobeUpdated);
        /* .subscribe((a) => {
          if (a >= 1) {
            return Swal.showValidationMessage('Mark as Paid');
          } else return Swal.showValidationMessage('Not Updated Try againg');
        });
        return ret;*/
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Mark as Paid', '', 'success');
          this.loadClaimPage();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }

  rejectClaim() {
    if (this.selectedClaim == null) return;
    this.tobeUpdated = [];
    this.tobeUpdated.push({
      criteria: 'claimreject',
      id: this.selectedClaim!.id,
      claimStatus: Constants.CLAIMSTATUS_REJECTED,
      rejectRemarks: this.formGroup.value.rejectremarks,
    });
    Swal.fire({
      title: 'Reject Claim No ' + this.selectedClaim!.id,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await this.auth.updateClaim_new(this.tobeUpdated);
        /*.subscribe((a) => {
          if (a >= 1) {
            return Swal.showValidationMessage('Rejection Success');
          } else return Swal.showValidationMessage('Not Updated Try againg');
        });*/
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Rejected', '', 'success');
          this.loadClaimPage();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }


}
