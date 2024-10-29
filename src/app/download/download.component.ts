import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Utils } from '../util/utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { Member } from '../Model/member';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
import { Constants } from '../util/constants';
import Swal from 'sweetalert2';
import { Claim } from '../Model/claim';
import { LoadDataSource } from '../util/LoadData';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  //dataSource!: LoadDataSource;
  member!: Member;
  selectedClaimId!: number;
  claimList!: Claim[];
  //@Input('app-scheme-plan') inData: any;
  @Output() sidenavClose = new EventEmitter();
  panelOpenState = false;
  appForm = new FormGroup({
    empNo: new FormControl('',[Validators.required]),
    year: new FormControl(0, [Validators.required]),
  });
  selectedYear: number = Utils.currentYear;
  constructor(
    private share: SharedService,
    private auth: AuthServiceService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.member = this.share.getUser();
    if (this.member != null) {
      this.appForm = new FormGroup({
        empNo: new FormControl(this.member.empNo, [Validators.required]),
        year: new FormControl(this.member.currentRegistration.year, [Validators.required]),
      });
    } else {
      this.router.navigate(['/signin']);
    }
    this.auth.getAllClaims("%,", 0, this.member.empNo, Constants.CLAIMSTATUS_PENDING)
      .subscribe((c) => { 
        this.claimList = c })

  }
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  downloadMembershipApplication() {
    if(this.appForm.value.year == null  || this.appForm.value.empNo == null)
    return;
    Constants.Toast.fire("Downloading...");
    this.auth
      .download(1, this.appForm.value.year, this.appForm.value.empNo)
      .subscribe((response: any) => {
        console.log(response.fileNme);
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        //let fname = response.get("file name").ToString();
        //console.log(fname);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        downloadLink.setAttribute('download', 'Application.pdf');
        document.body.appendChild(downloadLink);
        console.log(downloadLink);
        downloadLink.click();
      });
  }

  claimApplication() {
    if(this.selectedClaimId == undefined){
      return;
    }
     Swal.fire({
          title: 'Download Claim Application',
          icon: 'question',
          confirmButtonText: 'Download',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => false,
          preConfirm: async () => {
            try {
              let response: any = await this.auth.downloadClaim(this.selectedClaimId);
              let dataType = response.type;
              let binaryData = [];
              binaryData.push(response);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: dataType })
              );
              downloadLink.setAttribute('download', 'Claim form.pdf');
              document.body.appendChild(downloadLink);
              downloadLink.click();
            } catch (error) {
              Swal.showValidationMessage(` ${error} `);
            }
          },
        });
  }

  schemeRegulation() { 
    Constants.Toast.fire("Under Construction")
  }
}
