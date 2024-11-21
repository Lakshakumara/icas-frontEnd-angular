import { Component, OnInit } from '@angular/core';
import {
  ColumnSettingsModel,
  TablePaginationSettingsModel,
} from 'src/app/tableFactory/tableModel/table-settings.model';
import { VoucherDataSource } from './voucher-dataSource';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { catchError, of } from 'rxjs';
import { Claim } from 'src/app/Model/claim';
import Swal from 'sweetalert2';
import { Constants } from 'src/app/util/constants';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
})
export class VoucherComponent implements OnInit {
  dataSource!: VoucherDataSource;
  voucherIds!: number[];
  selectedvoucherId!: number | undefined;
  columnDefinition: ColumnSettingsModel[] = [];

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

  tablePaginationSettings: TablePaginationSettingsModel = <
    TablePaginationSettingsModel
  >{};

  rowData!: Claim[];
  selectedClaims!: Claim[] | null;
  claimData!: any[] | null;
  selectedClaimData!: any | null;
  tobeUpdated!: any[] | null;

  onNotifySelected(selectedRows: Claim[]) {
    this.selectedClaimData = null;
    this.selectedClaims = selectedRows;
    console.log('selected Rows ', selectedRows);
    this.claimData = [];
    if (selectedRows.length === 1)
      selectedRows[selectedRows.length - 1].claimData.forEach((d: any) => {
        //console.log('d-> ', d);
        let status: string;
        if (d.claimDataStatus == 'Rejected')
          status = 'Rejected - ' + d.rejectRemarks;
        else if (d.claimDataStatus == 'Deducted')
          status = 'Deducted - Rs. ' + d.deductionAmount;
        else if (d.claimDataStatus == 'Approved')
          status = d.remarks == '' ? 'Approved ' : 'Approved - ' + d.remarks;
        else status = 'Other';
        //console.log(d.scheme);
        if (d.scheme != null)
          this.claimData?.push({
            id: d.id,
            title: d.scheme.title + '-' + d.scheme.idText,
            status: status,
            scheme: d.scheme,
          });
      });
  }

  cData(selectedRows: any) {
    this.selectedClaimData = selectedRows[0];
    //console.log('this.selectedClaimData ', this.selectedClaimData);
  }

  constructor(private auth: AuthServiceService) {
    this.tablePaginationSettings.enablePagination = true;
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
    ];
  }

  ngOnInit() {
    this.dataSource = new VoucherDataSource(this.auth);
    this.reload();
  }

  reload() {
    this.selectedvoucherId = undefined;
    this.selectedClaims = null;
    this.tobeUpdated = null;
    this.claimData = [];

    this.auth.getVouchers().then((r) => {
      this.voucherIds = r;
    });
    this.dataSource
      .requestAllData(Constants.CLAIMSTATUS_MEDICAL_DECISION_APPROVED)
      .subscribe((receiveData: any) => (this.rowData = receiveData.content));
  }

  setPaidAmount() {
    if (this.selectedClaims == null) return;
    if (this.selectedClaims.length >= 1) {
      console.log('more than One claim selected');
      return;
    }
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
          if (+value <= this.selectedClaims![0].requestAmount) {
            resolve('');
          } else {
            resolve(
              'Max is Request Amount Rs. ' +
                this.selectedClaims![0].requestAmount
            );
          }
        });
      },

      /* didOpen: (deductionAmount) => {
        const timer = Swal.getPopup()?.querySelector("b");
        timer!.textContent = `${deductionAmount}`;
      },*/

      preConfirm: async (deductionAmount) => {
        tobeUpdated.push({
          criteria: 'finalize',
          id: this.selectedClaims![0].id,
          deductionAmount: +deductionAmount,
          paidAmount: this.selectedClaims![0].requestAmount - deductionAmount,
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
          this.reload();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });

    /* const ipAPI = "//api.ipify.org?format=json";
 const { value: ipAddress } = Swal.fire({
   title: "Enter your IP address",
   input: "text",
   inputLabel: "Your IP address",
   inputValue,
   showCancelButton: true,
   inputValidator: (value) => {
     if (!value) {
       return "You need to write something!";
     }
   }
 });
 if (ipAddress) {
   Swal.fire(`Your IP address is ${ipAddress}`);
 }*/

    /*
        this.rowData?.forEach((c) => {
          if (this.selectedClaims?.includes(c))
            c.paidAmount = c.requestAmount - c.deductionAmount;
          else c.paidAmount = 0;
        });*/
  }

  voucherGenerate() {
    if (this.selectedClaims == undefined) return;
    this.tobeUpdated = [];
    let selected = this.selectedClaims.map((s) => {
      //console.log('s.paidAmount ', s.paidAmount);
      if (s.paidAmount === null) {
        //console.log('return  ', s.paidAmount === null);
        Constants.Toast.fire('Payment not set for the Claim ' + s.id + ' ');
        return;
      }
      this.tobeUpdated?.push({
        criteria: 'forwordfinance',
        id: s.id,
        financeSendDate: null,
        paidAmount: s.paidAmount,
        claimStatus: Constants.CLAIMSTATUS_FINANCE,
        voucherId: 0,
      });
      return s.empNo + '-' + s.paidAmount;
    });
    console.log('selected ', selected);
    Swal.fire({
      title: selected,
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Generate',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await this.auth.updateClaim_new(this.tobeUpdated);
        /*.subscribe((a) => {
          if (a >= 1) {
            this.selectedClaims = <Claim[]>{};
            this.reload();
            return Swal.showValidationMessage('Updated');
          } else return Swal.showValidationMessage('Not Updated Try againg');
        });
        return ret;*/
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Updated', '', 'success');
          this.selectedClaims = <Claim[]>{};
          this.reload();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }
  downloadVoucher() {
    console.log('this.selectedvoucherId ', this.selectedvoucherId);
    if (this.selectedvoucherId == undefined) {
      return;
    }
    Swal.fire({
      title: 'Download Voucher',
      icon: 'info',
      confirmButtonText: 'Download',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => false,
      preConfirm: async () => {
        try {
          let response: any = await this.auth.downloadVoucher(
            this.selectedvoucherId!
          );
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(
            new Blob(binaryData, { type: dataType })
          );
          downloadLink.setAttribute('download', 'voucher.pdf');
          document.body.appendChild(downloadLink);
          downloadLink.click();
        } catch (error) {
          Swal.showValidationMessage(` ${error} `);
        }
      },
    });
  }
  showVoucher() {
    Constants.Toast.fire('Under Construction');
  }
}
