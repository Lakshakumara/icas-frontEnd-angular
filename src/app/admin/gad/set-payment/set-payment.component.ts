import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, tap } from 'rxjs';
import { Claim_Data_Review } from 'src/app/Model/claim';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-payment',
  templateUrl: './set-payment.component.html',
  styleUrls: ['./set-payment.component.css']
})
export class SetPaymentComponent implements OnInit, AfterViewInit {
  @Input() selectedClaim!: any | null
  claimData!: any[] | null
  selectedClaimData!: any | null
  dataSource!: LoadDataSource
  totalLength = 0
  columnsSchema: any = Claim_Data_Review
  displayedColumn: string[] = this.columnsSchema.map((col: { key: any; }) => col.key)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cDataColumnDefinition = [
    {
      name: 'title',
      displayName: 'Title',
      disableSorting: true,
    },
    {
      name: 'status',
      displayName: 'Status',
      disableSorting: true,
    },
  ];
  tobeUpdated!: any[];
  formGroup = this.fb.group({
    requestAmount: this.fb.control(0),
    adjustAmount: this.fb.control(0),
    adjustRemarks: this.fb.control(''),
    paidAmount: this.fb.control(0, Validators.required),
    remarks: this.fb.control(''),
  });
  claimDataStatus!: string
  totalDeduction: number = 0
  netPayment: number = 0
  btnClaimUpdateEnable: boolean = false
  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef, private auth: AuthServiceService) {
    /*this.tablePaginationSettings.enablePagination = true;
    this.tablePaginationSettings.pageSize = 5;
    this.tablePaginationSettings.pageSizeOptions = [5, 10, 15];
    this.tablePaginationSettings.showFirstLastButtons = true;
    this.columnDefinition = [
      {
        name: 'empNo',
        displayName: 'Emp No',
        disableSorting: false,
      },
      {
        name: 'name',
        displayName: 'Employee Name',
        disableSorting: false,
      },
      {
        name: 'id',
        displayName: 'Claim Ref',
        disableSorting: false,
      },
      {
        name: 'category',
        displayName: 'Category',
        disableSorting: false,
      },
      {
        name: 'requestAmount',
        displayName: 'Request Amount',
        disableSorting: true,
      },
      {
        name: 'deductionAmount',
        displayName: 'Deduction Amount',
        disableSorting: true,
      },
      {
        name: 'paidAmount',
        displayName: 'Paid Amount',
        disableSorting: false,
      },
    ];*/
  }

  ngOnInit() {
    this.dataSource = new LoadDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.setupTableFeatures();
  }
  setupTableFeatures() {
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.changeDetectorRef.detectChanges();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadClaimData()))
      .subscribe();

    this.dataSource.loading$.subscribe((loading) => {
      if (!loading) {
        this.totalLength = this.dataSource.totalCount;
        if (this.dataSource.data) {
          this.dataSource.data.map((d: any) => {
            d.title = d.scheme.title
            if (d.paidAmount === null) {
              this.btnClaimUpdateEnable = true
            }
            this.totalDeduction += d.deductionAmount + d.adjustAmount
            this.netPayment += d.paidAmount
          })
        }
      }
    });
    this.loadClaimData();
  }

  loadClaimData(): void {
    this.dataSource.getClaimData(this.selectedClaim.id);
  }
  
  cData(selectedRow: any) {
    this.selectedClaimData = selectedRow
    this.formGroup.patchValue({
      requestAmount: selectedRow.requestAmount,
      adjustAmount: selectedRow.adjustAmount,
      adjustRemarks: selectedRow.adjustRemarks,
      paidAmount: selectedRow.paidAmount,
      remarks: selectedRow.remarks
    })
  }
  completeClaim() {
    if (this.selectedClaim == null) return;
    let tobeUpdated: any[] = [];
    let timerInterval;
    Swal.fire({
      title: `Confirm Update Claim ID ${this.selectedClaim.id}`,
      footer: `Paid Amount: <b>${this.netPayment}</b>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Complete',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        tobeUpdated.push({
          criteria: 'voucher',
          id: this.selectedClaim.id,
          deductionAmount: this.totalDeduction,
          paidAmount: this.netPayment,
          claimStatus: Constants.CLAIMSTATUS_VOUCHER,
        });
        console.log(tobeUpdated);
        return await this.auth.updateClaim_new(tobeUpdated);
      },
    }).then((result) => {
      console.log('result ', result);
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Updated', '', 'success');
          this.loadClaimData();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }

  updateClaimData() {
    let raNew = (this.formGroup.value.requestAmount) ? this.formGroup.value.requestAmount : 0
    let da = (this.selectedClaimData!.deductionAmount) ? this.selectedClaimData!.deductionAmount : 0
    let aa = (this.formGroup.value.adjustAmount) ? this.formGroup.value.adjustAmount : 0
    let ar = (this.formGroup.value.adjustRemarks) ? this.formGroup.value.adjustRemarks : ''
    let pa = (this.formGroup.value.paidAmount) ? this.formGroup.value.paidAmount : 0
    let tda = da + aa
    if (raNew == 0 ||  (raNew - tda) <0) {
      Constants.Toast.fire("Request Amount less than total Deduction")
      return;
    }
    if (aa > 0 && ar === '') {
      Constants.Toast.fire("Adjust Remarks is Required")
      return;
    }
    if (pa != raNew - tda) {
      Constants.Toast.fire(`Elligible Amount May be Rs. ${raNew - tda}`)
      return;
    }
    this.tobeUpdated = [];
    this.tobeUpdated.push({
      criteria: Constants.CRITERIA_CLAIMDATA_UPDATE,
      claimDataId: this.selectedClaimData!.id,
      requestAmount:raNew,
      adjustAmount: aa,
      adjustRemarks: ar,
      paidAmount: pa,
      remarks: this.formGroup.value.remarks,
    });

    console.log(this.tobeUpdated);
    Swal.fire({
      title: `Update the ${this.selectedClaimData.idText}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        return await this.auth.updateClaim_new(this.tobeUpdated);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Updated', '', 'success');
          this.formGroup.reset()
          this.loadClaimData();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }
}
/*
setPaidAmount() {
    if (this.selectedClaim == null) return;
    let tobeUpdated: any[] = [];
    let timerInterval;
    Swal.fire({
      title: 'Update Payment Amount',
      footer: 'Paid Amount <b></b>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
      input: 'number',
      inputLabel: 'Deduction Amount',

      allowOutsideClick: () => !Swal.isLoading(),
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (+value <= this.selectedClaim.requestAmount) {
            resolve('');
          } else {
            resolve(
              'Max is Request Amount Rs. ' +
              this.selectedClaim.requestAmount
            );
          }
        });
      },

      /* didOpen: (deductionAmount) => {
        const timer = Swal.getPopup()?.querySelector("b");
        timer!.textContent = `${deductionAmount}`;
      },*/

      /*preConfirm: async (deductionAmount) => {
        tobeUpdated.push({
          criteria: 'finalize',
          id: this.selectedClaim.id,
          deductionAmount: +deductionAmount,
          paidAmount: this.selectedClaim.requestAmount - deductionAmount,
          claimStatus: Constants.CLAIMSTATUS_PAID,
        });
        console.log(tobeUpdated);
        return await this.auth.updateClaim_new(tobeUpdated);
      },
    }).then((result) => {
      console.log('result ', result);
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Updated', '', 'success');
          //this.reload();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }
*/