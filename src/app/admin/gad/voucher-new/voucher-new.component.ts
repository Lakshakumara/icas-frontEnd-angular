import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ColumnSettingsModel,
  TablePaginationSettingsModel,
} from 'src/app/tableFactory/tableModel/table-settings.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Claim } from 'src/app/Model/claim';
import Swal from 'sweetalert2';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';

@Component({
  selector: 'app-voucher-new',
  templateUrl: './voucher-new.component.html',
  styleUrls: ['./voucher-new.component.css']
})
export class VoucherNewComponent implements OnInit {
  dataSource!: LoadDataSource;
  //@Input() dVoucher:boolean =false
  @Output() getvoucherIds = new EventEmitter();
 // selectedvoucherId!: number | undefined;
  columnDefinition: ColumnSettingsModel[] = [];

  tablePaginationSettings: TablePaginationSettingsModel = <
    TablePaginationSettingsModel
  >{};

  rowData!: Claim[];
  selectedClaims!: Claim[] | null;
  tobeUpdated!: any[] | null;

  onNotifySelected(selectedRows: Claim[]) {
    this.selectedClaims = selectedRows;
    console.log('selected Rows ', selectedRows);
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
    this.dataSource = new LoadDataSource(this.auth);
    this.reload();
  }

  reload() {
    //this.selectedvoucherId = undefined;
    this.selectedClaims = null;
    this.tobeUpdated = null;

    this.auth.getVouchers().then((r) => {
      this.getvoucherIds.emit(r);
    });
    this.dataSource
      .loadClaims('',Constants.CLAIMSTATUS_VOUCHER)
      //.subscribe((receiveData: any) => (this.rowData = receiveData.content));

      this.dataSource.loading$.subscribe((loading) => {
        if (!loading) {
          if(this.dataSource.data) this.rowData = this.dataSource.data;
        }
      });
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
  public downloadVoucher(selectedvoucherId:number):void {
    console.log('this.selectedvoucherId ', selectedvoucherId);
    
    Swal.fire({
      title: 'Download Voucher',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Download',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => false,
      preConfirm: async () => {
        try {
          let response: any = await this.auth.downloadVoucher(
            selectedvoucherId
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
